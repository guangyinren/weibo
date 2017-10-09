$(function(){
	invoiceTypeFun();
	getTokenFun();
	//校验表单信息
	var validator = $("#addclerkForm").validate({
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
	    	   required:true,
	    	   loginNameVali:true,
	    	   remote:{
	    		   url:basePath+"/manage/clerk/checkLoginName"+suffix,
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
	    messages:{
	      clerkName:{
	          required:"姓名不能为空",
	          clerkNameVali:"请输入2-10位的英文和中文",
	      },
	      loginName:{
	    	  required:"登录名不能为空",
	    	  loginNameVali:"登录名只能包括中文英文字母或数字及~!@#$%^_+[]{}\?等字符组合，长度为2-20个字符",
	    	  remote:"登录名与系统中其他人员重复，您可尝试使用手机号、邮箱等作为登录名",
	      },
	      organization:{
	    	  required:"",
	    	  organizationVali:"请输入2-40位的中文、数字、字母组合",
	      },
	      password : {
	    	   required:"密码不能为空",
	    	   passwordVali:"密码只能包括英文字母或数字及~!@#$%^_+[]{}\?等字符组合，长度为6-20个字符"
	      },
	      repeatPassword:{
	    	  required:"重复密码不能为空", 
	          equalTo:"两次输入密码不一致"  
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
});

//自定义姓名验证规则
jQuery.validator.addMethod("clerkNameVali", function(value, element) { 
	return clerkNameRegex.test(value); 
}, "请输入2-10位的英文或中文");

//自定义登录名验证规则
jQuery.validator.addMethod("loginNameVali", function(value, element) { 
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

//获取token
var token = "";
var tokenKey = "";
function getTokenFun(){
	token = $Utils.getUrlParameters().token;
	tokenKey = $Utils.getUrlParameters().tokenKey;
	console.log(token);
	/*$.ajax({
		type:"GET",
		url:basePath+"token/getToken"+suffix,
		dataType:"json",
		success:function(data){
			tokenKey = data.data.tokenKey;
			token = data.data.token;
			console.log(data.data.tokenKey);
		}
	})*/
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

//保存开票员
function saveClerk(){
	if($("#addclerkForm").valid()){
		 $("#save").attr("disabled","disabled");
		 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
		 var clerkName = $.trim($("#clerkName").val());
		 var loginName = $.trim($("#loginName").val());
		 var organization = $.trim($("#organization").val());
		 var loginPassword = $.trim($("#password").val());
         var repeatPassword = $.trim($("#repeatPassword").val());
		 var contractPhone = $.trim($("#contractPhone").val());
		 var gender = $("#sex").val();
		 var singleInvoiceLimitMoney = $("#singleInvoiceLimitMoney").val();
		 var singleMonthInvoiceNum = $("#singleMonthInvoiceNum").val();
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
		 
		 //添加开票员
		 $.ajax({
				url:basePath+"/manage/clerk/add"+suffix,
				data:{
					tokenKey:tokenKey,
					token:token,
					clerkName:clerkName,
					loginName:loginName,
					mechanism:organization,
					loginPassword:loginPassword,
				    contractPhone:contractPhone,
				    gender:gender,
				    singleInvoiceLimitmoney:singleInvoiceLimitMoney,
				    singleMonthInvoicenum:singleMonthInvoiceNum,
				    invoiceType:invoiceType
				},
				type:"post",
				success:function(data){
					  layer.close(index);
	            	  $("#save").removeAttr('disabled');
					  if(data.code==200){
						  layer.alert(data.msg, {icon: 1,title:["",true],skin:"newLayer"},function(index){
							  window.location.href = basePath+"pages/manage/billingClerk/clerk.shtml";
						  });  
					  }else if(data.code==403){
						  layer.alert(data.msg, {icon: 2,title:["",true],skin:"newLayer"},function(index){
							  layer.closeAll();
						  });
					  }else if(data.code==444){
						  layer.alert("数据已保存，请到列表中查看", {icon: 2,title:["",true],skin:"newLayer"},function(index){
							  window.location.href = basePath+"pages/manage/billingClerk/clerk.shtml";
						  });
					  }
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					layer.close(index);
	            	$("#save").removeAttr('disabled');
					layer.alert('系统繁忙,请稍候再试',{icon:2,title:["",true],skin:"newLayer"}, function(){
		        		layer.closeAll();
					});  
			    }
			})
	 }	
}