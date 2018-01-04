package cn.liuyong.weibo.util;

import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.regex.Pattern;

/**
 * 提取码生成随机算法
 * 
 * @author Songdan
 * @date 2017/5/16 10:02
 */
@Component
public class RandomExtractCodeGenerator implements ExtractCodeGenerator {


    private static final Pattern PATTERN = Pattern.compile("^\\d{12}$");

    @Override
    public String generate(BigDecimal totalAmount) {
        StringBuilder stringBuilder = new StringBuilder();
        Random random = new Random();

        Calculate calculate = new Calculate(totalAmount).invoke();
        int restSize = calculate.getRestSize();
        String moneyStr = calculate.getMoneyStr();
        boolean isOdd = calculate.isOdd();


        for (int i = 0; i < restSize; i++) {
            stringBuilder.append(random.nextInt(10));
        }
        String[] strs = moneyStr.split("");
        for (int i = 0; i < strs.length; i++) {
            stringBuilder.append(random.nextInt(10)).append(handle(Integer.parseInt(strs[i]), isOdd));
        }
        return stringBuilder.toString();
    }

    @Override
    public boolean checkExtractCode(String extractCode, BigDecimal totalAmount) {

        if (!PATTERN.matcher(extractCode).matches()) {
            return false;
        }

        Calculate calculate = new Calculate(totalAmount).invoke();
        int restSize = calculate.getRestSize();
        String moneyStr = calculate.getMoneyStr();
        boolean isOdd = calculate.isOdd();

        String numberStr = extractCode.substring(restSize);
        String[] moneyStrs = moneyStr.split("");
        String[] strs = numberStr.split("");
        for (int i = 0; i < moneyStrs.length; i++) {
            if (Integer.parseInt(moneyStrs[i]) != convert(Integer.parseInt(strs[2 * i + 1]), isOdd)) {
                return false;
            }
        }
        return true;
    }

    private int convert(int num, boolean isOdd) {
        if (isOdd) {
            return 9 - num;
        } else {
            if (num == 0) {
                return 9;
            } else {
                return num - 1;
            }
        }
    }

    private int handle(int num, boolean isOdd) {
        if (isOdd) {
            // 奇数
            return 9 - num;
        } else {
            // 偶数
            return (num + 1) % 10;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        RandomExtractCodeGenerator extractCodeGenerator = new RandomExtractCodeGenerator();
//        String extractCode = extractCodeGenerator.generate(new BigDecimal(45.32));
//        System.out.println(extractCode);
//        Assert.isTrue(extractCodeGenerator.checkExtractCode(extractCode, new BigDecimal("0.01")));
//        String extractCode2 = extractCodeGenerator.generate(new BigDecimal("100"));
//        System.out.println(extractCode2);
//        Assert.isTrue(extractCodeGenerator.checkExtractCode(extractCode2, new BigDecimal("100")));
//        // 单线程下测试1000万次重复次数
//        Map<String, Integer> map = new HashMap<>();
//        for (int i = 0; i < 10000000; i++) {
//            String code = extractCodeGenerator.generate(new BigDecimal("100"));
//            Assert.isTrue(extractCodeGenerator.checkExtractCode(code, new BigDecimal("100")));
//            put(map, code);
//        }
//
//        put(map, "1111");
//        put(map, "1111");
//        print(map);
        Assert.isTrue(extractCodeGenerator.checkExtractCode("423075228714", new BigDecimal("25.00")));
        // 测试并发情况下的重复情况：同时运行10个任务，每个任务执行100000次

    }

    private static void print(Map<String, Integer> map) {
        Iterator<Map.Entry<String, Integer>> iterator = map.entrySet().iterator();
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            if (entry.getValue() > 1) {
                System.out.println(entry.getKey());
            }
        }
    }

    private static void put(Map<String, Integer> map, String code) {
        if (map.get(code) == null) {
            map.put(code, 1);
        } else {
            map.put(code, map.get(code) + 1);
        }
    }

    private class Calculate {

        private BigDecimal totalAmount;

        private String moneyStr;

        private boolean isOdd;

        private int restSize;

        public Calculate(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getMoneyStr() {
            return moneyStr;
        }

        public boolean isOdd() {
            return isOdd;
        }

        public int getRestSize() {
            return restSize;
        }

        public Calculate invoke() {
            if (totalAmount.toString().contains(".")) {
                totalAmount = totalAmount.setScale(2,BigDecimal.ROUND_HALF_UP);
            }
            moneyStr = totalAmount.toString().replaceAll("\\.", "");
            isOdd = (Long.parseLong(moneyStr) & 1) != 0;
            if (moneyStr.length() >= 6) {
                moneyStr = moneyStr.substring(moneyStr.length() - 6);
            }
            restSize = 12 - moneyStr.length() * 2;
            return this;
        }
    }
}
