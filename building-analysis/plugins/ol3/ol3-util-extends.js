var ExtendUtil = {};
ExtendUtil.transformLat = function transformLat(x, y) {
    var pi = 3.1415926535897932384626;
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
};

ExtendUtil.transformLon = function transformLon(x, y) {
    var pi = 3.1415926535897932384626;
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
};

ExtendUtil.transform = function transform(lon, lat) {
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
};

ExtendUtil.gps84ToGcj02 = function gps84ToGcj02(lon, lat) {
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
};

ExtendUtil.gcjToGps84 = function gcjToGps84(lon, lat) {
    var lonlat = ExtendUtil.transform(lon, lat);
    var lontitude = lon * 2 - lonlat.x;
    var latitude = lat * 2 - lonlat.y;
    return {
        "x": lontitude,
        "y": latitude
    };
};


/**
 * 日期格式化
 * @param fmt 格式'yyyyMMdd'
 * @returns
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * 将字符串转为unicode编码，便于中文查询
 * @param str
 * @returns {String}
 */
ExtendUtil.str2Unicode = function (str) {
    var es = [];
    for (var i = 0; i < str.length; i++)
        es[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u" + es.join("\\u");
}
/**
 * 获取get请求中的参数
 * @param name 参数名称
 */
ExtendUtil.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

/**判断当前日期为当年第几周
 * @param a 年
 * @param b 月
 * @param c 日
 */
ExtendUtil.getYearWeek = function (a, b, c) {
    //date1是当前日期
    //date2是当年第一天
    //d是当前日期是今年第多少天
    //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
    var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    var weekNo = Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
    if (weekNo < 10)
        return a + "0" + weekNo;
    return a + "" + weekNo;
};

//地图定位 
/*
*Parameters
*	map	      地图对象
*   lon       经度
*   lat       纬度
*   level     放大级别
*   layer     用于显示定位图层
*   Style     显示样式
*   imgURL    图片地址
*/
ExtendUtil.locationMap = function locationMap(params) {
    var view = params.map.getView();
    var lon = parseFloat(params.lon);
    var lat = parseFloat(params.lat);
    view.setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    view.setZoom(params.level);

    params.layer.getSource().clear();
    var style;
    if (params.style)
        style = params.style;
    else
        style = new ol.style.Style({
            image: new ol.style.Icon({
                src: params.imgURL
            })
        });
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
    });
    feature.setStyle(style);
    params.layer.getSource().addFeature(feature);
}

