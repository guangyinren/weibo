var id = "";
$(function(){
	//通过浏览器url获取商品id
	 id = $Utils.getUrlParameters().id;
	 //查询商品信息
	 $.ajax({
			type:"GET",
			url:basePath+"invoiceItem/queryInvoiceItemById"+suffix,
			data:{
				id:id
			},
			success:function(data){
				var item = data.data.data;
				 $("#itemName").val(item.itemName); 
				 $("#taxClassificationCode").val(item.taxClassificationCode);
				 if(item.isDiscount == false || item.isDiscount == "false"){
					 $("#discounted").val("0");
				 }else if(item.isDiscount == true || item.isDiscount == "true"){
					 $("#discounted").val("1");
				 }
		 //初始化优惠政策类型
		 $.ajax({
				type:"GET",
				url:basePath+"manage/tax_category/findCategoryByMergeCode"+suffix,
				data:{
					mergeCoding:item.taxClassificationCode
				},
				success:function(data){
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
		            	 $("#discounted",parent.document).val("0");
	                  }else{
	                	 $("#discounted",parent.document).val("1"); 
	                  }
		           var select = document.getElementById('discounted');
	               select.onchange = function(){
		       		     if($("#discounted",parent.document).val()!="0"){
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
										 $("#taxRate").val(item.taxRateId);
									 }
								  }
							}
						})
					}
				}
			}
		}) 
		 $("#discountedPolicyType").val(item.discountedPolicyType);
		 $("#taxRate").val(item.taxRateId);
		}
     })
});

$.validator.setDefaults({
    success: "valid"
});
var validator = $("#itemNameForm").validate({
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


$("#itemName").rules("add",{
	 required:true,
	 productNameVli:true,
	  messages:{
	  required:"商品名称不能为空",
	  productNameVli:"为字母数字中文及~`!@#$%^*()-_+=[]\;',./?:{}|~·！@#￥%……*（）——+{}|：“《》？【】、；‘，。/字符组合,长度为1-100个字符"
	}
})

$("#taxRate").rules("add",{
  required:true,
  messages:{
	  required:"税率不能为空"
  }
})

$("#taxClassificationCode").rules("add",{
   required:true,
     messages:{
      required:"税收分类编码不能为空"
    }
})

jQuery.validator.addMethod("productNameVli", function(value, element) { 
	//数字、字母组合
	var pas =/^\s*[\u4e00-\u9fa5\w\s~!@%#$^*+='?\-\\/(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{1,100}\s*$/;
	return pas.test(value); 
}, "请输入字母数字中文及~`!@#$%^*()-_+=[]\;',./?:{}|~·！@#￥%……*（）——+{}|：“《》？【】、；‘，。/字符组合");

function openSSFL(){
	$("#taxClassificationCode").rules("remove");
	  layer.open({
	    type: 2,
	    title: "税收分类编码",
		area: ['80%', '80%'], //宽高
		offset: ['10px', '100px'],
		shadeClose : true,
		shade: [0.8, '#393D49'],
	    content:  'choiceTaxCategory.shtml',
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

//修改
function invoiceItemEdit(){
	if($("#itemNameForm").valid()){
		   $("#save").attr("disabled","disabled");
		   var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
		    $.ajax({
				url:basePath+"/invoiceItem/updateInvoiceItem"+suffix,
				data:{
					id : id,
					itemName:$.trim($("#itemName").val()),
					taxRateId:$.trim($("#taxRate").val()),
					taxClassificationCode:$.trim($("#taxClassificationCode").val()),
			    	isDiscount:$.trim($("#discounted").val()),
			    	discountPolicyType:$.trim($("#discountedPolicyType").val())
				},
				type:"post",
				success:function(data){
					 layer.close(index);
	          	     $("#save").removeAttr('disabled');
	          	     if(data.code==200){
	          	    	 
			    		 layer.alert(data.msg, {icon:1,title:"提示",skin:"newLayer"},function(index){
							 window.location.href = "/pages/manage/invoiceItem/invoiceItemQuery.shtml"; 
							 
			    		 });
			    	 }else if(data.code==403){
			    		 layer.alert(data.msg, {
			 				icon: 2,title:["",true],skin:"newLayer"
			 			}, function() {
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