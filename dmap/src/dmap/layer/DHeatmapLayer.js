import DLayer from "./DLayer";
import Feature from 'ol/Feature.js';
import HeatMap from 'ol/layer/Heatmap';
import {boundingExtent} from 'ol/extent';
import {transformExtent, transform} from './../utils/geom';
import {Vector as VectorSource} from 'ol/source.js';
import {CesiumHeatmap} from './../plugin/cesium/heatmap/CesiumHeatmap';
import {calculateExtentByLayer} from "./../utils/extent";
import {DGradient} from "./../feature/feature";

export default class DHeatmapLayer extends DLayer{
    constructor(options){
        let defaultParams = {};
        let use_options = {};
        //合并参数
        $.extend(use_options,defaultParams, options);

        //继承父类
        super(use_options);
        this.options = use_options;
        this.data = use_options.data||[];//要素数据
        this.type = 'HeatmapLayer';//图层类型
        
        this.layer = undefined;//2d图层对象
        this.heatmap;//3d图层对象
        this.extent = use_options.extent||undefined;//可视范围
        this.style = use_options.style || {};
        this.style.opacity = this.style.opacity || 1;//透明度
        this.style.gradient = this.style.gradient ||["#0000ff", "#00ffff", "#00ff00", "#ffff00","#ff0000"];//颜色梯度变化

        this.style.radius = this.style.radius || 8;//半径大小
        this.style.blur = this.style.blur || 0.75;//模糊大小
        
        this.style.shadow = this.style.shadow || 250;//阴影大小
        this.style.weight = this.style.weight || 'weight';//权重
        this.style.renderMode = this.style.renderMode || 'vector';//模式，image/vector
        this.style.displayCondition = this.style.displayCondition || {//显示条件
            near: 0,
            far: 2e7,
            minResolution: 0,
            maxResolution: 0.17578125,
        };
  
        //默认执行渲染
        this.render();
    }

