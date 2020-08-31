import DBaseControl from "./DBaseControl";
import {SatelliteSvg} from "./DControlSvg";
import {DTileXYZLayer} from "./../layer/layer";

/**
 * 卫星地图控制
 */
export default class DSatelliteControl extends DBaseControl {
    constructor(options) {
        let use_options = {
            on2D: true,
            on3D: true,
            isShowControl: false,
            isShowSymbol: true,
            isShowSatellite: false,
            imageLayerUrl: {
                url: '//webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6',
                value: ['01','02','03', '04']
            },
            symbolLayerUrl: {
                url: '//webst{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=8&ltype=5&x={x}&y={y}&z={z}',
                value: ['01','02','03', '04']
            }
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;
        this.target = use_options.target;
        this.isShowControl = use_options.isShowControl;
        this.isShowSymbol = use_options.isShowSymbol;
        this.isShowSatellite = use_options.isShowSatellite;
        this.imageLayerUrl = use_options.imageLayerUrl;
        this.symbolLayerUrl = use_options.symbolLayerUrl;
        this.imageLayer,this.symbolLayer;
        this.create();
    }

    //创建
    create() {
        let _this = this;
        this.destroy();

        if(_this.map) {
            let root = _this.target;
            let classPosition = " dmap-control-left";
            if(!root){
                classPosition = " dmap-control-absolute"
                root = document.getElementById(_this.map.target);
            }
            _this.element = document.createElement("div");
            _this.element.className = "dmap-control dmap-satellitte"+classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = "卫星地图";
            btnElement.innerHTML = SatelliteSvg;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);

            //创建面板
            _this.content = document.createElement("div");
            if(_this.isShowSatellite){
                _this.content.className = "dmap-satellitte-content select2";
            } else {
                _this.content.className = "dmap-satellitte-content select1";
            }
            _this.content.style.display = _this.isShowControl?"block":"none";
            document.getElementById(_this.map.target).appendChild(_this.content);

            //创建图层
            _this.imageLayer = new DTileXYZLayer({
                map: _this.map,
                url: _this.imageLayerUrl.url,
                value: _this.imageLayerUrl.value,
                visible: _this.isShowSatellite,
                on2D: _this.on2D,
                on3D: _this.on3D,
            });

            if(_this.isShowSymbol){
                _this.symbolLayer = new DTileXYZLayer({
                    map: _this.map,
                    url: _this.symbolLayerUrl.url,
                    value: _this.symbolLayerUrl.value,
                    visible: _this.isShowSatellite,
                    on2D: _this.on2D,
                    on3D: _this.on3D,
                });
            }

            btnElement.onclick = function(){
                if(_this.content.style.display == "none"){
                    _this.content.style.display = "block";
                    _this.isShowControl = true;
                } else {
                    _this.content.style.display = "none";
                    _this.isShowControl = false;
                }
            }
            
            _this.content.onclick = function(){
                if(_this.isShowSatellite){
                    this.className = "dmap-satellitte-content select1";
                    _this.isShowSatellite = false;
                } else {
                    this.className = "dmap-satellitte-content select2";
                    _this.isShowSatellite = true;
                }
                _this.imageLayer.setVisible(_this.isShowSatellite);
                
                if(_this.symbolLayer){
                    _this.symbolLayer.setVisible(_this.isShowSymbol && _this.isShowSatellite);
                }
            }

            _this.show(_this.on2D, _this.on3D);
            _this.eventCode = _this.map.on("change:mode",function(evt){
                _this.show(_this.on2D, _this.on3D);
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

        if(this.content){
            this.content.parentElement.removeChild(this.content);
            this.content = undefined;
        }

        if(this.clearEnvent){
            this.clearEnvent();
        }

        if(this.imageLayer){
            this.imageLayer.clear();
            this.imageLayer = undefined;
        }

        if(this.symbolLayer){
            this.symbolLayer.clear();
            this.symbolLayer = undefined;
        }
    }
}