/**
 * Created by Songdan on 2016/5/13.
 */
var basePath = window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:"")+"/";
var suffix = ".pt";
function swapUrl(relativeUrl){
    if (!relativeUrl.startsWith(basePath)) {
        relativeUrl = basePath + relativeUrl;
    }
    if(!relativeUrl.endsWith(suffix)){
        relativeUrl = relativeUrl+suffix;
    }
    return relativeUrl;
}