/**
 * create by SongDan
 * vpiaotong 支付js文件
 * depend on
 */
(function() {
	window.Payobj = {
		/**channel:pay method*/
		relation: {
			create_direct_pay_by_user: aliPay
		},
		payConfig: {
			create_direct_pay_by_user: {
				url: "https://mapi.alipay.com/gateway.do?"
			}
		},
		/**
		 * 支付接口
		 */
		pay: function (param) {
			var channel = param.channel;
			if (typeof param.param == "string") {
				param.param = JSON.parse(param.param);
			}
			Payobj.relation[channel](param.param);
		}

	};

	/**
	 * Alipay
	 */
	function aliPay(param) {
		mocSubmit(Payobj.payConfig.create_direct_pay_by_user.url, param, "GET");
	}


	/**
	 * 模拟表单请求
	 * @param path 请求路径
	 * @param params 请求参数
	 * @param method 请求方式
	 */
	function mocSubmit(path, params, method,inputCharset) {
		method = method || "post";
		var form = document.createElement("form");
		form.setAttribute("method", method);
		form.setAttribute("action", path);
		form.setAttribute("_input_charset",inputCharset||"UTF-8");
		for ( var key in params) {
			if (params.hasOwnProperty(key)) {
				var hiddenField = document.createElement("input");
				hiddenField.setAttribute("type", "hidden");
				hiddenField.setAttribute("name", key);
				hiddenField.setAttribute("value", params[key]);

				form.appendChild(hiddenField);
			}
		}
		document.body.appendChild(form);
		form.submit();
	}
	
})();