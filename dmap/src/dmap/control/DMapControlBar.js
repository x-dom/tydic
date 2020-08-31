import {defaultToolBarOptions} from "./default/default";
import DHomeControl from "./DHomeControl";
import DZoomControl from "./DZoomControl";
import DNorthControl from "./DNorthControl";
import DMeasureControl from "./DMeasureControl";
import DSwitchControl from "./DSwitchControl";
import DFullScreenControl from "./DFullScreenControl";
import DCoordinatePickControl from "./DCoordinatePickControl";
import DOverviewControl from "./DOverviewControl";
import DLayerManageControl from "./DLayerManageControl";
import DPositionControl from "./DPositionControl";
import DSatelliteControl from "./DSatelliteControl";

/**
 * 地图工具控件面板
 */
export default class DMapControlBar{
    constructor(map,options){
        let use_options = defaultToolBarOptions;
        options = options||{};
        $.extend(use_options, options);
        this.controls = [];

        this.options = use_options;
        this.map = map;
        this.id = use_options.id|| ((new Date()).getTime() + "");

        this.create();
    }

    /**
     * 创建
     */
    create(){
        let _this = this;

        _this.destroy();

        if(_this.map && _this.map.target){

            if(!_this.element){
                _this.element = document.createElement("div");
                _this.element.className = "dmap-controlbar";
                document.getElementById(_this.map.target).appendChild(_this.element);
            }
            
            //添加主页
            if(_this.home){
                _this.home.setOptions(_this.options.home);
            } else {
                _this.home = new DHomeControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.home.on2D,
                    on3D: _this.options.home.on3D,
                    center: _this.options.home.center,
                    zoom: _this.options.home.zoom,
                    projection: _this.options.home.projection,
                });
                this.controls.push(_this.home);
            }

            //指北针
            if(_this.north){
                _this.north.setOptions(_this.options.north);
            } else {
                _this.north = new DNorthControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.north.on2D,
                    on3D: _this.options.north.on3D,
                });
                this.controls.push(_this.north);
            }

            //2/3D切换
            if(_this.switch){
                _this.switch.setOptions(_this.options.switch);
            } else {
                _this.switch = new DSwitchControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.switch.on2D,
                    on3D: _this.options.switch.on3D,
                });
                this.controls.push(_this.switch);
            }

            //放大、缩小
            if(_this.zoom){
                _this.zoom.setOptions(_this.options.zoom);
            } else {
                _this.zoom = new DZoomControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.zoom.on2D,
                    on3D: _this.options.zoom.on3D,
                });
                this.controls.push(_this.zoom);
            }

            //全屏
            if(_this.fullscreen){
                _this.fullscreen.setOptions(_this.options.fullscreen);
            } else {
                _this.fullscreen = new DFullScreenControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.fullscreen.on2D,
                    on3D: _this.options.fullscreen.on3D,
                });
                this.controls.push(_this.fullscreen);
            }
            
            //测量
            if(_this.measure){
                _this.measure.setOptions(_this.options.measure);
            } else {
                _this.measure = new DMeasureControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.measure.on2D,
                    on3D: _this.options.measure.on3D,
                });
                this.controls.push(_this.measure);
            }

            //定位
            if(_this.position){
                _this.position.setOptions(_this.options.position);
            } else {
                _this.position = new DPositionControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.position.on2D,
                    on3D: _this.options.position.on3D,
                });
                this.controls.push(_this.position);
            }
           
            //坐标拾取
            if(_this.coordinatepick){
                _this.coordinatepick.setOptions(_this.options.coordinatepick);
            } else {
                _this.coordinatepick = new DCoordinatePickControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.coordinatepick.on2D,
                    on3D: _this.options.coordinatepick.on3D,
                });
                this.controls.push(_this.coordinatepick);
            }
          
            //鹰眼
            if(_this.overview){
                _this.overview.setOptions(_this.options.overview);
            } else {
                _this.overview = new DOverviewControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.overview.on2D,
                    on3D: _this.options.overview.on3D,
                });
                this.controls.push(_this.overview);
            }
            
            //图层控制
            if(_this.layerManage){
                _this.layerManage.setOptions(_this.options.layerManage);
            } else {
                _this.layerManage = new DLayerManageControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.layerManage.on2D,
                    on3D: _this.options.layerManage.on3D,
                });
                this.controls.push(_this.layerManage);
            }

            //卫星地图
            if(_this.satellite){
                _this.satellite.setOptions(_this.options.satellite);
            } else {
                _this.satellite = new DSatelliteControl({
                    target: _this.element,
                    map: _this.map,
                    on2D: _this.options.satellite.on2D,
                    on3D: _this.options.satellite.on3D,
                });
                this.controls.push(_this.satellite);
            }

            //图例
            //框选
            //分屏
            //时间轴
        }
    }

    /**
     * 销毁
     */
    destroy(){
        for (let i = 0; i < this.controls.length; i++) {
            const control = this.controls[i];
            if(control.destroy){
                control.destroy();
            }
        }
    }
    
    //重新配置参数
    setOptions(options){
        options = options||{};
        $.extend(this.options, options);
        this.create();
    }

    /**
     * 重置地图
     * @param DMap map 
     */
    setMap(map){
        this.map = map;
        this.create();
    }
}