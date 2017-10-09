//商品行tr id
var index = 1;
var fpqqlsh;
//税率数组
var taxRateIdList;
var raxRates;
//含税标志，编辑页面默认不含税
var hsbz = 0;
//抬头类型标识，默认单位
var ttbz = 0;
$(function(){
	//编辑页面默认不含税
	$("#noTax").attr("checked","checked");
	fillSl();
})

//填充税率
function fillSl(){
	//查询税率列表
	$.ajax({
		type:"GET",
		url:basePath+"manage/taxrate/getTaxRatesByRegInfoId"+suffix,
		dataType:"json",
		success:function(data){
			if(data.code==200){
				var rows = data.data.data;
				if(rows.length > 0){
					raxRates = rows;
					fillProInfo();
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
}

$("input[name='ttlx']").change(function () {
	var checked = $("input[name='ttlx']:checked").attr('id');
	if (checked == 'ttlx-gr') {
		$("#gmfNsrsbh").rules("remove");
		$("#gmfNsrsbh").rules("add",{
			required:false,
			gmfNsrsbhVali:true,
			messages:{
				required:taxpayerNumNotEmptyErrMsg,
				gmfNsrsbhVali:taxpayerNumRegexErrMsg
			}
		});
		ttbz == 1;
		$(".gmfNsrsbh-re").hide();
	} else {
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

//填充商品信息
function fillProInfo(){
	fpqqlsh = $Utils.getUrlParameters().fpqqlsh;
	$.ajax({
		type:"GET",
		url:basePath+"invoice/queryDzfpCgByFpqqlsh/"+fpqqlsh+suffix,
		success:function(data){
			if (data.code == 200) {
	            $("#my_invoice_zone").empty();
	            var item = data.data.item;
	            fillEditTaxCatData(item);
	            index = item.proList.length;
	            Array.prototype.forEach.call(item.proList,function(item,index,array){
	            	var selectObj = $("#taxRate"+(index+1)+"");
	            	selectObj.find("option").remove();
	            	for(var i=0;i<raxRates.length;i++){
		    			 $("<option value='"+raxRates[i].taxRateValue+"'>"+raxRates[i].frontName+"</option>").appendTo(selectObj);
		    			 var taxTate = parseFloat(item.taxRate);
		    			 if(parseFloat(raxRates[i].taxRateValue) == taxTate){
		    				 selectObj.val(taxTate);
		    			 }
		            }
	            	$("#productName"+(index+1)+"").autocomplete({
				         source: function( request, response ) {
				             $.ajax( {
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
				         minLength:2,
				         delay: 0,
				         select: function(event,ui) {
				             $("#productName"+(index+1)+"").val(ui.item.goodsName);
				             $("#taxClassificationCode"+(index+1)+"").text(ui.item.mergeCoding);
				         },
				         focus: function(event,ui) {
				             $("#productName"+(index+1)+"").val(ui.item.goodsName);
				             $("#taxClassificationCode"+(index+1)+"").text(ui.item.mergeCoding);
				         }
				     })
					
		            $("#productName"+(index+1)+"").rules("add",{
		            	required:true,
		            	goodsNameVali:true,
		            	remote: { //ajax调用后台查看手机号是否可用
		            		url:basePath+"manage/tax_category/validateGoodsName"+suffix,
		            		type:"post",
		            		data:{
		            			taxClassificationCode:function(){return $("#taxClassificationCode"+(index+1)+"").text();},
		            			taxClassificationName:function(){return $("#productName"+(index+1)+"").val();}
		            		} 
		            	},
		            	messages:{
		            		required:goodsNameNotEmptyErrMsg,
		            		goodsNameVali:goodsNameRegexErrMsg,
		            		remote:"请输入税收分类名称或者参照选入商品信息"
		            	}
		            })
		            $("#specificationModel"+(index+1)+"").rules("add",{
		            	required:false,
		            	specificationModelVali:true,
		            	messages:{
		            		required:specModelNotEmptyErrMsg,
		            		specificationModelVali:specModelRegexErrMsg
		            	}
		            })
					$("#meteringUnit"+(index+1)+"").rules("add",{
						required:false,
						unitVali:true,
						messages:{
						  required:unitNotEmptyErrMsg,
						  unitVali:unitRegexErrMsg
						}
					})
		            $("#quantity"+(index+1)+"").rules("add",{
		            	required:true,
		            	eightDecVali :true,
		            	messages:{
		            		required:quantityNotEmptyErrMsg,
		            		eightDecVali:quantityRegexErrMsg
		            	}
		            })
		            $("#price"+(index+1)+"").rules("add",{
		            	required:true,
		            	eightDecVali :true,
		            	messages:{
		            	  required:priceNotEmptyErrMsg,
		            	  eightDecVali:priceRegexErrMsg
		            	}
		            })

		            $("#totalPrice"+(index+1)+"").rules("add",{
		            	required:true,
		            	twoDecZeroVali :true,
		            	messages:{
		            	  required:totalPriceNotEmptyErrMsg,
		            	  twoDecZeroVali:totalPriceRegexErrMsg
		            	}
		            })
		            $("#taxRate"+(index+1)+"").rules("add",{
						required:true,
						taxRateVali :true,
						messages:{
						  required:taxRateNotEmptyErrMsg,
						  taxRateVali:taxRateRegexErrMsg
						}
					})
	            });
	        }else if(data.code == 403){
	        	layer.alert('未查询到数据',{icon:2,title:['',true],skin:'newLayer'},function(){
					layer.closeAll();
				});
	        }
		}
	})
}

function fillEditTaxCatData(item) {
	$("#proRow").html("");
    $("#gmfMc").val(item.gmfMc);
    $("#gmfNsrsbh").val(item.gmfNsrsbh);
    $("#gmfDzdh").val($Utils.handleUndefined(item.gmfDzdh));
    $("#gmfdh").val($Utils.handleUndefined(item.gmfdh));
    $("#gmfKhh").val($Utils.handleUndefined(item.gmfKhh));
    $("#gmfYhzh").val($Utils.handleUndefined(item.gmfYhzh));
    $("#hjje").val(parseFloat(item.hjje).toFixed(2));
    $("#hjse").val(parseFloat(item.hjse).toFixed(2));
    $("#jshjxx").val(parseFloat(item.jshj).toFixed(2));
    $("#jshjdx").val($Utils.convertMoneyToChinese(item.jshj));
    $("#bz").val(item.bz);
    $("#xsfMc").val(item.xsfMc);
    $("#xsfNsrsbh").val(item.xsfNsrsbh);
    $("#xsfDzdh").val($Utils.handleUndefined(item.xsfDzdh));
    $("#xsfdh").val($Utils.handleUndefined(item.xsfdh));
    $("#xsfKhh").val($Utils.handleUndefined(item.xsfKhh));
    $("#xsfYhzh").val($Utils.handleUndefined(item.xsfYhzh));
    $("#skr").val(item.skr);
    $("#fhr").val(item.fhr);
    $("#kpr").val(item.kpr);
    var proList = item.proList;
    var strs = [];
    Array.prototype.forEach.call(proList,function(item,index,array) {
       if(item.discounted == "DISED"){
    	  //填充商品信息
          strs.push('<tr class="item-list" id="'+(index+1)+'">');
          strs.push('<td class="column-invoice-check" align="center"><input type="checkbox" name="checkTr"/></td>');
          strs.push('<td class="column-invoice-goods" colspan="3"><label id="enterpriseProductId'+(index+1)+'" style="display:none;"></label>');
          strs.push('<input type="text" id="productName'+(index+1)+'" name="productName'+(index+1)+'" value="'+item.goodsServiceName+'" disabled="disabled"/>');
          strs.push('<label id="taxClassificationCode'+(index+1)+'" name="taxClassificationCode'+(index+1)+'" style="display:none;">'+item.taxClassificationCode+'</label>');
      	  strs.push('<img src="/images/ico1.jpg" onclick="proTanchu('+(index+1)+')" style="cursor:pointer"/></td>');
          strs.push('<td class="column-invoice-model"><input type="text" id="specificationModel'+(index+1)+'" name="specificationModel'+(index+1)+'" value="'+$Utils.handleUndefined(item.specificationModel)+'" disabled="disabled"/></td>');
          strs.push('<td class="column-invoice-company"><input type="text" id="meteringUnit'+(index+1)+'" name="meteringUnit'+(index+1)+'" value="'+$Utils.handleUndefined(item.meteringUnit)+'" disabled="disabled"/></td>');
          strs.push('<td class="column-invoice-number"><input type="text" id="quantity'+(index+1)+'" name="quantity'+(index+1)+'" onblur="countQuPrSeByQu('+(index+1)+')" value="'+$Utils.handleUndefined(item.quantity)+'" onmouseover="tipVal(this)" disabled="disabled"/></td>');
          strs.push('<td class="column-invoice-price" colspan="2"><input type="text" id="price'+(index+1)+'" name="price'+(index+1)+'" value="'+$Utils.handleUndefined(item.price)+'" onblur="countQuPrSeByPr('+(index+1)+')" onmouseover="tipVal(this)" disabled="disabled"/></td>');
          strs.push('<td class="column-invoice-money" colspan="2"><input type="text" id="totalPrice'+(index+1)+'" name="totalPrice" value="'+item.amount.toFixed(2)+'" onblur="countQuPrSeByTotal('+(index+1)+')" disabled="disabled"/></td>');
          strs.push('<td class="column-invoice-taxes"><select id="taxRate'+(index+1)+'" name="taxRate'+(index+1)+'" onchange="countSePrice('+(index+1)+')" disabled="disabled">');
          strs.push('<td class="column-invoice-tax"><input type="text" id="sePrice'+(index+1)+'" name="sePrice" value="'+item.taxAmount.toFixed(2)+'" readonly="readonly"/></td>');
          strs.push('</tr>');
          //填充折扣信息
          strs.push('<tr class="item-list" id="'+(index+1)+'_1">');
          strs.push('<td class="column-invoice-check" align="center"><input type="checkbox" name="checkTr"/></td>');
          strs.push('<td class="column-invoice-goods" colspan="3"><label>'+item.discountName+'</label>');
          strs.push('<label id="taxRateValue'+(index+1)+'_1" name="taxRateValue'+(index+1)+'_1" style="display:none;">'+item.discountTaxRate+'</label></td>');
       	  strs.push('<td class="column-invoice-model"></td>');
       	  strs.push('<td class="column-invoice-company"></td>');
       	  strs.push('<td class="column-invoice-number"></td>');
       	  strs.push('<td class="column-invoice-price" colspan="2"></td>');
       	  strs.push('<td class="column-invoice-money" colspan="2"><input type="text" id="totalPrice'+(index+1)+'_1" name="totalPrice" value="'+item.discountAmount.toFixed(2)+'" disabled="disabled"/></td>');
       	  strs.push('<td class="column-invoice-taxes"><label id="proTaxRate'+(index+1)+'_1">'+(item.taxRate)*100+'%</label></td>');
       	  strs.push('<td class="column-invoice-tax"><input type="text" id="sePrice'+(index+1)+'_1" name="sePrice" value="'+item.discountTaxAmount.toFixed(2)+'" disabled="disabled"/></td>');
       	  strs.push('</tr>');
       }else{
    	   strs.push('<tr class="item-list" id="'+(index+1)+'">');
           strs.push('<td class="column-invoice-check" align="center"><input type="checkbox" name="checkTr"/></td>');
           strs.push('<td class="column-invoice-goods" colspan="3"><label id="enterpriseProductId'+(index+1)+'" style="display:none;"></label>');
           strs.push('<input type="text" id="productName'+(index+1)+'" name="productName'+(index+1)+'" value="'+item.goodsServiceName+'"/>');
           strs.push('<label id="taxClassificationCode'+(index+1)+'" name="taxClassificationCode'+(index+1)+'" style="display:none;">'+item.taxClassificationCode+'</label>');
       	   strs.push('<img src="/images/ico1.jpg" onclick="proTanchu('+(index+1)+')" style="cursor:pointer"/></td>');
           strs.push('<td class="column-invoice-model"><input type="text" id="specificationModel'+(index+1)+'" name="specificationModel'+(index+1)+'" value="'+$Utils.handleUndefined(item.specificationModel)+'"/></td>');
           strs.push('<td class="column-invoice-company"><input type="text" id="meteringUnit'+(index+1)+'" name="meteringUnit'+(index+1)+'" value="'+$Utils.handleUndefined(item.meteringUnit)+'"/></td>');
           strs.push('<td class="column-invoice-number"><input type="text" id="quantity'+(index+1)+'" name="quantity'+(index+1)+'" onblur="countQuPrSeByQu('+(index+1)+')" value="'+$Utils.handleUndefined(item.quantity)+'" onmouseover="tipVal(this)"/></td>');
           strs.push('<td class="column-invoice-price" colspan="2"><input type="text" id="price'+(index+1)+'" name="price'+(index+1)+'" value="'+$Utils.handleUndefined(item.price)+'" onblur="countQuPrSeByPr('+(index+1)+')" onmouseover="tipVal(this)"/></td>');
           strs.push('<td class="column-invoice-money" colspan="2"><input type="text" id="totalPrice'+(index+1)+'" name="totalPrice" value="'+item.amount.toFixed(2)+'" onblur="countQuPrSeByTotal('+(index+1)+')"/></td>');
           strs.push('<td class="column-invoice-taxes"><select id="taxRate'+(index+1)+'" name="taxRate'+(index+1)+'" onchange="countSePrice('+(index+1)+')">');
           strs.push('<td class="column-invoice-tax"><input type="text" id="sePrice'+(index+1)+'" name="sePrice" value="'+item.taxAmount.toFixed(2)+'" readonly="readonly"/></td>');
           strs.push('</tr>');
       }
    })
    var trHtml = strs.join("");
	$("#proRow").html(trHtml);
}

var validator = $("#makeInvoiceForm").validate({
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
	nsrsbhReqVali:true,
	messages:{
		required:taxpayerNumNotEmptyErrMsg,
		nsrsbhReqVali:taxpayerNumRegexErrMsg
	}
})

$("#gmfDzdh").rules("add",{
	required:true,
	xsfDzdhVali:true,
	messages:{
		required:addressNotEmptyErrMsg,
		xsfDzdhVali:addressRegexErrMsg
	}
})
$("#gmfdh").rules("add",{
	required:true,
	xsfdhVali:true,
	messages:{
		required:mobileNotEmptyErrMsg,
		xsfdhVali:mobileRegexErrMsg
	}
})
$("#gmfKhh").rules("add",{
	required:true,
	khhReqVali:true,
	messages:{
		required:bankNameNotEmptyErrMsg,
		khhReqVali:bankNameRegexErrMsg
	}
})
$("#gmfYhzh").rules("add",{
	required:true,
	yhzhReqVali:true,
	messages:{
		required:bankAccountNotEmptyErrMsg,
		yhzhReqVali:bankAccountRegexErrMsg
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
	required:true,
	khhReqVali:true,
	messages:{
		required:bankNameNotEmptyErrMsg,
		khhReqVali:bankNameRegexErrMsg
	}
})
$("#xsfYhzh").rules("add",{
	required:true,
	yhzhReqVali:true,
	messages:{
		required:bankAccountNotEmptyErrMsg,
		yhzhReqVali:bankAccountRegexErrMsg
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

//客户信息模态框
function cusTanchu(){
	layer.open({
	  type: 2,
	  title: "选择客户信息",
	  area: ['80%', '90%'],
	  offset: ['10px', '100px'],
	  shadeClose: true, //开启遮罩关闭
	  shade: [0.8, '#393D49'],
	  content: ['../invoiceManage/choiceCustomer.shtml','no']
	});
}

var proIndex = "";
//商品信息模态框
function proTanchu(index){
	var discId = $("#"+index+"_1");
	if(discId.length != 0){
		layer.msg('该商品已打折，请重新选择',{icon:2,time:2000},function(){
			 //do something
		});
	}else{
		proIndex = index;
		layer.open({
		  type: 2,
		  title: "选择商品信息",
		  area: ['80%','90%'],
		  offset: ['10px','100px'],
		  shadeClose: true, //开启遮罩关闭
		  shade: [0.8, '#393D49'],
		  content: ['../invoiceManage/choiceProduct.shtml','no']
		});
	}
}

//折扣模态框
var dakai;
function discTanchu(){
	dakai = layer.open({
	  type: 1, 
	  closeBtn: 0, //不显示关闭按钮
	  shadeClose: true, //开启遮罩关闭
	  content: $("#discModal")
	});
}

//table增加商品行
function addProTr(){
	var proTrs = $("input[name=checkTr]");
	if(proTrs.size() >= 6){
		layer.alert('商品和折扣不能超过6行',{icon:2,title:['',true],skin:'newLayer'}, function(){
    		layer.closeAll();
		});
		return;
	}
	index++;
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
		twoDecZeroVali :true,
		messages:{
		  required:totalPriceNotEmptyErrMsg,
		  twoDecZeroVali:totalPriceRegexErrMsg
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

//含税不含税
function taxOrNoTax(){
	var radioId = $('input:radio[name="taxOrNoTax"]:checked').attr("id");
	if(radioId == "hasTax"){
		hsbz = 1;
		$("#priceText").text("单价(含税)");
		$("#moneyText").text("金额(含税)");
		//获取所有商品行单价
		//根据不含税单价推算含税单价 不含税单价*(1+税率)=含税单价
		//获取所有商品行单价
		var proTrs = $("input[id^='price']");
		proTrs.each(function(){
			//获取当前行id
			var id = $(this).parent().parent().attr("id");
			//获取税率
			var taxVal = $("#taxRate"+id+" option:selected").val();
			var totalTaxVal = math.add(taxVal,1);
			//获取单价
			var noTaxPrice = $(this).val();
			if(noTaxPrice){
				//换算为含税单价
				var taxPrice = math.multiply(noTaxPrice,totalTaxVal);
				$(this).val($Utils.checkInt(taxPrice));
				countQuPrSeByPr(id);
				//判断是否有折扣行
				var discId = $("#"+id+"_1");
				if(discId.length != 0){
					//如果有商品行进行相应处理
					var discVal = $("#taxRateValue"+id+"_1").text();
					var proJeVal = $("#totalPrice"+id+"").val();
					var dicJeVal = math.multiply(proJeVal,discVal);
					dicJeVal = math.divide(dicJeVal,100);
					//换算为不含税金额,计算税额
					var totalTaxVal = math.add(taxVal,1);
					var noTaxProJeVal = math.divide(proJeVal,totalTaxVal);
					var noTaxDicJeVal = math.multiply(noTaxProJeVal,discVal);
					noTaxDicJeVal = math.divide(noTaxDicJeVal,100);
					var dicSeVal = math.multiply(noTaxDicJeVal,taxVal);
					dicJeVal = dicJeVal.toFixed(2)
					dicJeVal = math.multiply(dicJeVal,-1);
					dicSeVal = dicSeVal.toFixed(2);
					dicSeVal = math.multiply(dicSeVal,-1);
					$("#totalPrice"+id+"_1").val(dicJeVal);
					$("#sePrice"+id+"_1").val(dicSeVal);
					countAllPrice();
				}
			}
		});
	}else{
		$("#priceText").text("单价(不含税)");
		$("#moneyText").text("金额(不含税)");
		hsbz = 0;
		//获取所有商品行单价
		//根据含税单价推算不含税单价 含税单价/(1+税率)=不含税单价
		//获取所有商品行单价
		var proTrs = $("input[id^='price']");
		proTrs.each(function(){
			//获取当前行id
			var id = $(this).parent().parent().attr("id");
			//获取税率
			var taxVal = $("#taxRate"+id+" option:selected").val();
			var totalTaxVal = math.add(taxVal,1);
			//获取单价
			var noTaxPrice = $(this).val();
			if(noTaxPrice){
				//换算为含税单价
				var taxPrice = math.divide(noTaxPrice,totalTaxVal);
				$(this).val($Utils.checkInt(taxPrice));
				countQuPrSeByPr(id);
				//判断是否有折扣行
				var discId = $("#"+id+"_1");
				if(discId.length != 0){
					var discVal = $("#taxRateValue"+id+"_1").text();
					var proJeVal = $("#totalPrice"+id+"").val();
					var dicJeVal = math.multiply(proJeVal,discVal);
					dicJeVal = math.divide(dicJeVal,100);
					dicJeVal = dicJeVal.toFixed(2);
					var dicSeVal = math.multiply(dicJeVal,taxVal);
					dicJeVal = math.multiply(dicJeVal,-1);
					dicSeVal = dicSeVal.toFixed(2);
					dicSeVal = math.multiply(dicSeVal,-1);
					$("#totalPrice"+id+"_1").val(dicJeVal);
					$("#sePrice"+id+"_1").val(dicSeVal);
					countAllPrice();
				}
			}
		});
	}
}

//增加折扣行按钮
function addDisTr(){
	var totalProTrs = $("input[name=checkTr]");
	if(totalProTrs.size() >= 6){
		layer.alert('商品和折扣不能超过6行',{icon:2,title:['',true],skin:'newLayer'}, function(){
    		layer.closeAll();
		});
		return;
	}
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
		sePrice =  math.divide(sePrice,100);
		dicJeValModal = math.multiply(dicJeValModal,-1);
		dicSeModal = sePrice;
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

//组装数据
function buildData(){
	if(hsbz == 1){
		$("#noTax").attr("checked","checked");
		taxOrNoTax();
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
	var bz = $("#bz").val();
	var hjje = $("#hjje").val();
	var hjse = $("#hjse").val();
	var jshj = $("#jshjxx").val();
	
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
						fpqqlsh:fpqqlsh,
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
//						fpzldm : "01",
						skr : skr,
						fhr : fhr,
						hjje : hjje,
						hjse : hjse,
						jshj : jshj,
						bz : bz
					});
	return invoiceData;
}

//仅保存
function saveDzfp(){
	var actionUrl = basePath+"paperInvoice/updatePaperInvoice"+suffix;
	handleReqFun(actionUrl);
}

//保存开具发票
function saveMakeDzfp(){
	var actionUrl = basePath+"paperInvoice/updateAndMakePaperInvoice"+suffix;
	handleReqFun(actionUrl);
}

//请求后台数据
function handleReqFun(actionUrl){
	if($("#makeInvoiceForm").valid()){
		var proTrs = $("input[name=checkTr]");
		if(proTrs.size() <= 6){
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
					$("#hasTax").attr("checked","checked");
					taxOrNoTax();
					layer.alert(data.msg,{icon:1,title:['',true],skin:'newLayer'}, function(){
						layer.closeAll();
						window.location.href = basePath + "pages/manage/invoiceManage/paperInvoiceManage.shtml";
					});
		        }else if(data.code == 403){
		        	layer.alert(data.msg,{icon:2,title:['',true],skin:'newLayer'}, function(){
		        		layer.closeAll();
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
			layer.alert('商品和折扣不能超过6行',{icon:2,title:['',true],skin:'newLayer'}, function(){
	    		layer.closeAll();
			});
		}
   }
}

