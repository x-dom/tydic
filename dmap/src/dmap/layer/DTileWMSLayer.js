import DLayer from "./DLayer";
import TileLayer from 'ol/layer/Tile';
import {TileWMS} from  'ol/source';
const Cesium = require('cesium/Cesium');
import DEvent from "./../event/DEvent";
import {DLayerInfoControl} from "./../control/control"
import {getZoomByHeight} from "./../default/default";
import {DExtent} from "./../feature/feature";

export default class DTileWMSLayer extends DLayer{
    constructor(options){
        let use_options = {
            infoWindowOptions: {
                show: false,
                touchType: "click",
                styleType: "blue",
                title: "要素信息",
                on2D: true,
                on3D: true
            }
        };
        //合并参数
        options.infoWindowOptions = options.infoWindowOptions||{};
        options.infoWindowOptions = $.extend(use_options.infoWindowOptions, options.infoWindowOptions);
        $.extend(use_options, options);

        super(use_options);
        this.options = use_options;
        this.type = 'TileWMSLayer';
        
        this.layer = undefined;//2d图层对象
        this.imageryLayer = undefined;//3d图层对象
        this.extent = use_options.extent||undefined;//可视范围
        this.serverType = use_options.serverType||"geoserver";
        this.serverUrl = use_options.serverUrl;
        this.layers = use_options.layers;
        this.version = use_options.version || '1.3.0';
        this.format = use_options.format || 'image/png';
        this.cql_filter = use_options.cql_filter || '1=1';
        this.opacity = use_options.opacity || 1;
        this.styles = use_options.styles || undefined;
        this.eventObj = new DEvent();
        this.infoWindowOptions = use_options.infoWindowOptions;

        //默认执行渲染
        this.render();
    }

    /**
     * 渲染
     */
    render() {
        let _this = this;
        //清空渲染
        _this.clear();

        if(_this.map && _this.serverUrl && _this.layers){
            let map2D = _this.map.map2D;
            let map3D = _this.map.map3D;
            
            let params = {
                layers: _this.layers,
                version: _this.version,
                format: _this.format,
                cql_filter: _this.cql_filter,
                transparent: true,
                tiled: true,
            };

            //设置样式
            if(_this.styles){
                params.styles = _this.styles;
            }
            
            //添加二维图层
            if(map2D && _this.map.currentStatus == "2d"){
                let source = new TileWMS({
                    url: _this.serverUrl,
                    serverType: _this.serverType,
                    params: params,
                    crossOrigin: 'anonymous'
                });

                //图层
                _this.layer = new TileLayer({
                    serverType: _this.serverType,
                    source: source
                });
    
                map2D.addLayer(_this.layer);
    
                //叠加顺序
                if(_this.index){
                    _this.layer.setZIndex(_this.index);
                }
                
                //可视范围
                if(_this.extent){
                    let extent = transformExtent(_this.extent, _this.projection, map2D.projection);
                    _this.layer.setExtent(extent);
                }

                //透明度
                if(_this.opacity){
                    _this.layer.setOpacity(_this.opacity);
                }
            }

            //添加3D图层
            let imageryLayerMM;
            if(!_this.map.only2D && map3D && _this.map.currentStatus == "3d"){
                imageryLayerMM = new Cesium.WebMapServiceImageryProvider({ 
                    url: _this.serverUrl, 
                    layers: _this.layers, 
                    parameters: params
                }); 

                _this.imageryLayer = map3D.imageryLayers.addImageryProvider(imageryLayerMM); 
                
                
                if(_this.opacity){
                    _this.imageryLayer.alpha = _this.opacity;
                }
            }

            //设置可见性
            _this.setVisible(_this.visible);

            //创建地图层级改变事件
            let zoomChangeCode = _this.map.eventObj.on("change:zoom",function(evt){
                _this.setVisible(_this.visible);
            });

            let pointTouchCode = this.eventObj.on("pointTouch",function(evt){
               onPointTouch(evt, evt.eventType);
            });

            //弹窗
            _this.setInfoWindowOptions(_this.infoWindowOptions);

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(zoomChangeCode);
                    _this.map.eventObj.unByCode(pointTouchCode);
                }

                if( _this.infoWindow){
                    _this.infoWindow.destroy();
                    _this.infoWindow = undefined;
                }
            }