ExtendUtil.locationByLont = function (map, lon, lat, level) {
    var view = map.getView();
    view.setCenter(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
    if(level != null){
        view.setZoom(level);
    }

}


ExtendUtil.moveMapV = function (map, value) {
    map.getView().setCenter(map.getCoordinateFromPixel([map.getSize()[0] / 2, map.getSize()[1] / 2 + value]));
}

ExtendUtil.moveMapH = function (map, value) {
    map.getView().setCenter(map.getCoordinateFromPixel([map.getSize()[0] / 2 - value, map.getSize()[1] / 2]));
}
ExtendUtil.moveMapHV = function (map, valueH, valueV) {
    map.getView().setCenter(map.getCoordinateFromPixel([map.getSize()[0] / 2 - valueH, map.getSize()[1] / 2] + valueV));
}


var dragZoom;
ExtendUtil.initTools = function (options) {
    var map = options.map;
    var barClickFun = options.barClickFun;
    if (map) {
        this.addDrawLayer(map);
        this.addDrawInteraction(map, "line");
        this.createHelpTooltip(map);
        this.createMeasureTooltip(map);
    }
    // 漫游
    document.querySelector("#pan").addEventListener('click', function () {
        barClickFun(this);
        if (dragZoom)
            dragZoom.setActive(false);
        if (ExtendUtil.draw)
            ExtendUtil.draw.setActive(false);
        document.querySelector("#gis").style.cursor = "default";
    }, false);

    // 绑定放大缩小按钮事件
    document.querySelector("#zoom_in").addEventListener('click', function () {
        barClickFun(this);
        if (dragZoom)
            map.removeInteraction(dragZoom);
        if (ExtendUtil.draw)
            ExtendUtil.draw.setActive(false);
        dragZoom = new ol.interaction.DragZoom({
            condition: ol.events.condition.always,
            out: false
            // 此处为设置拉框完成时放大还是缩小
        });
        map.addInteraction(dragZoom);
        dragZoom.setActive(true);
        document.querySelector("#gis").style.cursor = "crosshair";
    }, false);
    // 绑定放大缩小按钮事件
    document.querySelector("#zoom_out").addEventListener('click', function () {
        barClickFun(this);
        if (dragZoom)
            map.removeInteraction(dragZoom);
        if (ExtendUtil.draw)
            ExtendUtil.draw.setActive(false);
        dragZoom = new ol.interaction.DragZoom({
            condition: ol.events.condition.always,
            out: true
            // 此处为设置拉框完成时放大还是缩小
        });
        map.addInteraction(dragZoom);
        dragZoom.setActive(true);
        document.querySelector("#gis").style.cursor = "crosshair";
    }, false);

    document.querySelector("#cj").addEventListener('click', function () {
        barClickFun(this);
        if (dragZoom)
            dragZoom.setActive(false);
        ExtendUtil.draw.setActive(map, true);
        ExtendUtil.createMeasureTooltip(map);
        $("#gis").css("cursor", 'default');
    }, false);

    var tools = options.tools;
    if (tools) {
        $.each(tools, function (index, tool) {
            $("#" + tool.id).click(function () {
                barClickFun(this);
                if (dragZoom)
                    dragZoom.setActive(false);
                if (ExtendUtil.draw)
                    ExtendUtil.draw.setActive(false);
                tool.clickEvent();
            });
        });
    }
}

ExtendUtil.addDrawLayer = function (map) {
    this.source = new ol.source.Vector();
    this.drawLayer = new ol.layer.Vector({
        source: this.source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.7)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 5
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    map.addLayer(this.drawLayer);
}

ExtendUtil.addDrawInteraction = function (map, type) {
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
                width: 4
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
    if (map) {
        map.addInteraction(this.draw);
        this.draw.setActive(false);
    }
    var that = this;
    var listener;
    this.draw.on('drawstart', function (evt) {
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
    this.draw.on('drawend', function (evt) {
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

}

ExtendUtil.createHelpTooltip = function (map) {
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
    map.addOverlay(this.helpTooltip);
}
ExtendUtil.index = 0;

ExtendUtil.measureTooltips = {};//tips
ExtendUtil.drawfeatures = {}; //features
ExtendUtil.createMeasureTooltip = function (map) {
    ExtendUtil.index++;
//   if (this.measureTooltipElement) {
//       this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
//     }
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
    map.addOverlay(this.measureTooltips["tip" + this.index]);
    var that = this;
    var tipsflag = "tip" + this.index;
    this.closeElement.addEventListener('click', function () {
        that.drawLayer.getSource().removeFeature(that.drawfeatures[tipsflag]);
        map.removeOverlay(that.measureTooltips[tipsflag]);
        if (that.closeCallback) {
            that.closeCallback()
        }
    }, false);
}

ExtendUtil.formatLength = function (line) {
    var length;
    var wgs84Sphere = new ol.Sphere(6378137);
    if (this.geodesic) {
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = map.getView().getProjection();
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
}

ExtendUtil.setActive = function (map, flag) {
    this.draw.setActive(flag);
    if (flag) {
        this.createMeasureTooltip(map);
    }
}

//function clear() {
//    this.drawLayer.getSource().clear();
//    for (var key in this.measureTooltips) {
//        map.removeOverlay(this.measureTooltips[key]);
//    }
//
//}

//function removeTip() {
//    if (this.measureTooltipElement) {
//        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
//    }
//}

var container, content, closer;
var overlay;
ExtendUtil.initCellPopup = function () {
    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    closer = document.getElementById('popup-closer');

    // closer.onclick = cellClickClose();
    $("#popup-closer").click(function () {
        if (overlay) {
            overlay.setPosition(undefined);
        }
        if (closer) {
            closer.blur();
        }
    });
    //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度. 单位为毫秒（ms）
    overlay = new ol.Overlay(
        ({
            element: container,
            autoPan: false,
            autoPanAnimation: {
                duration: 250

            }
        }));
}
/**
 * 加载小区信息
 * @param feature
 * @param dayNo
 * @returns {string}
 */
ExtendUtil.getCellShortInfo = function (feature, dayNo) {
    var f = null;
    $.ajax({
        url: ROOT + "fdback/getCellInfo",
        type: "POST",
        async: false,
        dataType: "json",
        data: {
            enbId: feature.enbId==undefined?feature.enb_id:feature.enbId,
            cellId: feature.cellId==undefined?feature.cell_id:feature.cellId,
            dayNo: dayNo
        },
        success: function (data) {
            if (data) {
                f = data;
            }


        }
    });
    var html = "";
    if (f) {
        // html += " <div class='w400' id='w400'>";
        // html += "<div class='leaflet-popup-content-wrapper'>";
        // html += "<div class='ttBox'><a class='clsBtn' id='closeP'></a><span class='tt'>扇区基本信息</span><div class='clear'></div></div>";
        // html += "    <div class='txtBox p15'>";
        html += "        <ul>";
        html += "        <li><span>扇区中文名：</span><a class='col_blu' onclick='ExtendUtil.loadCellDetail(" + JSON.stringify(f).replace(/"/g, '&quot;') + ")'>" + f.cell_name + "</a></li>";
        html += "    <li><span>物理站点名称：</span>" + f.physic_jz + "</li>";
        html += "    <li><span>工程站号：</span>" + f.project_id + "</li>";
        html += "    </ul>";
        html += "    <ul>";
        html += "    <li class='fl w50'><span>ENBID：</span>" + f.enb_id + " </li>";
        html += "    <li class='fl w50'><span>CELLID：</span>" + f.cell_id + " </li>";
        html += "    <li class='fl w50'><span>索引关键值(ECI)：</span>" + f.eci + " </li>";
        html += "    <li class='fl w50'><span>设备厂家：</span>" + f.vendor_name + " </li>";
        html += "    <li class='fl w50'><span>是否同PCI小区：</span>" + f.whether_pci_cell + "</li>";
        html += "    <li class='fl w50'><span>同PCI小区编号：</span>" + f.same_pci_bid + " </li>";
        html += "    <li class='fl w50'><span>站点类型：</span>" + f.z_type + "</li>";
        html += "    <li class='fl w50'><span>PCI：</span>" + f.reservedfield3 + "</li>";
        html += "    <li class='fl w50'><span>设备是否共享：</span>" + f.share + " </li>";
        html += "    <li class='fl w50'><span>覆盖区域类型：</span>" + f.cover_earatype + " </li>";
        html += "    <li class='fl w50'><span>扇区覆盖热点类型：</span>" + f.cover_hot_type + "</li>";
        html += "    <li class='fl w50'><span>扇区覆盖道路类型：</span>" + f.cover_way_type + " </li>";
        html += "    <li class='fl w50'><span>天线方位角：</span>" + f.dir + "</li>";
        html += "    <li class='fl w50'><span>边界扇区类型：</span>" + f.border_type + "</li>";
        html += "    <li class='fl w50'><span>扇区经度：</span>" + (gcj02towgs84(f.longitude,f.latitude)[0]).toFixed(6) + " </li>";
        html += "    <li class='fl w50'><span>扇区纬度：</span>" + (gcj02towgs84(f.longitude,f.latitude)[1]).toFixed(6) + "</li>";
        html += "    <div class='clear'></div>";
        html += "        </ul>";
        // html += "        </div>";
        // html += "        </div>";
        // html += "<div class='leaflet-popup-tip-container'><div class='leaflet-popup-tip'></div></div>";
        // html += "    </div>";
    }
    return html
}

/**
 * 加载扇区的详细信息
 * @param f
 */
ExtendUtil.loadCellDetail = function (f) {
    // var zooflow_cell_str = f.is_zooflow_cell == '1' ? '是' : '否';
    var html = "";
    html += "<div class='w1000'>";
    html += "    <div class='leaflet-popup-content-wrapper'>    ";
    html += "        <div class='ttBox'><a class='clsBtn'></a><span class='tt'>扇区信息</span><div class='clear'></div></div>";
    html += "        <div class='txtBox2 p15' id='style-1'>";
    html += "                <table width='100%' border='0' cellspacing='0' cellpadding='0' class='table1'>";
    html += "                        <tr>";
    html += "                          <th>地理信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>省：安徽省 </td>";
    html += "                          <td>市：" + f.city_name + "</td>";
    html += "                          <td>区县：" + f.county_name + "</td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <th>小区信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td colspan='2'>物理站点名称：" + utilsTool.nullToLine(f.physic_jz) + " </td>";
    html += "                          <td colspan='2'>扇区中文名称：" + utilsTool.nullToLine(f.cell_name) + " </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>索引关键值：" + utilsTool.nullToLine(f.eci) + "</td>";
    html += "                          <td>扇区经度：" + utilsTool.nullToLine(f.longitude) + "</td>";
    html += "                          <td>扇区纬度：" + utilsTool.nullToLine(f.latitude) + "</td>";
    html += "                          <td>设备厂家：" + utilsTool.nullToLine(f.verdon_name) + " </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>是否同PCI小区：" + utilsTool.nullToLine(f.whether_pci_cell) + " </td>";
    html += "                          <td>同PCI小区编号：" + utilsTool.nullToLine(f.same_pci_bid) + " </td>";
    html += "                          <td>PCI：" + utilsTool.nullToLine(f.reservedfield3) + " </td>";
    html += "                          <td>扇区状态：" + utilsTool.nullToLine(f.status) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>是否功分扇区：" + utilsTool.nullToLine(f.whether_sq) + " </td>";
    html += "                          <td>功分扇区编号：" + utilsTool.nullToLine(f.sq_bid) + " </td>";
    html += "                          <td>是否BBU池：" + utilsTool.nullToLine(f.whether_bbu) + " </td>";
    html += "                          <td>归属BBU池名称：" + utilsTool.nullToLine(f.belongto_bbu) + " </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>扇区覆盖区域类型：" + utilsTool.nullToLine(f.cover_earatype) + " </td>";
    html += "                          <td>扇区覆盖热点类型：" + utilsTool.nullToLine(f.cover_hot_type) + " </td>";
    html += "                          <td>业务类型：" + utilsTool.nullToLine(f.business_type) + " </td>";
    html += "                          <td>工程站号：" + utilsTool.nullToLine(f.project_id) + " </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>覆盖高校信息：" + utilsTool.nullToLine(f.university_cover) + "</td>";
    html += "                          <td>覆盖高铁信息：" + utilsTool.nullToLine(f.high_rail_cover) + "</td>";
    html += "                          <td>覆盖高速信息：" + utilsTool.nullToLine(f.high_speed_cover) + "</td>";
    html += "                          <td>覆盖高密度住宅信息：" + utilsTool.nullToLine(f.high_housing_cover) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>覆盖高流量商务区信息：" + utilsTool.nullToLine(f.high_flow_cover) + "</td>";
    html += "                          <td>覆盖地铁信息：" + utilsTool.nullToLine(f.subway_cover) + "</td>";
    html += "                          <td>是否校园优惠小区：" + utilsTool.nullToLine(f.if_campus_discount) + "</td>";
    html += "                          <td>扇区类别：" + utilsTool.nullToLine(f.cell_type) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>设备是否共享：" + utilsTool.nullToLine(f.share) + "</td>";
    html += "                          <td>共建共享方式：" + utilsTool.nullToLine(f.share_type) + "</td>";
    html += "                          <td>是否级联小区：" + utilsTool.nullToLine(f.whether_contact_cell) + " </td>";
    html += "                          <td>级联小区编号：" + utilsTool.nullToLine(f.cascade_cellbid) + " </td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <th>天线信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>天线方位角：" + utilsTool.nullToLine(f.dir) + " </td>";
    html += "                          <td>下倾角(度)：" + utilsTool.nullToLine(f.reservedfield1) + " </td>";
    html += "                          <td>天线挂高(米)：" + utilsTool.nullToLine(f.reservedfield2) + "</td>";
    html += "                          <td>海拔高度(米)：" + utilsTool.nullToLine(f.ant_elevation) + "</td>";
    html += "                        </tr>";
    html += "                          <th>参数信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>TAC：" + utilsTool.nullToLine(f.tac) + " </td>";
    html += "                          <td>下行中心频点：" + utilsTool.nullToLine(f.downlink_center_frequency) + " </td>";
    html += "                          <td>下行带宽：" + utilsTool.nullToLine(f.downlink_broadband) + "</td>";
    html += "                          <td>频段指示：" + utilsTool.nullToLine(f.bandindicator) + "</td>";
    html += "                        </tr>";
    html += "                          <th>CA信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>载波合路方式：" + utilsTool.nullToLine(f.carrier_combiner_mode) + " </td>";
    html += "                          <td>CARRU型号：" + utilsTool.nullToLine(f.deputy_rru_model) + " </td>";
    html += "                          <td>CARRU频段：" + utilsTool.nullToLine(f.deputy_rru_band) + "</td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <th>业务规模</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>白天常驻用户数：" + utilsTool.nullToLine(f.user_cnt_work) + " </td>";
    html += "                          <td>夜间常驻用户数：" + utilsTool.nullToLine(f.user_cnt_rest) + " </td>";
    html += "                          <td>流量(GB)：" + utilsTool.nullToLine(utilsTool.flowNumberProcess(f.sum_l_thrp_bits)) + "</td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <th>网络覆盖</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>平均RSRP(dBm)：" + utilsTool.nullToLine(f.avg_rsrp) + "</td>";
    html += "                          <td>MR覆盖率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.per_po_110)) + "</td>";
    html += "                          <td>对标电信覆盖率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.ct_per_po_110)) + "</td>";
    html += "                          <td>对标移动覆盖率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.ct_cm_per_po_110)) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>对标联通覆盖率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.ct_cu_per_po_110)) + "</td>";
    html += "                          <td></td>";
    html += "                          <td></td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <th>网络质量</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>重定向比例(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.avg_l_redirect_3g_rate)) + "</td>";
    html += "                          <td>CQI优良比(%) ：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.avg_cqi_ge7_rate)) + "</td>";
    html += "                          <td>是否异常小区：" + utilsTool.numberToTrueFalse(f.is_abnormal_cell) + "</td>";
    html += "                          <td>异常类型：" + utilsTool.nullToLine(f.abnormal_type) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>是否故障小区：" + utilsTool.numberToTrueFalse(f.is_error_cell) + "</td>";
    html += "                          <td>故障类型：" + utilsTool.nullToLine(f.error_type) + "</td>";
    html += "                          <td>故障发生时间：" + utilsTool.nullToLine(f.error_time) + " </td>";
    html += "                          <td>故障恢复时间：" + utilsTool.nullToLine(f.clear_error_time) + "</td>";
    html += "                        </tr>";
    html += "                         <tr>";
    html += "                          <th>网络负荷</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        </tr>";
    html += "                          <td>是否高负荷小区：" + utilsTool.numberToTrueFalse(f.is_highflow_cell) + "</td>";
    html += "                          <td>前一自然周是否高负荷小区：" + utilsTool.numberToTrueFalse(f.is_highflow_cell_w) + "</td>";
    html += "                          <td>是否零流量小区：" + utilsTool.numberToTrueFalse(f.is_zooflow_cell) + "</td>";
    html += "                          <td>前一自然周是否零流量小区：" + utilsTool.numberToTrueFalse(f.is_zooflow_cell_w) + " </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>最大RRC连接用户数：" + utilsTool.nullToLine(f.sum_l_traffic_enodeb_user_max) + " </td>";
    html += "                          <td>上行PRB利用率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.avg_l_chmeas_prb_dl_used_rate)) + " </td>";
    html += "                          <td>下行PRB利用率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.avg_l_chmeas_prb_ul_used_rate)) + "</td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>上行PDCP层用户面流量(GB)：" + utilsTool.nullToLine(utilsTool.flowNumberProcess(f.up_pdcp_flow)) + "</td>";
    html += "                          <td>下行PDCP层用户面流量(GB)：" + utilsTool.nullToLine(utilsTool.flowNumberProcess(f.down_pdcp_flow)) + " </td>";
    html += "                          <td></td>";
    html += "                          <td></td>";
    html += "                        <tr>";
    html += "                          <th>网络感知</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>总体优良率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.service_good_rat)) + "</td>";
    html += "                          <td>网页浏览类优良率(%) ：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.http_service_good_rat)) + " </td>";
    html += "                          <td>视频类优良率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.vide_service_good_rat)) + "</td>";
    html += "                          <td>游戏类优良率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.game_good_rat)) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>即时通讯类优良率(%)：" + utilsTool.nullToLine(utilsTool.rateNumberProcess(f.im_good_rat)) + "</td>";
    html += "                          <td></td>";
    html += "                          <td></td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <th>其他信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>扇区机房共享情况：" + utilsTool.nullToLine(f.eutrancell_circuitroom_share) + "</td>";
    html += "                          <td>扇区机房产权方：" + utilsTool.nullToLine(f.eutrancell_circuitroom_owner) + "</td>";
    html += "                          <td>塔桅共享情况：" + utilsTool.nullToLine(f.tower_mast_share_name) + "</td>";
    html += "                          <td>塔桅产权方：" + utilsTool.nullToLine(f.tower_property_rights_name) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>塔桅类型：" + utilsTool.nullToLine(f.tower_mast_type_name) + "</td>";
    html += "                          <td>边界扇区类型：" + utilsTool.nullToLine(f.boundary_type_name) + "</td>";
    html += "                          <td>边界区域类型：" + utilsTool.nullToLine(f.border_type_name) + "</td>";
    html += "                          <td> </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>带直放站数量：" + utilsTool.nullToLine(f.repeatercount) + "</td>";
    html += "                          <td>带室分系统数量：" + utilsTool.nullToLine(f.sfxtsl) + "</td>";
    html += "                          <td>数据最近更新时间：" + utilsTool.nullToLine(f.data_renewal_date) + "</td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                      </table>";
    html += "        </div>";
    html += "    </div>";
    html += "    </div>";
    layer.open({
        type: 1,
        title: false,
        closeBtn: 2,
        area: ["1000px", "auto"],
        shadeClose: true,
        skin: 'yourclass',
        content: html
    });
}


/**
 * 加载话单的详细信息
 * @param f
 */
ExtendUtil.loadRecordDetail = function (f) {
    var html = "";
    html += "<div class='w1300'>";
    html += "    <div class='leaflet-popup-content-wrapper'>    ";
    html += "        <div class='ttBox'><a class='clsBtn'></a><span class='tt'>话单信息</span><div class='clear'></div></div>";
    html += "        <div class='txtBox2 p15' id='style-1'>";
    html += "                <table width='100%' border='0' cellspacing='0' cellpadding='0' class='table1'>";
    html += "                        <tr>";
    html += "                          <th>基本信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>话单ID："+f.cdr_id+" </td>";
    html += "                          <td>imsi：" + f.imsi_name + "</td>";
    html += "                          <td>imei：" + f.imei_name + "</td>";
    html += "                          <td>msisdn：" + f.msisdn_name + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>业务类型："+f.business_type_cn+" </td>";
    html += "                          <td>话单开始时间：" + f.cdr_starttime + "</td>";
    html += "                          <td>话单结束时间：" + f.cdr_endtime + "</td>";
    html += "                          <td>时间：" + f.hour_no + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <th>接入/释放信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td colspan='2'>接入扇区名称：" + utilsTool.nullToLine(f.ac_cellname) + " </td>";
    html += "                          <td colspan='2'>释放扇区名称：" + utilsTool.nullToLine(f.rls_cellname) + " </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>接入城市：" + utilsTool.nullToLine(f.ac_city_name) + "</td>";
    html += "                          <td>CDR接入经度：" + (utils.nullDetectionZero(f.ac_longitude1)).toFixed(5) + "</td>";
    html += "                          <td>CDR接入纬度：" + (utils.nullDetectionZero(f.ac_latitude1)).toFixed(5) + "</td>";
    html += "                          <td>是否接入异常：" + utilsTool.numberToTrueFalse(f.ac_flag) + " </td>";
    html += "                        </tr>";

    html += "                        <tr>";
    html += "                          <td>释放城市：" + utilsTool.nullToLine(f.rls_city_name) + "</td>";
    html += "                          <td>CDR释放经度：" + (utils.nullDetectionZero(f.rls_longitude)).toFixed(5) + "</td>";
    html += "                          <td>CDR释放纬度：" + (utils.nullDetectionZero(f.rls_latitude)).toFixed(5) + "</td>";
    html += "                          <td>是否释放异常：" + utilsTool.numberToTrueFalse(f.rls_flag) + " </td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>定位类型：" + utilsTool.locationType(f.ac_lon_lat_type) + "</td>";
    html += "                          <td>定位经度：" + (utils.nullDetectionZero(f.ac_longitude)).toFixed(5) + "</td>";
    html += "                          <td>定位纬度：" + (utils.nullDetectionZero(f.ac_latitude)).toFixed(5) + "</td>";
    html += "                          <td> </td>";
    html += "                        </tr>";

    html += "                        <tr>";
    html += "                          <th>事件信息</th><th></th><th></th><th></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>单流：" + utilsTool.numberToTrueFalse(f.cdr_mimo_flag) + "  ( 数值: "+  utilsTool.nullToLine(f.cdr_mimo_id)+" )</td>";
    html += "                          <td>AC-弱覆盖：" + utilsTool.numberToTrueFalse(f.ac_mr_ltescrsrp_flag) + " ( 数值: "+ utilsTool.nullToLine(f.ac_mr_ltescrsrp) +" )</td>";
    html += "                          <td>AC-CQI：" + utilsTool.numberToTrueFalse(f.ac_mr_ltesccqi4_flag) + " ( 数值: "+ utilsTool.nullToLine(f.ac_mr_ltesccqi4) +" )</td>";
    html += "                          <td>AC-RRC失败：" + utilsTool.numberToTrueFalse(f.ac_rrcfailure_flag) + " ( 数值: "+ utilsTool.nullToLine(f.ac_rrcfailurecause) +",  UE随机接入值: "+ utilsTool.nullToLine(f.ac_rrcestablishmentcause) +" )</td>";
    html += "                        </tr>";

    html += "                        <tr>";
    html += "                          <td>RLS-4G重定向3G：" + utilsTool.numberToTrueFalse(f.rls_redirection_flag) + "</td>";
    html += "                          <td>重定向时间：" + utilsTool.nullToLine(f.rls_redirection_time) + "</td>";
    html += "                          <td>重定向系统：" + utilsTool.nullToLine(f.rls_redirection_system) + "</td>";
    html += "                          <td>重定向载波号：" + utilsTool.nullToLine(f.rls_redirection_earfcn) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>ERAB-建立失败：" + utilsTool.numberToTrueFalse(f.erab_setupfailure_flag) + "</td>";
    html += "                          <td>ERAB-释放异常：" + utilsTool.numberToTrueFalse(f.erab_rlsresult_flag) + " </td>";
    html += "                          <td>ERAB-上行丢包率：" + utilsTool.numberToTrueFalse(f.erab_ul_packet_droprate_flag) + "</td>";
    html += "                          <td>ERAB-下行丢包率：" + utilsTool.numberToTrueFalse(f.erab_dl_packet_lossrate_flag) + "</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>RLS-CQI：" + utilsTool.numberToTrueFalse(f.rls_mr_ltesccqi4_flag) + " ( 数值: "+ utilsTool.nullToLine(f.rls_mr_ltesccqi4) +" )</td>";
    html += "                          <td>AC-SINR：" + utilsTool.numberToTrueFalse(f.ac_mr_ltescsinrul_flag) + " ( 数值: "+ utilsTool.nullToLine(f.ac_mr_ltescsinrul) +" )</td>";
    html += "                          <td>RLS-释放异常：" + utilsTool.numberToTrueFalse(f.rls_rrcresult_flag) + " ( 数值: "+ utilsTool.nullToLine(f.rls_rrcresult) +" )</td>";
    // html += "                          <td>承载释放结果异常：" + utilsTool.numberToTrueFalse(f.erab_rlsresult_flag) + "</td>";
    html += "                          <td></td>";
    html += "                        </tr>";
    html += "                        </table>";

    html += "                        <table width='100%' border='0' cellspacing='0' cellpadding='0' class='table1'>";
    html += "                        <tr>";
    html += "                          <th>ERAB-异常原因</th><th></th><th></th><th></th><th></th><th></th><th> <a href='../../pages/volte/cause.html' target='cause' id='11'>ERAB 建立/释放失败的原因值</a></th>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>ERAB.1-8</td>";
    html += "                          <td>erab_qci</td>";
    html += "                          <td>erab_setupfailurecause</td>";
    html += "                          <td>erab_rlsfailurecause</td>";
    html += "                          <td>erab_rlsresult</td>";
    html += "                          <td>erab_ul_packet_droprate</td>";
    html += "                          <td>erab_dl_packet_lossrate</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>1</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci1)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_1)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_1)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_1)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate1)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate1)+"</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>2</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci2)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_2)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_2)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_2)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate2)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate2)+"</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>3</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci3)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_3)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_3)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_3)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate3)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate3)+"</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>4</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci4)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_4)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_4)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_4)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate4)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate4)+"</td>";
    html += "                        </tr>";
    html += "                        <tr>";
    html += "                          <td>5</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci5)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_5)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_5)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_5)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate5)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate5)+"</td>";
    html += "                        </tr>";
    html += "                          <td>6</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci6)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_6)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_6)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_6)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate6)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate6)+"</td>";
    html += "                        </tr>";
    html += "                        </tr>";
    html += "                          <td>7</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci7)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_7)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_7)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_7)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate7)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate7)+"</td>";
    html += "                        </tr>";
    html += "                        </tr>";
    html += "                          <td>8</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_qci8)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_setupfailurecause_8)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsfailurecause_8)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_rlsresult_8)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_ul_packet_droprate8)+"</td>";
    html += "                          <td>"+utilsTool.nullToLine(f.erab_dl_packet_lossrate8)+"</td>";
    html += "                        </tr>";
    html += "                      </table>";
    html += "        </div>";
    html += "    </div>";
    html += "    </div>";
    layer.open({
        type: 1,
        title: false,
        closeBtn: 2,
        area: ["1300px", "auto"],
        shadeClose: true,
        skin: 'yourclass',
        content: html
    });
}

