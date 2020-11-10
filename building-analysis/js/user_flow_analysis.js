var URL_ROOT = Common.url_server_root;
var FIELD_NAMES = {
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
var wisdomManage;
$(function () {
    var date = new Date((new Date()).getTime() - 24*60*60*1000);
    // var start = date.Format('yyyyMMdd') + '00';
    // var end = date.Format('yyyyMMdd') + '23';
    var start = '2020100100';
    var end = '2020100123';

    if($.cookie('start_time')) {
        start = $.cookie('start_time');
    } else {
        $.cookie('start_time', start, { path: '/'});
    }
    if($.cookie('end_time')) {
        end = $.cookie('end_time');
    } else {
        $.cookie('end_time', end, { path: '/'});
    }

    wisdomManage = new WisdomManageFn(start, end);
    gis.init(wisdomManage.startDay+wisdomManage.startTime,wisdomManage.endDay+wisdomManage.endTime);
    wisdomManage.loadLoginInfo();
    wisdomManage.loadBusiSelect();
    wisdomManage.bindTimeDaySelect();
    wisdomManage.bindTimeDaySlider();
    wisdomManage.bindAnalysisBtns();
    wisdomManage.bindSwitchBtns();
    wisdomManage.bindAnalysisChartsSearch();
})

function WisdomManageFn(start,end) {
    this.startDay = start.toString().substr(0,8);
    this.endDay = end.toString().substr(0,8);
    this.startTime = start.toString().substr(8,10);
    this.endTime = end.toString().substr(8,10);
    this.busiId,this.currentBusi;
    this.historyData = {};
    this.field = "";
    this.fieldName = "";
    this.keyWord = "";
    this.layui = {};
}

//更新
WisdomManageFn.prototype._update = function() {
    var _this = this;
    _this.loadDetailList();
    _this.loadChartList();
    gis.updateHourNo(_this.startDay+_this.startTime,_this.endDay+_this.endTime,_this.field);
}

//改变楼宇
WisdomManageFn.prototype.changeBusi = function(busi) {
    var _this = this;
    _this.currentBusi =  busi;
    _this.busiId = busi.busi_id;
    _this.cityId = busi.city_id;
    _this.loadDetailList();
    _this.loadChartList();
    if(gis.map) {
        gis.changeBusi(busi);
    }
}

//加载登录信息
WisdomManageFn.prototype.loadLoginInfo = function() {
    var _this = this;
    var tokenId = $.cookie('token_id');
    var userName = _this.formatText($.cookie('user_name'));
    var phone = _this.formatText($.cookie('phone'));
    if(tokenId) {
        $('#login_user_name0').text(userName);
        $('#login_user_name0').attr('title',userName);
        // $('#login_user_icon0').attr('src','image/sys_mode/iconfont.png');
        $('#login_user_name1').text(userName);
        $('#login_user_name1').attr('title',userName);
        // $('#login_user_icon1').attr('src','image/sys_mode/iconfont.png');
        // $('#login_phone').text(phone);
        $('#login_quit_btn').text('退出登录');
    } else {
        $('#login_user_name0').text('未登录');
        $('#login_user_icon0').attr('src','image/sys_mode/unlogin.jpg');
        $('#login_user_name1').text('未登录');
        $('#login_user_icon1').attr('src','image/sys_mode/unlogin.jpg');
        $('#login_quit_btn').text('登录系统');
    }
    $('#login_quit_btn').unbind().bind('click', function() {
        $.removeCookie('token_id');
        $.removeCookie('user_name');
        $.removeCookie('phone');
        $.removeCookie('busi_main_id');
        $.removeCookie('busi_compete_id');
        $.removeCookie('busi_compete_type');
        $.removeCookie('start_time');
        $.removeCookie('end_time');
        window.location.href = Common.url_static_root + '/login/login.html';
    });
}

//加载商综选择
WisdomManageFn.prototype.loadBusiSelect = function () {
    var _this = this;
    $.ajax({
        async: false,
        url: URL_ROOT + '/competitor/queryMyBusis',
        success: function(res) {
            if(res && res.code == 0){
                var data = res.data;
                if(data.length > 0) {
                    if($.cookie('busi_main_id')) {
                        data.forEach(val => {
                            if(val.busi_id == $.cookie('busi_main_id')){
                                _this.currentBusi =  val;
                                _this.changeBusi(val);
                            }
                        });
                    }

                    if(!_this.currentBusi) {
                        _this.currentBusi =  data[0];
                        _this.changeBusi(data[0]);
                    }

                    $('#switch_item_box .switch-item-title .title').text(_this.formatText(_this.currentBusi.busi_name));
                    $('#switch_item_box .switch-item-title').unbind().bind('click', function() {
                        if($(this).is('.selected')) {
                            $(this).removeClass('selected');
                            $('#switch_item_box .switch-item-content').hide();
                        } else {
                            $(this).addClass('selected');
                            $('#switch_item_box .switch-item-content').show();
                        }
                    });

                    //搜索
                    $('#switch_item_box .switch-item-search-btn').unbind().bind('click', function() {
                        $('#switch_item_box .switch-item').remove();
                        $('#switch_item_box .switch-item-norecord').remove();

                        var keyWord = $('#switch_item_box .switch-item-search input[name=keyWord]').val();

                        data = data.filter(val => {
                            return keyWord == '' ||  _this.formatText(val.busi_name).indexOf(keyWord) > -1;
                        });
                        if(data.length > 0) {
                            data.forEach(val => {
                                var divDom = document.createElement('div');
                                divDom.innerText = _this.formatText(val.busi_name);
                                divDom.attributes['data-value'] = val.busi_id;
                                divDom.attributes['title'] = val.busi_name;
                                if(_this.currentBusi.busi_id == val.busi_id) {
                                    divDom.className = 'switch-item selected';
                                } else {
                                    divDom.className = 'switch-item';
                                }
                                divDom.onclick = function() {
                                    _this.currentBusi =  val;
                                    $.cookie('busi_main_id', val.busi_id, { path: '/'});
                                    _this.changeBusi(val);
                                    $('#switch_item_box .switch-item-title .title').text(_this.formatText(_this.currentBusi.busi_name));
                                    $('#switch_item_box .switch-item').removeClass('selected');
                                    $(this).addClass('selected');
                                    $('#switch_item_box .switch-item-title').click();
                                }
                                $('#switch_item_box .switch-item-content .switch-item-list').append(divDom);
                            });
                        } else {
                            $('#switch_item_box .switch-item-content .switch-item-list').append('<div class="switch-item-norecord">查询无记录</div>');
                        }
                    });
                    $('#switch_item_box .switch-item-search input[name=keyWord]').keydown(function(e){
                        if(e.keyCode == 13) {
                            $('#switch_item_box .switch-item-search-btn').click();
                        }
                    });
                    $('#switch_item_box .switch-item-search-btn').click();
                }
            }
        }
    });
};

//绑定日期选择控件
WisdomManageFn.prototype.bindTimeDaySelect = function () {
    var _this = this;
   
    if(_this.layui.startLaydate && _this.layui.endLaydate) {
        _this.layui.startLaydate.config.max = {
            year: Number(_this.endDay.substr(0, 4)),
            month: Number(_this.endDay.substr(4, 2))-1,
            date: Number(_this.endDay.substr(6, 2)),
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        _this.layui.endLaydate.config.min = {
            year: Number(_this.startDay.substr(0, 4)),
            month: Number(_this.startDay.substr(4, 2)) -1,
            date: Number(_this.startDay.substr(6, 2)),
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    } else {
        layui.use(['element', 'laydate'], function () {
            var laydate = layui.laydate;
            var startDay = _this.startDay.substr(0,4)+'-'+_this.startDay.substr(4,2)+'-'+_this.startDay.substr(6,2);
            var endDay = _this.endDay.substr(0,4)+'-'+_this.endDay.substr(4,2)+'-'+_this.endDay.substr(6,2);
           
            //常规用法
            _this.layui.startLaydate = laydate.render({
                elem: '#startDateSel'
                , format: "yyyy-MM-dd"
                , btns: ['confirm']
                , value: startDay
                , max: endDay
                , done: function (value, date, endDate) {
                    if (value != null && value != '') {
                        value = value.replace(/-/g, "")
                        _this.startDay = value;
                        $.cookie('start_time', _this.startDay+_this.startTime, { path: '/'});
                        // _this._update();
                        _this.bindTimeDaySelect();
                    } else {
                        layui.msg("请选择日期")
                    }
                }
            });
            _this.layui.endLaydate = laydate.render({
                elem: '#endDateSel'
                , format: "yyyy-MM-dd"
                , btns: ['confirm']
                , value: endDay
                , min: startDay
                , done: function (value, date, endDate) {
                    if (value != null && value != '') {
                        value = value.replace(/-/g, "")
                        _this.endDay = value;
                        $.cookie('end_time', _this.endDay+_this.endTime, { path: '/'});
                        // _this._update();
                        _this.bindTimeDaySelect();
                    } else {
                        layui.msg("请选择日期")
                    }
                }
            });
        });
    }
}

//绑定时间滑块控件
WisdomManageFn.prototype.bindTimeDaySlider = function () {
    var _this = this;

    function _updateSliderSymbol(start, end) {
         $('#slide_symbol_start').text(start+":00");
         $('#slide_symbol_end').text(end+":00");
         var sliderWidth = $('.slider-extend').width();
         var marginLeftStart = (sliderWidth - 40)*Number(start)/23;
         var marginLeftEnd = (sliderWidth - 40)*Number(end)/23 - marginLeftStart -  37;
         $('#slide_symbol_start').css('margin-left', marginLeftStart);
         $('#slide_symbol_end').css('margin-left', marginLeftEnd);
    }

    layui.use('slider', function () {
        var slider = layui.slider;
        var start = _this.startTime;
        var end = _this.endTime;

        //定义初始值
        // var timer = 0;
        slider.render({
            elem: '#slide'
            , value: [ _this.startTime, _this.endTime] //初始值
            , min: 0 //最小值
            , max: 23 //最大值
            , step: 1 //步长
            , range: true //范围选择
            ,setTips: function(value){ //自定义提示文本
                return (value<10?'0'+value:''+value) + ":00";
            }
            , change: function (value) {
                start =  value[0]<10?'0'+value[0]:''+value[0];
                end =  value[1]<10?'0'+value[1]:''+value[1];
                _updateSliderSymbol(start, end);
            }
        });
        _updateSliderSymbol(_this.startTime, _this.endTime);
        document.body.onmouseup = function () {
            if(start != _this.startTime || end != _this.endTime){
                _this.startTime = start;
                _this.endTime = end;
                // _this._update();
            }
        };
    });
}

//绑定分析按钮
WisdomManageFn.prototype.bindAnalysisBtns = function() {
    var _this = this;
    $('#left-search #analysis').unbind().bind('click', function() {
        _this.field = '';
        _this._update();
    });
}

//绑定图表搜索功能
WisdomManageFn.prototype.bindAnalysisChartsSearch = function () {
    var _this = this;
    $('#analysis-charts-search').keydown(function(event){
        if(event.keyCode == 13){
            _this.keyWord = this.value.replace(/(^\s*)|(\s*$)/g, "");
            this.value = _this.keyWord;
            _this.loadChartList();
            _this.field = "";
            _this.loadDetailList();
        }
    });

    $('#analysis-charts-search-btn').unbind().bind('click', function() {
        var value = $('#analysis-charts-search').val();
        _this.keyWord = value.replace(/(^\s*)|(\s*$)/g, "");
        $('#analysis-charts-search').val(_this.keyWord);
        _this.loadChartList();
        _this.field = "";
        _this.loadDetailList();
    });

    $('#analysis-charts-clear-btn').unbind().bind('click', function() {
        _this.keyWord = "";
        $('#analysis-charts-search').val(_this.keyWord);
        _this.loadChartList();
    });
}

//绑定切换按钮
WisdomManageFn.prototype.bindSwitchBtns = function () {
    var _this = this;
    $('#switch_compete_analysis').unbind().bind('click', function () {
        window.location.href = Common.url_static_root + '/compete_analysis_main.html';
    });
    if($.cookie('role_id') == -1 || $.cookie('role_id')== 0) {
        $('#switch_system_manage').show();
        $('#switch_system_manage').unbind().bind('click', function () {
            window.location.href = Common.url_static_root + '/system/main.html';
        });
    } else {
        $('#switch_system_manage').hide();
    }
}

//加载栅格列表
WisdomManageFn.prototype.loadDetailList = function () {
    var _this = this;
    var field = _this.field;
    $("#table-title").html("栅格数据");
    for(var key in FIELD_NAMES) {
        if(FIELD_NAMES[key]==field) {
            $("#table-title").html("栅格数据-"+key)
            break;
        }
    }

    layui.use('table', function () {
        var table = layui.table;
        var cols = [
            {field: 'commercial_complex_id', title: '综合体ID',templet: function(val) {
                return _this.formatText(val.commercial_complex_id);
            }}
            , {field: 'commercial_complex_name', title: '综合体名称',templet: function(val) {
                return _this.formatText(val.commercial_complex_name);
            }}
            , {field: 'grid_id', title: '栅格ID',width: 120,templet: function(val) {
                return _this.formatText(val.grid_id);
            }}
            , {field: 'live_user_cnt', title: '居住地人数',templet: function(val) {
                return _this.formatText(val.live_user_cnt);
            }} 
            , {field: 'user_cnt', title: '到访人数',templet: function(val) {
                return _this.formatText(val.user_cnt);
            }} 

            , {field: 'single_nct', title: '单身贵族数量',templet: function(val) {
                return _this.formatText(val.single_nct);
            }}
            , {field: 'lovers_cnt', title: '二人世界数量',templet: function(val) {
                return _this.formatText(val.lovers_cnt);
            }}
            , {field: 'family_old_cnt', title: '家有老人数量',templet: function(val) {
                return _this.formatText(val.family_old_cnt);
            }}
            , {field: 'family_children_cnt', title: '家有儿童数量',templet: function(val) {
                return _this.formatText(val.family_children_cnt);
            }}
            , {field: 'family_baby_cnt', title: '孕婴家庭数量',templet: function(val) {
                return _this.formatText(val.family_baby_cnt);
            }}

            , {field: 'man_cnt', title: '男性人数',templet: function(val) {
                return _this.formatText(val.man_cnt);
            }}
            , {field: 'women_cnt', title: '女性人数'}
            , {field: 'age_0_18_cnt', title: '18岁以下人数',templet: function(val) {
                return _this.formatText(val.women_cnt);
            }}
            , {field: 'age_18_25_cnt', title: '18-25岁人数',templet: function(val) {
                return _this.formatText(val.age_18_25_cnt);
            }}
            , {field: 'age_25_40_cnt', title: '25-40岁人数',templet: function(val) {
                return _this.formatText(val.age_25_40_cnt);
            }}
            , {field: 'old_age_cnt', title: '40岁以上人数',templet: function(val) {
                return _this.formatText(val.old_age_cnt);
            }}

            , {field: 'apple_terminal_cnt', title: '苹果终端人数',templet: function(val) {
                return _this.formatText(val.apple_terminal_cnt);
            }}
            , {field: 'oppo_terminal_cnt', title: 'OPPO品牌终端人数',templet: function(val) {
                return _this.formatText(val.oppo_terminal_cnt);
            }}
            , {field: 'vivo_terminal_cnt', title: 'VIVO品牌终端人数',templet: function(val) {
                return _this.formatText(val.vivo_terminal_cnt);
            }}
            , {field: 'huawei_terminal_cnt', title: '华为品牌终端人数',templet: function(val) {
                return _this.formatText(val.huawei_terminal_cnt);
            }}
            , {field: 'xiaomi_terminal_cnt', title: '小米品牌终端人数',templet: function(val) {
                return _this.formatText(val.xiaomi_terminal_cnt);
            }}

            , {field: 'high_consumption_cnt', title: '高消费人数',templet: function(val) {
                return _this.formatText(val.high_consumption_cnt);
            }}
            , {field: 'moderate_consumption_cnt', title: '中消费人数',templet: function(val) {
                return _this.formatText(val.moderate_consumption_cnt);
            }}
            , {field: 'low_consumption_cnt', title: '低消费人数',templet: function(val) {
                return _this.formatText(val.low_consumption_cnt);
            }}

            , {field: 'social_app_cnt', title: '社交类APP人数',templet: function(val) {
                return _this.formatText(val.social_app_cnt);
            }}
            , {field: 'gaem_app_cnt', title: '游戏娱乐类APP人数',templet: function(val) {
                return _this.formatText(val.gaem_app_cnt);
            }}
            , {field: 'shopping_app_cnt', title: '购物类APP人数',templet: function(val) {
                return _this.formatText(val.shopping_app_cnt);
            }}
            , {field: 'movies_app_cnt', title: '图书影音类APP人数',templet: function(val) {
                return _this.formatText(val.movies_app_cnt);
            }}
            , {field: 'travel_app_cnt', title: '旅游出行类APP人数',templet: function(val) {
                return _this.formatText(val.travel_app_cnt);
            }}

            , {field: 'travel_walk', title: '步行出行人数',templet: function(val) {
                return _this.formatText(val.travel_walk);
            }}
            , {field: 'travel_bike', title: '自行车出行人数',templet: function(val) {
                return _this.formatText(val.travel_bike);
            }}
            , {field: 'travel_bus', title: '公交出行人数',templet: function(val) {
                return _this.formatText(val.travel_bus);
            }}
            , {field: 'travel_metro', title: '地铁出行人数',templet: function(val) {
                return _this.formatText(val.travel_metro);
            }}
            , {field: 'travel_car', title: '驾车出行人数',templet: function(val) {
                return _this.formatText(val.travel_car);
            }}

            , {field: 'retention_time_60m', title: '驻留30-60min人数',templet: function(val) {
                return _this.formatText(val.retention_time_60m);
            }}
            , {field: 'retention_time_2h', title: '驻留1-2小时人数',templet: function(val) {
                return _this.formatText(val.retention_time_2h);
            }}
            , {field: 'retention_time_4h', title: '驻留2-4小时人数',templet: function(val) {
                return _this.formatText(val.retention_time_4h);
            }}
            , {field: 'retention_time_4h_more', title: '驻留4小时以上人数',templet: function(val) {
                return _this.formatText(val.retention_time_4h_more);
            }}
        ];
        for (let i = 0; i < cols.length; i++) {
            if(!cols[i].width) {
                var title = cols[i].title;
                var chineseChar = title.replace(/[^\u4e00-\u9fa5|,]+/,'');
                cols[i].width = chineseChar.length * 20 + (title.length - chineseChar.length)*8;
            }
        }
        var loadIndex;
        table.render({
            elem: '#detail-data'
            ,
            url: URL_ROOT + '/demo/getDetailData?day_st=' + _this.startDay +"&hour_st="+ _this.startTime + "&field_name=" + field + "&day_end=" + _this.endDay + "&hour_end=" + _this.endTime+"&busi_id="+_this.busiId+"&city_id="+_this.cityId
            ,
            height: $("#detail-data-box").height()
            ,
            page: true
            ,
            cols: [cols]
            ,before: function(obj){//参数
                loadIndex = layer.load(2, { shade: [0.15, '#ccc'] });
            },
            done: function() {
                layer.close(loadIndex); 
            }
        });
        //监听行单击事件（双击事件为：rowDouble）
        table.on('row(detail-data)', function(obj){
            //标注选中样式
            obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
            var data = obj.data;
            if(gis) {
                var minLon = Math.min(data.leftup_lon, data.rightdown_lon);
                var maxLon = Math.max(data.leftup_lon, data.rightdown_lon);
                var minLat = Math.min(data.leftup_lat, data.rightdown_lat);
                var maxLat = Math.max(data.leftup_lat, data.rightdown_lat);
                var centerLon = minLon + (maxLon - minLon)/2;
                var centerLat = minLat + (maxLat - minLat)/2;
                gis.setCenter(centerLon, centerLat);
                gis.addGridInfoTip(data);
            }
        });
    });

    //栅格显示隐藏设置
    var onOff = true;
    $("#js_data_btn").on("click", function () {
        if (onOff) {
            $(this).attr("class", "icon icon-plus");
            $("#js_dataTable").hide();
            $("#table-title").html("");
            $('.table-title').css("background-color","rgba(23,50,112,0)");
        } else {
            $(this).attr("class", "icon icon-minus");
            $("#table-title").html("栅格数据");
            $("#js_dataTable").show();
            $('.table-title').css("background-color","rgba(23,50,112,0.6)");
            var field = _this.field;
            for(var key in FIELD_NAMES) {
                if(FIELD_NAMES[key]==field) {
                    $("#table-title").html("栅格数据-"+key)
                    break;
                }
            }
        }
        onOff = !onOff;
    });
}

//加载图表列表
WisdomManageFn.prototype.loadChartList = function () {
    var _this = this;
    $('.analysis-charts-content').empty();
    $(".analysis-charts-content").block({message: '数据加载中...'});
    $.ajax({
        url: URL_ROOT + '/demo/getData',
        data: {
            city_id: _this.cityId,
            busi_id: _this.busiId,
            day_st: _this.startDay,
            day_end: _this.endDay,
            hour_st: _this.startTime,
            hour_end: _this.endTime,
        },
        success: function (data) {
            _this.historyData = data;
            if (data && data.length) {
                var obj = data[0];
                for(var key in obj) {
                    if(obj[key]<0||obj[key]==null) {
                        obj[key] = 0;
                    }
                }

                for(var key in _this.charts) {
                    if(_this.keyWord && _this.keyWord != '') {
                        var name = _this.charts[key].name;
                        if(name.indexOf(_this.keyWord) > -1) {
                            _this.charts[key].load(obj);
                        }
                    } else {
                        _this.charts[key].load(obj);
                    }
                }
            }
            $(".analysis-charts-content").unblock();
        },
        error: function() {
            $(".analysis-charts-content").unblock();
        }
    });
}

//图表
WisdomManageFn.prototype.charts = {
    userFlowCount: {
        name: '客流统计',
        load: function (data) {
            data = {
                currentPeopleNumber: data.cl_mdn_cnt,
                currentPeopleNumberIsTop: false,
                currentPeopleRotate: 5,
                allNumber: data.mdn_cnt,
                allNumberIsTop: "",
                allRotate: "",
                insideNumber: data.cnt_1_one,
                insideNumberIsTop: true,
                insideRotate: 8,
                currentPeopleNumber2: data.times,
                currentPeopleNumberIsTop2: false,
                currentPeopleRotate2: 5,
                allNumber2: Number((data.area_in_rate*100).toFixed(2)),
                allNumberIsTop2: "",
                allRotate2: "",
                insideNumber2: Number((data.in_rate*100).toFixed(2)),
                insideNumberIsTop2: true,
                insideRotate2: 8
            };
            var content = $('.analysis-charts-content');
            var html = `
            <div class="single-box feature">
            <div class="single-box-title">客流统计</div>
            <div class="single-box-content people-flow">
              <div class="people-flow-box">
                <div class="target-name">
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                  <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>
                  <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>
                </svg>
                  <span>累计人数</span> 
                <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                  <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>
                  <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>
                </svg>
              </div>
                <div class="target-value" id="all-plepeo">
                  <div class="target-number">2259</div>
                  <div class="target-rate">
                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">
                      <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>
                    </svg>
                    <span>5%</span>
                  </div>
                </div>
              </div>
              <div class="people-flow-box">
                <div class="target-name">
                  
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>
                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>
                  </svg>
                    <span>首次到访</span>
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>
                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>
                  </svg>
                </div>
                <div class="target-value" id="inside-rate">
                  <div class="target-number">71</div>
                  <div class="target-rate">
                    
                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">
                      <path d="M630.186667 596.138667h201.002666L530.218667 938.666667 213.333333 596.138667h214.186667V85.333333h202.666667v510.805334z" fill="red" p-id="4144"></path>
                    </svg>
                    <span>5%</span>
    
                  </div>
                </div>
              </div>
            </div>
            <div class="single-box-content people-flow">
              <div class="people-flow-box">
                <div class="target-name">
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>
                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>
                  </svg>
                    <span>平均驻留时长</span>
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>
                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>
                  </svg>
              </div>
                <div class="target-value" id="current-plepeo2">
                  <div class="target-number">1234</div>
                  <div class="target-rate">
                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">
                      <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>
                    </svg>
                    <span>5%</span>
                  </div>
                </div>
              </div>
              <div class="people-flow-box">
                <div class="target-name">
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                  <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>
                  <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>
                </svg>
                  <span>小区渗透率</span> 
                <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                  <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>
                  <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>
                </svg>
              </div>
                <div class="target-value" id="all-plepeo2">
                  <div class="target-number">63</div>
                  <div class="target-rate">
                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">
                      <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>
                    </svg>
                    <span>5%</span>
                  </div>
                </div>
              </div>
              <div class="people-flow-box">
                <div class="target-name">
                  
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>
                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>
                  </svg>
                    <span>进店率</span> 
                  <svg  viewBox="0 0 1024 1024"  width="12" height="12">
                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>
                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>
                  </svg>
                </div>
                <div class="target-value" id="inside-rate2">
                  <div class="target-number">71</div>
                  <div class="target-rate">
                    
                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">
                      <path d="M630.186667 596.138667h201.002666L530.218667 938.666667 213.333333 596.138667h214.186667V85.333333h202.666667v510.805334z" fill="red" p-id="4144"></path>
                    </svg>
                    <span>5%</span>
    
                  </div>
                </div>
              </div>
            </div>
            
          </div>
            `;
            content.append(html);
            var currentPlepeoData = '<div class="target-number">' + data.currentPeopleNumber + '</div>\
            <div class="target-rate">\
                ' + wisdomManage.judgeIsTop(data.currentPeopleNumberIsTop) + '\
                <span class="' + (data.currentPeopleNumberIsTop ? 'top' : 'bottom') + '">' + data.currentPeopleRotate + '%</span>\
            </div>';
                var allPlepeo = '<div class="target-number">' + data.allNumber + '</div>\
            <div class="target-rate">\
                ' + wisdomManage.judgeIsTop(data.allNumberIsTop) + '\
                <span class="' + (data.allNumberIsTop ? 'top' : 'bottom') + '">' + data.allRotate + '</span>\
            </div>';
                var insideRate = '<div class="target-number">' + data.insideNumber + '</div>\
            <div class="target-rate">\
            ' + wisdomManage.judgeIsTop(data.insideNumberIsTop) + '\
                <span class="' + (data.insideNumberIsTop ? 'top' : 'bottom') + '">' + data.insideRotate + '%</span>\
            </div>';
                var currentPlepeoData2 = '<div class="target-number">' + (data.currentPeopleNumber2?data.currentPeopleNumber2:0) + '分钟</div>\
            <div class="target-rate">\
                ' + wisdomManage.judgeIsTop(data.currentPeopleNumberIsTop2) + '\
                <span class="' + (data.currentPeopleNumberIsTop2 ? 'top' : 'bottom') + '">' + (data.currentPeopleRotate2?data.currentPeopleRotate2:0) + '%</span>\
            </div>';
                var allPlepeo2 = '<div class="target-number">' + (data.allNumber2?data.allNumber2 :0) + '%</div>\
            <div class="target-rate">\
                ' + wisdomManage.judgeIsTop(data.allNumberIsTop2) + '\
                <span class="' + (data.allNumberIsTop2 ? 'top' : 'bottom') + '">' + data.allRotate2 + '</span>\
            </div>';
                var insideRate2 = '<div class="target-number">' + (data.insideNumber2?data.insideNumber2:0) + '%</div>\
            <div class="target-rate">\
            ' + wisdomManage.judgeIsTop(data.insideNumberIsTop2) + '\
                <span class="' + (data.insideNumberIsTop2 ? 'top' : 'bottom') + '">' + data.insideRotate2 + '%</span>\
            </div>';

            $("#current-plepeo").html(currentPlepeoData);
            $("#all-plepeo").html(allPlepeo);
            $("#inside-rate").html(insideRate);
            $("#current-plepeo2").html(currentPlepeoData2);
            $("#all-plepeo2").html(allPlepeo2);
            $("#inside-rate2").html(insideRate2);
        }
    },
    userFlowCountCompareOfHours: {
        name: '小时客流统计对比分析',
        load: function () {
            var content = $('.analysis-charts-content');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">小时客流统计</div>
                    <div class="single-box-content  flex-layout">
                        <div id="user-flow-count-of-hours" class="echarts-box layout-all"></div>
                    </div>
                </div>
            `;
            content.append(html);

            $.ajax({
                url: URL_ROOT + '/demo/getDayData',
                data: {
                    day_st: wisdomManage.startDay,
                    day_end: wisdomManage.endDay,
                    hour_st: wisdomManage.startTime,
                    hour_end: wisdomManage.endTime,
                    busi_id: wisdomManage.busiId,
                    city_id: wisdomManage.cityId
                },
                success: function (countData) {
                    if (countData) {
                        var data = new Array();
                        var tmpData = {};
                        if(countData&&countData.length) {
                            for (var i = 0; i < countData.length; i++) {
                                tmpData[countData[i].hour_no+''] = countData[i].user_cnt;
                            }
                        }

                        var myChart = echarts.init(document.getElementById('user-flow-count-of-hours'));
                        var dataX = wisdomManage.getDateHourAxis(wisdomManage.startDay+wisdomManage.startTime, wisdomManage.endDay+wisdomManage.endTime);
                        dataX.forEach(val => {
                            var val1 = tmpData[val];
                            if(val1) {
                                data.push(val1);
                            } else {
                                data.push(0);
                            }
                        });
                        var option = {
                            tooltip: {
                                show: true,
                            },
                            dataZoom: [
                                {
                                    show: true,
                                    realtime: true,
                                    height: 10,
                                    start: 0,
                                    end: 50,
                                    showDetail: true,
                                    textStyle: {
                                        color: "#ffffff",
                                    },
                                    labelFormatter: function (value,name) {
                                        var timeStr = '';
                                        timeStr += Number(name.substring(4,6)) + '月';
                                        timeStr += Number(name.substring(6,8)) + '日 ';
                                        timeStr += Number(name.substring(8,10)) + ':00';
                                        return timeStr;
                                    }
                                }, {
                                    show: true,
                                    type: "inside",
                                    height: 10,
                                    start: 1,
                                    end: 50,
                                    textStyle: {
                                        color: "#ffffff",
                                    },
                                }
                            ],
                            grid: {
                                show: true,
                                left: "2%",
                                top: "20%",
                                right: "3%",
                                bottom: "40%",
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
                                        color: "#ccc",
                                        fontFamily: 'Microsoft YaHei',
                                        fontSize: 12,
                                        formatter: (value, index) => {
                                            return value.substring(8, 10);
                                        }
                                    },
                                    data: dataX,
                                    axisPointer: {
                                        type: 'shadow'
                                    },
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
                                                return "#7ab9ef"
                                                // if (params.dataIndex >= start && params.dataIndex <= end) {
                                                //     return "#7ab9ef"
                                                // } else {
                                                //     return "#727176"
                                                // }
                                            }
                                        }
                                    },
                                    tooltip: {
                                        show: true,
                                        formatter: function (params) {
                                            var timeStr = params.name.substring(0,4) + '年';
                                            timeStr += Number(params.name.substring(4,6)) + '月';
                                            timeStr += Number(params.name.substring(6,8)) + '日 ';
                                            timeStr += Number(params.name.substring(8,10)) + ':00';
                                            return "<div class='tooltip-box'>" +
                                                "<div class='num-box'><b>时间："+timeStr+"</b></div>" +
                                                "<div class='num-box'><b>"+params.marker+"到访客流："+params.value+"</b></div>" +
                                                "</div>";
                                        }
                                    },
                                    data: data
                                }
                            ]
                        };
                        myChart.setOption(option);
                    }
                }
            });
        }
    },
    travelModeAndComsumptionPerference: {
        name: '出行方式与消费偏好',
        load: function(obj) {
            data = {
                drive_trip_cnt: wisdomManage.formatNumber(obj.travel_car),
                metro_trip_cnt: wisdomManage.formatNumber(obj.travel_metro),
                transit_trip_cnt: wisdomManage.formatNumber(obj.travel_bus),
                walk_trip_cnt: wisdomManage.formatNumber(obj.travel_walk),
                low_consumption_cnt: wisdomManage.formatNumber(obj.consume_low),
                moderate_consumption_cnt: wisdomManage.formatNumber(obj.consume_medium),
                high_consumption_cnt: wisdomManage.formatNumber(obj.consume_high),
            };
            var content = $('.analysis-charts-content');
            var html = '\
                <div class="single-box feature">\
                    <div class="single-box-title">出行方式与消费偏好</div>\
                    <div class="single-box-content flex-layout">\
                        <div class="layout-right">\
                            <div class="travel-row">\
                                <div class="travel-row-flex1"><img src="image/travel_mode/car.png"></div>\
                                <div class="travel-row-flex2"><span>汽车</span></div>\
                                <div class="travel-row-flex3"><span>'+data.drive_trip_cnt+'</span></div>\
                            </div>\
                            <div class="travel-row">\
                                <div class="travel-row-flex1"><img src="image/travel_mode/subway.png"></div>\
                                <div class="travel-row-flex2"><span>地铁</span></div>\
                                <div class="travel-row-flex3"><span>'+data.metro_trip_cnt+'</span></div>\
                            </div>\
                            <div class="travel-row">\
                                <div class="travel-row-flex1"><img src="image/travel_mode/transit.png"></div>\
                                <div class="travel-row-flex2"><span>公交</span></div>\
                                <div class="travel-row-flex3"><span>'+data.transit_trip_cnt+'</span></div>\
                            </div>\
                            <div class="travel-row">\
                                <div class="travel-row-flex1"><img src="image/travel_mode/walk.png"></div>\
                                <div class="travel-row-flex2"><span>步行</span></div>\
                                <div class="travel-row-flex3"><span>'+data.walk_trip_cnt+'</span></div>\
                            </div>\
                        </div>\
                        <div class="echarts-box layout-left" id="comsumption_perference_pie"></div>\
                    </div>\
                </div>\
            ';
            content.append(html);
            data.high_consumption_cnt = 17;
            data.moderate_consumption_cnt = 46;
            data.low_consumption_cnt = 37;
            let color = ['#4d82e1', '#4dbd99', '#4f6487'];
            let chartData = [{
                    name: "高消费",
                    value: data.high_consumption_cnt,
                    unit: '人次'
                },
                {
                    name: "中消费",
                    value: data.moderate_consumption_cnt,
                    unit: '人次'
                },
                {
                    name: "低消费",
                    value: data.low_consumption_cnt,
                    unit: '人次'
                }
            ];
            let arrName = [];
            let arrValue = [];
            let sum = 0;
            let pieSeries = [],
                lineYAxis = [];

            // 数据处理
            chartData.forEach((v, i) => {
                arrName.push(v.name);
                arrValue.push(v.value);
                sum = sum + v.value;
            })

            // 图表option整理
            chartData.forEach((v, i) => {
                pieSeries.push({
                    name: '消费偏好',
                    type: 'pie',
                    clockWise: true,
                    hoverAnimation: false,
                    radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
                    center: ["30%", "50%"],
                    label: {
                        show: false
                    },
                    data: [{
                        value: v.value,
                        name: v.name
                    }, {
                        value: sum - v.value,
                        name: '',
                        itemStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    }]
                });
                v.percent = sum==0?0:((v.value / sum * 100).toFixed(1)) + "%";
                lineYAxis.push({
                    value: i,
                    textStyle: {
                        rich: {
                            circle: {
                                color: color[i],
                                padding: [0, 5]
                            }
                        }
                    }
                });
            })

            var comsumptionPerferenceChartOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        // var html = params.seriesName + " <br/>" + params.marker + params.name+ ": " + params.value + " ("+params.percent+"%)";
                        var html = params.seriesName + " <br/>" + params.marker + params.name+ ": "+params.percent+"%";
                        return html;
                    }
                },
                color: color,
                grid: {
                    top: '15%',
                    bottom: '54%',
                    left: "50%",
                    containLabel: false
                },
                yAxis: [{
                    type: 'category',
                    inverse: true,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function(params) {
                            let item = chartData[params];
                            return '{line|}{circle|●}{name|'+ item.name +'}';
                            // return '{line|}{circle|●}{name|'+ item.name +'}{bd||}{percent|'+item.percent+'}';
                        },
                        interval: 0,
                        inside: true,
                        textStyle: {
                            color: "#fff",
                            fontSize: 12,
                            rich: {
                                line: {
                                    width: 10,
                                    height: 10,
                                    // backgroundColor: {image: dashedPic}
                                },
                                name: {
                                    color: '#fff',
                                    fontSize: 12,
                                },
                                bd: {
                                    color: '#fff',
                                    padding: [0, 5],
                                    fontSize: 12,
                                },
                                percent:{
                                    color: '#fff',
                                    fontSize: 12,
                                }
                            }
                        },
                        show: true
                    },
                    data: lineYAxis
                }],
                xAxis: [{
                    show: false
                }],
                series: pieSeries
            };
            var comsumptionPerferenceChart = echarts.init(document.getElementById('comsumption_perference_pie'));
            comsumptionPerferenceChart.setOption(comsumptionPerferenceChartOption);
        }
    },
    resideAndfrequencyOfVisits: {
        name: '驻留时长及到访频次分布',
        load: function (data) {
            var content = $('.analysis-charts-content');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">驻留时长及到访频次分布</div>
                    <div class="single-box-content  flex-layout">
                        <div id="reside-bar" class="echarts-box layout-left"></div>
                        <div id="js_bar_echarts" class="echarts-box layout-right"></div>
                    </div>
                </div>
            `;
            content.append(html);

            //驻留时长
            var resideData = [
                {value: data.retention_time_4h_more, name: '4小时以上', unit: '', itemStyle: {color: "#76d3a6"}},
                {value: data.retention_time_4h, name: '2-4小时', unit: '', itemStyle: {color: "#5aabe2"}},
                {value: data.retention_time_2h, name: '1-2小时', unit: '', itemStyle: {color: "#cd3158"}},
                {value: data.retention_time_60m, name: '1小时以下', unit: '', itemStyle: {color: "#56aee0"}}
            ];
            
            var resideOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (data) {
                        data = data[0];
                        var value = data.value;
                        var unit = '';
                        if(value >= 10000){
                            value = value/10000;
                            value = Number(value.toFixed(2));
                            unit = '万';
                        } else  if(value >= 1000000){
                            value = value/1000000;
                            value = Number(value.toFixed(2));
                            unit = '百万';
                        } else  if(value >= 100000000){ 
                            value = value/100000000;
                            value = Number(value.toFixed(2));
                            unit = '亿';
                        }
                        var html = data.seriesName + " <br/>" + data.marker + data.name+ ": " + value + unit;
                        return html;
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
                            position: 'insideLeft',
                            formatter: function (data) {
                                var value = data.value;
                                var unit = '';
                                if(value >= 10000){
                                    value = value/10000;
                                    value = Number(value.toFixed(2));
                                    unit = '万';
                                } else  if(value >= 1000000){
                                    value = value/1000000;
                                    value = Number(value.toFixed(2));
                                    unit = '百万';
                                } else  if(value >= 100000000){ 
                                    value = value/100000000;
                                    value = Number(value.toFixed(2));
                                    unit = '亿';
                                }

                                return value + unit;
                            }
                        },
                        barWidth: '15%',
                        data: resideData
                    }
                ]
            };
            var resideChart =  echarts.init(document.getElementById('reside-bar'));
            resideChart.setOption(resideOption);
            resideChart.off("click");
            resideChart.on('click', function (param) {
                wisdomManage.fieldName = param.name;
                if (param.name == "1小时以下") {
                    wisdomManage.selectField('retention_time_60m')
                } else if (param.name == "1-2小时") {
                    wisdomManage.selectField('retention_time_2h')
                } else if (param.name == "2-4小时") {
                    wisdomManage.selectField("retention_time_4h")
                } else if (param.name == "4小时以上") {
                    wisdomManage.selectField("retention_time_4h_more")
                }
            });

            //到访频次分布
            var frequencyOfVisitsOption = {

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
        
                        data: [data.cnt_3_m, data.cnt_3, data.cnt_2, data.cnt_1].map((item, i) => {
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
            var frequencyOfVisitsChart = echarts.init(document.getElementById('js_bar_echarts'));
            frequencyOfVisitsChart.setOption(frequencyOfVisitsOption);
        }
    },
    genderAndAgeDistribution: {
        name: '性别及年龄段占比',
        load: function (data) {
            var content = $('.analysis-charts-content');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">性别年龄段占比</div>
                    <div class="single-box-content flex-layout">
                        <div class="layout-right">
                            <div class="sex-rows">
                            <span class="icon icon-man"></span>
                            <b style="font-size: 20px;"><strong style="font-weight: bold; font-size:36px;" id="man">42</strong>%</b>
                            </div>
                            <div class="sex-rows">
                            <span class="icon icon-women"></span>
                            <b style="font-size: 20px;"><strong style="font-weight: bold; font-size:36px;" id="woman">58</strong>%</b>
                            </div>
                        </div>
                        <div id="age-pie" class="echarts-box layout-left"></div>
                    </div>
                </div>
            `;
            content.append(html);
            var ageDistributionOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var html = params.seriesName + " <br/>" + params.marker + params.name+ ": " + params.value + '(' +params.percent + "%)";
                        return html;
                    }
                },
                grid: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                legend: {
                    orient: 'horizontal',
                    data: ['18岁以下', '18-25岁', '25-40岁', '40岁以上'],
                    right: "0%",
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
                        radius: ['35%', '55%'],
                        center: ['30%', '50%'],
                        data: [
                            {value: data.age_0_18_cnt, name: '18岁以下', itemStyle: {color: "#4a7fdd"}},
                            {value: data.age_18_25_cnt, name: '18-25岁', itemStyle: {color: "#4db9a1"}},
                            {value: data.age_25_40_cnt, name: '25-40岁', itemStyle: {color: "#b85cf2"}},
                            {value: data.old_age_cnt, name: '40岁以上', itemStyle: {color: "#d2a41d"}}
                        ],
                        label: {
                            show: false,
                            position: 'center',
                            formatter: params => {
                                return (params.name) + '\n' + (params.percent) + '%';
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
            var ageDistributionChart = echarts.init(document.getElementById('age-pie'));
            ageDistributionChart.setOption(ageDistributionOption);
            var man_rate = ((data.man_cnt/(data.man_cnt+data.women_cnt))*100).toFixed(2);
            var woman_rate = ((data.women_cnt/(data.man_cnt+data.women_cnt))*100).toFixed(2);
            man_rate = isNaN(man_rate)?0.00:man_rate;
            woman_rate = isNaN(woman_rate)?0.00:woman_rate;
            $('.analysis-charts-content #man').html(man_rate);
            $('.analysis-charts-content #woman').html(woman_rate);
            ageDistributionChart.off("click");
            ageDistributionChart.on('click', function (param) {
                wisdomManage.fieldName = param.name;
                if (param.name == "18岁以下") {
                    wisdomManage.selectField('age_0_18_cnt')
                } else if (param.name == "18-25岁") {
                    wisdomManage.selectField('age18_25_cnt')
                } else if (param.name == "25-40岁") {
                    wisdomManage.selectField('age_25_40_cnt')
                } else if (param.name == "40岁以上") {
                    wisdomManage.selectField("old_age_cnt")
                }
            });
        }
    },
    familyStructureAndCommunityDistribution: {
        name: '家庭结构及来源小区分布',
        load: function (data) {
            var content = $('.analysis-charts-content');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">家庭组成及来源小区分布</div>
                    <div class="single-box-content  flex-layout">
                    <div id="family-pie" class="layout-left echarts-box"></div>
                    <div id="family-bar" class="layout-right echarts-box"></div>
                    </div>
                </div>
            `;
            content.append(html);
            var familyStructureOption = {
                tooltip: {
                    trigger: 'item',
                    position: ['80%', '50%'],
                    formatter: function (params) {
                        var html = params.seriesName + " <br/>" + params.marker + params.name+ ": " + params.value + " ("+params.percent+"%)";
                        return html;
                    }
                },
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
                            {value: data.family_baby_cnt, name: '孕婴家庭', itemStyle: {color: "#507cdd"}},
                            {value: data.single_nct, name: '单身贵族', itemStyle: {color: "#4dbb96"}},
                            {value: data.lovers_cnt, name: '二人世界', itemStyle: {color: "#55648d"}},
                            {value: data.family_old_cnt, name: '家有老人', itemStyle: {color: "#d2a41d"}},
                            {value: data.family_children_cnt, name: '家有儿童', itemStyle: {color: "#c45d4c"}}
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
            var familyStructureChart = echarts.init(document.getElementById('family-pie'));
            familyStructureChart.setOption(familyStructureOption);
            familyStructureChart.off("click");
            familyStructureChart.on('click', function (param) {
                wisdomManage.fieldName = param.name;
                if (param.name == "孕婴家庭") {
                    wisdomManage.selectField(-5)
                } else if (param.name == "单身贵族") {
                    wisdomManage.selectField(-1)
                } else if (param.name == "二人世界") {
                    wisdomManage.selectField(-2)
                } else if (param.name == "家有老人") {
                    wisdomManage.selectField(-3)
                } else if (param.name == "家有儿童") {
                    wisdomManage.selectField(-4)
                }
            });

            var top5Cell = data.cellList;
            
            var server = '/demo/getTop10Cell';
            var params = {};
            params.day_st = wisdomManage.startDay;
            params.day_end =  wisdomManage.endDay;
            params.hour_st =  wisdomManage.startTime;
            params.hour_end =  wisdomManage.endTime;
            params.field_name = wisdomManage.field;
            params.busi_id = wisdomManage.busiId;

            $.ajax({
                url: URL_ROOT+server,
                method: 'get',
                data: params,
                dataType: 'json',
                success: function (top5Cell) {
                    if(top5Cell && top5Cell.length > 0) {
                        top5Cell.sort((a, b) => {return b.area_user_cnt - a.area_user_cnt});
                        if(top5Cell.length > 5) {
                            top5Cell = top5Cell.slice(0,5);
                        }
            
                        var titleName = new Array();
                        var userCnt = new Array();
                        var userCntRate = new Array();
                        for(var i=top5Cell.length-1;i>=0;i--) {
                            titleName.push(top5Cell[i].name);
                            userCnt.push(top5Cell[i].area_user_cnt);
                            userCntRate.push((top5Cell[i].area_rate*100).toFixed(2));
                        }
                        var communityDistributionOption = {
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
                                formatter: function (params) {
                                    var html = params.seriesName + " <br/>" + params.marker + params.name+ ": " + params.value + " ("+userCntRate[params.dataIndex]+"%)";
                                    return html;
                                }
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
                                data: titleName
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
                                data: titleName
                            },
                
                            ],
                            series: [
                                {
                                    type: 'bar',
                                    yAxisIndex: 1,
                                    barGap: '100%',
                                    barCategoryGap: "50%",
                                    data: userCnt,
                                    zlevel: 1,
                
                                    barWidth: '15%',
                
                                    label: {
                                        show: true,
                                        position: [0, -20],
                                        color: "#ffffff",
                                        formatter: function (data) {
                                            return titleName[data.dataIndex]
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
                                            return userCntRate[data.dataIndex] + "%"
                
                                        }
                                    },
                                    // itemStyle: {
                                    //     normal: {
                                    //         show: true,
                                    //         color: "#4c7ecd",
                                    //         barBorderRadius: 50,
                                    //         borderWidth: 1,
                                    //         borderColor: "#627d52"
                                    //     }
                                    // },
                                    zlevel: 2,
                                    barWidth: '15%',
                                    barCategoryGap: "50%",
                                    data: userCnt.map((item, i) => {
                                        itemStyle = {
                                            color: i%2==0 ? "#4ebc97" : "#4d82de"
                                        }
                                        return {
                                            value: item,
                                            itemStyle: itemStyle
                                        };
                                    })
                                },
                            ]
                        };
                        var communityDistributionChart = echarts.init(document.getElementById('family-bar'));
                        communityDistributionChart.setOption(communityDistributionOption);
                    }
                }
            });

        }
    },
    clientRateAndUsePreferencesDistribution: {
        name: '终端占比及使用偏好分布',
        load: function (data) {
            var content = $('.analysis-charts-content');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">终端占比及使用偏好</div>
                    <div class="single-box-content  flex-layout">
                    <div id="preferences_pie" class="layout-left  echarts-box"></div>
                    <div id="preferences_bar" class="layout-right  echarts-box"></div>
                    </div>
                </div>
            `;
            content.append(html);

            //终端占比
            var clientRateData = [
                {
                    value: data.huawei_terminal_cnt,
                    unit: '',
                    name: '华为'
                },
                {
                    value: data.xiaomi_terminal_cnt,
                    unit: '',
                    name: '小米'
                },
                {
                    value: data.vivo_terminal_cnt,
                    unit: '',
                    name: 'VIVO'
                },
                {
                    value: data.oppo_terminal_cnt,
                    unit: '',
                    name: 'OPPO'
                },
                {
                    value: data.apple_terminal_cnt,
                    unit: '',
                    name: "苹果"
                },
                {
                    value: data.other_terminal_cnt,
                    unit: '',
                    name: "其它"
                }
            ];

            var clientRateOption = {
                legend: {
                    orient: 'horizontal',
                    data: ['华为', '小米', 'VIVO', 'OPPO', '苹果','其它'],
                    show: true,
                    left: 0,
                    top: "5%",
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
                    position: ['80%', '50%'],
                    formatter: function (data) {
                        var value = data.value;
                        var unit = '';
                        if(value >= 10000){
                            value = value/10000;
                            value = Number(value.toFixed(2));
                            unit = '万';
                        } else  if(value >= 1000000){
                            value = value/1000000;
                            value = Number(value.toFixed(2));
                            unit = '百万';
                        } else  if(value >= 100000000){ 
                            value = value/100000000;
                            value = Number(value.toFixed(2));
                            unit = '亿';
                        }
                        var html = data.seriesName + " <br/>" + data.marker + data.name+ ": " + value + unit + " (" + data.percent+"%)";
                        return html;
                    }
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: [0, '50%'],
                        center: ["60%", "50%"],
                        label: {
                            normal: {
                                show: false,
                                formatter: function (data) {
                                    var value = data.value;
                                    var unit = '';
                                    if(value >= 10000){
                                        value = value/10000;
                                        value = Number(value.toFixed(2));
                                        unit = '万';
                                    } else  if(value >= 1000000){
                                        value = value/1000000;
                                        value = Number(value.toFixed(2));
                                        unit = '百万';
                                    } else  if(value >= 100000000){ 
                                        value = value/100000000;
                                        value = Number(value.toFixed(2));
                                        unit = '亿';
                                    }
                                    return value + unit;
                                }
                            }
                        },
                        data: clientRateData
                    },
    
                ]
            };
            var clientRateChart = echarts.init(document.getElementById('preferences_pie'));
            clientRateChart.setOption(clientRateOption);

            //使用偏好分布
            var usePreferencesDistributionData = [
                {
                    value: data.shopping_app_cnt,
                    name: '购物',
                    unit: ''
                },
                {
                    value: data.gaem_app_cnt,
                    name: '游戏',
                    unit: ''
                },
                {
                    value: data.travel_app_cnt,
                    name: '旅游',
                    unit: ''
                },
                {
                    value: data.movies_app_cnt,
                    name: '影音',
                    unit: ''
                },
                {
                    value: data.social_app_cnt,
                    name: '设计',
                    unit: ''
                },
            ];

            usePreferencesDistributionData.forEach((val, index) => {
                var value = val.value;
                val.itemStyle = {
                    color: index%2==0? "#4ebc97" : "#4d82de"
                };
            });

            var usePreferencesDistributionOption = {

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (data) {
                        data = data[0];
                        var value = data.value;
                        var unit = '';
                        if(value >= 10000){
                            value = value/10000;
                            value = Number(value.toFixed(2));
                            unit = '万';
                        } else  if(value >= 1000000){
                            value = value/1000000;
                            value = Number(value.toFixed(2));
                            unit = '百万';
                        } else  if(value >= 100000000){ 
                            value = value/100000000;
                            value = Number(value.toFixed(2));
                            unit = '亿';
                        }
                        var html = data.seriesName + " <br/>" + data.marker + data.name+ ": " + value + unit;
                        return html;
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
                    data: ['购物', '游戏', '旅游', '影音', '社交'].reverse()
        
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
                                color: "#ffffff",
                                formatter: function (data) {
                                    var value = data.value;
                                    var unit = '';
                                    if(value >= 10000){
                                        value = value/10000;
                                        value = Number(value.toFixed(2));
                                        unit = '万';
                                    } else  if(value >= 1000000){
                                        value = value/1000000;
                                        value = Number(value.toFixed(2));
                                        unit = '百万';
                                    } else  if(value >= 100000000){ 
                                        value = value/100000000;
                                        value = Number(value.toFixed(2));
                                        unit = '亿';
                                    }
                                    return value + unit;
                                }
                            }
        
                        },
                        data: usePreferencesDistributionData,
                    },
        
        
                ]
            };
            var usePreferencesDistributionChart = echarts.init(document.getElementById('preferences_bar'));
            usePreferencesDistributionChart.setOption(usePreferencesDistributionOption);
        }
    },

}

//判断是否顶部
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
};

//选中固定字段
WisdomManageFn.prototype.selectField = function (filedId) {
    var _this = this;
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
    _this.field = filedId;
    _this.loadDetailList(filedId);
    gis.updateHourNo(_this.startDay+_this.startTime,_this.endDay+_this.endTime);
};

//格式化文本
WisdomManageFn.prototype.formatText = function (text) {
    if(text == undefined || text == null || text == 'undefined' || text == 'null'){
        return '';
    } else {
        text = text+'';
        return text.trim();
    }
}

//格式化数字
WisdomManageFn.prototype.formatNumber = function (num) {
    num = Number(num);
    if(isNaN(num)) {
        return 0;
    } else {
        return Number(num);
    }
}


//获取日期刻度算法 ('20200501', '20200701')
WisdomManageFn.prototype.getDateAxis = function(startDateStr, endDateStr) {
    var startDate = new Date(startDateStr.substring(0,4)+'/'+startDateStr.substring(4,6)+'/'+startDateStr.substring(6,8));
    var endDate = new Date(endDateStr.substring(0,4)+'/'+endDateStr.substring(4,6)+'/'+endDateStr.substring(6,8));
    if(startDate.getTime() > endDate.getTime()) {
        var temp = startDate;
        startDate = endDate;
        endDate = temp;        
    }
    var tempArr = [];
    tempArr.push(startDate);
    while(startDate.getTime() < endDate.getTime()) {
        startDate = new Date(startDate.getTime() + 24*60*60*1000);
        tempArr.push(startDate);
    }

    var result = [];
    tempArr.forEach(el => {
        var year = el.getFullYear();
        var month = el.getMonth() + 1;
        var date = el.getDate();
        month = month<10?('0'+month):month;
        date = date<10?('0'+date):date;
        result.push(''+year+month+date);
    });

    return result;
}

//获取小时时间刻度算法 ('2020050110', '2020070122')
WisdomManageFn.prototype.getDateHourAxis = function(startDateHourStr, endDateHourStr) {
    var startDateStr = startDateHourStr.substring(0, 8);
    var endDateStr = endDateHourStr.substring(0, 8);
    var startHour = Number(startDateHourStr.substring(8, 10));
    var endHour = Number(endDateHourStr.substring(8, 10));
    var dateStrArr = this.getDateAxis(startDateStr, endDateStr);
    var timeArr = [];
    if(startHour > endHour) {
        var temp = startHour;
        startHour = endHour;
        endHour = temp;        
    }

    timeArr.push(startHour);
    while(startHour < endHour) {
        startHour += 1;
        timeArr.push(startHour);
    }

    var result = [];
    dateStrArr.forEach(el1 => {
        timeArr.forEach(el2 => {
            el2 = el2<10?('0'+el2):el2;
            result.push(el1+el2);
        });
    });
    return result;
}