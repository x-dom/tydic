mygis = {
    selectFeature: undefined,
    selectLayer: undefined,
    currentEvt: undefined,
    pid: 0,
    cityId: 0,
    datetime: {
        base: new Date(2018, 11, 15),
        ct: new Date(2018, 11, 15, 11),
        cm: new Date(2018, 11, 15, 11),
        cu: new Date(2018, 11, 15, 11),
        nps: new Date(2018, 11, 9),
        busy: new Date(2018, 11, 13),
        fault: new Date(2018, 11, 15),
        gisorder: new Date(2018, 11, 15, 11)
    },
    colors: {
        city_parent_stroke: ['rgba(245, 227, 1, 1)', 'rgba(245, 227, 1, 1)'],
        city_sub_fill: ['rgba(11, 56, 111, 0.0)', 'rgba(11, 56, 111, 0.0)'],
        city_sub_stroke: ['rgba(1, 163, 206, 1)', 'rgba(1, 163, 206, 1)'],
        city_sub_text: ['rgba(158, 199, 248, 1)', 'rgba(158, 199, 248, 1)']
    },
    colorIndex: 0,
    PerceptionShow:false,
    TelecomShow: false,
    MobileShow: false,
    UnicomShow: false,
    wktformat: new ol.format.WKT(),
    ol3Parser: new jsts.io.OL3Parser(),
    geoParser: new ol.format.GeoJSON(),
    startLoading: function(){
//        layer.msg('加载中...', {
//                  icon: 16, //代表加载的图标
//                  time: 10000,  //10秒关闭（如果不配置，默认是3秒）
//                  shade: 0.5
//          });
    },
    endLoading: function(){
        window.layer.closeAll();
    }
};//GIS实体类
$(function () {
    mygis.updateDateTime();//更新当前时间
    mygis.layers = {};//GIS所有图层字典
    mygis.VectorLayers = {};
    mygis.Heatmap = {};
    mygis.HeatmapData = {};
    mygis.cityData = cityMapJson;
    mygis.maxResolution = 70;
    mygis.minResolution = 70;
    mygis.orderLayerGroup = new ol.layer.Group({
        maxResolution: mygis.maxResolution,
        zIndex: 20
    });
    mygis.layers['lwLayer'] = new ol.layer.Tile({//路网图层
        source: new ol.source.XYZ({
            urls: mapAddress.lwLayer
        }),
        preload: 14,
        name: 'lwLayer'
    });
    mygis.layers['baseLayer'] = new ol.layer.Image({
        source: new ol.source.Raster({
            sources: [new ol.source.XYZ({
                urls: mapAddress.vectorLayer,
                crossOrigin: 'anonymous'
            })],
            operation: function (pixels, data) {
                var pixel = pixels[0];
                pixel[0] = 10;
                pixel[1] = 255 - pixel[1];
                pixel[2] = 255 - pixel[2] + 20;
                return pixel;
            }
        })
    });

    var map_height = (parseFloat(app.getMapPosition().height) + parseFloat(app.getMapPosition().top));//获取地图最小的高度即不是全屏下的高度
    $("#map").css('cursor', 'pointer');

    //测量控件
    mygis.mapMeasureControl = new ol.control.Measure({
        type: 'line',
        bottom_height: map_height,
        top: 0,//小地图的上边距
        left: parseFloat(app.getMapPosition().left),//小地图的左边距
        right: parseFloat(app.getMapPosition().left) + parseFloat(app.getMapPosition().width),//小地图的右边距
        bottom: parseFloat(app.getMapPosition().top) + parseFloat(app.getMapPosition().height),//小地图的下边距
        fullScreen: false,//默认非全屏,
        backCallback: function () {
            if (mygis.cityId&&mygis.pid>=app.purviewId) {
                mygis.showCity(mygis.pid);
            }
        }
    });

    //地图
    mygis.map = new ol.Map({
        layers: [mygis.layers['baseLayer'], mygis.orderLayerGroup],
        controls: ol.control.defaults({
            attribution: false,
            zoom: false,
            zoomOptions: {
                className: "myzoom"
            }
        }).extend([mygis.mapMeasureControl]),//添加工具栏控制条
        target: 'map',
        view: new ol.View({
            center: ol.proj.transform(allCity["0"], 'EPSG:4326', 'EPSG:3857'),
            zoom: 8,
            maxZoom: 18,
            minZoom: 5
        })
    });

    //城市边界
    var source = new ol.source.Vector({
        wrapX: false
    });
    mygis.cityLayer = new ol.layer.Vector({//城市边界图层
        source: source,
        style: function (feature) {
            if (feature.get("isparent")) {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: mygis.colors.city_parent_stroke[mygis.colorIndex],
                        width: 3
                    })
                })
            } else {
                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: mygis.colors.city_sub_fill[mygis.colorIndex]
                    }),
                    stroke: new ol.style.Stroke({
                        color: mygis.colors.city_sub_stroke[mygis.colorIndex],
                        width: 1
                    }),
                    text: new ol.style.Text({
                        text: feature.getProperties().name,
                        location: feature.getProperties().location,
                        font: "12px 微软雅黑",
                        fill: new ol.style.Fill({
                            color: mygis.colors.city_sub_text[mygis.colorIndex]
                        }),
                        offsetY:15
                    })
                })
            }
        },
        zIndex: 1,
        name: 'cityLayer'
    });
    mygis.map.addLayer(mygis.cityLayer);
    mygis.interactionSelect = new ol.interaction.Select({//城市边界选中效果
        condition: ol.events.condition.pointerMove,     // 唯一的不同之处，设置鼠标移到feature上就选取
        style: function (feature) {
            if (feature.get('isparent')) {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: mygis.colors.city_parent_stroke[mygis.colorIndex],
                        width: 3
                    })
                })
            } else {
                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: mygis.colors.city_sub_fill[mygis.colorIndex]
                    }),
                    stroke: new ol.style.Stroke({
                        color: mygis.colors.city_sub_stroke[mygis.colorIndex],
                        width: 3
                    }),
                    // text: new ol.style.Text({
                    //     text: feature.getProperties().name,
                    //     location: feature.getProperties().location,
                    //     font: "16px Arial Black",
                    //     //font: "10px",
                    //     fill: new ol.style.Fill({
                    //         color: mygis.colors.city_sub_text[mygis.colorIndex]
                    //     }),
                    //     offsetY:18
                    // })
                })
            }
        },
        filter: function (feature, layer) {
            // console.log('layer name is ' + layer.get('name'));
            return layer === mygis.cityLayer;
        }
    });
    mygis.map.addInteraction(mygis.interactionSelect);

    //单击事件
    mygis.map.on('singleclick', function (evt) {
        var pixel = mygis.map.getEventPixel(evt.originalEvent);
        var feature = mygis.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            if (layer instanceof ol.layer.Heatmap) {
                return undefined;
            }
            if(layer==mygis.layers['perception']) {
                return undefined;
            }
            feature.dispatchEvent({type: 'click', event: event});
            if (layer == mygis.cityLayer) {
                if (feature != undefined) {
                    if (mygis.mapMeasureControl.getState() == 1 || mygis.mapMeasureControl.getState() == 2) {
                        return feature;
                    }
                    if (mygis.map.getView().getZoom() < 15) {
                        if (feature.get("level") < 3) {
                            if (feature.get("isparent")) {

                            } else {
                                mygis.showCity(feature.get("id"));
                            }
                        } else {
                            var extent = ol.proj.transformExtent(feature.get("bounds"), 'EPSG:4326', 'EPSG:3857');
                            mygis.mapMeasureControl.fit(extent);
                            mygis.cityId = feature.get("id");
                            mygis.pid = feature.get("pid");
                            // app.relativeAreaLevel(mygis.cityId);
                        }
                    }
                }
            }
            return feature;
        }, {
            layerFilter: function (layer) {
                return true;
            }
        });
    });

    setTimeout(function () {
        mygis.map.on("pointermove", mygis.selectListener);
        if(app.purviewId==undefined) {
            app.purviewId =0;
        }
        mygis.showCity(app.purviewId);//加载城市的边框
        mygis.showBaseSector(false);//显示基础基站图层
        mygis.showTelecomCover(false);
        mygis.showMobileCover(false);
        mygis.showUnicomCover(false);
        mygis.showNps(false);
        mygis.showBusy(false);
        mygis.showFault(false);
        mygis.showGISOrder(true);
        mygis.showPerception(false);
        mygis.map.getView().on('change:resolution', checkZoom);//checkZoom为调用的函数
    }, 1000);
});

mygis.changeMapColor = function (type) {
    mygis.colorIndex = type;
    if (mygis.colorIndex) {
        if (mygis.layers['baseLayer']) {
            mygis.layers['baseLayer'].getSource().setOperation(function (pixels, data) {
                var pixel = pixels[0];
                return pixel;
            });
        }
        if (mygis.layers['perception']) {
            mygis.layers['perception'].setStyle(mygis.getPerceptionStyle);
        }
        if (mygis.layers['ct']) {
            mygis.layers['ct'].setStyle(mygis.getRsrpRateStyle);
        }
        if (mygis.layers['cm']) {
            mygis.layers['cm'].setStyle(mygis.getRsrpRateStyle);
        }
        if (mygis.layers['cu']) {
            mygis.layers['cu'].setStyle(mygis.getRsrpRateStyle);
        }
    } else {
        if (mygis.layers['baseLayer']) {
            mygis.layers['baseLayer'].getSource().setOperation(function (pixels, data) {
                var pixel = pixels[0];
                pixel[0] = 10;
                pixel[1] = 255 - pixel[1];
                pixel[2] = 255 - pixel[2] + 20;
                return pixel;
            });
        }
        if (mygis.layers['perception']) {
            mygis.layers['perception'].setStyle(mygis.getPerceptionStyle);
        }
        if (mygis.layers['ct']) {
            mygis.layers['ct'].setStyle(mygis.getRsrpRateStyle);
        }
        if (mygis.layers['cm']) {
            mygis.layers['cm'].setStyle(mygis.getRsrpRateStyle);
        }
        if (mygis.layers['cu']) {
            mygis.layers['cu'].setStyle(mygis.getRsrpRateStyle);
        }
    }
    mygis.cityLayer.changed();
}

mygis.hideSector = function () {
    mygis.showBaseSector(false);//显示基础基站图层
    mygis.cityLayer.setVisible(false);
    setTimeout(function () {
        if (app.assemblyShow != 'order') {
            app.hideElement(app.assemblyShow, function () {
                app.showElement('order')
            });
            app.pilloverFilters();
        }
    }, 1000);
}

function checkZoom() {
    for (var i = 0; i < mygis.map.getOverlays().getLength(); i++) {
        var overlay = mygis.map.getOverlays().item(i);
        if (overlay.getPosition()) {
            var pup_container = overlay.getElement();
            if (mygis.VectorLayers['popup-' + overlay.getId()]) {
                mygis.VectorLayers['popup-' + overlay.getId()].getSource().clear();
                mygis.VectorLayers['popup-' + overlay.getId()].getSource().addFeatures([new ol.Feature({
                    geometry: new ol.geom.LineString([mygis.map.getCoordinateFromPixel([$(pup_container).parent().position().left + 50 + $(pup_container).position().left,
                        $(pup_container).parent().position().top + $(pup_container).position().top + $(pup_container).height()])
                        , overlay.getPosition()
                    ])
                })]);
            }
        }
    }
    if (mygis.map.getView().getResolution() < mygis.minResolution) {
        if (mygis.warningLayer) {
            mygis.warningLayer.setVisible(false);
        }
    } else {
        if (mygis.warningLayer) {
            mygis.warningLayer.setVisible(true);
        }
    }
    // 选择电信/移动/联通 并且展示栅格图层时,更换图例
    if(mygis.map.getView().getResolution() < 0.6 && (app.indexCurrentSelectedGisLayerName == "showTelecomCover" || app.indexCurrentSelectedGisLayerName == "showMobileCover" || app.indexCurrentSelectedGisLayerName == "showUnicomCover")) {
        if($('.rsrp-legend').css("display") != "inline-block") gisLegendObject.switchLegend(6);
    }else {
        if($('.rsrp-legend').css("display") == "inline-block") gisLegendObject.switchLegend(0);
    }
}

mygis.clearVectorLayers = function () {
    if (mygis.VectorLayers) {
        for (var key in mygis.VectorLayers) {
            if (mygis.VectorLayers[key]) {
                mygis.map.removeLayer(mygis.VectorLayers[key]);
                mygis.VectorLayers[key] = undefined;
            }
        }
    }
    mygis.map.getOverlays().clear();
    mygis.cityLayer.setVisible(true);
    mygis.showBaseSector(true);
    app.showHideTimeAxis(false);
    mygis.map.stopAnimate();
    app.setOrderWorkDetailsHide();
    // for (var i = 0; i < mygis.map.getOverlays().getLength(); i++) {
    //     var overlay = mygis.map.getOverlays().item(i);
    //     console.log(overlay);
    //     mygis.map.removeOverlay(overlay);
    // }
}

mygis.queryOrderData = function (id) {
    var popup = mygis.map.getOverlayById('pop-warning');
    if (popup) {
        mygis.map.removeOverlay(popup);
    }
    if (mygis.VectorLayers['popup-pop-warning']) {
        mygis.map.removeLayer(mygis.VectorLayers['popup-pop-warning']);
    }
    app.productionWorkOrderGetOrderList(id);
    // mygis.loadOrder(id,function (data) {

    //     if(app.assemblyShow!='order'){
    //         app.hideElement(app.assemblyShow,function(){app.showElement('order')});
    //         app.pilloverFilters();
    //     }
    //     mygis.showGISOrderDetail(data);
    // });
}

