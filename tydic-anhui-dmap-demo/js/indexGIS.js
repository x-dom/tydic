/**
 * 初始化界面
 */
$(function () {
    //初始化地图
    initMap();
});

/**
 * 初始化地图
 */
function initMap(){
    self.map = new dmap.DMap({
        only2D: false,
        currentStatus: '3d',
        projection: "EPSG:3857",
        center:[13155922, 3476336],
        zoom: 15,
        maxZoom: 20,
        controlbarOptions: {
            home: {
                on2D: true,
                on3D: true,
                center: [13155922, 3476336],
                projection: "EPSG:3857",
                zoom: 15,
            },
        }
    });

    self.map.on("click",function(evt){
        // addTipWindow(evt.coordinate[0], evt.coordinate[1], "测试提示框");
        if(evt.features.length == 0){
            if(self.layer.buildingLayer){
                self.layer.buildingLayer.setData([]);
            }

            if(self.layer.floorLayer){
                self.layer.floorLayer.setData([]);
            }

            if(self.layer.cellLineLayer){
                self.layer.cellLineLayer.setData([]);
            }

            if(self.layer.cellTextLayer){
                self.layer.cellTextLayer.setData([]);
            }

            if(self.layer.gridLayer){
                self.layer.gridLayer.setData([]);
            }

            if(self.infoWindow && self.infoWindow.floorWindow){
                self.map.removeOverlay(self.infoWindow.floorWindow);
            }
        }
    });


    //网格单元图层
    loadGridunitLayer();

    //添加扇区
    loadSectorLayer();
}

/**
 * 添加扇区图层
 */
function loadSectorLayer() {
    self.layer = self.layer||{};

    if(self.layer.sectorLayer){
        self.layer.sectorLayer.clear();
        self.map.removeLayer(self.layer.sectorLayer);
        self.layer.sectorLayer = undefined;
    }

    //数据
    var data = [];
    for (var i = 0; i < self.data.cfg_cell.length; i++) {
        var geometry = dmap.utils.geom.parseGeometryByWkt(self.data.cfg_cell[i].wkt);
        geometry.coordinates[2] = 20;
        var feature = new dmap.feature.DFeature({geometry: geometry, properties: self.data.cfg_cell[i]});
        data.push(feature);
    }

    var defaultItem = {
        filter: "1==1",
        sector: {
            show: true,
            height: 0,
            angle: "angle",
            sAngle: 30,
            radius: 200,
            fill: {
                color: {
                    value: "#00FF00",
                    opacity: 0.5
                }
            },
            stroke:{
                color:
                    {
                        value: "#00FF00",
                        opacity: 1
                    },
                width: 1,
                lineDash:[2,2]
            }
        },
    };

    //样式
    var style = {};
    style.type = "point";
    style.items = [];
    style.items[0]= JSON.parse(JSON.stringify(defaultItem));
    style.items[0].filter = "data['cell_type'] == '室分信源站扇区'";
    style.items[0].sector.radius = 50;
    style.items[0].sector.sAngle = 360;
    style.items[1]= JSON.parse(JSON.stringify(defaultItem));
    style.items[1].filter = "data['cell_type'] == '室外宏基站扇区' && data['freq_band'] == 1";//2.1G
    style.items[1].sector.radius = 120;
    style.items[1].sector.sAngle = 45;
    style.items[2]= JSON.parse(JSON.stringify(defaultItem));
    style.items[2].filter = "data['cell_type'] == '室外宏基站扇区' && data['freq_band'] == 3";//1.8G
    style.items[2].sector.radius = 160;
    style.items[2].sector.sAngle = 35;
    style.items[3]= JSON.parse(JSON.stringify(defaultItem));
    style.items[3].filter = "data['cell_type'] == '室外宏基站扇区' && data['freq_band'] == 5";//800M
    style.items[3].sector.radius = 200;
    style.items[3].sector.sAngle = 25;

    self.layer.sectorLayer = new dmap.layer.DVectorLayer({
        name: "扇区图层",
        data: data,
        style: style,
        only2D: false,
        index: 5
    });
    self.map.addLayer(self.layer.sectorLayer);

    self.layer.sectorLayer.on("click",function (evt) {
        var cellId = evt.features[0].properties.cell_id;
        var enbId = evt.features[0].properties.enb_id;
        loadCellGridLayer(cellId, enbId);
    });
}

