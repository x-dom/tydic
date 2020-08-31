$.ajaxSetup({
  beforeSend: function (XMLHttpRequest) {
    if( $.cookie('token_id')) {
      XMLHttpRequest.setRequestHeader("token_id", $.cookie('token_id'));
    } else {
      window.location.href = Common.url_static_root + '/login/login.html';
    }
  }
});