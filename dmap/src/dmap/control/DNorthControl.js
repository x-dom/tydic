import DBaseControl from "./DBaseControl";
import {unByKey} from 'ol/Observable';
const Cesium = require('cesium/Cesium');
import {MapCompassSvg}  from  "./DControlSvg";

/**
 * 指北控件
 */
export default class DNorthControl extends DBaseControl{
    constructor(options) {

        let use_options = {
            on2D: true,
            on3D: true,
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;

        this.event2D,this.event3D;
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
            _this.element.className = "dmap-control dmap-north"+classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = "指北针";
            btnElement.innerHTML = MapCompassSvg;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);
        
            let map = _this.map;

            let eventCode = _this.map.on("rendercomplete",function(){
				updateRotation();
            });

            _this.clearEvent = function(){
				if(_this.map){
					_this.map.unByCode(eventCode);
				}
			}
            
            function updateRotation(){
                if(map.map2D && map.currentStatus == '2d'){
                    var rotate = map.map2D.getView().getRotation();
                    btnElement.style.transform = "rotate("+rotate+"rad)";
                    btnElement.title = "Shift键+Alt键+鼠标左键=>控制地图旋转";
                }

                if(map.map3D && map.currentStatus == '3d'){
                    var rotate = map.map3D.camera.heading;
                    btnElement.style.transform = "rotate(-"+rotate+"rad)";
                    btnElement.title = "鼠标中键=>控制地图旋转";
                }
            }

            btnElement.onclick = function(){
                if(map.map2D && map.currentStatus == '2d'){
                    map.map2D.getView().setRotation(0);
                }
                
                if(map.map3D && map.currentStatus == '3d'){
                    map.map3D.camera.setView({
                        orientation: {
                            heading : Cesium.Math.toRadians(0), // east, default value is 0.0 (north)
                            pitch : map.map3D.camera.pitch,    // default value (looking down)
                            roll : map.map3D.camera.roll                             // default value
                        }
                    });
                }
            }

            _this.show(_this.on2D, _this.on3D);
        }
    }

    /**
     * 销毁
     */
    destroy() {
        if(this.element){
            this.element.parentElement.removeChild(this.element);
            this.element = undefined;
        }

        if(this.clearEvent){
            this.clearEvent();
        }
    }
}
