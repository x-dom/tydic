import DBaseControl from "./DBaseControl";
import {ScreenFullSvg, ScreenFullCancelSvg}  from  "./DControlSvg";

/**
 * 全屏控件
 */
export default class DFullScreenControl extends DBaseControl{
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
            _this.element.className = "dmap-control dmap-fullscreen"+classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = getTitleAndText(_this.map).title;
            btnElement.innerHTML = getTitleAndText(_this.map).text;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);
            
            _this.element.onclick = function(){
                let mapDomObj = $("#"+_this.map.target);
                if(mapDomObj.is(".dmap-map-fullscreen")){
                    mapDomObj.removeClass("dmap-map-fullscreen");

                    //退出屏幕全屏
                    var el = document.documentElement;
                    if (document.exitFullscreen) {  
                        document.exitFullscreen();  
                    }  
                    else if (document.mozCancelFullScreen) {  
                        document.mozCancelFullScreen();  
                    }  
                    else if (document.webkitCancelFullScreen) {  
                        document.webkitCancelFullScreen();  
                    }  
                    else if (document.msExitFullscreen) {  
                        document.msExitFullscreen();  
                    } 
                    if(typeof cfs != "undefined" && cfs) {
                        cfs.call(el);
                    }
                } else {
                    mapDomObj.addClass("dmap-map-fullscreen");

                    //屏幕全屏
                    var el = document.documentElement;
                    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;      
                        if(typeof rfs != "undefined" && rfs) {
                            rfs.call(el);
                        };
                }

                btnElement.title = getTitleAndText(_this.map).title;
                btnElement.innerHTML = getTitleAndText(_this.map).text;

                _this.map.resize();
            }

            function getTitleAndText(map){
                let mapDomObj = $("#"+map.target);
                let title = "全屏";
                let text = ScreenFullSvg;
                if(mapDomObj.is(".dmap-map-fullscreen")){
                    title = "缩放";
                    text = ScreenFullCancelSvg;
                }

                return {title: title, text: text};
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

        if(this.map){
            let mapDomObj = $("#"+this.map.target);
            if(mapDomObj.is(".dmap-map-fullscreen")){
                mapDomObj.removeClass("dmap-map-fullscreen"); 
                //退出屏幕全屏
                var el = document.documentElement;
                if (document.exitFullscreen) {  
                    document.exitFullscreen();  
                }  
                else if (document.mozCancelFullScreen) {  
                    document.mozCancelFullScreen();  
                }  
                else if (document.webkitCancelFullScreen) {  
                    document.webkitCancelFullScreen();  
                }  
                else if (document.msExitFullscreen) {  
                    document.msExitFullscreen();  
                } 
                if(typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                }
            }
        }

        
    }
}