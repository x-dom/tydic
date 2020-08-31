var gis = {};
gis.url_root = Common.url_server_root;//后端接口地址
gis.url_geoserver = Common.url_geoserver;//geoserver服务地址
gis.map_server = Common.map_server;//地图服务地址

gis.currentBusi,gis.busiId;
gis.center = [116.45642531259954, 39.892976756646576];//中心位置
gis.start_hour_no = 2020042210;//当前显示开始时间
gis.end_hour_no = 2020042210;//当前显示结束时间

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
gis.show.odLine = false;
gis.show.grid = false;
gis.show.cell = true;

//加载队列控制
gis.isLoading = {};
gis.isLoading.heatmap = false;
gis.isLoading.odLineIn = false;
gis.isLoading.odLineOut = false;
gis.isLoading.grid = false;//暂时无效

//栅格渲染配置
gis.GEO_GRID_COLOR_CONFIG = {
    1: "#ff5200",
    2: "#FFFF00",
    3: "#00FF00",
    4: "#00FFFF",
    5: "#0000FF"
};

//OD线渲染配置
gis.getODLineColorConfig = function(num){
    var result = {color: "#0000FF", width: 1.0};
    
    var weight = 10;
    var rate = num/weight;
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
};

//切换商综建筑
gis.changeBusi = function(busi) {
    this.currentBusi =  busi;
    this.busiId = busi.busi_id;
    this.center = [busi.lon, busi.lat];
    this.setCenter(this.center[0], this.center[1]);
    this.loadCircleBound();
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

//加载竞争商场
gis.loadCompleteMarket = function (data) {
    var _this = this;

    if(!_this.layers.marketBound){
        _this.layers.marketBound = new ol.layer.Vector({
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
                if(feature.getProperties().busiId && feature.getProperties().busiId == _this.busiId) {
                    return new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            lineDash: [dashLen,dashLen],
                            // color: '#ffcc33',
                            color: '#00ff00',
                            width: width
                        })
                    });
                } else {
                    return new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            lineDash: [dashLen,dashLen],
                            color: '#ffcc33',
                            width: width
                        })
                    });
                }
            }
        });
        _this.map.addLayer(_this.layers.marketBound);
    }

    var source = _this.layers.marketBound.getSource();
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

    var extentXMin,extentXMax,extentYMin,extentYMax;
    var flashMakerData = [];
    data.forEach(val => {
        var center = [val.longitude, val.latitude];
        center = _this.gps84ToGcj02(center);
        if(extentXMin) {
            extentXMin = Math.min(center[0], extentXMin);
        } else {
            extentXMin = center[0];
        }
        if(extentXMax) {
            extentXMax = Math.max(center[0], extentXMax);
        } else {
            extentXMax = center[0];
        }
        if(extentYMin) {
            extentYMin = Math.min(center[1], extentYMin);
        } else {
            extentYMin = center[1];
        }
        if(extentYMax) {
            extentYMax = Math.max(center[1], extentYMax);
        } else {
            extentYMax = center[1];
        }

        var container = document.createElement("div");
        container.className = "popup-count popup-marker-building";
        // container.style.display = (zoom>=13 && _this.show.circleBound)?'block':'none';
        var marker = document.createElement("div");
        marker.className = "popup-count-marker";
        marker.innerText = val.name;
        container.appendChild(marker);
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
            name: val.name,
            location: centerMercator,
            color: '#FF0000',
            type: 'circle',
        });
        var wkt = val.polygon;
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
                    name: val.name,
                    center: [val.longitude, val.latitude],
                    desc: val.desc,
                    busiId: val.type,
                });
                source.addFeature(feature);
            }
        }
        
    });

    var options = {
        show: true,
        minZoom: 3,
        maxZoom: 18,
        data: flashMakerData
    }
    _this.layers.flashMaker = new FlashMarker(_this.map, options);

    var extent = ol.extent.boundingExtent([[extentXMin, extentYMin],[extentXMax, extentYMax]]);
    extent =  ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
    _this.map.getView().fit(extent, _this.map.getSize());
};

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
    center = this.gps84ToGcj02(center);
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
            maxResolution: 2
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
            maxResolution: 2
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
    }
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
                color: "#0000FF",
                text: "[1,3)",
                onClick: function() {
                },
            },
            {
                color: "#00FFFF",
                text: "[3,5)",
                onClick: function() {
                },
            },
            {
                color: "#00FF00",
                text: "[5,7)",
                onClick: function() {
                },
            },
            {
                color: "#FFFF00",
                text: "[7,10)",
                onClick: function() {
                },
            },
            {
                color: "#ff5200",
                text: "[10,+∞)",
                onClick: function() {
                },
            }
        ]
    },
];
gis.loadLegendControl = function() {
    var _this = this;
    _this.legendSources.forEach((item) => {
        if(item.id == "legend-business-bound"){
            item.show = _this.show.circleBound;
        } else if(item.id == "legend-user-line"){
            item.show = _this.show.odLine;
        } else if(item.id == "legend-user-grid"){
            item.show = _this.show.grid;
            item.items = _this.grid.legend;
            if(item.items.length == 0){
                item.show = false;
            } 
        } else if(item.id == "legend-user-heatmap"){
            item.show = _this.show.heatmap;
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

        // var isVector = false;
        // _this.map.forEachFeatureAtPixel(evt.pixel,function(feature,layer) {
        //     var properties = feature.getProperties();
        //     if(properties.type == "bound"){
        //         isVector = true;
        //         var html = '<p>'+_this.formatDesc(properties.desc)+'</p>';
        //         _this.baseWindow = _this.addBaseInfoWindow(evt.coordinate, properties.name, html);
        //     } 
        // });
    });
}

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

//格式化标签
gis.formatDesc = function (text) {
    if(!text || text == 'undefined' || text == 'null'){
        return '暂无描述';
    } else {
        return text;
    }
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

// 查询要素信息
gis.searchFeatureInfo = function(coordinate, layer, callBack){
    var view = this.map.getView();
    var viewResolution = view.getResolution();
    var source = layer.getSource();
    var url = source.getGetFeatureInfoUrl(
        coordinate, viewResolution, view.getProjection(),
        {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});
    $.ajax({
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