mygis.showWarn = function (data, num) {
    var lon = parseFloat(data.lon);
    var lat = parseFloat(data.lat);

    var position = app.getMapPosition();
    var left = parseFloat(position.left);
    var right = parseFloat(position.left) + parseFloat(position.width);
    var top = parseFloat(position.top);
    var bottom = parseFloat(position.top) + parseFloat(position.height);
    var c = mygis.map.getPixelFromCoordinate(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    if (c[0] > left && c[0] < right && c[1] > top && c[1] < bottom) {

    } else if(mygis.cityData[app.areaid]) {
        var extent = ol.proj.transformExtent([mygis.cityData[app.areaid].min_lon, mygis.cityData[app.areaid].min_lat, mygis.cityData[app.areaid].max_lon, mygis.cityData[app.areaid].max_lat], 'EPSG:4326', 'EPSG:3857');
        mygis.mapMeasureControl.fit(extent);
    }

    var repeat = num || 4;
    mygis.addGIFpopup({
        name: 'gif-warning',
        lon: lon,
        lat: lat,
        repeat: repeat,
        colseCallback: function () {
            mygis.warningLayer.getSource().removeFeature(feature);
            var popup = mygis.map.getOverlayById('pop-warning');
            if (popup) {
                mygis.map.removeOverlay(popup);
            }
            if (mygis.VectorLayers['popup-pop-warning']) {
                mygis.map.removeLayer(mygis.VectorLayers['popup-pop-warning']);
            }
        }
    });
    if (mygis.warningLayer == undefined) {
        mygis.warningLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 20,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: './resource/image/svg_location_red.png',
                    anchor: [0.5, 1]    // 设置图标位置
                })
            }),
            minResolution: mygis.minResolution
        });
        mygis.map.addLayer(mygis.warningLayer);
        mygis.warningLayer.on('change:visible', function (evt) {
            if (!evt.oldValue) {
                mygis.map.getOverlays().clear();
                for (var k in mygis.VectorLayers) {
                    if (k.indexOf('popup-') > -1) {
                        mygis.map.removeLayer(mygis.VectorLayers[k]);
                    }
                }
            }
        });
    }
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(
            [lon, lat], 'EPSG:4326', 'EPSG:3857'))
    });
    var popup = mygis.map.getOverlayById('pop-warning');
    if (popup == undefined) {

    } else {
        $(popup.getElement()).find('.ol-popup-closer').click();
    }
    feature.on('click', function (evt) {
        var popup = mygis.map.getOverlayById('pop-warning');
        if (popup == undefined) {
            var htmlmsg = '<div><p>告警级别：<span> ' + data.alarm_level + '</p>'
                + '<p style="max-width: 500px;overflow: hidden;text-overflow: ellipsis;">告警内容：<span title="' + data.alarm_description + '"> ' + data.alarm_description + '</span></p></div>';
            if (data.order_type) {
                var order_id = data.order_code || data.order_id;
                if(!order_id && data.order_ids){
                    var alarm_order_id = "";
                    if(data.order_ids.indexOf&&data.order_ids.indexOf(",") === -1){
                        alarm_order_id  = data.order_ids;
                    }else{
                        alarm_order_id  = data.order_ids.split(",")[0];
                    }
                    order_id = alarm_order_id;
                }
                htmlmsg = '<div><p>工单类型：<span> ' + data.order_type + '工单</span></p>'
                    + '<p onclick="mygis.queryOrderData(\'' + order_id + '\')">工单编号：<span> ' + order_id + '</span></p></div>';
            }
            mygis.addpopup({
                name: 'pop-warning',
                title: '',
                lon: lon,
                lat: lat,
                msghtml: htmlmsg,
                colseCallback: function () {
                    // var layer = mygis.VectorLayers['workOrder'];
                    // if (layer != undefined) {
                    //     layer.getSource().clear();
                    // }
                }
            });
        } else {
            $(popup.getElement()).find('.ol-popup-closer').click();
        }
    });
    mygis.warningLayer.getSource().addFeatures([feature]);
    feature.dispatchEvent('click', {target: feature});
    mygis.map.updateSize();
}
mygis.showWarning = function (lon, lat, nextFunc) {
    if (app.assemblyShow === 'order') {
        if (nextFunc) {
            nextFunc();
        }
        return;
    }
    mygis.addGIFpopup({
        name: 'gif-warning',
        lon: lon,
        lat: lat
    });
    if (mygis.warningLayer == undefined) {
        mygis.warningLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 20,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: './resource/image/svg_location_red.png',
                    anchor: [0.5, 1]    // 设置图标位置
                })
            }),
            minResolution: mygis.minResolution
        });
        mygis.map.addLayer(mygis.warningLayer);
        mygis.warningLayer.on('change:visible', function (evt) {
            if (!evt.oldValue) {
                mygis.map.getOverlays().clear();
                for (var k in mygis.VectorLayers) {
                    if (k.indexOf('popup-') > -1) {
                        mygis.map.removeLayer(mygis.VectorLayers[k]);
                    }
                }
            }
        });
    }
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(
            [lon, lat], 'EPSG:4326', 'EPSG:3857'))
    });
    feature.on('click', function (evt) {
        var popup = mygis.map.getOverlayById('pop-warning');
        if (popup == undefined) {
            var htmlmsg = '<div><p>告警级别:一级告警</p>'
                + '<p>告警内容:告警内容</p></div>';
            mygis.addpopup({
                name: 'pop-warning',
                title: '',
                lon: lon,
                lat: lat,
                msghtml: htmlmsg,
                colseCallback: function () {
                    // var layer = mygis.VectorLayers['workOrder'];
                    // if (layer != undefined) {
                    //     layer.getSource().clear();
                    // }
                }
            });
        } else {
            $(popup.getElement()).find('.ol-popup-closer').click();
        }
    });
    mygis.warningLayer.getSource().addFeatures([feature]);
    feature.dispatchEvent('click', {target: feature});
    mygis.map.updateSize();
    setTimeout(function () {
        var popup = mygis.map.getOverlayById('gif-warning');
        if (popup) {
            mygis.map.removeOverlay(popup);
        }
        popup = mygis.map.getOverlayById('pop-warning');
        if (popup) {
            mygis.map.removeOverlay(popup);
        }
        if (mygis.VectorLayers['popup-pop-warning']) {
            mygis.map.removeLayer(mygis.VectorLayers['popup-pop-warning']);
        }
        if (nextFunc) {
            nextFunc();
        }
        app.indexLayersCloseFn();
    }, 5000);
}

mygis.showWorkOrder = function (id, name) {
    if (id != undefined)
        mygis.showBadqualityOrder(id);
    return;
    $.ajax({
        url: BACK_SERVER_URL + 'largeScreen/queryOrderGisInfo',
        method: 'get',
        data: {id: id},
        success: function (data) {
            data = data[0];
            var lon = 87.60119;
            var lat = 43.93732;
            if (lon == undefined) {
                var lonlat = ol.proj.transform(mygis.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
                lon = lonlat[0];
                lat = lonlat[1];
            }

            var popup = mygis.map.getOverlayById('workorder');
            if (popup) {
                mygis.map.removeOverlay(popup);
            }
            if (mygis.VectorLayers['workOrder']) {
                mygis.map.removeLayer(mygis.VectorLayers['workOrder']);
                mygis.VectorLayers['workOrder'] = undefined;
            }
            mygis.showWarning(lon, lat, function () {
                mygis.hideSector();
                mygis.moveCenter(lon, lat);
                mygis.map.stopAnimate('gif-workorder');
                mygis.addGIFpopup({
                    name: 'gif-workorder',
                    lon: lon,
                    lat: lat,
                    repeat: Number.MAX_VALUE
                });
                mygis.orderLayerGroup.getLayers().clear();

                var layer = new ol.layer.Vector({
                    source: new ol.source.Vector(),
                    zIndex: 20,
                    maxResolution: mygis.minResolution
                });
                mygis.orderLayerGroup.getLayers().push(layer);
                var coor = new ol.geom.Point(ol.proj.transform(
                    [lon, lat], 'EPSG:4326', 'EPSG:3857'));
                var circle = new ol.Feature({
                    geometry: coor,
                    data: data
                });
                circle.setStyle(new ol.style.Style({
                    image: new ol.style.Icon({
                        src: './resource/image/svg_location_red.png',
                        anchor: [0.5, 1]    // 设置图标位置
                    })
                }));
                app.setOrderWorkDetailsHide();
                circle.on('click', function (evt) {
                    if (app.orderWorkDetailsBoxShowHide()) {
                        app.setOrderWorkDetailsHide();
                    } else {
                        app.setOrderWorkDetailsContent({
                            a1: data.id,
                            a2: '容量工单',
                            a3: '1X_CE_License_使用率过高',
                            a4: '——',
                            a5: '住宅',
                            a6: data.order_id,
                            a7: data.p03,
                            a8: (data.p04 == null ? '' : data.p04),
                            userName: data.userName
                        });
                    }
                    // var popup = mygis.map.getOverlayById('workorder');
                    // var data = evt.target.get('data');
                    // if (popup == undefined) {
                    //     var htmlmsg = '<div><p>生产单号:' + data.id + '</p>'
                    //         + '<p>预警指标:' + data.target_name + '</p>'
                    //         + '<p>管理单号:' + data.order_id + '</p>'
                    //         + '<p>目标岗位:' + data.p01 + '</p>'
                    //         + '<p>目标系统:' + data.p02 + '</p>'
                    //         + '<p>派单时间:' + data.p03 + '</p>'
                    //         + '<p>SOP:' + (data.p04 == null ? '' : data.p04) + '</p></div>' +
                    //         '<div class="ol-popup-content-btn"><div class="ol-popup-content-btn-left"></div>' +
                    //         '<div  class="ol-popup-content-btn-center">派发管理工单</div><div class="ol-popup-content-btn-right"></div>' +
                    //         '</div>';
                    //     mygis.addpopup({
                    //         name: 'workorder',
                    //         title: name,
                    //         lon: lon,
                    //         lat: lat,
                    //         msghtml: htmlmsg,
                    //         colseCallback: function () {
                    //             // var layer = mygis.VectorLayers['workOrder'];
                    //             // if (layer != undefined) {
                    //             //     layer.getSource().clear();
                    //             // }
                    //         }
                    //     });
                    // } else {
                    //     $(popup.getElement()).find('.ol-popup-closer').click();
                    // }
                });
                var buffered = mygis.ol3Parser.read(circle.getGeometry());
                buffered = buffered.buffer(1000);
                var cover = new ol.Feature({
                    geometry: mygis.ol3Parser.write(buffered)
                });
                cover.setStyle(new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,255,255,0.4)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#3399CC',
                        width: 1.25
                    })
                }));
                layer.getSource().addFeature(circle);
                layer.getSource().addFeature(cover);
                setTimeout(function () {
                    circle.dispatchEvent('click', {target: circle});
                }, 1500);
            });
        }
    });
}
mygis.selectCity = function (lon, lat) {
    mygis.interactionSelect.getFeatures().clear();
    var features = mygis.cityLayer.getSource().getFeatures();

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var bounds = feature.get("bounds");
        if (lon > bounds[0] && lon < bounds[2] && lat > bounds[1] && lat < bounds[3]) {
            mygis.interactionSelect.getFeatures().push(feature);
            break;
        }
    }
}

//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

mygis.loadBadArea = function (area_id,app_id) {
    var url = BACK_SERVER_URL + 'gisController/queryBadAreaInfo';
    if(app_id) {
        url = BACK_SERVER_URL + 'gisController/queryMOD3Area';
    }
    $.ajax({
        url: url,
        method: 'get',
        data: {area_id: area_id},
        success: function (data) {

            if (mygis.VectorLayers['order_area']) {
                mygis.map.removeLayer(mygis.VectorLayers['order_area']);
            }

            if (mygis.VectorLayers['order_bts']) {
                mygis.map.removeLayer(mygis.VectorLayers['order_bts']);
            }
            if (mygis.VectorLayers['grid_bts_line']) {
                mygis.map.removeLayer(mygis.VectorLayers['grid_bts_line']);
            }
            if (data.area == undefined || data.area.lon == undefined) {
//                layer.alert('查询无小区记录', function(index){layer.close(index);});
                return;
            }
            var gfs = new ol.Collection();
            var sfs = new ol.Collection();
            var ffs = new ol.Collection();
            mygis.VectorLayers['grid_bts_line'] = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: ffs
                }),
                zIndex: 16,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(31, 164, 240,1)',
                        width: 1
                    })
                }),
                name: 'grid_bts_line',
                maxResolution: mygis.minResolution
            });
            mygis.map.addLayer(mygis.VectorLayers['grid_bts_line']);
            var bts_list = data.bts_list;
            for (var i = 0; i < bts_list.length; i++) {
                var bts = bts_list[i];
                var cell_list = bts.cell_list;
                var latitude = parseFloat(bts.latitude);
                var longitude = parseFloat(bts.longitude);

                if (latitude && longitude) {
                    var coordinate = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
                    var point = new ol.geom.Point(coordinate);
                    var feature = new ol.Feature({
                        geometry: point,
                        bts: bts
                    });
                    gfs.push(feature);
                    // var lonlat = ExtendUtil.gps84ToGcj02(data.area.lon,data.area.lat);
                    var lon = data.area.lon;
                    var lat = data.area.lat;
                    var line = new ol.Feature({
                        geometry: new ol.geom.LineString([ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'), coordinate])
                    });
                    ffs.push(line);
                    for (var j = 0; j < cell_list.length; j++) {
                        var sector = cell_list[j];
                        sector.cgl = randomNum(94, 99) + '.' + randomNum(10, 99);
                        sector.yll = randomNum(94, 99) + '.' + randomNum(10, 99);
                        sector.fgl = randomNum(94, 99) + '.' + randomNum(10, 99);
                        sector.dxl = (100 - parseFloat(sector.cgl)).toFixed(2);
                        sector.gj = '否';
                        sector.cz = randomNum(800, 5000);
                        sector.cj = '室外';
                    }
                    feature.on('click', function (evt) {
                        var data = evt.target.get('bts').cell_list;
                        var oid = evt.target.get('bts').oid;
                        app.createOrderEstateInfosPop(oid, data);
//                        mygis.loadRectorCellsDetail(data);
                    });
                }
            }
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var pixelRatio = ol.has.DEVICE_PIXEL_RATIO;

            // Generate a rainbow gradient
            function gradient(feature, resolution) {
                var extent = feature.getGeometry().getExtent();
                // Gradient starts on the left edge of each feature, and ends on the right.
                // Coordinate origin is the top-left corner of the extent of the geometry, so
                // we just divide the geometry's extent width by resolution and multiply with
                // pixelRatio to match the renderer's pixel coordinate system.
                var width = ol.extent.getWidth(extent) / resolution * pixelRatio;
                var height = ol.extent.getHeight(extent) / resolution * pixelRatio;
                var grad = context.createRadialGradient(width / 2, height / 2,
                    5, width / 2, height / 2, width > height ? width / 2 : height / 2);
                grad.addColorStop(0, 'rgba(235, 0, 0, 0.1)');
                grad.addColorStop(1, 'rgba(231, 132, 238, 0.1)');
                return grad;
            }

            var fill = new ol.style.Fill();
            var style = new ol.style.Style({
                // fill: fill,
                stroke: new ol.style.Stroke({ //边界样式
                    color: '#f00',
                    lineDash: [4, 6],
                    width: 3
                })
            });

            var getStackedStyle = function (feature, resolution) {
                var id = feature.getId();
                fill.setColor(gradient(feature, resolution));
                return style;
            };
            mygis.VectorLayers['order_area'] = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.format.WKT().readGeometry(data.area.wkt, {
                            dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
                        })
                    })]
                }),
                zIndex: 14,
                style: getStackedStyle,
                name: 'order_area',
                maxResolution: mygis.minResolution
            });

            mygis.map.addLayer(mygis.VectorLayers['order_area']);
            mygis.VectorLayers['order_bts'] = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: gfs
                }),
                zIndex: 16,
                style: function (feature) {
                    var bts = feature.get('bts');
                    var icon = './resource/image/ic_gis_order_sector.png';
                    if (bts.net_type == 2) {
                        if (bts.flag == 1) {
                            icon = './resource/image/ic_gis_order_cell_2g1.png'
                        } else if (bts.flag == 2) {
                            icon = './resource/image/ic_gis_order_cell_2g2.png'
                        } else {
                            icon = './resource/image/ic_gis_order_cell_2g0.png'
                        }
                    } else {
                        if (bts.flag == 1) {
                            icon = './resource/image/ic_gis_order_cell_4g1.png'
                        } else if (bts.flag == 2) {
                            icon = './resource/image/ic_gis_order_cell_4g2.png'
                        } else {
                            icon = './resource/image/ic_gis_order_cell_4g0.png'
                        }
                    }
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: icon,
                            anchor: [0.5, 0.5],    // 设置图标位置,
                        })
                    })
                },
                name: 'order_bts',
                maxResolution: mygis.minResolution
            });
            mygis.map.addLayer(mygis.VectorLayers['order_bts']);
        }
    });
}

/**
 * 加载小区详情
 */
mygis.loadRectorCellsDetail = function(data){
    var domId = "rector-cells-detail";
    var title = "小区详情";
    var popup = mygis.map.getOverlayById(domId);

    if (popup) {
        mygis.map.removeOverlay(popup);
//         var sector_name = $(popup.getElement()).find('#sector_name')[0].innerHTML;
//         if((data.sector_name)==sector_name) {
//             $(popup.getElement()).find('.ol-popup-closer').click();
//             return
//         }
    }

    var htmlmsg = '<div style="padding:4px;width: 200px;"><div><table style="table-layout: fixed;width: 192px">'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">小区名称</td><td style="width: 5px;">:</td><td id="sector_name" title="' + (data.sector_name||'---') + '" style="width:125px;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;">' + data.sector_name + '</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">方位角</td><td>:</td><td>' + (data.ant_azimuth||'---')  + '</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">仰角</td><td>:</td><td>' + (data.ant_downtilt||'---')  + '</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">站高</td><td>:</td><td>' + (data.ant_high||'---')  + '</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">连接成功率</td><td>:</td><td>' + (data.cgl||'---')  + '%</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">掉线率</td><td>:</td><td>' + (data.dxl||'---')  + '%</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">优良率</td><td>:</td><td>' + (data.yll||'---')  + '%</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">覆盖率</td><td>:</td><td>' + (data.fgl||'---')  + '%</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">告警信息</td><td>:</td><td>' + (data.gj||'---')  + '</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">常驻用户</td><td>:</td><td>' + (data.cz||'---')  + '</td></tr>'
         + '<tr><td class="ol-popup-content-table-left-justify" style="width: 60px;">场景</td><td>:</td><td>' + (data.cj||'---')  + '</td></tr>'
         + '</table></div>';
    mygis.addpopup({
         name: domId,
         title: title,
         lon: data.longitude,
         lat: data.latitude,
         msghtml: htmlmsg
    });
}

mygis.loadOrder = function (id, dn, manager_id) {
    $.ajax({
        url: BACK_SERVER_URL + 'gisController/queryOrderGisInfo',
        method: 'get',
        data: {id: id},
        success: function (data) {
            if (data.lon && data.lat) {
                // var lonlat = ExtendUtil.gps84ToGcj02(data.lon,data.lat);
                // data.sys_lon = data.lon;
                // data.sys_lat = data.lat;
                // data.lon = lonlat.x;
                // data.lat = lonlat.y;
                if (dn) {
                    dn(data);
                }
            }
        }
    });
}

/**
 * 展示工单详情
 */
