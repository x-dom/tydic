const defaultDPolygonStyleOptions = 
{
    type:"polygon",//数据类型
    items:[//样式配置数组
        {
            filter:" 1==1 ",//条件筛选
            image:{
                //circle
                circle: {
                    show: true,
                    fill: {
                            color: {
                            value: '#FFFFFF',
                            opacity: 0.5
                        },
                        //material:
                    },
                    stroke: {
                        color: {
                            value: '#0000ff',
                            opacity: 1
                        },
                        width: 1,
                        lineDash: [2,2]
                    },
                    radius: 10
                },
            },

            //line
            line: {
                show: true,
                width: 2,
                color: {
                    value: '#0000ff',
                    opacity: 1
                },
                lineDash: [2,2]
            },

            //polygon
            polygon: {
                show: true,
                fill: {
                    color: {
                        value: '#FFFFFF',
                        opacity: 0.5
                    },
                    //material:
                },
                stroke: {
                    color: {
                        value: '#0000ff',
                        opacity: 1
                    },
                    width: 1,
                    lineDash: [2,2]
                },
                height: 45,
                extrudedHeight:10
            },
            
            //text
            text: {
                show: true,
                fontStyle: "normal",
                fontFamily: "sans-serif",
                fontSize: 10,
                fontWeight: "normal",
                text: 'name',
                scale: 0,
                angle: 0,
                offsetX: 0,
                offsetY: 0,
                backgroundPadding: [5,2],
                backgroundColor: {
                    value: '#FFFFFF',
                    opacity: 0
                },
                fill: {
                    color: {
                        value: '#0000ff',
                        opacity: 1
                    },
                    //material:
                },
                stoke: {
                    color: {
                        value: '#000000',
                        opacity: 1
                    },
                    width: 1,
                    lineDash: [2,2]
                }
            }
        }
    ]
};

export {defaultDPolygonStyleOptions};