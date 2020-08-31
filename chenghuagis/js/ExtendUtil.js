var ExtendUtil={};
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

ExtendUtil.transform=function transform(lon, lat) {
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
    	"x":mgLon,
    	"y":mgLat
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
	    "x" : mgLon,
	    "y" : mgLat
	};
};

ExtendUtil.gcjToGps84=function gcjToGps84(lon, lat) {
	var lonlat = ExtendUtil.transform(lon, lat);
    var lontitude = lon * 2 - lonlat.x;
    var latitude = lat * 2 - lonlat.y;
    return {
    	"x":lontitude,
    	"y":latitude
    };
};



/**
 * 日期格式化
 * @param fmt 格式'yyyyMMdd'
 * @returns
 */
Date.prototype.Format = function(fmt)   
{  
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}; 

/**
 * 将字符串转为unicode编码，便于中文查询
 * @param str
 * @returns {String}
 */
ExtendUtil.str2Unicode = function(str) {
	var es = [];
	for (var i = 0; i < str.length; i++)
		es[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
	return "\\u" + es.join("\\u");
}
/**
 * 获取get请求中的参数
 * @param name 参数名称
 */
ExtendUtil.getQueryString = function(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
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
    if(weekNo<10)
    	return a+"0"+weekNo;
    return a+""+weekNo;
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
	if (ol_version == 2) {
		params.layer.removeAllFeatures();
		var style = {
			externalGraphic : params.imgURL,
			graphicWidth : 24,
			graphicHeight : 33
		// cursor: "pointer",
		// fontColor: "white"
		}

		var point = new OpenLayers.Geometry.Point(params.lon, params.lat).transform(
				'EPSG:4326', 'EPSG:3857');
		var feature = new OpenLayers.Feature.Vector(point, null, style);
		params.layer.addFeatures([ feature ]);
		return;
	}
	
	var view = params.map.getView();
	var lon = parseFloat(params.lon);
	var lat = parseFloat(params.lat);
	view.setCenter(ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857'));
	view.setZoom(params.level);
	
	params.layer.getSource().clear();
	var style;
	if(params.style)
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

ExtendUtil.locationByLont = function locationMap(map,lon,lat,level) {
	if(ol_version == 2){
		var center = new OpenLayers.LonLat([parseFloat(lon),parseFloat(lat)]).transform('EPSG:4326', 'EPSG:3857');
		map.setCenter(center, level);
		return;
	}
	var view = map.getView();
	view.setCenter(ol.proj.transform([parseFloat(lon),parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
	view.setZoom(level);
}


ExtendUtil.moveMapV = function (map,value) {
    map.getView().setCenter(map.getCoordinateFromPixel([map.getSize()[0]/2,map.getSize()[1]/2+value]));
}

ExtendUtil.moveMapH = function (map,value) {
    map.getView().setCenter(map.getCoordinateFromPixel([map.getSize()[0]/2-value,map.getSize()[1]/2]));
}
ExtendUtil.moveMapHV = function (map,valueH,valueV) {
    map.getView().setCenter(map.getCoordinateFromPixel([map.getSize()[0]/2-valueH,map.getSize()[1]/2]+valueV));
}


var dragZoom;
ExtendUtil.initTools = function (options){
	var map = options.map;
	var barClickFun = options.barClickFun;
	if(map){
		this.addDrawLayer(map);
		this.addDrawInteraction(map,"line");
		this.createHelpTooltip(map);
        this.createMeasureTooltip(map);
	}
	// 漫游
	document.querySelector("#pan").addEventListener('click', function() {
		barClickFun(this);
		if(dragZoom)
			dragZoom.setActive(false);
		if(ExtendUtil.draw)
			ExtendUtil.draw.setActive(false);
		document.querySelector("#gis").style.cursor = "default";
	}, false);
	
	// 绑定放大缩小按钮事件
	document.querySelector("#zoom_in").addEventListener('click', function() {
		barClickFun(this);
		if(dragZoom)
			map.removeInteraction(dragZoom);
		if(ExtendUtil.draw)
			ExtendUtil.draw.setActive(false);
		dragZoom = new ol.interaction.DragZoom({
			condition : ol.events.condition.always,
			out : false
		// 此处为设置拉框完成时放大还是缩小
		});
		map.addInteraction(dragZoom);
		dragZoom.setActive(true);
		document.querySelector("#gis").style.cursor = "crosshair";
	}, false);
	// 绑定放大缩小按钮事件
	document.querySelector("#zoom_out").addEventListener('click', function() {
		barClickFun(this);
		if(dragZoom)
			map.removeInteraction(dragZoom);
		if(ExtendUtil.draw)
			ExtendUtil.draw.setActive(false);
		dragZoom = new ol.interaction.DragZoom({
			condition : ol.events.condition.always,
			out : true
		// 此处为设置拉框完成时放大还是缩小
		});
		map.addInteraction(dragZoom);
		dragZoom.setActive(true);
		document.querySelector("#gis").style.cursor = "crosshair";
	}, false);
	
	document.querySelector("#cj").addEventListener('click', function() {
		barClickFun(this);
		if(dragZoom)
			dragZoom.setActive(false);
		ExtendUtil.draw.setActive(map,true);
		ExtendUtil.createMeasureTooltip(map);
        $("#gis").css("cursor", 'default');
	}, false);
	
	var tools = options.tools;
	if(tools){
		$.each(tools,function(index,tool){
			$("#"+tool.id).click(function(){
				barClickFun(this);
				if(dragZoom)
					dragZoom.setActive(false);
				if(ExtendUtil.draw)
					ExtendUtil.draw.setActive(false);
				tool.clickEvent();
			});
		});
	}
}

ExtendUtil.addDrawLayer = function (map) {
	this.source = new ol.source.Vector();
	this.drawLayer = new ol.layer.Vector({
		source : this.source,
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.7)'
			}),
			stroke : new ol.style.Stroke({
				color : '#ffcc33',
				width : 5
			}),
			image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
					color : '#ffcc33'
				})
			})
		})
	});
	map.addLayer(this.drawLayer);
}

ExtendUtil.addDrawInteraction = function (map,type) {
	var type = (type == 'line' ? 'LineString' : 'Polygon');
	this.draw = new ol.interaction.Draw({
		source : this.source,
		type : type,
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.7)'
			}),
			stroke : new ol.style.Stroke({
				color : '#ffcc33',
				lineDash : [ 10, 10 ],
				width : 4
			}),
			image : new ol.style.Circle({
				radius : 5,
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.7)'
				}),
				fill : new ol.style.Fill({
					color : '#ffcc33'
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
	this.draw.on('drawstart', function(evt) {
		// set sketch
		that.sketch = evt.feature;

		var tooltipCoord = evt.coordinate;

		listener = that.sketch.getGeometry().on('change', function(evt) {
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
	this.draw.on('drawend', function(evt) {
		that.measureTooltipElement.className = 'measureTooltip tooltip-static';
		that.measureTooltips["tip" + that.index].setOffset([ 0, -7 ]);
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

ExtendUtil.createHelpTooltip = function (map){
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
ExtendUtil.createMeasureTooltip = function (map){
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

ExtendUtil.setActive = function (map,flag) {
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