/**
 * 添加扇区栅格
 */
function loadCellGridLayer(cellId, enbId){
    var grids = self.data.dm_cell_grid;
    var  relation = self.data.mid_gridunit_grid_rsrp;

    var grids = [];
    for (let i = 0; i < self.data.dm_cell_grid.length; i++) {


        if(self.data.dm_cell_grid[i].cell_id == cellId && self.data.dm_cell_grid[i].enb_id == enbId){
            for (let j = 0; j < self.data.mid_gridunit_grid_rsrp.length; j++) {
                if(self.data.dm_cell_grid[i].grid_id == self.data.mid_gridunit_grid_rsrp[j].grid_id){
                    grids.push($.extend({}, self.data.dm_cell_grid[i], self.data.mid_gridunit_grid_rsrp[j]));
                    continue;
                }
            }
        }
    }

    //数据
    var data = [];
    for (var i = 0; i < grids.length; i++) {
        var geometry = dmap.utils.geom.parseGeometryByWkt(grids[i].grid_wkt);
        var feature = new dmap.feature.DFeature({geometry: geometry, properties: grids[i]});
        data.push(feature);
    }

    //样式
    var defaultItem = {
        filter: "1==1",
        polygon: {
            show: true,
            height: 0,
            extrudedHeight: 0,
            fill: {
                color: {
                    value: "#ff0000",
                    opacity: 0.5
                }
            },
            stroke:{
                color:
                    {
                        value: "#ff0000",
                        opacity: 0.5
                    },
                width: 0,
                lineDash:[2,2]
            }
        },
    };

    //样式
    var style = {};
    style.type = "polygon";
    style.items = [];
    style.items[0]= JSON.parse(JSON.stringify(defaultItem));
    style.items[0].filter = "data['grid_rsrp'] < -110";
    style.items[0].polygon.fill.color.value = "#ff0000";
    style.items[0].polygon.stroke.color.value = "#ff0000";
    style.items[1]= JSON.parse(JSON.stringify(defaultItem));
    style.items[1].filter = "data['grid_rsrp'] >= -110 && data['grid_rsrp'] < -105";
    style.items[1].polygon.fill.color.value = "#ff9600";
    style.items[1].polygon.stroke.color.value = "#ff9600";
    style.items[2]= JSON.parse(JSON.stringify(defaultItem));
    style.items[2].filter = "data['grid_rsrp'] >= -105 && data['grid_rsrp'] < -100";
    style.items[2].polygon.fill.color.value = "#ffff00";
    style.items[2].polygon.stroke.color.value = "#ffff00";
    style.items[3]= JSON.parse(JSON.stringify(defaultItem));
    style.items[3].filter = "data['grid_rsrp'] >= -100 && data['grid_rsrp'] < -95";
    style.items[3].polygon.fill.color.value = "#7bd7ff";
    style.items[3].polygon.stroke.color.value = "#7bd7ff";
    style.items[4]= JSON.parse(JSON.stringify(defaultItem));
    style.items[4].filter = "data['grid_rsrp'] >= -95 && data['grid_rsrp'] < -90";
    style.items[4].polygon.fill.color.value = "#00aeff";
    style.items[4].polygon.stroke.color.value = "#00aeff";
    style.items[5]= JSON.parse(JSON.stringify(defaultItem));
    style.items[5].filter = "data['grid_rsrp'] >= -90 && data['grid_rsrp'] < -85";
    style.items[5].polygon.fill.color.value = "#428aff";
    style.items[5].polygon.stroke.color.value = "#428aff";
    style.items[6]= JSON.parse(JSON.stringify(defaultItem));
    style.items[6].filter = "data['grid_rsrp'] >= -85 && data['grid_rsrp'] < -80";
    style.items[6].polygon.fill.color.value = "#0059ff";
    style.items[6].polygon.stroke.color.value = "#0059ff";
    style.items[7]= JSON.parse(JSON.stringify(defaultItem));
    style.items[7].filter = "data['grid_rsrp'] >= -80";
    style.items[7].polygon.fill.color.value = "#0000ff";
    style.items[7].polygon.stroke.color.value = "#0000ff";


    self.layer = self.layer||{};

    if(self.layer.gridLayer){
        self.layer.gridLayer.clear();
        self.map.removeLayer(self.layer.gridLayer);
        self.layer.gridLayer = undefined;
    }

    self.layer.gridLayer = new dmap.layer.DVectorLayer({
        name: "栅格图层",
        data: data,
        style: style,
        only2D: false,
    });
    self.map.addLayer(self.layer.gridLayer);

    //数据
    var data2 = [];
    for (var i = 0; i < grids.length; i++) {
        var gridPolygon = dmap.utils.geom.parseGeometryByWkt(grids[i].grid_wkt);
        var start = gridPolygon.getCenter();
        start[2] = 0;
        var radius,sAngle;
        if(grids[i]['cell_type'] == '室分信源站扇区'){//室内
            radius = 50;
            sAngle = 120;
        } else if(grids[i]['cell_type'] == '室外宏基站扇区' && grids[i]['freq_band'] == 1){//2.1G
            radius = 120;
            sAngle = 45;
        } else if(grids[i]['cell_type'] == '室外宏基站扇区' && grids[i]['freq_band'] == 3){//1.8G
            radius = 160;
            sAngle = 35;
        } else if(grids[i]['cell_type'] == '室外宏基站扇区' && grids[i]['freq_band'] == 5){//800M
            radius = 200;
            sAngle = 25;
        }

        var sectorPolygon = dmap.utils.geom.parseGeometryByWkt(grids[i].cell_wkt);
        var center = sectorPolygon.getCenter();
        var end = dmap.utils.geom.getSectorCenterByXY(center[0], center[1], radius, sAngle, grids[i].angle, "EPSG:4326");
        var coordinates = dmap.utils.geom.parabolaEquation(start, end, 100, 32);
        var line = new dmap.geom.DLineString({coordinates: coordinates, projection: "EPSG:4326"});
        var feature = new dmap.feature.DFeature({geometry: line, properties: grids[i]});
        data2.push(feature);
    }

    // adCellLineLayer(data2);
}

