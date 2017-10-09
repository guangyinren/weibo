/**
 * Created by Songdan on 2017/6/1.
 * modify by liuyong 2017/08/01
 */
window.InvoiceApply = {
    configs: {
        permitUrl: "business/invoice/apply/permit",
        preventUrl: "business/invoice/apply/prevent/",
        listUrl: "business/invoice/apply/list",
        dispatchUrl: "apply_edit.shtml",
        returnUrl: "invoiceApply.shtml",
        deleteUrl: "business/invoice/apply/del/",
        //TODO
        viewInvoiceUrl: "",
        viewUrl: "apply_view.shtml",
        pId:"page_apply",
        listId:"apply_list_zone"
    },
    queryParams: {
        pageIndex: 1,
        pageSize: 10,
        reviewStatus: null,
        startApplyDate:null,
        endApplyDate:null
    },
    applyInfoList:{},
    list: function (currentPage) {
        if(InvoiceApply.queryParams.reviewStatus == $("#reviewStatus").val()){
            InvoiceApply.queryParams.pageIndex = currentPage;
        }else{
            InvoiceApply.queryParams.pageIndex = 1;
        }
        InvoiceApply.queryParams.startApplyDate = $("#startApplyDate").val();
        var endDate = $("#endApplyDate").val();
        InvoiceApply.queryParams.endApplyDate = endDate ? new Date(endDate).dateAdd('d', 1).pattern('yyyy-MM-dd') : endDate;
        InvoiceApply.queryParams.reviewStatus = $("#reviewStatus").val();
        $http.get(swapUrl(InvoiceApply.configs.listUrl), InvoiceApply.queryParams, function (data) {
            if (data.code == 200) {
                //InvoiceApply.queryParams.pageIndex = currentPage;
                render(data.data);
            }
        });
        function render(data) {
            $("#"+InvoiceApply.configs.listId).empty();
            var list = data.rows;
            if(list.length > 0){
                for (var i = 0; i < list.length; i++) {
                    var trHtml = "<tr>";
                    var item = list[i];
                    InvoiceApply.applyInfoList[item.invoiceQrcodeApply.id]=item;
                    trHtml += '<td width="50px">' + calculateIndex(i + 1) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.invoiceQrcodeApply.buyerName) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined($Utils.formatNumber(item.invoiceQrcodeApply.invoiceAmount,2)) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.invoiceQrcodeApply.buyerMobile) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.invoiceQrcodeApply.buyerEmail) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.invoiceQrcodeApply.invoiceItemName) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.invoiceQrcodeApply.applyTime) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(calcaulateReviewStatus(item.invoiceQrcodeApply.reviewStatus)) + '</td>';
                    if (item.invoiceStatus) {
                        trHtml += '<td>' + $Utils.handleUndefined(calcaulateInvoiceStatus(item.invoiceStatus.sysStatus)) + '</td>';
                    }else{
                        trHtml += '<td>' + $Utils.handleUndefined("未开票") + '</td>';
                    }
                    trHtml += '<td width="150px">' + calcaulteOperation(item) + '</td>';
                    trHtml += '<tr/>';
                    $("#"+InvoiceApply.configs.listId).append(trHtml);
                    $('html').width($('.customers').width+20)
                    PageWrapper.page($("#"+InvoiceApply.configs.pId), data.total, InvoiceApply.queryParams.pageIndex, InvoiceApply.list);
                }
            } else {
            	$("#"+InvoiceApply.configs.listId).append("<td colspan='10' style='text-align: center;border-bottom:0px !important;'>暂无数据</td>");
            	$("#page_apply").hide();
            }

        }

        function calcaulateReviewStatus(status) {
            switch (status) {
                case 'NO_CHECK':
                    return "待审核";
                case 'NO_PASS':
                    return "审核不通过";
                case 'PASS':
                    return "审核通过";
                default :
                    return "";
            }
        }

        function calcaulateInvoiceStatus(status) {
            if (!status) {
                return "未开票";
            }
            switch (status) {
                case 'ISSUE_FAIL':
                    return "开票失败";
                case 'RECIEVE_SUCCESS':
                case 'ISSUEING':
                    return "开票中";
                default :
                    return "开票成功";
            }
        }


        function calculateIndex(i) {
            return (InvoiceApply.queryParams.pageIndex - 1) * InvoiceApply.queryParams.pageSize + i;
        }

        function calcaulteOperation(item) {
            var reviewButton = '<a href="javascript:InvoiceApply.dispatch(\'' + item.invoiceQrcodeApply.id + '\')"><span>审核</span></a>';
            var viewButton = '<a href="javascript:InvoiceApply.view(\'' + item.invoiceQrcodeApply.id + '\')"><span>查看</span></a>';
            var delButton = '<a href="javascript:InvoiceApply.del(\'' + item.invoiceQrcodeApply.id + '\')"><span>删除</span></a>'
            if (item.invoiceQrcodeApply.reviewStatus == 'NO_CHECK') {
                return reviewButton + delButton;
            }else if(item.invoiceQrcodeApply.reviewStatus == 'NO_PASS'){
                return viewButton+delButton;
            }
            if (item.invoiceStatus) {
                var viewInvoiceButton = '<a href="javascript:InvoiceApply.viewInvoice(\'' + item.invoiceQrcodeApply.invoiceSerialNo + '\')"><span>查看发票</span></a>'
                var showErrorButton = '<a href="javascript:InvoiceApply.showError(\'' + item.invoiceStatus.failCause + '\')"><span>失败原因</span></a>'
                if(item.invoiceStatus && item.invoiceStatus.sysStatus == 'ISSUE_FAIL'){
                    return viewInvoiceButton + showErrorButton;
                }else if (item.invoiceStatus && item.invoiceStatus.sysStatus == 'ISSUEING') {
                    return viewInvoiceButton;
                }else{
                	var reSendButton = '<a href="javascript:InvoiceApply.reSendInvoice(\'' + item.invoiceQrcodeApply.invoiceSerialNo + '\',\'' + item.invoiceQrcodeApply.buyerMobile + '\',\'' + item.invoiceQrcodeApply.buyerEmail + '\')"><span>再次发送</span></a>';
                    return viewInvoiceButton + reSendButton;
                }
            }
        }
    },
    dispatch:function(id){
        var item = InvoiceApply.applyInfoList[id];
        var applyInfo = item.invoiceQrcodeApply;
        window.location.href = InvoiceApply.configs.dispatchUrl + "?" + $Utils.obj2UrlParameters(applyInfo);
    },
    del: function (id) {
        var delUrl = swapUrl(InvoiceApply.configs.deleteUrl + id);
        layer.confirm("删除后，将无法为该请求开具电子发票,确认删除？", {
            icon: 0, title: '提示', btn: ['确定', '取消'] //按钮
        }, function (index) {
            $http.get(delUrl, {}, function (data) {
                layer.close(index);
                if (data.code == 200) {
                    InvoiceApply.list(InvoiceApply.queryParams.pageIndex);
                }else{
                    layer.open({
                        title:"失败原因",
                        content:data.msg
                    });
                }
            });
        }, function (index) {
            layer.close(index);
        });
    },
    permit: function (invoiceApply) {
        //var result = invoiceApply.applyValidate();
        //if (result !== true) {
        //    layer.open({
        //        title:"失败原因",
        //        content:result
        //    });
        //    return;
        //}
        var permitUrl = swapUrl(InvoiceApply.configs.permitUrl);
        layer.confirm("审核通过后，系统将自动开具电子发票，请您仔细核对发票抬头、金额等信息。确认审核通过？", {
            icon: 0, title: '提示', btn: ['确定', '取消'] //按钮
        }, function (index) {
            $http.post(permitUrl, invoiceApply, function (data) {
                layer.close(index);
                if (data.code == 200) {
                    window.location.href = InvoiceApply.configs.returnUrl;
                }
            },true);
        }, function (index) {
            layer.close(index);
        });
    },
    prevent: function (id) {
        var preventUrl = swapUrl(InvoiceApply.configs.preventUrl + id);
        layer.confirm("审核不通过，将无法为该请求开具电子发票,确认审核不通过？", {
            icon: 0, title: '提示', btn: ['确定', '取消'] //按钮
        }, function (index) {
            $http.get(preventUrl, {}, function (data) {
                layer.close(index);
                if (data.code == 200) {
                    window.location.href = InvoiceApply.configs.returnUrl;
                }
            });
        }, function (index) {
            layer.close(index);
        });
    },
    viewInvoice:function(invoiceSerialNo){
        window.location.href = basePath + "pages/manage/invoiceManage/elecInvoiceDetail.shtml?fpqqlsh=" + invoiceSerialNo;
    },
    view:function(id){
        var item = InvoiceApply.applyInfoList[id];
        var applyInfo = item.invoiceQrcodeApply;
        window.location.href = InvoiceApply.configs.viewUrl + "?" + $Utils.obj2UrlParameters(applyInfo);
    },
    reSendInvoice:function(invoiceSerialNo,buyerMobile,buyerEmail){
    	$("#sendFpqqlsh").val(invoiceSerialNo);
//      $("#sendName").val($Utils.handleUndefined(sprMc));
        $("#sendTel").val($Utils.handleUndefined(buyerMobile));
        $("#sendEmail").val($Utils.handleUndefined(buyerEmail));
        layer.closeAll();
        var index = layer.open({
            title: false,
            type: 1,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true, //开启遮罩关闭
            offset: 'auto',
            content: $("#sendPage")
        });
    },
    showError:function(msg){
        layer.open({
            title:"失败原因",
            content:msg
        });
    }
};

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

