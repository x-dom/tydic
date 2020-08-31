var  gis = {};
gis.url_geoserver = Common.url_geoserver;//geoserver服务地址
gis.map_server = Common.map_server;//地图服务地址

gis.center = [116.45642531259954, 39.892976756646576];//中心位置
gis.maxResolution = 20;

//门店图层
gis.url_store_layer = 'postgres:beijing_business_hall_info';
gis.store_style =  'store_point_style';

//人流栅格图层
gis.url_userflow_grid_layer = 'postgres:grid_basic_info_deal';
gis.userflow_grid_style =  'store_user_flow_grid_style';

//RSRP栅格图层
gis.url_rsrp_grid_layer = 'postgres:grid_basic_info_deal';
gis.rsrp_grid_style =  'store_rsrp_grid_style';

//交换箱图层
gis.url_exchange_box_layer = 'postgres:dwd_res_device_box_new_month';
gis.exchange_box_style =  'store_exchange_box_style';

//工作地栅格图层
gis.url_work_place_grid_layer = 'postgres:sa_signal_info';
gis.work_place_grid_style =  'store_work_place_grid_style';

//居住地栅格图层
gis.url_live_place_grid_layer = 'postgres:sa_signal_info';
gis.live_place_grid_style =  'store_live_place_grid_style';

//图层
gis.layers = {};

//覆盖物
gis.overlays = {};
gis.overlays.storeTip = undefined;
gis.overlays.markerBuild = [];

//显示控制
gis.show = {};
gis.show.satellite = false;
gis.show.store = true;
gis.show.exchangeBox = true;
gis.show.rsrpGrid = true;
gis.show.userflowGrid = false;
gis.show.workPlaceGrid = false;
gis.show.livePlaceGrid = false;

gis.tool = {};
gis.tool.GeoJSON = new ol.format.GeoJSON();
gis.tool.wktFomat = new ol.format.WKT();
gis.gridSearchPolygonWkt;//栅格空间查询字符串

$(function() {
	gis.init();
});

//初始化
gis.init = function() {
    var prams = GetQueryValue();
    this.center = (!isNaN(Number(prams.lon)) && !isNaN(Number(prams.lat)))?[Number(prams.lon), Number(prams.lat)]:this.center;
    this.initMap();
    this.bindEvent();
    this.loadSourceControl();
    this.loadLegendControl();
    this.addMarker(prams);  
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
            zoom: 14,
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
                })
            });


        _this.map.getInteractions().forEach(function(element, index, array) {
            if(element instanceof ol.interaction.DoubleClickZoom) {
                gis.map.removeInteraction(element);
            }
        })
    }
};

//绑定事件
gis.bindEvent = function(){
    var _this = this;
    _this.map.on("click", function(evt) {
        var coordinate = evt.coordinate;
        // var center = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        // var data = {
        //     name: '测试',
        //     lon: center[0],
        //     lat: center[1],
        // }
        // _this.addMarker(data);

        if(_this.overlays.storeTip) {
            _this.map.removeOverlay(_this.overlays.storeTip);
            _this.overlays.storeTip = undefined;
        }

        if(_this.show.store) {
            new Promise(function (resolve, reject) {
                if(_this.layers.storeLayer) {
                    _this.searchFeatureInfo(coordinate, _this.layers.storeLayer, function(features) {
                        resolve(features);
                    });
                }
            }).then(res => {
                if(res && res.length > 0) {
                    var properties = res[0].properties;
                    if(properties) {
                        console.log(properties);
                        // _this.addMarker(properties);

                        var name = properties.name;
                        var lon = Number(properties.lon);
                        var lat = Number(properties.lat);
                        if(name && !isNaN(lon) && !isNaN(lat)) {
                            var center = [lon, lat];
                            var container = document.createElement("div");
                            container.className = "popup-count";
                            var marker = document.createElement("div");
                            marker.className = "popup-count-marker";
                            marker.innerText = _this.formatLabel(name);
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
                            _this.overlays.storeTip = overlay;
                        }
                    }
                }
            });
        }
    });
};

//刷新栅格
gis.reloadGrid = function() {
    this.loadUserFlowGridLayer();
    this.loadRsrpGridLayer();
    this.loadExchangeBoxLayer();
    this.loadStoreLayer();
    // this.loadWorkPlaceGridLayer();
    // this.loadLivePlaceGridLayer();
};

