import "./output";
const Cesium = require('cesium/Cesium');

console.log("Hello world!");
var map = new dmap.DMap({only2D: false, currentStatus: '2d',center:[104.0658, 30.6598], zoom:12});
window.map = map;
window.Cesium = Cesium;

//添加model
var modelStyle = {
    type: "point",
    items: [
        {
            filter: " 1==1 && data['id'] == 'X001' ",
            model: {
                show: true,
                uri: 'http://localhost:8701/model/ant1.glb',
                minimumPixelSize: 0,
                maximumScale: 10,
                scale: 200,
                heading: 0,
                pitch: 0,
                roll: 0
            },

        },
        {
            filter: " 1==1 && data['id'] == 'X002' ",
            model: {
                show: true,
                uri: 'http://localhost:8701/model/ant2.glb',
                minimumPixelSize: 0,
                maximumScale: 10,
                scale: 200,
                heading: 0,
                pitch: 0,
                roll: 0
            },
        }
    ]
};
var pointModel1 = new dmap.geom.DPoint({coordinates: [104.0630, 30.5985]});
var modeFeature1 = new dmap.feature.DFeature({geometry: pointModel1, properties: {id: 'X001'}});

var pointModel2 = new dmap.geom.DPoint({coordinates: [104.0609, 30.5988]});
var modeFeature2 = new dmap.feature.DFeature({geometry: pointModel2, properties: {id: 'X002'}});
var modelLayer = new dmap.layer.DVectorLayer({
    data: [modeFeature1, modeFeature2],
    style: modelStyle,
    only2D: false
});
map.addLayer(modelLayer);
modelLayer.setInfoWindowOptions({ show: true });


//加载天府建筑图层
var tianfuStyle =
{
    type: "polygon",
    items: [
        {
            filter: " 1==1 ",
            //polygon
            polygon: {
                show: true,
                fill: {
                    color: {
                        value: '#dddddd',
                        opacity: 0.3
                    },
                    //material:
                },
                stroke: {
                    color: {
                        value: '#cccccc',
                        opacity: 0.5
                    },
                    width: 1,
                    lineDash: [2, 2]
                },
                height: 100
            },

            //text
            text: {
                show: true,
                fontStyle: "normal",
                fontFamily: "sans-serif",
                fontSize: 10,
                fontWeight: "normal",
                text: 'name',
                scale: 0,
                angle: 0,
                offsetX: 0,
                offsetY: 0,
                backgroundPadding: [5, 2],
                backgroundColor: {
                    value: '#FFFFFF',
                    opacity: 0
                },
                fill: {
                    color: {
                        value: '#00ff00',
                        opacity: 1
                    },
                    //material:
                },
                stoke: {
                    color: {
                        value: '#000000',
                        opacity: 1
                    },
                    width: 1,
                    lineDash: [2, 2]
                }
            }
        }
    ]
};
var tianfuLayer = new dmap.layer.DVectorLayer({
    style: tianfuStyle,
    only2D: false
});
map.addLayer(tianfuLayer);
tianfuLayer.setInfoWindowOptions({ show: true });
$.ajax({
    url: "http://localhost:8701/data/tianfu.geojson",
    dataType: "json",
    method: "get",
    success: function (json) {
        let polygonFeatures = dmap.utils.geom.parseGeoJson(json);
        for (let i = 0; i < polygonFeatures.length; i++) {
            const element = polygonFeatures[i];
            tianfuLayer.addData(element);
        }
    }
});

var jqxhr = $.getJSON("data/point.geojson", function () {
    console.log("success");
}).done(function (data) {
    let pointFeatures = dmap.utils.geom.parseGeoJson(data);

    pointFeatures.forEach(function (it, i) {
        if (i == 0) {
            it.properties.index = '始';
        } else if (i == pointFeatures.length - 1) {
            it.properties.index = '终';
        } else {
            it.properties.index = i;
        }

    });
    var pointLayer = new dmap.layer.DVectorLayer({
        data: pointFeatures,
        style: {
            type: "point",//数据类型
            items: [//样式配置数组
                {
                    filter: "data.index=='始'",
                    image: {
                        icon: {
                            show: true,
                            horizontalOrigin: "Center",
                            verticalOrigin: "Bottom",
                            offset: [0, 0],
                            opacity: 1,
                            scale: 0.5,
                            angle: 0,
                            src: 'image/mark_start.png'
                        }
                    }
                },
                {
                    filter: "data.index=='终'",
                    image: {
                        icon: {
                            show: true,
                            horizontalOrigin: "Right",
                            verticalOrigin: "Bottom",
                            offset: [0, 0],
                            opacity: 1,
                            scale: 0.5,
                            angle: 0,
                            src: 'image/mark_stop.png'
                        }
                    }
                },
                {
                    filter: "1==1",
                    image: {
                        icon: {
                            show: true,
                            horizontalOrigin: "Center",
                            verticalOrigin: "Bottom",
                            offset: [0, 0],
                            opacity: 1,
                            scale: 0.5,
                            angle: 0,
                            src: 'image/mark_null.png'
                        }
                    },
                    text: {
                        show: true,
                        fontStyle: "normal",
                        fontFamily: "sans-serif",
                        fontSize: 12,
                        fontWeight: "normal",
                        text: 'index',
                        scale: 1,
                        angle: 0,
                        offsetX: 0,
                        offsetY: -5,
                        backgroundColor: {
                            value: '#FFFFFF',
                            opacity: 0
                        },
                        fill: {
                            color: {
                                value: '#FFFFFF',
                                opacity: 1
                            },
                            //material:
                        }
                    }
                }
            ]
        },
        only2D: false
    });
    map.addLayer(pointLayer);
    // pointLayer.viewAll();
    pointLayer.setIndex(2);
    pointLayer.setInfoWindowOptions({ show: true });
}).fail(function () {
    console.log("error");
}).always(function () {
    console.log("complete");
});

