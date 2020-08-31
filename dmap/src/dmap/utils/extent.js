import DExtent from "./../feature/DExtent";
import {transformExtent} from "./geom";

/**
 * 计算显示范围
 * @param {*} extent 
 * @param {*} projection 
 */
export const calculateExtentByFeatures = function(features, projection){
    let extent;
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        let extent1 = feature.geometry.get2DGeometry().getExtent();
        projection = projection || feature.geometry.projection;

        if(!extent){
            extent = extent1;
        } else {
            extent[0] = Math.min(extent1[0],extent[0]);
            extent[1] = Math.min(extent1[1],extent[1]);
            extent[2] = Math.max(extent1[2],extent[2]);
            extent[3] = Math.max(extent1[3],extent[3]);
        }
    }
    if(extent){
        extent = transformExtent(extent, "EPSG:3857", projection);
        return new DExtent(extent, projection);
    } else {
        return;
    }
}

/**
 * 计算显示范围
 * @param {*} extent 
 */
export const calculateExtentByLayer = function(layer){
    
    if(layer.type == "VectorLayer" || layer.type == "ClusterLayer" || layer.type == "HeatmapLayer"){
        return  calculateExtentByFeatures(layer.data, layer.projection);
    } else {
        console.log("该图层无法计算范围");
        return;
    }
}