/**
 * 添加网格单元图层
 */
function loadGridunitLayer() {
    self.layer = self.layer||{};

    if(self.layer.gridunitLayer){
        self.layer.gridunitLayer.clear();
        self.map.removeLayer(self.layer.gridunitLayer);
        self.layer.gridunitLayer = undefined;
    }

    //数据
    var data = [];
    for (var i = 0; i < self.data.dm_gridunit_rsrp.length; i++) {
        var geometry = dmap.utils.geom.parseGeometryByWkt(self.data.dm_gridunit_rsrp[i].wkt);
        var feature = new dmap.feature.DFeature({geometry: geometry, properties: self.data.dm_gridunit_rsrp[i]});
        data.push(feature);
    }

    var defaultItem = {
        filter: "1==1",
        polygon: {
            show: true,
            height: 0,
            extrudedHeight: 0,
            fill: {
                color: {
                    value: "#ff0000",
                    opacity: 0.5
                }
            },
            stroke:{
                color:
                    {
                        value: "#ff0000",
                        opacity: 1
                    },
                width: 1,
                lineDash:[2,2]
            }
        },
        text:{
            show: true,
            text: "gridunit_name",
            height: 0,
            maxZoom: 15,
            backgroundColor: {
                value: '#FFFFFF',
                opacity: 1
            },
            fill: {
                color:{
                        value: "#3a2dff",
                        opacity: 1
                }
            }
        }
    };

    //样式
    var style = {};
    style.type = "polygon";
    style.items = [];
    style.items[0]= JSON.parse(JSON.stringify(defaultItem));
    style.items[0].filter = "data['avg_rsrp'] < -110";
    style.items[0].polygon.fill.color.value = "#ff0000";
    style.items[0].polygon.stroke.color.value = "#ff0000";
    style.items[1]= JSON.parse(JSON.stringify(defaultItem));
    style.items[1].filter = "data['avg_rsrp'] >= -110 && data['avg_rsrp'] < -105";
    style.items[1].polygon.fill.color.value = "#ff9600";
    style.items[1].polygon.stroke.color.value = "#ff9600";
    style.items[2]= JSON.parse(JSON.stringify(defaultItem));
    style.items[2].filter = "data['avg_rsrp'] >= -105 && data['avg_rsrp'] < -100";
    style.items[2].polygon.fill.color.value = "#ffff00";
    style.items[2].polygon.stroke.color.value = "#ffff00";
    style.items[3]= JSON.parse(JSON.stringify(defaultItem));
    style.items[3].filter = "data['avg_rsrp'] >= -100 && data['avg_rsrp'] < -95";
    style.items[3].polygon.fill.color.value = "#7bd7ff";
    style.items[3].polygon.stroke.color.value = "#7bd7ff";
    style.items[4]= JSON.parse(JSON.stringify(defaultItem));
    style.items[4].filter = "data['avg_rsrp'] >= -95 && data['avg_rsrp'] < -90";
    style.items[4].polygon.fill.color.value = "#00aeff";
    style.items[4].polygon.stroke.color.value = "#00aeff";
    style.items[5]= JSON.parse(JSON.stringify(defaultItem));
    style.items[5].filter = "data['avg_rsrp'] >= -90 && data['avg_rsrp'] < -85";
    style.items[5].polygon.fill.color.value = "#428aff";
    style.items[5].polygon.stroke.color.value = "#428aff";
    style.items[6]= JSON.parse(JSON.stringify(defaultItem));
    style.items[6].filter = "data['avg_rsrp'] >= -85 && data['avg_rsrp'] < -80";
    style.items[6].polygon.fill.color.value = "#0059ff";
    style.items[6].polygon.stroke.color.value = "#0059ff";
    style.items[7]= JSON.parse(JSON.stringify(defaultItem));
    style.items[7].filter = "data['avg_rsrp'] >= -80";
    style.items[7].polygon.fill.color.value = "#0000ff";
    style.items[7].polygon.stroke.color.value = "#0000ff";

    //弹窗内容
    var params = ["district_name", "gridunit_name", "building_cnt", "avg_rsrp"];

    self.layer.gridunitLayer = new dmap.layer.DVectorLayer({
        name: "网格图层",
        data: data,
        style: style,
        only2D: false,
        // infoWindowOptions: {
        //     show: true,
        //     width: 300,
        //     styleType: "light",
        //     params: params
        // }
    });
    self.map.addLayer(self.layer.gridunitLayer);

    self.layer.gridunitLayer.on("click",function (evt) {
        var gridunit_id = evt.features[0].properties.gridunit_id;
        loadBuildingLayer(gridunit_id);
    });
}

