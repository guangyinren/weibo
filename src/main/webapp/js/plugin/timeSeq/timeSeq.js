(function($) {

    var imgTurn = function(obj, nub, count) {
        if (count >= (nub - 1) / 4) {
            setTimeout(function() {
                obj.append("<img src='../images/public/time_seq/learn/" + nub + ".png' class='turn-img-" + nub + "' />");
            }, 70 * nub);
        }
    }

    $.fn.timeSeq = function() {
        //初始化获取数量 一般为3个一组 000~ 999
        var times = arguments[0];

        $(this).addClass('time-seq');

        if (!isNaN(times)) {
            times = parseInt(times) + '';
            if (times.length == 0) {
                times = '000';
            } else if (times.length == 1) {
                times = '00' + times;
            } else if (times.length == 2) {
                times = '0' + times;
            } else {
                times = times.substring(times.length - 3);
            }
        } else {
            times = '000';
        }

        var firstSpan = $(this).append('<span></span>');
        var secondSpan = $(this).append('<span></span>');
        var thirdSpan = $(this).append('<span></span>');

        for (var i = 0; i < 37; i++) {
            var num = i + 1;
            imgTurn($($(this).find('span')[0]), num, times[0]);
            imgTurn($($(this).find('span')[1]), num, times[1]);
            imgTurn($($(this).find('span')[2]), num, times[2]);
        }

        return this;
    }

})(jQuery)
