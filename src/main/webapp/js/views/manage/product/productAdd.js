$(function(){
	$("#discounted").change(function(){
		if($("#discounted").val()=="N"){
			$("#discountedPolicyType").append("<option value=''></option>");
			$("#discountedPolicyType").val("");
			$("#discountedPolicyType").attr("disabled",true);
		}else{
			 $("#discountedPolicyType option[value='']").remove();
			 $("#discountedPolicyType").attr("disabled",false);
		}
	});
	
	//判断用户是否进行了开票设置
	$.ajax({
		type:"GET",
		url:basePath+"manage/invoice/setting/getTaxRate"+suffix,
		dataType:"json",
		success:function(data){
			if(data.code==200){
				if(data.data.data=="false"){
					layer.confirm("请先进行开票设置", {
						title:'提示', closeBtn: false,btn: ['确定'] //按钮
					}, function(){
						window.parent.addTab('开票设置','/pages/manage/invoicesettings/invoiceSettings.shtml','icon-s7');	
						window.parent.closeCurrTab('商品管理');	
					});
				}
			}
		}
	})
	
	//查询税率列表
	$.ajax({
		type:"GET",
		url:basePath+"/manage/product/selectInvoiceSetting"+suffix,
		success:function(data){
			if(data.code==200){
				var invoiceSetting= data.data;
				var taxRateIdString = "";
				var taxRateIdList;
				var taxpayerTypeId;
				if(invoiceSetting!=null){
					taxRateIdString = invoiceSetting.taxRateId;
					taxpayerTypeId = invoiceSetting.taxpayerTypeId;
					if(taxRateIdString!=null&&taxRateIdString!=""){
						taxRateIdList=taxRateIdString.split("|");
					}
					$.ajax({
						type:"GET",
						url:basePath+"/manage/taxrate/getTypeRate"+suffix,
						success:function(data){
							if(data.code==200){
								 if(data.data.list.length>0){
									 if(taxpayerTypeId==data.data.list[0].taxpayerTypeId){
										//小规模纳税人
										var raxRates = data.data.list[0].taxRates;
										var selectObj=document.getElementById("taxRate");
										if(selectObj!=null){
											selectObj.options.length = 0;
										     for(var i=0;i<raxRates.length;i++){
										    	 for(var j=0;j<taxRateIdList.length;j++){
										    		 if(raxRates[i].taxRateId==taxRateIdList[j]){
										    			 selectObj.options.add(new Option(raxRates[i].frontName,raxRates[i].taxRateId));
										    		 }
										    	 }
					    		             }   	
										}
									 }
									 else{
										 //一般纳税人
										 var raxRates = data.data.list[1].taxRates;
										 var selectObj=document.getElementById("taxRate");
										 if(selectObj!=null){
											 selectObj.options.length = 0; 
				 						     for(var i=0;i<raxRates.length;i++){
				 						    	 for(var j=0;j<taxRateIdList.length;j++){
										    		 if(raxRates[i].taxRateId==taxRateIdList[j]){
										    			 selectObj.options.add(new Option(raxRates[i].frontName,raxRates[i].taxRateId)); 
										    		 }
				 						    	 }
				  	    		           } 
										 } 
									 }
								 }
								  
							  }
						}
					})
				}
			}
		}
	})
	
})

   $.validator.setDefaults({
      success: "valid"
   });

   var validator = $("#productMessage").validate({
    onfocusout : function(element) {
      $(element).valid();
    },
    onfocusin : function(element) {
      if (this.settings.focusCleanup) {
//	        $("#" + $(element).attr("id") + "_tip").text("");
      }
    },
    focusCleanup : true,
    onkeyup : false,
    highlight : function(element, errorClass) {
      /*$(element).fadeOut(function() {
        $(element).fadeIn();
      });*/
    },
    errorPlacement : function(error, element) {
      if(error.text() != "" && error.text() != null){
    	layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
	      }
	    }
   }); 
	 
$("#enterpriseCommodityCode").rules("add",{
	 required:true,
	 enterpriseCommodityCodeVali:true,
	 remote: { //ajax调用后台查看商品编号是否可用
     	url:basePath+"manage/product/CommodityCode"+suffix,
     	type:"get"
     },
	 messages:{
		  required:"企业商品编号不能为空",
		  enterpriseCommodityCodeVali:"请输入10位之内的数字字母组合",
		  remote: "该企业商品编号已存在"
	 }
})