mygis.showGISOrderDetail = function (data) {
    app.createOrderFlowConfig(data);
    if (data.order_type == '盲点库') {
        mygis.moveBlind(data.order_id);
        app.showHideOrderWordLegend("spot", true);
        return;
    }
    app.showHideOrderWordLegend("basis", true);
    if (mygis.VectorLayers['badquality_order']) {
        mygis.map.removeLayer(mygis.VectorLayers['badquality_order']);
    }
    var popup = mygis.map.getOverlayById('badquality_order');
    if (popup) {
        mygis.map.removeOverlay(popup);
    }
    app.closeOrderEstateInfosPop();

    //规划站坐标重查
    if(data.sys_app_id == '31'){
        $.ajax({
                url: BACK_SERVER_URL + "gisController/queryAssessData",
                method: 'get',
                async: false,
                data: {order_code: data.order_code},
                success: function (rows) {
                    if(rows && rows.length > 0){
                        data.bspot = rows[0];
                        data.lon = rows[0].bspot_lon;
                        data.lat = rows[0].bspot_lat;
                    }
                }
        });
    }

    if (data.lon == undefined) {
        return;
    }

    mygis.moveCenter(data.lon, data.lat, function () {
        var features = new ol.Collection();
        var feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([data.lon, data.lat], 'EPSG:4326', 'EPSG:3857')),
            data: {
                order_id: data.order_id,
                net_type: data.sys_net_type,
                order_code: data.order_code,
                status: data.status,
                city_id: data.city_id,
                city_name: data.city_name,
                district_id: data.district_id,
                district_name: data.district_name,
                order_type: data.sys_app_name,
                lon: data.lon,
                lat: data.lat,
                address: data.sys_address,
                description: data.description,
                create_time: data.create_time,
                appearance: data.sys_appearance,
                feedback_content: data.sys_feedback_content,
                timeout_time: data.sys_timeout_time,
                manager_order_id: data.manager_order_id,
                manager_order_time: data.manager_order_time,
                manager_order_status: data.manager_order_status,
                userName: data.userName
            }
        });
        app.setOrderWorkDetailsHide();
        mygis.map.stopAnimate();

        feature.on('click', function (evt) {
            var popup = mygis.map.getOverlayById('badquality_order');
            var data = evt.target.get('data');
            if (app.orderWorkDetailsBoxShowHide()) {
                app.setOrderWorkDetailsHide();
            } else {
                app.setOrderWorkDetailsContent({
                    a1: data.order_code,
                    a2: data.order_type,
                    a3: data.appearance ? data.appearance : '——',
                    a4: '——',
                    a5: '住宅',
                    a6: data.manager_order_id || '未派单',
                    a7: data.manager_order_time || '——',
                    a8: data.address ? data.address : '——',
                    a9: data.feedback_content ? data.feedback_content : '——',
                    a10: data.city_name,
                    a11: data.district_name,
                    a12: data.manager_order_status || '——',
                    userName: data.userName
                });
            }
        });

        features.push(feature);
        mygis.VectorLayers['badquality_order'] = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: './resource/image/svg_location_red.png',
                    anchor: [0.5, 1]    // 设置图标位置
                })
            }),
            zIndex: 16,
            maxResolution: mygis.minResolution
        });
        var coordinate = [];
        if (data.sys_app_id == '1') {
            mygis.map.addLayer(mygis.VectorLayers['badquality_order']);
            mygis.addGIFpopup({
                name: 'gif-workorder',
                lon: data.lon,
                lat:  data.lat,
                repeat: Number.MAX_VALUE
            });
            coordinate[0] = data.lon;
            coordinate[1] = data.lat;
        } else {
            var lonlat = ExtendUtil.gps84ToGcj02(data.lon,data.lat);
            mygis.addGIFpopup({
                name: 'gif-workorder',
                lon: lonlat.x,
                lat:  lonlat.y,
                repeat: Number.MAX_VALUE
            });
            coordinate[0] = lonlat.x;
            coordinate[1] = lonlat.y;
        }
        setTimeout(function () {
            feature.dispatchEvent('click', {target: feature});
            if (data.sys_app_id == '1') {
                mygis.loadBadArea(data.area_id);
                var day_no = undefined;
                if (data.area_id) {
                    if (data.area_id.length > 8) {
                        day_no = data.area_id.substring(0, 8);
                    }
                }
                app.loadTimeAxisData(data.order_code, day_no);
            } else if (data.sys_app_id == '9') {
                mygis.loadBadArea(data.area_id,9);
                app.showHideTimeAxis(false);
//            } else if(data.order_type=='盲点'){
//                mygis.showQuan(data.lon,data.lat);
//                app.createOrderEstateInfosPopBlind(data.order_id, data.blind);
//
            } else if(data.sys_app_id == '30' || data.sys_app_id == '31' || data.sys_app_id == '10'){//盲点需求、翼工程建设工单、NPS用户
                mygis.loadGISBSpotMarker(data);
            } else {
                app.showHideTimeAxis(false);
                if (data.sys_app_id == '6' || data.sys_app_id == '4') {
                    mygis.loadBadBts(data.sys_ne_id, data.sys_net_type, data.sys_ne_name,data.order_type, data.sys_app_id, coordinate[0],coordinate[1]);
                } else {
                    mygis.loadBadBts(data.sys_ne_id, data.sys_net_type,'',data.order_type, data.sys_app_id, coordinate[0],coordinate[1]);
                }
            }
        }, 500);
    });
}

/**
 * 加载盲点评估标注
 */
mygis.loadGISBSpotMarker = function (data) {
    var name = "order_bts";
    if (mygis.VectorLayers[name]) {
        mygis.map.removeLayer(mygis.VectorLayers[name]);
    }

    //坐标偏移
    var lonlat = ExtendUtil.gps84ToGcj02(data.lon,data.lat);
    var lon = lonlat.x;
    var lat = lonlat.y;

    var features = [];
    var sys_app_id = data.sys_app_id;
    var point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    var picUrl = "./resource/image/mapFilter/ic_gis_order_cell_zero.png";

    if(sys_app_id == 10){
        picUrl = "./resource/image/mapFilter/mapFilter_03.png";
    }
    var feature = new ol.Feature({
        geometry: point
    });
    features.push(feature);
    mygis.VectorLayers[name] = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: features
        }),
        zIndex: 16,
        style: function (feature) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: picUrl,
                    anchor: [0.5, 1],    // 设置图标位置,
                })
            })
        },
        name: name,
        maxResolution: mygis.minResolution
    });
    mygis.map.addLayer(mygis.VectorLayers[name]);

    feature.on('click', function (evt) {
        mygis.loadGISBSpotDetailPopup(data, mygis.VectorLayers[name]);
    });
    mygis.loadGISBSpotDetailPopup(data, mygis.VectorLayers[name]);
}

/**
 * 加载盲点评估详情弹窗
 */
mygis.loadGISBSpotDetailPopup = function(orderData, layer){
    var sys_app_id = orderData.sys_app_id;
    var order_id = orderData.order_id;
    var title = "";
    var url = "";
    var params = {};
    var isNps = false;

    //坐标偏移
    var lonlat = ExtendUtil.gps84ToGcj02(orderData.lon,orderData.lat);
    var lon = lonlat.x;
    var lat = lonlat.y;

    if(sys_app_id == '10') {//NPS
        isNps = true;
        title = "NPS用户信息";
        url = "gisController/queryNPSData";
        params = {sys_ne_id: orderData.sys_ne_id,week_no: orderData.week_no};
    }  else {
        isNps = false;
        title = "站点评估信息";
        url = "gisController/queryAssessData";
        params = {order_code: orderData.order_code};
    }

    $.ajax({
            url: BACK_SERVER_URL + url,
            method: 'get',
            data: params,
            success: function (rows) {
                if(rows && rows.length > 0){
                    var data = rows[0];
                    var innerHTMl = '<div class="estateInfosBox"><div class="estateInfosCons">';
                    if(isNps) {//NPS
                            data.cem4g_busi_good_rate = (data.cem4g_busi_good_rate?(data.cem4g_busi_good_rate + "%"):data.cem4g_busi_good_rate);//综合优良率
                            innerHTMl += '<ul class="estateInfosCon" style="display: block;">';
                            innerHTMl += '<li><div class="formName">城市名称：</div><div class="formVal">' +(data.ba_city_name||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">号码：</div><div class="formVal">' +(data.ba_acc_nbr||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">客户类型：</div><div class="formVal">' +(data.ba_sale_org_type||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">城乡标识：</div><div class="formVal">' +(data.ba_city_flag==0?"农村":"城市") + '</div></li>';
                            innerHTMl += '<li><div class="formName">年龄：</div><div class="formVal">' +(data.ba_age||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">性别：</div><div class="formVal">' +(data.ba_gender==0?"女":"男") + '</div></li>';
                            innerHTMl += '<li><div class="formName">在网时长：</div><div class="formVal">' +(data.ba_ci_tenure2||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">套餐档位：</div><div class="formVal">' +(data.ba_packageexes||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">ARPU：</div><div class="formVal">' +(data.ba_mb_arpu_cdma||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">ex得分：</div><div class="formVal">' +(data.cem23g_1xscore||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">do得分：</div><div class="formVal">' +(data.cem23g_doscore||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">常住小区：</div><div class="formVal">' +(data.cem23g_home_cell_name||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">工作小区：</div><div class="formVal">' +(data.cem23g_work_cell_name||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">区县名称：</div><div class="formVal">' +(data.cem4g_county_name||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName" title="综合优良率=0.5*网页优良率+0.3*视频优良率+0.1*即时通讯优良率+0.1*游戏优良率">综合优良率：</div><div class="formVal">' +(data.cem4g_busi_good_rate||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">数据来源：</div><div class="formVal">' +(data.nps_data_source||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">得分：</div><div class="formVal">' +(data.nps_score||'---') + '</div></li>';
                            innerHTMl += '</ul>';
                    } else {
                            data.pc_grid_rate = (data.pc_grid_rate?(data.pc_grid_rate + "%"):data.pc_grid_rate);//感知优良率
                            data.rrc_con_rate = (data.rrc_con_rate?(data.rrc_con_rate + "%"):data.rrc_con_rate);//建立成功率
                            data.erab_miss_rate = (data.erab_miss_rate?(data.erab_miss_rate + "%"):data.erab_miss_rate);//RAB掉话率
                            data.mr_cover_rate = (data.mr_cover_rate?(data.mr_cover_rate + "%"):data.mr_cover_rate);//覆盖优良率
                            innerHTMl += '<ul class="estateInfosCon" style="display: block;">';
                            innerHTMl += '<li><div class="formName">站点名称：</div><div class="formVal">' +(data.bspot_name||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">站点类型：</div><div class="formVal">' +(data.bspot_type||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">支局名称：</div><div class="formVal">' +(data.area_name||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">网络类型：</div><div class="formVal">' +(data.net_type||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">覆盖场景：</div><div class="formVal">' +(data.scene_level3||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">建设类型：</div><div class="formVal">' +(data.build_type||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">站点进度：</div><div class="formVal">' +(data.bspot_progress||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">感知优良率：</div><div class="formVal">' +(data.pc_grid_rate||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">区域周用户：</div><div class="formVal">' +(data.area_week_users||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">高星级用户：</div><div class="formVal">' +(data.high_star_users||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">建立成功率：</div><div class="formVal">' +(data.rrc_con_rate||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">E-RAB掉话：</div><div class="formVal">' +(data.erab_miss_rate||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">覆盖优良率：</div><div class="formVal">' +(data.mr_cover_rate||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">对标结果：</div><div class="formVal">' +(data.net_compare_result||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">站点得分：</div><div class="formVal">' +(data.bspot_score||'---') + '</div></li>';
                            innerHTMl += '<li><div class="formName">站点评级：</div><div class="formVal">' +(data.bspot_grade||'---') + '</div></li>';
                            innerHTMl += '</ul>';
                    }
                    innerHTMl += '</div></div>';

                    if ($('#popBox_orderEstateInfos').length > 0) {
                        $('#popBody_orderEstateInfos').html(innerHTMl);
                        $('#popBox_orderEstateInfos').attr('name', order_id)
                //                    .css({width: '260px', height: '480px', left: 'initial'});
                    } else {
                        app.createPopOuter('orderEstateInfos', title, innerHTMl, {
                            drag: false,
                            resize: false,
                            scroll: true,
                            posi: {top: 'calc(1% + 4vh)', right: '280px',width: '260px', height: '470px', left: 'initial'}
                        });
                        $('#popBox_orderEstateInfos').attr('name', order_id)
                //                    .css({width: '260px', height: '480px', left: 'initial'});
                    }

                     //不是NPS，直接绘制边界
                    if(!isNps){
                        if(data.bspot_type == 0){//农村
                            mygis.drawCircleOfRedLineDashBound(layer, lon, lat, 300);
                        } else {//城市
                            mygis.drawCircleOfRedLineDashBound(layer, lon, lat, 150);
                        }
                    }
                }
            }
        });

}

mygis.showBadqualityOrder = function (id) {
    $.ajax({
        url: BACK_SERVER_URL + 'gisController/queryOrderGisInfo',
        method: 'get',
        data: {id: id},
        success: function (data) {

            if (mygis.VectorLayers['badquality_order']) {
                mygis.map.removeLayer(mygis.VectorLayers['badquality_order']);
            }
            var popup = mygis.map.getOverlayById('badquality_order');
            if (popup) {
                mygis.map.removeOverlay(popup);
            }
            app.closeOrderEstateInfosPop();
            if (data.lon == undefined) {
                return;
            }
            var gcj = ExtendUtil.gps84ToGcj02(data.lon, data.lat);
            data.lon = gcj.x;
            data.lat = gcj.y;
            mygis.showWarning(data.lon, data.lat, function () {
                mygis.hideSector();
                mygis.moveCenter(data.lon, data.lat, function () {
                    var features = new ol.Collection();
                    var feature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([data.lon, data.lat], 'EPSG:4326', 'EPSG:3857')),
                        data: {
                            order_id: data.order_id,
                            net_type: data.sys_net_type,
                            order_code: data.order_code,
                            status: data.status,
                            city_id: data.city_id,
                            city_name: data.city_name,
                            district_id: data.district_id,
                            district_name: data.district_name,
                            order_type: data.sys_app_name,
                            lon: data.lon,
                            lat: data.lat,
                            address: data.sys_address,
                            description: data.description,
                            create_time: data.create_time,
                            appearance: data.sys_appearance,
                            feedback_content: data.sys_feedback_content,
                            timeout_time: data.sys_timeout_time,
                            userName: data.userName
                        }
                    });
                    app.setOrderWorkDetailsHide();
                    feature.on('click', function (evt) {
                        var popup = mygis.map.getOverlayById('badquality_order');
                        var data = evt.target.get('data');
                        if (app.orderWorkDetailsBoxShowHide()) {
                            app.setOrderWorkDetailsHide();
                        } else {
                            app.setOrderWorkDetailsContent({
                                a1: data.order_code ? data.order_code : '——',
                                a2: data.order_type ? data.order_type : '——',
                                a3: data.appearance ? data.appearance : '——',
                                a4: '——',
                                a5: '住宅',
                                a6: '未派单',
                                a7: '——',
                                a8: data.address ? data.address : '——',
                                a9: data.feedback_content ? data.feedback_content : '——',
                                a10: data.city_name ? data.city_name : '——',
                                a11: data.district_name ? data.district_name : '——',
                                userName: data.userName
                            });
                        }
                    });

                    features.push(feature);
                    mygis.VectorLayers['badquality_order'] = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: features
                        }),
                        style: new ol.style.Style({
                            image: new ol.style.Icon({
                                src: './resource/image/svg_location_red.png',
                                anchor: [0.5, 1]    // 设置图标位置
                            })
                        }),
                        zIndex: 16,
                        maxResolution: mygis.minResolution
                    });
                    mygis.map.addLayer(mygis.VectorLayers['badquality_order']);
                    setTimeout(function () {
                        feature.dispatchEvent('click', {target: feature});
                        if (data.sys_app_id == '1') {
                            mygis.loadBadArea(data.area_id);
                            var day_no = undefined;
                            if (data.area_id) {
                                if (data.area_id.length > 8) {
                                    day_no = data.area_id.substring(0, 8);
                                }
                            }
                            app.loadTimeAxisData(id, day_no);
                        } else if (data.sys_app_id == '9') {
                            mygis.loadBadArea(data.area_id,9);
                            app.showHideTimeAxis(false);
//                        } else if(data.order_type=='盲点'){
//                            mygis.showQuan(data.lon,data.lat);
//                            app.createOrderEstateInfosPopBlind(data.order_id, data.blind);
                        } else if(data.sys_app_id == '30' || data.sys_app_id == '31' || data.sys_app_id == '10'){//盲点需求、翼工程建设工单、NPS用户
                            mygis.loadGISBSpotMarker(data);
                        } else {
                            app.showHideTimeAxis(false);
                            if (data.sys_app_id == '6' || data.sys_app_id == '4') {
                                mygis.loadBadBts(data.sys_ne_id, data.sys_net_type, data.sys_ne_name,data.order_type,data.sys_app_id,data.lon,data.lat);
                            } else {
                                mygis.loadBadBts(data.sys_ne_id, data.sys_net_type,'',data.order_type, data.sys_app_id,data.lon,data.lat);
                            }
                        }
                    }, 500);
                });
            });
        }
    });
}

mygis.showQuan = function (lon,lat) {
    if (mygis.VectorLayers['order_bts']) {
        mygis.map.removeLayer(mygis.VectorLayers['order_bts']);
    }
    mygis.VectorLayers['order_bts'] = new ol.layer.Vector({
        source: new ol.source.Vector(),
        zIndex: 16,
        style:  new ol.style.Style({
                image: new ol.style.Icon({
                    src: './resource/image/mapFilter/ic_gis_order_cell_zero.png',
                    anchor: [0.5, 1],    // 设置图标位置,
                })
            }),
        name: 'order_bts',
        maxResolution: mygis.minResolution
    });
    mygis.map.addLayer(mygis.VectorLayers['order_bts']);
    var cjo2 = ExtendUtil.gps84ToGcj02(lon, lat);
    lat = cjo2.y;
    lon = cjo2.x;
    var coordinate = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
    var point = new ol.geom.Point(coordinate);
    var feature = new ol.Feature({
        geometry: point
    });
    mygis.VectorLayers['order_bts'].getSource().addFeature(feature);
    mygis.drawCircleOfRedLineDashBound(mygis.VectorLayers['order_bts'], lon, lat, 1000);//画边界
}

mygis.loadBadBts = function (ne_id, net_type, bts_name,order_type,sys_app_id, lon, lat) {
    $.ajax({
        url: BACK_SERVER_URL + 'gisController/queryBadBts',
        method: 'get',
        data: {ne_id: ne_id, net_type: net_type, bts_name: bts_name,order_type:order_type},
        success: function (data) {
            if (mygis.VectorLayers['order_bts']) {
                mygis.map.removeLayer(mygis.VectorLayers['order_bts']);
            }
            var gfs = new ol.Collection();
            var sfs = new ol.Collection();
            var ffs = new ol.Collection();
            var bts = data;
            var cell_list = bts.cell_list;
            var latitude = parseFloat(bts.latitude);
            var longitude = parseFloat(bts.longitude);
            var feature;
            if (latitude && longitude) {
//                if (net_type == 3 || net_type == 2) {
//                    longitude = lon;
//                    latitude = lat;
//                }
//                if (sys_app_id == 5 || sys_app_id == 6 || sys_app_id == 200) {
//                    longitude = lon;
//                    latitude = lat;
//                }
                    longitude = lon;
                    latitude = lat;
                var coordinate = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
                var point = new ol.geom.Point(coordinate);
                feature = new ol.Feature({
                    geometry: point,
                    bts: bts
                });
                gfs.push(feature);

                for (var j = 0; j < cell_list.length; j++) {
                    var sector = cell_list[j];
                    sector.cgl = randomNum(94, 99) + '.' + randomNum(10, 99);
                    sector.yll = randomNum(94, 99) + '.' + randomNum(10, 99);
                    sector.fgl = randomNum(94, 99) + '.' + randomNum(10, 99);
                    sector.dxl = (100 - parseFloat(sector.cgl)).toFixed(2);
                    sector.gj = '否';
                    sector.cz = randomNum(800, 5000);
                    sector.cj = '室外';
                    sector.ant_azimuth = sector.ant_azimuth ? sector.ant_azimuth : '——';
                    sector.ant_downtilt = sector.ant_downtilt ? sector.ant_downtilt : '——';
                    sector.ant_high = sector.ant_high ? sector.ant_high : '——';
                    sector.sector_name = sector.sector_name ? sector.sector_name : '——';
                }
                feature.on('click', function (evt) {
                    var data = evt.target.get('bts').cell_list;
                    var oid = evt.target.get('bts').oid;
                    app.createOrderEstateInfosPop(oid, data);
                });
                app.createOrderEstateInfosPop(bts.oid, bts.cell_list);
            }
            mygis.VectorLayers['order_bts'] = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: gfs
                }),
                zIndex: 16,
                style: function (feature) {
                    var bts = feature.get('bts');
                    var icon = './resource/image/ic_gis_order_sector.png';
                    if (bts.net_type == 2) {
                        if (bts.flag == 1) {
                            icon = './resource/image/ic_gis_order_cell_2g1.png'
                        } else if (bts.flag == 2) {
                            icon = './resource/image/ic_gis_order_cell_2g2.png'
                        } else {
                            icon = './resource/image/ic_gis_order_cell_2g0.png'
                        }
                    } else {
                        if (bts.flag == 1) {
                            icon = './resource/image/ic_gis_order_cell_4g1.png'
                        } else if (bts.flag == 2) {
                            icon = './resource/image/ic_gis_order_cell_4g2.png'
                        } else {
                            icon = './resource/image/ic_gis_order_cell_4g0.png'
                        }
                    }
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: icon,
                            anchor: [0.5, 1],    // 设置图标位置,
                        })
                    })
                },
                name: 'order_bts',
                maxResolution: mygis.minResolution
            });
            mygis.map.addLayer(mygis.VectorLayers['order_bts']);
            if(order_type=='故障') {
                return;
            }

            if(longitude && latitude){
                mygis.drawCircleOfRedLineDashBound(mygis.VectorLayers['order_bts'], longitude, latitude, 1000);//画边界
            }
        }
    });
}

