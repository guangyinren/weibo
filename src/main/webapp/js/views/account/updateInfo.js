var enterpriseName_o
var taxpayerNum_o
var contactsPhone_o
var pt_o = 0
var city_o
var province_o
var paperTicketed_o

$(function(){
	  var select_new =AreaSelect.init({
          eleId:"select_new",
          provinceId:"provinceId",
          cityId:"cityId"
      })
	  $http.post(basePath+"user/enterprise_info"+suffix,"",function(data) {
		  if("200"==data.code){
			  var item = data.data.item.enterpriseRegInfo;
			  var area = data.data.item.area;
			  var user = data.data.user;
              $("#enterpriseName").val(item.enterpriseName);
              $("#taxpayerNum").val(item.taxpayerNum);
              if(user.reviewStatus == 'REVIEW_YES'){
              	$("#taxpayerNum").attr("readonly","readonly");
              }
              $("#legalRepresentativeName").val(item.legalRepresentativeName);
              $("#contactsName").val(item.contactsName);
              $("#contactsEmail").val(item.contactsEmail);
              $("#contactsPhone").val(item.contactsPhone);
              $("#invitation_id").val(item.invitationId);
//              if(item.paperTicketed =="YES"){
////              	$("#radio_y").addClass("li_span");
//              	$("input[name='paperTicketed']").get(0).checked=true;
//				}else{
//					$("input[name='paperTicketed']").get(1).checked=true;
//				}
              select_new.select(item.provinceId,item.cityId);
              city_o = item.cityId;
              province_o = item.provinceId;
              $("#enterpriseAddress").val(item.enterpriseAddress);
				$("#yhxm").text(item.hyxm);
			}
		  enterpriseName_o = item.enterpriseName;
		  taxpayerNum_o = item.taxpayerNum;
		  contactsPhone_o = item.contactsPhone;
		  paperTicketed_o=item.paperTicketed;
	     });		  
	
	//上传图片
//	function uploadPic(){
//		 $.ajaxFileUpload
//		 (
//               {
//                   url: basePath+"user/upload_img"+suffix, //用于文件上传的服务器端请求地址
//                   secureuri: false, //是否需要安全协议，一般设置为false
//                   fileElementId: 'file1', //文件上传域的ID
//                   dataType: 'json', //返回值类型 一般设置为json
//                   type:"POST",
//                   success: function (data){
//                	   var code = data.data.code;
//                	   if(code == "200"){
//                		   layer.alert('图片上传成功！');
//                		   $("#img_re").attr("src", data.data.imgUrl);
//                	   }else{
//                		   layer.alert('图片上传失败！', {
//      						  skin: 'llayui-layer-lan' //样式类名
//      						  ,closeBtn: 0});
//                	   }
//                   },
//                   error: function (data, status, e){
//                      console.info(e);
//                   }
//               }
//           )
//           return false;
//	}
	var validator1 = $("#info_update").validate({
		//光标离开时校验
		onfocusout:function(element){
			$(element).valid();
		},
		//获取到焦点时去除错误提示信息
		onfocusin:function(element){
			//console.info(this.settings.focusCleanup); //如果0000000000000为true,则删除错误提示信息
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
			taxpayerNum:{
				required: true,
				rangelength:[15,20],
				taxpayerNumReg:true,
			},
			enterpriseName:{
		        required: true,
		        enterpriseNameLengthReg:true,
		        enterpriseNameReg:true
		    },
		    legalRepresentativeName:{
		        required: true,
		        rangelength:[2,50],
		        legalRepresentativeNameReg:true
		    },
		    contactsName:{
		    	required: true,
		        rangelength:[2,8],
		        contactsNameReg:true
		    },
		    contactsEmail:{
		    	required: true,
		    	rangelength:[4,50],
				customEmailReg:true
		    },
		    contactsPhone:{
		    	required: true,
				phoneReg:true,
		    },
		    mobileCaptcha:{
		    	required: true,
		        mobile_captchaReg:true,
		        rangelength:[6,6],
		    },
		    enterpriseAddress:{
		    	required: true,
		        maxlength:50,
		        enterpriseAddressReg:true,
		        enterpriseAddressAllReg:true
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
		        rangelength:"法人名称应为2-50个字符",
		    },
		    contactsName:{
		    	required: "联系人姓名不能为空",
		        rangelength:"联系人姓名应为2-8个字符",
		    },
		    contactsPhone:{
		    	required: "手机号不能为空"
		        //remote: "该手机号已被使用"
		    },
		    contactsEmail:{
		    	required: "邮箱不能为空",
		    	rangelength:"邮箱应最大为50个字符",
		        email: "邮箱格式不正确"
		    },
		    paperTicketed:{
		    	required: ""
		    },
		    mobileCaptcha:{
		    	 required: "短信验证码不能为空",
			     rangelength:"短信验证码长度为6"
		    },
		    enterpriseAddress:{
		    	required: "详细地址不能为空",
		    	maxlength:"详细地址最大应为50个字符",
		    }
		}
	});
	
	$("#send_btn").on("click", sendSMS);
	$("#btn_submit_3").on("click", returnInfo);
	$("#a_goback").on("click", returnInfo);
	
});
//自定义checkbox验证
$.validator.addMethod('atLeastOneChecked', function(value, element) { 
    var checkedCount = 0; 
      $("input[name^='protocol']").each(function() {  
       if ($(this).attr('checked')) { checkedCount++; }  
       }); 
      return checkedCount>0; 
     
},"请选择至少一项");

