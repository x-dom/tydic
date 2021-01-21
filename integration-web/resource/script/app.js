//utils.checkIsLogin();
//定义颜色预设值
var setColor = {
    dark:{
        visualization:['#1fe486','#5aeee2','#2390ed','#ffffff'],
        benefitChartA:['#36c5f8','#0b2046','#e9eaeb','#1fa4f0','#ffffff'],
        benefitChartB:['#78c3ee','#33b5e8','#e499ca','#dc5693','#e9eaeb'],
        mainWork:['#445368','#e9eaeb','#5793f3'],
        keyQuota:['#5793f3','#d14a61','#675bba','#445368','#e9eaeb','#445368','#647388','#49586d','#a26364','#703132',"#1fa4f0","rgba(31,164,240,0.4)","#49d76e","rgba(73,215,110,0.4)",'#f0d51f',"rgba(240,213,31,0.4)",'#d75a49',"rgba(215,90,73,0.4)"],
        liquid:['#ffffff','#06172e','#17395f'],
        singleRing:['#ffffff','#74dffb', '#15608f'],
        assetUtilization:['#00FAFC','#3BD542','#E3F424','#7E48DA','#E531A8'],
        perceptualLegend:["rgba(150, 150, 0, 1)","rgba(45, 120, 180, 1)","rgba(0, 205, 82, 1)","rgba(2,56,93,0.8)","#fff"],
        threeNetChartColor:["#fff"],
        lisans: ["#333333", "#d3e2fb", "#333333", "#e069a3"]
    },
    tint:{
        visualization:['#05bd65','#07bfb0','#045eab','#333333'],
        benefitChartA:['#1b91ff','#d9e1f4','#1d4b6d','#073894','#002d80'],
        benefitChartB:['#2087fd','#33b5e8','#fb257b','#dc5693','#333333'],
        mainWork:['#c8dbdf','#6f7374','#1c92ff'],
        keyQuota:['#1c92ff','#d14a61','#675bba','#c8dbdf','#6f7374','#445368','#647388','#49586d','#a26364','#703132',"#1fa4f0","rgba(31,164,240,0.4)","#49d76e","rgba(73,215,110,0.4)",'#f0d51f',"rgba(240,213,31,0.4)",'#d75a49',"rgba(215,90,73,0.4)"],
        liquid:['#333333','#f9fff8','#17395f'],
        singleRing:['#1a65a0','#8fddf9', '#2d86fe'],
        assetUtilization:['#037071','#238527','#6f7714','#40246f','#6e1951'],
        perceptualLegend:["rgba(255, 219, 0, 1)","rgba(45, 120, 180, 1)","rgba(0, 205, 82, 1)","#d7edf3","#000"],
        threeNetChartColor:["#000"],
        lisans: ["#fff", "#49586d", "#50deff", "#f89f00"]
    }
};

//定义各图表对象
var chartsInsts = {
    // visualization: echarts.init(document.getElementById('visualization')),
    benefitChartA: echarts.init(document.getElementById('benefitChartA')),
    benefitChartB: echarts.init(document.getElementById('benefitChartB')),
    operationEvaluation: echarts.init(document.getElementById('operationEvaluation')),
    keyQuota: echarts.init(document.getElementById('keyQuota')),
    mainWork: echarts.init(document.getElementById('mainWork')),
    assetUtilization:echarts.init(document.getElementById('uqwmEfficiency-guage')),
    threeNetChart:echarts.init(document.getElementById('keyQuota-1')),
    histogram:echarts.init(document.getElementById('histogram')),
    ScreenIndex:echarts.init(document.getElementById('ScreenIndex')),
    //Container:echarts.init(document.getElementById('picContainer')),
    //水球图系列
    liquidObj: (function () {
        var temp = {};
        for (var i = 0; i < $('#liquid .waterPolo').length; i++) {
            temp['liquid_' + i] = echarts.init(document.getElementById('liquid_' + i));
        }
        return temp;
    })(),
    //单值环形图系列
    singleRingObj: (function () {
        var temp = {};
        for (var i = 0; i < $('#safetyCompliance .safetySubOuter').length; i++) {
            temp['safetyCompliance_' + i] = echarts.init(document.getElementById('safetyCompliance_' + i));
        }
        return temp;
    })()

};
var  bews;
var goTemp = {
    "class": "go.TreeModel",
    "nodeDataArray": [
        {key: "Alpha"},
        {key: "Beta"},
        {key: "Gamma"}
    ]
};

