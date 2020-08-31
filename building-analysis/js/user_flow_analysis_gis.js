var gis = {};
gis.url_root = Common.url_server_root;//后端接口地址
gis.url_geoserver = Common.url_geoserver;//geoserver服务地址
gis.map_server = Common.map_server;//地图服务地址

gis.url_cell_layer = Common.url_cell_layer;
gis.busi_cell_style =  'busi_cell_style';
gis.url_grid_layer = Common.url_grid_layer;
gis.busi_grid_style =  'busi_grid_style';
gis.url_heat_layer = Common.url_heat_layer;
gis.busi_heat_style =  'busi_heat_style';

gis.currentBusi,gis.busiId;
gis.center = [116.45642531259954, 39.892976756646576];//中心位置
gis.start_hour_no = 2020042210;//当前显示开始时间
gis.end_hour_no = 2020042210;//当前显示结束时间
gis.maxResolution = 20;

gis.gridSearchPolygonWkt;//空间查询字符串
gis.searchField;//当前查询值域
gis.tipWindow;//提示弹窗
gis.baseWindow;//基础弹窗
gis.gridTipWindow;//栅格弹窗
gis.gridWMSLayer;//栅格图层
gis.selectGrid;//当前选中栅格
gis.isShowGridEcharts=false;//是否显示栅格图表
gis.parabolaIntoArr=[];//流入抛物线
gis.parabolaOutArr=[];//流出抛物线
gis.sliderTimer=0;//滑块时钟

gis.tool = {};
gis.tool.GeoJSON = new ol.format.GeoJSON();
gis.tool.wktFomat = new ol.format.WKT();

//图层
gis.layers = {};

//覆盖物
gis.overlays = {};
gis.overlays.circleBound = [];
gis.overlays.markerBuild = [];

//栅格
gis.grid = {};
gis.grid.data = [];
gis.grid.geoPrimitive;
gis.grid.dialog;
gis.grid.selectGrid;
gis.grid.legend = [];
gis.grid.extrudedHeight=2;

//显示控制
gis.show = {};
gis.show.satellite = false;
gis.show.indoor = false;
gis.show.building = false;
gis.show.roadnet = false;
gis.show.circleBound = false;
gis.show.heatmap = false;
gis.show.odLine = true;
gis.show.grid = false;
gis.show.cell = true;

//栅格渲染配置
gis.GEO_GRID_COLOR_CONFIG = {
    1: "#ff5200",
    2: "#FFFF00",
    3: "#00FF00",
    4: "#00FFFF",
    5: "#0000FF"
};

//栅格颜色配置
gis.getGridColorConfig = function(userCnt) {
    var color;
    if(userCnt>=1 && userCnt<2) {
        color = '#00FFFF';
    } else if(userCnt>=2 && userCnt<5) {
        color = '#FFFF00';
    } else if(userCnt>=5 && userCnt<10) {
        color = '#ff5200';
    } else if(userCnt>=10) {
        color = '#FF0000';
    }

    return color;
};

//OD线渲染配置
gis.getODLineColorConfig = function(num, len){
    var result = {color: "#0000FF", width: 1.0};
    
    var rate = num/len;
    var width = (1-rate)*3;
    var r = parseInt((1-rate)*255).toString(16);
    if(r.length < 2) {
        r = "0" + r;
    }
    var g = parseInt(rate*255).toString(16);
    if(g.length < 2) {
        g = "0" + g;
    }
    var color = "#"+r+g+"00";

    result.width = width;
    result.color = color;
    return result;
};

//初始化
gis.init = function(start_hour_no, end_hour_no){
    this.start_hour_no = start_hour_no||this.start_hour_no;
    this.end_hour_no = end_hour_no||this.start_hour_no;
    this.initMap();
};

//初始化地图
gis.initMap = function() {
    var _this = this;
    var center = this.center;
    center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857')

    var extent = ol.extent.boundingExtent([[73.66,3.86],[135.05,53.55]]);
    extent =  ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
    if(!_this.map){
        var viewer = new ol.View({
            center: center,
            zoom: 16,
            projection: "EPSG:3857",
            minZoom: 4,
            maxZoom: 18,
            extent: extent//限制范围
          });

        var layers = [];

        var baseLayer = new ol.layer.Image({
            source: new ol.source.Raster({
                sources: 
                [
                    new ol.source.XYZ({
                        url: _this.map_server[0].url,
                        minZoom: this.map_server[0].minimumLevel||1,
                        maxZoom: this.map_server[0].maximumLevel||18,
                        crossOrigin: 'anonymous',
                        transition: 0,
                        logo: 'DIC',
                        // tileLoadFunction: function(imageTile, src) {
                        //     imageTile.getImage().src = src;
                        // }
                    })
                ],
                operationType: 'pixel',
                operation: function (pixels, data) {
                    var pixel = pixels[0];
                    pixel[0] = 10;
                    pixel[1] = 255 - pixel[1];
                    pixel[2] = 255 - pixel[2] + 20;
                    return pixel;
                }
            })
        });
        layers.push(baseLayer);

        // _this.layers.satellite = new ol.layer.Tile({
        //     source: new ol.source.XYZ({
        //         url: this.map_server[1].url,
        //         minZoom: this.map_server[1].minimumLevel||1,
        //         maxZoom: this.map_server[1].maximumLevel||18
        //     }),
        //     visible: _this.show.satellite,
        //     preload: 14
        // });
        _this.layers.satellite = new ol.layer.Image({
            visible: _this.show.satellite, 
            source: new ol.source.Raster({
                sources: 
                [
                    new ol.source.XYZ({
                        url: _this.map_server[1].url,
                        minZoom: this.map_server[1].minimumLevel||1,
                        maxZoom: this.map_server[1].maximumLevel||18,
                        crossOrigin: 'anonymous',
                        transition: 0,
                        logo: 'DIC',
                        // tileLoadFunction: function(imageTile, src) {
                        //     imageTile.getImage().src = src;
                        // }
                    })
                ],
                operationType: 'pixel',
                operation: function (pixels, data) {
                    var pixel = pixels[0];
                    pixel[0] = pixel[0]/2;
                    pixel[1] = pixel[1]/2;
                    pixel[2] = pixel[2]/2;
                    return pixel;
                }
            })
        });
        layers.push(_this.layers.satellite);

        // _this.map_server.forEach((item, index)=>{
        //     if(index == 0) return;
        //     var source = new ol.source.XYZ({
        //         url: item.url,
        //         minZoom: item.minimumLevel||1,
        //         maxZoom: item.maximumLevel||18
        //     });
        //     var tileLayer = new ol.layer.Tile({
        //         source: source,
        //         preload: 14
        //     });
        //     layers.push(tileLayer);
        // });
        _this.map = new ol.Map({
            view: viewer,
            layers: layers,
            target: 'map',
            controls : ol.control.defaults({
				attribution : false,
				zoom : false,
				zoomOptions : {
					className : "myzoom"
				}
			}).extend([
                // new ol.control.FullScreen(),
                // new ol.control.MousePosition(),
                // new ol.control.Measure({
                //     angle: true,
                //     type : 'line',//测距
                //     centerCallback : function(){
                //         _this.map.getView().setCenter(center);
                //         _this.map.getView().setZoom(16);
                //     }
                // }),
            ])
          });


        _this.map.getInteractions().forEach(function(element, index, array) {
            if(element instanceof ol.interaction.DoubleClickZoom) {
                gis.map.removeInteraction(element);
            }
        })
    }
}

//更新渲染时间
gis.updateHourNo = function(start_hour_no, end_hour_no, searchField){
    this.start_hour_no = start_hour_no||this.start_hour_no;
    this.end_hour_no = end_hour_no||this.start_hour_no;
    this.searchField = searchField||this.searchField;
    this.searchField = searchField==""?undefined:this.searchField;
    // this.loadGrid();
    // this.loadHeatmap();
    this.loadMapSlider();
    this.loadUserFlowIn();
};

