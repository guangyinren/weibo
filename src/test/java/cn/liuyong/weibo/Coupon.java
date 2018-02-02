package cn.liuyong.weibo;

import java.math.BigDecimal;

public class Coupon implements Comparable<Coupon> {

    private int id;

    private int batchId;

    private String name;

    private BigDecimal amount;

    private String couponType;

    public Coupon() {
    }

    public Coupon(int id, String name, BigDecimal amount) {
        this.id = id;
        this.name = name;
        this.amount = amount;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBatchId() {
        return batchId;
    }

    public void setBatchId(int batchId) {
        this.batchId = batchId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCouponType() {
        return couponType;
    }

    public void setCouponType(String couponType) {
        this.couponType = couponType;
    }

    @Override
    public int compareTo(Coupon o) {
        return id - o.id;
    }

    @Override
    public String toString() {
        return "[" + "id=" + id + ", amount=" + amount + ']';
    }

}
