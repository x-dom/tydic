const Cesium = require('cesium/Cesium');
import {colorHexToRgbaByObj} from './color';
import {HorizontalOrigin, VerticalOrigin} from './../../enum/Enum';
import {getRegularShapeImage, getSectorImage} from "./../style";
import {getNumberFromData} from "./../common/number";
import {defaultDMapZommConfig} from "./../../default/default";

/**
 * 解析三维样式
 * @param {*} styleJson 
 * @param DFeature feature 
 */
export const parse3DStyle = function(styleJson, feature) {
    let use_options = {};
    styleJson = styleJson||{};
    $.extend(use_options, styleJson);

    let result = [];
    if(use_options.type){
        if(use_options.type.toUpperCase() == "POINT" || use_options.type.toUpperCase() == "MULTIPOINT"){
            result = parsePointStyle(use_options, feature);
        } else if(use_options.type.toUpperCase() == "LINE" || use_options.type.toUpperCase() == "LINESTRING" || use_options.type.toUpperCase() == "MULTILINESTRING"){
            result = parseLineStyle(use_options, feature);
        } else if(use_options.type.toUpperCase() == "POLYGON" || use_options.type.toUpperCase() == "MULTIPOLYGON"){
            result = parsePolygonStyle(use_options, feature);
        }
    }
    return result;
};

/**
 * 解析点样式
 * @param {*} styleJson 
 * @param {*} feature 
 */
const parsePointStyle = function(styleJson, feature) {
    let result = [];
    let geometry = feature.geometry;
    let data = feature.properties;
    let items = styleJson.items || [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const filter = item.filter;

        if(filter){
            if(eval(filter)){
                let coords = geometry.get3DGeometry();
                for (let i = 0; i < coords.length; i++) {
                    const coord = coords[i];
                    let center = geometry.getCenter("EPSG:4326",i);
                    let options = getOptions(item, coord, feature, center);
                    options.dfeature = feature;
                    result.push(new Cesium.Entity(options));
                }
                break;
            }
        } else {
            let coords = geometry.get3DGeometry();
            for (let i = 0; i < coords.length; i++) {
                const coord = coords[i];
                let center = geometry.getCenter("EPSG:4326",i);
                let options = getOptions(item, coord, feature, center);
                options.dfeature = feature;
                result.push(new Cesium.Entity(options));
            }
            break;
        } 
    }
    return result;
}

/**
 * 解析线样式
 * @param {*} styleJson 
 * @param {*} feature 
 */
const parseLineStyle = function(styleJson, feature) {
    let result = [];
    let geometry = feature.geometry;
    let data = feature.properties;
    let items = styleJson.items || [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const filter = item.filter;

        if(filter){
            if(eval(filter)){
                let coords = geometry.get3DGeometry();
                for (let i = 0; i < coords.length; i++) {
                    const coord = coords[i];
                    let center = geometry.getCenter("EPSG:4326",i);
                    let options = getOptions(item, coord, feature, center);
                    options.dfeature = feature;
                    result.push(new Cesium.Entity(options));
                }
                break;
            }
        } else {
            let coords = geometry.get3DGeometry();
            for (let i = 0; i < coords.length; i++) {
                const coord = coords[i];
                let center = geometry.getCenter("EPSG:4326",i);
                let options = getOptions(item, coord, feature, center);
                options.dfeature = feature;
                result.push(new Cesium.Entity(options));
            }
            break;
        } 
    }
    return result;
}

/**
 * 解析面样式 
 * @param {*} styleJson 
 * @param {*} feature 
 */
const parsePolygonStyle = function(styleJson, feature) {
    let result = [];
    let geometry = feature.geometry;
    let data = feature.properties;
    let items = styleJson.items || [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const filter = item.filter;

        if(filter){
            if(eval(filter)){
                let coords = geometry.get3DGeometry();
                for (let i = 0; i < coords.length; i++) {
                    const coord = coords[i];
                    let center = geometry.getCenter("EPSG:4326",i);
                    let options = getOptions(item, coord, feature, center);
                    options.dfeature = feature;
                    result.push(new Cesium.Entity(options));
                }
             
                break;
            }
        } else {
            let coords = geometry.get3DGeometry();
            for (let i = 0; i < coords.length; i++) {
                const coord = coords[i];
                let center = geometry.getCenter("EPSG:4326",i);
                let options = getOptions(item, coord, feature, center);
                options.dfeature = feature;
                result.push(new Cesium.Entity(options));
            }

            break;
        } 
    }
    return result;
}