mygis.movepupow = function () {
    if (mygis.map.getOverlayById('blind')) {
        var overlay = mygis.map.getOverlayById('blind');
        var div = mygis.map.getOverlayById('blind').getElement();
        $(div).css('left', '-100px');
        $(div).css('bottom', '100px');
    }
}

mygis.addGIFpopup = function (opt_options) {
    var options = opt_options || {};
    var lon = options.lon;
    var lat = options.lat;
    var name = options.name || ('' + (new Date().getTime()));
    var radius = options.radius || 30;
    var duration = options.duration || 1500;
    var repeat = options.repeat || 4;
    var icon = options.icon;
    var colseCallback = options.colseCallback;
    if (lon == undefined || lat == undefined) {
        lon = mygis.map.getView().getCenter()[0];
        lat = mygis.map.getView().getCenter()[1];
    } else {
        var lonlat = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
        lon = lonlat[0];
        lat = lonlat[1];
    }
    var f = new ol.Feature({
        geometry: new ol.geom.Point([lon, lat]),
        id: name
    });
    f.setId(name);
    f.setStyle(new ol.style.Style(
        {
            image: new ol.style.Circle(
                {
                    radius: radius,
                    points: 4,
                    fill: new ol.style.Fill({color: 'rgba(255,0,0,0.3)'})
                })
        }));
    var animZoom = new ol.featureAnimation.Zoom(
        {
            fade: ol.easing.easeOut,
            duration: duration,
            repeat: repeat,
            easing: ol.easing.easeOut
        });
    mygis.map.animateFeature(f, animZoom);
    animZoom.on('animationend', function (evt) {
        if (colseCallback) {
            colseCallback();
        }
    });
    return animZoom;
}

mygis.addpopup = function (opt_options) {
    var options = opt_options || {};
    var lon = options.lon;
    var lat = options.lat;
    var name = options.name;
    var msghtml = options.msghtml;
    var title = options.title || '';
    var colseCallback = options.colseCallback;
    var pup_container = document.createElement('div');
    pup_container.className = 'ol-popup';
    pup_container.id = 'ol-popup-' + name;

    var pup_content = document.createElement('div');
    pup_content.className = 'ol-popup-content';

    var pup_closer = document.createElement('a');
    pup_closer.className = 'ol-popup-closer';
    pup_closer.innerText = '×';
    var pupTtitleBox = document.createElement('p');
    pupTtitleBox.innerText = title;
    pupTtitleBox.className = 'ol-popup-title';
    pupTtitleBox.appendChild(pup_closer)
    pup_container.appendChild(pupTtitleBox);
    pup_container.appendChild(pup_content);
    var leftTop = document.createElement('i');
    leftTop.className = 'left-top';
    var leftBottom = document.createElement('i');
    leftBottom.className = 'left-bottom';
    var topLeft = document.createElement('i');
    topLeft.className = 'top-left';
    var bottomLeft = document.createElement('i');
    bottomLeft.className = 'bottom-left';
    var rightTop = document.createElement('i');
    rightTop.className = 'right-top';
    var rightBottom = document.createElement('i');
    rightBottom.className = 'right-bottom';
    var topRight = document.createElement('i');
    topRight.className = 'top-right';
    var bottomRight = document.createElement('i');
    bottomRight.className = 'bottom-right';
    pup_container.appendChild(leftTop);
    pup_container.appendChild(leftBottom);
    pup_container.appendChild(topLeft);
    pup_container.appendChild(bottomLeft);
    pup_container.appendChild(rightBottom);
    pup_container.appendChild(rightTop);
    pup_container.appendChild(topRight);
    pup_container.appendChild(bottomRight);
    var overlay = undefined;
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    pup_closer.onclick = function () {
        overlay.setPosition(undefined);
        pup_closer.blur();
        if (options.colseCallback) {
            options.colseCallback();
        }
        if (mygis.VectorLayers['popup-' + name]) {
            mygis.map.removeLayer(mygis.VectorLayers['popup-' + name]);
            // mygis.VectorLayers['popup-' + name].getSource().clear();
        }
        mygis.map.removeOverlay(overlay);
        return false;
    };
    if (name) {
        overlay = mygis.map.getOverlayById(name);
        if (overlay) {
            mygis.map.removeOverlay(overlay);
        }
        overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            element: pup_container,
            id: name,
            autoPan: true,
            offset: [0, -14],
            autoPanAnimation: {
                duration: 250
            }
        }));
    }
    // else {
    //     overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    //         element: pup_container,
    //         autoPan: true,
    //         offset: [0, -14],
    //         autoPanAnimation: {
    //             duration: 250
    //         }
    //     }));
    // }

    mygis.map.addOverlay(overlay);


    if (lon == undefined || lat == undefined) {
        lon = mygis.map.getView().getCenter()[0];
        lat = mygis.map.getView().getCenter()[1];
    } else {
        var lonlat = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
        lon = lonlat[0];
        lat = lonlat[1];
    }
    // if (title) {
    //     msghtml = '<div class="ol-popup-content-title">' + title + '</div><div style="padding: 15px;">'
    //         + msghtml + '</div>';
    // }
    pup_content.innerHTML = msghtml;
    overlay.setPosition([lon, lat]);
    if (mygis.VectorLayers['popup-' + name]) {
        mygis.map.removeLayer(mygis.VectorLayers['popup-' + name]);
    }
    var source = new ol.source.Vector();
    var styleFunction = function (feature) {
        var geometry = feature.getGeometry();
        var styles = [
            // linestring
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#00a0e9',
                    width: 2
                })
            })
        ];

        geometry.forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                // image: new ol.style.Icon({
                //     src: 'https://openlayers.org/en/v3.20.1/examples/data/arrow.png',
                //     anchor: [0.75, 0.5],
                //     rotateWithView: true,
                //     rotation: -rotation
                // })
            }));
        });

        return styles;
    };
    mygis.VectorLayers['popup-' + name] = new ol.layer.Vector({
        source: source,
        style: styleFunction,
        zIndex: 21
    });
    mygis.map.addLayer(mygis.VectorLayers['popup-' + name]);
    $(pup_container).height($(pup_container).height());
    $(pup_container).parent().draggable({
        handle: '.ol-popup>p.ol-popup-title',
        revert: false,
        onDrag: function (ev) {
            // var left = $(pup_container).position().left + 40;
            // var top = $(pup_container).position().top;
            // var height = $(pup_container).height();
            // var bottom = top + height;
            // var dx = left;
            // var dy = -bottom;
            // var rotation = 90 - Math.atan2(dy, dx) * 180 / Math.PI;
            // var length = Math.sqrt(Math.abs(dy) * Math.abs(dy) + Math.abs(dx) * Math.abs(dx));
            // console.log($(pup_container).parent().position());
            // console.log($(pup_container).position());
            source.clear();
            source.addFeatures([new ol.Feature({
                geometry: new ol.geom.LineString([mygis.map.getCoordinateFromPixel([$(pup_container).parent().position().left + 50 + $(pup_container).position().left,
                    $(pup_container).parent().position().top + $(pup_container).position().top + $(pup_container).height()])
                    , [lon, lat]
                ])
            })]);
            // $(pup_container).find('style').remove();
            // $(pup_container).append("<style>" +
            //     "#ol-popup-"+name+":before {border-top-color: #00a0e9;left: 48px;margin-top:"+(dy-length)+"px;margin-left: "+(-11-dx)+"px;border-top-width: " +length+
            //     "px;border-bottom-width: "+length+"px;-webkit-transform: rotate("+rotation+"deg);}" +
            //     "</style>");
            // $(pup_container).append("<style>" +
            //     "#ol-popup-"+name+":after {border-top-color: #081e36;left: 48px;margin-top:"+(dy-length)+"px;margin-left: "+(-10-dx)+"px;border-top-width: " +(length-1)+
            //     "px;border-bottom-width: "+(length-1)+"px;-webkit-transform: rotate("+rotation+"deg);}" +
            //     "</style>");
            return true
        }
    });
}


mygis.removeAnim = function () {
    mygis.map.un('postcompose', mygis.funAnim);
}


