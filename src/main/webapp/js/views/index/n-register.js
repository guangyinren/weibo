$(function(){
	AreaSelect.init({
        eleId:"select_new",
        provinceId:"provinceId",
        cityId:"cityId",
    });
	
	var validator1 = $("#registerStep1").validate({
		//光标离开时校验
		onfocusout:function(element){
			if($(element).attr("name") == "uploader" ||$(element).attr("name") == "provinces"){
				
			}else{
				$(element).valid();
			}
			
		},
		//获取到焦点时去除错误提示信息
        onfocusin:function(element){
            //console.info(this.settings.focusCleanup); //如果focusCleanup为true,则删除错误提示信息
        	
    		if(this.settings.focusCleanup){
    			$("#"+$(element).attr("name")+"_tip").text("");
    			$("#"+$(element).attr("name")+"_tip").parent().removeClass("error");
    		}
        },
		focusCleanup:true, //clear the error message when the error element get focus again.
		onkeyup:false,
		highlight: function(element, errorClass){
			if($(element).attr("name") == "provinces"){
				
			}else{
				$(element).fadeOut(function() {  
					$(element).fadeIn();
				});
			}
		},
		errorPlacement: function(error, element) {
			//element是form表单中出错的元素的jquery对象
			if($(element).attr("name") == "taxpayerNum"){
				if(error.text()=="1"){
					$("#"+element.attr("name")+"_tip").html("您输入的纳税人识别号已注册，请您前往<a href='/pages/account/login.shtml'>登录</a>，或者<a href='/pages/index/findPwd.shtml'>设置密码</a>");
					$("#"+element.attr("name")+"_tip").parent().addClass("error");
				}else{
					$("#"+element.attr("name")+"_tip").text(error.text());
					$("#"+element.attr("name")+"_tip").parent().addClass("error");
				}
			}else{
				$("#"+element.attr("name")+"_tip").text(error.text());
				$("#"+element.attr("name")+"_tip").parent().addClass("error");
			}	
			
		},
		rules:{
			taxpayerNum:{
				required: true,
				rangelength:[15,20],
				taxpayerNumReg:true,
				taxpayerNumRemote: true
			},
			enterpriseName:{
		        required: true,
		        enterpriseNameLengthReg:true,
		        enterpriseNameReg:true
		    },
		    legalRepresentativeName:{
		        required: true,
		        legalRepresentativeNameReg:true
		    },
		    provinces:{
		    	provinceIdReg:true
		    },
		    enterpriseAddress:{
		    	required: true,
		    	maxlength:50,
		    	enterpriseAddressReg:true,
		    	enterpriseAddressAllReg:true
		    },
		    uploader:{
		    	ImgReg:true
		    }
		},
		messages: {
			taxpayerNum:{
		        required: "纳税人识别号不能为空",
		        rangelength:"纳税人识别号应为15-20个字符",
		    },
		    enterpriseName:{
		        required: "企业名称不能为空",
		    },
		    legalRepresentativeName:{
		        required: "法定代表人姓名不能为空",
		    },
		    enterpriseAddress:{
		    	required: "详细地址不能为空",
		    	maxlength:"详细地址最大应为40个字符",
		    },
		}
		
	});
	
	var validator2 = $("#registerStep2").validate({
		//光标离开时校验
		onfocusout:function(element){
			$(element).valid();
		},
		//获取到焦点时去除错误提示信息
        onfocusin:function(element){
            //console.info(this.settings.focusCleanup); //如果focusCleanup为true,则删除错误提示信息
            if(this.settings.focusCleanup){
                $("#"+$(element).attr("name")+"_tip").text("");
                $("#"+$(element).attr("name")+"_tip").parent().removeClass("error");
            }
            
            if(element=="pCaptcha"){
            	//图片验证码去掉获取短信验证码的隐藏效果
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
			$("#"+element.attr("name")+"_tip").text(error.text());
			$("#"+element.attr("name")+"_tip").parent().addClass("error");
		},
		rules:{
			password1:{
		        required: true,
		        rangelength:[6,20],
		        pwdReg:true,
		    },
		    password2:{
		        required: true,
		        equalTo: "#password1"
		    },
		    contactsName:{
		        required: true,
		        rangelength:[2,8],
		        contactsNameReg:true
		    },
		    contactsEmail:{
		        required: true,
		        rangelength:[1,50],
				customEmailReg:true
		    },
		    contactsPhone:{
		        required: true,
		        rangelength:[11,11],
		        phoneReg: true
		    },
		    pCaptcha:{
		    	required: true,
		    	rangelength:[1,5],
		    	pCaptchaReg: true
		    },
		    mobile_captcha:{
		    	required: true,
		    	rangelength:[6,6],
		    	mobile_captchaReg: true
		    },
		    invitationId:{
		    	rangelength:[6,10],
		    	invitationIdReg:true
		    },
		    protocol:{
		    	protocolReg: true,
		    },
		},
		messages: {
			password1:{
		    	required: "密码不能为空",
		    	rangelength:"密码长度应为6-20个字符"
		    },
		    password2:{
		    	required: "确认密码不能为空",
		        equalTo: "两次密码输入不一致"
		    },
			contactsName:{
		        required: "联系人姓名不能为空",
		        rangelength:"联系人姓名应为2-8个字符",
		    },
		    contactsPhone:{
		    	required: "手机号不能为空",
		    	rangelength:"手机号码格式不正确"
		    },
		    contactsEmail:{
		    	required: "邮箱不能为空",
		    	rangelength:"邮箱不正确",
		    },
		    pCaptcha:{
		    	required: "图片验证码不能为空",
		    	rangelength:"图片验证码格式不正确"
		    },
		    mobile_captcha:{
		    	required: "短信验证码不能为空",
		    	rangelength:"短信验证码格式不正确"
		    },
		    invitationId:{
		    	rangelength:"邀请码格式不正确"
		    },
		}
		
	});
	
	
	$("#send_btn").on("click", sendSMS);
	$("#ok_btn").on("click", toIndex);
	$("#provinceId").on("change",changeSelect);
	
	
})	

$.validator.addMethod('taxpayerNumReg', function(value, element) { 
	return this.optional(element) || /^[A-Z0-9]+$/.test(value);
     
},"只能包括大写英文字母或数字");
$.validator.addMethod('taxpayerNumRemote', function(value, element) { 
	var res = false;
	$.ajax({
		type:"POST",
		url:basePath+"user/check_taxpayerNum"+suffix,
		data:{
			taxpayerNum:$.trim($("#taxpayerNum").val())
		},
		async: false,
		dataType:"json",
		success:function(data){
			res = data;
		}
	});
	return res
},'1');

$.validator.addMethod('pwdReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9[~`!@%#$^*+':;?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]+$/.test(value);
     
},"只能包括英文字母或数字及~!@#$%^_+[]{}\?等字符组合");

