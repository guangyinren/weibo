/**
 * 用来统一封装发票查询接口
 * Created by Songdan on 2017/3/3.
 */
/**
 * 发票查询对象的构造函数
 * @param options
 * @constructor
 */
function InvoiceQuery(options){
    var invoiceQuery = this;
    var args = arguments;
    if(args.length>0&&$Utils.getObjectType(args[0]) !== "object") {
        throw new Error("数据类型不正确，第一个参数必须是object");
    }
    invoiceQuery.defaultParams = $.extend({
        kprId: "select_kpr",
        kplx: "kplx",
        gmfmc: "input_gmfmc",
        lxmc: "input_lxr",
        lxsj: "input_sjh",
        fpdm: "input_fpdm",
        fphm: "input_fphm",
        sign: "select_sign",
        hjje: "input_hjje",
        beginTime: "startKprq",
        endTime: "endKprq",
        pageIndex: 1,
        pageSize: 10
    },args[0]||{});
}

InvoiceQuery.prototype.buildUrlParamers = function () {
    var invoiceQuery = this;
    var params = invoiceQuery.defaultParams;
    var str = "";
    for(var key in params) {
        var value = $("#" + params[key] + "").val();
        if (value) {
            if (key == params.beginTime) {
                value = value + " 00:00:00";
            }
            if (key == params.endTime) {
                value = value + " 23:59:59";
            }
            str += key + "=" + value;
        }else{
            continue;
        }
    }
    return str;
};
