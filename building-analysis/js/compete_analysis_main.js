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
    gis.init(wisdomManage.startDay+wisdomManage.startTime,wisdomManage.endDay+wisdomManage.endTime);
    wisdomManage.loadLoginInfo();
    wisdomManage.loadBusiSelect();
    wisdomManage.bindTimeDaySelect();
    wisdomManage.bindTimeDaySlider();
    wisdomManage.bindAnalysisBtns();
    wisdomManage.bindSwitchBtns();
    wisdomManage.bindAnalysisChartsSearch();
});

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
    wisdomManage.loadRankList();
    gis.updateHourNo(_this.startDay+_this.startTime,_this.endDay+_this.endTime,_this.field);
}

//改变楼宇
WisdomManageFn.prototype.changeBusi = function(busi) {
    var _this = this;
    _this.currentBusi =  busi;
    _this.busiId = busi.busi_id;
    _this.cityId = busi.city_id;
    if(gis.map) {
        gis.changeBusi(busi);
    }
    _this.loadRankList();
    $.cookie('busi_main_id', _this.busiId, { path: '/'});
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
                                    $.cookie('busi_main_id', val.busi_id, { path: '/'});
                                    _this.currentBusi =  val;
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
                // , min: startDay 设置最小日期
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
            _this.loadRankList();
            _this.field = "";
        }
    });

    $('#analysis-charts-search-btn').unbind().bind('click', function() {
        var value = $('#analysis-charts-search').val();
        _this.keyWord = value.replace(/(^\s*)|(\s*$)/g, "");
        $('#analysis-charts-search').val(_this.keyWord);
        _this.loadRankList();
        _this.field = "";
    });

    $('#analysis-charts-clear-btn').unbind().bind('click', function() {
        _this.keyWord = "";
        $('#analysis-charts-search').val(_this.keyWord);
        _this.loadRankList();
    });
}

/**
 * 加载排名列表
 */
