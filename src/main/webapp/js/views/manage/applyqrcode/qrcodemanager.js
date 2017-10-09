/**
 * Created by Songdan on 2017/6/1.
 */
window.Applyqrcode = {
    configs: {
        invoiceItemUrl: "invoiceItem/queryInvoiceItemList",
        listUrl: "business/qrcode/list",
        viewUrl: "business/qrcode/img/",
        deleteUrl: "business/qrcode/del/",
        dispatchAddUrl: "qrcode_add.shtml",
        dispatchAddItemUrl: "item_save.shtml",
        addUrl: "business/qrcode/save",
        returnUrl: "invoiceApply.shtml?z=2",
        hasUrl: "business/qrcode/has",
        hasItemUrl: "invoiceItem/has",
        pId:"page_qrcode",
        listId:"qrcode_list_zone"
    },
    queryParams: {
        pageIndex: 1,
        pageSize: 10
    },
    base64Map: {},
    itemListMap:{},
    qrcodeListMap:{},
    list: function (currentPage) {
        Applyqrcode.queryParams.pageIndex = currentPage;
        $http.get(swapUrl(Applyqrcode.configs.listUrl), Applyqrcode.queryParams, function (data) {
            if (data.code == 200) {
                Applyqrcode.queryParams.pageIndex = currentPage;
                render(data.data);
            }
        });
        function render(data) {
            $("#"+Applyqrcode.configs.listId).empty();
            var list = data.rows;
            if(list.length > 0){
                for (var i = 0; i < list.length; i++) {
                    var trHtml = "<tr>";
                    var item = list[i];
                    Applyqrcode.qrcodeListMap[item.id] = item;
                    trHtml += '<td width="50px">' + calculateIndex(i + 1) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.invoiceItemName) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.taxClassificationCode) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.isEnjoyPolicy?'是':'否') + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.policyType) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.taxRate) + '</td>';
                    trHtml += '<td>' + $Utils.handleUndefined(item.createTime) + '</td>';
                    trHtml += '<td widtd="150px">' + calcaulteOperation(item) + '</th>';
                    trHtml += '<tr/>';
                    $("#"+Applyqrcode.configs.listId).append(trHtml);
                    PageWrapper.page($("#"+Applyqrcode.configs.pId), data.total, Applyqrcode.queryParams.pageIndex, Applyqrcode.list);
                }
            } else {
            	$("#"+Applyqrcode.configs.listId).append("<td colspan='8' style='text-align: center;border-bottom:0px !important;'>暂无数据</td>");
            	$("#page_qrcode").hide();
            }
            
        }

        function calculateIndex(i) {
            return (Applyqrcode.queryParams.pageIndex - 1) * Applyqrcode.queryParams.pageSize + i;
        }

        function calcaulteOperation(item) {
            var viewButton = '<a href="javascript:Applyqrcode.view(\'' + item.id + '\')"><span>查看</span></a>';
            var printButton = '<a href="javascript:Applyqrcode.print(\'' + item.id + '\')"><span>打印</span></a>'
            var delButton = '<a href="javascript:Applyqrcode.del(\'' + item.id + '\')"><span>删除</span></a>'
            return viewButton + printButton + delButton;
        }
    },
    view: function (id) {
        // $("#qrcodeImg").attr("src", "data:image/png;base64," + Applyqrcode.getImgBase64(id));
        var imgBase64 = Applyqrcode.getImgBase64(id);
        if (imgBase64 === 'error') {
            $("#qrcodeImg").attr("src", basePath + "/images/error/404.png");
            return;
        }else{
            $("#qrcodeImg").attr("src", "data:image/png;base64," + imgBase64);
        }
        var qrcode = Applyqrcode.qrcodeListMap[id];
        $("#enterpriseName").text(qrcode.enterpriseName);
        $("#invoiceItemName").text(qrcode.invoiceItemName);
        layer.open({
            id:'o1',
            type: 1,
            title:['开票二维码', 'background: #394457;color:#fff;'],
            content: $('#qrCodeImages'),
            offset: ['20px'],
            scrollbar: false,area: 'auto',maxWidth:600
        });
    },
    print: function (id) {
        var imgBase64 = Applyqrcode.getImgBase64(id);
        if (imgBase64 === 'error') {
            $("#qrcodeImg").attr("src", basePath + "/images/error/404.png");
        }else{
            $("#qrcodeImg").attr("src", "data:image/png;base64," + imgBase64);
        }
        var qrcode = Applyqrcode.qrcodeListMap[id];
        $("#enterpriseName").text(qrcode.enterpriseName);
        $("#invoiceItemName").text(qrcode.invoiceItemName);
        $("#qrCodeImages").jqprint({
            debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
            importCSS: false, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
            printContainer: false, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
            operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
        });
    },
    getImgBase64: function (id) {
        if (!Applyqrcode.base64Map[id]) {
            $.ajax({
                url: swapUrl(Applyqrcode.configs.viewUrl + id),
                async: false,
                success: function (data) {
                    if($Utils.getObjectType(data)==='String'){
                        data = JSON.parse(data);
                    }
                    if(data.code == 200){
                        Applyqrcode.base64Map[id] = data.data.item;
                    }else{
                        if (data.code == 401) {
                            window.location.reload(true);
                        }else{
                            Applyqrcode.base64Map[id] = "error";
                        }
                    }
                }
            });
        }
        return Applyqrcode.base64Map[id];
    },
    del: function (id) {
        var delUrl = swapUrl(Applyqrcode.configs.deleteUrl + id);
        layer.confirm("确定要删除该二维码？", {
            icon: 0, title: '提示', btn: ['确定', '取消'] //按钮
        }, function (index) {
            $http.get(delUrl, {}, function () {
                layer.close(index);
                Applyqrcode.list(Applyqrcode.queryParams.pageIndex);
            });
        }, function (index) {
            layer.close(index);
        });
    },
    hasItem:function(){
        var has = false;
        $.ajax({
            url: swapUrl(Applyqrcode.configs.hasItemUrl),
            async: false,
            success: function (data) {
                if (data.code == 200) {
                    has = data.data.item;
                }
            }
        });
        return has;
    },
    dispatchAdd: function () {
        if (Applyqrcode.hasItem()) {
            window.location.href = Applyqrcode.configs.dispatchAddUrl;
        }else{
            window.location.href = Applyqrcode.configs.dispatchAddItemUrl;
        }
    },
    initItemList:function(dom){
        function initItemSelect(data) {
            var rows = data.rows;
            dom.append('<option value="">请选择</option>');
            for(var i = 0;i<rows.length;i++) {
                var item = rows[i];
                Applyqrcode.itemListMap[item.id] = item;
                dom.append('<option value="'+item.id+'">'+item.itemName+'</option>');
            }
        }
        $http.get(swapUrl(Applyqrcode.configs.invoiceItemUrl),{},function(data){
            if (data.code == 200) {
                initItemSelect(data.data);
            }
        })
    },
    add: function (qrcode) {
        $.ajax({
            url: swapUrl(Applyqrcode.configs.addUrl),
            data:JSON.stringify(qrcode),
            type:"POST",
            contentType:"application/json;charset=UTF-8",
            success: function (data) {
                if (data.code == 200) {
                    window.location.href = Applyqrcode.configs.returnUrl;
                }
            }
        });
    },
    has:function(){
        var has = false;
        $.ajax({
            url: swapUrl(Applyqrcode.configs.hasUrl),
            type:"GET",
            contentType:"application/json;charset=UTF-8",
            async:false,
            success: function (data) {
                if (data.code == 200) {
                    has = data.data.item;
                }
            }
        });
        return has;
    }
};
function Qrcode(invoiceItemName, taxClassificationCode,taxClassificationName,isEnjoyPolicy, policyType, taxRate, taxRateValue) {
        this.invoiceItemName = invoiceItemName,
        this.taxClassificationCode = taxClassificationCode,
        this.taxClassificationName = taxClassificationName,
        this.isEnjoyPolicy = isEnjoyPolicy,
        this.policyType = policyType,
        this.taxRate = taxRate,
        this.taxRateValue = taxRateValue
}