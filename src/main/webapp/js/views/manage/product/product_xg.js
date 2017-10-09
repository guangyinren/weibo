//通过浏览器url获取商品id
var enterpriseProductId = $Utils.getUrlParameters().enterpriseProductId;
$(function(){
	//查询商品信息
		$.ajax({
			type:"GET",
			url:basePath+"/manage/product/findEnterpriseProductById"+suffix,
			data:{
				enterpriseProductId:enterpriseProductId
			},
			success:function(data){
				var item = data.data.data;
				 $("#taxClassificationCode").val(item.taxClassificationCode);
				 $("#taxClassificationName").val(item.taxClassificationName);
				 $("#productName").val(item.productName); 
				 $("#enterpriseCommodityCode").val(item.enterpriseCommodityCode);
				 $("#discounted").val(item.discounted);
				 $("#discountedPolicyType").val(item.discountedPolicyType);
				 $("#specificationModel").val(item.specificationModel);
				 $("#meteringUnit").val(item.meteringUnit);
				 if (parseInt(item.price)==item.price){
					value = parseInt(item.price);
					$("#price").val($Utils.checkInt(item.price));
				 }else{
					value = parseFloat(item.price);
					$("#price").val($Utils.checkInt(item.price));
				 }
				 $("#taxPriceMarked").val(item.taxPriceMarked);
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
													 $("#taxRate").val(item.taxRate);
												 }
											  }
										}
									})
								}
							}
						}
					})
				 
				 $.ajax({
						type:"GET",
						url:basePath+"/manage/tax_category/findCategoryByMergeCode"+suffix,
						data:{
							mergeCoding:item.taxClassificationCode
						},
						success:function(data){
							if(data.code==200){
								if(data.data.item != null){
									 var addedTaxSpecialString = data.data.item.addedTaxSpecial;
						             var addedTaxSpecialList= new Array(); //定义一数组 
						             if(addedTaxSpecialString!=undefined){
						            	 addedTaxSpecialList=addedTaxSpecialString.split(/,|，|、/); //字符分割  
						             }
						             var selectObj=document.getElementById("discountedPolicyType");
						             if(addedTaxSpecialList.length>0){
						            	 for(var i=0;i<addedTaxSpecialList.length;i++){
						 	            	selectObj.options.add(new Option(addedTaxSpecialList[i],addedTaxSpecialList[i]));
						 	             } 
						             }
						             if(addedTaxSpecialList.length==0){
					            	   $("#discounted",parent.document).val("N");
					                  }else{
					            	  $("#discounted",parent.document).val("Y"); 
					               }
						           var select = document.getElementById('discounted');
					               select.onchange = function(){
						       		     if($("#discounted",parent.document).val()!="N"){
						       		    	selectObj.options.length = 0; 
						       		    	for(var i=0;i<addedTaxSpecialList.length;i++){
						       		    		selectObj.options.add(new Option(addedTaxSpecialList[i],addedTaxSpecialList[i]));
						       		    	}
						       		     }else{
						       		    	 $("#discountedPolicyType",parent.document).val("");
						       		    	 selectObj.options.length = 0;
						       		     }
						              } 
								 }
							}
						}
					})
			}
   })
});

$.validator.setDefaults({
    success: "valid"
});

var validator = $("#productMessage").validate({
  onfocusout : function(element) {
    $(element).valid();
  },
  onfocusin : function(element) {
    if (this.settings.focusCleanup) {
//      $("#" + $(element).attr("id") + "_tip").text("");
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
  },
}); 

$("#taxClassificationCode").rules("add",{
	 required:true,
	 messages:{
      required:"税收分类编码不能为空"
	 }
})

$("#enterpriseCommodityCode").rules("add",{
	 required:true,
	 enterpriseCommodityCodeVali:true,
	 remote:{
		url:basePath+"manage/product/CommodityCodeAndId"+suffix+"?enterpriseProductId="+enterpriseProductId+"&",
     	type:"get"
	 },
	 messages:{
		required:"企业商品编号不能为空",
		enterpriseCommodityCodeVali:"请输入10位之内的数字字母组合",
		remote:"该企业商品编号已存在"
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
		shade: [0.8, '#393D49'],
	    content:  'choiceTaxCategory.shtml',//注意，如果str是object，那么需要字符拼接。
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

//修改商品
function modifyProduct(){
	if($("#productMessage").valid()){
		  $("#save").attr("disabled","disabled");
			 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
		     $.ajax({
		 		url:basePath+"/manage/product/update"+suffix,
		 		data:JSON.stringify({
		 				enterpriseProductId :enterpriseProductId,
		 				taxClassificationCode: $("#taxClassificationCode").val(),
			    		enterpriseCommodityCode: $("#enterpriseCommodityCode").val(),
			    		productName:$("#productName").val(),
			    		discounted:$("#discounted").val(),
			    		discountedPolicyType:$("#discountedPolicyType").val(),
			    		specificationModel: $("#specificationModel").val(),
			    		meteringUnit: $("#meteringUnit").val(),
			    		price:$("#price").val(),
			    		taxPriceMarked:$("#taxPriceMarked").val(),
			    		taxRate:$("#taxRate").val()
		 		}),
		 		type:"POST",
		 		contentType:"application/json;charset=UTF-8",
		 		success:function(data){
		 			layer.close(index);
	        	    $("#save").removeAttr('disabled');
	        	    if(data.code==200){
			    		 layer.alert(data.msg, {icon: 1, title:'提示'},function(index){
			    			 window.location.href = "/pages/manage/product/product.shtml"; 
			    		 });
			    	 }else if(data.code==403){
			    		 layer.tips(data.data,"#enterpriseCommodityCode",{tips:[1,'red']});
			    	 }else{
			    		 layer.alert(data.msg, {icon: 2,closeBtn: 0},function(index){
			    			 layer.closeAll();
			    		 });
			    	 }
		 		}
		 	})
	  }
}