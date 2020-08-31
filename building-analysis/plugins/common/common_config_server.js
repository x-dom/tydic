var Common  = {};
Common.url_static_root =  "/busi";//
Common.url_server_root =  "http://10.140.16.120:7009/busi/server";//springboot server url
Common.url_geoserver =  'http://10.140.16.120:7009/busi/geoserver/postgres/wms';
Common.url_cell_layer =   'postgres:dm_commercial_complex_area_cnt_d';//geoserver server url
Common.url_grid_layer =   'postgres:dm_commercial_complex_cnt_d';//geoserver server url
Common.url_heat_layer =   'postgres:dm_commercial_complex_cnt_d';//geoserver server url

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

//map 10.140.16.106 local
Common.map_server_106_satellite_local = {};
Common.map_server_106_satellite_local.type = "XYZ";
// Common.map_server_106_satellite_local.url = 'http://10.140.16.106:8080/arcgis/satellite/{z}/{x}/{y}.jpg';
Common.map_server_106_satellite_local.url = 'http://10.140.16.120:7009/busi/arcgis/satellite/{z}/{x}/{y}.jpg';
Common.map_server_106_satellite_local.minimumLevel =  1;
Common.map_server_106_satellite_local.maximumLevel =  17;

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

//map local
Common.map_server_gaode_vector_local = {};
Common.map_server_gaode_vector_local.type = "XYZ";
Common.map_server_gaode_vector_local.url = 'http://10.140.16.120:7009/busi/mapgd/roadmap/{z}/{x}/{y}.png';
Common.map_server_gaode_vector_local.minimumLevel =  3;
Common.map_server_gaode_vector_local.maximumLevel =  18;

Common.map_server_gaode_satellite_local = {};
Common.map_server_gaode_satellite_local.type = "XYZ";
Common.map_server_gaode_satellite_local.url = 'http://10.140.16.120:7009/busi/mapgd/satellite/{z}/{x}/{y}.jpg';
Common.map_server_gaode_satellite_local.minimumLevel =  3;
Common.map_server_gaode_satellite_local.maximumLevel =  18;

Common.map_server = [];
// Common.map_server.push(Common.map_server_gaode_vector_online);
// Common.map_server.push(Common.map_server_gaode_satellite_online);
Common.map_server.push(Common.map_server_gaode_vector_local);
Common.map_server.push(Common.map_server_gaode_satellite_local);
