import DBaseControl from "./DBaseControl";
const Cesium = require('cesium/Cesium');
import Map from "ol/Map";
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image';
import Raster from 'ol/source/Raster';
import XYZ from 'ol/source/XYZ.js';
import View from 'ol/View.js';
import {transform} from "./../utils/geom";
import {defaults as defaultOlControls} from 'ol/control.js';
import Feature from 'ol/Feature.js';
import Polygon from 'ol/geom/Polygon';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import {unByKey} from 'ol/Observable';
import {defaultDMapZommConfig} from "./../default/default"
import {MapOverviewSvg}  from  "./DControlSvg";
import {Drag} from "./../plugin/ol/Drag";
import {defaults as defaultInteractions, DragPan} from 'ol/interaction.js';

/**
 * 鹰眼控件
 */
export default class DOverviewControl extends DBaseControl{
    constructor(options) {

        let use_options = {
            on2D: true,
            on3D: true,
            isShowControl: false,
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;
        this.target = use_options.target;
        this.isShowControl = use_options.isShowControl;
        this.mapClear;

        this.create();
    }

    /**
     * 创建
     */
    create(){
        let _this = this;
        
        this.destroy();

        if(_this.map){
            let overview;
            let root = _this.target;
            let classPosition = " dmap-control-left";
            if(!root){
                classPosition = " dmap-control-absolute"
                root = document.getElementById(_this.map.target);
            }
            _this.element = document.createElement("div");
            _this.element.className = "dmap-control dmap-overview"+classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = "鹰眼";
            btnElement.innerHTML = MapOverviewSvg;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);

            //创建鹰眼面板
            let overviewId = "dmap-overview-"+(new Date()).getTime();
            _this.content = document.createElement("div");
            _this.content.className = "dmap-control dmap-overview-content";
            _this.content.style.display = _this.isShowControl?"block":"none";
            _this.content.id = overviewId;
            document.getElementById(_this.map.target).appendChild(_this.content);

            createOverView();
            btnElement.onclick = function(){
                if(_this.content.style.display == "none"){
                    _this.content.style.display = "block";
                    _this.isShowControl = true;
                    if(overview){
                        overview.updateSize();
                    }
                } else {
                    _this.content.style.display = "none";
                    _this.isShowControl = false;
                }
            }

            _this.show(_this.on2D, _this.on3D);
            _this.eventCode = _this.map.on("change:mode",function(evt){
                _this.show(_this.on2D, _this.on3D);
                createOverView();
            }); 

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(_this.eventCode);
                }
            }

