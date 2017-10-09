$(function () {
    //日期控件
	DatetimePicker.startDateLessEndDate($("#startKprq"),"","2016-08-01",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDate($("#endKprq"),"","2016-08-01",new Date(),$("#startKprq"));
	/*DatetimePicker.date($("#startKprq"),"","2016-08-01",new Date());
	DatetimePicker.date($("#endKprq"),"","2016-08-01",new Date());*/
    //当前页数
    var currentIndex = $Utils.getUrlParameters().currentIndex;
    if(currentIndex){
    	queryByIndex(currentIndex);
    }else{
    	queryByIndex(1);
    }
    //查询开票员列表
    $.ajax({
		type:"GET",
		url:basePath+"invoice_query/clerkers"+suffix,
		data:{},
		success:function(data){
			var rows = data.data;
			var c = rows.item.length;
			for (var i = 0; i < c; i++) {
				var name = rows.item[i].clerkName;
				var id = rows.item[i].billingClerkId;
				var selNode = $("#kpr");
				selNode.append("<option value='"+name+"'>"+name+"</option>");
			}
		}
	})
});

var pageSize = 10;
var num = 0;
var currentIndex = 0;

//根据页数查询
function queryByIndex(currentPage) {
	currentIndex = currentPage;
    var kpr = $.trim($("#kpr").val());
    var gmfMc = $.trim($("#gmfMc").val());
    var fpDm = $.trim($("#fpDm").val());
    var fpHm = $.trim($("#fpHm").val());
    var jshj = $.trim($("#jshj").val());
    var jshjStatus = $.trim($("#jshjStatus option:selected").val());
    var startKprq = $.trim($("#startKprq").val());
    var endKprq = $.trim($("#endKprq").val());
    var kpzt = $("#kpzt option:selected").val();
    var printCount = $.trim($("#printCount").val());
    printCount = parseInt(printCount);
    if(isNaN(printCount)){
    	printCount = null;
    }
    var printStatus = $.trim($("#printStatus option:selected").val());
    var chbz = $("#chbz option:selected").val();
    var fpzldm = $("#fpzldmQuery").val();
    $.ajax({
		type:"GET",
		url:basePath+"paperInvoice/queryPaperInvoiceByPage"+suffix,
		data:{
			ver: new Date().getTime(),
            pageIndex: currentPage,
            pageSize: pageSize,
            kpr: kpr,
            gmfMc: gmfMc,
            fpDm: fpDm,
            fpHm: fpHm,
            jshj: jshj,
            jshjStatus: jshjStatus,
            startKprq: startKprq,
            endKprq: endKprq,
            kpzt: kpzt,
            printCount:printCount,
            printStatus:printStatus,
            chbz:chbz,
            fpzldm:fpzldm
		},
		success:function(data){
			if ("200" == data.code) {
                var rows = data.data.rows;
                var total = data.data.total;
                var pageCount = Math.floor((total - 1) / pageSize) + 1;
                if (rows.length > 0) {
                    $("#invoice").empty();
                    Array.prototype.forEach.call(rows, function (item, index, array) {
                        var number = pageSize * (currentPage - 1) + index + 1;
                        var invoice = new Invoice(item, number);
                        $("#invoice").append(invoice.fillPaperListData());
                    });
                    PageWrapper.page($("#page"),total,currentPage,queryByIndex);
                } else {
                    $("#invoice").empty();
                    $("#invoice").html("<td colspan='14' style='text-align: center;'>暂无数据</td>");
                    $("#page").empty();
                }
            }
		}
	})
}

//开票
function makePaperInvoice(fpqqlsh) {
    var index = layer.load(2, {shade: [0.5, '#000']}); //0.5透明度的白色背景
    if (fpqqlsh != undefined && fpqqlsh != "undefined") {
        $.ajax({
            type: "GET",
            url: basePath + "paperInvoice/makePaperInvoice" + suffix,
            data: {
                fpqqlsh: fpqqlsh
            },
            dataType: "json",
            success: function (data) {
                layer.close(index);
                if (data.code == 200) {
					layer.alert(data.msg, {
						icon: 1,title:"提示"
					}, function() {
						layer.closeAll();
					});
//                    $("#succMsg").text("开票信息提交成功，系统将自动为您开具发票");
//					var dakai = layer.open({
//						  title : false,
//						  type: 1, 
//						  closeBtn: 0, //不显示关闭按钮
//						  shadeClose: true, //开启遮罩关闭
//						  content: $("#succModal")
//					});
                } else if (data.code == 403) {
					layer.alert(data.msg, {
						icon: 2,title:"提示"
					}, function() {
						layer.closeAll();
						queryByIndex(1);
					});
//                    $("#failMsg").text(data.msg);
//					var dakai = layer.open({
//						  title : false,
//						  type: 1, 
//						  closeBtn: 0, //不显示关闭按钮
//						  shadeClose: true, //开启遮罩关闭
//						  content: $("#failModal")
//					});
//					queryByIndex(1);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
				layer.alert("系统繁忙,请稍候再试", {
					icon: 2,title:"提示"
				}, function() {
					layer.closeAll();
					queryByIndex(1);
				});
//                $("#failMsg").text("系统繁忙,请稍候再试");
//				var dakai = layer.open({
//					  title : false,
//					  type: 1, 
//					  closeBtn: 0, //不显示关闭按钮
//					  shadeClose: true, //开启遮罩关闭
//					  content: $("#failModal")
//				});
//				queryByIndex(1);
            }
        })
    }
}

//删除未开票的发票
function deletePaperInvoice(fpqqlsh) {
    if (fpqqlsh != undefined && fpqqlsh != "undefined") {
    	layer.confirm("确定要删除该发票吗？", {
    		icon: 0, title:'提示',btn: ['确定','取消'] //按钮
    	}, function(index){
    		layer.closeAll();
    		$.ajax({
        		type:"GET",
        		url:basePath+"invoice/deleteDzfpCg"+suffix,
        		data:{
        			fpqqlsh: fpqqlsh
        		},
        		success:function(data){
        			if(data.code==200){
        				queryByIndex(1);
                        layer.msg('删除成功', {icon: 1, time: 2000}, function () {
                            //do something
                        });
        			}else if (data.code == 403) {
                        layer.msg('删除失败', {icon: 2, time: 2000}, function () {
                            //do something
                        });
                    }
        		}
        	})
    	}, function(){
    		layer.closeAll();
    	});
    }
}

//未开票的编辑
function editPaperInvoice(fpzldm,fpqqlsh) {
	if(fpzldm == "04"){
		window.location.href = basePath + "pages/manage/invoiceManage/paperInvoiceEditNoMake.shtml?fpqqlsh=" + fpqqlsh;
	}else if(fpzldm == "01"){
		window.location.href = basePath + "pages/manage/invoiceManage/paperSpecialInvoiceEditNoMake.shtml?fpqqlsh=" + fpqqlsh;
	}
}

//差额发票开票失败原因
function viewBalanceFailReason(reason, fpqqlsh) {
    $("#balanceReason").html(reason);
    $("#balanceFpqqlsh").val(fpqqlsh);
    var dakai = layer.open({
        type: 1,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
        content: $("#viewBalanceFailReason")
    });
}

//蓝票开票失败原因
function viewFailReason(fpzldm,reason, fpqqlsh) {
    $("#reason").html(reason);
    $("#fpqqlsh").val(fpqqlsh);
    $("#fpzldm").val(fpzldm);
    var dakai = layer.open({
        type: 1,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
        content: $("#viewFailReason")
    });
}

//作废或冲红失败窗口
function viewRedFailReason(reason, fpqqlsh) {
    $("#redReason").html(reason);
    $("#redFpqqlsh").val(fpqqlsh);
    var dakai = layer.open({
        type: 1,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
        content: $("#viewRedFailReason")
    });
}

//修改你的发票信息
function modifyInvoice() {
    var fpqqlsh = $("#fpqqlsh").val();
    var fpzldm = $("#fpzldm").val();
    if(fpzldm == "04"){
    	window.location.href = basePath + "pages/manage/invoiceManage/paperInvoiceEditMakeFail.shtml?fpqqlsh=" + fpqqlsh;
	}else if(fpzldm == "01"){
		window.location.href = basePath + "pages/manage/invoiceManage/specialInvoiceEditMakeFail.shtml?fpqqlsh=" + fpqqlsh;
	}
}

//重新开具红票
function remakeInvoice(){
	var fpqqlsh = $("#redFpqqlsh").val();
	$("#redInvoiceBtn").attr("disabled","disabled");
	var index = layer.load(2, {shade: [0.5,'#000']}); //0.5透明度的白色背景
	var actionUrl = basePath+"paperInvoice/remakeRedPaperInvoice"+suffix;
	$.ajax({
		url:actionUrl,
		data:{
			fpqqlsh : fpqqlsh
		},
		type:"post",
		success:function(data){
			layer.close(index);
			if (data.code == 200 || data.code == "200") {
				layer.alert(data.msg,{icon:1,closeBtn: 0}, function(){
	        		layer.closeAll();
	        		window.location.href = basePath+"pages/manage/invoiceManage/paperInvoiceManage.shtml";
				});
	        }else if(data.code == 403){
	        	layer.alert(data.msg,{icon:2,closeBtn: 0}, function(){
	        		layer.closeAll();
				});
	        }
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			layer.close(index);
			layer.alert('系统繁忙,请稍候再试',{icon:2,closeBtn: 0}, function(){
        		layer.closeAll();
			});  
	    }
	})
}

//查看发票
function viewPaperInvoice(fpqqlsh) {
    window.location.href = basePath + "pages/manage/invoiceManage/paperInvoiceDetail.shtml?fpqqlsh=" + fpqqlsh + "&currentIndex=" + currentIndex;
}

//打印发票
function printPaperInvoice(fpqqlsh){
	//密码区加密，票面信息，发票头信息
	try {
		var PTPrintInvObj = new ActiveXObject("PTPrintInvoice.1");
	} catch(e) {  
		var dakai = layer.open({
	        type: 1,
	        closeBtn: 0, //不显示关闭按钮
	        shadeClose: true, //开启遮罩关闭
	        content: $("#printModal")
	    }); 
	} 
	$.ajax({
		type:"GET",
		url:basePath+"paperInvoice/getPrintData"+suffix,
		data:{
			fpqqlsh: fpqqlsh
		},
		success:function(data){
			data = data.data.data;
			var invData = stringify(convert2Print(data));
			var result = PTPrintInvObj.PrintInvoicePreview(invData);
			console.log(result);
			printNumFun(fpqqlsh);
		}
	})
	var convert2Print = function (data) {
		var invoiceModel = data.invoiceModel;
		var commodity = [];
		var master = [];
		//开票日期
    	var kprqArr = invoiceModel.kprq.split(" ");
    	var kpYmd = kprqArr[0].split("-");
    	var kprq = kpYmd[0] + "年" + kpYmd[1] + "月" + kpYmd[2] + "日";
    	var hjse = invoiceModel.hjse;
    	var bz = "";
    	if(invoiceModel.bz){
    		bz = "机器码：" + invoiceModel.jqbh + "\n" + invoiceModel.bz ;
    	}else{
    		bz = "机器码：" + invoiceModel.jqbh;
    	}
		Array.prototype.forEach.call(data.invoiceItemDetailList,function(item,index){
			var slStr = item.sl + "";
			var se = item.se;
			if(invoiceModel.slbs && invoiceModel.slbs == 2){
				slStr = "***";
			}else{
				if("-1" != slStr.indexOf(".")){
					var slArr = slStr.split(".");
					slStr = slArr[1];
					slStr = slStr.replace("0","");
					slStr = slStr + "%";
				}else if(parseInt(item.sl) == 0){
					slStr = "0%";
					se = "***";
				}
				if(parseInt(invoiceModel.hjse) == 0){
					hjse = "***";
				}
			}
			commodity.push({
				"name": item.xmmc,
				"guige": $Utils.handleUndefined(item.ggxh),
				"unit": $Utils.handleUndefined(item.xmdw),
				"number": ""+item.xmsl+"",
				"price": ""+item.xmdj+"",
				"sunmoney": ""+item.xmje+"",
				"tax": slStr,
				"taxmoney": ""+se+""
			});
		});
		var totalcapital = invoiceModel.jshj;
		if(parseFloat(totalcapital) < parseFloat(0)){
			totalcapital = (totalcapital+"").replace("-","");
			totalcapital = "(负数)" + $Utils.convertMoneyToChinese(totalcapital);
		}else{
			totalcapital = $Utils.convertMoneyToChinese(totalcapital);
		}
		master.push({
			"fpzldm" : invoiceModel.fpzldm,
			"qrcode": invoiceModel.ewm,
			"checkcode": invoiceModel.jym.substring(0,5)+" "+invoiceModel.jym.substring(5,10)+" "+invoiceModel.jym.substring(10,15)+" "+invoiceModel.jym.substring(15),
			"macnumber": $Utils.handleUndefined(invoiceModel.jqbh),
			"invcode": invoiceModel.fpDm,
			"invno": invoiceModel.fpHm,
			"billingdata": kprq,
			"buyer_name": invoiceModel.gmfMc,
			"buyer_taxid": $Utils.handleUndefined(invoiceModel.gmfNsrsbh),
			"buyer_addrtel": $Utils.handleUndefined(invoiceModel.gmfDzdh) + " " + $Utils.handleUndefined(invoiceModel.gmfdh),
			"buyer_bankaccount": $Utils.handleUndefined(invoiceModel.gmfKhh) + " " + $Utils.handleUndefined(invoiceModel.gmfYhzh),
			"ciphertext": invoiceModel.cipherText,
			"sales_name": invoiceModel.xsfMc,
			"sales_taxid": invoiceModel.xsfNsrsbh,
			"sales_addrtel": $Utils.handleUndefined(invoiceModel.xsfDzdh) + " " + $Utils.handleUndefined(invoiceModel.xsfdh),
			"sales_bankaccount":  $Utils.handleUndefined(invoiceModel.xsfKhh) + " " + $Utils.handleUndefined(invoiceModel.xsfYhzh),
			"payee": $Utils.handleUndefined(invoiceModel.skr),
			"review": $Utils.handleUndefined(invoiceModel.fhr),
			"drawer": invoiceModel.kpr,
			"remarks": bz,
			"sum": ""+invoiceModel.hjje+"",
			"sumtax": ""+hjse+"",
			"total": ""+invoiceModel.jshj+"",
			"totalcapital": ""+totalcapital+""
		});
		var invData = {
			"Detail": commodity,
			"Master": master
		};
		return invData;
	};
}

function stringify(object){
    var string = JSON.stringify(object);
    return string.replace(/\\u([0-9a-fA-F]{2,4})/g,function(string,matched){
        return String.fromCharCode(parseInt(matched,16));
    })
};

//增加打印次数
function printNumFun(fpqqlsh){
	$.ajax({
		type:"GET",
		url:basePath+"paperInvoice/updatePrintNum"+suffix,
		data:{
			fpqqlsh: fpqqlsh
		},
		success:function(data){
			
		}
	})
}

//
function sucbtnClick(){
	layer.closeAll();
	queryByIndex(1);
}