//定义App对象各个方法和属性
var app = {
    purviewId:0,
    LowPropertyList:[["阿克苏","0.88%",98,11162,"91.71%",6043,6589,"0.75%",22,2930],
    ["阿勒泰","1.07%",57,5352,"99.41%",2025,2037,"1.28%",12,941],
    ["巴州","1.60%",156,9763,"91.27%",5794,6348,"1.05%",25,2324],
    ["博乐","0.20%",9,4465,"95.86%",1460,1523,"1.13%",9,794],
    ["昌吉","2.20%",213,9691,"91.55%",4454,4865,"1.14%",22,1881],
    ["哈密","2.03%",101,4973,"97.16%",2254,2320,"0.92%",9,925],
    ["和田","1.11%",70,6301,"94.14%",3585,3808,"1.06%",17,1555],
    ["喀什","1.65%",158,9600,"87.95%",5480,6231,"1.46%",30,2059],
    ["克拉玛依","2.89%",128,4425,"98.72%",2237,2266,"0.84%",8,893],
    ["克州","0.76%",23,3012,"94.68%",1603,1693,"0.63%",5,792],
    ["奎屯","2.06%",55,2676,"97.27%",1213,1247,"0.83%",5,539],
    ["石河子","2.01%",91,4527,"95.16%",1927,2025,"1.27%",11,863],
    ["塔城","1.59%",109,6856,"95.56%",3141,3287,"1.00%",15,1501],
    ["吐鲁番","0.70%",34,4891,"97.64%",2231,2285,"0.89%",8,894],
    ["乌鲁木齐","2.79%",673,24115,"94.97%",11169,11761,"0.70%",31,4425],
    ["伊犁","1.60%",213,13297,"92.64%",6201,6694,"1.10%",27,2445],
    ["总计","1.75%",2188,125106,"93.59%",60817,64979,"0.98%",253,25761]],
    colorStyle:'dark',
    allowChangeStyle:true,
    assemblyCtrl: true,
    assemblyShow: 'anim',
    popScrollBar: {},
    warnScroll: {},
    scrollIndex: {},
    scrollStatus: {},
    dateStr: '',
    popNumber: 0,
    areaid: '0',
    cityId:0,
    arealevel: '0',
    webSocketObj: null,
    mapMax: false,
    orderScrollBar: null,
    timeAxisChartObject: null,
    orderWorkSingleDetailsTimmer: null,
    // top10TableData: [],
    indexCurrentSelectedGisLayerName: "",
    workOrderTimeoutTimmer: null,
    isToWorkOrderView: true,
    currentView: "index",
    top10TableIsClick:false,
    top10TableDataManagement:[],
    top10TableDataProduce:[],
    orderWorkAllFlowData:{},
    assetEfficiencyData:{},
    drillData:[],
    downType:null, // 区分通过点击哪里下钻到工单视图,管理告警:1,生产告警:2,指标:3
    //嵌套环形图
    nestRings: function (valueArr, labelArr) {
        var useColor = setColor[this.colorStyle].visualization;
        var values = valueArr, labels = labelArr, colors = [useColor[0], useColor[1], useColor[2]], seriesObjs = [],
            legends = [], graphics = [], r = 100;
        var maxValue = Math.max.apply(Math, valueArr) * 5 / 4;
        var placeHolderStyle = {
            normal: {
                label: {
                    show: true,
                    position: 'center'
                },
                labelLine: {
                    show: true
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 1
            }
        };
        for (var i = 0; i < values.length; i++) {
            var seriesObj = {
                name: 'Line 1',
                type: 'pie',
                clockWise: false,
                radius: [r - (i + 1) * 24 + '%', r - (i + 1) * 24 - 2 + '%'],
                center: ['29%', '50%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        shadowBlur: 40,
                        borderWidth: 2,
                        borderColor: colors[i],
                        shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                    }
                },
                hoverAnimation: false,
                startAngle: 90,
                label: {
                    borderRadius: '10'
                },
                data: [
                    {
                        value: values[i] / maxValue * 100,
                        name: labels[i],
                        itemStyle: {
                            normal: {
                                color: colors[i]
                            }
                        }
                    },
                    {
                        value: (1 - values[i] / maxValue) * 100,
                        name: '',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }
                ]
            };
            var graphicObj = {
                type: 'group',
                left: '30%',
                top: 93 - (r - (i + 1) * 12) + '%',
                children: [
                    {
                        type: 'line',
                        bounding: 'raw',
                        shape: {x1: 0, y1: -5, x2: 10 + (i * 30), y2: -5},
                        style: {
                            fill: colors[i],
                            stroke: colors[i]
                        }
                    },
                    {
                        type: 'text',
                        left: 11 + (i * 30),
                        top: -10,
                        bounding: 'raw',
                        style: {
                            fill: colors[i],
                            text: values[i],
                            font: window.innerHeight / 100 + 'px Microsoft YaHei',
                        }
                    }
                ]
            };
            seriesObjs.push(seriesObj);
            graphics.push(graphicObj);
        }
        ;
        var option = {
            backgroundColor: 'transparent',
            tooltip: {
                show: false,
                formatter: '{a} : {c}'
            },
            graphic: graphics,
            legend: {
                show: true,
                orient: 'vertical',
                icon: 'circle',
                right: 3,
                bottom: 3,
                itemGap: 1,
                itemWidth: 10,
                itemHeight: 10,
                data: labels,
                textStyle: {
                    color: useColor[3],
                    fontSize: 11
                }
            },
            toolbox: {
                show: false
            },
            series: seriesObjs
        };
        chartsInsts.visualization.setOption(option);
    },

    //增量效益饼图
    normalPie: function (value1, value2) {
        var useColor = setColor[this.colorStyle].benefitChartA;
        var allNum = value2, datas = [value1, 100 - value1];
        var option = {
            title: {
                text: '承诺完成总和',
                subtext: allNum + '万元',
                y: '10%',
                x: 'right',
                textStyle: {
                    color: useColor[2],
                    fontSize: 14
                },
                subtextStyle: {
                    color: useColor[4],
                    fontSize: 20,
                    align: 'center'
                }
            },
            tooltip: {
                show: false
            },
            legend: {
                show: false
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '80%',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['25%', '45%'],
                    data: [
                        {value: datas[0], itemStyle: {color:useColor[0]}},
                        {value: datas[1], itemStyle: {color: useColor[1]}, label: {show: false}}
                    ],
                    itemStyle: {
                        normal: {
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show: false,
                        position: 'center',
                        formatter: '{c}%',
                        color: useColor[4]
                    }
                }
            ]
        };
        chartsInsts.benefitChartA.setOption(option);
    },

    //增量效益单值环形图
    singleValuePie: function (value1, value2) {
        var useColor = setColor[this.colorStyle].benefitChartB;
        var dataTemp = [{name: '承诺完成个数', value: value1}, {name: '承诺未完成个数', value: value2}];
        var option = {
            title: {
                show: false
            },
            legend: {
                show: true,
                data: ['承诺完成个数', '承诺未完成个数'],
                orient: 'vertical',
                icon: 'circle',
                right: 10,
                top: '10%',
                itemGap: 10,
                itemWidth: 10,
                itemHeight: 10,
                formatter: function (name) {
                    var index = 0;
                    dataTemp.forEach(function (item, i) {
                        if (item.name == name) {
                            index = i;
                        }
                    });
                    return name + " " + dataTemp[index].value;
                },
                textStyle: {
                    color: useColor[4]
                }
            },
            series: [{
                name: '',
                type: 'pie',
                clockWise: false,
                radius: ['60%', '80%'],
                center: ['25%', '45%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false,
                data: [{
                    value: value1,
                    name: '承诺完成个数',
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: useColor[0] // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: useColor[1] // 100% 处的颜色
                                }]
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    name: '承诺未完成个数',
                    value: value2,
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: useColor[2] // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: useColor[3] // 100% 处的颜色
                                }]
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }]
            }]
        };
        chartsInsts.benefitChartB.setOption(option);
    },

    //水球图
    liquidFill: function (id, name, value, number, isWarn) {
        console.log(id, name, value, number, isWarn)
        var useColor = setColor[this.colorStyle].liquid;
        var name = name || '',
            value = value || 0,
            number = number || 0;
        isWarn = isWarn || 0;
        var colors = [];
        var data = value / 100;
        colors = isWarn == 0 ? ['#23627f', '#61c5eb', '#34a4d5'] : ['#6d4564', '#d97287', '#c6505d'];
        var option = {
            title: {
                text: number,
                x: 'center',
                textStyle: {color: useColor[0], fontSize: '12'}
            },
            series: [{
                name: name,
                type: 'liquidFill',
                center: ['50%', '60%'],
                data: [data, data * 0.9, data * 0.8],
                radius: '70%',
                color: colors,
                backgroundStyle: {
                    color: useColor[1]
                },
                itemStyle: {
                    opacity: 0.6,
                    shadowBlur: 20,
                    shadowColor: useColor[2]
                },
                silent: true,
                emphasis: {
                    itemStyle: {
                        opacity: 0.9,
                        color: colors[0]
                    }
                },
                outline: {
                    show: false
                },
                label: {
                    fontSize: 13,
                    color: useColor[0],
                    formatter: function (param) {
                        var v = Math.round(param.value * 10000) / 100;
                        return v + "%";
                    },
                }
            }]
        };
        chartsInsts.liquidObj[id].setOption(option);
        var textEle = $('#' + id).next();
        textEle.find('span[name="liquidName"]').text(name);
        var dValue = textEle.find('span[name="changeNum"]').text();
        dValue = dValue || 0;
        var raiseEle = textEle.find('div[name="liquidChange"]');
        if (dValue != 0) {
            raiseEle.removeClass('none').removeClass('fall').addClass('raise');
        } else {
            raiseEle.removeClass('raise').removeClass('fall').addClass('none');
        }
    },

    //分组柱状图
        groupBar: function (data, legendFunc) {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                show: false
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: 25,
                top: '8%',
                containLabel: true,
                borderColor: '#445368'
            },
            dataZoom: [
                {
                    type: 'inside',
                    startValue: 0,
                    endValue: 5
                }, {
                    type: 'slider',
                    height: 12,
                    bottom: '10',
                    startValue: 0,
                    endValue: 5,
                    // rangeMode:['percent', 'percent'],
                    // zoomLock:true,
                    textStyle: {color: '#e9eaeb'}
                }],
            xAxis: [
                {
                    type: 'category',
                    data: data[0],
                    formatter: function (value) {
                        var len = value.length;
                        if (len > 5) {
                            value = value.substring(0, 5)
                        }
                        return value;
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#e9eaeb'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#445368'
                        }
                    },
                    axisTick: {show: false},
                    axisLabel: {
                        interval: 'auto',
                        fontSize: '10'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#e9eaeb'
                        }
                    },
                    axisTick: {show: false},
                    splitLine: {
                        lineStyle: {
                            color: '#445368'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '效益',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#37bfe4'},
                                    {offset: 1, color: '#348de8'}
                                ]
                            )
                        }
                    },
                    data: data[1]
                },
                {
                    name: '效率',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#45f29f'},
                                    {offset: 1, color: '#11bf6c'}
                                ]
                            )
                        }
                    },
                    data: data[2]
                },
                {
                    name: '感知',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#f1e344'},
                                    {offset: 1, color: '#bfb112'}
                                ]
                            )
                        }
                    },
                    data: data[3]
                },
                {
                    name: '合规',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#f09144'},
                                    {offset: 1, color: '#be5311'}
                                ]
                            )
                        }
                    },
                    data: data[4]
                },
                {
                    name: '安全',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#ae45f1'},
                                    {offset: 1, color: '#7e11be'}
                                ]
                            )
                        }
                    },
                    data: data[5]
                }
            ]
        };
        chartsInsts.operationEvaluation.setOption(option);
        if (legendFunc && typeof legendFunc === 'function') {
            legendFunc(chartsInsts.operationEvaluation);
        }
    },
    //画像得分柱状图
    PictureScore:function(data,urlParma){
        var dateobj=[];
        var numberobj=[];
        for (var i = 0, len = data.length; i < len; i++) {
            var datastr=data[i].day_no;
            var datastr= datastr+'';
            var mouth=datastr.substring(4,5)=="0"?datastr.substring(5,6):datastr.substring(4,6);
            var day=datastr.substring(6,7)=="0"?datastr.substring(7,8):datastr.substring(6,8)
            dateobj.push(mouth+"/"+day)
            numberobj.push(decimal(data[i].move_score,1))
        };
        
        var useColor = setColor[this.colorStyle].mainWork;
        var option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                top: '8%',
                containLabel: true,
                borderColor: useColor[0]
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            xAxis: {
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: useColor[1]
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: useColor[0]
                    }
                },
                axisTick: {show: false},
                axisLabel: {
                    interval: '0',
                    fontSize: '10'
                },
                data: dateobj
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: useColor[1]
                    }
                },
                axisTick: {show: false},
                splitLine: {
                    lineStyle: {
                        color: useColor[0]
                    }
                }
            },
            color: [useColor[2]],
            series: [{
                // data: [data.web_good_rate, data.video_good_rate, data.game_ask_good_rate, data.sms_send_succ_rate],
                data:numberobj ,
                tooltip : {     // Data config.
                    backgroundColor: 'blue',
                    // formatter: "Data formatter: <br/>{a}<br/>{b}:{c}"
                },
                markLine: {
                   symbol: 'none',
                   data: [{
                       type: 'average',
                       name: '平均值'
                   }]
                },
                type: 'bar',
                barWidth: 30,
                label: {
                    show: true, //开启显示
                    // position: "top", //在上方显示
                   position: [10, '-15%'], //在上方显示
                    textStyle: { //数值样式
                        color: useColor[1],
                        fontSize: 10
                    }
                }
            }]
        };
        chartsInsts.histogram.off('click');
        chartsInsts.histogram.setOption(option);
        //柱状图点击事件
        chartsInsts.histogram.on('click', function(param) {
            var _this=this;
            var areaId=data[param.dataIndex].area_id;
            var level=data[param.dataIndex].data_level;
            var time=data[param.dataIndex].day_no;
            if(areaId==null){
                areaId=0
            }
            console.log(urlParma,time);
            app.getSortDayPortrayScore(urlParma,time);
            app.getTargetRadar(urlParma,time);

        })
    },
    //画像指标雷达图
    ScreenIndex:function(data){
        console.log(data,'雷达')
        var Xjdata=[];
        var otherdata=[];
        if(data.length!=0){
            Xjdata=[data[1].yd_zc_cell_income_score,data[1].yd_zc_busy_dbr_cell_score,data[1].yd_zc_rru_online_score,
                data[1].yd_zc_zero_dbr_cell_score,data[1].yd_zc_prb_userd_score,data[1].yd_yy_response_complete_score,data[1].yd_gz_4g_3g_score,
                data[1].yd_gz_dpi_perception_score,data[1].yd_gz_nps_order_score,data[1].yd_yy_plan_enb_complete_score,data[1].yd_gz_cqi_quality_score,
                data[1].yd_zc_idle_dbr_cell_score,data[1].yd_yy_low_quality_order_complete_score,data[1].yd_yy_capacity_order_complete_score,data[1].yd_yy_fault_order_score];
            otherdata=[data[0].yd_zc_cell_income_score, data[0].yd_zc_busy_dbr_cell_score, data[0].yd_zc_rru_online_score,
                data[0].yd_zc_zero_dbr_cell_score, data[0].yd_zc_prb_userd_score, data[0].yd_yy_response_complete_score, data[0].yd_gz_4g_3g_score,
                data[0].yd_gz_dpi_perception_score, data[0].yd_gz_nps_order_score, data[0].yd_yy_plan_enb_complete_score, data[0].yd_gz_cqi_quality_score,
                data[0].yd_zc_idle_dbr_cell_score,data[0].yd_yy_low_quality_order_complete_score,data[0].yd_yy_capacity_order_complete_score,data[0].yd_yy_fault_order_score]
        }
        // if(data[0].day_no.lenght!=0){
        //     // gettimeobj(data[0].day_no);
        //     var timestr=data[0].day_no+'';
        //     var timeyear= data[0].day_no.substring(1,4);;
        //     var timemouth= data[0].day_no.substring(5,6);
        //     var timeday= data[0].day_no.substring(7,8);
        //
        // }

        var dateobj=''
        if(data[0].day_no+''!=''){
            var datestr=data[0].day_no+'';
            dateobj=datestr.substring(0,4)+"年"
            dateobj+=datestr.substring(4,5)=="0"?datestr.substring(5,6):datestr.substring(4,6)
            dateobj+='月'
            dateobj+=datestr.substring(6,7)=="0"?datestr.substring(7,8):datestr.substring(6,8)
            dateobj+='日'
        }

        var dateobj1=''
        if(data[1].day_no+''!=''){
            var datestr=data[1].day_no+'';
            dateobj1=datestr.substring(0,4)+"年"
            dateobj1+=datestr.substring(4,5)=="0"?datestr.substring(5,6):datestr.substring(4,6)
            dateobj1+='月'
            dateobj1+=datestr.substring(6,7)=="0"?datestr.substring(7,8):datestr.substring(6,8)
            dateobj1+='日'
        }

        if(data[0].city_name==null){
            var titlename= '新疆'+dateobj+'得分'
        }else{
            var titlename= data[0].city_name+dateobj+'得分'
        }

        var useColor = setColor[this.colorStyle].mainWork;
        var option = {
            // formatter:function(name){
            //     return  '123133'+name+name
            // },
            tooltip: {
                // position:'inside' //提示框位置
                confine: true,
                z:3
            },
            // legend:{
            //     formatter:  function(name){
            //         var res = "";
            //         return '123133'+res+name
            //     }
            // },
            grid: {
                left: '0%',
                right: '0%',
                top: '33%',
                bottom: '20%'
            },
            radar: {
                // lineStyle:{

                // },
                //shape: 'circle',.lineStyle.normal.type
                splitNumber: 5,
                name: {
                    textStyle: {
                        color: useColor[1],
                        fontSize:'0.5vh'
                    },
                    // formatter: (text) => {
                    //     text = text.replace(/\S{9}/g, function(match) {
                    //         return match + '\n'
                    //     })
                    //     return text
                    // },
                },
                axisLine: {            // 坐标轴线
                    lineStyle:{
                        color: 'rgba(131,141,158,0)',
                    }
                    // 默认显示，属性show控制显示与否
                },
                splitLine : {
                    show : true,
                    lineStyle : {
                        type: "dashed",
                        width : 1,
                        color : '#286fbb' // 图表背景网格线的颜色
                    }
                },
                splitArea : {
                    areaStyle : {
                        color:'rgba(0,0,0,0)' // 图表背景网格的颜色
                    }
                },
                indicator: [
                    { name: '平均载扇收入', max: 100},
                    { name: '高负荷小区', max: 100},
                    { name: 'RRU在线', max: 100},
                    { name: '零流量小区', max: 100},
                    { name: '资源利用率', max: 100},
                    { name: '响应站开通', max: 100},
                    { name: '4G下切3G', max: 100},
                    { name: '感知优良率', max: 100},
                    { name: 'NPS工单', max: 100},
                    { name: '规划站开通', max: 100},
                    { name: 'CQI优良率', max: 100},
                    { name: '闲小区', max: 100},
                    { name: '容量工单', max: 100},
                    { name: '质差工单', max: 100},
                    { name: '故障工单', max: 100},
                    // 平均载扇收入
                    // 高负荷小区
                    // RRU在线
                    // 零流量小区
                    // 资源利用率
                    // 响应站开通
                    // 4G下切3G
                    // 感知优良率
                    // NPS工单
                    // 规划站开通
                    // CQI优良率
                    // 闲小区
                    // 容量工单
                    // 质差工单
                    // 故障工单
                ],
            },
            series: [{
                name: '',
                type: 'radar',
                // symbol: 'emptyCircle', // 拐点的样式，还可以取值'rect','angle'等
                color:'#005AAF',
                symbolSize: 4, // 拐点的大小
                data : [
                    {
                        value :Xjdata ,//新疆当日数据,
                        name : '新疆'+dateobj1+'得分',

                        areaStyle : {
                            color: ["rgba(3,48,151,0.7"], // 图表背景的颜色
                        },
                        itemStyle: {
                            normal: {
                                color: '#27eae4',
                            },
                        },

                    },
                    {
                        value: otherdata,//新疆昨日或地区数据得分,
                        name: titlename,

                        areaStyle: {
                            color: ["rgba(15,144,96,0.7"], // 图表背景的颜色
                        },
                        itemStyle: {
                            normal: {
                                color: '#27eae4',
                            },
                        },

                    }
                    // {
                    //     value : [5000, 14000, 28000, 31000, 42000, 21000],
                    //     name : '实际开销（Actual Spending）' ,
                    //     areaStyle : {
                    //         color: ["rgba(3,48,151,0.5"], // 图表背景的颜色
                    //     },
                    //     itemStyle: {
                    //         normal: {
                    //             color: 'rgba(20,0,0,0,0)',
                    //         },
                    //     },
                    // }
                ],
            }]
        };
        chartsInsts.ScreenIndex.setOption(option);
    },
    // quadrant:function(){
    //     var option = {
    //         tooltip : {
    //             trigger: 'axis',
    //             showDelay : 0,
    //             axisPointer:{
    //                 show: true,
    //                 type : 'cross',
    //                 lineStyle: {
    //                     type : 'dashed',
    //                     width : 2
    //                 }
    //             }
    //         },
    //         title: [
    //             {text: "端口造价低，端口AURP值高",x: '65%',y: '5%',textStyle:{
    //                     color:"#31bee9",
    //                     fontSize:12,
    //                     fontWeight: 'normal',
    //                 }},
    //             {text: "端口造价高，端口AURP值高",x: '10%',y: '5%',textStyle:{
    //                     color:"#31bee9",
    //                     fontSize:12,
    //                     fontWeight: 'normal',
    //                 }},
    //             {text: "端口造价高，端口AURP值低",x: '10%',y: '78%',textStyle:{
    //                     color:"#31bee9",
    //                     fontSize:12,
    //                     fontWeight: 'normal',
    //                 }},
    //             {text: "端口造价低，端口AURP值低",x: '65%',y: '78%',textStyle:{
    //                     color:"#31bee9",fontSize:12,fontWeight: 'normal',
    //                 }}
    //         ],
    //         grid:{
    //             top:15,
    //             left:80,
    //             bottom:25,
    //             right:60
    //         },
    //         xAxis : [
    //             {
    //                 type : 'value',
    //                 splitNumber: 4,
    //                 scale: true,
    //                 axisLine:{
    //
    //                     lineStyle:{
    //                         color:"#31bee9",
    //                         width:1
    //                     }
    //                 },
    //                 splitLine:{
    //                     lineStyle:{
    //                         color:"#31bee9",
    //                         width:1
    //                     }
    //                 },
    //
    //                 axisLabel : {
    //                     formatter: "111元",
    //                     textStyle:{
    //                         color:"#31bee9",
    //                         fontSize:10
    //                     }
    //                 }
    //             }
    //         ],
    //         yAxis : [
    //             {
    //                 type : 'value',
    //                 splitNumber: 4,
    //                 scale: true,
    //                 axisLine:{
    //                     lineStyle:{
    //                         color:"#31bee9",
    //                         width:1
    //                     }
    //                 },
    //                 axisLabel : {
    //                     formatter: '111 元',
    //                     textStyle:{
    //                         color:'#31bee9',
    //                         fontSize:10
    //                     }
    //                 },
    //                 splitLine:{
    //                     lineStyle:{
    //                         color:"#31bee9",
    //                         width:1
    //                     }
    //                 }
    //             }
    //         ],
    //         series : [
    //             {
    //                 type:'scatter',
    //                 symbolSize:10,
    //                 data:[111,111,1123,123132,123123],
    //                 itemStyle:{
    //                     normal:{
    //                         color:"#31bee9"
    //                     }
    //                 },
    //                 markLine : {
    //                     lineStyle: {
    //                         normal: {
    //                             color: '#31bee9',
    //                             type: 'solid'
    //                         }
    //                     },
    //
    //                     data : [
    //                         {type : 'average', name: '平均值'},
    //                         {type : 'average', valueDim:'x' }
    //                     ]
    //                 },
    //
    //             }
    //         ]
    //     }
    //     chartsInsts.picContainer.setOption(option);
    // },
    /**
     * 获取top10列表点击单个 行的行数据
     * @param {*} orderId 
     */
    getTop10TableSingleData: function (orderId) {
        var useData = {};
        var currentCityData = [];
        if(app.getCurrentShowTop10Type() == "management"){
            currentCityData = app.top10TableDataManagement;
        }else if(app.getCurrentShowTop10Type() == "produce"){
            currentCityData = app.top10TableDataProduce;
        }
        for (var i = 0, len = currentCityData.length; i < len; i++) {
            if (orderId == currentCityData[i].manager_order_id) {
                useData = currentCityData[i];
            }
        };
        return useData;
    },

    /**
     * 获取当前是生产告警 top10  management 还是 管理告警top10 produce
     */
    getCurrentShowTop10Type:function(){
        if($("#labelsDesc>li").eq(2).hasClass("selected")){
            return "management";
        }else if($("#labelsDesc>li").eq(0).hasClass("selected")){
            return "produce";
        }
    },
    /**
     * 当数据为空时 情况对应 表格的数据
     * @param {*} tableName  
     */
    clearTop10TableProduceManagement:function(tableName,isClearData){
        switch(tableName){
            case 'management':
            isClearData?app.top10TableDataManagement = []:"";
            break;
            case "produce":
            isClearData?app.top10TableDataProduce = []:"";
            break;
        };
        $("#operationEvaluation-table-content-box").empty();
    },
    /**
     * 切换top10 的 管理 和生产
     * @param {*} tableName 
     */
    switchTop10TableData:function(tableName){
        switch(tableName){
            case 'management':
            app.clearTop10TableProduceManagement("management",false);
            app.setTop10Table(app.top10TableDataManagement);
            break;
            case "produce":
            app.clearTop10TableProduceManagement("produce",false);
            app.setTop10Table(app.top10TableDataProduce);
            break;
        }
    },
    /**
     * 获取某个城市下的 top10 数据
     * @param {*} sourceData
     */
    // getTop10TableSingleCityData:function(sourceData){
    //     app.top10TableData = sourceData;
    //     return sourceData[app.areaid-0];
    // },
    /**
     * 设置top10 表格 的 数据
     * @param {*} data
     */
    setTop10Table: function (data) {
        var _this = this;
        console.log(data)
        var html = '';
        if (!data) {
            return false;
        }
        for (var i = 0, len = data.length; i < len; i++) {
             html += '<ul class="operationEvaluation-table-content-rows" order-id="' + data[i].manager_order_id + '" order_type="' + data[i].order_type + '">\
                <li class="left">' + data[i].alarm_level + '</li>\
                <li class="left">' + data[i].alarm_time + '</li>\
                <li class="left">' + data[i].alarm_description + '</li>\
            </ul>';
        };
        $("#operationEvaluation-table-content-box").html(html).height(25 * data.length);
        $("#operationEvaluation-table-content-box>.operationEvaluation-table-content-rows").off("click").on("click", function () {
            //关闭画像得分
            $("#picDivs").hide();
            $("#picContainer,#picContainer3").empty();
            var yth_order_type=$(this).attr("order_type")
            // console.log(yth_order_type,"点击top工单列表搜索下拉框入参")
            getordertypelist(yth_order_type)
            var useData = app.getTop10TableSingleData($(this).attr("order-id"));
            if (app.assemblyShow == "anim") {
                // var dataLonLat = ExtendUtil.gps84ToGcj02(useData.lon, useData.lat);
                // useData.lon = dataLonLat.x;
                // useData.lat = dataLonLat.y;
                //只能点一次 下钻
                if (useData.manager_order_id && !app.top10TableIsClick) {
                    app.top10TableIsClick = true;
                    mygis.showWarn(useData);
                    setTimeout(function () {
                        if(app.getCurrentShowTop10Type() == "management"){
                            _this.downType = 1;
                            app.getWorkOrderListByTipsid("top10", useData.manager_order_id, "", null, useData.alarm_level, app.getWorkOrderListCallBack);
                        }else if(app.getCurrentShowTop10Type() == "produce"){
                            _this.downType = 2;
                            app.productionWorkOrderGetOrderList(useData.manager_order_id,"top10Produce");
                        }
                        $("#mapFilter").hide();
                        $(".ol-utils").hide();
                    }, 1000);
                }
            }
        });
    },
    initTop10TableAnimate: function () {

        var innerDom = $('#operationEvaluation-table-content-box');
        var outerDom = innerDom.parent();
        if (window.top10Scrolls) {
            clearInterval(window.top10Scrolls);
            outerDom.scrollTop(0);
        }
        if (innerDom.height() > outerDom.height()) {
            // innerDom.next().html(innerDom.html());
            var maxH = innerDom.height();
            var scTop = 0;
            var doScroll = function () {
                if (scTop >= maxH) {
                    scTop = 0;
                } else {
                    outerDom.scrollTop(scTop++);
                }
            }
            window.top10Scrolls = setInterval(doScroll, 50);
            outerDom.on('mouseenter', function () {
                clearInterval(window.top10Scrolls);
            }).on('mouseleave', function () {
                window.top10Scrolls = setInterval(doScroll, 50);
            })
        }
    },
    /**
     * 根据城市id 长度 判断当前层级
     * @param {*} codeId 
     */
    getCurrentLevelByCodeLength:function(codeId){
        var level = 1;
        switch((codeId+"").length){
            case 1:
                level = 1;
                break;
            case 4:
                level = 2;
                break;
            case 6:
                level = 3;
                break;
            default:
                level = 4;
                break;        
        };
        return level;
    },
    universalUnlimitedScroll: function (domId, scrollTimer) {
        var innerDom = $(domId);
        var outerDom = innerDom.parent();
        if (innerDom.height() > outerDom.height()) {
            // innerDom.next().html(innerDom.html());
            var maxH = innerDom.height();
            var outH = outerDom.height();
            var scTop = 0;
            var doScroll = function () {
                if (scTop >= (maxH - outH)) {
                    setTimeout(function () {
                        scTop = 0;
                    }, 2000)

                } else {
                    outerDom.scrollTop(scTop++);
                }
            }
            scrollTimer = setInterval(doScroll, 50);
            outerDom.on('mouseenter', function () {
                clearInterval(scrollTimer);
            }).on('mouseleave', function () {
                scrollTimer = setInterval(doScroll, 50);
            })
        }
    },
    //系列单值环形图
    singleRings: function (id, name, value1) {
        var useColor = setColor[this.colorStyle].singleRing;
        var colors = [useColor[1], useColor[2]];
        // colors = value1>=levelValue?['#74dffb','#15608f']:['#fb7474','#8e1515'];
        var option = {
            backgroundColor: 'transparent',
            title: [
                {
                    text: name,
                    x: 'center',
                    bottom: '5%',
                    textAlign: 'left',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: '14',
                        color: useColor[0],
                        textAlign: 'center'
                    }
                },
                {
                    text: value1,
                    x: 'center',
                    y: '25%',
                    textAlign: 'left',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: '14',
                        color: useColor[0],
                        textAlign: 'center',
                        verticalAlign: 'top'
                    }
                }
            ],
            series: [{
                type: 'pie',
                hoverAnimation: false, //鼠标经过的特效
                radius: ['43%', '58%'],
                center: ['50%', '38%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: value1,
                    itemStyle: {
                        normal: {
                            color: colors[0]
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    }
                }, {
                    value: 100 - value1,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            },
                            labelLine: {
                                show: false
                            },
                            color: colors[1],
                            borderWidth: 0
                        },
                        emphasis: {
                            color: colors[1],
                            borderWidth: 0
                        }
                    }
                }

                ]
            }]
        };
        chartsInsts.singleRingObj[id].setOption(option);
    },

    //线柱混合图
    lineAndBars: function (data, legendFunc) {
        var useColor = setColor[this.colorStyle].keyQuota;
        var dataLength = data.length;
        var start = dataLength - 24;
        var dataArr = [];
        var busyArr = [];
        var connArr = [];
        var brokArr = [];
        var chagArr = [];
        var barArr = [];
        for (var i = 0; i < dataLength; i++) {
            var times = data[i].hour_no + '';
            var hours = times.slice(times.length - 2, times.length);
            var chagVal = (hours == '11' || hours == '22') ? 100 : 0;
            dataArr.push(hours);
            busyArr.push(utils.nullDetectionZero(data[i].busy_cell_rate));
            connArr.push(utils.nullDetectionZero(data[i].rrc_rate));
            brokArr.push(utils.nullDetectionZero(data[i].abnormal_release_rate));
            chagArr.push(utils.nullDetectionZero(data[i].switch_rate));
            barArr.push(utils.nullDetectionZero(chagVal));
        }
        var colors = [useColor[0], useColor[1], useColor[2]];
        var option = {
            color: colors,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    var useHtml = "";
                    if (params.length > 0) {
                        useHtml += params[0].name + "<br />";
                        for (var i = 0, len = params.length; i < len; i++) {
                            if (params[i].componentSubType == "line") {
                                useHtml += params[i].marker + " " + params[i].seriesName + "：" + params[i].value + "<br />";
                            }
                        }

                    }
                    ;
                    return useHtml;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: 30,
                top: '8%',
                containLabel: true,
                borderColor: useColor[3]
            },
            toolbox: {
                show: false
            },
            legend: {
                show: false,
                data: ['超忙小区占比', '连接成功率', '掉线率', '切换成功率']
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: useColor[4]
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: useColor[3]
                        }
                    },
                    axisTick: {show: false},
                    axisLabel: {
                        interval: '0',
                        fontSize: '10'
                    },
                    data: dataArr
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: useColor[6]
                        }
                    },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisTick: {show: false},
                    splitLine: {
                        lineStyle: {
                            color: useColor[7]
                        }
                    }
                },
                {
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: useColor[8]
                        }
                    },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisTick: {show: false},
                    splitLine: {
                        lineStyle: {
                            color: useColor[9]
                        }
                    }
                }
            ],
            series: [
                {
                    name: '超忙占比',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {
                        color: useColor[11]
                    },
                    smooth: true,
                    itemStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        color: useColor[10]
                    },
                    data: busyArr
                },
                {
                    name: '连接率',
                    type: 'line',
                    yAxisIndex: 0,
                    areaStyle: {
                        color: useColor[13]
                    },
                    itemStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        color: useColor[12]
                    },
                    smooth: true,
                    data: connArr
                }, {
                    name: '掉线率',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    itemStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        color: useColor[14]
                    },
                    areaStyle: {
                        color:useColor[15]
                    },
                    data: brokArr
                },
                {
                    name: '4G下切3G',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    itemStyle: {
                        opacity: 0
                    },
                    lineStyle: {
                        color: useColor[16]
                    },
                    areaStyle: {
                        color: useColor[17]
                    },
                    data: chagArr
                },
                // {
                //     name:'忙时指标',
                //     type:'bar',
                //     itemStyle:{
                //         color:'orange'
                //     },
                //     data:barArr
                // }
            ]
        };
        chartsInsts.keyQuota.setOption(option);
        if (legendFunc && typeof legendFunc === 'function') {
            legendFunc(chartsInsts.keyQuota);
        }
    },
    //四柱图
    fourBar: function (data) {
        var useColor = setColor[this.colorStyle].mainWork;
        var option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                top: '8%',
                containLabel: true,
                borderColor: useColor[0]
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: useColor[1]
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: useColor[0]
                    }
                },
                axisTick: {show: false},
                axisLabel: {
                    interval: '0',
                    fontSize: '10'
                },
                data: ['网页浏览', '视频业务', '游戏业务', '即时通讯']
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: useColor[1]
                    }
                },
                axisTick: {show: false},
                splitLine: {
                    lineStyle: {
                        color: useColor[0]
                    }
                }
            },
            color: [useColor[2]],
            series: [{
                // data: [data.web_good_rate, data.video_good_rate, data.game_ask_good_rate, data.sms_send_succ_rate],
                data: [data.web_good_rate, 93.35, data.game_ask_good_rate, data.sms_send_succ_rate],
                type: 'bar',
                barWidth: 20,
                label: {
                    show: true, //开启显示
                    position: "center", //在上方显示
                    // position: [-10, '-15%'], //在上方显示
                    textStyle: { //数值样式
                        color: useColor[1],
                        fontSize: 10
                    }
                }
            }]
        };
        chartsInsts.mainWork.setOption(option);
        $('#mainWork').parents('.slideCon').css({visibility: 'visible', display: 'none'});
    },

    //时间显示功能
    showNowTime: function () {
        var elt = $('#showTime');
        var now = new Date();
        this.dateStr = now.toLocaleDateString().split('/').join('');
        elt.html(now.toLocaleTimeString());
    },

    //页面组件效互，收缩隐藏
    hideElement: function (param, fn) {
        var moveout = function (obj) {
            for (var key in obj) {
                var size = '';
                if (key === 'top' || key === 'bottom') {
                    size = 'height'
                }
                if (key === 'left' || key === 'right') {
                    size = 'width'
                }
                $(obj[key]).each(function (i, o) {
                    var opt = {};
                    var nums = parseFloat($(o).css(size)) + parseFloat($(o).css(key));
                    opt['margin-' + key] = '-' + nums + 'px';
                    $(o).animate(opt, 250);
                })
            }
            ;

        };
        var selects = $('div[rel-tag=' + param + ']');
        var groups = {};
        selects.each(function (i, o) {
            var ele = $(o);
            var direc = ele.attr(param + '-tag');
            if (!groups[direc]) {
                groups[direc] = []
            }
            groups[direc].push(o);
        });
        selects.addClass('scale');
        setTimeout(function () {
            moveout(groups)
        }, 150);
        setTimeout(fn, 400);
    },

    //页面组件效互，还原显示
    showElement: function (param) {
        var movein = function (obj) {
            for (var key in obj) {
                $(obj[key]).each(function (i, o) {
                    var opt = {};
                    opt['margin-' + key] = '0';
                    $(o).animate(opt, 500);
                })
            }
        };
        var selects = $('div[rel-tag=' + param + ']');
        var groups = {};
        selects.each(function (i, o) {
            var ele = $(o);
            var direc = ele.attr(param + '-tag');
            if (!groups[direc]) {
                groups[direc] = []
            }
            groups[direc].push(o);
        });
        selects.removeClass('scale');
        movein(groups);
        if (param != 'mapmax') {
            this.assemblyShow = param;
        }
    },

    //地图筛选组件靠边
    pilloverFilters: function () {
        var parma = {right: '5px'};
        if (this.mapMax) {
            // if(this.assemblyShow!='order'){
            parma.bottom = '1%';
            // }

            $('#mapFilter').delay(500).animate({left: '2%'}, 250);
        }
        $('#mapFilter2').delay(500).animate(parma, 400);
        $("#mapFilter3").delay(500).animate(parma, 400);
        gisLegendObject.indexOrOrderWorkLegendSwitch("order-work");
    },
    //地图筛选组件还原
    reductionFilters: function () {
        var parma = {};
        if (!this.mapMax) {
            if (this.assemblyShow != 'order') {
                parma.right = '24.6%';
            }
            parma.bottom = '31.5%';
            $('#mapFilter').animate({left: '28.6%'}, 400);
        }
        $('#mapFilter2').delay(500).animate(parma, 400);
        $('#mapFilter3').delay(500).animate(parma, 400);
        gisLegendObject.indexOrOrderWorkLegendSwitch("index");
    },

    //地图放大功能
    setMapMax: function () {
        this.mapMax = true;
        this.hideElement(this.assemblyShow);
        this.hideElement('mapmax');
        this.pilloverFilters();
    },

    //地图还原功能
    setMapNormal: function () {
        this.mapMax = false;
        this.showElement(this.assemblyShow);
        this.showElement('mapmax');
        this.reductionFilters();
    },

    //地图贴图层显隐功能一
    bindLeftFilterEvent: function () {
        $('#mapFilter li').removeClass("close");
        $('#mapFilter li').on('click', function () {
            var index = $(this).index();
            var status = mygis.isMultiChoice1();
            var dom = $(this);
            var evtag = dom.attr('evtag');
            app.indexCurrentSelectedGisLayerName = evtag;
            //判断是否有这个属性 没有这个 属性 或者方法 就不执行里面的代码
            if (mygis[evtag]) {
                if (!dom.hasClass('active')) {
                    if (!status) {
                        $(this).siblings().each(function (index, ele) {
                            var tags = $(ele).attr('evtag');
                            mygis[tags] ? mygis[tags](false) : "";
                            $(ele).removeClass('active');
                        })
                    }
                    $(this).addClass('active');
                    mygis[evtag](true);
                } else {
                    $(this).removeClass('active');
                    evtag == "showWorkOrder" ? "" : mygis[evtag](false);
                }
                ;
            }


            if (index == 0 || index == 1 || index == 2) {
                // 选择电信/移动/联通 并且展示栅格图层时,更换图例
                if(mygis.map.getView().getResolution() < 0.6) {
                    gisLegendObject.switchLegend(6);
                }else {
                    gisLegendObject.switchLegend(0);
                }
            } else if (index == 3) {
                gisLegendObject.switchLegend(1);
            } else if (index == 4) {
                gisLegendObject.switchLegend(2);
            } else if (index == 5) {
                gisLegendObject.switchLegend(3);
            }else if (index == 6) {
                gisLegendObject.switchLegend(4);
            }else if (index == 7) {
                gisLegendObject.switchLegend(5);
            }


        });
        //判断 当 有选中图层时 返回首页就选中图层 并选中该图层的按钮
        if (app.indexCurrentSelectedGisLayerName != "") {
            $('#mapFilter li').each(function (index, element) {
                var tags = $(element).attr('evtag');
                if (tags == app.indexCurrentSelectedGisLayerName) {
                    $(element).trigger("click");
                }
            })
        }
    },
    /**
     * 首页图层选择按钮的 取消 方法
     */
    indexLayersCloseFn: function () {
        $('#mapFilter li').off('click').removeClass("active").addClass("close");
        app.hideIndexAllLayers();
    },

    /**
     * 将首页所有的图层隐藏
     */
    hideIndexAllLayers: function () {
        $("#mapFilter>li").each(function (index, element) {
            var layerName = $(element).attr("evtag");
            if (mygis[layerName]) {
                mygis[layerName](false);
            }
        })
    },
    /**
     * 工单视图的 图例控制器
     * @param {*} name  basis 基站 spot盲点
     * @param {*} isShow  true 展示 false 隐藏
     */
    showHideOrderWordLegend: function (name, isShow) {
        $(".blind-spot-box").attr("current-layer",name);
        $(".blind-spot-box>li").each(function (index, element) {
            if ($(element).attr("image-class") == name) {
                if (isShow) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            }else{
                $(element).hide();
            }
        })
    },
    /**
     * 判断工单视图显示的图例是什么  spot 盲点  basis 基站
     *
     */
    getOrderWorkLegendName: function () {
       return $(".blind-spot-box").attr("current-layer");
    },
    //地图贴图层显隐功能二
    bindRightFilterEvent: function () {
        var eles = $('#mapFilter2 div[evtag="btag"]');
        eles.on('click', function () {
            var filters = [];
            var dom = $(this);
            dom.toggleClass('gray');
            eles.each(function (index, ele) {
                if (!$(ele).hasClass('gray')) {
                    filters.push($(ele).attr('btag'));
                }
            });
            var parma = filters.length > 0 ? '(' + filters.join(',') + ')' : '(-1)';
            mygis.changeBaseSector(parma);
        })
        var eles2 = $('#mapFilter2 div[evtag="ctag"]');
        eles2.on('click', function () {
            var filters = [];
            var dom = $(this);
            dom.toggleClass('gray');
            eles2.each(function (index, ele) {
                if (!$(ele).hasClass('gray')) {
                    filters.push($(ele).attr('ctag'));
                }
            });
            var parma = filters.length > 0 ? '(' + filters.join(',') + ')' : '(-1)';
            mygis.changeNetwork(parma);


        })

        // var elesa = $('#mapFilter3 div[evtag="btag"]');
        // elesa.on('click',function(){
        // 	var filters = [];
        // 	var dom = $(this);
        // 	dom.toggleClass('gray');
        // 	elesa.each(function(index,ele){
        // 		if(!$(ele).hasClass('gray')){filters.push($(ele).attr('btag'));}
        // 	});
        // 	var parma = filters.length>0?'('+filters.join(',')+')':'(-1)';
        // 	mygis.changeBaseSector(parma);
        // })
        // 工单视图 基站 盲点的 帮点点击事件
        var elesa2 = $('#mapFilter3 div[evtag="ctag"]');
        elesa2.on('click', function () {
            // var filters = [];
            var dom = $(this);
            dom.toggleClass('gray');
            // elesa2.each(function(index,ele){
            //     if(!$(ele).hasClass('gray')){filters.push($(ele).attr('ctag'));}
            // });
            // var parma = filters.length>0?'('+filters.join(',')+')':'(-1)';
            // mygis.changeNetwork(parma);
            // gisLegendObject.orderWorkLegendController($(this));
            // 控制图层
            var index = $(this).index();
            switch (app.getOrderWorkLegendName()) {
                case 'basis':
                    if (index == 0) {//盲点
                        if ($(this).hasClass("gray")) {
                            // app.showHideOrderWordLegend("spot", false);
                            $(".blind-spot-box>li[image-class=spot]").hide();
                            $(".blind-spot-box>li[image-class=basis]").show();
                            $("#order-work-details-box").css("height", "50.4vh");

                        } else {
                            // app.showHideOrderWordLegend("spot", true);
                            $(".blind-spot-box>li[image-class=spot]").show();
                            $(".blind-spot-box>li[image-class=basis]").show();
                            $("#order-work-details-box").css("height", "42.4vh");
                        }
                    }
                    break;
                case 'spot':
                    if (index == 1 || index == 2) {//基站
                        if ($(this).hasClass("gray")) {
                            // app.showHideOrderWordLegend("basis", false);
                            $(".blind-spot-box>li[image-class=spot]").show();
                            $(".blind-spot-box>li[image-class=basis]").hide();
                            $("#order-work-details-box").css("height", "50.4vh");
                        } else {
                            // app.showHideOrderWordLegend("basis", true);
                            $(".blind-spot-box>li[image-class=spot]").show();
                            $(".blind-spot-box>li[image-class=basis]").show();
                            $("#order-work-details-box").css("height", "42.4vh");
                        }
                    }
                    break;
            }
        });
    },

    //获取中间地图可视区域的位置
    getMapPosition: function () {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        return {
            width: (0.466 * w).toFixed(2),
            left: (0.267 * w).toFixed(2),
            height: (0.598 * h).toFixed(2),
            top: (0.086 * h).toFixed(2)
        }
    },

    //报警信息滚动功能,超过一条信息则向上循环滚动
    warnScrolling: function (el) {
        var doScroll = function (obj, el, tempName) {
            var o = el.parent(), a = el, fx = 1, perH = Math.round(el.children().eq(0).height()),
                h = Math.round(el.height());
            obj.scrollIndex[tempName] = 0;
            obj.scrollStatus[tempName] = false;
            obj.warnScroll[tempName] = setInterval(function () {
                if (obj.scrollStatus[tempName] == false) {
                    return timeOut()
                }
            }, 4000);
            o.on("mouseenter", function () {
                clearInterval(obj.warnScroll[tempName]);
            });
            o.on("mouseleave", function () {
                obj.warnScroll[tempName] = setInterval(timeOut, 4000);
            });

            function timeOut(i) {
                if (fx == 1) {
                    if (o.scrollTop() >= h || o.scrollTop() % 20 != 0) {
                        o.scrollTop(0);
                    }
                    var timeline = marquee();
                }
                if (fx == -1) {
                    if (o.scrollTop() <= 0) {
                        o.scrollTop(h);
                    }
                    var timeline = marquee();
                }
            }

            function marquee() {
                obj.scrollStatus[tempName] = true;
                obj.scrollIndex[tempName] += fx;
                if ((fx == 1 && obj.scrollIndex[tempName] <= perH) || (fx == -1 && -obj.scrollIndex[tempName] <= perH)) {
                    o.scrollTop(o.scrollTop() + 1);
                    setTimeout(marquee, 10);
                } else {
                    obj.scrollStatus[tempName] = false;
                    obj.scrollIndex[tempName] = 0;
                }
            }
        };
        var el = el, _this = this;
        var tempName = el.parents('.pres,.pres2').attr('tipsdata');
        if (el.children().length <= 1) {
            el.next().empty();
            clearInterval(_this.warnScroll[tempName]);
        } else {
            el.next().html(el.html());
            doScroll(_this, el, tempName);
        }
    },

    //仿京东多级地区选择功能
    areaLevelSelect: function (id, defaultData) {
        var self = this;
        var ele = $('#' + id);
        var index = 0;
        var createAreaLevelHtml = function (arr, index, show) {
            var showCode = '';
            if (!show) {
                showCode = ' style="display:none;"'
            }
            var html = '';
            for (var i = 0; i < arr.length; i++) {
                html += '<li level="' + index + '" codeid="' + arr[i].id + '">' + arr[i].name + '</li>';
            }
            return html;
        };
        var getAreaLevelDefaultData = function (ele, dataArr, index) {
            var i = index;
            var contentDom = ele.find('div[name="areaSubList"] ul');
            // var tabDom = ele.find('ul[name="areaLevel"]');
            console.log('dataArr[i]',dataArr[i].id);
            var http_info = 'queryCityBaseInfo';
            dataArr[i].id += '';
            if(dataArr[i].id == '0' || dataArr[i].id == '-1' || dataArr[i].id.indexOf(',') != -1) {
                http_info = 'queryCityBaseInfo';
            }else {
                http_info = 'queryCityInfo';
            }
            $.getJSON(BACK_SERVER_URL + 'gisController/' + http_info + '.json?id=' + dataArr[i].id, function (data) {
                var status;
                status = i < (dataArr.length - 1) ? false : true;
                var i2 = i;
                if(dataArr.length == 1) {
                    i2 += 1;
                }
                var resData = data;
                if(http_info == 'queryCityInfo') {
                    resData = data.districts;
                }
                console.log('data22',data);
                contentDom.append(createAreaLevelHtml(resData, i2, status));
                // if(i>0){tabDom.append('<li>'+dataArr[i].name+'</li>')}
                i++;
                if (i <= dataArr.length - 1) {
                    getAreaLevelDefaultData(ele, dataArr, i);
                } else {
                    // tabDom.append('<li class="active">请选择</li>');
                    // tabDom.on('click',function(){
                    // 	if(event.target.tagName.toLowerCase()!='li'){return false;}
                    //     var index = $(event.target).index();
                    //     $(event.target).addClass('active').siblings().removeClass('active');
                    //     contentDom.find('.areaSubListContent').hide().eq(index).show();
                    // });
                    contentDom.find('li').eq(0).addClass('active');
                    contentDom.on('click', function () {
                        if (event.target.nodeName.toLowerCase() != 'li') {
                            return false;
                        }
                        var parmasName = ['province_id=', 'city_id='];
                        var subdom = $(event.target);
                        var codeid = subdom.attr('codeid');
                        var level = subdom.attr('level');
                        var name = subdom.text();
                        ele.children('span').text(name);
                        subdom.addClass('active').siblings().removeClass('active');
                        mygis.showCity(codeid);
                        app.areaid = codeid-0;
                        app.arealevel = level;
                        // app.setTop10Table(app.getTop10TableSingleCityData(app.top10TableData));
                        // app.getAllLeftDataByDefault(codeid,level);
                        // app.getAllRightDataByDefault(codeid,level);
                        // app.getKeyQuotaAndDpiRate(codeid,level);
                        // app.webSocketObj.send(parmasName[level]+codeid);

                        // self.renderYYXLChange({parameter_rate: 0});
                        self.getDataForAssetEfficiency(level,codeid);//主动查询RRU和资产利用率数据
                        self.renderLiqiudUpDownClear();
                        clearTimeout(window.autoClickWarn);
                        var flowManageOuter = $('#flowStepBox');
                        flowManageOuter.find('.presPop').remove();
                        // if(level>0){
                        $('#areaDrag').removeClass('active');
                        $('.popBox').remove();
                        //     return false;
                        // }
                        // tabDom.find('li').eq(level).removeClass('active').text(name).nextAll().remove();
                        // tabDom.append('<li class="active">请选择</li>');
                        // contentDom.find('.areaSubListContent').hide().eq(level).nextAll().remove();
                        // $.getJSON(BACK_SERVER_URL+'gisController/queryCityBaseInfo.json?id='+codeid, function(data) {
                        //     contentDom.append(createAreaLevelHtml(data,level-0+1,true));
                        // });
                    })
                }
            });
        };
        var defaultData = defaultData || [{id: -1, name: '全国'}, {id: 0, name: '新疆'}];
        console.log('defaultData',defaultData);
        getAreaLevelDefaultData(ele, defaultData, index);
        // ele.find('a[name="close"]').on('click',function(){ele.removeClass('active')});
        ele.children('span').on('click', function () {
            if (!ele.hasClass('active')) {
                ele.addClass('active');
            } else {
                ele.removeClass('active');
            }
        });
    },

    //gis地图位置返写地区联动
    relativeAreaLevel: function (areaid,level,areaNameInsert) {
        var _this = this;
        var dom = $('#areaDrag div[name="areaSubList"] li[codeid="' + areaid + '"]');
        var parmasName = ['province_id=', 'city_id=', 'district_id=', 'substation_id='];
        $('#areaDrag > span').text(areaNameInsert).attr("cityId",areaid);
        if (dom.length > 0) {
            var areaName = dom.text();
            level = dom.attr('level');
            console.log(areaName);
            $('#areaDrag > span').text(areaName).attr("cityId",dom.attr("codeid"));
            app.cityId = dom.attr("codeid");
        } else {
            this.areaid = areaid-0;
            level = (function () {
                var temp = 0;
                if (areaid == 0) {
                    temp = 0
                } else {
                    temp = (areaid + '').length > 6 ? 3 : (areaid + '').length / 2 - 1;
                }
                return temp;
            })(areaid);
            this.arealevel = level;
        }
        // app.loadThreeNetChartData(level);
        // setTimeout(_this.webSocketObj.send(parmasName[level]+areaid),500);
        console.log('webSocketObj',_this.webSocketObj);
        if (_this.webSocketObj.readyState == 1) {
            var aa = $('.unInner');
            aa.scrollTop(1000);
            console.log('parmasName',parmasName[level] + areaid);
            areaid += '';
            if(areaid.length >4) {
                areaid = areaid.substring(0,4);
            }
            _this.webSocketObj.send(parmasName[level] + areaid); //zhangqh: edit gis.js, fix websocket error
        }
        var level = app.getCurrentLevelByCodeLength(areaid)-1;
        var urlParmaStr = '&areaId=' + areaid + '&level=' + level;
        this.getAllLeftDataByDefault(areaid, level);
        this.getAllRightDataByDefault(areaid, level);
        this.getKeyQuotaAndDpiRate(areaid, level);
        // //调用画像得分接口
        this.getKeyPictureScore(areaid, level);
        //调用排名接口
        this.getSortDayPortrayScore(urlParmaStr);
        //调用雷达接口
        this.getTargetRadar(urlParmaStr);

    },

    //创建websocket连接
    createWebSocket: function (areaName) {
        var _this = this;
        if(window.location.href.indexOf("https") > -1){
            var WSS='wss://';
        }else{
            var WSS='ws://';
        }
        var socketUrl = WSS + HOST_PATH + 'com/tydic/xinjiang/mobile_portal_websocket';
        if ("WebSocket" in window) {
            if (_this.webSocketObj != null) {
                _this.webSocketObj.close()
            }
            _this.webSocketObj = new WebSocket(socketUrl);
            _this.webSocketObj.onopen = function () {
                console.log('areaName',areaName);
                _this.webSocketObj.send(areaName);
            };
            // window.setInterval(function(){ //每隔5秒钟发送一次心跳，避免websocket连接因超时而自动断开
            //     var ping = {"type":"ping"};
            //     console.log("发送心跳");
            //     _this.webSocketObj.send(JSON.stringify(ping));
            // },5000);
            _this.webSocketObj.onclose = function (e) {
                console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
                console.log(e)
                console.log("连接已关闭...");
            };
            _this.webSocketObj.onmessage = function (evt) {
                var result = $.parseJSON(evt.data);
               console.log('result',result);
                for (var key in result) {
                    console.log(key)
                    switch (key) {
                        // //画像得分
                        // case 'week_portray_score':
                        //     console.log('1111111zzzz')
                        //     _this.PictureScore(result)
                        //     break;
                        //渲染用户流量数据
                        case 'user_flux':
                            console.log('result[key]',result[key]);
                            _this.renderUserFlux(result[key]);
                            break;
                        //渲染低效资产表
                        case 'low_property':
                            // _this.renderUqwmEfficiency(result[key]);
                            // _this.renderUqwmEfficiencyGauge();
                            break;
                        //渲染资产规模
                        case 'property_scale':
                            _this.renderPropertyScale(result[key]);
                            break;
                        //渲染资源可视化
                        case 'property_visible':
                            // _this.renderVisualization(result[key][0]);
                            break;
                        //渲染存量盘活
                        case 'stock_alive':
                            _this.renderStockAliveList(result[key][0]);
                            break;
                        //渲染增量效益
                        case 'increment_benefit':
                            _this.renderNcrementalBenefit(result[key][0]);
                            break;
                        // 渲染水球图 质差数据
                        case 'oper_efficiency_value':
                            _this.renderLiqiud(result[key], 'socket');
                            if (result[key].parameter_is_alarm == 1) {
                                //渲染底部流程管理报警数据
                                _this.renderBottomManageWarnning2(result[key].parameter_rate);
                            }
                            break;
                        // 运营效率 故障 数据
                        case 'oper_efficiency_breakdown_value':
                            _this.setOperationalEfficiencyBreakdownData(result[key]);
                            break;
                        case 'oper_efficiency_planrate_value':
                            _this.setPlanStationData(result[key]);
                            break;
                            // 运营效率 故障 的上升 下降 数据
                        case 'oper_efficiency_breakdown_change':
                            _this.changeOperationalEfficiencyBreakdownData(result[key]);
                            break;
                        // 运营效率 容量数据
                        case 'oper_efficiency_capacity_value':
                            _this.setOperationalEfficiencyCapacityData(result[key]);
                            break;
                        // 运营效率 质差数据
                        case 'oper_efficiency_parameter_value':
                            _this.setOperationalEfficiencyParameterData(result[key]);
                            break;
                            // 运营效率 响应基站及时率 不包含 上升下降
                        case 'oper_efficiency_responserate_value':
                            _this.responseStationTimeRate(result[key]);
                            break;
                            //容量变动
                        case 'oper_efficiency_capacity_change':
                            _this.changeEfficiencyCapacity(result[key]);
                            break;
                            //质差变动
                        case 'oper_efficiency_parameter_change':
                            _this.changeEfficiencyParameter(result[key]);
                            break;
                        //渲染分组柱状图
                        case 'portal_evaluation':
                            _this.renderPortalEvaluation(result[key]);
                            break;
                        case 'perception_bench_marking_nps':
                            _this.renderNPSprogress(result[key]);
                            break;
                        case 'portal_nps_order':
                            _this.renderNPSLossResolveProgress(result[key]);
                            break;
                        case 'portal_safety':
                            _this.renderGroupSingleRings(result[key].rows[0]);
                            break;
                        // 流程图的指标告警 和 管理告警 生产告警数量
                        case 'flow_manage_alert':
                            _this.renderTopWarnning(result[key]);
                            break;
                        case 'cfg_portal_process':
                            _this.renderBottomManageWarnning(result[key], "socket");
                            break;
                        case 'oper_efficiency_change':
                            _this.renderYYXLChange(result[key]);
                            break;
                        case 'alert_list':
                            _this.renderWarnList(result[key]);
                            break;
                        // 管理告警
                        case 'manage_alert_cnt':
                            _this.renderTopManageWarnning(result[key]);
                            break;
                        // 生成告警
                        case 'production_alert_cnt':
                            _this.renderTopProduceWarnning(result[key]);
                            break;
                        // 五高一地覆盖率
                        case 'five_one_cover_rate':
                            //_this.loadThreeNetChartData(result[key]);
                            break;
                            // 管理告警 top10
                        case 'alarm_top':
                            // _this.loadThreeNetChartData(app.arealevel);
                            // var useDdata = _this.getTop10TableSingleCityData(result[key]);
                            // app.top10TableData = result[key];
                            app.top10TableDataManagement = result[key];
                            if(app.getCurrentShowTop10Type() == "management"){
                                if(result[key].length>0){//如果没有数据 不仅会清除dom 还会清除缓存数据
                                    app.clearTop10TableProduceManagement("management",false);
                                }else{
                                    app.clearTop10TableProduceManagement("management",true);
                                }
                                app.setTop10Table(app.top10TableDataManagement);
                            }
                            break;
                            // 生产告警 top10
                        case 'portal_alarm_top':
                            app.top10TableDataProduce = result[key];
                            console.log(result[key])
                            if(app.getCurrentShowTop10Type() == "produce"){
                                if(result[key].length>0){//如果没有数据 不仅会清除dom 还会清除缓存数据
                                    app.clearTop10TableProduceManagement("produce",false);
                                }else{
                                    app.clearTop10TableProduceManagement("produce",true);
                                }
                                app.setTop10Table(app.top10TableDataProduce);
                            }
                            break;    
                        case 'portal_order_list':
                        // 生产工单
                            mygis.addGISOrder(result[key]);
                            // _this.renderBottomManageWarnning(result[key]);
                            break;
                        case 'manager_order_list':
                                if (app.assemblyShow == "anim") {
                                    var useData = result[key];
                                    _this.renderBottomManageWarnning3(useData);
                                    // var dataLonLat = ExtendUtil.gps84ToGcj02(result[key].lon, result[key].lat);
                                    // useData.lon = dataLonLat.x;
                                    // useData.lat = dataLonLat.y;
                                    mygis.showWarn(useData);
                                    if ($("#changeWorkStyle").text()=="自动"){
                                        return false
                                    }

                                    //关闭画像得分
                                    $("#picDivs").hide();
                                    $("#picContainer,#picContainer3").empty();
                                    if(useData.alarm_level==='初'){return false}
                                    if (app.isToWorkOrderView && useData.manager_order_id) {
                                        setTimeout(function () {
                                            //下钻第一个
                                            app.getWorkOrderListByTipsid("socket", useData.manager_order_id, null,null, useData.alarm_level, function () {
                                                var _this = this;
                                                var listLength = $('#orderList tr').length;
                                                var workId = $('#orderList tr').eq(0).attr('workid');
                                                var orderId = $('#orderList tr').eq(0).attr('orderid').split(',')[0];
                                                if (listLength === 0 || !workId) {
                                                    return false;
                                                }
                                                $('#orderListTitle').text('工单列表').attr('title', '工单列表');
                                                mygis.loadOrder(workId, function (data) {
                                                    app.hideElement(app.assemblyShow, function () {
                                                        app.showElement('order');
                                                        mygis.showGISOrderDetail(data);
                                                    });
                                                    app.pilloverFilters();
                                                    //和 gis工具在一起的 图层控制按钮 取消绑定 图层控制事件  首页所有图层隐藏
                                                    app.indexLayersCloseFn();
                                                    if(useData.alarm_level=='中'){
                                                        setTimeout(function(){
                                                            app.goback();
                                                        },10000);
                                                    }
                                                },orderId);
                                            });
                                        }, 1000);
                                        app.isToWorkOrderView = false;
                                    }
                                }
                            break;
                    }
                }
                // _this.renderUserFlux(result[0]);
            };
            return _this.webSocketObj;
        }
        else {
            alert("您的浏览器不支持 WebSocket，无法获得即时推送数据！");
        }
    },

    renderYYXLChange: function (obj) {
        for (var key in obj) {
            if ($('#liquid span[tstag="' + key + '"]').html()) {
                var cnt = $('#liquid span[tstag="' + key + '"]').html() * 1;
                obj[key] = cnt + obj[key] * 1;
            }
            if (key == 'parameter_rate') {
                var x = $('#liquid_1').next();
                x.find('div[name="liquidChange"]').removeClass('none').addClass('raise');
                x.find('i[name="arrowDirc"]').addClass('fa-long-arrow-up');
            }
            $('#liquid span[tstag="' + key + '"]').text(obj[key]);

            var dValue = obj[key];

            var t1, t2;
            t1 = dValue > 0 ? 'raise' : (dValue < 0 ? 'fall' : 'none');
            t2 = dValue > 0 ? 'fa-long-arrow-up' : 'fa-long-arrow-down';

            var textEle = $('#liquid_1').next();
            textEle.find('span[name="changeNum"]').text(dValue);
            textEle.find('div[name="liquidChange"]').removeClass('raise').removeClass('fall').addClass(t1);
            textEle.find('i[name="arrowDirc"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t2);
        }
    },

    renderWarnList: function (lists) {
        var marqueeHtml = $('#warnListA').text() != '没有新的预警信息' ? $('#warnListA').html() : '';
        for (var n = 0; n < lists.length; n++) {
            var endDate = new Date(lists[n].endTime);
            var endTime = endDate.getTime();
            marqueeHtml += '<span endtime="' + endTime + '">' + lists[n].startTime + ' ' + lists[n].order_id + '_' + lists[n].order_type + '_' + lists[n].source_system + '</span>';
        }
        $('#warnListA').html(marqueeHtml);
    },

    //左侧初始数据加载，所有组件是同一个接口
    getAllLeftDataByDefault: function (codeId, level) {
        //默认是新疆的数据
        var _this = this;
        var urlPath = ['Province/', 'City/', 'District/', 'Substation/'];
        var urlPath2 = ['province', 'city', 'district', 'substation'];
        //new port editor
        //低效产资产
        /*$.getJSON(BACK_SERVER_URL + '/LowPropertyController/queryLowProperty/' + level + "/" + codeId, function (result) {
            // _this.renderUqwmEfficiency(result);
        });*/
        //质差工单
      /*   $.getJSON(BACK_SERVER_URL + '/qureyOperEfficiencyController/qureyOperEfficiency/' + "2/" + level + '/' + codeId, function (result) {
            app.liquidFill('liquid_1', '质差工单', result.rate, result.end_cnt, result.is_alarm);
            app.setAllOperationalEfficiencyData();
        });
        // 容量工单
        $.getJSON(BACK_SERVER_URL + '/qureyOperEfficiencyController/qureyOperEfficiency/' + "1/" + level + '/' + codeId, function (result) {
            app.liquidFill('liquid_0', '容量工单', result.rate, result.end_cnt, result.is_alarm);
            app.setAllOperationalEfficiencyData();

        }); */
        //顶部报警
        // $.getJSON(BACK_SERVER_URL+'/ManageAlertController/queryManageAlert/'+level+"/"+codeId, function(result) {
        //     _this.renderTopManageWarnning(result);
        // });

        //资产可视化，暂无接口
        // _this.renderVisualization();
        //存量盘活，暂无接口  加了一个
        //_this.renderStockAliveList();

        $.getJSON(BACK_SERVER_URL + "CapacityOrderController/getCapacityOrderById?level=" + urlPath2[level] + "&id=" + codeId, function (result) {
            _this.renderStockAliveList(result);
        });

        //增量效率，暂无接口
        // _this.renderNcrementalBenefit();


        // $.getJSON(BACK_SERVER_URL+'queryLowPropertyBy'+urlPath[level]+codeId, function(data) {
        //     var operEfficiency = data.operEfficiency;
        //     var propertyBenefit = data.propertyBenefit;
        //     var warnAlert = data.largeScreenHomePageAlertForPush;
        //     _this.renderLiqiud(operEfficiency);
        //     _this.renderUqwmEfficiency(propertyBenefit.lowPropertyList[0]);
        //     _this.renderVisualization(propertyBenefit.propertyVisibleList[0]);
        //     _this.renderStockAliveList(propertyBenefit.stockAliveList[0]);
        //     _this.renderNcrementalBenefit(propertyBenefit.incrementBenefitList[0]);
        //     _this.renderTopWarnning(warnAlert);
        // });

    },

    //顶部管理告警
    renderTopManageWarnning: function (obj) {
        var result = obj;
        if (!result.cnt) {
            result.cnt = 0
        }
        $('#manageWarn').text(result.cnt);
    },

    //顶部生产告警
    renderTopProduceWarnning: function (obj) {
        var result = obj;
        if (!result.cnt) {
            result.cnt = 0
        }
        $('#produceWarn').text(result.cnt);
    },

    //右侧初始数据加载，各个组件是单独的接口
    getAllRightDataByDefault: function (codeId, level) {
        var _this = this, parmas = {};
        var urlLevelArr = ['province_id', 'city_id', 'district_id', 'substation_id'];
        // var urlParmaStr = 'granularity=3&dateTime='+this.dateStr+'&'+urlLevelArr[level]+'='+codeId;
        var urlParmaStr = 'granularity=3&dateTime=' + '20181215' + '&' + urlLevelArr[level] + '=' + codeId;
        // this.getNPSDataByDefault(urlParmaStr, codeId, level, app);
        // this.getSafetyComplianceByDefault(urlParmaStr, codeId, level, app);
        // this.getUserFluxByDefault(urlParmaStr, codeId, level, app);
        // this.getPortalEvaluationByDefault(urlParmaStr, codeId, level, app);
    },

    //右侧新增关键指标跟重点业务
    getKeyQuotaAndDpiRate: function (codeId, level) {
        // var urlLevelArr= ['provinceId','cityId','districtId','substationId'];
        var urlParmaStr = '&id=' + codeId + '&dataLevel=' + level;
        this.getKeyIndicators(urlParmaStr);
        this.getDpiRate(urlParmaStr);
    },
    //左侧新增画像得分
    getKeyPictureScore: function (codeId, level) {
        // var urlLevelArr= ['provinceId','cityId','districtId','substationId'];
        var urlParmaStr = '&areaId=' + codeId + '&level=' + level;
        this.getPictureScore(urlParmaStr);
    },
    //排名
    getSortDayPortrayScore:function(urlParmaStr,time){
        var urlParmaStr= !time?urlParmaStr:urlParmaStr+'&time='+time;
        $.getJSON(BACK_SERVER_URL+ "portrayController/getSortDayPortrayScore?" + urlParmaStr, function (result) {
            if(result.length!=0){
                //调用画像得分echarts
                var ScoreAhtml=''
                var ScoreBhtml=''
                 for (var i = 0, len = result.length; i < 3; i++) {
                     ScoreAhtml+="<li><div>";
                     ScoreAhtml+=result[i].cityname;
                     ScoreAhtml+="&nbsp;&nbsp;" ;
                     ScoreAhtml+=decimal(result[i].move_score,1)+"</div>";
                     if(result[i].score_rate>1){
                         ScoreAhtml+="<img src=\"resource/image/itemdown-icon.png\"  ></li>"
                     }else if(result[i].score_rate<1){
                         ScoreAhtml+="<img src=\"resource/image/itemup-icon.png\"  ></li>"
                     }else{
                         ScoreAhtml+=""
                     }
                 };
                 for (var i = 3, len = result.length; i < 6; i++) {
                     ScoreBhtml+="<li><div>";
                     ScoreBhtml+= result[i].cityname;
                     ScoreBhtml+="&nbsp;&nbsp; ";
                     ScoreBhtml+=decimal(result[i].move_score,1)+"</div>";
                     if(result[i].score_rate>1){
                         ScoreBhtml+="<img src=\"resource/image/itemdown-icon.png\"  ></li>"
                     }else if(result[i].score_rate<1){
                         ScoreBhtml+="<img src=\"resource/image/itemup-icon.png\"  ></li>"
                     }else{
                         ScoreBhtml+=""
                     }
                 };
//                 _this.PictureScore(result);
//                 _this.renderKeyIndicators(result);
            }else{
                var ScoreAhtml=''
                var ScoreBhtml=''
            }

            $('.ScoreA').html(ScoreAhtml)
            $('.ScoreB').html(ScoreBhtml)
        })
    },
    //雷达图得分
    getTargetRadar: function (urlParmaStr,time) {
        var _this = this;
        // var urlLevelArr= ['provinceId','cityId','districtId','substationId'];
        var urlParmaStr= !time?urlParmaStr:urlParmaStr+'&time='+time;
        $.getJSON(BACK_SERVER_URL+ "portrayController/getTargetRadar?" + urlParmaStr, function (result) {
            //调用画像得分echarts
            // _this.PictureScore(result);
            // _this.renderKeyIndicators(result);
            _this.ScreenIndex(result);
        })
        //this.getPictureScore(urlParmaStr);
    },
    //获取画像得分数据
    getPictureScore: function (urlParma) {
        var _this = this;
        // $.getJSON(BACK_SERVER_URL + 'portrayController/getWeekPortrayScore?' + urlParma, function (result) {
        $.getJSON(BACK_SERVER_URL+ 'portrayController/getWeekPortrayScore?' + urlParma, function (result) {
            console.log("resultresult",result);
            //调用画像得分echarts
            _this.PictureScore(result,urlParma);
           // _this.renderKeyIndicators(result);
        });
    },
    //获取关键指标数据
    getKeyIndicators: function (urlParma) {
        var _this = this;
        $.getJSON(BACK_SERVER_URL + 'KeyIndicatorController/queryKeyIndicators?' + urlParma, function (result) {
            //关键指标
            //这个方法里还没做数据处理，还是默认数据
            _this.renderKeyIndicators(result);
        });
    },

    //获取重点业务指标数据
    getDpiRate: function (urlParma) {
        var _this = this;
        $.getJSON(BACK_SERVER_URL + 'KeyIndicatorController/queryDpiRate?' + urlParma, function (result) {
            //重点业务
            _this.renderDpiRate(result);
        })
    },

    //底部流程管理数据加载
    getBottomFlowManageData: function (codeId, level) {
        this.getFlowManageAlert(codeId, level);
    },

    //单独查询NPS数据
    // getNPSDataByDefault: function (urlParmaStr, codeId, level, obj) {
    //     $.getJSON(BACK_SERVER_URL + 'largeScreen/queryPortalNps?' + urlParmaStr, function (result) {
    //         obj.renderNPSprogress(result[0]);
    //     })
    // },

    //单独查询安全合规数据
    /*getSafetyComplianceByDefault: function (urlParmaStr, codeId, level, obj) {
        $.getJSON(BACK_SERVER_URL + 'largeScreen/queryPortalSafety?' + urlParmaStr, function (result) {
            obj.renderGroupSingleRings(result.rows[0]);
        })
    },*/

    //单独查询用户流量数据
    /*getUserFluxByDefault: function (urlParmaStr, codeId, level, obj) {
        $.getJSON(BACK_SERVER_URL + 'largeScreen/queryPortalUserFlux?' + urlParmaStr, function (result) {
            obj.renderUserFlux(result[0]);
        })
    },*/

    //单独查询下级网络运营执行评估数据
    /*getPortalEvaluationByDefault: function (urlParmaStr, codeId, level, obj) {
        $.getJSON(BACK_SERVER_URL + 'largeScreen/queryPortalEvaluation?' + urlParmaStr, function (result) {
            obj.renderPortalEvaluation(result.rows);
        })
    },*/

    //查询每个大类下流程管理各级包含的指标
    getFlowManageAlert: function (quotaName) {
        var _this = this;
        // var flowManagePortPath = ['flowManageAlertProvince/','flowManageAlertCity/','flowManageAlertDistrict/'];
        $.getJSON(BACK_SERVER_URL + 'largeScreen/queryCfgPortalProcessByBusinessClass?business_class=' + quotaName, function (result) {
            var flowManageOuter = $('#flowStepBox');
            flowManageOuter.find('.presPop').remove();
            _this.scrollIndex = {};
            _this.warnScroll = {};
            // var lists={};
            // for(var i=0;i<result.length;i++){
            //     if(!lists[result[i].first_link_name]){
            //         lists[result[i].first_link_name]={};
            //         lists[result[i].first_link_name].target_names='';
            //         lists[result[i].first_link_name].uu_ids='';
            //     }
            //     lists[result[i].first_link_name].target_names+=(result[i].target_name+',');
            //     lists[result[i].first_link_name].uu_ids+=(result[i].target_id+',');
            // }
            // for(var key in lists){
            //    var quotaName = key;
            //    var pointDom = $('#flowStepBox div[tipsdata="'+key+'"]');
            //     _this.flowAddPop('normal',pointDom,lists[key].target_names.split(','),lists[key].uu_ids.split(','),undefined,quotaName);
            // }
            for (var i = 0; i < result.length; i++) {
                var tipsdata = result[i].first_process;
                var pointDom = flowManageOuter.find('div[tipsdata="' + tipsdata + '"]');
                var tipsDom = pointDom.find('.presPop');
                if (tipsDom.length > 1) {
                    tipsDom.remove();
                }
                _this.flowAddPop('normal', pointDom, result[i].target_names.split(','), result[i].uu_ids.split(','), undefined, quotaName);
            }
        })
    },

    //关闭每个大类下流程管理各级包含的指标
    getFlowManageClear: function () {
        var flowManageOuter = $('#flowStepBox');
        flowManageOuter.find('.presPop').remove();
        flowManageOuter.find('[tipsdata]').removeAttr('tipsref');
    },
    /**
     * 计算管理单号的 数量
     * @param {*} str 
     */
    getManageOrderNumberCount:function(str){
        var strArr = str.split(",");
        return strArr.length + "次";
    },
    /**
     * 查询 从 top10  和 socket(工单涌现) 推送过来的 告警工单数据
     * quotaName 参数 暂无用处
     */
    getWorkOrderListDom: function (tipsType, tipsid, quotaName, result, alarmLevel, callBack) {
        $("#popBox_lowPropertyList").hide(100,function(){
            $("#popBox_lowPropertyList").remove();
        })
        app.popNumber--;
        var _this = this;
        var tbodyHtml = '';
        app.currentView = "workOrder";

        if(result.length<=0){
            app.clearSingleOrderFlowDetails();
        }
        for (var i = 0; i < result.length; i++) {
            // var t1 = result[i].if_alarm ? '已预警' : '未预警';
            var t1 = result[i].manager_order_id == ""||result[i].manager_order_id == "null"||result[i].manager_order_id == undefined || result[i].manager_order_id == null ||result[i].manager_order_id == "undefined"?"未预警":"已预警";
            var t2 = "";
            var orderType = result[i].order_type == undefined || result[i].order_type == null?"":result[i].order_type;
            t2 = result[i].manager_order_id == null || result[i].manager_order_id == "" || result[i].manager_order_id == undefined ? '---' :app.getManageOrderNumberCount(result[i].manager_order_id);


            var relation = result[i].relation && result[i].relation == 1 ? 1 : 0;
            if (relation == 1) {
                tbodyHtml += '<tr class="relative" order-relation="' + relation + '" order_type="' + orderType + '" orderid="' + result[i].manager_order_id + '" workid="' + result[i].order_id + '" workname="' + quotaName + '">' +
                    '<td colspan="3" class="ellipsize-left">' + result[i].order_id + '</td>' +
                    // '<td>'+Math.ceil(result[i].target_value*100)/100+'</td>' +
                    '<td>' + orderType + '</td>' +
                    '<td>' + t1 + '</td>' +
                    // '<td title="'+t2+'">' + t2 + '</td>' +
                    '<td >' + t2 + '</td>' +
                    '</tr>';
            } else {
                tbodyHtml += '<tr order-relation="' + relation + '" order_type="' + orderType + '" orderid="' + result[i].manager_order_id + '" workid="' + result[i].order_id + '" workname="' + quotaName + '">' +
                    '<td colspan="3" class="ellipsize-left">' + result[i].order_id + '</td>' +
                    // '<td>'+Math.ceil(result[i].target_value*100)/100+'</td>' +
                    '<td>' + orderType + '</td>' +
                    '<td>' + t1 + '</td>' +
                    // '<td title="'+t2+'">' + t2 + '</td>' +
                    '<td >' + t2 + '</td>' +
                    '</tr>';
            }
        }
        if (tipsType == "top10" || tipsType == "socket") {//如果是top10点击过来的 和socket 过来的 都是 normal
            var inputTipsType = "normal";
            $('#orderListFilter').attr('uid', tipsid).attr('quota', "top10OrSocket").attr('tipstype', tipsType);
        } else {
            // var inputTipsType = "normal";
            $('#orderListFilter').attr('uid', tipsid).attr('quota', quotaName).attr('tipstype', tipsType);
        }
        $('#orderList').html(tbodyHtml);
        // 选中第一行
        $('#orderList>tr').eq(0).addClass("selected");
        callBack ? callBack() : "";//使用回调

        var tds = $('#orderList').find('td');
        if (_this.orderScrollBar == null) {
            _this.orderScrollBar = new MyScrollBar({
                selId: 'orderListBox',
                hasX: false,
                bgColor: 'transparent',
                barColor: '#0a5080',
                width: 8
            });
        } else {
              _this.orderScrollBar.setSize();
        }

        if (tds.length > 0) {
            tds.parent().off().on('click', function () {
                app.workOrderRowsClick($(this))
                //如果有点击某一行 则 停止工单 轮询
                clearInterval(app.workOrderTimeoutTimmer);
            });
            if (tipsType == "top10" || tipsType == "socket") {
                var forIndex = 0;
                app.workOrderTimeoutTimmer = setInterval(function () {
                    var forDom = $('#orderList>tr').eq(forIndex);
                    if (forDom.length == 1 && forDom.attr("order-relation") == 1) {
                        app.workOrderRowsClick(forDom);

                        // 如果 当前这个 是可以被轮询的  但是下一个不被轮询的 则 判断 级别 是否返回
                    } else if (alarmLevel == "中" && forDom.attr("order-relation") != 1 && forDom.next().attr("order-relation") != 1) {
                        //如果是中级就返回首页
                        app.goback()
                        clearInterval(app.workOrderTimeoutTimmer)
                    } else if (alarmLevel == '高' && forDom.attr("order-relation") != 1) {
                        forIndex = -1;
                    }
                    forIndex++;
                }, 30000);

            }else if(tipsType == ""){
                setTimeout(function(){
                    app.goback();
                },20000);
            }
            app.workOrderRowsClick($('#orderList>tr').eq(0));
            var workId = tds.eq(0).parent().attr('workid');
            var workName = tds.eq(0).parent().attr('workname');
            var orderId = tds.eq(0).parent().attr('orderid');
            var order_type = tds.eq(0).parent().attr('order_type');
            // if(tipsType=='normal'){mygis.showWorkOrder(workId,workName);}
            // if(tipsType=='warn'){mygis.showBadqualityOrder(orderId);}
            // _this.createOrderFlowConfig(workId);
            // if(order_type=='盲点库') {
            //     mygis.moveBlind(workId);
            // } else {
            //     mygis.showBadqualityOrder(workId);
            // }
        }
    },
    clearSingleOrderFlowDetails:function(){
        $('#orderStepBox').createOrderFlow([]);//清空流程图
        $("#order-work-details-box").hide();
        app.showHideTimeAxis(false);
        mygis.clearVectorLayers();
    },
    workOrderRowsClick: function (dom) {
        dom.addClass("selected").siblings().removeClass("selected");
        var workId = dom.attr('workid');
        var workName = dom.attr('workname');
        var orderId = dom.attr('orderid').split(',')[0];
        var order_type = dom.attr('order_type');
        if (this.assemblyShow == 'order') {
            app.clearSingleOrderFlowDetails();
            app.closeOrderEstateInfosPopBlind();
            mygis.loadOrder(workId, function (data) {
                if (app.currentView == "workOrder") {
                    mygis.showGISOrderDetail(data);
                }
            },orderId);
        }

        /* $.ajax({
            url: BACK_SERVER_URL + 'gisController/queryOrderGisInfo',
            method: 'get',
            data: {id: workId},
            success: function (data) {
                if(app.currentView == "workOrder"){
                    mygis.showGISOrderDetail(data);
                }

            }
        }); */
        // if(tipsType=='normal'){mygis.showWorkOrder(workId,workName);}
        // if(tipsType=='warn'){mygis.showBadqualityOrder(orderId);}
        // if(order_type=='盲点库') {
        // 	mygis.moveBlind(workId);
        // } else {
        //     mygis.showBadqualityOrder(workId);
        //
        // }
        $('#popBox_orderListInfos .innerBody').slideUp(100);
        // app.createOrderFlowConfig(workId);
    },
    /**
     * //根据tipsid查询工单列表  这个方法 返回的 true 有可能是 ajax 还没有完成 的 但是 这个函数return true 之后是有操作需要依赖于 ajax 完成之后的
     // tipsType warn normal  top10 socket
     * @param {*} tipsType  warn normal  top10 socket
     * @param {*} tipsid 查询工单的id 指标点击时 是 id  top10 时是 manager_order_list
     * @param {*} quotaName 点击指标 过去时  是 指标的名称 暂无用处
     * @param {*} filterStr  模糊查询时 的查询条件  是 orderId
     * @param {*} callBack  ajax 完成的回调函数
     */
    getWorkOrderListByTipsid: function (tipsType, tipsid, quotaName, filterStr, alarmLevel, callBack,searchdate) {
        var filterParma = '', _this = this;
        var laypage=layui.laypage;
        console.log('tipsType',searchdate);
        if(typeof(searchdate) == "undefined") {
            searchdate = '';
        }
        // if(filterStr){
        //     filterParma = '&order_id='+filterStr;
        // }
        var useLevel = app.getCurrentLevelByCodeLength(app.cityId);
        var url = "";

        // console.log(searchdate)
        if (tipsType == "top10" || tipsType == "socket") {
            filterStr ? filterParma = "&keyWord=" + filterStr : "";
            var participation='?cityId='+app.cityId+'&cityLevel='+useLevel+'&orderId=&targetId=&managerOrderId=' + tipsid + filterParma + searchdate;
            console.log(participation);
            url = 'ManageOrderController/searchManagerOrderByPage?cityId='+app.cityId+'&cityLevel='+useLevel+'&orderId=&targetId=&managerOrderId=' + tipsid + filterParma + searchdate;
        } else if (tipsType == "productionWorkOrder") {
            filterStr ? filterParma = "&keyWord=" + filterStr : "";
            var participation='?cityId='+app.cityId+'&cityLevel='+useLevel+'&targetId=&managerOrderId=&orderId=' + tipsid + filterParma;
            url = 'ManageOrderController/searchManagerOrderByPage?cityId='+app.cityId+'&cityLevel='+useLevel+'&targetId=&managerOrderId=&orderId=' + tipsid + filterParma;
        }else if(tipsType == "top10Produce"){
            filterStr ? filterParma = "&keyWord=" + filterStr : "";
            var participation='?cityId='+app.cityId+'&cityLevel='+useLevel+'&targetId=&orderId=&managerOrderId=' + tipsid + filterParma;
            url = 'ManageOrderController/searchManagerOrderByPage?cityId='+app.cityId+'&cityLevel='+useLevel+'&targetId=&orderId=&managerOrderId=' + tipsid + filterParma;
        }else if(searchdate){
            filterStr ? filterParma = "&keyWord=" + filterStr : "";
            var participation='?cityId='+app.cityId+'&cityLevel='+useLevel+'&targetId=' + tipsid + filterParma+searchdate;
            url = 'ManageOrderController/searchManagerOrderByPage?cityId='+app.cityId+'&cityLevel='+useLevel+'&targetId=' + tipsid + filterParma+searchdate;
        } else {
            filterStr ? filterParma = '&keyWord=' + filterStr : "";
            var participation='?cityId='+app.cityId+'&cityLevel='+useLevel+'&orderId=&managerOrderId=&targetId=' + tipsid + filterParma;
            url = 'ManageOrderController/searchManagerOrderByPage?cityId='+app.cityId+'&cityLevel='+useLevel+'&orderId=&managerOrderId=&targetId=' + tipsid + filterParma;
            if (',10007,10005,10037,10038,10039,10009,10013,10095,10008,'.indexOf(',' + tipsid + ',') == -1) {
                // alert('该类指标正在努力开发中。。。');
                return false;
            }
        }
        $('.exportorder').attr('participation',participation)
        // $.getJSON(BACK_SERVER_URL + url, function (result) {
        //     result<=0?app.top10TableIsClick = false:"";//如果结果为空则 又可以点击
        //     app.getWorkOrderListDom(tipsType, tipsid, quotaName, result, alarmLevel, callBack);
        // })
        $.ajax({
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            type: "GET",
            async: true,
            timeout : 200000,
            url: BACK_SERVER_URL+url+'&pageSize='+15+'&currentPage='+0,
            dataType: "json",
            success: function(data) {
                $(".wraps").hide();
                var total=data.total;
                laypage.render({
                    elem: 'page_container',
                    count: total/15+1,
                    first: '首页',
                    last: '尾页',
                    prev: '<em>< </em>',
                    next: '<em>> </em>',
                    jump:function (obj,first) {
                        nowpages=obj.curr;
                        $(".wraps").attr("pages",""+nowpages+"");
                    }
                });
                // quotaName=data.data.titile
                app.levelNums=2
                if(tipsType=="socket"||tipsType=="top10"){
                    app.getWorkOrderListDom(tipsType, tipsid, quotaName, data.rows, alarmLevel, callBack)
                }else{
                    app.getWorkOrderListDom(tipsType, tipsid, quotaName, data.rows, alarmLevel, callBack);
                }

            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    alert("查询超时");
                    $(".wraps").hide();
                }
            },
            error: function(jqXHR) {
            }
        });
        $("#page_container").click(function () {
            $(".wraps").show()
        setTimeout(function () {
            var filterInput = $('#orderListFilter');
            var uid = Number(filterInput.attr('uid'));
            var tipsType= filterInput.attr('tipstype');
            var pages= $(".wraps").attr("pages")-1;
            console.log(uid)
            $.ajax({
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                type: "GET",
                async: true,
                timeout : 20000,
                url:BACK_SERVER_URL+url+'&pageSize='+15+'&currentPage='+pages,
                dataType: "json",
                success: function(data) {
                    $(".wraps").hide();
                    app.levelNums=2
            app.getWorkOrderListDom(tipsType, tipsid, quotaName, data.rows, alarmLevel, callBack);
            // app.getWorkOrderListDom(tipsType, uid, quotaName, data, null, null);
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                    if(status=='timeout'){//超时,status还有success,error等值的情况
                        alert("查询超时");
                        $(".wraps").hide();

                    }
                },
                error: function(jqXHR) {
                }
            });
        },200)
    })
        return true;
    },
    /**
     * 点击定位点 定位工单
     * @param {*} productionId
     */
    productionWorkOrderGetOrderList: function (productionId,productionWorkOrder) {
        productionWorkOrder?productionWorkOrder=productionWorkOrder:productionWorkOrder = "productionWorkOrder";
        app.getWorkOrderListByTipsid(productionWorkOrder, productionId, "", "", "", app.getWorkOrderListCallBack);
    },
    /**
     * 渲染 工单视图工单列表之后的 回调函数
     */
    getWorkOrderListCallBack: function () {
        var _this = this;
        var listLength = $('#orderList tr').length;
        var workId = $('#orderList tr').eq(0).attr('workid');
        var orderId = $('#orderList tr').eq(0).attr('orderid');
        orderId = orderId?orderId.split(',')[0]:"";
        if (listLength === 0 || !workId) {
            return false;
        }
        $('#orderListTitle').text('工单列表').attr('title', '工单列表');
            mygis.loadOrder(workId, function (data) {
            app.hideElement(app.assemblyShow, function () {
                app.showElement('order');
                mygis.showGISOrderDetail(data);
            });
            app.pilloverFilters();
            //和 gis工具在一起的 图层控制按钮 取消绑定 图层控制事件  首页所有图层隐藏
            app.indexLayersCloseFn();
            app.top10TableIsClick = true;
        },orderId);
        /* $.ajax({
            url: BACK_SERVER_URL + 'gisController/queryOrderGisInfo',
            method: 'get',
            data: {id: workId},
            success: function (data) {
                // mygis.showWarn(data);
                app.hideElement(app.assemblyShow,function(){
                    app.showElement('order');
                    mygis.showGISOrderDetail(data);
                });
                app.pilloverFilters();
                //和 gis工具在一起的 图层控制按钮 取消绑定 图层控制事件  首页所有图层隐藏
                app.indexLayersCloseFn();

            }
        }); */
    },
    /**
     * 流程补全函数
     * @param {*} data
     */
    /* flowChartDataSupplement: function (data,orderId) {
        for(var i=0,len=data.length;i<len;i++){
            if(data[i].title.indexOf("回单") != -1){
                data[i]["sop"] = "在3小时内回单";
            }
        }
        if(orderId == 2019010282){
            return app.flowChartDataSupplementA(data);
        }
        
        data.unshift({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "电子运维",
            type_code: "",
            type_name: "电子运维",
            processTime: "",
            useTime: "",
            sop: ""
        });
        var flowData1 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待派单",
            type_code: "",
            type_name: "派单"
        };
        var flowData2 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待接单",
            type_code: "",
            type_name: "接单"
        };
        var flowData3 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待回单",
            type_code: "",
            type_name: "回单"
        };
        var flowData4 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待验证",
            type_code: "",
            type_name: "验证"
        };
        // 流程图补全
        var lastConfig = [{
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "CEM系统",
            title: "盲点库",
            type_code: "",
            type_name: "盲点"
        }];
        if (data[data.length - 1].title == '待派单' || data[data.length - 1].title == '已派单') {
            data.push(flowData2);
        } else if (data[data.length - 1].title == '待接单' || data[data.length - 1].title == '已接单') {
            data.push(flowData3);
        } else if (data[data.length - 1].title == '待回单' || data[data.length - 1].title == '已回单') {
            data.push(flowData4);
        }
        if (data[data.length - 1].title == '待派单' || data[data.length - 1].title == '已派单') {
            data.push(flowData2);
        } else if (data[data.length - 1].title == '待接单' || data[data.length - 1].title == '已接单') {
            data.push(flowData3);
        } else if (data[data.length - 1].title == '待回单' || data[data.length - 1].title == '已回单') {
            data.push(flowData4);
        }
        if (data[data.length - 1].title == '待派单' || data[data.length - 1].title == '已派单') {
            data.push(flowData2);
        } else if (data[data.length - 1].title == '待接单' || data[data.length - 1].title == '已接单') {
            data.push(flowData3);
        } else if (data[data.length - 1].title == '待回单' || data[data.length - 1].title == '已回单') {
            data.push(flowData4);
        }
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "盲点库",
            type_code: "",
            type_name: "盲点",
            processTime: "",
            useTime: "",
            sop: ""
        });
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "盲点分配项目经理",
            title: "站址库",
            type_code: "",
            type_name: "站址",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "需求审核",
            type_code: "",
            type_name: "需求审核",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "设计补录",
            type_code: "",
            type_name: "设计补录",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "储备库审核",
            type_code: "",
            type_name: "储备库审核",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "规划确认",
            type_code: "",
            type_name: "规划确认",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "专业委托",
            type_code: "",
            type_name: "专业委托",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "三方委托",
            type_code: "",
            type_name: "三方委托",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "立项",
            type_code: "",
            type_name: "立项",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "单站设计",
            type_code: "",
            type_name: "单站设计",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "开工申请",
            type_code: "",
            type_name: "开工申请",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "领料申请",
            type_code: "",
            type_name: "领料申请",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "领料",
            type_code: "",
            type_name: "领料",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "现场施工",
            type_code: "",
            type_name: "现场施工",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "开通-基站开通",
            type_code: "",
            type_name: "开通-基站开通",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "验收-工艺验收",
            type_code: "",
            type_name: "验收-工艺验收",
            processTime:"",
            useTime:"",
            sop:""
        })
        data.push({
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "后评估",
            type_code: "",
            type_name: "后评估",
            processTime:"",
            useTime:"",
            sop:""
        });
        
        return data;
    }, */
    /**
     * 将格式化的 时间转化为 毫秒数
     * @param {*} timeStr 
     */
    formatterTimeToMillisecond:function(timeStr){
        var useStrAfter  = timeStr.replace(/\//g,"-").replace(/:/g,"-").replace(" ","-").split("-");
        var afterDate = new Date(useStrAfter[0],useStrAfter[1]-1,useStrAfter[2],useStrAfter[3],useStrAfter[4],useStrAfter[5]);
        return afterDate.getTime();
    },
    /**
     * 计算流程历时
     * @param {*} strAfter  前面的流程 时间
     * @param {*} strCurrent  后面的流程时间
     */
    calculationCurrentUseTime:function(strAfter,strCurrent){
        var symbol = "-";
        // var useStrAfter  = strAfter.replace(/\//g,"-").replace(/:/g,"-").replace(" ","-").split("-");
        // var useStrCurrent = strCurrent.replace(/\//g,"-").replace(/:/g,"-").replace(" ","-").split("-");
        //2018/5/16  19:09:24
        // var afterDate = new Date(useStrAfter[0],useStrAfter[1]-1,useStrAfter[2],useStrAfter[3],useStrAfter[4],useStrAfter[5]);
        // var currentDate = new Date(useStrCurrent[0],useStrCurrent[1]-1,useStrCurrent[2],useStrCurrent[3],useStrCurrent[4],useStrCurrent[5]);
        
        // var useTime = currentDate.getTime() - afterDate.getTime();
        var useTime = app.formatterTimeToMillisecond(strCurrent) - app.formatterTimeToMillisecond(strAfter);
        var useTimeHour = app.calculationOrderWorkTime(useTime);
        return useTimeHour;
        
    },
    /**
     * 计算当前流程用时  
     * @param {*} time 
     */
    calculationOrderWorkTime:function(time){
        var day = 1000*60*60*24;
        var hour = 1000*60*60;
        var minute = 1000*60;
        var second = 1000;
        var useTime = 0;
        var useTimeHourStr = "";
        var unit= "";
        var useTimeObj = {
            time:"",
            unit:"",
            useTimeStr:""
        };
        if(time != 0){
            if(time%day>=0 && time%day != time){//天
                useTime = time/day ;
                unit = "天";
            }else if(time%day == time && time%hour>=0 && time%hour != time){//小时
                useTime = time/hour;
                unit = "小时";
            }else if(time%day == time && time%hour == time && time%minute>=0 && time%minute != time){//分钟
                useTime = time/minute;
                unit = "分钟";
            }else if(time%day == time && time%hour == time && time%minute == time && time%second>=0 && time%second != time){
                useTime = time/second;
                unit = "秒";
            }else{
                useTime = "";
            };
    
            if(useTime == "" || isNaN(useTime)){
                useTimeHourStr = "";
            }else{
                if((useTime+"").indexOf(".") == -1){
                    useTimeHourStr  = useTime;
                }else{
                    var dianIndex = (useTime+"").indexOf(".");
                    useTimeHourStr = (useTime+"").substring(0,dianIndex+2);
                }
                
            }
            if(isNaN(useTimeHourStr) || useTimeHourStr == ""){
                useTimeHourStr = "";
                useTimeObj.time = "";
                useTimeObj.useTimeStr = "";
            }else if(useTimeHourStr - 0 == 0){
                useTimeHourStr = 0;
                useTimeObj.time = 0;
                useTimeObj.useTimeStr = 0;
            }else{
                useTimeHourStr = useTimeHourStr;
                useTimeObj.useTimeStr = useTimeHourStr + unit;
                useTimeObj.time = useTimeHourStr;
                useTimeObj.unit = unit;
            }
        }else{
            useTimeHourStr = "0";
            useTimeObj.time = "0";
            useTimeObj.useTimeStr = "0";
        }
       

        return useTimeObj;
    },
    /**
     * 补 全流程
     * @param {*} data 
     */
    /* flowChartDataSupplementA:function(data){
        data.unshift({
            create_name: "董环",
            create_time: "已完成",
            id: 0,
            proc_content: "",
            title: "电子运维",
            type_code: "",
            type_name: "电子运维",
            processTime:"",
            useTime:"",
            sop:""
        });
        var flowData1 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待派单",
            type_code: "",
            type_name: "派单"
        };
        var flowData2 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待接单",
            type_code: "",
            type_name: "接单"
        };
        var flowData3 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待回单",
            type_code: "",
            type_name: "回单"
        };
        var flowData4 = {
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "",
            title: "待验证",
            type_code: "",
            type_name: "验证"
        };
        // 流程图补全 
        var lastConfig = [{
            create_name: "",
            create_time: "",
            id: 0,
            proc_content: "CEM系统",
            title: "盲点库",
            type_code: "",
            type_name: "盲点"
        }];
        if(data[data.length-1].title == '待派单' || data[data.length-1].title == '已派单'){
            data.push(flowData2);
        }else if(data[data.length-1].title == '待接单' || data[data.length-1].title == '已接单'){
            data.push(flowData3);
        }else if(data[data.length-1].title == '待回单' || data[data.length-1].title == '已回单'){
            data.push(flowData4);
        }
        if(data[data.length-1].title == '待派单' || data[data.length-1].title == '已派单'){
            data.push(flowData2);
        }else if(data[data.length-1].title == '待接单' || data[data.length-1].title == '已接单'){
            data.push(flowData3);
        }else if(data[data.length-1].title == '待回单' || data[data.length-1].title == '已回单'){
            data.push(flowData4);
        }
        if(data[data.length-1].title == '待派单' || data[data.length-1].title == '已派单'){
            data.push(flowData2);
        }else if(data[data.length-1].title == '待接单' || data[data.length-1].title == '已接单'){
            data.push(flowData3);
        }else if(data[data.length-1].title == '待回单' || data[data.length-1].title == '已回单'){
            data.push(flowData4);
        }
        data.push({
            create_name: "董环",
            create_time: "2019/1/3  08:10:22",
            id: 0,
            proc_content: "已完成",
            title: "盲点库",
            type_code: "",
            type_name: "盲点",
            processTime:"2019/1/3  08:10:22",
            useTime:"",
            sop:""
        });
        data.push({
            create_name: "董环",
            create_time: "2019/1/4  10:30:21",
            id: 0,
            proc_content: "已完成",
            title: "站址库",
            type_code: "",
            type_name: "站址",
            processTime: "2019/1/4  10:30:21",
            useTime: "",
            sop: ""
        })
        data.push({
            create_name: "何锐-13369631962",
            create_time: "2019/1/4  12:11:21",
            id: 0,
            proc_content: "已完成",
            title: "需求审核",
            type_code: "",
            type_name: "需求审核",
            processTime: "0.5天",
            useTime: "",
            sop: "在0.5天内完成"
        })
        data.push({
            create_name: "潘玉",
            create_time: "2019/1/4  19:09:00",
            id: 0,
            proc_content: "已完成",
            title: "设计补录",
            type_code: "",
            type_name: "设计补录",
            processTime: "0.5天",
            useTime: "",
            sop: "在0.5天内完成"
        })
        data.push({
            create_name: "何锐-13369631962",
            create_time: "2019/1/4  19:12:00",
            id: 0,
            proc_content: "已完成",
            title: "储备库审核",
            type_code: "",
            type_name: "储备库审核",
            processTime: "1天",
            useTime: "",
            sop: "在1天内完成"
        })
        data.push({
            create_name: "何锐-13369631962",
            create_time: "2019/1/4  19:26:00",
            id: 0,
            proc_content: "已完成",
            title: "规划确认",
            type_code: "",
            type_name: "规划确认",
            processTime: "0.5天",
            useTime: "",
            sop: "在0.5天内完成"
        })
        data.push({
            create_name: " 何锐-13369631962",
            create_time: "2019/1/4  19:56:00",
            id: 0,
            proc_content: "已完成",
            title: "专业委托",
            type_code: "",
            type_name: "专业委托",
            processTime: "1天",
            useTime: "",
            sop: "在1天内完成"
        })
        data.push({
            create_name: "何锐-13369631962",
            create_time: "2019/1/4  19:58:00",
            id: 0,
            proc_content: "已完成",
            title: "三方委托",
            type_code: "",
            type_name: "三方委托",
            processTime: "1天",
            useTime: "",
            sop: "在1天内完成"
        })
        data.push({
            create_name: "何锐-13369631962",
            create_time: "2019/1/4  20:18:00",
            id: 0,
            proc_content: "已完成",
            title: "立项",
            type_code: "",
            type_name: "立项",
            processTime: "1天",
            useTime: "",
            sop: "在1天内完成"
        })
        data.push({
            create_name: "潘玉-15909910373",
            create_time: "2019/1/5  16:54:00",
            id: 0,
            proc_content: "已完成",
            title: "单站设计",
            type_code: "",
            type_name: "单站设计",
            processTime: "2天",
            useTime: "",
            sop: "在2天内完成"
        })
        data.push({
            create_name: "林野-18199292666",
            create_time: "2019/1/12  23:59:00",
            id: 0,
            proc_content: "已完成",
            title: "开工申请",
            type_code: "",
            type_name: "开工申请",
            processTime: "0.5天",
            useTime: "",
            sop: "在0.5天内完成"
        })
        data.push({
            create_name: "CEM系统",
            create_time: "2019/1/14  12:19:00",
            id: 0,
            proc_content: "已完成",
            title: "领料申请",
            type_code: "",
            type_name: "领料申请",
            processTime: "",
            useTime: "",
            sop: ""
        })
        data.push({
            create_name: "供应链系统",
            create_time: "2019/1/22  14:11:00",
            id: 0,
            proc_content: "已完成",
            title: "领料",
            type_code: "",
            type_name: "领料",
            processTime: "",
            useTime: "",
            sop: ""
        })
        data.push({
            create_name: "CEM系统",
            create_time: "2019/2/3  12:21:00",
            id: 0,
            proc_content: "已完成",
            title: "现场施工",
            type_code: "",
            type_name: "现场施工",
            processTime: "5天",
            useTime: "",
            sop: ""
        })
        data.push({
            create_name: "CEM系统",
            create_time: "2019/2/22  11:01:00",
            id: 0,
            proc_content: "已完成",
            title: "开通-基站开通",
            type_code: "",
            type_name: "开通-基站开通",
            processTime: "2天",
            useTime: "",
            sop: "在2天内完成"
        })
        data.push({
            create_name: "CEM系统",
            create_time: "2019/2/24  12:10:00",
            id: 0,
            proc_content: "已完成",
            title: "验收-工艺验收",
            type_code: "",
            type_name: "验收-工艺验收",
            processTime: "",
            useTime: "",
            sop: ""
        })
        data.push({
            create_name: "CEM系统",
            create_time: "2019/2/23  12:10:00",
            id: 0,
            proc_content: "已完成",
            title: "后评估",
            type_code: "",
            type_name: "后评估",
            processTime: "",
            useTime: "",
            sop: ""
        });
        for(var i=0,len=data.length;i<len;i++){
            if(i>0){
                if(data[i].create_time && data[i-1].create_time){//当前时间或者 前一个流程的时间为空 的 则 当前流程时限为空
                    data[i]["useTime"] = app.calculationCurrentUseTime(data[i-1].create_time,data[i].create_time);
                }else{
                    data[i]["useTime"] = "";
                }
            }
        }
        for(var j=0,lenJ=data.length;j<lenJ;j++){
            if(data[j]["processTime"]!="" && data[j]['useTime']!=""){
                var processTime = data[j]["processTime"].replace("天","");
                var useTime = data[j]["useTime"];
                if(useTime>processTime){
                    data[j]["flowStatus"] = "warn";
                }
            }
        }
        return data;
    }, */
    /**
     * 处理单个流程的样式 如 异常 添加 历时
     * @param {*} sourceData 
     */
    processOrderFlowSingleException:function(sourceData){
        for(var k=0,lenK=sourceData.length;k<lenK;k++){
            sourceData[k]["processTime"] = "";
            sourceData[k]["useTime"] = "";
            // sourceData[k]["sop"] = "";
            sourceData[k]["useTimeNumber"] = "";
            // 如果 这个流程中 是存的 文件类型的json数据 则 不展示
            // if(sourceData[k].proc_content.indexOf("files")!= -1 && sourceData[k].proc_content.indexOf("filename")!= -1){
            //     sourceData[k].proc_content = "";
            // }
        }
        for(var i=0,len=sourceData.length;i<len;i++){
            if(i>0){
                if(sourceData[i].create_time && sourceData[i-1].create_time){//当前时间或者 前一个流程的时间为空 的 则 当前流程时限为空
                    var useTimeObj = "";
                    
                    useTimeObj = app.calculationCurrentUseTime(sourceData[i-1].create_time,sourceData[i].create_time);
                    sourceData[i]["useTime"] = useTimeObj.useTimeStr;
                    sourceData[i]["useTimeNumber"] = useTimeObj.time;
                    
                }else{
                    var useTimeObj = "";
                    if(i == sourceData.length-1 && sourceData[i].create_time == ""){//如果是最后一条并且没有操作时间 则 吧当前时间取为操作时间来计算 历时 和是否预警
                        var currentSystemTime = new Date();
                        useTimeObj = app.calculationCurrentUseTime(sourceData[i-1].create_time,currentSystemTime.format("yyyy-MM-dd HH:mm:ss"));
                    }
                    sourceData[i]["useTime"] = useTimeObj==""?"":useTimeObj.useTimeStr;
                    sourceData[i]["useTimeNumber"] = useTimeObj == ""?"":useTimeObj.time;
                }
            } else {
                sourceData[i]["useTime"] = '实时';
                sourceData[i]["useTimeNumber"] = '0';
            }
            // sourceData[i]["sop"] = sourceData[i]["sop"]?sourceData[i]["sop"]:"";
        }
        for(var j=0,lenJ=sourceData.length;j<lenJ;j++){
            if (j==0) {
                continue;
            }
            if(sourceData[j]["processTime"]!="" && sourceData[j]['useTimeNumber']!=""&& sourceData[j]['useTime']!=""){
                var processTime = sourceData[j]["processTime"].replace("天","");
                var useTime = sourceData[j]["useTime"];
                if(useTime>processTime){
                    sourceData[j]["flowStatus"] = "warn";
                }
            }
        };
        return sourceData;
    },
    /**
     * 将 时间转换 
     * @param {*} sourceTime 
     */
    sourceTimeToMillisecond:function(sourceTime){
        var waitProcessTime = sourceTime.replace("小时","").replace("天","").replace("分钟","");
        waitProcessTime = waitProcessTime - 0;
        var day = 1000*60*60*24;
        var hour = 1000*60*60;
        var minute = 1000*60;
        var second = 1000;
        var timeMIllisecond = 0;
        if(app.getSingleFlowSourceUnit(sourceTime) == "小时"){
            timeMIllisecond = waitProcessTime * hour;
        }else if(app.getSingleFlowSourceUnit(sourceTime) == "天"){
            timeMIllisecond = waitProcessTime * day;
        }else if(app.getSingleFlowSourceUnit(sourceTime) == "分钟"){
            timeMIllisecond = waitProcessTime * minute;
        }else if(app.getSingleFlowSourceUnit(sourceTime) == "秒"){
            timeMIllisecond = waitProcessTime * second;
        };
        return timeMIllisecond;
    },
    /**
     * 判断当前流程 是否需要预警
     * @param {*} processTime 
     * @param {*} useTime 
     */
    judeCurrentFlowIsWarn:function(processTime,useTime){
        var processMillisecond = app.sourceTimeToMillisecond(processTime);
        var useTimeMillisecond = app.sourceTimeToMillisecond(useTime);
       if(processTime != "" && useTime != "" ){
        if(useTimeMillisecond >= processMillisecond * 1){
            return "warn";
        }else{
            return "";
        }
       }else{
           return "";
       }
    },
    /**
     * 保留一位小数
     * @param {*} useTime 
     */
    keepOneDecimal:function(useTime){
        var dianIndex = (useTime+"").indexOf(".");
        var useTimeHourStr = (useTime+"").substring(0,dianIndex+2);
        return useTimeHourStr;
    },
    getSingleFlowSourceUnit:function(sourceUnit){
        if(sourceUnit.indexOf("小时") != -1){
            return "小时";
        }else if(sourceUnit.indexOf("天") != -1){
            return "天";
        }else if(sourceUnit.indexOf("分钟") != -1){
            return "分钟";
        }else if(sourceUnit.indexOf("秒") != -1){
            return "秒";
        }
    },
    
    /**
     * 加载所有流程的 历时 sop 
     */
    getOrderFlowSopInfo:function(){
        $.ajax({
            url:BACK_SERVER_URL+"/gisController/queryProcessDescribe",
            method:"get",
            success:function(data){
            }
        })
    },
    /**
     * 获取单个 流程的sop数据
     * @param {*} flowName 
     */
    getSingleFlowSop:function(flowName){
        if(app.orderWorkAllFlowData[flowName]){
            return app.orderWorkAllFlowData[flowName];
        }else{
            return null;
        }
    },
    /**
     * 如果第一个是派单 则在前面补 问题发现 和 故障判断的 流程
     * @param {*} sourceData 
     */
    completionOrderBefor:function(sourceData){
        var retrunData = [];
        for(var i=0,len=sourceData.length;i<len;i++){
            if(app.nullStringToline(sourceData[i].create_time,"") !="" &&sourceData[i].create_time.indexOf(".") != -1){//操作时间祛除小数点
                sourceData[i].create_time = sourceData[i].create_time.split(".")[0];
            }
            sourceData[i].sop = (sourceData[i].sop+"").replace(/<strong>|<\/strong>/g,"").replace(/<[^>]*>|<\/[^>]*>/gm,"");
            sourceData[i].proc_content = (sourceData[i].proc_content+"").replace(/<strong>|<\/strong>/g,"").replace(/<[^>]*>|<\/[^>]*>/gm,"");

        }
        // if(sourceData[sourceData.length-1].title != "结单" || sourceData[sourceData.length-1].title != "待结单"  || sourceData[sourceData.length-1].title != "已结单"){//如果最后一个不是结单 就补充下一个流程
        //     sourceData.push({
        //         create_name: "——",
        //         create_time: "——",
        //         id: 0,
        //         proc_content: "——",
        //         processTime: "——",
        //         sop: "——",
        //         time_limit: "——",
        //         title: sourceData[sourceData.length-1].title,
        //         type_code: "——",
        //         type_name: sourceData[sourceData.length-1].title,
        //         useTime: "——",
        //         useTimeNumber: "——"
        //     })
        // }
        if(sourceData[0].title == "派单" || sourceData[0].title == "已派单" || sourceData[0].title == "待派单"){
            var firstFlowCreateTime = "";
            var problemFindingUseTime = "";
            var faultJudgmentUseTime = "";
            if(app.nullStringToline(sourceData[0].create_time,"") != ""){
                firstFlowCreateTime = app.formatterTimeToMillisecond(sourceData[0].create_time); 
                problemFindingUseTime = (new Date(firstFlowCreateTime-6000)).format("yyyy-MM-dd HH:mm:ss");
                faultJudgmentUseTime = (new Date(firstFlowCreateTime-3000)).format("yyyy-MM-dd HH:mm:ss");
            }else{
                problemFindingUseTime = "";
                faultJudgmentUseTime = "";
            }
            var obj1 = {
                create_name: "CEM系统",
                create_time: problemFindingUseTime,
                id: 0,
                proc_content: "系统自动发现问题",
                processTime: "",
                sop: "",
                time_limit: "1分钟",
                title: "问题发现",
                type_code: "",
                type_name: "问题发现",
                useTime: "",
                useTimeNumber: ""
            }
            var obj2 = {
                create_name: "CEM系统",
                create_time: faultJudgmentUseTime,
                id: 1,
                proc_content: "无故障",
                processTime: "",
                sop: "",
                time_limit: "1分钟",
                title: "故障判断",
                type_code: "",
                type_name: "故障判断",
                useTime: "",
                useTimeNumber: ""
            }
            // sourceData.unshift(obj2); //updata by wangjue 20190304
            sourceData.unshift(obj1);
            retrunData = sourceData;
        }else{
            retrunData = sourceData;
        }
        // 如果最后一个是 派单 流程则补充一个回单的流程 操作人是前一个操作人 历时按照原来的方式由最后一个 当前时间减去前一个流程的时间
        if(retrunData[retrunData.length-1].title == "派单" || retrunData[retrunData.length-1].title == "待派单" || retrunData[retrunData.length-1].title == "已派单"){
            var beforFlowOpWomenName = "";
            if(retrunData[retrunData.length-1].proc_content.indexOf(":") != -1){
                beforFlowOpWomenName = retrunData[retrunData.length-1].proc_content.split(":")[1];
            }
            if(retrunData[retrunData.length-1].proc_content.indexOf("：") != -1){
                beforFlowOpWomenName = retrunData[retrunData.length-1].proc_content.split("：")[1];
            }
            retrunData.push({
                create_name: beforFlowOpWomenName,
                create_time: "",
                id: 1,
                proc_content: "——",
                processTime: "",
                sop: "",
                time_limit: "4小时",
                title: "回单",
                type_code: "",
                type_name: "回单",
                useTime: "",
                useTimeNumber: ""
            })
        };
        return retrunData;
    },
    //根据工单查询工单流程并生成createOrderFlow使用的config
    createOrderFlowConfig: function (data) {
        console.log(data)
        $.getJSON(BACK_SERVER_URL + 'gisController/queryOrderFlow?id=' + data.order_code+"&orderType="+data.order_type, function (result) {

            if (result.length == 0) {
                return false;
            }
            if (result[0].id == -1) {
                var temp = result.shift();
                result.push(temp);
            }
            var config = [];
            // var useData = app.flowChartDataSupplement(result,orderId);
            var useData = app.completionOrderBefor(result);
            // useData[useData.length-1].create_time = "";
            // useData[useData.length-1].time_limit = "300天";
            useData = app.processOrderFlowSingleException(useData);
            for (var i = 0; i < useData.length; i++) {
                var icoUrl = './../../plugins/orderFlows/resource/ico_1.png';
                var status = useData[i].flowStatus;
                var sopInfo = app.getSingleFlowSop(useData[i].title);
                
                if(useData[i].useTime&&useData[i].time_limit&&useData[i].time_limit != "" && useData[i].useTime != "" && useData[i].time_limit != "——"){
                    status = app.judeCurrentFlowIsWarn(useData[i].time_limit,useData[i].useTime); 
                }else{
                    status = "";
                }//判断当前节点是否预警 如果 处理时间大于 时限的80% 就标红
                if(i==0){//第一个节点不标红
                    status = "";
                }
                // status = useData[i].id == -1 ? 'underway' : 'finish';
                 icoUrl = './../../plugins/orderFlows/resource/ico_1.png';
                if (useData[i].type_name == '结单' && useData[i].proc_content.indexOf('未通过') != -1) {
                    // useData[i].type_name = "结单";
                    status = 'warn';
                    icoUrl = './../../plugins/orderFlows/resource/error.png'
                }
                
                var item = {
                    order_type:data.order_type,
                    flowStatus: status,
                    flowStatusName: app.nullStringToline(useData[i].title),
                    flowIco: icoUrl,
                    flowName: app.nullStringToline(useData[i].type_name),
                    flowPeople: app.nullStringToline(useData[i].create_name),
                    flowTime: app.nullStringToline(useData[i].create_time),
                    proc_type_code:app.nullStringToline(useData[i].proc_type_code),
                    flowInfo: app.nullStringToline(useData[i].proc_content||'无'),
                    processTime:app.nullStringToline(useData[i].time_limit),
                    useTime:app.nullStringToline(useData[i].useTime),
                    sop:useData[i].sop

                }
                config.push(item);
            }
            $('#orderStepBox').createOrderFlow(config,data.order_code);
        });
    },
    nullStringToline:function(str,symbol){
        if(str == 'undefined' || str == 'null' || str == undefined || str == null || str == ""){
            return symbol?symbol:"——";
        }else{
            return str;
        }
    },
    //渲染关键指标
    renderKeyIndicators: function (list) {
        if (!list || list.length == 0) {
            return false;
        }
        this.lineAndBars(list, function (inst) {
            $('#quotaDesc li').off().on('click', function () {
                var labelName = $(this).text();
                $(this).toggleClass('unSelect');
                inst.dispatchAction({
                    type: 'legendToggleSelect',
                    name: labelName
                })
            });
        })
    },

    //渲染重点业务
    renderDpiRate: function (obj) {
        if (!obj) {
            obj = {web_good_rate: 0, video_good_rate: 0, sms_send_succ_rate: 0, game_ask_good_rate: 0}
        }
        this.fourBar(obj);
    },

    //渲染顶部即时报警数据
    renderTopWarnning: function (obj) {
        var marqueeHtml;
        for (var i = 0; i < obj.alertofManage_Produce.length; i++) {
            if (obj.alertofManage_Produce[i].fuction_class == '管理类') {
                $('#manageWarn').text('管理报警 ' + obj.alertofManage_Produce[i].sum + ' 次');
            } else {
                $('#produceWarn').text('生产报警 ' + obj.alertofManage_Produce[i].sum + ' 次');
            }
        }
        if (obj.alertlists && obj.alertlists.length > 0) {
            marqueeHtml = $('#warnListA').text() != '没有新的预警信息' ? $('#warnListA').html() : '';
            if (obj.alertlists[0].alertInfo === '') {
                marqueeHtml = '没有新的预警信息';
            } else {
                for (var n = 0; n < obj.alertlists.length; n++) {
                    var endDate = new Date(obj.alertlists[n].endTime);
                    var endTime = endDate.getTime();
                    marqueeHtml += '<span endtime="' + endTime + '">' + obj.alertlists[n].startTime + ' ' + obj.alertlists[n].alertInfo + '</span>';
                }
            }
        } else {
            marqueeHtml = '没有新的预警信息';
        }
        $('#warnListA').html(marqueeHtml);
    },

    //渲染底部流程管理工单报警数据
    renderBottomManageWarnning3: function (result, isSocket) {
        var flowManageOuter = $('#flowStepBox');
        flowManageOuter.find('.presPop').remove();
        this.scrollIndex = {};
        this.warnScroll = {};
        var formatter = {};
        // for (var i = 0; i < result.length; i++) {
            var tipsdata = result.link_name;
            if (!formatter[tipsdata]) {
                formatter[tipsdata] = {target_name: [], ids: [], values: [], levels: []}
            }
            formatter[tipsdata].target_name.push(result.target_name);
            formatter[tipsdata].ids.push(result.manager_order_id);
            formatter[tipsdata].values.push('');
            formatter[tipsdata].levels.push(result.alarm_level);
        // }
        for (var key in formatter) {
            var tipsdata = key;
            var pointDom = flowManageOuter.find('div[tipsdata="' + tipsdata + '"]');
            var tipsDom = pointDom.find('.presPop');
            if (tipsDom.length > 1) {
                tipsDom.remove();
            }
            this.flowAddPop('warn', pointDom, formatter[key].target_name, formatter[key].ids, formatter[key].values, formatter[key].levels);
        }
    },

    //渲染底部流程生产工单报警数据
    renderBottomManageWarnning: function (result, isSocket) {
        var _this = this;
        this.list = $.extend(true, [], result);
        var flowManageOuter = $('#flowStepBox');
        flowManageOuter.find('.presPop').remove();
        this.scrollIndex = {};
        this.warnScroll = {};
        var formatter = {};
        for (var i = 0; i < result.length; i++) {
            var tipsdata = result[i].link_name;
            if (!formatter[tipsdata]) {
                formatter[tipsdata] = {target_name: [], ids: [], values: [], levels: []}
            }
            formatter[tipsdata].target_name.push(result[i].order_type);
            formatter[tipsdata].ids.push(result[i].order_id);
            formatter[tipsdata].values.push('');
            formatter[tipsdata].levels.push('');
        }
        for (var key in formatter) {
            var tipsdata = key;
            var pointDom = flowManageOuter.find('div[tipsdata="' + tipsdata + '"]');
            var tipsDom = pointDom.find('.presPop');
            if (tipsDom.length > 1) {
                tipsDom.remove();
            }
            this.flowAddPop('warn', pointDom, formatter[key].target_name, formatter[key].ids, formatter[key].values, formatter[key].levels);
        }
        return;
        // window.autoClickWarn = setTimeout(function(){
        if (_this.assemblyShow != 'order' && _this.list.length > 0) {
            var levelConf = (function (arr) {
                var temp = {index: -1, level: 0};
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].alert_level > temp.level) {
                        temp.index = i;
                        temp.level = arr[i].alert_level;
                    }
                }
                return temp;
            })(_this.list);
            var tipsid = _this.list[levelConf.index].target_id;
            var levelNum = _this.list[levelConf.index].alert_level;
            var quotaName = _this.list[levelConf.index].target_name;
            //这里的代码 作为回调传入 如果是 return true 的方式 有可能ajax 还没有完
            // if(_this.getWorkOrderListByTipsid('warn',tipsid,quotaName)) {


            // }
            if (isSocket) {
                _this.getWorkOrderListByTipsid('warn', tipsid, quotaName, null, null, function () {

                    var listLength = $('#orderList tr').length;
                    var workId = $('#orderList tr').eq(0).attr('workid');
                    var orderId = $('#orderList tr').eq(0).attr('orderid').split(',')[0];
                    if (listLength === 0 || !workId) {
                        return false;
                    }
                    $('#orderListTitle').text(quotaName + '-工单列表').attr('title', quotaName + '-工单列表');
                    mygis.loadOrder(workId, function (data) {
                        if (app.assemblyShow == "anim") {
                            mygis.showWarn(data);
                            _this.changeViewerByLevel(levelNum, data);
                        }
                    },orderId)
                    /*  $.ajax({
                            url: BACK_SERVER_URL + 'gisController/queryOrderGisInfo',
                            method: 'get',
                            data: {id: workId},
                            success: function (data) {
                                mygis.showWarn(data);
                                _this.changeViewerByLevel(levelNum,data);
                            }
                        }); */
                });
            } else {

            }

        }
        // },5000)
    },

    //渲染底部流程管理报警数据
    renderBottomManageWarnning2: function (cnt) {
        var _this = this;
        var result = [{
            first_process: "优化",
            target_name: "质差工单日清日结率（参数优化）",
            uu_id: 10005,
            total: cnt,
            levels: 1
        }];
        this.list = $.extend(true, [], result);
        var flowManageOuter = $('#flowStepBox');
        flowManageOuter.find('.presPop').remove();
        this.scrollIndex = {};
        this.warnScroll = {};
        var formatter = {};
        for (var i = 0; i < result.length; i++) {
            var tipsdata = result[i].first_process;
            if (!formatter[tipsdata]) {
                formatter[tipsdata] = {target_name: [], ids: [], values: []}
            }
            formatter[tipsdata].target_name.push(result[i].target_name);
            formatter[tipsdata].ids.push(result[i].uu_id);
            formatter[tipsdata].values.push(result[i].value);
            formatter[tipsdata].levels.push(result[i].levels);
        }
        for (var key in formatter) {
            var tipsdata = key;
            var pointDom = flowManageOuter.find('div[tipsdata="' + tipsdata + '"]');
            var tipsDom = pointDom.find('.presPop');
            if (tipsDom.length > 1) {
                tipsDom.remove();
            }
            this.flowAddPop('warn', pointDom, formatter[key].target_name, formatter[key].ids, formatter[key].values, formatter[key].levels);
        }

        if (_this.assemblyShow != 'order' && _this.list.length > 0) {
            var levelConf = (function (arr) {
                var temp = {index: -1, level: 0};
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].alert_level > temp.level) {
                        temp.index = i;
                        temp.level = arr[i].alert_level;
                    }
                }
                return temp;
            })(_this.list);
            var tipsid = _this.list[levelConf.index].target_id;
            var levelNum = _this.list[levelConf.index].alert_level;
            var quotaName = _this.list[levelConf.index].target_name;
            //这里的代码 作为回调传入 如果是 return true 的方式 有可能ajax 还没有完
            // if(_this.getWorkOrderListByTipsid('warn',tipsid,quotaName)) {


            // }
            if (isSocket) {

            } else {
                _this.getWorkOrderListByTipsid('warn', tipsid, quotaName, null, null, function () {
                    var listLength = $('#orderList tr').length;
                    var workId = $('#orderList tr').eq(0).attr('workid');
                    var orderId = $('#orderList tr').eq(0).attr('orderid').split(',')[0];
                    if (listLength === 0 || !workId) {
                        return false;
                    }
                    $('#orderListTitle').text(quotaName + '-工单列表').attr('title', quotaName + '-工单列表');
                    mygis.loadOrder(workId, function (data) {
                        if (app.assemblyShow == "anim") {
                            mygis.showWarn(data);
                            _this.changeViewerByLevel(levelNum, data);
                        }
                    },orderId)
                    /*  $.ajax({
                        url: BACK_SERVER_URL + 'gisController/queryOrderGisInfo',
                        method: 'get',
                        data: {id: workId},
                        success: function (data) {
                            mygis.showWarn(data);
                            _this.changeViewerByLevel(levelNum,data);
                        }
                    }); */
                })
            }

        }
        // window.autoClickWarn = setTimeout(function(){
        //     if(_this.assemblyShow!='order' && _this.list[0]){
        //         var tipsid = _this.list[0].uu_id;
        //         var quotaName = _this.list[0].target_name;
        //         if(_this.getWorkOrderListByTipsid('warn',tipsid,quotaName)) {
        //
        //         $('#orderListTitle').text(quotaName+'-工单列表').attr('title',quotaName+'-工单列表');
        //         _this.hideElement(app.assemblyShow,function(){_this.showElement('order')});
        //         _this.pilloverFilters();
        //         }
        //     }
        //
        // },10000)
    },

    //渲染分组柱状图
    renderPortalEvaluationrenderPortalEvaluation: function (array) {
        var data = (function () {
            var temp = [[], [], [], [], [], []];
            for (var i = 0; i < array.length; i++) {
                temp[0].push(array[i].substation_name || array[i].district_name || array[i].city_name);
                temp[1].push(array[i].p01);
                temp[2].push(array[i].p02);
                temp[3].push(array[i].p03);
                temp[4].push(array[i].p04);
                temp[5].push(array[i].p05);
            }
            return temp;
        })();
        this.groupBar(data, function (inst) {
            // $('#labelsDesc li').off().on('click', function () {
            //     var labelName = $(this).text();
            //     // $(this).toggleClass('unSelect');
            //     inst.dispatchAction({
            //         type: 'legendToggleSelect',
            //         name: labelName
            //     })
            // });
        }); //分组柱图，参数结构待定
    },

    //渲染NPS进度
    renderNPSprogress: function (obj) {
        if (!obj) {
            return false;
        }
        var dom = $('#customerPerception');
       var maxBarNumber = Math.max.apply(null, [obj.mobile, obj.telecom, obj.unicom]);
        var allBarPer = [Math.ceil(obj.mobile / maxBarNumber * 100), Math.ceil(obj.telecom / maxBarNumber * 100), Math.ceil(obj.unicom / maxBarNumber * 100)];
        /*  var t1_a = obj.nps_disparages_users_variety > 0 ? 'raise' : (obj.nps_disparages_users_variety < 0 ? 'fall' : 'visible');
        var t1_b = obj.nps_disparages_users_variety > 0 ? 'fa-long-arrow-up' : 'fa-long-arrow-down';
        var t2_a = obj.nps_resolution_progress_variety > 0 ? 'raise' : (obj.nps_resolution_progress_variety < 0 ? 'fall' : 'visible');
        var t2_b = obj.nps_resolution_progress_variety > 0 ? 'fa-long-arrow-up' : 'fa-long-arrow-down';
        var valueLength = (obj.nps_disparages_users + '').length;
        var floorNum = (function (a) {
            if (a <= 2) {
                return 1;
            }
            var temp = '1';
            for (var i = 0; i < a - 2; i++) {
                temp += '0';
            }
            return temp - 0;
        })(valueLength);
        var proAnum = obj.nps_disparages_users / floorNum;
        dom.find('span[name="quotaValueA"]').text(obj.nps_disparages_users);
        dom.find('div[name="quotaProgressA"]').css({width: proAnum + '%'});
        dom.find('div[name="quotaProgressB"]').css({width: (obj.nps_resolution_progress > 100 ? 100 : obj.nps_resolution_progress) + '%'});
        dom.find('span[name="quotaValueB"]').text(Math.abs(obj.nps_resolution_progress) + '%');
        dom.find('div[name="quotaDirctA"]').removeClass('raise').removeClass('fall').addClass(t1_a);
        dom.find('i[name="quotaArrowA"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t1_b);
        dom.find('div[name="quotaDirctB"]').removeClass('raise').removeClass('fall').addClass(t2_a);
        dom.find('i[name="quotaArrowB"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t2_b);
        dom.find('span[name="quotaChangeNumA"]').text(Math.abs(obj.nps_disparages_users_variety));
        dom.find('span[name="quotaChangeNumB"]').text(Math.abs(obj.nps_resolution_progress_variety) + '%'); */
        dom.find('div[name="barYd"]').css({height: allBarPer[0] + '%'}).text(obj.mobile ? obj.mobile : 0);
        dom.find('div[name="barDx"]').css({height: allBarPer[1] + '%'}).text(obj.telecom ? obj.telecom : 0);
        dom.find('div[name="barLt"]').css({height: allBarPer[2] + '%'}).text(obj.unicom ? obj.unicom : 0);
    },
    /**
     * 设置 NPS贬损用户 NPS解决进度 数据
     * @param {*} obj 
     */
    renderNPSLossResolveProgress:function(obj){
        if (!obj) {
            return false;
        }
        var dom = $('#customerPerception');
        var maxBarNumber = Math.max.apply(null, [obj.mobile, obj.telecom, obj.unicom]);
        var allBarPer = [Math.ceil(obj.mobile / maxBarNumber * 100), Math.ceil(obj.telecom / maxBarNumber * 100), Math.ceil(obj.unicom / maxBarNumber * 100)];
        var t1_a = obj.nps_disparages_users_variety > 0 ? 'raise' : (obj.nps_disparages_users_variety < 0 ? 'fall' : 'visible');
        var t1_b = obj.nps_disparages_users_variety > 0 ? 'fa-long-arrow-up' : 'fa-long-arrow-down';
        var t2_a = obj.nps_resolution_progress_variety > 0 ? 'raise' : (obj.nps_resolution_progress_variety < 0 ? 'fall' : 'visible');
        var t2_b = obj.nps_resolution_progress_variety > 0 ? 'fa-long-arrow-up' : 'fa-long-arrow-down';
        var valueLength = (obj.nps_cnt + '').length;
        var floorNum = (function (a) {
            if (a <= 2) {
                return 1;
            }
            var temp = '1';
            for (var i = 0; i < a - 2; i++) {
                temp += '0';
            }
            return temp - 0;
        })(valueLength);
        var proAnum = obj.nps_cnt / floorNum;
        dom.find('span[name="quotaValueA"]').text(obj.nps_cnt); //贬损数量
        dom.find('div[name="quotaProgressA"]').css({width: proAnum + '%'}); //贬损数量 转换为的人头数量
        dom.find('div[name="quotaProgressB"]').css({width: (obj.rate > 100 ? 100 : obj.rate) + '%'});//解决进度 进度条长度
        dom.find('span[name="quotaValueB"]').text(Math.abs(obj.rate) + '%');//解决进度 百分比
        dom.find('div[name="quotaDirctA"]').removeClass('raise').removeClass('fall').addClass(t1_a);
        dom.find('i[name="quotaArrowA"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t1_b);
        dom.find('div[name="quotaDirctB"]').removeClass('raise').removeClass('fall').addClass(t2_a);
        dom.find('i[name="quotaArrowB"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t2_b);
        dom.find('span[name="quotaChangeNumA"]').text(Math.abs(obj.nps_disparages_users_variety));
        dom.find('span[name="quotaChangeNumB"]').text(Math.abs(obj.nps_resolution_progress_variety) + '%');
    },
    //渲染单值环形组图
    renderGroupSingleRings: function (obj) {
        if (!obj) {
            var obj = {p01: 0, p02: 0, p03: 0, p04: 0, p05: 0, p06: 0, p07: 0, p08: 0}
        }


        // this.singleRings('safetyCompliance_0', '工程质监申报', 80);
        // this.singleRings('safetyCompliance_1', '资源录入及时', 85);
        // this.singleRings('safetyCompliance_2', '基站偏离度', obj.p03);
        // this.singleRings('safetyCompliance_3', '质量缺陷密度', obj.p04);


        // this.singleRings('safetyCompliance_0', '工程质监申报', obj.p01);
       
        // this.singleRings('safetyCompliance_1', '资源录入及时', obj.p02);
       
        // this.singleRings('safetyCompliance_4','工程质监申报',Math.ceil(obj.p05*100)/100);
        // this.singleRings('safetyCompliance_5','基站环境监测',Math.ceil(obj.p06*100)/100);
        // this.singleRings('safetyCompliance_6','基站偏离度',Math.ceil(obj.p07*100)/100);
        // this.singleRings('safetyCompliance_7','质量缺陷密度',Math.ceil(obj.p08*100)/100);
    },
    /**
         * 初始化 五高一地覆盖率的 柱状图
         */
        initThreeNetChart: function (options) {
            var classNames = this.colorStyle=='dark'?'dark':'tint';
            var color = setColor[classNames].threeNetChartColor[0];
            var option = {
                color: ['#003366', '#006699', '#4cabce', '#e5323e'],
                grid: {
                    top: "10%",
                    left: "13%",
                    right: "2%",
                    bottom: "20%"
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: [{name: '电信', icon: "rect"}, {name: '移动', icon: "rect"}, {name: '联通', icon: "rect"}],
                    textStyle: {
                        color: "white"
                    },
                    right: 0,
                    itemWidth: 15,
                    itemHeight: 7,
                    borderRadius: 0,
                    show:false
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        position: "bottom",
                        gridIndex: 0,
                        silent: true,
                        axisTick: {
                            show: false,
                            length: 0
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "rgba(124,132,156,1)",
                                type: "dashed"
                            }
                        },
                        axisLabel: {
                            color: color,
                            margin: 0,
                            interval: 0,
                            fontSize: 10
                        },

                        data: options.xData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        id: 1,
                        silent: true,
                        axisTick: {
                            show: false,
                            length: 0
                        },
                        min: 0,
                        max: 100,
                        axisLabel: {
                            color: color
                        },
                        splitLine: {
                            show: false,

                        },
                        axisLine: {
                            lineStyle: {
                                color: "rgba(124,132,156,1)",
                                type: "dashed"
                            }

                        }
                    },
                    {
                        // id:2,
                        // name:"反向坐标",
                        nameLocation: 'start',
                        type: 'category',
                        // max:5,
                        //  position:"right",
                        // offset:-282,
                        inverse: true,
                        silent: true,
                        axisTick: {
                            show: false,
                            length: 0
                        },
                        axisLabel: {
                            color: "white",
                            show: false
                        },
                        splitLine: {
                            show: false,
                            interval: 1,
                            lineStyle: {
                                color: "rgba(124,132,156,1)",
                                type: "dashed"
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: "rgba(124,132,156,1)",
                                type: "dashed"
                            }

                        },
                        data: options.xData
                    },
                ],
                series: [
                    {
                        name: '电信',
                        type: 'bar',
                        data: options.dx,
                        label: {
                            show: true, //开启显示
                            position: [-10, '-15%'], //在上方显示
                            textStyle: { //数值样式
                                color: color,
                                fontSize: 10
                            },
                            formatter:function(params){
                                return params.value.toFixed(1);
                            }
                        },
                        barWidth: 7,
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: 'rgba(39,157,193,1)'},
                                    {offset: 0.5, color: 'rgba(29,120,177,1)'},
                                    {offset: 1, color: 'rgba(22,90,163,1)'}
                                ]
                            )
                        }
                    },
                    {
                        name: '移动',
                        type: 'bar',
                        yAxisIndex: 0,
                        barWidth: 7,
                        xAxisIndex: 0,
                        data: options.yd,
                        label: {
                            show: true, //开启显示
                            position: ['10%', '10%'], //在上方显示
                            textStyle: { //数值样式
                                color: color,
                                fontSize: 10
                            }
                        },
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: 'rgba(199,192,79,1)'},
                                    {offset: 0.5, color: 'rgba(171,155,62,1)'},
                                    {offset: 1, color: 'rgba(147,121,46,1)'}
                                ]
                            )
                        }
                    },/* 
                    {
                        name: '联通',
                        type: 'bar',
                        barWidth: 7,
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        data: options.lt,
                        label: {
                            show: false
                        },
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: 'rgba(193,118,67,1)'},
                                    {offset: 0.5, color: 'rgba(171,100,58,1)'},
                                    {offset: 1, color: 'rgba(149,79,47,1)'}
                                ]
                            )
                        }
                    } */
                ]
            };
            chartsInsts.threeNetChart.setOption(option);
            $('#quotaDesc-1 li').off().on('click', function () {
                var labelName = $(this).text();
                $(this).toggleClass('unSelect');
                chartsInsts.threeNetChart.dispatchAction({
                    type: 'legendToggleSelect',
                    name: labelName
                })
            });
        },
        /**
         * 加载三网对标数据
         */
        loadThreeNetChartData:function(data){
            /*var data1 = {
                city_id: "6501",
                city_name: "乌鲁木齐",
                cover_rate_dt_dx: "100",
                cover_rate_dt_lt: "91.78",
                cover_rate_dt_yd: "100",
                cover_rate_gs_dx: "96.56",
                cover_rate_gs_lt: "91.46",
                cover_rate_gs_yd: "96.21",
                cover_rate_gt_dx: "96.63",
                cover_rate_gt_lt: "91.94",
                cover_rate_gt_yd: "96.23",
                cover_rate_gx_dx: "96.76",
                cover_rate_gx_lt: "92.37",
                cover_rate_gx_yd: "96.33",
                cover_rate_jq_dx: "97.04",
                cover_rate_jq_lt: "92.31",
                cover_rate_jq_yd: "96.42",
                cover_rate_qw_dx: "96.45",
                cover_rate_qw_lt: "90.64",
                cover_rate_qw_yd: "96.05",
                cover_rate_syq_dx: "96.65",
                cover_rate_syq_lt: "91.66",
                cover_rate_syq_yd: "96.32",
                cover_rate_zzq_dx: "96.58",
                cover_rate_zzq_lt: "91.24",
                cover_rate_zzq_yd: "96.21"
            };
            var data2 = {
                city_id: "0",
                city_name: "全疆",
                cover_rate_dt_dx: "100",
                cover_rate_dt_lt: "91.78",
                cover_rate_dt_yd: "100",
                cover_rate_gs_dx: "96.41",
                cover_rate_gs_lt: "92.68",
                cover_rate_gs_yd: "95.86",
                cover_rate_gt_dx: "96.63",
                cover_rate_gt_lt: "93.66",
                cover_rate_gt_yd: "95.96",
                cover_rate_gx_dx: "97.39",
                cover_rate_gx_lt: "95.9",
                cover_rate_gx_yd: "95.34",
                cover_rate_jq_dx: "97.17",
                cover_rate_jq_lt: "93.57",
                cover_rate_jq_yd: "96.53",
                cover_rate_qw_dx: "96.28",
                cover_rate_qw_lt: "92.5",
                cover_rate_qw_yd: "95.61",
                cover_rate_syq_dx: "96.91",
                cover_rate_syq_lt: "94.26",
                cover_rate_syq_yd: "95.84",
                cover_rate_zzq_dx: "96.92",
                cover_rate_zzq_lt: "94.53",
                cover_rate_zzq_yd: "95.85"
            };
            var data = {};
            console.log(level);
            if(level == 0){
                data = data1
            }else{
                data = data2;
            }*/
           /*  var options = {
                xData:['全网', '高铁', '校园', '高速', '地铁', '景区', '商业区', '住宅区'],
                dx:[utils.nullDetectionZero(data.cover_rate_qw_dx), data.cover_rate_gt_dx, data.cover_rate_gx_dx, data.cover_rate_gs_dx, data.cover_rate_dt_dx,data.cover_rate_jq_dx,data.cover_rate_syq_dx,data.cover_rate_zzq_dx],
                yd:[utils.nullDetectionZero(data.cover_rate_qw_yd), data.cover_rate_gt_yd, data.cover_rate_gx_yd, data.cover_rate_gs_yd, data.cover_rate_dt_yd,data.cover_rate_jq_yd,data.cover_rate_syq_yd,data.cover_rate_zzq_yd],
                lt:[utils.nullDetectionZero(data.cover_rate_qw_lt), data.cover_rate_gt_lt, data.cover_rate_gx_lt, data.cover_rate_gs_lt, data.cover_rate_dt_lt,data.cover_rate_jq_lt,data.cover_rate_syq_lt,data.cover_rate_zzq_lt],
            }; */
            var options = {
                xData:[ '高铁', '校园', '高速', '地铁', '商业区', '住宅区'],
                dx:[ data.cover_rate_gt_dx, data.cover_rate_gx_dx, data.cover_rate_gs_dx, data.cover_rate_dt_dx,data.cover_rate_syq_dx,data.cover_rate_zzq_dx],
                yd:[ data.cover_rate_gt_yd, data.cover_rate_gx_yd, data.cover_rate_gs_yd, data.cover_rate_dt_yd,data.cover_rate_syq_yd,data.cover_rate_zzq_yd],
                lt:[ data.cover_rate_gt_lt, data.cover_rate_gx_lt, data.cover_rate_gs_lt, data.cover_rate_dt_lt,data.cover_rate_syq_lt,data.cover_rate_zzq_lt],
            };
            app.initThreeNetChart(options);
        },
        
    //渲染用户流量数据
    renderUserFlux: function (obj) {
        if (!obj) {
            var obj = {user_cnt_4g: 0, user_cnt_23g: 0, phy_user_cnt: 0, down_flow: 0, up_flow: 0}
        }
        var numClips = function (str, limit) {
            if (str == null) {
                str = '0'
            }
            str = str.toString();
            if (str.length < limit) {
                var addS = '';
                for (var i = 0; i < limit - str.length; i++) {
                    addS += '0';
                }
                str = addS + str;
            }
            return str;
        };
        var setNumCard = function (str) {
            var html = '<i>';
            html += str.split('').join('</i><i>');
            console.log('html',html);
            return html + '</i>';
        };
        var busyTime = (obj.busy_time || '00') + '';
        var busyHour = busyTime.slice(busyTime.length - 2, busyTime.length);
        var num1 = numClips(obj.user_cnt_4g, 7);
        var num2 = numClips(obj.user_cnt_23g, 7);
        var num3 = numClips(obj.phy_user_cnt, 5);
        var num4 = numClips(obj.vlr_cnt_4g, 7);
        var num5 = numClips(obj.vlr_cnt_23g, 7);
        var dom1 = $('#userNumberCard');
        var dom2 = $('#upAndDownLoad');
        dom1.find('div[name="userNumber4G"]').html(setNumCard(num1));
        dom1.find('div[name="userNumber3G"]').html(setNumCard(num2));
        dom1.find('div[name="userNumberWL"]').html(setNumCard(num3));
        dom1.find('.userNumber4GOpen').html(setNumCard(num4));
        dom1.find('.userNumber3GOpen').html(setNumCard(num5));
        dom2.find('span[name="downFlux"]').text(Math.ceil((obj.down_flow?obj.down_flow:0) * 100) / 100 + 'TB');
        dom2.find('span[name="upFlux"]').text(Math.ceil((obj.up_flow?obj.up_flow:0) * 100) / 100 + 'TB');
        dom2.find('span[name="maxHour"]').text(busyHour + ':00');
    },
    //渲染资产规模
    renderPropertyScale: function (obj) {
        if (!obj) {
            obj = {g2_bts_num: 0, g3_bts_num: 0, g4_bts_num: 0}
        }
        $("#propertyScale4G").html(obj.g4_bts_num);
        $("#propertyScale3G").html(obj.g3_bts_num);
        $("#propertyScale2G").html(obj.g2_bts_num);
    },

    //主动查询RRU流量和资产利用率数据
    getDataForAssetEfficiency:function(dataLevel,id){
        var _this = this;
        dataLevel=app.getCurrentLevelByCodeLength(id)-1;
        $.ajax({
            url: BACK_SERVER_URL + 'gisController/queryAssetEfficiency',
            method: 'get',
            data: {dataLevel: dataLevel,id:id},
            success: function (data) {
                _this.assetEfficiencyData = data;
                _this.renderRRUAverageFlowrate(data);
                _this.renderUqwmEfficiencyGauge(data);
                _this.renderNcrementalBenefit({p01:data.complete_total, p02:data.complete_cnt, p03:data.complete_per, p04:data.uncomplete_cnt})
            },
            error:function(){
                console.log('查询失败')
            }
        })
    },

    //渲染RRU平均流量数据
    renderRRUAverageFlowrate:function(data){
        var outer = $('#flowrateData');
        outer.find('#c_rru_maxflow').text(data.city_rru_maxflow);
        outer.find('#c_rru_avgflow').text(data.city_rru_avgflow);
        outer.find('#c_rru_minflow').text(data.city_rru_minflow);
        outer.find('#v_rru_maxflow').text(data.village_rru_maxflow);
        outer.find('#v_rru_avgflow').text(data.village_rru_avgflow);
        outer.find('#v_rru_minflow').text(data.village_rru_minflow);
    },

    // 渲染水球图
    renderLiqiud: function (obj, loadFile) {
        if (!obj) {
            return false;
        }
        if (loadFile == 'ajax') {//因 容量 和故障 数据结构有变化 需要特殊处理

            // app.liquidFill('liquid_2','故障工单',100,0,0);
            // for(var i=0,len=obj.length;i<len;i++){
            //     if(obj[i].order_type == "质差"){
            //         app.liquidFill('liquid_1','质差工单',obj[i].rate,obj[i].end_cnt,obj[i].is_alarm);
            //     }else if(obj[i].order_type == "容量"){
            //         app.liquidFill('liquid_0','容量工单',obj[i].rate,obj[i].end_cnt,obj[i].is_alarm);
            //     }
            // }


        }

        //    if(obj.parameter_rate){
        //     this.liquidFill('liquid_1','质差工单',obj.parameter_rate,obj.parameter_end_cnt,obj.parameter_is_alarm);
        //    }


        // var index=0;
        // for(var key in liquidObj){
        //     var obj = liquidObj[key][0];
        //     this.liquidFill('liquid_'+index,obj.p01,obj.p02,obj.p03,obj.p04);
        //     index++;
        // }

    },
    /**
     * 除开容量 和质差的 水球图 数据固定
     */
    setAllOperationalEfficiencyData: function () {
        // this.liquidFill('liquid_3', '基站开通及时率', 6.25, 0, 1);
        // this.liquidFill('liquid_3', '规划站及时率', 65, 0, 1);
        // this.liquidFill('liquid_4', 'RRU运营率', 89, 0, 0);
        // this.liquidFill('liquid_4', '响应站及时率', 0, 0, 0);
        // app.liquidFill('liquid_2', '故障工单', 90.6, 0, 0);
    },
    setPlanStationData:function(obj){
        console.log(obj)
        this.liquidFill('liquid_3', '规划站及时率', obj.rate, obj.end_cnt, obj.is_alarm);
    },
    /**
     *设置响应站及时率 的 水球数据 不包含 上升下降
     */
    responseStationTimeRate:function(obj){
        console.log(obj)
        this.liquidFill('liquid_4', '响应站及时率', obj.rate, obj.end_cnt, obj.is_alarm);
    },
    /**
     * 设置运营效率 容量 水球图数据
     * @param {*} obj
     */
    setOperationalEfficiencyCapacityData: function (obj) {
        console.log(obj)
        // obj.rate = 92.3;
        this.liquidFill('liquid_0', '容量工单', obj.rate, obj.end_cnt, obj.is_alarm);
    },
    /**
     * 设置运营效率 质差 水球图数据
     * @param {*} obj
     */
    setOperationalEfficiencyParameterData: function (obj) {
        console.log(obj)
        // obj.rate = obj.rate;
        this.liquidFill('liquid_1', '质差工单', obj.rate, obj.end_cnt, obj.is_alarm);
    },
    /**
     * 设置水球图变动值 容量
     * @param obj
     */
    changeEfficiencyCapacity:function(obj){
        var dValue = obj.change_value;
        this.setEfficientyChange($('#liquid_0').next(),dValue);
    },
    /**
     * 设置水球图变动值 质差
     * @param obj
     */
    changeEfficiencyParameter:function(obj){
        var dValue = obj.change_value;
        this.setEfficientyChange($('#liquid_1').next(),dValue);
    },
     /**
     * 设置运营效率 故障 水球图数据
     * @param {*} obj
     */
    setOperationalEfficiencyBreakdownData: function (obj) {
        this.liquidFill('liquid_2', '故障工单', obj.rate, obj.end_cnt, obj.is_alarm);
    },
    /**
     * 设置故障工单的 上升下降
     * @param {*} obj 
     */
    changeOperationalEfficiencyBreakdownData:function(obj){
        var dValue = obj.change_value;
        this.setEfficientyChange($('#liquid_2').next(),dValue);
    },
    /**
     * 设置变动值
     */
    setEfficientyChange:function(ele,dValue){
        var t1 = dValue > 0 ? 'raise' : (dValue < 0 ? 'fall' : 'none');
        var t2 = dValue > 0 ? 'fa-long-arrow-up' : 'fa-long-arrow-down';
        ele.find('span[name="changeNum"]').text(dValue);
        ele.find('div[name="liquidChange"]').removeClass('raise').removeClass('fall').addClass(t1);
        ele.find('i[name="arrowDirc"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t2);
    },
   
    /**
     * 将水球图下方的 向上 向下 箭头 图标隐藏  数值清0
     */
    renderLiqiudUpDownClear: function () {
        $("span[name=changeNum]").text(0).parent().addClass("none");
    },
    //渲染低效资产表
    renderUqwmEfficiency: function (obj) {
        if (!obj) {
            return false;
        }
        var table = $('#uqwmEfficiency');
        var maxAllNumber = Math.max.apply(null, [obj.g2_bts_num, obj.g3_bts_num, obj.g4_bts_num]);
        var allBgPer = [Math.ceil(obj.g4_bts_num / maxAllNumber * 100), Math.ceil(obj.g3_bts_num / maxAllNumber * 100), Math.ceil(obj.g2_bts_num / maxAllNumber * 100)];
        //绑4G数据
        table.find('div[name="4GperBg"]').css({width: allBgPer[0] + '%'});
        // table.find('div[name="4Gprogress"]').css({width: Math.ceil(obj.g4_bts_zore_rate * 100) / 100 + '%'});
        // table.find('span[name="4Gper"]').text(Math.ceil(obj.g4_bts_zore_rate * 100) / 100 + '%');
        table.find('div[name="4Gprogress"]').css({width: Math.ceil(0.96 * 100) / 100 + '%'});
        table.find('span[name="4Gper"]').text(Math.ceil(0.96 * 100) / 100 + '%');
        table.find('span[name="4GallNumber"]').text(obj.g4_bts_num);
        // table.find('span[name="4GresultNum1"]').text(obj.g4_bts_zore_num);
        table.find('span[name="4GresultNum1"]').text(253);
        // var t1_4g = obj.g4_bts_zore_up_num>0?'raise':(obj.g4_bts_zore_up_num<0?'fall':'visible');
        // var t2_4g = obj.g4_bts_zore_up_num>0?'fa-long-arrow-up':'fa-long-arrow-down';
        // table.find('div[name="4GchangeDirct1"]').removeClass('raise').removeClass('fall').addClass(t1_4g);
        // table.find('i[name="4Garrow1"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t2_4g);
        // table.find('span[name="4GChangeNum1"]').text(Math.abs(obj.g4_bts_zore_up_num));
        // table.find('span[name="4GresultNum2"]').text(obj.g4_bts_zore_cost);
        table.find('span[name="4GresultNum2"]').text(406);
        // var t3_4g = obj.g4_bts_zore_up_cost>0?'raise':(obj.g4_bts_zore_up_cost<0?'fall':'visible');
        // var t4_4g = obj.g4_bts_zore_up_cost>0?'fa-long-arrow-up':'fa-long-arrow-down';
        // table.find('div[name="4GchangeDirct2"]').removeClass('raise').removeClass('fall').addClass(t3_4g);
        // table.find('i[name="4Garrow2"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t4_4g);
        // table.find('span[name="4GChangeNum2"]').text(obj.g4_bts_zore_up_cost);
        //绑3G数据
        table.find('div[name="3GperBg"]').css({width: allBgPer[1] + '%'});
        // table.find('div[name="3Gprogress"]').css({width: Math.ceil(obj.g3_bts_zore_rate * 100) / 100 + '%'});
        // table.find('span[name="3Gper"]').text(Math.ceil(obj.g3_bts_zore_rate * 100) / 100 + '%');
        table.find('div[name="3Gprogress"]').css({width: Math.ceil(0.50 * 100) / 100 + '%'});
        table.find('span[name="3Gper"]').text(Math.ceil(0.50 * 100) / 100 + '%');
        table.find('span[name="3GallNumber"]').text(obj.g3_bts_num);
        // table.find('span[name="3GresultNum1"]').text(obj.g3_bts_zore_num);
        table.find('span[name="3GresultNum1"]').text(68);
        // var t1_3g = obj.g3_bts_zore_up_num>0?'raise':(obj.g3_bts_zore_up_num<0?'fall':'visible');
        // var t2_3g = obj.g3_bts_zore_up_num>0?'fa-long-arrow-up':'fa-long-arrow-down';
        // table.find('div[name="3GchangeDirct1"]').removeClass('raise').removeClass('fall').addClass(t1_3g);
        // table.find('i[name="3Garrow1"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t2_3g);
        // table.find('span[name="3GChangeNum1"]').text(Math.abs(obj.g3_bts_zore_up_num));
        // table.find('span[name="3GresultNum2"]').text(obj.g3_bts_zore_cost);
        table.find('span[name="3GresultNum2"]').text(31);
        // var t3_3g = obj.g3_bts_zore_up_cost>0?'raise':(obj.g3_bts_zore_up_cost<0?'fall':'visible');
        // var t4_3g = obj.g3_bts_zore_up_cost>0?'fa-long-arrow-up':'fa-long-arrow-down';
        // table.find('div[name="3GchangeDirct2"]').removeClass('raise').removeClass('fall').addClass(t3_3g);
        // table.find('i[name="3Garrow2"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t4_3g);
        // table.find('span[name="3GChangeNum2"]').text(Math.abs(obj.g3_bts_zore_up_cost));
        //绑2G数据
        table.find('div[name="2GperBg"]').css({width: allBgPer[2] + '%'});
        // table.find('div[name="2Gprogress"]').css({width: Math.ceil(obj.g2_bts_zore_rate * 100) / 100 + '%'});
        // table.find('span[name="2Gper"]').text(Math.ceil(obj.g2_bts_zore_rate * 100) / 100 + '%');
        table.find('div[name="2Gprogress"]').css({width: Math.ceil(0.50 * 100) / 100 + '%'});
        table.find('span[name="2Gper"]').text(Math.ceil(0.50 * 100) / 100 + '%');
        table.find('span[name="2GallNumber"]').text(obj.g2_bts_num);
        // table.find('span[name="2GresultNum1"]').text(obj.g2_bts_zore_num);
        table.find('span[name="2GresultNum1"]').text(65);
        // var t1_2g = obj.g2_bts_zore_up_num>0?'raise':(obj.g2_bts_zore_up_num<0?'fall':'visible');
        // var t2_2g = obj.g2_bts_zore_up_num>0?'fa-long-arrow-up':'fa-long-arrow-down';
        // table.find('div[name="2GchangeDirct1"]').removeClass('raise').removeClass('fall').addClass(t1_2g);
        // table.find('i[name="2Garrow1"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t2_2g);
        // table.find('span[name="2GChangeNum1"]').text(Math.abs(obj.g2_bts_zore_up_num));
        // table.find('span[name="2GresultNum2"]').text(obj.g2_bts_zore_cost);
        table.find('span[name="2GresultNum2"]').text(13);
        // var t3_2g = obj.g2_bts_zore_up_cost>0?'raise':(obj.g2_bts_zore_up_cost<0?'fall':'visible');
        // var t4_2g = obj.g2_bts_zore_up_cost>0?'fa-long-arrow-up':'fa-long-arrow-down';
        // table.find('div[name="2GchangeDirct2"]').removeClass('raise').removeClass('fall').addClass(t3_2g);
        // table.find('i[name="2Garrow2"]').removeClass('fa-long-arrow-up').removeClass('fa-long-arrow-down').addClass(t4_2g);
        // table.find('span[name="2GChangeNum2"]').text(Math.abs(obj.g2_bts_zore_up_cost));
    },
    renderUqwmEfficiencyGauge:function(obj){

        var data = [];
        if(obj){
            data = [
                obj.rru_online_cnt,
                obj.alarm_cnt_4g,
                obj.zero_enb_cnt+obj.lower_enb_cnt,
                obj.rru_online_rate,
                obj.busy_alarm_per,
                obj.zero_lower_cell_per
            ];
        }else{
            data = [60817,2188,253,93.59,1.75,0.98];
        }
        var fontSize = ($(window).width()/100)*0.6;
        var option = {
            backgroundColor: 'transparent',
            series: [{
                type: 'gauge',
                center: ['80%', '55%'], // 默认全局居中
                radius: '95%',
                splitNumber: 1, //刻度数量
                startAngle: 200,
                endAngle: -20,
                min: 0,
                max: 100000,
                clockwise: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        shadowBlur: 0,
                        color: [
                            [1, '#03B7C9']
                        ]
                    }
                },
                axisTick: {
                    show: false,
                    lineStyle: {
                        color: '#03B7C9',
                        width: 1
                    },
                    length: 5,
                    splitNumber: 6
                },
                splitLine: {
                    show: false,
                    length: -6,
                    lineStyle: {
                        color: '#03B7C9',
                    }
                },
                axisLabel: {
                    distance: -15,
                    show:false,
                    textStyle: {
                        color: "#03B7C9",
                        fontSize: fontSize,
                        fontWeight: "bold"
                    }
                },
                pointer: { //仪表盘指针
                    show: 0
                },
                detail: {
                    show: false
                },
                data: [{
                    name: "",
                    value: 0
                }]
            },
                {
                    startAngle: 200,
                    endAngle: -20,
                    type: 'gauge',
                    center: ['80%', '55%'], // 默认全局居中
                    radius: '50%',
                    min: 0,
                    max: 1000,
                    axisLine: { // 坐标轴线
                        lineStyle: {
                            color: [
                                [0.66, '#03B7C9'],
                                [1, '#03B7C9']
                            ], // 属性lineStyle控制线条样式
                            width: 2
                        }
                    },


                    axisLabel: { // 坐标轴小标记
                        textStyle: { // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            fontSize: 16,
                            color: 'rgba(30,144,255,0)',
                        }
                    },
                    splitNumber:5,
                    axisTick:{
                        show:false
                    },
                    splitLine: {
                        length :5,
                        lineStyle: {
                            width:1,
                            color: '#03B7C9',
                            shadowColor : '#03B7C9',
                            shadowBlur: 1
                        }
                    },
                    pointer: { // 分隔线 指针
                        color: '#666666',
                        width: 1,
                        length: 230
                    },
                    detail: {
                        show: false
                    },

                },
                {
                    name: 'RRU在线率',
                    type: 'gauge',
                    startAngle: 200,
                    endAngle: -20,
                    radius: '80%',
                    center: ['80%', '55%'], // 默认全局居中
                    min: 0,
                    max: 100,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            width: 8,
                            shadowBlur: 0,
                            color: [
                                // [1,new echarts.graphic.LinearGradient(1, 0, 0, 0, [{offset: 0, color: '#ffea59'}, {offset: 0.33, color: '#7feb71'},{offset: 0.66, color: '#12d9e0'},{offset: 1, color: '#0486f6'}], false)]
                                [1,new echarts.graphic.LinearGradient(1, 0, 0, 0, [{offset: 0, color: '#0486f6'},{offset: 0.33, color: '#12d9e0'}, {offset: 0.66, color: '#7feb71'},{offset: 1, color: '#ffea59'}], false)]
                            ]
                        }
                    },
                    axisTick: {
                        show: false,

                    },
                    splitLine: {
                        show: false,
                        length: 20,

                    },

                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: true,
                        width:3
                    },
                    detail: {
                        show: true,
                        offsetCenter: [0, '40%'],
                        textStyle: {
                            fontSize: fontSize
                        },
                        formatter:function(params){
                            return "\n{box|"+params + "}\n {box|RRU在线率"+data[3]+"%}";
                        },
                        rich:{
                            box:{
                                width:50,
                                height:15,
                                color:setColor[this.colorStyle].assetUtilization[0]
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            width:10,
                            color: "#03B7C9",

                        }
                    },
                    data: [{
                        value:data[3]
                    }]
                },
                {
                    type: 'gauge',
                    center: ['20%', '55%'], // 默认全局居中
                    radius: '95%',
                    splitNumber: 1, //刻度数量
                    startAngle: 200,
                    endAngle: -20,
                    clockwise: true,
                    min: 0,
                    max: 1000,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 1,
                            shadowBlur: 0,
                            color: [
                                [1, '#03B7C9']
                            ]
                        }
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {
                            color: '#03B7C9',
                            width: 1
                        },
                        length: -5,
                        splitNumber: 10
                    },
                    splitLine: {
                        show: false,
                        length: -6,
                        lineStyle: {
                            color: '#03B7C9',
                        }
                    },
                    axisLabel: {
                        distance: -15,
                        show:false,
                        textStyle: {
                            color: "#03B7C9",
                            fontSize: "10",
                            fontWeight: "bold"
                        }
                    },
                    pointer: { //仪表盘指针
                        show: 0
                    },
                    detail: {
                        show: false
                    },
                    data: [{
                        name: "",
                        value: 1000
                    }]
                },
                {
                    type: 'gauge',
                    center: ['20%', '55%'], // 默认全局居中
                    radius: '50%',
                    startAngle: 200,
                    endAngle: -20,
                    axisLine: { // 坐标轴线
                        lineStyle: {
                            color: [
                                [0.66, '#03B7C9'],
                                [1, '#03B7C9']
                            ], // 属性lineStyle控制线条样式
                            width: 2
                        }
                    },


                    axisLabel: { // 坐标轴小标记
                        textStyle: { // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            fontSize: 16,
                            color: 'rgba(30,144,255,0)',
                        }
                    },
                    splitNumber:5,
                    axisTick:{
                        show:false
                    },
                    splitLine: {
                        length :5,
                        lineStyle: {
                            width:1,
                            color: '#03B7C9',
                            shadowColor : '#03B7C9',
                            shadowBlur: 1
                        }
                    },
                    pointer: { // 分隔线 指针
                        color: '#666666',
                        width: 0,
                        length: 230
                    },
                    detail: {
                        show: false
                    },

                },
                {
                    name: '高负荷占比',
                    type: 'gauge',
                    startAngle: 200,
                    endAngle: -20,
                    radius: '80%',
                    center: ['20%', '55%'], // 默认全局居中
                    min: 0,
                    max: 100,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            width: 8,
                            borderWidth:0,
                            shadowBlur: 0,
                            color: [
                                [1,new echarts.graphic.LinearGradient(1, 0, 0, 0, [{offset: 0, color: '#ffea59'}, {offset: 0.33, color: '#7feb71'},{offset: 0.66, color: '#12d9e0'},{offset: 1, color: '#0486f6'}], false)]
                            ]
                        }
                    },
                    axisTick: {
                        show: false,

                    },
                    splitLine: {
                        show: false,
                        length: 20,

                    },

                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: true,
                        width:3
                    },
                    detail: {
                        show: true,
                        offsetCenter: [0, '40%'],
                        textStyle: {
                            fontSize: fontSize
                        },
                        formatter:function(params){
                            return "\n{box|"+params + "}\n {box|高负荷占比"+data[4]+"%}";
                        },
                        rich:{
                            box:{
                                width:50,
                                height:15,
                                color:setColor[this.colorStyle].assetUtilization[0]
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#03B7C9",

                        }
                    },
                    data: [{
                        value: data[4]
                    }]
                },
                {
                    type: 'gauge',
                    center: ['50%', '55%'], // 默认全局居中
                    radius: '95%',
                    splitNumber: 1, //刻度数量
                    startAngle: 200,
                    endAngle: -20,
                    clockwise: true,
                    min: 0,
                    max: 100,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 1,
                            shadowBlur: 0,
                            color: [
                                [1, '#03B7C9']
                            ]
                        }
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {
                            color: '#03B7C9',
                            width: 1
                        },
                        length: -5,
                        splitNumber: 10
                    },
                    splitLine: {
                        show: false,
                        length: -6,
                        lineStyle: {
                            color: '#03B7C9',
                        }
                    },
                    axisLabel: {
                        distance: -15,
                        show:false,
                        textStyle: {
                            color: "#03B7C9",
                            fontSize: "10",
                            fontWeight: "bold"
                        }
                    },
                    pointer: { //仪表盘指针
                        show: 0
                    },
                    detail: {
                        show: false
                    },
                    data: [{
                        name: "",
                        value: 1000
                    }]
                },
                {
                    type: 'gauge',
                    center: ['50%', '55%'], // 默认全局居中
                    radius: '50%',
                    min: 0,
                    max: 1000,
                    startAngle: 200,
                    endAngle: -20,
                    axisLine: { // 坐标轴线
                        lineStyle: {
                            color: [
                                [0.66, '#03B7C9'],
                                [1, '#03B7C9']
                            ], // 属性lineStyle控制线条样式
                            width: 2
                        }
                    },


                    axisLabel: { // 坐标轴小标记
                        textStyle: { // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            fontSize: 16,
                            color: 'rgba(30,144,255,0)',
                        }
                    },
                    splitNumber:5,
                    axisTick:{
                        show:false
                    },
                    splitLine: {
                        length :5,
                        lineStyle: {
                            width:1,
                            color: '#03B7C9',
                            shadowColor : '#03B7C9',
                            shadowBlur: 1
                        }
                    },
                    pointer: { // 分隔线 指针
                        color: '#666666',
                        width: 0,
                        length: 230
                    },
                    detail: {
                        show: false
                    },

                },
                {
                    name: '零基站占比',
                    type: 'gauge',
                    startAngle: 200,
                    endAngle: -20,
                    radius: '80%',
                    center: ['50%', '55%'], // 默认全局居中
                    min: 0,
                    max: 9000,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            width: 8,
                            shadowBlur: 0,
                            color: [
                                [1,new echarts.graphic.LinearGradient(1, 0, 0, 0, [{offset: 0, color: '#ffea59'}, {offset: 0.33, color: '#7feb71'},{offset: 0.66, color: '#12d9e0'},{offset: 1, color: '#0486f6'}], false)]
                            ]
                        }
                    },
                    axisTick: {
                        show: false,

                    },
                    splitLine: {
                        show: false,
                        length: 20,

                    },

                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: true,
                        width:3
                    },
                    detail: {
                        show: true,
                        offsetCenter: [0, '40%'],
                        textStyle: {
                            fontSize: fontSize
                        },
                        formatter:function(params){
                            return "\n{box|"+params + "}\n  {box|零小区占比"+data[5]+"%}";
                        },
                        rich:{
                            box:{
                                width:50,
                                height:15,
                                color:setColor[this.colorStyle].assetUtilization[0]
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#03B7C9",

                        }
                    },
                    data: [{
                        value: data[5]
                    }]
                }]
        };
        chartsInsts.assetUtilization.setOption(option);
    },
    //渲染资源可视化
    renderVisualization: function (obj) {
        if (!obj) {
            obj = {p01: 92.18, p02: 3714, p03: 288, p04: 27}
        }
        var progress = $('#visualProgress');
        var number = Math.ceil(obj.p01 * 100) / 100;
        progress.find('div[name="visualProgressPer"]').css({width: number + '%'});
        progress.find('span[name="visualProgressNum"]').text(number + '%');
        this.nestRings([obj.p02, obj.p03, obj.p04], ['建设完成', '规划在建中', '规划未建设']);
    },

    //渲染存量盘活
    renderStockAliveList: function (obj) {
        if (!obj) {
            obj = {order_cnt: 5369, cost_saving: 5967}
        }
        var ele = $('#stockInventory');
        ele.find('span[name="inventoryTextA"]').text(obj.order_cnt);
        ele.find('span[name="inventoryTextB"]').text(obj.cost_saving + '万元');
    },

    //渲染增量效益
    renderNcrementalBenefit: function (obj) {
        if (!obj) {
            obj = {p01: 35, p02: 0, p03: 0, p04: 2}
        }
        this.normalPie(obj.p03, obj.p01);
        this.singleValuePie(obj.p02, obj.p04);
        $('#benefitChartA').find('.chartName').remove();
        $('#benefitChartA').delay(300).append('<div class="chartName">' + Math.ceil(obj.p03 * 100) / 100 + '%</div>');
    },

    //用gojs渲染工单流程
    rendenWorkOrderStep: function (config) {
        var togo = go.GraphObject.make;
        var myDiagram =
            togo(go.Diagram, "orderStepBox",
                {
                    "undoManager.isEnabled": true
                });
        var myModel = togo(go.Model);
        myModel.nodeDataArray = goTemp.nodeDataArray;
        myDiagram.nodeTemplate =
            togo(go.Node, "Horizontal",
                // 为整个Node背景设置为浅蓝色
                {background: "#44CCFF"},
                togo(go.Picture,
                    // Pictures 应该指定宽高.
                    // 当没有图片时显示红色的背景
                    // 或者当图片为透明的时候也是.
                    {margin: 10, width: 50, height: 50, background: "red"},
                    // Picture.source参数值与模型数据中的"source"字段绑定
                    new go.Binding("source")),
                togo(go.TextBlock,
                    "Default Text",  // 初始化默认文本
                    // 文字周围的空隙, 大号字体, 白色笔画:
                    {margin: 12, stroke: "white", font: "bold 16px sans-serif"},
                    // TextBlock.text参数值与模型数据中的"name"字段绑定
                    new go.Binding("text", "name"))
            );
        myDiagram.model = myModel;
    },

    //添加pop方法
    flowAddPop: function (type, ele, textList, idList, valuesList, titleName, levels) {
        var dom = $(ele), _this = this;
        var popType = type;
        var levels = levels;
        var listHtml = (function (arr) {
            var temp = '';
            for (var i = 0; i < arr.length; i++) {
                var quotaValue = '';
                var levelNum = '';
                if (valuesList) {
                    quotaValue = valuesList[i]
                }
                if (levels) {
                    levelNum = ' level="' + levels[i] + '"';
                }//增加规划站及时率 的id10008
                temp += '<p tipsid="' + idList[i] + '"' + levelNum + ' title="' + arr[i] + '"><span ' + ((',10007,10005,10037,10038,10008,10039,10009,10013,10095,'.indexOf(',' + idList[i] + ',') == -1) ? 'style="color: gray"' : '') + '>' + arr[i] + '</span><em>' + quotaValue + '</em></p>';
                // temp += '<p tipsid="' + idList[i] + '"' + levelNum + ' title="' + arr[i] + '"><span>' + arr[i] + '</span><em>' + quotaValue + '</em></p>';
            }
            return temp;
        })(textList);
        var html = '<div class="presPop ' + popType + '"><div class="popPointer"></div><div class="presInner"><div>' + listHtml + '</div></div></div>';
        dom.append(html);
        if(type=='warn'){
            setTimeout(function(){
                dom.find('.presPop').remove();
            },30000);
        }
        if (titleName) {
            dom.attr('tipsref', titleName)
        }
        var subDom = dom.find('.presPop');
        var subDom2 = dom.find('.presInner');
        var w = subDom.width();
        var h = subDom.height();
        if(subDom.parents('.pres2').length>0){
            w=w+dom.width()-(window.outerHeight/100*2.6);
        }
        subDom.css({
            'left': '50%',
            'top': '0%',
            'margin-top': -h - 3 + 'px',
            'margin-left': -w / 2 + 'px'
        }).addClass('show');
        // if(textList.length>2) {
        //     var contentList = subDom2.find('div');
        //     var subDomFirst = contentList.eq(0);
        //     _this.warnScrolling(subDomFirst);
        // }
        // dom.on('click',function(){
        // 	subDom.toggleClass('show');
        // });
        subDom.find('span').on('click', function () {//指标点击事件
            _this.assemblyShow = 'anim';
            _this.downType = 3;
            event.stopPropagation();
            var tipsid = $(this).parent().attr('tipsid');
            var levelNum = $(this).parent().attr('levelNum');
            var yth_order_type=$(this).parent().attr('title');
            getordertypelist(yth_order_type)
            console.log(levelNum,$(this).parent().attr('title'))
            var quotaName = $(this).text();
            // if(_this.getWorkOrderListByTipsid(popType,tipsid,quotaName)) {

            // }
            _this.getWorkOrderListByTipsid(popType, tipsid, quotaName, null, null, function () {
                var listLength = $('#orderList tr').length;
                var workId = $('#orderList tr').eq(0).attr('workid');
                var orderId = $('#orderList tr').eq(0).attr('orderid').split(',')[0];
                if (listLength === 0 || !workId) {
                    return false;
                }
                $('#orderListTitle').text(quotaName +"-"+ '工单列表').attr('title', quotaName +"-"+ '工单列表');
                mygis.loadOrder(workId, function (data) {
                    if (app.assemblyShow == "anim") {
                        mygis.showWarn(data);
                        setTimeout(function () {
                            _this.hideElement(app.assemblyShow, function () {
                                _this.showElement('order');
                                mygis.showGISOrderDetail(data);
                            });
                            _this.pilloverFilters();
                            //和 gis工具在一起的 图层控制按钮 取消绑定 图层控制事件  首页所有图层隐藏
                            app.indexLayersCloseFn();
                        }, 1000);
                    }
                },orderId)
                /* $.ajax({
                    url: BACK_SERVER_URL + 'gisController/queryOrderGisInfo',
                    method: 'get',
                    data: {id: workId},
                    success: function (data) {
                        mygis.showWarn(data);
                        setTimeout(function(){
                            _this.hideElement(app.assemblyShow,function(){
                                _this.showElement('order');
                                mygis.showGISOrderDetail(data);
                            });
                            _this.pilloverFilters();
                            //和 gis工具在一起的 图层控制按钮 取消绑定 图层控制事件  首页所有图层隐藏
                            app.indexLayersCloseFn();
                        },5000);

					}
                }); */
                // if(popType!='warn'){
                // var urlLevelArr= ['province_id','city_id','district_id','substation_id'];
                // var urlParmaStr = 'granularity=3&dateTime='+_this.dateStr+'&'+urlLevelArr[0]+'='+0;
                // var urlParmaStr = 'granularity=3&dateTime='+'20181124'+'&'+urlLevelArr[_this.arealevel]+'='+_this.areaid+'&target_name='+quotaName;
                //表没有了 所以前端注释了这个接口
                // $.getJSON(BACK_SERVER_URL+'largeScreen/queryPortalOrderByProcessUuid?'+urlParmaStr,function(result){
                //     var contentHtml = _this.createOrderContentPopTable(result.rows,_this.areaid,quotaName);
                //     _this.createPopOuter('orderListInfos','工单统计',contentHtml);
                //     var popDom = $('#popBox_orderListInfos');
                //     popDom.css({
                //         'margin-left':'0px',
                //         'margin-top':'0px',
                //         'left':$('body').width()-popDom.width()-100+'px',
                //         'top':'3%'
                //     })
                // });
                // }
                // if(_this.assemblyShow!='order'){
                //    _this.hideElement(app.assemblyShow,function(){_this.showElement('order')});
                //    _this.pilloverFilters();
                // }
            })

        });
    },

    //按等级切换界面
    changeViewerByLevel: function (level, data) {
        var _this = this;
        if (level != 1) {
            setTimeout(function () {
                if (_this.assemblyShow != 'order') {
                    //要不要去掉定位闪动效果
                    _this.hideElement(app.assemblyShow, function () {
                        _this.showElement('order');
                        if (data) {
                            mygis.showGISOrderDetail(data);
                        }
                    });
                    _this.pilloverFilters();

                    if (level == 2) {
                        setTimeout(function () {
                            //later add check scrolled
                            _this.goback();
                        }, 31000);
                    }
                }
            }, 5000)
        }
    },

    // 返回最初组件界面
    goback: function () {
        $('.ordertable').hide();
        var _this = this;
        app.top10TableIsClick = false;
        app.currentView = "index";
        clearInterval(app.workOrderTimeoutTimmer);
        app.orderWorkDetailsBoxShowHide();
        $('#popBox_orderListInfos,#popBox_orderEstateInfos').remove();
        $("#mapFilter").show();
        $(".ol-utils").show();
        mygis.clearVectorLayers();
        _this.hideElement(_this.assemblyShow, function () {
            _this.showElement('anim')
        });
        var flowManageOuter = $('#flowStepBox');
        flowManageOuter.find('[tipsdata]').removeAttr('tipsref');
        var tipsDom = flowManageOuter.find('.presPop');
        if (tipsDom.length > 0) {
            tipsDom.remove();
        }
        mygis.showCity(_this.cityId);
        if ($('#ol-popup-workorder').length > 0) {
            $('#ol-popup-workorder').parent().remove();
        }
        setTimeout(_this.reductionFilters, 600);
        //返回 首页界面重新绑定 图层控制按钮的 点击事件
        if (app.indexCurrentSelectedGisLayerName == "") {
            app.indexCurrentSelectedGisLayerName = "showGISOrder";
        }
        app.bindLeftFilterEvent();
        app.isToWorkOrderView = true;
    },

    //指标名称点击事件，创建弹窗，内容待从后台取
    bindSubTitleEvent: function () {
        var _this = this;
        $('#outer [evtag="pop"]').on('click', function () {
            var id = $(this).attr('popid');
            var name = $(this).text();
            var subKey = $(this).attr('subkey');
            if ($('#popBox_' + id).length > 0) {
                return false;
            }
            _this.popNumber++;
            if (subKey === '低效资产') {
                $.getJSON(BACK_SERVER_URL + '/gisController/queryAssetEfficiencyList?dataLevel=' + _this.arealevel + '&id=' + _this.areaid, function (result) {
                    if(result.length>0){
                        _this.drillData.push({level:_this.arealevel,id:_this.areaid});
                        var contentHtml = _this.createPopLowerEfficiency(result,{level:_this.arealevel,id:_this.areaid,enabled:false});
                        var config = {resize: true, drag: true, posi: 'center', scroll: true,width:'40%',height:'40%'};
                        _this.createPopOuter(id, '资产效益指标执行情况', contentHtml,config);
                        _this.drillDown(id);
                    }
                });
                // $.getJSON(BACK_SERVER_URL + '/PropertyBenefitLowerLevelController/queryPropertyBenefitLowerLevel/' + subKey + '/' + _this.arealevel + '/' + _this.areaid + '/null/down', function (result) {
                //     if (result) {
                //         var contentHtml = _this.createPopTbodyContent(result, _this.areaid, subKey);
                //         _this.createPopOuter(id, name, contentHtml);
                //     }
                // })
            }

            // _this.createPopOuter(id,name);
        });
    },

    //新建创建低效资产弹窗方法
    createPopLowerEfficiency:function(arr,drillCfg){
        var style='',drillUpIco='',act='';
        var nullDataToNotCount  = function(value,unit){
            if(value == "null" || value == null){
                return "未计算";
            }else{
                return value+(unit&&value!=0?unit:"");
            }
        }
        if(drillCfg && drillCfg.enabled){
            style=' style="cursor:pointer;"';
            drillUpIco=' &uarr;';
            act=' act="enup"';
        }
        if(arr&&arr[0]&&arr[0].name != null&&(arr[0].data_level===0||arr[0].data_level===1)){
            var tableHtml = '<table class="popBodyTable"><tr><th'+act+style+' level="'+drillCfg.level+'" id="'+drillCfg.id+'" rowspan="2">城市'+ drillUpIco +'</th><th sortkey="enb_cnt_4g" rowspan="2">4G基站个数</th><th sortkey="cell_cnt_4g" rowspan="2">4G小区个数</th><th sortkey="alarm_cnt_4g" rowspan="2">4G容量预警小区个数</th><th sortkey="busy_alarm_per" rowspan="2">超忙预警占比</th><th sortkey="zero_enb_cnt" rowspan="2">零流量基站个数</th><th sortkey="lower_enb_cnt" rowspan="2">低流量基站个数</th><th sortkey="zero_lower_cell_per" rowspan="2">零低基站占比</th><th sortkey="rru_online_cnt" rowspan="2">RRU在线数</th><th sortkey="rru_online_rate" rowspan="2">RRU在线运营率</th><th colspan="3">城市</th><th colspan="3">农村</th><th sortkey="complete_per" rowspan="2">承诺完成占比</th><th sortkey="complete_total" rowspan="2">承诺完成总和</th><th sortkey="complete_cnt" rowspan="2">承诺完成个数</th><th sortkey="uncomplete_cnt" rowspan="2">承诺未完成个数</th></tr><tr><th sortkey="city_rru_maxflow">RRU最高流量<br />4GRRU平均流量</th><th sortkey="city_rru_avgflow">RRU平均流量<br />4GRRU中最大流量</th><th sortkey="city_rru_minflow">RRU最低流量<br />4GRRU中最小流量</th><th sortkey="village_rru_maxflow">RRU最高流量<br />4GRRU平均流量</th><th sortkey="village_rru_avgflow">RRU平均流量<br />4GRRU中最大流量</th><th sortkey="village_rru_minflow">RRU最低流量<br />4GRRU中最小流量</th></tr>';            
        }else{
            var tableHtml = '<table class="popBodyTable"><tr><th'+act+style+' level="'+drillCfg.level+'" id="'+drillCfg.id+'" rowspan="2">城市'+ drillUpIco +'</th><th sortkey="enb_cnt_4g" rowspan="2">4G基站个数</th><th sortkey="cell_cnt_4g" rowspan="2">4G小区个数</th><th sortkey="alarm_cnt_4g" rowspan="2">4G容量预警小区个数</th><th sortkey="busy_alarm_per" rowspan="2">超忙预警占比</th><th sortkey="zero_enb_cnt" rowspan="2">零流量基站个数</th><th sortkey="lower_enb_cnt" rowspan="2">低流量基站个数</th><th sortkey="zero_lower_cell_per" rowspan="2">零低基站占比</th><th sortkey="rru_online_cnt" rowspan="2">RRU在线数</th><th colspan="3">城市</th><th colspan="3">农村</th><th sortkey="complete_per" rowspan="2">承诺完成占比</th><th sortkey="complete_total" rowspan="2">承诺完成总和</th><th sortkey="complete_cnt" rowspan="2">承诺完成个数</th><th sortkey="uncomplete_cnt" rowspan="2">承诺未完成个数</th></tr><tr><th sortkey="city_rru_maxflow">RRU最高流量<br />4GRRU平均流量</th><th sortkey="city_rru_avgflow">RRU平均流量<br />4GRRU中最大流量</th><th sortkey="city_rru_minflow">RRU最低流量<br />4GRRU中最小流量</th><th sortkey="village_rru_maxflow">RRU最高流量<br />4GRRU平均流量</th><th sortkey="village_rru_avgflow">RRU平均流量<br />4GRRU中最大流量</th><th sortkey="village_rru_minflow">RRU最低流量<br />4GRRU中最小流量</th></tr>';
        }
        for (var i = 0; i < arr.length; i++) {
            if(arr[i].name != null){
                var tmp = arr[i],tid='',styles=' style="cursor:pointer;"';
                if(tmp.data_level===1){
                    tid = tmp.city_id;
                }else if(tmp.data_level===2){
                    tid = tmp.district_id;
                }else{
                    styles='';
                }
                if(tmp.data_level===0||tmp.data_level===1){
                    var trHtml = '<tr><td'+styles+' act="endown" level="'+tmp.data_level+'" id="'+tid+'">'+tmp.name+'</td><td>'+nullDataToNotCount(tmp.enb_cnt_4g)
                    +'</td><td>'+nullDataToNotCount(tmp.cell_cnt_4g)+'</td><td>'+nullDataToNotCount(tmp.alarm_cnt_4g)+'</td><td>'+nullDataToNotCount(tmp.busy_alarm_per,"%")
                    +'</td><td>'+nullDataToNotCount(tmp.zero_enb_cnt)+'</td><td>'+nullDataToNotCount(tmp.lower_enb_cnt)+'</td><td>'+nullDataToNotCount(tmp.zero_lower_cell_per,"%")
                    +'</td><td>'+nullDataToNotCount(tmp.rru_online_cnt)+'</td><td>'+nullDataToNotCount(tmp.rru_online_rate,"%")+'</td><td>'+nullDataToNotCount(tmp.city_rru_maxflow)
                    +'</td><td>'+nullDataToNotCount(tmp.city_rru_avgflow)+'</td><td>'+nullDataToNotCount(tmp.city_rru_minflow)+'</td><td>'+nullDataToNotCount(tmp.village_rru_maxflow)
                    +'</td><td>'+nullDataToNotCount(tmp.village_rru_avgflow)+'</td><td>'+nullDataToNotCount(tmp.village_rru_minflow)+'</td><td>'+nullDataToNotCount(tmp.complete_per,"%")
                    +'</td><td>'+nullDataToNotCount(tmp.complete_total)+'</td><td>'+nullDataToNotCount(tmp.complete_cnt)+'</td><td>'+nullDataToNotCount(tmp.uncomplete_cnt)+'</td></tr>';
                }else{
                    var trHtml = '<tr><td'+styles+' act="endown" level="'+tmp.data_level+'" id="'+tid+'">'+tmp.name+'</td><td>'+nullDataToNotCount(tmp.enb_cnt_4g)
                    +'</td><td>'+nullDataToNotCount(tmp.cell_cnt_4g)+'</td><td>'+nullDataToNotCount(tmp.alarm_cnt_4g)+'</td><td>'+nullDataToNotCount(tmp.busy_alarm_per,"%")
                    +'</td><td>'+nullDataToNotCount(tmp.zero_enb_cnt)+'</td><td>'+nullDataToNotCount(tmp.lower_enb_cnt)+'</td><td>'+nullDataToNotCount(tmp.zero_lower_cell_per,"%")
                    +'</td><td>'+nullDataToNotCount(tmp.rru_online_cnt)+'</td><td>'+nullDataToNotCount(tmp.city_rru_maxflow)
                    +'</td><td>'+nullDataToNotCount(tmp.city_rru_avgflow)+'</td><td>'+nullDataToNotCount(tmp.city_rru_minflow)+'</td><td>'+nullDataToNotCount(tmp.village_rru_maxflow)
                    +'</td><td>'+nullDataToNotCount(tmp.village_rru_avgflow)+'</td><td>'+nullDataToNotCount(tmp.village_rru_minflow)+'</td><td>'+nullDataToNotCount(tmp.complete_per,"%")
                    +'</td><td>'+nullDataToNotCount(tmp.complete_total)+'</td><td>'+nullDataToNotCount(tmp.complete_cnt)+'</td><td>'+nullDataToNotCount(tmp.uncomplete_cnt)+'</td></tr>';
                
                }
                tableHtml+=trHtml;
            }
            
        }
        return tableHtml + '</table>';
    },

    //低效资产弹窗表格数据下钻与返回方法
    drillDown:function(id){
        var _this = this;
        var popDom = $('#popBody_'+id);
        var drillDownTd = popDom.find('td[act="endown"]');
        var drillUpTd = popDom.find('th[act="enup"]');
        drillDownTd.on('click',function(){
            var level = $(this).attr('level');
            var tid = $(this).attr('id');
            if(level>=3){return false;}
            $.getJSON(BACK_SERVER_URL + '/gisController/queryAssetEfficiencyList?dataLevel=' + level + '&id=' + tid, function (result) {
                if(result.length>0){
                    _this.drillData.push({level:level,id:tid});
                    var contentHtml = _this.createPopLowerEfficiency(result,{level:level,id:tid,enabled:true});
                    popDom.empty().append(contentHtml);
                    _this.drillDown(id);
                    _this.popScrollBar['popBody_' + id] = new MyScrollBar({
                        selId: 'popBody_' + id,
                        hasX: true,
                        bgColor: 'transparent',
                        barColor: '#0a5080',
                        width: 8
                    });
                }
            });
        });
        drillUpTd.on('click',function(){
            var cfg = _this.drillData[_this.drillData.length-2];
            if(!cfg || cfg.level<app.arealevel){return false;}
            var level = cfg.level;
            var tid = cfg.id;
            $.getJSON(BACK_SERVER_URL + '/gisController/queryAssetEfficiencyList?dataLevel=' + level + '&id=' + tid, function (result) {
                if(result.length>0){
                    _this.drillData.pop();
                    var contentHtml = _this.createPopLowerEfficiency(result,{level:level,id:tid,enabled:app.drillData.length>1?true:false});
                    popDom.empty().append(contentHtml);
                    _this.drillDown(id);
                    _this.popScrollBar['popBody_' + id] = new MyScrollBar({
                        selId: 'popBody_' + id,
                        hasX: true,
                        bgColor: 'transparent',
                        barColor: '#0a5080',
                        width: 8
                    });
                }
            });
        });
    },

    //创建弹窗表格内容
    createPopTbodyContent: function (result, areaid, subKey) {
        var temp = '';
        switch (subKey) {
            case '低效资产':
                temp = this.createLowPropertyListPopTable(result, areaid, subKey);
                break;
            case '资源可视化':
                temp = this.createVisualizationPopTable(result, areaid, subKey);
                break;
            case '存量盘活':
                temp = this.createStockInventoryPopTable(result, areaid, subKey);
                break;
            case '增量效益':
                temp = this.createNcrementalBenefitPopTable(result, areaid, subKey);
                break;
            case 'NPS异网对标':
                temp = this.createCustomerPerceptionPopTable(result, areaid, subKey);
                break;
        }
        return temp;
    },

    //点击大类名称为各流程添加tips
    bindTitleEvent: function () {
        var _this = this;
        $('#outer [evtag="tips"]').on('click', function () {
            var businessClass = $(this).attr('tipsName');
            var status = $(this).attr('status');
            if (!status || status == 'close') {
                _this.getFlowManageAlert(businessClass);
                $(this).attr('status', 'open');
            } else {
                _this.getFlowManageClear();
                $(this).attr('status', 'close');
            }
        });
    },


    //生成子级低效资产弹窗内容表格
    createLowPropertyListPopTable: function (arr, areaid, subKey) {
        arr = app.LowPropertyList;
        var tableHtml = '<table areaid="' + areaid + '" subkey="' + subKey + '" class="popBodyTable"><tr><th>城市</th><th sortkey="g4_bts_zore_num">超忙占比</th><th sortkey="g4_bts_zore_cost">超忙预警小区</th><th sortkey="g3_bts_zore_num">小区数量</th><th sortkey="g3_bts_zore_cost">RRU在线率</th><th sortkey="g2_bts_zore_num">RRU在线量</th><th sortkey="g2_bts_zore_cost">RRU规模</th><th sortkey="g2_bts_zore_cost">零低基站占比</th><th sortkey="g2_bts_zore_cost">零低基站数</th><th sortkey="g2_bts_zore_cost">基站数量</th></tr>';
        for (var i = 0; i < arr.length; i++) {
            tableHtml += '<tr>';
            for(var j=0,lenJ=arr[i].length;j<lenJ;j++){
                tableHtml += '<td>'+arr[i][j]+'</td>';
            }
            tableHtml += '</tr>';
        }
        return tableHtml + '</table>';
    },

    //生成子级资产可视化弹窗内容
    createVisualizationPopTable: function (arr, areaid, subKey) {
        var tableHtml = '<table areaid="' + areaid + '" subkey="' + subKey + '" class="popBodyTable"><tr><th></th><th sortkey="p01">库存资产数</th><th sortkey="p02">在建资产数</th><th sortkey="p04">在途资产数</th><th sortkey="p03">规划完成进度</th></tr>';
        for (var i = 0; i < arr.length; i++) {
            tableHtml += '<tr><td>' + (arr[i].district_name || arr[i].city_name) + '</td><td>' + arr[i].p01 + '</td><td>' + arr[i].p02 + '</td><td>' + arr[i].p04 + '</td><td>' + arr[i].p03 + '%</td></tr>';
        }
        return tableHtml + '</table>';
    },

    //生成子级存量盘活弹窗内容
    createStockInventoryPopTable: function (arr, areaid, subKey) {
        var tableHtml = '<table areaid="' + areaid + '" subkey="' + subKey + '" class="popBodyTable"><tr><th></th><th sortkey="p01">拆闲补忙工单数</th><th sortkey="p02">节约成本(万元)</th></tr>';
        for (var i = 0; i < arr.length; i++) {
            tableHtml += '<tr><td>' + (arr[i].district_name || arr[i].city_name) + '</td><td>' + arr[i].p01 + '</td><td>' + arr[i].p02 + '</td></tr>';
        }
        return tableHtml + '</table>';
    },

    //生成子级增量效益弹窗内容
    createNcrementalBenefitPopTable: function (arr, areaid, subKey) {
        var tableHtml = '<table areaid="' + areaid + '" subkey="' + subKey + '" class="popBodyTable"><tr><th></th><th sortkey="p01">承诺完成总和</th><th sortkey="p02">承诺完成支局数</th><th sortkey="p04">承诺未完成支局数</th><th sortkey="p03">承诺完成总和的占比</th></tr>';
        for (var i = 0; i < arr.length; i++) {
            tableHtml += '<tr><td>' + (arr[i].district_name || arr[i].city_name) + '</td><td>' + arr[i].p01 + '</td><td>' + arr[i].p02 + '</td><td>' + arr[i].p04 + '</td><td>' + arr[i].p03 + '%</td></tr>';
        }
        return tableHtml + '</table>';
    },

    //生成子级NPS异网对标弹窗内容
    createCustomerPerceptionPopTable: function (arr, areaid, subKey) {
        var tableHtml = '<table areaid="' + areaid + '" subkey="' + subKey + '" class="popBodyTable"><tr><th></th><th sortkey="p01">承诺完成总和</th><th sortkey="p02">承诺完成支局数</th><th sortkey="p04">承诺未完成支局数</th><th sortkey="p03">承诺完成总和的占比</th></tr>';
        for (var i = 0; i < arr.length; i++) {
            tableHtml += '<tr><td>' + (arr[i].district_name || arr[i].city_name) + '</td><td>' + arr[i].p01 + '</td><td>' + arr[i].p02 + '</td><td>' + arr[i].p04 + '</td><td>' + arr[i].p03 + '%</td></tr>';
        }
        return tableHtml + '</table>';
    },

    //生成工单列表弹窗（点击具体工单时要隐藏）内容
    createOrderContentPopTable: function (arr, areaid, quotaName) {
        var tableHtml = '<table poptype="orderList" areaid="' + areaid + '" subkey="' + quotaName + '" class="popBodyTable"><tr><th>分公司</th><th sortkey="p01">' + quotaName + '</th><th sortkey="p02">指标完成数</th><th sortkey="p03">生产总工单</th><th sortkey="p04">指标完成率</th></tr>';
        if (arr && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                tableHtml += '<tr><td>' + (arr[i].district_name || arr[i].city_name) + '</td><td>' + arr[i].p01 + '</td><td>' + arr[i].p02 + '</td><td>' + arr[i].p03 + '</td><td>' + arr[i].p04 + '%</td></tr>';
            }
        }
        return tableHtml + '</table>';
    },

    //创建弹窗
    createPopOuter: function (id, name, innerHtml, config) {
        var innerHtml = innerHtml || '<table style="width:100%;text-align:center;"><tr><th>维度一</th><th>维度二</th></tr><tr><td>测试值一</td><td>测试值二</td></tr><tr><td>测试值一</td><td>测试值二</td></tr></table>';
        var outerId = 'popBox_' + id;
        var conf = config || {resize: true, drag: true, posi: 'center', scroll: true};
        var dragTg = conf.drag ? ' name="drag"' : '';
        var resize = conf.resize ? '<i name="minix">&#8211;</i><i name="maxin">o</i>' : '';
        console.log(name);
        if ($('#' + outerId).length == 0) {
            var outerHtml = '<div id="' + outerId + '" class="innerBox popBox"style="display:none;"><div' + dragTg + ' class="innerHead"><span name="popTitleText" class="innerName">' + name + '</span><div class="tips-box-data-export">';
            if(name == '资产效益指标执行情况'){
                outerHtml += '<i name="export"></i>';
            }
            outerHtml += '</div><div class="toolTips abs">' + resize + '<i name="close">&#215;</i></div></div><div id="popBody_' + id + '" name="popBody" class="innerBody">' + innerHtml + '</div></div>';
            $('#outer').append(outerHtml);
        } else {
            $('#' + outerId).find('div[name="popBody"]').eq(0).empty().append(innerHtml);
        }
        var popDom = $('#' + outerId);
        if(conf.width){popDom.css({width:conf.width})}
        if(conf.height){popDom.css({height:conf.height})}
        if (conf.posi == 'center') {
            var w = popDom.width();
            var h = popDom.height();
            popDom.css({
                'margin-left': -w / 2 + this.popNumber * 10 + 'px',
                'margin-top': -h / 2 + this.popNumber * 10 + 'px'
            });
        }
        if (typeof conf.posi == 'object') {
            for (var key in conf.posi) {
                popDom.css(key, conf.posi[key]);
            }
        }
        popDom.show();
        if (conf.scroll) {
            this.popScrollBar['popBody_' + id] = new MyScrollBar({
                selId: 'popBody_' + id,
                hasX: true,
                bgColor: 'transparent',
                barColor: '#0a5080',
                width: 8
            });
        }
    },

    //document事件
    bindDocumentEvent: function () {
        
        //关闭流程步骤中的小浮层
        var _this = this;
        $(document).on('mousedown', function (event) {
            var dom = $(event.target);
            // 生产告警按钮
           if(dom.attr("data-name") == "produce"){
                dom.addClass("selected").siblings().removeClass("selected");
                app.switchTop10TableData("produce");
           }
        //    管理告警按钮
           if(dom.attr("data-name") == "management"){
            dom.addClass("selected").siblings().removeClass("selected");
            app.switchTop10TableData("management");
            }
            //弹窗尺寸最小化
            if (dom.attr('name') == 'minix') {
                var outDom = dom.parents('.popBox');
                var popBody = outDom.find('div[name="popBody"]').slideUp(100);
                dom.parents('.popBox').animate({height: '2.9vh'}, 100)
            }
            //弹窗尺寸还原
            if (dom.attr('name') == 'maxin') {
                var outDom = dom.parents('.popBox');
                var popBody = outDom.find('div[name="popBody"]').slideDown(100);
                dom.parents('.popBox').animate({height: '30%'}, 100)
            }
            //弹窗关闭
            if (dom.attr('name') == 'close') {
                var outDom = dom.parents('.popBox');
                outDom.hide(100, function () {
                    outDom.remove()
                });
                _this.popNumber--;
            }
             //弹窗导出
             if (dom.attr('name') == 'export') {
               console.log("导出表格数据");
               var dataDom = dom.parents(".innerHead").siblings(".innerBody").find("table.popBodyTable>tbody>tr:first-of-type>th:first-of-type");
               var currentTableLevel = dataDom.attr("level");
               var currentTableId = dataDom.attr("id");
               var titles = ["城市","4G基站个数", "4G小区个数", "4G容量预警小区个数", "超忙预警占比", "零流量基站个数", "低流量基站个数", "零低基站占比", "RRU在线数", "RRU在线运营率",
                "城市 RRU最高流量 4GRRU平均流量","城市 RRU平均流量 4GRRU中最大流量","城市 RRU最低流量 4GRRU中最小流量",
                "农村 RRU最高流量 4GRRU平均流量","农村 RRU平均流量 4GRRU中最大流量","农村 RRU最低流量 4GRRU中最小流量",
                "承诺完成占比", "承诺完成总和", "承诺完成个数", "承诺未完成个数"];
                var fields = ["name","enb_cnt_4g", "cell_cnt_4g", "alarm_cnt_4g", "busy_alarm_per", "zero_enb_cnt", "lower_enb_cnt", "zero_lower_cell_per", "rru_online_cnt", "rru_online_rate",
                "city_rru_maxflow","city_rru_avgflow","city_rru_minflow",
                "village_rru_maxflow","village_rru_avgflow","village_rru_minflow",
                "complete_per", "complete_total", "complete_cnt", "uncomplete_cnt"];
                var fileName = "资产效益数据导出";
                var url = BACK_SERVER_URL+"/gisController/exportAssetEfficiencyList?dataLevel="+currentTableLevel+"&id="+currentTableId+"&titles="+titles.join(",")+"&fields="+fields.join(",")+"&fileName="+fileName;
               console.log("当前表格的数据层级:"+currentTableLevel);
               console.log("当前表格的数据ID:"+currentTableId);
               window.open(url);
            }
            //弹窗拖动
            if (dom.attr('name') == 'drag' || dom.attr('name') == 'popTitleText') {
                var outDom = dom.parents('.popBox');
                $(document).on('selectstart', function () {
                    return false
                });
                // var plusX = parseFloat(outDom.css('margin-left'));
                // var plusY = parseFloat(outDom.css('margin-top'));
                var left = parseFloat(outDom.css('left'));
                var top = parseFloat(outDom.css('top'));
                var mx = event.pageX;
                var my = event.pageY;
                $(document).on('mousemove', function (subevent) {
                    var nx = subevent.pageX;
                    var ny = subevent.pageY;
                    var ox = left + (nx - mx);
                    var oy = top + (ny - my);
                    outDom.css({
                        left: ox + 'px',
                        top: oy + 'px'
                    })
                });
                $(document).on('mouseup', function () {
                    $(document).off('selectstart');
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                });
            }
            //流程节点点击
            if (dom.attr('tipsdata') || dom.parents('div[tipsdata]').length > 0) {
                //根据tipsdata查询所有相关的指标
                $("#picDivs").hide();
                $("#picContainer,#picContainer3").empty();
                var presDom = (function (o) {
                    if (o.attr('tipsdata')) {
                        return o;
                    } else if (dom.parents('div[tipsdata]').length > 0) {
                        return o.parents('div[tipsdata]').eq(0);
                    }
                })(dom);
                // var yth_order_type=
                var tipsdata = presDom.attr('tipsdata');
                var tipsref = presDom.attr('tipsref');
                if (!dom.is('span')) {
                    if (presDom.find('.presPop').length > 0) {
                        presDom.find('.presPop').toggleClass('show');
                    } else {
                        if (!tipsref) {
                            $.getJSON(BACK_SERVER_URL + 'largeScreen/queryCfgPortalProcess?first_link_name=' + tipsdata, function (result) {
                                if (result.rows.length > 0) {
                                    var textList = [], idList = [];
                                    for (var i = 0; i < result.rows.length; i++) {
                                        textList.push(result.rows[i].target_name);
                                        idList.push(result.rows[i].target_id);
                                    }
                                    _this.scrollIndex = {};
                                    _this.warnScroll = {};
                                    _this.flowAddPop('normal', presDom, textList, idList);
                                }
                            })
                        }
                    }

                }
            }
            //工单筛选按钮点击
            if (dom.attr('id') == 'doFilter') {
                // TODO filter function
                var filterInput = $('#orderListFilter');
                var time= $('#orderdate').val();
                var startTime=time.substring(0,8);
                var endTime=time.substring(11,19);
                var orderType=$('.orderdrop').val();
                var searchdate='&orderType='+orderType+'&startTime='+startTime+'&endTime='+endTime;
                console.log(searchdate)
                var id = filterInput.val();
                var uid = filterInput.attr('uid');
                var quota = filterInput.attr('quota');
                var tipsType = filterInput.attr('tipstype');
                if (quota == "top10OrSocket") {//如果是 top10 和 socket 过来的 搜索就搜索 某一个工单
                    _this.getWorkOrderListByTipsid(tipsType, uid, quota, id,null,null,searchdate);
                } else {
                    _this.getWorkOrderListByTipsid(tipsType, uid, quota, id,null,null,searchdate);
                }

            }
            //弹窗表格排序
            if (dom.attr('sortkey')) {
                return false;
                var table = dom.parents('.popBodyTable').eq(0);
                var sortKey = dom.attr('sortkey');
                var areaid = table.attr('areaid');
                var subkey = table.attr('subkey');
                var status = dom.attr('status');
                var id = dom.parents('.popBox').eq(0).attr('id');
                var flag = '';
                if (!status || status == 'up') {
                    flag = 'down';
                } else if (status == 'down') {
                    flag = 'up';
                }
                var contentHtml = '';
                if (table.attr('poptype') === 'orderList') {
                    var urlLevelArr = ['province_id', 'city_id', 'district_id', 'substation_id'];
                    // var urlParmaStr = 'granularity=3&dateTime='+_this.dateStr+'&'+urlLevelArr[0]+'='+0;
                    var orderBy = flag == 'down' ? 'DESC' : 'ASC';
                    var urlParmaStr = 'granularity=3&dateTime=' + '20181124' + '&' + urlLevelArr[_this.arealevel] + '=' + _this.areaid + '&target_name=' + subkey + '&sort=' + sortKey + '&order=' + orderBy;
                    //表没有了 所以前端注释了这个接口
                    // $.getJSON(BACK_SERVER_URL+'largeScreen/queryPortalOrderByProcessUuid?'+urlParmaStr,function(result){
                    //     contentHtml = _this.createOrderContentPopTable(result.rows,_this.areaid,subkey);
                    //     $('#'+id).find('div[name="popBody"]').eq(0).empty().append(contentHtml);
                    //     $('#'+id).find('th[sortkey="'+sortKey+'"]').addClass(flag).attr('status',flag);
                    //     _this.popScrollBar['popBody_'+id.split('_').pop()]=new MyScrollBar({selId:'popBody_'+id.split('_').pop(),hasX:true,bgColor:'transparent',barColor:'#0a5080',width:8});
                    // });
                } else {
                    $.getJSON(BACK_SERVER_URL + '/PropertyBenefitLowerLevelController/queryPropertyBenefitLowerLevel/' + subkey + '/' + _this.arealevel + '/' + _this.areaid + '/' + sortKey + '/' + flag, function (result) {
                        contentHtml = _this.createPopTbodyContent(result, areaid, subkey);
                        $('#' + id).find('div[name="popBody"]').eq(0).empty().append(contentHtml);
                        $('#' + id).find('th[sortkey="' + sortKey + '"]').addClass(flag).attr('status', flag);
                        _this.popScrollBar['popBody_' + id.split('_').pop()] = new MyScrollBar({
                            selId: 'popBody_' + id.split('_').pop(),
                            hasX: true,
                            bgColor: 'transparent',
                            barColor: '#0a5080',
                            width: 8
                        });
                    })
                }
            };
            if (dom.attr('name') == 'estateBtn' || dom.parents('div[name="estateBtn"]').length == 1) {
                var btn = dom.attr('name') == 'estateBtn' ? dom : dom.parents('div[name="estateBtn"]').eq(0);
                var con = btn.parent().prev();
                var cons = con.children();
                var length = cons.length;
                var disable = btn.hasClass('disabled');
                if (disable) {
                    return false;
                }
                var index = (function () {
                    for (var i = 0; i < cons.length; i++) {
                        if (cons.eq(i).hasClass('showItem')) {
                            return i;
                        }
                    }
                })();
                var tag = btn.attr('tag');
                if (tag == 'next') {
                    cons.eq(index).removeClass('showItem').end().eq(index + 1).addClass('showItem');
                    btn.siblings().removeClass('disabled');
                    if (index >= length - 2) {
                        btn.addClass('disabled').prev().removeClass('disabled');
                    }
                } else {
                    cons.eq(index).removeClass('showItem').end().eq(index - 1).addClass('showItem');
                    btn.siblings().removeClass('disabled');
                    if (index <= 1) {
                        btn.addClass('disabled').next().removeClass('disabled');
                    }
                }
            };
            if(dom.attr('id') == 'changeWorkStyle'){
                console.log($("#changeWorkStyle").text())
                if($("#changeWorkStyle").text()=="人工"){
                    $("#changeWorkStyle").text("自动")
                } else{
                    $("#changeWorkStyle").text("人工")
                }
            }
            if(dom.attr('id')==='changeStyle'){
                if(!_this.allowChangeStyle){return false;}
                $('#outer').fadeOut(300,function(){
                    var classNames = _this.colorStyle=='dark'?'tint':'dark';
                    var colorObj = setColor[classNames];
                    var logoSrc = '';
                    var styleTxt = '';
                    if(classNames==='dark'){
                        mygis.changeMapColor(0);
                        logoSrc = 'resource/image/logo.png';
                        styleTxt = '浅色界面';
                        $('#changeWorkStyle').css("background-color","#041936")
                    }else{
                        mygis.changeMapColor(1);
                        logoSrc = 'resource/image/tint_logo.png';
                        styleTxt = '深色界面';
                        $('#changeWorkStyle').css("background-color","#e0f1f4")
                    }
                    $('#pageLogo').attr('src',logoSrc);
                    $('#changeStyle').text(styleTxt);
                    _this.colorStyle = classNames;
                    _this.allowChangeStyle=false;
                    document.getElementsByTagName('body')[0].className=classNames;

                    //修改嵌套环形图颜色
                    /*var visualizationOpt = _this.getEchartOption(chartsInsts.visualization);
                    if(visualizationOpt){
                        visualizationOpt.graphic[0].elements[1].style = {
                            fill: colorObj.visualization[0],
                            stroke:colorObj.visualization[0]
                        };
                        visualizationOpt.graphic[0].elements[2].style = {
                            fill: colorObj.visualization[0]
                        };
                        visualizationOpt.graphic[0].elements[4].style = {
                            fill: colorObj.visualization[1],
                            stroke:colorObj.visualization[1]
                        };
                        visualizationOpt.graphic[0].elements[5].style = {
                            fill: colorObj.visualization[1]
                        };
                        visualizationOpt.graphic[0].elements[7].style = {
                            fill: colorObj.visualization[2],
                            stroke:colorObj.visualization[2]
                        };
                        visualizationOpt.graphic[0].elements[8].style = {
                            fill: colorObj.visualization[2]
                        };
                        visualizationOpt.legend[0].textStyle.color=colorObj.visualization[3];
                        visualizationOpt.series[0].data[0].itemStyle.borderColor=visualizationOpt.series[0].data[0].itemStyle.color=colorObj.visualization[0];
                        visualizationOpt.series[1].data[0].itemStyle.borderColor=visualizationOpt.series[1].data[0].itemStyle.color=colorObj.visualization[1];
                        visualizationOpt.series[2].data[0].itemStyle.borderColor=visualizationOpt.series[2].data[0].itemStyle.color=colorObj.visualization[2];
                        chartsInsts.visualization.setOption(visualizationOpt);
                    }*/

                    //修改增量效益饼图颜色
                    var benefitChartAOpt = _this.getEchartOption(chartsInsts.benefitChartA);
                    if(benefitChartAOpt){
                        benefitChartAOpt.series[0].data[0].itemStyle.color=colorObj.benefitChartA[0];
                        benefitChartAOpt.series[0].data[1].itemStyle.color=colorObj.benefitChartA[1];
                        benefitChartAOpt.title[0].textStyle.color=colorObj.benefitChartA[2];
                        benefitChartAOpt.title[0].subtextStyle.color=colorObj.benefitChartA[3];
                        benefitChartAOpt.series[0].label.color=colorObj.benefitChartA[4];
                        chartsInsts.benefitChartA.setOption(benefitChartAOpt);
                    }

                    //修改增量效益单值环形图颜色
                    var benefitChartBOpt = _this.getEchartOption(chartsInsts.benefitChartB);
                    if(benefitChartBOpt){
                        benefitChartBOpt.series[0].data[0].itemStyle.color.colorStops[0].color=colorObj.benefitChartB[0];
                        benefitChartBOpt.series[0].data[0].itemStyle.color.colorStops[1].color=colorObj.benefitChartB[1];
                        benefitChartBOpt.series[0].data[1].itemStyle.color.colorStops[0].color=colorObj.benefitChartB[2];
                        benefitChartBOpt.series[0].data[1].itemStyle.color.colorStops[1].color=colorObj.benefitChartB[3];
                        benefitChartBOpt.legend[0].textStyle.color=colorObj.benefitChartB[4];
                        chartsInsts.benefitChartB.setOption(benefitChartBOpt);
                    }

                    //修改重点指标颜色
                    var mainWorkOpt = _this.getEchartOption(chartsInsts.mainWork);
                    if(mainWorkOpt){
                        mainWorkOpt.grid[0].borderColor=setColor[classNames].mainWork[0];
                        mainWorkOpt.xAxis[0].axisLine.lineStyle.color = colorObj.mainWork[1];
                        mainWorkOpt.xAxis[0].splitLine.lineStyle.color = colorObj.mainWork[0];
                        mainWorkOpt.yAxis[0].axisLine.lineStyle.color = colorObj.mainWork[1];
                        mainWorkOpt.yAxis[0].splitLine.lineStyle.color = colorObj.mainWork[0];
                        mainWorkOpt.series[0].label.textStyle.color = colorObj.mainWork[1];
                        mainWorkOpt.color=[colorObj.mainWork[2]];
                        chartsInsts.mainWork.setOption(mainWorkOpt);
                    };
                    //修改画像得分颜色

                    var histogramOpt = _this.getEchartOption(chartsInsts.histogram);
                    if(histogramOpt){
                        histogramOpt.grid[0].borderColor=setColor[classNames].mainWork[0];
                        histogramOpt.xAxis[0].axisLine.lineStyle.color = colorObj.mainWork[1];
                        histogramOpt.xAxis[0].splitLine.lineStyle.color = colorObj.mainWork[0];
                        histogramOpt.yAxis[0].axisLine.lineStyle.color = colorObj.mainWork[1];
                        histogramOpt.yAxis[0].splitLine.lineStyle.color = colorObj.mainWork[0];
                        histogramOpt.series[0].label.textStyle.color = colorObj.mainWork[1];
                        histogramOpt.color=[colorObj.mainWork[2]];
                        chartsInsts.histogram.setOption(histogramOpt);
                    }
                    //修改雷达得分颜色
                    var ScreenIndexOpt = _this.getEchartOption(chartsInsts.ScreenIndex);
                    if(ScreenIndexOpt){
                        ScreenIndexOpt.radar[0].name.textStyle.color=setColor[classNames].mainWork[1];
                        chartsInsts.ScreenIndex.setOption(ScreenIndexOpt);
                    }
                    // xAxis: [
                    //     {
                    //         type: 'value',
                    //         splitNumber: 4,
                    //         scale: true,
                    //         axisLine: {
                    //
                    //             lineStyle: {
                    //                 color: style.lisans[1],
                    //                 width: 1
                    //             }
                    //         },
                    //         splitLine: {
                    //             lineStyle: {
                    //                 color: style.lisans[1],
                    //                 width: 1
                    //             }
                    //         },
                    //
                    //         axisLabel: {
                    //             formatter: '{value} 元',
                    //             textStyle: {
                    //                 color: style.lisans[0],
                    //                 fontSize: 10
                    //             }
                    //         }
                    //     }
                    // ],
                    //     yAxis: [
                    //     {
                    //         type: 'value',
                    //         splitNumber: 4,
                    //         scale: true,
                    //         axisLine: {
                    //             lineStyle: {
                    //                 color: style.lisans[1],
                    //                 width: 1
                    //             }
                    //         },
                    //         axisLabel: {
                    //             formatter: '{value} 元',
                    //             textStyle: {
                    //                 color: style.lisans[0],
                    //                 fontSize: 10
                    //             }
                    //         },
                    //         splitLine: {
                    //             lineStyle: {
                    //                 color: style.lisans[1],
                    //                 width: 1
                    //             }
                    //         }
                    //     }
                    // ],
                    //     series: [
                    //     {
                    //         type: 'scatter',
                    //         symbolSize: 10,
                    //         data:picAll,
                    //
                    //
                    //         itemStyle: {
                    //             normal: {
                    //                 color: style.lisans[3]
                    //             }
                    //         },
                    //修改关键指标颜色
                    var keyQuotaOpt = _this.getEchartOption(chartsInsts.keyQuota);
                    if(keyQuotaOpt){
                        keyQuotaOpt.color = [colorObj.keyQuota[0],colorObj.keyQuota[1],colorObj.keyQuota[2]];
                        keyQuotaOpt.grid[0].borderColor=colorObj.keyQuota[3];
                        keyQuotaOpt.xAxis[0].axisLine.lineStyle.color=colorObj.keyQuota[4];
                        keyQuotaOpt.xAxis[0].splitLine.lineStyle.color=colorObj.keyQuota[5];
                        keyQuotaOpt.yAxis[0].axisLine.lineStyle.color=colorObj.keyQuota[6];
                        keyQuotaOpt.yAxis[0].splitLine.lineStyle.color=colorObj.keyQuota[7];
                        keyQuotaOpt.yAxis[1].axisLine.lineStyle.color=colorObj.keyQuota[8];
                        keyQuotaOpt.yAxis[1].splitLine.lineStyle.color=colorObj.keyQuota[9];
                        keyQuotaOpt.series[0].lineStyle.color=colorObj.keyQuota[10];
                        keyQuotaOpt.series[0].areaStyle.color=colorObj.keyQuota[11];
                        keyQuotaOpt.series[1].lineStyle.color=colorObj.keyQuota[12];
                        keyQuotaOpt.series[1].areaStyle.color=colorObj.keyQuota[13];
                        keyQuotaOpt.series[2].lineStyle.color=colorObj.keyQuota[14];
                        keyQuotaOpt.series[2].areaStyle.color=colorObj.keyQuota[15];
                        keyQuotaOpt.series[3].lineStyle.color=colorObj.keyQuota[16];
                        keyQuotaOpt.series[3].areaStyle.color=colorObj.keyQuota[17];
                        chartsInsts.keyQuota.setOption(keyQuotaOpt);
                    }

                    var assetUtilization = _this.getEchartOption(chartsInsts.assetUtilization);
                    if(assetUtilization){
                        // assetUtilization.series[2].axisLine.lineStyle.color[0][1]=colorObj.assetUtilization[0];
                        // assetUtilization.series[2].axisLine.lineStyle.color[1][1]=colorObj.assetUtilization[1];
                        // assetUtilization.series[2].axisLine.lineStyle.color[2][1]=colorObj.assetUtilization[2];
                        // assetUtilization.series[2].axisLine.lineStyle.color[3][1]=colorObj.assetUtilization[3];
                        // assetUtilization.series[2].axisLine.lineStyle.color[4][1]=colorObj.assetUtilization[4];
                        //
                        // assetUtilization.series[5].axisLine.lineStyle.color[0][1]=colorObj.assetUtilization[0];
                        // assetUtilization.series[5].axisLine.lineStyle.color[1][1]=colorObj.assetUtilization[1];
                        // assetUtilization.series[5].axisLine.lineStyle.color[2][1]=colorObj.assetUtilization[2];
                        // assetUtilization.series[5].axisLine.lineStyle.color[3][1]=colorObj.assetUtilization[3];
                        // assetUtilization.series[5].axisLine.lineStyle.color[4][1]=colorObj.assetUtilization[4];
                        //
                        // assetUtilization.series[8].axisLine.lineStyle.color[0][1]=colorObj.assetUtilization[0];
                        // assetUtilization.series[8].axisLine.lineStyle.color[1][1]=colorObj.assetUtilization[1];
                        // assetUtilization.series[8].axisLine.lineStyle.color[2][1]=colorObj.assetUtilization[2];
                        // assetUtilization.series[8].axisLine.lineStyle.color[3][1]=colorObj.assetUtilization[3];
                        // assetUtilization.series[8].axisLine.lineStyle.color[4][1]=colorObj.assetUtilization[4];
                        assetUtilization.series[2].detail.rich.box.color=colorObj.assetUtilization[0];
                        assetUtilization.series[5].detail.rich.box.color=colorObj.assetUtilization[0];
                        assetUtilization.series[8].detail.rich.box.color=colorObj.assetUtilization[0];
                        chartsInsts.assetUtilization.setOption(assetUtilization);
                    }

                    var threeNetChart = _this.getEchartOption(chartsInsts.threeNetChart);

                    if(threeNetChart){
                        threeNetChart.yAxis[0].axisLabel.color = colorObj.threeNetChartColor[0];
                        threeNetChart.xAxis[0].axisLabel.color = colorObj.threeNetChartColor[0];
                        threeNetChart.series[0].label.textStyle.color = colorObj.threeNetChartColor[0];
                        threeNetChart.series[1].label.textStyle.color = colorObj.threeNetChartColor[0];
                        chartsInsts.threeNetChart.setOption(threeNetChart);
                    }

                    // 修改资产规模颜色和背景图
                    $(".propertyScaleContant span").css("background-image","url(../largeScreen/resource/image/bg_"+classNames+".png)")
                    $(".rightArrow").css("background-image","url(../largeScreen/resource/image/l_"+classNames+".png)")
                    $(".leftArrow").css("background-image","url(../largeScreen/resource/image/r_"+classNames+".png)")
                    if(classNames==='dark'){
                        $(".propertyScaleContant").css("background-color", "#05284E");
                        $(".propertyScaleContant span").css("background-color", "transparent");
                    }else{
                        $(".propertyScaleContant").css("background-color", "#C4EAFE");
                        $(".propertyScaleContant span").css("background-color", "rgba(238,249,255,0.8)");
                    }

                    $(".perception-legend").removeClass("style-dark").removeClass("style-tint").addClass("style-"+classNames);
//                    $(".perception-legend").css("background-color",setColor[classNames].perceptualLegend[3]);
//                    $(".perception-legend").css("color",setColor[classNames].perceptualLegend[4]);
//                    $(".perception-legend .color1").css("background-color",setColor[classNames].perceptualLegend[0]);
//                    $(".perception-legend .color2").css("background-color",setColor[classNames].perceptualLegend[1]);
//                    $(".perception-legend .color3").css("background-color",setColor[classNames].perceptualLegend[2]);
                    //修改水球图颜色
                    for(var key1 in chartsInsts.liquidObj){
                        var liquidObj = _this.getEchartOption(chartsInsts.liquidObj[key1]);
                        if(liquidObj){
                            liquidObj.title[0].textStyle.color=colorObj.liquid[0];
                            liquidObj.series[0].backgroundStyle.color=colorObj.liquid[1];
                            liquidObj.series[0].itemStyle.shadowColor=colorObj.liquid[2];
                            liquidObj.series[0].label.color=colorObj.liquid[0];
                            chartsInsts.liquidObj[key1].setOption(liquidObj);
                        }
                    }

                    //修改安全合规颜色
                    for(var key2 in chartsInsts.singleRingObj){
                        var singleRingObj = _this.getEchartOption(chartsInsts.singleRingObj[key2]);
                        if(singleRingObj){
                            singleRingObj.title[0].textStyle.color=singleRingObj.title[1].textStyle.color=colorObj.singleRing[0];
                            singleRingObj.series[0].data[0].itemStyle.color=colorObj.singleRing[1];
                            singleRingObj.series[0].data[1].itemStyle.color=colorObj.singleRing[2];
                            chartsInsts.singleRingObj[key2].setOption(singleRingObj);
                        }
                    }
                    $(this).delay(200).fadeIn(300,function(){
                        _this.allowChangeStyle=true;
                    });
                })
            }
        });
        
    },

    //预警信息有效期定时器
    checkWarningEnable: function () {
        setInterval(function () {
            var warnList = $('#warnList span');
            var nowDate = new Date();
            var nowTimeNum = nowDate.getTime();
            if (warnList.length > 0) {
                warnList.each(function () {
                    var endTime = $(this).attr('endtime');
                    if (nowTimeNum > endTime) {
                        $(this).remove();
                        if ($('#warnList span').length === 0) {
                            $('#warnList').html('没有新的预警信息');
                        }
                    }
                })
            }
        }, 10000);
    },

    //指标幻灯片方法
    slideChanges: function (id) {
        var index = 0;
        var test = 0;
        var outerDom = $('#' + id);
        var slideList = outerDom.children();
        var slideListLength = slideList.length;
        var dom = outerDom.find('.slideCon');
        var items = outerDom.next();
        if (items && items.attr('name') == 'slideItems') {
            var itemsHtml = (function () {
                var tmp = '';
                for (var i = 0; i < slideList.length; i++) {
                    var now = i == 0 ? ' class="now"' : '';
                    tmp += '<i' + now + '></i>';
                }
                return tmp;
            })();
            items.html(itemsHtml);
        }
        var itemsList = items.children();
        var slideDo = function () {
            slideList.eq(index).fadeOut(150, function () {
                index = index < slideListLength - 1 ? index + 1 : 0;
                slideList.eq(index).fadeIn(150);
                if (items) {
                    itemsList.eq(index).addClass('now').siblings().removeClass('now');
                }
            });
        };
        window.slideObj = setInterval(slideDo, 8000);
        dom.on('mouseenter', function () {
            clearInterval(slideObj);
        }).on('mouseleave', function () {
            index = $(this).index();
            window.slideObj = setInterval(slideDo, 8000)
        });
        items.on('mouseenter', function () {
            clearInterval(slideObj);
        }).on('mouseleave', function () {
            window.slideObj = setInterval(slideDo, 8000)
        });
        items.find('i').each(function (n, ele) {
            $(ele).on('mouseenter', function () {
                if (n == index) {
                    return false;
                }
                slideList.eq(index).fadeOut(150, function () {
                    index = n;
                    slideList.eq(index).fadeIn(150);
                    if (items) {
                        itemsList.eq(index).addClass('now').siblings().removeClass('now');
                    }
                })
            })
        })
    },

    /**
     * 生成工单覆盖小区弹窗内容
     * @param arr
     * @returns {string}
     */
    orderEstateInfosContent: function (arr) {
        var content = '', page = '';
        if (!arr) {
            return content;
        }
        content = '<div class="estateInfosBox"><div class="estateInfosCons">';
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i], tmp = '', dis = '';
            if (i == 0) {
                dis = ' showItem';
            }
            tmp += '<ul class="estateInfosCon' + dis + '">' +
                '<li><div class="formName">小区名称：</div><div class="formVal" data-tag="sector_name" title="' + (obj.sector_name||'---') + '">' +(obj.sector_name||'---')  + '</div></li>' +
                '<li><div class="formName">方位角：</div><div class="formVal">' +(obj.ant_azimuth||'---') + '</div></li>' +
                '<li><div class="formName">仰角：</div><div class="formVal">' + (obj.ant_downtilt||'---')+ '</div></li>' +
                '<li><div class="formName">站高：</div><div class="formVal">' + (obj.ant_high||'---')+ '</div></li>' +
                '<li><div class="formName">连接成功率：</div><div class="formVal">' +(obj.cgl||'---') + '%</div></li>' +
                '<li><div class="formName">掉线率：</div><div class="formVal">' + (obj.dxl||'---')+ '%</div></li>' +
                '<li><div class="formName">优良率：</div><div class="formVal">' + (obj.yll||'---') + '%</div></li>' +
                '<li><div class="formName">覆盖率：</div><div class="formVal">' + (obj.fgl||'---')+ '%</div></li>' +
                '<li><div class="formName">告警信息：</div><div class="formVal">' +(obj.gj||'---') + '</div></li>' +
                '<li><div class="formName">常驻用户：</div><div class="formVal">' + (obj.cz||'---')+ '</div></li>' +
                '<li><div class="formName">场景：</div><div class="formVal">' +(obj.cj||'---') + '</div></li></ul>';
            content += tmp;
        }
        if (arr.length > 1) {
            page += '</div><div class="estatePage"><div name="estateBtn" class="disabled" tag="prev"><i></i><span>上一个</span></div><div  name="estateBtn" tag="next"><span>下一个</span><i></i></div></div>'
        } else {
            page += '</div>';
        }
        return content + page + '</div>';
    },
    /**
     * 生成工单覆盖小区弹窗内容
     * @param arr
     * @returns {string}
     */
    orderEstateInfosContentBlind: function (obj) {
        var content = '', page = '';
        if (!obj) {
            return content;
        }
        content = '<div class="estateInfosBox"><div class="estateInfosCons">';

            var  tmp = '', dis = '';
            // if (i == 0) {
                dis = ' showItem';
            // }
            tmp += '<ul class="estateInfosCon' + dis + '">' +
                '<li><div class="formName">盲点类型：</div><div class="formVal" data-tag="sector_name" title="' + obj.sys_blind_type + '">' + (obj.sys_blind_type=='1'?'响应类站':'规划类站') + '</div></li>' +
                '<li><div class="formName">盲点名称：</div><div class="formVal">' + (obj.sys_blind_name||'---') + '</div></li>' +
                '<li><div class="formName">联系方式：</div><div class="formVal">' + (obj.sys_blind_persion||'---') + '</div></li>' +
                '<li><div class="formName">上报日期：</div><div class="formVal">' + (obj.sys_blind_time||'---') + '</div></li>' +
                '<li><div class="formName">认领年收入：</div><div class="formVal">' + (obj.sys_blind_income||'---') + '</div></li>' +
                '<li><div class="formName">预计投入：</div><div class="formVal">' + (obj.sys_blind_input||'---') + '</div></li>' +
                '<li><div class="formName">建设类型：</div><div class="formVal">' + (obj.sys_blind_build_type||'---') + '</div></li>' +
                '<li><div class="formName">网络类型：</div><div class="formVal">' + (obj.sys_blind_nettype||'---') + '</div></li>' +
                '<li><div class="formName">是否五高一地：</div><div class="formVal">' + (obj.sys_blind_is_wgyd||'---') + '</div></li>' +
                '<li><div class="formName">五高一地类型名称：</div><div class="formVal">' + (obj.sys_blind_wgyd_type||'---') + '</div></li>' +
                '<li><div class="formName">五高一地场景名称：</div><div class="formVal">' + (obj.sys_blind_wgyd_scene||'---') + '</div></li></ul>';
            content += tmp;

        // if (arr.length > 1) {
        //     page += '</div><div class="estatePage"><div name="estateBtn" class="disabled" tag="prev"><i></i><span>上一个</span></div><div  name="estateBtn" tag="next"><span>下一个</span><i></i></div></div>'
        // } else {
            page += '</div>';
        // }
        return content + page + '</div>';
    },

    /**
     * 创建工单覆盖小区弹窗
     * @param arr
     */
    createOrderEstateInfosPop: function (id, arr) {
        if ($('#popBox_orderEstateInfos').length > 0) {
            if ($('#popBox_orderEstateInfos').attr('name') == id) {
                $('#popBox_orderEstateInfos').remove();
                return false;
            } else {
                var innerHTMl = this.orderEstateInfosContent(arr);
                $('#popBody_orderEstateInfos').html(innerHTMl);
                $('#popBox_orderEstateInfos').attr('name', id).css({width: '260px', height: 'auto', left: 'initial'});
            }

        } else {
            var innerHTMl = this.orderEstateInfosContent(arr);
            this.createPopOuter('orderEstateInfos', '小区详情', innerHTMl, {
                drag: false,
                resize: false,
                posi: {top: 'calc(1% + 4vh)', right: '280px', scroll: false}
            });
            $('#popBox_orderEstateInfos').attr('name', id).css({width: '260px', height: 'auto', left: 'initial'});
        }

    },

    //关闭工单覆盖小区弹窗
    closeOrderEstateInfosPop: function () {
        $('#popBox_orderEstateInfos').remove();
    },
    /**
     * 创建工单盲点需求详情弹窗
     * @param arr
     */
    createOrderEstateInfosPopBlind: function (id, arr) {
        if ($('#popBox_orderEstateInfos').length > 0) {
            if ($('#popBox_orderEstateInfos').attr('name') == id) {
                $('#popBox_orderEstateInfos').remove();
                return false;
            } else {
                var innerHTMl = this.orderEstateInfosContentBlind(arr);
                $('#popBody_orderEstateInfos').html(innerHTMl);
                $('#popBox_orderEstateInfos').attr('name', id).css({width: '260px', height: 'auto', left: 'initial'});
            }

        } else {
            var innerHTMl = this.orderEstateInfosContentBlind(arr);
            this.createPopOuter('orderEstateInfos', '需求详情', innerHTMl, {
                drag: false,
                resize: false,
                posi: {top: 'calc(1% + 4vh)', right: '280px', scroll: false}
            });
            $('#popBox_orderEstateInfos').attr('name', id).css({width: '260px', height: 'auto', left: 'initial'});
        }

    },

    //关闭工单盲点需求详情弹窗
    closeOrderEstateInfosPopBlind: function () {
        $('#popBox_orderEstateInfos').remove();
    },
    //取得echarts图表的option
    getEchartOption:function(chartObj){
        return chartObj.getOption();
    },

    //对象入口方法
    init: function (codeId, level,cityid) {

        this.showNowTime();
        // this.getAllLeftDataByDefault(codeId,level);
        // this.getAllRightDataByDefault(codeId,level);
        this.bindLeftFilterEvent();
        this.bindRightFilterEvent();
        this.bindTitleEvent();
        this.bindSubTitleEvent();
        this.bindDocumentEvent();
        this.createWebSocket('city_id='+cityid);
        // this.createWebSocket('province_id='+app.purviewId);
        // this.rendenWorkOrderStep(goTemp);
        this.getDataForAssetEfficiency(level,cityid);

        this.slideChanges('slideBox');
    },
    /**
     * 渲染 工单视图时间轴
     * @param {*} options
     */
    initTimeAxis: function (options) {
        var html = '<div class="time-axis-line"></div>\
        <ul class="time-axis-box height-collapse">'
        for (var i = 0, len = options.data.length; i < len; i++) {
            html += '<li class="height-collapse " style="width:calc(100%/' + len + ')" >\
                    <p class="symbol ' + (options.data[i].area_id == "" ? "" : "exception") + '" area-id="' + options.data[i].area_id + '" title="' + options.xData[i] + '"></p>\
                    <p class="arrow ' + (options.data[i].isSelected ? 'selected' : 'a') + '"></p> ' + (options.data[i].area_id == "" ? "" : '<p class="text">' + options.xData[i] + '</p>') + '\
                </li>';
        }
        html += '</ul>';
        $("#time-axis").html(html);
        $("#time-axis .time-axis-box>li>.symbol").off("click");
        $("#time-axis .time-axis-box>li>.symbol").on("click", function () {
            var id = $(this).attr("area-id");
            $(this).siblings(".arrow").addClass("selected").parent().siblings().find(".arrow").removeClass("selected");
            mygis.loadBadArea(id);
        })
    },
    /**
     * 显示或者隐藏时间轴
     * @param {*} isShow
     */
    showHideTimeAxis: function (isShow) {
        if (isShow) {
            $(".time-axis-wrap").show();
        } else {
            $(".time-axis-wrap").hide();
        }
    },
    /**
     * 处理时间轴数据
     * @param {} sourceData
     */
    processTimeAxisData: function (sourceData, selectDayNo) {
        var useOptions = {
            xData: [],
            data: [],
            copyData: []
        };
        var useSelectDayNo = (selectDayNo + "").substring(0, 2) == 20 ? selectDayNo : "";
        for (var i = 0, len = sourceData.length; i < len; i++) {
            var useTime = (sourceData[i].day_no + "").substring(4, 6) + "-" + (sourceData[i].day_no + "").substring(6, 8);

            useOptions.xData.push(useTime);
            if (sourceData[i].area_id == "") {
                useOptions.data.push({
                    area_id: sourceData[i].area_id,
                    isBad: false,
                    value: 5,
                    itemStyle: {color: "#02518a"},
                    time: sourceData[i].day_no,
                    isSelected: false
                });
                useOptions.copyData.push({
                    area_id: sourceData[i].area_id,
                    isBad: false,
                    value: 5,
                    itemStyle: {color: "#02518a"},
                    time: sourceData[i].day_no
                });
            } else {
                if (useSelectDayNo == sourceData[i].day_no) {//如果选中时间和 当前时间相同 则选中当前时间
                    useOptions.data.push({
                        area_id: sourceData[i].area_id,
                        isBad: true,
                        value: 5,
                        itemStyle: {color: "red"},
                        time: sourceData[i].day_no,
                        isSelected: true
                    });
                } else {
                    useOptions.data.push({
                        area_id: sourceData[i].area_id,
                        isBad: true,
                        value: 5,
                        itemStyle: {color: "red"},
                        time: sourceData[i].day_no,
                        isSelected: false
                    });
                }
                useOptions.copyData.push({
                    area_id: sourceData[i].area_id,
                    isBad: true,
                    value: 5,
                    itemStyle: {color: "#02518a"},
                    time: sourceData[i].day_no
                });
            }
        }
        ;
        return useOptions;
    },
    /**
     * 加载时间轴数据
     * @param {*} id  id
     */
    loadTimeAxisData: function (id, selectDayNo) {
        app.showHideTimeAxis(true);
        $.ajax({
            url: BACK_SERVER_URL + "/gisController/queryAreaIdList",
            method: "get",
            data: {id: id},
            success: function (data) {
                if (data.data.length > 0) {
                    app.initTimeAxis(app.processTimeAxisData(data.data, selectDayNo));
                }
            }
        })
    },
    /**
     * 工单视图设置右侧工单详情
     */
    setOrderWorkDetailsContent: function (obj) {
        // 将图层控制按钮设置为不可选取
        app.indexLayersCloseFn();

        //避免出现undefined 或者null 的情况
        var nullUndefinedToNullString = function (str) {
            return str == null || str == undefined || str == "null" || str == "undefined" ? "" : str;
        }
        confirmor = "---";
        if(obj.userName){
            confirmor = obj.userName.join(',');
            confirmor = confirmor==""?"---":confirmor;
        }
        if(obj.a3.indexOf("</a>") !=-1){
            obj.a3 = obj.a3.replace("查看</a>","</a>");
        }
        var manageStatus = obj.a6&&!isNaN(obj.a6)?"已派单":"---";
        var html = '<i class="left-top"></i><i class="left-bottom"></i>\
                    <i class="top-left"></i><i class="bottom-left"></i>\
                    <i class="right-top"></i><i class="right-bottom"></i>\
                    <i class="top-right"></i><i class="bottom-right"></i>\
                    <div class="toolTips"><p>工单详情</p> <i class="right" id="order-work-details-close">×</i></div>';
        html += '<div class="order-work-details-box-ul-wrap"><ul class="height-collapse">'
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >工单编号：</div>\
            <div>' + nullUndefinedToNullString(obj.a1) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >工单类型：</div>\
            <div>' + nullUndefinedToNullString(obj.a2) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >本地网：</div>\
            <div>' + nullUndefinedToNullString(obj.a10) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >行政区：</div>\
            <div>' + nullUndefinedToNullString(obj.a11) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >问题位置：</div>\
            <div>' + nullUndefinedToNullString(obj.a8) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >问题现象：</div>\
            <div>' + nullUndefinedToNullString(obj.a3) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >覆盖户数：</div>\
            <div>' + nullUndefinedToNullString(obj.a4) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >覆盖场景：</div>\
            <div >' + nullUndefinedToNullString(obj.a5) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >反馈内容：</div>\
            <div>' + nullUndefinedToNullString(obj.a9) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >管理工单：</div>\
            <div>' + nullUndefinedToNullString(obj.a6) + '</div>\
        </li>';

        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >派单时间：</div>\
            <div>' + nullUndefinedToNullString(obj.a7) + '</div>\
        </li>';
        html += '<li>\
            <div class="ol-popup-content-table-left-justify" >派单状态：</div>\
            <div>' + manageStatus + '</div>\
        </li>';
        if(nullUndefinedToNullString(obj.a7)=="---"){
        }else{
            html += '<li>\
            <div class="ol-popup-content-table-left-justify" >派单对象：</div>\
            <div>' + confirmor + '</div>\
        </li>';
        }
        html += '\
        </ul></div><div class="supervise-button" onclick="app.supervise(' + JSON.stringify(obj).replace(/"/g, '&quot;') + ')">督办</div>';
        $("#order-work-details-box").show().html(html);

        $("#order-work-details-close").off("click").on("click", function () {
            app.setOrderWorkDetailsHide();
        });

        app.universalUnlimitedScroll("#order-work-details-box ul", app.orderWorkSingleDetailsTimmer);
    },
    /**
     * 工单视图 详情框隐藏
     */
    setOrderWorkDetailsHide: function () {
        $("#order-work-details-box").hide();
    },
    /**
     * 工单视图 单工单 详情 右上角tip 框是否显示
     */
    orderWorkDetailsBoxShowHide: function () {
        return !$("#order-work-details-box").is(":hidden");
    },
    /**
     * 工单视图 督办流程处理
     */
    supervise: function (obj) {
        var _this = this;
        console.log(_this.downType);
        console.log(obj);
        var param = {};
        if(obj.a6 == "未派单"){ // 督办生成单
            param.type = 1;
            param.orderId = obj.a1;
        }else { // 督办管理单
            param.type = 2;
            param.orderId = obj.a6;
        }

        $.ajax({
            url: BACK_SERVER_URL + "/ManageOrderController/checkSuperviseCnt",
            method: "get",
            data: param,
            success: function (data) {
                console.log(data);
                if(data.code == -1) {
                    layer.alert(data.msg, function(index){layer.close(index);});
                }else {
                    layer.confirm(data.msg, function(index){
                      //do something
                      $.ajax({
                          url: BACK_SERVER_URL + "/ManageOrderController/superviseOrder",
                          method: "get",
                          data: param,
                          success: function (data) {
                              layer.alert(data.msg, function(index){layer.close(index);});
                          }
                      });
                      layer.close(index);
                    });
                }
            }
        })

        if(_this.downType==1) { // 管理告警

        } else if (_this.downType==2) { // 生产告警

        } else if (_this.downType==3) { // 指标

        }

    },
    // 4g动画
    // 4g使用用户动画
    // anim4g: function() {
    //     setInterval(function() {
    //         var nameAttr = $("[name='unInner-anim']")
    //         if(nameAttr.attr("class") == "unInner-anim") {
    //             nameAttr.removeClass("unInner-anim");
    //             nameAttr.addClass("unInner-anim-end");
    //         }else {
    //             nameAttr.removeClass("unInner-anim-end");
    //             nameAttr.addClass("unInner-anim");
    //         }
    //     },8000);
    // },
};
var gisLegendObject = {
    /**
     * 切换图例
     * @param {*} index
     */
    switchLegend: function (index) {
        switch (index) {
            case 0:
                $(".cover-legend").hide();
                $(".mapFilter2Box2").hide();
                $(".super-busy").hide();
                $(".malfunction").hide();
                $(".order-work-legend-box").hide();
                $(".perception-legend").css("display", "inline-block");
//                $(".mapFilter2Box1").css("display", "inline-block");
                $(".mapFilter2Box1").hide();
                $(".rsrp-legend").hide();
                break;
            case 1:
                $(".cover-legend").hide();
                $(".mapFilter2Box2").css("display", "inline-block");
                $(".super-busy").hide();
                $(".malfunction").hide();
                $(".order-work-legend-box").hide();
                $(".perception-legend").hide();

//                $(".mapFilter2Box1").css("display", "inline-block");
                $(".mapFilter2Box1").hide();
                $(".rsrp-legend").hide();
                break;
            case 2:
                $(".cover-legend").hide();
                $(".mapFilter2Box2").hide();
                $(".super-busy").css("display", "inline-block");
                $(".malfunction").hide();
                $(".order-work-legend-box").hide();
                $(".perception-legend").hide();

//                $(".mapFilter2Box1").css("display", "inline-block");
                $(".mapFilter2Box1").hide();
                $(".rsrp-legend").hide();
                break;
            case 3:
                $(".cover-legend").hide();
                $(".mapFilter2Box2").hide();
                $(".super-busy").hide();
                $(".malfunction").css("display", "inline-block");
                $(".order-work-legend-box").hide();
                $(".perception-legend").hide();
//                $(".mapFilter2Box1").css("display", "inline-block");
                $(".mapFilter2Box1").hide();
                $(".rsrp-legend").hide();
                break;
            case 4:
                $(".cover-legend").hide();
                $(".mapFilter2Box2").hide();
                $(".super-busy").hide();
                $(".malfunction").hide();
                $(".order-work-legend-box").css("display", "inline-block");
                $(".perception-legend").hide();
//                $(".mapFilter2Box1").css("display", "inline-block");
                $(".mapFilter2Box1").hide();
                $(".rsrp-legend").hide();
                break;
            case 5:
                $(".cover-legend").hide();
                $(".mapFilter2Box2").hide();
                $(".super-busy").hide();
                $(".malfunction").hide();
                $(".order-work-legend-box").hide();
                $(".perception-legend").css("display", "inline-block");
                $(".mapFilter2Box1").hide();
                $(".rsrp-legend").hide();
                break;
            case 6:
                $(".cover-legend").hide();
                $(".mapFilter2Box2").hide();
                $(".super-busy").hide();
                $(".malfunction").hide();
                $(".order-work-legend-box").hide();
                $(".perception-legend").hide();
//                $(".mapFilter2Box1").css("display", "inline-block");
                $(".mapFilter2Box1").hide();
                $(".rsrp-legend").css("display", "inline-block");
                break;
        }
    },
    indexOrOrderWorkLegendSwitch: function (type) {
        switch (type) {
            case 'order-work':
                $(".mapFilter2").hide();
                $(".mapFilter3").show();
                break;
            case 'index':
                $(".mapFilter2").show();
                $(".mapFilter3").hide();
                break;
        }
    },
    orderWorkLegendController: function (_this) {
        if (_this.attr("ctag") == 2 || _this.attr("ctag") == 4) {
            if (_this.hasClass("gray")) {
                $(".blind-spot-box>li[image-class=basis]").hide();
                _this.addClass("gray");
            } else {
                $(".blind-spot-box>li[image-class=basis]").show();
                _this.removeClass("gray");
            }
        }
        if (_this.attr("ctag") == 10) {
            if (_this.hasClass("gray")) {
                $(".blind-spot-box>li[image-class=spot]").hide();
                _this.addClass("gray");
            } else {
                $(".blind-spot-box>li[image-class=spot]").show();
                _this.removeClass("gray");
            }
        }
    }

};
(function ($, window, document, undefined) {
    var urlParams = utils.getLocalURLParmas();
    var purviewId = urlParams.info?JSON.parse(urlParams.info):{cityIdList:0};
    app.purviewId = purviewId.cityIdList;
    app.purviewId= app.purviewId.replace(/\:/g,',')
    // app.cityId=app.purviewId.split(",")[0];
    var cityidstr=app.purviewId.split(",")
    app.cityId=cityidstr[0]
    window.onload = function () {
        setInterval(app.showNowTime, 1000);
        app.checkWarningEnable();
    };
    //地区联动
    var DefaultCity = [{id: -1, name: '全国'}, {id: 0, name: '新疆'}];
    var useCity = [{id:app.purviewId}];
    // app.areaLevelSelect('areaDrag', [{id: -1, name: '全国'}, {id: 0, name: '新疆'}]);
    app.areaLevelSelect('areaDrag', app.purviewId==0?DefaultCity:useCity);
    app.init(0, 0,app.cityId);//当前数据库中新疆默认ID为0
    app.initTop10TableAnimate();//工单滚动
    // app.anim4g();
    // 悬浮显示数字信息
    function moved(id, id2) {
        $(id).on('mouseenter', function () {
            $(this).addClass("rights");
            $(id2 + ' .alertWindow').addClass("show");
        }).on('mouseleave', function () {
            $(this).removeClass("rights");
            $(id2 + ' .alertWindow').removeClass("show");
        });
    }

    moved("#shigong", "#shigongs");
})(jQuery, window, document, undefined);
//取小数一位
function decimal(num,v){
    var vv = Math.pow(10,v);
    return Math.round(num*vv)/vv;
}
//获取工单类型下拉框
 function getordertypelist(yth_order_type){
     if(yth_order_type=="NPS感知进度"){
         yth_order_type="NPS"
     }else if(yth_order_type=="响应站及时率"){
         yth_order_type="响应类站"
     }else if(yth_order_type=="规划站及时率"){
         yth_order_type="规划类站"
     }else if(yth_order_type=="故障工单日清日结率"){
         yth_order_type="故障"
     }else if(yth_order_type=="容量工单日清日结率（软件扩容）"){
         yth_order_type="容量"
     }else if(yth_order_type=="质差工单日清日结率"){
         yth_order_type="质差"
     }else{
         yth_order_type=yth_order_type
     }
    $("#mapFilter,.ol-utils").hide();
     //'质差','容量','故障','规划类站','响应类站','NPS'
    $.getJSON(BACK_SERVER_URL+ "ManageOrderController/getOrderType?yth_order_type="+yth_order_type , function (lsdata) {
        var ordertypehtml='<option value="">直接选择或搜索选择</option>';
        console.log('lsdata',lsdata);
        for (var i=0;i<lsdata.length;i++){
            ordertypehtml+='<option value="'+lsdata[i].sys_source_order_type_name+'">'+lsdata[i].sys_source_order_type_name+'</option>'
        }
        $(".orderdrop").html(ordertypehtml)
    })
};
layui.use('laydate', function(){
    var laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#orderdate'
        ,range: true,
        format: 'yyyyMMdd'
        ,theme: '#0A5080'
    });
});
var exportorder = function(){
    var participation = $(".exportorder").attr('participation');
    var url = BACK_SERVER_URL+"/ManageOrderController/exportManagerOrder"+participation
    window.open(url);
}