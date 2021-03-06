//税率数组
var taxRateIdList;
var raxRates;
//票通宝在线分机号
var onlineStr = "";
//票通宝离线分机号
var offlineStr = "";
//票通宝在线,离线数量
var onlineNum=0, offlineNum=0;
//含税标志
var hsbz = 1;
//抬头类型标识，默认单位
var ttbz = 0;


//差额输入框
function addbalanceModalFun(){
	layer.closeAll();
	layer.open({
		 type:1,
		 title:'请输入扣除额',
		 area:'730px',
		 closeBtn: 1, //显示关闭按钮
		 shadeClose: true, //开启遮罩关闭
		 content: $("#differenceModal")
	});
}

$("#price_gap").click(function(){
	addbalanceModalFun()
})

function ptbzt(){
	onlineNum=0;
	offlineNum=0;
	//票通宝状态
	$.ajax({
		type:"GET",
		url:basePath + "invoice_query/ptbQuery" + suffix,
		dataType:"json",
		success:function(data){
            if ("200" == data.code) {
            	var rows = data.data;
            	var strs = [];
            	for (var i = 0; i <rows.item.length; i++) {
            			switch(rows.item[i].ptbStatus){
            				case "0":
            					onlineNum++;
            					onlineStr = onlineStr + rows.item[i].extensionNum + "、";
            					break;
            				case "1":
            					offlineNum++;
            					offlineStr = offlineStr + rows.item[i].extensionNum + "、";
            					break;
            			}
            	}
            	if(onlineStr){
            		onlineStr = onlineStr.substring(0,onlineStr.length-1);
            	}
            	if(offlineStr){
            		offlineStr = offlineStr.substring(0,offlineStr.length-1);
            	}
            	if((onlineNum + offlineNum) == 1){
            		if(onlineNum == 1) {
                		strs += '<img src="/images/ptb-on.png">';
                		strs += '<span id="onlineId" onmouseover="onlineFun()">在线</span>';
                	}
                	if(offlineNum == 1) {
                		strs += '<img src="/images/ptb-off.png" style="margin-left: 5px;">';
                		strs += '<span id="offlineId" onmouseover="offlineFun()">离线</span>';
                	}
            	}else{
            		if(onlineNum > 0) {
                		strs += '<img src="/images/ptb-on.png">';
                		strs += '<span id="onlineId" onmouseover="onlineFun()">' + onlineNum + '个在线</span>';
                	}
                	if(offlineNum > 0) {
                		strs += '<img src="/images/ptb-off.png" style="margin-left: 5px;">';
                		strs += '<span id="offlineId" onmouseover="offlineFun()">' + offlineNum + '个离线</span>';
                	}
            	}
                $("#ptbzt").html(strs);	
                //局部刷新票通宝状态 频率10分钟
                setTimeout("ptbzt()", 1000*60*10); 
            }
		}
	})
}

// 分机号查询
function reachExtensionNum(){
	$.ajax({
		url:basePath+"invoiceIssueOption/get"+suffix+"?invoiceType=10",
		data:{},
		type:"GET",
		success:function(result){
			if(result.code == 200){
				$(".extensionNum").css("display","inline-block")
				var fj_num = result.data.rows;
				if(fj_num.length == 1){
					if(fj_num[0].diskType == "SKP"){
						$("#extensionNum_sel").append("<option value='"+fj_num[i].extensionNum+"'>"+fj_num[i].extensionNum+"号税控盘，编号"+fj_num[i].machineCode+"</option>")
					}else if(fj_num[0].diskType == "JSP"){
						$("#extensionNum_sel").append("<option value='"+fj_num[i].extensionNum+"'>"+fj_num[i].extensionNum+"号金税盘，编号"+fj_num[i].machineCode+"</option>")
					}
				}else if(fj_num.length>1){
					for(var i=0;i<fj_num.length;i++){
						if(fj_num[i].diskType == "SKP"){
							$("#extensionNum_sel").append("<option value='"+fj_num[i].extensionNum+"'>"+fj_num[i].extensionNum+"号税控盘，编号"+fj_num[i].machineCode+"</option>")
						}else if(fj_num[i].diskType == "JSP"){
							$("#extensionNum_sel").append("<option value='"+fj_num[i].extensionNum+"'>"+fj_num[i].extensionNum+"号金税盘，编号"+fj_num[i].machineCode+"</option>")
						}
						
					}
				}else if(fj_num.length==0){
					$("#extensionNum_sel").append("<option value=''>"+"随机选择"+"</option>")
				}
			}
		}
	})
} 