//加载门店图层
gis.loadStoreLayer = function() {
    var _this = this;
    var layerName = _this.url_store_layer;
    var styles = _this.store_style;
    var cqlFilter = ' 1=1 ';
    if(_this.gridSearchPolygonWkt) {
        cqlFilter += ' and WITHIN(geom, '+_this.gridSearchPolygonWkt+') ';
    } else {
        cqlFilter += ' and 1=2';
    }
    if(! _this.layers.storeLayer){
        _this.layers.storeLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: _this.url_geoserver,
                params: {
                    STYLES: styles,
                    LAYERS: layerName,
                    VERSION: '1.1.0',
                    FORMAT: 'image/png',
                    CQL_FILTER: cqlFilter,
                    TRANSPARENT: true
                },
                serverType: 'geoserver'
            }),
            maxResolution: _this.maxResolution,
            zIndex: 12,
            visible: _this.show.store
        });
        _this.map.addLayer(_this.layers.storeLayer);
    } else {
        var params = _this.layers.storeLayer.getSource().getParams();
        params.CQL_FILTER = cqlFilter;
        _this.layers.storeLayer.getSource().updateParams(params);
       _this.layers.storeLayer.setVisible(_this.show.store);
    }
};

//加载客流量栅格图层
gis.loadUserFlowGridLayer = function() {
    var _this = this;
    var layerName = _this.url_userflow_grid_layer;
    var styles = _this.userflow_grid_style;
    var cqlFilter = ' 1=1 ';
    if(_this.gridSearchPolygonWkt) {
        cqlFilter += ' and WITHIN(geom, '+_this.gridSearchPolygonWkt+') ';
    } else {
        cqlFilter += ' and 1=2';
    }

    if(! _this.layers.userflowGridLayer){
        _this.layers.userflowGridLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: _this.url_geoserver,
                params: {
                    STYLES: styles,
                    LAYERS: layerName,
                    VERSION: '1.1.0',
                    FORMAT: 'image/png',
                    CQL_FILTER: cqlFilter,
                    TRANSPARENT: true
                },
                serverType: 'geoserver'
            }),
            maxResolution: _this.maxResolution,
            zIndex: 10,
            visible: _this.show.userflowGrid
        });
        _this.map.addLayer(_this.layers.userflowGridLayer);
    } else {
        var params = _this.layers.userflowGridLayer.getSource().getParams();
        params.CQL_FILTER = cqlFilter;
        _this.layers.userflowGridLayer.getSource().updateParams(params);
       _this.layers.userflowGridLayer.setVisible(_this.show.userflowGrid);
    }
};

//加载rsrp栅格图层
gis.loadRsrpGridLayer = function() {
    var _this = this;
    var layerName = _this.url_rsrp_grid_layer;
    var styles = _this.rsrp_grid_style;
    var cqlFilter = ' 1=1 ';
    if(_this.gridSearchPolygonWkt) {
        cqlFilter += ' and WITHIN(geom, '+_this.gridSearchPolygonWkt+') ';
    } else {
        cqlFilter += ' and 1=2';
    }

    if(! _this.layers.rsrpGridLayer){
        _this.layers.rsrpGridLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: _this.url_geoserver,
                params: {
                    STYLES: styles,
                    LAYERS: layerName,
                    VERSION: '1.1.0',
                    FORMAT: 'image/png',
                    CQL_FILTER: cqlFilter,
                    TRANSPARENT: true
                },
                serverType: 'geoserver'
            }),
            maxResolution: _this.maxResolution,
            zIndex: 10,
            visible: _this.show.rsrpGrid
        });
        _this.map.addLayer(_this.layers.rsrpGridLayer);
    } else {
        var params = _this.layers.rsrpGridLayer.getSource().getParams();
        params.CQL_FILTER = cqlFilter;
        _this.layers.rsrpGridLayer.getSource().updateParams(params);
       _this.layers.rsrpGridLayer.setVisible(_this.show.rsrpGrid);
    }
};

//加载交换箱图层
gis.loadExchangeBoxLayer = function() {
    var _this = this;
    var layerName = _this.url_exchange_box_layer;
    var styles = _this.exchange_box_style;
    var cqlFilter = ' 1=1 ';
    if(_this.gridSearchPolygonWkt) {
        cqlFilter += ' and WITHIN(geom, '+_this.gridSearchPolygonWkt+') ';
    } else {
        cqlFilter += ' and 1=2';
    }
    if(! _this.layers.exchangeBoxLayer){
        _this.layers.exchangeBoxLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: _this.url_geoserver,
                params: {
                    STYLES: styles,
                    LAYERS: layerName,
                    VERSION: '1.1.0',
                    FORMAT: 'image/png',
                    CQL_FILTER: cqlFilter,
                    TRANSPARENT: true
                },
                serverType: 'geoserver'
            }),
            maxResolution: _this.maxResolution,
            zIndex: 10,
            visible: _this.show.exchangeBox
        });
        _this.map.addLayer(_this.layers.exchangeBoxLayer);
    } else {
        var params = _this.layers.exchangeBoxLayer.getSource().getParams();
        params.CQL_FILTER = cqlFilter;
        _this.layers.exchangeBoxLayer.getSource().updateParams(params);
       _this.layers.exchangeBoxLayer.setVisible(_this.show.exchangeBox);
    }
};

