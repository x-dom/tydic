//切换用户管理
function switchUserManage() {
  document.getElementById('demoAdmin').src = 'user_manage.html';
}

//切换商综体管理
function switchBusiManage() {
  document.getElementById('demoAdmin').src = 'busi_manage.html';
}

//切换竞争管理
function switchCompeteManage() {
  document.getElementById('demoAdmin').src = 'compete_manage.html';
}

$(function() {
  $('#switch_user_flow').unbind().bind('click', function () {
      window.location.href = Common.url_static_root + '/user_flow_analysis.html';
  });
  $('#switch_compete_analysis').unbind().bind('click', function () {
      window.location.href = Common.url_static_root + '/compete_analysis_main.html';
  });

  //加载登录信息
  var tokenId = $.cookie('token_id');
  var userName = formatText($.cookie('user_name'));
  var phone = formatText($.cookie('phone'));
  if(tokenId) {
      $('#login_user_name0').text(userName);
      $('#login_user_name0').attr('title',userName);
      // $('#login_user_icon0').attr('src','../image/sys_mode/iconfont.png');
      $('#login_user_name1').text(userName);
      $('#login_user_name1').attr('title',userName);
      // $('#login_user_icon1').attr('src','../image/sys_mode/iconfont.png');
      // $('#login_phone').text(phone);
      $('#login_quit_btn').text('退出登录');
  } else {
      $('#login_user_name0').text('未登录');
      $('#login_user_icon0').attr('src','../image/sys_mode/unlogin.jpg');
      $('#login_user_name1').text('未登录');
      $('#login_user_icon1').attr('src','../image/sys_mode/unlogin.jpg');
      $('#login_quit_btn').text('登录系统');
  }
  $('#login_quit_btn').unbind().bind('click', function() {
      $.removeCookie('token_id');
      $.removeCookie('user_name');
      $.removeCookie('phone');
      $.removeCookie('busi_main_id');
      $.removeCookie('busi_compete_id');
      $.removeCookie('busi_compete_type');
      window.location.href = Common.url_static_root + '/login/login.html';
  });
});

function formatText(text) {
  if(!text || text == 'undefined' || text == 'null'){
      return '';
  } else {
      text = text+'';
      return text.trim();
  }
}