//检查库存信息
function checkRepertory(){
	$.ajax({
		url:basePath+"manage/invoice/setting/getRepertorySet"+suffix,
		data:{},
		type:"get",
		success:function(data){
			if("200"==data.code){
				if(data.data.eleInvoiceCaution){
					layer.alert('您的电子发票库存数量已不足'+data.data.eleInvoiceCautionValue+'张',{icon:2,title:['',true],skin:'newLayer'}, function(){
		        		layer.closeAll();
					});
				}
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			layer.alert('系统繁忙,请稍候再试',{icon:2}, function(){
        		layer.closeAll();
			});  
	    }
	})
}


$(function(){
	/*$(".sel_plu_a").selectCss("","tag_select_s","tag_options_s");
	$(".sel_plu_b").selectCss("","tag_select_s1","tag_options_s1");*/
	//检查库存信息
	checkRepertory();
	//复核人取值
	getFhrVal();
	//票通宝状态
	ptbzt();
	//查询税率列表
	getTaxRates();
	//填充销售方信息
	fillSellerInfo();
	//分机号
	reachExtensionNum();
	$("input[name='ttlx']").change(function () {
		var checked = $("input[name='ttlx']:checked").attr('id');
		if (checked == 'ttlx-gr') {
			$("#gmfMc").autocomplete("disable");
			$("#gmfNsrsbh").rules("remove");
			$("#gmfNsrsbh").rules("add",{
				required:false,
				gmfNsrsbhVali:true,
				messages:{
					required:"",
					gmfNsrsbhVali:taxpayerNumRegexErrMsg
				}
			});
			ttbz == 1;
			$(".gmfNsrsbh-re").hide();
		} else {
			$("#gmfMc").autocomplete("enable");
			$("#gmfNsrsbh").rules("remove");
			$("#gmfNsrsbh").rules("add",{
				required:true,
				gmfNsrsbhVali:true,
				messages:{
					required:taxpayerNumNotEmptyErrMsg,
					gmfNsrsbhVali:taxpayerNumRegexErrMsg
				}
			});
			ttbz == 0;
			$(".gmfNsrsbh-re").show();
		}
	})
	$("#productName1").autocomplete({
        source: function( request, response ) {
            $.ajax( {
                url: basePath+"/manage/product/searchTaxCategoryByKeyWord"+suffix,
                dataType: "json",
                data: {
                	keyword: request.term,
                	pageIndex:0
                },
                success: function( data ) {
                  if(data.data.page){
                	  response( $.map(data.data.page, function(item) {
                          return {
                        	  goodsName:item.goodsName,
                        	  mergeCoding:item.mergeCoding,
                              value:item.goodsName,
                              label:item.goodsName + "," + item.mergeCoding,
                          }
                      }));
                  }
                }
            });
        },
        max:5,
        minLength:2,
        delay: 0,
        select: function(event,ui) {
            $("#productName1").val(ui.item.goodsName);
            $("#taxClassificationCode1").text(ui.item.mergeCoding);
        },
        focus: function(event,ui) {
            $("#productName1").val(ui.item.goodsName);
            $("#taxClassificationCode1").text(ui.item.mergeCoding);
        }
    })
    
    $("#gmfMc").autocomplete({
        source: function( request, response ) {
            $.ajax( {
                url: basePath+"/invoiceQuery/queryTaxNumber"+suffix,
                dataType: "json",
                data: {
                	keyword: request.term,
                	pageIndex:0
                },
                success: function( data ) {
                    if(data.data.data){
                    	response( $.map(data.data.data, function(item) {
                            return {
                          	    enterpriseName:item.enterpriseName,
                          	    taxpayerNum:item.taxpayerNum,
                                value:item.enterpriseName,
                                label:item.enterpriseName + "," + $Utils.handleUndefined(item.taxpayerNum),
                            }
                        }));
                    }
                }
            });
        },
        max:5,
        minLength:2,
        delay: 0,
        select: function(event,ui) {
        	$("#gmfMc").val(ui.item.enterpriseName);
            $("#gmfNsrsbh").val($Utils.handleUndefined(ui.item.taxpayerNum));
        },
        focus: function(event,ui) {
        	$("#gmfMc").val(ui.item.enterpriseName);
            $("#gmfNsrsbh").val($Utils.handleUndefined(ui.item.taxpayerNum));
        }
    })
})

var validator = $("#makeInvoiceTaxCatForm").validate({
		ignore:"",
		//光标离开时校验
        onfocusout:function(element){
            $(element).valid();
        },
        //获取到焦点时去除错误提示信息
        onfocusin:function(element){
            if(this.settings.focusCleanup){
//                $("#"+$(element).attr("id")+"_tip").text("");
            }
        },
        focusCleanup:true, //clear the error message when the error element get focus again.
        onkeyup:false,
        highlight: function(element, errorClass){
            /*$(element).fadeOut(function() {
                $(element).fadeIn();
            });*/
        },
        errorPlacement: function(error, element) {
            //element是form表单中出错的元素的jquery对象
           if(error.text() != "" && error.text() != null){
        	  // $("#"+element.attr("id")+"_tip").text(error.text());
        	   layer.tips(error.text(),"#" + element.attr("id"),{tips:[1,'red']});
    	   }
        }
	});

//纳税人识别号验证规则
$.validator.addMethod("gmfNsrsbhVali", function (value, element) {
	var length = value.length;
	if(length > 0){
		return taxpayerNumRegex.test(value);
	}else{
		return true;
	}
},taxpayerNumRegexErrMsg);

$("#gmfMc").rules("add",{
	required:true,
	gmfMcVali:true,
	messages:{
	  required:mcNotEmptyErrMsg,
	  gmfMcVali:mcRegexErrMsg
	}
})
$("#gmfNsrsbh").rules("add",{
	required:true,
	gmfNsrsbhVali:true,
	messages:{
		required:taxpayerNumNotEmptyErrMsg,
		gmfNsrsbhVali:taxpayerNumRegexErrMsg
	}
})
$("#gmfDzdh").rules("add",{
	required:false,
	gmfDzdhVali:true,
	messages:{
		required:"",
		gmfDzdhVali:addressRegexErrMsg
	}
})
$("#gmfdh").rules("add",{
	required:false,
	gmfdhVali:true,
	messages:{
		required:"",
		gmfdhVali:mobileRegexErrMsg
	}
})
$("#gmfKhh").rules("add",{
	required:false,
	khhVali:true,
	messages:{
		required:"",
		khhVali:bankNameRegexErrMsg
	}
})
$("#gmfYhzh").rules("add",{
	required:false,
	yhzhVali:true,
	messages:{
		required:"",
		yhzhVali:bankAccountRegexErrMsg
	}
})
$("#xsfDzdh").rules("add",{
	required:true,
	xsfDzdhVali:true,
	messages:{
		required:addressNotEmptyErrMsg,
		xsfDzdhVali:addressRegexErrMsg
	}
})
$("#xsfdh").rules("add",{
	required:true,
	xsfdhVali:true,
	messages:{
		required:mobileNotEmptyErrMsg,
		xsfdhVali:mobileRegexErrMsg
	}
})
$("#xsfKhh").rules("add",{
	required:false,
	khhVali:true,
	messages:{
		required:"",
		khhVali:bankNameRegexErrMsg
	}
})
$("#xsfYhzh").rules("add",{
	required:false,
	yhzhVali:true,
	messages:{
		required:"",
		yhzhVali:bankAccountRegexErrMsg
	}
})
$("#productName1").rules("add",{
	required:true,
	goodsNameVali:true,
	remote: { //ajax调用后台查看手机号是否可用
     	url:basePath+"manage/tax_category/validateGoodsName"+suffix,
     	type:"post",
     	data:{
     		taxClassificationCode:function(){return $("#taxClassificationCode1").text();},
     		taxClassificationName:function(){return $("#productName1").val();}
        } 
    },
	messages:{
	  required:goodsNameNotEmptyErrMsg,
	  goodsNameVali:goodsNameRegexErrMsg,
	  remote:"请输入税收分类名称或者参照选入商品信息"
	}
})
$("#specificationModel1").rules("add",{
	required:false,
	specificationModelVali:true,
	messages:{
	  required:"",
	  specificationModelVali:specModelRegexErrMsg
	}
})
$("#meteringUnit1").rules("add",{
	required:false,
	unitVali:true,
	messages:{
	  required:"",
	  unitVali:unitRegexErrMsg
	}
})
$("#quantity1").rules("add",{
	required:true,
	eightDecVali:true,
	messages:{
	  required:quantityNotEmptyErrMsg,
	  eightDecVali:quantityRegexErrMsg
	}
})
$("#price1").rules("add",{
	required:true,
	eightDecVali:true,
	messages:{
	  required:priceNotEmptyErrMsg,
	  eightDecVali:priceRegexErrMsg
	}
})
$("#totalPrice1").rules("add",{
	required:true,
	totalPriceVali :true,
	messages:{
	  required:totalPriceNotEmptyErrMsg,
	  totalPriceVali:totalPriceRegexErrMsg
	}
})
$("#taxRate1").rules("add",{
	required:true,
	taxRateVali:true,
	messages:{
	  required:taxRateNotEmptyErrMsg,
	  taxRateVali:taxRateRegexErrMsg
	}
})
$("#hjje").rules("add",{
	required:true,
	twoDecZeroVali:true,
	messages:{
	  required:hjjeNotEmptyErrMsg,
	  twoDecZeroVali:hjjeRegexErrMsg
	}
})
$("#hjse").rules("add",{
	required:true,
	twoDecVali:true,
	messages:{
	  required:hjseNotEmptyErrMsg,
	  twoDecVali:hjseRegexErrMsg
	}
})
$("#jshjxx").rules("add",{
	required:true,
	twoDecZeroVali:true,
	messages:{
	  required:jshjxxNotEmptyErrMsg,
	  twoDecZeroVali:jshjxxRegexErrMsg
	}
})
$("#bz").rules("add",{
	required:false,
	bzVali:true,
	messages:{
	  required:bzNotEmptyErrMsg,
	  bzVali:bzRegexErrMsg
	}
})
$("#skr").rules("add",{
	required:false,
	personalNameVali:true,
	messages:{
	  required:skrNotEmptyErrMsg,
	  personalNameVali:skrRegexErrMsg
	}
})
$("#fhr").rules("add",{
	required:false,
	fhrVali:true,
	messages:{
	  required:fhrNotEmptyErrMsg,
	  fhrVali:fhrRegexErrMsg
	}
})
$("#sprMc").rules("add",{
	required:false,
	personalNameVali:true,
	messages:{
	  required:sprMcNotEmptyErrMsg,
	  personalNameVali:sprMcRegexErrMsg
	}
})

$("#sprSjh").rules("add",{
	required:false,
	mobileVali:true,
	messages:{
	  required:sprSjhNotEmptyErrMsg,
	  mobileVali:sprSjhRegexErrMsg
	}
})
$("#sprYx").rules("add",{
	required:false,
	emailVali:true,
	messages:{
	  required:sprYxNotEmptyErrMsg,
	  emailVali:sprYxRegexErrMsg
	}
})

//增加折扣模态框
var dakai;
function discTanchu(){
	dakai = layer.open({
	  type: 1, 
	  closeBtn: 0, //不显示关闭按钮
	  shadeClose: true, //开启遮罩关闭
	  content: $("#discModal"),
	  btn:['确定'],
	  yes:function(index,layero){
		  
	  }
	});
}

//table增加商品行
var index = 1;
function addProTr(){
	var proTrs = $("input[name=checkTr]");
	var tempIndex = index;
	var strs = [];
	strs.push('<tr class="item-list" id="'+index+'">');
	strs.push('<td class="column-invoice-check" align="center"><input type="checkbox" name="checkTr"/></td>');
	strs.push('<td class="column-invoice-goods" colspan="3"><label id="enterpriseProductId'+index+'" style="display:none;"></label>');
	strs.push('<input type="text" id="productName'+index+'" name="productName'+index+'"/>');
	strs.push('<label id="taxClassificationCode'+index+'" name="taxClassificationCode'+index+'" style="display:none;"></label>');
	strs.push('<img src="/images/ico1.jpg" onclick="proTanchu('+index+')" style="cursor:pointer"/></td>');
	strs.push('<td class="column-invoice-model"><input type="text" id="specificationModel'+index+'" name="specificationModel'+index+'"/></td>');
	strs.push('<td class="column-invoice-company"><input type="text" id="meteringUnit'+index+'" name="meteringUnit'+index+'"/></td>');
	strs.push('<td class="column-invoice-number"><input type="text" id="quantity'+index+'" name="quantity'+index+'" onblur="countQuPrSeByQu('+index+')" onmouseover="tipVal(this)"/></td>');
	strs.push('<td class="column-invoice-price" colspan="2"><input type="text" id="price'+index+'" name="price'+index+'" onblur="countQuPrSeByPr('+index+')" onmouseover="tipVal(this)"/></td>');
	strs.push('<td class="column-invoice-money" colspan="2"><input type="text" id="totalPrice'+index+'" name="totalPrice" onblur="countQuPrSeByTotal('+index+')"/></td>');
	strs.push('<td class="column-invoice-taxes"><select style="width:67px;" id="taxRate'+index+'" name="taxRate'+index+'" onchange="countSePrice('+index+')"></td>');
	strs.push('<td class="column-invoice-tax"><input type="text" id="sePrice'+index+'" name="sePrice" readonly="readonly"/></td>');
	strs.push('</tr>');
	var trHtml = strs.join("");
	addTr("dzfpTab",-4,trHtml);
	//填充税率
	var selectObj = $("#taxRate"+index+"");
	selectObj.find("option").remove();
    for(var i=0;i<raxRates.length;i++){
  		$("<option value='"+raxRates[i].taxRateValue+"'>"+raxRates[i].frontName+"</option>").appendTo(selectObj);
    }
    $('#taxRate'+index+' option:eq(0)').attr('selected','selected');
	//添加校验
	$("#productName"+index+"").rules("add",{
		required:true,
		goodsNameVali:true,
		remote: { //ajax调用后台查看手机号是否可用
	     	url:basePath+"manage/tax_category/validateGoodsName"+suffix,
	     	type:"post",
	     	data:{
	     		taxClassificationCode:function(){return $("#taxClassificationCode"+tempIndex+"").text();},
	     		taxClassificationName:function(){return $("#productName"+tempIndex+"").val();}
	        } 
	    },
		messages:{
		  required:goodsNameNotEmptyErrMsg,
		  goodsNameVali:goodsNameRegexErrMsg,
		  remote:"请输入税收分类名称或者参照选入商品信息"
		}
	})
	$("#specificationModel"+index+"").rules("add",{
		required:false,
		specificationModelVali:true,
		messages:{
		  required:specModelNotEmptyErrMsg,
		  specificationModelVali:specModelRegexErrMsg
		}
	})
	$("#meteringUnit"+index+"").rules("add",{
		required:false,
		unitVali:true,
		messages:{
		  required:unitNotEmptyErrMsg,
		  unitVali:unitRegexErrMsg
		}
	})
   $("#quantity"+index+"").rules("add",{
	   required:true,
	   eightDecVali:true,
	   messages:{
	       required:quantityNotEmptyErrMsg,
	       eightDecVali:quantityRegexErrMsg
	   }
   })
   $("#price"+index+"").rules("add",{
	   required:true,
	   eightDecVali:true,
	   messages:{
	       required:priceNotEmptyErrMsg,
	       eightDecVali:priceRegexErrMsg
	   }
   })
   $("#totalPrice"+index+"").rules("add",{
	   required:true,
	   totalPriceVali :true,
		messages:{
		  required:totalPriceNotEmptyErrMsg,
		  totalPriceVali:totalPriceRegexErrMsg
		}
   })
   $("#taxRate"+index+"").rules("add",{
	   required:true,
	   taxRateVali:true,
	   messages:{
		   required:taxRateNotEmptyErrMsg,
		   taxRateVali:taxRateRegexErrMsg
	   }
   })
   $("#productName"+index+"").autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: basePath+"/manage/product/searchTaxCategoryByKeyWord"+suffix,
                dataType: "json",
                data: {
                	keyword: request.term,
                	pageIndex:0
                },
                success: function( data ) {
                  response( $.map(data.data.page, function(item) {
                      return {
                    	  goodsName:item.goodsName,
                    	  mergeCoding:item.mergeCoding,
                          value:item.goodsName,
                          label:item.goodsName + "," + item.mergeCoding,
                      }
                  }));
                }
            });
        },
        max:5,
        minLength:1,
        delay: 300,
        select: function(event,ui) {
            $("#productName"+index+"").val(ui.item.goodsName);
            $("#taxClassificationCode"+index+"").text(ui.item.mergeCoding);
        },
        focus: function(event,ui) {
            $("#productName"+index+"").val(ui.item.goodsName);
            $("#taxClassificationCode"+index+"").text(ui.item.mergeCoding);
        }
    })
}

