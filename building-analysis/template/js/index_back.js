var url_root = Common.url_server_root;
var FieldNames = {
    "60分钟以下": "retention_time_60m",
    "1-2小时": "retention_time_2h",
    "2-4小时": "retention_time_4h",
    "4小时以上": "retention_time_4h_more",
    "苹果": "apple_terminal_cnt",
    "安卓": "android_terminal_cnt",
    "华为": "huawei_terminal_cnt",
    "OPPO": "oppo_terminal_cnt",
    "小米": "xiaomi_terminal_cnt",
    "vivo": "vivo_terminal_cnt",
    "其他": "other_terminal_cnt",
    "社交": "social_app_cnt",
    "游戏": "gaem_app_cnt",
    "购物": "shopping_app_cnt",
    "移动支付": "payment_app_cnt",
    "影视": "movies_app_cnt",
    "新闻": "news_app_cnt",
    "旅行": "travel_app_cnt",
    "淘宝": "shopping_tb_cnt",
    "京东": "shopping_jd_cnt",
    "天猫": "shopping_tm_cnt",
    "亚马逊": "shopping_ymx_cnt",
    "河马": "shopping_hm_cnt",
    "苏宁": "shopping_sl_cnt",
    "单身贵族":"single_nct",
    "二人世界":"lovers_cnt",
    "家有老人":"family_old_cnt",
    "家有儿童":"family_children_cnt",
    "孕妇家庭":"family_baby_cnt",
    "上班族":"work_user_cnt",
    "自由职业":"live_user_cnt",
    "无职业":"permanent_user_cnt",
    "18岁以下":"age_0_18_cnt",
    "18-25岁":"age18_25_cnt",
    "25-40岁":"age_25_40_cnt",
    "40岁以上":"old_age_cnt",
    "男":"man_cnt",
    "女":"women_cnt",
    "汽车":"drive_trip_cnt",
    "地铁":"metro_trip_cnt",
    "公交":"transit_trip_cnt",
    "步行":"walk_trip_cnt",
    "低消费":"low_consumption_cnt",
    "中消费":"moderate_consumption_cnt",
    "高消费":"high_consumption_cnt",
}
$(function () {
    wisdomManage.bindTimeDaySelect();
    // 驻留时间到访
    // wisdomManage.dwellTime();
    wisdomManage.setPeopleFlowCount({
        currentPeopleNumber: 1234,
        currentPeopleNumberIsTop: false,
        currentPeopleRotate: 5,
        allNumber: 2295,
        allNumberIsTop: "",
        allRotate: "",
        insideNumber: 71,
        insideNumberIsTop: true,
        insideRotate: 8
    });
    // 终端占比及使用偏好柱状图
    // wisdomManage.preferencesBar();
    // 终端占比及使用偏好折线图
    // wisdomManage.preferencesPie();
    // 男性到访明细表格的隐藏 20200516 新增加方法
    wisdomManage.changeTableStatus();
    // 下拉框切换展示 20200516 新增加方法
    wisdomManage.selectChange();
    // 小时人流统计
    $.ajax({
        url: url_root + '/demo/getDayData?day_no=' + wisdomManage.day+"&type="+wisdomManage.type,
        success: function (data) {
            if (data) {
                wisdomManage.peopleCounHours(data);
            }
        }
    });
    wisdomManage.setResideBar({});
    wisdomManage.setResideAvager({time: 1.5, isTop: false, rate: 5});
    wisdomManage.setSexRotate(58, 42);
    wisdomManage.setAgePie({});
    wisdomManage.setFailyPie({
        "family_baby_rate": "30",
        "single_rate": "20",
        "lovers_rate": "15",
        "family_old_rate": "15",
        "family_children_rate": "20"
    });
// 家庭组成及来源小区分布
//     wisdomManage.distribution();
    // wisdomManage.setClientRotate({});
    // wisdomManage.setUsePreferences({});
//   wisdomManage.initTimeLine({});
    wisdomManage.initDetail(wisdomManage.field);
    wisdomManage.queryData(wisdomManage.day + wisdomManage.startTime, wisdomManage.day + wisdomManage.endTime);
    wisdomManage.queryTimeLine();
    gis.init(wisdomManage.day+wisdomManage.startTime,wisdomManage.day+wisdomManage.endTime,wisdomManage.field, wisdomManage.type);
    $("#open-button").on("click", function () {
        var isOpen = $(this).attr("data-open");
        if (isOpen == 1) {
            $(this).addClass("close").attr("data-open", 0);
            $("#detail-data-box").addClass("close").removeClass("open");
            $('.table-title').css("background-color","#00000000");
        } else {
            $(this).removeClass("close").attr("data-open", 1);
            $("#detail-data-box").addClass("open").removeClass("close");
            $('.table-title').css("background-color","rgba(23,50,112,0.6)");
        }
    })
});


function WisdomManageFn(start,end) {
    this.day = start.toString().substr(0,8);
    this.startTime = start.toString().substr(8,10);
    this.endTime = end.toString().substr(8,10);
    this.historyData = {};
    this.field = "";
    this.fieldName = "";
    this.type = 1;
}

WisdomManageFn.prototype.judgeIsTop = function (bool) {
    if (bool === true || bool === false) {
        return bool ? '<svg  viewBox="0 0 1024 1024"   width="12" height="12">\
        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
      </svg>' : '<svg  viewBox="0 0 1024 1024"   width="12" height="12">\
      <path d="M630.186667 596.138667h201.002666L530.218667 938.666667 213.333333 596.138667h214.186667V85.333333h202.666667v510.805334z" fill="red" p-id="4144"></path>\
    </svg>';
    } else {
        return "";
    }
}

