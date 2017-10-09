(function(win, $) {

	win.$http = $.http = {
		get : function(url, data, callback, async, type) {// type:�������ݸ�ʽ��xml,
			// html, script,
			// json, text,
			// _default��
			$.ajax({
				url : url,
				type : "get",
				cache : false,
				data : data,
				async : async,
				success : function(data, readyStatus, xhr) {
					if (typeof data == 'string'
							&& data.indexOf('<!DOCTYPE HTML>') > 0) {
						$('body').modalLog('登录超时,请重新登录');
						return;
					}
					callback(data);
				},
				dataType : type,
				error : function(XMLHttpRequest) {
					
					if(XMLHttpRequest.status == 400) {
						$(".mask").removeClass("none");
		    			$(".mask .text").text("请求参数格式错误,请确认后重新输入!");
		    			$('.confirm').on('click',function(){ 
		    				$(".mask").addClass("none");
		    			});
		    			var json = {code:200,data:{rows:[]}};
		    			callback(json);
		    			return;
					}
					
					
					if (XMLHttpRequest.status == 500) {
					}
					var errorMapping = $.http.errorMapping();
					console.log(errorMapping[XMLHttpRequest.status]);
				}
			});
		},
		post : function(url, data, callback, async, type) {
			$.ajax({
				url : url,
				type : "post",
				data : data,
				cache : false,
				success : function(data, readyStatus, xhr) {
					if (typeof data == 'string'
							&& data.indexOf('<!DOCTYPE HTML>') > 0) {
						$('body').modalLog('登录超时,请重新登录!');
						return;
					}
					callback(data);
				},
				dataType : type,
				async : async,
				error : function(XMLHttpRequest) {
					var errorMapping = $.http.errorMapping();
					console.log(errorMapping[XMLHttpRequest.status]);
				}
			});
		},
		put : function(url, data, callback, type) {
			$.ajax({
				url : url,
				type : "put",
				data : data,
				cache : false,
				success : callback,
				dataType : type,
				error : function(XMLHttpRequest) {
					var errorMapping = $.http.errorMapping();
					console.log(errorMapping[XMLHttpRequest.status]);
				}
			});
		},
		'delete' : function(url, data, callback, type) {
			$.ajax({
				url : url,
				type : "delete",
				data : data,
				cache : false,
				success : callback,
				dataType : type,
				error : function(XMLHttpRequest) {
					var errorMapping = $.http.errorMapping();
					console.log(errorMapping[XMLHttpRequest.status]);
				}
			});
		},
		errorMapping : function() {
			return {
				503 : "没有",
				404 : "链接页面错误"
			}
		}
	}

})(window, jQuery)