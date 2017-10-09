/**
 * Created by Songdan on 2016/4/26.
 */
/**
 * 带有图片验证码的情况下发送手机短信
 */
function sendSMS(){
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
	var contractPhone1 = isEmputy("contractPhone");
	if(!contractPhone1){
		show_eror("手机号不能为空");
		return false;
	}
	var contractPhone2 = isReg("contractPhone",/^1[0-9]{10}$/);
	if(!contractPhone2){
		show_eror("手机号码格式不正确");
		return false;
	}
   
	var pCaptcha = $("#pCaptcha").val().trim();
	if(!isEmputy("pCaptcha") || !isReg("pCaptcha",/^[0-9]{1,6}$/)){
		show_eror("请输入正确的验证码");
		return;
	}
	var sjh = $("#contractPhone").val().trim();
	$http.post(basePath+"user/checkFindPwdInfo"+suffix,{
        contractPhone:$("#contractPhone").val().trim(),
        loginName:$("#loginName").val().trim()
    }, function (data) {
        if (data) {
        	var returnBody = $ptweb.getMsgCaptcha("send_btn", "230", sjh, pCaptcha,sendSMS);
        	if("500" == returnBody.code){
        		$("#pCaptcha").val("");
            	getCaptcha();
        		show_eror(returnBody.msg);
        	}else if("200" == returnBody.code){
        		display_eror(["验证码不匹配"]);
        	}
        }else{
        	show_eror("用户信息不匹配");
        	$("#pCaptcha").val("");
        	getCaptcha();
        }
    })
	
}

function getCaptcha(){
	$("#btn_getCaptcha").prop("src", basePath+"validate/captcha"+suffix+"?type=003&r="+Math.random());
}
function nextStep() {
    if(valid_find()) {
        $http.post(basePath+"user/pre_find_pwd"+suffix,{
            captcha:$("#captcha").val().trim(),
            contractPhone:$("#contractPhone").val().trim(),
            loginName:$("#loginName").val().trim()
        }, function (data) {
            if (data.code == 200) {
                window.location.href = basePath + "pages/index/resetPwd.shtml?k=" + data.data.item;
            }else if(data.code == 403){
            	show_eror("用户信息不匹配，请稍后再试");
            	$("#pCaptcha").val("");
            	getCaptcha();
            }else if(data.code == 500){
            	$("#pCaptcha").val("");
            	getCaptcha();
            	show_eror(data.msg);
            }else if(data.code == 501){
            	$("#pCaptcha").val("");
            	getCaptcha();
            	show_eror(data.msg);
            }
        })
    }

}
$(function () {
     
    $("#send_btn").on("click",sendSMS);
    $("#next_step_fp").on("click", nextStep);
    
    $("#loginName").blur(function(){
		if(!isEmputy("loginName")){
			show_eror("用户名不能为空");
			return;
		}
		if(!isLength("loginName",2,20)){
			show_eror("用户名长度应为2-20个字符");
			return;
		}
		display_eror(["用户名不能为空","登录名长度应为2-20个字符"]);
	});
	$("#contractPhone").blur(function(){
		if(!isEmputy("contractPhone")){
			show_eror("手机号不能为空");
			return;
		}
		if(!isReg("contractPhone",/^1[0-9]{10}$/)){
			show_eror("手机号码格式不正确");
			return;
		}
		display_eror(["手机号不能为空","手机号码格式不正确"]);
	});
	$("#captcha").blur(function(){
		if(!isEmputy("captcha")){
			show_eror("验证码不能为空");
			return;
		}
		if(!isReg("captcha",/^[0-9]{6}$/)){
			show_eror("验证码只能是数字");
			return;
		}
		display_eror(["验证码不能为空","验证码只能是数字"]);	
	});
})
function valid_find(){
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
	
	var contractPhone1 = isEmputy("contractPhone");
	if(!contractPhone1){
		show_eror("手机号不能为空");
		return false;
	}
	var contractPhone2 = isReg("contractPhone",/^1[0-9]{10}$/);
	if(!contractPhone2){
		show_eror("手机号码格式不正确");
		return false;
	}
	
	var captcha1 = isEmputy("captcha");
	if(!captcha1){
		show_eror("验证码不能为空");
		return false;
	}
	var captcha2 = isReg("captcha",/^[0-9]{1,6}$/);
	if(!captcha2){
		show_eror("验证码只能是数字");
		return false;
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