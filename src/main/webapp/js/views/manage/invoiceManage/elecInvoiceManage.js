$(function () {
    //日期控件
	DatetimePicker.startDateLessEndDate($("#startKprq"),"","2016-08-01",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDate($("#endKprq"),"","2016-08-01",new Date(),$("#startKprq"));
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

$.validator.setDefaults({
    success: "valid"
});
var validator2 = $("#resendInvoiceForm").validate({
    //光标离开时校验
    onfocusout: function (element) {
        $(element).valid();
    },
    //获取到焦点时去除错误提示信息
    onfocusin: function (element) {
        if (this.settings.focusCleanup) {
//            $("#"+$(element).attr("id")+"_tip").text("");
        }
    },
    focusCleanup: true, //clear the error message when the error element get focus again.
    onkeyup: false,
    highlight: function (element, errorClass) {
        $(element).fadeOut(function () {
            $(element).fadeIn();
        });
    },
    errorPlacement: function (error, element) {
        //element是form表单中出错的元素的jquery对象
        if (error.text() != "" && error.text() != null) {
            layer.tips(error.text(), "#" + element.attr("id"), {tips: [1, 'red']});
        }
    }
});

$("#sendName").rules("add", {
    required: false,
    personalNameVali: true,
    messages:{
        required:"",
        personalNameVali:"请输入10个之内的中文或字母组合"
    }
})
$("#sendTel").rules("add", {
    required:false,
    mobileVali:true,
    messages: {
        required:"",
        mobileVali:"请填写正确格式的手机号"
    }
})
$("#sendEmail").rules("add", {
    required: false,
    emailVali: true,
    messages: {
        required: "",
        emailVali: "请填写正确格式的邮箱，最长为50个字符"
    }
})

var pageSize = 10;

var num = 0;

var currentIndex = 0;

//根据页数查询
function queryByIndex(currentPage) {
	currentIndex = currentPage;
    var kpr = $.trim($("#kpr").val());
    var gmfMc = $.trim($("#gmfMc").val());
    var sprMc = $.trim($("#sprMc").val());
    var sprSjh = $.trim($("#sprSjh").val());
    var fpDm = $.trim($("#fpDm").val());
    var fpHm = $.trim($("#fpHm").val());
    var jshj = $.trim($("#jshj").val());
    var jshjStatus = $.trim($("#jshjStatus option:selected").val());
    var startKprq = $.trim($("#startKprq").val());
    var endKprq = $.trim($("#endKprq").val());
    var kpzt = $("#kpzt option:selected").val();
    var chbz = $("#chbz option:selected").val();
    $.ajax({
		type:"GET",
		url:basePath+"invoice/queryDzfpCgByPage"+suffix,
		data:{
			ver: new Date().getTime(),
            pageIndex: currentPage,
            pageSize: pageSize,
            kpr: kpr,
            gmfMc: gmfMc,
            sprMc: sprMc,
            sprSjh: sprSjh,
            fpDm: fpDm,
            fpHm: fpHm,
            jshj: jshj,
            jshjStatus: jshjStatus,
            startKprq: startKprq,
            endKprq: endKprq,
            kpzt: kpzt,
            chbz: chbz
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
                        $("#invoice").append(invoice.fillListData());
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

//删除未开票的发票
function deleteDzfpCg(fpqqlsh) {
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

//开票
function makeDzfpCg(fpqqlsh) {
    var index = layer.load(2, {shade: [0.5, '#000']}); //0.5透明度的白色背景
    if (fpqqlsh != undefined && fpqqlsh != "undefined") {
        $.ajax({
            type: "GET",
            url: basePath + "invoice/makeDzfpCg" + suffix,
            data: {
                fpqqlsh: fpqqlsh
            },
            dataType: "json",
            success: function (data) {
                layer.close(index);
                if (data.code == 200) {
//                    $("#succMsg").text("开票信息提交成功，系统将自动为您开具电子发票");
//					var dakai = layer.open({
//						  title : false,
//						  type: 1, 
//						  closeBtn: 0, //不显示关闭按钮
//						  shadeClose: true, //开启遮罩关闭
//						  content: $("#succModal")
//					});
					layer.alert(data.msg, {
						icon: 1,title:"提示"
					}, function() {
						layer.closeAll();
					});
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

//未开票的编辑
function editDzfpCg(fpqqlsh) {
    window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceEditNoMake.shtml?fpqqlsh=" + fpqqlsh;
}

//继续发送
function continueSend(sprMc, sprSjh, sprYx,fpqqlsh) {
	$("#sendFpqqlsh").val(fpqqlsh);
    $("#sendName").val($Utils.handleUndefined(sprMc));
    $("#sendTel").val($Utils.handleUndefined(sprSjh));
    $("#sendEmail").val($Utils.handleUndefined(sprYx));
    layer.closeAll();
    var index = layer.open({
        title: false,
        type: 1,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
        offset: 'auto',
        content: $("#sendPage")
    });
}

//重新发送
function secondSend() {
    var fpqqlsh = $("#sendFpqqlsh").val();
    var sprMc = $("#sendName").val();
    var sprSjh = $("#sendTel").val();
    var sprYx = $("#sendEmail").val();
    if (sprSjh == "" && sprYx == "") {
        layer.tips("收票人手机号或者收票人邮箱不能同时为空", "#" + element.attr("id"), {tips: [1, 'red']});
    } else if ($("#resendInvoiceForm").valid()) {
        $("#resendInvBtn").attr("disabled", "disabled");
        var index = layer.load(2, {shade: [0.5, '#000']}); //0.5透明度的白色背景
        $.ajax({
    		type:"GET",
    		url:basePath+"invoice/resendInvoice"+suffix,
    		data:{
    			fpqqlsh: fpqqlsh,
                sprMc: sprMc,
                sprSjh: sprSjh,
                sprYx: sprYx
    		},
    		success:function(data){
    			layer.close(index);
                $("#resendInvBtn").removeAttr('disabled');
                if (data.code == 200) {
                    layer.closeAll();
                    layer.msg(data.msg, {icon: 1, time: 2000}, function () {
                        queryByIndex(1);
                        layer.closeAll();
                    });
                } else if (data.code == 403) {
                    layer.closeAll();
                    layer.msg(data.msg, {icon: 2, time: 2000}, function () {
                        queryByIndex(1);
                        layer.closeAll();
                    });
                }
    		}
    	})
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
function viewFailReason(reason, fpqqlsh) {
    $("#reason").html(reason);
    $("#fpqqlsh").val(fpqqlsh);
    var dakai = layer.open({
        type: 1,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true, //开启遮罩关闭
        content: $("#viewFailReason")
    });
}

//红票开票失败原因
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
	window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceEditMakeFail.shtml?fpqqlsh=" + fpqqlsh;
}


//重新开具红票
function remakeRedInvoice(){
	var fpqqlsh = $("#redFpqqlsh").val();
	$("#redInvoiceBtn").attr("disabled","disabled");
	var index = layer.load(2, {shade: [0.5,'#000']}); //0.5透明度的白色背景
	var actionUrl = basePath+"eleInvoice/remakeRedEleInvoice"+suffix;
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
function viewInvoice(fpqqlsh) {
    window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceDetail.shtml?fpqqlsh=" + fpqqlsh + "&currentIndex=" + currentIndex;
}

//
function sucbtnClick(){
	layer.closeAll();
	queryByIndex(1);
}

