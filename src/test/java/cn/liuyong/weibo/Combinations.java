package cn.liuyong.weibo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Combinations {

    /**
     * 所有的组合
     * 
     * @param arr
     * @return
     */
    public static <R extends Comparable<R>> List<List<R>> allCombination(List<R> arr) {
        int length = arr.size();
        // 组合由多少个元素组成的
        List<List<R>> result = new ArrayList<>();
        int i = 1;
        while (i <= length) {
            // 生成i个元素的组合
            result.addAll(combinationSelect(arr, i));
            i++;
        }
        return result;
    }

    /**
     * 由n个元素组成的组合
     * 
     * @param arr 数组
     * @param i 组合的元素个数
     * @return 组合集合
     */
    private static <R extends Comparable<R>> List<List<R>> combinationSelect(List<R> arr, int i) {
        return new DFSCombination<>(arr, i).select();
    }

    public static <R extends Comparable<R>> HashMap<String, Integer> getCombinationMap(List<Coupon> couponList) {
        List<List<Coupon>> allCombination = allCombination(couponList);
        HashMap<String, Integer> map = new HashMap<>();
        for (List<Coupon> coupons : allCombination) {
            List<String> collect = coupons.stream().map(coupon -> String.valueOf(coupon.getId()))
                    .collect(Collectors.toList());
            int total = coupons.stream().mapToInt(coupon -> coupon.getAmount().intValue()).sum();
            map.put(String.join("-", collect), total);
        }
        return map;
    }

    // 筛选最接近支付金额的结果
    public static int binarysearchKey(Object[] array, BigDecimal targetNum) {
        Arrays.sort(array);
        int left = 0, right = 0;
        for (right = array.length - 1; left != right;) {
            int midIndex = (right + left) / 2;
            int mid = (right - left);
            int midValue = (Integer) array[midIndex];
            if (targetNum.compareTo(new BigDecimal(midValue)) == 0) {
                return midValue;
            }

            if (targetNum.compareTo(new BigDecimal(midValue)) == 1) {
                left = midIndex;
            } else {
                right = midIndex;
            }
            if (mid <= 1) {
                break;
            }
        }
        int rightnum = ((Integer) array[right]).intValue();
        int leftnum = ((Integer) array[left]).intValue();
        // 如果一个大于支付金额，一个小于支付金额，优先返回大于支付金额的结果
        if (new BigDecimal(rightnum).compareTo(targetNum) == 1 && new BigDecimal(leftnum).compareTo(targetNum) == -1) {
            return rightnum;
        }
        BigDecimal rightiffVal = new BigDecimal(rightnum).subtract(targetNum);
        BigDecimal leftDiffVal = new BigDecimal(leftnum).subtract(targetNum);
        int ret = Math.abs(leftDiffVal.intValue()) > Math.abs(rightiffVal.intValue()) ? rightnum : leftnum;
        // System.out.println("要查找的数：" + targetNum + "最接近的数：" + ret);
        return ret;
    }

    /**
     * DFS实现组合
     */
    private static class DFSCombination<R extends Comparable<R>> {

        // 标记元素是否已被组合
        private Set<R> bookSet = new HashSet<>();

        private List<R> arr;

        private int n;

        private Map<Integer, R> bucks;

        private List<List<R>> result = new ArrayList<>();

        public DFSCombination(List<R> arr, int n) {
            this.arr = arr;
            this.n = n;
            bucks = new LinkedHashMap<>();
        }

        private void dfs(int index) {
            if (index == n) {
                // 说明组合数满了
                result.add(composite());
                return;
            }

            for (int i = 0; i < arr.size(); i++) {
                R element = arr.get(i);
                if (!bookSet.contains(element)) {
                    if (index > 0) {
                        // 保证一个组合的顺序,从小到大的顺序
                        R lastElement = bucks.get(index - 1);
                        if (lastElement.compareTo(element) > 0) {
                            continue;
                        }
                    }
                    // 第几个位置放置什么元素
                    bucks.put(index, element);
                    bookSet.add(element);
                    dfs(index + 1);
                    bookSet.remove(element);
                }
            }

        }

        public List<List<R>> select() {
            dfs(0);
            return result;
        }

        private List<R> composite() {
            return bucks.entrySet().stream().map(Map.Entry::getValue).collect(Collectors.toList());
        }

    }

}