//加载工作地栅格图层
gis.loadWorkPlaceGridLayer = function() {
    var _this = this;
    var layerName = _this.url_work_place_grid_layer;
    var styles = _this.work_place_grid_style;
    var cqlFilter = ' 1=1 ';
    if(_this.gridSearchPolygonWkt) {
        cqlFilter += ' and WITHIN(geom, '+_this.gridSearchPolygonWkt+') ';
    } else {
        cqlFilter += ' and 1=2';
    }
    if(! _this.layers.workPlaceGridLayer){
        _this.layers.workPlaceGridLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: _this.url_geoserver,
                params: {
                    STYLES: styles,
                    LAYERS: layerName,
                    VERSION: '1.1.0',
                    FORMAT: 'image/png',
                    CQL_FILTER: cqlFilter,
                    TRANSPARENT: true
                },
                serverType: 'geoserver'
            }),
            maxResolution: _this.maxResolution,
            zIndex: 10,
            visible: _this.show.workPlaceGrid
        });
        _this.map.addLayer(_this.layers.workPlaceGridLayer);
    } else {
        var params = _this.layers.workPlaceGridLayer.getSource().getParams();
        params.CQL_FILTER = cqlFilter;
        _this.layers.workPlaceGridLayer.getSource().updateParams(params);
       _this.layers.workPlaceGridLayer.setVisible(_this.show.workPlaceGrid);
    }
};
//加载居住地栅格图层
gis.loadLivePlaceGridLayer = function() {
    var _this = this;
    var layerName = _this.url_live_place_grid_layer;
    var styles = _this.live_place_grid_style;
    var cqlFilter = ' 1=1 ';
    if(_this.gridSearchPolygonWkt) {
        cqlFilter += ' and WITHIN(geom, '+_this.gridSearchPolygonWkt+') ';
    } else {
        cqlFilter += ' and 1=2';
    }
    if(! _this.layers.livePlaceGridLayer){
        _this.layers.livePlaceGridLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: _this.url_geoserver,
                params: {
                    STYLES: styles,
                    LAYERS: layerName,
                    VERSION: '1.1.0',
                    FORMAT: 'image/png',
                    CQL_FILTER: cqlFilter,
                    TRANSPARENT: true
                },
                serverType: 'geoserver'
            }),
            maxResolution: _this.maxResolution,
            zIndex: 10,
            visible: _this.show.livePlaceGrid
        });
        _this.map.addLayer(_this.layers.livePlaceGridLayer);
    } else {
        var params = _this.layers.livePlaceGridLayer.getSource().getParams();
        params.CQL_FILTER = cqlFilter;
        _this.layers.livePlaceGridLayer.getSource().updateParams(params);
       _this.layers.livePlaceGridLayer.setVisible(_this.show.livePlaceGrid);
    }
};

