const Cesium = require('cesium/Cesium');
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image';
import Raster from 'ol/source/Raster';
import XYZ from 'ol/source/XYZ.js';

/**
 * 默认地图配置
 */
export const defaultDMapOptions = {
    style: "blue",
    // style: "light",
    target: 'map',//地图放置ID
    only2D: false,//是否只支持2D
    zoom: 17,//缩放比例
    minZoom: 3,
    maxZoom: 18,
    center: [104.0653, 30.6597],//中心位置
    projection: 'EPSG:4326',//参考系
    currentStatus: '2d',//当前显示状态
    baselayerUrl: {//底图
        // url: '//webst{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=8&ltype=2&x={x}&y={y}&z={z}', //只有路网 ltype=2/3/10/11
        // url: '//webst{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=8&ltype=5&x={x}&y={y}&z={z}', //只有标签 ltype=5/13
        // url: '//webst{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=8&ltype=0&x={x}&y={y}&z={z}', //路网加标签 ltype=0/6/14/15
        // url: '//webst{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=7&ltype=3&x={x}&y={y}&z={z}', //旧地图 2.5D
        url: '//webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7', //地图 2D
        
        // url: '//webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6', //卫星地图

        // url: '//webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',//卫星地图
        // url: '//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',//影像地图
        // url: '//wprd{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=8&ltype=11&x={x}&y={y}&z={z}',//路网地图
        // url: '//wprd{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=7&x={x}&y={y}&z={z}&ltype=2',//影像地图

        // imageLayer: '//webst{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6', //卫星地图
        // symbolLayer: '//webst{s}.is.autonavi.com/appmaptile?size=1&scl=1&style=8&ltype=5&x={x}&y={y}&z={z}', //只有标签 ltype=5/13
        value: ['01','02','03', '04']
    }
};

/**
 * 默认地图层级配置
 */
export const defaultDMapZommConfig = {
    20: 366.21 * Math.pow(2,(17-20)),
    19: 366.21 * Math.pow(2,(17-19)),
    18: 366.21 * Math.pow(2,(17-18)),
    17: 366.21 * Math.pow(2,(17-17)),
    16: 366.21 * Math.pow(2,(17-16)),
    15: 366.21 * Math.pow(2,(17-15)),
    14: 366.21 * Math.pow(2,(17-14)),
    13: 366.21 * Math.pow(2,(17-13)),
    12: 366.21 * Math.pow(2,(17-12)),
    11: 366.21 * Math.pow(2,(17-11)),
    10: 366.21 * Math.pow(2,(17-10)),
    9: 366.21 * Math.pow(2,(17-9)),
    8: 366.21 * Math.pow(2,(17-8)),
    7: 366.21 * Math.pow(2,(17-7)),
    6: 366.21 * Math.pow(2,(17-6)),
    5: 366.21 * Math.pow(2,(17-5)),
    4: 366.21 * Math.pow(2,(17-4)),
    3: 366.21 * Math.pow(2,(17-3)),
    2: 366.21 * Math.pow(2,(17-2)),
    1: 366.21 * Math.pow(2,(17-1)),
    0: 366.21 * Math.pow(2,(17-0)),
};

/**
 * 根据高度计算zoom值
 * @param Number height 
 */
export const getZoomByHeight = function (height){
    let z = height/366.21;
    let zoom = 17 - parseInt(Math.log(z)/Math.log(2));
    return zoom;
}

/**
 * 定义基本地图图层
 */
export const defineBaseMapLayers = function (baselayerUrl, minZoom, maxZoom){
    let baseMapLayers = {
        layer2D: {},
        layer3D: {}
    }

    //二维底图
    baseMapLayers.layer2D.vectorLayer = new TileLayer({
        source: new XYZ({
          urls: getLayerURLsOfXYZRaster(baselayerUrl.url, baselayerUrl.value)
        })
    });

    //二维深色底图
    baseMapLayers.layer2D.vectorDarkLayer = new ImageLayer({
        source: new Raster({
            sources: 
            [
                new XYZ({
                    urls: getLayerURLsOfXYZRaster(baselayerUrl.url, baselayerUrl.value),
                    crossOrigin: 'anonymous',
                    transition: 0
                  })
            ],
            operationType: 'pixel',
            operation: function (pixels, data) {
                var pixel = pixels[0];
                pixel[0] = 10;
                pixel[1] = 255 - pixel[1];
                pixel[2] = 255 - pixel[2] + 20;
                return pixel;
            }
        })
      });

    //三维底图
    baseMapLayers.layer3D.vectorLayer = new Cesium.UrlTemplateImageryProvider({
        url: baselayerUrl.url,
        subdomains: baselayerUrl.value,
        tileWidth: 256,
        tileHeight: 256,
        minimumLevel: minZoom,
        maximumLevel: maxZoom,
    });

    return baseMapLayers;
}

//解析XYZ栅格图层的URL地址信息
const getLayerURLsOfXYZRaster = function (url, value){
    var urls = [];
    value.forEach((o) => {
        urls.push(url.replace('{s}', o));
    });
    return urls;
}