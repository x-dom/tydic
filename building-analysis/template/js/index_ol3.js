var GIS_BUSI_CONFIG = {
    1: {
        name: "乐成中心",
        desc: "乐成中心坐落于东三环国贸桥南约1000米处，朝阳区东三环中路20号。位居国贸桥南“金十字”东北角，为承上启下之坐标。项目总建筑面积10.48万平方米，由两座国际甲级写字楼、高档购物中心组成，为商圈内罕有的优质商务载体。",
        center: [116.45642531259954, 39.892976756646576],//中心位置
        building_3dtile_url: "./data/bj_lczx_building/tileset.json",//建筑地址
        building_geojson_url: "./data/mars/bj_lczx_building.geojson",//建筑地址
        roadnet_geojson_url: "./data/mars/bj_lczx_road.geojson",//路网地址
        model_url: './image/lecheng.glb',//模型地址
        model_scale: 20.0,
        floor_url: undefined,//楼层
        floor_room_url: undefined,//楼内建筑
        bound: [116.455612585124797,39.89386524357522,116.457039772852497,39.893860584057173,116.457070138548829,39.893073120956515,116.457076211688104,39.893007886921104,116.457234113309056,39.892840141973515,116.45720982075197,39.892304287307319,116.455618658264044,39.892318266177902,116.455612585124797,39.89386524357522],
    },
    2: {
        name: "西单大悦城",
        desc: "西单大悦城（JOY CITY），于2007年底隆重开业，是一座由中粮集团精心打造的“国际化青年城”，这座西单商圈唯一的Shopping Mall迅速成为时尚达人、流行先锋、潮流新贵休闲购物的首选之地。",
        center: [116.36673882559126, 39.90942816857162],//中心位置
        building_3dtile_url: "./data/bj_xddyc_building/tileset.json",//建筑地址
        building_geojson_url: "./data/mars/bj_xddyc_building.geojson",//建筑地址
        roadnet_geojson_url: './data/mars/bj_xddyc_road.geojson',//路网地址
        model_url: "./image/building2.glb",//模型地址
        model_scale: 0.3,
        floor_url: './data/mars/bj_xddyc_floor.geojson',//楼层
        floor_room_url: './data/mars/bj_xddyc_floor_building.geojson',//楼内建筑
        bound: [116.36588693295629, 39.910139724802356, 116.3676504904102, 39.91015519278, 116.36761425615232, 39.908756210959424, 116.36601033337296, 39.90870839074662, 116.36588693295629, 39.910139724802356],
    },
}; 


var gis = {};
gis.url_root = Common.url_server_root;//后端接口地址
gis.url_geoserver = Common.url_geoserver;//geoserver服务地址
gis.map_server = Common.map_server;//地图服务地址
gis.building_id = 1;
gis.center = GIS_BUSI_CONFIG[gis.building_id].center;//中心位置
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

//图层
gis.layers = {};

//覆盖物
gis.overlays = {};
gis.overlays.circleBound = [];

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
gis.show.grid = true;

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
gis.init = function(start_hour_no, end_hour_no, searchField, building_id){
    this.start_hour_no = start_hour_no||this.start_hour_no;
    this.end_hour_no = end_hour_no||this.start_hour_no;
    this.searchField = searchField||this.searchField;
    this.searchField = searchField==""?undefined:this.searchField;
    this.building_id = building_id||1;
    this.initMap();
};

//初始化地图
gis.initMap = function() {
    var _this = this;
    var center = GIS_BUSI_CONFIG[_this.building_id].center;
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

    _this.changeBuilding(_this.building_id);
}

//更新渲染时间
gis.updateHourNo = function(start_hour_no, end_hour_no, searchField){
    this.start_hour_no = start_hour_no||this.start_hour_no;
    this.end_hour_no = end_hour_no||this.start_hour_no;
    this.searchField = searchField||this.searchField;
    this.searchField = searchField==""?undefined:this.searchField;
    this.loadGrid();
    this.loadUserFlowIn();
    this.loadHeatmap();
};

//切换商综建筑
gis.changeBuilding = function(building_id) {
    this.building_id = building_id||this.building_id;
    this.building_id = building_id==undefined||building_id==""?1:this.building_id;
    
    var center = GIS_BUSI_CONFIG[this.building_id].center;
    this.setCenter(center[0], center[1]);
    this.loadBaseBuilding();
    this.loadCircleBound();
    this.loadBuilding();
    this.loadRoadnet();
    this.loadHeatmap();
    this.loadGrid();
    this.loadUserFlowIn();
    this.loadSearchControl();
    this.loadSourceControl();
    this.loadLegendControl();
    this.bindEvent();
};

