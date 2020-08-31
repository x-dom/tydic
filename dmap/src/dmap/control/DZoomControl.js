import DBaseControl from "./DBaseControl";
import {ZoomMaxSvg, ZoomMinSvg}  from  "./DControlSvg";

/**
 * 地图缩放控件
 */
export default class DZoomControl extends DBaseControl{
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
            _this.element.className = "dmap-control dmap-zoom" + classPosition;

            let zoomInElement = document.createElement("button");
            zoomInElement.className = "dmap-zoom-in";
            zoomInElement.title = "放大";
            // zoomInElement.innerHTML = "+";
            // zoomInElement.innerHTML = '<svg t="1567768676475" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1175"><path d="M449.28 868.096c-73.6 0-146.176-19.456-209.92-56.32-63.872-36.736-116.992-89.856-153.856-153.6-36.736-63.744-56.192-136.32-56.192-209.92s19.456-146.176 56.192-209.92C122.368 174.464 175.488 121.344 239.232 84.48c63.744-36.864 136.32-56.32 209.92-56.32 112.128 0 217.6 43.648 296.832 123.008s123.136 184.832 123.136 296.96-43.648 217.6-123.008 296.96c-79.232 79.36-184.704 123.008-296.832 123.008z m0-765.184c-92.16 0-178.816 35.84-243.968 101.12-65.152 65.152-101.12 151.936-101.12 244.096 0 92.288 35.84 178.944 100.992 244.096 65.152 65.152 151.808 101.12 244.096 101.12 60.416 0 120.192-16 172.544-46.208 52.352-30.208 96.128-73.984 126.464-126.336 30.208-52.352 46.208-112.128 46.208-172.672 0-60.544-16-120.192-46.208-172.672-30.208-52.352-73.984-96.128-126.336-126.336-52.48-30.208-112.128-46.208-172.672-46.208z" p-id="1176"></path><path d="M262.144 478.848c-20.608 0-37.376-16.768-37.376-37.376s16.768-37.376 37.376-37.376h360.832c20.608 0 37.376 16.768 37.376 37.376s-16.768 37.376-37.376 37.376H262.144z" p-id="1177"></path><path d="M958.208 994.56c-10.368 0-20.224-4.352-27.392-11.904l-213.76-213.888c-13.696-14.848-13.312-37.504 0.896-51.84 7.04-7.04 16.512-11.008 26.496-11.008 9.472 0 18.432 3.584 25.344 9.984l213.76 213.76 0.128 0.128c9.984 9.344 14.08 23.296 10.752 36.608-3.328 13.184-13.696 23.552-26.88 26.88-3.072 0.896-6.144 1.28-9.344 1.28zM442.624 659.2c-20.608 0-37.376-16.768-37.376-37.376V260.992c0-20.608 16.768-37.376 37.376-37.376s37.376 16.768 37.376 37.376v360.832c0 20.608-16.768 37.376-37.376 37.376z" p-id="1178"></path></svg>';
            zoomInElement.innerHTML = ZoomMaxSvg;
            _this.element.appendChild(zoomInElement);
            
            let zoomOutElement = document.createElement("button");
            zoomOutElement.className = "dmap-zoom-out";
            zoomOutElement.title = "缩小";
            // zoomOutElement.innerHTML = "−";
            // zoomOutElement.innerHTML = '<svg t="1567768722198" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1302"><path d="M449.28 868.096c-73.6 0-146.176-19.456-209.92-56.32-63.872-36.736-116.992-89.856-153.856-153.6-36.736-63.744-56.192-136.32-56.192-209.92s19.456-146.176 56.192-209.92C122.368 174.464 175.488 121.344 239.232 84.48c63.744-36.864 136.32-56.32 209.92-56.32 112.128 0 217.6 43.648 296.832 123.008s123.136 184.832 123.136 296.96-43.648 217.6-123.008 296.96c-79.232 79.36-184.704 123.008-296.832 123.008z m0-765.184c-92.16 0-178.816 35.84-243.968 101.12-65.152 65.152-101.12 151.936-101.12 244.096 0 92.288 35.84 178.944 100.992 244.096 65.152 65.152 151.808 101.12 244.096 101.12 60.416 0 120.192-16 172.544-46.208 52.352-30.208 96.128-73.984 126.464-126.336 30.208-52.352 46.208-112.128 46.208-172.672 0-60.544-16-120.192-46.208-172.672-30.208-52.352-73.984-96.128-126.336-126.336-52.48-30.208-112.128-46.208-172.672-46.208z" p-id="1303"></path><path d="M262.144 478.848c-20.608 0-37.376-16.768-37.376-37.376s16.768-37.376 37.376-37.376h360.832c20.608 0 37.376 16.768 37.376 37.376s-16.768 37.376-37.376 37.376H262.144zM958.208 994.56c-10.368 0-20.224-4.352-27.392-11.904l-213.76-213.888c-13.696-14.848-13.312-37.504 0.896-51.84 7.04-7.04 16.512-11.008 26.496-11.008 9.472 0 18.432 3.584 25.344 9.984l213.76 213.76 0.128 0.128c9.984 9.344 14.08 23.296 10.752 36.608-3.328 13.184-13.696 23.552-26.88 26.88-3.072 0.896-6.144 1.28-9.344 1.28z" p-id="1304"></path></svg>';
            zoomOutElement.innerHTML = ZoomMinSvg;
            _this.element.appendChild(zoomOutElement);

            root.appendChild(_this.element);
        
            let map = _this.map;
            zoomInElement.onclick = function(){
                let zoom  = parseInt(map.zoom)+1;
                map.setZoom(zoom);
            }
            
            zoomOutElement.onclick = function(){
                let zoom  = parseInt(map.zoom)-1;
                map.setZoom(zoom);
            }

            _this.show(_this.on2D, _this.on3D);
        }
    }
}