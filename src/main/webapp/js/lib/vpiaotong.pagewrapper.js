/**
 * 分页控件包装，现在包装的是bootpag，所以引用此插件需要使用bootpag.js
 * Created by Songdan on 2016/10/20.
 */
(function() {
    window.PageWrapper = {
        /**
         * 分页功能
         * @param dom jquery 对象
         * @param count 总数量
         * @param currentPage 当前页
         * @param callback 点击页面回调函数
         */
        page: function (dom,count,currentPage, callback) {
            var pageSize = 10;
            var pageCount = Math.floor((count + pageSize - 1) / 10);
            //确定只bind一次事件
            dom.unbind("page");
            dom.bootpag({
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
            }).on("page",function(obj,num){
                callback(num);
            });
        }
    };
})()