//增加折扣行按钮
function addDisTr(){
	var totalProTrs = $("input[name=checkTr]");
	//获取选中的商品行
	var proTrs = $("input[name=checkTr]:checked");
    if(proTrs.size()==0){
       layer.msg('请先选择需要打折的商品', {icon:2,time:2000}, function(){});
       return;
    }else if(proTrs.size()>1){
       layer.msg('每次只能选择一个商品行！', {icon:2,time:2000}, function(){});
    }else{
    	var id = proTrs.parent().parent().attr("id");
    	var discId = $("#"+id+"_1");
    	if(id.indexOf("_")!=-1){
    		layer.msg('只能对商品行添加折扣行', {icon:2,time:2000}, function(){});
            return;
    	}else if(discId.length != 0){
    		layer.msg('该商品已打折，请重新选择',{icon:2,time:2000},function(){});
            return;
    	}else{
    		var id = proTrs.parent().parent().attr("id");
    		//将选中商品的信息填充到模态框中
    		if(checkProInfo(id)){
    			fillDicModalInfo(id);
    			discTanchu();
    		}else{
    			layer.msg('请先完善商品信息',{icon:2,time:2000},function(){});
    		}
    	}
    }
}

//填充折扣模态框的信息
function fillDicModalInfo(id){
	$("#dicTaxModal").attr("value","");
	$("#dicJeValModal").attr("value","");
	$("#dicSeModal").attr("value","");
	var productName = $("#productName"+id+"").val();
	$("#dicNameModal").attr("value",productName);
	var totalPrice = $("#totalPrice"+id+"").val();
	$("#proJeModal").attr("value",totalPrice);
	var taxRate = $("#taxRate"+id+" option:selected").text();
	$("#proTaxModal").attr("value",taxRate);
	var taxRateVal = $("#taxRate"+id+"").val();
	$("#proTaxValModal").attr("value",taxRateVal);
}

