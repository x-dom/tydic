import {defaults as dDefaultControls, Rotate, Control, FullScreen, OverviewMap} from 'ol/control.js';
import OSM from 'ol/source/OSM';
import {Tile as TileLayer} from 'ol/layer';
const defaultControls = dDefaultControls({
  zoom: false,//缩放控件 
  attribution: false,//右下角的地图信息控件 
  rotate: false,//指北针控件
  rotateOptions: {
    autoHide: false
  },
});

const defaultViewOptions = {
  center: [104.0653, 30.6597],
  // constrainRotation: true,//旋转约束，真为无约束
  // enableRotation: true,//是否启用旋转
  // extent: null,//限制显示范围
  // resolution: null,//初始分辨率
  // maxResolution: 40075016.68557849/256,//最大分辨率
  // minResolution: 40075016.68557849/256/Math.pow(2,28),//最小分辨率
  maxZoom: 18,//用于确定分辨率约束的最大缩放级别,如果还提供了minresolution，它将优先于maxzoom。
  minZoom: 3,//用于确定分辨率约束的最小缩放级别,如果还提供了maxResolution，它将优先于minzoom。
  // projection: "EGSP:4326",//坐标参考系
  rotation: 0,//旋转角度,默认零度表示正北
  zoom: 17,//默认显示缩放级别
  zoomFactor: 2,//用于确定分辨率约束的缩放因子
}

const defaultMapOptions = {
  target: "map",
  baseLayer:new TileLayer({ source: new OSM() })
};

const defaultToolBarOptions = {
  //模式:view(展示)、edit(编辑)
  model: "view",

  //直接控制控件·
  mainPage: {show: true, center: [104.0653, 30.6597], zoom: 17},
  zoomIn: {show: true},
  zoomOut: {show: true},
  measureDistance: {show: true},
  measureArea: {show: true},
  move: {show: true},
  fullScreen: {show: true},
  
  //额外面板控件
  overView:{show: true, showControl: true},//鹰眼
  locationPick: {show: true, showControl: false},//坐标拾取
  locationSearch: {show: true, showControl: true},//地图搜索
  modelSwitch: {show: true, showControl: false},//模式切换
  layerControl: {show: false, showControl: true},//图层控制
  mapSwitch: {show: true, showControl: false},//地图切换
  featureSearch: {show: true, showControl: false},//要素搜索
  splitScreen: {show: true, showControl: false},//分屏
  timeAxis: {show: true, showControl: false},//时间轴
};

const defaultMod3dOptions = {build: true, show: false, target: undefined};

//默认地图配置
const defaultOptions = {
  map: defaultMapOptions,
  view: defaultViewOptions,
  toolBar: defaultToolBarOptions,
  mod3d: defaultMod3dOptions,
}


export {
  defaultOptions,
  defaultMapOptions, 
  defaultViewOptions, 
  defaultToolBarOptions, 
  defaultMod3dOptions,
 
  defaultControls,
  Rotate, 
  Control, 
  FullScreen, 
  OverviewMap
}