$.validator.addMethod('taxpayerNumReg', function(value, element) { 
	return this.optional(element) || /^[A-Z0-9]+$/.test(value);
     
},"只能包括大写英文字母或数字");


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

$.validator.addMethod('pwdReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9~!@#\$%\^_\+\?{}\\\[\]]+$/.test(value);
     
},"只能包括英文字母或数字及~!@#$%^_+[]{}\?等字符组合");

$.validator.addMethod('invitationIdReg', function(value, element) { 
	return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
	
},"只能包括英文字母或数字");
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
	
},"企业省市地址加上详细地址不能大于40个字符");
$.validator.addMethod('mobile_captchaReg', function(value, element) { 
	return this.optional(element) || /^[0-9]+$/.test(value);
	
},"只能数字");
$.validator.addMethod('customEmailReg', function(value, element) { 
	return this.optional(element) || /^([.a-zA-Z0-9_-])+@[a-zA-Z0-9_-]{1,}\.[a-zA-Z0-9_-]{1,}$/.test(value);
	
},"邮箱格式不正确");
$.validator.addMethod('phoneReg', function(value, element) { 
	return this.optional(element) || /^1[0-9]{10}/.test(value);
	
},"手机号码格式不正确");

function changeSelect(){
	var provinceId = $("#provinceId").val();
	if("" == provinceId){
		$("#provinces_tip").html("选择省市");
		return;
	}else{
		$("#provinces_tip").html("");
	}
}

