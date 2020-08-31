import "./css/DMapMeasure.css";
import Draw from 'ol/interaction/Draw.js';
import {unByKey} from 'ol/Observable.js';
import Overlay from 'ol/Overlay';
import {getArea, getLength} from 'ol/sphere';
import {Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

/**
 * 二维测量工具控件
 * */
export default class DMeasure2D {
    /**
     * 
     * @param {*} opt_options 
     */
    constructor(dmap, opt_options) {
        let $this = this;
        let use_options = opt_options || {};
        $this.options = use_options;
        let map = dmap.map2D;

        //当前绘制要素
        var sketch;
        //提示信息DOM节点
        var helpTooltipElement;
        //提示信息
        var helpTooltip;
        //测量信息DOM节点
        var measureTooltipElement;
        //测量信息
        var measureTooltip;
        //继续绘制多边形信息
        var continuePolygonMsg = '点击继续绘制';
        //继续绘制线段信息
        var continueLineMsg = '点击继续绘制';
        //绘制控件
        var draw;
        //是否绘制结束
        var isDrawEnd = true;
        //矢量数据源
        var source = new VectorSource();
        //矢量图层
        var vector = new VectorLayer({
            source: source,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 204, 51, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        map.addLayer(vector);
        //鼠标移动处理程序
        var pointerMoveHandler = function (evt) {
            if (evt.dragging || !helpTooltip) {
                return;
            }
            /** @type {string} */
            var helpMsg = '点击开始绘制';
            if(draw && !isDrawEnd){
                var type = draw.type_;
                if (type == "Polygon") {
                    helpMsg = continuePolygonMsg;
                }
                else if (type == "LineString") {
                    helpMsg = continueLineMsg;
                }
            }

            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);
            helpTooltipElement.classList.remove('hidden');
        };
        map.on('pointermove', pointerMoveHandler);

        //获取格式化长度信息
        var getFormatLength = function (line) {
            var length = getLength(line, {projection: map.getView().getProjection().getCode()});
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
        //获取格式化面积信息
        var getFormatArea = function (polygon) {
            var area = getArea(polygon,{projection: map.getView().getProjection().getCode()});
            var output;
            if (area > 1000000) {
                output = (Math.round(area / 1000000 * 10000) / 10000) +
                    ' ' + '平方公里';
            }
            else {
                output = (Math.round(area * 100) / 100) +
                    ' ' + '平方米';
            }
            return output;
        };
        //添加交互
        function addInteraction(type) {
            type = (type == 'area' ? 'Polygon' : 'LineString');
            draw = new Draw({
                source: source,
                type: type,
                style: new Style({
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new Stroke({
                        // color: 'rgba(0, 0, 0, 0.5)',
                        color: 'rgba(255, 204, 51, 0.5)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                    image: new CircleStyle({
                        radius: 5,
                        stroke: new Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        })
                    })
                })
            });
            map.addInteraction(draw);
            
            createHelpTooltip();
            var listener;
            draw.on('drawstart', function (evt) {
                isDrawEnd = false;
                createMeasureTooltip();
                // set sketch
                sketch = evt.feature;
                /** @type {module:ol/coordinate~Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;
                listener = sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom.getType() ==  "Polygon") {
                        output = getFormatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    }
                    else if (geom.getType() == "LineString") {
                        output = getFormatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    
                    measureTooltipElement.getElementsByClassName('dmap-measure-tooltip-content')[0].innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            }, this);
            draw.on('drawend', function () {
                isDrawEnd = true;
                measureTooltipElement.className = 'dmap-measure-tooltip dmap-measure-tooltip-static';
                measureTooltip.setOffset([0, -7]);
                unByKey(listener);
            }, this);
        }
        //创建帮助提示框
        function createHelpTooltip() {
            clearHelpTooltip();
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'dmap-measure-tooltip hidden';
            document.getElementById(map.getTarget()).appendChild(helpTooltipElement);
            helpTooltip = new Overlay({
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            map.addOverlay(helpTooltip);
        }
        function clearHelpTooltip(){
            //清除现存绘制信息
            if (helpTooltip) {
                helpTooltip.setPosition(undefined);
                map.removeOverlay(helpTooltip);
                helpTooltip = null;
            }
            if(helpTooltipElement){
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                helpTooltipElement = null;
            }
        }

        //创建测量结果提示框
        function createMeasureTooltip() {
            clearMeasureTooltip();
            measureTooltipElement = document.createElement('div');
            measureTooltipElement.className = 'dmap-measure-tooltip dmap-measure-tooltip-drawing';
            let title = document.createElement('div');
            title.className = 'dmap-measure-tooltip-title';
            title.innerHTML = '<div class="dmap-measure-tooltip-title-closer" title="关闭">X</div>';
            let content = document.createElement('div');
            content.className = 'dmap-measure-tooltip-content';
            measureTooltipElement.appendChild(title);
            measureTooltipElement.appendChild(content);
            document.getElementById(map.getTarget()).appendChild(measureTooltipElement);
            measureTooltip = new Overlay({
                element: measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            });
            measureTooltipElement
                .getElementsByClassName('dmap-measure-tooltip-title-closer')[0]
                .onclick = function(){
                    clearMeasureTooltip();
                }
        
            map.addOverlay(measureTooltip);
        }

        //清除测量结果提示框
        function clearMeasureTooltip(){
            if (measureTooltip) {
                measureTooltip.setPosition(undefined);
                map.removeOverlay(measureTooltip);
                measureTooltip = null;
            }
            if(measureTooltipElement){
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                measureTooltipElement = null;
            }
            if(sketch){
                source.clear();
                sketch = null;
            }
        }

        $this.clearMeasure = function(){
            clearHelpTooltip();
            clearMeasureTooltip();
            map.removeInteraction(draw);
        }

        $this.startMeasureDistance = function(){
            $this.clearMeasure();
            addInteraction();
        }

        $this.startMeasureArea = function(){
            $this.clearMeasure();
            addInteraction('area');
        }
    }
}