const defaultStyeParse = 
{
    "type":"Point",//数据类型(Point,LineString,Polygon)
    "items":[//样式配置数组
        {
            "filter":"((a=='as' && a<100)||b==2)",//条件筛选
            "fill":{//填充样式
                "color": {
                    value: "#FF0000",
                    opacity: 1
                }
            },
            "image":{//图标样式
                "icon":{//图片图标
                    "anchor":[0.5,0.5],//锚点，设置图标的中心([0.5,0.5])
                    "offset":[0,0],//偏移，设置图标在x、y轴的偏移量
                    "opacity":1,//不透明度
                    "scale":1,//缩放比例
                    "rotation":0,//以弧度旋转(顺时针正旋转)(0)
                    "size":[30,30],//以像素为单位的控件大小
                    "src":""//图像源URI
                },
                "circle":{//圆形图标
                    "fill":{
                        "color": {
                            value: "#FF0000",
                            opacity: 1
                        }
                    },
                    "radius":10,//半径
                    "stroke":{
                        "color":{
                            value: "#FF0000",
                            opacity: 1
                        },
                        "lineDash":[2,2],
                        "width":3
                    }
                },
            },
            "stroke":{//边框
                "color": {
                    value: "#FF0000",
                    opacity: 1
                },//颜色
                "lineDash":[2,2],//虚线每一段的长度及间隔，虚线时需设置
                "width":2//边框的宽度
            },
            "text":{//标签
                "overflow": true,
                "font":"10px sans-serif",//字体样式
                "text":"text_field",//文本内容，可为属性字段
                "scale":0,//缩放比例
                // "rotation":0,//以弧度旋转(顺时针正旋转)(0)
                "angle":0,//旋转角度
                "fill":{
                    "color":{
                        value: "#FF0000",
                        opacity: 1
                    }
                },
                "stroke":{
                    "color":{
                        value: "#000000",
                        opacity: 1
                    },
                    "lineDash":[2,2],
                    "width":3
                }
            }
        }
    ]
};
export {
    defaultStyeParse
}