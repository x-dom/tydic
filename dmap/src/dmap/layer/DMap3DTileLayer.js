import DLayer from "./DLayer";
import DEvent from "../event/DEvent";
import {DLayerInfoControl} from "../control/control"
const Cesium = require('cesium/Cesium');

/**
 * 3DTile图层
 */
export default class DMap3DTileLayer extends DLayer{
    constructor(options){
        let use_options = 
        {   
            url: null,
            infoWindowOptions: {
                show: true,
                touchType: "click",
                styleType: "blue",
                title: "要素信息",
                on2D: true,
                on3D: true,
                width: 200
            },
            //附加shader
            extraShader: {
                shaderDebug: false,
                headVS: '',
                contentVS: '',
                headFS: '',
                contentFS: '',
            },
            cesium3DTileStyleJson: {
                color : `vec4(0, 0.5, 1.0,1)`,
            },
        };

        //合并参数
        options.infoWindowOptions = options.infoWindowOptions||{};
        options.infoWindowOptions = $.extend(use_options.infoWindowOptions, options.infoWindowOptions);
        options.extraShader = options.extraShader||{};
        options.extraShader = $.extend(use_options.extraShader, options.extraShader);
        options.cesium3DTileStyleJson = options.cesium3DTileStyleJson||{};
        options.cesium3DTileStyleJson = $.extend(use_options.cesium3DTileStyleJson, options.cesium3DTileStyleJson);
        $.extend(use_options, options);
        
        //继承父类
        super(use_options);
        
        this.options = use_options;
        this.url = use_options.url;//文件路径
        this.type = 'DMap3DTileLayer';//图层类型
        
        this.extraShader = use_options.extraShader;//shader
        this.cesium3DTileStyleJson = use_options.cesium3DTileStyleJson;//shader
        this.tileset;//3d图层对象
        this.eventObj = new DEvent();
        this.infoWindowOptions = use_options.infoWindowOptions;

        //默认执行渲染
        this.render();
    }  

    /**
     * 渲染
     */
    render() {
        var _this = this;

        //清空绘制
        _this.clear();

        if(_this.map && _this.url){
            let map3D = _this.map.map3D;

            //添加三维图层
            if(map3D){
                let tileset = new Cesium.Cesium3DTileset({
                    url: _this.url,
                    maximumScreenSpaceError: 128,//最大的屏幕空间误差
                    shaderDebug: _this.extraShader.shaderDebug,
                    headVS: _this.extraShader.headVS,
                    contentVS: _this.extraShader.contentVS,
                    headFS: _this.extraShader.headFS,
                    contentFS: _this.extraShader.contentFS,
                });
                tileset.style = new Cesium.Cesium3DTileStyle(_this.cesium3DTileStyleJson);
                _this.tileset = map3D.scene.primitives.add(tileset);
            }


            //设置可见性
            _this.setVisible(_this.visible);
            //弹窗
            _this.setInfoWindowOptions(_this.infoWindowOptions);

            //清除事件
            _this.clearEnvent = function (){
                if( _this.infoWindow){
                    _this.infoWindow.destroy();
                    _this.infoWindow = undefined;
                }
            }
        }
    }

    //清空图层数据
    clear(){
        //清空tileset
        if(this.map && this.map.map3D && this.tileset){
            this.map.map3D.scene.primitives.remove(this.tileset);
        }
        this.tileset = undefined;

        //清除事件
        if(this.clearEnvent){
            this.clearEnvent();
        }
    }

    /**
     * 设置地图
     * @param {*} map 
     */
    setMap(map){
        this.map = map;
        this.render();
    }

    /**
     * 设置是否可见
     * @param boolean visible 
     */
    setVisible(visible) {
        this.visible = visible;
        if(this.map){
            let zoom = this.map.zoom;
            //判断是否在可显示范围内
            if((this.maxZoom && zoom > this.maxZoom) || (this.minZoom && zoom < this.minZoom)){
                visible = false;
            }

            if(this.tileset){
                this.tileset.show = this.visible;
            }
        }
        //当前可见性
        this.visibility = visible;
    }

    /**
     * 查看全部
     */
    viewAll(){
        if(this.map3D && this.tileset){
            this.map3D.flyTo(this.tileset)
        }
    }

 /**
   * 绑定事件
   * @param {*} key 
   * @param {*} func 
   */
  on(key, func){
    let code = 0;
    switch (key) {
      case "click":
        code = this.eventObj.on(key,func);
        break;
      case "dblclick":
        code = this.eventObj.on(key,func);
        break;
      case "pointermove":
        code =  this.eventObj.on(key,func);
        break;
      default:
        console.error("Event type of "+key+" undefined!");
        break;
    }

    return code;
  }

  /**
   * 根据编号取消事件
   * @param {*} code 
   */
  unByCode(code){
    this.eventObj.unByCode(code);
  }

  /**
   * 设置信息窗体参数
   * @param {*} options 
   */
  setInfoWindowOptions(options){
    let _this = this;
    $.extend(_this.infoWindowOptions, options);
    if( _this.infoWindow){
        if(!_this.infoWindowOptions.show){
            _this.infoWindow.destroy();
            _this.infoWindow = undefined;
        } else {
            _this.infoWindow.refreshOverlay(_this.infoWindowOptions);
        }
    } else {
        if(_this.infoWindowOptions.show){
            _this.infoWindow = new DLayerInfoControl({
                layer: _this,
                touchType: _this.infoWindowOptions.touchType,
                styleType: _this.infoWindowOptions.styleType,
                title: _this.infoWindowOptions.title,
                params: _this.infoWindowOptions.params,
                on2D: _this.infoWindowOptions.on2D,
                on3D: _this.infoWindowOptions.on3D,
                offsetX: _this.infoWindowOptions.offsetX,
                offsetY: _this.infoWindowOptions.offsetY,
                width: _this.infoWindowOptions.width,
            });
        }
    }
  }
}