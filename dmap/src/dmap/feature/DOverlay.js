import Overlay from "ol/Overlay";
import {transform} from 'ol/proj.js';
import DOverlay3D from "./DOverlay3D";

/**
 * 覆盖物，弹窗
 * 存储弹窗信息
 */
export default class DOverLay{
    constructor(options){
        let defaultParams = {};
        let use_options = {};

        //合并参数
        $.extend(use_options,defaultParams, options);

        this.options = use_options;

        this.id = use_options.id|| ((new Date()).getTime() + "");
        // this.map = use_options.map;
        this.on2D = use_options.on2D==undefined?true:use_options.on2D;
        this.on3D = use_options.on3D==undefined?true:use_options.on3D;
        this.content = use_options.content;
        this.position = use_options.position;
        this.offsetX = use_options.offsetX || 0;
        this.offsetY = use_options.offsetY || 0;
        this.success = use_options.success || function(){};
        this.overlay2D,this.overlay3D;

        /**
         * 渲染绘制
         */
        this.render();
    }

    /**
     * 渲染绘制
     */
    render() {
        //清除
        this.clear();

        if(this.map){
            let map2D = this.map.map2D;
            let map3D = this.map.map3D;
            
            //绘制二维弹窗
            if(this.on2D && map2D && this.position && this.content && this.map.currentStatus == "2d"){
                this.overlay2D = new Overlay({
                    id: this.id,
                    offset: [this.offsetX, this.offsetY]
                });
                
                let element = document.createElement("div");
                if(typeof(this.content) == "string"){
                    element.innerHTML = this.content;
                } else {
                    element.appendChild(this.content);
                }
                this.overlay2D.setElement(element);

                this.overlay2D.setPosition(this.position);
                map2D.addOverlay(this.overlay2D);
            }

            //绘制三维弹窗
            if(this.on3D && map3D && this.position && this.content && this.map.currentStatus == "3d"){
                let position = transform(this.position, this.map.projection, "EPSG:4326");
                this.overlay3D = new DOverlay3D({
                    content: this.content,
                    position: position,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY
                });

                this.overlay3D.setMap(this.map);
            }

            //成功回调
            if(typeof(this.success) == "function"){
                this.success();
            }
        }
    }

    /**
     * 清除绘制
     */
    clear(){
        if(this.overlay2D){
            this.map.map2D.removeOverlay(this.overlay2D);
            this.overlay2D = undefined;
        }
        
        if(this.overlay3D){
            this.overlay3D.clear();
            this.overlay3D = undefined;
        }

    }

    /**
     * 设置地图
     * @param {*} map 
     */
    setMap(map) {
        this.map = map;
        this.render();
    }
   
    /**
     * 设置内容
     * @param {*} content 
     */
    setContent(content) {
        this.content = content;
        this.render();
    }
    
    /**
     *  是否在2D地图中展示
     * @param {*} on2d 
     */
    setOn2D(on2d) {
        this.on2D = on2d;
        this.render();
    }
    
    /**
     * 是否在3D地图中展示
     * @param {*} on3d 
     */
    setOn3D(on3d) {
        this.on3D = on3d;
        this.render();
    }
    
    /**
     * 设置位置
     * @param {*} position 
     */
    setPosition(position) {
        this.position = position;
        this.render();
    }
    
    /**
     * 设置偏移X
     * @param {*} offsetX
     */
    setOffsetX(offsetX) {
        this.offsetX = offsetX;
        this.render();
    }
    
    /**
     * 设置偏移Y
     * @param {*} offsetY
     */
    setOffsetY(offsetY) {
        this.offsetY = offsetY;
        this.render();
    }

    /**
     * 设置偏移
     */
    setOffset(offsetX, offsetY){
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.render();
    }
}