var URL_ROOT = Common.url_server_root;
var wisdomManage;
$(function () {
    var date = new Date((new Date()).getTime() - 24*60*60*1000);
    // var start = date.Format('yyyyMMdd') + '00';
    // var end = date.Format('yyyyMMdd') + '23';
    var start = '2020110600';
    var end = '2020110623';

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
    wisdomManage.loadLoginInfo();
    wisdomManage.bindTimeDaySelect();
    wisdomManage.bindTimeDaySlider();
    wisdomManage.bindAnalysisBtns();
    wisdomManage.bindSwitchBtns();
    wisdomManage.bindAnalysisChartsSearch();
    wisdomManage.bindChartTypeSelect();
    wisdomManage.changeBusi();
})

function WisdomManageFn(start,end) {
    this.isLoadingEnd = true;
    this.startDay = start.toString().substr(0,8);
    this.endDay = end.toString().substr(0,8);
    this.startTime = start.toString().substr(8,10);
    this.endTime = end.toString().substr(8,10);
    this.chartType = $.cookie('busi_compete_type')||1;
    this.busiId1 = $.cookie('busi_main_id')||1;
    this.busiId2 = $.cookie('busi_compete_id')||4;
    this.busi1,this.busi2;
    this.historyData = {};
    this.field = "";
    this.fieldName = "";
    this.keyWord = "";
    this.layui = {};
    gis.init(this.startDay+this.startTime,this.endDay+this.endTime);
}

//更新
WisdomManageFn.prototype._update = function() {
    var _this = this;
    wisdomManage.loadCountInfo();
    wisdomManage.loadChartList();
    gis.updateHourNo(_this.startDay+_this.startTime,_this.endDay+_this.endTime,_this.field);
}

