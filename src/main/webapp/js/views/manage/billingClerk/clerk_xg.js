$(function() {
	var invoiceTypeEnterprise = $("#invoiceTypeEnterprise",window.top.document).val();
	var invoiceType = JSON.parse(invoiceTypeEnterprise);
	var canEleInvoice = invoiceType.eleInvoice;
	var canSpecialInvoice = invoiceType.specialInvoice;
	var canPaperInvoice = invoiceType.paperInvoice;
	
	if(canPaperInvoice){
		$("#invoiceType2").css("display","block");
		$("#label01").css("display","block");
		$("#invoiceTypeLi").css("display","block");
	}
	if(canSpecialInvoice){
		$("#invoiceType3").css("display","block");
		$("#label02").css("display","block");
		$("#invoiceTypeLi").css("display","block");
	}
	  invoiceTypeFun();
	  var billingClerkId = $Utils.getUrlParameters().billingClerkId;
	  $("#enterpriseBillingClerkId").val(billingClerkId);
	  //查询开票员信息
	  $.ajax({
			url: basePath+"/manage/clerk/queryClerkById"+suffix,
			type: "GET",
			data: {
				billingClerkId:billingClerkId
			},
			success: function(data) {
				var item = data.data.data;
			   	$("#clerkName").val(item.clerkName);
			   	$("#loginName").val(item.loginName);
			   	$("#organization").val(item.mechanism);
			   	$("#oldPwd").val(item.loginPassword);
			   	$("#password").val(jqPwd(item.loginPassword));
				$("#repeatPassword").val(jqPwd(item.loginPassword));
				$("#contractPhone").val(item.contractPhone);
				$("#sex").val(item.gender);
				$("#singleInvoiceLimitMoney").val(item.singleInvoiceLimitmoney);
				$("#singleMonthInvoiceNum").val(item.singleMonthInvoicenum);
				$("#invoiceType").val(item.invoiceType);
				var invoiceType = item.invoiceType;
				if(invoiceType=="ELE_PAPER_SPECIAL"){
					 $("#invoiceType2").attr("checked", true)
					 $("#invoiceType3").attr("checked", true)
				}
				if(invoiceType=="ELE_PAPER"){
					$("#invoiceType2").attr("checked", true)
					$("#invoiceType3").attr("checked", false)
				}
				if(invoiceType=="ELE_SPECIAL"){
					$("#invoiceType2").attr("checked", false)
					$("#invoiceType3").attr("checked", true)
				}
				
			}
	  });
	
	//校验表单信息
		var validator = $("#modifyClerkForm").validate({
	    onfocusout : function(element) {
	      $(element).valid();
	    },
	    onfocusin : function(element) {
	      if (this.settings.focusCleanup) {
//	        $("#" + $(element).attr("id") + "_tip").text("");
	      }
	    },
	    focusCleanup : true,
	    onkeyup : false,
	    highlight : function(element, errorClass) {
	      /*$(element).fadeOut(function() {
	        $(element).fadeIn();
	      });*/
	    },
	    errorPlacement : function(error, element) {
	      if(error.text() != "" && error.text() != null){
	    	layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
	      }
//	      $("#" + element.attr("id") + "_tip").text(error.text());
	    },
	    rules : {
	       clerkName:{
		       required:true,
		       clerkNameVali:true
		   },
	       loginName :{
	    	   required : true,
	    	   loginNameVli:true,
	    	   remote:{
	    		   type:"GET",
	    		   url:basePath+"/manage/clerk/checkUpLoginName"+suffix,
	    		   data:{
	    			   loginName:function(){return $("#loginName").val();},
	    			   billingClerkId:function(){return $("#enterpriseBillingClerkId").val();}
	               } 
	    	   }
	       },
	       organization:{
	    	   required:false,
	    	   organizationVali:true
	       },
	       password:{
	    	   required:true,
	    	   passwordVali:true,
	       } ,
	       repeatPassword:{
	    	   required:true,
	           equalTo:"#password"  
	       },
	       contractPhone:{
	    	   required:true,  
	    	   contractPhoneVali:true
	       },
	       singleInvoiceLimitMoney:{
	    	   required:false,  
	    	   singleInvoiceLimitMoneyVali:true
	       },
	       singleMonthInvoiceNum:{
	    	   required:false,  
	    	   singleMonthInvoiceNumVali:true
	       },
	       invoiceType:{
	    	   required:false,  
	    	   invoiceTypeVali:true
	       },
	    },
	    messages : {
          clerkName:{
              required:"姓名不能为空",
              clerkNameVali:"请输入2-10位的英文和中文",
		  },
	      loginName :{
	    	  required : "登录名不能为空",
	    	  loginNameVli:"登录名只能包括英文字母或数字及~!@#$%^_+[]{}\?等字符组合，长度为2-20个字符",
	    	  remote : "登录名与系统中其他人员重复，您可尝试使用手机号、邮箱等作为登录名"
	      },
	      organization:{
	    	  required:"",
	    	  organizationVali:"请输入2-40位的中文、数字、字母组合",
	      },
	      password : {
	    	   required : "密码不能为空",
	    	   pwd:"密码只能包括英文字母或数字及~!@#$%^_+[]{}\?等字符组合，长度为6-20个字符"
	      },
	      repeatPassword : {
	    	  required: "重复密码不能为空", 
	          equalTo: "两次输入密码不一致"  
	      },
	      contractPhone:{
        	  required:"联系电话不能为空",
        	  contractPhoneVali:"请输入正确格式的手机号或电话号码"
	      },
	      singleInvoiceLimitMoney:{
	    	  required:"",  
	    	  singleInvoiceLimitMoneyVali:"请输入正确格式的单张开票金额上限"
	      },
	      singleMonthInvoiceNum:{
	    	  required:"",  
	    	  singleMonthInvoiceNumVali:"每月开票张数上限只能为整数"
	      },
	      invoiceType:{
	    	  required:"",
	    	  invoiceTypeVali:"请选择开票种类"
	      },
	     }
	  }); 
});