/**
 * 获取Entity
 * @param {*} cof 
 * @param {*} coordinates 
 * @param {*} feature 
 * @param {*} center 
 */
const getOptions = (cof, coordinates, feature, center) => {
    let options = {};
    let geometryType =  feature.geometry.type;
    let data = feature.properties;
    
    /**
     * 图标类
     */
    if(cof.image && (geometryType == "Point" || geometryType == "MultiPoint")){
        //icon
        if(cof.image.icon && (cof.image.icon.show == undefined || cof.image.icon.show==true)){
            let billboardOptions = {};
            billboardOptions.image = cof.image.icon.src;
            billboardOptions.scale = cof.image.icon.scale || 1;
            billboardOptions.horizontalOrigin = HorizontalOrigin[cof.image.icon.horizontalOrigin] || HorizontalOrigin.Center;
            billboardOptions.verticalOrigin = VerticalOrigin[cof.image.icon.verticalOrigin] || VerticalOrigin.Center;
            billboardOptions.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
           
            let minViewDistance = 0;
            let maxViewDistance = Number.MAX_VALUE;
            billboardOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

            //角度
            if(cof.image.icon.angle){
                let angle = getNumberFromData(cof.image.icon.angle, data);
                let rotation = angle/(180/Math.PI);
                billboardOptions.rotation = rotation;
            }

            if(cof.image.icon.offset){
                billboardOptions.pixelOffset = Cesium.Cartesian2.fromArray(cof.image.icon.offset);
            }
    
            options.billboard = billboardOptions;
        }

        //circle
        if(cof.image.circle && (cof.image.circle.show == undefined || cof.image.circle.show==true)){
            let fill=false,stroke=false;
            let radius = cof.image.circle.radius || 10;
            let angle = cof.image.circle.angle || 0;
            if(cof.image.circle.fill){
                fill = cof.image.circle.fill;
            }

            if(cof.image.circle.stroke){
                stroke = cof.image.circle.stroke;
            }
            
            let image = getRegularShapeImage({type: 'circle', fill: fill, stroke: stroke,radius: radius, angle:  angle});
            cof.image.circle.src = image;

            let billboardOptions = {};

            billboardOptions.image = cof.image.circle.src;
            billboardOptions.scale = cof.image.circle.scale || 1;
            billboardOptions.horizontalOrigin = HorizontalOrigin[cof.image.circle.horizontalOrigin] || HorizontalOrigin.Center;
            billboardOptions.verticalOrigin = VerticalOrigin[cof.image.circle.verticalOrigin] || VerticalOrigin.Center;
            
            let minViewDistance = 0;
            let maxViewDistance = Number.MAX_VALUE;
            billboardOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

            if(cof.image.circle.offset){
                billboardOptions.pixelOffset = Cesium.Cartesian2.fromArray(cof.image.circle.offset);
            }

            options.billboard = billboardOptions;
        }

        //ellipse
        if(cof.image.ellipse && (cof.image.ellipse.show == undefined || cof.image.ellipse.show==true)){
            let fill=false,stroke=false;
            let radiusX = cof.image.ellipse.radiusX || 60;
            let radiusY = cof.image.ellipse.radiusY || 40;
            let angle = cof.image.ellipse.angle || 0;
            if(cof.image.ellipse.fill){
                fill = cof.image.ellipse.fill;
            }

            if(cof.image.ellipse.stroke){
                stroke = cof.image.ellipse.stroke;
            }
            
            let image = getEllipseImage({type: 'ellipse', fill: fill, stroke: stroke,radiusX: radiusX,radiusY: radiusY, angle:  angle});
            cof.image.ellipse.src = image;

            let billboardOptions = {};

            billboardOptions.image = cof.image.ellipse.src;
            billboardOptions.scale = cof.image.ellipse.scale || 1;
            billboardOptions.horizontalOrigin = HorizontalOrigin[cof.image.ellipse.horizontalOrigin] || HorizontalOrigin.Center;
            billboardOptions.verticalOrigin = VerticalOrigin[cof.image.ellipse.verticalOrigin] || VerticalOrigin.Center;
            
            let minViewDistance = 0;
            let maxViewDistance = Number.MAX_VALUE;
            billboardOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

            if(cof.image.ellipse.offset){
                billboardOptions.pixelOffset = Cesium.Cartesian2.fromArray(cof.image.ellipse.offset);
            }

            options.billboard = billboardOptions;
        }
    
        //square 
        if(cof.image.square && (cof.image.square.show == undefined || cof.image.square.show==true)){
            //默认无setFill和setStroke方法，只能通过属性设置
            let fill=false,stroke=false;
            let radius = cof.image.square.radius || 10;
            let angle = 0;
            if(cof.image.square.fill){
                fill = cof.image.square.fill;
            }

            if(cof.image.square.stroke){
                stroke = cof.image.square.stroke;
            }

            if(cof.image.square.angle){
                angle = getNumberFromData(cof.image.square.angle, data);
            }
            
            let image = getRegularShapeImage({type: 'square', fill: fill, stroke: stroke,radius: radius, angle:  angle});
            cof.image.square.src = image;
            
            let billboardOptions = {};

            billboardOptions.image = cof.image.square.src;
            billboardOptions.scale = cof.image.square.scale || 1;
            billboardOptions.horizontalOrigin = HorizontalOrigin[cof.image.square.horizontalOrigin] || HorizontalOrigin.Center;
            billboardOptions.verticalOrigin = VerticalOrigin[cof.image.square.verticalOrigin] || VerticalOrigin.Center;
            
            let minViewDistance = 0;
            let maxViewDistance = Number.MAX_VALUE;
            billboardOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

            if(cof.image.square.offset){
                billboardOptions.pixelOffset = Cesium.Cartesian2.fromArray(cof.image.square.offset);
            }
    
            options.billboard = billboardOptions;
        }

        //hexagon 
        if(cof.image.hexagon && (cof.image.hexagon.show == undefined || cof.image.hexagon.show==true)){
            //默认无setFill和setStroke方法，只能通过属性设置
            let fill=false,stroke=false;
            let radius = cof.image.hexagon.radius || 10;
            let angle = 0;

            if(cof.image.hexagon.fill){
                fill = cof.image.hexagon.fill;
            }

            if(cof.image.hexagon.stroke){
                stroke = cof.image.hexagon.stroke;
            }
            
            if(cof.image.hexagon.angle){
                angle = getNumberFromData(cof.image.hexagon.angle, data);
            }

            let image = getRegularShapeImage({type: 'hexagon', fill: fill, stroke: stroke,radius: radius, angle:  angle});
            cof.image.hexagon.src = image;
            let billboardOptions = {};

            billboardOptions.image = cof.image.hexagon.src;
            billboardOptions.scale = cof.image.hexagon.scale || 1;
            billboardOptions.horizontalOrigin = HorizontalOrigin[cof.image.hexagon.horizontalOrigin] || HorizontalOrigin.Center;
            billboardOptions.verticalOrigin = VerticalOrigin[cof.image.hexagon.verticalOrigin] || VerticalOrigin.Center;
            
            let minViewDistance = 0;
            let maxViewDistance = Number.MAX_VALUE;
            billboardOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

            if(cof.image.hexagon.offset){
                billboardOptions.pixelOffset = Cesium.Cartesian2.fromArray(cof.image.hexagon.offset);
            }
    
            options.billboard = billboardOptions;
        }

        //sector 
        if(cof.image.sector && (cof.image.sector.show == undefined || cof.image.sector.show==true)){
            //默认无setFill和setStroke方法，只能通过属性设置
            let fill=false,stroke=false;
            let radius = cof.image.sector.radius || 10;
            let sAngle = 60;
            let angle = 0;

            if(cof.image.sector.fill){
                fill = cof.image.sector.fill;
            }

            if(cof.image.sector.stroke){
                stroke = cof.image.sector.stroke;
            }
            
            if(cof.image.sector.angle){
                angle = getNumberFromData(cof.image.sector.angle, data);
            }
           
            if(cof.image.sector.sAngle){
                sAngle = getNumberFromData(cof.image.sector.sAngle, data);
            }

            let image = getSectorImage({type: 'sector', fill: fill, stroke: stroke,radius: radius, angle:  angle,sAngle: sAngle});
            cof.image.sector.src = image;
            let billboardOptions = {};

            billboardOptions.image = cof.image.sector.src;
            billboardOptions.scale = cof.image.sector.scale || 1;
            billboardOptions.horizontalOrigin = HorizontalOrigin[cof.image.sector.horizontalOrigin] || HorizontalOrigin.Center;
            billboardOptions.verticalOrigin = VerticalOrigin[cof.image.sector.verticalOrigin] || VerticalOrigin.Center;
            
            let minViewDistance = 0;
            let maxViewDistance = Number.MAX_VALUE;
            billboardOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

            if(cof.image.sector.offset){
                billboardOptions.pixelOffset = Cesium.Cartesian2.fromArray(cof.image.sector.offset);
            }
    
            options.billboard = billboardOptions;
        }
    }

    /**
     * 矢量类
     */
    //circle
    if(cof.circle && (geometryType == "Point" || geometryType == "MultiPoint") && (cof.circle.show == undefined || cof.circle.show==true)){
       let circleOptions = {};
       let radius = cof.circle.radius || 10;
       circleOptions.hierarchy = feature.geometry.get3DCircle(radius);

       let minViewDistance = 0;
       let maxViewDistance = Number.MAX_VALUE;
       circleOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        if(cof.circle.fill){
            circleOptions.material = get3DColor(cof.circle.fill.color);
        }

        if(cof.circle.stroke){
            circleOptions.outline = true;
            circleOptions.outlineColor = get3DColor(cof.circle.stroke.color);
            circleOptions.outlineWidth = cof.circle.stroke.width || 1;
        }

        
        circleOptions.extrudedHeight = 0;
        if(cof.circle.height){
            circleOptions.extrudedHeight = getNumberFromData(cof.circle.height, data);
        }
        center[2] = circleOptions.extrudedHeight;

        options.polygon = circleOptions;
    }
    
    //ellipse
    if(cof.ellipse && (geometryType == "Point" || geometryType == "MultiPoint") && (cof.ellipse.show == undefined || cof.ellipse.show==true)){
        let ellipseOptions = {};
        let radiusX = cof.ellipse.radiusX || 60;
        let radiusY = cof.ellipse.radiusY || 40;
        let angle = cof.ellipse.angle || 0;
        ellipseOptions.hierarchy = feature.geometry.get3DEllipse(radiusX, radiusY, angle, 64);

        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;
        ellipseOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        if(cof.ellipse.fill){
            ellipseOptions.material = get3DColor(cof.ellipse.fill.color);
        }

        if(cof.ellipse.stroke){
            ellipseOptions.outline = true;
            ellipseOptions.outlineColor = get3DColor(cof.ellipse.stroke.color);
            ellipseOptions.outlineWidth = cof.ellipse.stroke.width || 1;
        }

        
        ellipseOptions.extrudedHeight = 0;
        if(cof.ellipse.height){
            ellipseOptions.extrudedHeight = getNumberFromData(cof.ellipse.height, data);
        }
        center[2] = ellipseOptions.extrudedHeight;

        options.polygon = ellipseOptions;
    }

    //square 
    if(cof.square && (geometryType == "Point" || geometryType == "MultiPoint") && (cof.square.show == undefined || cof.square.show==true)){
        let squareOptions = {};
        let radius = cof.square.radius || 10;
        let angle = 0;

        if(cof.square.angle){
            angle = getNumberFromData(cof.square.angle, data);
        }
        squareOptions.hierarchy = feature.geometry.get3DSquare(radius, angle);

        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;
        squareOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        if(cof.square.fill){
            squareOptions.material = get3DColor(cof.square.fill.color);
        }

        if(cof.square.stroke){
            squareOptions.outline = true;
            squareOptions.outlineColor = get3DColor(cof.square.stroke.color);
            squareOptions.outlineWidth = cof.square.stroke.width || 1;
        }

        
        squareOptions.extrudedHeight = 0;
        if(cof.square.height){
            squareOptions.extrudedHeight = getNumberFromData(cof.square.height, data);
        }
        center[2] = squareOptions.extrudedHeight;
       
        options.polygon = squareOptions;
    }

     //hexagon 
     if(cof.hexagon && (geometryType == "Point" || geometryType == "MultiPoint") && (cof.hexagon.show == undefined || cof.hexagon.show==true)){
        let hexagonOptions = {};
        let radius = cof.hexagon.radius || 10;
        let angle = 0;

        if(cof.hexagon.angle){
            angle = getNumberFromData(cof.hexagon.angle, data);
        }
        hexagonOptions.hierarchy = feature.geometry.get3DHexagon(radius, angle);

        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;
        hexagonOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        if(cof.hexagon.fill){
            hexagonOptions.material = get3DColor(cof.hexagon.fill.color);
        }

        if(cof.hexagon.stroke){
            hexagonOptions.outline = true;
            hexagonOptions.outlineColor = get3DColor(cof.hexagon.stroke.color);
            hexagonOptions.outlineWidth = cof.hexagon.stroke.width || 1;
        }

        
        hexagonOptions.extrudedHeight = 0;
        if(cof.hexagon.height){
            hexagonOptions.extrudedHeight = getNumberFromData(cof.hexagon.height, data);
        }
        center[2] = hexagonOptions.extrudedHeight;
        
        options.polygon = hexagonOptions;
    }
   
     //sector 
     if(cof.sector && (geometryType == "Point" || geometryType == "MultiPoint") && (cof.sector.show == undefined || cof.sector.show==true)){
        let sectorOptions = {};
        let radius = cof.sector.radius || 10;
        let sAngle = 60;
        let angle = 0;

        if(cof.sector.sAngle){
            sAngle = getNumberFromData(cof.sector.sAngle, data);
        }

        if(cof.sector.angle){
            angle = getNumberFromData(cof.sector.angle, data);
        }
        sectorOptions.hierarchy = feature.geometry.get3DSector(radius, sAngle, angle);

        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;
        sectorOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        if(cof.sector.fill){
            sectorOptions.material = get3DColor(cof.sector.fill.color);
        }

        if(cof.sector.stroke){
            sectorOptions.outline = true;
            sectorOptions.outlineColor = get3DColor(cof.sector.stroke.color);
            sectorOptions.outlineWidth = cof.sector.stroke.width || 1;
        }

        
        sectorOptions.extrudedHeight = 0;
        if(cof.sector.height){
            sectorOptions.extrudedHeight = getNumberFromData(cof.sector.height, data);
        }
        center[2] = sectorOptions.extrudedHeight;
        
        options.polygon = sectorOptions;
    }

    //model
    if(cof.model && (geometryType == "Point" || geometryType == "MultiPoint") && (cof.model.show == undefined || cof.model.show==true)){
        let orientation, modelOptions = {};
        
        let heading = Cesium.Math.toRadians(cof.model.heading || 0);
        let pitch = cof.model.pitch || 0;
        let roll = cof.model.roll || 0;
        let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        orientation = Cesium.Transforms.headingPitchRollQuaternion(coordinates, hpr);

        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;
        modelOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        modelOptions.uri = cof.model.uri;
        modelOptions.scale = cof.model.scale || 1;
        modelOptions.minimumPixelSize = cof.model.minimumPixelSize || 0;
        if(cof.model.maximumScale){
            modelOptions.maximumScale = cof.model.maximumScale || 10;
        }

        options.orientation = orientation;
        options.model = modelOptions;
    }

    //lineString
    if(cof.lineString && (geometryType == "LineString" || geometryType == "MultiLineString") && (cof.lineString.show == undefined || cof.lineString.show==true)){
        let lineOptions = {};

        lineOptions.positions =  coordinates;
        lineOptions.width =  cof.lineString.width || 5;
        // lineOptions.material =  new Cesium.PolylineDashMaterialProperty({
        //                                 color: get3DColor(cof.line.color),
        //                                 dashLength: cof.line.lineDash[0],
        //                                 dashPattern: cof.line.lineDash[1]
        //                         });
        lineOptions.material =  get3DColor(cof.lineString.color);
        
        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;
        lineOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        options.polyline = lineOptions;
    }

    //polygon
    if(cof.polygon && (geometryType == "Polygon" || geometryType == "MultiPolygon") && (cof.polygon.show == undefined || cof.polygon.show==true)){
        let polygonOptions = {};
        polygonOptions.hierarchy = coordinates;

        if(cof.polygon.fill){
            polygonOptions.material = get3DColor(cof.polygon.fill.color);
        }

        if(cof.polygon.stroke){
            polygonOptions.outline = true;
            polygonOptions.outlineColor = get3DColor(cof.polygon.stroke.color);
            polygonOptions.outlineWidth = cof.polygon.stroke.width || 1;
        }

        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;
        polygonOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);
        
        polygonOptions.height = 0;
        if(cof.polygon.height){
            polygonOptions.height = getNumberFromData(cof.polygon.height, data);
        }
        
        polygonOptions.extrudedHeight = 0;
        if(cof.polygon.extrudedHeight){
            polygonOptions.extrudedHeight = getNumberFromData(cof.polygon.extrudedHeight, data);
        }
        center[2] = polygonOptions.height + polygonOptions.extrudedHeight;

        options.polygon = polygonOptions;
    }

    //text
    if(cof.text && (cof.text.show == undefined || cof.text.show==true)){
        let textOptions = {};

        textOptions.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
        textOptions.fillColor = get3DColor(cof.text.fill.color);
        // textOptions.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;//表示相对于地形的位置,默认该位置被夹在地形上。
        // textOptions.verticalOrigin = Cesium.VerticalOrigin.TOP;
       
        

        let minViewDistance = 0;
        let maxViewDistance = Number.MAX_VALUE;

        if(cof.text.maxZoom){
            maxViewDistance = defaultDMapZommConfig[cof.text.maxZoom];
        }

        textOptions.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(minViewDistance, maxViewDistance);

        let offsetX = cof.text.offsetX || 0;
        let offsetY = cof.text.offsetY || 0;
        textOptions.pixelOffset = new Cesium.Cartesian2(offsetX, offsetY)

        if(cof.text.stroke){
            textOptions.outlineWidth = cof.text.stroke.width;
            textOptions.outlineColor = get3DColor(cof.text.stroke.color);
        }

        if(cof.text.backgroundColor){
            textOptions.showBackground = true;
            textOptions.backgroundColor = get3DColor(cof.text.backgroundColor);
        }
        
        if(cof.text.backgroundPadding){
            textOptions.backgroundPadding = new Cesium.Cartesian2(cof.text.backgroundPadding[0], cof.text.backgroundPadding[1]);
        }

        let fontStyle = cof.text.fontStyle||"normal";
        let fontWeight = cof.text.fontWeight||"normal";
        let fontSize = cof.text.fontSize||10;
        let fontFamily = cof.text.fontFamily||"sans-serif";
        let font = fontStyle + " " + fontWeight + " " + fontSize + "px "+ fontFamily;
        textOptions.font = font;

        //获取文字
        let textStr = "";
        if(cof.text.text){
            if(data[cof.text.text +""]){
                textStr = data[cof.text.text +""] + "";
                textOptions.text = textStr;
                options.label = textOptions;//有对应字段才添加
            }
        }
    }

    let position = new Cesium.Cartesian3.fromDegrees(center[0], center[1], (center[2]||0) + 30);
    options.position = position;
    
    return options;
}


