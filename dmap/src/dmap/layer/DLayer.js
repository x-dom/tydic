/**
 * 接口类
 * 基础图层
 */
export default class DLayer{
    constructor(options){
        const defaultParams = {
            only2D:true,
            visible: true,

        };
        let use_options = {};
        //合并参数
        $.extend(use_options,defaultParams, options);
        this.options = use_options;

        this.id = options.id||(new Date()).getTime();//图层id
        this.name = options.name||(new Date()).getTime();//图层名字
        this.only2D = use_options.only2D;//是否只支持2D
        this.visible = options.visible == undefined?true:options.visible;//是否可见
        
        this.map = use_options.map||undefined;//地图对象
        this.index = use_options.index||undefined;//显示层级    
        this.minZoom =  use_options.minZoom||undefined;//最小显示层级
        this.maxZoom = use_options.maxZoom||undefined;//最大显示层级
        this.projection = use_options.projection||(use_options.map?use_options.map.projection:"EPSG:4326");//坐标系
    }

    /**
     * 设置坐标系
     */
    setProjection(projection){
        this.projection = projection;
        this.render();
    }

    setName(name){
        this.name = name;
        if(this.map){
            this.map.eventObj.emit("change:layer", {currentStatus: this.map.currentStatus});
        }
    }
}