WisdomManageFn.prototype.setPeopleFlowCount = function (data) {
    var currentPlepeoData = '<div class="target-number">' + data.currentPeopleNumber + '</div>\
  <div class="target-rate">\
    ' + this.judgeIsTop(data.currentPeopleNumberIsTop) + '\
    <span class="' + (data.currentPeopleNumberIsTop ? 'top' : 'bottom') + '">' + data.currentPeopleRotate + '%</span>\
  </div>';
    var allPlepeo = '<div class="target-number">' + data.allNumber + '</div>\
  <div class="target-rate">\
    ' + this.judgeIsTop(data.allNumberIsTop) + '\
    <span class="' + (data.allNumberIsTop ? 'top' : 'bottom') + '">' + data.allRotate + '</span>\
  </div>';
    var insideRate = '<div class="target-number">' + data.insideNumber + '</div>\
  <div class="target-rate">\
  ' + this.judgeIsTop(data.insideNumberIsTop) + '\
    <span class="' + (data.insideNumberIsTop ? 'top' : 'bottom') + '">' + data.insideRotate + '%</span>\
  </div>';
    var currentPlepeoData2 = '<div class="target-number">' + (data.currentPeopleNumber2?data.currentPeopleNumber2:0) + '分钟</div>\
  <div class="target-rate">\
    ' + this.judgeIsTop(data.currentPeopleNumberIsTop2) + '\
    <span class="' + (data.currentPeopleNumberIsTop2 ? 'top' : 'bottom') + '">' + (data.currentPeopleRotate2?data.currentPeopleRotate2:0) + '%</span>\
  </div>';
    var allPlepeo2 = '<div class="target-number">' + (data.allNumber2?data.allNumber2 :0) + '%</div>\
  <div class="target-rate">\
    ' + this.judgeIsTop(data.allNumberIsTop2) + '\
    <span class="' + (data.allNumberIsTop2 ? 'top' : 'bottom') + '">' + data.allRotate2 + '</span>\
  </div>';
    var insideRate2 = '<div class="target-number">' + (data.insideNumber2?data.insideNumber2:0) + '%</div>\
  <div class="target-rate">\
  ' + this.judgeIsTop(data.insideNumberIsTop2) + '\
    <span class="' + (data.insideNumberIsTop2 ? 'top' : 'bottom') + '">' + data.insideRotate2 + '%</span>\
  </div>';
    $("#current-plepeo").html(currentPlepeoData);
    $("#all-plepeo").html(allPlepeo);
    $("#inside-rate").html(insideRate);
    $("#current-plepeo2").html(currentPlepeoData2);
    $("#all-plepeo2").html(allPlepeo2);
    $("#inside-rate2").html(insideRate2);
}

WisdomManageFn.prototype.setResideBar = function (obj) {
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['驻留时长'],
            show: false
        },
        grid: {
            top: 0,
            left: 0,
            bottom: '5%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: "white"
                    }
                },
                data: ['4小时以上', '2-4小时', '1-2小时', '1小时以下']
            }
        ],
        series: [
            {
                name: '驻留时长',
                type: 'bar',
                label: {
                    show: true,
                    position: 'insideLeft'
                },
                barWidth: '15%',
                // obj.retention_time_60m, obj.retention_time_2h, obj.retention_time_4h, obj.retention_time_4h_more
                data: [
                    {value: obj.retention_time_4h_more, itemStyle: {color: "#76d3a6"}},
                    {value: obj.retention_time_4h, itemStyle: {color: "#5aabe2"}},
                    {value: obj.retention_time_2h, itemStyle: {color: "#cd3158"}},
                    {value: obj.retention_time_60m, itemStyle: {color: "#56aee0"}}]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('reside-bar'));
    myChart.setOption(option);
    var _this = this;
    myChart.off("click");
    myChart.on('click', function (param) {
        _this.fieldName = param.name;
        if (param.name == "1小时以下") {
            _this.selectField('retention_time_60m')
        } else if (param.name == "1-2小时") {
            _this.selectField('retention_time_2h')
        } else if (param.name == "2-4小时") {
            _this.selectField("retention_time_4h")
        } else if (param.name == "4小时以上") {
            _this.selectField("retention_time_4h_more")
        }
    });
}