/**
 * 获取颜色Material颜色
 * @param {value: '#FFFFFF', opacity: 1} options 
 */
const get3DColor = (options) => {
    options = options ||  {value: '#000000', opacity: 1};
    let color = colorHexToRgbaByObj(options);
    let result = Cesium.Color.fromCssColorString(color);
   
    return result;
}

/**
 * 
 * 添加雷达扫描线 地形遮挡开启   lon:-74.01296152309055 lat:40.70524201566827 height:129.14366696393927
 * @param {*} viewer 
 * @param {*} center 扫描中心
 * @param {*} radius 半径 米
 * @param {*} scanColor 扫描颜色
 * @param {*} duration 持续时间 毫秒
 */
const addRadarScanPostStage = function (viewer, center, radius, scanColor, duration) {
    var cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(center[0]), Cesium.Math.toRadians(center[1]), center[2]||0);
    var ScanSegmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform vec3 u_scanLineNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +

        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        " posInCamera =posInCamera / posInCamera.w;\n" +
        " return posInCamera;\n" +
        " }\n" +

        "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
            "vec3 v01 = testPt - ptOnLine;\n" +
            "normalize(v01);\n" +
            "vec3 temp = cross(v01, lineNormal);\n" +
            "float d = dot(temp, u_scanPlaneNormalEC);\n" +
            "return d > 0.5;\n" +
        "}\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
            "vec3 v01 = point -planeOrigin;\n" +
            "float d = dot(planeNormal, v01) ;\n" +
            "return (point - planeNormal * d);\n" +
        "}\n" +

        "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
            "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
            "return length(tempPt - ptOnLine);\n" +
        "}\n" +

        "float getDepth(in vec4 depth)\n" +
        "{\n" +
            "float z_window = czm_unpackDepth(depth);\n" +
            "z_window = czm_reverseLogDepth(z_window);\n" +
            "float n_range = czm_depthRange.near;\n" +
            "float f_range = czm_depthRange.far;\n" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
        "}\n" +

        "void main()\n" +
        "{\n" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
            "float twou_radius = u_radius * 2.0;\n" +
            "if(dis < u_radius)\n" +
            "{\n" +
                "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
                "f0 = pow(f0, 64.0);\n" +
                "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
                "float f = 0.0;\n" +
                "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
                "{\n" +
                    "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
                    "f = abs(twou_radius -dis1) / twou_radius;\n" +
                    "f = pow(f, 3.0);\n" +
                "}\n" +
                "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
            "}\n" +
        "}\n";

    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

    var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

    var _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
    var _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
    var _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
    var _RotateQ = new Cesium.Quaternion();
    var _RotateM = new Cesium.Matrix3();

    var _time = (new Date()).getTime();

    var _scratchCartesian4Center = new Cesium.Cartesian4();
    var _scratchCartesian4Center1 = new Cesium.Cartesian4();
    var _scratchCartesian4Center2 = new Cesium.Cartesian4();
    var _scratchCartesian3Normal = new Cesium.Cartesian3();
    var _scratchCartesian3Normal1 = new Cesium.Cartesian3();

    var ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;
            },
            u_radius: radius,
            u_scanLineNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                var temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                _scratchCartesian3Normal1.x = temp2.x - temp.x;
                _scratchCartesian3Normal1.y = temp2.y - temp.y;
                _scratchCartesian3Normal1.z = temp2.z - temp.z;

                var tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                return _scratchCartesian3Normal1;
            },
            u_scanColor: scanColor
        }
    });

    viewer.scene.postProcessStages.add(ScanPostStage);
};

