var GIS_BUSI_CONFIG = {
    1: {
        name: "乐成中心",
        desc: "乐成中心坐落于东三环国贸桥南约1000米处，朝阳区东三环中路20号。位居国贸桥南“金十字”东北角，为承上启下之坐标。项目总建筑面积10.48万平方米，由两座国际甲级写字楼、高档购物中心组成，为商圈内罕有的优质商务载体。",
        center: [116.45642531259954, 39.892976756646576],//中心位置
        building_3dtile_url: "./data/bj_lczx_building/tileset.json",//建筑地址
        building_geojson_url: "./data/bj_lczx_building.geojson",//建筑地址
        roadnet_geojson_url: "./data/bj_lczx_road.geojson",//路网地址
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
        building_geojson_url: "./data/bj_xddyc_building.geojson",//建筑地址
        roadnet_geojson_url: './data/bj_xddyc_road.geojson',//路网地址
        model_url: "./image/building2.glb",//模型地址
        model_scale: 0.3,
        floor_url: './data/bj_xddyc_floor.geojson',//楼层
        floor_room_url: './data/bj_xddyc_floor_building.geojson',//楼内建筑
        bound: [116.36588693295629, 39.910139724802356, 116.3676504904102, 39.91015519278, 116.36761425615232, 39.908756210959424, 116.36601033337296, 39.90870839074662, 116.36588693295629, 39.910139724802356],
    },
}; 


var gis = {};
gis.url_root = Common.url_server_root;//后端接口地址
gis.url_geoserver = Common.url_geoserver;//geoserver服务地址
gis.map_server = Common.map_server;//地图服务地址
gis.building_id = 1;
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

//基础建筑
gis.baseBuilding = {};

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

//初始化
gis.init = function(start_hour_no, end_hour_no, searchField, building_id){
    this.start_hour_no = start_hour_no||this.start_hour_no;
    this.end_hour_no = end_hour_no||this.start_hour_no;
    this.searchField = searchField||this.searchField;
    this.searchField = searchField==""?undefined:this.searchField;
    this.building_id = wisdomManage.type;
    this.initMap();
};

//初始化地图
gis.initMap = function() {
    var _this = this;
    if(_this.app){
        // _this.app.viewer.destory();
        _this.app = undefined;
        _this.viewer = undefined;
    }

    _this.app = new DicCesium("map", {targetFrameRate: 30, map_server: _this.map_server});
    _this.viewer = _this.app.viewer;
    _this.app.initClock();
    _this.app.flyHome();
    _this.changeBuilding(_this.building_id);

    //地图异常重新加载
    _this.viewer.scene.renderError.addEventListener(function(){
        if(window.confirm('GPU崩溃，地图将无法使用,是否重新加载页面？')){
            location.reload(); 
            return true;
        }else{
            return false;
        }
    });
}

//更新渲染时间
gis.updateHourNo = function(start_hour_no, end_hour_no, searchField){
    this.start_hour_no = start_hour_no||this.start_hour_no;
    this.end_hour_no = end_hour_no||this.start_hour_no;
    this.searchField = searchField||this.searchField;
    this.searchField = searchField==""?undefined:this.searchField;
    this.loadGrid();
    this.loadUserFlowIn();
    this.loadHeatMap();
};

//切换商综建筑
gis.changeBuilding = function(building_id) {
    this.building_id = building_id||this.building_id;
    this.building_id = building_id==undefined||building_id==""?1:this.building_id;
    
    var center = GIS_BUSI_CONFIG[this.building_id].center;
    this.app.fly2Point(center[0], center[1]);
    this.loadBaseBuilding();
    this.loadCircleBound();
    this.loadBuildingTile();
    this.loadRoadnet();
    this.loadHeatMap();
    this.loadGrid();
    this.loadUserFlowIn();
    this.loadSearchControl();
    this.loadSourceControl();
    this.loadLegendControl();
    this.bindEvent();
};

//栅格渲染配置
gis.getGeoGridColorConfig = function(level){
    var result = {color: "#0000FF", width: 1.0};
    if(level == 5) {
        result.color = "#0000FF";
        result.width = 0.2;
    } else if(level == 4) {
        result.color = "#00FFFF";
        result.width = 0.5;
    } else if(level == 3) {
        result.color = "#00FF00";
        result.width = 1.0;
    } else if(level == 2) {
        result.color = "#FFFF00";
        result.width = 2.0;
    } else if(level == 1) {
        result.color = "#ff5200";
        result.width = 3.0;
    } else {
        result.color = "#0000FF";
        result.width = 0.0;
    }

    return result;
};

