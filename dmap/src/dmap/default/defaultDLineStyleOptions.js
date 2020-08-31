const defaultDLineStyleOptions = 
{
    type:"lineString",//数据类型
    items:[//样式配置数组
        {
            filter:" 1==1 ",//条件筛选
            
            //lineString
            lineString: {
                // show: true,
                // width: 2,
                // color: {
                //     value: '#0000ff',
                //     opacity: 1
                // },
                // lineDash: [2,2]
                "width": 5,
                "color": {
                    "value": "#E31D9C",
                    "opacity": 1
                },
                "lineDash": [10, 10]
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
                stroke: {
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


export {defaultDLineStyleOptions};