//改变楼宇
WisdomManageFn.prototype.changeBusi = function(busi_id1, busi_id2) {
    var _this = this;
    _this.busiId1 = busi_id1||_this.busiId1;
    _this.busiId2 = busi_id2||_this.busiId2;
    $.ajax({
        async: false,
        url: URL_ROOT + '/busi/queryById',
        method: 'get',
        data: {
            busi_id: _this.busiId1
        },
        success: function (res) {
            if(res && res.code == 0) {
                _this.busi1 =  res.data;
            }
        }
    });
    
    $.ajax({
        async: false,
        url: URL_ROOT + '/busi/queryById',
        method: 'get',
        data: {
            busi_id: _this.busiId2
        },
        success: function (res) {
            if(res && res.code == 0) {
                _this.busi2 =  res.data;
            }
        }
    });
    gis.changeBusi(_this.busi1, _this.busi2);
    var titleText = wisdomManage.formatLabel(wisdomManage.busi1.busi_name) + '与' + wisdomManage.formatLabel(wisdomManage.busi2.busi_name) + '对比分析'; 
    $('#mode_title').text(titleText);
    _this.loadCountInfo();
    _this.loadChartList();
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
                // , max: endDay //设置最大日期
                , done: function (value, date, endDate) {
                    if (value != null && value != '') {
                        value = value.replace(/-/g, "")
                        _this.startDay = value;
                        $.cookie('start_time', _this.startDay+_this.startTime, { path: '/'});
                        // _this._update();
                        // _this.bindTimeDaySelect();
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
                // , min: startDay //设置最小日期
                , done: function (value, date, endDate) {
                    if (value != null && value != '') {
                        value = value.replace(/-/g, "")
                        _this.endDay = value;
                        $.cookie('end_time', _this.endDay+_this.endTime, { path: '/'});
                        // _this._update();
                        // _this.bindTimeDaySelect();
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
        _this._update();
    });
}

//绑定切换按钮
WisdomManageFn.prototype.bindSwitchBtns = function () {
    var _this = this;
    $('#switch_user_flow').unbind().bind('click', function () {
        window.location.href = Common.url_static_root + '/user_flow_analysis.html';
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

//绑定图表搜索功能
WisdomManageFn.prototype.bindAnalysisChartsSearch = function () {
    var _this = this;
    $('#analysis-charts-search').keydown(function(event){
        if(event.keyCode == 13){
            _this.keyWord = this.value.replace(/(^\s*)|(\s*$)/g, "");
            this.value = _this.keyWord;
            _this.loadChartList();
            _this.field = "";
        }
    });

    $('#analysis-charts-search-btn').unbind().bind('click', function() {
        var value = $('#analysis-charts-search').val();
        _this.keyWord = value.replace(/(^\s*)|(\s*$)/g, "");
        $('#analysis-charts-search').val(_this.keyWord);
        _this.loadChartList();
        _this.field = "";
    });

    $('#analysis-charts-clear-btn').unbind().bind('click', function() {
        _this.keyWord = "";
        $('#analysis-charts-search').val(_this.keyWord);
        _this.loadChartList();
    });
}

//绑定图表类型选择
WisdomManageFn.prototype.bindChartTypeSelect = function() {
    var _this = this;
    $('.single-title-tab.selected').removeClass('selected');
    $('.single-title-tab[chart-type='+_this.chartType+']').addClass('selected');
    $('.single-title-tab').unbind().bind('click', function() {
        if(_this.isLoadingEnd) {
            var chartType = $(this).attr('chart-type');
            if(chartType != _this.chartType) {
                _this.chartType = chartType;
                if(chartType == 4) {
                    history.back();
                } else {
                    $('.single-title-tab.selected').removeClass('selected');
                    $(this).addClass('selected');
                    _this.loadChartList();
                }
            }
        } else {
            layer.alert('数据加载未完成，请稍后再试。', {icon: 7});
        }
    });
}

//加载统计信息
WisdomManageFn.prototype.loadCountInfo = function () {
    var _this = this;
    $('#left_box_compete_count').empty();
    $('#left_box_compete_count').block({message: '数据加载中...'});
    var searchUrl = '/competitor/queryMainQuota';
    $.ajax({
        url: URL_ROOT + searchUrl,
        method: 'get',
        data: {
            busi_id: _this.busiId1,
            city_id: _this.busi1.city_id,
            competitor_busi_id: _this.busiId2,
            day_st: _this.startDay,
            day_end: _this.endDay,
            hour_st: _this.startTime,
            hour_end: _this.endTime
        },
        success: function (res) {
            if(res && res.code == 0) {
                var data = res.data;
                _this.charts.userFlowCountCompare.load(data);
            }

            $('#left_box_compete_count').unblock();
        },
        error: function() {
            $('#left_box_compete_count').unblock();
        }
    });
}

/**
 * 加载图表列表
 */
WisdomManageFn.prototype.loadChartList = function () {
    var _this = this;
    _this.isLoadingEnd = false;
    $('.analysis-charts-content').empty();
    $('#left_box_compete_trend').empty();
    $('#left_box_compete_hour').empty();
    $(".analysis-charts-content").block({message: '数据加载中...'});
    var searchUrl = '/competitor/queryOverlapQuotaList';
    var charts = [];

    if( _this.chartType == 1) {//重叠客流
        searchUrl = '/competitor/queryOverlapQuotaList';
        charts.push(_this.charts.overlapUserFlowArriveTime);
        charts.push(_this.charts.overlapUserFlowChangeTrend);
        charts.push(_this.charts.resideAndfrequencyOfVisits);
        charts.push(_this.charts.userFlowCountCompareOfHours);
        charts.push(_this.charts.travelModeAndComsumptionPerference);
    } else if( _this.chartType == 2) {//独占客流
        searchUrl = '/competitor/queryMonopolyQuotaList';
        charts.push(_this.charts.monopolyUserFlowArriveTime);
        charts.push(_this.charts.monopolyUserFlowChangeTrend);
        charts.push(_this.charts.userFlowCountCompareOfHours);
        charts.push(_this.charts.travelModeAndComsumptionPerference);
    } else if( _this.chartType == 3) {//待转化客流
        searchUrl = '/competitor/queryUnconvertedQuotaList';
        // charts.push(_this.charts.untransformedUserChangeTrend);
    }
    charts.push(_this.charts.genderAndAgeDistribution);
    charts.push(_this.charts.familyStructureAndCommunityDistribution);
    charts.push(_this.charts.clientRateAndUsePreferencesDistribution);

    $.ajax({
        url: URL_ROOT + searchUrl,
        method: 'get',
        data: {
            busi_id: _this.busiId1,
            city_id: _this.busi1.city_id,
            competitor_busi_id: _this.busiId2,
            day_st: _this.startDay,
            day_end: _this.endDay,
            hour_st: _this.startTime,
            hour_end: _this.endTime
        },
        success: function (res) {
            if(res && res.code == 0) {

                var data = res.data;
                for(var key in data) {
                    if(data[key]<0||data[key]==null) {
                        data[key] = 0;
                    }
                }

                for (var i = 0; i < charts.length; i++) {
                    var el = charts[i];
                    if(_this.keyWord && _this.keyWord != '') {
                        var name = el.name;
                        if(name.indexOf(_this.keyWord) > -1) {
                            el.load(data);
                        }
                    } else {
                        el.load(data);
                    }
                }
            }

            _this.isLoadingEnd =true;
            $(".analysis-charts-content").unblock();
        },
        error: function() {
            _this.isLoadingEnd = true;
            $(".analysis-charts-content").unblock();
        }
    });
}

WisdomManageFn.prototype.charts = {
    userFlowCountCompare: {
        name: '客流对比统计',
        load: function (obj) {
            var data = {
                localUserFlowNum: wisdomManage.formatNumber(obj.self_total_flow),
                otherUserFlowNum: wisdomManage.formatNumber(obj.other_total_flow),
                localUserCntNum: wisdomManage.formatNumber(obj.self_total_user),
                otherUserCntNum: wisdomManage.formatNumber(obj.other_total_user),
                overlapUserCntNum: wisdomManage.formatNumber(obj.overlap_user),
                localMonopolyUserCntNum: wisdomManage.formatNumber(obj.self_monopoly_user),
                otherMonopolyUserCntNum: wisdomManage.formatNumber(obj.other_monopoly_user),
                untransformedUserCntNum: wisdomManage.formatNumber(obj.unconverted_user),
            };

            $('#left_box_compete_count').empty();
            var content = $('#left_box_compete_count');
            var html = '\
                <div class="single-box feature">\
                    <div class="single-box-title">客流对比统计</div>\
                    <div class="single-box-content people-flow">\
                        <div class="people-flow-box">\
                            <div class="target-name">\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>\
                                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>\
                                </svg>\
                                    <span>本方累计客流量</span>\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>\
                                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>\
                                </svg>\
                            </div>\
                            <div class="target-value">\
                                <div class="target-number">'+data.localUserFlowNum+'</div>\
                                <div class="target-rate">\
                                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">\
                                        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
                                    </svg>\
                                    <span>5%</span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="people-flow-box">\
                            <div class="target-name">\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>\
                                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>\
                                </svg>\
                                    <span>对方累计客流量</span>\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>\
                                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>\
                                </svg>\
                            </div>\
                            <div class="target-value">\
                                <div class="target-number">'+data.otherUserFlowNum+'</div>\
                                <div class="target-rate">\
                                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">\
                                        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
                                    </svg>\
                                    <span>5%</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="single-box-content people-flow">\
                        <div class="people-flow-box">\
                            <div class="target-name">\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>\
                                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>\
                                </svg>\
                                    <span>本方累计客户数</span>\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>\
                                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>\
                                </svg>\
                            </div>\
                            <div class="target-value">\
                                <div class="target-number">'+data.localUserCntNum+'</div>\
                                <div class="target-rate">\
                                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">\
                                        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
                                    </svg>\
                                    <span>5%</span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="people-flow-box">\
                            <div class="target-name">\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>\
                                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>\
                                </svg>\
                                    <span>对方累计客户数</span>\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>\
                                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>\
                                </svg>\
                            </div>\
                            <div class="target-value">\
                                <div class="target-number">'+data.otherUserCntNum+'</div>\
                                <div class="target-rate">\
                                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">\
                                        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
                                    </svg>\
                                    <span>5%</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="single-box-content people-flow">\
                        <div class="people-flow-box">\
                            <div class="target-name">\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>\
                                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>\
                                </svg>\
                                    <span class="title-tip" title="本方5KM范围内，既到访过本方，也到访过对方的客户">重叠客户数</span>\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>\
                                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>\
                                </svg>\
                            </div>\
                            <div class="target-value">\
                                <div class="target-number">'+data.overlapUserCntNum+'</div>\
                                <div class="target-rate">\
                                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">\
                                        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
                                    </svg>\
                                    <span>5%</span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="people-flow-box">\
                            <div class="target-name">\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>\
                                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>\
                                </svg>\
                                    <span class="title-tip" title="本方5KM范围内，只到访本方，未到访对方的客户">独占客户数</span>\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>\
                                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>\
                                </svg>\
                            </div>\
                            <div class="target-value">\
                                <div class="target-number">'+data.localMonopolyUserCntNum+'</div>\
                                <div class="target-rate">\
                                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">\
                                        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
                                    </svg>\
                                    <span>5%</span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="people-flow-box">\
                            <div class="target-name">\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M557.37576846 546.24124707c4.87353164-4.76106592 8.62240253-10.45934912 11.05916836-16.7199627 0.86224042-2.13685664 0.86224042-4.49864473 1.46205878-6.74796708 0.82475156-3.59891542 1.9494123-6.93541055 1.94941319-10.57181574 0-3.6364043-1.12466162-6.93541055-1.94941319-10.45934911-0.59981924-2.24932237-0.59981924-4.61111133-1.49954765-6.74796708a47.91056661 47.91056661 0 0 0-11.02167949-16.86991817L143.87533526 76.47026591A49.26016055 49.26016055 0 0 0 75.68337763 75.49555977 45.9611543 45.9611543 0 0 0 76.65808467 141.7381042L457.88074121 512.12652471 76.58310693 882.51494521a45.9611543 45.9611543 0 0 0-0.93721815 66.24254444c19.11924052 17.99457891 49.59755859 17.61969199 68.15446874-0.93721817L557.37576846 546.24124707z" p-id="2500"></path>\
                                    <path fill="#367ca1" d="M466.50314375 141.7381042L847.76328916 512.12652471l-381.26014541 370.46339736c-19.11924052 17.99457891-19.53161631 47.61065742-1.01219502 66.16756759 9.14724404 8.62240253 21.48102862 13.42095733 34.30216582 13.23351297 12.74616035-0.18744346 24.96747832-5.28590742 33.85230206-14.245708l413.57541093-401.72897989c4.83604277-4.76106592 8.58491367-10.42186026 11.02167949-16.68247383 1.01219502-2.06187891 1.01219502-4.38617901 1.49954855-6.74796708 0.86224042-3.48644971 1.98690117-6.82294482 1.98690116-10.45934912 0-3.6364043-1.12466162-6.89792168-1.94941318-10.42186114-0.59981924-2.24932237-0.59981924-4.61111133-1.49954767-6.74796709a47.34823623 47.34823623 0 0 0-10.94670263-16.86991728L533.79537208 76.39528818a49.3351374 49.3351374 0 0 0-68.19195763-0.86224042 46.07362002 46.07362002 0 0 0 0.8997293 66.24254443z"  p-id="2501"></path>\
                                </svg>\
                                    <span class="title-tip" title="本方5KM范围内，未到访本方，也未到访对方的客户">待转化客户数</span>\
                                <svg  viewBox="0 0 1024 1024"  width="12" height="12">\
                                    <path fill="#367ca1" d="M466.62423154 477.75875293c-4.87353164 4.76106592-8.62240253 10.45934912-11.05916836 16.7199627-0.86224042 2.13685664-0.86224042 4.49864473-1.46205878 6.74796708-0.82475156 3.59891542-1.9494123 6.93541055-1.94941319 10.57181574 0 3.6364043 1.12466162 6.93541055 1.94941319 10.45934911 0.59981924 2.24932237 0.59981924 4.61111133 1.49954765 6.74796708a47.91056661 47.91056661 0 0 0 11.02167949 16.86991817L880.12466474 947.52973409A49.26016055 49.26016055 0 0 0 948.31662237 948.50444023 45.9611543 45.9611543 0 0 0 947.34191533 882.2618958L566.11925879 511.87347529 947.41689307 141.48505479a45.9611543 45.9611543 0 0 0 0.93721815-66.24254444c-19.11924052-17.99457891-49.59755859-17.61969199-68.15446874 0.93721817L466.62423154 477.75875293z"  p-id="2364"></path>\
                                    <path fill="#367ca1" d="M557.49685625 882.2618958L176.23671084 511.87347529l381.26014541-370.46339736c19.11924052-17.99457891 19.53161631-47.61065742 1.01219502-66.16756759-9.14724404-8.62240253-21.48102862-13.42095733-34.30216582-13.23351297-12.74616035 0.18744346-24.96747832 5.28590742-33.85230206 14.245708l-413.57541093 401.72897989c-4.83604277 4.76106592-8.58491367 10.42186026-11.02167949 16.68247383-1.01219502 2.06187891-1.01219502 4.38617901-1.49954855 6.74796708-0.86224042 3.48644971-1.98690117 6.82294482-1.98690116 10.45934912 0 3.6364043 1.12466162 6.89792168 1.94941318 10.42186114 0.59981924 2.24932237 0.59981924 4.61111133 1.49954767 6.74796709a47.34823623 47.34823623 0 0 0 10.94670263 16.86991728L490.20462792 947.60471182a49.3351374 49.3351374 0 0 0 68.19195763 0.86224042 46.07362002 46.07362002 0 0 0-0.8997293-66.24254443z" p-id="2365"></path>\
                                </svg>\
                            </div>\
                            <div class="target-value">\
                                <div class="target-number">'+data.untransformedUserCntNum+'</div>\
                                <div class="target-rate">\
                                    <svg  viewBox="0 0 1024 1024"   width="12" height="12">\
                                        <path d="M639.903553 1023.653099v-511.612167h255.805061L511.999488 0.346901 128.290363 512.041956h255.80506v511.611143h255.80813z" fill="green" p-id="4144"></path>\
                                    </svg>\
                                    <span>5%</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            ';
            content.append(html);
        }
    },
    travelModeAndComsumptionPerference: {
        name: '出行方式与消费偏好',
        load: function(obj) {
            var data = {
                drive_trip_cnt: wisdomManage.formatNumber(obj.travel_car),
                metro_trip_cnt: wisdomManage.formatNumber(obj.travel_metro),
                transit_trip_cnt: wisdomManage.formatNumber(obj.travel_transit),
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
            let sum = 0;
            let pieSeries = [],
                lineYAxis = [];

            // 数据处理
            chartData.forEach((v, i) => {
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
                v.percent = (sum == 0?'0':(v.value / sum * 100).toFixed(1)) + "%";
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
    userFlowCountCompareOfHours: {
        name: '小时客流统计对比分析',
        load: function (obj) {
            $('#left_box_compete_hour').empty();
            var content = $('#left_box_compete_hour');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">小时客流统计对比分析</div>
                    <div class="single-box-content  flex-layout">
                        <div id="user-flow-count-of-hours" class="echarts-box layout-all"></div>
                    </div>
                </div>
            `;
            content.append(html);

            var series = [];
            var dataXArr = wisdomManage.getDateHourAxis(wisdomManage.startDay+wisdomManage.startTime, wisdomManage.endDay+wisdomManage.endTime);
            var dataLocalArr = [];
            var dataOtherArr = [];
            var tempDataObj = {};
            var arrivalTimeArr = obj.hour_flow||[];
            arrivalTimeArr.forEach(val => {
                tempDataObj[Number(val.hour_no)] = val;
            });


            dataXArr.forEach(val => {
                var temp = tempDataObj[val];
                if(temp) {
                    dataLocalArr.push(temp.self_flow);
                    dataOtherArr.push(temp.other_flow);
                } else {
                    dataLocalArr.push(0);
                    dataOtherArr.push(0);
                }
            });
            
            series.push({
                name: wisdomManage.busi1.busi_name,
                type: 'bar',
                legendHoverLink: true,
                barWidth: 10,
                barGap: 0,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            return "#3398db"
                            // if (params.dataIndex >= start && params.dataIndex <= end) {
                            //     return "#3398db"
                            // } else {
                            //     return "#b3b3b3"
                            // }
                        }
                    },
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
                            "<div class='num-box'><b>"+params.marker+params.seriesName+"："+params.value+"</b></div>" +
                            "</div>";
                    }
                },
                data: dataLocalArr
            });

            series.push({
                name: wisdomManage.busi2.busi_name,
                type: 'bar',
                legendHoverLink: true,
                barWidth: 10,
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
                    },
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
                            "<div class='num-box'><b>"+params.marker+params.seriesName+"："+params.value+"</b></div>" +
                            "</div>";
                    }
                },
                data: dataOtherArr
            });

            var myChart = echarts.init(document.getElementById('user-flow-count-of-hours'));
            var option = {
                color:['#3398db','#7ab9ef','#b3b3b3','#727176'],
                legend: {
                    right: '10px',
                    textStyle: {
                        color: "white",
                        fontSize: 12
                    },
                },
                tooltip: {
                    show: true,
                },
                dataZoom: [{
                        show: true,
                        realtime: true,
                        height: 10,
                        start: 0,
                        end: 24,
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
                        start: 0,
                        end: 24,
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
                        data: dataXArr,
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
                series: series
            };
            myChart.setOption(option);
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
                {name: '1小时以下(本)'},
                {name: '1-2小时(本)'},
                {name: '2-4小时(本)'},
                {name: '4小时以上(本)'},
                {name: '1小时以下(对)'},
                {name: '1-2小时(对)'},
                {name: '2-4小时(对)'},
                {name: '4小时以上(对)'},
            ];
            var resideDataLinks = [
                {source: '4小时以上(本)', target: '4小时以上(对)', value: wisdomManage.formatNumber(data.dwell_4to_4)},
                {source: '4小时以上(本)', target: '2-4小时(对)', value: wisdomManage.formatNumber(data.dwell_4to_2_4)},
                {source: '4小时以上(本)', target: '1-2小时(对)', value: wisdomManage.formatNumber(data.dwell_4to_1_2)},
                {source: '4小时以上(本)', target: '1小时以下(对)', value: wisdomManage.formatNumber(data.dwell_4to_1)},

                {source: '2-4小时(本)', target: '4小时以上(对)', value: wisdomManage.formatNumber(data.dwell_2_4to_4)},
                {source: '2-4小时(本)', target: '2-4小时(对)', value: wisdomManage.formatNumber(data.dwell_2_4to_2_4)},
                {source: '2-4小时(本)', target: '1-2小时(对)', value: wisdomManage.formatNumber(data.dwell_2_4to_1_2)},
                {source: '2-4小时(本)', target: '1小时以下(对)', value: wisdomManage.formatNumber(data.dwell_2_4to_1)},

                {source: '1-2小时(本)', target: '4小时以上(对)', value: wisdomManage.formatNumber(data.dwell_1_2to_4)},
                {source: '1-2小时(本)', target: '2-4小时(对)', value: wisdomManage.formatNumber(data.dwell_1_2to_2_4)},
                {source: '1-2小时(本)', target: '1-2小时(对)', value: wisdomManage.formatNumber(data.dwell_1_2to_1_2)},
                {source: '1-2小时(本)', target: '1小时以下(对)', value: wisdomManage.formatNumber(data.dwell_1_2to_1)},

                {source: '1小时以下(本)', target: '4小时以上(对)', value: wisdomManage.formatNumber(data.dwell_1to_4)},
                {source: '1小时以下(本)', target: '2-4小时(对)', value: wisdomManage.formatNumber(data.dwell_1to_2_4)},
                {source: '1小时以下(本)', target: '1-2小时(对)', value: wisdomManage.formatNumber(data.dwell_1to_1_2)},
                {source: '1小时以下(本)', target: '1小时以下(对)', value: wisdomManage.formatNumber(data.dwell_1to_1)},
            ];

            var resideOption = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                animation: false,
                series: {
                    type: 'sankey',
                    layout: 'none',
                    layoutIterations: 0,
                    focusNodeAdjacency: 'allEdges',
                    data: resideData,
                    links: resideDataLinks,
                    lineStyle: {
                        //线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比
                        color:new echarts.graphic.LinearGradient(0, 0, 1, 0, [{  //设置边为水平方向渐变
                            offset: 0,
                            color: '#136bff'
                        },{
                            offset: 1,
                            color: '#87ffd6'
                        }]),
                        curveness: 0.5,  //设置边的曲度
                        opacity:0.5  //设置边的透明度
                    },
                    itemStyle: {
                        color:'#1b6199',
                        borderWidth: 1,
                        borderColor: '#FFF'
                    },
                    label: {
                        show: true,
                        fontSize: '12',
                        fontWeight: 'normal',
                        color: '#FFF',
                        padding: [0, 0, 0, -30],
                        formatter: params => {
                            return params.name.substring(0, params.name.length - 3)
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '12',
                            fontWeight: 'normal',
                            color: '#FFF'
                        }
                    },
                }
            };

            var resideChart =  echarts.init(document.getElementById('reside-bar'));
            resideChart.setOption(resideOption); 

            //到访频次
            var frequencyOfVisitsData = [
                {name: '1-2次(本)'},
                {name: '3-5次(本)'},
                {name: '6-10次(本)'},
                {name: '10次以上(本)'},
                {name: '1-2次(对)'},
                {name: '3-5次(对)'},
                {name: '6-10次(对)'},
                {name: '10次以上(对)'},
            ];
            var frequencyOfVisitsDataLinks = [
                {source: '10次以上(本)', target: '10次以上(对)', value:  wisdomManage.formatNumber(data.visit_10to_10)},
                {source: '10次以上(本)', target: '6-10次(对)', value:  wisdomManage.formatNumber(data.visit_10to_6_10)},
                {source: '10次以上(本)', target: '3-5次(对)', value:  wisdomManage.formatNumber(data.visit_10to_3_5)},
                {source: '10次以上(本)', target: '1-2次(对)', value:  wisdomManage.formatNumber(data.visit_10to_1_2)},

                {source: '6-10次(本)', target: '10次以上(对)', value:  wisdomManage.formatNumber(data.visit_6_10to_10)},
                {source: '6-10次(本)', target: '6-10次(对)', value:  wisdomManage.formatNumber(data.visit_6_10to_6_10)},
                {source: '6-10次(本)', target: '3-5次(对)', value:  wisdomManage.formatNumber(data.visit_6_10to_3_5)},
                {source: '6-10次(本)', target: '1-2次(对)', value:  wisdomManage.formatNumber(data.visit_6_10to_1_2)},

                {source: '3-5次(本)', target: '10次以上(对)', value:  wisdomManage.formatNumber(data.visit_3_5to_10)},
                {source: '3-5次(本)', target: '6-10次(对)', value:  wisdomManage.formatNumber(data.visit_3_5to_6_10)},
                {source: '3-5次(本)', target: '3-5次(对)', value:  wisdomManage.formatNumber(data.visit_3_5to_3_5)},
                {source: '3-5次(本)', target: '1-2次(对)', value:  wisdomManage.formatNumber(data.visit_3_5to_1_2)},

                {source: '1-2次(本)', target: '10次以上(对)', value:  wisdomManage.formatNumber(data.visit_1_2to_10)},
                {source: '1-2次(本)', target: '6-10次(对)', value:  wisdomManage.formatNumber(data.visit_1_2to_6_10)},
                {source: '1-2次(本)', target: '3-5次(对)', value:  wisdomManage.formatNumber(data.visit_1_2to_3_5)},
                {source: '1-2次(本)', target: '1-2次(对)', value:  wisdomManage.formatNumber(data.visit_1_2to_1_2)},
            ];

            var frequencyOfVisitsOption = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                animation: false,
                series: {
                    name: '',
                    type: 'sankey',
                    layout: 'none',
                    layoutIterations: 0,
                    focusNodeAdjacency: 'allEdges',
                    data: frequencyOfVisitsData,
                    links: frequencyOfVisitsDataLinks,
                    lineStyle: {
                        //线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比
                        color:new echarts.graphic.LinearGradient(0, 0, 1, 0, [{  //设置边为水平方向渐变
                            offset: 0,
                            color: '#136bff'
                        },{
                            offset: 1,
                            color: '#87ffd6'
                        }]),
                        curveness: 0.5,  //设置边的曲度
                        opacity:0.5  //设置边的透明度
                    },
                    itemStyle: {
                        color:'#1b6199',
                        borderWidth: 1,
                        borderColor: '#FFF'
                    },
                    label: {
                        show: true,
                        fontSize: '12',
                        fontWeight: 'normal',
                        color: '#FFF',
                        padding: [0, 0, 0, -30],
                        formatter: params => {
                            return params.name.substring(0, params.name.length - 3)
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '12',
                            fontWeight: 'normal',
                            color: '#FFF'
                        }
                    },
                }
            };

            var frequencyOfVisitsChart =  echarts.init(document.getElementById('js_bar_echarts'));
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
                        var html = params.seriesName + " <br/>" + params.marker + params.name+ ": " + params.value + "%";
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
                            {value: data.age_18, name: '18岁以下', itemStyle: {color: "#4a7fdd"}},
                            {value: data.age_18_25, name: '18-25岁', itemStyle: {color: "#4db9a1"}},
                            {value: data.age_25_40, name: '25-40岁', itemStyle: {color: "#b85cf2"}},
                            {value: data.age_40, name: '40岁以上', itemStyle: {color: "#d2a41d"}}
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
            var ageDistributionChart = echarts.init(document.getElementById('age-pie'));
            ageDistributionChart.setOption(ageDistributionOption);

            var man_rate=0, woman_rate=0;
            if(wisdomManage.formatNumber(data.gender_man)!=0 || wisdomManage.formatNumber(data.gender_woman)!=0) {
                man_rate = wisdomManage.formatNumber(data.gender_man)/(wisdomManage.formatNumber(data.gender_man) + wisdomManage.formatNumber(data.gender_woman))
                woman_rate = wisdomManage.formatNumber(data.gender_woman)/(wisdomManage.formatNumber(data.gender_man) + wisdomManage.formatNumber(data.gender_woman))
            }
            man_rate = (man_rate*100).toFixed(2);
            woman_rate = (woman_rate*100).toFixed(2);
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
                            {value: data.family_gravida, name: '孕婴家庭', itemStyle: {color: "#507cdd"}},
                            {value: data.family_single, name: '单身贵族', itemStyle: {color: "#4dbb96"}},
                            {value: data.family_two, name: '二人世界', itemStyle: {color: "#55648d"}},
                            {value: data.family_elderly, name: '家有老人', itemStyle: {color: "#d2a41d"}},
                            {value: data.family_children, name: '家有儿童', itemStyle: {color: "#c45d4c"}}
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

            var top5Cell = data.top10_community;
            if(top5Cell) {
                top5Cell.sort((a, b) => {return b.user_cnt - a.user_cnt});
                if(top5Cell.length > 5) {
                    top5Cell = top5Cell.slice(0,5);
                }
            } else {
                top5Cell = [];
            }

            var titleName = new Array();
            var userCnt = new Array();
            var userCntRate = new Array();
            for(var i=top5Cell.length-1;i>=0;i--) {
                titleName.push(top5Cell[i].name);
                userCnt.push(top5Cell[i].user_cnt);
                userCntRate.push(((top5Cell[i].user_ratio)*100).toFixed(2));
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
                            var itemStyle = {
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

            var otherMobile = data.mobile_all - data.mobile_huawei - data.mobile_xiaomi - data.mobile_vivo - data.mobile_oppo - data.mobile_apple;

            //终端占比
            var clientRateData = [
                {
                    value: wisdomManage.formatNumber(data.mobile_huawei),
                    unit: '',
                    name: '华为'
                },
                {
                    value: wisdomManage.formatNumber(data.mobile_xiaomi),
                    unit: '',
                    name: '小米'
                },
                {
                    value: wisdomManage.formatNumber(data.mobile_vivo),
                    unit: '',
                    name: 'VIVO'
                },
                {
                    value: wisdomManage.formatNumber(data.mobile_oppo),
                    unit: '',
                    name: 'OPPO'
                },
                {
                    value: wisdomManage.formatNumber(data.mobile_apple),
                    unit: '',
                    name: "苹果"
                },
                {
                    value: wisdomManage.formatNumber(otherMobile),
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
                                // position: 'inner',
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
                    value: wisdomManage.formatNumber(data.app_shopping),
                    name: '购物',
                    unit: ''
                },
                {
                    value: wisdomManage.formatNumber(data.app_game),
                    name: '游戏',
                    unit: ''
                },
                {
                    value: wisdomManage.formatNumber(data.app_travel),
                    name: '旅游',
                    unit: ''
                },
                {
                    value: wisdomManage.formatNumber(data.app_video),
                    name: '影音',
                    unit: ''
                },
                {
                    value: wisdomManage.formatNumber(data.app_apple),
                    name: '社交',
                    unit: ''
                },
            ];

            usePreferencesDistributionData.forEach((val, index) => {
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
                    data: ['购物', '游戏', '旅游', '影音', '社交']
        
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
    overlapUserFlowArriveTime: {
        name: '重叠客流到店时段',
        load: function (obj) {
            var content = $('.analysis-charts-content');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">重叠客流到店时段</div>
                    <div class="single-box-content  flex-layout">
                        <div id="overlap-user-flow-arrive-bar" class="echarts-box layout-all"></div>
                    </div>
                </div>
            `;
            content.append(html);

            var dataXArr = wisdomManage.getDateHourAxis(wisdomManage.startDay+wisdomManage.startTime, wisdomManage.endDay+wisdomManage.endTime);
            var dataLocalArr = [];
            var dataOtherArr = [];
            var tempDataObj = {};
            var arrivalTimeArr = obj.arrival_time;
            arrivalTimeArr.forEach(val => {
                var datetimeStr = val.day_no + '' + (val.hour_no<10?('0'+ val.hour_no):val.hour_no);
                tempDataObj[Number(datetimeStr)] = val;
            });

            dataXArr.forEach(val => {
                var temp = tempDataObj[val];
                if(temp) {
                    dataLocalArr.push(temp.self_user);
                    dataOtherArr.push(temp.other_user);
                } else {
                    dataLocalArr.push(0);
                    dataOtherArr.push(0);
                }
            });

            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var timeStr = params[0].name.substring(0,4) + '年';
                        timeStr += Number(params[0].name.substring(4,6)) + '月';
                        timeStr += Number(params[0].name.substring(6,8)) + '日 ';
                        timeStr += Number(params[0].name.substring(8,10)) + ':00';
                            
                        var html = "<div class='tooltip-box'>" +
                            "<div class='num-box'><b>时间："+timeStr+"</b></div>" +
                            "<div class='num-box'><b>"+params[0].marker+params[0].seriesName+"："+params[0].value+"</b></div>" +
                            "<div class='num-box'><b>"+params[1].marker+params[1].seriesName+"："+params[1].value+"</b></div>" +
                            "</div>";
                        return html;
                    }
                },
                dataZoom: [{
                        show: true,
                        realtime: true,
                        height: 10,
                        start: 0,
                        end: 50,
                        bottom: '5%',
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
                legend: {
                    icon: "circle",
                    right: '8%',
                    textStyle: {
                        color: "#a7bdd3"
                    },
                    data: [wisdomManage.busi1.busi_name,wisdomManage.busi2.busi_name]
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    top: '10',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    data: dataXArr,
                    axisLabel: {
                        formatter: (value, index) => {
                            return value.substring(8,10);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {show : false},
                    splitArea: {show : false},
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    }
                },
                textStyle: {
                    color: "#a7bdd3"
                },
                series: [
                    {
                        name: wisdomManage.busi1.busi_name,
                        type: 'line',
                        smooth: true,
                        symbol: 'none', 
                        itemStyle: {
                            color:'#136bff',
                            borderWidth: 1,
                            borderColor: '#FFF'
                        },
                        data: dataLocalArr
                    },
                    {
                        name:  wisdomManage.busi2.busi_name,
                        type: 'line',
                        smooth: true,
                        symbol: 'none', 
                        itemStyle: {
                            color:'#87ffd6',
                            borderWidth: 1,
                            borderColor: '#FFF'
                        },
                        data: dataOtherArr
                    },
                ]
            };
            var chart =  echarts.init(document.getElementById('overlap-user-flow-arrive-bar'));
            chart.setOption(option); 
        }
    },
    overlapUserFlowChangeTrend: {
        name: '重叠客流变化趋势',
        load: function (obj) {
            $('#left_box_compete_trend').empty();
            var content = $('#left_box_compete_trend');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">重叠客流变化趋势</div>
                    <div class="single-box-content  flex-layout">
                        <div id="overlap-user-flow-change-trend-bar" class="echarts-box layout-all"></div>
                    </div>
                </div>
            `;
            content.append(html);

            var dataXArr = [];
            var dataArr = [];
            var tempDataObj = {};
            var flowTrendArr = obj.flow_trend;
            
            flowTrendArr.forEach(val => {
                tempDataObj[Number(val.day_no)] = val;
            });

            dataXArr = wisdomManage.get30DateAxisOfCurrent();
            dataXArr.forEach(val => {
                var temp = tempDataObj[val];
                if(temp) {
                    dataArr.push(temp.user_count);
                } else {
                    dataArr.push(0);
                }
            });
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var dateStr = (params[0].name).substring(0,4) + '年';
                        dateStr += Number((params[0].name).substring(4,6)) + '月';
                        dateStr += Number((params[0].name).substring(6,8)) + '日';
                        var html = dateStr
                        + " <br/>" + params[0].marker + params[0].seriesName+ ": " + params[0].value;
                        return html;
                    }
                },
                legend: {
                    show: true,
                    icon: "circle",
                    right: '8%',
                    textStyle: {
                        color: "#a7bdd3"
                    },
                    data: ['重叠客流变化趋势']
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    data: dataXArr,
                    axisLabel: {
                        formatter: (value, index) => {
                            return value.substring(6,8);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine : {show : false},
                    splitArea : {show : false},
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                },
                textStyle: {
                    color: "#a7bdd3"
                },
                series: [
                    {
                        name: '重叠客流变化趋势',
                        type: 'line',
                        smooth: true,
                        symbol: 'none', 
                        itemStyle: {
                            color:'#87ffd6',
                            borderWidth: 1,
                            borderColor: '#FFF'
                        },
                        data: dataArr
                    },
                ]
            };
            var chart =  echarts.init(document.getElementById('overlap-user-flow-change-trend-bar'));
            chart.setOption(option); 
        }
    },
    untransformedUserChangeTrend: {
        name: '待转化客户变化趋势',
        load: function (obj) {
            $('#left_box_compete_trend').empty();
            var content = $('#left_box_compete_trend');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">待转化客户变化趋势</div>
                    <div class="single-box-content  flex-layout">
                        <div id="untransformed_user_change_trend_bar" class="echarts-box layout-all"></div>
                    </div>
                </div>
            `;
            content.append(html);

            var dataXArr = [];
            var flowTrendArr = data.flow_trend;
            var dataArr = [];
            var tempDataObj = {};
            var flowTrendArr = obj.flow_trend;
            flowTrendArr.forEach(val => {
                tempDataObj[Number(val.day_no)] = val;
            });

            dataXArr = wisdomManage.get30DateAxisOfCurrent();
            dataXArr.forEach(val => {
                var temp = tempDataObj[val];
                if(temp) {
                    dataArr.push(temp.user_count);
                } else {
                    dataArr.push(0);
                }
            });

            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var dateStr = (params[0].name).substring(0,4) + '年';
                        dateStr += Number((params[0].name).substring(4,6)) + '月';
                        dateStr += Number((params[0].name).substring(6,8)) + '日';
                        var html = dateStr
                        + " <br/>" + params[0].marker + params[0].seriesName+ ": " + params[0].value;
                        return html;
                    }
                },
                legend: {
                    icon: "circle",
                    right: '8%',
                    textStyle: {
                        color: "#a7bdd3"
                    },
                    data: ['待转化客户']
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    data: dataXArr,
                    axisLabel: {
                        formatter: (value, index) => {
                            return value.substring(6,8);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine : {show : false},
                    splitArea : {show : false},
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                },
                textStyle: {
                    color: "#a7bdd3"
                },
                series: [
                    {
                        name: '待转化客户',
                        type: 'line',
                        smooth: true,
                        symbol: 'none', 
                        itemStyle: {
                            color:'#87ffd6',
                            borderWidth: 1,
                            borderColor: '#FFF'
                        },
                        data: dataArr
                    },
                ]
            };
            var chart =  echarts.init(document.getElementById('untransformed_user_change_trend_bar'));
            chart.setOption(option); 
        }
    },
    monopolyUserFlowArriveTime: {
        name: '独占客流到店时段',
        load: function (obj) {
            var content = $('.analysis-charts-content');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">独占客流到店时段</div>
                    <div class="single-box-content  flex-layout">
                        <div id="monopoly_user_flow_arrive_bar" class="echarts-box layout-all"></div>
                    </div>
                </div>
            `;
            content.append(html);

            var dataXArr = wisdomManage.getDateHourAxis(wisdomManage.startDay+wisdomManage.startTime, wisdomManage.endDay+wisdomManage.endTime);
            var dataLocalArr = [];
            var tempDataObj = {};
            var arrivalTimeArr = obj.arrival_time;
            arrivalTimeArr.forEach(val => {
                var datetimeStr = val.day_no + '' + (val.hour_no<10?('0'+ val.hour_no):val.hour_no);
                tempDataObj[Number(datetimeStr)] = val;
            });

            dataXArr.forEach(val => {
                var temp = tempDataObj[val];
                if(temp) {
                    dataLocalArr.push(temp.self_user);
                } else {
                    dataLocalArr.push(0);
                }
            });

            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var timeStr = params[0].name.substring(0,4) + '年';
                        timeStr += Number(params[0].name.substring(4,6)) + '月';
                        timeStr += Number(params[0].name.substring(6,8)) + '日 ';
                        timeStr += Number(params[0].name.substring(8,10)) + ':00';
                            
                        var html = "<div class='tooltip-box'>" +
                            "<div class='num-box'><b>时间："+timeStr+"</b></div>" +
                            "<div class='num-box'><b>"+params[0].marker+params[0].seriesName+"："+params[0].value+"</b></div>" +
                            "</div>";
                        return html;
                    }
                },
                dataZoom: [{
                        show: true,
                        realtime: true,
                        height: 10,
                        start: 0,
                        end: 50,
                        bottom: '5%',
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
                legend: {
                    icon: "circle",
                    right: '8%',
                    textStyle: {
                        color: "#a7bdd3"
                    },
                    data: [wisdomManage.busi1.busi_name]
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    top: '10',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    data: dataXArr,
                    axisLabel: {
                        formatter: (value, index) => {
                            return value.substring(8,10);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {show : false},
                    splitArea: {show : false},
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    }
                },
                textStyle: {
                    color: "#a7bdd3"
                },
                series: [
                    {
                        name: wisdomManage.busi1.busi_name,
                        type: 'line',
                        smooth: true,
                        symbol: 'none', 
                        itemStyle: {
                            color:'#87ffd6',
                            borderWidth: 1,
                            borderColor: '#FFF'
                        },
                        data: dataLocalArr
                    },
                ]
            };
            var chart =  echarts.init(document.getElementById('monopoly_user_flow_arrive_bar'));
            chart.setOption(option); 
        }
    },
    monopolyUserFlowChangeTrend: {
        name: '独占客流变化趋势',
        load: function (obj) {
            $('#left_box_compete_trend').empty();
            var content = $('#left_box_compete_trend');
            var html = `
                <div class="single-box feature">
                    <div class="single-box-title">独占客流变化趋势</div>
                    <div class="single-box-content  flex-layout">
                        <div id="monopoly_user_flow_change_trend_bar" class="echarts-box layout-all"></div>
                    </div>
                </div>
            `;
            content.append(html);

            var dataXArr = [];
            var dataLocalArr = [];
            var tempDataObj = {};
            var flowTrendArr = obj.flow_trend;
            flowTrendArr.forEach(val => {
                tempDataObj[Number(val.day_no)] = val;
            });

            dataXArr = wisdomManage.get30DateAxisOfCurrent();
            dataXArr.forEach(val => {
                var temp = tempDataObj[val];
                if(temp) {
                    dataLocalArr.push(temp.user_count);
                } else {
                    dataLocalArr.push(0);
                }
            });

            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var dateStr = (params[0].name).substring(0,4) + '年';
                        dateStr += Number((params[0].name).substring(4,6)) + '月';
                        dateStr += Number((params[0].name).substring(6,8)) + '日';
                        var html = dateStr
                        + " <br/>" + params[0].marker + params[0].seriesName+ ": " + params[0].value;
                        return html;
                    }
                },
                legend: {
                    icon: "circle",
                    right: '8%',
                    textStyle: {
                        color: "#a7bdd3"
                    },
                    data: [wisdomManage.busi1.busi_name]
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    data: dataXArr,
                    axisLabel: {
                        formatter: (value, index) => {
                            return value.substring(6,8);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine : {show : false},
                    splitArea : {show : false},
                    axisLine: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#a7bdd3'
                        }
                    },
                },
                textStyle: {
                    color: "#a7bdd3"
                },
                series: [
                    {
                        name: wisdomManage.busi1.busi_name,
                        type: 'line',
                        smooth: true,
                        symbol: 'none', 
                        itemStyle: {
                            color:'#87ffd6',
                            borderWidth: 1,
                            borderColor: '#FFF'
                        },
                        data: dataLocalArr
                    },
                ]
            };
            var chart =  echarts.init(document.getElementById('monopoly_user_flow_change_trend_bar'));
            chart.setOption(option); 
        }
    },
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
    // _this.loadDetailList(filedId);
    // gis.updateHourNo(_this.startDay+_this.startTime,_this.endDay+_this.endTime);
};

//格式化文本
WisdomManageFn.prototype.formatText = function (text) {
    if(!text || text == 'undefined' || text == 'null'){
        return '';
    } else {
        text = text+'';
        return text.trim();
    }
}


//格式化标签
WisdomManageFn.prototype.formatLabel = function (text) {
    if(!text || text == 'undefined' || text == 'null'){
        return '--';
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

//获取当前时间往前推30天时间刻度算法 
WisdomManageFn.prototype.get30DateAxisOfCurrent = function() {
    var currentDate = new Date();
    var len = 29;
    var tempArr = [];
    tempArr.push(currentDate);
    for (var i = 0; i < len; i++) {
        currentDate = new Date(currentDate.getTime() - 24*60*60*1000);
        tempArr.push(currentDate);
    }
    tempArr.reverse();

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