//栅格
gis.getGridColorConfig = function(num){
    var result = {color: "#0000FF", width: 1.0};
    if(num < 1){
        result.color = "#0000FF";
        result.width = 0.0;
    } else if(num >= 1 && num < 3) {
        result.color = "#0000FF";
        result.width = 0.2;
    } else if(num >= 3 && num < 5) {
        result.color = "#00FFFF";
        result.width = 0.5;
    } else if(num >= 5 && num < 7) {
        result.color = "#00FF00";
        result.width = 1.0;
    } else if(num >= 7 && num < 10) {
        result.color = "#FFFF00";
        result.width = 2.0;
    } else if(num >= 10) {
        result.color = "#ff5200";
        result.width = 3.0;
    }

    return result;
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

//中心点
gis.setCenter = function(lon, lat) {
    this.app.fly2Point(lon, lat);
}

//基础建筑
gis.loadBaseBuilding = function() {
    var _this = this;
    var name = GIS_BUSI_CONFIG[_this.building_id].name;
    var desc = GIS_BUSI_CONFIG[_this.building_id].desc;
    var center = GIS_BUSI_CONFIG[_this.building_id].center;
    var position = Cesium.Cartesian3.fromDegrees(center[0], center[1], 0);
    var heading = Cesium.Math.toRadians(180);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    if(_this.baseBuilding.model){
        _this.viewer.entities.remove(_this.baseBuilding.model);
        _this.baseBuilding.model = undefined;
    }
    _this.baseBuilding.model = _this.viewer.entities.add({
        show: !_this.show.indoor,
        name: name,
        position:  position,
        orientation: orientation,
        properties: {
            desc: desc,
            billboardUrl: "image/yuecheng_logo1.png",
        },
        model: {
            uri: GIS_BUSI_CONFIG[_this.building_id].model_url,
            scale: GIS_BUSI_CONFIG[_this.building_id].model_scale,
        }
    });

    //柱状广告牌
    if(_this.baseBuilding.cylinderBillboard){
        _this.viewer.entities.remove(_this.baseBuilding.cylinderBillboard);
        _this.baseBuilding.cylinderBillboard = undefined;
    }
    _this.baseBuilding.cylinderBillboard = new CylinderBillboard(_this.viewer, {
        origin: Cesium.Cartesian3.fromDegrees(center[0], center[1], 0),
        topRadius: 100.0,
        bottomRadius: 100.0,
        canvasWidth: 2000.0
    });

    //一般广告牌
    // _this.baseBuilding.commonBillboard = _this.viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(center[0], center[1], 150),
    //     billboard: {
    //         image: "image/yuecheng_logo.png",
    //         scaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.5, 1.5e4, 0.2),
    //         pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.0, 1.5e4, 1.0),
    //         distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e5)
    //     }
    // });

    //围栏
    var bound = GIS_BUSI_CONFIG[_this.building_id].bound;
    var boundPositions = Cesium.Cartesian3.fromDegreesArray(bound);
    _this.baseBuilding.enclosure = new Enclosure(_this.viewer,{positions: boundPositions});


    //室内建筑
    if(_this.baseBuilding.indoor) {
        _this.baseBuilding.indoor.destroy();
        _this.baseBuilding.indoor = undefined;
    }
    _this.baseBuilding.indoor = new IndoorBuilding(_this.viewer, {show: _this.show.indoor});
    if(GIS_BUSI_CONFIG[_this.building_id].floor_url) {
        _this.app.loadGeoJson(GIS_BUSI_CONFIG[_this.building_id].floor_url,(dataSource) => {
            dataSource.entities.values.forEach(entity => {
                var floor = entity.properties.floor.getValue();
                var sortNum = entity.properties.sort_num.getValue();
                _this.baseBuilding.indoor.addFloor(floor, sortNum, entity);
            });
        });
    }
    if(GIS_BUSI_CONFIG[_this.building_id].floor_room_url) {
        _this.app.loadGeoJson(GIS_BUSI_CONFIG[_this.building_id].floor_room_url,(dataSource) => {
            dataSource.entities.values.forEach(entity => {
                var floor = entity.properties.floor.getValue();
                _this.baseBuilding.indoor.addFloorRoomOfEntityByFloorId(floor, entity);
            });
        });
    }
};

//圆形边界
gis.loadCircleBound = function() {
    var _this = this;
    if(_this.boundDataSource){
        _this.viewer.dataSources.remove(_this.boundDataSource);
    }

    var center = GIS_BUSI_CONFIG[_this.building_id].center;
    var orientation = Cesium.Cartesian3.fromDegrees(center[0], center[1], 0);
    var orientation1 = Cesium.Cartesian3.fromDegrees(center[0], center[1], 100);
    var webMercatorProjection = new Cesium.WebMercatorProjection(Cesium.Ellipsoid.WGS84);
    var originMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(orientation1));
    var originMercator_1KM = originMercator.clone();
    var originMercator_2KM = originMercator.clone();
    var originMercator_3KM = originMercator.clone();
    var originMercator_5KM = originMercator.clone();
    originMercator_1KM.y = originMercator_1KM.y + 600;
    originMercator_2KM.y = originMercator_2KM.y + 2000;
    originMercator_3KM.y = originMercator_3KM.y + 3000;
    originMercator_5KM.y = originMercator_5KM.y + 5000;
    
    var origin_1KM = Cesium.Cartographic.toCartesian(webMercatorProjection.unproject(originMercator_1KM));
    var origin_2KM = Cesium.Cartographic.toCartesian(webMercatorProjection.unproject(originMercator_2KM));
    var origin_3KM = Cesium.Cartographic.toCartesian(webMercatorProjection.unproject(originMercator_3KM));
    var origin_5KM = Cesium.Cartographic.toCartesian(webMercatorProjection.unproject(originMercator_5KM));

    //边界
    _this.boundDataSource = new Cesium.CustomDataSource('busi-bound');
    _this.boundDataSource.show = _this.show.circleBound;
    _this.boundDataSource.entities.add({
        position: orientation,
        name : 'Green circle at height with outline',
        ellipse : {
            semiMinorAxis : 1000.0,
            semiMajorAxis : 1000.0,
            height: 10.0,
            fill: true,
            material: Cesium.Color.fromCssColorString("#ff5200").withAlpha(0.1),
            outline : true, // height must be set for outline to display
            outlineColor: Cesium.Color.fromCssColorString("#ff5200").withAlpha(0.2),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        },
    });
    _this.boundDataSource.entities.add({
        position: orientation,
        name : 'Green circle at height with outline',
        ellipse : {
            semiMinorAxis : 2000.0,
            semiMajorAxis : 2000.0,
            height: 8.0,
            fill: true,
            material: Cesium.Color.fromCssColorString("#FFFF00").withAlpha(0.1),
            outline : true, // height must be set for outline to display
            outlineColor: Cesium.Color.fromCssColorString("#FFFF00").withAlpha(0.2),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        }
    });
    _this.boundDataSource.entities.add({
        position: orientation,
        name : 'Green circle at height with outline',
        ellipse : {
            semiMinorAxis : 3000.0,
            semiMajorAxis : 3000.0,
            height: 6.0,
            fill: true,
            material: Cesium.Color.fromCssColorString("#00FF00").withAlpha(0.1),
            outline : true, // height must be set for outline to display
            outlineColor: Cesium.Color.fromCssColorString("#00FF00").withAlpha(0.2),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        }
    });
    _this.boundDataSource.entities.add({
        position: orientation,
        name : 'Green circle at height with outline',
        ellipse : {
            semiMinorAxis : 5000.0,
            semiMajorAxis : 5000.0,
            height: 4.0,
            fill: true,
            material: Cesium.Color.fromCssColorString("#00FFFF").withAlpha(0.1),
            outline : true, // height must be set for outline to display
            outlineColor: Cesium.Color.fromCssColorString("#00FFFF").withAlpha(0.2),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        }
    });

    var font = '20px Lucida Sans';
    var scaleByDistance = new Cesium.NearFarScalar(1.0e2, 1.0, 1.0e3, 0.6, 1.0e4, 0.4, 1.0e5, 0.2);
    _this.boundDataSource.entities.add({
        position: origin_1KM,
        label: {
            text: '1KM',
            font: font,
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(7, 7),
            scaleByDistance : scaleByDistance.clone(),
            pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.0, 1.5e4, 1.0),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e5),
        }
    });
    _this.boundDataSource.entities.add({
        position: origin_2KM,
        label: {
            text: '2KM',
            font: font,
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(7, 7),
            scaleByDistance : scaleByDistance.clone(),
            pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.0, 1.5e4, 1.0),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e5),
        }
    });
    _this.boundDataSource.entities.add({
        position: origin_3KM,
        label: {
            text: '3KM',
            font: font,
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(7, 7),
            scaleByDistance : scaleByDistance.clone(),
            pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.0, 1.5e4, 1.0),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e5),
        }
    });
    _this.boundDataSource.entities.add({
        position: origin_5KM,
        label: {
            text: '5KM',
            font: font,
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(7, 7),
            scaleByDistance : scaleByDistance.clone(),
            pixelOffset : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e4, 1.0),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e5),
        }
    });

    _this.viewer.dataSources.add(_this.boundDataSource);
};

