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
				$("body").append(input1);
				$("body").append(input2);
			}
		});

//	$("#li1").append('<img class="yzm1" id="btn_getCaptcha" src="'+basePath+"user/captcha"+suffix+"?type=001&r="+Math.random()+'" ></img>');
	$("#btn_getCaptcha").on("click", getCaptcha);
	$("#btn_login_gr").on("click", login_gr);
	getCaptcha();
	
	
	var validator1 = $("#loginForm").validate({
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
			$("#"+element.attr("name")+"_tip").text(error.text());
			$("#"+element.attr("name")+"_tip").parent().addClass("error");
		},
		rules:{
			loginName:{
				required: true,
				rangelength:[2,20],
				loginNameReg:true
				
			},
			passwd:{
		        required: true,
		        rangelength:[6,20],
		        passwdReg:true
		    },
		    pCaptcha:{
		        required: true,
		        rangelength:[1,4],
		    	pCaptchaReg:true
		    }
		},
		messages: {
			loginName:{
		        required: "用户名不能为空",
		        rangelength:"用户名不正确"
		    },
		    passwd:{
		        required: "密码不能为空",
		        rangelength:"密码格式不正确"
		    },
		    pCaptcha:{
		        required: "验证码不能为空",
		        rangelength:"验证码格式不正确"
		    }
		}
		
	});
	
});



$.validator.addMethod('loginNameReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5\w\s~!@%#$^*+='?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{2,20}$/.test(value);
     
},"用户名不正确");

$.validator.addMethod('passwdReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9[~`!@%#$^*+':;?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]+$/.test(value);
     
},"密码格式不正确");

$.validator.addMethod('pCaptchaReg', function(value, element) { 
	return this.optional(element) || /^[0-9]+$/.test(value);
	
},"验证码格式不正确");





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
	if ($("#loginForm").valid()) {
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
				loginName : $.trim($("#loginName").val()),
				password : value,
				pCaptcha : captcha,
				forceLogin: "NO"
			},
			dataType:"json",
			success:function(data){
				var code = data.code;
				if(code != 200){
					if(code == "460"){
						$("#pCaptcha_tip").text("验证码不正确");
						$("#pCaptcha_tip").parent().addClass("error");
						$("#pCaptcha").val("");
						getCaptcha();
						$("#passwd").val("");
					}else if(code == "470"){
						$("#loginName_tip").text("登录信息不匹配");
						$("#loginName_tip").parent().addClass("error");
						$("#pCaptcha").val("");
						getCaptcha();
						$("#passwd").val("");
					}else if(code == "480"){
						$("#loginName_tip").text("账号不存在");
						$("#loginName_tip").parent().addClass("error");
						$("#pCaptcha").val("");
						getCaptcha();
						$("#passwd").val("");
					}else if(code == "444"){
						layer.confirm(data.msg, {
							icon: 0, title:'提示',btn: ['确定','取消'] //按钮
						}, function(index){
							layer.close(index);
							$.ajax({
								type:"POST",
								url:basePath + "pages/account/login.shtml",
								data:{
									loginName : $.trim($("#loginName").val()),
									password : value,
									pCaptcha : captcha,
									forceLogin: "YES"
								},
								dataType:"json",
								success:function(data){
									window.location.href=basePath+"pages/manage/index.shtml";
								}
							});
						},function(index){
							layer.close(index);
//							$.ajax({
//								type:"POST",
//								url:basePath + "pages/account/login.shtml",
//								data:{
//									loginName : $.trim($("#loginName").val()),
//									password : value,
//									pCaptcha : captcha,
//									forceLogin: "FORCELOGIN_NO"
//								},
//								dataType:"json",
//								success:function(data){
//									window.location.href=basePath+"pages/account/login.shtml";
//								}
//							});
						});
					}
					if(code != "444"){
						$("#li1").css("display", "block");
						getCaptcha();
						$("#error_times").val(1);
					}
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

