
var opticalFunction= {
    // 脑图方法
    load_jsmind: function (picDatas) {
        var width = $("#picContainer2").width();
        var height = $("#picContainer2").height();
        console.log(width, height);
        $("#picContainer3").css("width", width).css("height", height);
        var mind = {
            "meta": {
                "name": "demo",
                "author": "hizzgdev@163.com",
                "version": "0.2",
            },
            "format": "node_array",
            "data": picDatas
        }
        var options = {
            container: 'picContainer3',         // [必选] 容器的ID
            editable: false,       // 是否启用编辑
            theme: 'primary',           // 主题
            mode: 'side',           // 显示模式
            support_html: true,    // 是否支持节点里的HTML元素
            view: {
                hmargin: 100,        // 思维导图距容器外框的最小水平距离
                vmargin: 100,         // 思维导图距容器外框的最小垂直距离
                line_width: 1,       // 思维导图线条的粗细
                line_color: '#ffffff'   // 思维导图线条的颜色
            },
            layout: {
                hspace: 20,          // 节点之间的水平间距
                vspace: 5,          // 节点之间的垂直间距
                pspace: 10           // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
            },
            shortcut: {
                enable: false,        // 是否启用快捷键
                handles: {},         // 命名的快捷键事件处理器
                mapping: {           // 快捷键映射
                    addchild: 45,    // <Insert>
                    addbrother: 13,    // <Enter>
                    editnode: 113,   // <F2>
                    delnode: 46,    // <Delete>
                    toggle: 32,    // <Space>
                    left: 37,    // <Left>
                    up: 38,    // <Up>
                    right: 39,    // <Right>
                    down: 40,    // <Down>
                }
            },
        };
        _jm = jsMind.show(options, mind);
    },

    // 散点图方法
    lisans: function (style, picData,level) {
        var myChart = echarts.init(document.getElementById('picContainer'));

        console.log('散点图')
        var picAll = picData;
            var option = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 0,
                    formatter : function (params) {
                        return params[0].data[2] + ' <br/>PRB资源利用率得分：'
                            + params[0].data[1] + ' 分<br/>平均载扇收入得分：'
                            + params[0].data[0]  + '分 ';
                    },
                    axisPointer: {
                        show: true,
                        type: 'cross',
                        lineStyle: {
                            type: 'dashed',
                            width: 2
                        }
                    },
                },
                title: [
                    {
                        text: "PRB资源利用率高/平均载扇收入高", x: '65%', y: '5%', textStyle: {
                            color: style.lisans[2],
                            fontSize: 12,
                            fontWeight: 'normal',
                        }
                    },
                ],
                grid: {
                    top: 15,
                    left: 80,
                    bottom: 25,
                    right: 60
                },
                xAxis: [
                    {
                        type: 'value',
                        splitNumber: 4,
                        scale: true,
                        axisLine: {

                            lineStyle: {
                                color: style.lisans[1],
                                width: 1
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: style.lisans[1],
                                width: 1
                            }
                        },

                        axisLabel: {
                            formatter: '{value} 分',
                            textStyle: {
                                color: '#31bee9',
                                fontSize: 10
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitNumber: 4,
                        // scale: true,
                        axisLine: {
                            lineStyle: {
                                color: style.lisans[1],
                                width: 1
                            }
                        },
                        axisLabel: {
                            formatter: '{value} 分',
                            textStyle: {
                                color: '#31bee9',
                                fontSize: 10
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: style.lisans[1],
                                width: 1
                            }
                        }
                    }
                ],
                series: [
                    {
                        type: 'scatter',
                        symbolSize: 10,
                        data:picAll,


                        itemStyle: {
                            normal: {
                                color: style.lisans[3]
                            }
                        },
                        markLine: {
                            lineStyle: {
                                normal: {
                                    color: '#31bee9',
                                    type: 'solid'
                                }
                            },

                            data: [
                                {type: 'average', name: '平均值'},
                                {type: 'average', valueDim: 'x'}
                            ]
                        },
                        // label: {
                        //     normal: {
                        //         show: true, position: 'right',
                        //         formatter: function (param) {
                        //             return param.data[2]
                        //         }
                        //     }
                        // }
                    }
                ]
            };
            myChart.setOption(option);
    },
}
window.picTab1=function (e) {
    $("#picContainer").hide();
    $("#picContainer0").hide();
    $("#picContainer2").show();
    $(e.target).addClass("active").siblings().removeClass("active");
    var areaId=$('.getidlevel').attr('areaId')
    var level =$('.getidlevel').attr('level')
    // $('.tabDiv .getidlevel').attr({'areaId':areaId, 'level':level})
    if(!level){
        return false
    }
    var urlParmaStr='&areaId=' + areaId + '&level=' + level;
    if(areaId!=''){
        //得分拓扑图
        $.getJSON(BACK_SERVER_URL+ "portrayController/getTopology?" + urlParmaStr, function (lsdata) {
            $.getJSON(BACK_SERVER_URL+ "portrayController/getAlarmTip?" + urlParmaStr, function (alarmdata) {
                braindata(lsdata,alarmdata)
            })
        })
    }
};
window.picTab2=function (e) {
    $("#picContainer").show();
    $("#picContainer0").show();
    $("#picContainer2").hide();
    $(e.target).addClass("active").siblings().removeClass("active");
},

