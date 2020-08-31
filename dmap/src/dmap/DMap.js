import 'cesium/Widgets/widgets.css';
import './DMap.css';
import './control/css/DControl.css';
import { Version } from "./build/version";
import "jquery";
import Map from "ol/Map";
import View from 'ol/View.js';
import {defaults as defaultOlControls} from 'ol/control.js';
import { defaultDMapOptions, defaultDMapZommConfig, getZoomByHeight, defineBaseMapLayers} from "./default/default";
import {transform, transformExtent, registerProjection} from './utils/geom';
import DExtent from "./feature/DExtent";
import DEvent from "./event/DEvent";
import {DMapControlBar } from "./control/control";
import { DVectorLayer, DTileWMSLayer, DMap3DTileLayer } from './layer/layer';
const Cesium = require('cesium/Cesium');

class DMap {
  // 构造函数
  constructor(options) {
    let defaultParams = defaultDMapOptions;
    let use_options = {};
    //合并参数
    options = options||{};
    $.extend(use_options, defaultParams, options);
    $.extend(use_options.baselayerUrl, defaultParams.baselayerUrl, options.baselayerUrl);

    this.options = use_options;
    this.version = Version;

    this.style = use_options.style||"blue";//地图样式（'blue'||'light'）
    this.target = use_options.target || "map";//地图放置容器，DomID
    this.only2D = use_options.only2D;//是否只支持2D，默认true
    this.currentStatus = use_options.currentStatus || '2d';//当前地图模式状态('2d'||'3d')
    this.layers = [];//图层
    this.overlays = [];//覆盖物
    this.controls = [];//控件
    this.controlbarOptions = use_options.controlbarOptions||{};//控件配置
    this.zoom = use_options.zoom || 17;//显示层级，默认17
    this.minZoom = use_options.minZoom || 3;//显示层级，默认17
    this.maxZoom = use_options.maxZoom || 18;//显示层级，默认18
    this.center = use_options.center || [104.0653, 30.6597];//中心经纬度，默认[104.0653, 30.6597]
    this.projection = use_options.projection || 'EPSG:3857';
    this.baselayerUrl = use_options.baselayerUrl || {
      url: '//webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      // url: '//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      value: ['01', '02', '03', '04']
    };
    
    this.eventObj = new DEvent();

    //初始化地图
    this.init();
  }

