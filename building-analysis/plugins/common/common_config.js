const Common  = {};
Common.url_static_root =  "";//
Common.url_server_root =  "http://192.168.10.212:8002/building-analysis-server";//springboot server url
Common.url_geoserver =  'http://192.168.10.212:9600/geoserver/postgres/wms';//geoserver server url
Common.url_cell_layer =   'postgres:dw_commercial_area_info';//geoserver server url
Common.url_grid_layer =   'postgres:dm_commercial_complex_user_h_bak';//geoserver server url
Common.url_heat_layer =   'postgres:dm_commercial_complex_user_h_bak';//geoserver server url

//map google satellite online
Common.map_server_google_satellite_online = {};
Common.map_server_google_satellite_online.type = "XYZ";
Common.map_server_google_satellite_online.url = 'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}';
Common.map_server_google_satellite_online.minimumLevel =  1;
Common.map_server_google_satellite_online.maximumLevel =  20;

//map tianditu symbol online
Common.map_server_tianditu_symbol_online = {};
Common.map_server_tianditu_symbol_online.type = "XYZ";
Common.map_server_tianditu_symbol_online.url = 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d42fd762c9bb221d415d6d7eb6921f29';
Common.map_server_tianditu_symbol_online.minimumLevel =  1;
Common.map_server_tianditu_symbol_online.maximumLevel =  20;


//map gaode vector online
Common.map_server_gaode_vector_online = {};
Common.map_server_gaode_vector_online.type = "XYZ";
Common.map_server_gaode_vector_online.url = 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';
Common.map_server_gaode_vector_online.minimumLevel =  1;
Common.map_server_gaode_vector_online.maximumLevel =  18;

//map gaode satellite online
Common.map_server_gaode_satellite_online = {};
Common.map_server_gaode_satellite_online.type = "XYZ";
Common.map_server_gaode_satellite_online.url = 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
Common.map_server_gaode_satellite_online.minimumLevel =  1;
Common.map_server_gaode_satellite_online.maximumLevel =  18;

//map gaode symbol online
Common.map_server_gaode_symbol_online = {};
Common.map_server_gaode_symbol_online.type = "XYZ";
Common.map_server_gaode_symbol_online.url = 'http://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8';
Common.map_server_gaode_symbol_online.minimumLevel =  1;
Common.map_server_gaode_symbol_online.maximumLevel =  18;

//map 10.40.16.106 local
Common.map_server_satellite_local_106 = {};
Common.map_server_satellite_local_106.type = "XYZ";
Common.map_server_satellite_local_106.url = 'http://10.140.16.106:8080/arcgis/satellite/{z}/{x}/{y}.jpg';
Common.map_server_satellite_local_106.minimumLevel =  1;
Common.map_server_satellite_local_106.maximumLevel =  17;


//map local
Common.map_server_gaode_vector_local = {};
Common.map_server_gaode_vector_local.type = "XYZ";
Common.map_server_gaode_vector_local.url = 'http://localhost:8080/mapabc/roadmap/{z}/{x}/{y}.png';
Common.map_server_gaode_vector_local.minimumLevel =  3;
Common.map_server_gaode_vector_local.maximumLevel =  18;

Common.map_server_gaode_satellite_local = {};
Common.map_server_gaode_satellite_local.type = "XYZ";
Common.map_server_gaode_satellite_local.url = 'http://localhost:8080/mapabc/satellite/{z}/{x}/{y}.jpg';
Common.map_server_gaode_satellite_local.minimumLevel =  3;
Common.map_server_gaode_satellite_local.maximumLevel =  18;

Common.map_server_gaode_symbol_local = {};
Common.map_server_gaode_symbol_local.type = "XYZ";
Common.map_server_gaode_symbol_local.url = 'http://localhost:8080/mapabc/overlay/{z}/{x}/{y}.png';
Common.map_server_gaode_symbol_local.minimumLevel =  3;
Common.map_server_gaode_symbol_local.maximumLevel =  18;

Common.map_server = [];
// Common.map_server.push(Common.map_server_google_satellite_online);
// Common.map_server.push(Common.map_server_tianditu_symbol_online);
Common.map_server.push(Common.map_server_gaode_vector_online);
Common.map_server.push(Common.map_server_gaode_satellite_online);
// Common.map_server.push(Common.map_server_gaode_vector_local);
// Common.map_server.push(Common.map_server_gaode_satellite_local);
// Common.map_server.push(Common.map_server_gaode_symbol_online);
// Common.map_server.push(Common.map_server_satellite_local_106);

Common.tianditu_area_search_url = 'http://api.tianditu.gov.cn/administrative?postStr={"searchWord":"中国","searchType":"1","needSubInfo":"true","needAll":"false","needPolygon":"true","needPre":"true"}&tk=658acf2fa30bbea1ee90f0251fcc1479';

/**
 * 日期格式化
 * @param fmt 格式'yyyyMMdd'
 * @returns
 */
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1,                 //月份
      "d+": this.getDate(),                    //日
      "h+": this.getHours(),                   //小时
      "m+": this.getMinutes(),                 //分
      "s+": this.getSeconds(),                 //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};