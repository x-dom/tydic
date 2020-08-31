ol.control.Measure = function (opt_options) {

    var options = opt_options || {};

    var tipLabel = options.tipLabel ?
        options.tipLabel : 'Measure';

    this.mapListeners = [];

    this.geodesic = true; //大地距离

    this.hiddenClassName = 'ol-unselectable ol-control measure';
    this.shownClassName = this.hiddenClassName + ' shown';
    this.type = options.type
    this.index = 0;//计数

    this.measureTooltips = {};//tips
    this.drawfeatures = {}; //features

    this.drawCallback = options.drawCallback;
    this.closeCallback = options.closeCallback;
    this.centerCallback = options.centerCallback;
    var divs = document.createElement('div');
    divs.className = 'ol-utils';
    var element = document.createElement('div');
    element.className = this.hiddenClassName;

    var button = document.createElement('button');
    button.setAttribute('title', tipLabel);
    element.appendChild(button);

    // 漫游
    var btn_move = document.createElement('button');
    btn_move.className = 'ol-util-move';
    btn_move.onclick = function (e) {
        if (this_.draw.getActive()) {

            this_.draw.setActive(false);
        }
        $("#gis").css("cursor", 'default');
        this_.STATE = 0;
    };
    // 放大
    var btn_zoomin = document.createElement('button');
    btn_zoomin.className = 'ol-util-zoomin';
    btn_zoomin.onclick = function (e) {
        if (this_.draw.getActive()) {
            this_.draw.setActive(false);
        }
        $("#gis").css("cursor", 'url(/image/planManager/fangda.cur), crosshair');
        this_.STATE = 1;
    };
    // 缩小
    var btn_zoomout = document.createElement('button');
    btn_zoomout.className = 'ol-util-zoomout';
    btn_zoomout.onclick = function (e) {
        if (this_.draw.getActive()) {
            this_.draw.setActive(false);
        }
        $("#gis").css("cursor", 'url(/image/planManager/suoxiao.cur), crosshair');
        this_.STATE = 2;
    };
    // 测距
    var btn_measure = document.createElement('button');
    btn_measure.className = 'ol-util-measure';
    var this_ = this;
    this_.STATE = 0;
    divs.onmouseover = function (e) {
    };
    btn_measure.onclick = function (e) {
        this_.draw.setActive(true);
        this_.createMeasureTooltip();
        e.preventDefault();
        $("#gis").css("cursor", 'default');
        this_.STATE = 3;
    };
    
    // 全图
    if(options.imageLayer && options.vectorLayer){
        var btn_center = document.createElement('button');
        btn_center.className = 'ol-util-center';
        btn_center.onclick = function (e) {
            if(typeof scenicMonitoringGISNewData == 'undefined'){
                if(imageLayer.getVisible()){
                    imageLayer.setVisible(false);
                    vectorLayer.setVisible(true);
                }else{
                    imageLayer.setVisible(true);
                    vectorLayer.setVisible(false);
                }
            }else{
    
                if(scenicMonitoringGISNewData.imageLayer.getVisible()){
                    scenicMonitoringGISNewData.imageLayer.setVisible(false);
                    scenicMonitoringGISNewData.vectorLayer.setVisible(true);
                }else{
                    scenicMonitoringGISNewData.imageLayer.setVisible(true);
                    scenicMonitoringGISNewData.vectorLayer.setVisible(false);
                }
            }
    
    
            // if (this_.draw.getActive()) {
            //     this_.draw.setActive(false);
            // }
            // // $("#gis").css("cursor", 'url(/image/planManager/suoxiao.cur), crosshair');
            //
            // this_.STATE = 4;
            // if(this_.centerCallback) {
            //     this_.centerCallback();
            // }
        };
        divs.appendChild(btn_center);
    }

    divs.onmouseout = function (e) {
        e = e || window.event;

    };
    // divs.appendChild(element);
    divs.appendChild(btn_move);
    divs.appendChild(btn_zoomin);
    divs.appendChild(btn_zoomout);
    divs.appendChild(btn_measure);	
    ol.control.Control.call(this, {
        element: divs,
        target: options.target
    });

};

ol.inherits(ol.control.Measure, ol.control.Control);


ol.control.Measure.prototype.setMap = function (map) {
    // Clean up listeners associated with the previous map
    for (var i = 0, key; i < this.mapListeners.length; i++) {
        this.getMap().unByKey(this.mapListeners[i]);
    }
    this.mapListeners.length = 0;
    // Wire up listeners etc. and store reference to new map
    ol.control.Control.prototype.setMap.call(this, map);
    this.map_ = map;
    var this_ = this;
    map.on('click', function (event) {
        if (this_.STATE == 1) {
            var view = map.getView();
            var zoomlevel = view.getZoom() + 1;
            view.setZoom(zoomlevel);
        } else if (this_.STATE == 2) {
            var view = map.getView();
            var zoomlevel = view.getZoom() - 1;
            view.setZoom(zoomlevel);
        }
    });
    if (map) {
        this.addDrawLayer();
        this.addDrawInteraction(this.type);
        this.createHelpTooltip();
        this.createMeasureTooltip();
    }

};