WisdomManageFn.prototype.loadRankList = function () {
    var _this = this;
    $('.analysis-charts-content').empty();
    $('.left-box-local').empty();
    $(".left-box-local").block({message: '数据加载中...'});
    $(".analysis-charts-content").block({message: '数据加载中...'});
    $.ajax({
        url: URL_ROOT + '/competitor/queryMainQuotaList',
        method: 'get',
        data: {
            city_id: _this.cityId,
            busi_id: _this.busiId,
            day_st: _this.startDay,
            day_end: _this.endDay,
            hour_st: _this.startTime,
            hour_end: _this.endTime
        },
        success: function(res) {
            if(res && res.code == 0 && res.data.length > 0){
                var localData;
                res.data.forEach(val => {
                    if(val.type == _this.busiId) {
                        localData = val;
                        var busiName = _this.formatLabel(val.name);
                        var sortNum = _this.formatSortNum(val.sortNum);
                        var totalUserCnt = _this.formatLabel(val.totalUserCnt);
                        var avgResideTimes = (_this.formatNumber(val.avgResideTimes)/60).toFixed(0);
                        var avgResideTimesStr = avgResideTimes + '分钟';
                        // if(avgResideTimes > 24) {
                        //     avgResideTimesStr = (avgResideTimes/24).toFixed(1) + '天'
                        // }  
                        var localHtml = '\
                        <div class="single-box feature">\
                            <div class="single-box-title">'+busiName+'</div>\
                            <div class="single-box-address">\
                                <span class="sort-address" onclick="gis.setCenter('+val.longitude+','+val.latitude+')">'+val.address+'</span>\
                            </div>\
                            <div class="single-box-content">\
                                <div class="sort-flow">\
                                    <div class="sort-flow-item">\
                                        <div class="sort-flow-item-v1"><span>客流排名</span></div>\
                                        <div class="sort-flow-item-rank"><span>'+sortNum+'</span></div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>累计客流</span></div>\
                                        <div class="sort-flow-item-v2"><span>' + totalUserCnt + '</span></div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>重叠客流</span></div>\
                                        <div class="sort-flow-item-v2"><span>——</span></div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>重叠平均驻留时长</span>\</div>\
                                        <div class="sort-flow-item-v2"><span>——</span></div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        ';
                        $('.left-box-local').append(localHtml);
                    }
                });

                var data = res.data;
                data = data.filter(val => {
                    return _this.keyWord=='' || val.name.indexOf(_this.keyWord)>-1; 
                })
                gis.loadCompleteMarket(data);
                data.forEach(val => {
                    var content = $('.analysis-charts-content');
                    var isLocalSelf = _this.busiId == val.type;

                    var busiName = _this.formatLabel(val.name);
                    var sortNum = _this.formatSortNum(val.sortNum);
                    var totalUserCnt = _this.formatLabel(val.totalUserCnt);
                    var avgResideTimes = (_this.formatNumber(val.avgResideTimes)/60).toFixed(0);
                    var totalCompare = _this.formatSortNum(localData.totalUserCnt)==0?0:((_this.formatSortNum(val.totalUserCnt) - _this.formatSortNum(localData.totalUserCnt))/_this.formatSortNum(localData.totalUserCnt)).toFixed(2);
                    var overlapCompare = _this.formatSortNum(localData.overlapUserCnt)==0?0:((_this.formatSortNum(val.overlapUserCnt) - _this.formatSortNum(localData.overlapUserCnt))/_this.formatSortNum(localData.overlapUserCnt)).toFixed(2);
                    var avgResideCompare = _this.formatSortNum(localData.avgResideTimes)==0?0:((_this.formatSortNum(val.avgResideTimes) - _this.formatSortNum(localData.avgResideTimes))/_this.formatSortNum(localData.avgResideTimes)).toFixed(2);
                    var distanceFormat = '';
                    if(val.distance < 1000) {
                        distanceFormat = val.distance + '米';
                    } else if(val.distance >= 1000) {
                        distanceFormat = (val.distance/1000).toFixed(1) + '公里';
                    } 

                    var avgResideTimesStr = avgResideTimes + '分钟';
                    // if(avgResideTimes > 24) {
                    //     avgResideTimesStr = (avgResideTimes/24).toFixed(1) + '天'
                    // }  
                    // var html = '\
                    //     <div class="single-box feature">\
                    //         <div class="single-box-title">'+busiName+'\
                    //             <span class="sort-flow-distance">'+distanceFormat+'</span>\
                    //             <span class="sort-address" title="'+val.address+'" onclick="gis.setCenter('+val.longitude+','+val.latitude+')">'+val.address+'</span>\
                    //         </div>\
                    //         <div class="single-box-content">\
                    //             <div class="sort-flow">\
                    //                 <div class="sort-flow-item">\
                    //                     <div class="sort-flow-item-v1"><span>客流排名</span></div>\
                    //                     <div class="sort-flow-item-rank"><span>'+sortNum+'</span></div>\
                    //                 </div>\
                    //                 <div class="sort-flow-item" >\
                    //                     <div class="sort-flow-item-v1"><span>累计客流</span></div>\
                    //                     <div class="sort-flow-item-v2"><span>' + totalUserCnt + '</span></div>\
                    //                     <div class="sort-flow-item-v3"><span class='+(totalCompare>=0?'up':'down')+'>' + ((Math.abs(totalCompare))*100).toFixed(0) + '%</span><br/>与本方对比</div>\
                    //                 </div>\
                    //                 <div class="sort-flow-item" >\
                    //                     <div class="sort-flow-item-v1"><span>重叠客流</span></div>\
                    //                     <div class="sort-flow-item-v2"><span>'+val.overlapUserCnt+'</span></div>\
                    //                     <div class="sort-flow-item-v3"><span class='+(overlapCompare>=0?'up':'down')+'>' + ((Math.abs(overlapCompare))*100).toFixed(0) + '%</span><br/>与本方对比</div>\
                    //                 </div>\
                    //                 <div class="sort-flow-item" >\
                    //                     <div class="sort-flow-item-v1"><span>平均驻留时长</span>\</div>\
                    //                     <div class="sort-flow-item-v2"><span>'+avgResideTimesStr+'</span></div>\
                    //                     <div class="sort-flow-item-v3"><span class='+(avgResideCompare>=0?'up':'down')+'>' + ((Math.abs(avgResideCompare))*100).toFixed(0) + '%</span><br/>与本方对比</div>\
                    //                 </div>\
                    //             </div>\
                    //             <div class="sort-item sort-div">\
                    //                 <button type="button" class="layui-btn overlap-user-analysis" title="本方5KM范围内，既到访过本方，也到访过对方的客户" onclick="wisdomManage.competeAnalysis('+val.type+',1);">重叠客户分析</button>\
                    //                 <button type="button" class="layui-btn overlap-user-analysis" title="本方5KM范围内，只到访本方，未到访对方的客户" onclick="wisdomManage.competeAnalysis('+val.type+',2);">独占客户分析</button>\
                    //                 <button type="button" class="layui-btn overlap-user-analysis" title="本方5KM范围内，未到访本方，也未到访对方的客户" onclick="wisdomManage.competeAnalysis('+val.type+',3);">未转化客户分析</button>\
                    //             </div>\
                    //         </div>\
                    //     </div>\
                    // ';
                    var html = '\
                        <div class="single-box feature">\
                            <div class="single-box-title">'+busiName+'\
                                <span class="sort-flow-distance">'+distanceFormat+'</span>\
                            </div>\
                            <div class="single-box-address">\
                                <span class="sort-address" onclick="gis.setCenter('+val.longitude+','+val.latitude+')">'+val.address+'</span>\
                            </div>\
                            <div class="single-box-content">\
                                <div class="sort-flow">\
                                    <div class="sort-flow-item">\
                                        <div class="sort-flow-item-v1"><span>客流排名</span></div>\
                                        <div class="sort-flow-item-rank"><span>'+sortNum+'</span></div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>累计客流</span></div>\
                                        <div class="sort-flow-item-v2"><span>' + totalUserCnt + '</span></div>\
                                        <div class="sort-flow-item-v3"><span class='+(totalCompare>=0?'up':'down')+'>' + ((Math.abs(totalCompare))*100).toFixed(0) + '%</span><br/>与本方对比</div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>重叠客流</span></div>\
                                        <div class="sort-flow-item-v2"><span>'+val.overlapUserCnt+'</span></div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>重叠平均驻留时长</span>\</div>\
                                        <div class="sort-flow-item-v2"><span>'+avgResideTimesStr+'</span></div>\
                                    </div>\
                                </div>\
                                <div class="sort-item sort-div">\
                                    <button type="button" class="layui-btn overlap-user-analysis" title="本方5KM范围内，既到访过本方，也到访过对方的客户" onclick="wisdomManage.competeAnalysis('+val.type+',1);">重叠客户分析</button>\
                                    <button type="button" class="layui-btn overlap-user-analysis" title="本方5KM范围内，只到访本方，未到访对方的客户" onclick="wisdomManage.competeAnalysis('+val.type+',2);">独占客户分析</button>\
                                    <button type="button" class="layui-btn overlap-user-analysis" title="本方5KM范围内，未到访本方，也未到访对方的客户" onclick="wisdomManage.competeAnalysis('+val.type+',3);">待转化客户分析</button>\
                                </div>\
                            </div>\
                        </div>\
                    ';
                    if(isLocalSelf) {
                        html = '\
                        <div class="single-box feature">\
                            <div class="single-box-title">'+busiName+'\
                            </div>\
                            <div class="single-box-address">\
                                <span class="sort-address" onclick="gis.setCenter('+val.longitude+','+val.latitude+')">'+val.address+'</span>\
                            </div>\
                            <div class="single-box-content">\
                                <div class="sort-flow">\
                                    <div class="sort-flow-item">\
                                        <div class="sort-flow-item-v1"><span>客流排名</span></div>\
                                        <div class="sort-flow-item-rank"><span>'+sortNum+'</span></div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>累计客流</span></div>\
                                        <div class="sort-flow-item-v2"><span>' + totalUserCnt + '</span></div>\
                                    </div>\
                                    <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>重叠客流</span></div>\
                                        <div class="sort-flow-item-v2"><span>——</span></div>\
                                    </div>\
                                     <div class="sort-flow-item" >\
                                        <div class="sort-flow-item-v1"><span>重叠平均驻留时长</span>\</div>\
                                        <div class="sort-flow-item-v2"><span>——</span></div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    ';
                    }
                    content.append(html);
                });
            }
            $(".left-box-local").unblock();
            $(".analysis-charts-content").unblock();
        },
        error: function() {
            $(".left-box-local").unblock();
            $(".analysis-charts-content").unblock();
        }
    });
}

WisdomManageFn.prototype.competeAnalysis = function(busiId, chartType) {
    $.cookie('busi_compete_id', busiId, { path: '/'});
    $.cookie('busi_compete_type', chartType, { path: '/'});
    window.location.href = Common.url_static_root + '/compete_analysis.html';
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

//格式化排名
WisdomManageFn.prototype.formatSortNum = function (sortNum) {
    sortNum = Number(sortNum);
    if(isNaN(sortNum)) {
        return '--'
    } else {
        return sortNum<10?('0'+sortNum):sortNum;
    }
}
