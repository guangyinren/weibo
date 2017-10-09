/**
 * Created by Songdan on 2016/4/18.
 */
function ScrollHandler(bottom) {
    this.bottom = bottom ? bottom : 0;
    this.timeoutId;
}

function getDistance() {
    var scrollPosition = window.pageYOffset;
    var windowSize     = window.innerHeight;
    var bodyHeight     = document.body.offsetHeight;

    return (Math.max(bodyHeight - (scrollPosition + windowSize), 0));
}
ScrollHandler.prototype.doScroll = function (callback) {
    var bottom = this.bottom;
    var timeoutId = this.timeoutId;
    var _this = this;
    $(window).scroll(function() {
        //使用函数节流
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function () {
            if(getDistance()<=bottom) {
                callback.apply(_this);
            }
        }, 500);
    });
}