WisdomManageFn.prototype.setResideAvager = function (data) {
    var rediseAvager = '<div class="redise-number">' + data.time + 'h</div>\
  <div class="redise-rate">\
   ' + this.judgeIsTop(data.isTop) + '\
    <span>' + data.rate + '%</span>\
  </div>';
    $("#redise-avager").html(rediseAvager);
}
WisdomManageFn.prototype.setSexRotate = function (man, woman) {
    $("#man").html(man);
    $("#woman").html(woman);
}
WisdomManageFn.prototype.setAgePie = function (obj) {
    var option = option = {
        tooltip: {},
        grid: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        legend: {
            orient: 'horizontal',
            data: ['18岁以下', '18-25岁', '25-40岁', '40岁以上'],
            right: "5%",
            top: '10%',
            itemWidth: 10,
            itemHeight: 10,
            icon: "circle",
            textStyle: {
                color: "#a7bdd3"
            },
            width: 80
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['45%', '50%'],
                data: [
                    {value: obj.age_0_18_rate, name: '18岁以下', itemStyle: {color: "#4a7fdd"}},
                    {value: obj.age18_25_rate, name: '18-25岁', itemStyle: {color: "#4db9a1"}},
                    {value: obj.age_25_40_rate, name: '25-40岁', itemStyle: {color: "#b85cf2"}},
                    {value: obj.old_age_rate, name: '40岁以上', itemStyle: {color: "#d2a41d"}}
                ],
                label: {
                    show: false,
                    position: 'center',
                    formatter: params => {
                        return (
                            (params.name) + '\n' + (params.value) + '%'
                        );
                    },
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 10,
                        // fontWeight: 'bold'
                    }
                },
            }
        ]
    };
    ;
    var myChart = echarts.init(document.getElementById('age-pie'));
    myChart.setOption(option);
    $('#man').html(obj.man_rate);
    $('#woman').html(obj.woman_rate);
    var _this = this;
    myChart.off("click");
    myChart.on('click', function (param) {
        _this.fieldName = param.name;
        if (param.name == "18岁以下") {
            _this.selectField('age_0_18_cnt')
        } else if (param.name == "18-25岁") {
            _this.selectField('age18_25_cnt')
        } else if (param.name == "25-40岁") {
            _this.selectField('age_25_40_cnt')
        } else if (param.name == "40岁以上") {
            _this.selectField("old_age_cnt")
        }
    });
}
WisdomManageFn.prototype.setFailyPie = function (obj) {
    var option = option = {
        tooltip: {},
        grid: {
            top: "40%",
            bottom: 0,
            left: 0,
            right: 0
        },
        legend: {
            orient: 'horizontal',
            data: ['孕婴家庭', '单身贵族', '二人世界', '家有老人', '家有儿童'],
            left: "0%",
            top: "0%",
            textStyle: {
                color: "#a7bdd3"
            },
            itemWidth: 12,
            itemHeight: 12,

            // width:100,
            icon: "circle"
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['35%', '55%'],
                center: ['50%', '60%'],

                data: [
                    {value: obj.family_baby_rate, name: '孕婴家庭', itemStyle: {color: "#507cdd"}},
                    {value: obj.single_rate, name: '单身贵族', itemStyle: {color: "#4dbb96"}},
                    {value: obj.lovers_rate, name: '二人世界', itemStyle: {color: "#55648d"}},
                    {value: obj.family_old_rate, name: '家有老人', itemStyle: {color: "#d2a41d"}},
                    {value: obj.family_children_rate, name: '家有儿童', itemStyle: {color: "#c45d4c"}}
                ],
                //   label:{
                //       show:false,
                //       position: 'center'
                //   },
                //   labelLine: {
                //     normal: {
                //         length: 20,
                //         length2: 40,
                //         lineStyle: {
                //             color: '#e6e6e6'
                //         }
                //     }
                // },
                label: {
                    normal: {
                        show:false,
                        position: 'center',
                        formatter: params => {
                            return (
                                '{value|' + (params.value) + '}'
                            );
                        },
                        // padding: [0, -130, 25, -130],
                        rich: {
                            color: '#fff',
                            icon: {
                                fontSize: 12
                            },
                            name: {
                                fontSize: 14,
                                padding: [0, 5, 0, 5],
                                color: '#fff'
                            },
                            percent: {
                                color: '#fff',
                                padding: [0, 5, 0, 0],
                            },
                            value: {
                                fontSize: 16,
                                // fontWeight: 'bold',
                                color: '#fff'
                            }
                        }
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                },
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('family-pie'));
    myChart.setOption(option);
    var _this = this;
    myChart.off("click");
    myChart.on('click', function (param) {
        _this.fieldName = param.name;
        if (param.name == "孕婴家庭") {
            _this.selectField(-5)
        } else if (param.name == "单身贵族") {
            _this.selectField(-1)
        } else if (param.name == "二人世界") {
            _this.selectField(-2)
        } else if (param.name == "家有老人") {
            _this.selectField(-3)
        } else if (param.name == "家有儿童") {
            _this.selectField(-4)
        }
    });
}
WisdomManageFn.prototype.setClientRotate = function (obj) {
    var option = option = {
        tooltip: {},
        grid: {
            top: 0,
            left: 0
        },
        legend: {
            orient: 'horizontal',
            data: ['华为', '小米', 'VIVO', 'OPPO', '苹果'],
            show: false,
            left: 0,
            top: "20%",
            textStyle: {
                color: "white",
                fontSize: 12
            },
            width: 100,
            icon: "circle"
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                data: [
                    {value: obj.huawei_terminal_cnt, name: '华为', itemStyle: {color: "#507cdd"}},
                    {value: obj.xiaomi_terminal_cnt, name: '小米', itemStyle: {color: "#4dbb96"}},
                    {value: obj.vivo_terminal_cnt, name: 'VIVO', itemStyle: {color: "#55648d"}},
                    {value: obj.oppo_terminal_cnt, name: 'OPPO', itemStyle: {color: "#d2a41d"}},
                    {value: obj.apple_terminal_cnt, name: '苹果', itemStyle: {color: "#c45d4c"}}
                ],
                labelLine: {
                    length: 1,
                    length2: 10
                }
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('preferences_pie'));
    myChart.setOption(option);
    var _this = this;
    myChart.off("click");
    myChart.on('click', function (param) {
        _this.fieldName = param.name;
        if (param.name == "华为") {
            _this.selectField('huawei_terminal_cnt')
        } else if (param.name == "OPPO") {
            _this.selectField('oppo_terminal_cnt')
        } else if (param.name == "小米") {
            _this.selectField('xiaomi_terminal_cnt')
        } else if (param.name == "VIVO") {
            _this.selectField("vivo_terminal_cnt")
        } else if (param.name == "苹果") {
            _this.selectField("apple_terminal_cnt")
        }
    });
}
WisdomManageFn.prototype.setUsePreferences = function (obj) {
    var option = {
        tooltip: {},
        legend: {
            data: ['驻留时长'],
            show: false
        },
        grid: {
            top: 0,
            bottom: '5%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: "white"
                    }
                },
                data: ['购物', '旅游', '游戏', '图书影音', '社交']
            }
        ],
        series: [
            {
                name: '驻留时长',
                type: 'bar',
                label: {
                    show: true,
                    position: 'insideLeft'
                },
                data: [
                    {name: "购物", value: obj.shopping_app_cnt, itemStyle: {color: "#76d3a6"}},
                    {name: "旅游", value: obj.travel_app_cnt, itemStyle: {color: "#5aabe2"}},
                    {name: "游戏", value: obj.gaem_app_cnt, itemStyle: {color: "#cd3158"}},
                    {name: "图书影音", value: obj.movies_app_cnt, itemStyle: {color: "#56aee0"}},
                    {name: "社交", value: obj.social_app_cnt, itemStyle: {color: "#56aee0"}},]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('use-bar'));
    myChart.setOption(option);
    var _this = this;
    myChart.off("click");
    myChart.on('click', function (param) {
        _this.fieldName = param.name;
        if (param.name == "购物") {
            _this.selectField(12)
        } else if (param.name == "旅游") {
            _this.selectField(17)
        } else if (param.name == "游戏") {
            _this.selectField(13)
        } else if (param.name == "图书影音") {
            _this.selectField(15)
        } else if (param.name == "社交") {
            _this.selectField(11)
        }
    });
}
WisdomManageFn.prototype.computerTime = function (num) {
    var xAxis = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    var unit = 100 / xAxis.length;
    console.log(parseInt(num / unit));
    return xAxis[parseInt(num / unit)];
}
WisdomManageFn.prototype.initTimeLine = function (data) {
    var arr1 = new Array();
    var arr2 = new Array();
    var arr3 = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    var currentPeopleNumber = 0;
    var sumPeopleNumber = 0;
    var titleArr = new Array();
    for (var i = 0; i < data.length; i++) {
        // 原来的数据只有13个小时的，所以现在只计算13个小时的，如果以后要增加时段，需要重新计算
        currentPeopleNumber += data[i].tile14_user_cnt - data[i].leave_user_cnt;
        sumPeopleNumber += data[i].tile14_user_cnt;
        arr1.push(data[i].tile14_user_cnt);
        arr2.push(-data[i].leave_user_cnt);
        if (i == 0) {
            arr3.push(arr1[i] + arr2[i]);
        } else {
            arr3.push(arr3[i - 1] + (arr1[i] + arr2[i]));
        }
        titleArr.push(data[i].hour_no);
    }
    ;

    arr3.push(0);
    var option = {
        grid: {
            left: "2%",
            top: "4%"
        },
        xAxis: {
            type: 'category',
            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {
                textStyle: {
                    color: "white"
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false}
        },
        series: [{
            data: arr3,
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                color: "#2ca3db"
            }
        }],
        dataZoom: {
            type: "slider",
            realtime: false,
            startValue: "10:00",
            endValue: "22:00",
            height: 30,
            textStyle: {
                color: "white"
            }
        },
    };
    var myChart = echarts.init(document.getElementById('time-line'));
    myChart.setOption(option);
    // myChart.dispatchAction({
    //   type:"dataZoom",
    // })
    wisdomManage.setPeopleFlowCount({
        currentPeopleNumber: currentPeopleNumber,
        currentPeopleNumberIsTop: false,
        currentPeopleRotate: 5,
        allNumber: sumPeopleNumber,
        allNumberIsTop: "",
        allRotate: "",
        insideNumber: 71,
        insideNumberIsTop: true,
        insideRotate: 8
    });
    var _this = this;
    myChart.on("dataZoom", function (event) {
        var start = _this.computerTime(event.start);
        var end = _this.computerTime(event.end);
        _this.startTime = start ? start.split(":")[0] : "";
        _this.endTime = end ? end.split(":")[0] : "";
        wisdomManage.queryData(_this.day + _this.startTime, _this.day + _this.endTime);
        wisdomManage.initDetail(wisdomManage.field);
        gis.updateHourNo(_this.day+_this.startTime,_this.day+_this.endTime,_this.field);
    })
}
WisdomManageFn.prototype.initDetail = function (field) {
    var _this = this;
    for(var key in FieldNames) {
        if(FieldNames[key]==field) {
            $("#table-title").html("栅格数据-"+key)
            break;
        }
    }

    layui.use('table', function () {
        var table = layui.table;
        var cols = [
            {field: 'commercial_complex_id', title: '综合体ID'}
            , {field: 'commercial_complex_name', title: '综合体名称'}
            , {field: 'tile14_id', title: '14级栅格ID'}
            , {field: 'tile14_user_cnt', title: '栅格到访人数'}
            , {field: 'leave_user_cnt', title: '栅格离开人数'}
            , {field: 'live_user_cnt', title: '居住地人数'} //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增

            , {field: 'single_nct', title: '单身贵族数量'}
            , {field: 'lovers_cnt', title: '二人世界数量'}
            , {field: 'family_old_cnt', title: '家有老人数量'}
            , {field: 'family_children_cnt', title: '家有儿童数量'}
            , {field: 'family_baby_cnt', title: '孕婴家庭数量'}

            , {field: 'man_cnt', title: '男性人数'}
            , {field: 'women_cnt', title: '女性人数'}
            , {field: 'age_0_18_cnt', title: '18岁以下人数'}
            , {field: 'age18_25_cnt', title: '18-25岁人数'}
            , {field: 'age_25_40_cnt', title: '25-40岁人数'}
            , {field: 'old_age_cnt', title: '40岁以上人数'}

            , {field: 'apple_terminal_cnt', title: '苹果终端人数'}
            // , {field: 'apple_flagship_cnt', title: '苹果旗舰终端人数'}
            // , {field: 'android_terminal_cnt', title: '安卓终端人数'}
            // , {field: 'android_flagship_cnt', title: '安卓旗舰终端人数'}
            , {field: 'oppo_terminal_cnt', title: 'OPPO品牌终端人数'}
            , {field: 'vivo_terminal_cnt', title: 'VIVO品牌终端人数'}
            , {field: 'huawei_terminal_cnt', title: '华为品牌终端人数'}
            // , {field: 'honor_terminal_cnt', title: '荣耀品牌终端人数'}
            , {field: 'xiaomi_terminal_cnt', title: '小米品牌终端人数'}
            // , {field: 'oneplus_terminal_cnt', title: '一加品牌终端人数'}
            // , {field: 'other_terminal_cnt', title: '其他品牌终端人数'}

            , {field: 'higher_education_cnt', title: '高等教育人数'}
            , {field: 'secondary_education_cnt', title: '中等教育人数'}
            , {field: 'primary_education_cnt', title: '初等教育人数'}

            , {field: 'high_consumption_cnt', title: '高消费人数'}
            , {field: 'moderate_consumption_cnt', title: '中消费人数'}
            , {field: 'low_consumption_cnt', title: '低消费人数'}

            , {field: 'social_app_cnt', title: '社交类APP人数'}
            , {field: 'gaem_app_cnt', title: '游戏娱乐类APP人数'}
            , {field: 'shopping_app_cnt', title: '购物类APP人数'}
            , {field: 'payment_app_cnt', title: '支付类APP人数'}
            , {field: 'movies_app_cnt', title: '视频影音类APP人数'}
            , {field: 'news_app_cnt', title: '新闻阅读类APP人数'}
            , {field: 'travel_app_cnt', title: '旅游出行类APP人数'}
            , {field: 'education_app_cnt', title: '教育培训类APP人数'}

            , {field: 'drive_trip_cnt', title: '驾车出行人数'}
            , {field: 'metro_trip_cnt', title: '地铁出行人数'}
            , {field: 'transit_trip_cnt', title: '公交出行人数'}
            , {field: 'bicycle_trip_cnt', title: '自行车出行人数'}
            , {field: 'walk_trip_cnt ', title: '步行出行人数'}

            , {field: 'retention_time_30m', title: '驻留30min以下人数'}
            , {field: 'retention_time_60m', title: '驻留30-60min人数'}
            , {field: 'retention_time_2h', title: '驻留1-2小时人数'}
            , {field: 'retention_time_4h', title: '驻留2-4小时人数'}
            , {field: 'retention_time_4h_more ', title: '驻留4小时以上人数'}
        ];
        for (let i = 0; i < cols.length; i++) {
            cols[i].width = cols[i].title.length * 20;
        }
        table.render({
            elem: '#detail-data'
            ,
            url: url_root + '/demo/getDetailData?hour_no=' + _this.day + _this.startTime + "&field_name=" + field + "&end_hour_no=" + _this.day + _this.endTime+"&type="+_this.type
            ,
            height: $("#detail-data-box").height()
            ,
            page: true
            ,
            cols: [cols]
        });
        //监听行单击事件（双击事件为：rowDouble）
        table.on('row(detail-data)', function(obj){
            //标注选中样式
            obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
            var data = obj.data;
            if(gis) {
                gis.setCenter(data.tile14_lon, data.tile14_lat);
                gis.selectGridByLonLat(data.tile14_lon, data.tile14_lat);
            }
        });
    });
}
WisdomManageFn.prototype.bindTimeDaySelect = function () {
    var _this = this;
    layui.use(['element', 'laydate'], function () {
        var laydate = layui.laydate;
        var initDay = wisdomManage.day.substr(0,4)+'-'+wisdomManage.day.substr(4,2)+'-'+wisdomManage.day.substr(6,2);
        //常规用法
        laydate.render({
            elem: '#dateSel'
            , value: initDay
            , format: "yyyy-MM-dd"
            , btns: ['now', 'confirm']
            , done: function (value, date, endDate) {
                if (value != null && value != '') {
                    value = value.replace(/-/g, "")
                    _this.day = value;
                    console.log(_this);
                    wisdomManage.initDetail(wisdomManage.field);
                    wisdomManage.queryData(_this.day + _this.startTime, _this.day + _this.endTime);
                    wisdomManage.queryTimeLine();
                    $.ajax({
                        url: url_root + '/demo/getDayData?day_no=' + wisdomManage.day+"&type="+wisdomManage.type,
                        success: function (data) {
                            if (data) {
                                wisdomManage.peopleCounHours(data);
                            }
                        }
                    });
                    gis.updateHourNo(_this.day+_this.startTime,_this.day+_this.endTime,_this.field);
                } else {
                    layui.msg("请选择日期")
                }
            }
        });
    })
}
WisdomManageFn.prototype.queryData = function (hour_no, end_no) {
    var _this = this;
    $.ajax({
        url: url_root + '/demo/getData?hour_no=' + hour_no + "&end_hour_no=" + end_no+"&type="+_this.type,
        success: function (data) {
            _this.historyData = data;
            if (data && data.length) {
                var obj = data[0];
                for(var key in obj) {
                    if(obj[key]<0||obj[key]==null) {
                        obj[key] = 0;
                    }
                }
                // 新的
                wisdomManage.setPeopleFlowCount({
                    currentPeopleNumber: obj.cl_mdn_cnt,
                    currentPeopleNumberIsTop: false,
                    currentPeopleRotate: 5,
                    allNumber: obj.mdn_cnt,
                    allNumberIsTop: "",
                    allRotate: "",
                    insideNumber: obj.cnt_1_one,
                    insideNumberIsTop: true,
                    insideRotate: 8,


                    currentPeopleNumber2: obj.times,
                    currentPeopleNumberIsTop2: false,
                    currentPeopleRotate2: 5,
                    allNumber2: obj.area_in_rate,
                    allNumberIsTop2: "",
                    allRotate2: "",
                    insideNumber2: obj.in_rate,
                    insideNumberIsTop2: true,
                    insideRotate2: 8
                });
                //绑定驻留时间数据
                wisdomManage.setResideBar(obj);
                //绑定年龄数据
                wisdomManage.setAgePie(obj);

                wisdomManage.setFailyPie(obj);
                wisdomManage.setSexRotate(obj.man_rate,obj.woman_rate);
                // wisdomManage.setClientRotate(data[0]);
                wisdomManage.preferencesPie(obj);
                wisdomManage.preferencesBar(obj);
                wisdomManage.dwellTime(obj);
                // wisdomManage.setUsePreferences(data[0])
                if(obj.cellList) {
                    if(obj.cellList.length>5) {
                        wisdomManage.distribution(obj.cellList.slice(0,5));
                    } else {
                        wisdomManage.distribution(obj.cellList);
                    }
                }

            }
        }
    });

}
WisdomManageFn.prototype.backData = function () {
    var _this = this;
    this.field = "";
    wisdomManage.setResideBar(_this.historyData[0]);
    wisdomManage.setAgePie(_this.historyData[0]);
    wisdomManage.setFailyPie(_this.historyData[0]);
    // wisdomManage.setClientRotate(_this.historyData[0]);
    // wisdomManage.setUsePreferences(_this.historyData[0]);
    this.initDetail(this.field);

}
WisdomManageFn.prototype.refreshData = function (data) {
    if (data && data.length) {
        wisdomManage.setResideBar(data[0]);
        wisdomManage.setAgePie(data[0]);
        wisdomManage.setFailyPie(data[0]);
        // wisdomManage.setClientRotate(data[0]);
        // wisdomManage.setUsePreferences(data[0])
    }
}
WisdomManageFn.prototype.queryTimeLine = function () {
    var data = `[{"hour_no":2020042210,"tile14_user_cnt":0,"leave_user_cnt":0}]`;
    if (data && data.length) {
        //   wisdomManage.initTimeLine(data)
    }
//   $.ajax({
//     url: url_root + '/demo/getDayData?day_no=' + this.day,
//     success: function (data) {
//         if (data && data.length) {
//           wisdomManage.initTimeLine(data)
//         }
//     }
// })
}
WisdomManageFn.prototype.selectField = function (filedId) {
    var hour_no = $('#timeSel').val();
    if (filedId == -1) {
        filedId = "single_nct"
    } else if (filedId == -2) {
        filedId = "lovers_cnt"
    } else if (filedId == -3) {
        filedId = "family_old_cnt"
    } else if (filedId == -4) {
        filedId = "family_children_cnt"
    } else if (filedId == -5) {
        filedId = "family_baby_cnt"
    } else if (filedId == 11) {
        filedId = "social_app_cnt"
    } else if (filedId == 12) {
        filedId = "gaem_app_cnt"
    } else if (filedId == 13) {
        filedId = "shopping_app_cnt"
    } else if (filedId == 14) {
        filedId = "payment_app_cnt"
    } else if (filedId == 15) {
        filedId = "movies_app_cnt"
    } else if (filedId == 16) {
        filedId = "news_app_cnt"
    } else if (filedId == 17) {
        filedId = "travel_app_cnt"
    } else if (filedId == 41) {
        filedId = "shopping_tb_cnt"
    } else if (filedId == 42) {
        filedId = "shopping_jd_cnt"
    } else if (filedId == 43) {
        filedId = "shopping_tm_cnt"
    } else if (filedId == 44) {
        filedId = "shopping_ymx_cnt"
    } else if (filedId == 45) {
        filedId = "shopping_hm_cnt"
    } else if (filedId == 46) {
        filedId = "shopping_sl_cnt"
    }
    this.field = filedId;
    this.initDetail(filedId);
    gis.updateHourNo(this.day+this.startTime,this.day+this.endTime,this.field);
    // $.ajax({
    //     url: url_root + '/demo/getFilterData?hour_no='+ this.day+''+ this.startTime+'&end_hour_no=' +this.day+this.endTime+ '&field_name=' + filedId,
    //     success: function (data) {
    //         if (data && data.length) {

    //             wisdomManage.setResideBar(data[0]);
    //             wisdomManage.setAgePie(data[0]);
    //             wisdomManage.setFailyPie(data[0]);
    //             wisdomManage.setClientRotate(data[0]);
    //             wisdomManage.setUsePreferences(data[0])
    //         }
    //     }
    // });
    // $.ajax({
    //     url: url_root + '/demo/getDayData?day_no='+this.day,
    //     success: function (data) {
    //         if (data && data.length) {
    //             indexECharts.initChart1(data);
    //         }
    //     }
    // })
}
// 驻留时间到访频率分布柱状图
WisdomManageFn.prototype.dwellTime = function (obj) {
    var option = {

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            show: false,
            data: ['总值', '行', '行辅助', '商', '商辅助', '校', '汇总值同比']
        },
        grid: {
            top: "20%",
            left: '3%',
            right: '4%',
            bottom: '20%',
        },

        xAxis: {
            type: 'category',

            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                color: "#ffffff",
                interval: 0,
                fontSize: 10
            },
            data: ['3次以上', '3次', '2次', '1次']
        },
        yAxis: {
            show: false,
            type: 'value',
//                        inverse:true
        },
        series: [
            {
                name: '总值',
                type: 'bar',
                barWidth: '15%',

                label: {
                    normal: {
                        show: true,
                        position: "top",
                        color: "#ffffff"
                    }

                },

                data: [obj.cnt_3_m, obj.cnt_3, obj.cnt_2, obj.cnt_1].map((item, i) => {
                    itemStyle = {
                        color: i != 2 ? "#4d82de" : "#4ebc97"
                    }
                    return {
                        value: item,
                        itemStyle: itemStyle
                    };
                }),
            },


        ]
    };
    var myChart = echarts.init(document.getElementById('js_bar_echarts'));
    myChart.setOption(option);

},
// 家庭组成及来源小区分布
    WisdomManageFn.prototype.distribution = function (top5Cell) {

        var myChartLine = echarts.init(document.getElementById('family-bar'));

        var titlename = new Array();
        var num1 = new Array();

        var tatolNum = new Array();
        for(var i=top5Cell.length-1;i>=0;i--) {
            titlename.push(top5Cell[i].name);
            num1.push(top5Cell[i].area_user_cnt);
            tatolNum.push((top5Cell[i].area_rate*100).toFixed(2));
        }
        var option = {
            grid: {
                top: "10%",
                left: '3%',
                right: '20%',
                bottom: '0%',
            },

            tooltip: {
                show: "true",
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.7)', // 背景
                padding: [8, 10], //内边距

            },
            xAxis:[{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#363e83',
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#363e83 ',
                    }
                },
                axisLabel: {
                    show: false,
                    textStyle: {
                        color: '#fff',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                },
            },{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#363e83',
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#363e83 ',
                    }
                },
                axisLabel: {
                    show: false,
                    textStyle: {
                        color: '#fff',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                },
            }],
            yAxis: [{
                show: false,
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#363e83',
                    }
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#fff',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },

                },
                data: titlename
            }, {
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                data: titlename
            },

            ],
            series: [
                {
                    type: 'bar',
                    yAxisIndex: 1,
                    barGap: '100%',
                    barCategoryGap: "50%",
                    data: num1,
                    zlevel: 1,

                    barWidth: '15%',

                    label: {
                        show: true,
                        position: [0, -20],
                        color: "#ffffff",
                        formatter: function (data) {
                            return titlename[data.dataIndex]
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgba(255,255,255,0)',
                            borderWidth: 0,
                            shadowBlur: {
                                shadowColor: 'rgba(255,255,255,1)',
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 2,
                            },
                        }
                    },
                },

                {
                    name: '目标值',
                    type: 'bar',
                    label: {
                        show: true,
                        position: "right",
                        color: "#fff",
                        formatter: function (data) {
                            return tatolNum[data.dataIndex] + "%"

                        }
                    },
                    itemStyle: {
                        normal: {
                            show: true,
                            color: "#4c7ecd",
                            barBorderRadius: 50,
                            borderWidth: 1,
                            borderColor: "#627d52"
                        }
                    },
                    zlevel: 2,
                    barWidth: '15%',
                    barCategoryGap: "50%",
                    data: num1
                },
            ]
        };
        myChartLine.clear();
        myChartLine.setOption(option);


    }
