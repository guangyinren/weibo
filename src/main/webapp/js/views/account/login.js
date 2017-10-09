$(function(){
	$(document).keyup(function(event){
		  if(event.keyCode ==13){
		    $("#btn_login_gr").trigger("click");
		  }
		});
	var key = 0;
	var error_times = 0;
	$.ajax({
			type:"POST",
			url:basePath+"util/security?time=0",
			dataType:"text",
			async:false,
			success:function(data){
				var val = data.split(",");
				key = val[0];
				error_times = val[1];
				
				if (error_times == "1") {
					$("#li1").css("display", "block");
				} else {
					$("#li1").css("display", "none");
				}
				var input1 = '<input type="hidden" id="error_times" name="error_times" value="'+error_times+'"/>';
				var input2 = '<input type="hidden" id="key" name="key" value="'+key+'"/>';
				$("#pCaptcha").append(input1);
				$("#pCaptcha").append(input2);
			}
		});

	$("#li1").append('<img class="yzm1" id="btn_getCaptcha" src="'+basePath+"user/captcha"+suffix+"?type=001&r="+Math.random()+'" ></img>');
	$("#btn_getCaptcha").on("click", getCaptcha);
	$("#btn_login_gr").on("click", login_gr);
	$("#loginName").blur(function(){
		if(!isEmputy("loginName")){
			show_eror("登录名不能为空");
			return;
		}
		if(!isLength("loginName",2,20)){
			show_eror("登录名长度应为2-20个字符");
			return;
		}
		display_eror(["登录名不能为空","登录名长度应为2-20个字符"]);
	});
	$("#passwd").blur(function(){
		if(!isEmputy("passwd")){
			show_eror("密码不能为空");
			return;
		}
		if(!isLength("passwd",6,20)){
			show_eror("密码长度应为6-20个字符");
			return;
		}
		if(!isReg("passwd",/^[a-zA-Z0-9[~`!@%#$^*+':;?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{6,20}$/)){
			show_eror("密码只能包括英文字母或数字等字符组合");
			return;
		}
		display_eror(["密码不能为空","密码长度应为6-20个字符","密码只能包括英文字母或数字等字符组合"]);
	});
	$("#pCaptcha").blur(function(){
		if(!isEmputy("pCaptcha")){
			show_eror("验证码不能为空");
		}
		if(!isReg("pCaptcha",/^[0-9]{1,4}$/)){
			show_eror("验证码只能是数字");
		}
	});
	display_eror(["验证码不能为空","验证码只能是数字"]);
});
function doRSAEncrypt(key, input) {
	if (key == '')
		return input;
	var rsa = new RSAKey();
	rsa.setPublic(key, "10001");
	var res = rsa.encrypt(input);
	if (res == null)
		return input;
	return res;
}

function login_gr() {
	if (valid_log()) {
		var captcha = 0;
		var error_times = $("#error_times").val();
		var key = $("#key").val();
		if (error_times == "1") {
			captcha = $("#pCaptcha").val();
		} else {
			captcha = "default";
		}
		//var value = doRSAEncrypt(key, $("#passwd").val().trim());

		var value = doRSAEncrypt(key, $("#passwd").val());
		$.ajax({
			type:"POST",
			url:basePath + "pages/account/login.shtml",
			data:{
				loginName : $("#loginName").val().trim(),
				password : value,
				pCaptcha : captcha
			},
			dataType:"json",
			success:function(data){
				var code = data.code;
				if(code != 200){
					if(code == "460"){
						show_eror("验证码不正确")
						$("#pCaptcha").val("");
						getCaptcha();
						$("#passwd").val("");
					}else if(code == "470"){
						show_eror("登录信息不匹配")
						$("#pCaptcha").val("");
						getCaptcha();
						$("#passwd").val("");
					}else if(code == "480"){
						show_eror("您的账号已被禁用")
						$("#pCaptcha").val("");
						getCaptcha();
						$("#passwd").val("");
					}
					$("#li1").css("display", "block");
					getCaptcha();
					$("#error_times").val(1);
				}
				else if(code == "200"){
					window.location.href=basePath+"pages/manage/index.shtml";
				}
			}
		});
	}
}
function show_menu(ID) {
	var totalCat = 3;
	for (i = 1; i < totalCat; i++) {
		if (ID != i) {
			$('#tabtop' + i).removeClass("rate_nav_sel");
			$('#tabtop' + i).addClass("");
			$('#cont' + i).css({
				display : "none"
			});
		} else {
			$('#tabtop' + i).addClass("rate_nav_sel");
			$('#tabtop' + i).removeClass("");
			$('#cont' + ID).css({
				display : "block"
			});
		}
	}
}
function alertMsg(msgStr) {
	$(".popup_bg").show();
	$("#alertmsg").show();
	$("#msg").text(msgStr);
}
function alertQuxiao() {
	$(".popup_bg").hide();
	$("#alertmsg").hide();
	$("#msg").text("");
}
//刷新短证码
function getCaptcha(){
	$("#btn_getCaptcha").prop("src", basePath+"validate/captcha"+suffix+"?type=001&r="+Math.random());
}

function valid_log(){
	var loginName1 = isEmputy("loginName");
	if(!loginName1){
		show_eror("登录名不能为空");
		return false;
	}
	var loginName2 = isLength("loginName",2,20);
	if(!loginName2){
		show_eror("登录名长度应为6-20个字符");
		return false;
	}
	var loginName3 = isEmputy("loginName");
	if(!loginName3){
		show_eror("登录名不能为空");
		return false;
	}
	
	var passwd1 = isEmputy("passwd");
	if(!passwd1){
		show_eror("密码不能为空");
		return false;
	}
	var passwd2 = isLength("passwd",6,20);
	if(!passwd2){
		show_eror("密码长度应为6-20个字符");
		return false;
	}
	var passwd3 = isReg("passwd",/^[a-zA-Z0-9[~`!@%#$^*+':;?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{6,20}$/);
	if(!passwd3){
		show_eror("密码只能包括英文字母或数字等字符组合");
		return false;
	}
	
	if(!$("#pCaptcha").is(":hidden")){
		var pCaptcha1 = isEmputy("pCaptcha");
		if(!pCaptcha1){
			show_eror("验证码不能为空");
			return false;
		}
		var pCaptcha2 = isReg("pCaptcha",/^[0-9]{1,4}$/);
		if(!pCaptcha2){
			show_eror("验证码只能是数字");
			return false;
		}
	}
	return true;
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
	var vlu = $("#"+str).val();
	if(vlu.length<min||vlu.length>max){
		return false;
	}else{
		return true;
	}
}

function display_eror(arr){
	var err = $("#span_01").text();
	if(arr.some(function(element){
		return element==err;
	})){
		$("#span_01").html('');
		$("#span_01").css("display","none");
		$("#img_error").css("display","none");
	}
	/**/
}
function show_eror(str){
	$("#span_01").text(str);
	$("#span_01").css("display","inline-block");
	$("#img_error").css("display","inline-block");
}
function isReg(obj,reg){
	var vlu = $("#"+obj).val();
	if(!reg.test(vlu)){
		return false;
	}else{
		return true;
	}
}