//添加标记
gis.addMarker = function(data) {
    var _this = this;
    var name = data.name;
    var lon = Number(data.lon);
    var lat = Number(data.lat);

    if(!_this.layers.boundCircle){
        var style = function(feature) {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 2.0
                }),
            });
        };
        _this.layers.boundCircle = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 11,
            style: style,
            maxResolution: _this.maxResolution,
        });
        _this.map.addLayer(_this.layers.boundCircle);
    }
    var source = _this.layers.boundCircle.getSource();
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

    $('.title-name').show().text(name);
    if(!isNaN(lon) && !isNaN(lat)) {
        var center = [lon, lat];
        var container = document.createElement("div");
        container.className = "popup-count";
        var marker = document.createElement("div");
        marker.className = "popup-count-marker";
        marker.innerText = _this.formatLabel(name);
        container.appendChild(marker);
        var centerMercator = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
        var overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            position: centerMercator,
            positioning: 'bottom-left',
            offset: [-17, -20],//偏移量设置
        });
        _this.map.addOverlay(overlay);
        _this.overlays.markerBuild.push(overlay);

        var flashMakerData = [];
        flashMakerData.push({
            name: name,
            location: centerMercator,
            color: '#FF0000',
            type: 'circle',
            max: 200
        });

        var options = {
            show: true,
            minZoom: 3,
            maxZoom: 18,
            data: flashMakerData
        }
        _this.layers.flashMaker = new FlashMarker(_this.map, options);

        var radius = 3000;

        // var feature = new ol.Feature({
        //     geometry: new ol.geom.Circle(centerMercator, radius)
        // });
        // source.addFeature(feature);

        var pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(centerMercator)
        });
        pointFeature.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                src: 'image/logo/telecom_logo.png',
                anchor: [0.5,1.0]
            })
        }));
        source.addFeature(pointFeature);
 
        // var line = new ol.Feature({
        //     geometry: new ol.geom.LineString([centerMercator, [centerMercator[0], centerMercator[1]+radius]])
        // });
        // line.setStyle(new ol.style.Style({
        //     stroke: new ol.style.Stroke({
        //         color: 'red',
        //         lineDash: [5,5]
        //     }),
        //     text: new ol.style.Text({
        //         text: '3KM',
        //         font: '16px sans-serif',
        //         fill: new ol.style.Fill({
        //             color: '#FFF'
        //         })
        //     })
        // }));
        // source.addFeature(line);
        
        var geometry =  new ol.geom.Polygon([_this.calculateCircle(centerMercator, radius)]);
        _this.gridSearchPolygonWkt = _this.tool.wktFomat.writeGeometry(geometry, {
            dataProjection: 'EPSG:4326', 
            featureProjection: 'EPSG:3857'
        });
        _this.reloadGrid();
    }
}

//资源管理器
gis.mapSources = [
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
    {
        name: "门店",
        show: gis.show.store,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.store = checked;
            if(gis.layers.storeLayer) {
                gis.layers.storeLayer.setVisible(checked);
            }
        }
    },
    {
        name: "交换箱",
        show: gis.show.exchangeBox,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.exchangeBox = checked;
            if(gis.layers.exchangeBoxLayer) {
                gis.layers.exchangeBoxLayer.setVisible(checked);
            }
        }
    },
    {
        name: "信号",
        show: gis.show.rsrpGrid,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.rsrpGrid = checked;
            if(gis.layers.rsrpGridLayer) {
                gis.layers.rsrpGridLayer.setVisible(checked);
            }
            gis.loadLegendControl();
        }
    },
    {
        name: "人流",
        show: gis.show.userflowGrid,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.userflowGrid = checked;
            if(gis.layers.userflowGridLayer){
                gis.layers.userflowGridLayer.setVisible(checked);
            }
            gis.loadLegendControl();
        }
    },
    // {
    //     name: "工作地",
    //     show: gis.show.workPlaceGrid,
    //     disabled: false,
    //     isFirst: true,
    //     onClick: function(checked){
    //         gis.show.workPlaceGrid = checked;
    //         if(gis.layers.workPlaceGridLayer) {
    //             gis.layers.workPlaceGridLayer.setVisible(checked);
    //         }
    //         gis.loadLegendControl();
    //     }
    // },
    // {
    //     name: "居住地",
    //     show: gis.show.livePlaceGrid,
    //     disabled: false,
    //     isFirst: true,
    //     onClick: function(checked){
    //         gis.show.livePlaceGrid = checked;
    //         if(gis.layers.livePlaceGridLayer) {
    //             gis.layers.livePlaceGridLayer.setVisible(checked);
    //         }
    //         gis.loadLegendControl();
    //     }
    // },
];