/**
 *
 * @param str
 * @returns {string}
 */
ExtendUtil.desenMdn = function(str){
    if(typeof str == 'string'){ //参数为字符串类型
        let ruten = str.substring(3,7); //提取字符串下标之间的字符。
        return str.replace(ruten,'****'); //字符串中用字符替换另外字符，或替换一个与正则表达式匹配的子串。
    }else{
        return "****";
    }
}


/**
 *  大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
 */
ExtendUtil.VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1 / 298.257223563
}

/**
 * 度换成弧度
 * @param  {Float} d  度
 * @return {[Float}   弧度
 */
ExtendUtil.rad = function(d) {
    return d * Math.PI / 180.0;
}

/**
 * 弧度换成度
 * @param  {Float} x 弧度
 * @return {Float}   度
 */
ExtendUtil.deg = function(x) {
    return x * 180 / Math.PI;
}


/**
 * 计算另一点经纬度
 *
 * @param lon
 *            经度
 * @param lat
 *            维度
 * @param brng
 *            方位角
 * @param dist
 *            距离（米）
 */
ExtendUtil.destinationVincenty = function(lon, lat, brng, dist) {
    var ct = ExtendUtil.VincentyConstants;
    var a = ct.a, b = ct.b, f = ct.f;

    var lon1 = lon * 1;  //乘一（*1）是为了确保经纬度的数据类型为number
    var lat1 = lat * 1;

    var s = dist;
    var alpha1 = ExtendUtil.rad(brng);
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);

    var tanU1 = (1 - f) * Math.tan(ExtendUtil.rad(lat1));
    var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha * sinAlpha;
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

    var sigma = s / (b * A), sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b * A) + deltaSigma;
    }

    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    var L = lambda - (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

    var revAz = Math.atan2(sinAlpha, -tmp);  // final bearing


    var lon_destina = lon1 * 1 + ExtendUtil.deg(L);

    //var num_lon_dest = lon_destina*1;

    //var lon_destina = new Number;

    var lonlat_destination = {x: lon_destina, y: ExtendUtil.deg(lat2)};

    return lonlat_destination;
}

