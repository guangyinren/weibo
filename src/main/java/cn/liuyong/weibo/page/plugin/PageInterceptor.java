package cn.liuyong.weibo.page.plugin;

import java.sql.Connection;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.logging.Log;
import org.apache.ibatis.logging.LogFactory;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.SystemMetaObject;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.RowBounds;

import cn.liuyong.weibo.page.dialect.Dialect;
import cn.liuyong.weibo.page.dialect.DialectFactory;
import cn.liuyong.weibo.util.MyBatisUtil;

@Intercepts({ @Signature(type = StatementHandler.class, method = "prepare", args = { Connection.class }) })
public class PageInterceptor implements Interceptor {

    private static final Log log = LogFactory.getLog(PageInterceptor.class);

    private String pagingSqlIdRegex;

    public Object intercept(Invocation ivk) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) ivk.getTarget();
        MetaObject metaStatementHandler = SystemMetaObject.forObject(statementHandler);
        RowBounds rowBounds = (RowBounds) metaStatementHandler.getValue("delegate.rowBounds");
        MappedStatement mappedStatement = (MappedStatement) metaStatementHandler.getValue("delegate.mappedStatement");
        int offset = rowBounds.getOffset();
        int limit = rowBounds.getLimit();
        boolean intercept = mappedStatement.getId().matches(pagingSqlIdRegex);
        Configuration configuration = mappedStatement.getConfiguration();
        Dialect dialect = DialectFactory.buildDialect(getDbType(configuration));
        if (intercept && dialect.supportsLimit()
                && (offset != RowBounds.NO_ROW_OFFSET || limit != RowBounds.NO_ROW_LIMIT)) {
            BoundSql boundSql = statementHandler.getBoundSql();
            // Object parameterObject = boundSql.getParameterObject();
            // Connection connection = (Connection) ivk.getArgs()[0];

            String originalSql = (String) metaStatementHandler.getValue("delegate.boundSql.sql");
            metaStatementHandler.setValue("delegate.boundSql.sql", dialect.getLimitString(originalSql, offset, limit));
            metaStatementHandler.setValue("delegate.rowBounds.offset", RowBounds.NO_ROW_OFFSET);
            metaStatementHandler.setValue("delegate.rowBounds.limit", RowBounds.NO_ROW_LIMIT);
            if (log.isDebugEnabled()) {
                log.debug("limit sql: " + boundSql.getSql());
            }
        }
        return ivk.proceed();
    }

    private Dialect.DbType getDbType(Configuration configuration) {
        String databaseId = configuration.getDatabaseId();
        if (StringUtils.isNotBlank(databaseId)) {
            return Dialect.DbType.valueOf(databaseId);
        } else {
            DataSource dataSource = configuration.getEnvironment() != null
                    ? configuration.getEnvironment().getDataSource() : null;
            if (dataSource != null) {
                return MyBatisUtil.getDbType(dataSource);
            }
        }

        return Dialect.DbType.MySQL;
    }

    public Object plugin(Object arg0) {

        return Plugin.wrap(arg0, this);
    }

    public void setProperties(Properties properties) {
        ;
        this.pagingSqlIdRegex = properties.getProperty("pagingSqlIdRegex") == null ? "*"
                : properties.getProperty("pagingSqlIdRegex");
    }

}
