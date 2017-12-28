package cn.liuyong.weibo.enums;

/**
 * 有效期类型枚举
 * 
 * @author liuyong
 *
 */
public enum ExpiredaysEnums {
    /** 一天 */
    ONE_DAY("1", "一天"),
    /** 两天 */
    TWO_DAY("2", "两天"),
    /** 三天 */
    THREE_DAY("3", "三天"),
    /** 一周 */
    ONE_WEEK("7", "一周"),
    /** 半个月 */
    HALF_MONTH("15", "半个月"),
    /** 一个月 */
    ONE_MONTH("30", "一个月"),
    /** 三个月 */
    THREE_MONTH("90", "三个月"),
    /** 半年 */
    HALF_YEAR("180", "半年"),
    /** 一年 */
    ONE_YEAR("365", "一年"),
    /** 永久有效 */
    NEVER("36500", "永久有效");

    private String code;

    public String getCode() {
        return code;
    }

    private String msg;

    public String getMsg() {
        return msg;
    }

    public String getValue() {
        return getCode();
    }

    private ExpiredaysEnums(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public static ExpiredaysEnums getByCode(String code) {

        for (ExpiredaysEnums issueTypeEnums : ExpiredaysEnums.values()) {
            if (issueTypeEnums.getCode().equals(code)) {
                return issueTypeEnums;
            }
        }
        return null;

    }

}
