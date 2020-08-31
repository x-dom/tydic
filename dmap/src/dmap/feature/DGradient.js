import {transformExtent, transform} from "./../utils/geom";

/**
 * 范围对象
 */
export default class DGradient{
    constructor(gradient){
        let defaultGradient = ["#0000ff", "#00ffff", "#00ff00", "#ffff00","#ff0000"];
        //  [
        //     {width: .3, color: "#0000ff"},
        //     {width: .5, color: "#00ffff"},
        //     {width: .65, color: "#00ff00"},
        //     {width: .8, color: "#ffff00"},
        //     {width: .95, color: "#ff0000"}
        // ];
        this.gradient = gradient||defaultGradient;
    }

    /**
     * 获取2D色带
     */
    get2DGradient(){
        // let result = [];
        // for (let i = 0; i < this.gradient.length; i++) {
        //     const obj = this.gradient[i];
        //     result.push(obj.color);
        // }

        return this.gradient;
    }

    /**
     * 获取3D色带
     */
    get3DGradient(){
        let result = {};
        result[.1] = this.gradient[0];
        result[.2] = this.gradient[1];
        result[.5] = this.gradient[2];
        result[.8] = this.gradient[3];
        result[.98] = this.gradient[4];
        // result[.3] = this.gradient[0];
        // result[.5] = this.gradient[1];
        // result[.65] = this.gradient[2];
        // result[.8] = this.gradient[3];
        // result[.95] = this.gradient[4];
        // for (let i = 0; i < this.gradient.length; i++) {
        //     const obj = this.gradient[i];
        //     result[i/this.gradient.length] = obj;
        // }
        return result;
    }
}