;

$(function(){
    chenghuagis.currentDay = "20190107";
    chenghuagis.currentDateStr = playList[currentPlayIndex];
    chenghuagis.nativePlaceTab = "outside";
    chenghuagis.phoneNumberTab = "outside";
    chenghuagis.dailyTrendControlDateStr = "2019010701";

    //构建静态数据
    ChenghuagisFn.prototype.buildStaticData();

    //初始化GIS
    ChenghuagisFn.prototype.initGis();

    //初始化界面信息
    ChenghuagisFn.prototype.updatePageDataByDataStr(chenghuagis.currentDateStr);

    //绑定点击事件
    chenghuagis.blindClickEvent();
});

function ChenghuagisFn(){
}
function ChenghuagisDataFn(){
    this.userNumbersData = {2018122010:2131,2018122012:2146,2018122014:2304,2018122016:2549,2018122020:2282};
}
var chenghuagis = new ChenghuagisFn();
var chenghuagisData = new ChenghuagisDataFn();

//TODO 时间控件相关
var playList = ["2019010707","2019010708","2019010709","2019010710","2019010711","2019010712","2019010713","2019010714","2019010715","2019010716","2019010717","2019010718","2019010719"];
var currentPlayIndex = 0;
var timerTask;

//创建时间控件
function creatTimerTask(){
    if(timerTask){
        window.clearInterval(timerTask);
    }
    timerTask = window.setInterval(function(){
        currentPlayIndex++;
        if(currentPlayIndex >= playList.length){
            currentPlayIndex = 0;
        }
        ChenghuagisFn.prototype.updatePageDataByDataStr(playList[currentPlayIndex]);
    },3000);

    $(".timer-controller-box .timer-controller-box-start").removeClass("timer-controller-box-start").addClass("timer-controller-box-stop").attr("title","暂停");
    $(".timer-controller-box .timer-controller-box-stop").unbind().on("click",function(){
        stopTimerTask();
    });
}

//暂停时间控件
function stopTimerTask(){
    if(timerTask){
        window.clearInterval(timerTask);
    }

    $(".timer-controller-box .timer-controller-box-stop").removeClass("timer-controller-box-stop").addClass("timer-controller-box-start").attr("title","播放");

    $(".timer-controller-box .timer-controller-box-start").unbind().on("click",function(){
        creatTimerTask();
    });
}

//下一条
function nextPlay(){
    stopTimerTask();
    currentPlayIndex++;
    if(currentPlayIndex >= playList.length){
        currentPlayIndex = 0;
    }
    ChenghuagisFn.prototype.updatePageDataByDataStr(playList[currentPlayIndex]);
}

//上一条
function previousPlay(){
    stopTimerTask();
    currentPlayIndex--;
    if(currentPlayIndex < 0){
        currentPlayIndex = playList.length-1;
    }
    ChenghuagisFn.prototype.updatePageDataByDataStr(playList[currentPlayIndex]);
}

