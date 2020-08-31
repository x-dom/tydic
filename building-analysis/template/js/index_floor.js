var gis = {};
gis.url_root = Common.url_server_root;
gis.url_geoserver = Common.url_geoserver;

gis.mouse_move = {};
gis.mouse_move.tipWindow;
gis.mouse_move.originalObj;
gis.mouse_move.originalColor;
gis.mouse_move.silhouetteColor = Cesium.Color.YELLOW;

//初始化
gis.init = function(){
    this.app = new DicCesium("map", {targetFrameRate: 30});
    this.viewer = this.app.viewer;
    this.app.initClock();
    this.app.flyHome(new Cesium.Cartesian3(-1337923.7948842596, 5329400.940359369, 3229446.8398128035));
    this.initIndoorBuilding();
    this.bindEvent();
};

//初始化建筑
gis.initIndoorBuilding = function() {
    var _this = this;
    if(_this.indoorBuilding) {
        _this.indoorBuilding.destroy();
        _this.indoorBuilding = undefined;
    }
    _this.indoorBuilding = new IndoorBuilding(_this.viewer);
    _this.app.loadGeoJson("./data/sc_jjwd_floor.geojson",(dataSource) => {
        dataSource.entities.values.forEach(entity => {
            var floor = entity.properties.floor.getValue();
            var sortNum = entity.properties.sort_num.getValue();
            _this.indoorBuilding.addFloor(floor, sortNum, entity);
        });
    });
    _this.app.loadGeoJson("./data/sc_jjwd_floor_building.geojson",(dataSource) => {
        dataSource.entities.values.forEach(entity => {
            var floor = entity.properties.floor.getValue();
            _this.indoorBuilding.addFloorRoomOfEntityByFloorId(floor, entity);
        });
    });
};

//绑定事件
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
        
        var pickedFeature = _this.viewer.scene.pick(pixel);
        if(!Cesium.defined(pickedFeature)) return;

        if(pickedFeature.id && pickedFeature.id.name == 'indoor-floor'){
            var floor = pickedFeature.id.properties.floor.getValue();
            _this.indoorBuilding.selectFloorById(floor);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //触发鼠标左键双击击事件
    _this.event.setInputAction(function(evt){
        var pixel = evt.position;

        var pickedFeature = _this.viewer.scene.pick(pixel);
        if(!Cesium.defined(pickedFeature)) return;

    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    //触发鼠标移动事件
    _this.event.setInputAction(function(evt){
        var pixel = evt.endPosition;

        if(_this.mouse_move.originalObj && _this.mouse_move.originalColor){
            _this.mouse_move.originalObj.polygon.outlineColor =  _this.mouse_move.originalColor;
            _this.mouse_move.tipWindow.destory();
            _this.mouse_move.originalObj = undefined;
            _this.mouse_move.originalColor = undefined;
            _this.mouse_move.tipWindow = undefined;
        }

        var pickedFeature = _this.viewer.scene.pick(pixel);
        if(!Cesium.defined(pickedFeature)) return;

        if(pickedFeature.id && pickedFeature.id.name == 'indoor-floor'){
            var floor = pickedFeature.id.properties.floor.getValue();
            var position = _this.app.pixelToWorld3D(pixel)
            _this.mouse_move.originalObj = pickedFeature.id;
            _this.mouse_move.originalColor =  _this.mouse_move.originalObj.polygon.outlineColor;
            _this.mouse_move.originalObj.polygon.outlineColor = _this.mouse_move.silhouetteColor;
            _this.mouse_move.tipWindow = _this.app.addTipInfoWindow(position, "楼层 "+floor+"");
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

//加载地图
$(function(){
    gis.init(2020042717);
});
