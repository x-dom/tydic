
/**
 * 显示条件
 */
const displayCondition = {
    building: {
        maximumScreenSpaceError: 128
    },
    areaWall: {
        minDistance: 0.0,
        maxDistance: 4200.0
    },
    road: {
        minDistance: 0.0,
        maxDistance: 1000000.0
    },
    signalTower: {
        minDistance: 0.0,
        maxDistance: 4200.0
    },
    compsePoint: {
        minDistance: 4200.0,
        maxDistance: Number.MAX_VALUE
    },
    rru: {
        minDistance: 0.0,
        maxDistance: 4200
    },
    signalSimulation: {
        minDistance: 0.0,
        maxDistance: 4200
    },
    signalHouse: {
        minDistance: 0.0,
        maxDistance: 4200
    },
};

/**
 * 资源路径
 */
const sourcePath = {
    building: {
        url: './gismap/data/xj_building_test/tileset.json',
    },
    areaWall: {
        url: './gismap/data/xj_area_test.geojson',
    },
    road: {
        line1: './gismap/data/xj_wlmq_line1.geojson',
        line2: './gismap/data/xj_wlmq_line2.geojson',
        line3: './gismap/data/xj_wlmq_line3.geojson',
        line4: './gismap/data/xj_wlmq_line4.geojson',
        line5: './gismap/data/xj_wlmq_line5.geojson',
    },
};

/**
 * Gis参数配置
 */
export default class GisConfig{
    constructor() {
        this.buildingTileset;//建筑
        this.areaWallPrimitive;//区域
        this.cityRoadNet;//路网
        this.signalTowerMap = new Map();//信号塔
        this.signalHouseMap = new Map();//机房
        this.signalSectorMap = new Map();//扇区、天线
        this.signalRRUMap = new Map();//RRU
        this.composePointMap = new Map();//组合点
        this.signaInfoWinMap = new Map();//弹窗
        this.signaInfluInfoWinMap = new Map();//影响弹窗
        this.preSignaSector;//预览扇区
        this.tipInfoWin;//提示弹窗 

        this.sourcePath = sourcePath;//资源路径
        this.displayCondition = displayCondition;//显示条件
    }
}