//切换商综建筑
gis.changeBusi = function(busi) {
    this.currentBusi =  busi;
    this.busiId = busi.busi_id;
    this.center = [busi.lon, busi.lat];
    this.setCenter(this.center[0], this.center[1]);
    this.loadBaseBuilding();
    this.loadCircleBound();
    this.loadMapSlider();
    // this.loadBuilding();
    // this.loadRoadnet();
    // this.loadHeatmap();
    // this.loadGrid();
    this.loadUserFlowIn();
    this.loadSearchControl();
    this.loadSourceControl();
    this.loadLegendControl();
    this.bindEvent();
};

//中心点
gis.setCenter = function(lon, lat) {
    lon = Number(lon);
    lat = Number(lat);
    if(!isNaN(lon) && !isNaN(lat)) {
        var center = this.gps84ToGcj02([lon, lat]);
        center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
        this.map.getView().animate({center: center});
    }
}

//基础建筑
gis.loadBaseBuilding = function() {
    var _this = this;
    var name = _this.currentBusi.busi_name;
    var desc = _this.currentBusi.remarks;
    var center = _this.center;

    if(!_this.layers.baseBuilding){
        _this.layers.baseBuilding = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 12,
        });
        _this.map.addLayer(_this.layers.baseBuilding);
    }

    var source = _this.layers.baseBuilding.getSource();
    source.clear();

    if(_this.layers.flashMaker) {
        _this.layers.flashMaker.destroy();
        _this.layers.flashMaker = undefined;
    }

    if(_this.overlays.markerBuild.length > 0){
        _this.overlays.markerBuild.forEach(val => {
            _this.map.removeOverlay(val);
        });
        _this.overlays.markerBuild = [];
    }

    var flashMakerData = [];

    var container = document.createElement("div");
    container.className = "popup-count popup-marker-building";
    var marker = document.createElement("div");
    marker.className = "popup-count-marker";
    marker.innerText = _this.formatLabel(name);
    container.appendChild(marker);
    center = _this.gps84ToGcj02(center);
    var centerMercator = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        position: centerMercator,
        positioning: 'bottom-left',
        offset: [-17, -5],//偏移量设置
    });
    _this.map.addOverlay(overlay);
    _this.overlays.markerBuild.push(overlay);

    flashMakerData.push({
        name: name,
        location: centerMercator,
        color: '#FF0000',
        type: 'circle',
    });

    var options = {
        show: true,
        minZoom: 3,
        maxZoom: 18,
        data: flashMakerData
    }
    _this.layers.flashMaker = new FlashMarker(_this.map, options);

    //围栏
    var wkt = _this.currentBusi.wkt;
    if(wkt) {
        wkt = wkt.trim();
        if(wkt != '') {
            var feature = _this.tool.wktFomat.readFeature(wkt, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            feature = wgs84togcj02OfFeature3857(feature);
            feature.setProperties({
                type: 'bound',
                name: name,
                center: center,
                desc: desc,
            });
            feature.setStyle(function() {
                var zoom  = _this.map.getView().getZoom();
                var width = 1.0;
                var dashLen = 10;
                if(zoom > 15) {
                    width = 5.0;
                    dashLen = 10;
                } else if(zoom > 13) {
                    width = 2.0;
                    dashLen = 5;
                } else {
                    dashLen = 1;
                    width = 1.0;
                }
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        lineDash: [dashLen,dashLen],
                        // color: '#ffcc33',
                        color: '#00ff00',
                        width: width
                    })
                });
            });
            source.addFeature(feature);
        }
    }
}

//圆形边界
gis.loadCircleBound = function() {
    var _this = this;
    if(!_this.layers.boundCircle){
        _this.layers.boundCircle = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 11,
        });
        _this.map.addLayer(_this.layers.boundCircle);
    }

    if(_this.overlays.circleBound.length > 1){
        _this.overlays.circleBound.forEach(val => {
            _this.map.removeOverlay(val);
        });
        _this.overlays.circleBound = [];
    }

    _this.layers.boundCircle.setVisible(_this.show.circleBound);
    var source = _this.layers.boundCircle.getSource();
    source.clear();

    var zoom  = _this.map.getView().getZoom();
    var center = _this.center;
    center = _this.gps84ToGcj02(center);
    var centerMercator = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    var labelCenter1 =  [centerMercator[0], centerMercator[1] + 600];
    var labelCenter2 =  [centerMercator[0], centerMercator[1] + 2000];
    var labelCenter3 =  [centerMercator[0], centerMercator[1] + 3500];
    var labelCenter5 =  [centerMercator[0], centerMercator[1] + 5500];
    var dataArr = [
        {label: '5KM', labelCenter: labelCenter5, value: 0.06, fill: 'rgba(0, 255, 255, 0.5)', stroke: 'rgba(0, 255, 255, 1)'},
        {label: '3KM', labelCenter: labelCenter3, value: 0.037, fill: 'rgba(0, 255, 0, 0.5)', stroke: 'rgba(0, 255, 0, 1)'},
        {label: '2KM', labelCenter: labelCenter2, value: 0.022, fill: 'rgba(255, 255, 0, 0.5)', stroke: 'rgba(255, 255, 0, 1)'},
        {label: '1KM', labelCenter: labelCenter1, value: 0.01, fill: 'rgba(255, 82, 0, 0.5)', stroke: 'rgba(255, 82, 0, 1)'}
    ];
    for (var i = 0; i < dataArr.length; i++) {
        var feature = new ol.Feature({
            geometry: (new ol.geom.Circle(center, dataArr[i].value)).transform('EPSG:4326', 'EPSG:3857')
        });
        feature.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: dataArr[i].fill
            }),
            stroke: new ol.style.Stroke({
                color: dataArr[i].stroke,
                width: 2.0
            }),
            
        }));
        source.addFeature(feature);

        var container = document.createElement("div");
        container.className = "popup-label popup-circle-bound";
        container.style.display = (zoom>=13 && _this.show.circleBound)?'block':'none';
        var marker = document.createElement("div");
        marker.className = "popup-label-marker";
        marker.innerText = dataArr[i].label;
        container.appendChild(marker);

        var overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            position: dataArr[i].labelCenter,
            positioning: 'center-center',
            // offset: [-17, -10],//偏移量设置
        });
        _this.map.addOverlay(overlay);
        _this.overlays.circleBound.push(overlay);
    }
}

//建筑物
gis.loadBuilding = function() {
    var _this = this;
    if(!_this.layers.building){
        _this.layers.building = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 10,
            maxResolution: _this.maxResolution,
        });
        _this.map.addLayer(_this.layers.building);
    }
    _this.layers.building.setVisible(_this.show.building);
    var source = _this.layers.building.getSource();
    source.clear();

    var building_geojson_url = "./data/mars/bj_lczx_building.geojson";
    $.ajax({
        url: building_geojson_url,
        method: 'get',
        dataType: 'json',
        success: function (data) {
            var features = _this.tool.GeoJSON.readFeatures(data, {
                dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
            });
            source.addFeatures(features);
        }
    });
}

//路网
gis.loadRoadnet = function() {
    var _this = this;
    if(!_this.layers.roadnet){
        var style = function(feature) {
            var properties = feature.getProperties();
            var width = 5.0;
            var text = properties.name||'';
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(246,123,2,0.5)',
                    width: width
                }),
                text: new ol.style.Text({
                    text: text,
                    rotateWithView: true,
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 2.0
                    })
                })
            });
        };
        _this.layers.roadnet = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 10,
            style: style,
            maxResolution: _this.maxResolution,
        });
        _this.map.addLayer(_this.layers.roadnet);
    }
    _this.layers.roadnet.setVisible(_this.show.roadnet);
    var source = _this.layers.roadnet.getSource();
    source.clear();

    var roadnet_geojson_url = "./data/mars/bj_lczx_road.geojson";
    $.ajax({
        url: roadnet_geojson_url,
        method: 'get',
        dataType: 'json',
        success: function (data) {
            var features = _this.tool.GeoJSON.readFeatures(data, {
                dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
            });
            source.addFeatures(features);
        }
    });
}

