
(function(win, $) {

	win.$http = $.http = {

		mapData: {},
		mapName: '',

		mapping: function(str) {

			for (var key in str) {
				this.mapData[key] = str[key];
			}

		},
		get: function(url, data, callback, async, mapping, type) {

			if (typeof async == 'string' || typeof mapping == 'string') {

				var mapStr = async;
				mapName = mapStr;
				async = true;
				mapData = this.mapData;
			}

			// html, script,
			// json, text,
			// _default��
			$.ajax({
				url: url,
				type: "get",
				cache: false,
				data: data,
				async: async,
				success: function(data, readyStatus, xhr) {
					if(typeof data == "string"){
						var data = JSON.parse(data);
						if(data.code == '401'){
							window.top.location.href = basePath + "pages/account/login.shtml";
		        			return;
		        		}
					}
					if(mapping){
						data = changeFromLocalColumns(data,mapName,mapData);
					}

					callback(data, readyStatus, xhr);
				},
				dataType: type,
				error: function(XMLHttpRequest) {

					if (XMLHttpRequest.status == 400) {
						// $(".mask").removeClass("none");
						// 			$(".mask .text").text("请求参数格式错误,请确认后重新输入!");
						// 			$('.confirm').on('click',function(){ 
						// 				$(".mask").addClass("none");
						// 			});
						// 			var json = {code:200,data:{rows:[]}};
						// 			callback(json);
						return;
					}


					if (XMLHttpRequest.status == 500) {}
					var errorMapping = $.http.errorMapping();
				}
			});
		},
		post: function(url, data, callback, async, type,contentType) {
			$.ajax({
				url: url,
				type: "post",
				data: data,
				cache: false,
				contentType: contentType,
				success: function(data, readyStatus, xhr) {
//					if(typeof data == 'string' && data.indexOf('<!DOCTYPE') > 0){
//	        			location.href = basePath + "base/user/login.html";
//	        			return;
//	        		}
					if(typeof data == "string"){
						var data = JSON.parse(data);
//						console.log(data);
						if(data.code == '401'){
							window.top.location.href = basePath + "pages/account/login.shtml";
		        			return;
		        		}
					}
					callback(data);
				},
				dataType: type,
				async: async,
				error: function(XMLHttpRequest) {
					var errorMapping = $.http.errorMapping();
				}
			});
		},
		put: function(url, data, callback, type) {
			$.ajax({
				url: url,
				type: "put",
				data: data,
				cache: false,
				success: callback,
				dataType: type,
				error: function(XMLHttpRequest) {
					var errorMapping = $.http.errorMapping();
				}
			});
		},
		'delete': function(url, data, callback, type) {
			$.ajax({
				url: url,
				type: "delete",
				data: data,
				cache: false,
				success: callback,
				dataType: type,
				error: function(XMLHttpRequest) {
					var errorMapping = $.http.errorMapping();
				}
			});
		},
		errorMapping: function() {
			return {
				503: "没有",
				404: "链接页面错误"
			}
		},
		// 选择列
		changeFromLocalColumns: function(array, map) {
			var _mapping;
			if (_.isUndefined(mapping)) {
				_mapping = this.mapping[this.name];
			} else {
				_mapping = mapping[map];
			}
			return changeColumns(_mapping, array);
		},

		// 列属性替换
		changeToLocalColumns: function(array, mapping) {
			if (_.isUndefined(mapping)) var _mapping = this.mapping[this.name];
			else var _mapping = mapping;
			return _mapping = _.invert(_mapping), changeColumns(_mapping, array)
		},

		// 替换列
		changeColumns: function(_mapping, array) {
			var _rs = [],
				_obj = {};

			return _.isUndefined(array) || _.isArray(array) ? (_.forEach(array, function(item) {
				_obj = {}, _.forEach(item, function(n, k) {
					_.isUndefined(_mapping[k]) || (_obj[_mapping[k]] = n);
				}), _rs.push(_obj);
			}), _rs) : (_.forEach(array, function(n, k) {
				_.isUndefined(_mapping[k]) || (_obj[_mapping[k]] = n);
			}), _obj);
		}

	}
})(window, jQuery)