//TODO 绑定事件
ChenghuagisFn.prototype.blindClickEvent = function(){

    $(".center-controller-box .center-controller-time-box>.timer-controller-item").on("click",function(){
        ChenghuagisFn.prototype.updatePageDataByDataStr($(this).attr("value"));
        stopTimerTask();
    });

    $(".timer-controller-box .timer-controller-box-start").on("click",function(){
        creatTimerTask();
    });

    $(".timer-controller-box .timer-controller-box-stop").on("click",function(){
        stopTimerTask();
    });

    $(".timer-controller-box .timer-controller-box-next").on("click",function(){
        nextPlay();
    });

    $(".timer-controller-box .timer-controller-box-previous").on("click",function(){
        previousPlay();
    });

    $(".page-count-box-title>.select").on("click",function(){
             if($(this).is('.selected')){
                $(this).text("打开");
                $(this).removeClass("selected");
                $(this).parent('.page-count-box-title').siblings('.page-count-box-content').hide(500);
             } else {
                $(this).text("收起");
                $(this).addClass("selected");
                $(this).parent('.page-count-box-title').siblings('.page-count-box-content').show(500);
             }
    });

    $(".gis-controller-tab").on("click",function(){
        if($(this).attr('tab-data')=="map"){
            $("#map").hide();
            $("#migrationMap").show();
            $(this).attr('tab-data',"migrationMap");
            if(MigrationMap.map){
                MigrationMap.map.updateSize()
            } else {
                drawGotoAndFromSiChuanByDateStr(chenghuagis.currentDateStr);
            }
        } else {
            $("#migrationMap").hide();
            $("#map").show();
            $(this).attr('tab-data',"map");
             mygis.map.updateSize();
        }
    });

     $(".gis-controller-size").unbind().click(function(){
            if($(this).is('.max')){
                $(".page-box-left-panel").hide();
                $(".page-box-right-panel").hide();
                $(".page-box-cent-panel .page-count-box").hide();
                $(this).removeClass("max").addClass("min");
                $(".page-box-cent-panel").css("width","100%");
                $(".map").css("height","100%");
                $(".logo-box").css("left","10px");
                $(".people-number-box").css("right","10px");
                $(this).css({
                    top: "calc(100% - 74px)",
                    right: "5px"
                });

                $(".gis-controller-tab").css({
                    top: "calc(100% - 74px)",
                    right: "33px"
                });

                if(MigrationMap.map && $("#migrationMap").css("display") != "none"){
                    MigrationMap.map.updateSize()
                }

                mygis.map.updateSize();
            } else {
                $(".page-box-left-panel").show();
                $(".page-box-right-panel").show();
                $(".page-box-cent-panel .page-count-box").show();
                $(".page-box-cent-panel").css("width","calc(100% - 50%)");
                $(this).removeClass("min").addClass("max");
                $(".map").css("height","calc((100% - 30px)*2/3)");
                $(".logo-box").css("left","calc(25% + 10px)");
                $(".people-number-box").css("right","calc(25% + 10px)");
                $(this).css({
                    top: "calc((100% - 30px)*2/3 - 74px)",
                    right: "calc(25% + 5px)"
                });
                $(".gis-controller-tab").css({
                    top: "calc((100% - 30px)*2/3 - 74px)",
                    right: "calc(25% + 33px)"
                });

                if(MigrationMap.map && $("#migrationMap").css("display") != "none"){
                    MigrationMap.map.updateSize()
                }
                mygis.map.updateSize();
            }
        });

    $(".page-count-box-content .native-place-tab-outside").on("click",function(){
        $(this).parent('.page-count-box-content-tab-box').find(".selected").removeClass("selected");
        $(this).addClass("selected");
        chenghuagis.nativePlaceTab = "outside";
        drawNativePlaceConstitutionByDateStrAndType(chenghuagis.currentDateStr,chenghuagis.nativePlaceTab);
    });
    $(".page-count-box-content .native-place-tab-inside").on("click",function(){
        $(this).parent('.page-count-box-content-tab-box').find(".selected").removeClass("selected");
        $(this).addClass("selected");
        chenghuagis.nativePlaceTab = "inside";
        drawNativePlaceConstitutionByDateStrAndType(chenghuagis.currentDateStr,chenghuagis.nativePlaceTab);
    });
    $(".page-count-box-content .phone-number-tab-outside").on("click",function(){
        $(this).parent('.page-count-box-content-tab-box').find(".selected").removeClass("selected");
        $(this).addClass("selected");
        chenghuagis.phoneNumberTab = "outside";
        drawPhoneNumberAssignmentByDateStrAndType(chenghuagis.currentDateStr,chenghuagis.phoneNumberTab);
    });
    $(".page-count-box-content .phone-number-tab-inside").on("click",function(){
        $(this).parent('.page-count-box-content-tab-box').find(".selected").removeClass("selected");
        $(this).addClass("selected");
        chenghuagis.phoneNumberTab = "inside";
        drawPhoneNumberAssignmentByDateStrAndType(chenghuagis.currentDateStr,chenghuagis.phoneNumberTab);
    });

    $("#dailyTrendSelect").on("change",function(){
        chenghuagis.dailyTrendControlDateStr = $("#dailyTrendSelect").val();
        drawDailyTrendByDateStr(chenghuagis.currentDateStr,chenghuagis.dailyTrendControlDateStr);
    });
}

//在线用户数
ChenghuagisFn.prototype.setCurrentInsideNetUserNumber = function(number){
    var allWidth = $("#user-number-box").width();
    var nubmerStringArr  = (number+"").split("");
    var singleWidth = (allWidth/nubmerStringArr.length)-11;
    var html = "";
    for(var i=0,len=nubmerStringArr.length;i<len;i++){
        html += '<div class="single-card-box" style="width:'+singleWidth+'px"><span>'+nubmerStringArr[i]+'</span></div>'
    };
    $("#user-number-box").html(html);
}

//TODO 籍贯构成
ChenghuagisFn.prototype.initNativePlaceConstitutionBar = function(data){
//    var dataX = ['四川', '安徽', '河北', '山东', '河南', '北京', '重庆', '湖北', '湖南'];
//    var dataY = [92,138,108,168,182,74,95,62,128];
//    var title = "籍贯构成";
    var dataX = data.dataX;
    var dataY = data.dataY;
    var title = data.title;
    var color = '#ec9b42';
    var option = {
        title: {
            show: true,
            x: 'right',
            text: title,
            textStyle:{
                fontSize: 12,
                fontWeight: 'normal',
                color: color
            }
        },
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            y: 20,
            y2: 40,
            x: 20,
            x2: 20
        },
        xAxis: [
            {
                type: 'category',
                show: false,
                data: dataX
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: false
            }
        ],
        series: [
            {
                name: title,
                type: 'bar',
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
//                            var colorList = [
//                              '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
//                               '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
//                               '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
//                            ];
//                            return colorList[params.dataIndex]
                            return color;
                        },
                        label: {
                            show: true,
                            position: 'bottom',
                            formatter: '{b}\n{c}'
//                            formatter: '{b}'
                        },
                        barBorderRadius: [10,10,10,10]
                    }
                },
                data: dataY
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('nativePlaceConstitution'));
    myChart.setOption(option);
}

