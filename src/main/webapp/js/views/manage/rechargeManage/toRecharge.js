$(function() {
	//获取账户余额等信息
	 $http.get(basePath+"rechargeManager/dynamicData"+suffix,"",function(data) {
		 	var dynamicData = data.data;
		 	$("#b01").text(dynamicData.moneySurplus);
			$("#b02").text(dynamicData.invoiceFreeNum);
			$("#b03").text(dynamicData.messageFreeNum);
     });	
	 
	var subject = "发票开具服务";
	TokenBuilder.build("recharge");
	document.getElementById("pay_btn").onclick=function toPay() {
		if($("#payForm").valid()){
			var amount = $("#amount").val();
			$http.post(basePath+"rechargeManager/recharge"+suffix+"?token="+$("#token_recharge").val(),{
				channel:"create_direct_pay_by_user",
				amount: amount,
				amountSettle:amount,
				subject:subject
			},function(data){
				if (data.code == 200) {
					var param = data.data;
					Payobj.pay(param);
				}else{
					alert(data.msg);
				}
			})
		}
	}

});
$("#payForm").validate({
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
		amount:{
			required: true,
			money:true
		}

	},
	messages: {
		amount:{
			required: "充值金额不能为空",
			money:"请输入正确格式的金额"
		}
	}
});
