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

    function updatePwd() {
        if ($("#update_pwd").valid()) {
        	//提交后,禁用按钮
			$("#btn_01").attr("disabled","disabled"); 
			//var index = layer.load(2, {shade: [0.5,'#000']}); //0.5透明度的白色背景
            $http.post(basePath+"user/update_pwd"+suffix,{
                key:getUrlParameters().k,
                password1:$("#password1").val(),
                password2:$("#password2").val()
            },function(data) {
            	//layer.close(index);
            	$("#btn_01").removeAttr('disabled');
                if (data.code == 200) {
                    setTimeout(function() {
                    	window.location.href=basePath+"pages/manage/billingClerk/updateSuccess.shtml";
                    },1000)
                }else if(data.code == 500){
                	 $("#li_1").css("display","block");
                }
            })
        }
    }
    
    $("#btn_01").on("click",updatePwd);

    $("#update_pwd").validate({
        //光标离开时校验
        onfocusout:function(element){
            $(element).valid();
        },
        //获取到焦点时去除错误提示信息
        onfocusin:function(element){
            //console.info(this.settings.focusCleanup); //如果focusCleanup为true,则删除错误提示信息
            if(this.settings.focusCleanup){
                $("#"+$(element).attr("id")+"_tip").text("");
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
        	layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
        },
        rules:{
            password1:{
                required: true,
                
            },
            password2:{
                required:true,
                rangelength:[6,20],
                pwdReg:true,
            },
            password3:{
                required:true,
                equalTo:"#password2"
            }
        },
        messages: {
            password1:{
                required: "原始密码不能为空",
            },
            password2:{
                required:"新密码不能为空",
                rangelength:"密码长度应为6-20个字符"
            },
            password3:{
                required:"重复密码不能为空",
                equalTo:"两次密码不一致"
            }
        }
    });
    
   
})
 $.validator.addMethod('pwdReg', function(value, element) { 
    	return this.optional(element) || /^[a-zA-Z0-9~!@#\$%\^_\+\?{}\\\[\]]+$/.test(value);
         
    },"密码只能包括英文字母或数字等字符组合");
