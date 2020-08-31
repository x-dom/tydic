import {LineString} from 'ol/geom.js';
import {transform} from "../utils/geom";
import DGeometry from './DGeometry';
const Cesium = require('cesium/Cesium');
import {getLength} from '../utils/geom';

export default class DLineString extends DGeometry{

    constructor(options){
        let defaultParams = {};
        let use_options = {};
        //合并参数
        $.extend(use_options,defaultParams, options);
        super(use_options);

        this.type="LineString";
    };

    /**
     * 设置线的 数据
     * @param {*} coordinates 线的 经纬度 列表
     * @param {*} projection 线数据的 坐标系
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
     * 实例化 线2D Geometry 对象
     */
    get2DGeometry(projection){
        let targetProjection = projection || "EPSG:3857";
        let useArray= [];
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            useArray.push(transform(a1,this.projection, targetProjection));
        }
        let lineString = new LineString(useArray);
        return lineString;
    }

    /**
     * 获取3D绘制坐标数组
     */
    get3DGeometry(projection){
        let targetProjection = projection || "EPSG:4326";
        let useArray= [];
        useArray.push([]);
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            const coor = transform(a1,this.projection, targetProjection);
            useArray[0].push(new Cesium.Cartesian3.fromDegrees(coor[0], coor[1], coor[2]||0));
        }
        return useArray;
    }

    /**
     * 计算长度，单位：米
     */
    getLength(){
        let length = getLength(this.get2DGeometry());
        length = Math.round(length * 100) / 100;

        return length;
    }

    /**
     * 计算中心位置
     */
    getCenter(projection){
        let targetProjection = projection || this.projection;
        let result = [0,0];
        let useArray= [];
        for (let i = 0; i < this.coordinates.length; i++) {
            const a1 = this.coordinates[i];
            useArray.push(transform(a1,this.projection, "EPSG:3857"));
        }

        let length = 0;
        let lenArr = [];
        for (let i = 1; i < useArray.length; i++) {
            const p1 = useArray[i-1];
            const p2 = useArray[i];
            const dx = Math.abs(p2[0] - p1[0]);
            const dy = Math.abs(p2[1] - p1[1]);
            let dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
            lenArr.push(dis);
            length += dis;
        }
        
        let lenHalf = length/2;
        let lenC = 0;
        for (let i = 0; i < lenArr.length; i++) {
            lenC += lenArr[i];
            if(lenC > lenHalf){
                const start = useArray[i];
                const end = useArray[i+1];
                const len = lenArr[i] - (lenC - lenHalf);
                const cos = (end[0]-start[0])/lenArr[i];
                const sin = (end[1]-start[1])/lenArr[i];

                const x = start[0] + len*cos;
                const y = start[1] + len*sin;
                
                result[0] = x;
                result[1] = y;
                result = transform(result, "EPSG:3857", targetProjection);
                return result;
                break;
            }
        }

        return result;
    }
}