mygis.moveBlind = function (id) {
    $.ajax({
        url: BACK_SERVER_URL + 'largeScreen/queryPortalBspotGridById',
        method: 'get',
        data: {order_id: id},
        success: function (data) {
            if (mygis.VectorLayers['blind_grid']) {
                mygis.VectorLayers['blind_grid'].getSource().clear();
                mygis.map.removeLayer(mygis.VectorLayers['blind_grid']);
                mygis.VectorLayers['blind_grid'] = undefined;
            }
            var popup = mygis.map.getOverlayById('blind');
            if (popup) {
                mygis.map.removeOverlay(popup);
            }
            popup = mygis.map.getOverlayById('warehouse');
            if (popup) {
                mygis.map.removeOverlay(popup);
            }

            mygis.showWarning(data[0].lon, data[0].lat, function () {
                mygis.hideSector();
                mygis.moveCenter(data[0].lon, data[0].lat, function () {
                    var features = new ol.Collection();
                    var bspot_grid = data[0].bspot_grid;

                    var grid_styles = {
                        '优': new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(0, 90, 255, 0)'
                            }),
                            stroke: new ol.style.Stroke({ //边界样式
                                color: 'rgba(0, 90, 255, 1)',
                                lineDash: [4, 6],
                                width: 1
                            }),
                            text: new ol.style.Text({
                                text: "优",
                                font: "10px Arial bold",
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 1)'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#64ab90',
                                    width: 1
                                })
                            })
                        }),
                        '良': new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(121, 212, 225, 0)'
                            }),
                            stroke: new ol.style.Stroke({ //边界样式
                                color: 'rgba(121, 212, 225, 1)',
                                lineDash: [4, 6],
                                width: 1
                            }),
                            text: new ol.style.Text({
                                text: "良",
                                font: "10px Arial bold",
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 1)'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#64ab90',
                                    width: 1
                                })
                            })
                        }),
                        '中': new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 1, 0)'
                            }),
                            stroke: new ol.style.Stroke({ //边界样式
                                color: 'rgba(255, 255, 1, 1)',
                                lineDash: [4, 6],
                                width: 1
                            }),
                            text: new ol.style.Text({
                                text: "中",
                                font: "10px Arial bold",
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 1)'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#64ab90',
                                    width: 1
                                })
                            })
                        }),
                        '差': new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 0, 0, 0)'
                            }),
                            stroke: new ol.style.Stroke({ //边界样式
                                color: 'rgba(255, 0, 0, 1)',
                                lineDash: [4, 6],
                                width: 1
                            }),
                            text: new ol.style.Text({
                                text: "差",
                                font: "10px Arial bold",
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 1)'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#64ab90',
                                    width: 1
                                })
                            })
                        })
                    };
                    for (var i in bspot_grid) {
                        var grid = bspot_grid[i];
                        var longitude_left_up = grid.longitude_left_up;
                        var latitude_left_up = grid.latitude_left_up;
                        var longitude_right_down = grid.longitude_right_down;
                        var latitude_right_down = grid.latitude_right_down;

                        if (longitude_left_up && latitude_left_up && longitude_right_down && latitude_right_down) {
                            // var lonlatup = ExtendUtil.gps84ToGcj02(longitude_left_up, latitude_left_up);
                            // var lonlatdown = ExtendUtil.gps84ToGcj02(longitude_right_down, latitude_right_down);
                            var lonlatup_change = ol.proj.transform([longitude_left_up, latitude_left_up], 'EPSG:4326', 'EPSG:3857');
                            var lonlatdown_change = ol.proj.transform([longitude_right_down, latitude_right_down], 'EPSG:4326', 'EPSG:3857');
                            var coordinate2 = [lonlatup_change[0], lonlatdown_change[1]];
                            var coordinate4 = [lonlatdown_change[0], lonlatup_change[1]];
                            var polygon = new ol.geom.Polygon([[lonlatup_change, coordinate2, lonlatdown_change, coordinate4, lonlatup_change]]);
                            var geom = new ol.geom.Point(lonlatup_change)
                            var level = '差';
                            if (grid.grid_rsrp < -115) {
                                level = '差';
                            } else if (grid.grid_rsrp < -110) {
                                level = '中';
                            } else if (grid.grid_rsrp < -105) {
                                level = '良';
                            } else {
                                level = '优';
                            }
                            var feature = new ol.Feature({
                                geometry: polygon,
                                level: level
                            });
                            features.push(feature);
                        }
                    }

                    mygis.VectorLayers['blind_grid'] = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: features
                        }),
                        style: function (feature) {
                            return grid_styles[feature.get('level')]
                        },
                        zIndex: 11,
                        maxResolution: mygis.minResolution
                    });
                    mygis.map.addLayer(mygis.VectorLayers['blind_grid']);

                    var f0 = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([data[0].p08, data[0].p09], 'EPSG:4326', 'EPSG:3857')),
                        data: data[0]
                    });

                    f0.on('click', function (evt) {
                        var popup = mygis.map.getOverlayById('blind');
                        var data = evt.target.get('data');
                        if (popup == undefined) {
                            var htmlmsg = '<div><table>'
                                + '<tr><td class="ol-popup-content-table-left-justify">收 益 完 成 率:</td><td>' + data.p15 + '%</td></tr>'
                                + '<tr><td class="ol-popup-content-table-left-justify">是否派单:</td><td>' + (data.p01 ? data.order_id : '否') + '</td></tr>'
                                + '<tr><td class="ol-popup-content-table-left-justify">需求提出时间:</td><td>' + data.p02 + '</td></tr>'
                                + '<tr><td class="ol-popup-content-table-left-justify">建设完成时间:</td><td>' + data.p03 + '</td></tr>'
                                + '<tr><td class="ol-popup-content-table-left-justify">承诺收益周期:</td><td>' + data.p04 + '天</td></tr>'
                                + '<tr><td class="ol-popup-content-table-left-justify">实际周期:</td><td>' + data.p05 + '天</td></tr>'
                                + '<tr><td class="ol-popup-content-table-left-justify">承诺收入:</td><td>' + data.p06 + '万元</td></tr>'
                                + '<tr><td class="ol-popup-content-table-left-justify">实际收入:</td><td>' + data.p07 + '万元</td></tr>'
                                + '</table></div><div class="ol-popup-content-btn"><div class="ol-popup-content-btn-left"></div>' +
                                '<div  class="ol-popup-content-btn-center">预警</div><div class="ol-popup-content-btn-right"></div>';
                            mygis.addpopup({
                                name: 'blind',
                                title: '盲点ID:' + data.bspot_id,
                                lon: data.lon,
                                lat: data.lat,
                                msghtml: htmlmsg
                            });
                        }
                        // else if(popup.getPosition()==undefined){
                        //     var lon = data.lon;
                        //     var lat = data.lat;
                        //     if (lon == undefined || lat == undefined) {
                        //         lon = mygis.map.getView().getCenter()[0];
                        //         lat = mygis.map.getView().getCenter()[1];
                        //     } else {
                        //         var lonlat = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
                        //         lon = lonlat[0];
                        //         lat = lonlat[1];
                        //     }
                        //     popup.setPosition([lon,lat]);
                        // }
                        else {
                            $(popup.getElement()).find('.ol-popup-closer').click();
                        }
                    });
                    f0.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: './resource/image/ic_blind_0.png',
                            anchor: [0.5, 0.5]    // 设置图标位置
                        })
                    }));

                    var f1 = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([data[0].p10, data[0].p11], 'EPSG:4326', 'EPSG:3857'))
                    });
                    f1.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: './resource/image/ic_blind_1.png',
                            anchor: [0.5, 0.5]    // 设置图标位置
                        })
                    }));
                    var f2 = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([data[0].p12, data[0].p13], 'EPSG:4326', 'EPSG:3857'))
                    });
                    f2.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: './resource/image/ic_blind_2.png',
                            anchor: [0.5, 0.5]    // 设置图标位置
                        })
                    }));
                    var warehouse = data[0].warehouse[0];
                    var ff0 = new ol.Feature({
                        geometry: new ol.geom.LineString([ol.proj.transform([data[0].p08, data[0].p09], 'EPSG:4326', 'EPSG:3857')
                            , ol.proj.transform([data[0].p10, data[0].p11], 'EPSG:4326', 'EPSG:3857'),
                            ol.proj.transform([data[0].p12, data[0].p13], 'EPSG:4326', 'EPSG:3857'),
                            ol.proj.transform([data[0].p08, data[0].p09], 'EPSG:4326', 'EPSG:3857'),
                            ol.proj.transform([data[0].lon, data[0].lat], 'EPSG:4326', 'EPSG:3857'),
                            ol.proj.transform([warehouse.lon, warehouse.lat], 'EPSG:4326', 'EPSG:3857')
                        ])
                    });
                    var f3 = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([warehouse.lon, warehouse.lat], 'EPSG:4326', 'EPSG:3857')),
                        data: warehouse
                    });
                    f3.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: './resource/image/ic_gis_blind_ck.png',
                            anchor: [0.5, 0.5]    // 设置图标位置
                        })
                    }));

                    f3.on('click', function (evt) {
                        var popup = mygis.map.getOverlayById('warehouse');
                        var data = evt.target.get('data');
                        if (popup == undefined) {
                            var htmlmsg = '<div"><table class="easyui-datagrid">\n' +
                                '    <thead>\n' +
                                '\t\t<tr>\n' +
                                '\t\t\t<th style="width: 60px;text-align: left">品牌:</th>\n' +
                                '\t\t\t<th style="width: 60px;text-align: left">华为</th>\n' +
                                '\t\t\t<th style="width: 60px;text-align: left">中兴</th>\n' +
                                '\t\t\t<th style="width: 60px;text-align: left">诺基亚</th>\n' +
                                '\t\t</tr>\n' +
                                '    </thead>\n' +
                                '    <tbody>\n';
                            htmlmsg += '<tr>\n' +
                                '\t\t\t<td data-options="width:100,align:\'left\'">待入库:</td><td data-options="width:100,align:\'left\'">' + data.p01 + '个</td><td data-options="width:100,align:\'left\'">' + data.p02 + '个</td><td data-options="width:100,align:\'left\'">' + data.p03 + '个</td>\n'
                            '\t\t</tr>';
                            htmlmsg += '<tr>\n' +
                                '\t\t\t<td data-options="width:100,align:\'left\'">库存:</td><td data-options="width:100,align:\'left\'">' + data.p04 + '个</td><td data-options="width:100,align:\'left\'">' + data.p05 + '个</td><td data-options="width:100,align:\'left\'">' + data.p06 + '个</td>\n'
                            '\t\t</tr>';
                            htmlmsg += '</tbody></table></div>';
                            mygis.addpopup({
                                name: 'warehouse',
                                title: data.warehouse_name,
                                lon: data.lon,
                                lat: data.lat,
                                msghtml: htmlmsg
                            });
                        } else {
                            $(popup.getElement()).find('.ol-popup-closer').click();
                        }
                    });
                    var f4 = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([(warehouse.lon + data[0].lon) / 2, (warehouse.lat + data[0].lat) / 2], 'EPSG:4326', 'EPSG:3857'))
                    });
                    f4.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: './resource/image/ic_gis_blind_car.png',
                            anchor: [0.5, 0.5]    // 设置图标位置
                        })
                    }));

                    var fs = new ol.Collection();
                    fs.push(ff0);
                    fs.push(f0);
                    fs.push(f1);
                    fs.push(f2);
                    fs.push(f3);
                    fs.push(f4);
                    if (mygis.VectorLayers['blind_point']) {
                        mygis.VectorLayers['blind_point'].getSource().clear();
                        mygis.map.removeLayer(mygis.VectorLayers['blind_point']);
                        mygis.VectorLayers['blind_point'] = undefined;
                    }

                    mygis.VectorLayers['blind_point'] = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: fs
                        }),
                        style: new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: '#e6bc2f',
                                width: 3
                            })
                        }),
                        zIndex: 12,
                        maxResolution: mygis.minResolution
                    });
                    mygis.map.addLayer(mygis.VectorLayers['blind_point']);
                    f3.dispatchEvent('click', {target: f3});
                    setTimeout(function () {
                        f0.dispatchEvent('click', {target: f0});
                    }, 1500);
                });

            });
        }
    });
}

/**
 * 选中nps加载nps数据
 * @param evt
 */
mygis.selectListener = function (evt) {
    var event = evt;
    var view = event.map.getView();
    var target = event.map.getTarget();
    var mapIndex = $(target).parent().index() + 1;
    var viewProjection = view.getProjection();
    var viewResolution = view.getResolution();
    if (viewResolution > mygis.minResolution) {
        return;
    }
    mygis.currentEvt = event;
    setTimeout(function () {
        if (mygis.currentEvt === event) {
            mygis.currentEvt = undefined;
            var pixel = mygis.map.getEventPixel(evt.originalEvent);
            mygis.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                if (layer == mygis.layers['gisorder']) {
                    mygis.showWarn(feature.get('features')[0].get('data'));
                } else if (layer == mygis.layers['nps-cluster1'] || layer == mygis.layers['nps-cluster3'] || layer == mygis.layers['nps-cluster4']) {
                    var coordinate = feature.getGeometry().getCoordinates();
                    coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
                    var data = [];
                    var features = feature.getProperties().features;
                    if(features.length > 0){
                        for (var i = 0; i < features.length; i++) {
                            var value = features[i].getProperties().value;
                            data.push(value);
                        }
                    }
                    mygis.showNpsTips(data, coordinate[0], coordinate[1]);
                }
            }, {
                layerFilter: function (layer) {
                    return true;
                }
            });
        }
    }, 1500);//表示悬停1.5s才表示选中
}

mygis.showHeatmap = function (name, data, show, data_tag) {
    if (mygis.Heatmap[name] == undefined) {
        var features = new ol.Collection();
        var wkt = new ol.format.WKT();
        for (var i = 0; i < data.length; i++) {
            if(data[i].wkt==undefined) {
                continue;
            }
            var feature = new ol.Feature({
                geometry: wkt.readGeometry(data[i].wkt, {
                    dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
                }),
                weight: data[i].weight,
                data: data[i]
            });
            if (mygis.cityId == 0 || mygis.cityId == 650) {
                feature.set('weight', feature.get('data').weight);
            } else if (mygis.cityId > 650 && mygis.cityId < 65000) {
                if (feature.get('data').city_id == mygis.cityId) {
                    feature.set('weight', feature.get('data').weight);
                } else {
                    feature.set('weight', 0);
                }
            } else {
                if (feature.get('data').district_id == mygis.cityId) {
                    feature.set('weight', feature.get('data').weight);
                } else {
                    feature.set('weight', 0);
                }
            }
            features.push(feature);
        }
        mygis.Heatmap[name] = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                features: features
            }),
            blur: 2,
            radius: 4,
            minResolution: mygis.minResolution,
            style:new function (feature) {
                return new ol.style.Style({
                    fill:new ol.style.Fill({
                        color: 'rbga(255,0,0,0)'
                    })
                })
            },
            zIndex: 22,
            data_tag: data_tag
        });
        mygis.map.addLayer(mygis.Heatmap[name]);
    } else {
        mygis.Heatmap[name].getSource().clear();
        var features = new ol.Collection();
        var wkt = new ol.format.WKT();
        for (var i = 0; i < data.length; i++) {
            if(data[i].wkt==undefined) {
                continue;
            }
            var feature = new ol.Feature({
                geometry: wkt.readGeometry(data[i].wkt, {
                    dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
                }),
                weight: data[i].weight,
                data: data[i]
            });
            if (mygis.cityId == 0 || mygis.cityId == 650) {
                feature.set('weight', feature.get('data').weight);
            } else if (mygis.cityId > 650 && mygis.cityId < 65000) {
                if (feature.get('data').city_id == mygis.cityId) {
                    feature.set('weight', feature.get('data').weight);
                } else {
                    feature.set('weight', 0);
                }
            } else {
                if (feature.get('data').district_id == mygis.cityId) {
                    feature.set('weight', feature.get('data').weight);
                } else {
                    feature.set('weight', 0);
                }
            }
            features.push(feature);
            mygis.Heatmap[name].getSource().addFeature(feature);
        }

    }

    if (mygis.Heatmap[name].getVisible() != show) {
        mygis.Heatmap[name].setVisible(show);
    }
}

/**
 * 显示NPS提示框
 */
mygis.showNpsTips = function (data, lon, lat) {
    var htmlmsg = '<table>\n' +
        '    <thead>\n' +
        '\t\t<tr>\n' +
        '\t\t\t<th style="width: 80px;text-algin: center;">用户号码</th>\n' +
        '\t\t\t<th style="width: 50px;text-algin: center;">得分</th>\n' +
        '\t\t\t<th style="width: 100px;text-algin: center;">贬损原因</th>\n' +
        '\t\t</tr>\n' +
        '    </thead>\n' +
        '    <tbody>\n';
    for (var i = 0; i < data.length; i++) {
        var str = '';
        if (data[i].q2_111) {
            str += data[i].q2_111 + ';';
        }
        if (data[i].q2_112) {
            str += data[i].q2_112 + ';';
        }
        if (data[i].q2_121) {
            str += data[i].q2_121 + ';';
        }
        if (data[i].q2_122) {
            str += data[i].q2_122 + ';';
        }
        if (data[i].q2_131) {
            str += data[i].q2_131 + ';';
        }
        if (data[i].q2_132) {
            str += data[i].q2_132 + ';';
        }
        if (data[i].q2_133) {
            str += data[i].q2_133 + ';';
        }
        htmlmsg += '<tr>\n' +
            '\t\t\t<td style="vertical-align: top;">' + mygis.desensitization(data[i].msisdn) + '</td><td style="text-align: center;vertical-align: top;">' + data[i].nps_score + '</td><td>' + str + '</td>\n' +
            '\t\t</tr>';
    }
    htmlmsg += '</tbody></table>';
    mygis.addpopup({
        name: 'nps',
        title: 'NPS用户贬损信息',
        lon: lon,
        lat: lat,
        msghtml: htmlmsg
    });
}
/**
 * 电话号码脱敏
 * @param msisdn
 * @returns {*}
 */
mygis.desensitization = function (msisdn) {
    if (msisdn) {
        return msisdn.toString().substr(0, 3) + '****' + msisdn.toString().substr(7);
    } else {
        return '';
    }
}

/**
 * 将地图中心移动到指定的经纬度
 * @param lon
 * @param lat
 */
mygis.moveCenter = function (lon, lat, endfun) {
    mygis.map.getView().animate({
        zoom: 16, center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
        easing: function (i) {
            if (i == 1) {
                if (endfun) {
                    endfun();
                }
            }
            return i;
        }
    });
    mygis.selectCity(lon, lat);
}

/**
 * 加载九空格数据到地图上
 *  @param id 盲点id
 */
mygis.add9Grids = function (id) {
    // 由于接口还没写，此处写接口的url
    var url = "";
    // 由于接口还没写，此处写接口的参数
    var params = {};
    $.ajax({
        url: url,
        method: 'get',
        data: params,
        success: function (data) {
            if (sefl.selfeature)
                sefl.vector.getSource().clear();
            else {
                sefl.vector = new ol.layer.Vector({
                    source: new ol.source.Vector()
                });
                mygis.map.addLayer(sefl.vector);
            }
            var wktFormat = new ol.format.WKT();
            for (var i = 0; i < data.length; i++) {
//				if (i == 0)
//					locationMap(data[i].longitude, data[i].latitude);
                var geom = data[i].geom;
                var feature = null;
                feature = new ol.Feature({
                    geometry: wktFormat.readGeometry(geom).transform(
                        "EPSG:4326", "EPSG:3857"),
                    data: data[i]
                });
                /* 此处根据feature的rsrp_avg值来动态设置style的边框颜色
                 * feature.setStyle(style);
                 *
                */
                sefl.vector.getSource().addFeature(feature);
            }
        }
    });
}
/**
 * 判断地图左侧图层按钮是否可以多选（当缩放级别小的时候显示热力图，只支持单选；放大到一定级别时，显示详细图层，可以多选）
 *
 * @returns {boolean}
 */
mygis.isMultiChoice = function () {
    var view = mygis.map.getView();
    var viewResolution = view.getResolution();
    if (viewResolution > mygis.maxResolution) {
        return false;
    } else {
        return true;
    }
}

