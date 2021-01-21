ol.control.Drawing = function (opt_options) {
    var options = opt_options || {};
    this.index = 0;//计数
    this.measureTooltips = {};//tips
    this.drawfeatures = {};
    this.drawCallback = options.drawCallback;
    var divs = document.createElement('div');
    divs.className = 'ol-drawing-div';
    // var btn_add = document.createElement('checkbox');
    var btn_add = $("<label><input type='checkbox'><span>自定义区域</span></label>");
    btn_add.addClass('ol-drawing-add');
    //btn_add.innerHTML = '自定义区域';
    var this_ = this;
    var table_areaP = document.createElement('div');
    table_areaP.id ='ol-drawing-tableP';
    var table_area = document.createElement('div');

    table_area.className = 'ol-drawing-table';
    table_area.id = 'ol-drawing-table1';

    btn_add[0].onchange = function (e) {
        var isChecked = $(".ol-drawing-add>input").prop("checked");
        if(isChecked){
            $('#ol-drawing-tableP').css('visibility', 'visible');
            this_.draw.setActive(true);
            this_.createMeasureTooltip();
            e.preventDefault();
        }else{
            $('#ol-drawing-tableP').css('visibility', 'hidden');
            this_.draw.setActive(false);
            // this_.createMeasureTooltip();
            // e.preventDefault();
        }
        //$('#ol-drawing-tableP').css('visibility', 'visible');

    }
    $(divs).append(btn_add);
    divs.appendChild(table_areaP);
    table_areaP.appendChild(table_area);

    divs.onmouseover = function (e) {
    };
    divs.onmouseout = function (e) {
        e = e || window.event;

    };
    ol.control.Control.call(this, {
        element: divs,
        target: options.target
    });

}

ol.inherits(ol.control.Drawing, ol.control.Control);


ol.control.Drawing.prototype.setMap = function (map) {
    ol.control.Control.prototype.setMap.call(this, map);
    this.map_ = map;
    if (map) {
        this.addDrawLayer();
        this.addDrawInteraction();
        this.createHelpTooltip();
        this.createMeasureTooltip();
    }
}


ol.control.Drawing.prototype.addDrawLayer = function () {
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
ol.control.Drawing.prototype.addDrawInteraction = function () {
    var type = 'Polygon';
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
                if (output.indexOf('km') > 0) {
                    output = parseFloat(output.substr(0, output.indexOf(' ')));
                    if (output > 50) {
                        console.log("output=" + output);
                        that.helpTooltipElement.innerHTML += "<font color='red'>(区域面积不能超过50km<sup>2</sup>)</font>"
                    }
                }
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

            ol.Observable.unByKey(listener);
            // this.setActive(false);
            if (output.indexOf('km') > 0) {
                output = parseFloat(output.substr(0, output.indexOf(' ')));
                if (output > 50) {
                    console.log("output=" + output);
                    that.measureContent.innerHTML += "<font color='red'>(区域面积不能超过50km<sup>2</sup>)</font>"
                    return;
                }
            }
            if (that.drawCallback) {//回调
                var wktFormat = new ol.format.WKT();
                var newgeom = geom.clone().transform("EPSG:3857", "EPSG:4326");
                var text = wktFormat.writeGeometry(newgeom)
                that.drawCallback(output, text, ol.proj.transform(tooltipCoord, "EPSG:3857", "EPSG:4326"), that.index);
            }
        }, this.draw);

};


ol.control.Drawing.prototype.createHelpTooltip = function () {
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


ol.control.Drawing.prototype.createMeasureTooltip = function () {
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
ol.control.Drawing.prototype.removeArea = function (ind) {
    var tipsflag = "tip" + this.index;
    if (this.measureTooltips[tipsflag]) {
        this.drawLayer.getSource().removeFeature(this.drawfeatures[tipsflag]);
        this.map_.removeOverlay(this.measureTooltips[tipsflag]);
    }
    this.createMeasureTooltip();
}

/**
 * 计算面积
 * @param polygon
 * @returns {String}
 */
ol.control.Drawing.prototype.formatArea = function (polygon) {
    var area;
    var wgs84Sphere = new ol.Sphere(6378137);
    if (this.geodesic) {
        var sourceProj = map.getView().getProjection();
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