//TODO 号码归属
ChenghuagisFn.prototype.initPhoneNumberAssignmentBar = function(data){
//    var dataX = ['四川', '安徽', '河北', '山东', '河南', '北京', '重庆', '湖北', '湖南'];
//    var dataY = [114,90,128,106,182,126,95,75,128];
//    var title = "号码归属";
    var dataX = data.dataX;
    var dataY = data.dataY;
    var title = data.title;
    var color = '#3582de';
    var option = {
        title: {
            show: true,
            x: 'right',
            text: title,
            textStyle:{
                fontSize: 12,
                fontWeight: 'normal',
                color: color
            }
        },
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            y: 20,
            y2: 40,
            x: 20,
            x2: 20
        },
        xAxis: [
            {
                type: 'category',
                show: false,
                data: dataX
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: false
            }
        ],
        series: [
            {
                name: title,
                type: 'bar',
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
//                            var colorList = [
//                              '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
//                               '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
//                               '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
//                            ];
//                            return colorList[params.dataIndex]
                            return color;
                        },
                        label: {
                            show: true,
                            position: 'bottom',
                            formatter: '{b}\n{c}'
//                            formatter: '{b}'
                        },
                        barBorderRadius: [10,10,10,10]
                    }
                },
                data: dataY
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('phoneNumberAssignment'));
    myChart.setOption(option);
}

//TODO 人流分布
ChenghuagisFn.prototype.initJobSituationBar = function(data){
//    var data = [
//                   {value:335, name:'居住'},
//                   {value:310, name:'上班'},
//                   {value:234, name:'流动'},
//                   {value:135, name:'常驻'}
//               ];
    var title = " 职往情况";
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {color: '#FFF'},
            orient : 'vertical',
            x : 'right',
            y : 'bottom',
            data:['居住','上班','流动','常驻']
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'center',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name: title,
                type:'pie',
                radius : ['40%', '70%'],
                 itemStyle : {
                    normal : {
                        label : {
                            show : true,
                            formatter: '{b}\n{c}'
                        },
                        labelLine : {
                            show : true
                        },
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = ['#f26841','#f1f15b','#43d324','#28e1bf'];
                            return colorList[params.dataIndex];
                        },
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '16',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data: data
            }
        ]
    };

    var myChart = echarts.init(document.getElementById('jobSituation'));
    myChart.setOption(option);
}


//TODO 每日趋势
ChenghuagisFn.prototype.initDailyTrendBar = function(data){
//    var dateArr = ['日期：2018-12-13', '日期：2018-12-24'];
//    var dataX = ['7:00', '9:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
//    var dataY = [
//        [5,23,29,26,27,19,28],
//        [12,17,30,27,24,24,27]
//    ];
    var dateArr = data.dateArr;
    var dataX = data.dataX;
    var dataY = data.dataY;
    var markPoint = data.markPoint;
    var title = " 每日趋势";
    var option = {
        title : {
            show: false,
            text: title,
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data: dateArr,
            textStyle: {color: '#fff'},
            orient: 'vertical',
            x: 'right',
            y: 'top'
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : dataX,
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#81848c',//左边线的颜色
                        width:'1'//坐标线的宽度
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff',//坐标值得具体的颜色
                    },
                    rotate: 60,
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#81848c',//左边线的颜色
                        width:'1'//坐标线的宽度
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff',//坐标值得具体的颜色
                    }
                }
            }
        ],
        grid: {
            borderWidth: 0,
            x: 40,
            x2: 20
        },
        series : [
            {
                name: dateArr[0],
                type:'line',
                symbol: 'none',
                data: dataY[0],
                markPoint : {
                    data : [markPoint[0]]
                },
//                markLine : {
//                    data : [
//                        {type : 'average', name: '平均值'}
//                    ]
//                },
                 itemStyle: {
                     normal: {
                         color: '#08a7f0'
                     },
                     lineStyle: {
                         width: 2,
                     }
                 },
            },
            {
                name: dateArr[1],
                type:'line',
                symbol: 'none',
                data:dataY[1],
                markPoint : {
                    data : [markPoint[1]]
                },
//                markLine : {
//                    data : [
//                        {type : 'average', name : '平均值'}
//                    ]
//                },
                itemStyle: {
                     normal: {
                        color: '#f60907'
                     },
                     lineStyle: {
                        width: 2,
                     }
                },
            }
        ]
    };

    var myChart = echarts.init(document.getElementById('dailyTrend'));
    myChart.setOption(option);
}

