package cn.liuyong.weibo.util;

import java.math.BigDecimal;

/**
 * 提取码生成器
 * @author Songdan
 * @date 2017/5/16 10:02
 */
public interface ExtractCodeGenerator {

    /**
     * 生成提取码
     * @return 提取码
     */
    String generate(BigDecimal totalAmount);

    boolean checkExtractCode(String extractCode, BigDecimal totalAmount);

}