ExtendUtil.clearDrawCircle = function () {
    if (self.drawCircleLayer1) {
        self.drawCircleLayer1.getSource().clear();
    }
    if (self.drawCircleLayer2) {
        self.drawCircleLayer2.getSource().clear();
    }
    if (self.drawCircleLayer3) {
        self.drawCircleLayer3.getSource().clear();
    }
    if (self.drawCircleLayer4) {
        self.drawCircleLayer4.getSource().clear();
    }
}

/**
 * 通过经纬度，进行地图定位
 */
ExtendUtil.location = function (lon, lat) {
    var view = self.map.getView();
    self.map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
}


/**
 * 生成扇形的点 以 y轴方向 顺时针进行生成的  这个方法是自己写的  所以不需要版本的限制
 * @param origin
 * @param radius
 * @param sides
 * @param r
 * @param angel
 * @returns {ol.geom.Polygon}
 * @constructor
 */
//此方法是 生成扇形的点 以 y轴方向 顺时针进行生成的  这个方法是自己写的  所以不需要版本的限制
//此处的  origin 把 116.28, 39.54  转化成 'EPSG:3857'  这样误差小  任何角度的扇形 都很正常
//        没有转化的 经纬度 在  45角时候  图形 有点畸形 误差大
ExtendUtil.getMarcoXyArcArray = function (origin, radius, sides, r, angel) {
    var x = [];
    x[0] = [origin[0], origin[1]];
    for (var j = 1; j < sides; j++) {
        var tx = origin[0] + radius * Math.cos(Math.PI / 180 * (90 - angel + (sides / 2 - j) * r / (sides - 2)));

        var ty = origin[1] + radius * Math.sin(Math.PI / 180 * (90 - angel + (sides / 2 - j) * r / (sides - 2)));

        x[j] = [tx, ty];
    }
    //alert(x);
    return new ol.geom.Polygon([x]);
}