//中心点
gis.setCenter = function(lon, lat) {
    var center = this.gps84ToGcj02([lon, lat]);
    center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    this.map.getView().animate({center: center});
}

//基础建筑
gis.loadBaseBuilding = function() {
    var _this = this;
    var name = GIS_BUSI_CONFIG[_this.building_id].name;
    var desc = GIS_BUSI_CONFIG[_this.building_id].desc;
    var center = GIS_BUSI_CONFIG[_this.building_id].center;

    if(!_this.layers.baseBuilding){
        _this.layers.baseBuilding = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 12,
        });
        _this.map.addLayer(_this.layers.baseBuilding);
    }

    var source = _this.layers.baseBuilding.getSource();
    source.clear();

    //围栏
    var bound = GIS_BUSI_CONFIG[_this.building_id].bound;
    var boundOl3 = [];
    for (var i = 0; i < bound.length; i+=2) {
        var coordinate = [bound[i], bound[i+1]];
        coordinate = _this.gps84ToGcj02(coordinate);
        coordinate = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
        boundOl3.push(coordinate);
    }

    var enclosure = new ol.Feature({
        id: 'enclosure',
        geometry: new ol.geom.LineString(boundOl3),
    });
    enclosure.setProperties({
        name: name,
        center: center,
        desc: desc,
    });
    // enclosure.setStyle(new ol.style.Style({
    //     stroke: new ol.style.Stroke({
    //         lineDash: [10,10],
    //         color: '#ffcc33',
    //         width: 5
    //     }),
    // }));
    enclosure.setStyle(function() {
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
                color: '#ffcc33',
                width: width
            })
        });
    });
    source.addFeature(enclosure);

    center = _this.gps84ToGcj02(center);
    
    // var options = {
    //     show: true,
    //     minZoom: 3,
    //     maxZoom: 18,
    //     data:  [{
    //         name: '乐成中心',
    //         location: ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'),
    //         color: '#FF0000',
    //         type: 'circle',
    //         // speed: 1,
    //         // max: 1,
    //     }]
    // }
    // new FlashMarker(_this.map, options);
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
    var center = GIS_BUSI_CONFIG[_this.building_id].center;
    center = this.gps84ToGcj02(center);
    var centerMercator = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    var labelCenter1 =  [centerMercator[0], centerMercator[1] + 600];
    var labelCenter2 =  [centerMercator[0], centerMercator[1] + 2000];
    var labelCenter3 =  [centerMercator[0], centerMercator[1] + 3500];
    var labelCenter5 =  [centerMercator[0], centerMercator[1] + 5500];
    // labelCenter1 = ol.proj.transform(labelCenter1, 'EPSG:3857', 'EPSG:4326');
    // labelCenter2 = ol.proj.transform(labelCenter2, 'EPSG:3857', 'EPSG:4326');
    // labelCenter3 = ol.proj.transform(labelCenter3, 'EPSG:3857', 'EPSG:4326');
    // labelCenter5 = ol.proj.transform(labelCenter5, 'EPSG:3857', 'EPSG:4326');
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
        // var pfeature =  new ol.Feature({
        //     geometry: new ol.geom.Point(dataArr[i].labelCenter)
        // });
        // pfeature.setStyle(function() {
        //     var zoom  = _this.map.getView().getZoom();
        //     var scale = 1.0 - (17-zoom)/10;
        //     // if(scale > 15) {
        //     //     scale = 1.0;
        //     // } else if(zoom > 13) {
        //     //     scale = 0.5;
        //     // } else {
        //     //     scale = 0.1;
        //     // }
        //     return new ol.style.Style({
        //         text: new ol.style.Text({
        //             text: dataArr[i].label,
        //             scale: scale,
        //             font: '16px Lucida Sans',
        //             textBaseline: 'middle',
        //             backgroundFill:new ol.style.Fill({
        //                 color:'rgba(255,51,0,1)'
        //             }),
        //             stroke: new ol.style.Stroke({
        //                 color: '#fff',
        //                 width: 2.0
        //             })
        //         })
        //     });
        // });
        // source.addFeature(pfeature);
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

    var building_geojson_url = GIS_BUSI_CONFIG[_this.building_id].building_geojson_url;
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

    var roadnet_geojson_url = GIS_BUSI_CONFIG[_this.building_id].roadnet_geojson_url;
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

