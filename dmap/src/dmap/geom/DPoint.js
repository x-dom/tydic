import {Point, Polygon} from 'ol/geom.js';
import {transform, createCircleByXY, createSquareByXY, createHexagonByXY, createSectorByXY, createEllipseByXY} from "./../utils/geom";
import DGeometry from './DGeometry';
const Cesium = require('cesium/Cesium');

export default class DPoint extends DGeometry{

    constructor(options){
        let defaultParams = {};
        let use_options = {};
        //合并参数
        $.extend(use_options,defaultParams, options);
        super(use_options);
        this.type="Point";
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
        useArray = transform(this.coordinates,this.projection, targetProjection);
        let point = new Point(useArray);
        return point;
    }

    /**
     * 获取3d绘制坐标数组
     */
    get3DGeometry(){
        let targetProjection = "EPSG:4326";
        let useArray = [];
        const coor = transform(this.coordinates,this.projection, targetProjection);
        useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], coor[2]));
        return useArray;
    }

    /**
     * 获取2D圆
     */
    get2DCircle(radius, sizes, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:3857";
        const coor = transform(this.coordinates, this.projection, targetProjection);
        useArray = createCircleByXY(coor[0], coor[1], radius, sizes, targetProjection);
        let polygon = new Polygon([useArray]);

        return polygon;
    }

    /**
     * 获取2D正方形
     */    
    get2DSquare(radius, angle, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:3857";
        const coor = transform(this.coordinates, this.projection, targetProjection);
        useArray = createSquareByXY(coor[0], coor[1], radius, angle, targetProjection);
        let polygon = new Polygon([useArray]);
        return polygon;
    }
    
    /**
     * 获取2D六边形
     */
    get2DHexagon(radius, angle, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:3857";
        const coor = transform(this.coordinates, this.projection, targetProjection);
        useArray = createHexagonByXY(coor[0], coor[1], radius, angle, targetProjection);
        let polygon = new Polygon([useArray]);
        return polygon;
    }

    /**
     * 获取2D扇形
     */
    get2DSector(radius, sAngle, angle, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:3857";
        const coor = transform(this.coordinates, this.projection, targetProjection);
        useArray = createSectorByXY(coor[0], coor[1], radius, sAngle, angle, targetProjection);
        let polygon = new Polygon([useArray]);
        return polygon;
    }
  
    /**
     * 获取2D椭圆
     */
    get2DEllipse(radiusX, radiusY, angle, sizes, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:3857";
        const coor = transform(this.coordinates, this.projection, targetProjection);
        useArray = createEllipseByXY(coor[0], coor[1], radiusX, radiusY, angle, sizes, targetProjection);
        let polygon = new Polygon([useArray]);

        return polygon;
    }

    /**
     * 获取3D圆
     */
    get3DCircle(radius, sizes, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:4326";
        let point = transform(this.coordinates, this.projection, targetProjection);
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
        let point = transform(this.coordinates, this.projection, targetProjection);
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
        let point = transform(this.coordinates, this.projection, targetProjection);
        const coors = createHexagonByXY(point[0], point[1], radius, angle, targetProjection);

        for (let i = 0; i < coors.length; i++) {
            const coor = coors[i];
            useArray.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], point[2]||0));
        }
        return useArray;
    }
    
    /**
     * 获取3D扇形
     */
    get3DSector(radius, sAngle,angle, projection){
        let useArray= [];
        let targetProjection = projection || "EPSG:4326";
        let point = transform(this.coordinates, this.projection, targetProjection);
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
        let point = transform(this.coordinates, this.projection, targetProjection);
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
     */
    getCenter(projection){
        let result = this.coordinates;
        let sourceProjection = this.projection;
        let targetProjection = projection||this.projection;
        result = transform(result, sourceProjection, targetProjection);
        return result;
    }
}