// 创建聚合图层
ExtendUtil.createCluster = function(features, layer, pic1, pic2) {
    var source = new ol.source.Vector({
        features: features
    });
    var clusterSource = new ol.source.Cluster({
        distance: 40,
        source: source
    });

    var styleCache = {};
    if (layer) {
        map.removeLayer(layer);
        layer = null;
    }

    //初始化矢量图层
    layer = new ol.layer.Vector({
        zIndex: 2,
        source: clusterSource,
        style: function (feature) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (size == 1) {
                style = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: pic1
                    })
                });
                styleCache[size] = style;
            }

            if (!style) {
                style = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: pic2
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        font: "8px",
                        fill: new ol.style.Fill({
                            color: '#ffffff'
                        })
                    })
                });
                styleCache[size] = style;
            }
            return style;
        }
    });

    return layer;

}


/**
 * 画圆
 * @flag 0：画3个， 1：画4个（超远覆盖）
 */
ExtendUtil.drawCircle = function (feature, flag) {
    console.log("画圆 flag="+flag)
    ExtendUtil.clearDrawCircle();
    if (!(feature.z_type == '室外站' || feature.ztype == '室外站' || feature.zType == '室外站')) {
        return;
    }
    console.log(feature)
    if (self.drawCircleLayer1) {
        self.drawCircleLayer1.getSource().clear();
    } else {
        self.drawCircleLayer1 = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: function (feature) {
                var s = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 0)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#00ff00',
                        width: 1
                    })
                });
                return s;
            }
        });
        map.addLayer(self.drawCircleLayer1)
        self.drawCircleLayer1.setVisible(true);

        if (self.drawCircleLayer2) {
            self.drawCircleLayer2.getSource().clear();
        } else {
            self.drawCircleLayer2 = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 0)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffff00',
                        width: 1
                    })
                })
            });
            map.addLayer(self.drawCircleLayer2)
        }
        self.drawCircleLayer2.setVisible(true);

        if (self.drawCircleLayer3) {
            self.drawCircleLayer3.getSource().clear();
        } else {
            self.drawCircleLayer3 = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: function (feature) {
                    var s = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ff0000',
                            width: 1
                        })
                    });
                    return s;
                }
            });
            map.addLayer(self.drawCircleLayer3)
        }
        self.drawCircleLayer3.setVisible(true);
    }


    var geom = new ol.geom.Point(ol.proj.transform([feature.longitude, feature.latitude], 'EPSG:4326', 'EPSG:3857'));
    var origin = ol.proj.transform([feature.longitude, feature.latitude], 'EPSG:4326', 'EPSG:3857');//根据经纬度生成圆点

    if (feature.coverType == "城区" || feature.cover_type == "城区" || feature.covertype == "城区") {
        //圆形,中心点和半径
        var cricle1 = new ol.geom.Circle(origin, 590);
        var feature1 = new ol.Feature({
            geometry: cricle1,
        });
        self.drawCircleLayer1.getSource().addFeatures([feature1]);

        var cricle2 = new ol.geom.Circle(origin, 940);
        var feature2 = new ol.Feature({
            geometry: cricle2,
        });
        self.drawCircleLayer2.getSource().addFeatures([feature2]);

        var cricle3 = new ol.geom.Circle(origin, 1180);
        var feature3 = new ol.Feature({
            geometry: cricle3,
        });
        self.drawCircleLayer3.getSource().addFeatures([feature3]);
    } else if (feature.coverType == "农村" || feature.cover_type == "农村" || feature.covertype == "农村") {
        //圆形,中心点和半径
        var cricle1 = new ol.geom.Circle(origin, 1180);
        var feature1 = new ol.Feature({
            geometry: cricle1,
            labelPoint: geom,
            name: '1000米'
        });
        self.drawCircleLayer1.getSource().addFeatures([feature1]);

        var cricle2 = new ol.geom.Circle(origin, 2360);
        var feature2 = new ol.Feature({
            geometry: cricle2,
            labelPoint: geom,
            name: '2000米'
        });
        self.drawCircleLayer2.getSource().addFeatures([feature2]);

        var cricle3 = new ol.geom.Circle(origin, 3530);
        var feature3 = new ol.Feature({
            geometry: cricle3,
            labelPoint: geom,
            name: '3000米'
        });
        self.drawCircleLayer3.getSource().addFeatures([feature3]);

        if (flag == 1) {

            if (self.drawCircleLayer4) {
                self.drawCircleLayer4.getSource().clear();
            } else {
                self.drawCircleLayer4 = new ol.layer.Vector({
                    source: new ol.source.Vector(),
                    style: function (feature) {
                        var s = new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 0, 0, 0)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#ff0000',
                                width: 1
                            })
                        });
                        return s;
                    }
                });
                map.addLayer(self.drawCircleLayer4)
            }
            self.drawCircleLayer4.setVisible(true);


            var cricle4 = new ol.geom.Circle(origin, 4715);
            var feature4 = new ol.Feature({
                geometry: cricle4,
                labelPoint: geom,
                name: '4000米'
            });
            self.drawCircleLayer4.getSource().addFeatures([feature4]);

            map.addLayer(self.drawCircleLayer4);
        }
    }

    map.addLayer(self.drawCircleLayer1);
    map.addLayer(self.drawCircleLayer2);
    map.addLayer(self.drawCircleLayer3);


}