//重新发送
function resendInvBtnFun() {
    var fpqqlsh = $("#sendFpqqlsh").val();
//    var sprMc = $("#sendName").val();
    var sprSjh = $("#sendTel").val();
    var sprYx = $("#sendEmail").val();
    if (!sprSjh && !sprYx) {
        layer.tips("收票人手机号或者收票人邮箱不能同时为空", "#" + element.attr("id"), {tips: [1, 'red']});
    } else if ($("#resendInvoiceForm").valid()) {
        $("#resendInvBtn").attr("disabled", "disabled");
        var index = layer.load(2, {shade: [0.5, '#000']}); //0.5透明度的白色背景
        $.ajax({
    		type:"GET",
    		url:basePath+"invoice/resendInvoice"+suffix,
    		data:{
    			fpqqlsh: fpqqlsh,
                sprSjh: sprSjh,
                sprYx: sprYx
    		},
    		success:function(data){
    			layer.close(index);
                $("#resendInvBtn").removeAttr('disabled');
                if (data.code == 200) {
                    layer.closeAll();
                    layer.msg(data.msg, {icon: 1, time: 2000}, function () {
                        layer.closeAll();
                    });
                } else if (data.code == 403) {
                    layer.closeAll();
                    layer.msg(data.msg, {icon: 2, time: 2000}, function () {
                        layer.closeAll();
                    });
                }
    		}
    	})
    }
}

