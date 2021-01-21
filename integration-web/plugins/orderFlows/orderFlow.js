/**
 * 创建工单流程通用插件
 * Created by WangJue on 2018/12/13.
 */

;(function(window,document,$,undefined){
    var createOrderFlowFunc = function(){
        if(!$){return false;}

        //测试与默认数据
        var defaultPluginData1 = [
            {
                flowStatus:'finish',
                flowStatusName:'已派单',
                flowIco:'./../../plugins/orderFlows/resource/ico_1.png',
                flowName:'派单',
                flowPeople:'userName',
                flowTime:'2018-11-24 21:16:38',
                flowInfo:'工单流程步骤信息，测试专用，长度不确定'
            },
            {
                flowStatus:'finish',
                flowStatusName:'已接单',
                flowIco:'./../../plugins/orderFlows/resource/ico_2.png',
                flowName:'接单',
                flowPeople:'userName',
                flowTime:'2018-11-24 21:16:38',
                flowInfo:'工单流程步骤信息，测试专用'
            },
            {
                flowStatus:'underway',
                flowStatusName:'已回单',
                flowIco:'./../../plugins/orderFlows/resource/ico_3.png',
                flowName:'回单',
                flowPeople:'userName',
                flowTime:'2018-11-24 21:16:38',
                flowInfo:'工单流程步骤信息，测试专用，不知道最多能有多长'
            },
            {
                flowStatus:'warn',
                flowStatusName:'验证未通过',
                flowIco:'./../../plugins/orderFlows/resource/ico_4.png',
                flowName:'结单',
                flowPeople:'userName',
                flowTime:'2018-11-24 21:16:38',
                flowInfo:'工单流程步骤信息，测试专用，不知道最多能有多长，要不要再试一哈哈哈儿'
            }
        ];

        var defaultPluginData2 = [

        ];
        var tablehtml=''
        var createFlowUnit = function(obj,orderId){
           console.log(obj)
            var unitHtml = '<div class="flowUnit '+obj.flowStatus+'"><div class="flowStatusDesc"><span>'
            +obj.flowStatusName+'</span></div><div class="flowImgOuter"><i class="flowIco" style="background-image:url('
            +obj.flowIco+')"></i></div><div class="flowInfosOuter"><div class="flowStatusName" order_id="'+orderId+'" order_type="'+obj.order_type+'" flowPeople="'+obj.flowPeople+'" proc_type_code="'+obj.proc_type_code+'"city_id="'+app.cityId+'" onclick="getorder(this)"><span>'
            +obj.flowName+'</span></div><div class="flowInfos"><p><span class="flowTh">操作人</span><span class="flowTd">'
            +obj.flowPeople+'</span></p><p><span class="flowTh">操作时间</span><span class="flowTd">'
            +obj.flowTime+'</span></p><p><span class="flowTh">处理信息</span><span class="flowTd">'+obj.flowInfo+'</span></p>\
            <p><span class="flowTh">处理时限</span><span class="flowTd">'+(obj.processTime?obj.processTime:"")+'</span></p>\
            <p><span class="flowTh">历时</span><span class="flowTd">'+(obj.useTime?obj.useTime:"")+'</span></p>'
            +(obj.sop?'<p><span class="flowTh">SOP</span><span class="flowTd">'+(obj.sop?obj.sop:"")+'</span></p>':'')
            +'</div></div></div>';
            return unitHtml;
        };
        var createFlowInner = function(){
            return $('<div class="flowInner" style="visibility:hidden;position:relative;"></div>');
        };
        // var gettablehtml = function(){

        //     var unitHtml = '<div class="flowUnit '+obj.flowStatus+'"><div class="flowStatusDesc"><span>'
        //         +obj.flowStatusName+'</span></div><div class="flowImgOuter"><i class="flowIco" style="background-image:url('
        //         +obj.flowIco+')"></i></div><div class="flowInfosOuter"><div class="flowStatusName"><span>'
        //         +obj.flowName+'</span></div><div class="flowInfos"><p><span class="flowTh">操作人</span><span class="flowTd">'
        //         +obj.flowPeople+'</span></p><p><span class="flowTh">操作时间</span><span class="flowTd">'
        //         +obj.flowTime+'</span></p><p><span class="flowTh">处理信息</span><span class="flowTd">'+obj.flowInfo+'</span></p>\
        //     <p><span class="flowTh">处理时限</span><span class="flowTd">'+(obj.processTime?obj.processTime:"")+'</span></p>\
        //     <p><span class="flowTh">历时</span><span class="flowTd">'+(obj.useTime?obj.useTime:"")+'</span></p>'
        //         +(obj.sop?'<p><span class="flowTh">SOP</span><span class="flowTd">'+(obj.sop?obj.sop:"")+'</span></p>':'')
        //         +'</div></div></div>';
        //     return unitHtml;
        // };

        var createFlowLines = function(inner,num){
            if(num<=1){return false;}
            var flowUnits = inner.find('.flowUnit');
            var allWidth = flowUnits.eq(0).width()+window.width/100;
            for(var i=0;i<num-1;i++){
                var w1 = flowUnits.eq(i).width();
                var pl = flowUnits.eq(i).position().left;
                // var pl = flowUnits.eq(i)[0].offsetLeft;//jquery postion方法 出现 首次 位置 和后续次数位置不一样的bug 所以改用原生属性
                var w2 = flowUnits.eq(i+1).width();
                var oWidth = (w1+w2)/2-120;
                // var oLeft = (w1+40)+pl - oWidth/2;
                var oLeft = w1+pl - oWidth/2;
                allWidth+=(w2+window.width/100);
                inner.append('<div class="line right arrow normal" style="left:calc('+oLeft+'px + 2vw);width:'+oWidth+'px;top:1.5vh;"></div>');
            }
            return allWidth;
        };

        return {
            init:function(config,orderId){

                var element = this;
                var opt = $.extend(true,[], config);
                var innerEl = createFlowInner();



                var unitHtmls = '';
                for(var i=0;i<opt.length;i++){
                    unitHtmls+=createFlowUnit(opt[i],orderId);
                }
                innerEl.html(unitHtmls);
                innerEl.css({visibility:'visible'});
                element.empty().append(innerEl);
                var allWidth = createFlowLines(innerEl,opt.length);
                innerEl.width(allWidth);
                var scrollBar = new MyScrollBar({selId:element.attr('id'),hasX:true,hasY:false,bgColor:'transparent',barColor:'#0a5080',width:8});
                // scrollBar.jump({pos:'right'});
            }
        }
    }();
    $.fn.extend({
        createOrderFlow:createOrderFlowFunc.init
    });
})(window,document,jQuery);
function getorder(dom){
    var order_type=$(dom).attr('order_type');
    var flowPeople=$(dom).attr('flowPeople')
    var next_proc_type_code=$(dom).attr('proc_type_code');
    var city_id=$(dom).attr('city_id');
    var order_id=$(dom).attr('order_id');
    var Participation='?order_type='+ order_type+'&proc_type_code='+next_proc_type_code+'&flowPeople='+flowPeople+'&city_id='+city_id+'&order_id='+order_id
    $.getJSON(BACK_SERVER_URL+  'gisController/queryPortrayData'+Participation, function (alarmdata) {
        // braindata(alarmdata)
        console.log(alarmdata)
        if(alarmdata.length==0){
            // var tablehtml="<tr><td colspan='4'>乌鲁木齐分公司派单效益</td></tr><tr><td>当前环节工单总量</td><td>10笔</td><td>已完成笔数</td><td>20笔</td></tr>" +
            //     "<tr><td colspan='3'></td></tr><tr><td>超时量</td><td>11笔</td><td>超时占比</td><td>35%</td></tr>" +
            //     "<tr><td colspan='3'></td></tr><tr><td>当前环节工单总量</td><td>3.2小时</td><td>已完成笔数</td><td>3.1小时</td></tr>";
            console.log('环节数据为空，终止')
            return  false
        }else{
            var tablehtml="<tr><td colspan='4'>"+isnull(alarmdata[0].ygc_city_name)+isnull(alarmdata[0].proc_type_name)+"</td></tr><tr><td>环节总量</td><td>"+isnull(alarmdata[0].link_total)+"笔</td><td>超时量</td><td>"+isnull(alarmdata[0].time_out_handing)+"笔</td></tr>" +
                "<tr><td colspan='3'></td></tr><tr><td>超时占比</td><td>"+isnull(alarmdata[0].time_out_rate)+"%</td><td>环节处理平均时长</td><td>"+isnull(alarmdata[0].link_avg_time)+"小时</td></tr>" +
                "<tr><td colspan='3'></td></tr><tr><td>区级平均时长</td><td>"+isnull(alarmdata[0].link_avg_time)+"小时</td><td></td><td></td></tr>"

            var tablehead='<div class="positionbox"><table cellpadding="0" cellspacing="0"  class="popBodyTable">'
            var tableend='</table></div>';
            var tablehtml=tablehead+tablehtml+tableend;
            $('.tablebox').html(tablehtml);
            $('.ordertable').toggle()
        }
        
    })
    
    var orderboxleft=$(dom).parent().parent().offset().left
    console.log(orderboxleft)
    $('.ordertable').css('left',orderboxleft);
    $('.ordertable').css('z-index',10000);
}
function isnull(obj){
    if(obj==null && obj==''){
        return "---"
    }else if(obj===null){
        return "---"
    }else{
        return  obj
    }
}
window.hideorder=function(){
    $('.ordertable').hide()
}