/**
 * 添加扫描线 depth关闭   lon:-74.01296152309055 lat:40.70524201566827 height:129.14366696393927
 * @param {*} viewer 
 * @param {*} center 扫描中心
 * @param {*} maxRadius 最大半径 米
 * @param {*} scanColor 扫描颜色
 * @param {*} duration 持续时间 毫秒
 */
const addCircleScanPostStage = function (viewer, center, maxRadius, scanColor, duration) {
    var cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(center[0]), Cesium.Math.toRadians(center[1]), center[2]||0);
    var ScanSegmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +

        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        " posInCamera =posInCamera / posInCamera.w;\n" +
        " return posInCamera;\n" +
        " }\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
            "vec3 v01 = point -planeOrigin;\n" +
            "float d = dot(planeNormal, v01) ;\n" +
            "return (point - planeNormal * d);\n" +
        "}\n" +

        "float getDepth(in vec4 depth)\n" +
        "{\n" +
            "float z_window = czm_unpackDepth(depth);\n" +
            "z_window = czm_reverseLogDepth(z_window);\n" +
            "float n_range = czm_depthRange.near;\n" +
            "float f_range = czm_depthRange.far;\n" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
        "}\n" +

        "void main()\n" +
        "{\n" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
            "if(dis < u_radius)\n" +
                "{\n" +
                "float f = 1.0 -abs(u_radius - dis) / u_radius;\n" +
                "f = pow(f, 4.0);\n" +
                "gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n" +
            "}\n" +
        "}\n";

    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

    var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

    var _time = (new Date()).getTime();

    var _scratchCartesian4Center = new Cesium.Cartesian4();
    var _scratchCartesian4Center1 = new Cesium.Cartesian4();
    var _scratchCartesian3Normal = new Cesium.Cartesian3();

    var ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;
            },
            u_radius: function () {
                return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
            },
            u_scanColor: scanColor
        }
    });

    viewer.scene.postProcessStages.add(ScanPostStage);
};