//加载地图滑块
gis.loadMapSlider = function() {
    var _this = this;
    var container = _this.map.getTargetElement();
    $(container).find('.map-date-silder-control').remove();
    var rootD  = document.createElement('form');
    rootD.className = 'map-date-silder-control';
    container.appendChild(rootD);

    var btnsD = document.createElement('div');
    btnsD.className = 'map-date-slider-btns';
    rootD.appendChild(btnsD);

    var btnD = document.createElement('div');
    btnD.className = 'map-date-slider-btn start';
    btnD.title = '点击播放';
    btnsD.appendChild(btnD);
    
    var selectD = document.createElement('select');
    selectD.className = 'map-date-slider-select';
    selectD.name = 'sliderInterval';
    btnsD.appendChild(selectD);

    var optionsArr = [1000, 3000, 5000, 10000];
    optionsArr.forEach(val => {
        var optionD = document.createElement('option');
        optionD.value = val;
        optionD.innerText = val/1000 + '秒';
        selectD.appendChild(optionD);
    });
    selectD.value = 5000;

    var contentD  = document.createElement('div');
    contentD.className = 'map-date-silder-content';
    rootD.appendChild(contentD);

    var startDateStr = _this.start_hour_no.substring(0, 8);
    var endDateStr = _this.end_hour_no.substring(0, 8);
    var dataXArr= wisdomManage.getDateAxis(startDateStr, endDateStr);

    _this.showDateStr = startDateStr;
    _this.loadGridLayer();
    _this.loadHeatmapLayer();
    _this.loadCellLayer();

    function changeSliderSelectDate (val) {
        var obj = $('.map-date-slider-item[data-value='+val+']');
        if(obj.length > 0) {
            if(!obj.hasClass('select')) {
                $('.map-date-slider-item.select').removeClass('select');
                obj.addClass('select');

                $(".map-date-silder-content").animate({ 
                    scrollLeft: $(".map-date-silder-content").scrollLeft() 
                    + $('.map-date-slider-item.select').offset().left 
                    - $(".map-date-silder-content").offset().left - Math.floor($(".map-date-silder-content").width()/2)
                }, 1000);

                _this.showDateStr = obj.attr('data-value');
                _this.loadGridLayer();
                _this.loadHeatmapLayer();
                _this.loadCellLayer();
            }
        }
    }

    function formatDateStr(str) {
        return Number(str.substring(4,6))+'月'+Number(str.substring(6,8))+ '日';
    }
    var lineD = document.createElement('div');
    lineD.className = 'map-date-slider-line';
    contentD.appendChild(lineD);

    dataXArr.forEach((val, index) => {
        var itemD = document.createElement('div');
        itemD.className = 'map-date-slider-item';
        itemD.setAttribute('data-value', val);
        itemD.setAttribute('data-info', formatDateStr(val));
        contentD.appendChild(itemD);
        if(startDateStr == val) {
            itemD.className = 'map-date-slider-item select';
        }

        itemD.onclick = function() {
            changeSliderSelectDate($(this).attr('data-value'));
        };

        var lineD = document.createElement('div');
        lineD.className = 'map-date-slider-line';
        contentD.appendChild(lineD);
    });
    
    clearTimeout(_this.sliderTimer);
    btnD.onclick = function() {
        if($(this).hasClass('start')) {
            $(this).attr('title', '点击暂停');
            $(this).removeClass('start').addClass('stop');
            var sliderInterval =  $('.map-date-slider-select[name=sliderInterval]').val();
            function animate() {
                clearTimeout(_this.sliderTimer);
                _this.sliderTimer = setTimeout(function () {
                    var value = $('.map-date-slider-item.select').attr('data-value');
                    var index = dataXArr.indexOf(value);
                    index++;
                    if(index >= dataXArr.length) {
                        index = 0;
                    }
                    changeSliderSelectDate(dataXArr[index]);
                    animate();
                },sliderInterval);
            }
            animate();
        } else {
            $(this).attr('title', '点击播放');
            $(this).removeClass('stop').addClass('start');
            clearTimeout(_this.sliderTimer);
        }
    }
};

//栅格图层
gis.loadGridLayer = function() {
    var _this = this;
    var dateStr = _this.showDateStr;
    var layerName = _this.url_grid_layer;
    var styles =  _this.busi_grid_style;
    var cqlFilter = ' 1=1 ';
    cqlFilter += ' and day_no=' + dateStr.substring(0,8);
    cqlFilter += ' and commercial_complex_id=' + _this.busiId;
    if(_this.gridSearchPolygonWkt) {
        cqlFilter += ' and WITHIN(center_geom, '+_this.gridSearchPolygonWkt+') ';
    }

    if(!_this.layers.gridLayer) {
        try {
            _this.layers.gridLayer = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: _this.url_geoserver,
                    params: {
                        STYLES: styles,
                        LAYERS: layerName,
                        VERSION: '1.1.0',
                        format: 'image/png',
                        cql_filter: cqlFilter,
                        transparent: true
                    },
                    serverType: 'geoserver'
                }),
                maxResolution: _this.maxResolution,
                zIndex: 10,
                visible: _this.show.grid
            });
            _this.map.addLayer(_this.layers.gridLayer);
        } catch (error) {
            console.error('栅格加载失败');
        }
    } else {
        var params =_this.layers.gridLayer.getSource().getParams();
        params.cql_filter = cqlFilter;
       _this.layers.gridLayer.getSource().updateParams(params);
       _this.layers.gridLayer.setVisible(_this.show.grid);
    }
}

//热力图层
gis.loadHeatmapLayer = function() {
    var _this = this;
    var dateStr = _this.showDateStr;
    var layerName = _this.url_heat_layer;
    var styles = _this.busi_heat_style;
    var cqlFilter = ' 1=1 ';
    cqlFilter += ' and day_no=' + dateStr.substring(0,8);
    cqlFilter += ' and commercial_complex_id=' + _this.busiId;
    if(!_this.layers.heatmapLayer) {
        try {
            _this.layers.heatmapLayer = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: _this.url_geoserver,
                    params: {
                        STYLES: styles,
                        LAYERS: layerName,
                        VERSION: '1.1.1',
                        format: 'image/png',
                        cql_filter: cqlFilter,
                        TRANSPARENT: true,
                        exceptions: 'application/vnd.ogc.se_inimage',
                    },
                    serverType: 'geoserver'
                }),
                // maxResolution: _this.maxResolution,
                zIndex: 10,
                visible: _this.show.heatmap
            });
            _this.map.addLayer(_this.layers.heatmapLayer);
        } catch (error) {
            console.error('栅格加载失败');
        }
    } else {
        var params =_this.layers.heatmapLayer.getSource().getParams();
        params.cql_filter = cqlFilter;
       _this.layers.heatmapLayer.getSource().updateParams(params);
       _this.layers.heatmapLayer.setVisible(_this.show.heatmap);
    }
}

//小区图层
gis.loadCellLayer = function() {
    var _this = this;
    var layerName = _this.url_cell_layer;
    var styles = _this.busi_cell_style;
    var dateStr = _this.showDateStr;
    var cqlFilter = ' 1=1 ';
    cqlFilter += ' and day_no=' + dateStr.substring(0,8);
    cqlFilter += ' and commercial_complex_id=' + _this.busiId;
    if(!_this.layers.cellLayer) {
        try {
            _this.layers.cellLayer = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: _this.url_geoserver,
                    params: {
                        STYLES: styles,
                        LAYERS: layerName,
                        VERSION: '1.1.0',
                        format: 'image/png',
                        cql_filter: cqlFilter,
                        transparent: true
                    },
                    serverType: 'geoserver'
                }),
                maxResolution: _this.maxResolution,
                zIndex: 10,
                visible: _this.show.cell
            });
            _this.map.addLayer(_this.layers.cellLayer);
        } catch (error) {
            console.error('小区加载失败');
        }
    } else {
        var params =_this.layers.cellLayer.getSource().getParams();
        params.cql_filter = cqlFilter;
       _this.layers.cellLayer.getSource().updateParams(params);
       _this.layers.cellLayer.setVisible(_this.show.cell);
    }
}

