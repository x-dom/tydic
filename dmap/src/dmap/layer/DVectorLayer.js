import DLayer from "./DLayer";
import Feature from 'ol/Feature.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Vector as VectorSource} from 'ol/source.js';
import {parse2DStyle} from './../utils/style';
import {parse3DStyle} from './../utils/style';
import {transformExtent} from './../utils/geom';
import {defaultDPolygonStyleOptions} from './../default/default';
import {calculateExtentByLayer} from "./../utils/extent";
import DEvent from "./../event/DEvent";
import {DFeature} from "./../feature/feature";
import {DLayerInfoControl} from "./../control/control"
const Cesium = require('cesium/Cesium');

/**
 * 矢量图层
 */
export default class DVectorLayer extends DLayer{
    constructor(options){
        let use_options = {
            infoWindowOptions: {
                show: false,
                touchType: "click",
                styleType: "blue",
                title: "要素信息",
                on2D: true,
                on3D: true,
                width: 200
            },
            featurePicker: {
                show: true,
                fill: {
                    color: {
                        value: '#0000ff',
                        opacity: 1
                    },
                    //material:
                },
                stroke: {
                    color: {
                        value: '#0000ff',
                        opacity: 1
                    },
                    width: 0,
                    lineDash: [2,2]
                },
                geometries: ["polygon", "polyline"]
            }
        };

        //合并参数
        options.infoWindowOptions = options.infoWindowOptions||{};
        options.infoWindowOptions = $.extend(use_options.infoWindowOptions, options.infoWindowOptions);
        $.extend(use_options, options);
        
        //继承父类
        super(use_options);
        
        this.options = use_options;
        this.data = use_options.data||[];//要素数据
        this.type = 'VectorLayer';//图层类型
        
        this.extent = use_options.extent||undefined;//可视范围
        this.style = use_options.style||defaultDPolygonStyleOptions;//样式
        this.featurePicker = use_options.featurePicker;
        this.layer = new VectorLayer({source: new VectorSource()});//2d图层对象
        this.dataSource = new Cesium.CustomDataSource();//3d图层对象
        this.eventObj = new DEvent();
        this.infoWindowOptions = use_options.infoWindowOptions;

        //加载数据
        this.loadData();
        //默认执行渲染
        this.render();
    }  

