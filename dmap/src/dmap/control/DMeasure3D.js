const Cesium = require('cesium/Cesium');
import {transform} from "./../utils/geom";

/**
 * 三维测量工具控件
 */
export default class DMeasure3D {
    constructor(dmap, opt_options) {
        let _this = this;
        let use_options = opt_options || {};
        _this.options = use_options;

        let root = document.getElementById(dmap.target);
        let isDrawing = false; //是否正在绘制
        let isDrawEnd = true; //是否绘制结束
        let helpTooltipElement;//帮助提示框
        let measureTooltipElement;//测量提示框
        let positions = [];//坐标
        let mouseClickCode;//鼠标点击事件编号
        let mouseMoveCode;//鼠标移动事件编号
        let mouseDbclickCode;//鼠标双击事件编号
        let poly;//测量对象

        //开始测量距离
        function startMeasureDistance(){
            clearMeasure();
            isDrawEnd = true;
            helpTooltipElement = document.createElement("div");
            helpTooltipElement.className = 'dmap-measure-tooltip';
            root.appendChild(helpTooltipElement);

            mouseMoveCode = dmap.on("pointermove",function(evt){
                helpTooltipElement.style.left = evt.pixel.x + 10 + "px";
                helpTooltipElement.style.top = evt.pixel.y + "px";
                helpTooltipElement.style.position = "absolute";
                if(isDrawEnd){
                    helpTooltipElement.innerHTML = "<div>点击开始绘制</div>";
                }
                if(!isDrawEnd && helpTooltipElement){
                    if(positions.length >= 1){
                        let coordinate = transform(evt.coordinate, dmap.projection, "EPSG:4326");
                        let position = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1] , 0);
                        if (!Cesium.defined(poly)) {
                            positions.push(position);
                            poly = new PolyLinePrimitive(dmap.map3D, positions);
                        } else {
                            positions.pop();
                            positions.push(position);
                        }
                    }
                }
            });

            mouseClickCode = dmap.on("click",function(evt){
                if(isDrawEnd){
                    isDrawEnd = false;
                    if(poly){
                        poly.clear();
                        poly = undefined;
                        positions = [];
                    }
                }

                if(helpTooltipElement){
                    isDrawing = true;
                    let coordinate = transform(evt.coordinate, dmap.projection, "EPSG:4326");
                    let position = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1] , 0);
                    positions.push(position);
                    if(positions.length == 1){
                        helpTooltipElement.innerHTML = "<div>点击继续绘制</div>";
                    } else {
                        helpTooltipElement.innerHTML = "<div>双击结束绘制</div>";
                    }
                }
            });
            
            mouseDbclickCode = dmap.on("dblclick",function(evt){
                if(!isDrawEnd && helpTooltipElement){
                    isDrawEnd = true;
                    isDrawing = false;
                    helpTooltipElement.innerHTML = "<div>点击开始绘制</div>";
                }
            });
        }


        //开始测量面积
        function startMeasureArea(){
            clearMeasure();
            isDrawEnd = true;
            helpTooltipElement = document.createElement("div");
            helpTooltipElement.className = 'dmap-measure-tooltip';
            root.appendChild(helpTooltipElement);

            mouseMoveCode = dmap.on("pointermove",function(evt){
                helpTooltipElement.style.left = evt.pixel.x + 10 + "px";
                helpTooltipElement.style.top = evt.pixel.y + "px";
                helpTooltipElement.style.position = "absolute";
                if(isDrawEnd){
                    helpTooltipElement.innerHTML = "<div>点击开始绘制</div>";
                }
                if(!isDrawEnd && helpTooltipElement){
                    if(positions.length >= 2){
                        let coordinate = transform(evt.coordinate, dmap.projection, "EPSG:4326");
                        let position = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1] , 0);
                        if (!Cesium.defined(poly)) {
                            positions.push(position);
                            poly = new PolygonPrimitive(dmap.map3D, positions);
                        } else {
                            positions.pop();
                            positions.push(position);
                        }
                    }
                }
            });

            mouseClickCode = dmap.on("click",function(evt){
                
                if(isDrawEnd){
                    isDrawEnd = false;
                    if(poly){
                        poly.clear();
                        poly = undefined;
                        positions = [];
                    }
                }

                if(helpTooltipElement){
                    isDrawing = true;
                    let coordinate = transform(evt.coordinate, dmap.projection, "EPSG:4326");
                    let position = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1] , 0);
                    positions.push(position);
                    if(positions.length < 3){
                        helpTooltipElement.innerHTML = "<div>点击继续绘制</div>";
                    } else {
                        helpTooltipElement.innerHTML = "<div>双击结束绘制</div>";
                    }
                }
            });
            
            mouseDbclickCode = dmap.on("dblclick",function(evt){
                if(!isDrawEnd && helpTooltipElement){
                    isDrawEnd = true;
                    isDrawing = false;
                    helpTooltipElement.innerHTML = "<div>点击开始绘制</div>";
                }
            });
        }

        //清除帮助内容
        function clearHelp(){
            if(dmap){
                if(mouseClickCode){
                    dmap.eventObj.unByCode(mouseClickCode);
                    mouseClickCode = undefined;
                }
                if(mouseMoveCode){
                    dmap.eventObj.unByCode(mouseMoveCode);
                    mouseMoveCode = undefined;
                }
                if(mouseDbclickCode){
                    dmap.eventObj.unByCode(mouseDbclickCode);
                    mouseDbclickCode = undefined;
                }
            }

            if(helpTooltipElement){
                helpTooltipElement.parentElement.removeChild(helpTooltipElement);
                helpTooltipElement = undefined;
            }   
        }

        /**
         * 清除测量
         */
        function clearMeasure(){
            clearHelp();
            if(dmap){
                positions = [];//坐标
                if(poly && poly.entity){
                    poly.clear();
                    poly = undefined;
                }
            }

            if(measureTooltipElement){
                measureTooltipElement.parentElement.removeChild(measureTooltipElement);
                measureTooltipElement = undefined;
            }

            isDrawEnd = true;
        }


        

        _this.clearMeasure = clearMeasure;
        _this.startMeasureDistance = startMeasureDistance;
        _this.startMeasureArea = startMeasureArea;
    }
}