//加载资源管理器
gis.loadSourceControl = function() {
    var _this = this;
    var sources = _this.mapSources;
    var container = _this.map.getTargetElement();
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
        id: "legend-resource",
        name: "资源",
        show: true,
        type: 'text-image',
        items: [
            {
                text: "电信",
                url: "./image/logo/telecom_logo.png",
                onClick: function() {
                },
            },
            {
                text: "移动",
                url: "./image/logo/mobile_logo.png",
                onClick: function() {
                },
            },
            {
                text: "联通",
                url: "./image/logo/unicom_logo.png",
                onClick: function() {
                },
            },
            {
                text: "交换箱",
                url: "./image/logo/exchange_box.png",
                onClick: function() {
                },
            }
        ]
    },
    {
        id: "legend-userflow-grid",
        name: "人流",
        show: true,
        type: 'text-color',
        items: [
            {
                color: "#00FFFF",
                text: "[1,1000)",
                onClick: function() {
                },
            },
            {
                color: "#FFFF00",
                text: "[1000,5000)",
                onClick: function() {
                },
            },
            {
                color: "#ff5200",
                text: "[5000,10000)",
                onClick: function() {
                },
            },
            {
                color: "#FF0000",
                text: "[10000,+∞)",
                onClick: function() {
                },
            }
        ]
    },
    // {
    //     id: "legend-work-place-grid",
    //     name: "工作地",
    //     show: true,
    //     type: 'text-color',
    //     items: [
    //         {
    //             color: "#02AFFE",
    //             text: "[1,200)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#015AFF",
    //             text: "[200,400)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#FFFF01",
    //             text: "[400,800)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#FF9600",
    //             text: "[800,1600)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#FE0000",
    //             text: "[1600,+∞)",
    //             onClick: function() {
    //             },
    //         }
    //     ]
    // },
    // {
    //     id: "legend-live-place-grid",
    //     name: "居住地",
    //     show: true,
    //     type: 'text-color',
    //     items: [
    //         {
    //             color: "#02AFFE",
    //             text: "[1,200)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#015AFF",
    //             text: "[200,400)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#FFFF01",
    //             text: "[400,800)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#FF9600",
    //             text: "[800,1600)",
    //             onClick: function() {
    //             },
    //         },
    //         {
    //             color: "#FE0000",
    //             text: "[1600,+∞)",
    //             onClick: function() {
    //             },
    //         }
    //     ]
    // },
    {
        id: "legend-rsrp-grid",
        name: "信号",
        show: true,
        type: 'text-color',
        items: [
            {
                color: "#0000FE",
                text: "[-80,+∞)",
                onClick: function() {
                },
            },
            {
                color: "#015AFF",
                text: "[-85,-80)",
                onClick: function() {
                },
            },
            {
                color: "#4987FE",
                text: "[-90,-85)",
                onClick: function() {
                },
            },
            {
                color: "#02AFFE",
                text: "[-95,-90)",
                onClick: function() {
                },
            },
            {
                color: "#79D4FF",
                text: "[-100,-95)",
                onClick: function() {
                },
            },
            {
                color: "#FFFF01",
                text: "[-105,-100)",
                onClick: function() {
                },
            },
            {
                color: "#FF9600",
                text: "[-110,-105)",
                onClick: function() {
                },
            },
            {
                color: "#FE0000",
                text: "(-∞,-110)",
                onClick: function() {
                },
            },
        ]
    },
];
gis.loadLegendControl = function() {
    var _this = this;
    _this.legendSources.forEach((item) => {
        if(item.id == "legend-userflow-grid"){
            item.show = _this.show.userflowGrid;
        } else if(item.id == "legend-rsrp-grid"){
            item.show = _this.show.rsrpGrid;
        } else if(item.id == "legend-work-place-grid"){
            item.show = _this.show.workPlaceGrid;
        } else if(item.id == "legend-live-place-grid"){
            item.show = _this.show.livePlaceGrid;
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
        } else  if(type == 'text-image'){
            el.items.forEach(item => {
                var legendItem = document.createElement("li");
                legendItem.className = "ol3-legend-item";
                legendBody.appendChild(legendItem);
                
                var legendSymbol = document.createElement("img");
                legendSymbol.className = "ol3-legend-img";
                legendSymbol.src = item.url;
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
};

//计算圆
gis.calculateCircle = function(position, radius) {
    var result = [];
    var projCode = this.map.getView().getProjection().getCode(); 
    var p1 = ol.proj.transform(position, projCode, 'EPSG:3857');
    var sizes = 32;
    radius = radius||100;
    for(var i = 0; i < sizes; i++){
        var angle = (i/sizes) * Math.PI * 2.0;
        var dx = Math.cos( angle ) * radius;
        var dy = Math.sin( angle ) * radius;
        var x = p1[0] + dx;
        var y = p1[1] + dy;
        result.push(ol.proj.transform([x, y], 'EPSG:3857', projCode));
    }
    result.push(result[0]);
    return result;
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

//格式化标签
gis.formatLabel = function (text) {
    if(!text || text == 'undefined' || text == 'null'){
        return '--';
    } else {
        text = text+'';
        return text.trim();
    }
}

/**
 * [获取url中的参数配置]
 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param  
 * @return {name: value}           {参数名: 参数值}
 */
function GetQueryValue() {
    var result = {};
    var query = decodeURI(window.location.search.substring(1));
    if(query && query != "") {
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            result[pair[0]] = pair[1];
        }
    }
    return result;
}