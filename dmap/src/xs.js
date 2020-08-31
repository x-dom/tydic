import "./output";
import 'cesium/Widgets/widgets.css';
const Cesium = require('cesium/Cesium');
// import DMapToolBar from "./dmap/control/DMapToolBar";
import {GetMarcoXyArcArray, AngleUtil} from "./dmap/utils/common/angle";

console.log("Hello world!");
var center = dmap.utils.geom.transform([104.0653, 30.6597],"EPSG:4326", "EPSG:3857");
var map = new dmap.DMap({
    only2D: false, 
    showSatelliteMap: false, 
    showSymbolMap: false, 
    currentStatus: '2d',
    center: [104.0653, 30.6597], 
    zoom:15 , 
    projection: "EPSG:4326",
    controlbarOptions:{
        home: {
            on2D: true,
            on3D: true,
            center: [104.0653, 30.6597],
            projection: "EPSG:4326",
            zoom: 10,
        },
        zoom: {
            on2D: true,
            on3D: true,
        },
        north: {
            on2D: true,
            on3D: true,
        },
        switch: {
            on2D: true,
            on3D: true,
        },
        fullscreen: {
            on2D: true,
            on3D: true,
        },
        measure: {
            on2D: true,
            on3D: true,
        },
        coordinatepick: {
            on2D: true,
            on3D: true,
            isShowControl: false,
        },
        overview: {
            on2D: true,
            on3D: true,
            isShowControl: false,
        },
        layerManage: {
            on2D: true,
            on3D: true,
            isShowControl: false,
        },
        position: {
            on2D: true,
            on3D: true,
            isShowControl: false,
        },
        satellite: {
            on2D: true,
            on3D: true,
            isShowControl: false,
        },
    }});
window.map = map;
window.Cesium = Cesium;

//点击事件
map.eventObj.on("click",function(evt){
    console.log(evt);
});

/*绘制点测试 */
var point = new dmap.geom.DMultiPoint({coordinates: [[104.0653, 30.6597, 45]]});
var pointFeature = new dmap.feature.DFeature({geometry: point, properties: {name: '测试绘制点', height: 30}});
var point1 = new dmap.geom.DPoint({coordinates: [11584288, 3588514, 45], projection: "EPSG:3857"});
var pointFeature1 = new dmap.feature.DFeature({geometry: point1, properties: {name: '测试绘制点1', height: 40}});
var point2 = new dmap.geom.DPoint({coordinates: [104.0653, null, 45]});
var pointFeature2 = new dmap.feature.DFeature({geometry: point2, properties: {name: '测试绘制点2', height: "100"}});
var point3 = new dmap.geom.DPoint({coordinates: [104.085, 30.6453, 45]});
var pointFeature3 = new dmap.feature.DFeature({geometry: point3, properties: {name: '测试绘制点3', height: "100"}});
var pointLayer = new dmap.layer.DVectorLayer({
                            name: "绘制点测试",
                            data: [ pointFeature1, pointFeature2, pointFeature3],
                            style: dmap.default.defaultDPointStyleOptions,
                            only2D: false,
                            index: 5,
                            infoWindowOptions: {
                                show: true
                            }
                        }); 
map.addLayer(pointLayer);
window.pointLayer = pointLayer;

/*绘制线测试 */
var line = new dmap.geom.DLineString({coordinates: [[104.0653, 30.6597, 45],[104.0663194656372, 30.66250067048054, 45],[104.0687, 30.6632, 45],[104.0675, 30.6609, 45]]});
var lineFeature = new dmap.feature.DFeature({geometry: line, properties: {name: '测试绘制线'}});
var lineLayer = new dmap.layer.DVectorLayer({
                            name: "绘制线测试",
                            minZoom: 15,
                            maxZoom: 18,
                            data: [lineFeature],
                            style: dmap.default.defaultDLineStyleOptions,
                            only2D: false,
                            index: 9
                        }); 
map.addLayer(lineLayer);