  /**
   * 初始化地图
   */
  init() {
    //清空二维地图
    if (this.map2D) {
      this.map2D.setTarget(null);
      this.map2D = null;
    }

    //清空三维地图
    if (this.map3D) {
      this.map3D.destroy();
      this.map3D = null;
    }

    //2D模式只支持
    if (this.only2D && this.currentStatus == '3d') {
      console.log('该地图仅支持2d');
      this.currentStatus = '2d';
    }

    //默认
    $("#"+this.target).addClass("dmap-viewport");

    this.baseMapLayers = defineBaseMapLayers(this.baselayerUrl, this.minZoom, this.maxZoom);

    /**
     * 添加二维地图
     */
    if(true){
      //创建2D底图图层
      this.base2DVectorLayer = this.baseMapLayers.layer2D.vectorLayer;
  
      if(this.style == "blue"){
        this.base2DVectorLayer = this.baseMapLayers.layer2D.vectorDarkLayer;
      }

      registerProjection(this.projection);

      //转换经度的坐标系
      let view = new View({
        projection: this.projection,
        center: this.center,
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom
      });
  
      //初始化2D地图对象
      this.map2D = new Map({
        target: this.target,
        layers: [this.base2DVectorLayer],
        view: view,
        controls: defaultOlControls({
                    rotate: false,
                    zoom: false
                  })
      });
    }
    
    /**
     * 添加三维地图
     */
    if (!this.only2D) {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzIwZmMxZC1lMGQzLTRmOWMtYmFiNS0yMjIwMmVhYzVkYzkiLCJpZCI6NDkxMCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MjAxMjczMX0._-wzI2SrgF0s6FmKWV97mInajiOshMGzOTgUs-cuX-U';
      this.map3D = new Cesium.Viewer(this.target, {
        requestRenderMode: false, // 进入后台停止渲染
        // targetFrameRate: 30, // 帧率30，节约GPU资源
        fullscreenButton: true, //是否显示全屏按钮
        infoBox: false,//信息弹窗控件
        geocoder: false,//是否显示geocoder小器件，右上角查询按钮 
        scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        selectionIndicator: false,//是否显示默认的选中指示框
        baseLayerPicker: false,//是否显示图层选择器
        homeButton: false, //是否显示Home按钮
        sceneModePicker: false,//是否显示3D/2D选择器
        navigationHelpButton: false,//是否显示右上角的帮助按钮
        animation: false,//是否创建动画小器件，左下角仪表
        creditsDisplay: false,
        timeline: false,//是否显示时间轴
        fullscreenButton: false,//是否显示全屏按钮
        contextOptions: {
          id: "cesiumCanvas",
          webgl: {
            preserveDrawingBuffer: true
          }
        } ,
        imageryProvider:  this.baseMapLayers.layer3D.vectorLayer,
      });

      // 适度降低分辨率
      this.map3D._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
      this.map3D._cesiumWidget._forceResize = true;
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        var winDpr = window.devicePixelRatio;
        while (winDpr >= 2.0) {
          winDpr /= 2.0;
        }
        this.map3D.resolutionScale = winDpr;
      }

      this.base3DVectorLayer = this.map3D.imageryLayers.get(0);

      //关闭双击entity导致的视角固定
      this.map3D.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      
      //定位
      let center = transform(this.center, this.projection, "EPSG:4326");
      this.map3D.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], defaultDMapZommConfig[this.zoom] || 870),
        orientation: {
          heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
          pitch: Cesium.Math.toRadians(-90),    // default value (looking down)
          roll: 0.0                             // default value
        }
      });

      //风格
      if(this.style == "blue"){
        var tilemapLayer = this.base3DVectorLayer;
        tilemapLayer.brightness = 0.15;
        tilemapLayer.contrast = 1.45;
        tilemapLayer.hue = 2.4;
        tilemapLayer.saturation = 2;
        tilemapLayer.gamma = 0.6;
        this.map3D.scene.highDynamicRange = true;
      } else {
        this.map3D.scene.highDynamicRange = false;// 解决瓦片地图偏灰问题
      }
      
      this.map3D._cesiumWidget._creditContainer.style.display = "none";//去除版权信息
      this.map3D.scene.postProcessStages.fxaa.enabled = false;// 关闭快速近似抗锯齿
      this.map3D.scene.globe.enableLighting = false;//太阳光
      this.map3D.shadows = false;//阴影
      // this.map3D.scene.globe.showGroundAtmosphere = false;//大气层
      // this.map3D.scene.fog.enable = false;//雾
      // this.map3D.scene.sky.enable = false;//天空盒
      // this.map3D.scene.skyAtmosphere.show = false;//蓝天，以及地球四肢的光芒
      this.map3D.scene.globe.depthTestAgainstTerrain = false;//深度测试
      this.map3D.scene.debugShowFramesPerSecond = true; //FPS 帧率显示
      
      // 禁用放大缩小和自由旋转视图
      this.map3D.scene.screenSpaceCameraController.enableLook = false;//自由外观
      this.map3D.scene.screenSpaceCameraController.enableRotate = true;//旋转转换用户位置
      this.map3D.scene.screenSpaceCameraController.enableTilt = true;//倾斜相机
      this.map3D.scene.screenSpaceCameraController.enableTranslate = false;//在地图上平移
      this.map3D.scene.screenSpaceCameraController.enableZoom = true;//放大和缩小
    }
    
    //默认显示地图
    if (this.currentStatus == '2d') {
      $("#"+this.target+' .cesium-viewer').hide();
    } else {
      $("#"+this.target+' .ol-viewport').hide();
    }

    //绘制信息
    this.reflush();

    //绑定事件
    this.bindEvents();
  }

  
  /**
   * 重置窗口大小
   */
  resize(){
    if(this.map2D){
      this.map2D.updateSize()
    }

    if(this.map3D){
      this.map3D.resize()
    }
  }

  /**
   * 销毁
   */
  destroy(){
    //地图绘制信息
    this.clear();

    if (this.map2D) {
      this.map2D.dispose();
      this.map2D = null;
    }

    if (this.map3D) {
      this.map3D.destroy();
      this.map3D = null;
    }

    //清空事件绑定
    if(this.eventObj){
      this.eventObj.clear();
    }
  }

  /**
   * 清空
   */
  clear(){
    //删除控件
    for (let i = 0; i < this.controls.length; i++) {
      if(this.controls[i] &&  this.controls[i].destroy){
        this.controls[i].destroy();      
      }  
    }
    this.controls = [];

    if(this.controlbar){
      this.controlbar.destroy();
    }

    //删除图层
    for (let i = 0; i < this.layers.length; i++) {
      if(this.layers[i] &&  this.layers[i].clear){
        this.layers[i].clear();      
      }  
    }
    this.layers = [];

    //删除覆盖物
    for (let i = 0; i < this.overlays.length; i++) {
      if(this.overlays[i] &&  this.overlays[i].clear){
        this.overlays[i].clear();      
      }  
    }
    this.overlays = [];
  }

  /**
   * 刷新
   */
  reflush(){
    //添加覆盖物
    for (let i = 0; i < this.overlays.length; i++) {
      if(this.overlays[i] &&  this.overlays[i].render){
        this.overlays[i].setMap(this);      
      }  
    }
    
    //添加图层
    for (let i = 0; i < this.layers.length; i++) {
      if(this.layers[i] &&  this.layers[i].render){
        this.layers[i].setMap(this);      
      }  
    }

    //添加控件
    for (let i = 0; i < this.controls.length; i++) {
      if(this.controls[i] &&  this.controls[i].setMap){
        this.controls[i].setMap(this);      
      }  
    }

    //添加默认控件面板
    if(!this.controlbar){
      this.controlbar = new DMapControlBar(this, this.controlbarOptions);
    } else {
      this.controlbar.setMap(this);
      this.controlbar.setOptions(this.controlbarOptions);
    }
  }

  /**
   * 绑定地图事件
   */
  bindEvents() {
    var _this = this;
    if (_this.map2D) {
      _this.map2D.on("moveend", function () {
        let tempZoom = _this.zoom;
        if(_this.currentStatus == "2d") {
          _this.extent = getCurrentExtent();
          _this.center = _this.map2D.getView().getCenter();
          _this.center[2] = _this.extent.height;
          let zoom = _this.map2D.getView().getZoom();
          if(zoom < _this.minZoom){
            _this.zoom = _this.minZoom;
          } else if(zoom > _this.maxZoom){
            _this.zoom = _this.maxZoom;
          } else {
            _this.zoom = zoom;
          }
        }
        if(tempZoom != _this.zoom){
          _this.eventObj.emit("change:zoom", {zoom: _this.getZoom()});
        }
      });

      //渲染完成事件
      _this.map2D.on("rendercomplete",function(event){
        _this.eventObj.emit("rendercomplete");
      });

      //鼠标移动事件
      _this.map2D.on("pointermove",function(event){
        let coordinate = event.coordinate;
        let result = {coordinate:coordinate, pixel: event.pixel, features:[], eventType: "pointermove"};

        //图层事件触发
        for (let i = 0; i < _this.layers.length; i++) {
          const dlayer = _this.layers[i];
          if(dlayer instanceof DVectorLayer){//矢量图层
            if(dlayer.layer){
              _this.map2D.forEachFeatureAtPixel(event.pixel, function(feature,layer) {
                if(dlayer.layer == layer && feature.dfeature){
                  result.features.push(feature.dfeature);
                }
              });
              if(result.features.length >0){
                dlayer.eventObj.emit("pointermove", result);
                break;
              }
            }
          } else if(dlayer instanceof DTileWMSLayer){
            let state = dlayer.eventObj.emit("pointTouch", result);
            if(state) break;
          }
        }

        //地图事件
        _this.eventObj.emit("pointermove",result);
      });

      //鼠标单击事件
      _this.map2D.on("click",function(event){
        let coordinate = event.coordinate;
        let result = {coordinate:coordinate, pixel: event.pixel, features:[], eventType: "click"};

        //图层事件触发
        for (let i = 0; i < _this.layers.length; i++) {
          const dlayer = _this.layers[i];
          if(dlayer instanceof DVectorLayer){//矢量图层
            if(dlayer.layer){
              _this.map2D.forEachFeatureAtPixel(event.pixel, function(feature,layer) {
                if(dlayer.layer == layer && feature.dfeature){
                  result.features.push(feature.dfeature);
                }
              });

              if(result.features.length >0){
                dlayer.eventObj.emit("click", result);
                break;
              }
            }
          } else if(dlayer instanceof DTileWMSLayer){
            let state = dlayer.eventObj.emit("pointTouch", result);
            if(state) break;
          }
        }

        //地图事件
        _this.eventObj.emit("click",result);
      });
     
      //鼠标双击事件
      _this.map2D.on("dblclick",function(event){
        let coordinate = event.coordinate;
        let result = {coordinate:coordinate, pixel: event.pixel, features:[], eventType: "dblclick"};
       

        //图层事件触发
        for (let i = 0; i < _this.layers.length; i++) {
          const dlayer = _this.layers[i];
          if(dlayer instanceof DVectorLayer){//矢量图层
            if(dlayer.layer){
              _this.map2D.forEachFeatureAtPixel(event.pixel, function(feature,layer) {
                if(dlayer.layer == layer && feature.dfeature){
                  result.features.push(feature.dfeature);
                }
              });

              if(result.features.length >0){
                dlayer.eventObj.emit("dblclick", result);
                break;
              }
            }
          } else if(dlayer instanceof DTileWMSLayer){
            let state = dlayer.eventObj.emit("pointTouch", result);
            if(state) break;
          }
        }

        //地图事件
        _this.eventObj.emit("dblclick",result);
      });
    }

    //3d事件
    if (_this.map3D) {
      var viewer = _this.map3D;

      /* 三维球转动添加监听事件 */
      let isZoomMax=false,isZoomMin=false;
      this.map3D.scene.postRender.addEventListener(function(){
      // _this.map3D.camera.moveEnd.addEventListener(function(){
        let tempZoom = _this.zoom;
        if(_this.currentStatus == "3d") {
          // 打印中心点坐标、高度、当前范围坐标
          let center = getCenterPosition();
          _this.center = transform(center, "EPSG:4326", _this.projection);
          _this.extent = getCurrentExtent();
          let zoom = getZoomByHeight(_this.extent.height);
          if(zoom < _this.minZoom){
            _this.zoom = _this.minZoom;
            // _this.setCenterAndZoom(_this.center, _this.zoom);
            isZoomMin = true;
            _this.map3D.scene.screenSpaceCameraController.enableZoom = false;
          } else if(zoom > _this.maxZoom){
            _this.zoom = _this.maxZoom;
            // _this.setCenterAndZoom(_this.center, _this.zoom);
            isZoomMax = true;
            _this.map3D.scene.screenSpaceCameraController.enableZoom = false;
          } else {
            _this.zoom = zoom;
            isZoomMax=false;
            isZoomMin=false;
            _this.map3D.scene.screenSpaceCameraController.enableZoom = true;
          }
        }
        if(tempZoom != _this.zoom){
          _this.eventObj.emit("change:zoom", {zoom: _this.getZoom()});
        }
      });

      _this.map3D.scene.renderError.addEventListener(function(){
        console.log("渲染异常抛出");
        if(window.confirm('渲染异常,是否重新加载？')){
            _this.init();
            return true;
        }else{
            return false;
        }
      });

      //场景渲染事件
      _this.map3D.scene.postRender.addEventListener(function(){
        _this.eventObj.emit("rendercomplete");
      });
      
      /*鼠标事件*/
      let event3d = new Cesium.ScreenSpaceEventHandler(_this.map3D.scene.canvas);
      let mousePosition,startMousePosition;

      //限制地图偏移角度
      _this.map3D.clock.onTick.addEventListener(function () {        
        if(_this.map3D.camera.pitch > Cesium.Math.toRadians(-30)){
          _this.map3D.scene.screenSpaceCameraController.enableTilt = false;
        }
      });

      //鼠标轮滚按下事件
      event3d.setInputAction(function(movement) { 
            mousePosition=startMousePosition= Cesium.Cartesian3.clone(movement.position);
      }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

      //鼠标移动事件
      let moveTimeLen = 50;//鼠标移动时间差
      let moveStartTime = (new Date()).getTime();
      event3d.setInputAction(function(evt){
        let pixel = evt.endPosition;
        if(startMousePosition){
          mousePosition = pixel;
          var y = mousePosition.y - startMousePosition.y;
          if(y>0){
              _this.map3D.scene.screenSpaceCameraController.enableTilt = true;
          }
        }
        
        //事件触发
        let moveEndTime = (new Date()).getTime();
        if(moveEndTime - moveStartTime > moveTimeLen){
          moveStartTime = moveEndTime;
          let coordinate = getCenterByScreenPoint(pixel, _this.map3D);
          if(coordinate){
            coordinate = transform(coordinate, "EPSG:4326", _this.projection);
            let result = {coordinate:coordinate, pixel: pixel, features:[], eventType: "pointermove"};
            let pickedFeature = _this.map3D.scene.pick(pixel);
            result.pickedFeature = pickedFeature;
            _this.eventObj.emit("pointermove", result);

            //图层事件触发
            if (Cesium.defined(pickedFeature)) {
              for (let i = 0; i < _this.layers.length; i++) {
                const dlayer = _this.layers[i];
                if(dlayer instanceof DVectorLayer){//矢量图层
                  if (pickedFeature.id && pickedFeature.id.dfeature) {
                    let entity =  pickedFeature.id;
                    
                    if(dlayer.dataSource.entities.contains(entity)){
                      let dfeature = entity.dfeature;
                      result.entity = entity;
                      result.features.push(dfeature);
                      dlayer.eventObj.emit("pointermove", result);
                      break;
                    }
                  }
                } else if(dlayer instanceof DTileWMSLayer){
                  let state = dlayer.eventObj.emit("pointTouch", result);
                  if(state) break;
                }
              }
            }

            //地图事件
            _this.eventObj.emit("pointermove",result);
          }
        };
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      //鼠标单击事件
      event3d.setInputAction(function(evt){
        let pixel = evt.position;
        let coordinate = getCenterByScreenPoint(pixel, _this.map3D);
        if(coordinate){
          coordinate = transform(coordinate, "EPSG:4326", _this.projection);
          let result = {coordinate:coordinate, pixel: pixel, features:[], eventType: "click"};
          let pickedFeature = _this.map3D.scene.pick(pixel);
          result.pickedFeature = pickedFeature;
          
          //图层事件触发
          if (Cesium.defined(pickedFeature)) {
            for (let i = 0; i < _this.layers.length; i++) {
              const dlayer = _this.layers[i];
              if(dlayer instanceof DVectorLayer){//矢量图层
                if (pickedFeature.id && pickedFeature.id.dfeature) {
                  let entity =  pickedFeature.id;
                  if(dlayer.dataSource.entities.contains(entity)){
                    let dfeature = entity.dfeature;
                    result.entity = entity;
                    result.features.push(dfeature);
                    dlayer.eventObj.emit("click", result);
                    break;
                  }
                }
              } else if(dlayer instanceof DTileWMSLayer){
                let state = dlayer.eventObj.emit("pointTouch", result);
                if(state) break;
              } else if(dlayer instanceof DMap3DTileLayer){
                dlayer.eventObj.emit("click", result);
              }
            }
          }
          //地图事件
          _this.eventObj.emit("click",result);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
      //鼠标双击事件
      event3d.setInputAction(function(evt){
        let pixel = evt.position;
        let coordinate = getCenterByScreenPoint(pixel, _this.map3D);
        if(coordinate){
          coordinate = transform(coordinate, "EPSG:4326", _this.projection);
          
          let result = {coordinate:coordinate, pixel: pixel, features:[], eventType: "dblclick"};
          let pickedFeature = _this.map3D.scene.pick(pixel);
          result.pickedFeature = pickedFeature;

          //图层事件触发
          if (Cesium.defined(pickedFeature)) {
            for (let i = 0; i < _this.layers.length; i++) {
              const dlayer = _this.layers[i];
              if(dlayer instanceof DVectorLayer){//矢量图层
                if (pickedFeature.id && pickedFeature.id.dfeature) {
                  let entity =  pickedFeature.id;
                  if(dlayer.dataSource.entities.contains(entity)){
                    let dfeature = entity.dfeature;
                    result.entity = entity;
                    result.features.push(dfeature);
                    dlayer.eventObj.emit("dblclick", result);
                    break;
                  }
                }
              } else if(dlayer instanceof DTileWMSLayer){
                let state = dlayer.eventObj.emit("pointTouch", result);
                if(state) break;
              }
            }
          }
          
          //地图事件
          _this.eventObj.emit("dblclick",result);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      
      //鼠标轮滚滚动事件
      event3d.setInputAction(function(evt){
        if(evt > 0 && isZoomMin){
          _this.map3D.scene.screenSpaceCameraController.enableZoom = true;
        }
        if(evt < 0 && isZoomMax){
          _this.map3D.scene.screenSpaceCameraController.enableZoom = true;
        }
      }, Cesium.ScreenSpaceEventType.WHEEL);

      /* 从屏幕坐标获取坐标 */
      function getCenterByScreenPoint(position, viewer){
        let cartesian3 = viewer.scene.globe.pick(viewer.camera.getPickRay(position),viewer.scene);
        if(cartesian3){
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);

            let coordinate = [lng, lat];
            coordinate[0] = Number(coordinate[0]);
            coordinate[1] = Number(coordinate[1]);
            return coordinate;
        }
      }

      /* 获取camera中心点坐标 */
      function getCenterPosition() {
        var result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas
          .clientHeight / 2));
        var center = _this.center;

        if(result){
          var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
          var lon = curPosition.longitude * 180 / Math.PI;
          var lat = curPosition.latitude * 180 / Math.PI;
          var height = getHeight();
          center = [lon, lat, height];
        } else {
          console.warn("计算中心坐标异常");
          console.log(center);

        }
        return center;
      }

      /* 获取camera高度  */
      function getHeight() {
        if (viewer) {
          var scene = viewer.scene;
          var ellipsoid = scene.globe.ellipsoid;
          var height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;

          return height;
        }
      }
    }

    /**
     * 获取当前范围
     */
    function getCurrentExtent() {
      let extent;
      if(_this.currentStatus == "2d" && _this.map2D){
        let zoom = _this.map2D.getView().getZoom();
        let height = defaultDMapZommConfig[parseInt(zoom)]||870;
        let extent1 = [];
        extent1 = _this.map2D.getView().calculateExtent();
        extent = new DExtent(extent1, _this.projection, height);
      } else  if(_this.currentStatus == "3d" && _this.map3D){
        let height = Math.ceil(_this.map3D.camera.positionCartographic.height)||870;
        let extent1 = [];
        let rect = _this.map3D.camera.computeViewRectangle();
        if(rect){
          extent1[0] = Number(Cesium.Math.toDegrees(rect.east).toFixed(10));
          extent1[1] = Number(Cesium.Math.toDegrees(rect.north).toFixed(10));
          extent1[2] = Number(Cesium.Math.toDegrees(rect.west).toFixed(10));
          extent1[3] = Number(Cesium.Math.toDegrees(rect.south).toFixed(10));
          extent1 = transformExtent(extent1, "EPSG:4326", _this.projection);
        } else {
          extent1 = _this.extent;
        }
        extent = new DExtent(extent1, _this.projection,height);
      }
      
      return extent;
    }
  }

  /**
   * 重新定义控制面板
   * @param {*} options 
   */
  setControlbarOptions(options) {
    options = options || {};
    this.controlbarOptions = $.extend(this.controlbarOptions, options);
    if(!this.controlbar){
      this.controlbar = new DMapControlBar(this, this.controlbarOptions);
    } else {
      this.controlbar.setOptions(this.controlbarOptions);
    }
  }


  /**
   * 设置是否只支持2D
   * @param boolean only2D 
   */
  setOnly2D(only2D) {
    this.only2D = only2D;
    this.init();
  }

  /**
   * 切换地图模式
   * @param string currentStatus 
   */
  show(currentStatus) {
    if (this.currentStatus == currentStatus) {
      return;
    } else if (currentStatus == '3d') {
      if (this.only2D) {
        console.log('该地图仅支持2d');
        return;
      } else {
        this.currentStatus = currentStatus;
        $("#"+this.target+' .cesium-viewer').show();
        $("#"+this.target+' .ol-viewport').hide();
        this.map3D.camera.setView({
          orientation: {
              heading : -this.map2D.getView().getRotation(), // east, default value is 0.0 (north)
              pitch : this.map3D.camera.pitch,    // default value (looking down)
              roll : this.map3D.camera.roll                             // default value
          }
        });
      }
    } else if (currentStatus == '2d') {
      this.currentStatus = currentStatus;
     
      $("#"+this.target+' .cesium-viewer').hide();
      $("#"+this.target+' .ol-viewport').show();
      this.map2D.getView().setRotation(-this.map3D.camera.heading);
    } else {
      console.log('设置的显示的地图状态不合法（2d|3d）');
      return;
    }
    
    if (this.currentStatus == '2d') {
      if (this.extent) {
        this.map2D.getView().fit(this.extent.getGeometry(), {
          size: this.map2D.getSize(),
          nearest: true,
          constrainResolution: false
        });
      } else {
        this.setCenterAndZoom(this.center, this.zoom);
      }
    } else if (this.currentStatus == '3d') {
      var extent;
      if (this.map2D) {
        extent = this.map2D.getView().calculateExtent(this.map2D.getSize());
        extent = transformExtent(extent, this.projection,"EPSG:4326");
      }

      if (extent) {
        this.map3D.camera.setView({
          destination: Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]),
          //镜头摆正
          orientation: {
            heading: this.map3D.camera.heading, 
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0                          
          }
        });
      } else {
        this.setCenterAndZoom(this.center, this.zoom);
      }

      //重新渲染
      if(this.currentStatus == "3d"){
        this.map3D.scene.requestRender();
      }
    } else {
      console.log('DMap currentStatus is error!');
    }

    this.eventObj.emit("change:mode", {currentStatus: this.currentStatus});
    //绘制信息
    this.reflush();
  }

  /**
   * 设置中心经纬度
   * @param Array center 
   */
  setCenter(center){
    this.setCenterAndZoom(center, this.zoom);
  }

  /**
   * 获取中心经纬度
   */
  getCenter(){
    return this.center;
  }

  /**
   * 设置缩放比例
   * @param {*} zoom 
   */
  setZoom(zoom) {
    this.setCenterAndZoom(this.center, zoom);
  }

  /**
   * 获取缩放比例
   */
  getZoom(){
    return this.zoom;
  }

  /**
   * 设置地图中心经纬度和缩放比例
   * @param {*} center 
   * @param {*} zoom 
   */
  setCenterAndZoom(center, zoom) {
    zoom = zoom||this.zoom;
    center = center ||  this.center;

    zoom = Number(zoom);
    center[0] = Number(center[0]);
    center[1] = Number(center[1]);

    zoom = zoom || this.zoom;
    if(zoom < this.minZoom){
      zoom = this.minZoom;
    } else if(zoom > this.maxZoom){
      zoom = this.maxZoom;
    }

    if (this.currentStatus == '2d' &&  this.map2D) {
      let view = this.map2D.getView();
      view.setCenter(center);
      view.setZoom(zoom);
    } else if (this.currentStatus == '3d' &&  this.map3D) {
      let height =  defaultDMapZommConfig[zoom];
      center[0] = Number(center[0]);
      center[1] = Number(center[1]);
      height = Number(height);
      if(!isNaN(center[0]) && !isNaN(center[1] && !isNaN(height))){
        center =  transform(center, this.projection, "EPSG:4326");
        center =  Cesium.Cartesian3.fromDegrees(center[0], center[1], height);
        this.map3D.camera.flyTo({
          destination: center,
          duration: 0.2,
          orientation: {
            heading: this.map3D.camera.heading, // east, default value is 0.0 (north)
            pitch: this.map3D.camera.pitch,    // default value (looking down)
            roll: this.map3D.camera.roll                          // default value
  
            // heading: this.map3D.camera.heading, 
            // pitch: Cesium.Math.toRadians(-90),
            // roll: 0.0   
          }
        });
      }
    } else {
      console.log('DMap currentStatus is error!');
    }
  }

  /**
   * 设置底图
   */
  setBaselayerUrl(baselayerUrl) {
    this.baselayerUrl = baselayerUrl;
    this.init();
  }

  /**
   * 设置坐标系
   * @param String projection 
   */
  setProjection(projection){
    this.center = transform(this.center, this.projection, projection);
    this.projection = projection;
    this.init();
  }

  /**
   * 按范围调整视角
   */
  viewExtent(extent){
    if (this.currentStatus == '2d' && this.map2D) {
      let extent2d = extent.getExpendExtentBound(this.projection);
      this.map2D.getView().fit(extent2d, {
          maxZoom: this.maxZoom,
          size: this.map2D.getSize(),
          nearest: true,
          constrainResolution: false
        });
    } else if (this.currentStatus == '3d' && this.map3D) {
      let extent3d = extent.getExpendExtentBound("EPSG:4326");
      this.map3D.camera.flyTo({
        destination: Cesium.Rectangle.fromDegrees(extent3d[0], extent3d[1], extent3d[2], extent3d[3]),
        //镜头30度倾斜
        orientation: {
          heading: this.map3D.camera.heading, 
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0                          
        }
      });
    }
  }

 /**
   * 添加图层
   * @param DLayer layer 
   */
  addLayer(layer) {
    this.layers.push(layer);
    this.updateSortOfLayers();//更新图层顺序
    layer.setMap(this);
    this.eventObj.emit("change:layer", {currentStatus: this.currentStatus});
  }

  /**
   * 删除图层
   * @param DLayer layer 
   */
  removeLayer(layer) {
    var i = -1;
    //如果参数类型为字符串则表示图层名，否则按图层处理
    if (typeof (layer) == 'string') {
      for (let k = 0; k < this.layers.length; k++) {
        if (layer == this.layers[k].id) {
          this.layers[k].clear();
          i = k;
          break;
        }
      }
    } else {
      for (let k = 0; k < this.layers.length; k++) {
        if (layer == this.layers[k]) {
          this.layers[k].clear();
          i = k;
          break;
        }
      }
    }
    if (i > -1) {
      this.layers.splice(i, 1);
    }

    this.eventObj.emit("change:layer", {currentStatus: this.currentStatus});
  }

   /**
   * 更新图层排序
   */
  updateSortOfLayers(){
    var _this = this;

    //排序(冒泡)
    for (let i = 0; i < _this.layers.length; i++) {
        for (var j=0;j<_this.layers.length-1-i;j++) {
            let isSwitch = false;
            if(_this.layers[j].index != undefined || _this.layers[j+1].index != undefined){
                //叠加顺序大的排后面
                if(_this.layers[j].index != undefined && _this.layers[j+1].index != undefined){
                    if(_this.layers[j].index < _this.layers[j+1].index){
                        isSwitch = true;
                    }
                } 
                //叠加顺序未定义的排后面
                else if(_this.layers[j].index == undefined){
                    isSwitch = true;
                }
            } else { //叠加顺序未定义则按照加载顺序排列
                isSwitch = true;
            }
            
            if(isSwitch){
                var temp = _this.layers[j];
                _this.layers[j] = _this.layers[j+1];
                _this.layers[j+1] = temp;
            }
        }
    }
  }

  /**
   * 添加覆盖物
   * @param DOverlay overlay 
   */
  addOverlay(overlay) {
    this.overlays.push(overlay);
    overlay.setMap(this);
  }

  /**
   * 删除覆盖物
   * @param DOverlay overlay 
   */
  removeOverlay(overlay) {
    var i = -1;
    //如果参数类型为字符串则表示编号，否则按图层处理
    if (typeof (overlay) == 'string') {
      for (let k = 0; k < this.overlays.length; k++) {
        if (overlay == this.overlays[k].id) {
          this.overlays[k].clear();
          i = k;
          break;
        }
      }
    } else {
      for (let k = 0; k < this.overlays.length; k++) {
          if (overlay == this.overlays[k]) {
          this.overlays[k].clear();
          i = k;
          break;
        }
      }
    }
    if (i > -1) {
      this.overlays.splice(i, 1);
    }
  }

  /**
   * 添加控件
   * @param DControl control 
   */
  addControl(control) {
    this.controls.push(control);
    control.setMap(this);
  }

  /**
   * 删除控件
   * @param DControl control 
   */
  removeControl(control) {
    var i = -1;
    //如果参数类型为字符串则表示编号，否则按图层处理
    if (typeof (control) == 'string') {
      for (let k = 0; k < this.controls.length; k++) {
        if (control == this.controls[k].id) {
          this.controls[k].destroy();
          i = k;
          break;
        }
      }
    } else {
      for (let k = 0; k < this.controls.length; k++) {
        if (control == this.controls[k]) {
          this.controls[k].destroy();
          i = k;
          break;
        }
      }
    }
    if (i > -1) {
      this.controls.splice(i, 1);
    }
  }

    /**
   * 绑定事件
   * @param string key 
   * @param function func 
   */
  on(key, func){
    let code = 0;
    switch (key) {
      case "click":
        code = this.eventObj.on(key,func);
        break;
      case "dblclick":
        code = this.eventObj.on(key,func);
        break;
      case "pointermove":
        code =  this.eventObj.on(key,func);
        break;
      case "rendercomplete":
        code =  this.eventObj.on(key,func);
        break;
      case "change:zoom":
        code =  this.eventObj.on(key,func);
        break;
      case "change:mode":
        code =  this.eventObj.on(key,func);
        break;
      case "change:layer":
        code =  this.eventObj.on(key,func);
        break;
      default:
        console.error("Event type of "+key+" undefined!");
        break;
    }

    return code;
  }

  /**
   * 根据编号取消事件
   * @param {*} code 
   */
  unByCode(code){
    this.eventObj.unByCode(code);
  }
}

export default DMap;