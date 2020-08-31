import { MultiPolygon} from 'ol/geom.js';
import {transform} from "../utils/geom";
import DGeometry from './DGeometry';
const Cesium = require('cesium/Cesium');

export default class DMultiPolygon extends DGeometry{

    constructor(options){
        let defaultParams = {};
        let use_options = {};
        //合并参数
        $.extend(use_options,defaultParams, options);
        super(use_options);

        this.type="MultiPolygon";
    }
    /**
     * 设置面的 数据
     * @param {*} coordinates 面的 经纬度 列表
     * @param {*} projection 
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
     * 实例化 面2D Geometry 对象
     */
    get2DGeometry(projection){
        let targetProjection = projection || "EPSG:3857";
        let useArray= [];
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            const arr1 = [];
            for (let j = 0; j < a1.length; j++) {
                const a2 = a1[j];
                const arr2 = [];
                for (let k = 0; k < a2.length; k++) {
                    const a3 = a2[k];
                    arr2.push(transform(a3,this.projection, targetProjection));
                }
                arr1.push(arr2);
            }
            useArray.push(arr1);
        }
        let polygon = new MultiPolygon(useArray);
        if(useArray[0].length > 1){
            polygon = new MultiPolygon(useArray[0]);
        }
        return polygon;
    }

    /**
     * 获取3D绘制坐标数组
     */
    get3DGeometry(projection){
        let targetProjection = projection || "EPSG:4326";
        let useArray= [];
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            for (let j = 0; j < a1.length; j++) {
                const arr1 = [];
                const a2 = a1[j];
                for (let k = 0; k < a2.length; k++) {
                    const a3 = a2[k];
                    const coor = transform(a3,this.projection, targetProjection);
                    arr1.push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], coor[2]||0));
                }
                useArray.push(arr1);
            }
        }

        return useArray;
    }

    /**
     * 计算面积,单位：平方米
     */
    getArea(){
        let area = this.get2DGeometry().getArea();
        area = Math.round(area * 100) / 100;
        return area;
    }

    /**
     * 计算中心位置
     * @param number
     */
    getCenter(projection, number){
        number = number || 0;
        let sourceProjection = "EPSG:3857";
        let targetProjection = projection||this.projection;
        let result = [0,0];
        let geom = this.get2DGeometry();
        let polygon = geom.getPolygon(number);
        let point = polygon.getInteriorPoint();
        result = point.getCoordinates();
        result = transform(result, sourceProjection, targetProjection);

        return result;
    }
}