/*绘制面测试 */
let polygonJson = {
    "type": "Feature",
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [
                    [104.0663194656372, 30.66250067048054, 45],
                    [104.06887292861937, 30.662509899277126, 45],
                    [104.0667700767517, 30.660617977543637, 45]
                    // [104.06979560852051, 30.660645664470195, 45],
                    // [104.06729578971863, 30.659325912150038, 45],
                    // [104.07021403312683, 30.659344370348677, 45],
                    // [104.0663194656372, 30.66250067048054, 45]
                ]
            ]
        ]
    },
    "properties": {
        "MOVEMENT_ID": "1",
        "DISPLAY_NAME": "300 Pennsview Court, Pittsburgh",
        "GEOID10": "42003459202",
        "name": "GeoJSON测试用例",
    }
};

polygonJson = JSON.stringify(polygonJson);
let polygonFeatures = dmap.utils.geom.parseGeoJson(polygonJson);
polygonFeatures.push(pointFeature);
var polygonLayer = new dmap.layer.DVectorLayer({
                            data: polygonFeatures,
                            style: dmap.default.defaultDPolygonStyleOptions,
                            only2D: false,
                            index: 7,
                            infoWindowOptions: {
                                show: true,
                                width: 400
                            }
                        }); 
map.addLayer(polygonLayer);

// // 测试添加瓦片地图
// let wmsLayer = new dmap.layer.DTileWMSLayer({
//     only2D: false,
//     serverUrl: "http://localhost:9600/geoserver/topp/wms",
//     layers: "topp:states",
//     index: 10,
//     infoWindowOptions: {
//         show: true
//     }
// });
// map.addLayer(wmsLayer);

// // 测试添加瓦片地图
// let xyzLayer = new dmap.layer.DTileXYZLayer({});
// map.addLayer(xyzLayer);



// //测试添加热力图
// function getHeatData(length) {
//     var data = [];
//     for (var i = 0; i < length; i++) {
//         var x = Math.random() + 104;
//         var y = Math.random() + 30;
//         var p = new dmap.geom.DPoint({coordinates: [x, y, 45]});
//         var pf = new dmap.feature.DFeature({geometry: p, properties: {name: '测试热力点'}});
      
//         data.push(pf);
//     }
//     return data;
// }

// // random example data
// let heatMapData = getHeatData(300);
// let heatMapLayer = new dmap.layer.DHeatmapLayer({
//     // data: heatMapData,
//     only2D: false,
//     style: {
//         radius: 100,
//         blur: 0.2,
//         shadow: 250,
//         renderMode: "image",
//         displayCondition: {//显示条件
//             near: 0,
//             far: 2e7,
//             minResolution: 0,
//             maxResolution: 0.17578125,
//         }
//     },
// });
// map.addLayer(heatMapLayer);
// $.ajax({
//     url:"http://localhost:8701/data/cdpoint.geojson",
//     // url:"http://localhost:8701/data/anhui.json",
//     dataType: "json",
//     method: "get",
//     success: function(json){
//         let polygonFeatures = dmap.utils.geom.parseGeoJson(json);
//         heatMapLayer.setData(polygonFeatures);
//         heatMapLayer.viewAll();
//     }
// });

// /*绘制聚合测试 */
// let clusterPoint1 = new dmap.geom.DPoint({coordinates: [104.0603, 30.6607, 45]});
// let clusterFeature1 = new dmap.feature.DFeature({geometry: clusterPoint1, properties: {name: '测试绘制聚合'}});
// let clusterPoint2 = new dmap.geom.DPoint({coordinates: [104.0613, 30.6607, 45]});
// let clusterFeature2 = new dmap.feature.DFeature({geometry: clusterPoint2, properties: {name: '测试绘制聚合'}});
// let clusterPoint3 = new dmap.geom.DPoint({coordinates: [104.0603, 30.6627, 45]});
// let clusterFeature3 = new dmap.feature.DFeature({geometry: clusterPoint3, properties: {name: '测试绘制聚合'}});
// let clusterPoint4 = new dmap.geom.DPoint({coordinates: [104.0653, 30.6587, 45]});
// let clusterFeature4 = new dmap.feature.DFeature({geometry: clusterPoint4, properties: {name: '测试绘制聚合'}});
// let clusterPoint5 = new dmap.geom.DPoint({coordinates: [104.0653, 30.6557, 45]});
// let clusterFeature5 = new dmap.feature.DFeature({geometry: clusterPoint5, properties: {name: '测试绘制聚合'}});
// let clusterData = [clusterFeature1, clusterFeature2, clusterFeature3, clusterFeature4, clusterFeature5];
// let clusterLayer = new dmap.layer.DClusterLayer({
//                             minZoom: 10,
//                             maxZoom: 18,
//                             // data: clusterData,
//                             only2D: false
//                         }); 
// map.addLayer(clusterLayer);
// clusterLayer.addDatas(clusterData);