//建筑瓦片
gis.loadBuildingTile = function() {
    var _this = this;
    if(_this.buildingTileset){
        _this.viewer.scene.primitives.remove(_this.buildingTileset);
    }
    var building_3dtile_url = GIS_BUSI_CONFIG[_this.building_id].building_3dtile_url;
    if(building_3dtile_url){
        _this.buildingTileset = _this.app.loadTileset(building_3dtile_url, _this.show.building);
    }
};

//路网
gis.loadRoadnet = function() {
    var _this = this;
    if(!_this.roadnetManager) {
        _this.roadnetManager = new LineNetManager(_this.viewer, {show: _this.show.roadnet, color: "#f67b02", width: 10.0, distanceDisplayCondition: {near: 0, far: 1.5e3}});
    }
    var roadnet_geojson_url = GIS_BUSI_CONFIG[_this.building_id].roadnet_geojson_url;
    _this.roadnetManager.show = _this.show.roadnet; 
    if(roadnet_geojson_url){
        _this.app.loadGeoJson(roadnet_geojson_url,(dataSource) => {
            _this.roadnetManager.loadToEntity(dataSource);
            // _this.roadnetManager.loadToGroundPrimitive(dataSource);
            // _this.roadnetManager.loadToPrimitive(dataSource);
        });
    }
};