//TODO 年龄分布
ChenghuagisFn.prototype.initAgeDistributionBar = function(data){
//    var dataY = ['60','40_60','25_40','18_25','18'];
//    var dataX = [56,106,172,252,136];
    var dataY = data.dataY;
    var dataX = data.dataX;
    var title = "年龄分布";
    var color = '#33b1da';
    var option = {
        title: {
            x: 'center',
            text: title,
//            subtext: '',
//            link: '',
            show: false
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params){
                        var result = "";
                        var name = params.name;
                        if(name == "18"){
                            result = "18岁以下";
                        } else if(name == "18_25"){
                            result = "18-25岁";
                        } else if(name == "25_40"){
                            result = "25-40岁";
                        } else if(name == "40_60"){
                            result = "40-60岁";
                        } else if(name == "60"){
                            result = "60岁以上";
                        } else {
                            result = "未知";
                        }
                        return result + "："+params.value;
                    }
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            y: 20,
            y2: 20,
            x: 60,
            x2: 20
        },
        xAxis: [
            {
                type: 'value',
                show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                show: true,
                data: dataY,
                splitLine: false,
                axisLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#080d23',//左边线的颜色
                        width:'1'//坐标线的宽度
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: color,//坐标值得具体的颜色
                    },
                    formatter: function (params){
                                var result = "";
                                var name = params;
                                if(name == "18"){
                                    result = "18岁以下";
                                } else if(name == "18_25"){
                                    result = "18-25岁";
                                } else if(name == "25_40"){
                                    result = "25-40岁";
                                } else if(name == "40_60"){
                                    result = "40-60岁";
                                } else if(name == "60"){
                                    result = "60岁以上";
                                } else {
                                    result = "未知";
                                }
                                return result;
                            }
                }
            }
        ],
        series: [
            {
                name: title,
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
//                            var colorList = [
//                              '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
//                               '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
//                               '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
//                            ];
//                            return colorList[params.dataIndex]
                            return color;
                        },
                        label: {
                            show: true,
                            position: 'right',
                            formatter: function (params){
                                var result = "";
                                var name = params.name;
                                if(name == "18"){
                                    result = "18岁以下";
                                } else if(name == "18_25"){
                                    result = "18-25岁";
                                } else if(name == "25_40"){
                                    result = "25-40岁";
                                } else if(name == "40_60"){
                                    result = "40-60岁";
                                } else if(name == "60"){
                                    result = "60岁以上";
                                } else {
                                    result = "未定义";
                                }
                                return params.value;
//                                return result;
                            },
                        },
                        barBorderRadius: [20,20,20,20]
                    }
                },
                data: dataX
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('ageDistribution'));
    myChart.setOption(option);
}

//TODO 人物偏好
ChenghuagisFn.prototype.initCharacterPreferenceBar = function(data){
//    var dataX = ['购物','上网','美食','旅游','运动'];
//    var dataY = [270,160,205,105,50];
    var dataX = data.dataX;
    var dataY = data.dataY;
    var title = "人物偏好";
    var color = '#f1f15b';
    var option = {
        title: {
            x: 'center',
            text: title,
            show: false
        },
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            y: 20,
            y2: 40,
            x: 40,
            x2: 20
        },
        xAxis: [
            {
                type: 'category',
                show: true,
                data: dataX,
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#81848c',//左边线的颜色
                        width:'1'//坐标线的宽度
                    }
                },
                axisLabel: {
                     show: false,
                    textStyle: {
                        color: '#fff',//坐标值得具体的颜色
                    }
                }
            }
        ],
        yAxis: [
            {
                show: true,
                type: 'value',
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#81848c',//左边线的颜色
                        width:'1'//坐标线的宽度
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',//坐标值得具体的颜色
                    }
                }
            }
        ],
        series: [
            {
                name: title,
                type: 'bar',
                barWidth: 30,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return color;
                        },
                        label: {
                            show: true,
                            position: 'bottom',
                            formatter: '{b}\n{c}'
                        },
                    }
                },
                data: dataY
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('characterPreference'));
    myChart.setOption(option);
}

//TODO 性别比例
ChenghuagisFn.prototype.initGenderRatioBar = function(data){
//    var data = [
//                   {value:600, name:'女性'},
//                   {value:800, name:'男性'},
//               ];
    var title = " 性别比例";
    var option = {
        title: {
            show: true,
            x: 'center',
            text: title,
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
                fontFamily: 'SimHei',
                color: '#fff'
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {color: '#FFF'},
            orient : 'vertical',
            x : 'right',
            y : 'bottom',
            data:['女性','男性', '未知']
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'center',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name: title,
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : true,
                            formatter: '{b}\n{c}'
                        },
                        labelLine : {
                            show : true
                        },
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = ['#ec9b42','#3582de','#f26841'];
                            return colorList[params.dataIndex];
                        },
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '16',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data: data
            }
        ]
    };

    var myChart = echarts.init(document.getElementById('genderRatio'));
    myChart.setOption(option);
}