//折扣行模态框确定按钮
function fillDicTr(){
	//先做验证,数据格式是否正确
	var proJeModal = $("#proJeModal").val();
	var dicTaxModal = $("#dicTaxModal").val();
	var dicJeValModal = $("#dicJeValModal").val();
	if(!threeDecRegex.test(dicTaxModal) || parseFloat(dicTaxModal) > parseFloat(100)){
		layer.tips('折扣率只能为正数且小于等于100','#dicTaxModal',{tips:[1,'red']});
	}else{
		if(!twoDecRegex.test(dicJeValModal) || parseFloat(dicJeValModal) >= parseFloat(proJeModal)){
			layer.tips('折扣金额只能为正数且不能大于原商品金额','#dicJeValModal',{tips:[1,'red']});
		}else{
			var proTrs = $("input[name=checkTr]:checked");
			var id = proTrs.parent().parent().attr("id");
			var trHtml = addDiscTr(id);
			proTrs.parent().parent().after(trHtml);
			layer.closeAll();
			countAllPrice();
			disableProTr(id);
		}
	}
}

//添加完折扣行后,禁用商品行
function disableProTr(id){
	$("#productName"+id+"").attr("disabled","disabled");
	$("#taxClassificationCode"+id+"").attr("disabled","disabled");
	$("#specificationModel"+id+"").attr("disabled","disabled");
	$("#meteringUnit"+id+"").attr("disabled","disabled");
	$("#quantity"+id+"").attr("disabled","disabled");
	$("#price"+id+"").attr("disabled","disabled");
	$("#totalPrice"+id+"").attr("disabled","disabled");
	$("#taxRate"+id+"").attr("disabled","disabled");
}

