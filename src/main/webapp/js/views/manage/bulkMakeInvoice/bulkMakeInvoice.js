/**
 * Created by LJW on 2017/3/13.
 */
var pageSize = 10;
function ajaxFileUpload() {
    var file = $('#templateFile').val();
    var fileType = file.substring(file.lastIndexOf('.')+1);
    if(fileType !== 'xlsx' && fileType !== 'xls'){
        layer.alert('模板文件格式不对',{
            icon: 2,
            closeBtn:0,
            btnAlign:'c'
        });
        $('#templateFile').val('');
        return false;
    }
    var index = layer.load(2, {shade: [0.5, '#000']});
    var formData = new FormData($('#uploadForm')[0]);
    $.ajax({
        url: basePath + 'invoice/import/excel' + suffix,
        type: 'POST',
        data: formData,
        async: true,
        cache: false,
        contentType : false,
        processData: false,
        success: function (response) {
            $('#templateFile').val('');
            layer.close(index);
            if (response.code === '200') {
                layer.alert(response.msg,{
                    icon: 1,
                    closeBtn:0,
                    btnAlign:'c'
                },function(){
                    layer.closeAll();
                });
                queryByIndex(1);
            }else{
                layer.alert(response.msg,{
                    icon: 2,
                    closeBtn:0,
                    btnAlign:'c'
                },function(){
                    layer.closeAll();
                });
            }
        },error: function () {
            layer.close(index);
            layer.alert('系统繁忙,请稍候再试', {
                icon: 2,
                closeBtn:0,
                btnAlign:'c'
            }, function () {
                $('#templateFile').val('');
                layer.close(index);
            });
        }
    });
}

function statusFilter(val) {
    if (val === 'WAIT') {
        return '待处理';
    } else if (val === 'SUCCESS') {
        return '处理成功';
    } else {
        return '处理失败';
    }
}

function failReasonFilter(item) {
    var val = item.status;
    if (val === 'WAIT') {
        return '待处理';
    } else if (val === 'SUCCESS') {
        return '处理成功';
    } else {
        return item.failReason;
    }
}

function queryByIndex(currentPage) {
    var fileName = $('#fileName').val();
    var uploadTimeBegin = $('#uploadTimeBegin').val();
    var uploadTimeEnd = $('#uploadTimeEnd').val();
    var status = $('#status').val();
    var uploaderId = $('#uploaderId').val();
    $.ajax({
        type: 'GET',
        url: basePath + 'invoice/import/getInvoiceImportList' + suffix,
        data: {
            pageIndex: currentPage,
            pageSize: pageSize,
            fileName: fileName,
            uploadTimeBegin: uploadTimeBegin,
            uploadTimeEnd: uploadTimeEnd,
            status: status,
            uploaderId: uploaderId
        },
        dataType: 'json',
        success: function(data) {
            if (data.code === '200') {
                var rows = data.data.rows;
                var total = data.data.total;
                if( total > 0){
                    $("#pageDate").empty();
                    var pageDate = $("#pageDate");
                    Array.prototype.forEach.call(rows, function (item, index, array) {
                        var strs = [];
                        var number = pageSize * (currentPage - 1) + index + 1;
                        strs.push('<td>'+ number +'</td>');
                        strs.push('<td>'+ item.fileName +'</td>');
                        strs.push('<td>' + $Utils.timestampFormat('Y-m-d H:i:s', item.uploadTime / 1000) + '</td>');
                        strs.push('<td>'+ item.uploaderName +'</td>');
                        strs.push('<td>'+ statusFilter(item.status) +'</td>');
                        strs.push('<td>'+ failReasonFilter(item) +'</td>');
                        strs.push('<td><a href="javascript:viewProcessDetail(\''+item.id+'\')"><span>查看处理详情</span></a>');
                        var href = basePath + "invoice/import/download/" + item.id + suffix;
                        strs.push('<a href="'+href+'"><span>下载文件</span></a></td>');
                        pageDate.append('<tr class="alt">' + strs.join("") + '</tr>');
                    })
                    PageWrapper.page($('#page'), total, currentPage, queryByIndex);
                } else {
                    $("#pageDate").empty();
                    $("#page").empty();
                    $("#pageDate").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert('系统繁忙,请稍候再试', {
                icon: 2, title: ['', true], skin: 'newLayer'
            }, function () {
                layer.closeAll();
            });
        }
    });
}

function downloadFile(invoiceImportId) {

    $.ajax({
        type: 'GET',
        url: basePath + 'invoice/import/download/'+invoiceImportId+suffix,
        success: function(data) {

        }
    });

}

function getClerkersList() {
    $.ajax({
        type: 'GET',
        url: basePath + 'invoice_query/clerkers' + suffix,
        dataType: 'json',
        success: function(data) {
            var rows = data.data;
            for (var i = 0, len = rows.item.length; i < len; i++) {
                var name = rows.item[i].clerkName;
                var id = rows.item[i].billingClerkId;
                var selNode = $('#uploaderId');
                selNode.append("<option value='" + id + "'>" + name + "</option>");
            }
        }
    });
}

function viewProcessDetail(invoiceImportId) {
    window.location.href = basePath + "pages/manage/bulkMakeInvoice/bulkMakeInvoiceRecord.shtml?state=" + invoiceImportId;
}

$(function(){
    $('#uploadTimeBegin').datetimepicker({
        language: 'zh-CN',
        autoclose: true,//选中之后自动隐藏日期选择框
        todayBtn: true,//今日按钮
        startView:2,
        minView:2,
        endDate:new Date(),
        format: 'yyyy-mm-dd'//日期格式,
    });
    $('#uploadTimeEnd').datetimepicker({
        language: 'zh-CN',
        autoclose: true,//选中之后自动隐藏日期选择框
        todayBtn: true,//今日按钮
        startView:2,
        minView:2,
        endDate:new Date(),
        format: 'yyyy-mm-dd'//日期格式
    });
    $("#uploadTemplate").on("click", function () {
        $("#templateFile").click();
    });
    getClerkersList();
    queryByIndex(1);
});