    /**
     * 渲染图层信息
     */
    render() {
        let _this = this;

        //清空绘制
        _this.clear();
        if(_this.map){
            /** 1.解析2D图层参数配置 **/
            //叠加顺序
            if(_this.index){
                _this.layer.setZIndex(_this.index);
            }
            
            //可视范围  
            if(_this.extent){
                let extent = transformExtent(_this.extent, _this.projection, _this.map.projection);
                _this.layer.setExtent(extent);
            }
        
            //样式
            if(_this.style){
                let style = parse2DStyle(_this.style, _this.map);
                _this.layer.setStyle(style);
            } else{
                console.log("样式未设置,使用默认样式");
                let style = parse2DStyle(defaultDPolygonStyleOptions, _this.map);
                _this.layer.setStyle(style);
            }
        
            /** 2.判断是否加入各模式地图 **/
            if(_this.map.map2D){
                _this.map.map2D.addLayer(_this.layer);
            }

            if(_this.map.map3D){
                _this.map.map3D.dataSources.add(_this.dataSource);
            }

            //设置可见性
            _this.setVisible(_this.visible);

            //创建地图层级改变事件
            let zoomChangeCode = _this.map.eventObj.on("change:zoom",function(evt){
                _this.setVisible(_this.visible);
            });

            //弹窗
            _this.setInfoWindowOptions(_this.infoWindowOptions);

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(zoomChangeCode);
                }

                if( _this.infoWindow){
                    _this.infoWindow.destroy();
                    _this.infoWindow = undefined;
                }
            }
        }
    }

    /**
     * 清空图层数据
     */
    clear(){
        //清空图层
        if(this.map && this.map.map2D){
            this.map.map2D.removeLayer(this.layer);
        }
        
        //清空entity
        if(this.map && this.map.map3D){
            this.map.map3D.dataSources.remove(this.dataSource);
        }

        //清除事件
        if(this.clearEnvent){
            this.clearEnvent();
        }
    }

    /**
     * 加载数据
     */
    loadData(){
        var _this = this;
        _this.layer.getSource().clear();
        _this.dataSource.entities.removeAll();

        /** 解析数据添加进各模式容器 **/
        for (let i = 0; i < _this.data.length; i++) {
            //添加2d数据
            const dfeature = _this.data[i];
            let geom =  dfeature.geometry.get2DGeometry(_this.projection);
            let prop =  dfeature.properties;
            // prop.dfeature = dfeature;
            let feature = new Feature();

            if(geom){
                feature.setGeometry(geom);
            }
            
            if(prop){
                feature.setProperties(prop);
            }
            
            feature.dfeature = dfeature;
            _this.layer.getSource().addFeature(feature);

            //添加3d数据
            let entitys = parse3DStyle(_this.style, dfeature);
            for (let j = 0; j < entitys.length; j++) {
                const entity = entitys[j];
                _this.dataSource.entities.add(entity);
            }
        }
    }

    /**
     * 设置地图
     * @param {*} map 
     */
    setMap(map){
        this.map = map;
        this.projection = (this.map?this.map.projection:"EPSG:4326");
        this.loadData();
        this.render();
    }

    /**
     * 设置样式信息
     * @param {*} style 
     */
    setStyle(style) {
        this.style = style;

       //加载数据
       this.loadData();
       //默认执行渲染
       this.render();
    }

    /**
     * 设置图层数据
     * @param {*} data 
     */
    setData(data) {
        this.data = data;
        this.loadData();
    }

    /**
     * 添加单个数据
     * @param DFeature dfeature 
     */
    addData(dfeature) {
        var _this = this;

        if(!dfeature instanceof DFeature){
            console.error("The error of data type!");
            return;
        }

        let valid =  true;
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if(element === dfeature){
                valid = false;
            }
        }

        if(valid){
            this.data.push(dfeature);
            ///添加二维数据
            if(_this.map.map2D && _this.layer){
                let geom =  dfeature.geometry.get2DGeometry(_this.projection);
                let prop =  dfeature.properties;
                // prop.dfeature = dfeature;
                let feature = new Feature();

                if(geom){
                    feature.setGeometry(geom);
                }
                
                if(prop){
                    feature.setProperties(prop);
                }
                
                feature.dfeature = dfeature;
                _this.layer.getSource().addFeature(feature);
            }
    
            //创建三维图层
            if(_this.map.map3D  && _this.dataSource){
                let entitys = parse3DStyle(_this.style, dfeature);
                for (let j = 0; j < entitys.length; j++) {
                    const entity = entitys[j];
                    entity.show = _this.visible;
                    _this.dataSource.entities.add(entity);
                }
            }
        }
    }

    /**
     * 添加多个数据
     * @param [DFeature] datas 
     */
    addDatas(datas) {
        datas = datas||[];
        for (let j = 0; j < datas.length; j++) {
            let valid =  true;
            const data = datas[j];
            for (let i = 0; i < this.data.length; i++) {
                const element = this.data[i];
                if(element === data){
                    valid = false;
                    break;
                }
            }

            if(valid){
                this.addData(data);
            }
        }
    }

    /**
     * 删除单个数据
     * @param DFeature dfeature 
     */
    removeData(dfeature) {
        let _this = this;

        if(!dfeature instanceof DFeature && (typeof(dfeature) != "string" || typeof(dfeature) != "number")){
            console.error("The error of data type!");
            return;
        }

        let arr = [];
        //2维处理
        if(_this.map.map2D && _this.layer){
            let features = _this.layer.getSource().getFeatures();
            for (let i = 0; i < features.length; i++) {
                const dfeatureT = features[i].dfeature;
                if(dfeatureT){
                    if (dfeature instanceof DFeature) {
                        if(dfeature == dfeatureT){
                            _this.layer.getSource().removeFeature(features[i]);
                        } else {
                            arr.push(dfeatureT);
                        }
                    } else {
                        if(dfeatureT.id == dfeature){
                            _this.layer.getSource().removeFeature(features[i]);
                        } else {
                            arr.push(dfeatureT);
                        }
                    } 
                }
            }
        }

        //3维处理
        if(_this.map.map3D  && _this.dataSource){
            for (let i = 0; i < _this.dataSource.entities.values.length; i++) {
                const entity =  _this.dataSource.entities.values[i];
                const dfeatureT = entity.dfeature;
                if(dfeatureT){
                    if (dfeature instanceof DFeature) {
                        if(dfeature == dfeatureT){
                            _this.dataSource.entities.remove(entity);
                        } else {
                            arr.push(dfeatureT);
                        }
                    } else {
                        if(dfeatureT.id == dfeature){
                            _this.dataSource.entities.remove(entity);
                        } else {
                            arr.push(dfeatureT);
                        }
                    }
                }
            }
        }

        _this.data = arr;
    }
    
    /**
     * 删除多个数据
     * @param DFeature feature 
     */
    removeDatas(datas) {
        for (let i = 0; i < datas.length; i++) {
            removeData(datas[i]);
        }
    }

    /**
     * 设置图层顺序
     * @param number index 
     */
    setIndex(index) {
        if(index){
            this.index = index;
            if(this.map && this.map.currentStatus == "2d"){
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
    
            this.layer.setVisible(visible);
            this.dataSource.show = visible;
        }
        
        //当前可见性
        this.visibility = visible;
    }

    /**
     * 获取范围
     */
    getExtent(){
        return calculateExtentByLayer(this);        
    }
  
    /**
     * 查看全部
     */
    viewAll(){
        if(this.map && this.data.length > 0){
            this.map.viewExtent(this.getExtent());
        }
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
                    width: _this.infoWindowOptions.width,
                });
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