//热力图
gis.loadHeatmap = function() {
    var _this = this;
    if(!_this.layers.heatmap){
        _this.layers.heatmap = new ol.layer.Heatmap({
            source: new ol.source.Vector(),
            zIndex: 9,
            blur: 10,
            weight: 'weight',
            radius: 10
        });

        _this.map.addLayer(_this.layers.heatmap);
    }
    _this.layers.heatmap.setVisible(_this.show.heatmap);
    var source = _this.layers.heatmap.getSource();
    source.clear();

    var server = '/demo/getHeatMapData';
    var params = {};
    params.day_st = _this.start_hour_no.substring(0,8);
    params.day_end = _this.end_hour_no.substring(0,8);
    params.hour_st =  _this.start_hour_no.substring(8,10);
    params.hour_end =  _this.end_hour_no.substring(8,10);
    params.field_name = _this.searchField;
    params.busi_id = _this.busiId;

    $.ajax({
       url: _this.url_root+server,
        method: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            var max = 1;
            data.forEach(val => {
                max = Math.max(max, val.live_user_cnt);
            });
            data.forEach(val => {
                var coordinate = [val.tile14_lon, val.tile14_lat];
                coordinate = _this.gps84ToGcj02(coordinate);
                var feature = new ol.Feature({
                    geometry: (new ol.geom.Point(coordinate)).transform('EPSG:4326', 'EPSG:3857')
                });
                val.weight = val.live_user_cnt/max;
                feature.setProperties(val);
                source.addFeature(feature);
            });
        },
        error: function() {
        }
    }); 
}

//栅格
gis.loadGrid = function() {
    var _this = this;
    _this.grid.data = [];
    if(!_this.layers.grid){
        var style = function(feature) {
            var properties = feature.getProperties();
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: _this.GEO_GRID_COLOR_CONFIG[properties.colour_level]
                }),
                stroke: new ol.style.Stroke({
                    color: _this.GEO_GRID_COLOR_CONFIG[properties.colour_level],
                    width: 1.0
                })
            });
        };
        _this.layers.grid = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 10,
            opacity: 0.2,
            style: style
        });
        _this.map.addLayer(_this.layers.grid);
    }
    _this.layers.grid.setVisible(_this.show.grid);
    var source = _this.layers.grid.getSource();
    source.clear();

    var server = '/demo/getGridDataSub';
    var params = {};
    params.day_st = _this.start_hour_no.substring(0,8);
    params.day_end = _this.end_hour_no.substring(0,8);
    params.hour_st =  _this.start_hour_no.substring(8,10);
    params.hour_end =  _this.end_hour_no.substring(8,10);
    params.field_name = _this.searchField;
    params.busi_id = _this.busiId;
    params.polygon_wkt= _this.gridSearchPolygonWkt;
    $.ajax({
        url: _this.url_root+server,
        method: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            if(data && data.length > 0) {
                _this.grid.data = data;
                _this.updateGridLegend();
                _this.grid.data.forEach(properties => {
                    var positions = [[
                        _this.gps84ToGcj02([properties.tile14_left_bottom_lon, properties.tile14_left_bottom_lat]),
                        _this.gps84ToGcj02([properties.tile14_right_top_lon, properties.tile14_left_bottom_lat]),
                        _this.gps84ToGcj02([properties.tile14_right_top_lon, properties.tile14_right_top_lat]),
                        _this.gps84ToGcj02([properties.tile14_left_bottom_lon, properties.tile14_right_top_lat]),
                        _this.gps84ToGcj02([properties.tile14_left_bottom_lon, properties.tile14_left_bottom_lat])
                    ]];
                    var feature = new ol.Feature({
                        geometry: (new ol.geom.Polygon(positions)).transform('EPSG:4326', 'EPSG:3857')
                    });
                    feature.setProperties(properties);
                    source.addFeature(feature);
                });
            }
        },
        error: function() {
        }
    });
};

//更新栅格图例
gis.updateGridLegend = function() {
    var _this = this;

    _this.grid.legend = [];
    if(_this.grid.data.length > 0){
        var levelCompareData = _this.grid.data[0];
        _this.grid.legend.push({
            level: 5,
            text: "[0, "+ levelCompareData.tile14_user_cnt_min +")",
            color: _this.GEO_GRID_COLOR_CONFIG[5]
        });
        _this.grid.legend.push({
            level: 4,
            text: "["+ levelCompareData.tile14_user_cnt_min +", "+ levelCompareData.tile14_user_cnt_avg +")",
            color: _this.GEO_GRID_COLOR_CONFIG[4]
        });
        _this.grid.legend.push({
            level: 3,
            text: "["+ levelCompareData.tile14_user_cnt_avg +", "+ levelCompareData.tile14_user_cnt_maa +")",
            color: _this.GEO_GRID_COLOR_CONFIG[3]
        });
        _this.grid.legend.push({
            level: 2,
            text: "["+ levelCompareData.tile14_user_cnt_maa +", "+ levelCompareData.tile14_user_cnt_max +")",
            color: _this.GEO_GRID_COLOR_CONFIG[2]
        });
        _this.grid.legend.push({
            level: 1,
            text: "["+ levelCompareData.tile14_user_cnt_max +",  +∞)",
            color: _this.GEO_GRID_COLOR_CONFIG[1]
        });
    };
    
    _this.grid.legend.sort((a, b) => {return a.level - b.level});
    _this.loadLegendControl();
};

//根据经纬度选中栅格
gis.selectGridByLonLat = function(lon, lat) {
    var _this = this;

    var isSelected = false;
    if(!_this.layers.selectGrid){
        var style = function(feature) {
            var properties = feature.getProperties();
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: _this.GEO_GRID_COLOR_CONFIG[properties.colour_level]
                }),
                stroke: new ol.style.Stroke({
                    color: _this.GEO_GRID_COLOR_CONFIG[properties.colour_level],
                    width: 1.0
                })
            });
        };
        _this.layers.selectGrid = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 12,
            opacity: 0.8,
            style: style
        });
        _this.map.addLayer(_this.layers.selectGrid);
    }
    var source = _this.layers.selectGrid.getSource();
    source.clear();
    _this.closeSelectGrid();
    if(_this.show.grid && _this.grid.data) {
        _this.grid.data.forEach(properties => {
            var tile14_left_bottom = [properties.tile14_left_bottom_lon,properties.tile14_left_bottom_lat];
            var tile14_right_top = [properties.tile14_right_top_lon,properties.tile14_right_top_lat];
            var minLon = Math.min(tile14_left_bottom[0],tile14_right_top[0]);
            var maxLon = Math.max(tile14_left_bottom[0],tile14_right_top[0]);
            var minLat = Math.min(tile14_left_bottom[1],tile14_right_top[1]);
            var maxLat = Math.max(tile14_left_bottom[1],tile14_right_top[1]);
            if(lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat){
                var positions = [[
                    _this.gps84ToGcj02([properties.tile14_left_bottom_lon, properties.tile14_left_bottom_lat]),
                    _this.gps84ToGcj02([properties.tile14_right_top_lon, properties.tile14_left_bottom_lat]),
                    _this.gps84ToGcj02([properties.tile14_right_top_lon, properties.tile14_right_top_lat]),
                    _this.gps84ToGcj02([properties.tile14_left_bottom_lon, properties.tile14_right_top_lat]),
                    _this.gps84ToGcj02([properties.tile14_left_bottom_lon, properties.tile14_left_bottom_lat])
                ]];
                var feature = new ol.Feature({
                    geometry: (new ol.geom.Polygon(positions)).transform('EPSG:4326', 'EPSG:3857')
                });
                feature.setProperties(properties);
                source.addFeature(feature);
    
                var staticElement = document.createElement("div");
                var html = "<div class=\"common\"><span class=\"label\">商综体名称：</span><span class=\"value\">"+properties.commercial_complex_name+"</span><span class=\"label1\"></div>";
                html += "<div class=\"common\"><span class=\"label\">栅格ID：</span><span class=\"value\">"+properties.tile14_id+"</span><span class=\"label1\"></span></div>";
                html += "<div class=\"common\"><span class=\"label\">到访人数：</span><span class=\"value\">"+properties.tile14_user_cnt+"</span><span class=\"label1\"></span></div>";
                html += "<div class=\"common\"><span class=\"label\">居住地人数：</span><span class=\"value\">"+properties.live_user_cnt+"</span><span class=\"label1\"></div>";
                staticElement.innerHTML = html;
                var contentDom = document.createElement("div");
                contentDom.appendChild(staticElement);
    
                var position = [properties.tile14_lon, properties.tile14_lat];
                position = _this.gps84ToGcj02(position);
                position =  ol.proj.transform(position, 'EPSG:4326', 'EPSG:3857');
                _this.grid.dialog = _this.addBaseInfoWindow(position, properties.commercial_complex_name+'栅格', contentDom, function() {
                    _this.closeSelectGrid();
                });
                isSelected = true;
            }
        });
    }

    return isSelected;
};

