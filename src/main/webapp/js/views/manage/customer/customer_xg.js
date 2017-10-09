$(function(){
	//获取顾客id
	 var enterpriseCustomerId = GetQueryString("enterpriseCustomerId");
	 //根据id查询客户信息
	 $http.get(basePath+"/manage/customer/findCustomerById"+suffix,{enterpriseCustomerId:enterpriseCustomerId},function(data) {
		 var item = data.data;
		 $("#customerName").val(item.customerName); 
		 $("#customerTaxNum").val(item.customerTaxNum);
		 $("#customerCode").val(item.customerCode);
		 $("#contactName").val(item.contactName);
		 $("#enterprisePhone").val(item.enterprisePhone);
		 $("#contactEmail").val(item.contactEmail);
		 $("#address").val(item.address);
		 $("#contactPhone").val(item.contactPhone);
		 $("#bankAccount").val(item.bankAccount);
		 $("#accountNum").val(item.accountNum);
		 $("#enterpriseCustomerId").val(item.enterpriseCustomerId);
     })	
   
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
		        gmfMcVali:true,
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
		        gmfMcVali : customerNameRegexErrMsg,
		      },
		      enterprisePhone :{
		    	telPhone :  enterprisePhoneRegexErrMsg
		      },
		      contactEmail :{
		    	  emailVali : sprYxRegexErrMsg 
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
		    	   selfcontactName : personNameRegexErrMsg
		       },
		       address:{
		    	   dzDhVali : addressRegexErrMsg
		       },
		       bankAccount:{
		    	   khhzhVali : bankNameRegexErrMsg,
		       },
		       accountNum:{
		    	   accountNumVli : bankAccountRegexErrMsg,
		       }
		    }
		  });
	 //自定义地址验证规则
	 jQuery.validator.addMethod("dzDhVali",function(value,element) { 
	 	var length = value.length; 
	 	if(length > 0){
	 		return addressRegex.test(value); 
	 	}else{
	 		return true;
	 	}
	 }, addressRegexErrMsg);
	 jQuery.validator.addMethod("contactPhoneVli", function(value, element) { 
			var length = value.length;
			if(length > 0){
				return mobileRegex.test(value); 
			}else{
				return true;
			}
	 }, mobileRegexErrMsg);
	 //同客户名称操作按钮
	 $("#getCustomerName").on('click',function(){
		var customerName = $("#customerName").val();
		$("#contactName").val(customerName);
	 });	
		
	 //保存客户信息
     $("#save").on('click',function(){
    	 if($("#customerMessage").valid()){
    		 $("#save").attr("disabled","disabled");
			 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
    		 var enterpriseCustomer = {
   				  customerName: $("#customerName").val(), 
   				  customerTaxNum: $("#customerTaxNum").val(),
   				  customerCode: $("#customerCode").val(),
   				  contactName:$("#contactName").val(),
   				  enterprisePhone:$("#enterprisePhone").val(),
   				  contactEmail:$("#contactEmail").val(),
   				  address:$("#address").val(),
   				  contactPhone:$("#contactPhone").val(),
   				  bankAccount:$("#bankAccount").val(),
   				  accountNum:$("#accountNum").val(), 
   				  enterpriseCustomerId:$("#enterpriseCustomerId").val() 
                  };
   			  $http.post(basePath+"/manage/customer/update"+suffix,enterpriseCustomer,function(data) {
   				   layer.close(index);
          	       $("#save").removeAttr('disabled');
   				  if(data.code==200){
   					layer.alert('修改成功', {icon: 1,title:"提示"},function(index){
   					  window.location.href = "/pages/manage/customer/customer.shtml";
   					}); 
   				  }
                })     
    	 }
	  });
});

//获取浏览器地址栏中的url中的参数的值ֵ
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;

}

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
	//数字、字母组合
	if(value==""){
		return true;
	}else{
	   return selfDefineCodeRegex.test(value); 
	}
}, customerCodeRegexErrMsg);

//自定义联系人验证contactName
jQuery.validator.addMethod("selfcontactName", function(value, element) { 
	//中文、字母组合
	if(value==""){
		return true;
	}else{
	   return personalNameRegex.test(value); 
	}
}, personNameRegexErrMsg);


////自定义开户行帐号验证规则
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