/**
 * 根据网格Id加载网格楼宇信息
 * @param gridunit_id
 */
var floorHeight = 3;
var selectFeature;
function loadBuildingLayer(gridunit_id){
    //查询数据
    let buidlings = gridDemo.filterBuildingData(gridunit_id);

    self.layer = self.layer||{};
    selectFeature = undefined;
    if(self.layer.buildingLayer){
        self.layer.buildingLayer.setData([]);
    }

    if(self.layer.floorLayer){
        self.layer.floorLayer.setData([]);
    }

    if(self.layer.cellLineLayer){
        self.layer.cellLineLayer.setData([]);
    }

    if(self.layer.cellTextLayer){
        self.layer.cellTextLayer.setData([]);
    }

    if(self.layer.buildingLayer){
        self.layer.buildingLayer.clear();
        self.map.removeLayer(self.layer.buildingLayer);
        self.layer.buildingLayer = undefined;
    }

    //数据
    var data = [];
    for (var i = 0; i < buidlings.length; i++) {
        var buildingId = buidlings[i].building_id;
        let floors = gridDemo.filterFloorByBuildingId(buildingId);
        buidlings[i].buildingHeight = floors.length*floorHeight;

        var buildingWkt = buidlings[i].building_wkt;
        var geometry = dmap.utils.geom.parseGeometryByWkt(buildingWkt);
        var feature = new dmap.feature.DFeature({id: buildingId,geometry: geometry, properties: buidlings[i]});
        data.push(feature);
    }

    var defaultItem = {
        filter: "1==1",
        polygon: {
            show: true,
            height: 0,
            extrudedHeight: "buildingHeight",
            fill: {
                color: {
                    value: "#f9e5ff",
                    opacity: 0.8
                }
            },
            stroke:{
                color:
                    {
                        value: "#f9e5ff",
                        opacity: 1
                    },
                width: 1,
                lineDash:[0,0]
            }
        },
        text:{
            show: true,
            text: "building_name",
            height: 0,
            maxZoom: 16,
            backgroundColor: {
                value: '#FFFFFF',
                opacity: 1
            },
            fill: {
                color:{
                    value: "#0d0e0d",
                    opacity: 0.5
                }
            }
        }
    };

    //样式
    var style = {};
    style.type = "polygon";
    style.items = [];
    style.items[0]= JSON.parse(JSON.stringify(defaultItem));
    style.items[0].filter = "1==1";

    self.layer.buildingLayer = new dmap.layer.DVectorLayer({
        index: 10,
        name: "楼宇图层",
        data: data,
        style: style,
        only2D: false,
    });
    self.map.addLayer(self.layer.buildingLayer);

    self.layer.buildingLayer.viewAll();

    self.layer.buildingLayer.on("click",function (evt) {
        var params = evt.features[0].properties;
        loadFloorLayer(params);
    });
}