    /**
     * 渲染
     */
    render() {
        //清空绘制
        this.clear();

        if(this.map){
            let _this = this;
            let map2D = _this.map.map2D;
            let map3D = _this.map.map3D;
            let gradient = new DGradient(_this.style.gradient);
            let params = {
                opacity: _this.style.opacity,
                radius2D: (1 - _this.style.blur)*_this.style.radius,
                blur2D: _this.style.blur*_this.style.radius,
                gradient2D: gradient.get2DGradient(),
                shadow: _this.style.shadow,
                renderMode: _this.style.renderMode,
                
                radius3D: _this.style.radius,
                blur3D: _this.style.blur,
                gradient3D: gradient.get3DGradient(),

                displayCondition: _this.style.displayCondition,
            }
           
            //添加二维图层
            if(map2D){
                //图层
                _this.layer = new HeatMap({
                    source: new VectorSource(),
                    opacity: params.opacity,
                    gradient: params.gradient2D,
                    radius: params.radius2D,
                    blur: params.blur2D,
                    shadow: params.shadow,
                    renderMode: params.renderMode,
                    minResolution: params.displayCondition.minResolution,
                    maxResolution: params.displayCondition.maxResolution,
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
               
                //是否可见
                _this.layer.setVisible(_this.visible);
    
                //添加数据
                for (let i = 0; i < _this.data.length; i++) {
                    ///添加二维数据
                    const dfeature = _this.data[i];
                    let geom =  dfeature.geometry.get2DGeometry(_this.projection);
                    let prop =  dfeature.properties;
                    prop.dfeature = dfeature;
                    let feature = new Feature();
                    
                    if(geom){
                        feature.setGeometry(geom);
                    }
                    
                    if(prop){
                        feature.setProperties(prop);
                    }
    
                    _this.layer.getSource().addFeature(feature);
                }
            }


            //添加三维图层
            if(map3D){
                let zoom = _this.map.zoom;
                create3DHeatMap(getNumOf3DHeatMap(zoom));
                //创建地图层级改变事件
                let zoomChangeCode = _this.map.eventObj.on("change:zoom",function(evt){
                    if(getNumOf3DHeatMap(zoom) != getNumOf3DHeatMap(evt.zoom)){
                        create3DHeatMap(getNumOf3DHeatMap(evt.zoom));
                    }
                    zoom =  evt.zoom;
                });
    
                //清除事件
                _this.clearEnvent = function (){
                    if(_this.map){
                        _this.map.eventObj.unByCode(zoomChangeCode);
                    }
                }
    
                /**
                 * 获取绘制层级
                 * @param {*} zoom 
                 */
                function getNumOf3DHeatMap(zoom){
                    let num = 0;
                    if(zoom<= 5){
                        num = 5;
                    } else if(zoom >= 18){
                        num = 17;
                    } else if( zoom >= 16){
                        num = 16;
                    } else if( zoom >= 14){
                        num = 14;
                    } else if( zoom >= 12){
                        num = 12;
                    } else if( zoom >= 10){
                        num = 10;
                    } else if( zoom >= 8){
                        num = 8;
                    } else if( zoom >= 6){
                        num = 6;
                    }
    
                    return num;
                }
    
                /**
                 * 创建3维热力图
                 */
                function create3DHeatMap(num){
                    if(!_this.map.only2D && map3D && _this.map.currentStatus == "3d"){
                        if(_this.heatmap){
                            _this.heatmap.destroy();
                        }
    
                        let heatmap3DData = [];
                        let coordinates = [];
                        for (let i = 0; i < _this.data.length; i++) {
                            const dfeature = _this.data[i];
                            const coor = dfeature.geometry.coordinates;
                            const projection = dfeature.geometry.projection;
                            let coord = transform(coor, projection,"EPSG:4326");
                            heatmap3DData.push({x: coord[0], y: coord[1], value:params.radius3D});
                            coordinates.push(coord);
                        }
                        let bounds = boundingExtent(coordinates);
                        bounds = {//范围
                            west: bounds[0], 
                            south: bounds[1], 
                            east: bounds[2], 
                            north: bounds[3]
                        };
        
                        let radius = params.radius3D;
                        // radius = radius*Math.pow(2,18 - num)/64;
                        if(_this.map.zoom > 5 && _this.map.zoom < 18){
                            radius = radius*Math.pow(2,18 - _this.map.zoom)/64;
                        } else if(_this.map.zoom >= 18){
                            radius = radius*Math.pow(2,18 - 17)/64;
                        } else {
                            radius = radius*Math.pow(2,18 - 5)/64;
                        }
                        
                        _this.heatmap = CesiumHeatmap.create(
                            map3D, 
                            bounds,
                            {
                                gradient: params.gradient3D,
                                radius: radius,
                                maxOpacity: params.opacity,
                                minOpacity: 0,
                                blur: params.blur,
                                far: params.displayCondition.far,
                                near: params.displayCondition.near,
                            }
                        );
            
                        _this.heatmap.setWGS84Data(0, 100, heatmap3DData);
                        
                        if(_this.heatmap._layer){
                            _this.heatmap._layer.show = _this.visible;
                        }
                    }
                }
            }
        }
    }

    /**
     * 清空图层数据
     */
    clear() {
        //清空图层
        if(this.map && this.layer){
            this.layer.getSource().clear();
            this.map.map2D.removeLayer(this.layer);
        }
        this.layer = undefined;

        if(this.map && this.map.map3D && this.heatmap){
            if(this.heatmap._layer){
                this.map.map3D.entities.remove(this.heatmap._layer);
                this.map.map3D.scene.requestRender();
            }
            $("#" +this.heatmap._id).remove();
        }

        this.heatmap = undefined;

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
     * 设置图层数据
     * @param {*} data 
     */
    setData(data) {
        this.data = data;
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
     * 设置样式信息
     * @param {*} style 
     */
    setStyle(style) {
        $.extend(this.style, style)
        this.render();
    }

    /**
     * 添加数据
     * @param DFeature feature 
     */
    addData(feature) {
        let valid =  true;
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if(element == feature){
                valid = false;
            }
        }

        if(valid){
            this.data.push(feature);
            this.render();
        }
    }

    /**
     * 删除数据
     * @param DFeature feature 
     */
    removeData(feature) {
        let arr = [];
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if(element != feature){
                arr.push(element);
            } 
        }

        if(arr.length != this.data.length){
            this.data = arr;
            this.render();
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
            
            if(this.layer && this.map.currentStatus == "2d"){
                this.layer.setVisible(visible);
            }
    
            if(this.heatmap && this.heatmap._layer && this.map.currentStatus == "3d"){
                this.heatmap._layer.show = visible;
                this.map.map3D.scene.requestRender();
            }
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
        if(this.map){
            this.map.viewExtent(this.getExtent());
        }
    }

        /**
     * 添加数据
     * @param DFeature feature 
     */
    addData(feature) {
        let valid =  true;
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if(element === feature){
                valid = false;
            }
        }

        if(valid){
            this.data.push(feature);
            this.render();
        }
    }

    /**
     * 添加数据
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
                this.data.push(data);
            }
        }

        this.render();
    }

    /**
     * 删除数据
     * @param DFeature feature 
     */
    removeData(feature) {
        let arr = [];
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if(element != feature){
                arr.push(element);
            } 
        }

        if(arr.length != this.data.length){
            this.data = arr;
            this.render();
        }
    }
    
    /**
     * 删除数据
     * @param DFeature feature 
     */
    removeDatas(datas) {
        let arr = [];
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            let valid =  true;
            for (let j = 0; j < datas.length; j++) {
                const data = datas[j];
                if(element === data){
                    valid = false;
                    break;
                }
                
            }

            if(valid){
                arr.push(element);
            }
        }

        if(arr.length != this.data.length){
            this.data = arr;
            this.render();
        }
    }
}