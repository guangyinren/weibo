$(function(){
	$("#discounted").change(function(){
		if($("#discounted").val()=="0"){
			$("#discountedPolicyType").append("<option value=''></option>");
			$("#discountedPolicyType").val("");
			$("#discountedPolicyType").attr("disabled",true);
		}else{
			$("#discountedPolicyType option[value='']").remove();
			$("#discountedPolicyType").attr("disabled",false);
		}
	});
	$.ajax({
		type:"GET",
		url:basePath+"manage/invoice/setting/getTaxRate"+suffix,
		dataType:"json",
		success:function(data){
			if(data.code == 200){
				if(data.data.data == "false"){
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
		url:basePath+"manage/taxrate/getTaxRatesByRegInfoId"+suffix,
		dataType:"json",
		success:function(data){
			if(data.code==200){
				var rows = data.data.data;
				if(rows.length > 0){
					var selectObj=document.getElementById("taxRate");
					for(var i=0;i<rows.length;i++){
						selectObj.options.add(new Option(rows[i].frontName,rows[i].taxRateId));
		             }  
				}else{
					$("#failMsg").text("请先进行开票设置");
					var dakai = layer.open({
						  title : false,
						  type: 1, 
						  closeBtn: 0, //不显示关闭按钮
						  shadeClose: true, //开启遮罩关闭
						  content: $("#failModal")
					});
					window.parent.addTab('开票设置','/pages/manage/invoicesettings/invoiceSettings.shtml','icon-s7');	
					window.parent.closeCurrTab('电子发票开具');
				}
			}
		}
	})
	/*$.ajax({
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
	})*/
})

$.validator.setDefaults({
    success: "valid"
});

var validator = $("#itemNameForm").validate({
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

//保存
function invoiceItemSave(){
	if($("#itemNameForm").valid()){
		 $("#save").attr("disabled","disabled");
		 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
		 $.ajax({
				url:basePath+"/invoiceItem/saveInvoiceItem"+suffix,
				data:{
					itemName:$.trim($("#itemName").val()),
					taxRateId:$.trim($("#taxRate").val()),
					taxClassificationCode: $.trim($("#taxClassificationCode").val()),
			    	isDiscount:$.trim($("#discounted").val()),
			    	discountPolicyType:$.trim($("#discountedPolicyType").val())
				},
				type:"post",
				success:function(data){
					 layer.close(index);
	          	     $("#save").removeAttr('disabled');
	          	     if(data.code==200){
	          	    	/*if($('#main',parent.document).tabs('exists','生成开票二维码')){
			    			 $('#main',parent.document).tabs('refresh','生成开票二维码');
			    		 }*/
			    		 layer.alert(data.msg, {icon:1,title:"提示",skin:"newLayer"},function(index){
							 window.location.href = "/pages/manage/invoiceItem/invoiceItemQuery.shtml";
			    		 });
			    	 }else if(data.code==403){
			    		 layer.alert(data.msg, {
			 				icon: 2,title:"提示",skin:"newLayer"
			 			}, function() {
			 				layer.closeAll();
			 			});
			    	 }
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					layer.alert('系统繁忙,请稍候再试',{icon:2, title:"提示",}, function(){
		        		layer.closeAll();
		        		$("#save").removeAttr('disabled');
					});  
			    }
			})
	 }
}
