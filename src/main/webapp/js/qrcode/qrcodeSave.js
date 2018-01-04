$(function(){
	//生成开票二维码 可选择开票种类查询
	
	//var joker=$("#ele_Invoice").val();
	
//	$("#paper_invoice_ck").val() = $("#paper_Invoice").val();
//	$("#special_invoice_ck").val() = $("#special_Invoice").val();
	
	
    $.ajax({
		type:"GET",
		url:basePath+"qrcode/queryIssueOption"+suffix,
		dataType:"json",
		success:function(result){
			console.log(result)
			if(result.code == 200){
				 eleInvoiceKind = document.getElementById("ele_Invoice");
				 paperInvoiceKind = document.getElementById("paper_Invoice");
				 specialInvoiceKind = document.getElementById("special_Invoice");
				var fpKind = result.data.rows;
				for(var i=0;i<fpKind.length;i++){
					if(fpKind[i].invoiceType=="10"){
						if(fpKind[i].diskType=="SKP"){
							$("#ele_Invoice").append("<option value='"+fpKind[i].invoiceType+"|"+fpKind[i].extensionNum+"|"+fpKind[i].diskType+"|"+fpKind[i].machineCode+"'>"+fpKind[i].extensionNum+"号税控盘，编号"+fpKind[i].machineCode+"</option>")
						}else if(fpKind[i].diskType=="JSP"){
							//eleInvoiceKind.options.add(new Option(fpKind[i].extensionNum+'号金税盘，编号'+fpKind[i].machineCode))
							$("#ele_Invoice").append("<option value='"+fpKind[i].invoiceType+"|"+fpKind[i].extensionNum+"|"+fpKind[i].diskType+"|"+fpKind[i].machineCode+"'>"+fpKind[i].extensionNum+"号金税盘，编号"+fpKind[i].machineCode+"</option>")
						}
					}else if(fpKind[i].invoiceType=="04"){
						if(fpKind[i].diskType=="SKP"){
							//paperInvoiceKind.options.add(new Option(fpKind[i].extensionNum+'号税控盘，编号'+fpKind[i].machineCode))
							$("#paper_Invoice").append("<option value='"+fpKind[i].invoiceType+"|"+fpKind[i].extensionNum+"|"+fpKind[i].diskType+"|"+fpKind[i].machineCode+"'>"+fpKind[i].extensionNum+"号税控盘，编号"+fpKind[i].machineCode+"</option>")
						}else if(fpKind[i].diskType=="JSP"){
							//paperInvoiceKind.options.add(new Option(fpKind[i].extensionNum+'号金税盘，编号'+fpKind[i].machineCode))
							$("#paper_Invoice").append("<option value='"+fpKind[i].invoiceType+"|"+fpKind[i].extensionNum+"|"+fpKind[i].diskType+"|"+fpKind[i].machineCode+"'>"+fpKind[i].extensionNum+"号金税盘，编号"+fpKind[i].machineCode+"</option>")
						}
					}else if(fpKind[i].invoiceType=="01"){
						if(fpKind[i].diskType=="SKP"){
							//specialInvoiceKind.options.add(new Option(fpKind[i].extensionNum+'号税控盘，编号'+fpKind[i].machineCode))
							$("#special_Invoice").append("<option value='"+fpKind[i].invoiceType+"|"+fpKind[i].extensionNum+"|"+fpKind[i].diskType+"|"+fpKind[i].machineCode+"'>"+fpKind[i].extensionNum+"号税控盘，编号"+fpKind[i].machineCode+"</option>")
						}else if(fpKind[i].diskType=="JSP"){
							//specialInvoiceKind.options.add(new Option(fpKind[i].extensionNum+'号金税盘，编号'+fpKind[i].machineCode))
							$("#special_Invoice").append("<option value='"+fpKind[i].invoiceType+"|"+fpKind[i].extensionNum+"|"+fpKind[i].diskType+"|"+fpKind[i].machineCode+"'>"+fpKind[i].extensionNum+"号金税盘，编号"+fpKind[i].machineCode+"</option>")
						}
					}
				}
				
			}
		}
	})


	// 管理开票二维码查询
	$.ajax({
		type: "GET",
		url: basePath+"invoiceItem/queryInvoiceItemList"+suffix,
		dataType: "json",
		success: function(data) {
			if ("200" == data.code) {
				var rows = data.data.rows;
				var total = data.data.total;
				var selectObj = document.getElementById("invoiceItem");
				if(total > 1){
					Array.prototype.forEach.call(rows,function(item,index,array) {
						selectObj.options.add(new Option(item.itemName,item.id));
		            })
				}else if(total == 1){
					selectObj.options.remove(0);
					Array.prototype.forEach.call(rows,function(item,index,array) {
						selectObj.options.add(new Option(item.itemName,item.id));
		            })
				}else if(total == 0){
					layer.confirm("请前往开票项目管理新增", {
						title:'提示', closeBtn: true,btn: ['确定'] //按钮
					}, function(){
						window.parent.addTab('开票项目管理','/pages/manage/invoiceItem/invoiceItemQuery.shtml','icon-s7');
						window.parent.closeCurrTab('生成开票二维码');
					});
				}
				//默认用户上一次的选项
				initUserOption();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.alert('系统繁忙,请稍候再试', {
				icon: 2,title:["",true],skin:"newLayer"
			}, function() {
				layer.closeAll();
			});
		}
	})
})

$.validator.setDefaults({
    success: "valid"
});

var validator = $("#qrcodeForm").validate({
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

$("#invoiceItem").rules("add",{
	required:true,
	invoiceItemVali:true,
	messages:{
	  required:"开票项目不能为空",
	  invoiceItemVali:"开票项目不能为空"
	}
})

$("#moneySum").rules("add",{
	 required:true,
	 moneySumVali:true,
	 messages:{
		 required:"待开票金额不能为空",
		 moneySumVali:"待开票金额只能为正数，小数点前不超过8位，可保留2位小数"
	}
})

//收款人校验
$("#casherName").rules("add",{
	required:false,
	personalNameVali:true,
	messages:{
	  required:skrNotEmptyErrMsg,
	  personalNameVali:skrRegexErrMsg
	}
})
//复核人校验
$("#reviewerName").rules("add",{
	required:false,
	fhrVali:true,
	messages:{
	  required:fhrNotEmptyErrMsg,
	  fhrVali:fhrRegexErrMsg
	}
})

//开票项目验证规则
jQuery.validator.addMethod("invoiceItemVali", function(value, element) { 
	var length = value.length; 
	return length > 0; 
}, "请填写正确格式的数字");
 
//待开票金额验证规则
jQuery.validator.addMethod("moneySumVali", function(value, element) { 
	if(parseFloat(value) == parseFloat(0)){
		return false;
	}else{
		if(!isNaN(value)){
			var twoDec = /^[0-9]{1,8}(\.[0-9]{1,2})?$/; 
			if(twoDec.test(value)){
				if (parseInt(value)==value){
					value = parseInt(value);
					$("#moneySum").val($Utils.checkInt(value));
				}else{
					value = parseFloat(value);
					$("#moneySum").val($Utils.checkInt(value));
				}
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
}, "请填写正确格式的数字");

//默认用户上一次的选项
function initUserOption(){
	var itemId = CookieObj.getCookie("itemId");
	var makeInvoiceCount = CookieObj.getCookie("makeInvoiceCount");
	var smsFlag = CookieObj.getCookie("smsFlag");
	var expiredays = CookieObj.getCookie("expiredays");
	var cashName = CookieObj.getCookie("casherName");
	var reviewerName = CookieObj.getCookie("reviewerName");
	var drawerName = $("#b_index",window.top.document).text();
	$("#invoiceItem").val(itemId);
	$("#makeInvoiceCount").val(makeInvoiceCount);
	$("#smsFlag").val(smsFlag);
	$("#expiredays").val(expiredays);
	$("#casherName").val(cashName);
	$("#reviewerName").val(reviewerName);
	$("#drawerName").val(drawerName);
}

//开票项目
var invoiceItem = "";
//保存
function makeInvoiceQrcode(){
	$("#ele_invoice_ck").val($("#ele_Invoice").val())
	$("#paper_invoice_ck").val($("#paper_Invoice").val())
	$("#special_invoice_ck").val($("#special_Invoice").val())
	
	
//	var veta1 = $("#ele_invoice_ck").val().split('|')
//	var choiceInvoiceObj1 = {};
//	choiceInvoiceObj1.invoiceType = veta1[0];
//	choiceInvoiceObj1.extensionNum = veta1[1];
//	choiceInvoiceObj1.diskType = veta1[2];
//	choiceInvoiceObj1.machineCode = veta1[3];
//	
//	var veta2 = $("#paper_invoice_ck").val().split('|')
//	var choiceInvoiceObj2 = {};
//	choiceInvoiceObj2.invoiceType = veta2[0];
//	choiceInvoiceObj2.extensionNum = veta2[1];
//	choiceInvoiceObj2.diskType = veta2[2];
//	choiceInvoiceObj2.machineCode = veta2[3];
//	
//	var veta2 = $("#special_invoice_ck").val().split('|')
//	var choiceInvoiceObj3 = {};
//	choiceInvoiceObj3.invoiceType = veta2[0];
//	choiceInvoiceObj3.extensionNum = veta2[1];
//	choiceInvoiceObj3.diskType = veta2[2];
//	choiceInvoiceObj3.machineCode = veta2[3];
	
	 var invoiceIssueOptionJson = [    
	                      	     //       {invoiceType: "wabiaozai1", extensionNum: 123,diskType: "111",machineCode: "222"},    
	                      	       //     {invoiceType: "wabiaozai2", extensionNum: 123,diskType: "111",machineCode: "222"}    
	                      	     ];		 
	 var choiceInvoiceObj;
	 $("input[name='kx_kp']:checked").each(function(i){//把所有被选中的复选框的值存入数组
		 //invoiceIssueOptionJson[i] =$(this).val()
		 var joker = $(this).val().split("|");
		 var freedom = {};
		 freedom.invoiceType = joker[0];
		 freedom.extensionNum = joker[1];
		 freedom.diskType = joker[2];
		 freedom.machineCode = joker[3];
		 invoiceIssueOptionJson[i] = freedom;
        });
	// invoiceIssueOptionJson.push(choiceInvoiceObj1,choiceInvoiceObj2,choiceInvoiceObj3)
	 
	 if(invoiceIssueOptionJson.length==0){
		 layer.tips('请选择开票种类', '.optional_title', {
			  tips: [1, 'red'],
			  time: 1500
			});
		 return false;
	 }
	

	if($("#qrcodeForm").valid()){
		 $("#save").attr("disabled","disabled");
		 var index = layer.load(2,{shade: [0.5,'#000']}); //0.5透明度的白色背景
		 var id = $("#invoiceItem").val();
		 invoiceItem = $("#invoiceItem").find("option:selected").text();
		 var invoiceAmount = $.trim($("#moneySum").val());
		 var makeInvoiceCount = $.trim($("#makeInvoiceCount").val());
		 var smsFlag = $.trim($("#smsFlag").val());
		 var expiredays = $.trim($("#expiredays").val());
		 var casherName = $.trim($("#casherName").val());
		 var reviewerName = $.trim($("#reviewerName").val());
		 CookieObj.setCookie("itemId",id,30);
		 CookieObj.setCookie("makeInvoiceCount",makeInvoiceCount,30);
		 CookieObj.setCookie("smsFlag",smsFlag,30);
		 CookieObj.setCookie("expiredays",expiredays,30);
		 CookieObj.setCookie("casherName",casherName,30);
		 CookieObj.setCookie("reviewerName",reviewerName,30);
		 
		 $.ajax({
				url:basePath+"/qrcode/makeInvoiceQrcode"+suffix,
				data: {
					 itemId:id,
					 invoiceAmount:invoiceAmount,
					 makeInvoiceCount:makeInvoiceCount,
					 smsFlag:smsFlag,
					 expiredays:expiredays,
					 casherName:casherName,
					 reviewerName:reviewerName,
					 invoiceIssueOptionJson: JSON.stringify(invoiceIssueOptionJson)
				},
				type:"post",
				success:function(data){
					invoiceIssueOptionJson = []
					 layer.close(index);
	          	     $("#save").removeAttr('disabled');
	          	     if(data.code==200){
	          	    	/*layer.alert(data.msg,{icon:1}, function(){
			        		layer.closeAll();
						});*/
	          	    	var item = data.data.data;
	          	    	$("#qrcodeImg").attr("src","data:image/png;base64," + item.qrImgStr);
	          	    	$("#enterpriseName").text(item.enterpriseName);
	          	    	$("#invoiceItemName").text(invoiceItem);
	          	    	$("#invoiceAmount").text(item.invoiceAmount.toFixed(2));
	          	    	$("#tradeTime").text(item.tradeTime);
	          	    	$("#expireday").text(item.expiredays);
	          	    	
	          	    	
	          	    	layer.open({
	          	          id:'o1',
	          	  		skin:'black-lay',
	          	          type: 1,
	          	          title:['开票二维码', 'background: #394457;color:#fff;'],
	          	          content: $('#qrcodeMsg'),
	          	          offset: ['0px'],
	          	          scrollbar: false,
	          	          btn: ['打 印'],btnAlign: 'c',area: 'auto',maxWidth:600,
	          	          yes: function(index, layero){
//	          	  			$("#qrCodeImages").jqprint();
	          	  			$("#qrcodeMsg").jqprint({
	          	  				 debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
	          	  			     importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
	          	  			     printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
	          	  			     operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
	          	  			})
	          	          }
	          	      });
	          	      
	          	    	
	          	    	
	          	    	//$("#qrcodeMsg").show();
	          	    	$("#printQrcode").show();
	          	    	invoiceIssueOptionJson=[]
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

//打印二维码
function printQrcodeFun(){
	$("#qrcodeMsg").jqprint({
	     debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
	     importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
	     printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
	     operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
	})
}

//每页展示条数
var pageSize = 10;
//缓存开票项目
var invoiceQrcodeProductArr = [];
//根据页数查询
function queryByIndex(currentPage){
	var status = $("#invoiceQrcodeMarked").val();
	$.ajax({
		type: "GET",
		url: basePath+"qrcode/queryQrcodeList"+suffix,
		data:{
			pageIndex : currentPage,
			pageSize : pageSize,
			status : status
		},
		dataType: "json",
		success: function(data) {
			invoiceQrcodeProductArr = [];
			if ("200" == data.code) {
				var rows = data.data.rows;
				var total = data.data.total;
				if( total > 0){
					$("#invoice").empty();
					var invoice = $("#invoice")
					Array.prototype.forEach.call(rows,function(item,index,array) {
						var strs=[];
						var number = pageSize*(currentPage-1)+index+1;
						invoiceQrcodeProductArr.push(item.invoiceQrcodeProductList);
						strs.push('<td>'+number+'</td>');
						
						strs.push('<td>'+$Utils.handleUndefined(item.invoiceAmount.toFixed(2))+'</td>');
						strs.push('<td>'+'可选择开票种类'+'</td>')
						strs.push('<td>'+$Utils.handleUndefined(item.invoiceQrcodeProductList[0].invoiceItemName)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.makeInvoiceCount)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(parseInt(item.makeInvoiceCount)-parseInt(item.availableCount))+'</td>');
						if(item.smsFlag){
							strs.push('<td>是</td>');
						}else{
							strs.push('<td>否</td>');
						}
						strs.push('<td>'+$Utils.handleUndefined(item.expiredays)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.tradeTime)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.casherName)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.reviewerName)+'</td>');
						strs.push('<td>'+$Utils.handleUndefined(item.drawerName)+'</td>');
						
						if(item.useFlag){
							strs.push('<td>已使用</td>');
							if(item.invoiceQrcodeProductList.length > 1){
								strs.push('<td><a href="javascript:viewAllInvoiceItem('+index+')"><span>全部开票项目</span></a>');
								strs.push('<a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceQrcodeProductList[0].invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.qrImgStr+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							}else{
								strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceQrcodeProductList[0].invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.qrImgStr+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							}
							strs.push('<a href="javascript:viewInvoiceFun(\''+item.id+'\')"><span>查看发票</span></a></td>');
						}else{
							strs.push('<td>未使用</td>');
							if(item.invoiceQrcodeProductList.length > 1){
								strs.push('<td><a href="javascript:viewAllInvoiceItem('+index+')"><span>全部开票项目</span></a>');
								strs.push('<a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceQrcodeProductList[0].invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.qrImgStr+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							}else{
								strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceQrcodeProductList[0].invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.qrImgStr+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							}
							strs.push('<a href="javascript:deleteQrcodeFun(\''+item.id+'\')"><span>删除</span></a></td>');
						}
						/*if(item.status == 'NOMAKEINVOICE'){
							strs.push('<td>未开票</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							strs.push('<a href="javascript:deleteQrcodeFun(\''+item.id+'\')"><span>删除</span></a></td>');
						}else if(item.status == 'MAKEINVOICEING'){
							strs.push('<td>开票中</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a></td>');
						}else if(item.status == 'MAKEINVOICEFAIL'){
							strs.push('<td>开票失败</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a></td>');
						}else{
							strs.push('<td>开票成功</td>');
							strs.push('<td><a href="javascript:viewQrcodeFun(\''+item.enterpriseName+'\',\''+item.invoiceAmount+'\',\''+item.invoiceItemName+'\',\''+item.tradeTime+'\',\''+item.bytes+'\',\''+item.expiredays+'\')"><span>查看二维码</span></a>');
							strs.push('<a href="javascript:viewInvoiceFun(\''+item.fpqqlsh+'\')"><span>查看发票</span></a></td>');
						}*/
						invoice.append('<tr>'+strs.join("")+'</tr>')
		            })
		            PageWrapper.page($("#page"),total,currentPage,queryByIndex);
				} else {
					$("#invoice").empty();
					$("#page").empty();
					$("#invoice").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.alert('系统繁忙,请稍候再试', {
				icon: 2,title:["",true],skin:"newLayer"
			}, function() {
				layer.closeAll();
			});
		}
	})
}

//查看全部开票项目
function viewAllInvoiceItem(index){
	var allInvoiceItemTabObj = $("#allInvoiceItemTab");
	allInvoiceItemTabObj.empty();
	var rows = invoiceQrcodeProductArr[index];
	Array.prototype.forEach.call(rows,function(item,index,array) {
		var strs=[];
		strs.push('<td>'+$Utils.handleUndefined(item.invoiceItemName)+'</td>');
		strs.push('<td>'+$Utils.handleUndefined(item.taxClassificationCode)+'</td>');
		strs.push('<td>'+$Utils.handleUndefined(item.unitPrice.toFixed(2))+'</td>');
		strs.push('<td>'+$Utils.handleUndefined(item.quantity)+'</td>');
		strs.push('<td>'+$Utils.handleUndefined(item.invoiceItemAmount.toFixed(2))+'</td>');
		allInvoiceItemTabObj.append('<tr>'+strs.join("")+'</tr>')
    })
	$('#listModal').modal('show');
}

//查看二维码
function viewQrcodeFun(enterpriseName,invoiceAmount,invoiceItemName,tradeTime,bytes,expiredays){
	$("#enterpriseName2").text(enterpriseName);
	$("#invoiceAmount2").text(parseFloat(invoiceAmount).toFixed(2));
	$("#invoiceItemName2").text(invoiceItemName);
	$("#tradeTime2").text(tradeTime);
	$("#expiredays2").text(expiredays);
	console.log(bytes)
	$("#qrcodeImg2").attr("src","data:image/png;base64," + bytes);
    layer.open({
        id:'o1',
		skin:'black-lay',
        type: 1,
        title:['开票二维码', 'background: #394457;color:#fff;'],
        content: $('#qrCodeImages'),
        offset: ['0px'],
        scrollbar: false,
        btn: ['打 印'],btnAlign: 'c',area: 'auto',maxWidth:600,
        yes: function(index, layero){
//			$("#qrCodeImages").jqprint();
			$("#qrCodeImages").jqprint({
				 debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
			     importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
			     printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
			     operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
			})
        }
    });
}

//查看发票
function viewInvoiceFun(id){
	$("#selectQrId").val(id);
	layer.open({
		  type: 2,
		  skin:'black-lay',
		  title:['查看发票', 'background: #394457;color:#fff;'],
		  area: ['80%', '95%'],
		  offset: ['10px', '100px'],
		  shadeClose: true, //开启遮罩关闭
		  shade: [0.8, '#393D49'],
		  scrollbar:true,
		  content: ['../qrcode/viewQrcodeInvoice.shtml','yes']
	});
//	window.location.href = basePath + "pages/manage/qrcode/elecInvoiceDetail.shtml?fpqqlsh=" + fpqqlsh;
}

//删除二维码
function deleteQrcodeFun(id){
	layer.confirm("确定要删除该二维码吗？", {
		icon: 0, title:'提示',btn: ['确定','取消'] //按钮
	}, function(index){
		layer.closeAll();
		$.ajax({
			type: "POST",
			url: basePath+"/qrcode/deleteQrcode"+suffix,
			data: {
				id : id
			},
			dataType: "json",
			success: function(data) {
				if ("200" == data.code) {
					layer.alert(data.msg, {
						icon: 1,title:["",true],skin:"newLayer",closeBtn: 0
					}, function() {
						queryByIndex(1);
						layer.closeAll();
					});
				}else{
					layer.alert(data.msg, {
						icon: 2,title:["",true],skin:"newLayer",closeBtn: 0
					}, function() {
						layer.closeAll();
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.alert('系统繁忙,请稍候再试', {
					icon: 2,title:["",true],skin:"newLayer",closeBtn: 0
				}, function() {
					layer.closeAll();
				});
			}
		})	
	}, function(){
		layer.closeAll();
	});
}

