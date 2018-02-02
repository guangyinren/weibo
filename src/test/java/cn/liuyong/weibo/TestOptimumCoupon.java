package cn.liuyong.weibo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

public class TestOptimumCoupon {

    public static void main(String[] args) {
        // 用户优惠券列表
        List<Coupon> couponList = null;
        // 支付金额
        BigDecimal money = null;
        List<Coupon> optimumList = getOptimumList(couponList, money);
    }

    private static List<Coupon> getOptimumList(List<Coupon> couponList, BigDecimal amount) {
        // 现金券集合
        Map<Integer, List<Coupon>> cashMap = new HashMap<>();
        // 代金券集合
        List<Coupon> voucherList = new ArrayList<>();
        // 折扣券集合
        List<Coupon> discountList = new ArrayList<>();
        for (Coupon coupon : couponList) {
            if ("CASH".equals(coupon.getCouponType())) {
                // 如果是现金券，对不同批次进行筛选
                if (cashMap.get(coupon.getBatchId()) == null) {
                    List<Coupon> cacheList = new ArrayList<>();
                    cacheList.add(coupon);
                    cashMap.put(coupon.getBatchId(), cacheList);
                } else {
                    List<Coupon> cacheList = cashMap.get(coupon.getBatchId());
                    cacheList.add(coupon);
                }
            }
            if ("VOUCHER".equals(coupon.getCouponType())) {
                voucherList.add(coupon);
            }
            if ("DISCOUNT".equals(coupon.getCouponType())) {
                discountList.add(coupon);
            }
        }
        // endResultMap 同批次现金券最优解，折扣券最优解，代金券最优解
        // endResultMap key 优惠券id字符串 value 最优解优惠金额
        HashMap<String, Integer> endResultMap = new HashMap<>();
        // 判断现金券map长度 现金券处理开始
        if (!cashMap.isEmpty()) {
            // 筛选现金券不同批次最优解
            for (Map.Entry<Integer, List<Coupon>> m : cashMap.entrySet()) {
                // 获取当前批次所有组合
                HashMap<String, Integer> map = Combinations.getCombinationMap(m.getValue());
                // 获取当前批次最优解
                int result = getOptimumVal4Map(map, amount);
                // 根据value找最优解优惠券id,放入最优解map
                getOptimumMap4SameBatch(map, result, endResultMap);
                // 不同批次现金券最优解合集
            }
            // 现金券处理结束
        }
        // 代金券处理开始 判断长度
        if (voucherList.size() > 0) {
            voucherList.sort((Coupon c1, Coupon c2) -> c1.getAmount().compareTo(c2.getAmount()));
            // 获取代金券最大值，放入最终结果map
            endResultMap.put(voucherList.get(voucherList.size() - 1).getId() + "",
                    voucherList.get(voucherList.size() - 1).getAmount().intValue());
            // 代金券处理结束
        }
        // 折扣券处理开始 判断长度
        if (discountList.size() > 0) {
            discountList.sort((Coupon c1, Coupon c2) -> c1.getAmount().compareTo(c2.getAmount()));
            // 获取折扣最小值 并计算最大折扣金额
            BigDecimal discountTmp = discountList.get(0).getAmount();
            BigDecimal realCountTmp = new BigDecimal(100).subtract(discountTmp);
            BigDecimal discountTmpVal = amount.multiply(realCountTmp).divide(new BigDecimal(100));
            endResultMap.put(discountList.get(0).getId() + "", discountTmpVal.intValue());
            // 折扣券处理结束
        }
        // 获取最终结果
        int endResult = getOptimumVal4Map(endResultMap, amount);
        // 获取优惠券id集合字符串
        String couponDetailStr = getOptimumStr(endResultMap, endResult);
        // 判断是否为空
        List<String> couponDetailIdList = new ArrayList<>();
        if (StringUtils.isNotEmpty(couponDetailStr)) {
            if (couponDetailStr.contains("-")) {
                String[] couponDetailArr = couponDetailStr.split("-");
                for (String str : couponDetailArr) {
                    couponDetailIdList.add(str);
                }
            } else {
                couponDetailIdList.add(couponDetailStr);
            }
        }
        List<Coupon> optimumList = new ArrayList<>();
        // 循环用户优惠券列表，进行比较
        for (Coupon coupon : couponList) {
            for (String str : couponDetailIdList) {
                if (coupon.getId() == Integer.parseInt(str)) {
                    optimumList.add(coupon);
                }
            }
        }
        return optimumList;
    }

    private static int getOptimumVal4Map(HashMap<String, Integer> map, BigDecimal amount) {
        ArrayList<Integer> array = new ArrayList<Integer>();
        for (Map.Entry<String, Integer> m2 : map.entrySet()) {
            array.add(m2.getValue());
        }
        int result = Combinations.binarysearchKey(array.toArray(), amount);
        return result;
    }

    private static void getOptimumMap4SameBatch(HashMap<String, Integer> map, int result,
            HashMap<String, Integer> endResultMap) {
        for (Map.Entry<String, Integer> m : map.entrySet()) {
            if (m.getValue().intValue() == result) {
                endResultMap.put(m.getKey(), m.getValue());
                return;
            }
        }
    }

    private static String getOptimumStr(HashMap<String, Integer> map, int result) {
        for (Map.Entry<String, Integer> m : map.entrySet()) {
            if (m.getValue().intValue() == result) {
                return m.getKey();
            }
        }
        return null;
    }
}
