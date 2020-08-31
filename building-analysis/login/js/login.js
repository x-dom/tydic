;
$(function () {
    login.initDrag();
    $("#submit-button").on("click",function () {
        login.setUserInfo();
    })
});
var login = {
    userInfo:{
        user_name:"",
        user_password:""
    },
    initDrag:function () {
        $('#drag').drag();
    },
    setUserInfo:function () {
        var userName = $("#user-name").val();
        var pas = $("#user-pas").val();
        var drag = $("#drag .handler").attr("data-login");
        $(".user-err-info").text("");
        $(".pas-err-info").text("");
        $(".drag-rows-err").text("");
        if(userName == ""){
            $(".user-err-info").text("请输入登录用户名");

        }else{
            login.userInfo.user_name = userName;
        }
        if(pas == ""){
            $(".pas-err-info").text("请输入登录密码");
        }else{
            login.userInfo.user_password =  hex_md5(pas);
        };
        if(drag == 0){
            $(".drag-rows-err").text("请拖动滑块至右边");
        }
        if(userName != (""|undefined) && pas != (""|undefined) && drag == 1 ){
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
                    window.localStorage.setItem("login",JSON.stringify(data.data))
                    window.location.href = Common.url_static_root + "/user_flow_analysis.html";
                }
            }
        });
    }
}