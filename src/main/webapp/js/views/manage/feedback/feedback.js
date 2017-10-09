/**
 * Created by LJW on 2016/11/10.
 */
$(function () {
	getTokenFun();
    $('#feedback-form').validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        onfocusin: function (element) {
            if (this.settings.focusCleanup) {
                $('#' + $(element).attr('id') + '-tip').text('');
            }
        },
        focusCleanup: true,
        onkeyup: false,
        highlight: function (element) {
            $(element).fadeOut(function () {
                $(element).fadeIn();
            });
        },
        errorPlacement: function (error, element) {
            layer.tips(error.text(), '#' + element.attr('id'), {tips: [1, 'red']});
        },
        rules: {
            feedbackContent: {
                required: true,
            }
        },
        messages: {
            feedbackContent: {
                required: '反馈内容不能为空',
            }
        }
    });
    $('#feedback-submit').on('click', function () {
        if ($('#feedback-form').valid()) {
            $(this).attr('disabled', true);
            var index = layer.load(2, {shade: [0.5, '#000']});
            $http.post(basePath + 'feedback/saveFeedback' + suffix, {
            	tokenKey:tokenKey,
				token:token,
            	content: $('#feedback-content').val()
            }, function (response) {
                layer.close(index);
                $('#feedback-submit').attr('disabled', false);
                if('200' === response.code){
                    $('#feedback-content').val('');
                }
                layer.alert(response.msg);
            })
        }
    });
});


//获取token
var token = "";
var tokenKey = "";
function getTokenFun(){
	token = $Utils.getUrlParameters().token;
	tokenKey = $Utils.getUrlParameters().tokenKey;
}
