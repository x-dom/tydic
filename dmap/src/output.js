import DMap from "./dmap/DMap";

import {defaultDMapOptions, defaultDPointStyleOptions, defaultDLineStyleOptions, defaultDPolygonStyleOptions, defaultDClusterStyleOptions} from './dmap/default/default';

import {HorizontalOrigin, VerticalOrigin} from './dmap/enum/Enum';

import {
    DMapControlBar, DCoordinatePickControl, DFullScreenControl, DHomeControl, DMeasureControl, 
    DNorthControl, DScaleControl, DSwitchControl, DZoomControl, DLayerInfoControl, 
    DLayerManageControl
} from "./dmap/control/control";

import {DFeature, DOverLay, DExtent} from "./dmap/feature/feature";
import {DPoint, DMultiPoint, DLineString, DMultiLineString, DPolygon, DMultiPolygon} from './dmap/geom/geom';
import {DHeatmapLayer, DVectorLayer, DTileWMSLayer, DTileXYZLayer, DClusterLayer, DMap3DTileLayer} from './dmap/layer/layer';

import {
    parseGeoJson, 
    parseGeoJsonByUrl, 
    parseGeometryByWkt, 
    parabolaEquation,
    transform, 
    transformExtent, 
    createSectorByXY, 
    getSectorCenterByXY,
    createEllipseByXY
} from './dmap/utils/geom';

import {parse2DStyle, parse3DStyle} from './dmap/utils/style';
import {calculateExtentByLayer, calculateExtentByFeatures} from "./dmap/utils/extent";

//API对象
const dmap = dmap||{};

//地图对象
dmap.DMap = DMap;

//默认配置
dmap.default = {};
dmap.default.defaultDMapOptions = defaultDMapOptions;
dmap.default.defaultDPointStyleOptions = defaultDPointStyleOptions;
dmap.default.defaultDLineStyleOptions = defaultDLineStyleOptions;
dmap.default.defaultDPolygonStyleOptions = defaultDPolygonStyleOptions;
dmap.default.defaultDClusterStyleOptions = defaultDClusterStyleOptions;

//枚举
dmap.enum = {};
dmap.enum.HorizontalOrigin = HorizontalOrigin;
dmap.enum.VerticalOrigin = VerticalOrigin;

//控件
dmap.control = {};
dmap.control.DMapControlBar = DMapControlBar;
dmap.control.DCoordinatePickControl = DCoordinatePickControl;
dmap.control.DFullScreenControl = DFullScreenControl;
dmap.control.DHomeControl = DHomeControl;
dmap.control.DMeasureControl = DMeasureControl;
dmap.control.DNorthControl = DNorthControl;
dmap.control.DScaleControl = DScaleControl;
dmap.control.DSwitchControl = DSwitchControl;
dmap.control.DZoomControl = DZoomControl;
dmap.control.DLayerInfoControl = DLayerInfoControl;
dmap.control.DLayerManageControl = DLayerManageControl;

//要素
dmap.feature = {};
dmap.feature.DFeature = DFeature;
dmap.feature.DOverLay = DOverLay;
dmap.feature.DExtent = DExtent;

//几何图形
dmap.geom = {};
dmap.geom.DPoint = DPoint;
dmap.geom.DMultiPoint = DMultiPoint;
dmap.geom.DLineString = DLineString;
dmap.geom.DMultiLineString = DMultiLineString;
dmap.geom.DPolygon = DPolygon;
dmap.geom.DMultiPolygon = DMultiPolygon;

//图层
dmap.layer = {};
dmap.layer.DVectorLayer = DVectorLayer;
dmap.layer.DHeatmapLayer = DHeatmapLayer;
dmap.layer.DTileWMSLayer = DTileWMSLayer;
dmap.layer.DTileXYZLayer = DTileXYZLayer;
dmap.layer.DClusterLayer = DClusterLayer;
dmap.layer.DMap3DTileLayer = DMap3DTileLayer;

dmap.utils = {};
//几何工具
dmap.utils.geom = {};
dmap.utils.geom.parseGeoJson = parseGeoJson;
dmap.utils.geom.parseGeoJsonByUrl = parseGeoJsonByUrl;
dmap.utils.geom.parseGeometryByWkt = parseGeometryByWkt;
dmap.utils.geom.transform = transform;
dmap.utils.geom.transformExtent = transformExtent;
dmap.utils.geom.createSectorByXY = createSectorByXY;
dmap.utils.geom.getSectorCenterByXY = getSectorCenterByXY;
dmap.utils.geom.parabolaEquation = parabolaEquation;
dmap.utils.geom.createEllipseByXY = createEllipseByXY;

//样式工具
dmap.utils.style = {};
dmap.utils.style.parse2DStyle = parse2DStyle;
dmap.utils.style.parse3DStyle = parse3DStyle;

//范围工具
dmap.utils.extent = {};
dmap.utils.extent.calculateExtentByLayer = calculateExtentByLayer;
dmap.utils.extent.calculateExtentByFeatures = calculateExtentByFeatures;

window.dmap = dmap;
// export  {dmap};