$.validator.addMethod('invitationIdReg', function(value, element) { 
	return this.optional(element) || (/^[0-9a-zA-Z]+$/.test(value));
	
},"邀请码格式不正确");
$.validator.addMethod('legalRepresentativeNameReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z\u0391-\uFFE5\s]{2,50}$/.test(value);
	
},"只能包括英文或中文，长度为2-50位");
$.validator.addMethod('contactsNameReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z\u0391-\uFFE5]+$/.test(value);
	
},"只能包括英文或中文");
$.validator.addMethod('enterpriseAddressReg', function(value, element) { 
	return this.optional(element) || /^[^<>\"\'&%\\/]+$/.test(value);
	
},"格式不正确");
$.validator.addMethod('enterpriseAddressAllReg', function(value, element) { 
	var provinceId =$("#provinceId").val();
	if(provinceId==""){
		return true;
	}
	var len1 = $("#enterpriseAddress").val().length;
	var options1=$("#provinceId option:selected");  //获取选中的项
	var options2=$("#cityId option:selected");  //获取选中的项
	var len2 = options1.text().length;
	var len3 = options2.text().length;
	var len =len1+len2+len3
	if(len>50){
		return false
	}
	
	return true;
	
},"企业省市地址加上详细地址不能大于50个字符");
$.validator.addMethod('enterpriseNameReg', function(value, element) { 
	return this.optional(element) || /^[^<>\"\'&%\\/]+$/.test(value);
	
},"格式不正确");
$.validator.addMethod('enterpriseNameLengthReg', function(value, element) { 
	var enterpriseName =$("#enterpriseName").val();
	var length = getByteLength(enterpriseName);
	if(length>100||length<4){
		return false;
	}
	return true;
},"长度不正确");
$.validator.addMethod('pCaptchaReg', function(value, element) { 
	return this.optional(element) || /^[0-9]+$/.test(value);
	
},"图片验证码格式不正确");
$.validator.addMethod('mobile_captchaReg', function(value, element) { 
	return this.optional(element) || /^[0-9]+$/.test(value);
	
},"短信验证码格式不正确");
$.validator.addMethod('customEmailReg', function(value, element) { 
	return this.optional(element) || /^([.a-zA-Z0-9_-])+@[a-zA-Z0-9_-]{1,}\.[a-zA-Z0-9_-]{1,}$/.test(value);
	
},"邮箱格式不正确");
$.validator.addMethod('phoneReg', function(value, element) { 
	return this.optional(element) || /^1[0-9]{10}/.test(value);
	
},"手机号码格式不正确");
$.validator.addMethod('provinceIdReg', function(value, element) { 
	var provinceId = $("#provinceId").val();
	if("" == provinceId){
		return false;
	}else{
		return true;
	}
	
},"请选择省市地址");

$.validator.addMethod('ImgReg', function(value, element) { 
//	if($("#img_num").val() != ''){
//		return true;
//	}else{
//		return false;
//	}
	var img = $("#img_num").val();
	if(isEmpty(img)){
		return false;
	}else{
		return true;
	}
	
},"请上传正确的税务登记证");
$.validator.addMethod('protocolReg', function(value, element) { 
	return isCheck();
	
},"请阅读网站注册协议，并选中我已认真阅读协议......");

function changeSelect(){
	var provinceId = $("#provinceId").val();
	if("" == provinceId){
		$("#provinces_tip").text("请选择省市地址");
		$("#provinces_tip").parent().addClass("error");
		return false;
	}else{
		$("#provinces_tip").text("");
        $("#provinces_tip").parent().removeClass("error");
		return true;
	}
}

$(function(){
	$("#pic").uploadPreview({ Img: "ImgPr", Width:385, Height: 263, Callback:function(){
		uploadPic()
	}});
	$("#pic1").uploadPreview({ Img: "ImgPr", Width:385, Height: 263, Callback:function(){
		try{
			uploadPic_();
		}catch (e) {
			console.log(e);
		}
	}});
})

//上传图片
function uploadPic() {
	$("#buttonNext").attr({"disabled":"disabled"});
	$.ajaxFileUpload({
		url : basePath + "user/upload_img" + suffix, //用于文件上传的服务器端请求地址
		secureuri : true, //是否需要安全协议，一般设置为false
		fileElementId : 'pic', //文件上传域的ID
		dataType : 'json', //返回值类型 一般设置为json
		type : "POST",
		success : function(data) {
			if(data.code == 200){
//				layer.tips("图片上传成功", "#pic1",{
//					tips:[2,'#01c675']
//				});
				var img_num = data.data.imageId;
				$("#img_num").val(img_num);
				$("#uploader_tip").text("");
                $("#uploader_tip").parent().removeClass("error");
				$(".fpic1").css("display","block");
			}else{
				$("#uploader_tip").text("请上传正确的税务登记证");
				$("#uploader_tip").parent().addClass("error");
				$(".fpic1").css("display","block");
			}
			
			$("#buttonNext").removeAttr("disabled");
            //$("#img_re").attr("src","/use");
		},
		error : function(data) {
			var msg = data.data;
			$("#uploader_tip").text("请上传正确的税务登记证");
			$("#uploader_tip").parent().addClass("error");
			$(".fpic1").css("display","block");
			$("#buttonNext").removeAttr("disabled");
		}
	})
	return false;
}

//上传图片
function uploadPic_() {
	$("#pic1").uploadPreview({ Img: "ImgPr", Width:385, Height: 263, Callback:function(){
		try{
			uploadPic_();
		}catch (e) {
			// TODO: handle exception
			console.log(e);
		}
	}});
	$("#buttonNext").attr({"disabled":"disabled"});
	//$(this).uploadPreview({ Img: "ImgPr", Width:385, Height: 263});
	$.ajaxFileUpload({
		url : basePath + "user/upload_img" + suffix, //用于文件上传的服务器端请求地址
		secureuri : true, //是否需要安全协议，一般设置为false
		fileElementId : 'pic1', //文件上传域的ID
		dataType : 'json', //返回值类型 一般设置为json
		type : "POST",
		success : function(data) {
			if(data.code == 200){
//				layer.tips("图片上传成功", "#pic1",{
//					tips:[2,'#01c675']
//				});
				var img_num = data.data.imageId;
				$("#img_num").val(img_num);
				$("#uploader_tip").text("");
                $("#uploader_tip").parent().removeClass("error");
				$(".fpic1").css("display","block");
			}else{
				$("#uploader_tip").text("请上传正确的税务登记证");
				$("#uploader_tip").parent().addClass("error");
				$("#img_num").val("");
			}
			
			$("#buttonNext").removeAttr("disabled");
			//$("#img_re").attr("src","/use");
		},
		error : function(data) {
			var msg = data.data;
			show_eror("图片错误");
			$("#buttonNext").removeAttr("disabled");
		}
	})
	$("#pic1").uploadPreview({ Img: "ImgPr", Width:385, Height: 263, Callback:function(){
		try{
			uploadPic_();
		}catch (e) {
			console.log(e);
		}
	}});
//	return false;
}


function sendSMS(){
	var sjh = $.trim($("#contactsPhone").val());
	
	var contactsPhone1 = isEmputy("contactsPhone");
	if(!contactsPhone1){
		$("#contactsPhone_tip").text("手机号不能为空");
        $("#contactsPhone_tip").parent().addClass("error");
		return false;
	}
	var pCaptcha = $.trim($("#pCaptcha").val());
	if(!isEmputy("pCaptcha") || !isReg("pCaptcha",/^[0-9]{1,4}$/)){
		$("#send_btn").addClass("hqyzm_dis");
		$("#pCaptcha_tip").text("请输入正确的验证码");
        $("#pCaptcha_tip").parent().addClass("error");
		return false;
	}
	var contactsPhone2 = isReg("contactsPhone",/^1[0-9]{10}$/);
	if(!contactsPhone2){
		$("#contactsPhone_tip").text("手机号码格式不正确");
        $("#contactsPhone_tip").parent().addClass("error");
		return false;
	}
	if (contactsPhone1||contactsPhone2) {
		var returnBody = $ptweb.getMsgCaptcha("send_btn", "210", sjh, pCaptcha,sendSMS);
		if("500" == returnBody.code){
			$("#pCaptcha").val("");
			getCaptcha();
			$("pCaptcha_tip").text(returnBody.msg);
	        $("#pCaptcha_tip").parent().addClass("error");
		}else if("200" == returnBody.code){
			$("#mobile_captcha_tip").text("");
            $("#mobile_captcha_tip").parent().removeClass("error");
		}else if("501" == returnBody.code){
			$("#pCaptcha").val("");
			getCaptcha();
			$("#mobile_captcha_tip").text(returnBody.msg);
	        $("#mobile_captcha_tip").parent().addClass("error");
		}
	}
}

function isEmputy(str){
	var vlu = $("#"+str).val();
	if(vlu == ""){
		return false;
	}else{
		return true;
	}
}

function isReg(obj,reg){
	var vlu = $("#"+obj).val();
	if(!reg.test(vlu)){
		return false;
	}else{
		return true;
	}
}

function isCheck(){
	if(!$("#protocol").attr("checked")){
		return false;
	}else{
		return true;
	}
}

//刷新短证码
function getCaptcha(){
	$("#btn_getCaptcha").prop("src", basePath+"validate/captcha"+suffix+"?type=002&r="+Math.random());
}
function toStep2(){
	if($("#registerStep1").valid()){
		var img = $("#img_num").val();
		if(!isEmpty(img)){
	        $(".zc-form1").hide();
	        $(".zc-form2").show();
	        $(".step1").removeClass("active");
	        $(".step2").addClass("active");
		}else{
			$("#uploader_tip").text("请上传正确的税务登记证");
			$("#uploader_tip").parent().addClass("error");
		}
	}
}
function toStep3(){
	if($("#registerStep2").valid()){
		$.ajax({
			type:"POST",
			url:basePath+"user/register_enterprise"+suffix,
			data:{
				taxpayerNum:$.trim($("#taxpayerNum").val()),
				enterpriseName:$.trim($("#enterpriseName").val()),
				password:$.trim($("#password1").val()),
				legalRepresentativeName:$.trim($("#legalRepresentativeName").val()),
				contactsName:$.trim($("#contactsName").val()),
				contactsEmail:$.trim($("#contactsEmail").val()),
				contactsPhone:$.trim($("#contactsPhone").val()),
				invitationCode:$.trim($("#invitationId").val()),
//				paperTicketed:$("input[name='paperTicketed']:checked").val().trim(),
				paperTicketed:"NO",
				provinceId:$.trim($("#provinceId").val()),
				cityId:$.trim($("#cityId").val()),
				enterpriseAddress:$.trim($("#enterpriseAddress").val()),
				captcha:$.trim($("#mobile_captcha").val()),
				swdjzId:$.trim($("#img_num").val()),
				type:"210"
			},
			dataType:"json",
			success:function(data){
				if(data!=null){
					console.info(data);
					if(data.code=="200"||data.code=="201"){
						$(".zc-form2").hide();
				        $(".zc-success").show();
				        $(".step2").removeClass("active");
				        $(".step3").addClass("active");
					}else if(data.code=="500"){
						$("#mobile_captcha_tip").text(data.msg);
				        $("#mobile_captcha_tip").parent().addClass("error");
					}else{
						$("#mobile_captcha_tip").text("请输入正确的验证码");
				        $("#mobile_captcha_tip").parent().addClass("error");
					}
				}else{
					$("#mobile_captcha_tip").text("请输入正确的验证码");
			        $("#mobile_captcha_tip").parent().addClass("error");
				}
			}
		});
	}
}

function toIndex(){
	window.location.href=basePath+"pages/manage/index.shtml";
}

function isEmpty(val) {
    if ((val === null || typeof(val) === 'undefined') || (typeof(val) === 'string' && val === '')) {
        return true;
    } else {
        return false;
    }
}


function getByteLength(str) {
	  if (str) {
	    str = str.toString();
	    var byteLength = 0;
	    var reg = /[^\x00-\xff]/;
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