//TODO 交通方式
/*交通方式*/
ChenghuagisFn.prototype.initModeOfTransportationBar = function(data){
//    var data = [
//                   {value:100, name:'飞机'},
//                   {value:30, name:'高铁'},
//                   {value:70, name:'汽车'},
//               ];
    var title = " 交通方式";
    var option = {
        title: {
            show: true,
            x: 'center',
            text: title,
            textStyle: {
                fontSize: 16,
                fontWeight: 'normal',
                fontFamily: 'SimHei',
                color: '#fff'
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            textStyle : {color: '#FFF'},
            orient : 'vertical',
            x : 'right',
            y : 'bottom',
            data:['飞机','高铁','汽车']
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'center',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name: title,
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : true,
                            formatter: '{b}\n{c}'
                        },
                        labelLine : {
                            show : true
                        },
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = ['#f26841','#f1f15b','#43d324'];
                            return colorList[params.dataIndex];
                        },
                    },
                    emphasis : {
                        label : {
                            show : true,
                                position : 'center',
                            textStyle : {
                                fontSize : '16',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data: data
            }
        ]
    };

    var myChart = echarts.init(document.getElementById('modeOfTransportation'));
    myChart.setOption(option);
}

//TODO 按照时间字符串更新界面信息
//按照时间字符串更新界面信息
ChenghuagisFn.prototype.updatePageDataByDataStr = function(dateStr){
    $('.center-controller-time-box').find(".timer-controller-item").removeClass("selected");
    $('.center-controller-time-box [value='+dateStr+']').addClass("selected");

    //重置当前显示时间字符串
    chenghuagis.currentDateStr = dateStr;

    //加载籍贯构成统计面板
    drawNativePlaceConstitutionByDateStrAndType(dateStr,chenghuagis.nativePlaceTab);

    //加载号码归属统计面板
    drawPhoneNumberAssignmentByDateStrAndType(dateStr,chenghuagis.phoneNumberTab);

    //加载职往情况统计面板
    drawJobSituationByDateStr(dateStr);

    //加载每日趋势统计面板
    drawDailyTrendByDateStr(dateStr,chenghuagis.dailyTrendControlDateStr);

    //加载年龄分布统计面板
    drawAgeDistributionByDateStr(dateStr);

    //加载人物偏好统计面板
    drawCharacterPreferenceByDateStr(dateStr);

    //加载性别比例统计面板
    drawGenderRatioByDateStr(dateStr);

    //加载交通方式统计面板
    drawModeOfTransportationByDateStr(dateStr);

    //加载在线用户数面板
    drawOnlineUserNumByDateStr(dateStr);

    //加载热力图
    drawHeatDataByDateStr(dateStr);

    //迁徙图
    if( $("#migrationMap").css("display") != "none"){
        drawGotoAndFromSiChuanByDateStr(dateStr);
    }
}

//根据时间绘制在线用户数
function drawOnlineUserNumByDateStr(dateStr){
    var userNumber = chenghuagisData.userNumbersData[dateStr];
    if(userNumber){
        userNumber = Number(userNumber);
    } else {
        userNumber = 2131;
//        $.messager.alert('提示信息','无相关数据');
    }

    chenghuagis.setCurrentInsideNetUserNumber(userNumber);
}

//根据时间绘制职往统计
function drawJobSituationByDateStr(dateStr){
    var data = chenghuagisData.jobSituationData[dateStr];
    if(data){
        var parseData = [
                       {value:Number(data[0][2]), name:'居住'},
                       {value:Number(data[0][3]), name:'上班'},
                       {value:Number(data[0][4]), name:'常驻'},
                       {value:Number(data[0][5]), name:'流动'}
                   ];

        ChenghuagisFn.prototype.initJobSituationBar(parseData);
    } else {
        console.error("无指定数据");
    }
}

//根据时间绘制性别比例
function drawGenderRatioByDateStr(dateStr){
    var data = chenghuagisData.genderRatioData[dateStr];
    if(data){
        var parseData = [
                       {value:0, name:'女性'},
                       {value:0, name:'男性'},
                       {value:0, name:'未知'}
                   ];
        data.forEach(e => {
             if(e[1] == "女"){
                 parseData[0].value = Number(e[2]);
             }

             else if(e[1] == "男"){
                parseData[1].value = Number(e[2]);
             }

              else {
                parseData[2].value = Number(e[2]);
             }
        });

        ChenghuagisFn.prototype.initGenderRatioBar(parseData);
    } else {
        console.error("无指定数据");
    }
}

//根据时间绘制交通方式
function drawModeOfTransportationByDateStr(dateStr){
    var data = chenghuagisData.modeOfTransportationData[dateStr];
    if(data){
        var parseData = [
                          {value:0, name:'飞机'},
                          {value:0, name:'高铁'},
                          {value:0, name:'汽车'},
                      ];
        data.forEach(e => {
             if(e[1] == "飞机"){
                 parseData[0].value = Number(e[2]);
             }

             if(e[1] == "高铁"){
                parseData[1].value = Number(e[2]);
             }

             if(e[1] == "汽车"){
                parseData[2].value = Number(e[2]);
             }
        });

        ChenghuagisFn.prototype.initModeOfTransportationBar(parseData);
    } else {
        console.error("无指定数据");
    }
}

