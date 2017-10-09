$(function(){
	   getTokenFun();
	    $.validator.setDefaults({
	        success: "valid"
		});
		var validator = $("#customerMessage").validate({
		    onfocusout : function(element) {
		      $(element).valid();
		    },
		    onfocusin : function(element) {
		      if (this.settings.focusCleanup) {
//		        $("#" + $(element).attr("id") + "_tip").text("");
		      }
		    },
		    focusCleanup : true,
		    onkeyup : false,
		    highlight : function(element, errorClass) {
		      $(element).fadeOut(function() {
		        $(element).fadeIn();
		      });
		    },
		    errorPlacement : function(error, element) {
		      if(error.text() != "" && error.text() != null){
		    	layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
		      }
//		      $("#" + element.attr("id") + "_tip").text(error.text());
		    },
		    rules : {
		    	customerName : {
		        required : true,
		        gmfMcVali:true
		       },
		       enterprisePhone :{
		    	   telPhone : true 
		       },
		       contactEmail :{
		    	   emailVali:true
		       },
		    	   
		       contactPhone :{
		    	   contactPhoneVli:true,  
		       },
		       customerTaxNum:{
		    	   nsrsbhVali:true,
		       },
		       customerCode:{
		    	   required : true, 
		    	   selfcustomerCode:true,
		       },
		       contactName:{
		    	   selfcontactName:true,
		       },
		       address:{
		    	   dzDhVali:true
		       },
		       bankAccount:{
		    	   khhzhVali:true
		       },
		       accountNum:{
		    	   accountNumVli:true, 
		       }
		       
		    },
		    messages : {
		      customerName : {
		        required : customerNameNotEmptyErrMsg,
		        gmfMcVali : customerNameRegexErrMsg
		      },
		      enterprisePhone :{
		    	  telPhone : enterprisePhoneRegexErrMsg
		      },
		      contactEmail :{
		    	  emailVali : emailRegexErrMsg 
		       },
		      contactPhone : {
		    	  contactPhoneVli : mobileRegexErrMsg
		      },
		      customerTaxNum:{
		    	  nsrsbhVali : taxpayerNumRegexErrMsg,
		      },
		      customerCode:{
		    	  required : customerCodeNotEmptyErrMsg, 
		    	  selfcustomerCode : customerCodeRegexErrMsg,
		      },
		      contactName:{
		    	  selfcontactName:personNameRegexErrMsg
		      },
		      address:{
		    	  dzDhVali:addressRegexErrMsg
		      },
		      bankAccount:{
		    	  khhzhVali:bankNameRegexErrMsg,
		      },
		      accountNum:{
		    	  accountNumVli:bankAccountRegexErrMsg,
		      }
		    }
		  }); 
		//同客户名称操作按钮 
	$("#getCustomerName").on('click',function(){
		var customerName = $("#customerName").val();
		$("#contactName").val(customerName);
	});	
		
	 $("#save").on('click',function(){
		 if($("#customerMessage").valid()){
			 $("#save").attr("disabled","disabled");
			 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
			 var enterpriseCustomer = {
					  
	          };
		    $.ajax({
				type:"POST",
				url:basePath+"/manage/customer/add"+suffix,
				data:{
					customerName: $("#customerName").val(), 
				    customerTaxNum: $("#customerTaxNum").val(),
				    customerCode: $("#customerCode").val(),
				    contactName:$("#contactName").val(),
				    enterprisePhone : $("#enterprisePhone").val(),
				    contactEmail:$("#contactEmail").val(),
				    address:$("#address").val(),
				    contactPhone:$("#contactPhone").val(),
				    bankAccount:$("#bankAccount").val(),
				    accountNum:$("#accountNum").val(), 
					tokenKey:tokenKey,
					token:token
				},
				success:function(data){
					layer.close(index);
	            	  $("#save").removeAttr('disabled');
					  if(data.code==200){
						  layer.alert('保存成功', {icon: 1,title:"提示"},function(index){
							  window.location.href = "/pages/manage/customer/customer.shtml";
						  });
					  }else if(data.code==444){
						  layer.alert("数据已保存，请到列表中查看", {icon: 2,title:["",true],skin:"newLayer"},function(index){
							  window.location.href = basePath+"pages/manage/billingClerk/clerk.shtml";
						  });
					  }
				}
			})
		 }   
	  });
});

//获取token
var token = "";
var tokenKey = "";
function getTokenFun(){
	token = $Utils.getUrlParameters().token;
	tokenKey = $Utils.getUrlParameters().tokenKey;
}

jQuery.validator.addMethod("contactPhoneVli", function(value, element) { 
	var length = value.length;
	if(length > 0){
		return mobileRegex.test(value); 
	}else{
		return true;
	}
}, "请填写正确格式的手机号");


function viewState(state){
	if(state!="VALID"){
		return "无效";
	}else{
		return "有效";
	}
}

//判断对象是否为空
function judgeNull(str){
	if(str==null){
		str="";
	}
	return str;
}

//自定义地址验证规则
jQuery.validator.addMethod("dzDhVali",function(value,element) { 
	var length = value.length; 
	if(length > 0){
		return addressRegex.test(value); 
	}else{
		return true;
	}
}, addressRegexErrMsg);
//自定义电话号码验证规则
jQuery.validator.addMethod("telPhone", function(value, element) { 
	if(value==""){
		return true;
	}else{
	   return ghRegex.test(value); 
	}
}, enterprisePhoneRegexErrMsg);

jQuery.validator.addMethod("mobile", function(value, element) { 
	if(value==""){
		return true;
	}else{
	   return mobileRegex.test(value); 
	} 
}, mobileRegexErrMsg);

//自定义客户名称
jQuery.validator.addMethod("selfCustomerName", function(value, element) { 
	return enterpriseNameRegex.test(value); 
}, customerNameRegexErrMsg);

//自定义纳税人识别号验证规则
jQuery.validator.addMethod("nsrsbhVali", function(value, element) { 
	var length = value.length; 
	if(length > 0){
		return taxpayerNumRegex.test(value);
	}else{
		return true;
	}
}, taxpayerNumRegexErrMsg);

//自定义客户编号customerCode
jQuery.validator.addMethod("selfcustomerCode", function(value, element) { 
	return selfDefineCodeRegex.test(value); 
}, customerCodeRegexErrMsg);

//自定义联系人验证contactName
jQuery.validator.addMethod("selfcontactName", function(value, element) { 
	if(value==""){
		return true;
	}else{
	   return personalNameRegex.test(value); 
	}
}, personNameRegexErrMsg);

//自定义开户行验证规则
jQuery.validator.addMethod("khhzhVali",function(value,element) { 
	var length = value.length; 
	if(length > 0){
		return bankNameRegex.test(value); 
	}else{
		return true;
	}
}, bankNameRegexErrMsg);
//自定义银行账号校验accountNum
jQuery.validator.addMethod("accountNumVli",function(value,element) { 
	var length = value.length; 
	if(length > 0){
		return bankAccountRegex.test(value); 
	}else{
		return true;
	}
}, bankAccountRegexErrMsg);
//自定义收票人邮箱验证规则
jQuery.validator.addMethod("emailVali", function(value, element) { 
	var length = value.length;
	if(length > 0){
		if(length > 50){
			return false;
		}else{
			return emailRegex.test(value); 
		}
	}else{
		return true;
	}
}, emailRegexErrMsg);