//加载栅格
gis.loadGrid = function() {
    var _this = this;
    _this.closeSelectGrid();
    if(_this.grid.geoPrimitive) {
        _this.viewer.scene.primitives.remove(_this.grid.geoPrimitive);
    }
    _this.grid.data = [];
    if(_this.isLoading.grid) return;
    _this.isLoading.grid = true;

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
                var polygonInstances = [];
                var extrudedHeight = _this.grid.extrudedHeight;
                var distanceDisplayCondition =  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute (0, 1.5e5);
                _this.grid.data.forEach(properties => {
                    var conf = _this.getGeoGridColorConfig(properties.colour_level);
                    var color = Cesium.Color.fromCssColorString(conf.color).withAlpha(0.2);
                    var boundary = [
                        properties.tile14_left_bottom_lon, properties.tile14_left_bottom_lat,
                        properties.tile14_left_bottom_lon, properties.tile14_right_top_lat,
                        properties.tile14_right_top_lon, properties.tile14_right_top_lat,
                        properties.tile14_right_top_lon, properties.tile14_left_bottom_lat
                    ];
                    var positions = Cesium.Cartesian3.fromDegreesArray(boundary)
                    var polygon = new Cesium.PolygonGeometry({
                        height: 0,
                        extrudedHeight: extrudedHeight,
                        polygonHierarchy : new Cesium.PolygonHierarchy(positions)
                    });
                    var geometry = Cesium.PolygonGeometry.createGeometry(polygon);
                    var Instance = new Cesium.GeometryInstance({
                        geometry: geometry,
                        modelMatrix: Cesium.Matrix4.IDENTITY,
                        attributes: {
                            // distanceDisplayCondition:  distanceDisplayCondition,
                            color : Cesium.ColorGeometryInstanceAttribute.fromColor(color)
                        },
                    });
                    polygonInstances.push(Instance);
                });
                var vs = `
                attribute vec3 position3DHigh;
                attribute vec3 position3DLow;
                attribute vec3 position;
                attribute vec4 color;
                varying vec4 v_color;
                varying vec3 v_positionMC;
                attribute float batchId;
                void main()
                {
                    vec4 p = czm_computePosition();
                    v_color =color;
                    v_positionMC = position;
                    p = czm_modelViewProjectionRelativeToEye * p;
                    gl_Position = p;
                }
                `;
                var fs = `
                varying vec4 v_color;
                varying vec3 v_positionMC;
                precision mediump float;
                void main()
                {
                    // float time = fract(czm_frameNumber / 60.0);
                    // gl_FragColor = v_color*max(time, 1.0-time);
                    gl_FragColor = v_color;
                }
                `;
                var appearance = new Cesium.EllipsoidSurfaceAppearance({
                // var appearance = new Cesium.MaterialAppearance({
                    material : Cesium.Material.fromType('Color'),
                    renderState: {
                        blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,  
                        depthTest: {
                            enabled: true,
                            func: Cesium.DepthFunction.LESS_OR_EQUAL
                        },
                    },
                    fragmentShaderSource: fs,
                    vertexShaderSource: vs,
                    closed: true,
                    translucent: true,
                    faceForward: true,//当有光照的的时候，当视图正对它的时候反转法向量，避免墙体的背面是黑色的
                    flat: true,//true,纯色着色，不考虑光照效果。
                });

                _this.grid.geoPrimitive = new Cesium.Primitive({
                    geometryInstances: polygonInstances,
                    appearance: appearance,
                    asynchronous: false,
                    show: _this.show.grid
                });
                _this.viewer.scene.primitives.add(_this.grid.geoPrimitive);
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
                color: _this.getGeoGridColorConfig(el.colour_level).color,
            });
        }
    });
    
    _this.grid.legend = [];
    itemsMap.forEach(el => {
        _this.grid.legend.push(el);
    });
    _this.grid.legend.sort((a, b) => {return a.level - b.level});
    _this.loadLegendControl();
}