/**
 * 根据楼宇ID加载楼层信息
 * @param params
 */
function loadFloorLayer(params){
    var floorHeight = 3;

    var buildingId = params.building_id;
    var buildingWkt = params.building_wkt;

    //查询数据
    let floors = gridDemo.filterFloorByBuildingId(buildingId);

    self.layer = self.layer||{};


    if(self.layer.buildingLayer){
        if(selectFeature){
            self.layer.buildingLayer.addData(selectFeature);
        }
        self.layer.buildingLayer.removeData(buildingId);

        let floors = gridDemo.filterFloorByBuildingId(buildingId);
        params.buildingHeight = floors.length*floorHeight;

        var geometry = dmap.utils.geom.parseGeometryByWkt(params.building_wkt);
        selectFeature = new dmap.feature.DFeature({id: buildingId,geometry: geometry, properties: params});
    }


    if(self.layer.floorLayer){
        self.layer.floorLayer.clear();
        self.map.removeLayer(self.layer.floorLayer);
        self.layer.floorLayer = undefined;

        if(self.infoWindow && self.infoWindow.floorWindow){
            self.map.removeOverlay(self.infoWindow.floorWindow);
        }
    }

    //数据
    var data = [];
    for (var i = 0; i < floors.length; i++) {
        var geometry = dmap.utils.geom.parseGeometryByWkt(buildingWkt);
        floors[i].floorHeight = floorHeight*i;
        floors[i].floorExtrudedHeight = floorHeight*i+floorHeight;
        floors[i].building_wkt = buildingWkt;
        var feature = new dmap.feature.DFeature({geometry: geometry, properties: floors[i]});
        data.push(feature);
    }

    var defaultItem = {
        filter: "1==1",
        polygon: {
            show: true,
            height: "floorHeight",
            extrudedHeight: "floorExtrudedHeight",
            fill: {
                color: {
                    value: "#f9e5ff",
                    opacity: 1
                }
            },
            stroke:{
                color:
                    {
                        value: "#f9e5ff",
                        opacity: 1
                    },
                width: 1,
                lineDash:[0,0]
            }
        },
        // text:{
        //     show: true,
        //     text: "building_name",
        //     height: 0,
        //     fill: {
        //         color:{
        //             value: "#000000",
        //             opacity: 1
        //         }
        //     }
        // }
    };

    //样式
    var style = {};
    style.type = "polygon";
    style.items = [];
    style.items[0]= JSON.parse(JSON.stringify(defaultItem));
    style.items[0].filter = "data['avg_rsrp'] < -110";
    style.items[0].polygon.fill.color.value = "#ff0000";
    style.items[0].polygon.stroke.color.value = "#ff0000";
    style.items[1]= JSON.parse(JSON.stringify(defaultItem));
    style.items[1].filter = "data['avg_rsrp'] >= -110 && data['avg_rsrp'] < -105";
    style.items[1].polygon.fill.color.value = "#ff9600";
    style.items[1].polygon.stroke.color.value = "#ff9600";
    style.items[2]= JSON.parse(JSON.stringify(defaultItem));
    style.items[2].filter = "data['avg_rsrp'] >= -105 && data['avg_rsrp'] < -100";
    style.items[2].polygon.fill.color.value = "#ffff00";
    style.items[2].polygon.stroke.color.value = "#ffff00";
    style.items[3]= JSON.parse(JSON.stringify(defaultItem));
    style.items[3].filter = "data['avg_rsrp'] >= -100 && data['avg_rsrp'] < -95";
    style.items[3].polygon.fill.color.value = "#7bd7ff";
    style.items[3].polygon.stroke.color.value = "#7bd7ff";
    style.items[4]= JSON.parse(JSON.stringify(defaultItem));
    style.items[4].filter = "data['avg_rsrp'] >= -95 && data['avg_rsrp'] < -90";
    style.items[4].polygon.fill.color.value = "#00aeff";
    style.items[4].polygon.stroke.color.value = "#00aeff";
    style.items[5]= JSON.parse(JSON.stringify(defaultItem));
    style.items[5].filter = "data['avg_rsrp'] >= -90 && data['avg_rsrp'] < -85";
    style.items[5].polygon.fill.color.value = "#428aff";
    style.items[5].polygon.stroke.color.value = "#428aff";
    style.items[6]= JSON.parse(JSON.stringify(defaultItem));
    style.items[6].filter = "data['avg_rsrp'] >= -85 && data['avg_rsrp'] < -80";
    style.items[6].polygon.fill.color.value = "#0059ff";
    style.items[6].polygon.stroke.color.value = "#0059ff";
    style.items[7]= JSON.parse(JSON.stringify(defaultItem));
    style.items[7].filter = "data['avg_rsrp'] >= -80";
    style.items[7].polygon.fill.color.value = "#0000ff";
    style.items[7].polygon.stroke.color.value = "#0000ff";

    self.layer.floorLayer = new dmap.layer.DVectorLayer({
        index: 11,
        name: "楼层图层",
        data: data,
        style: style,
        only2D: false,
    });
    self.map.addLayer(self.layer.floorLayer);

    self.layer.floorLayer.on("pointermove",function (evt) {
        var floor_id = evt.features[0].properties.floor_id;
        addTipWindow(evt.coordinate[0], evt.coordinate[1], floor_id);
    });

    self.layer.floorLayer.on("click",function (evt) {
        var data =  evt.features[0].properties;
        data.coordinate =  evt.coordinate;
        addFloorWindow(data);

        addCellLineLayerOfBuildingId(buildingId, data.floorHeight);
    });

    addCellLineLayerOfBuildingId(buildingId, floors.length*floorHeight);
}

