;
var MigrationMap = {};
MigrationMap.MapServerRegisterState = false;
MigrationMap.geoCoordMap = {
    '上海': [121.4648,31.2891],
    '东莞': [113.8953,22.901],
    '东营': [118.7073,37.5513],
    '中山': [113.4229,22.478],
    '临汾': [111.4783,36.1615],
    '临沂': [118.3118,35.2936],
    '丹东': [124.541,40.4242],
    '丽水': [119.5642,28.1854],
    '乌鲁木齐': [87.9236,43.5883],
    '佛山': [112.8955,23.1097],
    '保定': [115.0488,39.0948],
    '兰州': [103.5901,36.3043],
    '包头': [110.3467,41.4899],
    '北京': [116.4551,40.2539],
    '北海': [109.314,21.6211],
    '南京': [118.8062,31.9208],
    '南宁': [108.479,23.1152],
    '南昌': [116.0046,28.6633],
    '南通': [121.1023,32.1625],
    '厦门': [118.1689,24.6478],
    '台州': [121.1353,28.6688],
    '合肥': [117.29,32.0581],
    '呼和浩特': [111.4124,40.4901],
    '咸阳': [108.4131,34.8706],
    '哈尔滨': [127.9688,45.368],
    '唐山': [118.4766,39.6826],
    '嘉兴': [120.9155,30.6354],
    '大同': [113.7854,39.8035],
    '大连': [122.2229,39.4409],
    '天津': [117.4219,39.4189],
    '太原': [112.3352,37.9413],
    '威海': [121.9482,37.1393],
    '宁波': [121.5967,29.6466],
    '宝鸡': [107.1826,34.3433],
    '宿迁': [118.5535,33.7775],
    '常州': [119.4543,31.5582],
    '广州': [113.5107,23.2196],
    '廊坊': [116.521,39.0509],
    '延安': [109.1052,36.4252],
    '张家口': [115.1477,40.8527],
    '徐州': [117.5208,34.3268],
    '德州': [116.6858,37.2107],
    '惠州': [114.6204,23.1647],
    '成都': [103.9526,30.7617],
    '扬州': [119.4653,32.8162],
    '承德': [117.5757,41.4075],
    '拉萨': [91.1865,30.1465],
    '无锡': [120.3442,31.5527],
    '日照': [119.2786,35.5023],
    '昆明': [102.9199,25.4663],
    '杭州': [119.5313,29.8773],
    '枣庄': [117.323,34.8926],
    '柳州': [109.3799,24.9774],
    '株洲': [113.5327,27.0319],
    '武汉': [114.3896,30.6628],
    '汕头': [117.1692,23.3405],
    '江门': [112.6318,22.1484],
    '沈阳': [123.1238,42.1216],
    '沧州': [116.8286,38.2104],
    '河源': [114.917,23.9722],
    '泉州': [118.3228,25.1147],
    '泰安': [117.0264,36.0516],
    '泰州': [120.0586,32.5525],
    '济南': [117.1582,36.8701],
    '济宁': [116.8286,35.3375],
    '海口': [110.3893,19.8516],
    '淄博': [118.0371,36.6064],
    '淮安': [118.927,33.4039],
    '深圳': [114.5435,22.5439],
    '清远': [112.9175,24.3292],
    '温州': [120.498,27.8119],
    '渭南': [109.7864,35.0299],
    '湖州': [119.8608,30.7782],
    '湘潭': [112.5439,27.7075],
    '滨州': [117.8174,37.4963],
    '潍坊': [119.0918,36.524],
    '烟台': [120.7397,37.5128],
    '玉溪': [101.9312,23.8898],
    '珠海': [113.7305,22.1155],
    '盐城': [120.2234,33.5577],
    '盘锦': [121.9482,41.0449],
    '石家庄': [114.4995,38.1006],
    '福州': [119.4543,25.9222],
    '秦皇岛': [119.2126,40.0232],
    '绍兴': [120.564,29.7565],
    '聊城': [115.9167,36.4032],
    '肇庆': [112.1265,23.5822],
    '舟山': [122.2559,30.2234],
    '苏州': [120.6519,31.3989],
    '莱芜': [117.6526,36.2714],
    '菏泽': [115.6201,35.2057],
    '营口': [122.4316,40.4297],
    '葫芦岛': [120.1575,40.578],
    '衡水': [115.8838,37.7161],
    '衢州': [118.6853,28.8666],
    '西宁': [101.4038,36.8207],
    '西安': [109.1162,34.2004],
    '贵阳': [106.6992,26.7682],
    '连云港': [119.1248,34.552],
    '邢台': [114.8071,37.2821],
    '邯郸': [114.4775,36.535],
    '郑州': [113.4668,34.6234],
    '鄂尔多斯': [108.9734,39.2487],
    '重庆': [107.7539,30.1904],
    '金华': [120.0037,29.1028],
    '铜川': [109.0393,35.1947],
    '银川': [106.3586,38.1775],
    '镇江': [119.4763,31.9702],
    '长春': [125.8154,44.2584],
    '长沙': [113.0823,28.2568],
    '长治': [112.8625,36.4746],
    '阳泉': [113.4778,38.0951],
    '青岛': [120.4651,36.3373],
    '韶关': [113.7964,24.7028]
};

