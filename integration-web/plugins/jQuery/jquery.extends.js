/**
 * Created by kangpeng on 2017/5/2.
 */
serializeObject = function (form) {
    var o = {};
    $.each(form.serializeArray(), function () {
        if (this['value'] != '') {
            if (o[this['name']]) {
                o[this['name']] = o[this['name']] + "," + this['value'];
            } else {
                o[this['name']] = this['value'];
            }
        }
    });
    return o;
};

handleResult = function (data) {
    if (data.code == 0) {
        $.messager.alert("提示", data.msg);
    } else {
        $.messager.alert("失败", data.data);
    }
};