//删除行后,允许改动
function removeDisableOfProTr(id){
	$("#productName"+id+"").removeAttr("disabled");
	$("#taxClassificationCode"+id+"").removeAttr("disabled");
	$("#specificationModel"+id+"").removeAttr("disabled");
	$("#meteringUnit"+id+"").removeAttr("disabled");
	$("#quantity"+id+"").removeAttr("disabled");
	$("#price"+id+"").removeAttr("disabled");
	$("#totalPrice"+id+"").removeAttr("disabled");
	$("#taxRate"+id+"").removeAttr("disabled");
}

//用户填写折扣后进行计算
function countDiscDetail(){
	var proJeModal = $("#proJeModal").val();
	var dicTaxModal = $("#dicTaxModal").val();
	var dicJeValModal = $("#dicJeValModal").val();
	var proTaxValModal = $("#proTaxValModal").val();
	if(dicTaxModal != ""){
		if(!threeDecRegex.test(dicTaxModal) || parseFloat(dicTaxModal) > parseFloat(100) || parseFloat(dicTaxModal) == parseFloat(0)){
			layer.tips('折扣率只能为正数且小于等于100','#dicTaxModal',{tips:[1,'red']});
		}else{
			dicJeValModal = math.multiply(proJeModal,dicTaxModal);
			dicJeValModal = math.divide(dicJeValModal,100);
			if(0 == hsbz || "0" == hsbz){
				var dicSeModal = math.multiply(dicJeValModal,proTaxValModal);
			}else if(1 == hsbz || "1" == hsbz){
				//换算为不含税商品金额
				var totalTaxVal = math.add(proTaxValModal,1);
				var noTaxProJeVal = math.divide(proJeModal,totalTaxVal);
				//计算不含税折扣额
				var noTaxDicVal = math.multiply(noTaxProJeVal,dicTaxModal);
				//计算税额
				var sePrice = math.multiply(noTaxDicVal,proTaxValModal);
				sePrice =  math.divide(sePrice,100);
				var dicSeModal = sePrice;
			}
			$("#dicTaxModal").val(parseFloat(dicTaxModal).toFixed(3));
			$("#dicTaxModalExact").val(parseFloat(dicTaxModal).toFixed(3));
			$("#dicJeValModal").val(parseFloat(dicJeValModal).toFixed(2));
			$("#dicSeModal").val(dicSeModal.toFixed(2));
		}
	}
}

