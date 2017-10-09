/**
 * Created by Songdan on 2016/4/26.
 */
$(function () {
	
	var jsPublicKey = 0;
	
	$.ajax({
			type:"POST",
			url:basePath+"util/security",
			dataType:"text",
			success:function(data){
				jsPublicKey = data;
			}
		});
	
	
    function doRSAEncrypt(key,input){
        if(key == '') return input;

        var rsa = new RSAKey();
        rsa.setPublic(key, "10001");
        var res = rsa.encrypt(input);

        if(res == null) return input;
        return res;
    }
    
    
    
    var validatorPwd = $("#reset_pwd").validate({
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
		    }
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
		}
		
	});
    
    function resetPwd() {
        if ($("#reset_pwd").valid()) {
            $http.post(basePath+"user/reset_pwd"+suffix,{
                key:getUrlParameters().k,
                loginPassword:doRSAEncrypt(jsPublicKey,getElementValueById("password1"))
            },function(data) {
                if (data.code == 200) {
                    $mask.show("密码修改成功");
                    setTimeout(function() {
                    	/*window.location.href=basePath+"pages/index/successful1.shtml";*/
                    	layer.alert('密码修改成功', {icon:1,title:["",true],skin: 'newLayer'}, function(){
    						layer.closeAll();
    						window.location.href = basePath + "/pages/index/index.shtml";
    					});
                    },1000)
                }else{
                    $mask.show(data.msg);
                }
            })
        }
    }

    
    $("#sub_btn_rp").on("click", resetPwd);
    
})

$.validator.addMethod('pwdReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9~!@#\$%\^_\+\?{}\\\[\]]+$/.test(value);
     
},"只能包括英文字母或数字及~!@#$%^_+[]{}\?等字符组合");