function InvoiceQrcodeApply(id,buyerName,invoiceAmount,buyerMobile,buyerEmail,buyerTaxNo) {
    this.id = id;
    this.buyerName = buyerName;
    this.invoiceAmount = invoiceAmount;
    this.buyerMobile = buyerMobile;
    this.buyerEmail = buyerEmail;
    this.buyerTaxNo = buyerTaxNo;
}
InvoiceQrcodeApply.prototype.applyValidate=function(){
    if (!this.id || this.id.trim()=='') {
        return "未知异常";
    }
    if (!this.buyerName || this.buyerName.trim()=='') {
        return "购买方名称不能为空";
    }
    if (!gmfMcRegex.test(this.buyerName)) {
        return "购买方名称不符合要求";
    }
    if (this.buyerTaxNo && !nsrsbhRegex.test(this.buyerTaxNo)) {
        return "购买方税号不符合要求";
    }
    if (!this.invoiceAmount || this.invoiceAmount.trim()=='') {
        return "开票金额不能为空";
    }
    if (!twoPosiDecRegex.test(this.invoiceAmount)) {
        return "开票金额不符合格式";
    }
    if (this.buyerMobile && !mobileRegex.test(this.buyerMobile)) {
        return "收票人手机不符合格式";
    }
    if (this.buyerEmail && !emailRegex.test(this.buyerEmail)) {
        return "收票人邮箱不符合格式";
    }
    /*if (!this.buyerMobile || this.buyerMobile.trim()=='') {
        throw '未知异常';
    }*/
    /*if (!id || id.trim()=='') {
        throw '未知异常';
    }*/
    return true;
};