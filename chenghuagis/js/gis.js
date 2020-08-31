var mygis = {};
var zoomLevel = 17;

ChenghuagisFn.prototype.initGis = function() {
    mygis.blur = {16: 12, 17: 15, 18: 24};
    mygis.radius = {16: 8, 17: 12, 18: 24};
    mygis.vector = new ol.layer.Heatmap({
        source: new ol.source.Vector(),
        blur: mygis.blur[zoomLevel],
        radius: mygis.radius[zoomLevel],
    });

    mygis.vector.getSource().on('addfeature', function (event) {
        // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
        // standards-violating <magnitude> tag in each Placemark.  We extract it from
        // the Placemark's name instead.
        var cnt = event.feature.get('cnt');
        var weight = 1;
        if (cnt > 50) {
            weight = 1;
        } else if (cnt > 25) {
            weight = 0.9;
        } else if (cnt > 10) {
            weight = 0.8;
        } else if (cnt > 2.5) {
            weight = 0.7
        } else {
            weight = 0.6;
        }
        event.feature.set('weight', weight);
    });

    mygis.enbVector = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            image: new ol.style.Icon(({
                src: 'res/enb.png',
                crossOrigin: 'anonymous'
            })),
        })
    });

    mygis.map = new ol.Map({
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
            mygis.vector,
            mygis.enbVector
        ],
        // interactions: ol.interaction.defaults({
        //     doubleClickZoom :false,
        //     dragAndDrop: false,
        //     keyboardPan: false,
        //     keyboardZoom: false,
        //     mouseWheelZoom: false,
        //     pointer: false,
        //     select: false
        // }),
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({//30.6687010000,
//            center: ol.proj.transform([104.1215750000,30.6687010000], 'EPSG:4326', 'EPSG:3857'),
            center: [11590925.526935892, 3589829.0452608275],
            zoom: zoomLevel,
            maxZoom: 18,
            minZoom: 16
        })
    });
    mygis.map.getView().on('change:resolution', function (evt) {
        var index = parseInt(mygis.map.getView().getZoom());
        mygis.vector.setBlur(mygis.blur[index]);
        mygis.vector.setRadius(mygis.radius[index])
    });
//    readFiles();
//    createEnb();
};

function readFiles() {
    $.ajax({
        url: 'data/2018122010.topojson',
        dataType: 'json',
        success: function (data) {
            initHeat(data);
        }
    })
}

/*
FileReader共有4种读取方法：
1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
2.readAsBinaryString(file)：将文件读取为二进制字符串
3.readAsDataURL(file)：将文件读取为Data URL
4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
*/
// var wb;//读取完成的数据
// var rABS = false; //是否将文件读取为二进制字符串

// function importf(obj) {//导入
//     if (!obj.files) {
//         return;
//     }
//     var f = obj.files[0];
//     var reader = new FileReader();
//     reader.onload = function (e) {
//         var data = e.target.result;
//         initHeat(data);
//     };
//     if (rABS) {
//         reader.readAsArrayBuffer(f);
//     } else {
//         reader.readAsBinaryString(f);
//     }
// }

function initHeat(data) {
    var format = new ol.format.TopoJSON();
    var features = format.readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
    mygis.vector.getSource().clear();
    mygis.vector.getSource().addFeatures(features);
}

function createEnb() {
    var points = [
        // [104.119, 30.6705],
        // [104.116, 30.6688],
        // [104.122, 30.6730],
        // [104.118, 30.6666],
        // [104.122, 30.6731],
        [104.11853863, 30.66640026],
        [104.12053723, 30.66419774],
        [104.12153669, 30.66809865],
        [104.12453441, 30.67059707],
        [104.12453442, 30.67069712],
    ];
    var enbFeatures = [];
    points.forEach(e => {
        enbFeatures.push(new ol.Feature(
            new ol.geom.Point(ol.proj.transform(e, 'EPSG:4326', 'EPSG:3857'))
        ));
    });
    mygis.enbVector.getSource().clear();
    mygis.enbVector.getSource().addFeatures(enbFeatures);
}

//根据时间绘制热力图
function drawHeatDataByDateStr(dateStr){
    var rows = chenghuagisData.heatData[dateStr];
    var features = [];

    var position;
    rows.forEach(e => {
        var coordinates = ol.proj.transform([e[1],e[2]], 'EPSG:4326', 'EPSG:3857');
        if(!position){
            position = coordinates;
        }
        var feature = new ol.Feature({
          geometry: new ol.geom.Point(coordinates),
          properties: {
            "cnt": e[3]
          }
        });

        features.push(feature);
    });
    mygis.vector.getSource().clear();
    mygis.vector.getSource().addFeatures(features);
}