// 返回键
    window.hidePic=function () {
        lessenPic();
        $("#picDivs").hide();        
        $("#picContainer,#picContainer3").empty();
    }
    // 放大
    window.enlargePic=function(){
        $('#picDivs').attr('id', 'picDivs0');
        $("#picContainer").attr('id', 'picContainer0');
        $(".bottomDiv").attr('class', 'bottomDiv0');
        $(".tableDiv").attr('class', 'tableDiv0');        
    }
    // 缩小
    window.lessenPic=function(){       
        $('#picDivs0').attr('id', 'picDivs');
        $("#picContainer0").attr('id', 'picContainer');
        $(".bottomDiv0").attr('class', 'bottomDiv');
        $(".tableDiv0").attr('class', 'tableDiv');
    }
    window.mindClick=function(e,index) {
    if(index==0){
        var areaId=$(e).attr("data-value");
        var level=app.getCurrentLevelByCodeLength(areaId)-1;
        urlParmaStr = '&areaId=' + areaId + '&level=' + level;
    }else{

        var areaId=0;
        var level=0;
    }

    $('#picContainer').remove();
    $('#picContainer0').remove();
    // $('#picDivs').prepend('<div id="picContainer" class="picContainer"style="display: none"></div>');
    $('#picDivs>.topDiv').after('<div id="picContainer" class="picContainer"style="display: none"></div>');
    $(".picDiv").show();
    $("#picContainer2").show();
    $("#picContainer").hide();
    $("#picContainer0").hide();
    $("#picContainer,#picContainer3,.tableHead,.tableBody").empty();
    $("#picContainer0,#picContainer3,.tableHead,.tableBody").empty();
    //画像列表接口
    getPortrayTargetScoreList(areaId,level,0)
}
function getPortrayTargetScoreList(areaId,level,isReturn) {
    var urlParmaStr= '&areaId=' + areaId + '&level=' + level;

    if(level==3){
        //得分拓扑图
        $.getJSON(BACK_SERVER_URL+ "portrayController/getTopology?" + urlParmaStr, function (lsdata) {
            $.getJSON(BACK_SERVER_URL+ "portrayController/getAlarmTip?" + urlParmaStr, function (alarmdata) {
                braindata(lsdata,alarmdata)
            })
        })
    }else{
        //得分列表
        $.getJSON(BACK_SERVER_URL+ "portrayController/getPortrayTargetScoreList?" + urlParmaStr+'&&isReturn='+isReturn , function (lsdata) {
            if(level==0){
                getPortraitform(lsdata,"新疆",0,0);
            }else{
                getPortraitform(lsdata,lsdata[0].areaname,level,areaId);
            }

        })
        //画像拓扑图
        $.getJSON(BACK_SERVER_URL+ "portrayController/getPortrayDispersedData?" + urlParmaStr, function (data) {
            var lisandata=[]
                for (var i=0;i<data.length;i++) {
                    lisandata.push([data[i].yd_zc_rru_online_score, data[i].yd_zc_prb_userd_score, data[i].city_name])
                }
            opticalFunction.lisans(setColor.tint,lisandata,level)
        });
        //得分拓扑图
        $.getJSON(BACK_SERVER_URL+ "portrayController/getTopology?" + urlParmaStr, function (lsdata) {
            $.getJSON(BACK_SERVER_URL+ "portrayController/getAlarmTip?" + urlParmaStr, function (alarmdata) {
                braindata(lsdata,alarmdata)
            })

        })
    }
}
function isimg(number) {
    if(number>1) {
        return ' <img class="imgstyle" src="resource/image/itemup-icon.png"  >';
    }else if(number<1) {
        return ' <img class="imgstyle" src="resource/image/itemdown-icon.png"  >';
    }else{
        return '';
    }

}
function retainnumber(number) {
    number = Math.round(number*10)/10
    return number
}
function braindata(lsdata,numberdata) {
    if(lsdata.length==0 && numberdata.length==0 ){
        return false
    }
    var cityname='';
    if(lsdata[0].data_level==0){
        cityname=lsdata[0].province_name
    }else if(lsdata[0].data_level==1){
        cityname=lsdata[0].city_name
    }else if(lsdata[0].data_level==2){
        cityname=lsdata[0].district_name
    }else if(lsdata[0].data_level==3){
        cityname=lsdata[0].area_name
    }
    var titlehtml='<p class="portraitTitle" style="font-size: 2vh;text-align: center" >'+cityname+'画像描述</p>';
    var objtext= numberdata[0].dx_text.replace(/【/g,'<br/>')
    objtext=objtext.replace(/】/g,'')
    titlehtml+= objtext;
    $('.titlebox').html(titlehtml)
     var picJson=[
         {
             "id": "root",
             "isroot": true,
             "topic":isimg(lsdata[0].yd_all)+cityname+"画像得分,"+retainnumber(lsdata[0].yd_all_score)+'分',
             "isreadonly": "false"
         },
         {
             "id": "sub1",
             "parentid": "root",
             "topic": isimg(lsdata[0].yd_zc)+"资产效益"+retainnumber(lsdata[0].yd_zc_score)+"分",
             "isreadonly": "true",
             "expanded": "false"
         },
         {
             "id": "sub12",
             "parentid": "sub1",
             "topic":isimg(lsdata[0].yd_zc_cell_income)+ "平均载扇收入"+lsdata[0].yd_zc_cell_income_avg+"元,"+ retainnumber(lsdata[0].yd_zc_cell_income_score)+"分,",
             "isreadonly": "true"
         },
         {
             "id": "sub13",
             "parentid": "sub1",
             "topic":isimg(lsdata[0].yd_zc_busy_dbr_cell)+ "高负荷小区占比"+ retainnumber(lsdata[0].yd_zc_busy_dbr_cell_score)+"分,"+lsdata[0].yd_zc_busy_dbr_cell_rate+"%",
             "isreadonly": "true"
         },
         {
             "id": "sub14",
             "parentid": "sub1",
             "topic": isimg(lsdata[0].yd_zc_rru_online)+"RRU在线运营率"+retainnumber(lsdata[0].yd_zc_rru_online_score)+"分,"+ lsdata[0].yd_zc_rru_online_rate+"%",
             "isreadonly": "true"
         },
         {
             "id": "sub15",
             "parentid": "sub1",
             "topic":isimg(lsdata[0].yd_zc_idle_dbr_cell)+ "闲小区占比"+ retainnumber(lsdata[0].yd_zc_idle_dbr_cell_score)+"分,"+ lsdata[0].yd_zc_idle_dbr_cell_rate+"%",
             "isreadonly": "true"
         },
        {
            "id": "sub16",
            "parentid": "sub1",
            "topic": isimg(lsdata[0].yd_zc_zero_dbr_cell)+"零小区占比"+retainnumber(lsdata[0].yd_zc_zero_dbr_cell_score)+"分,"+ lsdata[0].yd_zc_zero_dbr_cell_rate+"%",
            "isreadonly": "true"
        },
        {
            "id": "sub17",
            "parentid": "sub1",
            "topic":isimg(lsdata[0].yd_zc_prb_userd)+ "PRB资源利用率"+retainnumber(lsdata[0].yd_zc_prb_userd_score)+"分,"+ lsdata[0].yd_zc_prb_userd_rate+"%",
            "isreadonly": "true"
        },
         {
             "id": "sub2",
             "parentid": "root",
             "topic": isimg(lsdata[0].yd_yy)+"运营效率"+retainnumber(lsdata[0].yd_yy_score)+"分",
             "isreadonly": "true",
             "expanded": "false"
         },
         {
             "id": "sub21",
             "parentid": "sub2",
             "topic": isimg(lsdata[0].yd_yy_response_complete)+"响应站及时率"+ retainnumber(lsdata[0].yd_yy_response_complete_score)+"分,"+ lsdata[0].yd_yy_response_complete_rate+"%",
             "isreadonly": "true"
         },
         {
             "id": "sub22",
             "parentid": "sub2",
             "topic": isimg(lsdata[0].yd_yy_plan_enb_complete)+"规划站开通率"+retainnumber(lsdata[0].yd_yy_plan_enb_complete_score)+"分,"+ lsdata[0].yd_yy_plan_enb_complete_rate+"%",
             "isreadonly": "true"
         },
         {
             "id": "sub23",
             "parentid": "sub2",
             "topic": isimg(lsdata[0].yd_yy_low_quality_order_complete)+"容量工单日清日结率"+ retainnumber(lsdata[0].yd_yy_low_quality_order_complete_score)+"分,"+ lsdata[0].yd_yy_low_quality_order_complete_rate+"%",
             "isreadonly": "true"
         },
         {
             "id": "sub24",
             "parentid": "sub2",
             "topic": isimg(lsdata[0].yd_yy_capacity_order_complete)+"质差工单日清日结率"+ retainnumber(lsdata[0].yd_yy_capacity_order_complete_score)+"分,"+ lsdata[0].yd_yy_capacity_order_complete_rate+"%",
             "isreadonly": "true"
         },
         {
             "id": "sub25",
             "parentid": "sub2",
             "topic": isimg(lsdata[0].yd_yy_fault_order)+"故障工单日清日结率"+retainnumber(lsdata[0].yd_yy_fault_order_score)+"分,"+ lsdata[0].yd_yy_fault_order_rate+"%",
             "isreadonly": "true"
         },
         {
             "id": "sub3",
             "parentid": "root",
             "topic": isimg(lsdata[0].yd_gz)+"客户感知"+ retainnumber(lsdata[0].yd_gz_score)+"分",
             "expanded":  "true"
         },
         {
             "id": "sub31",
             "parentid": "sub3",
             "topic": isimg(lsdata[0].yd_gz_dpi_perception)+"移动业务感知优良率"+ retainnumber(lsdata[0].yd_gz_dpi_perception_score)+"分,"+ lsdata[0].yd_gz_dpi_perception_rate+"%",
             "expanded":  "true"
         },
         {
             "id": "sub32",
             "parentid": "sub3",
             "topic":isimg(lsdata[0].yd_gz_nps_order)+ "网络NPS工单解决率"+ retainnumber(lsdata[0].yd_gz_nps_order_score)+"分,"+ lsdata[0].yd_gz_nps_order_rate+"%",
             "expanded":  "true"
         },
         {
             "id": "sub33",
             "parentid": "sub3",
             "topic": isimg(lsdata[0].yd_gz_cqi_quality)+"无线信道质量优良率"+retainnumber(lsdata[0].yd_gz_cqi_quality_score)+"分,"+ lsdata[0].yd_gz_cqi_quality_rate+"%",
             "expanded":  "true"
         },
         {
             "id": "sub34",
             "parentid": "sub3",
             "topic": isimg(lsdata[0].yd_gz_4g_3g)+"4G下切3G比例"+ retainnumber(lsdata[0].yd_gz_4g_3g_score)+"分,"+ lsdata[0].yd_gz_4g_3g_rate+"%",
             "expanded":  "true"
         },

     ]
    $("#picContainer3").html('')
    opticalFunction.load_jsmind(picJson);
}
function getPortraitform(lsdata,currentCity,currentLevel,currentAreaId) {
    var nullDataToNotCount = function (value, unit) {
        if (value == "null" || value == null) {
            return "未计算";
        } else {
            return value + (unit && value != 0 ? unit : "");
        }
    }
    if(lsdata[0].data_level == 3){
        $('.bottomDiv .flSpan').attr({'areaId':lsdata[0].city_id, 'level':lsdata[0].data_level-2,'areaName':currentCity,'current-area-id':currentAreaId,'current-level':currentLevel})
    }else if(lsdata[0].data_level == 2){
        $('.bottomDiv .flSpan').attr({'areaId':lsdata[0].province_id, 'level':lsdata[0].data_level-2,'areaName':currentCity,'current-area-id':currentAreaId,'current-level':currentLevel})
    }else{
        $('.bottomDiv .flSpan').attr({'areaId':0, 'level':0,'areaName':currentCity,'current-area-id':currentAreaId,'current-level':currentLevel})
    }
     var tablebodyhtml = '';
    var cityname = '';
    for (var i = 0; i < lsdata.length; i++) {
        if (lsdata[i].data_level == 0) {
            cityname = lsdata[i].province_name
            var tableheardhtml = '<tr><th rowspan="2">城市</th><th rowspan="2">详情</th><th colspan="6">资产效益</th><th colspan="5">运营效益</th><th colspan="4">客户感知</th></tr><tr><th>平均载扇收入</th><th>高负荷小区占比</th><th>RRU在线运营率（地市）</th><th>闲小区占比</th><th>零小区占比</th><th>PRB资源利用率</th><th>响应站及时率</th><th>规划站开通率</th><th>容量工单日清日结率</th><th>质差工单日清日结率</th><th>故障工单日清日结率</th><th>移动业务感知优良率</th><th>网络NPS工单解决率</th><th>无线信道质量优良率(CQI)</th><th>4G下切3G比例</th></tr>';
            cityid=lsdata[i].province_id
            tablebodyhtml += '<tr><td  class="switch" data_level="' + lsdata[i].data_level + '" area_id="' + cityid+ '">' + cityname + '</td><td class="tabledetails" data_level="' + lsdata[i].data_level + '" area_id="' + cityid + '">下钻</td><td>' + lsdata[i].yd_zc_cell_income_avg + '</td><td>' + lsdata[i].yd_zc_busy_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_rru_online_rate + '%</td><td>' + lsdata[i].yd_zc_idle_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_zero_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_prb_userd_rate + '%</td><td>' + lsdata[i].yd_yy_response_complete_rate + '%</td><td>' + lsdata[i].yd_yy_plan_enb_complete_rate + '%</td><td>' + lsdata[i].yd_yy_low_quality_order_complete_rate + '%</td><td>' + lsdata[i].yd_yy_capacity_order_complete_rate + '%</td>'
            tablebodyhtml += '<td>' + lsdata[i].yd_yy_fault_order_rate + '%</td><td>' + lsdata[i].yd_gz_dpi_perception_rate + '%</td><td>' + lsdata[i].yd_gz_nps_order_rate + '%</td><td>' + lsdata[i].yd_gz_cqi_quality_rate + '%</td><td>' + lsdata[i].yd_gz_4g_3g_rate + '%</td></tr>'
        } else if (lsdata[i].data_level == 1) {
            cityname = lsdata[i].city_name
            var tableheardhtml = '<tr><th rowspan="2">城市</th><th rowspan="2">详情</th><th colspan="6">资产效益</th><th colspan="5">运营效益</th><th colspan="4">客户感知</th></tr><tr><th>平均载扇收入</th><th>高负荷小区占比</th><th>RRU在线运营率（地市）</th><th>闲小区占比</th><th>零小区占比</th><th>PRB资源利用率</th><th>响应站及时率</th><th>规划站开通率</th><th>容量工单日清日结率</th><th>质差工单日清日结率</th><th>故障工单日清日结率</th><th>移动业务感知优良率</th><th>网络NPS工单解决率</th><th>无线信道质量优良率(CQI)</th><th>4G下切3G比例</th></tr>';
            cityid=lsdata[i].city_id
            tablebodyhtml += '<tr><td  class="switch" data_level="' + lsdata[i].data_level + '" area_id="' + cityid+ '">' + cityname + '</td><td class="tabledetails" data_level="' + lsdata[i].data_level + '" area_id="' + cityid + '">下钻</td><td>' + lsdata[i].yd_zc_cell_income_avg + '</td><td>' + lsdata[i].yd_zc_busy_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_rru_online_rate + '%</td><td>' + lsdata[i].yd_zc_idle_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_zero_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_prb_userd_rate + '%</td><td>' + lsdata[i].yd_yy_response_complete_rate + '%</td><td>' + lsdata[i].yd_yy_plan_enb_complete_rate + '%</td><td>' + lsdata[i].yd_yy_low_quality_order_complete_rate + '%</td><td>' + lsdata[i].yd_yy_capacity_order_complete_rate + '%</td>'
            tablebodyhtml += '<td>' + lsdata[i].yd_yy_fault_order_rate + '%</td><td>' + lsdata[i].yd_gz_dpi_perception_rate + '%</td><td>' + lsdata[i].yd_gz_nps_order_rate + '%</td><td>' + lsdata[i].yd_gz_cqi_quality_rate + '%</td><td>' + lsdata[i].yd_gz_4g_3g_rate + '%</td></tr>'
        } else if (lsdata[i].data_level == 2) {
            cityname = lsdata[i].district_name
            cityid=lsdata[i].district_id
            var tableheardhtml = '<tr><th rowspan="2">城市</th><th rowspan="2">详情</th><th colspan="5">资产效益</th><th colspan="5">运营效益</th><th colspan="3">客户感知</th></tr><tr><th>平均载扇收入</th><th>高负荷小区占比</th><th>闲小区占比</th><th>零小区占比</th><th>PRB资源利用率</th><th>响应站及时率</th><th>规划站开通率</th><th>容量工单日清日结率</th><th>质差工单日清日结率</th><th>故障工单日清日结率</th><th>移动业务感知优良率</th><th>无线信道质量优良率(CQI)</th><th>4G下切3G比例</th></tr>'
            tablebodyhtml += '<tr><td  class="switch" data_level="' + lsdata[i].data_level + '" area_id="' + cityid+ '">' + cityname + '</td><td class="tabledetails" data_level="' + lsdata[i].data_level + '" area_id="' + cityid + '">下钻</td><td>' + lsdata[i].yd_zc_cell_income_avg + '</td><td>' + lsdata[i].yd_zc_busy_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_idle_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_zero_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_prb_userd_rate + '%</td><td>' + lsdata[i].yd_yy_response_complete_rate + '%</td><td>' + lsdata[i].yd_yy_plan_enb_complete_rate + '%</td><td>' + lsdata[i].yd_yy_low_quality_order_complete_rate + '%</td><td>' + lsdata[i].yd_yy_capacity_order_complete_rate + '%</td>'
            tablebodyhtml += '<td>' + lsdata[i].yd_yy_fault_order_rate + '%</td><td>' + lsdata[i].yd_gz_dpi_perception_rate + '%</td><td>' + lsdata[i].yd_gz_cqi_quality_rate + '%</td><td>' + lsdata[i].yd_gz_4g_3g_rate + '%</td></tr>'
        } else if (lsdata[i].data_level == 3) {
            cityname = lsdata[i].area_name
            cityid=lsdata[i].area_id
            var tableheardhtml = '<tr><th rowspan="2">城市</th><th rowspan="2">详情</th><th colspan="5">资产效益</th><th colspan="5">运营效益</th><th colspan="3">客户感知</th></tr><tr><th>平均载扇收入</th><th>高负荷小区占比</th><th>闲小区占比</th><th>零小区占比</th><th>PRB资源利用率</th><th>响应站及时率</th><th>规划站开通率</th><th>容量工单日清日结率</th><th>质差工单日清日结率</th><th>故障工单日清日结率</th><th>移动业务感知优良率</th><th>无线信道质量优良率(CQI)</th><th>4G下切3G比例</th></tr>'
            tablebodyhtml += '<tr><td  class="switch" data_level="' + lsdata[i].data_level + '" area_id="' + cityid+ '">' + cityname + '</td><td class="tabledetails" data_level="' + lsdata[i].data_level + '" area_id="' + cityid + '">下钻</td><td>' + lsdata[i].yd_zc_cell_income_avg + '</td><td>' + lsdata[i].yd_zc_busy_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_idle_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_zero_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_prb_userd_rate + '%</td><td>' + lsdata[i].yd_yy_response_complete_rate + '%</td><td>' + lsdata[i].yd_yy_plan_enb_complete_rate + '%</td><td>' + lsdata[i].yd_yy_low_quality_order_complete_rate + '%</td><td>' + lsdata[i].yd_yy_capacity_order_complete_rate + '%</td>'
            tablebodyhtml += '<td>' + lsdata[i].yd_yy_fault_order_rate + '%</td><td>' + lsdata[i].yd_gz_dpi_perception_rate + '%</td><td>' + lsdata[i].yd_gz_cqi_quality_rate + '%</td><td>' + lsdata[i].yd_gz_4g_3g_rate + '%</td></tr>'
        }
        // tablebodyhtml += '<tr><td  class="switch" data_level="' + lsdata[i].data_level + '" area_id="' + cityid+ '">' + cityname + '</td><td class="tabledetails" data_level="' + lsdata[i].data_level + '" area_id="' + cityid + '">下钻</td><td>' + lsdata[i].yd_zc_cell_income_avg + '</td><td>' + lsdata[i].yd_zc_busy_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_idle_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_zero_dbr_cell_rate + '%</td><td>' + lsdata[i].yd_zc_prb_userd_rate + '%</td><td>' + lsdata[i].yd_yy_response_complete_rate + '%</td><td>' + lsdata[i].yd_yy_plan_enb_complete_rate + '%</td><td>' + lsdata[i].yd_yy_low_quality_order_complete_rate + '%</td><td>' + lsdata[i].yd_yy_capacity_order_complete_rate + '%</td>'
        // tablebodyhtml += '<td>' + lsdata[i].yd_yy_fault_order_rate + '%</td><td>' + lsdata[i].yd_gz_dpi_perception_rate + '%</td><td>' + lsdata[i].yd_gz_nps_order_rate + '%</td><td>' + lsdata[i].yd_gz_cqi_quality_rate + '%</td><td>' + lsdata[i].yd_gz_4g_3g_rate + '%</td></tr>'
    }
    $(".tableHead").html(tableheardhtml);
    $("#tableBody").html(tablebodyhtml);
    $('.tabledetails').click(
        function () {
            console.log('123')
            var level = $(this).attr('data_level');
            var areaId = $(this).attr('area_id');
            var areaName = $(this).siblings(".switch").text();
            var urlParmaStr = '&areaId=' + areaId + '&level=' + level;
            // getPortrayTargetScoreList(areaId,level,0);
            //得分列表
            if(level==3){
                console.log('已是最下级')
            }else {
                $.getJSON(BACK_SERVER_URL+ "portrayController/getPortrayTargetScoreList?" + urlParmaStr+'&&isReturn=0' , function (lsdata) {
                    $('.bottomDiv .flSpan').attr({'areaId':areaId, 'level':level})
                    getPortraitform(lsdata,areaName,level,areaId)
                })
            }
        }
    );
    $(".switch").click(
        function () {
            var level = $(this).attr('data_level');
            var areaId = $(this).attr('area_id');
            var urlParmaStr = '&areaId=' + areaId + '&level=' + level;
            $('.tabDiv .getidlevel').attr({'areaId':areaId, 'level':level})
            //得分拓扑图
            $.getJSON(BACK_SERVER_URL+ "portrayController/getTopology?" + urlParmaStr, function (lsdata) {
                $.getJSON(BACK_SERVER_URL+ "portrayController/getAlarmTip?" + urlParmaStr, function (alarmdata) {
                    braindata(lsdata,alarmdata)
                })
            })

            $.getJSON(BACK_SERVER_URL+ "portrayController/getPortrayDispersedData?" + urlParmaStr, function (data) {

                var lisandata=[]
                    for (var i=0;i<data.length;i++){
                        lisandata.push([data[i].yd_zc_rru_online_score,data[i].yd_zc_prb_userd_score,data[i].city_name])
                    }
                opticalFunction.lisans(setColor.tint,lisandata,level)
            });
        }
    )
}
window.portrait=function () {
    $('#picContainer').remove();
    // $('#picDivs').prepend('<div id="picContainer" class="picContainer" style="display: none"></div>');
    $('#picDivs>.topDiv').after('<div id="picContainer" class="picContainer"style="display: none"></div>');    
    $(".picDiv").show();
    $("#picContainer2").show();
    $("#picContainer").hide();
    $("#picContainer,#picContainer3,.tableHead,.tableBody").empty();
    var areaId=app.cityId;
    var level=app.getCurrentLevelByCodeLength(app.cityId)-1;
    getPortrayTargetScoreList(areaId,level,0);
    lessenPic();
}

