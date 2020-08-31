const defaultDClusterStyleOptions = 
{
    type:"cluster",//数据类型
    items:[//样式配置数组
        {
            filter:" 1==1 ",//条件筛选
            
            distance: 50,
            image: {
                //icon
                // icon: {
                //     horizontalOrigin: HorizontalOrigin.Center,
                //     verticalOrigin: VerticalOrigin.Center,
                //     offset: [0,0],
                //     opacity: 1,
                //     scale: 1,
                //     angle: 0,
                //     //width: 10,
                //     //height: 10,
                //     src: 'bj.png'
                // },

                //circle
                // circle: {
                //     fill: {
                //             color: {
                //             value: '#FFFFFF',
                //             opacity: 0.5
                //         },
                //         //material:
                //     },
                //     stroke: {
                //         color: {
                //             value: '#0000FF',
                //             opacity: 1
                //         },
                //         width: 2,
                //         lineDash: [0,0]
                //     },
                //     radius: 10,
                // },

                //square
                square: {
                        fill: {
                            color: {
                                value: '#FFFFFF',
                                opacity: 0.5
                            },
                            //material:
                        },
                        stroke: {
                            color: {
                                value: '#0000FF',
                                opacity: 1
                            },
                            width: 1,
                            lineDash: [2,2]
                        },
                        radius: 10,
                        height: 10
                },
                
                //hexagon
                // hexagon: {
                //         fill: {
                //             color: {
                //                 value: '#FFFFFF',
                //                 opacity: 0.5
                //             },
                //             //material:
                //         },
                //         stroke: {
                //             color: {
                //                 value: '#0000FF',
                //                 opacity: 1
                //             },
                //             width: 1,
                //             lineDash: [2,2]
                //         },
                //         radius: 10,
                //         height: 10
                // },
            },
            
            //text
            text: {
                fontStyle: "normal",
                fontFamily: "sans-serif",
                fontSize: 14,
                fontWeight: "bold",
                text: 'name',
                scale: 0,
                angle: 0,
                offsetX: 0,
                offsetY: 0,
                // backgroundPadding: [5,2],
                // backgroundColor: {
                //     value: '#FFFFFF',
                //     opacity: 0
                // },
                fill: {
                    color: {
                        value: '#00ff00',
                        opacity: 1
                    },
                    //material:
                },
                // stroke: {
                //     color: {
                //         value: '#FFFFFF',
                //         opacity: 1
                //     },
                //     width: 1,
                //     lineDash: [2,2]
                // }
            }
        }
    ]
};

export {defaultDClusterStyleOptions}