/**
 * 根据楼宇ID绘制小区连线
 */
function addCellLineLayerOfBuildingId(buildingId, height){
    //查询数据
    let sectors = gridDemo.filterSectorByBuildingId(buildingId);

    //数据
    var data = [];
    cellTextData = [];
    for (var i = 0; i < sectors.length; i++) {
        var building = dmap.utils.geom.parseGeometryByWkt(sectors[i].building_wkt);
        var start = building.getCenter();
        start[2] = height + 1.5;

        var radius,sAngle;
        var sector = sectors[i];
        if(sector['cell_type'] == '室分信源站扇区'){//室内
            radius = 50;
            sAngle = 120;
        } else if(sector['cell_type'] == '室外宏基站扇区' && sector['freq_band'] == 1){//2.1G
            radius = 120;
            sAngle = 45;
        } else if(sector['cell_type'] == '室外宏基站扇区' && sector['freq_band'] == 3){//1.8G
            radius = 160;
            sAngle = 35;
        } else if(sector['cell_type'] == '室外宏基站扇区' && sector['freq_band'] == 5){//800M
            radius = 200;
            sAngle = 25;
        }

        var sectorPolygon = dmap.utils.geom.parseGeometryByWkt(sector.cell_wkt);
        var center = sectorPolygon.getCenter();
        var end = dmap.utils.geom.getSectorCenterByXY(center[0], center[1], radius, sAngle, sector.angle, "EPSG:4326");
        var coordinates = dmap.utils.geom.parabolaEquation(start, end, 100, 32);
        var line = new dmap.geom.DLineString({coordinates: coordinates, projection: "EPSG:4326"});
        var feature = new dmap.feature.DFeature({geometry: line, properties: sectors[i]});
        data.push(feature);

        var cellPoint = new dmap.geom.DPoint({coordinates: end, projection: "EPSG:4326"});
        var cellFeature = new dmap.feature.DFeature({geometry: cellPoint, properties: sectors[i]});
        cellTextData.push(cellFeature);
    }

    addCellTextLayer(cellTextData);
    addCellLineLayer(data);
}