//热力图
gis.loadHeatmap = function() {
    var _this = this;
    if(_this.isLoading.heatmap) return;
    _this.isLoading.heatmap = true;
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
    params.hour_no = _this.start_hour_no;
    params.end_hour_no = _this.end_hour_no;
    params.field_name = _this.searchField;
    params.type = _this.building_id;

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
            _this.isLoading.heatmap = false;
        },
        error: function() {
            _this.isLoading.heatmap = false;
        }
    }); 
}

//栅格
gis.loadGrid = function() {
    var _this = this;
    if(_this.isLoading.grid) return;
    _this.isLoading.grid = true;
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
    params.hour_no = _this.start_hour_no;
    params.end_hour_no = _this.end_hour_no;
    params.field_name = _this.searchField;
    params.type = _this.building_id;
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
            _this.isLoading.grid = false;
        },
        error: function() {
            _this.isLoading.grid = false;
        }
    });
};

//更新栅格图例
gis.updateGridLegend = function() {
    var _this = this;
    var itemsMap = new Map();
    var levelMap = new Map();
    if(_this.grid.data.length > 0){
        levelMap.set(5, {
            min: 0,
            max: _this.grid.data[0].tile14_user_cnt_min,
        });
        levelMap.set(4, {
            min: _this.grid.data[0].tile14_user_cnt_min,
            max: _this.grid.data[0].tile14_user_cnt_avg,
        });
        levelMap.set(3, {
            min: _this.grid.data[0].tile14_user_cnt_avg,
            max: _this.grid.data[0].tile14_user_cnt_maa,
        });
        levelMap.set(2, {
            min: _this.grid.data[0].tile14_user_cnt_maa,
            max: _this.grid.data[0].tile14_user_cnt_max,
        });
        levelMap.set(1, {
            min: _this.grid.data[0].tile14_user_cnt_max,
            max: '+∞',
        });
    };
    _this.grid.data.forEach(el => {
        if(!itemsMap.get(el.colour_level)){
            itemsMap.set(el.colour_level, {
                level: el.colour_level,
                text: "["+levelMap.get(el.colour_level).min+", "+levelMap.get(el.colour_level).max+")",
                color: _this.GEO_GRID_COLOR_CONFIG[el.colour_level],
            });
        }
    });
    
    _this.grid.legend = [];
    itemsMap.forEach(el => {
        _this.grid.legend.push(el);
    });
    _this.grid.legend.sort((a, b) => {return a.level - b.level});
    _this.loadLegendControl();
};

