import DBaseControl from "./DBaseControl";
import {transform} from 'ol/proj'
import {PositionLocationSvg}  from  "./DControlSvg";

/**
 * 坐标拾取控件
 */
export default class DCoordinatePickControl extends DBaseControl{
    constructor(options) {

        let use_options = {
            on2D: true,
            on3D: true,
            isShowControl: false,
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;
        this.projection = use_options.projection;
        this.target = use_options.target;
        this.isShowControl = use_options.isShowControl;
        this.event2D,this.event3D;

        this.create();
    }

    /**
     * 创建
     */
    create(){
        let _this = this;
        
        _this.destroy();

        if(_this.map){
            let root = _this.target;
            let classPosition = " dmap-control-left";
            if(!root){
                classPosition = " dmap-control-absolute"
                root = document.getElementById(_this.map.target);
            }
            _this.element = document.createElement("div");
            _this.element.className = "dmap-control dmap-coordinate-pick" + classPosition;
           
            let btnElement = document.createElement("button");
            btnElement.title = "坐标拾取";
            btnElement.innerHTML = PositionLocationSvg;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);

            _this.content = document.createElement("div");
            _this.content.className = "dmap-control dmap-coordinater-pick-content";
            _this.content.style.display = _this.isShowControl?"block":"none";
            document.getElementById(_this.map.target).appendChild(_this.content);
            btnElement.onclick = function(){
                if(_this.content.style.display == "none"){
                    _this.content.style.display = "block";
                    _this.isShowControl = true;
                } else {
                    _this.content.style.display = "none";
                    _this.isShowControl = false;
                }
            }

            _this.show(_this.on2D, _this.on3D);
            _this.eventCode1 = _this.map.on("change:mode",function(evt){
                _this.show(_this.on2D, _this.on3D);
            });
            _this.eventCode2 = _this.map.on("pointermove",function(evt){
                let coordinate = evt.coordinate;
                if(_this.projection){
                    coordinate = transform(coordinate, map.projection, _this.projection);
                }
                coordinate[0] = Number(coordinate[0].toFixed(4));
                coordinate[1] = Number(coordinate[1].toFixed(4));
                _this.content.innerHTML = "<span>"+coordinate[0]+"</span>,"+ "<span>"+coordinate[1]+"</span>";
            });

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(_this.eventCode1);
                    _this.map.eventObj.unByCode(_this.eventCode2);
                }
            }
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
       
        if(this.content){
            this.content.parentElement.removeChild(this.content);
            this.content = undefined;
        }

        if(this.clearEnvent){
            this.clearEnvent();
        }
    }
}
