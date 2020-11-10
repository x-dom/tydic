
var userManage;
$(function() {
  userManage = new UserManageFn();
  userManage.initFormVerify();
  userManage.initSearchForm();
  userManage.loadDataTable();
  userManage.bindUserAdd();
});

//用户管理对象
function UserManageFn() {
  this.serverUrl = Common.url_server_root;
  this.search = {userName: '', phone: ''};
  this.layui = layui;
  this.layui.use(['form', 'table']);
};

//初始化表单校验规则
UserManageFn.prototype.initFormVerify = function() {
  var form = this.layui.form;
  form.verify({
    phone:[/(^$)|^1\d{10}$/,'请输入正确的手机号'],
    // password:[/^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?-_=+{}()]).*$/,'请输入正确的密码格式'],
    password:[/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/,'请输入正确的密码格式'],
  });
};

//初始化搜索表单
UserManageFn.prototype.initSearchForm = function() {
  var _this = this;
  var form = _this.layui.form;
  //监听搜索按钮提交
  form.on('submit(search-btn)', function(data){
    _this.search.userName = data.field.userName;
    _this.search.phone = data.field.phone;
    _this.loadDataTable();
    return false;
  });
};

//加载数据表格
UserManageFn.prototype.loadDataTable = function() {
  var _this = this;
  var table = _this.layui.table;
  var form = _this.layui.form;
  var cols = [
    {type:'checkbox', title: '全选'}
    ,{field: 'user_id', title: '用户ID', align: 'center'}
    ,{field: 'user_name', title: '用户名', sort: true}
    // ,{field: 'role_name', title: '角色', sort: true}
    ,{field: 'job', title: '岗位', sort: true, templet: function(val) {
      return _this.formatText(val.job);
    }}
    ,{field: 'phone', title: '手机号码', align: 'center', templet: function(val) {
      return _this.formatText(val.phone);
    }}
    ,{field: 'enable', title: '状态', sort: true, align: 'center', templet: function(val) {
      if(val.enable == 1) {
        return '<div class="icon-green"></div><span>正常</span>';
      } else {
        return '<div class="icon-red"></div><span>停用</span>';
      }
    }}
    ,{field: 'enable_time', title: '启用/停用时间', templet: function(val) {
      return _this.formatText(val.enable_time);
    }}
    ,{field: 'option', title: '操作', width: '25%', align: 'center', templet: function(val) {
      var html = '';
      if(val.role_id == -1){
        html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="edit-psw">修改密码</button>';
        return html;
      } 
      html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="edit">编辑</button>';
      html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="del">删除</button>';
      if(val.enable == 1) {
        html += '<button type="button" class="layui-btn layui-btn-sm" lay-event="disable">停用</button>';
      } else {
        html += '<button type="button" class="layui-btn layui-btn-sm" lay-event="enable">启用</button>';
      }
      // if(val.role_id == 0) {
      //   html += '<button type="button" class="layui-btn layui-btn-sm" lay-event="set_user">设为普通用户</button>';
      // } else if(val.role_id == 1){
      //   html += '<button type="button" class="layui-btn layui-btn-sm" lay-event="set_manager">设为管理员</button>';
      // }
      return html;
    }}
  ];
  table.render({
    elem: '#user_data',
    height: 'full-180',
    cellMinWidth: 80,
    limit:30,
    page: true,
    url: _this.serverUrl + '/user/query?user_name='+_this.search.userName+'&phone='+_this.search.phone,
    cols: [cols]
  });

  //监听行单击事件（双击事件为：rowDouble）
  table.on('row(user_data)', function(obj){
    //标注选中样式
    // obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
  });

  //监听工具条
  table.on('tool(user_data)', function (obj) {
    var user_id = obj.data.user_id;
    if(obj.event == 'edit') {//编辑
      layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1
        ,title: "编辑用户"
        ,area: '400px;'
        ,shade: 0.8
        ,moveType: 1
        ,content: $("#edit_form")//引用的弹出层的页面层的方式加载修改界面表单
      });
      form.render();
      document.getElementById("edit_form").reset();
      form.val('edit_form', obj.data);
      form.on('submit(edit-btn)', function(massage) {
      var params = massage.field;
      params.user_password = hex_md5(params.user_password);
      $.ajax({
        url: _this.serverUrl + '/user/edit',
        method: 'post',
        data: params,
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('user_data');//更新表单
          } 
          
          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
          layer.closeAll();
        }
      });
      return false;
    });
    } else if(obj.event == 'edit-psw') {//修改密码
      layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1
        ,title: "修改密码"
        ,area: '400px;'
        ,shade: 0.8
        ,moveType: 1
        ,content: $("#edit_psw_form")//引用的弹出层的页面层的方式加载修改界面表单
      });
      form.render();
      document.getElementById("edit_psw_form").reset();
      form.val('edit_psw_form', obj.data);
      form.on('submit(edit-psw-btn)', function(massage) {
        var params =  obj.data;
        var field = massage.field;
        params.user_password = hex_md5(field.user_password);
        $.ajax({
          url: _this.serverUrl + '/user/edit',
          method: 'post',
          data: params,
          success: function(res) {
            if(res && res.code == 0){
              _this.layui.table.reload('user_data');//更新表单
            } 
            
            if(res && res.code != 0){
              layer.alert(res.msg, {icon: 5});
            }
            layer.closeAll();
          }
        });
        return false;
      });
    } else if(obj.event == 'del') {//删除
      layer.confirm('删除后数据将无法恢复，是否继续？', {icon: 3, title:'提示信息'}, function(index){
        $.ajax({
          url: _this.serverUrl + '/user/del',
          method: 'GET',
          data: {user_id: user_id},
          success: function(res) {
            if(res && res.code == 0){
              _this.layui.table.reload('user_data');//更新表单
            } 
            
            if(res && res.code != 0){
              layer.alert(res.msg, {icon: 5});
            }
          }
        });
        layer.close(index);
      });
    } else if(obj.event == 'enable') {// 启用
      $.ajax({
        url: _this.serverUrl + '/user/enable',
        method: 'GET',
        data: {user_id: user_id},
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('user_data');//更新表单
          } 
          
          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });
    } else if(obj.event == 'disable') {//停用
      $.ajax({
        url: _this.serverUrl + '/user/disable',
        method: 'GET',
        data: {user_id: user_id},
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('user_data');//更新表单
          } 
          
          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });
    } else if(obj.event == 'set_user') {//设为普通用户
      $.ajax({
        url: _this.serverUrl + '/user/setAsCommonly',
        method: 'GET',
        data: {user_id: user_id},
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('user_data');//更新表单
          } 
          
          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });
    } else if(obj.event == 'set_manager') {//设为管理员
      $.ajax({
        url: _this.serverUrl + '/user/setAsAdmin',
        method: 'GET',
        data: {user_id: user_id},
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('user_data');//更新表单
          } 

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });
    }
  });
};

//绑定用户添加
UserManageFn.prototype.bindUserAdd = function () {
  var _this = this;
  var form = _this.layui.form;
  $("#user_add").unbind().bind('click', function() {
    layer.open({
      //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
      type: 1
      ,title: "新增用户"
      ,area: '400px;'
      ,shade: 0.8
      ,moveType: 1
      ,content: $("#edit_form")//引用的弹出层的页面层的方式加载修改界面表单
    });
    form.render();
    document.getElementById("edit_form").reset();
    form.on('submit(edit-btn)', function(massage) {
      var params = massage.field;
      params.user_password = hex_md5(params.user_password);
      $.ajax({
        url: _this.serverUrl + '/user/add',
        method: 'post',
        data: params,
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('user_data');//更新表单
          } 

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });
      layer.closeAll();
      return false;
    });
  });
};

//格式化文本
UserManageFn.prototype.formatText = function (text) {
  if(!text || text == 'undefined' || text == 'null'){
    return '--';
  } else {
      text = text+'';
      return text.trim();
  }
};

//格式化文本
UserManageFn.prototype.formatStr = function (text) {
  if(!text || text == 'undefined' || text == 'null'){
      return '';
  } else {
      text = text+'';
      return text.trim();
  }
};