var jqxhr = $.getJSON("data/grid.geojson", function () {
    console.log("success");
}).done(function (data) {
    let gridFeatures = dmap.utils.geom.parseGeoJson(data);

    gridFeatures.forEach(function (it, i) {
        if (i == 0) {
            it.properties.index = '始';
        } else if (i == gridFeatures.length - 1) {
            it.properties.index = '终';
        } else {
            it.properties.index = i;
        }

    });
    var gridLayer = new dmap.layer.DVectorLayer({
        data: gridFeatures,
        style: {
            type: "polygon",//数据类型
            items: [//样式配置数组
                {
                    filter:"data.avg_rsrp<-120",//条件筛选
                    polygon: {
                        show: true,
                        fill: {
                            color: {
                                value: '#FE0000',
                                opacity: 0.5
                            },
                            //material:
                        },
                        stroke: {
                            color: {
                                value: '#cccccc',
                                opacity: 0.5
                            },
                            width: 1,
                            lineDash: [2,2]
                        },
                        height: 200
                    },
                },
                {
                    filter:"data.avg_rsrp<-110",//条件筛选
                    polygon: {
                        show: true,
                        fill: {
                            color: {
                                value: '#FF9600',
                                opacity: 0.5
                            },
                            //material:
                        },
                        height: 80
                    }
                },
                {
                    filter: "data.avg_rsrp<-100",//条件筛选
                    polygon: {
                        show: true,
                        fill: {
                            color: {
                                value: '#FFFF01',
                                opacity: 0.5
                            },
                            //material:
                        },
                        height: 60
                    }
                },
                {
                    filter: "data.avg_rsrp<-95",//条件筛选
                    polygon: {
                        show: true,
                        fill: {
                            color: {
                                value: '#79D4FF',
                                opacity: 0.5
                            },
                            //material:
                        },
                        height: 40
                    }
                },
                {
                    filter: "data.avg_rsrp<-90",//条件筛选
                    polygon: {
                        show: true,
                        fill: {
                            color: {
                                value: '#02AFFE',
                                opacity: 0.5
                            },
                            //material:
                        },
                        height: 30
                    }
                },
                {
                    filter: "data.avg_rsrp<-85",//条件筛选
                    polygon: {
                        show: true,
                        fill: {
                            color: {
                                value: '#4987FE',
                                opacity: 0.5
                            },
                            //material:
                        },
                        height: 20
                    }
                },
                {
                    filter: "1==1",//条件筛选
                    polygon: {
                        show: true,
                        fill: {
                            color: {
                                value: '#0000FE',
                                opacity: 0.5
                            },
                            //material:
                        },
                        height: 10
                    }
                }
            ]
        },
        only2D: false
    });
    map.addLayer(gridLayer);
    gridLayer.viewAll();
    gridLayer.setIndex(1);
    gridLayer.setInfoWindowOptions({ show: true });
}).fail(function () {
    console.log("error");
}).always(function () {
    console.log("complete");
});


var jqxhr = $.getJSON("data/line.geojson", function () {
    console.log("success");
}).done(function (data) {
    let lineFeatures = dmap.utils.geom.parseGeoJson(data);

    var lineLayer = new dmap.layer.DVectorLayer({
        data: lineFeatures,
        style: {
            type: "lineString",//数据类型
            items: [//样式配置数组
                {
                    filter: "1==1",
                    lineString: {
                        width: 2,
                        color: {
                            value: "#3d93fd",
                            opacity: 1
                        }
                    }
                }
            ]
        },
        only2D: false
    });
    map.addLayer(lineLayer);
    // pointLayer.viewAll();
    lineLayer.setIndex(1);
    // lineLayer.setInfoWindowOptions({ show: true });
}).fail(function () {
    console.log("error");
}).always(function () {
    console.log("complete");
});


