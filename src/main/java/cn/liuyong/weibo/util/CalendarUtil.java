package cn.liuyong.weibo.util;

import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.joda.time.DateTime;

/**
 * 日期转换工具类
 * 
 * @author jwh
 */
public class CalendarUtil {

    private static final String DATE_WITH_SPLIT = "yyyy-MM-dd";

    private static final String DATE_WITHNOT_SPLIT = "yyyyMMdd";

    private static final String DATETIME_WITH_SPLIT = "yyyy-MM-dd HH:mm:ss";

    private static final String DATETIME_WITHNOT_SPLIT = "yyyyMMddHHmmss";

    private static final Calendar calendar = Calendar.getInstance();

    /**
     * 将日期转换成字符串
     * 
     * @param dateTime 日期
     * @param withSplit true返回yyyy-MM-dd HH:mm:ss||false返回yyyyMMddHHmmss
     * @return 日期字符串
     */
    public static String convertDateTimeToString(Date dateTime, boolean withSplit) {
        SimpleDateFormat dateFormat = null;
        if (withSplit) {
            dateFormat = new SimpleDateFormat(DATETIME_WITH_SPLIT);
        } else {
            dateFormat = new SimpleDateFormat(DATETIME_WITHNOT_SPLIT);
        }
        return dateFormat.format(dateTime);
    }

    /**
     * 将日期转换成字符串
     * 
     * @param date 日期
     * @param withSplit true返回yyyy-MM-dd||false返回yyyyMMdd
     * @return 日期字符串
     */
    public static String convertDateToString(Date date, boolean withSplit) {
        SimpleDateFormat dateFormat = null;
        if (withSplit) {
            dateFormat = new SimpleDateFormat(DATE_WITH_SPLIT);
        } else {
            dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
        }
        return dateFormat.format(date);
    }

    /**
     * 把格式为(yyyy-MM-dd或yyyyMMdd)的字符串转换为Date型(不带时分秒)
     * 
     * @param date 字符串日期
     * @return Date型日期(失败返回null)
     */
    public static Date convertStringToDate(String date) {
        int length = date.length();
        SimpleDateFormat dateFormat = null;
        if (8 == length || 10 == length) {
            if (10 == length) {
                dateFormat = new SimpleDateFormat(DATE_WITH_SPLIT);
            } else {
                dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
            }
            ParsePosition position = new ParsePosition(0);
            return dateFormat.parse(date, position);
        } else {
            if (19 == length || 14 == length) {
                return convertStringToDateTime(date);
            } else {
                return null;
            }
        }
    }

    /**
     * 把格式为(yyyy-MM-dd hh:mm:ss或yyyyMMddHHmmss)的字符串转换为DateTime型(带时分秒)
     * 
     * @param date 字符串日期
     * @return DateTime型日期(失败返回null)
     */
    public static Date convertStringToDateTime(String date) {
        int length = date.length();
        SimpleDateFormat dateFormat = null;
        if (19 == length || 14 == length) {
            if (19 == length) {
                dateFormat = new SimpleDateFormat(DATETIME_WITH_SPLIT);
            } else {
                dateFormat = new SimpleDateFormat(DATETIME_WITHNOT_SPLIT);
            }
            ParsePosition position = new ParsePosition(0);
            return dateFormat.parse(date, position);
        } else {
            if (8 == length || 10 == length) {
                return convertStringToDate(date);
            } else {
                return null;
            }
        }
    }

    /**
     * 取得时间（ yyyy-MM-dd 00:00:00）
     * 
     * @return Date
     */
    public static Date getDate(Date date) {
        if (null == date) {
            return convertStringToDate(convertDateToString(new Date(), true));
        }
        return convertStringToDate(convertDateToString(date, true));
    }

    /**
     * 取得当前时间（ yyyy-MM-dd HH:mm:ss）
     * 
     * @return
     */
    public static Date getDateTime() {
        return new Date();
    }

    /**
     * 获取当前年度
     * 
     * @return 年度
     */
    public static int getCurrYear() {
        return calendar.get(Calendar.YEAR);
    }

    /**
     * 获取当前月份
     * 
     * @return 月份
     */
    public static int getCurrMonth() {
        return calendar.get(Calendar.MONTH) + 1;
    }

    /**
     * 日期比较大小
     * 
     * @param date1 日期
     * @param date2 日期
     * @param canEq 是否可以相等
     * @return date1-date2:true(大于)||false(小于)
     * @throws java.text.ParseException
     */
    public static boolean dateCompare(Date date1, Date date2, boolean canEq) {
        boolean result = false;
        long time = 1000 * 3600 * 24;
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
        Date firstDate = convertStringToDate(dateFormat.format(date1));
        Date lastDate = convertStringToDate(dateFormat.format(date2));
        long dateRange = (firstDate.getTime() - lastDate.getTime()) / time;
        if (canEq) {
            if (dateRange >= 0) {
                result = true;
            }
        } else {
            if (dateRange > 0) {
                result = true;
            }
        }
        return result;
    }