//用户填写金额后进行计算
function countDiscJeDetail(){
	var proJeModal = $("#proJeModal").val();
	var dicTaxModal = $("#dicTaxModal").val();
	var dicJeValModal = $("#dicJeValModal").val();
	var proTaxValModal = $("#proTaxValModal").val();
	if(dicJeValModal != ""){
		if(!twoDecRegex.test(dicJeValModal)){
			layer.tips('折扣金额只能为正数且只能为两位小数','#dicJeValModal',{tips:[1,'red']});
		}else if(parseFloat(dicJeValModal) >= parseFloat(proJeModal)|| parseFloat(dicJeValModal) == parseFloat(0)){
			layer.tips('折扣金额不能大于等于原商品金额且不能等于0','#dicJeValModal',{tips:[1,'red']});
		}else{
			dicTaxModal = math.divide(dicJeValModal,proJeModal);
			dicTaxModal = math.multiply(dicTaxModal,100);
			if(0 == hsbz || "0" == hsbz){
				var dicVal = math.multiply(proJeModal,dicTaxModal);
				var dicSeModal = math.multiply(dicVal,proTaxValModal);
				dicSeModal = math.divide(dicSeModal,100);
			}else if(1 == hsbz || "1" == hsbz){
				//换算为不含税商品金额
				var totalTaxVal = math.add(proTaxValModal,1);
				var noTaxProJeVal = math.divide(proJeModal,totalTaxVal);
				//计算不含税折扣额
				var noTaxDicVal = math.multiply(noTaxProJeVal,dicTaxModal);
				//计算税额
				var sePrice = math.multiply(noTaxDicVal,proTaxValModal);
				sePrice =  math.divide(sePrice,100);
				var dicSeModal = sePrice;
			}
			$("#dicTaxModal").val(dicTaxModal.toFixed(3));
			$("#dicTaxModalExact").val(dicTaxModal);
			$("#dicJeValModal").val(parseFloat(dicJeValModal).toFixed(2));
			$("#dicSeModal").val(dicSeModal.toFixed(2));
		}
	}
}

//折扣行模态框确定按钮
function addDiscTr(id){
	//商品行名称
	var discName = $("#productName"+id+"").val();
	//商品金额
	var proJeModal = $("#proJeModal").val();
	//商品税率
	var proTaxRate = $("#taxRate"+id+" option:selected").val();
	//商品税率文本
	var proTaxRateText = $("#taxRate"+id+" option:selected").text();
	//折扣率
	var dicTaxModal = $("#dicTaxModal").val();
	//折扣率精确值
	var dicTaxModalExact = $("#dicTaxModalExact").val();
	//折扣金额
	var dicJeValModal = $("#dicJeValModal").val();
	//折扣税额
	var dicSeModal = $("#dicSeModal").val();
	//判断含税标识
	if(0 == hsbz || "0" == hsbz){
		dicJeValModal = math.multiply(dicJeValModal,-1);
		dicSeModal = math.multiply(dicSeModal,-1);
	}else if(1 == hsbz || "1" == hsbz){
		//换算为不含税商品金额
		var totalTaxVal = math.add(proTaxRate,1);
		var noTaxProJeVal = math.divide(proJeModal,totalTaxVal);
		//计算不含税折扣额
		var noTaxDicVal = math.multiply(noTaxProJeVal,dicTaxModal);
		//计算税额
		var sePrice = math.multiply(noTaxDicVal,proTaxRate);
		sePrice = math.divide(sePrice,100);
		dicJeValModal = math.multiply(dicJeValModal,-1);
		dicSeModal = math.multiply(sePrice,-1);
	}
	var strs = [];
	strs.push('<tr class="item-list" id="'+id+'_1">');
	strs.push('<td class="column-invoice-check" align="center"><input type="checkbox" name="checkTr"/></td>');
	strs.push('<td class="column-invoice-goods" colspan="3"><label disabled="disabled">'+discName+'</label>');
	strs.push('<label id="taxRateValue'+id+'_1" name="taxRateValue'+id+'_1" style="display:none;">'+dicTaxModalExact+'</label></td>');
	strs.push('<td class="column-invoice-model"></td>');
	strs.push('<td class="column-invoice-company"></td>');
	strs.push('<td class="column-invoice-number"></td>');
	strs.push('<td class="column-invoice-price" colspan="2"></td>');
	strs.push('<td class="column-invoice-money" colspan="2"><input type="text" id="totalPrice'+id+'_1" name="totalPrice" value="'+dicJeValModal.toFixed(2)+'" disabled="disabled"/></td>');
	strs.push('<td class="column-invoice-taxes"><label id="proTaxRate'+id+'_1">'+proTaxRateText+'</label></td>');
	strs.push('<td class="column-invoice-tax"><input type="text" id="sePrice'+id+'_1" name="sePrice" value="'+dicSeModal.toFixed(2)+'" disabled="disabled"/></td>');
	strs.push('</tr>');
	var trHtml = strs.join("");
	return trHtml;
}

