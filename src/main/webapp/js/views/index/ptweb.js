/**
 * Email songdan_obj@126.com
 */
(function(){
	/**
	 * 获取短信验证码
	 * @param btn_id 倒计时元素id
	 * @param type 短信类型
	 * @param sjh 手机号
	 * @param pCaptcha 图片验证码
	 * @param callback 倒计时回调函数
	 */
	function getMsgCaptcha(btn_id, type, sjh,pCaptcha,callback,destMobile){
		var returnBody = "";
		$.ajax({
			type:"POST",
			url:basePath+"validate/sendSMS"+ suffix,
			data:{
				type: type,
				phone: sjh,
				imageCaptchaValue: pCaptcha,
			},
			dataType:"json",
			async:false,
			success:function(data){
				if(data!=null){
					console.info(data);
					returnBody = data;
					//短信发送成功，禁用获取验证码按钮，并提示倒计时
					if("200" == data.code){
						Timer.execute({
							"id":btn_id,
							"time":120,
							"callback":callback||getMsgCaptcha,
							"endText":"获取验证码",
							"exeCuteText":"秒"
						});
					}
				}
				}
		});
		return returnBody;
	}
	/**
	 * 获取短信验证码
	 * @param btn_id 倒计时元素id
	 * @param type 短信类型
	 * @param sjh 手机号
	 * @param pCaptcha 图片验证码
	 * @param callback 倒计时回调函数
	 */
	function getMsgCaptchaNew(btn_id, type, sjh,callback,destMobile){
		var returnBody = "";
		$.ajax({
			type:"POST",
			url:basePath+"validate/sendSMS"+ suffix,
			data:{
				type: type,
				phone: sjh,
			},
			dataType:"json",
			async:false,
			success:function(data){
				if(data!=null){
					console.info(data);
					returnBody = data;
					//短信发送成功，禁用获取验证码按钮，并提示倒计时
					if("200" == data.code){
						Timer.execute({
							"id":btn_id,
							"time":120,
							"callback":callback||getMsgCaptchaNew,
							"endText":"获取验证码",
							"exeCuteText":"秒"
						});
					}
				}
			}
		});
		return returnBody;
	}

	/**
	 * 获取密码等级
	 */
	function getPasswordLevel(password){
		if (!/^[A-Za-z0-9]{6,12}$/.test(password)) {
			throw "密码不符合规范";
		}
		if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])([A-Za-z0-9]){6,12}$/.test(password)) {
			return "STRONG";
		}
		if (/^(?=.*[a-z])(?=.*[0-9])([a-z0-9]){6,12}|(?=.*[A-Z])(?=.*[0-9])([A-Z0-9]){6,12}$/.test(password)) {
			return "MIDDLE";
		}
		if (/^([A-Za-z]{6,12})|([0-9]{6,12})$/.test(password)) {
			return "WEAK";
		}

	}
	var ptweb={};
	ptweb.getMsgCaptcha=getMsgCaptcha;
	ptweb.getMsgCaptchaNew=getMsgCaptchaNew;
	ptweb.getPasswordLevel=getPasswordLevel;
	window.$ptweb=ptweb;
})();