$('.bottomDiv .flSpan').click(
    function () {
        var level = $(this).attr('level');
        var areaId = $(this).attr('areaid');
        var urlParmaStr = '&areaId=' + areaId + '&level=' + level;
        //得分列表
        $.getJSON(BACK_SERVER_URL+ "portrayController/getPortrayTargetScoreList?" + urlParmaStr+'&&isReturn=0' , function (lsdata) {
            // if (lsdata[0].data_level == 0) {
            //     cityid=lsdata[0].province_id
            // } else if (lsdata[0].data_level == 1) {
            //     cityid=lsdata[0].city_id
            // } else if (lsdata[0].data_level == 2) {
            //     cityid=lsdata[0].district_id
            // } else if (lsdata[0].data_level == 3) {
            //     cityid=lsdata[0].area_id
            // }
            getPortraitform(lsdata,"新疆")
            // getPortrayTargetScoreList(cityid,lsdata[0].data_level,1);
          //  $('.bottomDiv .flSpan').attr({'areaId':lsdata[0]., 'level':level})
        })
        // getPortrayTargetScoreList(areaId,level,1);
    }
)
function portraitDescription(cityname,portraitdata) {

}
var exportPortrayTargetScoreList = function(){
    if($(".bottomDiv>span.flSpan").attr("areaname")){
        var cityName = $(".bottomDiv>span.flSpan").attr("areaname");
        var level = $(".bottomDiv>span.flSpan").attr("current-level");
        var areaId = $(".bottomDiv>span.flSpan").attr("current-area-id");
    }else{
        var cityName = $(".bottomDiv0>span.flSpan").attr("areaname");
        var level = $(".bottomDiv0>span.flSpan").attr("current-level");
        var areaId = $(".bottomDiv0>span.flSpan").attr("current-area-id");
    }
    console.log(cityName)
    console.log(level)
    console.log(areaId)
    var url = BACK_SERVER_URL+"/portrayController/exportPortrayTargetScoreList?level="+level+"&areaId="+areaId+"&cityName="+cityName;
    window.open(url);
}