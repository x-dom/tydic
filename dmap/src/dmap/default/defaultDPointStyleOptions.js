import {HorizontalOrigin, VerticalOrigin} from './../enum/Enum';
const defaultDPointStyleOptions = 
{
    type:"point",//数据类型
    items:[//样式配置数组
        {
            filter:" 1==1 ",//条件筛选
            
            image: {
                //icon
                icon: {
                    show: true,
                    horizontalOrigin: "Center",
                    verticalOrigin: "Center",
                    offset: [0,0],
                    opacity: 1,
                    scale: 1,
                    angle: 0,
                    src: 'http://localhost:8701/image/red.png'
                },

                //circle
                // circle: {
                //     show: true,
                //     horizontalOrigin: "Center",
                //     verticalOrigin: "Top",
                //     offset: [0,0],
                //     opacity: 1,
                //     scale: 1,
                //     angle: 0,
                //     fill: {
                //             color: {
                //             value: '#FFFFFF',
                //             opacity: 0.5
                //         },
                //         //material:
                //     },
                //     stroke: {
                //         color: {
                //             value: '#0000ff',
                //             opacity: 1
                //         },
                //         width: 1,
                //         lineDash: [2,2]
                //     },
                //     radius: 10,
                // },
                
                //ellipse
                // ellipse: {
                //     show: true,
                //     horizontalOrigin: "Center",
                //     verticalOrigin: "Top",
                //     offset: [0,0],
                //     opacity: 1,
                //     scale: 1,
                //     angle: 60,
                //     fill: {
                //             color: {
                //             value: '#FFFFFF',
                //             opacity: 0.5
                //         },
                //         //material:
                //     },
                //     stroke: {
                //         color: {
                //             value: '#0000ff',
                //             opacity: 1
                //         },
                //         width: 1,
                //         lineDash: [2,2]
                //     },
                //     radiusX: 60,
                //     radiusY: 40,
                // },

                //square
                // square: {
                //      show: true,
                //     horizontalOrigin: "Center",
                //     verticalOrigin: "Center",
                //     offset: [0,0],
                //     opacity: 1,
                //     scale: 1,
                //     angle: 0,
                //     fill: {
                //         color: {
                //             value: '#FFFFFF',
                //             opacity: 0.5
                //         },
                //         //material:
                //     },
                //     stroke: {
                //         color: {
                //             value: '#0000ff',
                //             opacity: 1
                //         },
                //         width: 1,
                //         lineDash: [2,2]
                //     },
                //     radius: 10,
                // },

                // //hexagon
                // hexagon: {
                //     show: true,
                //     horizontalOrigin:"Center",
                //     verticalOrigin: "Center",
                //     offset: [0,0],
                //     opacity: 1,
                //     scale: 1,
                //     fill: {
                //         color: {
                //             value: '#FFFFFF',
                //             opacity: 0.5
                //         },
                //         //material:
                //     },
                //     stroke: {
                //         color: {
                //             value: '#0000ff',
                //             opacity: 1
                //         },
                //         width: 1,
                //         lineDash: [2,2]
                //     },
                //     radius: 10,
                // },

                //sector
                // sector: {
                //     show: true,
                //     fill: {
                //         color: {
                //             value: '#FFFFFF',
                //             opacity: 0.5
                //         },
                //         //material:
                //     },
                //     stroke: {
                //         color: {
                //             value: '#0000ff',
                //             opacity: 1
                //         },
                //         width: 2,
                //         lineDash: [5,5]
                //     },
                //     radius: 200,
                //     sAngle: 60,//弧半角
                //     angle: 0//角度
                // },
            },
            //circle
            // circle: {
            //     show: true,
            //     fill: {
            //         color: {
            //             value: '#FFFFFF',
            //             opacity: 0.5
            //         },
            //         //material:
            //     },
            //     stroke: {
            //         color: {
            //             value: '#0000ff',
            //             opacity: 0
            //         },
            //         width: 0,
            //         lineDash: [2,2]
            //     },
            //     radius: 100,
            //     height: 10
            // },

            //ellipse
            // ellipse: {
            //     show: true,
            //     angle: 60,
            //     fill: {
            //         color: {
            //             value: '#FFFFFF',
            //             opacity: 0.5
            //         },
            //         //material:
            //     },
            //     stroke: {
            //         color: {
            //             value: '#0000ff',
            //             opacity: 1
            //         },
            //         width: 1,
            //         lineDash: [2,2]
            //     },
            //     radiusX: 60,
            //     radiusY: 40,
            //     height: 10
            // },

            //square
            // square: {
            //     show: true,
            //     fill: {
            //         color: {
            //             value: '#00ff00',
            //             opacity: 0.5
            //         },
            //         //material:
            //     },
            //     stroke: {
            //         color: {
            //             value: '#00ff00',
            //             opacity: 1
            //         },
            //         width: 1,
            //         lineDash: [2,2]
            //     },
            //     radius: 100,
            //     height: "height",
            //     angle: 0
            // },
             
            //hexagon
            // hexagon: {
            //     show: true,
            //     fill: {
            //         color: {
            //             value: '#FFFFFF',
            //             opacity: 0.5
            //         },
            //         //material:
            //     },
            //     stroke: {
            //         color: {
            //             value: '#0000ff',
            //             opacity: 1
            //         },
            //         width: 1,
            //         lineDash: [2,2]
            //     },
            //     radius: 10,
            //     height: 10,
            //     angle: 0
            // },
            
            //sector
            // sector: {
            //     show: true,
            //     fill: {
            //         color: {
            //             value: '#00FF00',
            //             opacity: 0.5
            //         },
            //         //material:
            //     },
            //     stroke: {
            //         color: {
            //             value: '#0000ff',
            //             opacity: 1
            //         },
            //         width: 0,
            //         lineDash: [2,2]
            //     },
            //     height: 0,
            //     radius: 200,
            //     sAngle: 60,//弧半角
            //     angle: 0//角度
            // },
            
            // model:{
            //     show: true,
            //     // uri: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf',
            //     uri: 'http://localhost:8701/model/antenna.glb',
            //     minimumPixelSize: 0,
            //     maximumScale: 10,
            //     scale: 4,
            //     heading: 0,
            //     pitch: 0,
            //     roll: 0
            // },

            //text
            text: {
                show: true,
                fontStyle: "normal",
                fontFamily: "sans-serif",
                fontSize: 2,
                fontWeight: "normal",
                text: 'name',
                scale: 0,
                angle: 0,
                offsetX: 20,
                offsetY: 20,
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
                        value: '#FFFFFF',
                        opacity: 1
                    },
                    width: 0,
                    lineDash: [2,2]
                }
            }
        }
    ]
};

export {defaultDPointStyleOptions};