$("#taxClassificationCode").rules("add",{
	 required:true,
	 messages:{
       required:"税收分类编码不能为空"
	 }
})

$("#productName").rules("add",{
	 required:true,
	 goodsNameVali:true,
	 messages:{
       required:goodsNameNotEmptyErrMsg,
       goodsNameVali:goodsNameRegexErrMsg
	 }
})

$("#specificationModel").rules("add",{
	required:false,
	specificationModelVali:true,
	messages:{
		required:specModelNotEmptyErrMsg,
		specificationModelVali:specModelRegexErrMsg
	}
})

$("#meteringUnit").rules("add",{
	 required:false,
	 unitVali:true,
	 messages:{
		required:unitNotEmptyErrMsg,
		unitVali:unitRegexErrMsg
	}
})

$("#price").rules("add",{
	 required:false,
	 priceVali:true,
	 messages:{
		 required:priceNotEmptyErrMsg,
		 priceVali:priceRegexErrMsg
	}
})

$("#taxRate").rules("add",{
	 required:true,
	 messages:{
	  required:taxRateNotEmptyErrMsg
	}
})
 
//自定义企业商品编号验证规则
jQuery.validator.addMethod("enterpriseCommodityCodeVali", function(value, element) { 
	//数字、字母组合
	var length = value.length;
	if(length > 0){
		return selfDefineCodeRegex.test(value);
	}else{
		return true;
	}
}, "请输入数值、字母组合,长度为1-10个字符");

//自定义单价验证规则
jQuery.validator.addMethod("priceVali", function(value, element) {
	var length = value.length;
	if(length > 0){
		if(parseFloat(value) == parseFloat(0)){
			return false;
		}else{
			if(!isNaN(value)){
				if(eightDecRegex.test(value)){
					if (parseInt(value)==value){
						value = parseInt(value);
						$("#price").val($Utils.checkInt(value));
					}else{
						value = parseFloat(value);
						$("#price").val($Utils.checkInt(value));
					}
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}
	}else{
		return true;
	}
}, "请填写正确格式的数字");

function openSSFL(){
	$("#taxClassificationCode").rules("remove");
    layer.open({
	    type: 2,
	    title: "税收分类编码",
		area: ['80%', '90%'], //宽高
		offset: ['10px', '100px'],
		shadeClose : true,
		scrollbar:true,
		shade: [0.8, '#393D49'],
	    //content:  ['choiceTaxCategory.shtml','no']//注意，如果str是object，那么需要字符拼接。
		content:'choiceTaxCategory.shtml',
		end:function(){
			$("#taxClassificationCode").rules("add",{
				 required:true,
				 messages:{
			       required:"税收分类编码不能为空"
				 }
			})
		}
    });
}

//保存商品
function saveProduct(){
	if($("#productMessage").valid()){
		 $("#save").attr("disabled","disabled");
		 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
		 $.ajax({
				url:basePath+"/manage/product/saveProduct"+suffix,
				data:JSON.stringify({
							taxBureauCommodityCode:$("#taxClassificationCode").val(),
							enterpriseCommodityCode: $("#enterpriseCommodityCode").val(),
							productName:$("#productName").val(),
							specificationModel: $("#specificationModel").val(),
				    		meteringUnit: $("#meteringUnit").val(),
				    		taxPriceMarked:$("#taxPriceMarked").val(),
				    		taxRate:$("#taxRate").val(),
				    		price:$("#price").val(),
				    		taxClassificationCode: $("#taxClassificationCode").val(),
				    		discounted:$("#discounted").val(),
							discountedPolicyType:$("#discountedPolicyType")[0].value
				}),
				type:"post",
				contentType:"application/json;charset=UTF-8",
				success:function(data){
					 layer.close(index);
	          	     $("#save").removeAttr('disabled');
	          	     if(data.code==200){
			    		 layer.alert(data.msg, {icon:1,title:"提示",skin:"newLayer"},function(index){
							 window.location.href = "/pages/manage/product/product.shtml"; 
			    		 });
			    	 }else if(data.code == 403){
			    		 layer.tips(data.msg,"#enterpriseCommodityCode",{tips:[1,'red']});
			    	 }else{
			    		 layer.alert(data.msg, {icon: 2,title:"提示",skin:"newLayer"},function(index){
			    			 layer.closeAll();
			    		 });
			    	 }
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					layer.alert('系统繁忙,请稍候再试',{icon:2}, function(){
		        		layer.closeAll();
		        		$("#save").removeAttr('disabled');
					});  
			    }
			})
	 }
}