ol.control.Measure.prototype.addDrawLayer = function () {
    this.source = new ol.source.Vector();
    this.drawLayer = new ol.layer.Vector({
        source: this.source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.7)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    var map = this.map_;
    map.addLayer(this.drawLayer);
};
ol.control.Measure.prototype.addDrawInteraction = function (type) {
    var type = (type == 'line' ? 'LineString' : 'Polygon');
    this.draw = new ol.interaction.Draw({
        source: this.source,
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.7)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    var map = this.map_;
    if (map) {
        map.addInteraction(this.draw);
        this.draw.setActive(false);
    }
    var that = this;
    var listener;
    this.draw.on('drawstart',
        function (evt) {
            // set sketch
            that.sketch = evt.feature;


            var tooltipCoord = evt.coordinate;

            listener = that.sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = that.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = that.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                that.helpTooltipElement.innerHTML = output;
                that.helpTooltip.setPosition(tooltipCoord);
            });
        }, this.draw);
    this.draw.on('drawend',
        function (evt) {
            that.measureTooltipElement.className = 'measureTooltip tooltip-static';
            that.measureTooltips["tip" + that.index].setOffset([0, -7]);
            // unset sketch
            that.sketch = evt.feature;
            that.drawfeatures["tip" + that.index] = evt.feature;
            var tooltipCoord = evt.coordinate;
            var geom = that.sketch.getGeometry();
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = that.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = that.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            that.measureContent.innerHTML = output;


            that.measureTooltips["tip" + that.index].setPosition(tooltipCoord);
            that.helpTooltipElement.innerHTML = "";
            if (that.drawCallback) {//回调
                var wktFormat = new ol.format.WKT();
                var newgeom = geom.clone().transform("EPSG:3857", "EPSG:4326");
                var text = wktFormat.writeGeometry(newgeom)
                that.drawCallback(output, text);
            }
            ol.Observable.unByKey(listener);
            this.setActive(false);
        }, this.draw);

};


ol.control.Measure.prototype.createHelpTooltip = function () {
    if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'helpTooltip hidden';
    this.helpTooltip = new ol.Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    this.map_.addOverlay(this.helpTooltip);
}


ol.control.Measure.prototype.createMeasureTooltip = function () {
    this.index++;
//    if (this.measureTooltipElement) {
//        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
//      }
    this.measureTooltipElement = document.createElement('div');
    this.closeElement = document.createElement('a');
    this.closeElement.className = 'ol-measure-closer';
    this.measureTooltipElement.appendChild(this.closeElement);
    this.measureContent = document.createElement('div');
    this.measureContent.className = 'measureContent';
    this.measureTooltipElement.appendChild(this.measureContent);
    this.measureTooltipElement.className = 'measureTooltip tooltip-measure';
    this.measureTooltips["tip" + this.index] = new ol.Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    this.map_.addOverlay(this.measureTooltips["tip" + this.index]);
    var that = this;
    var tipsflag = "tip" + this.index;
    this.closeElement.addEventListener('click', function () {
        that.drawLayer.getSource().removeFeature(that.drawfeatures[tipsflag]);
        that.map_.removeOverlay(that.measureTooltips[tipsflag]);
        if (that.closeCallback) {
            that.closeCallback()
        }
    }, false);

}

ol.control.Measure.prototype.formatLength = function (line) {
    var length;
    var wgs84Sphere = new ol.Sphere(6378137);
    if (this.geodesic) {
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = this.map_.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
    } else {
        length = Math.round(line.getLength() * 100) / 100;
    }
    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
    }
    return output;
};
ol.control.Measure.prototype.setActive = function (flag) {

    this.draw.setActive(flag);
    if (flag) {
        this.createMeasureTooltip();
    }

}
/**
 * 计算面积
 * @param polygon
 * @returns {String}
 */
ol.control.Measure.prototype.formatArea = function (polygon) {
    var area;
    var wgs84Sphere = new ol.Sphere(6378137);
    if (this.geodesic) {
        var sourceProj = this.map_.getView().getProjection();
        var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
            sourceProj, 'EPSG:4326'));
        var coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
    } else {
        area = polygon.getArea();
    }
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;
};
ol.control.Measure.prototype.clear = function () {
    this.drawLayer.getSource().clear();
    for (var key in this.measureTooltips) {
        this.map_.removeOverlay(this.measureTooltips[key]);
    }

}

ol.control.Measure.prototype.removeTip = function () {
    if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
}
