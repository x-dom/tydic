// document.onkeydown = function(){
//     if(window.event && window.event.keyCode == 123) {
//         event.keyCode=0;
//         event.returnValue=false;
//     }
//     if(window.event && window.event.keyCode == 13) {
//         window.event.keyCode = 505;
//     }
//     if(window.event && window.event.keyCode == 8) {
//         alert(str+"\n请使用Del键进行字符的删除操作！");
//         window.event.returnValue=false;
//     }
//
// }
//
// document.oncontextmenu = function (event){
//     if(window.event){
//         event = window.event;
//     }try{
//         var the = event.srcElement;
//         if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
//             return false;
//         }
//         return true;
//     }catch (e){
//         return false;
//     }
// }


var host = window.location.host;
console.log(host);
var ROOT = 'http://135.224.181.135:6001/noiServer/';
var ROOT2 = 'http://135.224.181.135:6001/noi/';
if (host == "135.224.181.135:6001") {
    ROOT = 'http://135.224.181.135:6001/noiServer/';
    ROOT2 = 'http://135.224.181.135:6001/noi/';
} else if (host == "10.60.57.11:6001") {
    ROOT = 'http://10.60.57.11:6001/noiServer/';
    ROOT2 = 'http://10.60.57.11:6001/noi/';
} else if(host == "222.83.4.71:6001") {
  ROOT = 'http://222.83.4.71:6001/noiServer/';
  ROOT2 = 'http://222.83.4.71:6001/noi/';
  ROOT3='http://222.83.4.71:6001/tydic-xj-integration-backend/';
}else if (host == "yth.sdp.xjqyxxhb.com") {
    ROOT = 'https://yth.sdp.xjqyxxhb.com/noiServer/';
    ROOT2 = 'https://yth.sdp.xjqyxxhb.com/noi/';
    ROOT3 = 'https://yth.sdp.xjqyxxhb.com/tydic-xj-integration-backend/';
} else{
  ROOT = 'https://yth.sdp.xjqyxxhb.com/noiServer/';
  ROOT2 = 'https://yth.sdp.xjqyxxhb.com/noi/';
  ROOT3='https://yth.sdp.xjqyxxhb.com/tydic-xj-integration-backend/';
} 
var utils = {
    /**
     * 登录检测如果没有token 直接返回登录
     */
    checkIsLogin: function () {
        if (!$.cookie('token')) {
            window.location.href = "../../index.html";
        }
    },
    /**
     * 对ActionResult的返回结果进行操作<br>
     * 0-成功, 1-失败
     * @param data
     * @returns {boolean}
     */
    handleActionResult: function (result) {
        if (result.code == 0) {
            $.messager.show({
                title: '操作成功',
                msg: result.msg,
                showType: 'slide',
                timeout: 1500,
                style: {
                    right: '',
                    top: document.body.scrollTop
                        + document.documentElement.scrollTop,
                    bottom: ''
                }
            });
            return true;
        } else if (result.code == 1) {
            $.messager.alert('操作失败', result.msg);
            return false;
        } else if (result.code == 2) {
            $.messager.alert("你没有权限", result.msg);
            return false;
        } else if (result.code == 3) {
            $.messager.alert("没有登录", "关闭窗口跳转至登录页");
            window.location.href = "../../index.html";
            return false;
        }
        return false;
    },
    /**
     * null undefined NAN 全部设置为0
     * @param data
     */
    nullDetection: function (data) {
        if (data == undefined) {
            data = "-";
        } else if (data == null) {
            data = "-";
        } else if (isNaN(data)) {
            data = "-";
        } else {
            data = data;
        }
        return data;
    },
    /**
     * null undefined NAN 全部设置为0
     * @param data
     */
    nullDetectionZero: function (data) {
        if (data == undefined) {
            data = 0;
        } else if (data == null) {
            data = 0;
        } else if (isNaN(data)) {
            data = 0;
        } else {
            data = data;
        }
        return data;
    },
    stringEliminateNullUnfined: function (str) {
        return str == null || str == undefined || str == "null" || str
        == "undefined" ? "" : str;
    },
    /**
     * 序列化表单
     * @param form
     * @returns {{}}
     */
    serializeObject: function (form) {
        var o = {};
        $.each(form.serializeArray(), function (index) {

            if (o[this['name']]) {

                o[this['name']] = o[this['name']] + "," + this['value'];

            } else {

                o[this['name']] = this['value'];

            }

        });
        return o;
    },
    /**
     * 将对象转换成为key-value的键值对形式，并且以&连接
     * @param obj
     * @returns {string}
     */
    objectToKeyValue: function (obj) {
        var params = [];
        $.map(obj, function (n, v) {
            params.push(v + "=" + n);
        });
        return params.join('&');
    },
    /**
     *获取浏览器url地址栏中的参数 键值对链接只能是 =
     * @param symbol 参数键值对之间的分隔符 默认是 &
     * @returns {{}} 返回的是和 键值对对应的对象属性 属性值
     * ex ： key=vaue     {key:value}
     */
    getLocalURLParmas: function (symbol) {
        var returnStr = {};
        if (symbol === undefined) {
            symbol = "&";
        } else if (symbol === false) {
            symbol = "&";
        } else if (symbol === null) {
            symbol = "&";
        }
        if (window.location.href.indexOf("?") != -1) {
            var param = window.location.href.split("?")[1];
            var params = param.split(symbol);
            for (var i = 0; i < params.length; i++) {
                var p = params[i].split("=");
                if (/^[\u4E00-\u9FA5]$/.test(p[1]) || /%/.test(p[1])) {//出现值为中文的 使用转码
                    returnStr[p[0]] = decodeURIComponent(p[1]);
                } else {
                    returnStr[p[0]] = p[1];
                }

            }
            ;
        } else {
            returnStr = -1;
        }
        return returnStr;
    },
    /**
     * 添加自动计算方法 计算 外围盒子的高宽为屏幕的高宽
     * @param id 盒子id
     */
    setContentBoxSize: function (id) {
        if (id === undefined) {
            id = "contentWrapper";
        } else if (id === false) {
            id = "contentWrapper";
        } else if (id === null) {
            id = "contentWrapper";
        }
        var resizeWindow = function () {
            var height = $(window).height();
            var width = $(window).width();
            $('#' + id).width(width);
            $('#' + id).height(height - 2);
        };
        resizeWindow();
        $(window).resize(resizeWindow);
    },
    /**
     * 全局遮罩对象
     */
    blocketting: {
        message: "<div>数据加载中...</div>",
        css: {
            width: "30%",
            border: 'none',
            padding: '10px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            'border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    },
    /**
     * 模拟post提交方法
     * @param url
     * @param data
     */
    windowOpen: function (url, data) {
        var htmlContent = '<form id="windowOpenForm" action="' + url
            + '" method="post" target="_blank">';
        for (var key in data) {
            htmlContent += '<input type="hidden" name="' + key + '" value="'
                + data[key] + '"/>';
        }
        htmlContent += '</form>'
        $('body').append(htmlContent);
        $('#windowOpenForm').submit();
        $('#windowOpenForm').remove();
    },
    getObjectLength: function (obj) {
        var len = 0;
        for (var o in obj) {
            len++;
        }
        ;
        return len;
    },
    /**
     * 隐藏手机号
     * @param phone
     */
    hidePhoneNumber: function (phone) {
        return phone.toString().replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    },
    /**
     * 隐藏IMSI
     * @param imsi
     */
    hideImsiNumber: function (imsi) {
        return imsi.toString().replace(/(\d{6})\d{5}(\d{4})/, "$1*****$2")
    },
    addPercentSign: function (value) {
        if (value == 0) {
            return "-";
        } else if (value == null) {
            return "-";
        } else if (value == undefined) {
            return "-";
        } else {
            return value + "%";
        }
    },
    keepTwoDecimal: function (number) {
        if (number == null || number == undefined || number == 0) {
            return 0;
        } else {
            return number.toFixed(2);
        }
    },
    /**
     * 将对象中的简单数据转为连接字符串 如果不是简单数据则不 加入字符串
     */
    objEassyParamsToString: function (obj) {
        var str = "";
        for (var o in obj) {
            if (obj[o] instanceof Object || obj[o] instanceof Array) {

            } else {
                str += o + "=" + obj[o] + "&";
            }
        }
        ;
        return str.substring(0, str.length - 1);
    },
    /**
     * 清空表格数据
     * @param id  datagrid的id
     */
    clearDataGrid: function (id) {
        var item = $('#' + id + '').datagrid('getRows');
        for (var i = item.length - 1; i >= 0; i--) {
            var index = $('#' + id + '').datagrid('getRowIndex', item[i]);
            $('#' + id + '').datagrid('deleteRow', index);
        }
    },
    /**
     * 封装的方法请求服务器,入参会覆盖掉默认的请求参数
     */
    ajaxToServer: function (settings) {
        var default_settings = {
            headers: {
                token: $.cookie("token")
            },
            success: function (data) {
                this.handleActionResult(data);
            },
            contentType: "application/json;charset=UTF-8",
            crossDomain: true,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        };
        $.extend(default_settings, settings);
        default_settings.url = ROOT + settings.url;
        // default_settings.data = default_settings.data;

        $.ajax(default_settings)
    },
    ajaxToServer2: function (settings) {
        var default_settings = {
            headers: {
                token: $.cookie("token")
            },
            success: function (data) {
                this.handleActionResult(data);
            },
            contentType: "application/json;charset=UTF-8",
            crossDomain: true,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        };
        $.extend(default_settings, settings);
        default_settings.url = ROOT2 + settings.url;
        // default_settings.data = default_settings.data;

        $.ajax(default_settings)
    },
    ajaxServer: function (settings) {
        var default_settings = {
            headers: {
                token: $.cookie("token")
            },
            success: function (data) {
                this.handleActionResult(data);
            },
            //  contentType:"application/json;charset=UTF-8",
            // crossDomain: true,
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        };
        $.extend(default_settings, settings);
        default_settings.url = ROOT + settings.url;
        // default_settings.data = default_settings.data;
        $.ajax(default_settings)
    }
};