//根据经纬度选中栅格
gis.selectGridByLonLat = function(lon, lat) {
    var _this = this;
    _this.closeSelectGrid();

    _this.grid.data.forEach(properties => {
        var minLon = Math.min(properties.tile14_left_bottom_lon,properties.tile14_right_top_lon);
        var maxLon = Math.max(properties.tile14_left_bottom_lon,properties.tile14_right_top_lon);
        var minLat = Math.min(properties.tile14_left_bottom_lat,properties.tile14_right_top_lat);
        var maxLat = Math.max(properties.tile14_left_bottom_lat,properties.tile14_right_top_lat);
        if(lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat){
            var boundary = [
                properties.tile14_left_bottom_lon, properties.tile14_left_bottom_lat,
                properties.tile14_left_bottom_lon, properties.tile14_right_top_lat,
                properties.tile14_right_top_lon, properties.tile14_right_top_lat,
                properties.tile14_right_top_lon, properties.tile14_left_bottom_lat
            ];

            var height = _this.grid.extrudedHeight + properties.tile14_user_cnt;
            var heightProperty = new Cesium.SampledProperty(Number);
            heightProperty.addSample(_this.viewer.clock.currentTime,  0);
            heightProperty.addSample(Cesium.JulianDate.addSeconds(_this.viewer.clock.currentTime, 1, new Cesium.JulianDate()),  height);
            heightProperty.addSample(Cesium.JulianDate.addDays(_this.viewer.clock.currentTime, 1, new Cesium.JulianDate()),  height);
            var conf = _this.getGeoGridColorConfig(properties.colour_level);
            _this.grid.selectGrid = _this.viewer.entities.add({
                polygon: {
                    extrudedHeight: heightProperty,
                    material: Cesium.Color.fromCssColorString(conf.color),
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(boundary)
                }
            });

            var staticElement = document.createElement("div");
            staticElement.className = "common";
            var html = "<div><span class=\"label\">综合体名称：</span><span class=\"value\">"+properties.commercial_complex_name+"</span><span class=\"label1\"></div>";
            html += "<div><span class=\"label\">14级栅格ID：</span><span class=\"value\">"+properties.tile14_id+"</span><span class=\"label1\"></span></div>";
            html += "<div><span class=\"label\">栅格到访人数：</span><span class=\"value\">"+properties.tile14_user_cnt+"</span><span class=\"label1\"></span></div>";
            html += "<div><span class=\"label\">居住地人数：</span><span class=\"value\">"+properties.live_user_cnt+"</span><span class=\"label1\"></div>";
            staticElement.innerHTML = html;
            var contentDom = document.createElement("div");
            contentDom.appendChild(staticElement);

            var position = new Cesium.Cartesian3.fromDegrees(properties.tile14_lon, properties.tile14_lat, height);
            _this.grid.dialog = _this.app.addBaseInfoWindow(position, properties.name, contentDom, function() {
                _this.closeSelectGrid();
            });
            return;
        }
    });
};

//关闭选中栅格
gis.closeSelectGrid = function (){
    if(this.grid.selectGrid){
        this.viewer.entities.remove(this.grid.selectGrid);
        this.grid.selectGrid = undefined;
    }

    if(this.grid.dialog) {
        this.grid.dialog.destory();
        this.grid.dialog = undefined;
    }
};

