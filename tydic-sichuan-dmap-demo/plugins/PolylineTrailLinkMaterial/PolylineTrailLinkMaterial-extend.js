/**
     * 获取渐变图片 getColorRampImge([0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0],"#FF0000", true)
     * @param {*} elevationRamp 
     * @param {*} color 
     * @param {*} isVertical 
     */
    var getColorRampImge = function (elevationRamp, color, isVertical) {
        //十六进制颜色值的正则表达式  
        function colorHexToRgba(value, opacity){
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
            var sColor = value;  
            if(sColor && reg.test(sColor)){  
                if(sColor.length === 4){  
                    var sColorNew = "#";  
                    for(var i=1; i<4; i+=1){  
                        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
                    }  
                    sColor = sColorNew;  
                }  
                //处理六位的颜色值  
                var sColorChange = [];  
                for(var i=1; i<7; i+=2){  
                    sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
                }  
                return "rgba(" + sColorChange.join(",") + ","+opacity+")"; 
                
            } else {  
                return sColor;    
            }
        };
        
        var ramp = document.createElement('canvas');
        ramp.width = isVertical ? 1 : 100;
        ramp.height = isVertical ? 100 : 1;
        var ctx = ramp.getContext('2d');
        ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        var values = elevationRamp;
        var grd = isVertical ? ctx.createLinearGradient(0, 0, 0, 100) : ctx.createLinearGradient(0, 0, 100, 0);
        
        grd.addColorStop(values[0], colorHexToRgba(color, values[0])); 
        grd.addColorStop(values[1], colorHexToRgba(color, values[1])); 
        grd.addColorStop(values[2], colorHexToRgba(color, values[2])); 
        grd.addColorStop(values[3], colorHexToRgba(color, values[3])); 
        grd.addColorStop(values[4], colorHexToRgba(color, values[4])); 
        grd.addColorStop(values[5], colorHexToRgba(color, values[5]));  
        grd.addColorStop(values[6], colorHexToRgba(color, values[6])); 

        ctx.fillStyle = grd;
        if (isVertical)
            ctx.fillRect(0, 0, 1, 100);
        else
            ctx.fillRect(0, 0, 100, 1);
        return ramp.toDataURL("image/png");
    };

/*
  流纹纹理线
  color 颜色
  duration 持续时间 毫秒
*/
function PolylineTrailLinkMaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = (new Date()).getTime();

    var myHex = hexify(color.toCssColorString());
    Cesium.Material.PolylineTrailLinkImage = getColorRampImge([0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0],myHex, false);

    /**
     * rgba转16进制
     * @param {*} color 
     */
    function hexify(color) {
        var values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
        var a = parseFloat(values[3] || 1),
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
        var result =  "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);

        return result.toLocaleUpperCase();
    }
}
Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
    return 'PolylineTrailLink';
}
PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.PolylineTrailLinkImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
}
PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof PolylineTrailLinkMaterialProperty &&
          Cesium.Property.equals(this._color, other._color))
}
Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
Cesium.Material.PolylineTrailLinkImage = getColorRampImge([0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0],"#FF0000", false);
Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                              {\n\
                                                   czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                   vec2 st = materialInput.st;\n\
                                                   vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                   material.alpha = colorImage.a * color.a;\n\
                                                   material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                   return material;\n\
                                               }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
    fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.PolylineTrailLinkImage,
            time: 0
        },
        source: Cesium.Material.PolylineTrailLinkSource
    },
    translucent: function (material) {
        return true;
    }
});