/**
 * 加载时间轴
 */
ExtendUtil.loadTimeAxis = function (feature) {
    var params = getParams();
    var time = params.timeValue;//
    var url = ROOT + "fdback/getDaysByWeek";
    var html = '';
    $.ajax({
        url: url,
        type: "POST",
        // async: false,
        dataType: "json",
        data: {
            weekNo: time
        },
        success: function (data) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var value = data[i];
                var yu = i % 4;
                html += "<div class='time-axis-day1 fl time-" + yu + "' onclick='ExtendUtil.clickTimeAxis(" + value + ",1, this);'>";
                html += "<p>" + value.substring(4) + "</p>";
                html += "</div>";
            }
            var yu = len % 4;
            html += "<div class='time-axis-day1 fl time-" + yu + " time-today' onclick='ExtendUtil.clickTimeAxis(" + time + ",0, this);'>";
            html += "<p>" + time + "</p>";
            html += "</div>";

            $("#time-axis .time-axis-day").append(html);
            $("#time-axis").show();

        }
    });
}

/**
 * 点击时间轴 加载栅格
 */
ExtendUtil.clickTimeAxis = function (time, type, dom) {
    console.log("点击时间轴 加载栅格")
    $("#time-axis .time-axis-day .time-axis-day1").removeClass("time-today");
    $(dom).addClass("time-today");
    var feature = nowFeature;
    feature.time = time
    ExtendUtil.loadCellGrid(feature, type);
}

