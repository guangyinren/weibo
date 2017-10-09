/**
 * 定时器
 * Created by SONGDAN on 2016/3/25.
 */
(function($,window){
    window.Timer= $.fn.Timer={
        /**
         * 执行倒计时 {"id":"页面id","time":"倒计时周期","callback":"回调函数","endText":"倒计时结束时文本值","exeCuteText":"执行时文本"}
         * @param options
         */
        execute:function(options){
            var defaultRun = function () {
                console.info("no call run");
            };
            var $owner = $("#"+options.id||"timer_test");
            var settings = $.extend({
                        time:60,
                        endText:"发送验证码",
                        exeCuteText:"秒后重新发送",
                        callback:defaultRun
                    },
                    $owner.data('settings')||{},
                    options||{}
                );
            $owner.data('settings');
            $owner.text(settings.text);
            var tempTime = settings.time;
            $owner.prop('onclick',null).off('click');
            $owner.off('click');
            down();
            /**倒计时执行函数*/
            function down(){
                if(tempTime>0){
                    $owner.prop('onclick',null).off('click');
                    $owner.text(tempTime--+settings.exeCuteText);
                    setTimeout(down,1000);
                }else{
                    $owner.on("click", settings.callback);
                    $owner.text(settings.endText);
                    tempTime=settings.time||60;
                }
            }
        }
    }
})(jQuery,window);