//根据时间绘制每日趋势
function drawDailyTrendByDateStr(dateStr1,dateStr2){
    var timeStr = Number(dateStr1.substring(8,10))+":00";
    var dateStr1 = dateStr1.substring(0,8);
    var dateStr2 = dateStr2.substring(0,8);
    var data1 = chenghuagisData.dailyTrendData[dateStr1];
    var data2 = chenghuagisData.dailyTrendData[dateStr2];
    if(data1 && data2){
        var parseData = {};
        parseData.dateArr = [
        '日期：'+dateStr1.substring(0,4)+"-"+dateStr1.substring(4,6)+"-"+dateStr1.substring(6,8),
        '日期：'+dateStr2.substring(0,4)+"-"+dateStr2.substring(4,6)+"-"+dateStr2.substring(6,8),
         ];
        parseData.dataX = ['7:00','8:00', '9:00','10:00', '11:00','12:00', '13:00','14:00', '15:00','16:00', '17:00','18:00', '19:00'];
        parseData.dataY = [[],[]];
        parseData.dataX.forEach(e => {
            parseData.dataY[0].push(data1[e]);
            parseData.dataY[1].push(data2[e]);
        });
        parseData.markPoint = [
                                {name: timeStr,value: parseData.dataY[0][parseData.dataX.indexOf(timeStr)],xAxis: timeStr, yAxis:  parseData.dataY[0][parseData.dataX.indexOf(timeStr)]}
                                ,{name: timeStr,value: parseData.dataY[1][parseData.dataX.indexOf(timeStr)],xAxis: timeStr, yAxis:  parseData.dataY[1][parseData.dataX.indexOf(timeStr)]}
                            ];
        ChenghuagisFn.prototype.initDailyTrendBar(parseData);
    } else {
        console.error("无指定数据");
    }
}

//根据时间绘制年龄分布
function drawAgeDistributionByDateStr(dateStr){
    var data = chenghuagisData.ageDistributionData[dateStr];
    if(data){
        var parseData ={dataY:[],dataX:[]};
        var list =  data.dataList.sort()
        var temp = 0;

        parseData.dataX.push(temp);
        parseData.dataY.push("未知");
        list.forEach(e => {
            if(e == "未知"){
                temp = data[e];
            } else {
                parseData.dataY.push(e);
                parseData.dataX.push(data[e]);
            }
        });
        parseData.dataX[0] = temp;
        ChenghuagisFn.prototype.initAgeDistributionBar(parseData);
    } else {
        console.error("无指定数据");
    }
}

//根据时间绘制人物偏好
function drawCharacterPreferenceByDateStr(dateStr){
    var data = chenghuagisData.characterPreferenceData[dateStr];
    if(data){
        var parseData ={dataY:[],dataX:[]};
        data.forEach(e => {
            parseData.dataX.push(e[1]);
            parseData.dataY.push(e[2]);
        });
        ChenghuagisFn.prototype.initCharacterPreferenceBar(parseData);
    } else {
        console.error("无指定数据");
    }
}

//根据时间和类型绘制电话归属
function drawPhoneNumberAssignmentByDateStrAndType(dateStr,typeName){
    if(typeName == "inside"){
        var data = chenghuagisData.phoneNumberAssignmentData.inside[dateStr];
        if(data){
            var parseData ={dataY:[],dataX:[],title:""};
            var rows = data.sort(compare("number"));
            rows = rows.slice(0,10);
            rows.forEach(e => {
                parseData.dataX.push(e["name"]);
                parseData.dataY.push(e["number"]);
            });
            ChenghuagisFn.prototype.initPhoneNumberAssignmentBar(parseData);
        } else {
            console.error("无指定数据");
        }
    } else if(typeName == "outside"){
        var data = chenghuagisData.phoneNumberAssignmentData.outside[dateStr];
        if(data){
            var parseData ={dataY:[],dataX:[],title:""};
            var rows = data.sort(compare("number"));
            rows = rows.slice(0,11);
            rows.forEach(e => {
                 if(e["name"] == "四川"){
                    parseData.title = "四川：" + e["number"];
                 } else {
                    parseData.dataY.push(e["number"]);
                    parseData.dataX.push(e["name"]);
                 }
            });
            ChenghuagisFn.prototype.initPhoneNumberAssignmentBar(parseData);
        } else {
            console.error("无指定数据");
        }
    }

    //排序辅助函数，倒序
    function compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        }
    }
}

