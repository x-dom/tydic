/**
 * 控件创建基础类，抽象化类
 */
export default class DBaseControl{
    constructor(options) {
        let use_options = {};
        options = options||{};
        $.extend(use_options, options);
        this.options = use_options;
        this.id = use_options.id|| ((new Date()).getTime() + "");
        this.map = use_options.map||undefined;//地图
        this.on2D = use_options.on2D==undefined?false:use_options.on2D;//在2D中展示
        this.on3D = use_options.on3D==undefined?false:use_options.on3D;//在3D中展示
    }

    /**
     * 创建
     */
    create(){
        this.destroy();

        this.show(this.on2D, this.on3D);
    }

    /**
     * 销毁
     */
    destroy(){
        if(this.element){
            this.element.parentElement.removeChild(this.element);
            this.element = undefined;
        }
    }

    /**
     * 显示
     * @param {*} bool2D 
     * @param {*} bool3D 
     */
    show(bool2D, bool3D){
        this.on2D = bool2D;
        this.on3D = bool3D;
        if(this.element){
            this.element.style.display = "none";
            
            /**
             * 2D中显示
             */
            if(this.on2D && this.element && this.map && this.map.map2D && this.map.currentStatus == "2d"){
                this.element.style.display = "block";
            }
            
            //3D中显示
            if(this.on3D && this.element && this.map && this.map.map3D && this.map.currentStatus == "3d"){
                this.element.style.display = "block";
            }
        }
    }

    //重新配置参数
    setOptions(options){
        options = options||{};
        $.extend(this.options, options);
        this.map = this.options.map||undefined;//地图
        this.on2D = this.options.on2D==undefined?false:this.options.on2D;//在2D中展示
        this.on3D = this.options.on3D==undefined?false:this.options.on3D;//在3D中展示
        this.create();
    }

    /**
     * 设置地图
     */
    setMap(map){
        this.map = map;
        if(this.map){
            this.create();
        }
    }
}