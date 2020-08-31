/**
 * 基础几何父类
 */
export default class DGeometry{
    constructor(options){
        let defaultParams = {};
        let use_options = {};
        //合并参数
        $.extend(use_options,defaultParams, options);

        this.options = use_options;

        //属性
        this.coordinates = use_options.coordinates || [];//坐标
        this.projection = use_options.projection || "EPSG:4326";//参考系
    }
}