const Cesium = require('cesium/Cesium');
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import RegularShape from 'ol/style/RegularShape';
import {getTransPoint} from "./../geom";
import {colorHexToRgbaByObj} from './color';

/**
 * 设置颜色
 * @param {*} obj 
 * @param {*} options 
 */
export const setColor = (obj, options) => {
    let params = {value: '#FFFFFF', opacity: 1};

    if(options){
        params = options.color || params;
        let color = colorHexToRgbaByObj(params);
        obj.setColor(color)
    }

    return obj;
}

/**
 * 获取颜色Material颜色
 * @param {value: '#FFFFFF', opacity: 1} options 
 */
export const get3DColor = (options) => {
    options = options ||  {value: '#000000', opacity: 1};
    let color = colorHexToRgbaByObj(options);
    let result = Cesium.Color.fromCssColorString(color);
   
    return result;
}

/**
 * 获取填充样式
 * @param {*} options 
 */
export const getFill = (options) => {
    let result = false;

    if(options){
        result = new Fill(options);
        result = setColor(result, options);
    }

    return result;
}

/**
 * 获取边框样式
 * @param {*} options 
 */
export const getStroke = (options) => {
    let result = false;
    if(options){
        result = new Stroke(options);
        result = setColor(result, options);
    }

    return result;
}

/**
 * 获取有规律图形样式
 * @param {fill:*,stroke:*,type:*,points:*,radius:*,angle:*} options 
 */
let imageCache = {};
export const getRegularShapeImage = (options)=> {
    
    let image;

    let type = options.type;
    let fill = getFill(options.fill);
    let stroke = getStroke(options.stroke);
    
    let str = JSON.stringify(options);
    if(imageCache[str]){
        return imageCache[str];
    } else {
        options = options||{};
        if(type == 'square'){
            let opts = {points: 4, radius: 10, angle:  0};
            $.extend(opts, options);
            opts.angle = opts.angle/(180/Math.PI) + Math.PI / opts.points;
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                angle: opts.angle,
              });
        } else  if(type == 'hexagon'){
            let opts = {points: 6, radius: 10, angle: 0};
            $.extend(opts, options);
            opts.angle =  opts.angle/(180/Math.PI) + Math.PI / opts.points;
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                angle: opts.angle,
              });
        } else if(type == 'circle'){
            let opts = {points: 64, radius: 10, angle: 0};
            $.extend(opts, options);
            opts.angle =  opts.angle/(180/Math.PI) + Math.PI / opts.points;
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                angle: opts.angle,
              });
       
        } else  if(type == 'triangle'){
            let opts = {points: 3, radius: 10, angle: 0, rotation: Math.PI / 4};
            $.extend(opts, options);
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                rotation: opts.rotation,
                angle: opts.angle,
              });
        } else if(type == 'polygon'){
            let opts = {points: 64, radius: 10, angle: 0};
            $.extend(opts, options);
            opts.angle =  opts.angle/(180/Math.PI) + Math.PI / opts.points;
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                angle: opts.angle,
                });
        } else  if(type == 'star'){
            let opts = {points: 5, radius: 10, radius2: 4, angle: 0};
            $.extend(opts, options);
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                radius2: opts.radius2,
                angle: opts.angle,
              });
        } else  if(type == 'cross'){
            let opts = {points: 4, radius: 10, radius2: 0, angle: 0};
            $.extend(opts, options);
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                radius2: opts.radius2,
                angle: opts.angle,
              });
        } else  if(type == 'x'){
            let opts = {points: 4, radius: 10, radius2: 0, angle: Math.PI / 4};
            $.extend(opts, options);
            image = new RegularShape({
                fill: fill,
                stroke: stroke,
                points: opts.points,
                radius: opts.radius,
                radius2: opts.radius2,
                angle: opts.angle,
              });
        }

        imageCache[str] = image.getImage().toDataURL();
        return imageCache[str];
    }
} 