/**
 * 关闭时间轴
 */
ExtendUtil.closeTimeAxis = function () {
    $("#time-axis").hide();
    $("#time-axis .time-axis-day").empty();
}

/**
 * 加载小区栅格
 * @param feature 小区信息
 * @param type 粒度 ，0 周粒度，1天粒度
 */
ExtendUtil.loadCellGrid = function (feature, type) {
    console.log("加载小区栅格")
    console.log(feature)
    if(feature.cover_way_type == '高铁' || feature.cover_way_type == '铁路'){
        console("高铁小区不加载栅格");
        return;
    }
    var f = null;
    var url = ROOT + "fdback/getGridById";

    if (self.rsrpLayer) {
        self.rsrpLayer.getSource().clear();
    } else {
        self.rsrpLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });
        map.addLayer(self.rsrpLayer);
    }
    $.ajax({
        url: url,
        type: "POST",
        // async: false,
        dataType: "json",
        data: {
            enbId: feature.enbId,
            cellId: feature.cellId,
            time: feature.time,
            type: type
        },
        success: function (data) {
            if (data == null || data.length == 0) {
                $.messager.alert("温馨提示", "查询日期无栅格数据!", "info");
                return;
            }
            $.each(data, function (index, value) {
                var x1 = value.left_lon;
                var y1 = value.left_lat;
                var x2 = value.right_lon;
                var y2 = value.right_lat;
                var rsrp_avg = value.rsrp_avg;
                var polygon = new ol.geom.Polygon([[[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]]]).transform('EPSG:4326', 'EPSG:3857');
                var gridFeature = new ol.Feature(polygon);
                var color;
                if (feature.ztype == "室外站" || feature.z_type == '室外站' || feature.zType == '室外站') {// 宏站
                    if (rsrp_avg >= -95){
                        color = "rgba(0,255,0, 0.6)";
                    }
                    else if (rsrp_avg < -95 && rsrp_avg >= -105){
                        color = "rgba(255,255,0,0.6)";
                    }else{
                        color = "rgba(255,0,0,0.6)";
                    }
                } else if (feature.ztype == "专用室分源" || feature.z_type == "专用室分源" || feature.zType == "专用室分源") {// 室分站
                    if (rsrp_avg >= -100){
                        color = "rgba(0,255,0, 0.6)";
                    }
                    else if (rsrp_avg < -100 && rsrp_avg >= -110){
                        color = "rgba(255,255,0,0.6)";
                    }
                    else {
                        color = "rgba(255,0,0,0.6)";
                    }

                }else{
                    if (rsrp_avg >= -95){
                        color = "rgba(0,255,0, 0.6)";
                    }
                    else if (rsrp_avg < -95 && rsrp_avg >= -105){
                        color = "rgba(255,255,0,0.6)";
                    }else{
                        color = "rgba(255,0,0,0.6)";
                    }
                }

                var style = new ol.style.Style({
                    fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
                        color: color
                    }),
                    stroke: new ol.style.Stroke({ //边界样式
                        color: color,
                        width: 1
                    })
                });
                gridFeature.setStyle(style);
                self.rsrpLayer.getSource().addFeatures([gridFeature]);
            });
        }
    });
};

