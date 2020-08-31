import {transformExtent, transform} from "./../utils/geom";
import Polygon from "ol/geom/Polygon";

/**
 * 范围对象
 */
class DExtent{
    constructor(extent, projection, height){
        this.extent = extent;//范围
        this.projection = projection||"EPSG:4326";//坐标系

        //计算中心位置
        extent[0] = Number(extent[0]);
        extent[1] = Number(extent[1]);
        extent[2] = Number(extent[2]);
        extent[3] = Number(extent[3]);

        let extent1 = transformExtent(extent,this.projection, "EPSG:3857");
        let center = [extent1[0]+(extent1[2] - extent1[0])/2, extent1[1]+(extent1[3] - extent1[1])/2];
        center = transform(center, "EPSG:3857", this.projection);
        this.center = center;
        this.height = height||870;
    }

    /**
     * 获取范围
     */
    getExtentBound(projection){
        projection = projection||this.projection;
        return transformExtent(this.extent,this.projection, projection);
    }
    
    /**
     * 获取范围图形
     */
    getGeometry(projection){
        projection = projection||this.projection;
        let arr = transformExtent(this.extent,this.projection, projection);
        let coordinates = [[[arr[0],arr[1]], [arr[0],arr[3]], [arr[2],arr[3]], [arr[2],arr[1]]]];
        return new Polygon(coordinates);
    }

    /**
     * 获取移动的范围
     * @param {*} x 
     * @param {*} y 
     * @param {*} projection 
     */
    getMoveExtentBound(x, y, projection){
        x=x||0;
        y=y||0;
        projection = projection||this.projection;
        
        let extent = this.getExtentBound("EPSG:3857");
        extent[0] = extent[0] + x;
        extent[2] = extent[2] + x;
        extent[1] = extent[1] + y;
        extent[3] = extent[3] + y;

        return transformExtent(extent,"EPSG:3857", projection);
    }
   
    /**
     * 获取扩容一倍的范围
     * @param {*} x 
     * @param {*} y 
     * @param {*} projection 
     */
    getExpendExtentBound(projection){
        projection = projection||this.projection;
        
        let extent = this.getExtentBound("EPSG:3857");
        let dx = extent[2] - extent[0];
        let dy = extent[3] - extent[1];
        extent[0] = extent[0] - dx/2;
        extent[2] = extent[2] + dx/2;
        extent[1] = extent[1] - dy/2;
        extent[3] = extent[3] + dy/2;

        return transformExtent(extent,"EPSG:3857", projection);
    }
}

export default DExtent;