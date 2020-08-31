import "./css/DMapMeasure.css";
import DBaseControl from "./DBaseControl";
import DMeasure2D from "./DMeasure2D";
import DMeasure3D from "./DMeasure3D";
import {MeasureDistanceSvg, MeasureAreaSvg}  from  "./DControlSvg";

/**
 * 地图测量控件
 */
export default class DMeasureControl extends DBaseControl{
    constructor(options) {
        let use_options = {
            on2D: true,
            on3D: true,
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;

        this.measure2D,this.measure3D;
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
            _this.element.className = "dmap-control dmap-measure"+classPosition;

            let lengthElement = document.createElement("button");
            lengthElement.className = "dmap-measure-length";
            lengthElement.title = "测量距离";
            lengthElement.innerHTML = MeasureDistanceSvg;
            _this.element.appendChild(lengthElement);
            
            let areaElement = document.createElement("button");
            areaElement.className = "dmap-measure-area";
            areaElement.title = "测量面积";
            areaElement.innerHTML = MeasureAreaSvg;
            _this.element.appendChild(areaElement);
         
            let moveElement = document.createElement("button");
            moveElement.className = "dmap-measure-move";
            moveElement.title = "取消绘制";
            moveElement.innerHTML = '<svg t="1567771111173" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6510" data-spm-anchor-id="a313x.7781069.0.i9"><path d="M55.466667 448l288 166.4c44.8 25.6 100.266667-6.4 89.6-57.6V224c10.666667-51.2-44.8-83.2-89.6-57.6L55.466667 332.8c-42.666667 25.6-42.666667 89.6 0 115.2z" p-id="6511"></path><path d="M900.266667 435.2c78.933333 128 51.2 258.133333-29.866667 339.2-46.933333 46.933333-110.933333 74.666667-181.333333 74.666667H490.666667c-32 0-57.6-25.6-57.6-57.6 0-32 25.6-55.466667 55.466666-55.466667h196.266667c40.533333 0 74.666667-17.066667 100.266667-42.666667 49.066667-49.066667 61.866667-132.266667 0-206.933333-17.066667-21.333333-53.333333-36.266667-81.066667-36.266667H430.933333v-115.2h281.6c76.8 0 149.333333 36.266667 187.733334 100.266667z" p-id="6512"></path></svg>';
            _this.element.appendChild(moveElement);

            root.appendChild(_this.element);
        
            let map = _this.map;

            _this.measure2D = new DMeasure2D(map);
            _this.measure3D = new DMeasure3D(map);
           
            lengthElement.onclick = function(){
                if(_this.measure2D && _this.map.currentStatus == "2d"){
                    _this.measure2D.startMeasureDistance();
                }
                if(_this.measure3D && _this.map.currentStatus == "3d"){
                    _this.measure3D.startMeasureDistance();
                }
            }
            
            areaElement.onclick = function(){
                if(_this.measure2D && _this.map.currentStatus == "2d"){
                    _this.measure2D.startMeasureArea();
                }
                if(_this.measure3D && _this.map.currentStatus == "3d"){
                    _this.measure3D.startMeasureArea();
                }
            }
            
            moveElement.onclick = function(){
                if(_this.measure2D){
                    _this.measure2D.clearMeasure();
                }
                if(_this.measure3D){
                    _this.measure3D.clearMeasure();
                }
            }

            _this.show(_this.on2D, _this.on3D);

            _this.eventCode = _this.map.on("change:mode",function(evt){
                _this.show(_this.on2D, _this.on3D);
                lengthElement.onclick = function(){
                    if(_this.measure2D && _this.map.currentStatus == "2d"){
                        _this.measure2D.startMeasureDistance();
                    }
                    if(_this.measure3D && _this.map.currentStatus == "3d"){
                        _this.measure3D.startMeasureDistance();
                    }
                }
                
                areaElement.onclick = function(){
                    if(_this.measure2D && _this.map.currentStatus == "2d"){
                        _this.measure2D.startMeasureArea();
                    }
                    if(_this.measure3D && _this.map.currentStatus == "3d"){
                        _this.measure3D.startMeasureArea();
                    }
                }
            });

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(_this.eventCode);
                }
            }
        }
    }

    /**
     * 销毁
     */
    destroy(){
        if(this.element){
            this.element.parentElement.removeChild(this.element);
            this.element = undefined;
        }

        if(this.measure2D){
            this.measure2D.clearMeasure();
        }

        if(this.measure3D){
            this.measure3D.clearMeasure();
        }

        if(this.clearEnvent){
            this.clearEnvent();
        }
    }
}