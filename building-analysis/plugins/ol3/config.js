var mapAddress = {
    "vectorLayer": [
        "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        "http://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        "http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"],

    "imageLayer": [
        "http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1",
        "http://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1",
        "http://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1",
        "http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1"],
    "lwLayer": [
        "http://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst04.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"]

};
var mapAddress_2 = {
    "vectorLayer": [
        "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
        "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
        "http://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
        "http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}"],
    "imageLayer": [
        "http://webst01.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1",
        "http://webst02.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1",
        "http://webst03.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1",
        "http://webst04.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1"],
    "lwLayer": [
        "http://webst01.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst02.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst03.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst04.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8"]
};
var queryUrl = "http://restapi.amap.com";

var allCity = {
		 "0" : [117.27,31.86],
		 "340000" : [117.27,31.86],
		 "340100" : [117.27,31.86],
		 "340700" : [117.82,30.93],
		 "341600" : [115.78,33.85],
		 "340600" : [116.77,33.97],
		 "340300" : [117.34,32.93],
		 "340200" : [118.38,31.33],
		 "341700" : [117.48,30.65],
		 "341100" : [118.31,32.33],
		 "340500" : [118.48,31.56],
		 "341200" : [115.81,32.89],
		 "341000" : [118.33,29.72],
		 "341300" : [116.97,33.63],
		 "341500" : [116.49,31.73],
		 "340800" : [117.03,30.52],
		 "341800" : [118.73,31.95],
		 "340400" : [116.98,32.62]
};


// var initCityId = "700";//默认城市
// var geoserverUrl = ["http://10.140.135.60:8090/geoserver"];
// var geoserverUrls = ["http://10.140.135.60:8090/geoserver/neto/wms"];
// var gwcurls = ["http://http://10.140.135.60:8090/geoserver/gwc/service/wms"];
// var geoserverWorkspace = "neto";
//
//
// if (window.location.host.indexOf('10.140.135.60') == 0) {
//     geoserverUrl = ["http://10.140.135.60:8090/geoserver"];
//     geoserverUrls = ["http://10.140.135.60:8090/geoserver/neto_qh/wms"];
//
//     mapAddress = {
//         "vectorLayer" : ["http://10.140.135.60:8090/gs-map/street/{z}/{x}/{y}"],
//
//         "imageLayer" : ["http://10.140.135.60:8090/gs-map/satellite/{z}/{x}/{y}"]
//     };
//     mapAddress_2 = {
//         "vectorLayer" : ["http://10.140.135.60:8090/gs-map/street/${z}/${x}/${y}"],
//
//         "imageLayer" : ["http://10.140.135.60:8090/gs-map/satellite/${z}/${x}/${y}"]
//     };
// }

var initCityId = "700";//默认城市
var geoserverUrl = ["http://134.64.116.90:18090/geoserver"];
var geoserverUrls = ["http://134.64.116.90:18090/geoserver/neto/wms"];
var gwcurls = ["http://134.64.116.90:18090/geoserver/gwc/service/wms"];
var geoserverWorkspace = "neto";

if(window.location.host.indexOf('localhost') == 0){
    geoserverUrl = ["http://134.64.116.90:18090/geoserver"];
    geoserverUrls = ["http://134.64.116.90:18090/geoserver/neto/wms"];
    gwcurls = ["http://134.64.116.90:18090/geoserver/gwc/service/wms"];

//    geoserverUrl = ["http://192.168.128.108:8090/geoserver"];
//    geoserverUrls = ["http://192.168.128.108:8090/geoserver/neto/wms"];
//    gwcurls = ["http://http://192.168.128.108:8090/geoserver/gwc/service/wms"];
}

if (window.location.host.indexOf('134.224.134.29') == 0 || window.location.host.indexOf('134.224.134.30') == 0) {
    geoserverUrl = ["http://134.224.134.29:8080/geoserver"];
    geoserverUrls = ["http://134.224.134.29:8080/geoserver/neto/wms"];
    gwcurls = ["http://134.224.134.29:8080/geoserver/gwc/service/wms"];

    mapAddress = {
        "vectorLayer" : [
            "http://134.224.127.198:8081/webrd01/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            "http://134.224.127.198:8081/webrd02/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            "http://134.224.127.198:8081/webrd03/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            "http://134.224.127.198:8081/webrd04/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}" ],

        "imageLayer" : [
            "http://134.224.127.198:8081/webst01/appmaptile?style=6&x={x}&y={y}&z={z}",
            "http://134.224.127.198:8081/webst02/appmaptile?style=6&x={x}&y={y}&z={z}",
            "http://134.224.127.198:8081/webst03/appmaptile?style=6&x={x}&y={y}&z={z}",
            "http://134.224.127.198:8081/webst04/appmaptile?style=6&x={x}&y={y}&z={z}" ],
        "lwLayer" : [ "http://134.224.127.198:8081/webst01/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://134.224.127.198:8081/webst02/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://134.224.127.198:8081/webst03/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://134.224.127.198:8081/webst04/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8" ]

    };

    mapAddress_2 = {
        "vectorLayer" : [
            "http://134.224.127.198:8081/webrd01/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
            "http://134.224.127.198:8081/webrd02/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
            "http://134.224.127.198:8081/webrd03/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
            "http://134.224.127.198:8081/webrd04/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}" ],

        "imageLayer" : [
            "http://134.224.127.198:8081/webst01/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
            "http://134.224.127.198:8081/webst02/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
            "http://134.224.127.198:8081/webst03/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
            "http://134.224.127.198:8081/webst04/appmaptile?style=6&x=${x}&y=${y}&z=${z}" ],
        "lwLayer" : [ "http://134.224.127.198:8081/webst01/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://134.224.127.198:8081/webst02/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://134.224.127.198:8081/webst03/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://134.224.127.198:8081/webst04/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8" ]

    };
    queryUrl = "http://134.224.127.198:8085";
}
