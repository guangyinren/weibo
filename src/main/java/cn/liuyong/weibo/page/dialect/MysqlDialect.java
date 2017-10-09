package cn.liuyong.weibo.page.dialect;

public class MysqlDialect extends Dialect {

    @Override
    public boolean supportsLimit() {
        return true;
    }

    @Override
    public String getLimitString(final String sql, final int offset, final int limit) {
        return getLimitString(sql, offset, Integer.toString(offset), Integer.toString(limit));
    }

    private String getLimitString(final String sql, final int offset, final String offsetPlaceholder,
            final String limitPlaceholder) {
        StringBuilder stringBuilder = new StringBuilder(getLineSql(sql));
        stringBuilder.append(" limit ");
        if (offset > 0) {
            stringBuilder.append(offsetPlaceholder).append(",").append(limitPlaceholder);
        } else {
            stringBuilder.append(limitPlaceholder);
        }
        return stringBuilder.toString();
    }
}