    /**
     * 取得时间差(精确到秒)
     * 
     * @param startDateTime 起始时间
     * @param endDateTime 结束时间
     * @return 时间差
     */
    public static long getdifftime(Date startDateTime, Date endDateTime) {
        long startTime = getUnixtime(startDateTime);
        long endTime = getUnixtime(endDateTime);
        return endTime - startTime;
    }

    /**
     * 判断是否为同一天
     * 
     * @param date1 日期
     * @param date2 日期
     * @return true||false
     */
    public static boolean sameDayCheck(Date date1, Date date2) {
        boolean result = false;
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
        String dateFirst = dateFormat.format(date1);
        String dateLast = dateFormat.format(date2);
        if (dateFirst.equals(dateLast)) {
            result = true;
        }
        return result;
    }

    /**
     * 判断是否为同一月
     * 
     * @param date1 日期
     * @param date2 日期
     * @return true||false
     */
    public static boolean sameMonthCheck(Date date1, Date date2) {
        Calendar calendar1 = Calendar.getInstance();
        calendar1.setTime(date1);
        Calendar calendar2 = Calendar.getInstance();
        calendar2.setTime(date2);
        return calendar1.get(Calendar.YEAR) == calendar2.get(Calendar.YEAR)
                && calendar1.get(Calendar.MONTH) == calendar2.get(Calendar.MONTH);
    }

    /**
     * 日期加N天
     * 
     * @param date
     * @param day
     * @return
     */
    @SuppressWarnings("static-access")
    public static Date dateAdd(Date date, int day) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.DATE, day);// 把日期往后增加一天.整数往后推,负数往前移动
        date = calendar.getTime(); // 这个时间就是日期往后推一天的结果
        return date;
    }

    /**
     * 取unix时间戳
     * 
     * @param date 日期
     * @return Long
     */
    public static Long getUnixtime(Date date) {
        Date dateTime = convertStringToDateTime(convertDateTimeToString(date, true));
        Long unixTime = dateTime.getTime() / 1000;
        return unixTime;
    }

    /**
     * 取系统当前时间的毫秒数
     * 
     * @return Long 毫秒数
     */
    public static long getCurrentTimeMillis() {
        return System.currentTimeMillis();
    }

    /**
     * 取某年某月的第一天
     * 
     * @param year 年度
     * @param month 月份
     * @return 某年某月的第一天
     */
    public static Date getMonthFirstDay(int year, int month) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, month - 1);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return getDate(cal.getTime());
    }

    /**
     * 取某年某月的最后一天
     * 
     * @param year 年度
     * @param month 月份
     * @return 某年某月的最后一天
     */
    public static Date getMonthLastDay(int year, int month) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, month - 1);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        return getDate(cal.getTime());
    }

    /**
     * 取当前季度起始月份
     * 
     * @param currMonth 当前月份
     * @return int 起始月份
     */
    public static int getQuarterFirstMonth(int currMonth) {
        int season = getSeason(currMonth);
        switch (season) {
            case 1:
                return 1;
            case 2:
                return 4;
            case 3:
                return 7;
            case 4:
                return 10;
            default:
                return 1;
        }
    }

    /**
     * 取当前季度最后月份
     * 
     * @param currMonth 当前月份
     * @return int 最后月份
     */
    public static int getQuarterLastMonth(int currMonth) {
        int season = getSeason(currMonth);
        switch (season) {
            case 1:
                return 3;
            case 2:
                return 6;
            case 3:
                return 9;
            case 4:
                return 12;
            default:
                return 1;
        }
    }

    /**
     * 获取季度信息
     * 
     * @param month 月份
     * @return 1 第一季度 2 第二季度 3 第三季度 4 第四季度
     */
    public static int getSeason(int month) {
        int season = 0;
        switch (month - 1) {
            case Calendar.JANUARY:
            case Calendar.FEBRUARY:
            case Calendar.MARCH:
                season = 1;
                break;
            case Calendar.APRIL:
            case Calendar.MAY:
            case Calendar.JUNE:
                season = 2;
                break;
            case Calendar.JULY:
            case Calendar.AUGUST:
            case Calendar.SEPTEMBER:
                season = 3;
                break;
            case Calendar.OCTOBER:
            case Calendar.NOVEMBER:
            case Calendar.DECEMBER:
                season = 4;
                break;
            default:
                break;
        }
        return season;
    }

    /**
     * 取得当前时间（ yyyy-MM-dd HH:mm:ss）
     * 
     * @return
     */
    public static Date getCurrDateTime() {
        return new Date();
    }

    /**
     * 获取当天的日期 (yyyy-MM-dd)
     * 
     * @return
     */
    public static Date getToday() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATE_WITH_SPLIT);
        return DateTime.parse(simpleDateFormat.format(DateTime.now().toDate())).toDate();
    }
}
