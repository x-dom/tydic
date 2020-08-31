/**
 * 根据数据属性获取代码，若属性为数字则直接返回
 * @param Number/String property 
 * @param {*} data 
 */
export const getNumberFromData = (property, data)=>{
    let result = 0;
    if(isNumber(property)){
        result = Number(property);
    } else if(isString(property)){
        if(data && data[property] && isNumber(data[property])){
            result = Number(data[property]);
        } else {
            // console.warn("属性解析异常");
        }
    } else {
        console.warn("数据类型异常");
    }
    return result;
}

//js判断number类型
function   isNumber(obj){
    return  !isNaN(parseFloat(obj))&&isFinite(obj);
}

//js判断string类型
function isString(obj){
    return obj===obj+'';
}

//js判断boolean类型
function isboolean(obj){
    return obj===!!obj;
}