// 终端占比及使用偏好柱状图
WisdomManageFn.prototype.preferencesBar = function (obj) {

    var option = {

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            top: "5%",
            left: '30%',
            right: '20%',
            bottom: '20%',
        },

        xAxis: {
            show: false,
            type: 'value',

        },
        yAxis: {
            type: 'category',

            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            inverse: 0,
            axisLabel: {
                show: true,
                color: "#ffffff",
                interval: 0,
                fontSize: 10
            },
            data: ['购物', '游戏', '旅游', '图书影音', '社交'].reverse()

        },
        series: [
            {
                name: '总值',
                type: 'bar',
                barWidth: "20%",

                label: {
                    normal: {
                        show: true,
                        position: "right",
                        color: "#ffffff"
                    }

                },

                data: [obj.shopping_app_cnt, obj.gaem_app_cnt, obj.travel_app_cnt, obj.movies_app_cnt, obj.social_app_cnt].map((item, i) => {
                    itemStyle = {
                        color: i != 2 && i != 4 ? "#4ebc97" : "#4d82de"
                    }
                    return {
                        value: item,
                        itemStyle: itemStyle
                    };
                }),
            },


        ]
    };
    var myChart = echarts.init(document.getElementById('preferences_bar'));
    myChart.setOption(option);


},
// 终端占比及使用偏好折线图
    WisdomManageFn.prototype.preferencesPie = function (obj) {

        let echartData = {
            inner: [{
                value: obj.huawei_terminal_cnt,
                unit: '个',
                name: '华为'
            },
                {
                    value: obj.xiaomi_terminal_cnt,
                    unit: '个',
                    name: '小米'
                },
                {
                    value: obj.vivo_terminal_cnt,
                    unit: '个',
                    name: 'VIVO'
                },
                {
                    value: obj.oppo_terminal_cnt,
                    unit: '个',
                    name: 'OPPO'
                },
                {
                    value: obj.apple_terminal_cnt,
                    unit: '个',
                    name: "苹果"
                }
            ],

        }

        let legend1 = echartData.inner.map(v => v.name);


        let option = {
            legend: {
                orient: 'horizontal',
                data: ['华为', '小米', 'VIVO', 'OPPO', '苹果'],
                show: true,
                left: 0,
                top: "20%",
                textStyle: {
                    color: "white",
                    fontSize: 12
                },
                width: 100,
                icon: "circle"
            },
            grid: {
                top: 0
            },
            color: ["#527ddc", "#4ebd98", "#546382", "#d7a029", "#c55e4d"],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: [0, '50%'],
                    center: ["60%", "50%"],

                    label: {
                        normal: {
                            position: 'inner',
                            formatter: function (data) {
                                return data.value

                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: echartData.inner
                },

            ]
        };
        var myChart = echarts.init(document.getElementById('preferences_pie'));
        myChart.setOption(option);


    }
// 男性到访明细表格的隐藏
WisdomManageFn.prototype.changeTableStatus = function () {
    var onOff = true;
    $("#js_data_btn").on("click", function () {
        if (onOff) {
            $(this).attr("class", "icon icon-plus")
            $("#js_dataTable").hide();
            $("#detail-data-box").height("30px");
            $("#table-title").html("");
            $('.table-title').css("background-color","rgba(23,50,112,0)");
        } else {
            $(this).attr("class", "icon icon-minus")
            $("#js_dataTable").show();
            $("#detail-data-box").height("60%");
            $("#table-title").html("栅格数据");
            $('.table-title').css("background-color","rgba(23,50,112,0.6)");
        }
        onOff = !onOff;


    })

},
// 下拉框切换展示
    WisdomManageFn.prototype.selectChange = function () {
        var onOff = true;
        $("#js_selectText").on("click", function (ev) {
            ev.stopPropagation();
            if (onOff) {
                $("#js_select_list").show();
            } else {
                $("#js_select_list").hide();
            }
            onOff = !onOff;
        })
        var _this = this;
        $(".u-text").on("click", function (ev) {
            ev.stopPropagation();
            var text = $("#js_text").text();
            if(text=='乐成中心') {
                _this.type = 2;
            } else {
                _this.type = 1;
            }

            _this.queryData(wisdomManage.day + wisdomManage.startTime, wisdomManage.day + wisdomManage.endTime);
            $.ajax({
                url: url_root + '/demo/getDayData?day_no=' + wisdomManage.day+"&type="+wisdomManage.type,
                success: function (data) {
                    if (data) {
                        wisdomManage.peopleCounHours(data);
                    }
                }
            });
            wisdomManage.initDetail(wisdomManage.field);
            $("#js_text").text($(this).text());
            $(this).text(text)
            gis.changeBuilding(_this.type);
        });
        $(document).on("click", function (ev) {
            ev.stopPropagation();
            onOff = true;
            $("#js_select_list").hide();
        })

    },
// 小时人流统计
    WisdomManageFn.prototype.peopleCounHours = function (countData) {
        var onOff=true;
        var data = new Array();
        var tmpData = {};
        if(countData&&countData.length) {
            for (let i = 0; i < countData.length; i++) {
                // data.push(countData[i].user_cnt);
                tmpData[''+countData[i].hour_no] = countData[i].user_cnt;
            }
        }

        var myChart = echarts.init(document.getElementById('time-line'));
        var dataX = ['0', '1', '2', '3', '4', '5', '6', "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
        for (let i = 0; i < dataX.length; i++) {
            var hour_no = wisdomManage.day+(parseInt(dataX[i])<10?('0'+dataX[i]):dataX[i]);
            var val = tmpData[hour_no];
            if(val) {
                data.push(val);
            } else {
                data.push(0);
            }
        }
        var start = parseInt(wisdomManage.startTime);
        var end = parseInt(wisdomManage.endTime);
        var option = {
            tooltip: {
                show: true,
            },

            // "dataZoom": [{
            //     id:"aa",

            //     "show": true,
            //     "height": 10,
            //     "xAxisIndex": [
            //         0
            //     ],
            //     filterMode: 'none',
            //     bottom: 30,
            //     // "start": 20,
            //     // "end": 100,
            //     // startValue:dataX[dataX.length-13],
            //     // endValue:dataX[dataX.length-1],
            //     handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            //     handleSize: '110%',
            //     handleStyle: {
            //         color: "#d3dee5",

            //     },
            //     throttle:1000,
            //     textStyle: {
            //         color: "#fff"
            //     },
            //     borderColor: "#90979c",
            //     rangeMode:["17日","100"],
            //     zoomLock:false,
            //     fillerColor:"rgba(167,183,204,0.4)",  //选中范围的填充颜色。


            // }, {
            //     "type": "inside",
            //     "show": true,
            //     "height": 15,
            //     "start": 1,
            //     "end": 50,


            // }],
            grid: {
                show: true,
                left: "2%",
                top: "20%",
                right: "3%",
                bottom: "20%",
                border: 0,
                borderWidth: 0
            },
            xAxis: [
                {
                    type: 'category',
                    position: 'bottom',
                    interval: 2,
                    axisLine: {
                        show: false,
                        onZero: true,
                        lineStyle: {
                            color: "#556477"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        color: "#fff",
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 12,

                        //rotate: 60
                    },
                    data: dataX,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],

            yAxis: [
                {
                    type: 'value',
                    splitNumber: 4,
                    axisLine: {
                        show: false,
                        onZero: true,
                        lineStyle: {
                            color: "#4a5c66"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        interval: 'auto',
                        color: "#ffffff",
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 12
                    },

                },
                {
                    show: false,
                    type: 'value',
                    min: 0,
                    max: 25,
                    interval: 5,

                }
            ],
            series: [
                {

                    name: '年累收入',
                    type: 'bar',
                    legendHoverLink: true,
                    barWidth: 13,
                    barGap: 0,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                if (params.dataIndex >= start && params.dataIndex <= end) {
                                    return "#7ab9ef"
                                } else {
                                    return "#727176"
                                }

                            }

                        }

                    },
                    // itemStyle: {
                    //     normal: {
                    //         color: function (params) {
                    //             console.log(_this.name);
                    //             if (_this.name == params.name) {
                    //                 return new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    //                     offset: 0.5,
                    //                     color: '#FF7854'
                    //                 }, {
                    //                     offset: 1,
                    //                     color: '#37ff7b'
                    //                 }])
                    //             } else  {
                    //                 return new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    //                     offset: 0,
                    //                     color: '#caff71'
                    //                 }, {
                    //                     offset: 1,
                    //                     color: '#37ff7b'
                    //                 }])
                    //             }
                    //         },
                    //         barBorderRadius: 30
                    //     }
                    // },
                    tooltip: {
                        show: true,
                        formatter: function (params) {
                            return "<div class='tooltip-box'><h3>详情</h3>" +
                                "<div class='num-box'><b>到访用户："+params.value+"</b></div>" +
                                "</div>"
                        }
                    },
                    data: data
                }


            ]
        };
        // myChart.on('dataZoom', function (params) {
        //     start=myChart.getOption().dataZoom[0].startValue;
        //     end=myChart.getOption().dataZoom[0].endValue;
        //     var oldOption=myChart.getOption();
        //     myChart.setOption(oldOption);
        //     })
        myChart.clear();
        myChart.setOption(option);
        layui.use('slider', function () {
            var $ = layui.$
                , slider = layui.slider;
            //定义初始值
            var timer = 0;
            slider.render({
                elem: '#slide'
                , value: [start,end] //初始值
                , min: 0 //最小值
                , max: 23 //最大值
                , step: 1 //步长
                , range: true //范围选择
                , change: function (value) {
                    clearTimeout(timer);
                    hasWanc = false;
                    historyVal = value;
                    start = value[0];
                    end = value[1];
                    myChart.setOption(option);
                    timer = setTimeout(function () {
                        console.log("setTimeout"+mouseDown);

                        if(mouseDown==0) {
                            hasWanc = true;
                            historyVal = undefined;
                            start = value[0];
                            end = value[1];
                            start = (start < 10 ? "0" : "") + start;
                            end = (end < 10 ? "0" : "") + end;
                            if (wisdomManage.startTime == start && wisdomManage.endTime == end) {
                                return true;
                            }
                            wisdomManage.startTime = start;
                            wisdomManage.endTime = end;
                            // //do something
                            wisdomManage.initDetail(wisdomManage.field);
                            wisdomManage.queryData(wisdomManage.day + wisdomManage.startTime, wisdomManage.day + wisdomManage.endTime);

                            gis.updateHourNo(wisdomManage.day + wisdomManage.startTime, wisdomManage.day + wisdomManage.endTime, wisdomManage.field);
                        }
                    },500);
                }
            });
        });


    }
var wisdomManage = new WisdomManageFn(2020050100,2020050106);
var mouseDown = 0;
var historyVal = undefined;
var hasWanc= true;
document.body.onmousedown = function() {
    ++mouseDown;
}
document.body.onmouseup = function() {
    --mouseDown;
    if(!mouseDown&&!hasWanc&&historyVal) {
        start = historyVal[0];
        end = historyVal[1];
        start = (start < 10 ? "0" : "") + start;
        end = (end < 10 ? "0" : "") + end;

        if (wisdomManage.startTime == start && wisdomManage.endTime == end) {
            return true;
        }
        wisdomManage.startTime = start;
        wisdomManage.endTime = end;
        // //do something
        wisdomManage.initDetail(wisdomManage.field);
        wisdomManage.queryData(wisdomManage.day + wisdomManage.startTime, wisdomManage.day + wisdomManage.endTime);

        gis.updateHourNo(wisdomManage.day + wisdomManage.startTime, wisdomManage.day + wisdomManage.endTime, wisdomManage.field);

    }
}