//根据时间和类型绘制籍贯构成
function drawNativePlaceConstitutionByDateStrAndType(dateStr,typeName){
    if(typeName == "inside"){
        var data = chenghuagisData.nativePlaceConstitutionData.inside[dateStr];
        if(data){
            var parseData ={dataY:[],dataX:[],title:""};
            var rows = data.sort(compare("number"));
            rows = rows.slice(0,10);
            rows.forEach(e => {
                parseData.dataX.push(e["name"]);
                parseData.dataY.push(e["number"]);
            });
            ChenghuagisFn.prototype.initNativePlaceConstitutionBar(parseData);
        } else {
            console.error("无指定数据");
        }
    } else if(typeName == "outside"){
        var data = chenghuagisData.nativePlaceConstitutionData.outside[dateStr];
        if(data){
            var parseData ={dataY:[],dataX:[],title:""};
            var rows = data.sort(compare("number"));
            var sichaunNum = 0;
            var undefineNum = 0;
            rows = rows.slice(0,11);
            rows.forEach(e => {
                 if(e["name"] == "四川"){
                    sichaunNum = Number(e["number"]);
                 } else if(e["name"] == "未知"){
                    undefineNum = Number(e["number"]);
                 } else {
                    parseData.dataY.push(e["number"]);
                    parseData.dataX.push(e["name"]);
                 }
            });

            parseData.title = "四川：" + sichaunNum + "  " + (undefineNum==0?"":("未知："+ undefineNum));

            ChenghuagisFn.prototype.initNativePlaceConstitutionBar(parseData);
        } else {
            console.error("无指定数据");
        }
    }

    //排序辅助函数，倒序
    function compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        }
    }
}

//根据时间绘制来源，去向
function drawGotoAndFromSiChuanByDateStr(dateStr){
    var gotoData = chenghuagisData.sourceGoToSiChuan[dateStr];//来源
    var fromData = chenghuagisData.sourceFromSiChuan[dateStr];//去向
    var parseData = [['东郊记忆', fromData, true],['四川', gotoData, false]];
    MigrationMap.initMigrationMap(parseData);
}

//TODO 构建静态数据
//构建静态数据
ChenghuagisFn.prototype.buildStaticData = function(){
    buildHeatData();
    buildJobSituationData();
    buildGenderRatioData();
    buildModeOfTransportationData();
    buildDailyTrendData();
    buildAgeDistributionData();
    buildCharacterPreferenceData();
    buildPhoneNumberAssignmentData();
    buildNativePlaceConstitutionData();
    buildSourceGoToSiChuanData();
    buildSourceFromSiChuanData();
    buildProvincePositionSiChuanData();
}

//构建静态热力图数据
function buildHeatData(){
    var rows = heatDataStr.split("|");
    var data = {dateList:[]};

    rows.forEach(e => {
        var arr = e.split(",");

        //火星坐标转换
        var p = ExtendUtil.gps84ToGcj02(arr[1],arr[2]);
        arr[1] = p.x;
        arr[2] = p.y;
        if(!data[arr[0]]){
            data.dateList.push(arr[0]);
            data.dateList = data.dateList.sort();
            data[arr[0]] = [];
        }
        data[arr[0]].push(arr);
    });
    chenghuagisData.heatData = data;
}

