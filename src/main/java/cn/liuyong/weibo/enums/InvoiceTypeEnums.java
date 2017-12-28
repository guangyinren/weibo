package cn.liuyong.weibo.enums;

/**
 * 发票种类代码枚举分为电子增值税发票和增值税普通发票
 * 
 * @author Songdan
 * @date 2017/3/30 11:12
 */
public enum InvoiceTypeEnums {

    /**
     * 增值税电子发票
     */
    ELE_INVOICE("10"),
    /**
     * 增值税电子发票
     */
    OLD_ELE_INVOICE("51"),
    /**
     * 卷票
     */
    ROLL_INVOICE("41"),
    /**
     * 增值税普通发票
     */
    PAPER_INVOICE("04"),

    /** 增值税专用发票 */
    SPECIAL_INVOICE("01");

    private final String code;

    InvoiceTypeEnums(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public String getValue() {
        return getCode();
    }

    public static InvoiceTypeEnums getByCode(String code) {
        for (InvoiceTypeEnums invoiceTypeEnums : InvoiceTypeEnums.values()) {
            if (invoiceTypeEnums.getValue().equals(code)) {
                return invoiceTypeEnums;
            }
        }
        return null;
    }
}
