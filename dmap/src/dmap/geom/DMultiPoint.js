import {MultiPoint, MultiPolygon} from 'ol/geom.js';
import {transform, createCircleByXY, createSquareByXY, createHexagonByXY, createSectorByXY} from "../utils/geom";
import DGeometry from './DGeometry';
const Cesium = require('cesium/Cesium');

export default class DMultiPoint extends DGeometry{

    constructor(options){
        let defaultParams = {};
        let use_options = {};
        //合并参数
        $.extend(use_options,defaultParams, options);
        super(use_options);
        this.type="MultiPoint";
        
    };
    /**
     * 设置点的 数据
     * @param {*} coordinates 点的 经纬度 列表
     * @param {*} projection 点数据的 坐标系
     */
    setCoordinates(coordinates, projection){
        this.coordinates = coordinates;
        this.projection = projection || this.projection;
    }
    /**
     * 设置数据坐标系
     * @param {*} projection 
     */
    setProjection(projection){
        this.projection = projection;
    }
    /**
     * 实例化 点2D Geometry 对象
     */
    get2DGeometry(projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:3857";
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            const coor = transform(a1,this.projection, targetProjection);
            useArray.push(coor);
        }

        let point = new MultiPoint(useArray);
        return point;
    }

    /**
     * 获取3d绘制坐标数组
     */
    get3DGeometry(projection){
        let targetProjection = projection || "EPSG:4326";
        let useArray = [];
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            const coor = transform(a1,this.projection, targetProjection);
            useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], coor[2]));
        }
        return useArray;
    }

    /**
     * 获取2D圆
     */
    get2DCircle(radius, sizes, projection){
        let useArray= [];
        useArray.push([]);
        let targetProjection = projection || "EPSG:3857";
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            a1 = transform(a1, this.projection, targetProjection);
            const coor = createCircleByXY(a1[0], a1[1], radius, sizes, targetProjection);
            useArray[0].push(coor);
        }
        let polygon = new MultiPolygon(useArray);
        return polygon;
    }

    /**
     * 获取2D正方形
     */    
    get2DSquare(radius, angle, projection){
        let useArray= [];
        useArray.push([]);
        let targetProjection = projection || "EPSG:3857";
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            a1 = transform(a1, this.projection, targetProjection);
            const coor = createSquareByXY(a1[0], a1[1], radius, angle, targetProjection);
            useArray[0].push(coor);
        }

        let polygon = new MultiPolygon(useArray);
        return polygon;
    }
    
    /**
     * 获取2D六边形
     */
    get2DHexagon(radius, angle, projection){
        let useArray= [];
        useArray.push([]);
        let targetProjection = projection || "EPSG:3857";
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            a1 = transform(a1, this.projection, targetProjection);
            const coor = createHexagonByXY(a1[0], a1[1], radius, angle, targetProjection);
            useArray[0].push(coor);
        }

        let polygon = new MultiPolygon(useArray);
        return polygon;
    }

    /**
     * 获取2D扇形
     */
    get2DSector(radius, sAngle, angle, projection){
        let useArray= [];
        useArray.push([]);
        let targetProjection = projection || "EPSG:3857";
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            a1 = transform(a1, this.projection, targetProjection);
            const coor = createSectorByXY(a1[0], a1[1], radius, sAngle, angle, targetProjection);
            useArray[0].push(coor);
        }

        let polygon = new MultiPolygon(useArray);
        return polygon;
    }

    /**
     * 获取2D圆
     */
    get2DEllipse(radiusX, radiusY, angle, sizes, projection){
        let useArray= [];
        useArray.push([]);
        let targetProjection = projection || "EPSG:3857";
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            a1 = transform(a1, this.projection, targetProjection);
            const coor = createEllipseByXY(a1[0], a1[1], radiusX, radiusY, angle, sizes, targetProjection);
            useArray[0].push(coor);
        }
        let polygon = new MultiPolygon(useArray);
        return polygon;
    }
    
    /**
     * 获取3D圆
     */
    get3DCircle(radius, sizes, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:4326";
        let point = transform(this.coordinates[0], this.projection, targetProjection);
        const coors = createCircleByXY(point[0], point[1], radius, sizes, targetProjection);

        for (let i = 0; i < coors.length; i++) {
            const coor = coors[i];
            useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], point[2]||0));
        }
        return useArray;
    }

    /**
     * 获取3D正方形
     */    
    get3DSquare(radius, angle, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:4326";
        let point = transform(this.coordinates[0], this.projection, targetProjection);
        const coors = createSquareByXY(point[0], point[1], radius, angle, targetProjection);
     
        for (let i = 0; i < coors.length; i++) {
            const coor = coors[i];
            useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], point[2]||0));
        }
        return useArray;
    }
    
    /**
     * 获取3D六边形
     */
    get3DHexagon(radius, angle, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:4326";
        let point = transform(this.coordinates[0], this.projection, targetProjection);
        const coors = createHexagonByXY(point[0], point[1], radius, angle, targetProjection);

        for (let i = 0; i < coors.length; i++) {
            const coor = coors[i];
            useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], point[2]||0));
        }
        return useArray;
    }
    
    /**
     * 获取3D六边形
     */
    get3DSector(radius, sAngle, angle, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:4326";
        let point = transform(this.coordinates[0], this.projection, targetProjection);
        const coors = createSectorByXY(point[0], point[1], radius, sAngle, angle, targetProjection);

        for (let i = 0; i < coors.length; i++) {
            const coor = coors[i];
            useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], point[2]||0));
        }
        return useArray;
    }

    /**
     * 获取3D椭圆
     */
    get3DEllipse(radiusX, radiusY, angle, sizes, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:4326";
        let point = transform(this.coordinates[0], this.projection, targetProjection);
        const coors = createEllipseByXY(point[0], point[1], radiusX, radiusY, angle, sizes, targetProjection);

        for (let i = 0; i < coors.length; i++) {
            const coor = coors[i];
            useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], point[2]||0));
        }
        return useArray;
    }

    /**
     * 计算中心位置
     * @param projection
     * @param number
     */
    getCenter(projection,number){
        number = number || 0;
        let result = this.coordinates[number];
        let sourceProjection = this.projection;
        let targetProjection = projection||this.projection;
        result = transform(result, sourceProjection, targetProjection);
        return result;
    }
}