//查询用户信息并显示到页面上

$(function () {
	 $http.post(basePath+"user/enterprise_info"+suffix,"",function(data) {
		 if("200"==data.code){
				var item = data.data.item.enterpriseRegInfo;
				var setting = data.data.item.enterpriseInvoiceSettings;
				var user = data.data.user;
             $("#enterprise_name").text(item.enterpriseName);
             $("#taxpayer_num").text(item.taxpayerNum);
             $("#legal_representative_name").text(item.legalRepresentativeName);
             $("#contacts_name").text(item.contactsName);
             $("#contacts_email").text(item.contactsEmail);
             $("#contacts_phone").text(item.contactsPhone);
             $("#invitation_id").text(item.invitationCode);
             $("#enterprise_address").text(item.province+item.city+item.enterpriseAddress);
			 $("#yhxm").text(item.hyxm);
				if(item.reviewStatus == "REVIEW_YES"){
					//已审核通过
					var role = $("#role_",window.top.document).val();
					if( role== "ADMIN"||role=="ADMIN_ALL"){
						$("#btn_by").css("display","block");
						var enterpriseContactPhone = setting.enterpriseContactPhone;
						var taxRateId = setting.taxRateId;
						if(isEmpty(enterpriseContactPhone)||isEmpty(taxRateId)){
							$("#div_kpsz").css("display","block");
						}
					}
					$("#li_tc").css("display","block");
					$("#p_rz1").css("display","block");
					$("#p_rz2").css("display","none");
					
					if(setting !=null ||setting !=""){
						$("#p_rz3").css("display","block");
						$("#p_rz1").css("display","none");
					}
					$("#pt_code").text(item.platformCode);
		            $("#sq_code").text(item.authorizationCode);
		            $("#zc_code").text(item.registrationNum);
		            $("#pt_code_div").css("display","block");
		            $("#sq_code_div").css("display","block");
		            $("#zc_code_div").css("display","block");
					
					
				}else if(item.reviewStatus == "REVIEW_NO"){
					var msg = data.data.item.enterpriseInfoReview;
					//审核未通过
					$("#p_rz2").text("认证失败："+msg.replyContext+
							"企业信息认证失败，您可以重新编辑企业信息，再次发起认证。");
					var role = $("#role_",window.top.document).val();
					if( role== "ADMIN"||role=="ONLY_ADMIN"){
						$("#btn_by").css("display","block");
					}
				}
				
				$("#b01").text(user.invoicCount);
				$("#b02").text(user.invoicCountMonthly);
				$("#b03").text(user.clerkName);
			}
     });		  
	
	$("#btn_by").on("click",but_click);
	$("#logout_a").on("click",logout);
	
})

function but_click(){
	window.location.href=basePath+"pages/account/updateInfo.shtml";
}

function logout(){
	layer.confirm('您确定退出？', {
		  btn: ['是','否'] //按钮
		}, function(){
			$http.post(basePath+"user/logout"+suffix,"",function(data) {
				 window.top.location.href=basePath;
		     });		  
		});
	
	
}

function isEmpty(val) {
    if ((val === null || typeof(val) === 'undefined') || (typeof(val) === 'string' && val === '')) {
        return true;
    } else {
        return false;
    }
}
	