/**
 * 判断地图左侧图层按钮是否可以多选（当选中电信、移动、联通时为多选，当选中其他项时为单选）
 * @returns {boolean}
 */
mygis.isMultiChoice1 = function (filter) {
    var result = false;
    if (filter == 'showTelecomCover') {//电信
        result = true;
    } else if (filter == 'showMobileCover') {//移动
        result = true;
    } else if (filter == 'showUnicomCover') {//联通
        result = true;
    }

    return result;
}

var str2Unicode = function (str) {
    var es = [];
    for (var i = 0; i < str.length; i++)
        es[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u" + es.join("\\u");
}
/**
 * 切换基础基站图层显示（0:正常、1:预警、2:故障）
 * @param filter 实例'(0,1,2)'表示全部都显示'(-1)'表示全部不显示'(1)'表示只显示预警基站
 */
mygis.changeBaseSector = function (filter) {
    var name = 'base';
    var month_no = mygis.datetime[name].format('yyyyMM');
    if (mygis.layers[name] == undefined) {
        mygis.layers[name] = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                urls: geoserverUrls,
                params: {
//                    'LAYERS': 'neto:dm_base_cell_flag_' + month_no,
                    'LAYERS': 'neto:dm_base_cell_flag_201812',
                    'TILED': true,
                    VERSION: '1.1.0',
                    'TRANSPARENT': true,
                    CQL_FILTER: 'flag in (0,1,2)'
                },
                serverType: 'geoserver'
            }),
            maxResolution: mygis.maxResolution,
            zIndex: 3,
            name: 'baseSector',
            type: 'month_no',
            selectable: true
        });
        mygis.map.addLayer(mygis.layers[name]);
    }
    var params = mygis.layers[name].getSource().getParams();
    params.CQL_FILTER = 'flag in ' + filter;
    mygis.layers[name].getSource().updateParams(params);
}

mygis.changeLayerCity = function (id) {
    for (var layername in mygis.layers) {
        var layer = mygis.layers[layername];
        if (layer.getSource() instanceof ol.source.TileWMS) {
            var params = layer.getSource().getParams();
            var ind = params.CQL_FILTER.indexOf('city_id');
            if(params.LAYERS.indexOf("operator_compare2_d")>-1) {
                continue;
            }
            var s = '';
            if (ind == -1) {
                ind = params.CQL_FILTER.indexOf('district_id');
                if (ind == -1) {

                } else {
                    s = params.CQL_FILTER.substr(ind);
                    var i = s.indexOf("and");
                    if (i > -1) {
                        s = s.substr(i);
                    } else {
                        s = '';
                    }
                }
            } else {
                s = params.CQL_FILTER.substr(ind);
                var i = s.indexOf("and");
                if (i > -1) {
                    s = s.substr(i);
                } else {
                    s = '';
                }
            }
            var str = '';
            if (id == 0 || id == 650) {
                str = ' 1=1';
            } else if (id > 650 && id < 65000) {
                str = ' city_id = ' + id;
            } else {
                str = ' district_id = ' + id;
            }
            if (ind > -1) {
                params.CQL_FILTER = params.CQL_FILTER.substr(0, ind) + str + ' ' + s;
            } else {
                params.CQL_FILTER = params.CQL_FILTER + ' and' + str + ' ' + s;
            }
            layer.getSource().updateParams(params);
        }
    }
    for (var name in mygis.Heatmap) {
        var features = mygis.Heatmap[name].getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            if (id == 0 || id == 650) {
                feature.set('weight', feature.get('data').weight);
            } else if (id > 650 && id < 65000) {
                if (feature.get('data').city_id == id) {
                    feature.set('weight', feature.get('data').weight);
                } else {
                    feature.set('weight', 0);
                }
            } else {
                if (feature.get('data').district_id == id) {
                    feature.set('weight', 1);
                } else {
                    feature.set('weight', 0);
                }
            }
        }
    }
}

/**
 * 切换基础基站网络显示（2:23G、4:4G）
 * @param filter 实例'(2,4)'表示全部都显示'(2)'表示只显示23G'(4)'表示只显示4G基站
 */
mygis.changeNetwork = function (type) {
    var name = 'base';
    var params = mygis.layers[name].getSource().getParams();
    var ind = params.CQL_FILTER.indexOf('net_type');
    if (ind > -1) {
        params.CQL_FILTER = params.CQL_FILTER.substr(0, ind) + 'net_type in' + type;
    } else {
        params.CQL_FILTER = params.CQL_FILTER + ' and net_type in' + type;
    }
    mygis.layers[name].getSource().updateParams(params);
    if (mygis.layers[name].getVisible() != true) {
        mygis.layers[name].setVisible(true);
    }
}

mygis.getTileSize = function () {
    var projExtent = ol.proj.get('EPSG:3857').getExtent();
    var startResolution = ol.extent.getWidth(projExtent) / 256;
    var resolutions = new Array(22);
    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
    }
    var tile_size = 256 / window.devicePixelRatio;
    // tile_size = 256;
    var tileGrid = new ol.tilegrid.TileGrid({
        origin: projExtent,
        resolutions: resolutions,
        tileSize: [tile_size, tile_size]
    });
    return tileGrid;
}


/**
 * 显示基本基站图层（正常、预警、故障）
 * @param show true:显示，false：隐藏
 */
mygis.showBaseSector = function (show) {
    // var name='base';
    // var month_no = mygis.datetime[name].format('yyyyMM');
    // if (mygis.layers[name] == undefined) {
    //     mygis.layers[name] = new ol.layer.Tile({
    //         source: new ol.source.TileWMS({
    //             urls: geoserverUrls,
    //             params: {
    //                 'LAYERS': 'neto:dm_base_cell_flag_'+month_no,
    //                 'LAYERS': 'neto:dm_base_cell_flag_201812',
    //                 'TILED': true,
    //                 VERSION: '1.1.0',
    //                 'TRANSPARENT': true,
    //                 CQL_FILTER: 'flag in (0,1,2)'
    //             },
    //             serverType: 'geoserver'
    //         }),
    //         maxResolution: mygis.maxResolution,
    //         zIndex: 13,
    //         name: 'baseSector',
    //         type:'month_no',
    //         selectable: true,
    //         opacity: 0.5
    //     });
    //     mygis.map.addLayer(mygis.layers[name]);
    // }
    // if (mygis.layers[name].getVisible() != show) {
    //     mygis.layers[name].setVisible(show)
    // }
}

/**
 * 显示电信覆盖图层
 * @param show true:显示，false：隐藏
 */
mygis.showTelecomCover = function (show) {
    mygis.TelecomShow = show;
    var name = 'ct';
    var day_no = mygis.datetime[name].format('yyyyMMdd');
    var hour_no = mygis.datetime[name].format('yyyyMMddHH');

    //不显示的优化加速
    if(show == false){
        if (mygis.layers[name]) {
            mygis.layers[name].setVisible(show);
        }

        if (mygis.Heatmap[name + "-1"]){
            mygis.Heatmap[name + "-1"].setVisible(show);
        }
        if (mygis.Heatmap[name + "-2"]){
            mygis.Heatmap[name + "-2"].setVisible(show);
        }

        if (mygis.Heatmap[name + "-3"]){
            mygis.Heatmap[name + "-3"].setVisible(show);
        }
        return;
    }

    if (!mygis.HeatmapData[name + '-' + hour_no]) {
        mygis.startLoading();
        $.ajax({
            url: BACK_SERVER_URL + "gisController/queryCtRsrp",
            method: 'get',
            data: {day_no: day_no},
            success: function (data) {
                mygis.endLoading();
                mygis.showRsrpRateHeatmap(name, data, show);
                mygis.HeatmapData[name + '-' + hour_no] = data;
                mygis.showRsrpRate(name, mygis.HeatmapData[name + '-' + hour_no], show);
            }
        });
    } else {
        mygis.showRsrpRateHeatmap(name, mygis.HeatmapData[name + '-' + hour_no], show);
        mygis.showRsrpRate(name, mygis.HeatmapData[name + '-' + hour_no], show);
    }
}

/**
 * 显示移动覆盖图层
 * @param show true:显示，false：隐藏
 */
mygis.showMobileCover = function (show) {
    mygis.MobileShow = show
    var name = 'cm';
    var day_no = mygis.datetime[name].format('yyyyMMdd');
    var hour_no = mygis.datetime[name].format('yyyyMMddHH');

    //不显示的优化加速
    if(show == false){
        if (mygis.layers[name]) {
            mygis.layers[name].setVisible(show);
        }

        if (mygis.Heatmap[name + "-1"]){
            mygis.Heatmap[name + "-1"].setVisible(show);
        }
        if (mygis.Heatmap[name + "-2"]){
            mygis.Heatmap[name + "-2"].setVisible(show);
          }
        if (mygis.Heatmap[name + "-3"]){
            mygis.Heatmap[name + "-3"].setVisible(show);
        }
        return;
    }

    if (!mygis.HeatmapData[name + '-' + hour_no]) {
        mygis.startLoading();
        $.ajax({
            url: BACK_SERVER_URL + "gisController/queryCmRsrp",
            method: 'get',
            data: {day_no: day_no},
            success: function (data) {
                mygis.endLoading();
                mygis.showRsrpRateHeatmap(name, data, show);
                mygis.HeatmapData[name + '-' + hour_no] = data;
                mygis.showRsrpRate(name, mygis.HeatmapData[name + '-' + hour_no], show);
            }
        });
    } else {
        mygis.showRsrpRateHeatmap(name, mygis.HeatmapData[name + '-' + hour_no], show);
        mygis.showRsrpRate(name, mygis.HeatmapData[name + '-' + hour_no], show);
    }

}

/**
 * 显示联通覆盖图层
 * @param show true:显示，false：隐藏
 */
mygis.showUnicomCover = function (show) {
    mygis.UnicomShow = show;
    var name = 'cu';
    var day_no = mygis.datetime[name].format('yyyyMMdd');
    var hour_no = mygis.datetime[name].format('yyyyMMddHH');

    //不显示的优化加速
    if(show == false){
        if (mygis.layers[name]) {
            mygis.layers[name].setVisible(show);
        }
        if (mygis.Heatmap[name + "-1"]){
            mygis.Heatmap[name + "-1"].setVisible(show);
        }
        if (mygis.Heatmap[name + "-2"]){
            mygis.Heatmap[name + "-2"].setVisible(show);
        }
        if (mygis.Heatmap[name + "-3"]){
            mygis.Heatmap[name + "-3"].setVisible(show);
        }
        return;
    }

    if (!mygis.HeatmapData[name + '-' + hour_no]) {
        mygis.startLoading();
        $.ajax({
            url: BACK_SERVER_URL + "gisController/queryCuRsrp",
            method: 'get',
            data: {day_no: day_no},
            success: function (data) {
                mygis.endLoading();
                mygis.showRsrpRateHeatmap(name, data, show);
                mygis.HeatmapData[name + '-' + hour_no] = data;
                mygis.showRsrpRate(name, mygis.HeatmapData[name + '-' + hour_no], show);
            }
        });
    } else {
        mygis.showRsrpRateHeatmap(name, mygis.HeatmapData[name + '-' + hour_no], show);
        mygis.showRsrpRate(name, mygis.HeatmapData[name + '-' + hour_no], show);
    }
}


/**
 * 显示rsrp_rate热力图（支局覆盖率>95% 绿色；90～95黄色；90以下：红色）
 * @param name 图层名
 * @param data 数据
 * @param show 是否显示
 */
mygis.showRsrpRateHeatmap = function (name,data,show){
    var layerName1 = name + "-1";//(95,+∞)
    var layerName2 = name + "-2";//(90,95]
    var layerName3 = name + "-3";//(-∞,90]
    var visible = show;
    //电信、移动、联通，在区县一级不显示热力图
    if((name == "ct" || name == "cm" || name == "cu") && app.getCurrentLevelByCodeLength(mygis.cityId) == 3){
        visible = false;
    }

    if(!mygis.Heatmap[layerName1]){
        mygis.Heatmap[layerName1] = new ol.layer.Heatmap({
            source: new ol.source.Vector(),
            blur: 6,
            radius: 2,
            minResolution: mygis.minResolution,
            style:new function (feature) {
                return new ol.style.Style({
                    fill:new ol.style.Fill({
                        color: 'rbga(63,212,68,0)'//绿色
                    })
                })
            },
            gradient: ['#0f0', '#0f0', '#0f0', '#0f0', '#0f0'],
            zIndex: 22,
            visible: visible
        });
        mygis.map.addLayer(mygis.Heatmap[layerName1]);
    }

    if(!mygis.Heatmap[layerName2]){
        mygis.Heatmap[layerName2] = new ol.layer.Heatmap({
            source: new ol.source.Vector(),
            blur: 6,
            radius: 2,
            minResolution: mygis.minResolution,
            style:new function (feature) {
                return new ol.style.Style({
                    fill:new ol.style.Fill({
                        color: 'rbga(255,235,59,0)'//黄色
                    })
                })
            },
            gradient: ['#ff0', '#ff0', '#ff0', '#ff0', '#ff0'],
            zIndex: 22,
            visible: visible
        });
        mygis.map.addLayer(mygis.Heatmap[layerName2]);
    }

    if(!mygis.Heatmap[layerName3]){
        mygis.Heatmap[layerName3] = new ol.layer.Heatmap({
            source: new ol.source.Vector(),
            blur: 6,
            radius: 2,
            minResolution: mygis.minResolution,
            style:new function (feature) {
                return new ol.style.Style({
                    fill:new ol.style.Fill({
                        color: 'rbga(255,0,0,0)'//红色
                    })
                })
            },
            gradient: ['#f00', '#f00', '#f00', '#f00', '#f00'],
            zIndex: 22,
            visible: visible
        });
        mygis.map.addLayer(mygis.Heatmap[layerName3]);
    }


    mygis.Heatmap[layerName1].getSource().clear();
    mygis.Heatmap[layerName2].getSource().clear();
    mygis.Heatmap[layerName3].getSource().clear();

    mygis.Heatmap[layerName1].setVisible(visible);
    mygis.Heatmap[layerName2].setVisible(visible);
    mygis.Heatmap[layerName3].setVisible(visible);

    var features1 = [];
    var features2 = [];
    var features3 = [];
    var wkt = new ol.format.WKT();
    for (var i = 0; i < data.length; i++) {
        if(data[i].wkt==undefined) {
            continue;
        }
        var score = data[i].rsrp_rate;
        var feature = new ol.Feature({
            geometry: wkt.readGeometry(data[i].wkt, {
                dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
            }),
            weight: data[i].weight,
            data: data[i]
        });
        if (mygis.cityId == 0 || mygis.cityId == 650) {
            feature.set('weight', feature.get('data').weight);
        } else if (mygis.cityId > 650 && mygis.cityId < 65000) {
            if (feature.get('data').city_id == mygis.cityId) {
                feature.set('weight', feature.get('data').weight);
            } else {
                feature.set('weight', 0);
            }
        } else {
            if (feature.get('data').district_id == mygis.cityId) {
                feature.set('weight', feature.get('data').weight);
            } else {
                feature.set('weight', 0);
            }
        }

        if(score<=90) {
            features3.push(feature);
        } else if (score<=95) {
            features2.push(feature);
        } else{
            features1.push(feature);
        }
    }

     mygis.Heatmap[layerName1].getSource().addFeatures(features1);
     mygis.Heatmap[layerName2].getSource().addFeatures(features2);
     mygis.Heatmap[layerName3].getSource().addFeatures(features3);
}

/**
 * 显示rsrp_rate
 * @param name 图层名
 * @param data 数据
 * @param show 是否显示
 */
mygis.showRsrpRate = function (name,data,show) {
    var scoreObjs = {};
    for(var i=0;data && i < data.length; i++){
        scoreObjs[data[i].area_id] = data[i].rsrp_rate;
    }

    if(mygis.layers[name]==undefined) {
        mygis.layers[name] = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex:10,
//            maxResolution: mygis.maxResolution,
//            minResolution:1,
            style: mygis.getRsrpRateStyle
        });
        mygis.map.addLayer(mygis.layers[name]);
    }
    if (mygis.layers[name].getVisible() != show) {
        mygis.layers[name].setVisible(show);
    }

    mygis.layers[name].getSource().clear();
    if(mygis.cityData[mygis.cityId]) {
        var data = mygis.cityData[mygis.cityId];
        var wktformat = new ol.format.WKT();
        if (data.districts) {
            for (var i = 0; i < data.districts.length; i++) {
                var score = scoreObjs[data.districts[i].id];
                if (data.districts[i].wkt && score) {
                    var geometry = wktformat.readGeometry(data.districts[i].wkt, {
                        dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
                    });
                    var feature = new ol.Feature({
                        geometry: geometry,
                        name: data.districts[i].name,
                        id: data.districts[i].id,
                        pid: data.districts[i].pid,
                        level: data.districts[i].level,
                        score: score,
                        location: ol.proj.transform([data.districts[i].lon, data.districts[i].lat], 'EPSG:4326', 'EPSG:3857'),
                        bounds: [data.districts[i].min_lon, data.districts[i].min_lat, data.districts[i].max_lon, data.districts[i].max_lat],
                        isPoint: false
                    });
                    mygis.layers[name].getSource().addFeatures([feature]);
                    geometry = new ol.geom.Point(ol.proj.transform([data.districts[i].lon, data.districts[i].lat], 'EPSG:4326', 'EPSG:3857'));
                    feature = new ol.Feature({
                        geometry: geometry,
                        score: score,
                        isPoint:true
                    });
                    mygis.layers[name].getSource().addFeatures([feature]);
                    geometry = new ol.geom.Point(ol.proj.transform([data.districts[i].lon, data.districts[i].lat], 'EPSG:4326', 'EPSG:3857'));
                    feature = new ol.Feature({
                        geometry: geometry,
                        score: score,
                        name:data.districts[i].name,
                        isText:true
                    });
                    mygis.layers[name].getSource().addFeatures([feature]);
                }
            }
        }
    }
}

