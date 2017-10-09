/**
 * 日期控件包装，现在包装的是bootstrap-datetimepicker
 * 引用此插件需要使用bootstrap-datetimepicker css js 以及汉化js
 * <link rel="stylesheet" href="/js/bootstrap/plugin/datetimepicker/css/bootstrap-datetimepicker.min.css">
   <script src="/js/bootstrap/plugin/datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
   <script src="/js/bootstrap/plugin/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
   <script src="/js/lib/vpiaotong.datetimepicker.js"></script>
 * liuyong 2017/03/14.
 */
(function() {
    window.DatetimePicker = {
        /**
         * 年月日选择
         * @param dom jquery 对象
         * @param defineInitialDate 初始化时默认日期，不需传空字符串，默认为当前日期
         * @param defineStartDate 日期控件可选范围起始日期，不需传空字符串，默认无限制
         * @param defineEndDate 日期控件可选范围截止日期，不需传空字符串，默认无限制
         */
        date: function (dom,defineInitialDate,defineStartDate,defineEndDate) {
        	if(defineInitialDate){
        		
        	}else{
        		defineInitialDate = "";
        	}
        	if(defineStartDate){
        		
        	}else{
        		defineStartDate = "";
        	}
        	if(defineEndDate){
        		
        	}else{
        		defineEndDate = "";
        	}
            dom.datetimepicker({
            	language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                //clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                startView:2,
                minView:2,
                startDate:defineStartDate,
                endDate:defineEndDate,
                initialDate:defineInitialDate,
                format: "yyyy-mm-dd"//日期格式
            });
        },
        /**
         * 年月选择
         * @param dom jquery 对象
         * @param defineInitialDate 初始化时默认日期，不需传空字符串，默认为当前日期
         * @param defineStartDate 日期控件可选范围起始日期，不需传空字符串，默认无限制
         * @param defineEndDate 日期控件可选范围截止日期，不需传空字符串，默认无限制
         */
        dateMonth: function (dom,defineInitialDate,defineStartDate,defineEndDate) {
        	if(defineInitialDate){
        		
        	}else{
        		defineInitialDate = "";
        	}
        	if(defineStartDate){
        		
        	}else{
        		defineStartDate = "";
        	}
        	if(defineEndDate){
        		
        	}else{
        		defineEndDate = "";
        	}
            dom.datetimepicker({
            	language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                //clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                startView:3,
                minView:3,
                startDate:defineStartDate,
                endDate:defineEndDate,
                initialDate:defineInitialDate,
                format: "yyyy-mm"//日期格式
            });
        },
        /**
         * 年月日时分秒选择
         * @param dom jquery 对象
         * @param defineInitialDate 初始化时默认日期，不需传空字符串，默认为当前日期
         * @param defineStartDate 日期控件可选范围起始日期，不需传空字符串，默认无限制
         * @param defineEndDate 日期控件可选范围截止日期，不需传空字符串，默认无限制
         */
        datetime: function (dom,defineInitialDate,defineStartDate,defineEndDate) {
        	if(defineInitialDate){
        		
        	}else{
        		defineInitialDate = "";
        	}
        	if(defineStartDate){
        		
        	}else{
        		defineStartDate = "";
        	}
        	if(defineEndDate){
        		
        	}else{
        		defineEndDate = "";
        	}
            dom.datetimepicker({
            	language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                //clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                startView:2,
                minView:0,
                startDate:defineStartDate,
                endDate:defineEndDate,
                initialDate:defineInitialDate,
                format: "yyyy-mm-dd hh:mm:ss"//日期格式
            });
        },
        /**
         * 开始日期的可选最大日期小于结束日期
         * @param dom jquery 开始日期dom对象
         * @param defineInitialDate 初始化时默认日期，不需传空字符串，默认为当前日期
         * @param defineStartDate 日期控件可选范围起始日期，不需传空字符串，默认无限制
         * @param defineEndDate 日期控件可选范围截止日期，不需传空字符串，默认无限制
         * @param endDateDom 结束日期dom对象
         * 
         */
        startDateLessEndDate: function (dom,defineInitialDate,defineStartDate,defineEndDate,endDateDom) {
        	if(defineInitialDate){
        		
        	}else{
        		defineInitialDate = "";
        	}
        	if(defineStartDate){
        		
        	}else{
        		defineStartDate = "";
        	}
        	if(defineEndDate){
        		
        	}else{
        		defineEndDate = "";
        	}
            dom.datetimepicker({
            	language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                //clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                startView:2,
                minView:2,
                startDate:defineStartDate,
                endDate:defineEndDate,
                initialDate:defineInitialDate,
                format: "yyyy-mm-dd"//日期格式
            }).on("click",function(){
            	dom.datetimepicker("setEndDate",endDateDom.val())
            });
        },
        /**
         * 结束日期的可选最小日期大于开始日期
         * @param dom jquery 开始日期dom对象
         * @param defineInitialDate 初始化时默认日期，不需传空字符串，默认为当前日期
         * @param defineStartDate 日期控件可选范围起始日期，不需传空字符串，默认无限制
         * @param defineEndDate 日期控件可选范围截止日期，不需传空字符串，默认无限制
         * @param endDateDom 结束日期dom对象
         * 
         */
        endDateMoreStartDate: function (dom,defineInitialDate,defineStartDate,defineEndDate,endDateDom) {
        	if(defineInitialDate){
        		
        	}else{
        		defineInitialDate = "";
        	}
        	if(defineStartDate){
        		
        	}else{
        		defineStartDate = "";
        	}
        	if(defineEndDate){
        		
        	}else{
        		defineEndDate = "";
        	}
            dom.datetimepicker({
            	language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                //clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                startView:2,
                minView:2,
                startDate:defineStartDate,
                endDate:defineEndDate,
                initialDate:defineInitialDate,
                format: "yyyy-mm-dd"//日期格式
            }).on("click",function(){
            	dom.datetimepicker("setStartDate",endDateDom.val())
            });
        },
        /**
         * 开始日期的可选最大日期小于结束日期
         * @param dom jquery 开始日期dom对象
         * @param defineInitialDate 初始化时默认日期，不需传空字符串，默认为当前日期
         * @param defineStartDate 日期控件可选范围起始日期，不需传空字符串，默认无限制
         * @param defineEndDate 日期控件可选范围截止日期，不需传空字符串，默认无限制
         * @param endDateDom 结束日期dom对象
         * 
         */
        startDateLessEndDateMonth: function (dom,defineInitialDate,defineStartDate,defineEndDate,endDateDom) {
        	if(defineInitialDate){
        		
        	}else{
        		defineInitialDate = "";
        	}
        	if(defineStartDate){
        		
        	}else{
        		defineStartDate = "";
        	}
        	if(defineEndDate){
        		
        	}else{
        		defineEndDate = "";
        	}
            dom.datetimepicker({
            	language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                //clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                startView:3,
                minView:3,
                startDate:defineStartDate,
                endDate:defineEndDate,
                initialDate:defineInitialDate,
                format: "yyyy-mm"//日期格式
            }).on("click",function(){
            	dom.datetimepicker("setEndDate",endDateDom.val())
            });
        },
        /**
         * 结束日期的可选最小日期大于开始日期
         * @param dom jquery 开始日期dom对象
         * @param defineInitialDate 初始化时默认日期，不需传空字符串，默认为当前日期
         * @param defineStartDate 日期控件可选范围起始日期，不需传空字符串，默认无限制
         * @param defineEndDate 日期控件可选范围截止日期，不需传空字符串，默认无限制
         * @param endDateDom 结束日期dom对象
         * 
         */
        endDateMoreStartDateMonth: function (dom,defineInitialDate,defineStartDate,defineEndDate,endDateDom) {
        	if(defineInitialDate){
        		
        	}else{
        		defineInitialDate = "";
        	}
        	if(defineStartDate){
        		
        	}else{
        		defineStartDate = "";
        	}
        	if(defineEndDate){
        		
        	}else{
        		defineEndDate = "";
        	}
            dom.datetimepicker({
            	language: "zh-CN",
                autoclose: true,//选中之后自动隐藏日期选择框
                //clearBtn: true,//清除按钮
                todayBtn: true,//今日按钮
                startView:3,
                minView:3,
                startDate:defineStartDate,
                endDate:defineEndDate,
                initialDate:defineInitialDate,
                format: "yyyy-mm"//日期格式
            }).on("click",function(){
            	dom.datetimepicker("setStartDate",endDateDom.val())
            });
        },
    };
})()
