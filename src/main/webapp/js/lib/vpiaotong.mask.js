/**
 * 模态框
 */
(function(window,$){

	var mask={
		build:function(){
			var strs = [];
			strs.push('<div class="popup_bg"  style="display:none;"></div>');
			strs.push('<div class="popup_cont" id="alertmsg" style="display:none;">');
			strs.push('<h3 class="title_h3"><a href="javascript:$mask.hide()"><img src="/images/views/ptweb/close.png" /></a></h3>');
			strs.push('<div class="del_fp">');
			strs.push('<p id="msg"></p>');
			strs.push('<div class="button_sp_area1"><a id="btn" class="alert_wbx_btn_qd" href="javascript:$mask.hide()">确定</a></div>');
			strs.push('</div>');
			strs.push('</div>');
			$("body").append(strs.join(""));
		},
		show:function(msgStr){
			$(".popup_bg").show();
			$("#alertmsg").show();
			$("#msg").text(msgStr);
		},
		hide:function(){
			$(".popup_bg").hide();
			$("#alertmsg").hide();
			$("#msg").text("");
		}
	}
	window.$mask = mask;
	$mask.build();
})(window,jQuery);
