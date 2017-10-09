/**
 * Created by LJW on 2017/3/13.
 */
function getPageData(invoiceImportId) {
    $.ajax({
        type: 'GET',
        url: basePath + 'invoice/import/getInvoiceImportRecordList' + suffix,
        data: {
            invoiceImportId: invoiceImportId
        },
        dataType: 'json',
        success: function(response) {
            if (response.code === '200') {
                var errorRecord = response.data.data.failList;
                if( errorRecord.length > 0){
                    $("#failPageDate").empty();
                    var failPageDate = $("#failPageDate");
                    Array.prototype.forEach.call(errorRecord, function (item, index, array) {
                        var strs = [];
                        strs.push('<td>'+ (index+1) +'</td>');
                        strs.push('<td>'+ item.receiptNo +'</td>');
                        strs.push('<td>'+ item.buyerName +'</td>');
                        strs.push('<td>'+ item.itemName +'</td>');
                        strs.push('<td>'+ item.amount +'</td>');
                        var errorReason = item.errorReason ? item.errorReason : "";
                        strs.push('<td>'+ errorReason +'</td>');
                        failPageDate.append('<tr class="alt">' + strs.join("") + '</tr>');
                    })
                } else {
                    $("#failPageDate").empty();
                    $("#failPageDate").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
                }
                var successRecord = response.data.data.successList;
                if( successRecord.length > 0){
                    $("#successPageDate").empty();
                    var successPageDate = $("#successPageDate");
                    Array.prototype.forEach.call(successRecord, function (item, index, array) {
                        var strs = [];
                        strs.push('<td>'+ (index+1) +'</td>');
                        strs.push('<td>'+ item.receiptNo +'</td>');
                        strs.push('<td>'+ item.buyerName +'</td>');
                        strs.push('<td>'+ item.itemName +'</td>');
                        strs.push('<td>'+ parseFloat(item.amount).toFixed(2) +'</td>');
                        strs.push('<td>'+ taxRateFilter(item.taxRate) +'</td>');
                        strs.push('<td>'+ item.receiverName +'</td>');
                        strs.push('<td>'+ item.receiverPhone +'</td>');
                        strs.push('<td>'+ item.receiverMail +'</td>');
                        strs.push('<td>'+ applyStatusFilter(item.issueStatus) +'</td>');
                        successPageDate.append('<tr class="alt">' + strs.join("") + '</tr>');
                    })
                } else {
                    $("#successPageDate").empty();
                    $("#successPageDate").html("<td colspan='12' style='text-align: center;'>暂无数据</td>");
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
function applyStatusFilter(applyStatus) {
    switch (applyStatus) {
        case 'RECIEVE_SUCCESS':
            return '未开票';
        case 'ISSUEING':
            return '开票中';
        case 'ISSUE_FAIL':
            return '开票失败';
        default:
            return '开票成功';
    }
}
function taxRateFilter(taxRate) {
    /*if (!$Utils.isBlank(taxRate)) {
        return taxRate * 100 + '%';
    } else {
        return '';
    }*/
    return taxRate;
}
$(function(){
    var invoiceImportId = $Utils.getUrlParameters().state;
    getPageData(invoiceImportId);
});
