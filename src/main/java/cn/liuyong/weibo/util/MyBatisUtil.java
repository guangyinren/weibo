package cn.liuyong.weibo.util;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.binding.MapperMethod;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.mapping.SqlSource;

import com.google.common.base.Objects;

import cn.liuyong.weibo.page.dialect.Dialect;

public class MyBatisUtil {

    public final static int INDEX_MAPPED_STATEMENT = 0;

    public final static int INDEX_PARAMETER = 1;

    public final static int INDEX_ROW_BOUNDS = 2;

    public final static int INDEX_RESULT_HANDLER = 3;

    private final static String ANNOTATION_PARAM_PREFIX = "param";

    private final static String PRODUCT_MYSQL = "mysql";

    private final static String PRODUCT_ORACLE = "oracle";

    public static Dialect.DbType getDbType(DataSource dataSource) {
        if (dataSource != null) {
            String productName = null;
            try {
                productName = dataSource.getConnection().getMetaData().getDatabaseProductName();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            if (productName != null) {
                productName = productName.toLowerCase();
                if (productName.indexOf(PRODUCT_MYSQL) >= 0) {
                    return Dialect.DbType.MySQL;
                } else if (productName.indexOf(PRODUCT_ORACLE) >= 0) {
                    return Dialect.DbType.ORACLE;
                }
            }
        }
        return null;
    }

    public static MappedStatement buildMappedStatement(MappedStatement ms, BoundSql boundSql, String sql) {
        MappedStatement.Builder builder = new MappedStatement.Builder(ms.getConfiguration(), ms.getId(),
                new BoundSqlSqlSource(ms, boundSql, sql), ms.getSqlCommandType());
        builder.resource(ms.getResource());
        builder.parameterMap(ms.getParameterMap());
        builder.resultMaps(ms.getResultMaps());
        builder.fetchSize(ms.getFetchSize());
        builder.timeout(ms.getTimeout());
        builder.statementType(ms.getStatementType());
        builder.resultSetType(ms.getResultSetType());
        builder.cache(ms.getCache());
        builder.flushCacheRequired(ms.isFlushCacheRequired());
        builder.useCache(ms.isUseCache());
        builder.keyGenerator(ms.getKeyGenerator());
        builder.keyProperty(delimitedArraytoString(ms.getKeyProperties()));
        builder.keyColumn(delimitedArraytoString(ms.getKeyColumns()));
        builder.databaseId(ms.getDatabaseId());

        return builder.build();
    }

    private static String delimitedArraytoString(String[] in) {
        if (in == null || in.length == 0) {
            return null;
        } else {
            StringBuilder answer = new StringBuilder();
            for (String str : in) {
                answer.append(str).append(",");
            }
            return answer.toString();
        }
    }

    private static class BoundSqlSqlSource implements SqlSource {

        private final BoundSql boundSql;

        public BoundSqlSqlSource(MappedStatement ms, BoundSql boundSql, String sql) {
            this.boundSql = buildBoundSql(ms, boundSql, sql);
        }

        public BoundSql getBoundSql(Object parameterObject) {
            return boundSql;
        }

        private BoundSql buildBoundSql(MappedStatement ms, BoundSql boundSql, String sql) {
            BoundSql newBoundSql = new BoundSql(ms.getConfiguration(), sql, boundSql.getParameterMappings(),
                    boundSql.getParameterObject());
            for (ParameterMapping mapping : boundSql.getParameterMappings()) {
                String prop = mapping.getProperty();
                if (boundSql.hasAdditionalParameter(prop)) {
                    newBoundSql.setAdditionalParameter(prop, boundSql.getAdditionalParameter(prop));
                }
            }
            return newBoundSql;
        }

    }

    public static Object getExecuteParamByAnnotationClass(Object[] args, Class annotationClass) {
        Object value = null;
        if (args.length > 1) {
            Object paramValue = args[0];
            if (paramValue instanceof MappedStatement) {
                MappedStatement mappedStatement = (MappedStatement) paramValue;
                Method method = MyBatisUtil.shardMapperMethod(mappedStatement,
                        MyBatisUtil.mapperClazz(mappedStatement));
                // System.out.println("----------method.getAnnotation(UseMaster.class)------"
                // + (method.getAnnotation(UseMaster.class) != null));
                Annotation[][] annotations = method.getParameterAnnotations();
                boolean find = false;
                for (int i = 0; i < annotations.length; i++) {
                    for (Annotation annotation : annotations[i]) {
                        if (annotationClass.isInstance(annotation)) {
                            // System.out.println("args[1] class=" +
                            // args[1].getClass().getName());
                            if (args[1] instanceof MapperMethod.ParamMap) {
                                value = Reflections.getPropertyValue(args[1], ANNOTATION_PARAM_PREFIX + (i + 1));
                            } else {
                                value = args[1];
                            }
                            find = true;
                            break;
                        }
                    }
                    if (find) {
                        break;
                    }
                }
            }
        }
        return value;
    }

    public static Object getExecuteParamByAnnotationClass(Object[] args, Method method, Class annotationClass) {
        Object value = null;
        if (args.length > 1) {
            Annotation[][] annotations = method.getParameterAnnotations();
            boolean find = false;
            for (int i = 0; i < annotations.length; i++) {
                for (Annotation annotation : annotations[i]) {
                    if (annotationClass.isInstance(annotation)) {
                        // System.out.println("args[1] class=" +
                        // args[1].getClass().getName());
                        if (args[1] instanceof MapperMethod.ParamMap) {
                            value = Reflections.getPropertyValue(args[1], ANNOTATION_PARAM_PREFIX + (i + 1));
                        } else {
                            value = args[1];
                        }
                        find = true;
                        break;
                    }
                }
                if (find) {
                    break;
                }
            }
        }
        return value;
    }

    public static Class<?> mapperClazz(MappedStatement mappedStatement) {
        String mapperId = mappedStatement.getId();

        String _mapperClazz = StringUtils.substringBeforeLast(mapperId, ".");

        Class<?> mapperClazz = null;
        try {
            mapperClazz = Class.forName(_mapperClazz);
        }
        catch (ClassNotFoundException e) {}
        return mapperClazz;
    }

    public static Method shardMapperMethod(MappedStatement mappedStatement, Class<?> mapperClazz) {
        String _mapperMethod = StringUtils.substringAfterLast(mappedStatement.getId(), ".");

        Method mapperMethod = null;
        for (Method method : mapperClazz.getMethods()) {
            if (Objects.equal(method.getName(), _mapperMethod)) {
                mapperMethod = method;
                break;
            }
        }
        return mapperMethod;
    }

}