//删除行
function delTr(){
	//获取选中的复选框，然后循环遍历删除
    var ckbs=$("input[name=checkTr]:checked");
    if(ckbs.size()==0){
    	layer.msg('请选择要删除的行！', {icon:2,time:2000}, function(){
			 //do something
		});
       return;
	}else if(ckbs.size()==1){
		layer.confirm("确定要删除本行吗？", {
			icon: 3, title:'提示',btn: ['确定','取消'] //按钮
		}, function(index){
			layer.close(index);
			ckbs.each(function(){
				 var id = $(this).parent().parent().attr("id");
				 $("#"+id+"_1").remove();
				 var index = id.indexOf("_");
				 if(index != -1){
					 removeDisableOfProTr(id.substring(0,index));
				 }else{
					 removeDisableOfProTr(id);
				 }
				 $(this).parent().parent().remove();
			});
			var proTrs = $("input[name=checkTr]");
		    if(proTrs.size() <= 0){
		    	addProTr();
		    }
		    countAllPrice();
		}, function(){
			layer.close(index);
		});
	}else{
		layer.confirm("确定要删除这些行吗？", {
			icon: 3, title:'提示',btn: ['确定','取消'] //按钮
		}, function(index){
			layer.close(index);
			ckbs.each(function(){
				 var id = $(this).parent().parent().attr("id");
				 $("#"+id+"_1").remove();
				 var index = id.indexOf("_");
				 if(index != -1){
					 removeDisableOfProTr(id.substring(0,index));
				 }else{
					 removeDisableOfProTr(id);
				 }
				 $(this).parent().parent().remove();
			});
			var proTrs = $("input[name=checkTr]");
		    if(proTrs.size() <= 0){
		    	addProTr();
		    }
			countAllPrice();
		}, function(){
			layer.close(index);
		});
	}
}

//清空表单
function clearAll(){
	$("#gmfMc").val("");
	$("#gmfNsrsbh").val("");
	$("#gmfDzdh").val("");
	$("#gmfdh").val("");
	$("#gmfKhh").val("");
	$("#gmfYhzh").val("");
	$("#sprMc").val("");
	$("#sprSjh").val("");
	$("#sprYx").val("");
	$("#hjje").val("");
	$("#hjse").val("");
	$("#jshjdx").val("");
	$("#jshjxx").val("");
	$("#bz").val("");
	//获取选中的复选框，然后循环遍历删除
	var ckbs=$("input[name=checkTr]");
	ckbs.each(function(){
		 var id = $(this).parent().parent().attr("id");
		 $(this).parent().parent().remove();
	});
	index = 0;
	addProTr();
}

//组装数据
var hsbzFlag = true;
function buildData(){
	if(hsbz == 1){
		$("#noTax").attr("checked","checked");
		taxOrNoTax();
		hsbzFlag = false;
	}
	//购买方信息
	//名称
	var gmfMc = $("#gmfMc").val();
	//纳税人识别号
	var gmfNsrsbh = $("#gmfNsrsbh").val();
	//电话
	var gmfDzdh = $("#gmfDzdh").val();
	//地址
	var gmfdh = $("#gmfdh").val();
	//开户行
	var gmfKhh = $("#gmfKhh").val();
	//银行账户
	var gmfYhzh = $("#gmfYhzh").val();
	
	//销售方信息
	//地址
	var xsfDzdh = $("#xsfDzdh").val();
	//电话
	var xsfdh = $("#xsfdh").val();
	//开户行
	var xsfKhh = $("#xsfKhh").val();
	//银行账户
	var xsfYhzh = $("#xsfYhzh").val();
	
	var skr = $("#skr").val();
	var fhr = $("#fhr").val();
	CookieObj.setCookie("fhr",fhr,30);
	var sprMc = $("#sprMc").val();
	var sprSjh = $("#sprSjh").val();
	var sprYx = $("#sprYx").val();
	var bz = $("#bz").val();
	var hjje = $("#hjje").val();
	var hjse = $("#hjse").val();
	var jshj = $("#jshjxx").val();
	var commonCustomer = $("#commonCustomer").is(":checked");
	var commonProduct = $("#commonProduct").is(":checked");
	
	var id = "";
	var formProArr = new Array();
	$("tr[id]").each(function(index){
		id = $(this).attr("id");
		if(id.indexOf("_") == -1){
			var product = {};
			product.productId = $Utils.handleUndefined($("#enterpriseProductId"+id+"").text());
			product.xmmc = $.trim($Utils.handleUndefined($("#productName"+id+"").val()));
			product.spbm = $Utils.handleUndefined($("#taxClassificationCode"+id+"").text());
			product.ggxh = $.trim($Utils.handleUndefined($("#specificationModel"+id+"").val()));
			product.xmdw = $.trim($Utils.handleUndefined($("#meteringUnit"+id+"").val()));
			product.xmsl = $Utils.handleUndefined($("#quantity"+id+"").val());
			product.xmdj = $Utils.handleUndefined($("#price"+id+"").val());
			product.xmje = $Utils.handleUndefined($("#totalPrice"+id+"").val());
			product.sl = $Utils.handleUndefined($("#taxRate"+id+"").val());
			product.se = $Utils.handleUndefined($("#sePrice"+id+"").val());
			product.taxRate = $Utils.handleUndefined($("#taxRate"+id+"").find("option:selected").text());
			product.hsbz = hsbz;
			product.fphxz = 0;
			var discId = $("#"+id+"_1");
			if(discId.length != 0){
				var dicProduct = {};
				product.fphxz = 2;
				dicProduct.xmmc = $.trim($Utils.handleUndefined($("#productName"+id+"").val()));
				dicProduct.spbm = $Utils.handleUndefined($("#taxClassificationCode"+id+"").text());
				dicProduct.xmsl = $Utils.handleUndefined($("#quantity"+id+"").val());
				dicProduct.xmdj = $Utils.handleUndefined($("#price"+id+"").val());
				dicProduct.xmje = $Utils.handleUndefined($("#totalPrice"+id+"_1").val());
				dicProduct.sl = $Utils.handleUndefined($("#taxRate"+id+"").val());
				dicProduct.se = $Utils.handleUndefined($("#sePrice"+id+"_1").val());
				dicProduct.taxRate = $Utils.handleUndefined($("#taxRate"+id+"").find("option:selected").text());
				dicProduct.hsbz = hsbz;
				dicProduct.fphxz = 1;
				dicProduct.discountRate = $("#taxRateValue"+id+"_1").text();
				formProArr.push(product);
				formProArr.push(dicProduct);
			}else{
				formProArr.push(product);
			}
		}
	})
	var invoiceData = JSON.stringify({
						invoiceItemList:formProArr,
						gmfMc : gmfMc,
						gmfNsrsbh : gmfNsrsbh,
						gmfDzdh : gmfDzdh,
						gmfdh : gmfdh,
						gmfKhh : gmfKhh,
						gmfYhzh : gmfYhzh,
						xsfDzdh : xsfDzdh,
						xsfdh : xsfdh,
						xsfKhh : xsfKhh,
						xsfYhzh : xsfYhzh,
						
						skr : skr,
						fhr : fhr,
						hjje : hjje,
						hjse : hjse,
						jshj : jshj,
						sprMc : sprMc,
						sprSjh : sprSjh,
						sprYx : sprYx,
						bz : bz,
						commonCustomer : commonCustomer,
						commonProduct : commonProduct
					});
	return invoiceData;
}