MigrationMap.BJData = [
    [{name:'北京'}, {name:'上海',value:95}],
    [{name:'北京'}, {name:'广州',value:90}],
    [{name:'北京'}, {name:'大连',value:80}],
    [{name:'北京'}, {name:'南宁',value:70}],
    [{name:'北京'}, {name:'南昌',value:60}],
    [{name:'北京'}, {name:'拉萨',value:50}],
    [{name:'北京'}, {name:'长春',value:40}],
    [{name:'北京'}, {name:'包头',value:30}],
    [{name:'北京'}, {name:'重庆',value:20}],
    [{name:'北京'}, {name:'常州',value:10}]
];

MigrationMap.SHData = [
    [{name:'上海'},{name:'包头',value:95}],
    [{name:'上海'},{name:'昆明',value:90}],
    [{name:'上海'},{name:'广州',value:80}],
    [{name:'上海'},{name:'郑州',value:70}],
    [{name:'上海'},{name:'长春',value:60}],
    [{name:'上海'},{name:'重庆',value:50}],
    [{name:'上海'},{name:'长沙',value:40}],
    [{name:'上海'},{name:'北京',value:30}],
    [{name:'上海'},{name:'丹东',value:20}],
    [{name:'上海'},{name:'大连',value:10}]
];

MigrationMap.GZData = [
    [{name:'广州'},{name:'福州',value:95}],
    [{name:'广州'},{name:'太原',value:90}],
    [{name:'广州'},{name:'长春',value:80}],
    [{name:'广州'},{name:'重庆',value:70}],
    [{name:'广州'},{name:'西安',value:60}],
    [{name:'广州'},{name:'成都',value:50}],
    [{name:'广州'},{name:'常州',value:40}],
    [{name:'广州'},{name:'北京',value:30}],
    [{name:'广州'},{name:'北海',value:20}],
    [{name:'广州'},{name:'海口',value:10}]
];

MigrationMap.planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

MigrationMap.convertData = function (data,isFrom) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = MigrationMap.geoCoordMap[dataItem[0].name];
        var toCoord = MigrationMap.geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push([{
                coord: isFrom?fromCoord:toCoord
            }, {
                coord: isFrom?toCoord:fromCoord
            }]);
        }
    }
    return res;
};