/**
 * 获取扇形图片
 * @param {*} radius 
 * @param {*} sAngle 
 * @param {*} angle 
 */
export const getSectorImage = function (options) {
    let str = JSON.stringify(options);
    if(imageCache[str]){
        return imageCache[str];
    } else {
        let radius = options.radius || 10;
        let sAngle = options.sAngle || 60;
        let angle = options.angle || 0;
        let x = radius;
        let y = radius;

        let path = "";
        path += x + " " + y ;

        //计算弧点数
        let sides = 64;
        sides = Math.ceil(Math.abs(sAngle)/90*16);
        
        for (var j = 1; j < sides; j++) {
            let dx = x + radius * Math.cos(Math.PI / 180 * (90 - angle + (sides / 2 - j) * sAngle / (sides - 2)));
            let dy = y + radius * Math.sin(Math.PI / 180 * (90 - angle + (sides / 2 - j) * sAngle / (sides - 2)));

            path += "," + dx + " " + dy;
        }

        let svg = "<svg id='svg-wrap' version='1.1' \
        viewBox='0 0 "+radius*2+" "+radius*2+"' \
        xmlns='http://www.w3.org/2000/svg'><polygon \
        points= '"+path+"' style='\
        fill:"+ colorHexToRgbaByObj(options.fill.color) +";\
        stroke:"+ colorHexToRgbaByObj(options.stroke.color) +";\
        stroke-width:"+options.stroke.width +";\
        stroke-dasharray:"+options.stroke.lineDash +";\
        '></polygon></svg>";

        let canvas = document.createElement("canvas");
        var img = new Image();
        img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
        img.onload = function() {
            //将canvas的宽高设置为图像的宽高
            canvas.width = img.width;
            canvas.height = img.height;
            
            //canvas画图片
            canvas.getContext("2d").drawImage(img, 0, 0);
            imageCache[str] = canvas.toDataURL("image/png");
            return imageCache[str];
        }

        
        imageCache[str] = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
        return imageCache[str];
    }
} 

/**
 * 获取椭圆形图片
 * @param {*} radiusX 
 * @param {*} radiusY 
 * @param {*} angle 
 */
export const getEllipseImage = function (options) {
    let str = JSON.stringify(options);
    if(imageCache[str]){
        return imageCache[str];
    } else {
        let radiusX = options.radiusX || 60;
        let radiusY = options.radiusY || 40;
        let angle = options.angle || 0;

        let path = "";
        //计算弧点数
        let sides = 64;
        for (var j = 0; j < sides; j++) {
            let radians = (j/sides) * Math.PI * 2.0;
            let dx = radiusX + Math.cos( radians ) * radiusX;
            let dy = radiusX + Math.sin( radians ) * radiusY;
            let coord = getTransPoint(dx, dy, radiusX, radiusX, angle);
            dx = coord[0];
            dy = coord[1];

            if(j == 0){
                path += dx + " " + dy;
            } else {
                path += "," + dx + " " + dy;
            }
        }
        
        let svg = "<svg id='svg-wrap' version='1.1' \
        viewBox='0 0 "+radiusX*2+" "+radiusX*2+"' \
        xmlns='http://www.w3.org/2000/svg'><polygon \
        points= '"+path+"' style='\
        fill:"+ colorHexToRgbaByObj(options.fill.color) +";\
        stroke:"+ colorHexToRgbaByObj(options.stroke.color) +";\
        stroke-width:"+options.stroke.width +";\
        stroke-dasharray:"+options.stroke.lineDash +";\
        '></polygon></svg>";

        let canvas = document.createElement("canvas");
        var img = new Image();
        img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
        img.onload = function() {
            //将canvas的宽高设置为图像的宽高
            canvas.width = img.width;
            canvas.height = img.height;
            
            //canvas画图片
            canvas.getContext("2d").drawImage(img, 0, 0);
            imageCache[str] = canvas.toDataURL("image/png");
            return imageCache[str];
        }

        
        imageCache[str] = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
        return imageCache[str];
    }
} 