            /**
             * 点触发事件
             * @param {*} evt 
             */
            function onPointTouch(evt, touchType){
                let coordinate = evt.coordinate;
                let pixel = evt.pixel;
                if(_this.map && _this.map.currentStatus == "2d"){
                    let view = _this.map.map2D.getView();
                    let projection = view.getProjection();
                    let viewResolution = view.getResolution();
                    let source = _this.layer.getSource();
                    let url = source.getGetFeatureInfoUrl(coordinate, viewResolution,
                        projection, {
                            'INFO_FORMAT' : 'application/json',
                            'QUERY_LAYERS' : params.layers,
                        });

                    url = url.replace("&I=","&X=");
                    url = url.replace("&J=","&Y=");
                    $.ajax({
                        url : url,
                        method : 'GET',
                        dataType : 'json',
                        success : function(response) {
                            let features = response.features;
                            if(features.length > 0){
                                _this.eventObj.emit(touchType, {features: features, coordinate: coordinate});
                            }
                        }
                    });
                } else if(_this.map && _this.map.currentStatus == "3d"){
                    let viewer = _this.map.map3D;
                    var ray = viewer.camera.getPickRay(pixel);
                    let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    if (cartesian && imageryLayerMM) {
                        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        if (cartographic) {
                            let xy = new Cesium.Cartesian2();
                            let alti = viewer.camera.positionCartographic.height;
                            let level = getZoomByHeight(alti);
                            if (imageryLayerMM.ready) {
                                xy = imageryLayerMM.tilingScheme.positionToTileXY(cartographic, level, xy);
                                let promise = imageryLayerMM.pickFeatures(xy.x, xy.y, level, cartographic.longitude, cartographic.latitude);
                                Cesium.when(promise, function (features) {
                                    if(features.length > 0){
                                        _this.eventObj.emit(touchType, {features: features, coordinate: coordinate});
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 清空图层
     */
    clear() {
        //删除layer
        //清空entity
        if(this.map && this.layer){
            this.map.map2D.removeLayer(this.layer);
        }
        this.layer = undefined;

        //清空entity
        if(this.map && this.map.map3D && this.imageryLayer){
            this.map.map3D.imageryLayers.remove(this.imageryLayer);
        }
        this.imageryLayer = undefined;

        
        //清除事件
        if(this.clearEnvent){
            this.clearEnvent();
        }
    }

    /**
     * 设置地图
     * @param {*} map 
     */
    setMap(map){
        this.map = map;
        this.render();
    }
    
    /**
     * 设置是否只支持2D
     * @param Boolean only2D 
     */
    setOnly2D(only2D) {
        this.only2D = only2D;
        this.render();
    }
    
    /**
     * 设置透明度
     * @param {*} opacity 
     */
    setOpacity(opacity){
        this.opacity = opacity;
        if(this.layer){
            this.layer.setOpacity(this.opacity);
        }

        if(this.imageryLayer){
            this.imageryLayer.alpha = this.opacity;
        }
    }
  
    /**
     * 设置图层顺序
     * @param number index 
     */
    setIndex(index) {
        if(index){
            this.index = index;
            if(this.layer){
                this.layer.setZIndex(index);
            }
        }
    }

    /**
     * 设置最小显示层级
     * @param number minZoom 
     */
    setMinZoom(minZoom) {
        this.minZoom = minZoom;
        this.setVisible(this.visible);
    }
    
    /**
     * 设置最大显示层级
     * @param number maxZoom 
     */
    setMaxZoom(maxZoom) {
        this.maxZoom = maxZoom;
        this.setVisible(this.visible);
    }

    /**
     * 设置是否可见
     * @param boolean visible 
     */
    setVisible(visible) {
        this.visible = visible;

        if(this.map){
            let zoom = this.map.zoom;
            //判断是否在可显示范围内
            if((this.maxZoom && zoom > this.maxZoom) || (this.minZoom && zoom < this.minZoom)){
                visible = false;
            }

            if(this.layer){
                this.layer.setVisible(visible);
            }

            
            //添加三维数据
            if(this.imageryLayer){
                this.imageryLayer.show = visible;
            }
        }

        //当前可见性
        this.visibility = visible;
    }
    
    /**
     * 更新图层配置
     * @param {*} params 
     */
    updateParams(params) {
        $.extend(this, params);
        this.render();
    }

    /**
     * 获取范围
     */
    getExtent(){
        let result;
        let _this = this;
        let layerName = _this.layers.split(":")[1];
        if(!layerName){
            return;
        }


        $.ajax({
            url : this.serverUrl,
            method : 'GET',
            async: false,
            dataType : 'json',
            data: {
                service: "wms",
                version: this.version,
                request: "GetCapabilities"
            },
            success : function(evt) {
            },
            error: function(evt){
                let responseText = evt.responseText;
                let xmlDoc,parser;
                if (window.DOMParser) {
                    parser=new DOMParser();
                    xmlDoc=parser.parseFromString(responseText,"text/xml");
                    parser.parse;
                } else {// Internet Explorer
                    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async="false";
                    xmlDoc.loadXML(responseText);
                }

                if(xmlDoc){
                    // console.log(xmlDoc);
                    let layers = xmlDoc.getElementsByTagName("Layer");
                    for (let i = 1; i < layers.length; i++) {
                        const layer = layers[i];
                        let names = layer.getElementsByTagName("Name");
                        let valid = false;
                        for (let k = 0; k < names.length; k++) {
                            const nameElement = names[k];
                            let name = nameElement.textContent;
                            let arr = name.split(":");
                            if(arr.length == 1){
                                name = arr[0];
                            } else {
                                name = arr[1];
                            }
                            if(name == layerName){
                                valid = true;
                                break;
                            }
                        }

                        if(valid){
                            let bboxs = layer.getElementsByTagName("EX_GeographicBoundingBox");
                            for (let k = 0; k < bboxs.length; k++) {
                                const boxElement = bboxs[k];
                                let arr = [];
                                boxElement = boxElement.textContent.replace(/ /g,"");
                                arr = boxElement.split("\n");
                                let extentArr = [arr[1],arr[3],arr[2],arr[4]];
                                let extent = new DExtent(extentArr);
                                result = extent;
                                break;  
                            }

                            if(result){
                                break;
                            }
                        }
                    }
                }
            }
        });

        if(!result){
            console.error("计算图层边界失败");
        }
        return result;
    }
  
    /**
     * 查看全部
     */
    viewAll(){
        let _this = this;
        if(_this.map){
            let extent = _this.getExtent();
            if(extent){
                _this.map.viewExtent(extent);
            }
        }
    }

    /**
     * 绑定事件
     * @param {*} key 
     * @param {*} func 
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
            code = this.eventObj.on(key,func);
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
  
    /**
     * 设置信息窗体参数
     * @param {*} options 
     */
    setInfoWindowOptions(options){
        let _this = this;
        $.extend(_this.infoWindowOptions, options);
        if( _this.infoWindow){
            if(!_this.infoWindowOptions.show){
                _this.infoWindow.destroy();
                _this.infoWindow = undefined;
            } else {
                _this.infoWindow.refreshOverlay(_this.infoWindowOptions);
            }
        } else {
            if(_this.infoWindowOptions.show){
                _this.infoWindow = new DLayerInfoControl({
                    layer: _this,
                    touchType: _this.infoWindowOptions.touchType,
                    styleType: _this.infoWindowOptions.styleType,
                    title: _this.infoWindowOptions.title,
                    params: _this.infoWindowOptions.params,
                    on2D: _this.infoWindowOptions.on2D,
                    on3D: _this.infoWindowOptions.on3D,
                    offsetX: _this.infoWindowOptions.offsetX,
                    offsetY: _this.infoWindowOptions.offsetY,
                });
            }
        }
    }
}  