//仅保存
function saveDzfp(){
	var actionUrl = basePath+"eleInvoice/saveEleInvoice"+suffix;
	handleReqFun(actionUrl);
}

//保存开具发票
function saveMakeDzfp(){
	var actionUrl = basePath+"eleInvoice/saveAndMakeEleInvoice"+suffix;
	handleReqFun(actionUrl);
}

//请求后台数据
function handleReqFun(actionUrl){
	if($("#makeInvoiceTaxCatForm").valid()){
		var proTrs = $("input[name=checkTr]");
		if(proTrs.size() <= 100){
			$("#saveDzfpBtn").attr("disabled","disabled"); 
			$("#saveMakeDzfpBtn").attr("disabled","disabled");
			var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
			$.ajax({
				url:actionUrl,
				data:buildData(),
				type:"post",
				contentType:"application/json;charset=UTF-8",
				success:function(data){
					layer.close(index);
					$("#saveDzfpBtn").removeAttr('disabled');
					$("#saveMakeDzfpBtn").removeAttr('disabled');
					if (data.code == 200 || data.code == "200") {
						if(!hsbzFlag){
							$("#hasTax").attr("checked","checked");
							taxOrNoTax();
						}
						$("#succMsg").text(data.msg);
						var dakai = layer.open({
							  title : false,
							  type: 1, 
							  closeBtn: 0, //不显示关闭按钮
							  shadeClose: true, //开启遮罩关闭
							  content: $("#succModal")
						});
						clearAll();
			        }else if(data.code == 403){
			        	if(!hsbzFlag){
							$("#hasTax").attr("checked","checked");
							taxOrNoTax();
						}
			        	$("#failMsg").text(data.msg);
						var dakai = layer.open({
							  title : false,
							  type: 1, 
							  closeBtn: 0, //不显示关闭按钮
							  shadeClose: true, //开启遮罩关闭
							  content: $("#failModal")
						});
			        }else if(data.code == 500){
			        	$("#failMsg").text("网络不稳定，请检查此发票是否开票成功");
						var dakai = layer.open({
							  title : false,
							  type: 1, 
							  closeBtn: 0, //不显示关闭按钮
							  shadeClose: true, //开启遮罩关闭
							  content: $("#failModal")
						});
			        }
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					layer.alert('系统繁忙,请稍候再试',{icon:2,title:['',true],skin:'newLayer'}, function(){
		        		layer.closeAll();
					});
					$("#saveDzfpBtn").removeAttr('disabled');
					$("#saveMakeDzfpBtn").removeAttr('disabled');
			    }
			})
			
			
			
			
			
			
		}else{
			layer.alert('商品行数不能超过100行',{icon:2,title:['',true],skin:'newLayer'}, function(){
	    		layer.closeAll();
			});
		}
   }
}

//选择开票分机号（测试）
function choiceExt(){
	/*xzExtension = layer.open({
		id:'o1',
		type:1,
		skin:'black-lay',
        scrollbar:false,
        area:[],
        offset: ['0px'],
        title:['选择开票分机号', 'background: #394457;color:#fff;'],
		content:$("#extensionModal")
	})*/
	xzExtension =layer.open({
        id:'o1',
		skin:'black-lay',
        type: 1,
        title:['开票分机号', 'background: #394457;color:#fff;'],
        content: $('#extensionModal'),
        offset: ['0px'],
        scrollbar: false,
        area: 'auto',
        maxWidth:600,
        
    });
}


















