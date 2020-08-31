import DLayer from "./DLayer";
import {defaultDClusterStyleOptions} from './../default/default';
import {unByKey} from 'ol/Observable';
import {transformExtent} from './../utils/geom';
import {get2DClusterLayers , get3DClusterLayers} from "./../utils/style";
import {calculateExtentByLayer} from "./../utils/extent";

/**
 * 聚合图层
 */
export default class DClusterLayer extends DLayer {
    constructor(options){
        let use_options = {};
        //合并参数
        $.extend(use_options, options);
        
        //继承父类
        super(use_options);
        
        this.options = use_options;
        this.data = use_options.data||[];//要素数据
        this.type = 'ClusterLayer';//图层类型
        
        this.extent = use_options.extent||undefined;//可视范围
        this.style = use_options.style||defaultDClusterStyleOptions;//样式
        this.layers = [];//2d图层对象
        this.dataSources = [];//3d图层对象

        //默认执行渲染
        this.render();
    }

    /**
     * 渲染
     */
    render() {
        //清空绘制
        this.clear();

        if(this.map && this.style.type && this.style.type == 'cluster'){
            let _this = this;
            let map2D = this.map.map2D;
            let map3D = this.map.map3D;
            let styleItems = this.style.items;

            //添加二维图层
            if(map2D && _this.map.currentStatus == "2d"){
                this.layers = get2DClusterLayers(this.data, styleItems, this.map.projection);
                for (let i = 0; i < this.layers.length; i++) {
                    const layer = this.layers[i];
                    map2D.addLayer(layer);
    
                    //叠加顺序
                    if(this.index){
                        layer.setZIndex(this.index);
                    }
                    
                    //可视范围
                    if(this.extent){
                        let extent = transformExtent(this.extent, this.projection, this.map.projection);
                        layer.setExtent(extent);
                    }
                
                    //是否可见
                    layer.setVisible(this.visible);
                }
            }

            //添加三维图层
            if(!_this.map.only2D && map3D && _this.map.currentStatus == "3d"){
                this.dataSources = get3DClusterLayers(this.data, styleItems, map3D);
                this.setVisible(this.visible);
            }

            //设置可见性
            _this.setVisible(_this.visible);

            //创建地图层级改变事件
            let zoomChangeCode = _this.map.eventObj.on("change:zoom",function(evt){
                _this.setVisible(_this.visible);
            });

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(zoomChangeCode);
                }
            }
        }
    }

    //清空图层数据
    clear(){
        //清空图层
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            layer.getSource().getSource().clear();
            this.map.map2D.removeLayer(layer);
        }
        this.layers = [];
        
        //清空entity
        if(this.map && this.map.map3D){
            for (let i = 0; i < this.dataSources.length; i++) {
                const dataSource = this.dataSources[i];
                this.map.map3D.dataSources.remove(dataSource);
                this.map.map3D.scene.requestRender();
            }
        }
        this.dataSources = [];

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
     * 设置样式信息
     * @param {*} style 
     */
    setStyle(style) {
        this.style = style;
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
                for (let i = 0; i < this.layers.length; i++) {
                    const layer = this.layers[i];
                    layer.setZIndex(index);
                }
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
        
            if(this.map.currentStatus == "2d"){
                for (let i = 0; i < this.layers.length; i++) {
                    const layer = this.layers[i];
                    layer.setVisible(visible);
                }
            }
            
            if(this.map.currentStatus == "3d"){
                for (let i = 0; i < this.dataSources.length; i++) {
                    const dataSource = this.dataSources[i];
                    dataSource.show = visible;
                }
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