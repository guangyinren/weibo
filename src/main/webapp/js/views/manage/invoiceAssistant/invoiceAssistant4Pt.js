var keyCodeStr = "";
var realCode = "";
$(function () {
	document.getElementById("qrCodeUrl").focus();
	$("#qrCodeUrl").on("keydown", function(e) {
		//e.keyCode||e.which||e.charCode
        var keyCode = e.keyCode;
        if(keyCode==13){
        	queryInvoiceByQrcode();
        }
	});
	$.validator.setDefaults({
	    success: "valid"
	});

	var validator1 = $("#invoiceQueryForm").validate({
	    onfocusout : function(element) {
	      $(element).valid();
	    },
	    onfocusin : function(element) {
	      if (this.settings.focusCleanup) {
//		        $("#" + $(element).attr("id") + "_tip").text("");
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
	
	$('.tabs>div').click(function () {
        var index = $('.tabs>div').index(this)
        $('.tabs>div').removeClass('active')
        $(this).addClass('active')
        if (index == 0) {
        	$('.content2,.content3,.content4,.scan-result,.tips1,.tips2').hide();
            $('.content1').show();
            $("#qrCodeUrl").val("");
            document.getElementById("qrCodeUrl").focus();
            $("#fpDm").rules("remove");
            $("#fpHm").rules("remove");
            $("#jshj").rules("remove");
        } else {
            $('.content1,.content2,.content4,.scan-result,.tips1,.tips2').hide();
            $('.content3').show();
            $("#qrCodeUrl").val("");
            $("#fpDm").rules("add",{
           	 required:true,
           	 fpdmVali:true,
           	 messages:{
           	  required:"发票代码不能为空",
           	  fpdmVali:"请输入正确格式的发票代码"
           	 }
           })
           $("#fpHm").rules("add",{
           	 required:true,
           	 fphmVali:true,
           	 messages:{
           	    required:"发票号码不能为空",
           	    fphmVali:"请输入正确格式的发票号码"
           	 }
           })
           $("#jshj").rules("add",{
           	 required:true,
           	 twoDecVali:true,
           	 messages:{
           	  required:"价税合计不能为空",
           	  twoDecVali:"请输入不超过8位的数字，可保留2位小数"
           	}
           })
        }
    })
});

var makeInvoiceUrl = "";
var qrcodeInfo = "";
var dataItem;
//扫码查询
function queryInvoiceByQrcode(){
	var noMakeFlag= false;
	var qrcodeUrl = $("#qrCodeUrl").val();
	var flag = "";
	if(qrcodeUrl.indexOf("vpiaotong") != -1){
		flag = "pt";
		var startIndex = qrcodeUrl.lastIndexOf("/") + 1;
		var endIndex = qrcodeUrl.length-3;
		qrcodeInfo = qrcodeUrl.substring(startIndex,endIndex);
	}else if(qrcodeUrl.indexOf("10") != -1){
		flag = "in";
		qrcodeInfo = qrcodeUrl.substring(6,27);
	}else{
		layer.alert("请扫描正确的二维码",{icon:2,closeBtn: 0}, function(){
			$("#qrCodeUrl").val("");
    		layer.closeAll();
		});
		return;
	}
	if(!qrcodeInfo){
		layer.alert("请扫描正确的二维码",{icon:2,closeBtn: 0}, function(){
			$("#qrCodeUrl").val("");
    		layer.closeAll();
		});
	}
	$.ajax({
		url:basePath+"foreignInvoiceQuery/queryByPtQrcodeInfo"+suffix,
		data:{
			flag : flag,
			qrcodeInfo : qrcodeInfo
		},
		type:"get",
		success:function(data){
			$('.content1,.content3').hide();
			if("200"==data.code){
					if(data.data.data){
						dataItem = data.data.data;
						if(data.data.data.useFlag){
							var item = data.data.data.rows[0];
							var strs = [];
							if(item.kpzt =='MAKEINVOICEING' || item.kpzt =='NOMAKEINVOICE'){
								strs.push('<tr>');
		                        strs.push('<td>'+number+'</td>');
		                        strs.push('<td></td>');
		                        strs.push('<td></td>');
		                        strs.push('<td>'+item.gmfMc+'</td>');
		                        strs.push('<td>'+parseFloat(item.jshj).toFixed(2)+'</td>');
		                        strs.push('<td>'+(item.kprq).substring(0,10)+'</td>');
		                        strs.push('<td>开票中</td>');
		                        strs.push('<td>');
		                    	strs.push('</td>');
		                        strs.push('</tr>');
	                        }else if(item.kpzt =='MAKEINVOICEFAIL'){
	                        	strs.push('<tr>');
		                        strs.push('<td>'+number+'</td>');
		                        strs.push('<td></td>');
		                        strs.push('<td></td>');
		                        strs.push('<td>'+item.gmfMc+'</td>');
		                        strs.push('<td>'+parseFloat(item.jshj).toFixed(2)+'</td>');
		                        strs.push('<td>'+(item.kprq).substring(0,10)+'</td>');
		                        strs.push('<td>开票失败</td>');
		                        strs.push('<td>');
		                    	strs.push('</td>');
		                        strs.push('</tr>');
	                        }else if(item.kpzt =='MAKEINVOICESUCCESS'){
	                        	strs.push('<tr>');
	                            strs.push('<td>'+number+'</td>');
	                            strs.push('<td>'+item.fpDm+'</td>');
	                            strs.push('<td>'+item.fpHm+'</td>');
	                            strs.push('<td>'+item.gmfMc+'</td>');
	                            strs.push('<td>'+parseFloat(item.jshj).toFixed(2)+'</td>');
	                            strs.push('<td>'+(item.kprq).substring(0,10)+'</td>');
	                            strs.push('<td>');
	                        	strs.push('<a href="javascript:void(0)" onclick="viewInvoiceFun(\''+item.fpqqlsh+'\')">查看</a>&nbsp;&nbsp;&nbsp;&nbsp;');
	                        	strs.push('<a href="javascript:void(0)" onclick="printInvoiceFun(\''+item.fpqqlsh+'\')">打印</a>');
	                        	strs.push('</td>');
	                            strs.push('</tr>');
	                        }
						}else{
							$("#noMakeCountLab").text(parseFloat(data.data.data.availableAmount).toFixed(2));
							$('.scan-result,.no-create').show();
							if(!data.data.data.moreFlag){
								$('#immeMakeBtn').show();
							}
						}
					}
			}else{
				$('.tips tips1').show();
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			layer.alert('系统繁忙,请稍候再试',{icon:2}, function(){
        		layer.closeAll();
			});  
	    }
	})
}


//手工查询
function queryInvoiceByHandWork() {
	if($("#invoiceQueryForm").valid()){
		var fpDm = $("#fpDm").val();
		var fpHm = $("#fpHm").val();
		var jshj = $("#jshj").val();
	    $.ajax({
			url:basePath+"foreignInvoiceQuery/queryByInvoiceInfo"+suffix,
			data:{
				fpDm : fpDm,
	            fpHm : fpHm,
	            jshj : jshj
			},
			type:"get",
			success:function(data){
				$('.content3').hide();
				if("200"==data.code){
					$('.content4').show();
					$('#handWorkInvoiceImg').attr("src","data:image/png;base64," + data.msg);
				}else{
					$('.content3').hide();
					$('.tips2').show();
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				layer.alert('系统繁忙,请稍候再试',{icon:2}, function(){
	        		layer.closeAll();
				});  
		    }
		})
	}
}

//扫码查询打印
function qrcodePrint(){
	$("#qrcodeInvoiceImgDiv").jqprint({
	     debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
	     importCSS: false, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
	     printContainer: false, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
	     operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
	})
}

//手工查询打印
function handWorkPrint(){
	$("#handWorkInvoiceImgDiv").jqprint({
	     debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
	     importCSS: false, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
	     printContainer: false, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
	     operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
	})
}

//重新扫描
function backToScan(){
	$('.content1').show();
	$("#qrCodeUrl").val("");
	$('.content2,.content3,.content4,.content5').hide();
	$('.tips1').hide();
	$('.scan-result').hide();
	$('.content-mobile').hide();
	document.getElementById("qrCodeUrl").focus();
}

function backToQuery() {
    $('.content3').show();
    $('.content4').hide();
    $('.tips1,.tips2').hide();
    $("#fpDm").val("");
	$("#fpHm").val("");
	$("#jshj").val("");
}

//查看
function viewInvoiceFun(fpqqlsh){
	$('.scan-result').hide();
	$("#qrcodeInvoiceImg").attr("src",basePath+"foreignInvoiceQuery/getPdfImgByte/"+fpqqlsh+suffix);
	$('.content2').show();
}

//打印
function printInvoiceFun(fpqqlsh){
	$("#qrcodeInvoiceImg").attr("src",basePath+"foreignInvoiceQuery/getPdfImgByte/"+fpqqlsh+suffix);
	qrcodePrint();
}

//返回
function backup(){
	$('.scan-result').show();
	$('.content2').hide();
}

var invoiceItemIdList = new Array();
//立即开票
function immeMake(){
	$('.scan-result').hide();
	var jshj = parseFloat(dataItem.availableAmount).toFixed(2);
	$("#receivableAmount").val(jshj);
	$("#enterpriseName").val(dataItem.enterpriseName);
	//填充开票项目
	var strs = [];
	$(".invoicePrint_item_r").empty();
	Array.prototype.forEach.call(dataItem.goodsDetails, function (item, index, array) {
		invoiceItemIdList = new Array();
		strs.push('<div class="invoicePrint_item_ft">');
        strs.push('<div class="item_ft_name">');
        strs.push(''+item.invoiceItemName+'');
        strs.push('</div>');
        strs.push('<div class="item_ft_money">');
        strs.push('<td>'+parseFloat(item.invoiceItemAmount).toFixed(2)+'</td>');
        strs.push('</div>');
        strs.push('</div>');
        invoiceItemIdList.push(item.id);
	});
	$(".invoicePrint_item_r").append(strs.join(""));
	$('.content5').show();
	$("#gmfMc").rules("add",{
     	 required:true,
     	 gmfMcVali:true,
     	 messages:{
     	    required:mcNotEmptyErrMsg,
     	    gmfMcVali:mcRegexErrMsg
     	 }
    })
    $("#gmfNsrsbh").rules("add",{
     	 required:false,
     	 nsrsbhVali:true,
     	 messages:{
     	    required:taxpayerNumNotEmptyErrMsg,
     	    nsrsbhVali:taxpayerNumRegexErrMsg
     	 }
    })
    $("#sprSjh").rules("add",{
     	 required:false,
     	 mobileVali:true,
     	 messages:{
     	    required:mobileNotEmptyErrMsg,
     	    mobileVali:mobileRegexErrMsg
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
}

//开票iframe返回
function iframeBackup(){
	$('.content-mobile').hide();
	$('.scan-result').show();
}

//开票
function makeInvoice(){
	var gmfMc = $("#gmfMc").val();
	var gmfNsrsbh = $("#gmfNsrsbh").val();
	var sprSjh = $("#sprSjh").val();
	var sprYx = $("#sprYx").val();
	var receivableAmount = $("#receivableAmount").val();
	//校验
	if($("#invoiceQueryForm").valid()){
		//账单id
		$.ajax({
			url:basePath+"foreignInvoiceQuery/makeInvoice4Pt"+suffix,
			data:JSON.stringify({
				qrcodeId : qrcodeInfo,
				buyerName : gmfMc,
				buyerTaxNo : gmfNsrsbh,
				buyerMobile : sprSjh,
				buyerEmail : sprYx,
				invoiceAmount : receivableAmount,
				invoiceItemIdList : invoiceItemIdList
			}),
			type:"post",
			contentType:"application/json;charset=UTF-8",
			success:function(data){
				if("200"==data.code){
					$('.content4').show();
					$('#handWorkInvoiceImg').attr("src","data:image/png;base64," + data.msg);
				}else{
					$('.content3').hide();
					$('.tips2').show();
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				layer.alert('系统繁忙,请稍候再试',{icon:2}, function(){
	        		layer.closeAll();
				});  
		    }
		})
	}
}