//个人用户注册
function update_gr(){
	if("" == provinceId){
		$("#provinces_tip").html("选择省市");
		return;
	}else{
		$("#provinces_tip").html("");
	}
	if($("#info_update").valid()){ //表单校验通过
		var index = layer.load(2,{shade: [0.5,'#000']});
		var taxpayerNum = $.trim($("#taxpayerNum").val());
		var enterpriseName = $.trim($("#enterpriseName").val());
		var contactsPhone = $.trim($("#contactsPhone").val());
		var provinceId = $("#provinceId").val();
		var cityId = $("#cityId").val();
//		var paperTicketed = $("input[name='paperTicketed']:checked").val().trim();
		$http.post(basePath+"user/info_update"+suffix,
				{
					taxpayerNum:taxpayerNum,
					enterpriseName:enterpriseName,
					legalRepresentativeName:$.trim($("#legalRepresentativeName").val()),
					contactsName:$.trim($("#contactsName").val()),
					contactsEmail:$.trim($("#contactsEmail").val()),
					contactsPhone:contactsPhone,
//					paperTicketed:$("input[name='paperTicketed']:checked").val().trim(),
					paperTicketed:"NO",
					provinceId:provinceId,
					cityId:cityId,
					enterpriseAddress:$("#enterpriseAddress").val(),
					captcha:$.trim($("#mobile_captcha").val()),
					type:"210"
				},
				function(data) {
					console.info(data);
					if(data.code=="200"||data.code=="201"){
						layer.close(index);
						if(taxpayerNum==taxpayerNum_o&&enterpriseName==enterpriseName_o&&contactsPhone==contactsPhone_o&&pt_o == 0&&province_o==provinceId&&city_o==cityId){
//							if(taxpayerNum==taxpayerNum_o&&enterpriseName==enterpriseName_o&&contactsPhone==contactsPhone_o&&pt_o == 0&&province_o==provinceId&&city_o==cityId&&paperTicketed_o==paperTicketed){
//							layer.alert("修改信息提交成功",function(){
// 								window.top.location.href=basePath+"pages/manage/index.shtml";
// 							});
							layer.alert('修改信息提交成功', {
								icon: 1,title:["",true],skin:"newLayer"
							}, function() {
								window.top.location.href=basePath+"pages/manage/index.shtml";
							});
						}else{
//							layer.alert("修改信息提交成功，系统管理人员将会在两个工作日内为您审核，并可能会与您电话沟通，请保持电话通畅。感谢您的支持",function(){
//								window.top.location.href=basePath+"pages/manage/index.shtml";
//							});
							layer.alert('修改信息提交成功，系统管理人员将会在两个工作日内为您审核，并可能会与您电话沟通，请保持电话通畅。感谢您的支持', {
								icon: 1,title:["",true],skin:"newLayer"
							}, function() {
								window.top.location.href=basePath+"pages/manage/index.shtml";
							});
						}
						
					}else{
						layer.close(index);
						layer.alert(data.msg);
					}
		});
	}
}

function sendSMS(){
	var sjh = $.trim($("#contactsPhone").val());
	if ($("#contactsPhone").valid()) {
		var returnBody = $ptweb.getMsgCaptchaNew("send_btn", "220", sjh, sendSMS);
		if("500" == returnBody.code){
			layer.tips(returnBody.msg,"#mobile_captcha",{tips:[1,'red']});
		}else if("200" == returnBody.code){
		}else if("501" == returnBody.code){
			layer.tips(returnBody.msg,"#mobile_captcha",{tips:[1,'red']});
		}
	}
}
function returnInfo(){
	window.location.href="/pages/account/accountInfo.shtml";
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
				pt_o = 1;
				$("#img_num").val(1);
	            $("#img_re").css("display","block");
	            $("#div_up").css("display","none");
			}else{
				layer.tips(data.msg, "#pic1",{
					tips:[2,'red']
				});
				$("#update_btn").show();
				console.info(data.msg);
			}
			
           
            //$("#img_re").attr("src","/use");
		},
		error : function(data) {
			var msg = data.data;
			layer.tips("图片错误", "#pic1",{
                tips:[2,'green']
            });
		}
	})
	return false;
}
//上传图片
function uploadPic_() {
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
				pt_o = 1;
				$("#img_num").val(1);
				$("#img_re").css("display","block");
				$("#div_up").css("display","none");
			}else{
				layer.tips(data.msg, "#pic1",{
					tips:[2,'red']
				});
				console.info(data.msg);
			}
			
			
			//$("#img_re").attr("src","/use");
		},
		error : function(data) {
			var msg = data.data;
			layer.tips("图片错误", "#pic1",{
				tips:[2,'green']
			});
		}
	})
	return false;
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

