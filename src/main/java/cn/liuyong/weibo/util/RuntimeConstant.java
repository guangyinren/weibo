package cn.liuyong.weibo.util;

/**
 * 应用于运行时的常量集合
 *
 * @author jwh
 * @version 1.0
 */
public final class RuntimeConstant {

    // 定义客户端来源
    public static final String PC = "PC";

    public static final String APP = "APP";

    /**
     * 每页显示的数据条数
     */
    public static final int PAGESIZE = 10;

    /**
     * 图片大小最大值
     *
     * @author limr
     */

    public static final int MAXSIZE = 5 * 1024 * 1024;

    /**
     * 图片宽度最大值
     *
     * @author limr
     */
    public static final int MAXWIDTH = 4096;

    /**
     * 图片高度最大值
     *
     * @author limr
     */
    public static final int MAXHEIGHT = 4096;

    public static final String IMGURL = "imgUrl";

    public static final String EXCELURL = "excelUrl";

    public static final String RESET_PWD_PHONE = "reset_pwd_phone";

    public static final String RESET_PWD_LOGIN_NAME = "reset_pwd_login_name";

    public static final String LOGIN_PUBLIC_KEY = "rsaPublicKey";

    public static final String LOGIN_PRIVATE_KEY = "rsaPrivateKey";

    public static final String LOGIN_NAME = "login_name";

    public static final String LOGIN_PUBLIC_PHONE = "login_public_phone";

    public static final String LOGIN_PUBLIC_EMPONT = "login_public_empont";

    public static final String LOGIN_PUBLIC_CAPTCHA = "login_public_captcha";

    public static final String LOGIN_PUBLIC_CAPTCHA_VALUE = "default";

    /**
     * 文件允许格式
     *
     * @author limr
     */
    public final static String[] getAllowFiles() {
        String allowfiles[] = { ".png", ".jpg", ".jpeg", ".bmp" };
        return allowfiles;
    }

    /**
     * 数据返回data
     */
    public static final String DATA = "data";

    /**
     * 数据返回status
     */
    public static final String STATE = "state";

    /**
     * 数据返回flag
     */
    public static final String FLAG = "flag";

    /**
     * 数据返回MSG
     */
    public static final String MSG = "msg";

    /**
     * 数据返回CODE
     */
    public static final String CODE = "code";

    /**
     * 数据返回rows
     */
    public static final String ROWS = "rows";

    /**
     * 数据返回total
     */
    public static final String TOTAL = "total";

    /**
     * 数据返回create_time
     */
    public static final String CREATETIME = "create_time ";

    /**
     * 数据返回sort
     */
    public static final String SORT = "sort ";

    /**
     * 数据返回asc
     */
    public static final String ASC = "asc";

    /**
     * 数据返回desc
     */
    public static final String DESC = "desc";

    /**
     * 数据返回pageSize
     */
    public static final String PAGESIZES = "pageSize";

    /**
     * 数据返回pageIndex
     */
    public static final String PAGEINDEX = "pageIndex";

    /**
     * 列表是否还有下一页标志
     */
    public static final String HAS_NEXT = "hasNext";

}
