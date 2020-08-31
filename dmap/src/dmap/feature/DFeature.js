/**
 * 要素
 * 存储几何数据和基本数据
 */
export default class DFeature{
    constructor(options){
        //图形
        this.geometry;
        //属性
        this.properties;

        let defaultParams = {};
        let use_options = {};

        //合并参数
        $.extend(use_options,defaultParams, options);

        this.options = use_options;
        this.id = use_options.id||(new Date()).getTime();

        if(use_options.geometry){
            this.geometry = use_options.geometry;
        }
        
        if(use_options.properties){
            this.properties = use_options.properties;
        }
    }
}