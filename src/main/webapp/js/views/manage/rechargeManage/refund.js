var lastTimeAlipayAccount;

$(function() {
	//获取账户余额等信息
	 $http.get(basePath+"rechargeManager/dynamicData"+suffix,"",function(data) {
		 	var dynamicData = data.data.item;
//		 	$("#b01").text(dynamicData.moneySurplus);
//			$("#b02").text(dynamicData.invoiceFreeNum);
//			$("#b03").text(dynamicData.messageFreeNum);
		 	var moneySurplus = dynamicData.moneySurplus;
		 	if(moneySurplus<=0){
		 		$("#btnRefund").css("display","none");
		 	}
		 	$("#moneySurplus").val(moneySurplus);
		 	lastTimeAlipayAccount = dynamicData.lastTimeAlipayAccount;
     });	
	 
	 
	 
		var validator1 = $("#refundForm").validate({
			//光标离开时校验
			onfocusout:function(element){
				$(element).valid();
			},
			//获取到焦点时去除错误提示信息
			onfocusin:function(element){
				//console.info(this.settings.focusCleanup); //如果0000000000000为true,则删除错误提示信息
				if(this.settings.focusCleanup){
					$("#"+$(element).attr("id")+"_tip").text("");
					$("#"+$(element).attr("id")+"_tip").parent().removeClass("error");
				}
			},
			focusCleanup:true, //clear the error message when the error element get focus again.
			onkeyup:false,
			highlight: function(element, errorClass){
				$(element).fadeOut(function() {  
					$(element).fadeIn();
				});
			},
			errorPlacement: function(error, element) {
				//element是form表单中出错的元素的jquery对象
				$("#"+element.attr("id")+"_tip").text(error.text());
				$("#"+element.attr("id")+"_tip").parent().addClass("error");
			},
			rules:{
				refundMoney:{
					required: true,
					rangelength:[1,10],
					refundMoneyReg:true,
					refundMoneyReg_:true
				},
				mobileCaptcha:{
			        required: true,
			        rangelength:[6,6],
			        mobileCaptchaReg:true
			    },
			    refundReason:{
			        required: true,
			        rangelength:[1,50],
			        refundReasonReg:true
			    },
			    alipayAccount:{
			    	rangelength:[1,50],
			    	alipayAccountReg:true
			    }
			    
			},
			messages: {
				refundMoney:{
			        required: "退款金额不能为空",
			        rangelength:"退款金额不正确",
			    },
			    mobileCaptcha:{
			    	required: "验证码不能为空",
			        rangelength:"验证码不正确",
			    },
			    refundReason:{
			    	required: "退款原因不能为空",
			        rangelength:"退款原因过长",
			    },
			    alipayAccount:{
			    	rangelength:"退款账号不合格"
			    }
			    
			}
		});
		
		$("#sendMsgBtn").on("click", sendSMS);
	
});

$.validator.addMethod('refundMoneyReg', function(value, element) { 
	var vld = this.optional(element) || /^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(value);
	return vld && value>0;
},"请输入正确的金额");
$.validator.addMethod('refundMoneyReg_', function(value, element) { 
	//moneySurplus不能大于余额
	var surplus = $("#moneySurplus").val();
	var money = surplus*1>=value*1;
	return money;
},"余额不足");

$.validator.addMethod('mobileCaptchaReg', function(value, element) { 
	return this.optional(element) || /^[0-9]+$/.test(value);
},"只能数字");

$.validator.addMethod('refundReasonReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9\u0391-\uFFE5_-]+$/.test(value);
},"只能包括中文、数字、英文和_-字符");
$.validator.addMethod('alipayAccountReg', function(value, element) {
	var hiddenAlipayAccount = $("#hiddenAlipayAccount").val;
	if(hiddenAlipayAccount==0){
		return true;
	}else{
		if(value == ""){
			return false;
		}
		var vld = this.optional(element) || /^[0-9@.A-Za-z]+$/.test(value);
		return vld;
	}
	
},"只能数字");



function sendSMS(){
	$http.post(basePath+"user/userInfo"+suffix,"",
			function(data) {
				if(data.code=="200"||data.code=="201"){
					var phone =  data.data.user.contractPhone;
					var returnBody=$ptweb.getMsgCaptchaNew("sendMsgBtn", "240", phone, sendSMS);
					if("500" == returnBody.code){
						$("#mobileCaptcha_tip").text(returnBody.msg);
				        $("#mobileCaptcha_tip").parent().addClass("error");
					}else if("200" == returnBody.code){
						$("#mobileCaptcha_tip").text("");
			            $("#mobileCaptcha_tip").parent().removeClass("error");
					}else if("501" == returnBody.code){
						$("#mobileCaptcha_tip").text(returnBody.msg);
				        $("#mobileCaptcha_tip").parent().addClass("error");
					}
				}
	
	});
	
	
}

//申请退款
function refundApply(){
	if($("#refundForm").valid()){ //表单校验通过
		var alipayAccount = $("#alipayAccount").val().trim();
		$http.post(basePath+"rechargeManager/refund"+suffix,
				{
					refundMoney:$("#refundMoney").val().trim(),
					refundReason:$("#refundReason").val().trim(),
					mobileCaptcha:$("#mobileCaptcha").val().trim(),
					alipayAccount:$("#alipayAccount").val().trim(),
				},
				function(data) {
					console.info(data);
					if(data.code=="200"||data.code=="201"){
						if(isEmpty(lastTimeAlipayAccount)&&isEmpty(alipayAccount)){
							$(".refund-modal-title img").attr("src","/images/ok.png");
							$("#refund-modal-1").modal("show");
						}else if(isEmpty(alipayAccount)){
							$(".refund-modal-title img").attr("src","/images/ok.png");
							$("#refund-modal").modal("show");
						}else{
							$(".refund-modal-title img").attr("src","/images/ok.png");
							$("#refund-modal-2").modal("show");
						}
						
						
						

					}else if(data.code=="500"){
						$(".refund-modal-title img").attr("src","/images/error-circle.png");
						$("#modalSpanTitleFailure").text("退款失败")
						$("#modalDivContextFailure").text(data.msg)
						$("#refund-modal-failure").modal("show");
					}else if(data.code=="501"){
						$(".refund-modal-title img").attr("src","/images/error-circle.png");
						$("#modalSpanTitleFailure").text("退款失败")
						$("#modalDivContextFailure").text(data.msg)
						$("#refund-modal-failure").modal("show");
					}
		});
	}
}

function isEmpty(val) {
    if ((val === null || typeof(val) === 'undefined') || (typeof(val) === 'string' && val === '')) {
        return true;
    } else {
        return false;
    }
}

