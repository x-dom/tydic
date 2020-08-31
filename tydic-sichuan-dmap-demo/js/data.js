self.data = {};
loadData();
/**
 * 加载地图数据
 */

function loadData(){
    self.data.subway = {};
    self.data.transStation = {};
    self.data.populationMove = {};

    //地铁线网
    $.ajax({
        async: false,
        url:"data/subway/subway_netline_gcj02.geojson",
        dataType: "json",
        method: "get",
        success: function(data){
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var line_id = feature.properties.line_id;
                var coordinates = feature.geometry.coordinates;
                feature.properties.coordinates = coordinates;
                self.data.subway[line_id] = feature.properties;
            }
        }
    });

    //地铁站点
    $.ajax({
        async: false,
        url:"data/subway/subway_station_gcj02.geojson",
        dataType: "json",
        method: "get",
        success: function(data){
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var line_id = feature.properties.line_id;
                var station_id = feature.properties.station_id;
                var trans_flag = feature.properties.trans_flag;
                var name = feature.properties.name;
                var coordinates = feature.geometry.coordinates;
                feature.properties.coordinates = coordinates;
                if(!self.data.subway[line_id].station){
                    self.data.subway[line_id].station = [];
                    self.data.subway[line_id].station.push(feature.properties);
                } else {
                    if(self.data.subway[line_id].station[self.data.subway[line_id].station.length-1].station_id > feature.properties.station_id){
                        var temp = self.data.subway[line_id].station[self.data.subway[line_id].station.length-1];
                        self.data.subway[line_id].station[self.data.subway[line_id].station.length-1] = feature.properties;
                        self.data.subway[line_id].station.push(temp);
                    } else {
                        self.data.subway[line_id].station.push(feature.properties);
                    }
                }

                if(line_id == 1){
                    if(!self.data.populationMove[station_id]){
                        self.data.populationMove[station_id] = {};
                    } 

                    $.extend(self.data.populationMove[station_id], feature.properties);
                }

                if(trans_flag == 1){
                    if(!self.data.transStation[name]){
                        self.data.transStation[name] = [];
                    }

                    self.data.transStation[name].push(feature.properties);
                }
            }
        }
    });


    //天府三街网格
    $.ajax({
        async: false,
        url:"data/subway/tianfu_third_street_grid.geojson",
        dataType: "json",
        method: "get",
        success: function(data){
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var coordinates = feature.geometry.coordinates;
                var type = feature.geometry.type;
                if(type == "MultiPolygon"){
                    var dpolygon = new dmap.geom.DMultiPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                } else if(type == "Polygon"){
                    var dpolygon = new dmap.geom.DPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                }
                feature.properties.coordinates = coordinates;
                feature.properties.moveOut = false;
                if(!self.data.populationMove[15]){
                    self.data.populationMove[15] = {};
                } 

                if(!self.data.populationMove[15]["grid"]){
                    self.data.populationMove[15]["grid"] = [];
                }
                self.data.populationMove[15]["grid"].push(feature.properties);

                //人数统计
                if(feature.properties.moveOut){
                    if(self.data.populationMove[15]["moveOutCnt"] == undefined){
                        self.data.populationMove[15]["moveOutCnt"] = 0;
                    }
                    self.data.populationMove[15]["moveOutCnt"]+=feature.properties.user_cnt
                } else {
                    if(self.data.populationMove[15]["moveInCnt"] == undefined){
                        self.data.populationMove[15]["moveInCnt"] = 0;
                    }
                    self.data.populationMove[15]["moveInCnt"]+=feature.properties.user_cnt
                }
            }
        }
    });

    //天府三街楼宇
    $.ajax({
        async: false,
        url:"data/subway/tianfu_third_street_building.geojson",
        dataType: "json",
        method: "get",
        success: function(data){
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var coordinates = feature.geometry.coordinates;
                var type = feature.geometry.type;
                if(type == "MultiPolygon"){
                    var dpolygon = new dmap.geom.DMultiPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                } else if(type == "Polygon"){
                    var dpolygon = new dmap.geom.DPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                }
                feature.properties.coordinates = coordinates;
                if(!self.data.populationMove[15]){
                    self.data.populationMove[15] = {};
                } 

                if(!self.data.populationMove[15]["building"]){
                    self.data.populationMove[15]["building"] = [];
                }
                self.data.populationMove[15]["building"].push(feature.properties);
            }
        }
    });

    //地铁人流离开数据
    var gridArr = [];
    $.ajax({
        async: false,
        url:"data/subway/subway_population_move_out.geojson",
        dataType: "json",
        method: "get",
        success: function(data){
            var features = data.features;
            gridArr = features;
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var station_id = feature.properties.station_id;
                var coordinates = feature.geometry.coordinates;
                var type = feature.geometry.type;
                if(type == "MultiPolygon"){
                    var dpolygon = new dmap.geom.DMultiPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                } else if(type == "Polygon"){
                    var dpolygon = new dmap.geom.DPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                }

                feature.properties.coordinates = coordinates;
                feature.properties.moveOut = true;
                feature.properties.user_cnt = feature.properties.user_cnt;
            
                if(!self.data.populationMove[station_id]){
                    self.data.populationMove[station_id] = {};
                } 

                if(!self.data.populationMove[station_id]["grid"]){
                    self.data.populationMove[station_id]["grid"] = [];
                }

                if(station_id == 15){
                    continue;
                }
                self.data.populationMove[station_id]["grid"].push(feature.properties);

                //人数统计
                if(feature.properties.moveOut){
                    if(self.data.populationMove[station_id]["moveOutCnt"] == undefined){
                        self.data.populationMove[station_id]["moveOutCnt"] = 0;
                    }
                    self.data.populationMove[station_id]["moveOutCnt"]+=feature.properties.user_cnt
                } else {
                    if(self.data.populationMove[station_id]["moveInCnt"] == undefined){
                        self.data.populationMove[station_id]["moveInCnt"] = 0;
                    }
                    self.data.populationMove[station_id]["moveInCnt"]+=feature.properties.user_cnt
                }
            }
        }
    });

    //到站楼宇
    $.ajax({
        async: false,
        url:"data/subway/subway_population_move_out_building_gcj02.geojson",
        dataType: "json",
        method: "get",
        success: function(data){
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var coordinates = feature.geometry.coordinates;
                var type = feature.geometry.type;
                var gridId = feature.properties.id;
                if(type == "MultiPolygon"){
                    var dpolygon = new dmap.geom.DMultiPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                } else if(type == "Polygon"){
                    var dpolygon = new dmap.geom.DPolygon({coordinates: coordinates, projection: "EPSG:4326"});
                    feature.properties.center = dpolygon.getCenter();
                    feature.properties.coordinates3D = dpolygon.get3DGeometry();
                }
                feature.properties.coordinates = coordinates;
                
                for (let j = 0; j < gridArr.length; j++) {
                    var grid = gridArr[j];
                    if(gridId == grid.properties.id){
                        var station_id = grid.properties.station_id;
                        if(!self.data.populationMove[station_id]){
                            self.data.populationMove[station_id] = {};
                        } 
        
                        if(!self.data.populationMove[station_id]["building"]){
                            self.data.populationMove[station_id]["building"] = [];
                        }

                        if(station_id == 15){
                            continue;
                        }
                        self.data.populationMove[station_id]["building"].push(feature.properties);
                        break;
                    }
                }
                
            }
        }
    });
}