package cn.liuyong.weibo;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Random;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import cn.liuyong.weibo.model.Cardgroup;
import cn.liuyong.weibo.model.Comment;
import cn.liuyong.weibo.model.User;
import cn.liuyong.weibo.service.ICommentService;
import cn.liuyong.weibo.service.IUserService;
import cn.liuyong.weibo.util.CalendarUtil;
import cn.liuyong.weibo.util.HttpUtils;
import cn.liuyong.weibo.util.JsonConvertUtil;

@RunWith(SpringJUnit4ClassRunner.class)     // 表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = { "classpath:spring-mybatis.xml" })
public class TestWeibo {

    private static Logger logger = Logger.getLogger(TestWeibo.class);

    @Autowired
    private ICommentService commentService;

    @Autowired
    private IUserService userService;

    @Test
    public void testComment() {
        Comment comment = new Comment();
        comment.setId("4100071404216355");
        comment.setCreated_at("04-24 14:51");
        commentService.insertComment(comment);
        logger.info(JsonConvertUtil.toJson(comment));
    }

    @Test
    public void testGetCommentById() {
        Comment queryComment = commentService.getCommentById("4100071404216355");
        logger.info(JsonConvertUtil.toJson(queryComment));
    }

    @Test
    public void testGetSingleComment() throws InterruptedException, IOException {
        String url = "https://m.weibo.cn/single/rcList?format=cards&id=4099847185178444&type=comment&hot=0&page=552";
        String response = HttpUtils.doGet4Https(url);
        if (StringUtils.isEmpty(response)) {
            System.out.println("================="
                    + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true) + ":" + "无内容");
            Thread.sleep(randomSecond());
        } else {
            response = response.substring(1, response.length() - 1);
            Cardgroup cardgroup = JsonConvertUtil.fromJson(response, Cardgroup.class);
            List<Comment> commentList = cardgroup.getCard_group();
            System.out.println(
                    "=================" + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true)
                            + ":" + commentList.size());
            for (Comment comment : commentList) {
                Comment queryComment = commentService.getCommentById(comment.getId());
                if (queryComment == null) {
                    comment.setUser_id(comment.getUser().getId());
                    commentService.insertComment(comment);
                }
                User user = userService.getUserById(comment.getUser().getId());
                if (user == null) {
                    userService.insertUser(comment.getUser());
                }
            }
            Thread.sleep(randomSecond());
        }
    }

    @Test
    public void testGetFailComment() throws InterruptedException, IOException {
        String str = "171,340,361,366,371,464,552,597,597,625,666,";
        String strArr[] = str.split(",");
        for (String string : strArr) {
            try {
                String url = "https://m.weibo.cn/single/rcList?format=cards&id=4099847185178444&type=comment&hot=0&page="
                        + string;
                String response = HttpUtils.doGet4Https(url);
                if (StringUtils.isEmpty(response)) {
                    String logStr = "================="
                            + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true) + ":" + string
                            + "无内容";
                    System.out.println(logStr);
                    writeLog(logStr);
                    writeFailInfo(string);
                    Thread.sleep(randomSecond());
                } else {
                    response = response.substring(1, response.length() - 1);
                    Cardgroup cardgroup = JsonConvertUtil.fromJson(response, Cardgroup.class);
                    List<Comment> commentList = cardgroup.getCard_group();
                    String logStr = "================="
                            + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true) + ":" + string
                            + "======" + commentList.size();
                    System.out.println(logStr);
                    writeLog(logStr);
                    for (Comment comment : commentList) {
                        Comment queryComment = commentService.getCommentById(comment.getId());
                        if (queryComment == null) {
                            comment.setUser_id(comment.getUser().getId());
                            commentService.insertComment(comment);
                        }
                        User user = userService.getUserById(comment.getUser().getId());
                        if (user == null) {
                            userService.insertUser(comment.getUser());
                        }
                    }
                    Thread.sleep(randomSecond());
                }
            }
            catch (Exception e) {
                String logStr = "================="
                        + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true) + ":" + string
                        + "无内容";
                System.out.println(logStr);
                writeLog(logStr);
                writeLog(e.getMessage());
                e.printStackTrace();
                writeFailInfo(string);
                Thread.sleep(randomSecond());
            }
        }
    }

    @Test
    public void testGetComment() throws InterruptedException, IOException {
        for (int i = 728; i < 1000; i++) {
            try {
                String url = "https://m.weibo.cn/single/rcList?format=cards&id=4099847185178444&type=comment&hot=0&page="
                        + i;
                String response = HttpUtils.doGet4Https(url);
                if (StringUtils.isEmpty(response)) {
                    String logStr = "================="
                            + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true) + ":" + i
                            + "无内容";
                    System.out.println(logStr);
                    writeLog(logStr);
                    writeFailInfo(i + "");
                    Thread.sleep(randomSecond());
                } else {
                    response = response.substring(1, response.length() - 1);
                    Cardgroup cardgroup = JsonConvertUtil.fromJson(response, Cardgroup.class);
                    List<Comment> commentList = cardgroup.getCard_group();
                    String logStr = "================="
                            + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true) + ":" + i
                            + "======" + commentList.size();
                    System.out.println(logStr);
                    writeLog(logStr);
                    for (Comment comment : commentList) {
                        Comment queryComment = commentService.getCommentById(comment.getId());
                        if (queryComment == null) {
                            comment.setUser_id(comment.getUser().getId());
                            commentService.insertComment(comment);
                        }
                        User user = userService.getUserById(comment.getUser().getId());
                        if (user == null) {
                            userService.insertUser(comment.getUser());
                        }
                    }
                    Thread.sleep(randomSecond());
                }
            }
            catch (Exception e) {
                String logStr = "================="
                        + CalendarUtil.convertDateTimeToString(CalendarUtil.getCurrDateTime(), true) + ":" + i + "无内容";
                System.out.println(logStr);
                writeLog(logStr);
                writeLog(e.getMessage());
                e.printStackTrace();
                writeFailInfo(i + "");
                Thread.sleep(randomSecond());
            }
        }
    }

    private void writeLog(String str) throws IOException {
        FileWriter logFw = new FileWriter("src/main/resources/log.txt", true);
        BufferedWriter logBw = new BufferedWriter(logFw);
        logBw.write(str + "\n");// 往已有的文件上添加字符串
        logBw.close();
        logFw.close();
    }

    private void writeFailInfo(String str) throws IOException {
        FileWriter fw = new FileWriter("src/main/resources/fail.txt", true);
        BufferedWriter bw = new BufferedWriter(fw);
        bw.write(str + ",");// 往已有的文件上添加字符串
        bw.close();
        fw.close();
    }

    private static int randomSecond() {
        int max = 20000;
        int min = 60000;
        Random random = new Random();
        int s = random.nextInt(max) % (max - min + 1) + min;
        return s;
    }

    public static void main(String[] args) throws InterruptedException, IOException, ClassNotFoundException {
        proxyIp();
        /*for (int i = 2; i < 5; i++) {
            String url = "https://m.weibo.cn/single/rcList?format=cards&id=4099847185178444&type=comment&hot=0&page="
                    + i;
            String response = HttpUtils.doGet4Https(url);
            if (StringUtils.isEmpty(response)) {
                System.out.println("=================" + CalendarUtil.getCurrDateTime() + ":" + i + "无内容");
                Thread.sleep(randomSecond());
            } else {
                response = response.substring(1, response.length() - 1);
                Cardgroup cardgroup = JsonConvertUtil.fromJson(response, Cardgroup.class);
                List<Comment> commentList = cardgroup.getCard_group();
                System.out.println(commentList.size());
                for (Comment comment : commentList) {
        
                }
                System.out.println("=================" + CalendarUtil.getCurrDateTime() + ":" + i);
                response = response.substring(1, response.length() - 1);
                Gson gson = new GsonBuilder().create();
                Map<String, Object> map = gson.fromJson(response, Map.class);
                Object card_group = map.get("card_group");
                String cardgroupStr = card_group.toString();
                cardgroupStr = cardgroupStr.substring(1, cardgroupStr.length() - 1);
                if (cardgroupStr.contains("smile") || cardgroupStr.contains("勇气")
                        || cardgroupStr.contains("Galaxy NOTE III")) {
                    FileWriter fw = new FileWriter("C:\\Users\\liuyong\\Desktop\\weibotest.txt", true);
                    BufferedWriter bw = new BufferedWriter(fw);
                    bw.write(cardgroupStr);// 往已有的文件上添加字符串
                    bw.write("\n ");
                    bw.close();
                    fw.close();
                    System.out.println(cardgroupStr);
                }
                Thread.sleep(randomSecond());
            }
        }*/
    }

    private static void proxyIp() throws ClassNotFoundException, IOException {
        StringBuffer html = new StringBuffer();
        // 如果不设置，只要代理IP和代理端口正确,此项不设置也可以
        InputStream input = Class.forName(TestWeibo.class.getName())
                .getResourceAsStream("src/main/resources/proxyip.txt");
        String inputLine;
        byte[] buf = new byte[4096];
        int bytesRead = 0;
        while (bytesRead >= 0) {
            inputLine = new String(buf, 0, bytesRead, "ISO-8859-1");
            html.append(inputLine);
            bytesRead = input.read(buf);
            inputLine = null;
        }
        String ipStr = html.toString();
        String ipArr[] = ipStr.split(",");
        int index = generateRandomNum(0, ipArr.length);
        if (index == 0) {
            System.out.println("============启用本机ip");
        } else {
            String ipAddress = ipArr[index];
            String ipAddressArr[] = ipAddress.split(":");
            String ip = ipAddressArr[0];
            String port = ipAddressArr[1];
            System.setProperty("http.maxRedirects", "50");
            System.getProperties().setProperty("proxySet", "true");
            System.getProperties().setProperty("http.proxyHost", ip);
            System.getProperties().setProperty("http.proxyPort", "80");
        }
        /*String ip = "111.161.120.63";
        ip = "123.125.116.151";*/
        /*ip = "221.130.18.5";
        ip = "221.130.23.135";
        ip = "221.130.18.78";
        ip = "221.130.23.134";
        ip = "221.130.18.49";
        ip = "111.1.32.36";
        ip = "221.130.18.49";
        ip = "221.130.18.49";*/
        // 确定代理是否设置成功
        // System.out.println(getHtml("http://city.ip138.com/ip2city.asp"));
    }

    private static void checkProxyIp() {

    }

    private static int generateRandomNum(int start, int end) {
        int max = 20000;
        int min = 60000;
        Random random = new Random();
        int s = random.nextInt(max) % (max - min + 1) + min;
        return s;
    }

    private static String getHtml(String address) {
        StringBuffer html = new StringBuffer();
        String result = null;
        try {
            URL url = new URL(address);
            URLConnection conn = url.openConnection();
            conn.setRequestProperty("User-Agent",
                    "Mozilla/4.0 (compatible; MSIE 7.0; NT 5.1; GTB5; .NET CLR 2.0.50727; CIBA)");
            BufferedInputStream in = new BufferedInputStream(conn.getInputStream());

            try {
                String inputLine;
                byte[] buf = new byte[4096];
                int bytesRead = 0;
                while (bytesRead >= 0) {
                    inputLine = new String(buf, 0, bytesRead, "ISO-8859-1");
                    html.append(inputLine);
                    bytesRead = in.read(buf);
                    inputLine = null;
                }
                buf = null;
            }
            finally {
                in.close();
                conn = null;
                url = null;
            }
            result = new String(html.toString().trim().getBytes("ISO-8859-1"), "gb2312").toLowerCase();

        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        finally {
            html = null;
        }
        return result;
    }
}
