import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {transform as oltransform,transformExtent as oltransformExtent, get as olGetProjection, fromLonLat as olfromLonLat, toLonLat as oltoLonLat} from 'ol/proj.js';


/**
 * 坐标转换工具
 * ***************
 */
//自定义坐标配置
const projConfig ={
    "EPSG:4496" : "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
    "EPSG:4490" : "+proj=longlat +ellps=GRS80 +no_defs",
    "EPSG:27700" : "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs",
};

/**
 * 注册坐标系
 * @param {*} projection 
 */
export const registerProjection = function(projection){
    let result = true;
    let proj = olGetProjection(projection);

    if(!proj){
        if(projConfig[projection]){
            proj4.defs(projection,projConfig[projection]);
            register(proj4);
        } else {
            result = false;
            console.error("坐标系"+projection+"未定义,注册失败");
        }
    }

    return result;
}

/**
 * 坐标转换
 * @param {*} coordinate 
 * @param {*} source 
 * @param {*} destination 
 */
export function transform(coordinate, source, destination){
    registerProjection(source);
    registerProjection(destination);
    coordinate[0] = Number(coordinate[0]);
    coordinate[1] = Number(coordinate[1]);
    let result = coordinate;
    if(source != destination){
        result = oltransform(coordinate,source,destination);
    }
    return result;
};

/**
 * 坐标范围转换
 * @param {*} extent 
 * @param {*} source 
 * @param {*} destination 
 */
export function transformExtent(extent, source, destination){
    registerProjection(source);
    registerProjection(destination);
    let result = extent;
    if(source != destination){
        result = oltransformExtent(extent,source,destination);
    }
    return result;
    return result;
};

/**
 * 坐标转换
 * @param {*} coordinate 
 * @param {*} opt_projection 
 */
export function fromLonLat(coordinate, opt_projection){
    registerProjection(opt_projection);
    let result = olfromLonLat(coordinate,opt_projection);
    return result;
};

/**
 * 4326坐标转换
 * @param {*} coordinate 
 * @param {*} opt_projection 
 */
export function toLonLat(coordinate, opt_projection){
    registerProjection(opt_projection);
    let result = oltoLonLat(coordinate,opt_projection);
    return result;
};

/**
 * 获取计算几何坐标系
 * @param {*} coordinate 
 * @param {*} projection 
 */
export const getCaculateProject = function(coordinate, projection){
    let caculateProject = "EPSG:3857";
    let validCoords = transform(coordinate, projection, "EPSG:4326");
    if(102.0 < validCoords[0] && validCoords[0] < 108.0 && 17.75 < validCoords[1] && validCoords[1] < 42.47){
        caculateProject = "EPSG:4496";
    }

    return caculateProject;
}


/**
 * 火星坐标处理
 * ***************
 */
export const  ExtendUtil = {
    transformLat : function transformLat(x, y) {
        var pi = 3.1415926535897932384626;
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon : function transformLon(x, y) {
        var pi = 3.1415926535897932384626;
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
        return ret;
    },

    transform : function transform(lon, lat) {
        var pi = 3.1415926535897932384626;
        var ee = 0.00669342162296594323;
        var a = 6378245.0;
        var dLat = ExtendUtil.transformLat(lon - 105.0, lat - 35.0);
        var dLon = ExtendUtil.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * pi;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        var mgLat = parseFloat(lat) + parseFloat(dLat);
        var mgLon = parseFloat(lon) + parseFloat(dLon);
        return {
            "x": mgLon,
            "y": mgLat
        };
    },
    gps84ToGcj02 : function gps84ToGcj02(lon, lat) {
        var pi = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var dLat = ExtendUtil.transformLat(lon - 105.0, lat - 35.0);
        var dLon = ExtendUtil.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * pi;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        var mgLat = parseFloat(lat) + parseFloat(dLat);
        var mgLon = parseFloat(lon) + parseFloat(dLon);
        return {
            "x": mgLon,
            "y": mgLat
        };
    },
    gcjToGps84 : function gcjToGps84(lon, lat) {
        var lonlat = ExtendUtil.transform(lon, lat);
        var lontitude = lon * 2 - lonlat.x;
        var latitude = lat * 2 - lonlat.y;
        return {
            "x": lontitude,
            "y": latitude
        };
    }
};