/**
 * 根据房间ID绘制小区连线
 */
function addCellLineLayerOfRoom(params){
    //查询数据
    let sectors = gridDemo.filterSectorByRoomId(params.building_id, 0);

    //数据
    var data = [];
    var cellTextData = [];
    var building = dmap.utils.geom.parseGeometryByWkt(params.building_wkt);
    var start = building.getCenter();
    start[2] = params.floorHeight;
    for (var i = 0; i < sectors.length; i++) {
        var radius,sAngle;
        var sector = sectors[i];
        if(sector['cell_type'] == '室分信源站扇区'){//室内
            radius = 50;
            sAngle = 120;
        } else if(sector['cell_type'] == '室外宏基站扇区' && sector['freq_band'] == 1){//2.1G
            radius = 120;
            sAngle = 45;
        } else if(sector['cell_type'] == '室外宏基站扇区' && sector['freq_band'] == 3){//1.8G
            radius = 160;
            sAngle = 35;
        } else if(sector['cell_type'] == '室外宏基站扇区' && sector['freq_band'] == 5){//800M
            radius = 200;
            sAngle = 25;
        }

        var sectorPolygon = dmap.utils.geom.parseGeometryByWkt(sector.cell_wkt);
        var center = sectorPolygon.getCenter();
        var end = dmap.utils.geom.getSectorCenterByXY(center[0], center[1], radius, sAngle, sector.angle, "EPSG:4326");
        var coordinates = dmap.utils.geom.parabolaEquation(start, end, 100, 32);
        var line = new dmap.geom.DLineString({coordinates: coordinates, projection: "EPSG:4326"});
        var feature = new dmap.feature.DFeature({geometry: line, properties: sectors[i]});
        data.push(feature);

        var cellPoint = new dmap.geom.DPoint({coordinates: end, projection: "EPSG:4326"});
        var cellFeature = new dmap.feature.DFeature({geometry: cellPoint, properties: sectors[i]});
        cellTextData.push(cellFeature);
    }

    addCellTextLayer(cellTextData);
    addCellLineLayer(data);
}

