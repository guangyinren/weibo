/*!
 * jQuery Validation Plugin v1.13.1
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 * modify by liuyong 2017/3/31
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "./jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

(function() {

	function stripHtml(value) {
		// remove html tags and space chars
		return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
		// remove punctuation
		.replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
	}

	$.validator.addMethod("maxWords", function(value, element, params) {
		return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
	}, $.validator.format("Please enter {0} words or less."));

	$.validator.addMethod("minWords", function(value, element, params) {
		return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
	}, $.validator.format("Please enter at least {0} words."));

	$.validator.addMethod("rangeWords", function(value, element, params) {
		var valueStripped = stripHtml(value),
			regex = /\b\w+\b/g;
		return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
	}, $.validator.format("Please enter between {0} and {1} words."));

}());

	//购买方名称，客户管理客户名称验证规则
	$.validator.addMethod("gmfMcVali", function (value, element) {
		return !notEnterRegex.test(value) && getByteLength(value) >= 4 && getByteLength(value) <= 100;
	},"请输入2-50个字符的中文或2-100个数字、字母组合");
	
	//纳税人识别号验证规则
	$.validator.addMethod("nsrsbhVali", function (value, element) {
		var length = value.length; 
		if(length > 0){
			return taxpayerNumRegex.test(value);
		}else{
			return true;
		}
	},"请输入15-20个字符的数字及大写字母组合");
	
	//纳税人识别号验证规则
	$.validator.addMethod("nsrsbhReqVali", function (value, element) {
		return taxpayerNumRegex.test(value);
	},"请输入15-20个字符的数字及大写字母组合");
	
	//购买方地址验证规则
	$.validator.addMethod("gmfDzdhVali", function (value, element) {
		var length = value.length; 
		if(length > 0){
			return !notEnterRegex.test(value) && length <= 50;
		}else{
			return true;
		}
	},"地址为1-50个字符的中文、字母、数字-_#()（）组合");
	
	//购买方电话验证规则
	$.validator.addMethod("gmfdhVali", function (value, element) {
		var length = value.length; 
		if(length > 0){
//			var gmfdhReg = /^((1\d{10})|(([0-9]{3,4}-)?([2-9][0-9]{6,7})+(-[0-9]{1,6})?))?$/;
			return mobileOrGhRegex.test(value);
		}else{
			return true;
		}
	},"电话为7-20个字符的数字和-组合");
	
	//销售方地址验证规则
	$.validator.addMethod("xsfDzdhVali",function(value,element) { 
		return !notEnterRegex.test(value) && length <= 50;
	},"地址为1-50个字符的中文、字母、数字-_#()（）组合");
	
	//销售方电话验证规则
	$.validator.addMethod("xsfdhVali",function(value,element) { 
		return mobileOrGhRegex.test(value);
	},"电话为7-20个字符的数字和-组合");
	
	//开户行验证规则
	$.validator.addMethod("khhVali", function (value, element) {
		var length = value.length; 
		if(length > 0){
			return bankNameRegex.test(value);
		}else{
			return true;
		}
	},"开户行为1-35个字符的中文");
	
	//开户行验证规则
	$.validator.addMethod("khhReqVali", function (value, element) {
		return bankNameRegex.test(value);
	},"开户行为1-35个字符的中文");
	
	//帐号验证规则
	$.validator.addMethod("yhzhVali", function (value, element) {
		var length = value.length; 
		if(length > 0){
			return bankAccountRegex.test(value);
		}else{
			return true;
		}
	},"账号为8-30个字符的数字");
	
	//帐号验证规则
	$.validator.addMethod("yhzhReqVali", function (value, element) {
		return bankAccountRegex.test(value);
	},"账号为8-30个字符的数字");
	
	//货物名称验证规则
	$.validator.addMethod("goodsNameVali", function (value, element) {
		return strRegex.test(value) && getByteLength(value) > 0 && getByteLength(value) <= 100;
	},"请输入100个字母、数字、特殊字符或者50个中文");
	
	//规格型号验证规则
	$.validator.addMethod("specificationModelVali", function (value, element) {
		var length = value.length;
		if(length > 0){
			return strRegex.test(value) && getByteLength(value) > 0 && getByteLength(value) <= 40; 
		}else{
			return true;
		}
	},"请输入20个之内的字母、数字、中文及特殊字符组合");
	
	//单位验证规则
	$.validator.addMethod("unitVali", function (value, element) {
		var length = value.length;
		if(length > 0){
			return strRegex.test(value) && getByteLength(value) > 0 && getByteLength(value) <= 32;
		}else{
			return true;
		}
	},"请输入16个之内的字母、数字、中文及特殊字符组合");
	
	//前8后8正数验证规则
	$.validator.addMethod("eightDecVali", function (value, element) {
		return (eightDecRegex.test(value) && parseFloat(value)>parseFloat(0));
	},"请输入小数点前后不超过8位的正数");
	
	//前8后2正数验证规则
	$.validator.addMethod("twoDecZeroVali", function (value, element) {
//		var twoDecReg = /^(-?)[0-9]{1,8}(\.[0-9]{1,2})?$/;
		return (twoPosiDecRegex.test(value) && parseFloat(value)>parseFloat(0));
	},"请输入不超过8位的正数，可保留2位小数");
	
	//总金额验证规则
	$.validator.addMethod("totalPriceVali", function (value, element) {
		return (twoPosiDecRegex.test(value) && parseFloat(value)>parseFloat(0));
	},"请输入不超过8位的正数，可保留2位小数");
	
	//前8后2（正负数0）验证规则
	$.validator.addMethod("twoDecVali", function (value, element) {
//		var twoDecReg = /^(-?)[0-9]{1,8}(\.[0-9]{1,2})?$/;
		return twoDecRegex.test(value);
	},"请输入不超过8位的正数，可保留2位小数");
	
	//税率验证规则
	$.validator.addMethod("taxRateVali", function(value, element) { 
		var length = value.length; 
		return length > 0; 
	}, "税率不能为空");
	
	//自定义备注验证规则
	$.validator.addMethod("bzVali", function(value, element) { 
		var length = value.length;
		if(length > 0){
			return strRegex.test(value) && getByteLength(value) > 0 && getByteLength(value) <= 240; 
		}else{
			return true;
		}
	}, "请输入120个之内的中文或240个之内的字母、数字及特殊字符组合");
	
	//人名验证规则
	$.validator.addMethod("personalNameVali", function (value, element) {
		var length = value.length;
		if(length > 0){
			return personalNameRegex.test(value);
		}else{
			return true;
		}
	},"请输入10个之内的中文或字母组合");
	
	//复核人验证规则
	$.validator.addMethod("fhrVali", function (value, element) {
		var length = value.length;
		if(length > 0){
			return fhrRegex.test(value);
		}else{
			return true;
		}
	},"请输入4个之内的中文或字母组合");
	
	//手机号验证规则
	$.validator.addMethod("mobileVali", function (value, element) {
		var length = value.length;
		if(length > 0){
			return mobileRegex.test(value); 
		}else{
			return true;
		}
	},"请填写正确格式的手机号");
	
	//邮箱验证规则
	$.validator.addMethod("emailVali", function (value, element) {
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
	},"请填写正确格式的邮箱，最长为50个字符");
	
	//2-10位人名验证
	$.validator.addMethod("clerkNameVali", function (value, element) {
		return clerkNameRegex.test(value);
	},"请输入2-10位的英文或中文");
	
	//2-20位字符验证规则
	$.validator.addMethod("two2TwentyStrVali", function (value, element) {
		return two2TwentyStrRegex.test(value);
	},"请输入2-20个的字母、数字、中文及特殊字符组合");
	
	//6-20位字符验证规则
	$.validator.addMethod("six2TwentyStrVali", function (value, element) {
		return six2TwentyStrRegex.test(value);
	},"请输入6-20个的字母、数字、中文及特殊字符组合");
	
	//发票代码验证规则
	$.validator.addMethod("fpdmVali", function (value, element) {
		return fpdmRegex.test(value);
	},"请输入正确格式的发票代码");
	
	//发票号码验证规则
	$.validator.addMethod("fphmVali", function (value, element) {
		return fphmRegex.test(value);
	},"请输入正确格式的发票号码");
	
	//联系电话
	$.validator.addMethod("contactPhone",function(value,element,param){
		return /^1[3|4|5|7|8]\d{9}$|^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/.test(value);
	});
}));

function getByteLength(str) {
	  if (str) {
	    str = str.toString();
	    var byteLength = 0;
	    var reg = /[\u4e00-\u9fa5（）“”？【】；￥、。！——｛｝《》]/;
	    for (var i = 0, len = str.length; i < len; i++) {
	      if (reg.test(str[i])) {
	        byteLength += 2;
	      } else {
	        byteLength += 1;
	      }
	    }
	    return byteLength;
	  } else {
	    return 0;
	  }
}