             //添加鹰眼
            function createOverView(){
                //添加鹰眼
                let zoomNum = 4;
                
                let fillColor = "rgba(255,255,255,0.2)";
                let strokeColor = "#FFFFFF";
                
                //创建二维鹰眼
                if(_this.map.currentStatus == "2d" && _this.map.map2D && _this.on2D){
                    let map = _this.map.map2D;
                    //创建2D底图图层
                    let baselayerUrls = [];
                    for (var k in _this.map.baselayerUrl.value) {
                        baselayerUrls.push(_this.map.baselayerUrl.url.replace('{s}', _this.map.baselayerUrl.value[k]));
                    }
                    
                    let baseLayer = new TileLayer({
                        source: new XYZ({
                            urls: baselayerUrls
                        })
                    });
    
                    if(_this.map.style == "blue"){
                        let xyz = new XYZ({
                            urls: baselayerUrls,
                            crossOrigin: 'anonymous',
                            transition: 0
                        });
                       
                        let raster = new Raster({
                            sources: [xyz],
                            operationType: 'pixel',
                            operation: function (pixels, data) {
                                var pixel = pixels[0];
                                pixel[0] = 10;
                                pixel[1] = 255 - pixel[1];
                                pixel[2] = 255 - pixel[2] + 20;
                                return pixel;
                            }
                        });
                        
                        baseLayer = new ImageLayer({
                            source: raster
                        });
                    }
                    
                    //转换经度的坐标系
                    let center = transform(_this.map.center, "EPSG:4326", _this.map.projection);
                    let zoom = map.getView().getZoom() - zoomNum;
                    if(zoom < _this.map.minZoom){
                        zoom = _this.map.minZoom;
                    }
                    let view = new View({
                        projection: _this.map.projection,
                        center: center,
                        zoom:  zoom,
                        minZoom: _this.map.minZoom,
                        maxZoom: _this.map.maxZoom,
                    });
                    
                    // let view = map.getView();
                    //初始化2D地图对象
                    overview = new Map({
                        target: overviewId,
                        layers: [baseLayer],
                        view: view,
                        controls: defaultOlControls({
                                    rotate: false,
                                    zoom: false
                                })
                    });
                    
                    //禁用拖动
                    overview.getInteractions().forEach(function(element, index, array) {
                        if(element instanceof DragPan) {
                            element.setActive(false);//false：当前地图不可拖动。true：可拖动
                        }
                    });
                    
                    let extent = map.getView().calculateExtent(map.getSize());
                    let coor=[[[extent[0],extent[1]],[extent[2],extent[1]],[extent[2],extent[3]],[extent[0],extent[3]],[extent[0],extent[1]]]];
                    let polygonFeature = new Feature(new Polygon(coor));
                    
                    let vectorSource =  new VectorSource({
                        features: [polygonFeature]
                    });
                
                    let vectorLayer = new VectorLayer({
                        source: vectorSource,
                        style: new Style({
                            fill: new Fill({color: fillColor}),
                            stroke: new Stroke({
                                color: strokeColor,
                                width: 1,
                                // lineDash: [5,5]
                            })
                        })
                    });
                    overview.addLayer(vectorLayer);
                    // let drag = new Drag();
                    // overview.addInteraction(drag);
                    // drag.handleUpEvent = function(evt){
                    //     map.getView().setCenter(this.coordinate_);
                    //     this.coordinate_ = null;
                    //     this.feature_ = null;
                        
                    //     return false;
                    // }
    
                    let mapmove = map.on('moveend',function(){
                        let extent = map.getView().calculateExtent(map.getSize());
                        let coor=[[[extent[0],extent[1]],[extent[2],extent[1]],[extent[2],extent[3]],[extent[0],extent[3]],[extent[0],extent[1]]]];
                        polygonFeature.getGeometry().setCoordinates(coor);
                        let center = map.getView().getCenter();
                        let zoom = map.getView().getZoom() - zoomNum;
                        if(zoom < _this.map.minZoom){
                            zoom = _this.map.minZoom;
                        }
                        overview.getView().setCenter(center);
                        overview.getView().setZoom(zoom);
                    });
                    
    
                    // overview.on('click',function(e){
                    //     let coor = e.coordinate;
                    //     map.getView().setCenter(coor);
                    // })
    
                    //清除
                    _this.mapClear = function(){
                        unByKey(mapmove);
                        overview.dispose();
                    }
                }
              
                //创建三维鹰眼
                if(_this.map.currentStatus == "3d" && _this.map.map3D && _this.on3D){
                    //创建球体
                    let imageryProvider = new Cesium.UrlTemplateImageryProvider({
                        url: _this.map.baselayerUrl.url,
                        subdomains: _this.map.baselayerUrl.value,
                        tileWidth: 256,
                        tileHeight: 256,
                      });
    
                    let viewer = new Cesium.Viewer(overviewId, {
                        requestRenderMode: true, // 进入后台停止渲染
                        targetFrameRate: 30, // 帧率30，节约GPU资源
                        imageryProvider: imageryProvider,
                        fullscreenButton: false, //是否显示全屏按钮
                        infoBox: false,//信息弹窗控件
                        geocoder: false,//是否显示geocoder小器件，右上角查询按钮 
                        scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
                        selectionIndicator: false,//是否显示选取指示器组件
                        baseLayerPicker: false,//是否显示图层选择器
                        homeButton: false, //是否显示Home按钮
                        sceneModePicker: false,//是否显示3D/2D选择器
                        navigationHelpButton: false,//是否显示右上角的帮助按钮
                        animation: false,//是否创建动画小器件，左下角仪表
                        creditsDisplay: false,
                        timeline: false,//是否显示时间轴
                        fullscreenButton: false,//是否显示全屏按钮
                        contextOptions: {
                        webgl: {
                            preserveDrawingBuffer: true
                        }
                        } 
                    });
    
                    //去除版权信息
                    viewer._cesiumWidget._creditContainer.style.display = "none";
                    var scene = viewer.scene;
                    scene.postProcessStages.fxaa.enabled = false;// 关闭快速近似抗锯齿
                    if(_this.map.style == "blue"){
                        var layers = viewer.imageryLayers;
                        var tilemapLayer = layers.get(0);
                        tilemapLayer.brightness = 0.15;
                        tilemapLayer.contrast = 1.45;
                        tilemapLayer.hue = 2.4;
                        tilemapLayer.saturation = 2;
                        tilemapLayer.gamma = 0.6;
                        scene.highDynamicRange = true;
                    } else {
                        scene.highDynamicRange = false;// 瓦片地图偏灰问题
                    }
    
                    //设置鹰眼中球属性
                    let control = viewer.scene._screenSpaceCameraController;
                    control.enableRotate = false;
                    control.enableTranslate = false;
                    control.enableZoom = false;
                    control.enableTilt = false;
                    control.enableLook = false;
    
                    //同步
                    let camera = _this.map.map3D.camera;

                    //绘制显示区域边界
                    viewer.entities.add({
                        rectangle: {
                            coordinates: new Cesium.CallbackProperty(function() {
                                return camera.computeViewRectangle();
                            }, false),
                            material: new Cesium.Color.fromCssColorString(fillColor),
                            outlineColor: new Cesium.Color.fromCssColorString(strokeColor),
                            outline: true,
                            extrudedHeight: 1.0,
                        }
                    });
                    
                    let syncViewer = function(){
                        // try {
                            let center = getCenterPosition(_this.map.map3D);
                            if(center){
                                let zoom = _this.map.zoom - 2;
                                if(zoom < _this.map.minZoom){
                                    zoom = _this.map.minZoom;
                                }
                                center[2] = defaultDMapZommConfig[zoom]||870;
                                let position = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]);
                                viewer.camera.flyTo({
                                    destination: position,
                                    orientation: {
                                        heading: camera.heading,
                                        pitch: camera.pitch,
                                        roll: camera.roll,
                                    },
                                    duration: 0.0
                                });
                            }
                        // } catch (error) {
                        //     console.log("异常抛出，重置地图...");
                        //     _this.map.init();
                        // }
                    }
    
                    let entity = _this.map.map3D.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(0,0),
                        label: {
                            text: new Cesium.CallbackProperty(function(){
                                syncViewer();
                                return "";
                            }, true)
                        }
                    });
    
                    //清除
                    _this.mapClear = function(){
                        viewer.destroy();
                        if(_this.map && _this.map.map3D){
                            _this.map.map3D.entities.remove(entity);
                        }
                    }
    
                    function getCenterPosition(viewer) {
                        var result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
                        if(result){
                            var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
                            var lon = curPosition.longitude * 180 / Math.PI;
                            var lat = curPosition.latitude * 180 / Math.PI;
                            var scene = viewer.scene;
                            var ellipsoid = scene.globe.ellipsoid;
                            var height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
                            return [lon, lat, height];
                        }
                    }
                }
            }
        }
    }

    
    /**
     * 销毁
     */
    destroy(){
        if(this.mapClear){
            this.mapClear();
            this.mapClear = undefined;
        }
      
        if(this.element){
            this.element.parentElement.removeChild(this.element);
            this.element = undefined;
        }

        if(this.content){
            this.content.parentElement.removeChild(this.content);
            this.content = undefined;
        }

        if(this.clearEnvent){
            this.clearEnvent();
        }
    }
}