//关闭选中栅格
gis.closeSelectGrid = function (){
    if(this.layers.selectGrid){
        var source = this.layers.selectGrid.getSource();
        source.clear();
    }

    if(this.grid.dialog) {
        this.grid.dialog.destory();
        this.grid.dialog = undefined;
    }
};

//客户流入数据
gis.loadUserFlowIn = function() {
    var  _this = this;
    
    if(_this.layers.userFlowIn){
        _this.layers.userFlowIn.destroy();
        _this.layers.userFlowIn = undefined;
    }
    if(_this.layers.userFlowInCity){
        _this.layers.userFlowInCity.destroy();
        _this.layers.userFlowInCity = undefined;
    }
    if(_this.layers.userFlowInProvence){
        _this.layers.userFlowInProvence.destroy();
        _this.layers.userFlowInProvence = undefined;
    }
    if(!_this.layers.areaBound){
        _this.layers.areaBound = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 12,
            style: function(feature) {
                var zoom  = _this.map.getView().getZoom();
                var width = 1.0;
                var dashLen = 10;
                if(zoom > 15) {
                    width = 5.0;
                    dashLen = 10;
                } else if(zoom > 13) {
                    width = 2.0;
                    dashLen = 5;
                } else {
                    dashLen = 1;
                    width = 1.0;
                }
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        lineDash: [dashLen,dashLen],
                        color: '#C1C1C1',
                        width: width
                    })
                });
            }
        });
        _this.map.addLayer(_this.layers.areaBound);
    }
    var source = _this.layers.areaBound.getSource();
    source.clear();

    var center = _this.center;
    center = _this.gps84ToGcj02(center);
    center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    var server = '/demo/getTop10Cell';
    var params = {};
    params.day_st = _this.start_hour_no.substring(0,8);
    params.day_end = _this.end_hour_no.substring(0,8);
    params.hour_st =  _this.start_hour_no.substring(8,10);
    params.hour_end =  _this.end_hour_no.substring(8,10);
    params.field_name = _this.searchField;
    params.busi_id = _this.busiId;

    $.ajax({
        url: _this.url_root+server,
        method: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            var moveLineData = [];
            data.sort((a, b) => {return b.area_user_cnt - a.area_user_cnt});
            data.forEach((line, index)=>{
                var wkt = line.wkt;
                if(wkt) {
                    wkt = wkt.trim();
                    if(wkt != '') {
                        var feature = _this.tool.wktFomat.readFeature(wkt, {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857'
                        });
                        // feature = wgs84togcj02OfFeature3857(feature);
                        feature.setProperties({
                            type: 'cell',
                            number: line.area_user_cnt,
                            name: line.name,
                        });
                        source.addFeature(feature);

                        var geomStyle = 'Polygon';
                        if(feature.getStyle()) {
                            geomStyle = feature.getStyle();
                        }
                        var position;
                        if(geomStyle == 'Polygon') {
                            position = feature.getGeometry().getInteriorPoint().getCoordinates();
                        } else if(geomStyle == 'MultiPolygon') {
                            position = feature.getGeometry().getPolygon(0).getInteriorPoint().getCoordinates();
                        }
                        if(position) {
                            var conf = _this.getODLineColorConfig(index, data.length);
                            moveLineData.push({
                                color: conf.color,
                                width: conf.width,
                                from: {
                                    value: (isNaN(line.area_rate)?0:line.area_rate*100).toFixed(2)+'%',
                                    name: line.name,
                                    lnglat: position
                                },
                                to: {
                                    lnglat: center
                                }
                            });
                        }
                    }
                }
            });
            
            _this.layers.userFlowIn = new MoveLine(_this.map, {
                show: _this.show.odLine,
                //是否显示值
                showValue: true,
                //marker点半径
                markerRadius: 4,
                //线条类型 solid、dashed、dotted
                lineType: 'solid',
                //移动点半径
                moveRadius: 2,
                //移动点颜色
                fillColor: '#fff',
                //移动点阴影颜色
                shadowColor: '#fff',
                //移动点阴影大小
                shadowBlur: 4,
                data: moveLineData,
                minZoom:  13,
                maxZoom: null
            });
        },
        error: function() {
        }
    });

    // //省级OD线
    // var serverCityUrl = '/demo/getCityData';
    // $.ajax({
    //     url: _this.url_root+serverCityUrl,
    //     method: 'get',
    //     data: params,
    //     dataType: 'json',
    //     success: function (cityData) {
    //         var moveLineDataCity = [];
    //         cityData.sort((a, b) => {return b.user_cnt - a.user_cnt});
    //         cityData.forEach((line, index) => {
    //             var cityName = line.latn_name;
    //             var city = ADMINISTRATIVE_DIVISION[cityName];
    //             if(city) {
    //                 var position = [city.longitude, city.latitude];
    //                 position = _this.gps84ToGcj02(position);
    //                 position = ol.proj.transform(position, 'EPSG:4326', 'EPSG:3857');
    //                 var conf = _this.getODLineColorConfig(index, cityData.length);
    //                 moveLineDataCity.push({
    //                     color: conf.color,
    //                     width: conf.width,
    //                     from: {
    //                         value: (isNaN(line.user_rate)?0:line.user_rate*100).toFixed(2)+'%',
    //                         name: cityName,
    //                         lnglat: position
    //                     },
    //                     to: {
    //                         lnglat: center
    //                     }
    //                 });
    //             }
    //         });
    //         _this.layers.userFlowInCity = new MoveLine(_this.map, {
    //             show: _this.show.odLine,
    //             //是否显示值
    //             showValue: true,
    //             //marker点半径
    //             markerRadius: 4,
    //             //线条类型 solid、dashed、dotted
    //             lineType: 'solid',
    //             //移动点半径
    //             moveRadius: 2,
    //             //移动点颜色
    //             fillColor: '#fff',
    //             //移动点阴影颜色
    //             shadowColor: '#fff',
    //             //移动点阴影大小
    //             shadowBlur: 4,
    //             data: moveLineDataCity,
    //             minZoom:  8,
    //             maxZoom: 12
    //         });
    //     }
    // });
  
    //全国OD线
    var serverProvUrl = '/demo/getProvData';
    $.ajax({
        url: _this.url_root+serverProvUrl,
        method: 'get',
        data: params,
        dataType: 'json',
        success: function (provenceData) {
            var moveLineDataProvence = [];
            provenceData.sort((a, b) => {return b.user_rate - a.user_rate});
            provenceData.forEach((line, index) => {
                var provenceName = PROVINCE_ALIAS[line.prov_name];
                var provence = ADMINISTRATIVE_DIVISION[provenceName];
                if(provence) {
                    var position = [provence.longitude, provence.latitude];
                    position = _this.gps84ToGcj02(position);
                    position = ol.proj.transform(position, 'EPSG:4326', 'EPSG:3857');
                    var conf = _this.getODLineColorConfig(index, provenceData.length);
                    moveLineDataProvence.push({
                        color: conf.color,
                        width: conf.width,
                        from: {
                            value: (isNaN(line.user_rate)?0:line.user_rate*100).toFixed(2)+'%',
                            name: provenceName,
                            lnglat: position
                        },
                        to: {
                            lnglat: center
                        }
                    });
                }
            });
            _this.layers.userFlowInProvence = new MoveLine(_this.map, {
                show: _this.show.odLine,
                //是否显示值
                showValue: true,
                //marker点半径
                markerRadius: 4,
                //线条类型 solid、dashed、dotted
                lineType: 'solid',
                //移动点半径
                moveRadius: 2,
                //移动点颜色
                fillColor: '#fff',
                //移动点阴影颜色
                shadowColor: '#fff',
                //移动点阴影大小
                shadowBlur: 4,
                data: moveLineDataProvence,
                minZoom:  3,
                maxZoom: 7
            });
        }
    });
};

