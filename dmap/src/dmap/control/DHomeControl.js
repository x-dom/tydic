import DBaseControl from "./DBaseControl";
import { transform } from "../utils/geom";
import {MapHomeSvg}  from  "./DControlSvg";
const Cesium = require('cesium/Cesium');

/**
 * 主页控件
 */
export default class DHomeControl extends DBaseControl{
    constructor(options) {

        let use_options = {
            target: null,
            on2D: true,
            on3D: true,
            center: [104.0653, 30.6597],
            projection: "EPSG:4326",
            zoom: 17
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;

        this.center = use_options.center;
        this.zoom = use_options.zoom;
        this.projection = use_options.projection;
        this.target = use_options.target;

        this.create();
    }

    /**
     * 创建
     */
    create(){
        let _this = this;
        this.destroy();
        
        if(_this.map){
            let root = _this.target;
            let classPosition = " dmap-control-left";
            if(!root){
                classPosition = " dmap-control-absolute"
                root = document.getElementById(_this.map.target);
            }
            _this.element = document.createElement("div");
            _this.element.className = "dmap-control dmap-home " + classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = "主页";
            btnElement.innerHTML = MapHomeSvg;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);
            let map = _this.map;
            _this.element.onclick = function(){
                map.map3D.camera.setView({
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0),
                        pitch: Cesium.Math.toRadians(-90),
                        roll: 0.0   
                    }
                });
                let center = transform(_this.center, _this.projection, _this.map.projection);
                map.setCenterAndZoom(center, _this.zoom);
            }

            _this.show(_this.on2D, _this.on3D);
        }
    }

    //重新配置参数
    setOptions(options){
        options = options||{};
        $.extend(this.options, options);
        this.map = this.options.map||undefined;//地图
        this.on2D = this.options.on2D==undefined?false:this.options.on2D;//在2D中展示
        this.on3D = this.options.on3D==undefined?false:this.options.on3D;//在3D中展示
        this.center = this.options.center;
        this.zoom = this.options.zoom;
        this.projection = this.options.projection;
        this.target = this.options.target;
        this.create();
    }

    /**
     * 设置中心位置和显示层级
     * @param {*} center 
     * @param {*} zoom 
     */
    setCenterAndZoom(center, zoom, projection){
        this.center == center||this.center;
        this.zoom == zoom||this.zoom;
        this.projection == projection||this.projection;

        this.create();
    }
}