//根据经纬度选中栅格
gis.selectGridByLonLat = function(lon, lat) {
    var _this = this;
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
            staticElement.className = "common";
            var html = "<div><span class=\"label\">综合体名称：</span><span class=\"value\">"+properties.commercial_complex_name+"</span><span class=\"label1\"></div>";
            html += "<div><span class=\"label\">14级栅格ID：</span><span class=\"value\">"+properties.tile14_id+"</span><span class=\"label1\"></span></div>";
            html += "<div><span class=\"label\">栅格到访人数：</span><span class=\"value\">"+properties.tile14_user_cnt+"</span><span class=\"label1\"></span></div>";
            html += "<div><span class=\"label\">居住地人数：</span><span class=\"value\">"+properties.live_user_cnt+"</span><span class=\"label1\"></div>";
            staticElement.innerHTML = html;
            var contentDom = document.createElement("div");
            contentDom.appendChild(staticElement);

            var position = [properties.tile14_lon, properties.tile14_lat];
            position = _this.gps84ToGcj02(position);
            position =  ol.proj.transform(position, 'EPSG:4326', 'EPSG:3857');
            _this.grid.dialog = _this.addBaseInfoWindow(position, properties.name, contentDom, function() {
                _this.closeSelectGrid();
            });
        }
    });
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
    
    if(_this.isLoading.odLineIn) return;
    _this.isLoading.odLineIn = true;
    if(_this.layers.userFlowIn){
        _this.layers.userFlowIn.destroy();
        _this.layers.userFlowIn = undefined;
    }
    var center = GIS_BUSI_CONFIG[_this.building_id].center;
    center = _this.gps84ToGcj02(center);
    center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    var server = '/demo/getTop10Cell';
    var params = {};
    params.hour_no = _this.start_hour_no;
    params.end_hour_no = _this.end_hour_no;
    params.field_name = _this.searchField;
    params.type = _this.building_id;

    $.ajax({
        url: _this.url_root+server,
        method: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {

            /**
             * all_cnt
             * area_rate
             * all_user_cnt
             * id
             * longitude
             * latitude
             * name
             */
            data.sort(function(a, b){
                return a.all_user_cnt - b.all_user_cnt;
            });
            var moveLineData = [];
            data.forEach((line, index)=>{
                var position = [line.longitude, line.latitude];
                position = _this.gps84ToGcj02(position);
                position = ol.proj.transform(position, 'EPSG:4326', 'EPSG:3857');
                var conf = _this.getODLineColorConfig(index);
                moveLineData.push({
                    color: conf.color,
                    width: conf.width,
                    from: {
                        name: line.name,
                        lnglat: position
                    },
                    to: {
                        lnglat: center
                    }
                });
            });
            
            _this.layers.userFlowIn = new MoveLine(_this.map, {
                show: _this.show.odLine,
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
                minZoom:  14,
                maxZoom: null
            });
            _this.isLoading.odLineIn = false;
        },
        error: function() {
            _this.isLoading.odLineIn = false;
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
                value = _this.gcj02ToGps84(value);
                coordinates[i] = value.join(" ");
            });
            coordinates = coordinates.join(",");
            var cql_polygon = 'POLYGON((';
            cql_polygon += coordinates;
            cql_polygon += '))';
            _this.gridSearchPolygonWkt = cql_polygon;
            _this.loadGrid();
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
    {
        name: "建筑楼宇",
        show: gis.show.building,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.building = checked;
            if(gis.layers.building) {
                gis.layers.building.setVisible(checked);
            }
        }
    },
    {
        name: "街道路网",
        show: gis.show.roadnet,
        disabled: false,
        isFirst: false,
        onClick: function(checked){
            gis.show.roadnet = checked;
            if(gis.layers.roadnet) {
                gis.layers.roadnet.setVisible(checked);
            }
        }
    },
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
        name: "人流热力",
        show: gis.show.heatmap,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.heatmap = checked;
            if(gis.layers.heatmap) {
                gis.layers.heatmap.setVisible(checked);
            }
            gis.loadLegendControl();
        }
    },
    {
        name: "人流OD线",
        show: gis.show.odLine,
        disabled: false,
        isFirst: false,
        onClick: function(checked){
            gis.show.odLine = checked;
            if(gis.layers.userFlowIn) {
                gis.layers.userFlowIn.show = checked;
            }
            gis.loadLegendControl();
        }
    },
    {
        name: "人流栅格",
        show: gis.show.grid,
        disabled: false,
        isFirst: false,
        onClick: function(checked){
            gis.show.grid = checked;
            if(gis.layers.grid) {
                gis.layers.grid.setVisible(checked);
            }

            if(gis.searchControl) {
                gis.searchControl.show = checked;
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
        id: "legend-user-line",
        name: "OD线",
        show: true,
        type: 'ud-range-color',
        topText: "1",
        downText: "10",
        colorRange: ["#FF0000,#FFFF00,#00FF00"]
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

        if(_this.searchControl){
            _this.searchControl.mouseClick(evt.coordinate);
        }

        _this.map.forEachFeatureAtPixel(evt.pixel,function(feature,layer) {
            var properties = feature.getProperties();
            if(properties.id == "enclosure"){
                isVector = true;
                var html = '<p>'+properties.desc+'</p>';
                _this.baseWindow = _this.addBaseInfoWindow(evt.coordinate, properties.name, html);
            } 
        });
    });

    _this.map.on("dblclick", function(evt) {
        var coordinate = evt.coordinate;
        if(_this.searchControl){
            _this.searchControl.mouseDBClick(coordinate);
        }
        var lonLat = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        lonLat = _this.gcj02ToGps84(lonLat);
        _this.selectGridByLonLat(lonLat[0], lonLat[1]);
    });


    _this.map.on('pointermove', function(evt) {
        var coordinate = evt.coordinate;
        if(_this.searchControl){
            _this.searchControl.mouseMove(coordinate);
        }
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