//自定义姓名验证规则
jQuery.validator.addMethod("clerkNameVali", function(value, element) { 
	return clerkNameRegex.test(value); 
}, "请输入2-10位的英文或中文");

//自定义登录名验证规则
jQuery.validator.addMethod("loginNameVli", function(value, element) { 
	return two2TwentyStrRegex.test(value);
}, "请填写正确格式的登录名");

//自定义所属机构校验规则
jQuery.validator.addMethod("organizationVali", function(value, element) { 
	if(value==""){
		return true;
	}else{
	   return enterpriseNameRegex.test(value); 
	}
}, "请输入2-40位的中文、数字、字母组合");

//自定义密码验证规则
jQuery.validator.addMethod("passwordVali", function(value, element) { 
	return six2TwentyStrRegex.test(value);
}, "请填写正确格式的密码");

//自定义电话号码验证规则
jQuery.validator.addMethod("contractPhoneVali", function(value, element) { 
	return mobileOrGhRegex.test(value);
}, "请填写正确格式的手机号或电话号码");

//自定义单张开票金额上限验证规则
jQuery.validator.addMethod("singleInvoiceLimitMoneyVali", function(value, element) {
	var length = value.length;
	if(length > 0){
		if(twoPosiDecRegex.test(value)){
			return true;
		}else{
			return false;
		}
	}else{
		return true;
	}
}, "请填写正确格式的单张开票金额上限");

//自定义每月开票张数上限验证规则
jQuery.validator.addMethod("singleMonthInvoiceNumVali", function(value, element) {
	var length = value.length;
	if(length > 0){
		if(eightIntRegex.test(value)){
			return true;
		}else{
			return false;
		}
	}else{
		return true;
	}
}, "请填写正确格式的每月开票张数上限");

//开票种类验证规则
$.validator.addMethod("invoiceTypeVali", function(value, element) { 
	var length = value.length; 
	return length > 0; 
}, "开票种类不能为空");

//修改时展示的密码处理
function jqPwd(pwd){
	if(pwd.length>20){
		pwd=pwd.substring(0,20);
	}  
	return pwd;
}

