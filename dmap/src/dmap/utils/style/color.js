//十六进制颜色值的正则表达式  
const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
export const colorHexToRgba = (value, opacity) =>{
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
}

/**
 * 16进制颜色对象转rgba
 * @param {value:"#000000",opacity:0.1} options 
 */
export const colorHexToRgbaByObj = (options) =>{
   return colorHexToRgba(options.value, options.opacity);
}
