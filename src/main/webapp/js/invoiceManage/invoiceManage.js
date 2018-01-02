$(function () {
    //日期控件
	DatetimePicker.startDateLessEndDate($("#startKprq"),"","2016-08-01",new Date(),$("#endKprq"));
	DatetimePicker.endDateMoreStartDate($("#endKprq"),"","2016-08-01",new Date(),$("#startKprq"));
    queryByIndex(1);
});

var pageSize = 10;
var currentIndex = 0;

//根据页数查询
function queryByIndex(currentPage) {
	currentIndex = currentPage;
    var gmfMc = $.trim($("#gmfMc").val());
    var xsfMc = $.trim($("#xsfMc").val());
    var xsfNsrsbh = $.trim($("#xsfNsrsbh").val());
    var kpzt = $("#kpzt option:selected").val();
    var fpqqlsh = $.trim($("#fpqqlsh").val());
    var startKprq = $.trim($("#startKprq").val());
    var endKprq = $.trim($("#endKprq").val());
    var fpzldm = $("#fpzldm option:selected").val();
    var kplx = $("#kplx option:selected").val();
    $.ajax({
		type:"GET",
		url:basePath+"invoiceQuery/findInvoiceListByPage"+suffix,
		data:{
			ver: new Date().getTime(),
            pageIndex: currentPage,
            pageSize: pageSize,
            gmfMc: gmfMc,
            xsfMc: xsfMc,
            xsfNsrsbh: xsfNsrsbh,
            kpzt: kpzt,
            fpqqlsh: fpqqlsh,
            startKprq: startKprq,
            endKprq: endKprq,
            fpzldm:fpzldm,
            kplx: kplx
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
                        var strs = [];
                        strs.push('<tr>');
                        strs.push('<td>'+number+'</td>');
                        strs.push('<td>'+item.fpqqlsh+'</td>');
                        strs.push('<td>'+item.gmfMc+'</td>');
                        strs.push('<td>'+item.kprq+'</td>');
                        strs.push('<td>'+item.qqsj+'</td>');
                        strs.push('<td>'+item.tssj+'</td>');
                        strs.push('<td>'+item.fpzldm+'</td>');
                        strs.push('<td>'+item.xsfMc+'</td>');
                        strs.push('<td>'+item.xsfNsrsbh+'</td>');
                        strs.push('<td>'+item.jshj+'</td>');
                        strs.push('<td>'+item.kply+'</td>');
                        strs.push('<td>'+item.kplx+'</td>');
                        strs.push('<td>'+item.chbz+'</td>');
                        strs.push('<td>'+item.kpr+'</td>');
                        strs.push('<td>'+item.by1+'</td>');
                        strs.push('<td>'+item.kpzt+'</td>');
                        strs.push('<td>');
                        if(item.kpzt =='MAKEINVOICEING'){
                        	strs.push('<a href="javascript:void(0)" onclick="updateFailFun(\''+item.fpqqlsh+'\')">置为开票失败</a>');
                        	strs.push('<a href="javascript:void(0)" onclick="updateFjh(\''+item.fpqqlsh+'\',\''+item.by1+'\')">更改分机号</a>');
                        	strs.push('<a href="javascript:void(0)" onclick="manualRetry(\''+item.fpqqlsh+'\')">手动重试</a>');
                        }else if(item.kpzt =='MAKEINVOICEFAIL'){
                        	strs.push('<a href="javascript:void(0)" onclick="updateIngFun(\''+item.fpqqlsh+'\')">置为开票中</a>');
                        	strs.push('<a href="javascript:void(0)"  onclick="viewFailReason(\''+item.sbyy+'\')">开票失败原因</a>');
                        }
                        strs.push('</td>');
                        strs.push('</tr>');
                        $("#invoice").append(strs.join(""));
                    });
                    $("#page").unbind("page");
                    $("#page").bootpag({
                        total: pageCount,
                        page: currentPage,
                        maxVisible: 10,
                        leaps: false,
                        nextList:'>>',
                        prevList:'<<',
                        next: '下一页',
                        prev: '上一页',
                        firstLastUse: true,
                        nextPrevListUse:false,
                        first: '<span aria-hidden="true">首页</span>',
                        last: '<span aria-hidden="true">末页</span>'
                    }).on("page",function(event,num){
                    	console.log(num);
                    	queryByIndex(num);
                    });
//                    PageWrapper.page(,total,currentPage,queryByIndex);
                } else {
                    $("#invoice").empty();
                    $("#invoice").html("<td colspan='14' style='text-align: center;'>暂无数据</td>");
                    $("#page").empty();
                }
            }
		}
	})
}


//置为开票失败
function updateFailFun(fpqqlsh) {
    var index = layer.load(2, {shade: [0.5, '#000']}); //0.5透明度的白色背景
    if (fpqqlsh != undefined && fpqqlsh != "undefined") {
        $.ajax({
            type: "GET",
            url: basePath + "invoiceQuery/updateFail" + suffix,
            data: {
                fpqqlsh: fpqqlsh
            },
            dataType: "json",
            success: function (data) {
                layer.close(index);
                if (data.code == 200) {
					layer.alert("更新成功", {
						icon: 1,title:"提示"
					}, function() {
						layer.closeAll();
					});
                } else if (data.code == 403) {
					layer.alert("更新失败", {
						icon: 2,title:"提示"
					}, function() {
						layer.closeAll();
						queryByIndex(1);
					});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
				layer.alert("系统繁忙,请稍候再试", {
					icon: 2,title:"提示"
				}, function() {
					layer.closeAll();
					queryByIndex(1);
				});
            }
        })
    }
}

//置为开票中
function updateIngFun(fpqqlsh) {
    var index = layer.load(2, {shade: [0.5, '#000']}); //0.5透明度的白色背景
    if (fpqqlsh != undefined && fpqqlsh != "undefined") {
        $.ajax({
            type: "GET",
            url: basePath + "invoiceQuery/updateIng" + suffix,
            data: {
                fpqqlsh: fpqqlsh
            },
            dataType: "json",
            success: function (data) {
                layer.close(index);
                if (data.code == 200) {
					layer.alert("更新成功", {
						icon: 1,title:"提示"
					}, function() {
						layer.closeAll();
					});
                } else if (data.code == 403) {
					layer.alert("更新失败", {
						icon: 2,title:"提示"
					}, function() {
						layer.closeAll();
						queryByIndex(1);
					});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
				layer.alert("系统繁忙,请稍候再试", {
					icon: 2,title:"提示"
				}, function() {
					layer.closeAll();
					queryByIndex(1);
				});
            }
        })
    }
}

//更新分机号弹出框
function updateFjh(fpqqlsh,fjh) {
	$("#sendFpqqlsh").val(fpqqlsh);
    $("#fjh").val($Utils.handleUndefined(fjh));
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

//更新分机号
function updateFjhFun() {
    var fpqqlsh = $("#sendFpqqlsh").val();
    var fjh = $("#fjh").val();
    $("#resendInvBtn").attr("disabled", "disabled");
    var index = layer.load(2, {shade: [0.5, '#000']}); //0.5透明度的白色背景
    $.ajax({
		type:"GET",
		url:basePath+"invoiceQuery/updateFjh"+suffix,
		data:{
			fpqqlsh: fpqqlsh,
			fjh: fjh
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

//手动重试
function manualRetry(fpqqlsh){
	var index = layer.load(2, {shade: [0.5, '#000']});
	$.ajax({
		type:"GET",
		url:basePath+"invoiceQuery/manualRetry"+suffix,
		data:{
			fpqqlsh: fpqqlsh
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