//确认密码是否修改
function SurePwd(pwd){
	if(pwd==jqPwd($("#oldPwd").val())){
		pwd=$("#oldPwd").val();
	}
	return pwd;
}

//单张开票金额上限
function singleInvoiceLimitMoneyBlur(){
	var singleInvoiceLimitMoneyVal = $("#singleInvoiceLimitMoney").val();
	if(twoPosiDecRegex.test(singleInvoiceLimitMoneyVal)){
		singleInvoiceLimitMoneyVal = parseFloat(singleInvoiceLimitMoneyVal);
		singleInvoiceLimitMoneyVal = $Utils.checkInt(singleInvoiceLimitMoneyVal);
		$("#singleInvoiceLimitMoney").val(singleInvoiceLimitMoneyVal);
	}
}

//每月开票张数上限
function singleMonthInvoiceNumBlur(){
	var singleMonthInvoiceNumVal = $("#singleMonthInvoiceNum").val();
	if(eightIntRegex.test(singleMonthInvoiceNumVal)){
		singleMonthInvoiceNumVal = parseInt(singleMonthInvoiceNumVal);
		$("#singleMonthInvoiceNum").val(singleMonthInvoiceNumVal);
	}
}

//是否展示开票种类
function invoiceTypeFun(){
	$.ajax({
		type:"GET",
		url:basePath+"manage/clerk/selectEnterprisePaperInfo"+suffix,
		dataType:"json",
		success:function(data){
			if(data.data.data){
				$("#invoiceTypeLi").show();
			}
		}
	})
}

//修改开票员
function modifyClerk(){
	if($("#modifyClerkForm").valid()){
		 $("#save").attr("disabled","disabled");
		 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
		 var clerkName = $.trim($("#clerkName").val());
		 var loginName = $.trim($("#loginName").val());
		 var organization = $.trim($("#organization").val());
		 var loginPassword = $.trim(SurePwd($("#password").val()));
		 var repeatPassword = $.trim(SurePwd($("#repeatPassword").val()));
		 var contractPhone = $.trim($("#contractPhone").val());
		 var gender = $("#sex").val();
		 var singleInvoiceLimitMoney = $("#singleInvoiceLimitMoney").val();
		 var singleMonthInvoiceNum = $("#singleMonthInvoiceNum").val();
		 var billingClerkId = $.trim($("#enterpriseBillingClerkId").val());
		 var invoiceType2 = $("#invoiceType2").is(':checked');
		 var invoiceType3 = $("#invoiceType3").is(':checked');
		 var invoiceType;
		 if(invoiceType2&&invoiceType3){
			 invoiceType="ELE_PAPER_SPECIAL";
		 }else if(invoiceType2&&!invoiceType3){
			 invoiceType="ELE_PAPER";
		 }else if(!invoiceType2&&invoiceType3){
			 invoiceType="ELE_SPECIAL";
		 }else if(!invoiceType2&&!invoiceType3){
			 invoiceType="ELE";
		 }
		 var enterpriseBillingClerk = {
				  clerkName:clerkName,
				  loginName:loginName,
				  mechanism: organization,
				  loginPassword:loginPassword,
				  contractPhone: contractPhone,
				  gender:gender,
				  singleInvoiceLimitmoney:singleInvoiceLimitMoney,
				  singleMonthInvoicenum:singleMonthInvoiceNum,
				  billingClerkId:billingClerkId,
				  invoiceType:invoiceType
        };
	   //提交表单
	  $.ajax({
		url: basePath+"/manage/clerk/updateBillingClerk"+suffix,
		type: "POST",
		data: enterpriseBillingClerk,
		cache: false,
		success: function(data) {
			layer.close(index);
			$("#save").removeAttr('disabled');
			if(data.code==200){
				layer.alert(data.msg, {icon: 1,title:["",true],skin:"newLayer"},function(index){
					window.location.href = "/pages/manage/billingClerk/clerk.shtml";
				});
			}else if(data.code==403){
				layer.alert(data.msg, {icon: 2,title:["",true],skin:"newLayer"},function(index){
					layer.closeAll();
				});
			}
		}
	   });
	}
}