//栅格
gis.loadGridLayer = function() {
    var _this = this;
    var styles = 'yc_surrounding_user_cnt_grid';
    var properties = {
        start_hour_no: _this.start_hour_no,
        end_hour_no: _this.end_hour_no,
        searchField: _this.searchField, 
        building_id: _this.building_id,
        gridSearchPolygonWkt: _this.gridSearchPolygonWkt
    };

    if(_this.isLoading.grid) return;
    _this.isLoading.grid = true;

    if(_this.gridWMSLayer){
        _this.gridWMSLayer.load(styles, properties, _this.show.grid);
        _this.isLoading.grid = false;
        return;
    }

    _this.gridWMSLayer = new WMSLayerManager(_this.viewer, {
        show: _this.show.grid,
        url: _this.url_geoserver,
        layers: 'postgres:dm_commercial_complex_user_h_grid',
        styles: styles,
        properties: properties,
        sql_expression: function() {
            //DWITHIN(geom_core,Point(-90 40),1,kilometers)
            //WITHIN(the_geom, POLYGON((-90 40, -90 45, -60 45, -60 40, -90 40)))
            var sql = ' 1=1 '
            if(this.properties && this.properties.building_id && this.properties.building_id != '') {
                sql+= ' and commercial_complex_id='+this.properties.building_id; 
            }
            // if(this.properties && this.properties.start_hour_no && this.properties.start_hour_no != '') {
            //     sql+= ' and hour_no>='+this.properties.start_hour_no; 
            // }
            if(this.properties && this.properties.end_hour_no  && this.properties.end_hour_no != '') {
                sql+= ' and hour_no='+this.properties.end_hour_no; 
            }
            if(this.properties && this.properties.searchField  && this.properties.searchField != ''){
                sql+= ' and '+this.properties.searchField+'>0'; 
            }
            if(this.properties.gridSearchPolygonWkt){
                sql+= ' and '+ "WITHIN(geom_point, "+this.properties.gridSearchPolygonWkt+") ";
            }
            return sql;
        },
        onDBClick: function(features){
            var properties = features[0].properties;
            _this.isShowGridEcharts = true;
            var boundary = [
                properties.tile14_left_bottom_lon, properties.tile14_left_bottom_lat,
                properties.tile14_left_bottom_lon, properties.tile14_right_top_lat,
                properties.tile14_right_top_lon, properties.tile14_right_top_lat,
                properties.tile14_right_top_lon, properties.tile14_left_bottom_lat
            ];

            var heightProperty = new Cesium.SampledProperty(Number);
            heightProperty.addSample(_this.viewer.clock.currentTime,  0);
            heightProperty.addSample(Cesium.JulianDate.addSeconds(_this.viewer.clock.currentTime, 1, new Cesium.JulianDate()),  properties.tile14_user_cnt);
            heightProperty.addSample(Cesium.JulianDate.addDays(_this.viewer.clock.currentTime, 1, new Cesium.JulianDate()),  properties.tile14_user_cnt);
            if(_this.selectGrid){
                _this.viewer.entities.remove(_this.selectGrid);
                _this.selectGrid = undefined;
            }
            var conf = _this.getGridColorConfig(properties.tile14_user_cnt);
            _this.selectGrid = _this.viewer.entities.add({
                polygon: {
                    extrudedHeight: heightProperty,
                    material: Cesium.Color.fromCssColorString(conf.color),
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(boundary)
                }
            });

            if(_this.gridTipWindow && _this.gridTipWindow.destory){
                _this.gridTipWindow.destory();
                _this.gridTipWindow = undefined;
            }
            var position = new Cesium.Cartesian3.fromDegrees(properties.tile14_lon, properties.tile14_lat, properties.tile14_user_cnt);
            _this.gridTipWindow = _this.app.addTipInfoWindow(position, '合计 '+properties.tile14_user_cnt+' 人');
        }
    });
    _this.gridWMSLayer.gridEchartsRestore = function(){
        if(_this.gridTipWindow && _this.gridTipWindow.destory){
            _this.gridTipWindow.destory();
            _this.gridTipWindow = undefined;
        }
        if(_this.selectGrid){
            _this.viewer.entities.remove(_this.selectGrid);
            _this.selectGrid = undefined;
        }
        if(_this.isShowGridEcharts){
            wisdomManage.backData();
            _this.isShowGridEcharts = false;
        }
    };
    _this.isLoading.grid = false;
};

//客户流入数据
gis.loadUserFlowIn = function() {
    var  _this = this;
    if(_this.parabolaIntoArr){
        _this.parabolaIntoArr.forEach(line=>{
            line.clear();
        });
    }
    _this.parabolaIntoArr = [];

    if(_this.isLoading.odLineIn) return;
    _this.isLoading.odLineIn = true;
    var center = GIS_BUSI_CONFIG[_this.building_id].center;
    var orientation = [center[0], center[1], 150];
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
            // data  = [
            //     {"id":1111027375847,"name":"蓝枫国际","longitude":116.458850040911,"latitude":39.887598957276,"area_user_cnt":108,"all_cnt":2465,"area_rate":0.0438},
            //     {"id":1111027379107,"name":"龙泽苑","longitude":116.461731172802,"latitude":39.8907119345977,"area_user_cnt":107,"all_cnt":2465,"area_rate":0.0434},
            //     {"id":1111027374187,"name":"季景沁园","longitude":116.456651606664,"latitude":39.8843836084317,"area_user_cnt":101,"all_cnt":2465,"area_rate":0.0410},
            //     {"id":1120034110445917,"name":"香槟小镇","longitude":116.463252679391,"latitude":39.8887469010333,"area_user_cnt":100,"all_cnt":2465,"area_rate":0.0406},
            //     {"id":1111027374683,"name":"碧水云天","longitude":116.448123169697,"latitude":39.8918357212965,"area_user_cnt":78,"all_cnt":2465,"area_rate":0.0316},
            //     {"id":1111027377236,"name":"万年花城","longitude":116.464462684133,"latitude":39.8930819622992,"area_user_cnt":77,"all_cnt":2465,"area_rate":0.0312},
            //     {"id":1111027375333,"name":"万和世家","longitude":116.459073224851,"latitude":39.8863080807251,"area_user_cnt":76,"all_cnt":2465,"area_rate":0.0308},
            //     {"id":1111027374272,"name":"万国城","longitude":116.452698690613,"latitude":39.8946771397612,"area_user_cnt":76,"all_cnt":2465,"area_rate":0.0308},
            //     {"id":1111027382010,"name":"正源天下","longitude":116.452972746081,"latitude":39.8914520622554,"area_user_cnt":73,"all_cnt":2465,"area_rate":0.0296},
            //     {"id":1111027374274,"name":"华福锦园","longitude":116.450911529047,"latitude":39.8941580163342,"area_user_cnt":71,"all_cnt":2465,"area_rate":0.0288}];

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
            data.forEach((line, index)=>{
                var position = [line.longitude, line.latitude, 0];
                var parabola = _this.app.parabolaEquationByWGS84(position, orientation, 1000, 100, 0.8);
                var parabolaPositions = Cesium.Cartesian3.fromDegreesArrayHeights(parabola);
                var conf = _this.getODLineColorConfig(index);
                var trailLine = new TrailLinkLine(_this.viewer, 
                    {
                        positions: parabolaPositions, 
                        color: conf.color, 
                        text: line.name, 
                        width: conf.width, 
                        isOut: false, 
                        show: _this.show.odLine
                    });
                _this.parabolaIntoArr.push(trailLine);
            });
            _this.isLoading.odLineIn = false;
        },
        error: function() {
            _this.isLoading.odLineIn = false;
        }
    });
};