/**
 * 获取rsrp_rate样式
 * @param feature
 */
mygis.getRsrpRateStyle = function(feature) {
    var score = feature.get('score');
    var isPoint = feature.get('isPoint');

    var colorStyleArr = {
                        0:{
                            valueTextStyle:{
                                textColor: '#0a3356',
                                fillColor: ["#f48f23",'#8ac790','#29fdfb']
                            },
                            areaTextStyle:{
                                fillColor: mygis.colors.city_sub_text[mygis.colorIndex]
                            },
                            areaGeomStyle:{
                                fillColor: ['#102155', '#1c3077', '#2c4cbb'],
                                strokeColor: ['#3596ee', '#3596ee', '#3596ee']
                            }
                        },
                        1:{
                            valueTextStyle:{
                                textColor: '#ffffff',
                                fillColor: ["#eb861a",'#eac42b','#49b148']
                            },
                            areaTextStyle:{
                                fillColor: mygis.colors.city_sub_text[mygis.colorIndex]
                            },
                            areaGeomStyle:{
                                fillColor: ['#c1dcf5', '#dceaf6', '#eaf5ff'],
                                strokeColor: ['#599cfd', '#599cfd', '#599cfd']
                            }
                        }
                    };

    var colorStyle = colorStyleArr[0];
    if(mygis.colorIndex){
        colorStyle = colorStyleArr[mygis.colorIndex];
    }

    if(isPoint) {
        var text_color = colorStyle.valueTextStyle.textColor;
        var fill_color = colorStyle.valueTextStyle.fillColor[2];
        if(score<=90) {
            fill_color = colorStyle.valueTextStyle.fillColor[0];
        } else if(score<=95) {
            fill_color = colorStyle.valueTextStyle.fillColor[1];
        } else {
            fill_color = colorStyle.valueTextStyle.fillColor[2];
        }
        return mygis.createRsrpRateRectStyle(score+'',fill_color,text_color)
    } else if(feature.get('isText')) {
        return new ol.style.Style({
            text: new ol.style.Text(
                {
                    text: feature.get('name'),
                    fill: new ol.style.Fill(
                        {
                            color: colorStyle.areaTextStyle.fillColor
                        }),
                    font: "12px 微软雅黑 ",
                    offsetY: 15    // 设置图标位置
                })
        })
    } else {
        var fill_color = colorStyle.areaGeomStyle.fillColor[2];
        var stroke_color = colorStyle.areaGeomStyle.strokeColor[2];
        if(score<=90) {
            fill_color = colorStyle.areaGeomStyle.fillColor[0];
            stroke_color = colorStyle.areaGeomStyle.strokeColor[0];
        } else if (score<=95) {
            fill_color = colorStyle.areaGeomStyle.fillColor[1];
            stroke_color = colorStyle.areaGeomStyle.strokeColor[1];
        } else{
            fill_color = colorStyle.areaGeomStyle.fillColor[2];
            stroke_color = colorStyle.areaGeomStyle.strokeColor[2];
        }
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: fill_color
            }),
            stroke:new ol.style.Stroke({
                color:stroke_color,
                width:1
            })
        })
    }
}
/**
 * 创建rsrp_rate值的样式
 * @param text 文字
 * @param color 底色
 * @param text_color 文字颜色
 */
mygis.createRsrpRateRectStyle = function(text,color,text_color) {
    var canvas, context, length;
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    length = text.length;
    canvas.width = length * 10;
    if(text.indexOf('.')>0) {
        canvas.width = canvas.width-5;
    } else {
        canvas.width = canvas.width+5;
    }
    canvas.height = 20;
    var x = 0, y = 0, w = canvas.width, h = canvas.height, r = 8;
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
    context.fillStyle = color;
    context.fill();
    var style = new ol.style.Style({
        image: new ol.style.Icon({
            img: canvas,
            imgSize: [w, h]
        }),
        text: new ol.style.Text({
            text: text,
            font: "bold 10px 微软雅黑 ",
            fill: new ol.style.Fill({ color: text_color })
        })
    });
    return style;
}

/**
 * 显示NPS图层
 * @param show true:显示，false：隐藏
 */
mygis.showNps = function (show) {
    var name = 'nps';
    var nameCluster1 = 'nps-cluster1';//推荐
    var nameCluster3 = 'nps-cluster3';//中立
    var nameCluster4 = 'nps-cluster4';//贬损
    var year_no = mygis.datetime[name].format('yyyy');
    var week_no = calculationWeek(mygis.datetime[name]);

    //不显示的优化加速
    if(show == false){
        if (mygis.Heatmap[name]) {
                mygis.Heatmap[name].setVisible(show);
        }
        if (mygis.layers[nameCluster1]) {
                mygis.layers[nameCluster1].setVisible(show);
        }
        if (mygis.layers[nameCluster3]) {
                mygis.layers[nameCluster3].setVisible(show);
        }
        if (mygis.layers[nameCluster4]) {
                mygis.layers[nameCluster4].setVisible(show);
        }
        return;
    }

    if (!mygis.HeatmapData[name + '-' + week_no]) {
        mygis.startLoading();
        $.ajax({
            url: BACK_SERVER_URL + "gisController/queryNpsInfo",
            method: 'get',
            data: {week_no: week_no},
            success: function (data) {
                mygis.endLoading();
                mygis.showHeatmap(name, data, show);
                mygis.HeatmapData[name + '-' + week_no] = data;
                mygis.loadNpsClusterLayer(data , show);
            }
        });
    } else {
        mygis.showHeatmap(name, mygis.HeatmapData[name + '-' + week_no], show);
        mygis.loadNpsClusterLayer(mygis.HeatmapData[name + '-' + week_no], show);
    }
}

/**
 * 加载NPS聚合图层
 */
mygis.loadNpsClusterLayer = function(data, show){
    var nameCluster1 = 'nps-cluster1';//推荐
    var nameCluster3 = 'nps-cluster3';//中立
    var nameCluster4 = 'nps-cluster4';//贬损

    var featuresCluster1 = [];
    var featuresCluster3 = [];
    var featuresCluster4 = [];

    var picCluster1 = "./resource/image/mapFilter/mapFilter_01.png";
    var picCluster3 = "./resource/image/mapFilter/mapFilter_03.png";
    var picCluster4 = "./resource/image/mapFilter/mapFilter_04.png";

    if(data && data.length > 0){
        for(var i=0;i<data.length;i++){
            var wkt = data[i].wkt;
            var score = data[i].nps_score;
            var geometry = mygis.getGeometryByWkt(wkt);
            var feature = new ol.Feature({
                geometry: geometry,
                value: data[i]
            });
            if(score <= 10 && score > 7){//中立
                featuresCluster3.push(feature);
            } else if(score <= 7){//贬损
                featuresCluster4.push(feature);
            } else {//推荐
                featuresCluster1.push(feature);
            }
        }
    }
    mygis.createClusterLayer(nameCluster1,featuresCluster1,picCluster1, show);
    mygis.createClusterLayer(nameCluster3,featuresCluster3,picCluster3, show);
    mygis.createClusterLayer(nameCluster4,featuresCluster4,picCluster4, show);
}

/**
 * 显示画像
 * @param show
 */
mygis.showPerception = function (show) {
    var name = 'perception';
    mygis.PerceptionShow = show;
    var params = {areaId: null,level: null}
    params.areaId = mygis.cityId;
    params.level = app.getCurrentLevelByCodeLength(mygis.cityId) - 1;//层默认级减一

     //不显示的优化加速
    if(show == false){
        if (mygis.layers[name]) {
                mygis.layers[name].setVisible(show);
                mygis.clearPerceptionRect();
        }
        return;
    }
    mygis.startLoading();
    $.ajax({
            url: BACK_SERVER_URL + "portrayController/getGisPortray",
            method: 'get',
            data: params,
            success: function (data) {
                mygis.endLoading();
                var scoreObjs = {};
                for(var i=0;data && i < data.length; i++){
                    if(data[i].data_level == 1){
                        scoreObjs[data[i].city_id] = data[i].move_score;
                    } else if(data[i].data_level == 2){
                        scoreObjs[data[i].district_id] = data[i].move_score;
                    } else if(data[i].data_level == 3){
                        scoreObjs[data[i].area_id] = data[i].move_score;
                    }
                }
                mygis.drawPerceptionByData(name,scoreObjs, show);
            }
        });
}

/**
 * 根据数据绘制画像
 * @param show
 */
mygis.drawPerceptionByData = function(name, scoreObjs, show){
    if(mygis.layers[name]==undefined) {
        mygis.layers[name] = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex:11,
            style: mygis.getPerceptionStyle
        });
        mygis.map.addLayer(mygis.layers[name]);
    }
    if (mygis.layers[name].getVisible() != show) {
        mygis.layers[name].setVisible(show);
    }
    mygis.layers[name].getSource().clear();
    mygis.clearPerceptionRect();
    if(mygis.cityData[mygis.cityId]) {
        var data = mygis.cityData[mygis.cityId];
        var wktformat = new ol.format.WKT();
        if (data.districts) {
            for (var i = 0; i < data.districts.length; i++) {
                if (data.districts[i].wkt) {

                    var geometry = wktformat.readGeometry(data.districts[i].wkt, {
                        dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
                    });
                    var perception = scoreObjs[data.districts[i].id];
                    if(perception==undefined) {
                        perception = 0;
                    }
                    var feature = new ol.Feature({
                        geometry: geometry,
                        name: data.districts[i].name,
                        id: data.districts[i].id,
                        pid: data.districts[i].pid,
                        level: data.districts[i].level,
                        perception:perception,
                        location: ol.proj.transform([data.districts[i].lon, data.districts[i].lat], 'EPSG:4326', 'EPSG:3857'),
                        bounds: [data.districts[i].min_lon, data.districts[i].min_lat, data.districts[i].max_lon, data.districts[i].max_lat],
                        isPoint: false
                    });
                    mygis.layers[name].getSource().addFeatures([feature]);
                    geometry = new ol.geom.Point(ol.proj.transform([data.districts[i].lon, data.districts[i].lat], 'EPSG:4326', 'EPSG:3857'));
                    feature = new ol.Feature({
                        geometry: geometry,
                        perception: perception,
                        id: data.districts[i].id,
                        isPoint:true
                    });
                    mygis.layers[name].getSource().addFeatures([feature]);
                    geometry = new ol.geom.Point(ol.proj.transform([data.districts[i].lon, data.districts[i].lat], 'EPSG:4326', 'EPSG:3857'));
                    feature = new ol.Feature({
                        geometry: geometry,
                        perception: perception,
                        name:data.districts[i].name,
                        isText:true
                    });
                    mygis.layers[name].getSource().addFeatures([feature]);
                }
            }
        }
    }
}

/**
 * 获取画像样式
 * @param show
 */
mygis.getPerceptionStyle = function (feature) {
    var perception = feature.get('perception');
    var isPoint = feature.get('isPoint');
    var colorStyleArr = {
                        0:{
                            valueTextStyle:{
                                textColor: '#0a3356',
                                fillColor: ["#f48f23",'#8ac790','#29fdfb']
                            },
                            areaTextStyle:{
                                fillColor: mygis.colors.city_sub_text[mygis.colorIndex]
                            },
                            areaGeomStyle:{
                                fillColor: ['#102155', '#1c3077', '#2c4cbb'],
                                strokeColor: ['#3596ee', '#3596ee', '#3596ee']
                            }
                        },
                        1:{
                            valueTextStyle:{
                                textColor: '#ffffff',
                                fillColor: ["#eb861a",'#eac42b','#49b148']
                            },
                            areaTextStyle:{
                                fillColor: mygis.colors.city_sub_text[mygis.colorIndex]
                            },
                            areaGeomStyle:{
                                fillColor: ['#c1dcf5', '#dceaf6', '#eaf5ff'],
                                strokeColor: ['#599cfd', '#599cfd', '#599cfd']
                            }
                        }
                    };

    var colorStyle = colorStyleArr[0];

    if(mygis.colorIndex){
        colorStyle = colorStyleArr[mygis.colorIndex];
    }

    //画像值
    if(isPoint) {
        var text_color = colorStyle.valueTextStyle.textColor;
        var fill_color = colorStyle.valueTextStyle.fillColor[2];
        var point = feature.getGeometry();
        var areaId = feature.get('id');
        if(perception<85) {
            fill_color = colorStyle.valueTextStyle.fillColor[0];
        } else if(perception<88) {
            fill_color = colorStyle.valueTextStyle.fillColor[1];
        } else {
            fill_color = colorStyle.valueTextStyle.fillColor[2];
        }
        return mygis.creatPerceptionRect(perception+'',fill_color,text_color,point,areaId)
    }

    //区域名
    else if(feature.get('isText')) {
        return new ol.style.Style({
            text: new ol.style.Text(
                {
                    text: feature.get('name'),
                    fill: new ol.style.Fill(
                        {
                            color: colorStyle.areaTextStyle.fillColor
                        }),
                    font: "bold 12px 微软雅黑",
                    offsetY: 15    // 设置图标位置
                })
        })
    }

    //区域几何渲染
    else {
        var fill_color = colorStyle.areaGeomStyle.fillColor[2];
        var stroke_color = colorStyle.areaGeomStyle.strokeColor[2];
        if(perception<85) {
            fill_color = colorStyle.areaGeomStyle.fillColor[0];
            stroke_color = colorStyle.areaGeomStyle.strokeColor[0];
        } else if (perception<88) {
            fill_color = colorStyle.areaGeomStyle.fillColor[1];
            stroke_color = colorStyle.areaGeomStyle.strokeColor[1];
        } else if (perception<100) {
            fill_color = colorStyle.areaGeomStyle.fillColor[2];
            stroke_color = colorStyle.areaGeomStyle.strokeColor[2];
        }
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: fill_color
            }),
            stroke:new ol.style.Stroke({
                color:stroke_color,
                width:1
            })
        })
    }
}

/**
 * 创建画像的值域覆盖物，并绑定右键菜单事件
 */
mygis.perceptionRectPopups = [];
mygis.creatPerceptionRect = function(text, color, text_color, point, areaId) {
    var coordinate = point.getCoordinates();
    var domId = "popup_text_perception_" + areaId;
    var popupDiv = "";
    var container = null;
    var overlay = null;

    $("#"+domId).remove();
    popupDiv = "<div id='"+domId+"' class='popup_text_perception' title='右击查看详情'";
    popupDiv += "style='background:"+color+";color:"+text_color+";'>"+text+"</div>";
    $("#map").append(popupDiv);
    container = document.getElementById(domId);
    overlay = new ol.Overlay(({element: container,autoPan: false, offset: [-18,-18]}));
    overlay.setPosition(coordinate);
    mygis.map.addOverlay(overlay);
    mygis.perceptionRectPopups.push(overlay);

    $("#"+domId).unbind().bind("contextmenu",function(e){
        e.preventDefault();
        $("#perception-quadrant-box .part-area").attr("data-value",areaId);
        $("#perception-quadrant-box").menu('show',{
            left: e.pageX,
            top: e.pageY
        });
    });

    return ;
}

/**
 * 清空画像的值域覆盖物
 */
mygis.clearPerceptionRect= function(){
    for (var i = 0; i < mygis.perceptionRectPopups.length; i++) {
        mygis.map.removeOverlay(mygis.perceptionRectPopups[i]);
    }
}

/**
 * 显示工单图层
 * @param show true:显示，false：隐藏
 */
