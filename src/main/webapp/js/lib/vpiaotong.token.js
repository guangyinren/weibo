/**
 * Created by Songdan on 2016/10/17.
 */
(function(){
    window.TokenBuilder = {
        build:function(name) {
            var xhr = new XMLHttpRequest();
            xhr.open("get","/token/"+name+"?_="+new Date().getTime(),true);
            xhr.send();
            xhr.onreadystatechange=function() {
                if(xhr.readyState==4&&xhr.status==200) {
                    var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("id", "token_"+name);
                    hiddenField.setAttribute("value", xhr.responseText);
                    document.body.appendChild(hiddenField);
                }
            };
        }
    };
})();