//客户流出数据
gis.loadUserFlowOut = function() {
    var  _this = this;
    if(_this.parabolaIntoArr){
        _this.parabolaIntoArr.forEach(line=>{
            line.clear();
        });
    }
    _this.parabolaIntoArr = [];
    if(_this.isLoading.odLineOut) return;
    _this.isLoading.odLineOut = true;
    var center = GIS_BUSI_CONFIG[_this.building_id].center;
    var orientation = [center[0], center[1], 150];
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
            if(data && data.length > 0){
                data.sort(function(a, b){
                    return a.all_user_cnt - b.all_user_cnt;
                });
                data.forEach((line, index)=>{
                    var position = [line.longitude, line.latitude, 0];
                    var parabola = _this.app.parabolaEquationByWGS84(orientation, position, 1000, 100, 0.2);
                    var parabolaPositions = Cesium.Cartesian3.fromDegreesArrayHeights(parabola);
                    var conf = _this.getODLineColorConfig(index);
                    var trailLine = new TrailLinkLine(_this.viewer, {positions: parabolaPositions, color: conf.color, text: line.name, width: conf.width, isOut: true, show: _this.show.odLine});
                    _this.parabolaIntoArr.push(trailLine);
                });
                _this.isLoading.odLineOut = false;
            }
        },
        error: function() {
            _this.isLoading.odLineOut = false;
        }
    });
};

//客户热力图
gis.loadHeatMap = function() {
    var  _this = this;
    if(_this.heatmap){
        _this.heatmap.destory();
    }

    if(_this.isLoading.heatmap) return;
    _this.isLoading.heatmap = true;
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
            var tempData = [];
            var weight = 100;//影响系数
            /**
             * tile14_lon
             * tile14_lat
             * live_user_cnt
             */
            data.forEach(line=>{
                tempData.push([line.tile14_lon, line.tile14_lat, line.live_user_cnt]);
                if(line.live_user_cnt > weight){
                    weight = line.live_user_cnt;
                }
            });
            _this.heatmap = new CesiumHeatmapGL(_this.viewer, tempData, weight, _this.show.heatmap);
            _this.isLoading.heatmap = false;
        },
        error: function() {
            _this.isLoading.heatmap = false;
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
            coordinates.forEach((value, i) => {coordinates[i] = value.join(" ")});
            coordinates = coordinates.join(",");
            var cql_polygon = 'POLYGON((';
            cql_polygon += coordinates;
            cql_polygon += '))';
            _this.gridSearchPolygonWkt = cql_polygon;
            _this.loadGrid();
        }
    };
    _this.searchControl = new SearchControl(_this.viewer, options);
};

