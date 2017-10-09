/**
 * 创建和存储cookie
 * <script type="text/javascript" src="/js/lib/vpiaotong.cookie.js"></script>
 * liuyong 2017/04/19.
 */
(function() {
    window.CookieObj = {
		/**
         * cookie存值
         * @param c_name cookie的key
         * @param value key对应的value
         * @param expiredays 有效时间 单位为天
         */
    	setCookie:function setCookie(c_name,value,expiredays){
			var exdate=new Date();
			exdate.setTime(exdate.getTime()+expiredays*3600*1000);
			document.cookie = c_name+ "=" + escape(value) + ";expires="+exdate.toGMTString();
		},
		/**
         * cookie取值
         * @param name cookie的key
         */
		getCookie:function getCookie(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
			else
			return null;
		}
    };
})()
