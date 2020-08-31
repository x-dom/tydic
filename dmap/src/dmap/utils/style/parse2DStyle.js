import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Icon from 'ol/style/Icon';
import {HorizontalOrigin, VerticalOrigin} from './../../enum/Enum';
import {getNumberFromData} from "./../common/number";
import { getRegularShapeImage, getSectorImage,getEllipseImage, getFill, getStroke} from "./style";

/**
 * 解析二维样式
 * @param {*} styleJson 
 * @param DMap map
 */
const  parse2DStyle = function(styleJson, map) {
    let use_options = {};
    styleJson = styleJson||{};
    $.extend(use_options, styleJson);
    
    let result = null;
    if(use_options.type){
        if(use_options.type.toUpperCase() == "POINT" || use_options.type.toUpperCase() == "MULTIPOINT"){
            result = parsePointStyle(use_options, map);
        } else if(use_options.type.toUpperCase() == "LINE" || use_options.type.toUpperCase() == "LINESTRING" || use_options.type.toUpperCase() == "MULTILINESTRING"){
            result = parseLineStyle(use_options, map);
        } else if(use_options.type.toUpperCase() == "POLYGON" || use_options.type.toUpperCase() == "MULTIPOLYGON"){
            result = parsePolygonStyle(use_options, map);
        } else {
            
        }
    }
    return result;
};


/**
 * 解析筛选条件
 * @param {*} filter 
 * @param {*} data 
 */
const pasrseFilter = (filter, data)=>{
    let result = false;

    data = {a:30, bc:2}
    filter = "((a>20 && a<100)||bc==2)";
    if(filter && data){
        let arr = [];
        const validFist = /[a-zA-Z$_]/m;
        const validBody = /(?!.*()|.*中学|.*初级中学)^.*$/;
         console.log(p.test('$'));
        for (let i = 0; i < filter.length; i++) {
            const char = filter[i];

            if(validFist){
            } else {
                continue;
            }
        }
    }

    return result;
}

/**
 * 解析点样式
 * @param {*} options 
 * @param DMap map
 */
const parsePointStyle = (options, map)=>{
    return function(feature){
        let result;
        let data = feature.getProperties();

        let items = options.items || [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const filter = item.filter;

            if(filter){
                if(eval(filter)){
                    result = getStyle(item, data, feature, map);
                    break;
                }
            } else {
                result = getStyle(item, data, feature, map);
                break;
            } 
        }

        return  result;
    };
} 

/**
 * 解析线样式
 * @param {*} options 
 * @param DMap map
 */
const parseLineStyle = (options, map)=>{
    return function(feature){
        let result;
        let data = feature.getProperties();

        let items = options.items || [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const filter = item.filter;

            if(filter){
                if(eval(filter)){
                    result = getStyle(item, data, feature, map);
                    break;
                }
            } else {
                result = getStyle(item, data, feature, map);
                break;
            } 
        }

        return  result;
    };
}

/**
 * 解析面样式
 * @param {*} options 
 * @param DMap map
 */
const parsePolygonStyle = (options, map)=>{
    return function(feature){
        let result;
        let data = feature.getProperties();

        let items = options.items || [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const filter = item.filter;

            if(filter){
                if(eval(filter)){
                    result = getStyle(item, data, feature, map);
                    break;
                }
            } else {
                result = getStyle(item, data, feature, map);
                break;
            } 
        }

        return  result;
    };
}

/**
 * 获取样式
 * @param {*} cof 
 * @param {*} data 
 * @param {*} feature 
 * @param DMap map 
 */
