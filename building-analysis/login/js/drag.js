/*
 * drag 1.0
 * create by tony@jentian.com
 * date 2015-08-18
 * 拖动滑块
 */
(function($){
    $.fn.drag = function(options){
        var x, drag = this, isMove = false, defaults = {
        };
        var options = $.extend(defaults, options);
        //添加背景，文字，滑块
        var html = '<div class="drag_bg"></div>'+
            '<div class="drag_text text_light" onselectstart="return false;" unselectable="on">拖动滑块验证</div>'+
            '<div class="handler handler_bg borderLB start" data-login="0"></div>';
        this.html(html);
        var handler = drag.find('.handler');
        var drag_bg = drag.find('.drag_bg');
        var text = drag.find('.drag_text');
        var maxWidth = drag.width() - handler.width();  //能滑动的最大间距
        //var t = drag.outerWidth(true) - handler.outerWidth(true);  //能滑动的最大间距

        //鼠标按下时候的x轴的位置
        handler.mousedown(function(e){
            isMove = true;
            x = e.pageX - parseInt(handler.css('left'), 10);
        });

        //鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
        $(document).mousemove(function(e){
            var _x = e.pageX - x;
            if(isMove){
                if(_x>0){
                    if(_x > maxWidth/2){//鼠标指针移动距离达到最大时清空事件
                        handler.css({'left': maxWidth}).removeClass("start").addClass("end").attr("data-login",1);
                        $("#dragCheck").val(1);
                        dragOk();
                    }else{
                        handler.css({'left': _x}).removeClass("end").addClass("start").attr("data-login",0);
                        drag_bg.css({'width': _x});
                    }
                }
            }
        }).mouseup(function(e){
            isMove = false;
            var _x = e.pageX - x;
            if(_x < maxWidth){ //鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
                handler.css({'left': 0}).removeClass("end").addClass("start").attr("data-login",0);
                drag_bg.css({'width': 0});
            }
        });

        //清空事件
        function dragOk(){

            handler.removeClass('handler_bg').addClass('handler_ok_bg');
            handler.removeClass('borderLB').addClass('borderRB');
            $('.drag_text').removeClass('text_light');
            text.text('验证通过');

            drag_bg.css({'width': maxWidth});
            drag.css({'color': '#fff'});

            handler.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');

            //在360中因为拖到maxWidth之后,有时会出现选中情况，所以触发焦点事件，取消掉
            $("#userCode").focus();

        }
    };
})(jQuery);