//框选搜索
gis.loadSearchControl = function() {
    var _this = this;
    var options = {
        show: _this.show.grid,
        restore: function() {
            _this.gridSearchPolygonWkt = undefined;
            _this.loadGrid();
        },
        callBack:function(coordinates) {
            //POLYGON((-90 40, -90 45, -60 45, -60 40, -90 40))
            coordinates.forEach((value, i) => {
                coordinates[i] = value.join(" ");
            });
            coordinates = coordinates.join(",");
            var cql_polygon = 'POLYGON((';
            cql_polygon += coordinates;
            cql_polygon += '))';
            _this.gridSearchPolygonWkt = cql_polygon;
            _this.loadGridLayer();
        }
    };
    _this.searchControl = new SearchControl(_this.map, options);
};

//资源管理器
gis.mapSources = [
    // {
    //     name: "室内建筑",
    //     show: gis.show.indoor,
    //     disabled: false,
    //     isFirst: true,
    //     onClick: function(checked){
    //         gis.show.indoor = checked;
    //         if(gis.baseBuilding.model) {
    //             gis.baseBuilding.model.show = !checked;
    //         }

    //         if(gis.baseBuilding.indoor) {
    //             gis.baseBuilding.indoor.show = checked;
    //         }
    //     }
    // },
    {
        name: "卫星地图",
        show: gis.show.satellite,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.satellite = checked;
            if(gis.layers.satellite) {
                gis.layers.satellite.setVisible(checked);
            }
        }
    },
    // {
    //     name: "建筑楼宇",
    //     show: gis.show.building,
    //     disabled: false,
    //     isFirst: true,
    //     onClick: function(checked){
    //         gis.show.building = checked;
    //         if(gis.layers.building) {
    //             gis.layers.building.setVisible(checked);
    //         }
    //     }
    // },
    // {
    //     name: "街道路网",
    //     show: gis.show.roadnet,
    //     disabled: false,
    //     isFirst: false,
    //     onClick: function(checked){
    //         gis.show.roadnet = checked;
    //         if(gis.layers.roadnet) {
    //             gis.layers.roadnet.setVisible(checked);
    //         }
    //     }
    // },
    {
        name: "商圈范围",
        show: gis.show.circleBound,
        disabled: false,
        isFirst: false,
        onClick: function(checked){
            gis.show.circleBound = checked;
            if(gis.layers.boundCircle){
                gis.layers.boundCircle.setVisible(checked);
            }
            if(checked){
                $("#"+gis.map.getTarget()).find(".popup-circle-bound").show();
            } else {
                $("#"+gis.map.getTarget()).find(".popup-circle-bound").hide();
            }
            gis.loadLegendControl();
        }
    },
    {
        name: "客流栅格",
        show: gis.show.grid,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.grid = checked;
            if(gis.layers.gridLayer) {
                gis.layers.gridLayer.setVisible(checked);
            }

            if(gis.searchControl) {
                gis.searchControl.show = checked;
            }
            gis.loadLegendControl();
        }
    },
    {
        name: "常住分布",
        show: gis.show.heatmap,
        disabled: false,
        isFirst: false,
        onClick: function(checked){
            gis.show.heatmap = checked;
            if(gis.layers.heatmapLayer) {
                gis.layers.heatmapLayer.setVisible(checked);
            }
            gis.loadLegendControl();
        }
    },
    {
        name: "居民小区",
        show: gis.show.cell,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.cell = checked;
            if(gis.layers.cellLayer) {
                gis.layers.cellLayer.setVisible(checked);
            }
            gis.loadLegendControl();
        }
    },
    {
        name: "热度小区",
        show: gis.show.odLine,
        disabled: false,
        isFirst: false,
        onClick: function(checked){
            gis.show.odLine = checked;
            if(gis.layers.userFlowIn) {
                gis.layers.userFlowIn.show = checked;
            }
            if(gis.layers.userFlowInCity){
                gis.layers.userFlowInCity.show = checked;
            }
            if(gis.layers.userFlowInProvence){
                gis.layers.userFlowInProvence.show = checked;
            }
            if(gis.layers.areaBound) {
                gis.layers.areaBound.setVisible(checked);
            }
            gis.loadLegendControl();
        }
    },
];

//加载资源管理器
gis.loadSourceControl = function() {
    var _this = this;
    var sources = _this.mapSources;
    var container = _this.map.getTargetElement();
    /*
    sources = 
    {
        name: "建筑",
        show: true,
        onClick: function(checked){
            if(_this.buildingTileset) {
                _this.buildingTileset.show = checked;
            }
        }
    }
    */
    sources = sources||[];
    var selectControl = document.createElement("div");
    selectControl.className = "ol3-select-control";
    container.appendChild(selectControl);
    
    var selectTitle = document.createElement("div");
    selectTitle.className = "ol3-select-control-title";

    var titleSpan = document.createElement("span");
    titleSpan.innerText = "图层控制";
    selectTitle.appendChild(titleSpan);

    var titleArrow = document.createElement("div");
    titleArrow.className = "arrow";
    titleArrow.select = false;
    selectTitle.appendChild(titleArrow);
    selectControl.appendChild(selectTitle);

    var selectContent = document.createElement("div");
    selectContent.className = "ol3-select-control-content";
    selectControl.appendChild(selectContent);

    selectTitle.onclick = function(){
        if(titleArrow.select){
            titleArrow.className = "arrow";
            titleArrow.select = !titleArrow.select;
            $(selectContent).hide(200);
            // selectContent.style.display = "none";
        } else {
            titleArrow.className = "arrow select";
            titleArrow.select = !titleArrow.select;
            $(selectContent).show(200);
            // selectContent.style.display = "block";
        }
    };

    sources.forEach(value => {
        var element = document.createElement("div");
        element.className = "ol3-select-control-row";
        selectContent.appendChild(element);
        var elementSpan = document.createElement("span");
        elementSpan.innerText = value.name;
        element.appendChild(elementSpan);
        var elementSelect = document.createElement("div");
        
        
        if(value.isFirst){
            element.className = "ol3-select-control-row first";
        } else {
            element.className = "ol3-select-control-row";
        }

        elementSelect.select = value.show;
        if(value.show){
            elementSelect.className = "select-btn select";
        } else {
            elementSelect.className = "select-btn";
        }

        element.appendChild(elementSelect);
        if(!value.disabled) {
            elementSelect.onclick = function() {
                if(this.select){
                    elementSelect.className = "select-btn";
                    elementSelect.select = !this.select;
                } else {
                    elementSelect.className = "select-btn select";
                    elementSelect.select = !this.select;
                }
                value.onClick(this.select);
            };
        }
    });

    return selectControl;
}