//资源管理器
gis.mapSources = [
    {
        name: "室内建筑",
        show: gis.show.indoor,
        disabled: false,
        isFirst: true,
        onClick: function(checked){
            gis.show.indoor = checked;
            if(gis.baseBuilding.model) {
                gis.baseBuilding.model.show = !checked;
            }

            if(gis.baseBuilding.indoor) {
                gis.baseBuilding.indoor.show = checked;
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
            if(gis.buildingTileset) {
                gis.buildingTileset.show = checked;
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
            if(gis.roadnetManager) {
                gis.roadnetManager.show = checked;
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
            if(gis.boundDataSource){
                gis.boundDataSource.show = checked;
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
            if(gis.heatmap) {
                gis.heatmap.show = checked;
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
            gis.isShowTrailLine = checked;
            gis.parabolaIntoArr.forEach((trailLine) => {
                trailLine.show = checked;
            });
            gis.parabolaOutArr.forEach((trailLine) => {
                trailLine.show = checked;
            });
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
            if(gis.grid && gis.grid.geoPrimitive) {
                gis.grid.geoPrimitive.show = checked;
            }
            if(gis.gridWMSLayer) {
                gis.gridWMSLayer.show = checked;
            }
            if(gis.searchControl) {
                gis.searchControl.show = checked;
            }
            gis.loadLegendControl();
        }
    },
];
gis.loadSourceControl = function() {
    var _this = this;
    _this.app.loadSourceManager(_this.mapSources);
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
    _this.app.loadLegendManager(_this.legendSources);
}

//事件
gis.bindEvent = function(){
    var _this = this;
    _this.event = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
    //触发鼠标左键点击事件
    _this.event.setInputAction(function(evt){
        if(_this.baseWindow && _this.baseWindow.destory){
            _this.baseWindow.destory();
            _this.baseWindow = undefined;
        }

        var pixel = evt.position;
        console.log(_this.app.pixelToWGS84(pixel).join(", "));

        if(_this.searchControl){
            _this.searchControl.mouseClick(_this.app.pixelToWorld3D(pixel), _this.app.pixelToWGS84(pixel));
        }

        var pickedFeature = _this.viewer.scene.pick(pixel);
        if(!Cesium.defined(pickedFeature)) {
            if(_this.gridWMSLayer && _this.gridWMSLayer.onClick){
                _this.gridWMSLayer.pickFeaturesByPixel(pixel, _this.gridWMSLayer.onClick);
            }

            return;
        };
        //乐成弹窗
        if(pickedFeature.id && pickedFeature.id.model && pickedFeature.id.name){
            // baseWindow = app.addBaseInfoWindow(app.pixelToWorld3D(pixel), "信息提示", pickedFeature.id.name);
            // var html = '<image src="'+pickedFeature.id.properties.billboardUrl.getValue()+'" width=300/>';
            var html = '<p>'+pickedFeature.id.properties.desc.getValue()+'</p>';
            _this.baseWindow = _this.app.addBaseInfoWindow(pickedFeature.id.position.getValue(), pickedFeature.id.name, html);
            // _this.gridWMSLayer.gridEchartsRestore();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //触发鼠标左键双击击事件
    _this.event.setInputAction(function(evt){
        var pixel = evt.position;

        if(_this.searchControl){
            _this.searchControl.mouseDBClick(_this.app.pixelToWorld3D(pixel), _this.app.pixelToWGS84(pixel));
        }

        var pickedFeature = _this.viewer.scene.pick(pixel);
        if(!Cesium.defined(pickedFeature)) {
            if(_this.gridWMSLayer && _this.gridWMSLayer.onDBClick){
                _this.gridWMSLayer.pickFeaturesByPixel(pixel, _this.gridWMSLayer.onDBClick);
            }
            return;
        } else {
            if(pickedFeature.primitive && pickedFeature.primitive == _this.grid.geoPrimitive){
                var coordinates =_this.app.pixelToWGS84(pixel);
                _this.selectGridByLonLat(coordinates[0], coordinates[1]);
            }
        };
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    //触发鼠标右键点击事件
    // _this.event.setInputAction(function(evt){
    //     _this.gridWMSLayer.gridEchartsRestore();
    // }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    //触发鼠标移动事件
    _this.event.setInputAction(function(evt){
        if(_this.tipWindow && _this.tipWindow.destory){
            _this.tipWindow.destory();
            _this.tipWindow = undefined;
        }

        var pixel = evt.endPosition;
        if(_this.searchControl){
            _this.searchControl.mouseMove(_this.app.pixelToWorld3D(pixel), _this.app.pixelToWGS84(pixel));
        }

        var pickedFeature = _this.viewer.scene.pick(pixel);
        if(!Cesium.defined(pickedFeature)) return;

        //楼宇
        // if(pickedFeature instanceof  Cesium.Cesium3DTileFeature){
        //     var height = pickedFeature.getProperty("height");
        //     var longitude = pickedFeature.getProperty("longitude");
        //     var latitude = pickedFeature.getProperty("latitude");
        //     var position = Cesium.Cartesian3.fromDegrees(longitude,latitude,height);
        //     tipWindow = _this.app.addTipInfoWindow(position, "高"+height+"米");
        // }

        //街道
        if(pickedFeature.id && pickedFeature.id.polyline && pickedFeature.id.name){
            _this.tipWindow = _this.app.addTipInfoWindow(_this.app.pixelToWorld3D(pixel), pickedFeature.id.name);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

// //加载地图
// $(function(){
//     gis.init(2020042717);
// });
