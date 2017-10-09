package cn.liuyong.weibo.util;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.ExclusionStrategy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import cn.liuyong.weibo.exception.ObjectConvertStringException;
import cn.liuyong.weibo.exception.StringConvertObjectException;

/**
 * json转换工具类
 * 
 * @author Acmen
 */
public final class JsonConvertUtil {

    /**
     * 私有构造函数
     */
    private JsonConvertUtil() {
        throw new IllegalAccessError();
    }

    /**
     * Object转字符串工具(使用Jackson:实体有关联关系时使用)
     * 
     * @param objectModel
     * @return json字符串
     * @throws ObjectConvertStringException
     * @throws JsonProcessingException
     */
    @Deprecated
    public static String objectToJson(Object objectModel) throws ObjectConvertStringException {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(objectModel);
        }
        catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new ObjectConvertStringException(e);
        }
    }

    /**
     * 字符串转Object(使用Jackson)
     * 
     * @param jsonStringData json字符串
     * @param targetClass 形如：UserEntity.class
     * @return Object
     * @throws StringConvertObjectException
     */
    @Deprecated
    public static <T> T jsonToObject(String jsonStringData, Class<T> targetClass) throws StringConvertObjectException {

        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(jsonStringData, targetClass);
        }
        catch (JsonParseException e) {
            e.printStackTrace();
            throw new StringConvertObjectException(e);
        }
        catch (JsonMappingException e) {
            e.printStackTrace();
            throw new StringConvertObjectException(e);
        }
        catch (IOException e) {
            e.printStackTrace();
            throw new StringConvertObjectException(e);
        }
    }

    /**
     * 获取泛型的Collection Type（例如：(ArrayList.class, List.class, String.class);）
     * 
     * @param parametrized 构造类的实例
     * @param parametersFor 构造类或接口的类型
     * @param elementClasses 泛型类型参数
     * @return JavaType Java类型
     */
    @Deprecated
    public static JavaType getCollectionType(Class<?> parametrized, Class<?> parametersFor,
            Class<?>... elementClasses) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.getTypeFactory().constructParametrizedType(parametrized, parametersFor, elementClasses);
    }

    /**
     * JSON串转泛型的对象
     * 
     * @param jsonStringData
     * @param collectionType
     * @return
     */
    @Deprecated
    public static <T> T jsonToObject(String jsonStringData, JavaType collectionType)
            throws StringConvertObjectException {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(jsonStringData, collectionType);
        }
        catch (JsonParseException e) {
            e.printStackTrace();
            throw new StringConvertObjectException(e);
        }
        catch (JsonMappingException e) {
            e.printStackTrace();
            throw new StringConvertObjectException(e);
        }
        catch (IOException e) {
            e.printStackTrace();
            throw new StringConvertObjectException(e);
        }
    }

    /**
     * json格式的字符串转换为Map
     * 
     * @param jsonStr json字符串
     * @return
     */
    public static Map<String, String> json2Map(String jsonStr) {
        return new Gson().fromJson(jsonStr, new TypeToken<Map<String, String>>() {

        }.getType());
    }

    public static Map<String, String> object2Map(Object object) {
        return json2Map(toJson(object));
    }

    /**
     * 从json格式的字符串获取对象
     * 
     * @param json json字符串
     * @param tClass 类型
     * @param <T> 类型参数
     * @return
     */
    public static <T> T fromJson(String json, Class<T> tClass) {
        return new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create().fromJson(json, tClass);
    }

    public static <T> T fromJson(String json, Type type) {
        return new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create().fromJson(json, type);
    }

    public static String toJson(Object obj) {
        return new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create().toJson(obj);
    }

    public static String toJson(Object obj, ExclusionStrategy... exclusionStrategies) {
        return new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").setExclusionStrategies(exclusionStrategies)
                .create().toJson(obj);
    }
}