mygis.showGISOrder = function (show) {
    var name = 'gisorder';

     //不显示的优化加速
    if(show == false){
        if (mygis.layers[name]) {
                mygis.layers[name].setVisible(show);
        }
        if (mygis.Heatmap[name]) {
                mygis.Heatmap[name].setVisible(show);
        }
        return;
    }
    if (mygis.layers[name] == undefined) {
        // Style for the clusters
        var styleCache = {};

        function getStyle(feature, resolution) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (!style) {
                style = styleCache[size] = new ol.style.Style(
                    {
                        image: new ol.style.Icon(
                            {
                                src: './resource/image/svg_location_red.png',
                                anchor: [0.5, 0.5]    // 设置图标位置
                            }),
                        text: new ol.style.Text(
                            {
                                text: size.toString(),
                                fill: new ol.style.Fill(
                                    {
                                        color: '#fff'
                                    })
                            })
                    });
            }
            return [style];
        }

        // Cluster Source
        var clusterSource = new ol.source.Cluster({
            distance: 40,
            source: new ol.source.Vector()
        });
        // Animated cluster layer
        var clusterLayer = new ol.layer.AnimatedCluster(
            {
                name: 'Cluster',
                source: clusterSource,
                animationDuration: $("#animatecluster").prop('checked') ? 700 : 0,
                // Cluster style
                style: getStyle,
                maxResolution: mygis.maxResolution,
                zIndex: 10
            });
        mygis.layers[name] = clusterLayer;
        mygis.map.addLayer(mygis.layers[name]);
    }
    if (mygis.layers[name].getVisible() != show) {
        mygis.layers[name].setVisible(show);
    }

    if (!mygis.HeatmapData[name]) {
        mygis.startLoading();
        $.ajax({
            url: BACK_SERVER_URL + "gisController/queryGISOrder",
            method: 'get',
            success: function (data) {
                mygis.endLoading();
                var features = [];
                mygis.layers[name].getSource().getSource().clear();
                if (data) {
                    var j=0;
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        if (d.lon && d.lat) {
                            // var lonlat = ExtendUtil.gps84ToGcj02(d.lon, d.lat);
                            // d.lon = lonlat.x;
                            // d.lat = lonlat.y;
                            d.wkt = 'POINT(' + d.lon + ' ' + d.lat + ')';
                            d.weight = 1;
                            features[j] = new ol.Feature(new ol.geom.Point(ol.proj.transform([d.lon, d.lat], 'EPSG:4326', 'EPSG:3857')));
                            features[j].setId(d.order_id);
                            features[j].set('data', d);
                            j++;
                        }
                    }
                }
                mygis.layers[name].getSource().getSource().addFeatures(features);
                mygis.HeatmapData[name] = data;
                mygis.showHeatmap(name, data, show);
            }
        });
    } else {
        mygis.showHeatmap(name, mygis.HeatmapData[name], show);
    }
}


/**
 * 动态更新热力图信息
 */
mygis.addGISOrder = function (data) {
    var name = 'gisorder';
    if (mygis.layers[name]) {
        var features = [];
        var source = mygis.layers[name].getSource().getSource();
        var data_add = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (d.order_staus && d.order_staus == 2) {
                var f = source.getFeatureById(d.order_id);
                // for(var j =0;j<source.getFeatures().length;j++) {
                //     console.log(source.getFeatures()[j].getId());
                //     if(source.getFeatures()[j].getId()==d.order_id) {
                //         f = source.getFeatures()[j];
                //         break;
                //     }
                // }
                if (f) {
                    source.removeFeature(f);
                    if (mygis.HeatmapData[name]) {
                        var index = 0;
                        for (var i = 0; i < mygis.HeatmapData[name].length; i++) {
                            if (mygis.HeatmapData[name][i].order_id == d.order_id) {
                                index = i;
                                break;
                            }
                        }
                        mygis.HeatmapData[name].splice(index, 1);
                    }
                }
                continue;
            } else {
                var f = source.getFeatureById(d.order_id);
                // for(var j =0;j<source.getFeatures().length;j++) {
                //     console.log(source.getFeatures()[j].getId());
                //     if(source.getFeatures()[j].getId()==d.order_id) {
                //         f = source.getFeatures()[j];
                //         break;
                //     }
                // }
                if (f) {
                    // var lonlat =ExtendUtil.gps84ToGcj02(d.lon,d.lat);
                    // d.lon = lonlat.x;
                    // d.lat = lonlat.y;
                    d.wkt = 'POINT(' + d.lon + ' ' + d.lat + ')';
                    d.weight = 1;
                    // mygis.showWarn(d);
                    f.set('data', d);
                    if (mygis.HeatmapData[name]) {
                        var index = 0;
                        for (var i = 0; i < mygis.HeatmapData[name].length; i++) {
                            if (mygis.HeatmapData[name][i].order_id == d.order_id) {
                                index = i;
                                break;
                            }
                        }
                        mygis.HeatmapData[name].splice(index, 1);
                        mygis.HeatmapData[name].push(d);
                    }
                    continue;
                }
            }
            // var lonlat =ExtendUtil.gps84ToGcj02(d.lon,d.lat);
            // d.lon = lonlat.x;
            // d.lat = lonlat.y;
            d.wkt = 'POINT(' + d.lon + ' ' + d.lat + ')';
            d.weight = 1;
            var f = new ol.Feature(new ol.geom.Point(ol.proj.transform([d.lon, d.lat], 'EPSG:4326', 'EPSG:3857')));
            f.setId(d.order_id);
            f.set('data', d);
            features.push(f);
            if(app.assemblyShow == "anim") {
                mygis.showWarn(d, 7);
            }
            data_add.push(d);
        }
        mygis.layers[name].getSource().getSource().addFeatures(features);
        var show = mygis.Heatmap[name].getVisible();
        if (mygis.HeatmapData[name]) {
            mygis.HeatmapData[name] = mygis.HeatmapData[name].concat(data_add);
            mygis.showHeatmap(name, mygis.HeatmapData[name], show);
        } else {
            mygis.HeatmapData[name] = data_add;
            mygis.showHeatmap(name, mygis.HeatmapData[name], show);
        }
    }
}

/**
 * 显示超忙图层
 * @param show true:显示，false：隐藏
 */
mygis.showBusy = function (show) {
    var name = 'busy';
    var month_no = mygis.datetime[name].format('yyyyMM');
    var day_no = mygis.datetime[name].format('yyyyMMdd');

     //不显示的优化加速
    if(show == false){
        if (mygis.layers[name]) {
                mygis.layers[name].setVisible(show);
        }
        if (mygis.Heatmap[name]) {
                mygis.Heatmap[name].setVisible(show);
        }
        return;
    }

    //清空数据
    if (mygis.layers[name]) {
        mygis.layers[name].getSource().clear()
    } else {
        mygis.layers[name] = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 10,
            maxResolution: mygis.maxResolution,
            name: 'busyPoint',
            style: function (feature){
                var row = feature.getProperties().value;
                var type = row.net_type;
                var pic = "./resource/image/ic_gis_order_cell_2g1.png";//2、3G
                if(type == 4){
                    pic = "./resource/image/ic_gis_order_cell_4g1.png";//4G
                }

                var style = new ol.style.Style({
                                image: new ol.style.Icon({
                                    src: pic,
                                    anchor: [0.5, 0.5]    // 设置图标位置
                                })
                            });

                return style;

            }
        });
        mygis.map.addLayer(mygis.layers[name]);
    }

     if (mygis.layers[name].getVisible() != show) {
        mygis.layers[name].setVisible(show);
     }


    if (!mygis.HeatmapData[name + '-' + day_no]) {
        mygis.startLoading();
        $.ajax({
            url: BACK_SERVER_URL + "gisController/queryBusyInfo",
            method: 'get',
            data: {day_no: day_no},
            success: function (data) {
                mygis.endLoading();
                mygis.showHeatmap(name, data, show);
                mygis.HeatmapData[name + '-' + day_no] = data;
                mygis.addCellMarker(name, data, show);
            }
        });
    } else {
        mygis.showHeatmap(name, mygis.HeatmapData[name + '-' + day_no], show);
        mygis.addCellMarker(name,mygis.HeatmapData[name + '-' + day_no], show);
    }
}

/**
 * 显示故障图层
 * @param show true:显示，false：隐藏
 */
mygis.showFault = function (show) {
    var name = 'fault';
    var month_no = mygis.datetime[name].format('yyyyMM');
    var day_no = mygis.datetime[name].format('yyyyMMdd');

     //不显示的优化加速
    if(show == false){
        if (mygis.layers[name]) {
                mygis.layers[name].setVisible(show);
        }
        if (mygis.Heatmap[name]) {
                mygis.Heatmap[name].setVisible(show);
        }
        return;
    }

    //清空数据
    if (mygis.layers[name]) {
        mygis.layers[name].getSource().clear()
    } else {
        mygis.layers[name] = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 10,
            maxResolution: mygis.maxResolution,
            name: 'faultPoint',
            style: function (feature){
                var row = feature.getProperties().value;
                var type = row.net_type;
                var pic = "./resource/image/ic_gis_order_cell_2g2.png";//2、3G
                if(type == 4){
                    pic = "./resource/image/ic_gis_order_cell_4g2.png";//4G
                }

                var style = new ol.style.Style({
                                image: new ol.style.Icon({
                                    src: pic,
                                    anchor: [0.5, 0.5]    // 设置图标位置
                                })
                            });

                return style;

            }
        });
        mygis.map.addLayer(mygis.layers[name]);
    }

     if (mygis.layers[name].getVisible() != show) {
        mygis.layers[name].setVisible(show);
     }

    if (!mygis.HeatmapData[name + '-' + day_no]) {
        mygis.startLoading();
        $.ajax({
            url: BACK_SERVER_URL + "gisController/queryFaultInfo",
            method: 'get',
            data: {day_no: day_no},
            success: function (data) {
                mygis.endLoading();
                mygis.showHeatmap(name, data, show);
                mygis.HeatmapData[name + '-' + day_no] = data;
                mygis.addCellMarker(name, data, show);
            }
        });
    } else {
        mygis.showHeatmap(name, mygis.HeatmapData[name + '-' + day_no], show);
        mygis.addCellMarker(name,mygis.HeatmapData[name + '-' + day_no], show);
    }
}

/**
 * 加载基站数据
 */
mygis.addCellMarker = function(name,data, show){
    var features = [];
    if(data && data.length > 0){
        for(var i=0;i<data.length;i++){
            var row = data[i];
            var wkt = row.wkt;
            var geometry = mygis.getGeometryByWkt(wkt);
            var feature = new ol.Feature({
                geometry: geometry,
                value: row
            });

//            feature.on('click', function (evt) {
//            });

            features.push(feature);
        }
    }
    mygis.layers[name].getSource().addFeatures(features);
}

/**
 * 创建聚合图层
 */
mygis.createClusterLayer = function(name, features, pic, show){
    var source = new ol.source.Vector({
            features: features
        });

    var clusterSource = new ol.source.Cluster({
        distance: 40,
        source: source
    });

    var styleCache = {};
    if (mygis.layers[name]) {
        mygis.map.removeLayer(mygis.layers[name]);
        mygis.layers[name] = null;
    }
    mygis.layers[name] = new ol.layer.Vector({
            zIndex: 10,
            source: clusterSource,
            maxResolution: mygis.maxResolution,
            name: name,
            style: function (feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                if (size == 1) {
                    style = new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [ 0.5, 0.5],
                                src: pic
                            })
                        });
                    styleCache[size] = style;
                }

                if (!style) {
                    style = new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [ 0.5, 0.5],
                                src: pic,
                                scale: 0.9
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                font: "10px Arial Black",
                                fill: new ol.style.Fill({
                                    color: '#FFFFFF'
                                }),
                                offsetX: 0,
                                offsetY: 8
                            })
                        });
                    styleCache[size] = style;
                }
                return style;
            }
        });
    mygis.map.addLayer(mygis.layers[name]);

    if (mygis.layers[name].getVisible() != show) {
        mygis.layers[name].setVisible(show);
    }
}


/**
 * 显示区域及其下级区域轮廓
 * @param id
 */
mygis.showCity = function (id) {
    // mygis.showBounds(id);
    // return;
    if(mygis.layers['perception']) {
        mygis.layers['perception'].getSource().clear();
        mygis.clearPerceptionRect();
    }
    mygis.cityLayer.getSource().clear();
    mygis.changeLayerCity(id);

    if (mygis.cityData[id + '']) {
        mygis.loadCity(mygis.cityData[id + '']);
    } else {
        $.ajax({
            url: BACK_SERVER_URL + 'gisController/queryCityInfo.json?id=' + id,
            success: function (data) {
                mygis.loadCity(data);
            }
        });
    }
}

mygis.loadCity = function (data) {
    var wktformat = new ol.format.WKT();
    if (data.wkt) {
        var geometry = wktformat.readGeometry(data.wkt, {
            dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
        });
        var feature = new ol.Feature({
            geometry: geometry,
            name: data.name,
            id: data.id,
            level: data.level,
            location: ol.proj.transform([data.lon, data.lat], 'EPSG:4326', 'EPSG:3857'),
            bounds: [data.min_lon, data.min_lat, data.max_lon, data.max_lat],
            isparent: true
        });
        mygis.cityLayer.getSource().addFeatures([feature]);
        mygis.cityId = data.id;
        mygis.pid = data.pid;
        if(data.id == 0){
             mygis.map.getView().setCenter(ol.proj.transform(allCity["0"], 'EPSG:4326', 'EPSG:3857'));
             mygis.map.getView().setZoom(8);
        } else {
            var extent = ol.proj.transformExtent([data.min_lon, data.min_lat, data.max_lon, data.max_lat], 'EPSG:4326', 'EPSG:3857');
            mygis.mapMeasureControl.fit(extent);
        }
    }
    app.relativeAreaLevel(data.id, data.level,data.name);
    app.renderUqwmEfficiencyGauge();
    if (data.districts) {
        for (var i = 0; i < data.districts.length; i++) {
            if (data.districts[i].wkt) {

                var geometry = wktformat.readGeometry(data.districts[i].wkt, {
                    dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
                });
                var feature = new ol.Feature({
                    geometry: geometry,
                    name: data.districts[i].name,
                    id: data.districts[i].id,
                    pid: data.districts[i].pid,
                    level: data.districts[i].level,
                    location: ol.proj.transform([data.districts[i].lon, data.districts[i].lat], 'EPSG:4326', 'EPSG:3857'),
                    bounds: [data.districts[i].min_lon, data.districts[i].min_lat, data.districts[i].max_lon, data.districts[i].max_lat],
                    isparent: false
                });
                mygis.cityLayer.getSource().addFeatures([feature]);

            }
        }

    }
    mygis.cityData[data.id + ''] = data;
    mygis.showPerception(mygis.PerceptionShow);
    mygis.showTelecomCover(mygis.TelecomShow);
    mygis.showMobileCover(mygis.MobileShow);
    mygis.showUnicomCover(mygis.UnicomShow);
};

mygis.showBounds = function (id) {
    $.ajax({
        url: BACK_SERVER_URL + 'gisController/queryCityInfo.json?id=' + id,
        success: function (data) {
            if (data.wkt) {
                var extent = ol.proj.transformExtent([data.min_lon, data.min_lat, data.max_lon, data.max_lat], 'EPSG:4326', 'EPSG:3857');
                mygis.mapMeasureControl.fit(extent);
                var gridparams = mygis.layers['cityLayer'].getSource().getParams();
                gridparams.CQL_FILTER = "pid= " + data.id + " or id = " + data.id;
                mygis.layers['cityLayer'].getSource().updateParams(gridparams);
            }
        }
    });
}

/**
 * 根据wkt获取geometry
 */
mygis.getGeometryByWkt = function(wkt){
    var geometry = null;
    if(wkt){
       geometry = mygis.wktformat.readGeometry(wkt, {
                                       dataProjection: 'EPSG:4326',
                                       featureProjection: 'EPSG:3857'
                                      });
    }
    return geometry;
}

/**
 * 绘制红色圆形虚线边界
 */
mygis.drawCircleOfRedLineDashBound = function(layer, lon, lat, distance){
    var point = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    var buffered = mygis.ol3Parser.read(point);
    buffered = buffered.buffer(distance);
    var cover = new ol.Feature({
        geometry: mygis.ol3Parser.write(buffered)
    });
    cover.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({ //边界样式
            color: '#f00',
            lineDash: [4, 6],
            width: 3
        })
    }));
   layer.getSource().addFeature(cover);
};

/**
 * 设置地图中心位置
 */
mygis.setCenter = function (lon,lat) {
    mygis.map.getView().setCenter(ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857'));
}

mygis.updateDateTime = function(){
    var nowDate = new Date();
    var yesterdayDate = new Date(nowDate.getTime() - 24*60*60*1000); //前一天
    mygis.datetime.busy = nowDate;
    mygis.datetime.fault = nowDate;
    mygis.datetime.ct = nowDate;
    mygis.datetime.cm = nowDate;
    mygis.datetime.cu = nowDate;
    mygis.datetime.gisorder = nowDate;
}