;
$(function () {
    // login.initDrag();
    login.initMsg();
    $("#submit-button").on("click",function () {
        login.setUserInfo();
    })
});
var login = {
    userInfo:{
        user_name:"",
        user_password:"",
        code:""
    },
    // initDrag:function () {
    //     $('#drag').drag();
    // },
    initMsg:function () {
        var timeInterval = 0;
        var timer;
        $("#msg_code").click(function() {
            if(!$("#msg_code").hasClass('disable')) {
                var userName = $("#user-name").val();
                $(".user-err-info").text("");
                if(userName == (""|undefined)){
                    $(".user-err-info").text("请输入登录用户名");
                    $("#user-name").focus();
                }else{
                    timeInterval = 60;
                    $("#msg_code").addClass('disable');
                    $("#msg_code span").text(timeInterval + "秒")
                    timer = window.setInterval(function() {
                        timeInterval--;
                        if(timeInterval == 0) {
                            window.clearInterval(timer);
                            $("#msg_code").removeClass('disable');
                            $("#msg_code span").text("获取验证码")
                        } else {
                            $("#msg_code span").text(timeInterval + " 秒")
                        }
                    },1000);
                    $.ajax({
                        url: Common.url_server_root + '/user/getCode',
                        method: "post",
                        data: {
                            user_name: userName
                        },
                        success: function (data) {
                            if(data.code == 1){
                                layer.alert(data.msg, '提示信息');
                                // window.clearInterval(timer);
                                // $("#msg_code").removeClass('disable');
                                // $("#msg_code span").text("获取验证码");
                            }
                        }
                    });
                }
            }
            
        });
    },
    setUserInfo:function () {
        var userName = $("#user-name").val();
        var pas = $("#user-pas").val();
        var msg = $("#user-msg").val();
        var focusValid = false;
        // var drag = $("#drag .handler").attr("data-login");
        $(".user-err-info").text("");
        $(".pas-err-info").text("");
        $(".msg-err-info").text("");
        // $(".drag-rows-err").text("");
        if(userName == ""){
            $(".user-err-info").text("请输入登录用户名");
            if(!focusValid) {
                focusValid = !focusValid;
                $("#user-name").focus();
            }
        }else{
            login.userInfo.user_name = userName;
        }
        if(pas == ""){
            $(".pas-err-info").text("请输入登录密码");
            if(!focusValid) {
                focusValid = !focusValid;
                $("#user-pas").focus();
            }
        }else{
            login.userInfo.user_password =  hex_md5(pas);
        };
        if(msg == ""){
            $(".msg-err-info").text("请输入验证码");
            if(!focusValid) {
                focusValid = !focusValid;
                $("#user-msg").focus();
            }
        }else{
            login.userInfo.code =  msg;
        };
        // if(drag == 0){
        //     $(".drag-rows-err").text("请拖动滑块至右边");
        // }
        if(userName != (""|undefined) && pas != (""|undefined) && msg != (""|undefined) ){
            login.submitLogin();
        }
    },
    submitLogin:function () {
        $.ajax({
            url: Common.url_server_root + '/user/login',
            method: "post",
            data: login.userInfo,
            success: function (data) {
                if(data.code == 1){
                    layer.alert(data.msg, '提示信息');
                }else if(data.code == 0){
                    $.cookie('token_id', data.data.token_id, { path: '/'});
                    $.cookie('role_id', data.data.role_id, { path: '/'});
                    $.cookie('user_name', data.data.user_name, { path: '/'});
                    $.cookie('phone', data.data.phone, { path: '/'});
                    $.cookie('busi_main_id', 2, { path: '/'});
                    window.localStorage.setItem("login",JSON.stringify(data.data))
                    window.location.href = Common.url_static_root + "/user_flow_analysis.html";
                }
            }
        });
    }
}