package cn.liuyong.weibo.util;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.security.GeneralSecurityException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.client.fluent.Request;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

/**
 * Http请求工具类
 * 
 * @author SONGDAN
 * @modified liuyong 添加decodeParm函数
 */
public final class HttpUtils {

    public static final int timeout = 10;

    /**
     * decode解码函数
     * 
     * @param param
     * @return
     * @throws java.io.UnsupportedEncodingException
     */
    public static String decodeParm(String param) throws UnsupportedEncodingException {
        param = URLDecoder.decode(param, "UTF-8");
        return param;
    }

    /**
     * post 请求
     *
     * @param url
     * @return
     */
    public static String post(String url) {
        return post(url, "");
    }

    /**
     * post请求
     * 
     * @param url
     * @param data
     * @return
     */
    public static String post(String url, String data) {
        return httpPost(url, data);
    }

    /**
     * 发送http post请求
     * 
     * @param url url
     * @param instream post数据的字节流
     * @return
     */
    public static String post(String url, InputStream instream) {
        try {
            HttpEntity entity = Request.Post(url).bodyStream(instream, ContentType.create("text/html", Consts.UTF_8))
                    .execute().returnResponse().getEntity();
            return entity != null ? EntityUtils.toString(entity) : null;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * get请求
     * 
     * @param url
     * @return
     */
    public static String get(String url) {
        return httpGet(url);
    }

    /**
     * post 请求
     *
     * @param url
     * @param data
     * @return
     */
    private static String httpPost(String url, String data) {
        try {
            HttpEntity entity = Request.Post(url).bodyString(data, ContentType.create("text/html", Consts.UTF_8))
                    .execute().returnResponse().getEntity();
            return entity != null ? EntityUtils.toString(entity) : null;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 上传文件
     * 
     * @param url URL
     * @param file 需要上传的文件
     * @return
     */
    public static String postFile(String url, File file) {
        return postFile(url, null, file);
    }

    /**
     * 上传文件
     * 
     * @param url URL
     * @param name 文件的post参数名称
     * @param file 上传的文件
     * @return
     */
    public static String postFile(String url, String name, File file) {
        try {
            HttpEntity reqEntity = MultipartEntityBuilder.create().addBinaryBody(name, file).build();
            Request request = Request.Post(url);
            request.body(reqEntity);
            HttpEntity resEntity = request.execute().returnResponse().getEntity();
            return resEntity != null ? EntityUtils.toString(resEntity) : null;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Json请求
     * 
     * @param url 请求路径
     * @param json json格式的字符串
     * @return 请求结果
     */
    public static String postJson(String url, String json) {
        try {
            HttpEntity entity = Request.Post(url).bodyString(json, ContentType.create("application/json", Consts.UTF_8))
                    .connectTimeout(20000).execute().returnResponse().getEntity();
            return entity != null ? EntityUtils.toString(entity) : null;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 下载文件
     * 
     * @param url URL
     * @return 文件的二进制流，客户端使用outputStream输出为文件
     */
    public static byte[] getFile(String url) {
        try {
            Request request = Request.Get(url);
            HttpEntity resEntity = request.execute().returnResponse().getEntity();
            return EntityUtils.toByteArray(resEntity);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 发送get请求
     *
     * @param url
     * @return
     */
    private static String httpGet(String url) {
        try {
            HttpEntity entity = Request.Get(url).execute().returnResponse().getEntity();
            return entity != null ? EntityUtils.toString(entity, "UTF-8") : null;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static class TrustAnyTrustManager implements X509TrustManager {

        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[] {};
        }
    }

    private static class TrustAnyHostnameVerifier implements HostnameVerifier {

        @Override
        public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    }

    /**
     * post方式请求服务器(https协议)
     * 
     * @param url 请求地址
     * @param content 参数
     * @param charset 编码
     * @return
     * @throws NoSuchAlgorithmException
     * @throws KeyManagementException
     * @throws IOException
     */
    public static String postJsonHttps(String url, String content, String charset) {
        SSLContext sc = null;
        try {
            sc = SSLContext.getInstance("SSL");
            sc.init(null, new TrustManager[] { new TrustAnyTrustManager() }, new java.security.SecureRandom());
            URL console = new URL(url);
            HttpsURLConnection conn = (HttpsURLConnection) console.openConnection();
            conn.setSSLSocketFactory(sc.getSocketFactory());
            conn.setHostnameVerifier(new TrustAnyHostnameVerifier());
            conn.setDoOutput(true);
            conn.connect();
            DataOutputStream out = new DataOutputStream(conn.getOutputStream());
            out.write(content.getBytes(charset));
            // 刷新、关闭
            out.flush();
            out.close();
            InputStream is = conn.getInputStream();
            if (is != null) {
                ByteArrayOutputStream outStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int len = 0;
                while ((len = is.read(buffer)) != -1) {
                    outStream.write(buffer, 0, len);
                }
                is.close();
                byte[] byteArray = outStream.toByteArray();
                String result = new String(byteArray);
                return result;
            }
        }
        catch (KeyManagementException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * 发送get请求
     * 
     * @param url 链接地址
     * @param charset 字符编码，若为null则默认utf-8
     * @return
     */
    public static String doGet4Https(String url) {
        String result = null;
        SSLContext sc = null;
        try {
            sc = SSLContext.getInstance("SSL");
            sc.init(null, new TrustManager[] { new TrustAnyTrustManager() }, new java.security.SecureRandom());
            URL console = new URL(url);
            HttpsURLConnection connection = (HttpsURLConnection) console.openConnection();
            // 设置请求的模式
            connection.setRequestMethod("GET");
            // 设置请求连接超时时间
            connection.setConnectTimeout(5000);
            // 设置访问时的超时时间
            connection.setReadTimeout(5000);
            connection.setSSLSocketFactory(sc.getSocketFactory());
            connection.setHostnameVerifier(new TrustAnyHostnameVerifier());

            connection.setRequestProperty("User-Agent",
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1");
            // 开启连接
            connection.connect();
            InputStream is = connection.getInputStream();
            if (is != null) {
                ByteArrayOutputStream outStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int len = 0;
                while ((len = is.read(buffer)) != -1) {
                    outStream.write(buffer, 0, len);
                }
                is.close();
                byte[] byteArray = outStream.toByteArray();
                result = new String(byteArray);
                return result;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 创建 SSL连接
     * 
     * @return
     * @throws GeneralSecurityException
     */
    private static CloseableHttpClient createSSLInsecureClient() throws GeneralSecurityException {
        try {
            SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, new TrustManager[] { new TrustAnyTrustManager() }, new java.security.SecureRandom());
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, new X509HostnameVerifier() {

                @Override
                public boolean verify(String arg0, SSLSession arg1) {
                    return true;
                }

                @Override
                public void verify(String host, SSLSocket ssl) throws IOException {
                }

                @Override
                public void verify(String host, X509Certificate cert) throws SSLException {
                }

                @Override
                public void verify(String host, String[] cns, String[] subjectAlts) throws SSLException {
                }

            });

            return HttpClients.custom().setSSLSocketFactory(sslsf).build();

        }
        catch (GeneralSecurityException e) {
            throw e;
        }
    }
}
