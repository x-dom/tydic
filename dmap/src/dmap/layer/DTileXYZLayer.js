const Cesium = require('cesium/Cesium');
import DLayer from "./DLayer";
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image';
import Raster from 'ol/source/Raster';
import XYZ from 'ol/source/XYZ.js';

/**
 * XYZ图层服务
 */
export default class DTileXYZLayer extends DLayer{
    constructor(options) {
        let use_options = {
            url: '//webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6', //卫星地图
            value: ['01','02','03', '04']
        };

        $.extend(use_options, options);
        super(use_options);
        this.options = use_options;
        this.type = 'TileXYZLayer';
        this.opacity = use_options.opacity || 1;
        this.url = use_options.url;
        this.value = use_options.value;

        this.layer2d = undefined;
        this.layer3d = undefined;

        this.render();
    }

    /**
     * 渲染
     */
    render() {
        let _this = this;
        _this.clear();

        if(_this.map){
            //2D
            if(_this.map.map2D){
                _this.layer2d = new TileLayer({
                    source: new XYZ({
                      urls: getLayerURLsOfXYZRaster(_this.url, _this.value)
                    })
                });
                _this.map.map2D.addLayer(_this.layer2d);

                //叠加顺序
                if(_this.index){
                    _this.layer2d.setZIndex(_this.index);
                }

                //透明度
                if(_this.opacity){
                    _this.layer2d.setOpacity(_this.opacity);
                }
            }

            //3D
            if(_this.map.map3D){
                var layer3d = new Cesium.UrlTemplateImageryProvider({
                    url: _this.url,
                    subdomains: _this.value,
                    tileWidth: 256,
                    tileHeight: 256,
                    minimumLevel: _this.minZoom,
                    maximumLevel: _this.maxZoom,
                });
                _this.layer3d = _this.map.map3D.imageryLayers.addImageryProvider(layer3d);

                if(_this.opacity){
                    _this.layer3d.alpha = _this.opacity;
                }
            }

            //设置可见性
            _this.setVisible(_this.visible);

            //创建地图层级改变事件
            let zoomChangeCode = _this.map.eventObj.on("change:zoom",function(evt){
                _this.setVisible(_this.visible);
            });

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(zoomChangeCode);
                }
            }
        }
    }

    /**
     * 清空图层
     */
    clear() {
        if(this.layer2d && this.map.map2D){
            this.map.map2D.removeLayer(this.layer2d);
            this.layer2d = undefined;
        }
        
        if(this.layer3d && this.map.map3D){
            this.map.map3D.imageryLayers.remove(this.layer3d);
            this.layer3d = undefined;
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
     * 设置透明度
     * @param {*} opacity 
     */
    setOpacity(opacity){
        this.opacity = opacity;
        if(this.layer2d){
            this.layer2d.setOpacity(this.opacity);
        }

        if(this.layer3d){
            this.layer3d.alpha = this.opacity;
        }
    }

    /**
     * 设置图层顺序
     * @param number index 
     */
    setIndex(index) {
        if(index){
            this.index = index;
            if(this.layer2d){
                this.layer2d.setZIndex(index);
            }
        }
    }

    /**
     * 设置最小显示层级
     * @param number minZoom 
     */
    setMinZoom(minZoom) {
        this.minZoom = minZoom;
        this.setVisible(this.visible);
    }
    
    /**
     * 设置最大显示层级
     * @param number maxZoom 
     */
    setMaxZoom(maxZoom) {
        this.maxZoom = maxZoom;
        this.setVisible(this.visible);
    }

    /**
     * 设置是否可见
     * @param boolean visible 
     */
    setVisible(visible) {
        this.visible = !!visible;

        if(this.map){
            let zoom = this.map.zoom;
            //判断是否在可显示范围内
            if((this.maxZoom && zoom > this.maxZoom) || (this.minZoom && zoom < this.minZoom)){
                visible = false;
            }

            if(this.layer2d){
                this.layer2d.setVisible(visible);
            }

            
            //添加三维数据
            if(this.layer3d){
                this.layer3d.show = visible;
            }
        }

        //当前可见性
        this.visibility = visible;
    }

    /**
     * 更新图层配置
     * @param {*} params 
     */
    updateParams(params) {
        $.extend(this, params);
        this.render();
    }
}

const getLayerURLsOfXYZRaster = function (url, value){
    var urls = [];
    value.forEach((o) => {
        urls.push(url.replace('{s}', o));
    });
    return urls;
}