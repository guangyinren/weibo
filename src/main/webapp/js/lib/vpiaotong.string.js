/**
 * 扩展原生JS
 * Created by Songdan on 2016/5/18.
 */
/**
 * 校验是否为数字
 *
 * @return true||false
 */
String.prototype.checkNum=function checkNum() {
    if (isNaN(this)) {
        // 不是数字返回false
        return false;
    }
    // 是数字返回true
    return true;
}