//图例管理器
gis.legendSources = [
    {
        id: "legend-business-bound",
        name: "商圈",
        show: false,
        type: 'text-color',
        items: [
            {
                color: "#ff5200",
                text: "1KM",
                onClick: function() {
                },
            },
            {
                color: "#FFFF00",
                text: "2KM",
                onClick: function() {
                },
            },
            {
                color: "#00FF00",
                text: "3KM",
                onClick: function() {
                },
            },
            {
                color: "#00FFFF",
                text: "5KM",
                onClick: function() {
                },
            },
        ]
    },
    {
        id: "legend-user-grid",
        name: "栅格",
        show: true,
        type: 'text-color',
        items: [
            {
                color: "#00FFFF",
                text: "[1,5)",
                onClick: function() {
                },
            },
            {
                color: "#FFFF00",
                text: "[5,20)",
                onClick: function() {
                },
            },
            {
                color: "#ff5200",
                text: "[20,50)",
                onClick: function() {
                },
            },
            {
                color: "#FF0000",
                text: "[50,+∞)",
                onClick: function() {
                },
            }
        ]
    },
    {
        id: "legend-user-heatmap",
        name: "热力",
        show: true,
        type: 'ud-range-color',
        topText: "100%",
        downText: "0%",
        colorRange: ["#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF"]
    },
    {
        id: "legend-user-cell",
        name: "居民小区",
        show: true,
        type: 'text-color',
        items: [
            {
                color: "#00FFFF",
                text: "[1,5)",
                onClick: function() {
                },
            },
            {
                color: "#FFFF00",
                text: "[5,20)",
                onClick: function() {
                },
            },
            {
                color: "#ff5200",
                text: "[20,50)",
                onClick: function() {
                },
            },
            {
                color: "#FF0000",
                text: "[50,+∞)",
                onClick: function() {
                },
            }
        ]
    },
    {
        id: "legend-heat-cell",
        name: "热度小区",
        show: true,
        type: 'ud-range-color',
        topText: "100%",
        downText: "0%",
        colorRange: ["#FF0000,#FFFF00,#00FF00"]
    },
];
gis.loadLegendControl = function() {
    var _this = this;
    _this.legendSources.forEach((item) => {
        if(item.id == "legend-business-bound"){
            item.show = _this.show.circleBound;
        } else if(item.id == "legend-user-grid"){
            item.show = _this.show.grid;
        } else if(item.id == "legend-user-heatmap"){
            item.show = _this.show.heatmap;
        } else if(item.id == "legend-user-cell"){
            item.show = _this.show.cell;
        } else if(item.id == "legend-heat-cell"){
            item.show = _this.show.odLine;
        }
    });

    var legendSources = _this.legendSources;
    var container = _this.map.getTargetElement();
    $(container).find('#ol3-legend-container').remove();

    var legendContainer = document.createElement("div");
    legendContainer.id = "ol3-legend-container";
    legendContainer.className = "ol3-legend-container";
    container.appendChild(legendContainer);

    legendSources.forEach(el => {
        if(!el.show) return;
        var legendControl = document.createElement("div");
        legendControl.className = "ol3-legend-control";
        legendContainer.appendChild(legendControl);
        
        var legendTitle = document.createElement("div");
        legendTitle.className = "ol3-legend-title";
        legendTitle.id = el.id;
        legendTitle.innerText = el.name;
        legendControl.appendChild(legendTitle);

        var legendBody = document.createElement("ul");
        legendBody.className = "ol3-legend-body";
        legendControl.appendChild(legendBody);
        
        var type = el.type||'text-color';
        if(type == 'text-color'){
            el.items.forEach(item => {
                var legendItem = document.createElement("li");
                legendItem.className = "ol3-legend-item";
                legendBody.appendChild(legendItem);
                
                var legendSymbol = document.createElement("div");
                legendSymbol.className = "ol3-legend-symbol";
                legendSymbol.style.backgroundColor = item.color;
                legendItem.appendChild(legendSymbol);
    
                var legendText = document.createElement("span");
                legendText.className = "ol3-legend-text";
                legendText.innerText = item.text;
                legendItem.appendChild(legendText);
    
                legendItem.onclick = function(){
                    if(item.onClick){
                        item.onClick();
                    }
                }
            });
        } else  if(type == 'ud-range-color'){
            var textTop = document.createElement("div");
            textTop.className = "ol3-legend-text-top";
            textTop.innerText = el.topText||"";
            legendBody.appendChild(textTop);
            var rangeColorDom = document.createElement("div");
            rangeColorDom.className = "ol3-legend-range-color";
            rangeColorDom.style.background = "linear-gradient("+el.colorRange.join(",")+")";
            legendBody.appendChild(rangeColorDom);
            var textDown = document.createElement("div");
            textDown.className = "ol3-legend-text-down";
            textDown.innerText = el.downText||"";
            legendBody.appendChild(textDown);
        }
    });
}

//绑定事件
gis.bindEvent = function(){
    var _this = this;
    _this.map.on("moveend", function (evt) {
        //控制边界弹窗显示
        if(_this.map.getView().getZoom() >= 13 && _this.show.circleBound){
            $("#"+_this.map.getTarget()).find(".popup-circle-bound").show();
        } else {
            $("#"+_this.map.getTarget()).find(".popup-circle-bound").hide();
        }
    });

    _this.map.on("click", function(evt) {

        if(_this.baseWindow && _this.baseWindow.destory){
            _this.baseWindow.destory();
            _this.baseWindow = undefined;
        }

        if(_this.searchControl){
            _this.searchControl.mouseClick(evt.coordinate);
        }

        _this.closeSelectGrid();

        // var isVector = false;
        // _this.map.forEachFeatureAtPixel(evt.pixel,function(feature,layer) {
        //     var properties = feature.getProperties();
        //     if(properties.type == 'bound'){
        //         isVector = true;
        //         var html = '<p>'+_this.formatDesc(properties.desc)+'</p>';
        //         _this.baseWindow = _this.addBaseInfoWindow(evt.coordinate, properties.name, html);
        //     } 
        // });

        var isShowgGrid = true;
        var coordinate = evt.coordinate;
        if(_this.show.cell) {
            _this.searchFeatureInfo(coordinate, _this.layers.cellLayer, function(features) {
                if(features && features.length > 0) {
                    isShowgGrid = false;
                    var properties = features[0].properties;
                    if(properties) {
                        _this.addCellInfoTip3857(evt.coordinate, properties);
                    }
                }
            });
        }

        if(_this.show.grid && isShowgGrid) {
            _this.searchFeatureInfo(coordinate, _this.layers.gridLayer, function(features) {
                if(features && features.length > 0) {
                    var properties = features[0].properties;
                    if(properties) {
                        _this.addGridInfoTip(properties);
                    }
                }
            });
        }
    });

    _this.map.on("dblclick", function(evt) {
        var coordinate = evt.coordinate;
        if(_this.searchControl){
            _this.searchControl.mouseDBClick(coordinate);
        }
    });


    _this.map.on('pointermove', function(evt) {
        var coordinate = evt.coordinate;
        if(_this.searchControl){
            _this.searchControl.mouseMove(coordinate);
        }
    });
}

//添加84坐标小区提示信息
gis.addCellInfoTipWGS84 = function(coordinate, properties) {
    var _this = this;
    coordinate = wgs84togcj02(coordinate[0], coordinate[1]);
    _this.addCellInfoTipGcj02(coordinate, properties);
};


