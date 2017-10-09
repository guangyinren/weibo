$(function(){
	AreaSelect.init({
        eleId:"select_new",
        provinceId:"provinceId",
        cityId:"cityId",
    });

	$("#pCaptcha").on("change",function(){
//		判断验证码是否正确
		if(!isEmputy("pCaptcha") || !isReg("pCaptcha",/^[0-9]{1,4}$/)){
			$("#send_btn").addClass("hqyzm_dis");
//			$("#send_btn").off("click", sendSMS);
			show_eror("请输入正确的验证码");
			return;
		}else{
			$("#send_btn").removeClass("hqyzm_dis");
//			$("#send_btn").on("click", sendSMS);
		}
	});
	$("#pCaptcha").blur(function(){
//		判断验证码是否正确
		if(!isEmputy("pCaptcha") || !isReg("pCaptcha",/^[0-9]{1,4}$/)){
			$("#send_btn").addClass("hqyzm_dis");
//			
			show_eror("请输入正确的验证码");
			return;
		}else{
			display_eror(["请输入正确的验证码"]);	
			$("#send_btn").removeClass("hqyzm_dis");
//			$("#send_btn").on("click", sendSMS);
		}
	});
	$("#send_btn").on("click", sendSMS);
//	var validator1 = $("#register").validate({
//		//光标离开时校验
//		onfocusout:function(element){
//			$(element).valid();
//		},
//		//获取到焦点时去除错误提示信息
//        onfocusin:function(element){
//            //console.info(this.settings.focusCleanup); //如果focusCleanup为true,则删除错误提示信息
//            if(this.settings.focusCleanup){
//                $("#"+$(element).attr("id")+"_tip").text("");
//            }
//        },
//		focusCleanup:true, //clear the error message when the error element get focus again.
//		onkeyup:false,
//		highlight: function(element, errorClass){
//			$(element).fadeOut(function() {  
//				$(element).fadeIn();
//			});
//		},
//		errorPlacement: function(error, element) {
//			//element是form表单中出错的元素的jquery对象
//			$("#"+element.attr("id")+"_tip").text(error.text());
//		},
//		rules:{
//			taxpayerNum:{
//				required: true,
//				rangelength:[15,20],
//				taxpayerNumReg:true,
//				remote: { //ajax调用后台查看手机号是否可用
//		        	url:basePath+"user/check_taxpayerNum"+suffix,
//		        	type:"post"
//		        }
//			},
//			enterpriseName:{
//		        required: true,
//		        rangelength:[2,40],
//		        enterpriseNameReg:true
//		    },
//		    password1:{
//		        required: true,
//		        rangelength:[6,20],
//		        pwdReg:true,
//		    },
//		    password2:{
//		        required: true,
//		        equalTo: "#password1"
//		    },
//		    
//		    legalRepresentativeName:{
//		        required: true,
//		        rangelength:[2,10],
//		        legalRepresentativeNameReg:true
//		    },
//		    contactsName:{
//		        required: true,
//		        rangelength:[2,10],
//		        contactsNameReg:true
//		    },
//		    contactsEmail:{
//		        required: true,
//				customEmailReg:true
//		    },
//		    contactsPhone:{
//		        required: true,
//				phoneReg:true,
//		    },
//		    enterpriseName:{
//		        required: true,
//		        rangelength:[2,40],
//		        enterpriseNameReg:true
//		    },
//		    invitationId:{
//		    	rangelength:[10,10],
//		    	invitationIdReg:true
//		    },
//		    mobile_captcha:{
//		        required: true,
//		        mobile_captchaReg:true,
//		        rangelength:[4,4],
//		    },
//		    enterpriseAddress:{
//		        required: true,
//		        maxlength:40,
//		        enterpriseAddressReg:true
//		    },
//		    provinces:{
//		    	min:1
//		    },
//		    protocol:{
//		    	atLeastOneChecked: true
//		    }
//		},
//		messages: {
//			taxpayerNum:{
//		        required: "纳税人识别号不能为空",
//		        rangelength:"纳税人识别号应为15-20个字符",
//		        remote: "该纳税人识别号已被使用"
//		    },
//		    enterpriseName:{
//		        required: "企业名称不能为空",
//		        rangelength:"企业名称应为2-40个字符",
//		    },
//		    invitationId:{
//		    	rangelength:"邀请码长度不正确"
//		    },
//		    password1:{
//		    	required: "密码不能为空",
//		    	rangelength:"密码长度应为6-20个字符"
//		    },
//		    password2:{
//		    	required: "确认密码不能为空",
//		        equalTo: "两次密码输入不一致"
//		    },
//		    legalRepresentativeName:{
//		        required: "法定代表人姓名不能为空",
//		        rangelength:"法人名称应为2-10个字符",
//		    },
//		    contactsName:{
//		        required: "联系人姓名不能为空",
//		        rangelength:"联系人姓名应为2-10个字符",
//		    },
//		    contactsPhone:{
//		    	required: "手机号不能为空",
//		    },
//		    contactsEmail:{
//		    	required: "邮箱不能为空",
//		        email: "邮箱格式不正确"
//		    },
//		    paperTicketed:{
//		        required: ""
//		    },
//		    mobile_captcha:{
//		        required: "短信验证码不能为空",
//		        rangelength:"短信验证码长度为4"
//		    },
//		    enterpriseAddress:{
//		    	required: "详细地址不能为空",
//		    	maxlength:"详细地址最大应为40个字符",
//		    },
//		    provinces:{
//		    	min:''
//		    },
//		    protocol:{
//		    	atLeastOneChecked: "请阅读网站注册协议，并选中我已认真阅读协议......"
//		    }
//		}
//		
//	});
	
	$("#file1").uploadPreview({ Img: "img_re", Width: 120, Height: 120 });
	$("#provinceId").on("change",changeSelect);
	$("#btn_submit_1").on("click", register_gr);
	
	$("#taxpayerNum").blur(function(){
		if(!isEmputy("taxpayerNum")){
			show_eror("纳税人识别号不能为空");
			return;
		}
		if(!isLength("taxpayerNum",15,20)){
			show_eror("纳税人识别号应为15-20个字符");
			return;
		}
		if(!isReg("taxpayerNum",/^[a-zA-Z0-9]+$/)){
			show_eror("纳税人识别号只能包括英文字母或数字");
			return;
		}
		if(!isRemote()){
			show_eror("此纳税人识别号已使用");
			return;
		}
		display_eror(["纳税人识别号不能为空","纳税人识别号应为15-20个字符","纳税人识别号只能包括英文字母或数字","此纳税人识别号已使用"]);	
	});
	$("#enterpriseName").blur(function(){
		if(!isEmputy("enterpriseName")){
			show_eror("企业名称不能为空");
			return;
		}
		if(!isLength("enterpriseName",2,40)){
			show_eror("企业名称应为2-40个字符");
			return;
		}
		if(!isReg("enterpriseName",/^[a-zA-Z0-9\u0391-\uFFE5]+$/)){
			show_eror("企业名称只能包括汉字、英文字母或数字");
			return;
		}
		display_eror(["企业名称不能为空","企业名称应为2-40个字符","企业名称只能包括汉字、英文字母或数字"]);	
	});
	$("#password1").blur(function(){
		if(!isEmputy("password1")){
			show_eror("密码不能为空");
			return;
		}
		if(!isLength("password1",6,20)){
			show_eror("密码长度应为6-20个字符");
			return;
		}
		if(!isReg("password1",/^[a-zA-Z0-9[~`!@%#$^*+':;?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{6,20}$/)){
			show_eror("密码只能包括英文字母或数字等字符组合");
			return;
		}
		display_eror(["密码不能为空","密码长度应为6-20个字符","密码只能包括英文字母或数字等字符组合"]);	
	});
	$("#password2").blur(function(){
		if(!isSame("password1","password2")){
			show_eror("两次密码输入不一致");
			return;
		}
		if(!isReg("password1",/^[a-zA-Z0-9[~`!@%#$^*+':;?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{6,20}$/)){
			show_eror("密码只能包括英文字母或数字等字符组合");
			return;
		}
		display_eror(["两次密码输入不一致","密码只能包括英文字母或数字等字符组合"]);	
	});
	$("#invitationId").blur(function(){
		if(isEmputy("invitationId")){
			if(!isReg("invitationId",/^[a-zA-Z0-9]{10}$/)){
				show_eror("邀请注册码不符合要求");
				return;
			}
			display_eror(["邀请注册码不符合要求"]);	
		}
		display_eror(["邀请注册码不符合要求"]);	
		
	});
	$("#enterpriseAddress").blur(function(){
		if(!isEmputy("enterpriseAddress")){
			show_eror("详细地址不能为空");
			return;
		}
		if(!isLength("enterpriseAddress",1,24)){
			show_eror("详细地址最大应为24个字符");
			return;
		}
		if(!isReg("enterpriseAddress",/^[a-zA-Z0-9\u0391-\uFFE5_-]+$/)){
			show_eror("详细地址只能包括中文、数字、英文和_-字符");
			return;
		}
		display_eror(["详细地址不能为空","详细地址最大应为24个字符","详细地址只能包括中文、数字、英文和_-字符"]);	
	});
	$("#legalRepresentativeName").blur(function(){
		if(!isEmputy("legalRepresentativeName")){
			show_eror("法定代表人姓名不能为空");
			return;
		}
		if(!isLength("legalRepresentativeName",2,10)){
			show_eror("法人名称应为2-10个字符");
			return;
		}
		if(!isReg("legalRepresentativeName",/^[a-zA-Z\u0391-\uFFE5]+$/)){
			show_eror("法人名称只能包括英文或中文");
			return;
		}
		display_eror(["法定代表人姓名不能为空","法人名称应为2-10个字符","法人名称只能包括英文或中文"]);	
	});
	$("#contactsName").blur(function(){
		if(!isEmputy("contactsName")){
			show_eror("联系人姓名不能为空");
			return;
		}
		if(!isLength("contactsName",2,10)){
			show_eror("联系人姓名应为2-10个字符");
			return;
		}
		if(!isReg("contactsName",/^[a-zA-Z\u4e00-\u9fa5]+$/)){
			show_eror("联系人名称只能包括英文或中文");
			return;
		}
		display_eror(["联系人姓名不能为空","联系人姓名应为2-10个字符","联系人名称只能包括英文或中文"]);	
	});
	$("#contactsEmail").blur(function(){
		if(!isEmputy("contactsEmail")){
			show_eror("邮箱不能为空");
			return;
		}
		if(!isLength("contactsEmail",4,50)){
			show_eror("邮箱应最大为50个字符");
			return;
		}
		if(!isReg("contactsEmail",/^([.a-zA-Z0-9_-])+@[a-zA-Z0-9_-]{1,}\.[a-zA-Z0-9_-]{1,}$/)){
			show_eror("邮箱格式不正确");
			return;
		}
		display_eror(["邮箱不能为空","邮箱应最大为50个字符","邮箱格式不正确"]);	
	});
	$("#contactsPhone").blur(function(){
		if(!isEmputy("contactsPhone")){
			show_eror("手机号不能为空");
			return;
		}
		if(!isReg("contactsPhone",/^1[0-9]{10}$/)){
			show_eror("手机号码格式不正确");
			return;
		}
		display_eror(["手机号不能为空","手机号码格式不正确"]);	
	});
	$("#mobile_captcha").blur(function(){
		if(!isEmputy("mobile_captcha")){
			show_eror("短信验证码不能为空");
			return;
		}
		if(!isLength("mobile_captcha",4,4)){
			show_eror("短信验证码长度为4");
			return;
		}
		if(!isReg("mobile_captcha",/^[0-9]{1,4}$/)){
			show_eror("短信验证码只能是数字");
			return;
		}
		display_eror(["短信验证码不能为空","短信验证码长度为4","短信验证码只能是数字"]);	
	});
//	$("#taxpayerNum").focus(function(){
//		display_eror();
//	});
//	$("#enterpriseName").focus(function(){
//		
//		display_eror();
//	});
//	$("#password1").focus(function(){
//		
//		display_eror();
//	});
//	$("#password2").focus(display_eror);
//	$("#enterpriseAddress").focus(display_eror);
//	$("#legalRepresentativeName").focus(display_eror);
//	$("#contactsName").focus(display_eror);
//	$("#contactsEmail").focus(display_eror);
//	$("#contactsPhone").focus(display_eror);
//	$("#mobile_captcha").focus(display_eror);
});


function changeSelect(){
	var provinceId = $("#provinceId").val();
	if("" == provinceId){
		show_eror("请选择地址");
		return false;
	}else{
		display_eror(["请选择地址"]);
		return true;
	}
}
function isCheck(){
	if(!$("#protocol").attr("checked")){
		show_eror("请阅读网站协议");
		return false;
	}else{
		display_eror(["请阅读网站协议"]);
		return true;
	}
}

function valid_reg(){
	var taxpayerNum1 = isEmputy("taxpayerNum");
	if(!taxpayerNum1){
		show_eror("纳税人识别号不能为空");
		return false;
	}
	
	var taxpayerNum2 = isLength("taxpayerNum",15,20);
	if(!taxpayerNum2){
		show_eror("纳税人识别号应为15-20个字符");
		return false;
	}
	
	var taxpayerNum3 = isReg("taxpayerNum",/^[a-zA-Z0-9]+$/);
	if(!taxpayerNum3){
		show_eror("纳税人识别号只能包括英文字母或数字");
		return false;
	}
	
	var taxpayerNum4 = isRemote();
	if(!isRemote()){
		show_eror("此纳税人识别号已使用");
		return false;
	}
	
	
	var enterpriseName1 = isEmputy("enterpriseName");
	if(!enterpriseName1){
		show_eror("企业名称不能为空");
		return false;
	}
	var enterpriseName2 = isLength("enterpriseName",2,40);
	if(!enterpriseName2){
		show_eror("企业名称应为2-40个字符");
		return false;
	}
	var enterpriseName3 = isReg("enterpriseName",/^[a-zA-Z0-9\u0391-\uFFE5]+$/);
	if(!enterpriseName3){
		show_eror("企业名称只能包括汉字、英文字母或数字");
		return false;
	}
	
	var password11 = isEmputy("password1");
	if(!password11){
		show_eror("密码不能为空");
		return false;
	}
	var password12 = isLength("password1",6,20);
	if(!password12){
		show_eror("密码长度应为6-20个字符");
		return false;
	}
	var password13 = isReg("password1",/^[a-zA-Z0-9[~`!@%#$^*+':;?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{6,20}$/);
	if(!password13){
		show_eror("密码只能包括英文字母或数字及~!@#$%^_+[]{}\?等字符组合");
		return false;
	}
	
	var password2 = isSame("password1","password2");
	if(!password2){
		show_eror("两次密码输入不一致");
		return false;
	}
	
	var invitationId = isEmputy("invitationId");
	if(invitationId){
		if(!isReg("invitationId",/^[a-zA-Z0-9]{10}$/)){
			show_eror("邀请注册码只能包括英文字母或数字组合");
			return false;
		}
	}
	
	var province = changeSelect();
	if(!province){
		show_eror("请选择地址");
		return false;
	}
	
	var enterpriseAddress1 = isEmputy("enterpriseAddress");
	if(!enterpriseAddress1){
		show_eror("详细地址不能为空");
		return false;
	}
	var enterpriseAddress2 = isLength("enterpriseAddress",1,24);
	if(!enterpriseAddress2){
		show_eror("详细地址最大应为24个字符");
		return false;
	}
	var enterpriseAddress3 = isReg("enterpriseAddress",/^[a-zA-Z0-9\u0391-\uFFE5_-]+$/);
	if(!enterpriseAddress3){
		show_eror("详细地址只能包括中文、数字、英文和_-字符");
		return false;
	}
	
	var legalRepresentativeName1 = isEmputy("legalRepresentativeName");
	if(!legalRepresentativeName1){
		show_eror("法定代表人姓名不能为空");
		return false;
	}
	var legalRepresentativeName2 = isLength("legalRepresentativeName",2,10);
	if(!legalRepresentativeName2){
		show_eror("法人名称应为2-10个字符");
		return false;
	}
	var legalRepresentativeName3 = isReg("legalRepresentativeName",/^[a-zA-Z\u0391-\uFFE5]+$/);
	if(!legalRepresentativeName3){
		show_eror("法人名称只能包括英文或中文");
		return false;
	}
	
	var contactsName1 = isEmputy("contactsName");
	if(!contactsName1){
		show_eror("联系人姓名不能为空");
		return false;
	}
	var contactsName2 = isLength("contactsName",2,10);
	if(!contactsName2){
		show_eror("联系人姓名应为2-10个字符");
		return false;
	}
	var contactsName3 = isReg("contactsName",/^[a-zA-Z\u4e00-\u9fa5]+$/);
	if(!contactsName3){
		show_eror("联系人名称只能包括英文或中文");
		return false;
	}
	
	var contactsEmail1 = isEmputy("contactsEmail");
	if(!contactsEmail1){
		show_eror("邮箱不能为空");
		return false;
	}
	var contactsEmail2 = isLength("contactsEmail",4,50);
	if(!contactsEmail2){
		show_eror("邮箱应最大为50个字符");
		return false;
	}
	var contactsEmail3 = isReg("contactsEmail",/^([.a-zA-Z0-9_-])+@[a-zA-Z0-9_-]{1,}(.[a-zA-Z0-9_-]{1,})+$/);
	if(!contactsEmail3){
		show_eror("邮箱格式不正确");
		return false;
	}
	
	var contactsPhone1 = isEmputy("contactsPhone");
	if(!contactsPhone1){
		show_eror("手机号不能为空");
		return false;
	}
	var contactsPhone2 = isReg("contactsPhone",/^1[0-9]{10}$/);
	if(!contactsPhone2){
		show_eror("手机号码格式不正确");
		return false;
	}
	
	var mobile_captcha1 = isEmputy("mobile_captcha");
	if(!mobile_captcha1){
		show_eror("短信验证码不能为空");
		return false;
	}
	var mobile_captcha2 = isLength("mobile_captcha",4,4);
	if(!mobile_captcha2){
		show_eror("短信验证码长度为4");
		return false;
	}
	var mobile_captcha3 = isReg("mobile_captcha",/^[0-9]{1,4}$/);
	if(!mobile_captcha3){
		show_eror("短信验证码只能是数字");
		return false;
	}
	
	if($("#img_num").val() != 1){
		show_eror("请上传税务登记证");
		return false;
	}
	var protocol = isCheck();
	if(!protocol){
		show_eror("请阅读网站协议");
		return false;
	}
	return true;
}
//个人用户注册
function register_gr(){
	var result = valid_reg();
	if(result){ //表单校验通过
		$.ajax({
			type:"POST",
			url:basePath+"user/register_enterprise"+suffix,
			data:{
				taxpayerNum:$("#taxpayerNum").val().trim(),
				enterpriseName:$("#enterpriseName").val().trim(),
				password:$("#password1").val().trim(),
				legalRepresentativeName:$("#legalRepresentativeName").val().trim(),
				contactsName:$("#contactsName").val().trim(),
				contactsEmail:$("#contactsEmail").val().trim(),
				contactsPhone:$("#contactsPhone").val().trim(),
				invitationId:$("#invitationId").val().trim(),
				paperTicketed:$("#paperTicketed").val().trim(),
				provinceId:$("#provinceId").val().trim(),
				cityId:$("#cityId").val().trim(),
				enterpriseAddress:$("#enterpriseAddress").val().trim(),
				captcha:$("#mobile_captcha").val().trim().trim(),
				type:"210"
			},
			dataType:"json",
			success:function(data){
				if(data!=null){
					console.info(data);
					if(data.code=="200"||data.code=="201"){
						window.location.href=basePath+"pages/index/successful.shtml";
					}else if(data.code=="500"){
						show_eror(data.msg);
					}else{
						show_eror(data.msg);
					}
				}else{
					show_eror(data.msg);
				}
			}
		});
	}
}

function sendSMS(){
	var sjh = $("#contactsPhone").val().trim();
	var pCaptcha = $("#pCaptcha").val().trim();
	if(!isEmputy("pCaptcha") || !isReg("pCaptcha",/^[0-9]{1,4}$/)){
		$("#send_btn").addClass("hqyzm_dis");
		$("#send_btn").off("click", sendSMS);
		show_eror("请输入正确的验证码");
		return;
	}
	var contactsPhone1 = isEmputy("contactsPhone");
	if(!contactsPhone1){
		show_eror("手机号不能为空");
		return false;
	}
	var contactsPhone2 = isReg("contactsPhone",/^1[0-9]{10}$/);
	if(!contactsPhone2){
		show_eror("手机号码格式不正确");
		return false;
	}
	if (contactsPhone1||contactsPhone2) {
		var returnBody = $ptweb.getMsgCaptcha("send_btn", "210", sjh, pCaptcha,sendSMS);
		if("500" == returnBody.code){
			$("#pCaptcha").val("");
			getCaptcha();
			show_eror(returnBody.msg);
		}else if("200" == returnBody.code){
			display_eror(["验证码不匹配"]);
		}
	}
}

//上传图片
function uploadPic() {
	$.ajaxFileUpload({
		url : basePath + "user/upload_img" + suffix, //用于文件上传的服务器端请求地址
		secureuri : true, //是否需要安全协议，一般设置为false
		fileElementId : 'pic', //文件上传域的ID
		dataType : 'json', //返回值类型 一般设置为json
		type : "POST",
		success : function(data) {
			if(data.code == 200){
//				layer.tips("图片上传成功", "#pic",{
//					tips:[2,'#01c675']
//				});
				$("#img_num").val(1);
	            $("#img_re").css("display","block");
	            $("#div_up").css("display","none");
			}else{
				show_eror(data.msg);
				console.info(data.msg);
			}
			
           
            //$("#img_re").attr("src","/use");
		},
		error : function(data) {
			var msg = data.data;
			show_eror("图片错误");
		}
	})
	return false;
}

//刷新短证码
function getCaptcha(){
	$("#btn_getCaptcha").prop("src", basePath+"validate/captcha"+suffix+"?type=002&r="+Math.random());
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
				$("#img_num").val(1);
				$("#img_re").css("display","block");
				$("#div_up").css("display","none");
			}else{
				show_eror(data.msg);
				console.info(data.msg);
			}
			
			
			//$("#img_re").attr("src","/use");
		},
		error : function(data) {
			var msg = data.data;
			show_eror("图片错误");
		}
	})
	$("#pic1").uploadPreview({ Img: "ImgPr", Width:385, Height: 263, Callback:function(){
		try{
			uploadPic_();
		}catch (e) {
			// TODO: handle exception
			console.log(e);
		}
	}});
//	return false;
}

function isEmputy(str){
	var vlu = $("#"+str).val().trim();
	if(vlu == ""){
		return false;
	}else{
		return true;
	}
}
function isLength(str,min,max){
	var vlu = $("#"+str).val().trim();
	if(vlu.length<min||vlu.length>max){
		return false;
	}else{
		return true;
	}
}
function isSame(str1,str2){
	var vlu1 = $("#"+str1).val().trim();
	var vlu2 = $("#"+str2).val().trim();
	if(vlu1 !=vlu2){
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
function isRemote(){
	var res = false;
	$.ajax({
		type:"POST",
		url:basePath+"user/check_taxpayerNum"+suffix,
		data:{
			taxpayerNum:$("#taxpayerNum").val().trim()
		},
		async: false,
		dataType:"json",
		success:function(data){
			res = data;
		}
	});
	
	return res
}

function display_eror(arr){
	var err = $("#h6_01").text();
	if(arr.some(function(element){
		return element==err;
	})){
		$("#h6_01").html('');
		$("#h6_01").css("display","none");
	}
	/**/
}
function show_eror(str){
	$("#h6_01").html('<img src="/images/gb.png" />'+str);
	$("#h6_01").css("display","inline-block");
}