MigrationMap.creaSeries = function(data){
    var color = ['#43d324', '#ffeb3b'];
    var series = [];

    data.forEach(function (item, i) {
        var isFrom = item[2];
        series.push({
            name: item[0],
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            tooltip:{
                formatter: function(params){
                    return "";
                }
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },
            data: MigrationMap.convertData(item[1],isFrom)
        },
        {
            name: item[0],
            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: MigrationMap.planePath,
                symbolSize: 15
            },
            tooltip:{
                formatter: function(params){
                    return "";
                }
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 1,
                    opacity: 0.4,
                    curveness: 0.2
                }
            },
            data: MigrationMap.convertData(item[1],isFrom)
        },
        {
            name: item[0],
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            tooltip:{
                formatter: function(params){
                    var result = params.data.name + " "+ params.data.value[2] + "人";
                    return result;
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'bottom',
                    formatter: function(params){
                        var result = params.name + " "+ params.value[2]
//                        var result = params.name;
                        return result;
                    }
                },
            },
            symbolSize: function (val) {
//                return val[2] / 8;
                var result = val[2];

                if(val[2] >= 0 && val[2] < 5){
                    result = 5;
                } else if(val[2] >= 5 && val[2] < 10){
                    result = 8;
                } else if(val[2] >= 10 && val[2] < 50){
                    result = 10;
                } else if(val[2] >= 50){
                    result = 15;
                }

                return result;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                },
            },
            data: item[1].map(function (dataItem) {
                return {
                    name: dataItem[1].name,
                    value: MigrationMap.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
            })
        });
    });

    series.push({
                name: "四川",
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                tooltip:{
                    formatter: function(params){
                        return params.name;
                    }
                  },
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter: function(params){
                            var result = params.name
                            return result;
                        }
                    },
                },
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: color[1]
                    },
                },
                data: [{
                   name: "东郊记忆",
                   value: MigrationMap.geoCoordMap["东郊记忆"]
                }],
            },{
                  name: "东郊记忆",
                  type: 'effectScatter',
                  coordinateSystem: 'geo',
                  zlevel: 2,
                  rippleEffect: {
                      brushType: 'stroke'
                  },
                  tooltip:{
                    formatter: function(params){
                        return params.name;
                    }
                  },
                  label: {
                      normal: {
                          show: true,
                          position: 'bottom',
                          formatter: function(params){
                              var result = params.name
                              return result;
                          }
                      },
                  },
                  symbolSize: 15,
                  itemStyle: {
                      normal: {
                          color: color[0]
                      },
                  },
                  data: [{
                     name: "东郊记忆",
                     value: MigrationMap.geoCoordMap["东郊记忆"]
                  }],
              });

    return series;
}
MigrationMap.selected = "东郊记忆";
MigrationMap.zoom = 12;
MigrationMap.center = [104.1205382800,30.6711031800];
MigrationMap.initMigrationMap = function(data){
    var series = MigrationMap.creaSeries(data);
    var bgColor = '#0a0621';
//    var option = {
//        backgroundColor: bgColor,
//        title : {
//            show: false,
//            text: '模拟迁徙',
//            subtext: '数据纯属虚构',
//            left: 'center',
//            textStyle : {
//                color: '#fff'
//            }
//        },
//        tooltip : {
//            trigger: 'item'
//        },
//        legend: {
//            orient: 'vertical',
//            top: 'bottom',
//            left: 'right',
//            data:['东郊记忆', '四川'],
//            textStyle: {
//                color: '#fff'
//            },
//            selected:{
//        　　　　"东郊记忆": MigrationMap.selected=="东郊记忆",
//        　　　　"四川": MigrationMap.selected=="四川"
//        　　},
//            selectedMode: 'single',
//            formatter: function(params){
//                var result;
//                if(params == "东郊记忆"){
//                    result = "去向";
//                } else {
//                    result = "来源";
//                }
//                return result;
//            }
//        },
//        geo: {
//            map: MigrationMap.selected=="东郊记忆"?'chengduJson':'china',
//            center: MigrationMap.center,
//            zoom: MigrationMap.zoom,
//            label: {
//                emphasis: {
//                    show: false,
//                    color: "#fff"
//                },
//                normal: {
//                    show: MigrationMap.selected=="东郊记忆",
//                    color: "#fff"
//                }
//            },
//            roam: true,
//            itemStyle: {
//                normal: {
//                    color : '#333',
//                    areaColor: '#0a0621',
//                    borderColor: '#404a59'
//                },
//                emphasis: {
//                    color: "#fff",
//                    areaColor: '#080d46'
//                }
//            }
//        },
//        series: series
//    };

    var option = {
                  tooltip: {
                    trigger: 'item'
                  },
                  legend: {
                      orient: 'vertical',
                      top: 'bottom',
                      left: 'right',
                      data:['东郊记忆', '四川'],
                      textStyle: {
                          color: '#fff'
                      },
                      selected:{
                  　　　　"东郊记忆": MigrationMap.selected=="东郊记忆",
                  　　　　"四川": MigrationMap.selected=="四川"
                  　　},
                      selectedMode: 'single',
                      formatter: function(params){
                          var result;
                          if(params == "东郊记忆"){
                              result = "去向";
                          } else {
                              result = "来源";
                          }
                          return result;
                      }
                  },
                  series: series
                };

    if(!MigrationMap.map){
//        MigrationMap.map = new HMap('migrationMap', {
//            controls: {
//              loading: true,
//              zoomSlider: false,
//              fullScreen: false
//            },
//            view: {
//              center: [113.48639681199214, 23.31897543042969],
//              projection: 'EPSG:4326',
//              zoom: 10, // resolution
//              maxZoom: 14,
//              minZoom: 4
//            },
//            baseLayers: [
//              {
//                layerName: 'vector',
//                isDefault: true,
//                layerType: 'TileXYZ',
//                projection: 'EPSG:3857',
//                tileGrid: {
//                  tileSize: 256,
//                  extent: [-2.0037507067161843E7, -3.0240971958386254E7, 2.0037507067161843E7, 3.0240971958386205E7],
//                  origin: [-2.0037508342787E7, 2.0037508342787E7],
//                  resolutions: [
//                    156543.03392800014,
//                    78271.51696399994,
//                    39135.75848200009,
//                    19567.87924099992,
//                    9783.93962049996,
//                    4891.96981024998,
//                    2445.98490512499,
//                    1222.992452562495,
//                    611.4962262813797,
//                    305.74811314055756,
//                    152.87405657041106,
//                    76.43702828507324,
//                    38.21851414253662,
//                    19.10925707126831,
//                    9.554628535634155,
//                    4.77731426794937,
//                    2.388657133974685
//                  ]
//                },
//                layerUrl: mapAddress.vectorLayer[0]
////                layerUrl: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
//              }
//            ]
//        });

        MigrationMap.map = new ol.Map({
                layers: [
                    new ol.layer.Image({
                        source: new ol.source.Raster({
                            sources: [
                                new ol.source.XYZ({
                                    urls: mapAddress.vectorLayer,
                                    crossOrigin: 'anonymous'
                                })
                            ],
                            operation: function (pixels, data) {
                                var pixel = pixels[0];
                                pixel[0] = 10;
                                pixel[1] = 255 - pixel[1];
                                pixel[2] = 255 - pixel[2] + 20;
                                return pixel;
                            }
                        })
                    }),
                ],
                target: 'migrationMap',
                controls: ol.control.defaults({
                    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                        collapsible: false
                    })
                }),
                view: new ol.View({//30.6687010000,
                    center: [11590925.526935892, 3589829.0452608275],
                    zoom: zoomLevel,
                })
            });


        //成华区边界
        var layer = new ol.layer.Vector({
            	source: new ol.source.Vector(),
            	style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                      color: 'rgba(1, 163, 206, 1)',
                      //lineDash: [4],
                      width: 1
                    }),
                    fill: new ol.style.Fill({
                      color: 'rgba(11, 56, 111, 0.1)'
                    }),
                }),
            });
        var wkt = "MULTIPOLYGON (((104.05422211 30.6874218,104.06984711 30.68614388,104.09021759 30.68669319,104.11143494 30.6838665,104.12389374 30.68639374,104.13287354 30.67788124,104.13249207 30.67022705,104.13570404 30.66355324,104.11173248 30.63202095,104.1083374 30.6197319,104.10375977 30.61133003,104.09418488 30.60898209,104.07247925 30.62757874,104.0636673 30.62737465,104.05764771 30.6307373,104.04936981 30.64003754,104.04017639 30.6366539,104.03512573 30.64349174,104.03453064 30.65609741,104.03768921 30.67153358,104.04961395 30.67085457,104.05422211 30.6874218)))";
        var feature = new ol.format.WKT().readFeature(wkt ,{dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
        layer.getSource().addFeature(feature);
        MigrationMap.map.addLayer(layer);
        //echarts
        MigrationMap.ol3Echarts = new ol3Echarts(option);
        MigrationMap.ol3Echarts.appendTo(MigrationMap.map);
        MigrationMap.myChart = MigrationMap.ol3Echarts.$chart;

        MigrationMap.myChart.on('click', function (params) {
                     console.log(params);
        });

        MigrationMap.myChart.on("legendselectchanged",function(data){
            if(data.selected["东郊记忆"]){
                MigrationMap.selected = "东郊记忆";
                MigrationMap.center = MigrationMap.geoCoordMap[MigrationMap.selected];
                MigrationMap.zoom = 12;
            } else{
                MigrationMap.selected = "四川";
                MigrationMap.center = MigrationMap.geoCoordMap[MigrationMap.selected];
                MigrationMap.zoom = 4;
            }
            drawGotoAndFromSiChuanByDateStr(chenghuagis.currentDateStr);
        });

        MigrationMap.map.on("moveend",function(){
            MigrationMap.center = ol.proj.transform(MigrationMap.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
            MigrationMap.zoom = MigrationMap.map.getView().getZoom();
        });
    }

    MigrationMap.map.updateSize();
    MigrationMap.map.getView().setZoom(MigrationMap.zoom);
    MigrationMap.map.getView().setCenter( ol.proj.transform(MigrationMap.center, 'EPSG:4326', 'EPSG:3857'));
    MigrationMap.ol3Echarts.setChartOptions(option);
}


//注册地图
//$.ajaxSettings.async = false;
//var chinaJson = null;
//var sichuan = null;
//var chengduJson = null;
//$.get('data/china.json', function (json) {
//    chinaJson = json;
//     echarts.registerMap('china', chinaJson);
//});
//$.get('data/sichuan.json', function (json) {
//    sichuan = json;
//    MigrationMap.MapServerRegisterState = true;
//     echarts.registerMap('sichuan', sichuan);
//});
//$.get('data/510100.json', function (json) {
//    chengduJson = json;
//    echarts.registerMap('chengduJson', chengduJson);
//});