const getStyle = (cof, data, feature, map) => {
    let style = new Style();
    let dfeature = feature.dfeature;
    /**
     * 图标类
     */
     if(cof.image){
         //icon
        if(cof.image.icon && (cof.image.icon.show == undefined || cof.image.icon.show==true)){
            let horizontalOrigin = HorizontalOrigin[cof.image.icon.horizontalOrigin] || HorizontalOrigin.Center;
            let verticalOrigin = VerticalOrigin[cof.image.icon.verticalOrigin] || VerticalOrigin.Center;
            let anchor = [0.5, 0.5];
            
            if(horizontalOrigin == HorizontalOrigin.Left){
                anchor[0] = 1;
            } else if(horizontalOrigin == HorizontalOrigin.Right){
                anchor[0] = 0;
            }
        
            if(verticalOrigin == VerticalOrigin.Bottom){
                anchor[1] = 0;
            } else if(verticalOrigin == VerticalOrigin.Top){
                anchor[1] = 1;
            }

            cof.image.icon.anchor = anchor;
            let icon = new Icon(cof.image.icon);
            style.setImage(icon);

            if(cof.image.icon.angle){
                let angle = getNumberFromData(cof.image.icon.angle, data);
                let rotation = angle/(180/Math.PI);
                icon.setRotation(rotation);
            }
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
            let horizontalOrigin = HorizontalOrigin[cof.image.circle.horizontalOrigin] || HorizontalOrigin.Center;
            let verticalOrigin = VerticalOrigin[cof.image.circle.verticalOrigin] || VerticalOrigin.Center;
            let anchor = [0.5, 0.5];
            
            if(horizontalOrigin == HorizontalOrigin.Left){
                anchor[0] = 1;
            } else if(horizontalOrigin == HorizontalOrigin.Right){
                anchor[0] = 0;
            }
        
            if(verticalOrigin == VerticalOrigin.Bottom){
                anchor[1] = 0;
            } else if(verticalOrigin == VerticalOrigin.Top){
                anchor[1] = 1;
            }

            cof.image.circle.anchor = anchor;
            cof.image.circle.src = image;
            let icon = new Icon(cof.image.circle);
            style.setImage(icon);
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
            let horizontalOrigin = HorizontalOrigin[cof.image.ellipse.horizontalOrigin] || HorizontalOrigin.Center;
            let verticalOrigin = VerticalOrigin[cof.image.ellipse.verticalOrigin] || VerticalOrigin.Center;
            let anchor = [0.5, 0.5];
            
            if(horizontalOrigin == HorizontalOrigin.Left){
                anchor[0] = 1;
            } else if(horizontalOrigin == HorizontalOrigin.Right){
                anchor[0] = 0;
            }
        
            if(verticalOrigin == VerticalOrigin.Bottom){
                anchor[1] = 0;
            } else if(verticalOrigin == VerticalOrigin.Top){
                anchor[1] = 1;
            }

            cof.image.ellipse.anchor = anchor;
            cof.image.ellipse.src = image;
            let icon = new Icon(cof.image.ellipse);
            style.setImage(icon);
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
            
            let horizontalOrigin = HorizontalOrigin[cof.image.square.horizontalOrigin] || HorizontalOrigin.Center;
            let verticalOrigin = VerticalOrigin[cof.image.square.verticalOrigin] || VerticalOrigin.Center;
            let anchor = [0.5, 0.5];
            
            if(horizontalOrigin == HorizontalOrigin.Left){
                anchor[0] = 1;
            } else if(horizontalOrigin == HorizontalOrigin.Right){
                anchor[0] = 0;
            }
        
            if(verticalOrigin == VerticalOrigin.Bottom){
                anchor[1] = 0;
            } else if(verticalOrigin == VerticalOrigin.Top){
                anchor[1] = 1;
            }

            cof.image.square.anchor = anchor;
            cof.image.square.src = image;
            let icon = new Icon(cof.image.square);
            style.setImage(icon);
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
            
            let horizontalOrigin = HorizontalOrigin[cof.image.hexagon.horizontalOrigin] || HorizontalOrigin.Center;
            let verticalOrigin = VerticalOrigin[cof.image.hexagon.verticalOrigin] || VerticalOrigin.Center;
            let anchor = [0.5, 0.5];
            
            if(horizontalOrigin == HorizontalOrigin.Left){
                anchor[0] = 1;
            } else if(horizontalOrigin == HorizontalOrigin.Right){
                anchor[0] = 0;
            }
        
            if(verticalOrigin == VerticalOrigin.Bottom){
                anchor[1] = 0;
            } else if(verticalOrigin == VerticalOrigin.Top){
                anchor[1] = 1;
            }

            cof.image.hexagon.anchor = anchor;
            cof.image.hexagon.src = image;
            let icon = new Icon(cof.image.hexagon);
            style.setImage(icon);
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
            
            let horizontalOrigin = HorizontalOrigin[cof.image.sector.horizontalOrigin] || HorizontalOrigin.Center;
            let verticalOrigin = VerticalOrigin[cof.image.sector.verticalOrigin] || VerticalOrigin.Center;
            let anchor = [0.5, 0.5];
            
            if(horizontalOrigin == HorizontalOrigin.Left){
                anchor[0] = 1;
            } else if(horizontalOrigin == HorizontalOrigin.Right){
                anchor[0] = 0;
            }
        
            if(verticalOrigin == VerticalOrigin.Bottom){
                anchor[1] = 0;
            } else if(verticalOrigin == VerticalOrigin.Top){
                anchor[1] = 1;
            }

            cof.image.sector.anchor = anchor;
            cof.image.sector.src = image;
            let icon = new Icon(cof.image.sector);
            style.setImage(icon);
        }
     }
   
    /**
     * 矢量类
     */

    //circle
    if(cof.circle && (cof.circle.show == undefined || cof.circle.show==true)){
        //默认无setFill和setStroke方法，只能通过属性设置
        let fill=false,stroke=false;
        let radius = cof.circle.radius || 10;
        let geom = dfeature.geometry.get2DCircle(radius, 64, map.projection);

        if(cof.circle.fill){
            fill = getFill(cof.circle.fill);
        }

        if(cof.circle.stroke){
            stroke = getStroke(cof.circle.stroke);
        }

        style.setFill(fill);
        style.setStroke(stroke);
        style.setGeometry(geom);
    }

    //ellipse
    if(cof.ellipse && (cof.ellipse.show == undefined || cof.ellipse.show==true)){
        //默认无setFill和setStroke方法，只能通过属性设置
        let fill=false,stroke=false;
        let radiusX = cof.ellipse.radiusX || 60;
        let radiusY = cof.ellipse.radiusY || 40;
        let angle = cof.ellipse.angle || 0;
        let geom = dfeature.geometry.get2DEllipse(radiusX, radiusY, angle, 64, map.projection);

        if(cof.ellipse.fill){
            fill = getFill(cof.ellipse.fill);
        }

        if(cof.ellipse.stroke){
            stroke = getStroke(cof.ellipse.stroke);
        }

        style.setFill(fill);
        style.setStroke(stroke);
        style.setGeometry(geom);
    }

    //square 
    if(cof.square && (cof.square.show == undefined || cof.square.show==true)){
        //默认无setFill和setStroke方法，只能通过属性设置
        let fill=false,stroke=false;
        let radius = cof.square.radius || 10;
        let angle = 0;

        if(cof.square.angle){
            angle = getNumberFromData(cof.square.angle, data);
        }

        let geom = dfeature.geometry.get2DSquare(radius, angle, map.projection);
        
        if(cof.square.fill){
            fill = getFill(cof.square.fill);
        }

        if(cof.square.stroke){
            stroke = getStroke(cof.square.stroke);
        }
        
        style.setFill(fill);
        style.setStroke(stroke);
        style.setGeometry(geom);
    }

    //hexagon 
    if(cof.hexagon && (cof.hexagon.show == undefined || cof.hexagon.show==true)){
        //默认无setFill和setStroke方法，只能通过属性设置
        let fill=false,stroke=false;
        let radius = cof.hexagon.radius || 10;
        let angle = 0;
        
        if(cof.hexagon.angle){
            angle = getNumberFromData(cof.hexagon.angle, data);
        }

        let geom = dfeature.geometry.get2DHexagon(radius, angle, map.projection);

        if(cof.hexagon.fill){
            fill = getFill(cof.hexagon.fill);
        }

        if(cof.hexagon.stroke){
            stroke = getStroke(cof.hexagon.stroke);
        }
        
        style.setFill(fill);
        style.setStroke(stroke);
        style.setGeometry(geom);
    }

    //sector 
    if(cof.sector && (cof.sector.show == undefined || cof.sector.show==true)){
        //默认无setFill和setStroke方法，只能通过属性设置
        let fill=false,stroke=false;
        let radius = cof.sector.radius || 10;
        let sAngle = 60;
        let angle = 0;
        
        if(cof.sector.sAngle){
            sAngle = getNumberFromData(cof.sector.sAngle, data);
        }
        
        if(cof.sector.angle){
            angle = getNumberFromData(cof.sector.angle, data);
        }

        let geom = dfeature.geometry.get2DSector(radius, sAngle, angle, map.projection);

        if(cof.sector.fill){
            fill = getFill(cof.sector.fill);
        }

        if(cof.sector.stroke){
            stroke = getStroke(cof.sector.stroke);
        }
        
        style.setFill(fill);
        style.setStroke(stroke);
        style.setGeometry(geom);
    }

    //lineString
    if(cof.lineString && (cof.lineString.show == undefined || cof.lineString.show==true)){
        let stroke = getStroke(cof.lineString);
        style.setStroke(stroke)
    }

    //polygon
    if(cof.polygon && (cof.polygon.show == undefined || cof.polygon.show==true)){
        //默认无setFill和setStroke方法，只能通过属性设置
        let fill=false,stroke=false;
        if(cof.polygon.fill){
            fill = getFill(cof.polygon.fill);
        }

        if(cof.polygon.stroke){
            stroke = getStroke(cof.polygon.stroke);
        }

        style.setFill(fill);
        style.setStroke(stroke);
    }

    //text
    if(cof.text && (cof.text.show == undefined || cof.text.show==true)){
        let text = new Text();

        let fontStyle = cof.text.fontStyle||"normal";
        let fontWeight = cof.text.fontWeight||"normal";
        let fontSize = cof.text.fontSize||10;
        let fontFamily = cof.text.fontFamily||"sans-serif";
        let font = fontStyle + " " + fontWeight + " " + fontSize + "px "+ fontFamily;
        text.setFont(font);

        let overflow = cof.text.overflow||true;
        text.setOverflow(overflow);

        if(cof.text.scale){
            text.setScale(cof.text.scale);
        }
        
        if(cof.text.rotation){
            text.setRotation(cof.text.rotation);
        }

        if(cof.text.angle){
            let angle = getNumberFromData(cof.text.angle, data);
            let rotation = angle/(180/Math.PI);
            text.setRotation(rotation);
        }

        if(cof.text.fill){
            let fill = getFill(cof.text.fill);
            text.setFill(fill);
        }
        
        if(cof.text.stroke){
            let stroke = getStroke(cof.text.stroke);
            text.setStroke(stroke);
        }
       
        if(cof.text.backgroundColor){
            let fillObj = {color: cof.text.backgroundColor};
            let fill = getFill(fillObj);
            text.setBackgroundFill(fill);
        }
        
        if(cof.text.backgroundPadding){
            text.setPadding([cof.text.backgroundPadding[0],cof.text.backgroundPadding[1],cof.text.backgroundPadding[0],cof.text.backgroundPadding[1]]);
        }
       
        if(cof.text.offsetX){
            text.setOffsetX(cof.text.offsetX);
        }
       
        if(cof.text.offsetY){
            text.setOffsetY(cof.text.offsetY);
        }

        //获取文字
        if(cof.text.text){
            if(data[cof.text.text +""]){
                text.setText( data[cof.text.text +""] + "");
                style.setText(text);
            }
        }

        if(cof.text.maxZoom){
            if(map.zoom < cof.text.maxZoom){
                style.setText("");
            }
        }
    }
    
    return style;
}

export {parse2DStyle};