const Cesium = require('cesium/Cesium');
import Feature from 'ol/Feature.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Vector as VectorSource, Cluster as ClusterSource} from 'ol/source.js';
import {Circle, Style, Text, Icon} from 'ol/style.js';
import {HorizontalOrigin, VerticalOrigin} from './../../enum/Enum';
import {get3DColor, getFill, getStroke, getRegularShapeImage} from "./style";


/**
 * 解析获取二维聚合图层
 * @param {*} data 
 * @param {*} styleItems 
 * @param "EPSG:3857" projection 
 */
const get2DClusterLayers = function(data, styleItems, projection){
    let layers = [];
    
    //添加二维图层
    for (let i = 0; i < styleItems.length; i++) {
        const cof = styleItems[i];

        let styleCache = {};
        let clusterLayer = new VectorLayer({
            source: new ClusterSource({
                distance: cof.distance,
                source: new VectorSource()
            }),
            style: function(feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                if (!style) {
                    style = new Style();
                    if(cof.image){
                         //icon
                        if(cof.image.icon && (cof.image.icon.show == undefined || cof.image.icon.show==true)){
                            let horizontalOrigin = cof.image.icon.horizontalOrigin || HorizontalOrigin.Center;
                            let verticalOrigin = cof.image.icon.verticalOrigin || VerticalOrigin.Center;
                            let anchor = [0.5, 0.5];
                            
                            if(horizontalOrigin == HorizontalOrigin.Left){
                                anchor[0] = 0;
                            } else if(horizontalOrigin == HorizontalOrigin.Right){
                                anchor[0] = 1;
                            }
                        
                            if(verticalOrigin == VerticalOrigin.Bottom){
                                anchor[0] = 0;
                            } else if(verticalOrigin == VerticalOrigin.Top){
                                anchor[0] = 1;
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
                    }

                    //text
                    if(cof.text && (cof.text.show == undefined || cof.text.show==true)){
                        let text = new Text();
                        style.setText(text)

                        let fontStyle = cof.text.fontStyle||"normal";
                        let fontWeight = cof.text.fontWeight||"normal";
                        let fontSize = cof.text.fontSize||10;
                        let fontFamily = cof.text.fontFamily||"sans-serif";
                        let font = fontStyle + " " + fontWeight + " " + fontSize + "px "+ fontFamily;
                        text.setFont(font);

                        let overflow = cof.text.overflow||true;
                        text.setOverflow(overflow);

                        let textStr = "";
                        if(size != 1){
                            textStr = size.toString();
                        } else {
                            if(cof.text.text){
                                let properties = feature.get('features')[0].getProperties();
                                textStr = cof.text.text +"";
                                if(properties[textStr]){
                                    textStr = properties[textStr] + "";
                                }
                            }
                        }
                        text.setText(textStr);

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
                    }

                    styleCache[size] = style;
                }
                return style;
            }
        }); 

        for (let i = 0; i < data.length; i++) {
             ///添加二维数据
            const dfeature = data[i];
            let geom =  dfeature.geometry.get2DGeometry(projection);
            let prop =  dfeature.properties;
            prop.dfeature = dfeature;
            let feature = new Feature();
            
            if(geom){
                feature.setGeometry(geom);
            }
            
            if(prop){
                feature.setProperties(prop);
            }

            clusterLayer.getSource().getSource().addFeature(feature);
        }

        layers.push(clusterLayer);
    }

    return layers;
}

/**
 * 解析获取三维聚合图层
 * @param {*} data 
 * @param {*} styleItems 
 */
const get3DClusterLayers = function(datas, styleItems, map3D){
    let dataSources = [];
    for (let i = 0; i < styleItems.length; i++) {
        const cof = styleItems[i];
        let filter = cof.filter;
        let data = [];
        for (let j = 0; j < datas.length; j++) {
            const feature = datas[j];
            if(filter){
                data.push(feature);  
            }
        }

        let dataSource = new Cesium.CustomDataSource();
        dataSources.push(dataSource);
        //添加三维数据
        for (let i = 0; i < data.length; i++) {
            const feature = data[i];
            let entities = [];
            let geometry = feature.geometry;
            let properties = feature.properties;
            let coords = geometry.get3DGeometry();

            for (let i = 0; i < coords.length; i++) {
                const coord = coords[i];
                let options = {};
                entities.push(options);
                options.position = coord;
                options.dfeature = feature;
                
                if(cof.image){
                    //icon
                    if(cof.image.icon && (cof.image.icon.show == undefined || cof.image.icon.show==true)){
                        let billboardOptions = {};

                        billboardOptions.image = cof.image.icon.src;
                        billboardOptions.scale = cof.image.icon.scale || 1;
                        billboardOptions.horizontalOrigin = cof.image.icon.horizontalOrigin || HorizontalOrigin.Center;
                        billboardOptions.verticalOrigin = cof.image.icon.verticalOrigin || VerticalOrigin.Center;
                       
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
                        let angle = 0;
                        
                        if(cof.image.circle.angle){
                            angle = getNumberFromData(cof.image.circle.angle, data);
                        }

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
                
                    //square 
                    if(cof.image.square && (cof.image.square.show == undefined || cof.image.square.show==true)){
                        //默认无setFill和setStroke方法，只能通过属性设置
                        let fill=false,stroke=false;
                        let radius = cof.image.square.radius || 10;
                        let angle = 0;

                        if(cof.image.square.angle){
                            angle = getNumberFromData(cof.image.square.angle, data);
                        }

                        if(cof.image.square.fill){
                            fill = cof.image.square.fill;
                        }

                        if(cof.image.square.stroke){
                            stroke = cof.image.square.stroke;
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

                        if(cof.image.hexagon.angle){
                            angle = getNumberFromData(cof.image.hexagon.angle, data);
                        }

                        if(cof.image.hexagon.fill){
                            fill = cof.image.hexagon.fill;
                        }

                        if(cof.image.hexagon.stroke){
                            stroke = cof.image.hexagon.stroke;
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
                }
    
                //text
                if(cof.text && (cof.text.show == undefined || cof.text.show==true)){
                    let textOptions = {};
    
                    textOptions.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
                    textOptions.fillColor = get3DColor(cof.text.fill.color);
                    // textOptions.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;//表示相对于地形的位置,默认该位置被夹在地形上。
                    // textOptions.verticalOrigin = Cesium.VerticalOrigin.TOP;
                
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
    
                    let textStr = "";
                    if(cof.text.text){
                        textStr = cof.text.text +"";
                        if(properties[textStr]){
                            textStr = properties[textStr] + "";
                        }
                    }
                    textOptions.text = textStr;
                    options.label = textOptions;
                }
            }

            for (let j = 0; j < entities.length; j++) {
                const entity = entities[j];
                dataSource.entities.add(entity);
            }
        }

        //聚合添加及样式设置
        let dataSourcePromise = map3D.dataSources.add(dataSource);
        dataSourcePromise.then(function(dataSource) {
            var pixelRange =  cof.distance;
            var minimumClusterSize = 2;
            var enabled = true;
        
            dataSource.clustering.enabled = enabled;
            dataSource.clustering.pixelRange = pixelRange;
            dataSource.clustering.minimumClusterSize = minimumClusterSize;
            dataSource.clustering.clusterPoints = true;
            dataSource.clustering.clusterBillboards = true;
            dataSource.clustering.clusterLabels = false;
            
            var removeListener;
        
            var pinBuilder = new Cesium.PinBuilder();
            var pin50 = pinBuilder.fromText('50+', Cesium.Color.RED, 48).toDataURL();
            var pin40 = pinBuilder.fromText('40+', Cesium.Color.ORANGE, 48).toDataURL();
            var pin30 = pinBuilder.fromText('30+', Cesium.Color.YELLOW, 48).toDataURL();
            var pin20 = pinBuilder.fromText('20+', Cesium.Color.GREEN, 48).toDataURL();
            var pin10 = pinBuilder.fromText('10+', Cesium.Color.BLUE, 48).toDataURL();
        
            var singleDigitPins = new Array(8);
            for (var i = 0; i < singleDigitPins.length; ++i) {
                singleDigitPins[i] = pinBuilder.fromText('' + (i + 2), Cesium.Color.VIOLET, 48).toDataURL();
            }
        
            function customStyle() {
                if (Cesium.defined(removeListener)) {
                    removeListener();
                    removeListener = undefined;
                } else {
                    removeListener = dataSource.clustering.clusterEvent.addEventListener(function(clusteredEntities, cluster) {
                        cluster.label.show = false;
                        cluster.billboard.show = true;
                        cluster.billboard.id = cluster.label.id;
                        // cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    
                        if (clusteredEntities.length >= 50) {
                            cluster.billboard.image = pin50;
                        } else if (clusteredEntities.length >= 40) {
                            cluster.billboard.image = pin40;
                        } else if (clusteredEntities.length >= 30) {
                            cluster.billboard.image = pin30;
                        } else if (clusteredEntities.length >= 20) {
                            cluster.billboard.image = pin20;
                        } else if (clusteredEntities.length >= 10) {
                            cluster.billboard.image = pin10;
                        } else {
                            cluster.billboard.image = singleDigitPins[clusteredEntities.length - 2];
                        }
                    });
                }
        
                // force a re-cluster with the new styling
                var pixelRange = dataSource.clustering.pixelRange;
                dataSource.clustering.pixelRange = 0;
                dataSource.clustering.pixelRange = pixelRange;
            }
        
            // start with custom style
            customStyle();
        
            var viewModel = {
                pixelRange: pixelRange,
                minimumClusterSize: minimumClusterSize
            };
            Cesium.knockout.track(viewModel);
        
            var toolbar = document.getElementById('toolbar');
            Cesium.knockout.applyBindings(viewModel, toolbar);
        
            function subscribeParameter(name) {
                Cesium.knockout.getObservable(viewModel, name).subscribe(
                    function(newValue) {
                        dataSource.clustering[name] = newValue;
                    }
                );
            }
        
            subscribeParameter('pixelRange');
            subscribeParameter('minimumClusterSize');
        
            Sandcastle.addToggleButton('Enabled', true, function(checked) {
                dataSource.clustering.enabled = checked;
            });
        
            Sandcastle.addToggleButton('Custom Styling', true, function(checked) {
                customStyle();
            });
        
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function(movement) {
                var pickedLabel = viewer.scene.pick(movement.position);
                if (Cesium.defined(pickedLabel)) {
                    var ids = pickedLabel.id;
                    if (Cesium.isArray(ids)) {
                        for (var i = 0; i < ids.length; ++i) {
                            ids[i].billboard.color = Cesium.Color.RED;
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        });
    }

    return dataSources;
}

export {get2DClusterLayers, get3DClusterLayers}