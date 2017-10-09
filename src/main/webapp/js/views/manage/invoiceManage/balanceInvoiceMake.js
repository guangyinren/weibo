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
//商品行金额
var totalPriceFlag = 0;
//差额输入框
function addbalanceModalFun(){
	layer.closeAll();
	layer.open({
		 type: 1, 
		 closeBtn: 0, //不显示关闭按钮
		 shadeClose: false, //开启遮罩关闭
		 content: $("#balanceModal")
	});
}

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

//检查库存信息
function checkRepertory(){
	$.ajax({
		url:basePath+"manage/invoice/setting/getRepertorySet"+suffix,
		data:{},
		type:"get",
		success:function(data){
			if("200"==data.code){
				if(data.data.paperInvoiceCaution){
					layer.msg('您的纸质发票库存数量已不足'+data.data.paperInvoiceCautionValue+'张',{icon:2,title:['',true],skin:'newLayer'}, function(){
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
	addbalanceModalFun();
	//查询税率列表
	getTaxRates();
	//填充销售方信息
	fillSellerInfo();
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

//差额验证规则
$.validator.addMethod("balanceTotalVali", function (value, element) {
	var balanceTotal = $("#balanceTotalHid").val();
	return parseFloat(balanceTotal) <= parseFloat(value);
},'总金额需大于扣除额');

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
		required:addressNotEmptyErrMsg,
		gmfDzdhVali:addressRegexErrMsg
	}
})
$("#gmfdh").rules("add",{
	required:false,
	gmfdhVali:true,
	messages:{
		required:mobileNotEmptyErrMsg,
		gmfdhVali:mobileRegexErrMsg
	}
})
$("#gmfKhh").rules("add",{
	required:false,
	khhVali:true,
	messages:{
		required:bankNameNotEmptyErrMsg,
		khhVali:bankNameRegexErrMsg
	}
})
$("#gmfYhzh").rules("add",{
	required:false,
	yhzhVali:true,
	messages:{
		required:bankAccountNotEmptyErrMsg,
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
		required:bankNameNotEmptyErrMsg,
		khhVali:bankNameRegexErrMsg
	}
})
$("#xsfYhzh").rules("add",{
	required:false,
	yhzhVali:true,
	messages:{
		required:bankAccountNotEmptyErrMsg,
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
	  goodsNameVali:"请输入100个字母、数字、特殊字符或者50个中文",
	  remote:goodsNameRegexErrMsg
	}
})
$("#specificationModel1").rules("add",{
	required:false,
	specificationModelVali:true,
	messages:{
	  required:specModelNotEmptyErrMsg,
	  specificationModelVali:specModelRegexErrMsg
	}
})
$("#meteringUnit1").rules("add",{
	required:false,
	unitVali:true,
	messages:{
	  required:unitNotEmptyErrMsg,
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
	totalPriceVali:true,
	balanceTotalVali:true,
	messages:{
	  required:totalPriceNotEmptyErrMsg,
	  totalPriceVali:totalPriceRegexErrMsg,
	  balanceTotalVali:'总金额需大于扣除额'
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

//客户信息模态框
function cusTanchu(){
	layer.open({
	  type: 2,
		skin:'black-lay',
	  title: "选择客户信息",
	  area: ['80%', '90%'],
	  offset: ['10px', '100px'],
	  shadeClose: true, //开启遮罩关闭
	  shade: [0.8, '#393D49'],
	  scrollbar:true,
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
		  skin:"black-lay",
		  area: ['80%','90%'],
		  offset: ['10px','100px'],
		  shadeClose: true, //开启遮罩关闭
		  shade: [0.8, '#393D49'],
		  content: ['../invoiceManage/choiceProduct.shtml','no']
		});
	}
}

//税收分类模态框
function taxTanchu(index){
	var discId = $("#"+index+"_1");
	if(discId.length != 0){
		layer.msg('该商品已打折，请重新选择',{icon:2,time:2000},function(){
			 //do something
		});
	}else{
		proIndex = index;
		layer.open({
		  type: 2,
		  title: "税收分类编码表",
		  area: ['80%','90%'],
		  skin:"black-lay ",
		  scrollbar:true,
		  offset: ['10px','100px'],
		  shadeClose: true, //开启遮罩关闭
		  shade: [0.8, '#393D49'],
		  content: ['../invoiceManage/choiceTaxCategory.shtml','no'],
		  end:function(){
			}
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

//纸质普票，纸质专票，电子票
function changeInvoiceType(){
	var radioId = $('input:radio[name="invoiceType"]:checked').attr("id");
	if(radioId == "eleInvoice"){
		$("#invoiceRelate").show();
		$(".ttlx-input").show();
		$(".paperSpecial-flag").hide();
		$("#gmfNsrsbh").rules("remove");
		$("#gmfNsrsbh").rules("add",{
			required:false,
			gmfNsrsbhVali:true,
			messages:{
				required:taxpayerNumNotEmptyErrMsg,
				gmfNsrsbhVali:taxpayerNumRegexErrMsg
			}
		});
		$("#gmfDzdh").rules("remove");
		$("#gmfDzdh").rules("add",{
			required:false,
			gmfDzdhVali:true,
			messages:{
				required:addressNotEmptyErrMsg,
				gmfDzdhVali:addressRegexErrMsg
			}
		});
		$("#gmfdh").rules("remove");
		$("#gmfdh").rules("add",{
			required:false,
			gmfdhVali:true,
			messages:{
				required:mobileNotEmptyErrMsg,
				gmfdhVali:mobileRegexErrMsg
			}
		});
		$("#gmfKhh").rules("remove");
		$("#gmfKhh").rules("add",{
			required:false,
			khhVali:true,
			messages:{
				required:bankNameNotEmptyErrMsg,
				khhVali:bankNameRegexErrMsg
			}
		});
		$("#gmfYhzh").rules("remove");
		$("#gmfYhzh").rules("add",{
			required:false,
			yhzhVali:true,
			messages:{
				required:bankAccountNotEmptyErrMsg,
				yhzhVali:bankAccountRegexErrMsg
			}
		});
		$("#xsfKhh").rules("remove");
		$("#xsfKhh").rules("add",{
			required:false,
			khhVali:true,
			messages:{
				required:bankNameNotEmptyErrMsg,
				khhVali:bankNameRegexErrMsg
			}
		})
		$("#xsfYhzh").rules("remove");
		$("#xsfYhzh").rules("add",{
			required:false,
			yhzhVali:true,
			messages:{
				required:bankAccountNotEmptyErrMsg,
				yhzhVali:bankAccountRegexErrMsg
			}
		})
	}else if(radioId == "paperInvoice"){
		$("#invoiceRelate").show();
		$(".ttlx-input").show();
		$(".paperSpecial-flag").hide();
		$("#gmfNsrsbh").rules("remove");
		$("#gmfNsrsbh").rules("add",{
			required:false,
			gmfNsrsbhVali:true,
			messages:{
				required:taxpayerNumNotEmptyErrMsg,
				gmfNsrsbhVali:taxpayerNumRegexErrMsg
			}
		});
		$("#gmfDzdh").rules("remove");
		$("#gmfDzdh").rules("add",{
			required:false,
			gmfDzdhVali:true,
			messages:{
				required:addressNotEmptyErrMsg,
				gmfDzdhVali:addressRegexErrMsg
			}
		});
		$("#gmfdh").rules("remove");
		$("#gmfdh").rules("add",{
			required:false,
			gmfdhVali:true,
			messages:{
				required:mobileNotEmptyErrMsg,
				gmfdhVali:mobileRegexErrMsg
			}
		});
		$("#gmfKhh").rules("remove");
		$("#gmfKhh").rules("add",{
			required:false,
			khhVali:true,
			messages:{
				required:bankNameNotEmptyErrMsg,
				khhVali:bankNameRegexErrMsg
			}
		});
		$("#gmfYhzh").rules("remove");
		$("#gmfYhzh").rules("add",{
			required:false,
			yhzhVali:true,
			messages:{
				required:bankAccountNotEmptyErrMsg,
				yhzhVali:bankAccountRegexErrMsg
			}
		});
		$("#xsfKhh").rules("remove");
		$("#xsfKhh").rules("add",{
			required:false,
			khhVali:true,
			messages:{
				required:bankNameNotEmptyErrMsg,
				khhVali:bankNameRegexErrMsg
			}
		})
		$("#xsfYhzh").rules("remove");
		$("#xsfYhzh").rules("add",{
			required:false,
			yhzhVali:true,
			messages:{
				required:bankAccountNotEmptyErrMsg,
				yhzhVali:bankAccountRegexErrMsg
			}
		})
	}else if(radioId == "paperSpecialInvoice"){
		//隐藏收款人信息
		$("#invoiceRelate").hide();
		//隐藏抬头类型
		$(".ttlx-input").hide();
		//地址、电话、开户行及账号必输
		$(".paperSpecial-flag").show();
		$(".gmfNsrsbh-re").show();
		$("#gmfNsrsbh").rules("remove");
		$("#gmfNsrsbh").rules("add",{
			required:true,
			gmfNsrsbhVali:true,
			messages:{
				required:taxpayerNumNotEmptyErrMsg,
				gmfNsrsbhVali:taxpayerNumRegexErrMsg
			}
		});
		$("#gmfDzdh").rules("remove");
		$("#gmfDzdh").rules("add",{
			required:true,
			gmfDzdhVali:true,
			messages:{
				required:addressNotEmptyErrMsg,
				gmfDzdhVali:addressRegexErrMsg
			}
		});
		$("#gmfdh").rules("remove");
		$("#gmfdh").rules("add",{
			required:true,
			gmfdhVali:true,
			messages:{
				required:mobileNotEmptyErrMsg,
				gmfdhVali:mobileRegexErrMsg
			}
		});
		$("#gmfKhh").rules("remove");
		$("#gmfKhh").rules("add",{
			required:true,
			khhVali:true,
			messages:{
				required:bankNameNotEmptyErrMsg,
				khhVali:bankNameRegexErrMsg
			}
		});
		$("#gmfYhzh").rules("remove");
		$("#gmfYhzh").rules("add",{
			required:true,
			yhzhVali:true,
			messages:{
				required:bankAccountNotEmptyErrMsg,
				yhzhVali:bankAccountRegexErrMsg
			}
		});
		$("#xsfKhh").rules("remove");
		$("#xsfKhh").rules("add",{
			required:true,
			khhVali:true,
			messages:{
				required:bankNameNotEmptyErrMsg,
				khhVali:bankNameRegexErrMsg
			}
		})
		$("#xsfYhzh").rules("remove");
		$("#xsfYhzh").rules("add",{
			required:true,
			yhzhVali:true,
			messages:{
				required:bankAccountNotEmptyErrMsg,
				yhzhVali:bankAccountRegexErrMsg
			}
		})
	}
}

//增加折扣行按钮
function addDisTr(){
	var totalProTrs = $("input[name=checkTr]");
	if(totalProTrs.size() >= 17){
		layer.alert('温馨提示：连接税控盘设备的，开票明细超过18条将开票失败',{icon:2,title:['',true],skin:'newLayer'}, function(){
    		layer.closeAll();
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
		});
	}else{
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
	//商品金额
	var proJeModal = $("#proJeModal").val();
	//折扣率
	var dicTaxModal = $("#dicTaxModal").val();
	//商品税率
	var taxRate = $("#proTaxValModal").val();
	//价税合计金额
	var jshj = $("#jshjxx").val();
	if(dicTaxModal){
		if(!threeDecRegex.test(dicTaxModal) || parseFloat(dicTaxModal) > parseFloat(100) || parseFloat(dicTaxModal) == parseFloat(0)){
			layer.tips('折扣率只能为正数且小于100','#dicTaxModal',{tips:[1,'red']});
		}else{
			var dicJe;
			var dicSe;
			//折扣率小数值
			var dicVal = math.divide(dicTaxModal,100);
			//计算折扣额，税额
			if(0 == hsbz || "0" == hsbz){
				//不含税情况下,折扣金额
				dicJe = math.multiply(proJeModal,dicVal);
				//折扣税额
				dicSe = math.multiply(dicJe,taxRate);
			}else{
				//1+税率
				var totalTaxVal = math.add(taxRate,1);
				//价税合计换算为不含税
				var temVal = math.divide(jshj,totalTaxVal);
				//含税情况下，折扣金额
				dicJe = math.multiply(jshj,dicVal);
				//折扣税额,换算为不含税
				dicSe = math.multiply(temVal,dicVal);
				dicSe = math.multiply(dicSe,taxRate);
			}
			$("#dicTaxModal").val(parseFloat(dicTaxModal).toFixed(3));
			$("#dicTaxModalExact").val(parseFloat(dicVal).toFixed(3));
			$("#dicJeValModal").val(parseFloat(dicJe).toFixed(2));
			$("#dicSeModal").val(dicSe.toFixed(2));
		}
	}
}

//用户填写金额后进行计算
function countDiscJeDetail(){
	//商品金额
	var proJeModal = $("#proJeModal").val();
	//折扣金额
	var dicJeValModal = $("#dicJeValModal").val();
	//商品税率
	var taxRate = $("#proTaxValModal").val();
	//价税合计金额
	var jshj = $("#jshjxx").val();
	if(dicJeValModal){
		if(!twoDecRegex.test(dicJeValModal)){
			layer.tips('折扣金额只能为正数且只能为两位小数','#dicJeValModal',{tips:[1,'red']});
		}else if(parseFloat(dicJeValModal) >= parseFloat(proJeModal)|| parseFloat(dicJeValModal) == parseFloat(0)){
			layer.tips('折扣金额不能大于等于原商品金额且不能等于0','#dicJeValModal',{tips:[1,'red']});
		}else{
			var dicJe;
			var dicSe;
			var dicVal;
			//计算折扣额，税额
			if(0 == hsbz){
				//折扣率
				dicVal = math.divide(dicJeValModal,proJeModal);
				dicSe = math.multiply(dicJeValModal,taxRate);
			}else{
				var totalTaxVal = math.add(taxRate,1);
				var temVal = math.divide(jshj,totalTaxVal);
				//折扣率
				dicVal = math.divide(dicJeValModal,jshj);
				dicJe = math.divide(dicJeValModal,totalTaxVal);
				dicSe = math.multiply(dicJe,taxRate);
			}
			$("#dicTaxModal").val(math.multiply(dicVal,100).toFixed(3));
			$("#dicTaxModalExact").val(dicVal);
			$("#dicJeValModal").val(parseFloat(dicJeValModal).toFixed(2));
			$("#dicSeModal").val(dicSe.toFixed(2));
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
	dicJeValModal = math.multiply(dicJeValModal,-1);
	dicSeModal = math.multiply(dicSeModal,-1);
	/*//判断含税标识
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
	}*/
	var strs = [];
	strs.push('<tr class="item-list" id="'+id+'_1">');
	strs.push('<td class="column-invoice-check" align="center"><input type="checkbox" name="checkTr"/></td>');
	strs.push('<td class="column-invoice-goods" colspan="3"><label disabled="disabled">'+discName+'</label>');
	strs.push('<label id="taxRateValue'+id+'_1" name="taxRateValue'+id+'_1" style="display:none;">'+dicTaxModalExact+'</label></td>');
	strs.push('<td class="column-invoice-model"></td>');
	strs.push('<td class="column-invoice-company"></td>');
	strs.push('<td class="column-invoice-number"></td>');
	strs.push('<td class="column-invoice-price" colspan="2"></td>');
	strs.push('<td class="column-invoice-money" colspan="2"><input type="text" id="totalPrice'+id+'_1" name="totalPrice" value="'+dicJeValModal+'" disabled="disabled"/></td>');
	strs.push('<td class="column-invoice-taxes"><label id="proTaxRate'+id+'_1">'+proTaxRateText+'</label></td>');
	strs.push('<td class="column-invoice-tax"><input type="text" id="sePrice'+id+'_1" name="sePrice" value="'+dicSeModal+'" disabled="disabled"/></td>');
	strs.push('</tr>');
	var trHtml = strs.join("");
	return trHtml;
}

//table增加商品行
var index = 1;
function addProTr(){
	var proTrs = $("input[name=checkTr]");
	if(proTrs.size() >= 17){
		layer.alert('温馨提示：连接税控盘设备的，开票明细超过18条将开票失败',{icon:2,title:['',true],skin:'newLayer'}, function(){
    		layer.closeAll();
		});
	}
	index++;
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
	     		taxClassificationCode:function(){return $("#taxClassificationCode"+index+"").text();},
	     		taxClassificationName:function(){return $("#productName"+index+"").val();}
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
		totalPriceVali:true,
		balanceTotalVali:true,
		messages:{
		  required:totalPriceNotEmptyErrMsg,
		  totalPriceVali:totalPriceRegexErrMsg,
		  balanceTotalVali:'总金额需大于扣除额'
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

//差额框确定按钮
function balanceBtnFun(){
	var balanceTotal = $("#balanceTotalInp").val();
	if(balanceTotal){
		if(twoPosiDecRegex.test(balanceTotal) && parseFloat(balanceTotal) > parseFloat(0)){
			$("#balanceTotalHid").val(balanceTotal);
			$("#balanceTotalLab").text(balanceTotal);
			$("#balanceTotalInp").val("");
			layer.closeAll();
			$("#balanceBtn").hide();
		}else{
			layer.tips('请输入不超过8位的正数，可保留2位小数','#balanceTotalInp',{tips:[1,'red']});
		}
	}else{
		layer.tips('扣除金额不能为空','#balanceTotalInp',{tips:[1,'red']});
	}
}

//计算函数
//光标离开数量时进行相应计算
function countQuPrSeByQu(index){
	var quantity = $("#quantity"+index+"").val();
	var price = $("#price"+index+"").val();
	var totalPrice = $("#totalPrice"+index+"").val();
	if(quantity != '' && eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
		if(price == '' && totalPrice == ''){
			$("#hjje").val("");
			$("#hjse").val("");
			$("#jshjxx").val("");
			$("#jshjdx").val("");
		}else if(price != '' && totalPrice == ''){
			if(eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				totalPrice = parseFloat(totalPrice).toFixed(2);
				if(twoPosiDecRegex.test(totalPrice)){
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("商品金额过大，请检查当前商品行的单价或数量","#totalPrice"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
			}
		}else if(price == '' && totalPrice != ''){
			if(twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0)){
				price = math.divide(math.bignumber(totalPrice),math.bignumber(quantity));
				price = $Utils.checkInt(""+price+"");
				if(eightDecRegex.test(price)){
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					countSePrice(index);
				}else{
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					layer.tips("单价位数过长，请检查当前商品行的数量或金额","#price"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入不超过8位的正数，可保留2位小数","#totalPrice"+index+"",{tips:[1,'red']});
			}
		}else{
			if(eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				totalPrice = parseFloat(totalPrice).toFixed(2);
				if(twoPosiDecRegex.test(totalPrice)){
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("商品金额过大，请检查当前商品行的单价或数量","#totalPrice"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
			}
		}
	}else{
		layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
	}
}

//光标离开单价时进行相应计算
function countQuPrSeByPr(index){
	var quantity = $("#quantity"+index+"").val();
	var price = $("#price"+index+"").val();
	var totalPrice = $("#totalPrice"+index+"").val();
	if(price != '' && eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
		if(quantity == '' && totalPrice == ''){
			$("#hjje").val("");
			$("#hjse").val("");
			$("#jshjxx").val("");
			$("#jshjdx").val("");
		}else if(quantity != '' && totalPrice == ''){
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				totalPrice = parseFloat(totalPrice).toFixed(2);
				if(twoPosiDecRegex.test(totalPrice)){
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("商品金额过大，请检查当前商品行的单价或数量","#totalPrice"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}else if(quantity == '' && totalPrice != ''){
			if(twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0)){
				quantity = math.divide(math.bignumber(totalPrice),math.bignumber(price));
				quantity = $Utils.checkInt(""+quantity+"");
				if(eightDecRegex.test(quantity)){
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val(quantity);
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					countSePrice(index);
				}else{
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val(quantity);
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					layer.tips("数量位数过长，请检查当前商品行的单价或数量","#quantity"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入不超过8位的正数，可保留2位小数","#totalPrice"+index+"",{tips:[1,'red']});
			}
		}else{
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				totalPrice = math.multiply(math.bignumber(quantity),math.bignumber(price));
				totalPrice = parseFloat(totalPrice).toFixed(2);
				if(twoPosiDecRegex.test(totalPrice)){
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					countSePrice(index);
				}else{
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(totalPrice);
					layer.tips("商品金额过大，请检查当前商品行的单价或数量","#totalPrice"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}
	}else{
		layer.tips("单价为小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
	}
}

//鼠标离开金额后进行相应计算
function countQuPrSeByTotal(index){
	var quantity = $("#quantity"+index+"").val();
	var price = $("#price"+index+"").val();
	var totalPrice = $("#totalPrice"+index+"").val();
	if(totalPrice && parseFloat(totalPriceFlag) == parseFloat(totalPrice)){
		return;
	}
	if(totalPrice != '' && twoPosiDecRegex.test(totalPrice) && parseFloat(totalPrice) > parseFloat(0)){
		if(quantity == '' && price == ''){
			$("#hjje").val("");
			$("#hjse").val("");
			$("#jshjxx").val("");
			$("#jshjdx").val("");
//			countSePrice(index);
		}else if(quantity == '' && price != ''){
			if(eightDecRegex.test(price) && parseFloat(price) > parseFloat(0)){
				quantity = math.divide(math.bignumber(totalPrice),math.bignumber(price));
				quantity = $Utils.checkInt(""+quantity+"");
				if(eightDecRegex.test(quantity)){
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val(quantity);
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					countSePrice(index);
				}else{
					$("#price"+index+"").val($Utils.checkInt(""+price+""));
					$("#quantity"+index+"").val(quantity);
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					layer.tips("数量位数过长，请检查当前商品行的单价或数量","#quantity"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#price"+index+"",{tips:[1,'red']});
			}
		}else if(quantity != '' && price == ''){
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				price = math.divide(math.bignumber(totalPrice),math.bignumber(quantity));
				price = $Utils.checkInt(""+price+"");
				if(eightDecRegex.test(price)){
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					countSePrice(index);
				}else{
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					layer.tips("单价位数过长，请检查当前商品行的数量或金额","#price"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}else{
			if(eightDecRegex.test(quantity) && parseFloat(quantity) > parseFloat(0)){
				price = math.divide(math.bignumber(totalPrice),math.bignumber(quantity));
				price = $Utils.checkInt(""+price+"");
				if(eightDecRegex.test(price)){
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					countSePrice(index);
				}else{
					$("#price"+index+"").val(price);
					$("#quantity"+index+"").val($Utils.checkInt(""+quantity+""));
					$("#totalPrice"+index+"").val(parseFloat(totalPrice).toFixed(2));
					layer.tips("单价位数过长，请检查当前商品行的数量或金额","#price"+index+"",{tips:[1,'red']});
				}
			}else{
				layer.tips("请输入小数点前后不超过8位的正数","#quantity"+index+"",{tips:[1,'red']});
			}
		}
	}else{
		layer.tips("请输入不超过8位的正数，可保留2位小数","#totalPrice"+index+"",{tips:[1,'red']});
	}
}

//计算商品税额
function countSePrice(index){
	var countPrice = $("#totalPrice"+index+"").val();
	if(countPrice){
		var taxRate = $("#taxRate"+index+" option:selected").val();
		var balanceTotal = $("#balanceTotalHid").val();
		if(parseFloat(balanceTotal) >= parseFloat(countPrice)){
			layer.tips('总金额需大于扣除额','#totalPrice'+index+'',{tips:[1,'red']});
			return;
		}
		if(!taxRate){
			return;
		}
		if(0 == hsbz || "0" == hsbz){
			/*var totalTaxVal = math.add(taxRate,1);
			//将差额转化为不含税
			var balacneTotalNoTax = math.divide(balanceTotal,totalTaxVal);
			//计算差额的税额
			var balacneSe = math.multiply(balacneTotalNoTax,taxRate);
			//计算商品的税额
			var sePrice = math.multiply(countPrice,taxRate);
			//计算税额只差
			var ceSe = math.subtract(balacneSe,sePrice);
			//计算价税合计
			var jshj = math.add(countPrice,ceSe);
			//计算税额
			var ce = math.subtract(jshj,balanceTotal);
			var temVal = math.divide(ce,totalTaxVal);
			var se = math.multiply(temVal,taxRate);
			var proJe = math.subtract(jshj,se);
			var quantity = $("#quantity"+index+"").val();
			var price = math.divide(proJe,quantity);
			$("#price"+index+"").val(price.toFixed(8));
			totalPriceFlag = proJe.toFixed(2);
			$("#totalPrice"+index+"").val(proJe.toFixed(2));
			$("#sePrice"+index+"").val(se.toFixed(2));*/
			var ce = math.subtract(math.bignumber(countPrice),math.bignumber(balanceTotal));
			var se = math.multiply(math.bignumber(ce),math.bignumber(taxRate));
			$("#sePrice"+index+"").val(se.toFixed(2));
		}else if(1 == hsbz || "1" == hsbz){
			countPrice = math.subtract(math.bignumber(countPrice),math.bignumber(balanceTotal));
			//换算为不含税金额
			var totalTaxVal = math.add(math.bignumber(taxRate),math.bignumber(1));
			countPrice = math.divide(math.bignumber(countPrice),math.bignumber(totalTaxVal));
			//计算税额
			var sePrice = math.multiply(math.bignumber(countPrice),math.bignumber(taxRate));
			$("#sePrice"+index+"").val(sePrice.toFixed(2));
		}
		countAllPrice();
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
	addProTr();
}

//组装数据
function buildData(){
	if(hsbz == 1){
		$("#noTax").attr("checked","checked");
		taxOrNoTaxCe();
	}
	//发票类型
	var radioId = $('input:radio[name="invoiceType"]:checked').attr("id");
	var invoiceType;
	switch(radioId){
		case "eleInvoice":
			invoiceType = "ELE_INVOICE";
			break;
		case "paperInvoice":
			invoiceType = "PAPER_INVOICE";
			break;
		case "paperSpecialInvoice":
			invoiceType = "SPECIAL_INVOICE";
			break;
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
			product.kcje = $Utils.handleUndefined($("#balanceTotalHid").val());
			formProArr.push(product);
			var discId = $("#"+id+"_1");
			if(discId.length != 0){
				var dicProduct = {};
				dicProduct.xmmc = $.trim($Utils.handleUndefined($("#productName"+id+"").val()));
				dicProduct.spbm = $Utils.handleUndefined($("#taxClassificationCode"+id+"").text());
				dicProduct.ggxh = $.trim($Utils.handleUndefined($("#specificationModel"+id+"").val()));
				dicProduct.xmdw = $.trim($Utils.handleUndefined($("#meteringUnit"+id+"").val()));
				dicProduct.xmsl = $Utils.handleUndefined($("#quantity"+id+"").val());
				dicProduct.xmdj = $Utils.handleUndefined($("#price"+id+"").val());
				dicProduct.xmje = $Utils.handleUndefined($("#totalPrice"+id+"_1").val());
				dicProduct.sl = $Utils.handleUndefined($("#taxRate"+id+"").val());
				dicProduct.se = $Utils.handleUndefined($("#sePrice"+id+"_1").val());
				dicProduct.taxRate = $Utils.handleUndefined($("#taxRate"+id+"").find("option:selected").text());
				dicProduct.hsbz = hsbz;
				dicProduct.discountRate = $("#taxRateValue"+id+"_1").text();
				formProArr.push(dicProduct);
			}
		}
	})
	var invoiceData = JSON.stringify({
						invoiceType: invoiceType,
						invoiceItemList: formProArr,
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
	if($("#makeInvoiceTaxCatForm").valid()){
		var proTrs = $("input[name=checkTr]");
		if(proTrs.size() <= 100){
			//提交后,禁用按钮
			$("#saveDzfpBtn").attr("disabled","disabled"); 
			$("#saveMakeDzfpBtn").attr("disabled","disabled");
			var index = layer.load(2, {shade: [0.5,'#000']}); //0.5透明度的白色背景
			var actionUrl = basePath+"balanceInvoice/saveBalanceInvoice"+suffix;
		
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
						$("#succMsg").text("发票保存成功！");
						var dakai = layer.open({
							  title : false,
							  type: 1, 
							  closeBtn: 0, //不显示关闭按钮
							  shadeClose: true, //开启遮罩关闭
							  content: $("#succModal")
						});
						clearAll();
//						$("#balanceBtn").show();
						$("#balanceTotalLab").text("");
			        }else if(data.code == 403){
			        	$("#failMsg").text("发票保存失败！");
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

//保存开具发票
function saveMakeDzfp(){
	if($("#makeInvoiceTaxCatForm").valid()){
		var proTrs = $("input[name=checkTr]");
		if(proTrs.size() <= 100){
			$("#saveDzfpBtn").attr("disabled","disabled"); 
			$("#saveMakeDzfpBtn").attr("disabled","disabled");
			var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
			var actionUrl = basePath+"balanceInvoice/saveAndMakeBalanceInvoice"+suffix;
		
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
						$("#succMsg").text("开票信息提交成功，系统将自动为您开具发票");
						var dakai = layer.open({
							  title : false,
							  type: 1, 
							  closeBtn: 0, //不显示关闭按钮
							  shadeClose: true, //开启遮罩关闭
							  content: $("#succModal")
						});
						clearAll();
//						$("#balanceBtn").show();
						$("#balanceTotalLab").text("");
			        }else if(data.code == 403){
			        	$("#failMsg").text(data.msg);
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

