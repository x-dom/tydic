import DFeature from "./../feature/DFeature";
import {DPoint, DMultiPoint, DLineString, DMultiLineString, DPolygon, DMultiPolygon} from "./../geom/geom"
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import {Polygon} from 'ol/geom.js';
import {transform,transformExtent, fromLonLat, toLonLat, registerProjection, getCaculateProject} from './proj/proj';
import {getArea, getLength} from 'ol/sphere.js';

let wktFormat = new WKT();

/**
 * 解析GeoJSON数据
 * @param {*} geoJson 
 * @param {*} options
 */
const  parseGeoJson = function(geoJson, options) {

    let use_options = {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:4326'};
    options = options||{};
    $.extend(use_options, options);
    let parse = new GeoJSON(use_options);//解析工具

    let type = $.type(geoJson);//数据类型
    let result = [];//结果
    let dataArr = [];//内部处理数据

    //字符串
    if(type === "string"){
        geoJson = JSON.parse(geoJson);
        type = $.type(geoJson);
    }

    //数组
    if(type === "array"){
        dataArr = geoJson;
    }

    if(type === "object"){
        dataArr = [geoJson];
    }

    //遍历处理
    for (let i = 0; i < dataArr.length; i++) {
        const data = dataArr[i];
        let fs =  parse.readFeatures(data);
        for (let j = 0; j < fs.length; j++) {
            const f = fs[j];
            let geometry = f.getGeometry();
            if(geometry){
                let coordinates = geometry.getCoordinates();
                let properties = f.getProperties();
                let type = geometry.getType();
                let dgeom,dfeature;
                if(type.toUpperCase() == "POINT"){
                    dgeom = new DPoint({coordinates: coordinates, projection:use_options.featureProjection});
                } else  if(type.toUpperCase() == "MULTIPOINT"){
                    dgeom = new DMultiPoint({coordinates: coordinates, projection:use_options.featureProjection});
                } else  if(type.toUpperCase() == "LINESTRING"){
                    dgeom = new DLineString({coordinates: coordinates, projection:use_options.featureProjection});
                } else  if(type.toUpperCase() == "MULTILINESTRING"){
                    dgeom = new DMultiLineString({coordinates: coordinates, projection:use_options.featureProjection});
                } else  if(type.toUpperCase() == "POLYGON"){
                    dgeom = new DPolygon({coordinates: coordinates, projection:use_options.featureProjection});
                } else  if(type.toUpperCase() == "MULTIPOLYGON"){
                    dgeom = new DMultiPolygon({coordinates: coordinates, projection:use_options.featureProjection});
                }

                if(dgeom){
                    delete properties['geometry'];
                    dfeature = new DFeature({geometry: dgeom, properties: properties});
                    result.push(dfeature);
                }
            }
        }
    }

    return result;
};

/**
 * 通过接口地址查询数据并解析
 * @param {*} url 
 * @param {*} params 
 * @param {*} type 
 * @param {*} callBack 
 * @param {*} options 
 */
const parseGeoJsonByUrl = function(url, params, type, callBack, options) {
    $.ajax({
            method: type||'get',
            url: url,
            dataType: 'json',
            success: function(data){
                let result = parseGeoJson(data, options);
                callBack(result);
            },
            error: function(e) {
                console.log(e);
            }
    });
}

/**
 * 解决WKT字符串，返回迪图几何类型
 * @param {*} wkt 
 * @param {*} options 
 */ 
export const parseGeometryByWkt = function(wkt, options) {
    let use_options = {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:4326'};
    options = options||{};
    $.extend(use_options, options);

    //注册确保坐标系存在
    registerProjection(use_options.dataProjection);
    registerProjection(use_options.featureProjection);

    let feature = wktFormat.readFeature(wkt, use_options);
    let geometry = feature.getGeometry();

    let coordinates = geometry.getCoordinates();
    let type = geometry.getType();
    let dgeom;
    if(type.toUpperCase() == "POINT"){
        dgeom = new DPoint({coordinates: coordinates, projection:use_options.featureProjection});
    } else  if(type.toUpperCase() == "MULTIPOINT"){
        dgeom = new DMultiPoint({coordinates: coordinates, projection:use_options.featureProjection});
    } else  if(type.toUpperCase() == "LINESTRING"){
        dgeom = new DLineString({coordinates: coordinates, projection:use_options.featureProjection});
    } else  if(type.toUpperCase() == "MULTILINESTRING"){
        dgeom = new DMultiLineString({coordinates: coordinates, projection:use_options.featureProjection});
    } else  if(type.toUpperCase() == "POLYGON"){
        dgeom = new DPolygon({coordinates: coordinates, projection:use_options.featureProjection});
    } else  if(type.toUpperCase() == "MULTIPOLYGON"){
        dgeom = new DMultiPolygon({coordinates: coordinates, projection:use_options.featureProjection});
    }

    return dgeom;
}

/**
 * 根据参数创建圆坐标
 * @description 默认4326坐标以4496画圆，返回4326坐标数组
 * @param {*} x 
 * @param {*} y 
 * @param {*} radius 
 * @param {*} sizes 
 * @param {*} sourceProj 
 */
const createCircleByXY = function(x, y, radius, sizes, sourceProj) {
    let coords = [];
    radius = radius|| 10;
    sizes = sizes || 64;

    let targetProj = getCaculateProject([x,y],sourceProj);
    sourceProj = sourceProj || "EPSG:4326";

    let point = transform([x,y],sourceProj, targetProj);
    x = point[0];
    y = point[1];
    for(let i = 0; i < sizes; i++){
        let angle = (i/sizes) * Math.PI * 2.0;
        let dx = Math.cos( angle ) * radius;
        let dy = Math.sin( angle ) * radius;
        coords[i] = [x + dx, y + dy];
        coords[i] = transform(coords[i],targetProj, sourceProj);
    }
    coords[sizes] = coords[0];
    return coords;
}

/**
 * 根据参数创建正方形
 * @description 默认4326坐标以4496画圆，返回4326坐标数组
 * @param {*} x 
 * @param {*} y 
 * @param {*} radius 
 * @param {*} angle 
 * @param {*} sourceProj 
 */
const createSquareByXY = function(x, y, radius, angle, sourceProj) {
	let coords = [];
    let sizes = 4;
    radius = radius|| 10;

    //将半径当做边长重新计算半径
    radius = Math.sqrt(2*Math.pow(radius/2,2));
    angle = angle || 0;

    let targetProj = getCaculateProject([x,y],sourceProj);
    sourceProj = sourceProj || "EPSG:4326";

    let point = transform([x,y],sourceProj, targetProj);
    x = point[0];
    y = point[1];
    for(let i = 0; i < sizes; i++){
        let angl = (i/sizes) * Math.PI * 2.0 + (45/360+ angle/360)*Math.PI*2.0;
        let dx = Math.cos( angl ) * radius;
        let dy = Math.sin( angl ) * radius;
        coords[i] = [x + dx, y + dy];
        coords[i] = transform(coords[i],targetProj, sourceProj);
    }
    coords[sizes] = coords[0];
    return coords;
}

/**
 * 根据参数创建六边形
 * @description 默认4326坐标以4496画圆，返回4326坐标数组
 * @param {*} x 
 * @param {*} y 
 * @param {*} radius 
 * @param {*} angle 
 * @param {*} sourceProj 
 */
const createHexagonByXY = function(x, y, radius, angle, sourceProj) {
    let coords = [];
    let sizes = 6;
    radius = radius|| 10;
    angle = angle || 0;
    
    let targetProj = getCaculateProject([x,y],sourceProj);
    sourceProj = sourceProj || "EPSG:4326";

    let point = transform([x,y],sourceProj, targetProj);
    x = point[0];
    y = point[1];
    for(let i = 0; i < sizes; i++){
        let angl = (i/sizes) * Math.PI * 2.0 + (angle/360)*Math.PI*2.0;
        let dx = Math.cos( angl ) * radius;
        let dy = Math.sin( angl ) * radius;
        coords[i] = [x + dx, y + dy];
        coords[i] = transform(coords[i],targetProj, sourceProj);
    }
    coords[sizes] = coords[0];
    return coords;
}

/**
 * 绘制扇形工具
 * @param {*} origin 原点
 * @param {*} radius  半径
 * @param {*} sAngle 弧半角
 * @param {*} angle 角度 
 * @param {*} sourceProj 数组坐标系 
 * 
 * @description
 * 弧度= 角度 * Math.PI / 180
 * 角度= 弧度 * 180 / Math.PI 
 */
export const createSectorByXY = function (x, y, radius, sAngle, angle, sourceProj) {
    let coords = [];
    coords[0] = [x, y];

    let targetProj = getCaculateProject([x,y],sourceProj);
    sourceProj = sourceProj || "EPSG:4326";

    let point = transform([x,y],sourceProj, targetProj);
    x = point[0];
    y = point[1];

    //计算弧点数
    let sides = 64;
    sides = Math.ceil(Math.abs(sAngle)/90*16);
    
    for (var j = 1; j < sides; j++) {
        let dx = radius * Math.cos(Math.PI / 180 * (90 - angle + (sides / 2 - j) * sAngle / (sides - 2)));
        let dy = radius * Math.sin(Math.PI / 180 * (90 - angle + (sides / 2 - j) * sAngle / (sides - 2)));

        coords[j] = [x + dx, y + dy];
        coords[j] = transform(coords[j],targetProj, sourceProj);
    }
    coords.push(coords[0]);
    return coords;
}

/**
 * 获取扇形中心位置
 * @param {*} origin 原点
 * @param {*} radius  半径
 * @param {*} sAngle 弧半角
 * @param {*} angle 角度 
 * @param {*} sourceProj 数组坐标系 
 * 
 * @description
 * 弧度= 角度 * Math.PI / 180
 * 角度= 弧度 * 180 / Math.PI 
 */
export const getSectorCenterByXY = function (x, y, radius, sAngle, angle, sourceProj) {
    let coords = [];
    coords[0] = [x, y];

    let targetProj = getCaculateProject([x,y],sourceProj);
    sourceProj = sourceProj || "EPSG:4326";

    let point = transform([x,y],sourceProj, targetProj);
    x = point[0];
    y = point[1];

    //计算弧点数
    let sides = 64;
    sides = Math.ceil(Math.abs(sAngle)/90*16);
    
    for (var j = 1; j < sides; j++) {
        let dx = radius * Math.cos(Math.PI / 180 * (90 - angle + (sides / 2 - j) * sAngle / (sides - 2)));
        let dy = radius * Math.sin(Math.PI / 180 * (90 - angle + (sides / 2 - j) * sAngle / (sides - 2)));

        coords[j] = [x + dx, y + dy];
        coords[j] = transform(coords[j],targetProj, sourceProj);
    }
    coords.push(coords[0]);
    let polygon = new Polygon([coords]);
    let cPoint = polygon.getInteriorPoint();
    return cPoint.getCoordinates();
}


/**
 * 根据参数创建椭圆坐标
 * @description 默认4326坐标以4496画圆，返回4326坐标数组
 * @param {*} x 
 * @param {*} y 
 * @param {*} radiusX //X半轴
 * @param {*} radiusY //Y半轴
 * @param {*} angle 
 * @param {*} sizes 
 * @param {*} sourceProj 
 */
export const createEllipseByXY = function(x, y, radiusX, radiusY, angle, sizes, sourceProj) {
    let coords = [];
    radiusX = radiusX || 60;
    radiusY = radiusY || 40;
    sizes = sizes || 64;

    let targetProj = getCaculateProject([x,y],sourceProj);
    sourceProj = sourceProj || "EPSG:4326";

    let point = transform([x,y],sourceProj, targetProj);
    x = point[0];
    y = point[1];
    for(let i = 0; i < sizes; i++){
        let radians = (i/sizes) * Math.PI * 2.0;
        let dx = Math.cos( radians ) * radiusX;
        let dy = Math.sin( radians ) * radiusY;
        coords[i] = [x + dx, y + dy];
        coords[i] = getTransPoint(coords[i][0], coords[i][1], x, y, angle);
        coords[i] = transform(coords[i],targetProj, sourceProj);
    }
    coords[sizes] = coords[0];

    return coords;
}

/**
 * 获取相对旋转点
 * @param {*} x1 点X坐标
 * @param {*} y1 点Y坐标
 * @param {*} x2 相对点X坐标
 * @param {*} y2 相对点Y坐标
 * @param {*} angle 角度
 */
export const getTransPoint = function (x1, y1, x2, y2, angle){
    var l = Math.sqrt(Math.pow(x1 - x2,2)+Math.pow(y1 - y2, 2));
    var radians =  (Math.PI / 180) * angle;
    var cosa = (x1 - x2)/l;
    var sina = (y1 - y2)/l;
    var siny = sina * Math.cos(radians) + Math.sin(radians) * cosa;
    var cosy = cosa * Math.cos(radians) - Math.sin(radians) * sina

    return [(x2 + l*cosy), (y2 + l*siny)];
}

/**
 * 抛物线方程
 * @param {*} coordinate1 
 * @param {*} coordinate2 
 * @param {*} height 
 * @param {*} num 
 * @param {*} projection 
 */
export const parabolaEquation = function (coordinate1, coordinate2, height, num, projection) {
    projection = projection|| "EPSG:4326";
    if(projection != "EPSG:4326"){
        coordinate1 = transform(coordinate1, projection, "EPSG:4326");
        coordinate2 = transform(coordinate2, projection, "EPSG:4326");
    }

    var options = {
        pt1: {
            lon: coordinate1[0],
            lat: coordinate1[1],
        },
        pt2: {
            lon: coordinate2[0],
            lat: coordinate2[1],
        },
        height: height,
        num: num
    }

    //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
    // var h = options.height && options.height > 5000 ? options.height : 5000;
    var startH = coordinate1[2]||0;
    var endH = coordinate2[2]||0;
    var valid = true;

    var h = options.height || 100;
    var L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
    // var num = options.num && options.num > 50 ? options.num : 50;
    var num = options.num || 16;
    var result = [];
    // result.push(coordinate1);

    var dlt = L / num;
    if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
        var delLat = (options.pt2.lat - options.pt1.lat) / num;
        if (options.pt1.lon - options.pt2.lon > 0) {
            dlt = -dlt;
        }
        for (var i = 0; i < num; i++) {
            var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
            var lon = options.pt1.lon + dlt * i;
            var lat = options.pt1.lat + delLat * i;
            result.push([lon, lat, tempH]);
            // if(tempH == h){
            //     valid = false;
            // }

            // if(valid){
            //     if(tempH >= startH){
            //         result.push([lon, lat, tempH]);
            //     }
            // } else {
            //     if(tempH >= endH){
            //         result.push([lon, lat, tempH]);
            //     }
            // }
            
        }
    } else {//以lat为基准
        var delLon = (options.pt2.lon - options.pt1.lon) / num;
        if (options.pt1.lat - options.pt2.lat > 0) {
            dlt = -dlt;
        }
        for (var i = 0; i < num; i++) {
            var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
            var lon = options.pt1.lon + delLon * i;
            var lat = options.pt1.lat + dlt * i;
            result.push([lon, lat, tempH]);
            // if(tempH == h){
            //     valid = false;
            // }

            // if(valid){
            //     if(tempH >= startH){
            //         result.push([lon, lat, tempH]);
            //     }
            // } else {
            //     if(tempH >= endH){
            //         result.push([lon, lat, tempH]);
            //     }
            // }
        }
    }
    result.push(coordinate2);
    
    return result;
}

// /**
//  * 获取线段中心位置
//  */
// export const getCenterOfLineString = function(lines, projection){
    
// };

// /**
//  * 获取几何图形中心位置
//  */
// export const getCenterOfPolygon = function(polygons, projection){

// };

export {
    registerProjection,
    parseGeoJson, 
    parseGeoJsonByUrl, 
    createCircleByXY,
    createSquareByXY,
    createHexagonByXY,
    transform, 
    transformExtent,
    fromLonLat, 
    toLonLat, 
    getArea, 
    getLength
    };