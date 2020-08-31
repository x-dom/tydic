var mapAddress = {
    "vectorLayer": [
        "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        "http://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        "http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"],

    "imageLayer": [
        "http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        "http://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        "http://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        "http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"],
    "lwLayer": ["http://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
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
        "http://webst01.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
        "http://webst02.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
        "http://webst03.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
        "http://webst04.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${z}"],
    "lwLayer": [
        "http://webst01.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst02.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst03.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
        "http://webst04.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8"]
};
var queryUrl = "http://restapi.amap.com";


var allCity = {
    "0": [87.055664, 42.764361],
    "6501": [87.616848, 43.825592],
    "6502": [84.889207, 45.579888],
    "6504": [89.184074, 42.947613],
    "6522": [93.513161, 42.833248],
    "6523": [87.308224, 44.011182],
    "6527": [82.066159, 44.905588],
    "6528": [86.145298, 41.764115],
    "6529": [80.260605, 41.168779],
    "6530": [76.167819, 39.714526],
    "6531": [75.989755, 39.4704],
    "6532": [79.922211, 37.114157],
    "6540": [81.324136, 43.916823],
    "6542": [82.980316, 46.745364],
    "6543": [88.141253, 47.844924],
    "6591": [86.078918, 44.306581],
    "6590": [84.901754, 44.426947],
    "6592": [81.280680, 40.548016],
    "6593": [79.069028, 39.864928],
    "6594": [87.540221, 44.168020],
    "650202": [84.886974, 44.328096],
    "650203": [84.867844, 45.602526],
    "650204": [85.131696, 45.687855],
    "650205": [85.693742, 46.089148],
    "650402": [89.182342, 42.947635],
    "650421": [90.21333, 42.868744],
    "650422": [88.653814, 42.792521],
    "652201": [93.514916, 42.818501],
    "652222": [93.016625, 43.598763],
    "652223": [94.697074, 43.254978],
    "652302": [87.946894, 44.168576],
    "652323": [86.898902, 44.191428],
    "652324": [86.213997, 44.303893],
    "652325": [89.593967, 44.022066],
    "652327": [89.180437, 44.000497],
    "652328": [90.286028, 43.834689],
    "652701": [82.051005, 44.85387],
    "652702": [82.559396, 45.172228],
    "652722": [82.894195, 44.600408],
    "652723": [81.024816, 44.968857],
    "652801": [86.174633, 41.725892],
    "652822": [84.252156, 41.777702],
    "652823": [86.261321, 41.343933],
    "652824": [88.167152, 39.023242],
    "652825": [85.529702, 38.145486],
    "652826": [86.574067, 42.059759],
    "652827": [86.384065, 42.323625],
    "652828": [86.863963, 42.268371],
    "652829": [86.631998, 41.980152],
    "652901": [80.260605, 41.168779],
    "652922": [80.238959, 41.276688],
    "652923": [82.962016, 41.717906],
    "652924": [82.781819, 41.221667],
    "652925": [82.60922, 41.548118],
    "652926": [81.874156, 41.79691],
    "652927": [79.224445, 41.214652],
    "652928": [80.373137, 40.644529],
    "652929": [79.047291, 40.50834],
    "653001": [76.1684, 39.71616],
    "653022": [75.947396, 39.147785],
    "653023": [78.446253, 40.936936],
    "653024": [75.259228, 39.71931],
    "653101": [75.989755, 39.4704],
    "653121": [75.862814, 39.375044],
    "653122": [76.048139, 39.401385],
    "653123": [76.175729, 38.930382],
    "653124": [77.260103, 38.184955],
    "653125": [77.245761, 38.414217],
    "653126": [77.413836, 37.882989],
    "653127": [77.610105, 38.898666],
    "653128": [76.773163, 39.2242],
    "653129": [76.72372, 39.488182],
    "653130": [78.549297, 39.785155],
    "653131": [75.229889, 37.772094],
    "653201": [79.913534, 37.112149],
    "653221": [79.81907, 37.120031],
    "653222": [79.728841, 37.27734],
    "653223": [78.283669, 37.62145],
    "653224": [80.188986, 37.073667],
    "653225": [80.806159, 36.998335],
    "653226": [81.677418, 36.857081],
    "653227": [82.695862, 37.06408],
    "654002": [81.27795, 43.908558],
    "654003": [84.903267, 44.426529],
    "654004": [80.420759, 44.201669],
    "654021": [81.527453, 43.977138],
    "654022": [81.151337, 43.840726],
    "654023": [80.874181, 44.053592],
    "654024": [82.231718, 43.482628],
    "654025": [83.26077, 43.42993],
    "654026": [81.130975, 43.157293],
    "654027": [81.836206, 43.217184],
    "654028": [82.51181, 43.800247],
    "654201": [82.978928, 46.748523],
    "654202": [84.713736, 44.418887],
    "654221": [83.628303, 46.524673],
    "654223": [85.619416, 44.326388],
    "654224": [83.606951, 45.947638],
    "654225": [82.982668, 46.201104],
    "654226": [85.728328, 46.793235],
    "654301": [88.131842, 47.827309],
    "654321": [86.874897, 47.70185],
    "654322": [89.525504, 46.994115],
    "654323": [87.486703, 47.111919],
    "654324": [86.418621, 48.060846],
    "654325": [90.382961, 46.674205],
    "654326": [85.874096, 47.443101],
    "659001": [86.080602, 44.306097],
    "659002": [81.285884, 40.541914],
    "659003": [79.069332, 39.864867],
    "659004": [87.54324, 44.166757],
    "650102": [87.6326682283, 43.7945885502],
    "650101": [87.6169536324, 43.8257613607],
    "650103": [87.5981442822, 43.8009972875],
    "650104": [87.5740403432, 43.8437199023],
    "650105": [87.6425073162, 43.8324642806],
    "650106": [87.4280931138, 43.8771173229],
    "650107": [88.3110408172, 43.3637652819],
    "650109": [87.6561700660, 43.9737438741],
    "650121": [87.4093114597, 43.4713240778],
    "650201": [84.8893332143, 45.5800570017]
};
var initCityId = "6501";//默认城市
var geoserverUrl = ["http://222.83.4.45:6001/geoserver"];
var geoserverUrls = ["http://222.83.4.45:6001/geoserver/neto/wms"];
var geoserverWorkspace = "neto";
var gwcurls = "http://222.83.4.45:6001/geoserver/gwc/service/wms";
var HTTP_PROTOCOL_Name='http://';
var HOST_PATH = '192.168.10.214:8011/tydic-xj-integration-backend/';
// var HOST_PATH = '172.16.30.13:8011/tydic-xj-integration-backend/';
var BACK_SERVER_URL = HTTP_PROTOCOL_Name+HOST_PATH;

if (window.location.host === '135.224.181.90:6001') {
    mapAddress = {
        "vectorLayer": [
            "http://135.224.181.90:6002/webrd01/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            "http://135.224.181.90:6002/webrd02/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            "http://135.224.181.90:6002/webrd03/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            "http://135.224.181.90:6002/webrd04/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"],

        "imageLayer": [
            "http://135.224.181.90:6002/webst01/appmaptile?style=6&x={x}&y={y}&z={z}",
            "http://135.224.181.90:6002/webst02/appmaptile?style=6&x={x}&y={y}&z={z}",
            "http://135.224.181.90:6002/webst03/appmaptile?style=6&x={x}&y={y}&z={z}",
            "http://135.224.181.90:6002/webst04/appmaptile?style=6&x={x}&y={y}&z={z}"],
        "lwLayer": ["http://135.224.181.90:6002/webst01/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://135.224.181.90:6002/webst02/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://135.224.181.90:6002/webst03/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://135.224.181.90:6002/webst04/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"]

    };
    mapAddress_2 = {
        "vectorLayer": [
            "http://135.224.181.90:6002/webrd01/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
            "http://135.224.181.90:6002/webrd02/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
            "http://135.224.181.90:6002/webrd03/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}",
            "http://135.224.181.90:6002/webrd04/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}"],

        "imageLayer": [
            "http://135.224.181.90:6002/webst01/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
            "http://135.224.181.90:6002/webst02/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
            "http://135.224.181.90:6002/webst03/appmaptile?style=6&x=${x}&y=${y}&z=${z}",
            "http://135.224.181.90:6002/webst04/appmaptile?style=6&x=${x}&y=${y}&z=${z}"],
        "lwLayer": ["http://135.224.181.90:6002/webst01/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://135.224.181.90:6002/webst02/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://135.224.181.90:6002/webst03/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8",
            "http://135.224.181.90:6002/webst04/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8"]

    };
    queryUrl = "http://134.224.127.198:8085"; //待转发
    geoserverUrl = ["http://135.224.181.90:6001/geoserver"];
    geoserverUrls = ["http://135.224.181.90:6001/geoserver/neto/wms"];
    gwcurls = "http://222.83.4.45:6001/geoserver/gwc/service/wms";
}

/**
 * 地图初始化配置
 */
var MapConfig = {};
/**
 * 分辨率
 */
MapConfig.Resolutions = [
    611.4962261962891,
    305.74811309814453,
    152.87405654907226,
    76.43702827453613,
    38.218514137268066,
    19.109257068634033,  //默认的第3级
    9.554628534317016,
    4.777314267158508,
    2.388657133579254,
    1.194328566789627,
    0.5971642833948135
];
/**
 * 初始化等级
 */
MapConfig.InitZoomLevel = 3;
/**
 * 等级数
 */
MapConfig.NumZoomLevels = 11;
/**
 * 最大分辨率
 */
MapConfig.MaxResolution = 10;

/**
 * 最小分辨率
 */
MapConfig.MinResolution = 70;//高速、高铁分段显示
/**
 * 全图范围
 */
MapConfig.FullExtent = [9709014.77097, 5420490.77293, 9794929.99075, 5461461.02009];
