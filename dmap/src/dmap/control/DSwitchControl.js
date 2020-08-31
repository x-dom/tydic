import DBaseControl from "./DBaseControl";
import {Mode2DSvg, Mode3DSvg}  from  "./DControlSvg";

/**
 * 切换控件
 */
export default class DSwitchControl extends DBaseControl{
    constructor(options) {

        let use_options = {
            on2D: true,
            on3D: true,
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;
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
            _this.element.className = "dmap-control dmap-switch" + classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = getTitleAndText(_this.map).title;
            btnElement.innerHTML = getTitleAndText(_this.map).text;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);
            let map = _this.map;
            _this.element.onclick = function(){
                map.show(getTitleAndText(_this.map).map);
                btnElement.title = getTitleAndText(_this.map).title;
                btnElement.innerHTML = getTitleAndText(_this.map).text;
            }

            function getTitleAndText(map){
                let title = "点击切换3D地图";
                let text = Mode3DSvg;
                let mapStatus = '3d';
                if(map && map.currentStatus == "3d"){
                    title = "点击切换2D地图";
                    text = Mode2DSvg;
                    mapStatus = '2d';
                }

                return {title: title, text: text, map: mapStatus};
            }

            _this.show(_this.on2D, _this.on3D);
        }
    }
}