//添加Gcj02坐标小区提示信息
gis.addCellInfoTipGcj02 = function(coordinate, properties) {
    var _this = this;
    coordinate = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
    _this.addCellInfoTip3857(coordinate, properties);
};

//添加小区信息提示
gis.addCellInfoTip3857 = function(coordinate, properties) {
    var _this = this;

    if(_this.baseWindow && _this.baseWindow.destory){
        _this.baseWindow.destory();
        _this.baseWindow = undefined;
    }

    var areaName = _this.formatLabel(properties.area_name);
    var areaId = _this.formatLabel(properties.area_id);
    var cityName = _this.formatLabel(properties.city_name);
    var busiName = _this.formatLabel(properties.commercial_complex_name);
    var userCnt = _this.formatNumber(properties.user_cnt);
    var staticElement = document.createElement("div");

    if(userCnt <= 1) {
        userCnt = Math.max(Math.floor(Math.random()*(5-1+1)),1);
    } else {
        userCnt = Math.round(userCnt*4.35);
    }

    var html = "<div class=\"common\"><span class=\"label\">小区ID：</span><span class=\"value\">"+areaId+"</span><span class=\"label1\"></div>";
    html += "<div class=\"common\"><span class=\"label\">小区名称：</span><span class=\"value\">"+areaName+"</span><span class=\"label1\"></span></div>";
    html += "<div class=\"common\"><span class=\"label\">所属城市：</span><span class=\"value\">"+cityName+"</span><span class=\"label1\"></span></div>";
    html += "<div class=\"common\"><span class=\"label\">商综体：</span><span class=\"value\">"+busiName+"</span><span class=\"label1\"></div>";
    html += "<div class=\"common\"><span class=\"label\">到访人数：</span><span class=\"value\">"+userCnt+"</span><span class=\"label1\"></div>";
    staticElement.innerHTML = html;
    var contentDom = document.createElement("div");
    contentDom.appendChild(staticElement);
    _this.baseWindow = _this.addBaseInfoWindow(coordinate, areaName, contentDom);
};

//添加栅格信息提示
gis.addGridInfoTip = function(properties) {
    var _this = this;

    if(_this.baseWindow && _this.baseWindow.destory){
        _this.baseWindow.destory();
        _this.baseWindow = undefined;
    }

    if(!_this.layers.selectGrid){
        _this.layers.selectGrid = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 12,
            opacity: 0.8
        });
        _this.map.addLayer(_this.layers.selectGrid);
    }
    var source = _this.layers.selectGrid.getSource();
    source.clear();
    _this.closeSelectGrid();

    var color = _this.getGridColorConfig(properties.user_cnt);
    if(color) {
        var grid_left_bottom = [properties.leftup_lon,properties.rightdown_lat];
        var grid_left_top = [properties.leftup_lon,properties.leftup_lat];
        var grid_right_top = [properties.rightdown_lon,properties.leftup_lat];
        var grid_right_bottom = [properties.rightdown_lon,properties.rightdown_lat];
    
        var positions = [[
            // _this.gps84ToGcj02(grid_left_bottom),
            // _this.gps84ToGcj02(grid_left_top),
            // _this.gps84ToGcj02(grid_right_top),
            // _this.gps84ToGcj02(grid_right_bottom),
            // _this.gps84ToGcj02(grid_left_bottom),
           grid_left_bottom,
           grid_left_top,
           grid_right_top,
           grid_right_bottom,
           grid_left_bottom
        ]];
        var feature = new ol.Feature({
            geometry: (new ol.geom.Polygon(positions)).transform('EPSG:4326', 'EPSG:3857')
        });
        feature.setProperties(properties);
        feature.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: color,
                width: 1.0
            })
        }));
        source.addFeature(feature);
        
        var busiName = _this.formatLabel(properties.commercial_complex_name);
        var gridId = _this.formatLabel(properties.grid_id);
        var liveUserCnt = _this.formatNumber(properties.live_user_cnt);
        var userCnt = _this.formatNumber(properties.user_cnt);

        if(liveUserCnt <= 1) {
            liveUserCnt = Math.max(Math.floor(Math.random()*(5-1+1)),1);
        } else {
            liveUserCnt = Math.round(liveUserCnt*4.35);
        }

        if(userCnt <= 1) {
            userCnt = Math.max(Math.floor(Math.random()*(5-1+1)),1);
        } else {
            userCnt = Math.round(userCnt*4.35);
        }
    
        var staticElement = document.createElement("div");
        var html = "<div class=\"common\"><span class=\"label\">商综体：</span><span class=\"value\">"+busiName+"</span></div>";
        html += "<div class=\"common\"><span class=\"label\">栅格ID：</span><span class=\"value\">"+gridId+"</span></span></div>";
        html += "<div class=\"common\"><span class=\"label\">常驻人数：</span><span class=\"value\">"+liveUserCnt+"</span></div>";
        html += "<div class=\"common\"><span class=\"label\">到访人数：</span><span class=\"value\">"+userCnt+"</span></div>";
        staticElement.innerHTML = html;
        var contentDom = document.createElement("div");
        contentDom.appendChild(staticElement);
    
        var minLon = Math.min(properties.leftup_lon, properties.rightdown_lon);
        var maxLon = Math.max(properties.leftup_lon, properties.rightdown_lon);
        var minLat = Math.min(properties.leftup_lat, properties.rightdown_lat);
        var maxLat = Math.max(properties.leftup_lat, properties.rightdown_lat);
        var centerLon = minLon + (maxLon - minLon)/2;
        var centerLat = minLat + (maxLat - minLat)/2;
        var coordinate = [centerLon, centerLat];
        // coordinate = _this.gps84ToGcj02(coordinate);
        coordinate = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
        _this.grid.dialog = _this.addBaseInfoWindow(coordinate, properties.commercial_complex_name+'栅格', contentDom, function() {
            _this.closeSelectGrid();
        });
    }
};

//添加信息提示框
gis.addTipInfoWindow = function(position, text){
    var options = {};
    options.viewPoint = position;
    options.content = text;
    return new TipInfoWinPrimitive(this.map, options);
}

//添加基础信息提示框
gis.addBaseInfoWindow = function(position, title,content, onClose) {
    var options = {};
    options.viewPoint = position;
    options.title = title;
    options.content = content;
    options.onClose = onClose;
    return new BaseInfoWinPrimitive(this.map, options);
}

//84坐标转火星坐标
gis.gps84ToGcj02 = function(coordinate) {
    var p = ExtendUtil.gps84ToGcj02(coordinate[0], coordinate[1]);
    return [p.x, p.y];
}

//火星坐标转84坐标
gis.gcj02ToGps84 = function(coordinate) {
    var p = ExtendUtil.gcjToGps84(coordinate[0], coordinate[1]);
    return [p.x, p.y];
};

//格式化数字
gis.formatNumber = function (num) {
    num = Number(num);
    if(isNaN(num)) {
        return 0;
    } else {
        return Number(num);
    }
}

//格式化标签
gis.formatLabel = function (text) {
    if(!text || text == 'undefined' || text == 'null'){
        return '--';
    } else {
        text = text+'';
        return text.trim();
    }
}

//格式化标签
gis.formatDesc = function (text) {
    if(!text || text == 'undefined' || text == 'null'){
        return '暂无描述';
    } else {
        return text;
    }
}

// 查询要素信息
gis.searchFeatureInfo = function(coordinate, layer, callBack){
    var view = this.map.getView();
    var viewResolution = view.getResolution();
    var source = layer.getSource();
    var url = source.getGetFeatureInfoUrl(
        coordinate, viewResolution, view.getProjection(),
        {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});
    $.ajax({
        async: false,
        url: url,
        type : 'GET',
        dataType: 'json',   //解决跨域的关键
        success: function(response){
            if(callBack){
                callBack(response.features);
            }
        }
    });
}