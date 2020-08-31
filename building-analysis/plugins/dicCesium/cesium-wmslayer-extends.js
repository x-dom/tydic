/**
 * WMS图层管理
 * @param {*} viewer 
 * @param {*} options 
 */
function WMSLayerManager(viewer, options) {
    let defaultOptions = {
        serverType: 'geoserver',
        url: 'http://192.168.10.212:9600/geoserver/postgres/wms',
        layers: 'postgres:dm_commercial_complex_user_h_grid',
        styles: 'yc_surrounding_user_cnt_grid',
        properties: {hour_no: "2020042717"},
        sql_expression: function() {
            if(this.properties && this.properties.hour_no){
                return 'hour_no='+this.properties.hour_no; 
            }
            return '1=1';
        },
        onClick: undefined,
        onDBClick: undefined,
        show: true
    };
    this.viewer = viewer;
    Object.assign(defaultOptions, options);
    this.serverType = defaultOptions.serverType;
    this.url = defaultOptions.url;
    this.layers = defaultOptions.layers;
    this.styles = defaultOptions.styles;
    this.properties = defaultOptions.properties;
    this.sql_expression = defaultOptions.sql_expression;
    this.onClick = defaultOptions.onClick;
    this.onDBClick = defaultOptions.onDBClick;
    this._show = defaultOptions.show;
    this._rootContainer;
    this.layer;
    this.event;
    this.load();
    // this.bindEvent();
}

//属性绑定
Object.defineProperties(WMSLayerManager.prototype, {
    //显示
    show: {
        get: function () {
            return this._show;
        },
        set: function(bool) {
            this._show = bool;
            if(this.layer){
                this.layer.show = bool;
            }
        }
    },
});

//清空
WMSLayerManager.prototype.clear = function() {
    if(this.layer && this._rootContainer){
        this._rootContainer.remove(this.layer);
    }
};

//加载
WMSLayerManager.prototype.load = function(styles, properties, show) {
    this.clear();

    this._show = show||this._show;
    this.styles = styles || this.styles;
    Object.assign(this.properties, properties || {});

    let cql_filter = this.sql_expression();
    this._rootContainer = this.viewer.imageryLayers;

    this.layer = this._rootContainer.addImageryProvider(new Cesium.WebMapServiceImageryProvider({ 
        url: this.url,
        layers: this.layers,
        parameters: {
            format: 'image/png',
            serverType: this.serverType,
            transparent : true,
            styles: this.styles,
            cql_filter: cql_filter
        },
        getFeatureInfoParameters: {
            cql_filter: cql_filter
        }
    })); 
    this.layer.show = this._show;
    return this.layer;
};

/**
 * 绑定事件
 */
// WMSLayerManager.prototype.bindEvent = function() {
//     let _this = this;
//     if(_this.event) {
//         _this.event.destroy();
//     }

//     _this.event =  new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
//     event.setInputAction(function(evt){
//         _this.pickFeaturesByPixel(evt.position, _this.onClick);
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//     event.setInputAction(function(evt){
//         _this.pickFeaturesByPixel(evt.position, _this.onDBClick);
//     }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
// };

WMSLayerManager.prototype.pickFeaturesByPixel = function(pixel, callBack){
    if(!callBack && !this.layer && !this.layer.show) return;
   
    let viewer = this.viewer;
    let imageryLayerMM = this.layer.imageryProvider;
    let ray = viewer.camera.getPickRay(pixel);
    let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian && imageryLayerMM) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        if (cartographic) {
            let xy = new Cesium.Cartesian2();
            let height = viewer.camera.positionCartographic.height;
            let z = height/366.21;
            let level = 17 - parseInt(Math.log(z)/Math.log(2));
            if (imageryLayerMM.ready) {
                xy = imageryLayerMM.tilingScheme.positionToTileXY(cartographic, level, xy);
                let promise = imageryLayerMM.pickFeatures(xy.x, xy.y, level, cartographic.longitude, cartographic.latitude);
                Cesium.when(promise, function (features) {
                    if(features.length > 0){
                        callBack(features);
                    }
                });
            }
        }
    }
};