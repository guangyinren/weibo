package cn.liuyong.weibo.page.dialect;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public abstract class DialectFactory {

    private static Map<Dialect.DbType, Dialect> map = new ConcurrentHashMap<Dialect.DbType, Dialect>();;

    public static Dialect buildDialect(Dialect.DbType dialectType) {
        Dialect dialect = map.get(dialectType);
        if (dialect != null) {
            return dialect;
        }
        switch (dialectType) {
            case MySQL:
                dialect = new MysqlDialect();
                break;
            case ORACLE:
                dialect = new OracleDialect();
                break;
            default:
                throw new UnsupportedOperationException();
        }
        map.put(dialectType, dialect);
        return dialect;
    }
}