//计算多边形面积
function getArea(positions) {
    var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
    var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

    var res = 0;
    //拆分三角曲面
    for (var i = 0; i < positions.length - 2; i++) {
        var j = (i + 1) % positions.length;
        var k = (i + 2) % positions.length;
        var totalAngle = Angle(positions[i], positions[j], positions[k]);

        var dis_temp1 = getDistance(positions[i], positions[j]);
        var dis_temp2 = getDistance(positions[j], positions[k]);
        res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) ;
    }

    /*角度*/
    function Angle(p1, p2, p3) {
        var bearing21 = Bearing(p2, p1);
        var bearing23 = Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    /*方向*/
    function Bearing(from, to) {
        from = getWGS84ByCartographic(from);
        to = getWGS84ByCartographic(to);

        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lon * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lon * radiansPerDegree;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;
    }

    function getWGS84ByCartographic(position){
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        var heightString = cartographic.height;

        return { lon: longitudeString, lat: latitudeString ,hei:heightString};
    }

    //返回两点之间的距离
    function getDistance(point1,point2){
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }

    return res.toFixed(4);//平方米
}

//空间线段距离计算函数
function getSpaceDistance(positions) {
    var distance = 0;
    for (var i = 0; i < positions.length - 1; i++) {

        var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        distance = distance + s;
    }

    return distance.toFixed(2);//米
}

const PolyLinePrimitive = (function () {
    function _(viewer, positions) {
        this.options = {
            name: '直线',
            polyline: {
                show: true,
                positions: [],
                material: Cesium.Color.fromCssColorString('rgba(255, 204, 51, 1)'),
                width: 10,
                clampToGround: true
            },
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.BLUE,
                outlineWidth: 2,
            },
            label: {
                text: '0m',
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
            }
        };
        this.positions = positions;
        this.viewer = viewer;
        this._init();
    }

    _.prototype._init = function () {
        var _self = this;
        var _update = function () {
            return _self.positions;
        };
        var _update0 = function () {
            return _self.positions[_self.positions.length - 1];
        };
        var _update1 = function () {
            let length = Number(getSpaceDistance(_self.positions));
            var output;
            if (length > 1000) {
                output = (Math.round(length / 1000 * 100) / 100) +
                    ' ' + '千米';
            }
            else {
                output = (Math.round(length * 100) / 100) +
                    ' ' + '米';
            }
            return output;
        };
        //实时更新polyline.positions
        this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
        this.options.position = new Cesium.CallbackProperty(_update0, false);
        this.options.label.text = new Cesium.CallbackProperty(_update1, false);
        this.entity = this.viewer.entities.add(this.options);
    };

    _.prototype.clear = function () {
        this.viewer.entities.remove(this.entity);
    }

    return _;
})();

const PolygonPrimitive = (function () {
    function _(viewer, positions) {
        this.options = {
            name: '面积',
            polygon : {
                hierarchy : [],
                // perPositionHeight : true,
                material :  Cesium.Color.fromCssColorString('rgba(255, 204, 51, 0.5)'),
                // heightReference:20000
            },
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.BLUE,
                outlineWidth: 2,
            },
            label: {
                text: '0平方米',
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
            }
        };
        this.positions = positions;
        this.viewer = viewer;
        this._init();
    }

    _.prototype._init = function () {
        var _self = this;
        var _update = function () {
            return new Cesium.PolygonHierarchy(_self.positions, []);
        };
        var _update0 = function () {
            return _self.positions[_self.positions.length - 1];
        };
        var _update1 = function () {
            let area = Number(getArea(_self.positions));
            var output;
            if (area > 1000000) {
                output = (Math.round(area / 1000000 * 100) / 100) +
                    ' ' + '平方公里';
            }
            else {
                output = (Math.round(area * 100) / 100) +
                    ' ' + '平方米';
            }
            return output;
        };
        
        //实时更新polyline.positions
        this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
        // this.options.polygon.hierarchy = this.positions;
        this.options.position = new Cesium.CallbackProperty(_update0, false);
        this.options.label.text = new Cesium.CallbackProperty(_update1, false);
        this.entity = this.viewer.entities.add(this.options);
    };

    _.prototype.clear = function () {
        this.viewer.entities.remove(this.entity);
    }   

    return _;
})();