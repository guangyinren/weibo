/*
*名称:图片上传本地预览插件 v1.1
*作者:周祥
*时间:2013年11月26日
*介绍:基于JQUERY扩展,图片上传预览插件 目前兼容浏览器(IE 谷歌 火狐) 不支持safari
*插件网站:http://keleyi.com/keleyi/phtml/image/16.htm
*参数说明: Img:图片ID;Width:预览宽度;Height:预览高度;ImgType:支持文件类型;Callback:选择文件显示图片后回调方法;
*使用方法: 
<div>
<img id="ImgPr" width="120" height="120" /></div>
<input type="file" id="up" />
把需要进行预览的IMG标签外 套一个DIV 然后给上传控件ID给予uploadPreview事件
$("#up").uploadPreview({ Img: "ImgPr", Width: 120, Height: 120, ImgType: ["gif", "jpeg", "jpg", "bmp", "png"], Callback: function () { }});
*/
jQuery.fn.extend({
    uploadPreview: function (opts) {
        var _self = this,
            _this = $(this);
        opts = jQuery.extend({
            Img: "ImgPr",
            Width: 100,
            Height: 100,
            defaultPic:"/images/add.jpg",
            ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
            Callback: function () {}
        }, opts || {});
        _self.getObjectURL = function (file) {
        	//console.log(file);
            var url = null;
            if (window.createObjectURL != undefined) {
                url = window.createObjectURL(file)
            } else if (window.URL != undefined) {
                url = window.URL.createObjectURL(file)
            } else if (window.webkitURL != undefined) {
                url = window.webkitURL.createObjectURL(file)
            }
            return url
        };
        _this.change(function () {
        	console.log(this);
        	console.log(this.value);
            if (this.value) {
                if (!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
//                    alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
                    this.value = "";
                    return false
                }
                if (navigator.userAgent.indexOf("MSIE") > -1) {
                    try {
                    	console.log("--1");
                    	console.log(_self.getObjectURL(this.files[0]));
                    	console.log("--2");
                        $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
                    } catch (e) {
                    	console.log("---err");
                        var src = "";
                        var obj = $("#" + opts.Img);
                        var div = obj.parent("div")[0];
                        _self.select();
                        if (top != self) {
                            window.parent.document.body.focus()
                        } else {
                            _self.blur()
                        }
                        src = document.selection.createRange().text;
                        document.selection.empty();
                        obj.hide();
                        obj.parent("div").css({
                            'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
                            'width': opts.Width + 'px',
                            'height': opts.Height + 'px'
                        });
                        div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src;
                        $(".yy_tu").css("margin-top","213px");
                    }
					 $(".yy_tu").show();
					 $(".fpic").hide();
					 console.log("-----------------");
                } else {
                	if(_self.getObjectURL(this.files[0]) == null){
                			if(typeof FileReader == 'undefined'){ 
                				$("#" + opts.Img).attr('src',null);
//                				alert("您浏览器不支持本地预览,选择完图片可直接提交！");
                			}else{
		                	    reader.readAsDataURL(this.files[0]);
		                	    reader.onload = function(e){
		                	        $("#" + opts.Img).attr('src',this.result);
			                	}
								                	    }
                	}else{
                		 $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
						 $(".yy_tu").show();
						 $(".fpic").hide();
                	}
                }
                opts.Callback()
            }else{
            	console.log(opts.defaultPic);
            	 $("#" + opts.Img).attr('src',opts.defaultPic)
            }
            if($("#delPic").attr("href") == undefined){
            	//$("#picLocation").append("<a id=\"delPic\" href=\"javascript:delPic()\" class=\"delete\"><img src=\"/images/gb.png\" style=\"width:24px;height:24px;\"></a>");
            }
            if($("picMark")!=undefined){
            	$("#picMark").val("0");
            }
        })
    }
});
function delPic(){
		$("#pic").val("");
		$("#ImgPr").attr("src","/images/add.jpg");
		$("#delPic").remove();
		$(".fpic").show();
		$(".yy_tu").hide();
	}