/** 坐标转换GCJ02转WGS84 */

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */

var out_of_china = function out_of_china(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    // 纬度3.86~53.55,经度73.66~135.05
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

var transformlat = function transformlat(lng, lat) {
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
}

var transformlng = function transformlng(lng, lat) {
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var lat = +lat;
    var lng = +lng;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
}

/**
 * GCj02转WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02towgs84(lng, lat) {
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var lat = +lat;
    var lng = +lng;
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84togcj02(lng, lat) {
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    } else {
        var p = ExtendUtil.gps84ToGcj02(lng, lat);
        return [p.x, p.y];
    }
}

/**
 * GCj02转WGS84
 * @param {*} feature 
 */
function gcj02towgs84OfFeature3857(feature) {
    var type = feature.getGeometry().getType();
    var coordinates = feature.getGeometry().getCoordinates();
    if(type == 'Polygon') {
        coordinates[0].forEach((val,index) => {
            var coor = val;
            coor = ol.proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
            coor = gcj02towgs84(coor[0],coor[1]);
            coordinates[0][index] = ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857');
        });
        feature.getGeometry().setCoordinates(coordinates);
    } else if(type == 'MultiPolygon') {
        coordinates[0].forEach((arr, index1) => {
            arr.forEach((val, index2) => {
                var coor = val;
                coor = ol.proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
                coor = gcj02towgs84(coor[0],coor[1]);
                coordinates[0][index1][index2] = ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857');
            });
        });
        feature.getGeometry().setCoordinates(coordinates);
    }

    return feature;
}

/**
 * WGS84转GCj02
 * @param {*} feature 
 */
function wgs84togcj02OfFeature3857(feature) {
    var type = feature.getGeometry().getType();
    var coordinates = feature.getGeometry().getCoordinates();
    if(type == 'Polygon') {
        coordinates[0].forEach((val,index) => {
            var coor = val;
            coor = ol.proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
            coor = wgs84togcj02(coor[0],coor[1]);
            coordinates[0][index] = ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857');
        });
        feature.getGeometry().setCoordinates(coordinates);
    } else if(type == 'MultiPolygon') {
        coordinates[0].forEach((arr, index1) => {
            arr.forEach((val, index2) => {
                var coor = val;
                coor = ol.proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
                coor = wgs84togcj02(coor[0],coor[1]);
                coordinates[0][index1][index2] = ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857');
            });
        });
        feature.getGeometry().setCoordinates(coordinates);
    }
    
    return feature;
}