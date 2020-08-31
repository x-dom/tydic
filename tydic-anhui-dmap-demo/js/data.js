self.data = {};
loadData();
/**
 * 加载地图数据
 */

function loadData(){
    // 1、网格纬度表格和网格GIS图层
    // dm_gridunit_rsrp
    $.ajax({
        async: false,
        url:"data/dm_gridunit_rsrp.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.dm_gridunit_rsrp = data.dm_gridunit_rsrp;
        }
    });


     // 2、点击网格下钻到楼宇纬度表格和楼宇图层
    // building
    $.ajax({
        async: false,
        url:"data/building.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.building = data.building;
        }
    });


    // 2、点击网格下钻到楼宇纬度表格和楼宇图层
    // dm_building_rsrp
    $.ajax({
        async: false,
        url:"data/dm_building_rsrp.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.dm_building_rsrp = data.dm_building_rsrp;
        }
    });

    // 3、点击楼宇和小区连线
    // dm_building_cell
    $.ajax({
        async: false,
        url:"data/dm_building_cell.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.dm_building_cell = data.dm_building_cell;
        }
    });

    // 4、GIS展示各个楼层的RSRP情况
    // dm_floor_rsrp
    $.ajax({
        async: false,
        url:"data/dm_floor_rsrp.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.dm_floor_rsrp = data.dm_floor_rsrp;
        }
    });

    // 5、点击楼层展示各个房间的情况
    // dm_room_rsrp
    $.ajax({
        async: false,
        url:"data/dm_room_rsrp.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.dm_room_rsrp = data.dm_room_rsrp;
        }
    });

    // 6、点击扇区展示扇区对应的覆盖栅格和小区的详细信息
    // dm_cell_grid
    $.ajax({
        async: false,
        url:"data/dm_cell_grid.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.dm_cell_grid = data.dm_cell_grid;
        }
    });

    // 7、扇区表
    // dm_cell_grid
    $.ajax({
        async: false,
        url:"data/cfg_cell.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.cfg_cell = data.cfg_cell;
        }
    });

     // 楼层
    // building_floor
    $.ajax({
        async: false,
        url:"data/building_floor.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.building_floor = data.building_floor;
        }
    });

    // 网格栅格
    $.ajax({
        async: false,
        url:"data/mid_gridunit_grid_rsrp.json",
        dataType: "json",
        method: "get",
        success: function(data){
            self.data.mid_gridunit_grid_rsrp = data.RECORDS;
        }
    });
}