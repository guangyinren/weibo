(function($) {
	$.fn.extend({
		modalLog:function(strText,time) {
			$('body').css({'overflow':'hidden'});
			
			//判断是否有此元素
			if( $('.mask')) {
				$('.mask').removeClass('none');
				$(".mask .text").text(strText);
				
			} else {
				//new 一个模板层
				var div = "<div></div>";
				var firstP = $("<p></p>").addClass('text');
				var sencondP = $("<p></p>").addClass('btns').append('<span class="confirm">确定</span>');
				var child = $(div).append(firstP).append(sencondP);
				$('body').append($(div).addClass('mask').addClass('none').append(child) );
				$('.confirm').click(function(){
					
				})
			}
			$('.confirm').click(function(){
				window.location.reload();
			})
		}
	})
})(jQuery)