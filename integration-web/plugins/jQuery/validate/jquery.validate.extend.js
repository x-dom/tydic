/**
 * Created by kangpeng on 2017/5/2.
 */
jQuery.validator.addMethod("phone", function (value, element) {
    var tel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写正确的手机号码");
jQuery.validator.addMethod("valueBelow", function (value, element, params) {
    var val = parseInt($(params.toString()).val());
    return this.optional(element) || value >= val;
}, $.validator.format("请检查你的输入值大小"));