/**
 * 绘制小区连线
 */
function addCellTextLayer(data){
    self.layer = self.layer||{};

    if(self.layer.cellTextLayer){
        self.layer.cellTextLayer.clear();
        self.map.removeLayer(self.layer.cellTextLayer);
        self.layer.cellTextLayer = undefined;
    }

    var defaultItem = {
        filter: "1==1",
        text:{
            show: true,
            text: "cell_name",
            height: 0,
            maxZoom: 15,
            backgroundColor: {
                value: '#FFFFFF',
                opacity: 1
            },
            fill: {
                color:{
                    value: "#000000",
                    opacity: 1
                }
            }
        }
    };

    //样式
    var style = {};
    style.type = "point";
    style.items = [];
    style.items[0]= JSON.parse(JSON.stringify(defaultItem));
    style.items[0].filter = "1==1";

    self.layer.cellTextLayer = new dmap.layer.DVectorLayer({
        name: "扇区文字",
        data: data,
        style: style,
        only2D: false,
    });
    self.map.addLayer(self.layer.cellTextLayer);
}

/**
 * 绘制小区连线
 */
function addCellLineLayer(data){
    self.layer = self.layer||{};

    if(self.layer.cellLineLayer){
        self.layer.cellLineLayer.clear();
        self.map.removeLayer(self.layer.cellLineLayer);
        self.layer.cellLineLayer = undefined;
    }

    var defaultItem = {
        filter: "1==1",
        lineString: {
            color:
                {
                    value: "#3636e6",
                    opacity: 1
                },
            width: 1,
            lineDash:[2,2]
        },
        // text:{
        //     show: true,
        //     text: "building_name",
        //     height: 0,
        //     fill: {
        //         color:{
        //             value: "#000000",
        //             opacity: 1
        //         }
        //     }
        // }
    };

    //样式
    var style = {};
    style.type = "lineString";
    style.items = [];
    style.items[0]= JSON.parse(JSON.stringify(defaultItem));
    style.items[0].filter = "1==1";

    self.layer.cellLineLayer = new dmap.layer.DVectorLayer({
        name: "连线图层",
        data: data,
        style: style,
        only2D: false,
    });
    self.map.addLayer(self.layer.cellLineLayer);
}

/**
 * 添加提示信息框
 */
function addTipWindow(x, y, text){
    var content = document.createElement("div");
    content.innerText = "第" + text + "层";
    content.style.backgroundColor = "#FFFFFF";
    content.style.padding = "2px";

    self.infoWindow = self.infoWindow||{};

    if(self.infoWindow.tipWindow){
        map.removeOverlay(self.infoWindow.tipWindow);
        self.infoWindow.tipWindow = undefined;
    }
    self.infoWindow.tipWindow = new dmap.feature.DOverLay({
        content: content,
        position: [x,y],
        offsetX: 20,
        offsetY: 0
    });
    map.addOverlay(self.infoWindow.tipWindow);

    window.setTimeout(function () {
        if(self.infoWindow.tipWindow){
            map.removeOverlay(self.infoWindow.tipWindow);
            self.infoWindow.tipWindow = undefined;
        }
    }, 10000)
}
