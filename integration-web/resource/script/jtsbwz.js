var bh = $(window).height();
var bw = $(window).width();
var bw2 = bw / 2;
var bw1 = bw2 - 200;
var bw3 = bw2 + 200;
var boarddiv ='<div class="noi-boxs" id="noiBoxs"><div class="noi-boxs-body"><div class="noi-boxs-home"><a  class="noi-boxs-home-imge" title="大屏菜单"></a></div><div class="noi-boxs-menu"><a  class="noi-boxs-menu-imge" title="系统管理"></a></div><div class="noi-boxs-shutdown"><a  class="noi-boxs-shutdown-imge" title="退出系统"></a></div></div></div>';
$(document).ready(function() {
	$(document.body).append(boarddiv);
	$('.noi-boxs-home-imge').click(function() {
		window.location.href = "../menu/menu.html";
	});
	$('.noi-boxs-menu-imge').click(function() {
		window.location.href = "../main/index.html";
	});
	$('.noi-boxs-shutdown-imge').click(function() {
        utils.ajaxToServer({
            url: "system/loginOut",
            method: "post",
            success: function (data) {
                window.location.href = "./../../index.html";
            }
        })
	});
	$(document).mousemove(function(e) {
		if (e.pageX > bw1 && e.pageX < bw3) {
			if (e.pageY >= 0 && e.pageY <= 40) {
				$('.noi-boxs').css('display', 'block');
				$(".noiBoxs").animate({
					opacity: '1',
					height: '6',
					width: '20.5%'
				}, "slow");
			} else {
				$('.noi-boxs').css('display', 'none');
			}
		} else {
			$('.noi-boxs').css('display', 'none');
		}
	});
});