//构建静态人流分布
 function buildJobSituationData(){
     var rows = jobSituationDataStr.split("|");
     var data = {};

     //在线用户数
     chenghuagisData.userNumbersData = {};

     rows.forEach(e => {
         var arr = e.split(",");
         if(!data[arr[0]]){
             data[arr[0]] = [];
         }
         data[arr[0]].push(arr);

         chenghuagisData.userNumbersData[arr[0]] = Number(arr[1]);
     });
     chenghuagisData.jobSituationData = data;
 }

 //构建性别比例数据
 function buildGenderRatioData(){
     var rows = genderRatioDataStr.split("|");
     var data = {};
     rows.forEach(e => {
         var arr = e.split(",");
         if(!data[arr[0]]){
             data[arr[0]] = [];
         }
         data[arr[0]].push(arr);
     });
     chenghuagisData.genderRatioData = data;
 }

 //构建交通方式数据
 function buildModeOfTransportationData(){
     var rows = modeOfTransportationDataStr.split("|");
     var data = {};
     rows.forEach(e => {
         var arr = e.split(",");
         if(!data[arr[0]]){
             data[arr[0]] = [];
         }
         data[arr[0]].push(arr);
     });
     chenghuagisData.modeOfTransportationData = data;
 }

 //构建每日趋势数据
 function buildDailyTrendData(){
     var rows = dailyTrendDataStr.split("|");
     var data = {};
     rows.forEach(e => {
         var arr = e.split(",");
         if(!data[arr[0]]){
             data[arr[0]] = {dateList:[]};
         }
         arr[1] = Number(arr[1].substring(8,10))+":00"
         data[arr[0]][arr[1]] = Number(arr[2]);
         data[arr[0]].dateList.push(arr[1]);
     });

     chenghuagisData.dailyTrendData = data;

    //对照选框
    $("#dailyTrendSelect").empty();
    for(var item in data){
        $("#dailyTrendSelect").append("<option value='"+item+"'>"+item+"</option>");
    }
    chenghuagis.dailyTrendControlDateStr = $("#dailyTrendSelect").val();
 }

 //构建年龄分布数据
 function buildAgeDistributionData(){
     var rows = ageDistributionDataStr.split("|");
     var data = {};
     rows.forEach(e => {
         var arr = e.split(",");
         if(!data[arr[0]]){
              data[arr[0]] = {dataList:[]};
         }
        data[arr[0]][arr[1]] = Number(arr[2]);
        data[arr[0]].dataList.push(arr[1]);
     });
     chenghuagisData.ageDistributionData = data;
 }

 //构建人物偏好数据
 function buildCharacterPreferenceData(){
     var rows = characterPreferenceDataStr.split("|");
     var data = {};
     rows.forEach(e => {
         var arr = e.split(",");
         if(!data[arr[0]]){
              data[arr[0]] = [];
         }
        data[arr[0]][Number(arr[3])-1] = arr;
     });
     chenghuagisData.characterPreferenceData = data;
 }

 //构建号码归属数据
 function buildPhoneNumberAssignmentData(){
     var insideRows = phoneNumberAssignmentProvinceInsideDataStr.split("|");
     var outsideRows = phoneNumberAssignmentProvinceOutsideDataStr.split("|");
     var data = {inside:{},outside:{}};

     insideRows.forEach(e => {
         var arr = e.split(",");
         var row = {};
         if(!data.inside[arr[0]]){
              data.inside[arr[0]] = [];
         }
         row["date"] = arr[0];
         row["name"] = arr[2];
         row["number"] = arr[3];
         data.inside[arr[0]].push(row);
     });
     outsideRows.forEach(e => {
         var arr = e.split(",");
         var row = {};
         if(!data.outside[arr[0]]){
              data.outside[arr[0]] = [];
         }
         row["date"] = arr[0];
         row["name"] = arr[1];
         row["number"] = arr[2];
         data.outside[arr[0]].push(row);
     });
     chenghuagisData.phoneNumberAssignmentData = data;
 }

 //构建籍贯构成数据
 function buildNativePlaceConstitutionData(){
     var insideRows = nativePlaceConstitutionInsideDataStr.split("|");
     var outsideRows = nativePlaceConstitutionOutsideDataStr.split("|");
     var data = {inside:{},outside:{}};

     insideRows.forEach(e => {
         var arr = e.split(",");
         var row = {};
         if(!data.inside[arr[0]]){
              data.inside[arr[0]] = [];
         }
         row["date"] = arr[0];
         row["name"] = arr[1];
         row["number"] = arr[2];
         data.inside[arr[0]].push(row);
     });
     outsideRows.forEach(e => {
         var arr = e.split(",");
         var row = {};
         if(!data.outside[arr[0]]){
              data.outside[arr[0]] = [];
         }
         row["date"] = arr[0];
         row["name"] = arr[1];
         row["number"] = arr[2];
         data.outside[arr[0]].push(row);
     });
     chenghuagisData.nativePlaceConstitutionData = data;
 }


 //构建来源数据
 function buildSourceGoToSiChuanData(){
     var rows = nativePlaceConstitutionOutsideDataStr.split("|");
     var data = {};
     rows.forEach(e => {
         var arr = e.split(",");
         if(!data[arr[0]]){
              data[arr[0]] = [];
         }
         if(arr[1] != "四川" && arr[1] != "未知"){
            var row = [{name:"四川"},{name:arr[1],value:Number(arr[2])}];
            data[arr[0]].push(row);
         }
     });
     chenghuagisData.sourceGoToSiChuan = data;
 }

  //构建去向数据
  function buildSourceFromSiChuanData(){
      var rows = sourceFromSiChuanDataStr.split("|");
      var data = {};
      rows.forEach(e => {
          var arr = e.split(",");
          if(!data[arr[0]]){
               data[arr[0]] = [];
          }
          if(arr[1] != "东郊记忆"){
             var row = [{name:'东郊记忆'},{name:arr[1],value:Number(arr[2])}];
             data[arr[0]].push(row);
          }
      });

      chenghuagisData.sourceFromSiChuan = data;
  }


  //构建省份位置
  function buildProvincePositionSiChuanData(){
      var rows = provincePositionDataStr.split("|");
      var data = {
                     "四川": [104.1205382800,30.6711031800],
                     "东郊记忆": [104.1205382800,30.6711031800],
                     "春熙路": [104.0768984300,30.6574078300],
                     "成都动物园": [104.1031666200,30.7125347400],
                     "熊猫基地": [104.1421781700,30.7396945100],
                     "电子科大": [104.0976971700,30.6781022200]
                 };
      rows.forEach(e => {
          var arr = e.split(",");
          data[arr[0]] = [arr[2],arr[1]];
      });

      //转火星坐标
      for(var item in data){
        var p = ExtendUtil.gps84ToGcj02(data[item][0],data[item][1]);
        data[item] =  [p.x,p.y];
      }
      MigrationMap.geoCoordMap = data;
  }