//测试绘制扇形及弧线
function test(){
    var A= AngleUtil.LatLng(104.0547, 30.6590);
	var B= AngleUtil.getLatLng(A, 0.2, 200);
    var C= AngleUtil.getLatLng(A, 0.2, 100);
    var aglAB = AngleUtil.getAngle(A,B);
    var aglAC = AngleUtil.getAngle(A,C);
    var radian = aglAC - aglAB;
    var cellPolygonArr1 = GetMarcoXyArcArray([A.m_Longitude, A.m_Latitude], 200, 200, radian, AngleUtil.getAngle(A,B) + radian/2);
    var cellPolygon1 = new dmap.geom.DPolygon({coordinates: cellPolygonArr1, projection: "EPSG:3857"});
    var cellFeature1 = new dmap.feature.DFeature({geometry: cellPolygon1, properties: {name: '测试绘制扇形'}});
    polygonLayer.addData(cellFeature1);

    var line1 = new dmap.geom.DLineString({coordinates: [[A.m_Longitude, A.m_Latitude, 45],[B.m_Longitude, B.m_Latitude, 45]]});
    var lineFeature1 = new dmap.feature.DFeature({geometry: line1, properties: {name: '测试绘制线1'}});
    lineLayer.addData(lineFeature1);

    var line2 = new dmap.geom.DLineString({coordinates: [[A.m_Longitude, A.m_Latitude, 45],[C.m_Longitude, C.m_Latitude, 45]]});
    var lineFeature2 = new dmap.feature.DFeature({geometry: line2, properties: {name: '测试绘制线2'}});
    lineLayer.addData(lineFeature2);
}

test();

// $.ajax({
//     url:"http://localhost:8701/data/panzhihua.geojson",
//     dataType: "json",
//     method: "get",
//     success: function(json){
//         let polygonFeatures = dmap.utils.geom.parseGeoJson(json);
//         polygonLayer.setData(polygonFeatures);
//         polygonLayer.viewAll();
//     }
// });

// 测试3DTiles加载
var threeTilesLayer = new dmap.layer.DMap3DTileLayer({
                            url: "data/chengdu-4huan/tileset.json",
                            cesium3DTileStyleJson: {
                                color : `vec4(0, 0.5, 1.0,1)`,
                            },
                            extraShader: {
                                shaderDebug: false,
                                headVS: ` varying vec3 xs_positionMC;`,
                                contentVS: ` xs_positionMC = a_position.xyz;`,
                                headFS: ` varying vec3 xs_positionMC;`,
                                contentFS: `
                                    float position3DZ = xs_positionMC.z;
                                    float randomNum1 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                                    float channelNum = position3DZ / 30.0 + sin(randomNum1) * 0.2;
                                    gl_FragColor *= vec4(channelNum, channelNum, channelNum, 1.0);

                                    float randomNum2 = fract(czm_frameNumber / 360.0);
                                    randomNum2 = abs(randomNum2 - 0.5) * 2.0;
                                    float changeH = clamp(position3DZ / 100.0, 0.0, 1.0);
                                    float changeDiff = step(0.005, abs(changeH - randomNum2));
                                    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - changeDiff);
                                `,
                            }
                        }); 
map.addLayer(threeTilesLayer);
