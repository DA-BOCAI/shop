<script setup>
import { getCoupons } from '@/apis/coupon';
import { onMounted , ref} from 'vue';
const couponList = ref([])
couponList.value = getCoupons()
console.log(couponList.value[0]);

</script>

<template>
<head>
    <meta charset="UTF-8">
    <title>优惠券组件</title>
</head>
<body>

<!-- 优惠券列表容器 -->
<div class="coupon-container">
    
    <!-- 优惠券 1：可用状态 (通用券) -->
    <div class="coupon-card">
        <div class="coupon-left">
            <div class="price"><span>¥</span>{{couponList[0].amount}}</div>
            <div class="condition">{{couponList[0].title}}</div>
        </div>
        <div class="coupon-right">
            <div class="info">
                <h3 class="title">全场通用现金券</h3>
                <p class="time">{{couponList[0].endTime}}</p>
                <p class="desc">仅限注册会员使用</p>
            </div>
            <button class="btn-use" >立即使用</button>
        </div>
        <!-- 装饰用的半圆缺口 -->
        <div class="circle-top"></div>
        <div class="circle-bottom"></div>
    </div>

    <!-- 优惠券 2：可用状态 (折扣券) -->
    <div class="coupon-card">
        <div class="coupon-left">
            <div class="price">8.5<span>折</span></div>
            <div class="condition">最高抵扣200元</div>
        </div>
        <div class="coupon-right">
            <div class="info">
                <h3 class="title">数码产品专享券</h3>
                <p class="time">2023.10.05 - 2023.10.20</p>
                <p class="desc">部分特价商品除外</p>
            </div>
            <button class="btn-use">立即使用</button>
        </div>
        <div class="circle-top"></div>
        <div class="circle-bottom"></div>
    </div>

    <!-- 优惠券 3：已过期/已使用状态 -->
    <div class="coupon-card disabled">
        <div class="coupon-left">
            <div class="price"><span>¥</span>50</div>
            <div class="condition">满300元可用</div>
        </div>
        <div class="coupon-right">
            <div class="info">
                <h3 class="title">新用户体验券</h3>
                <p class="time">2023.01.01 - 2023.02.01</p>
                <p class="desc">已过期</p>
            </div>
            <button class="btn-use">已失效</button>
        </div>
        <div class="circle-top"></div>
        <div class="circle-bottom"></div>
    </div>

</div>

</body>
</template>
<style>
  /* 定义变量，提取自图片风格 */
:root {
    --primary-color: #27BA9B; /* 旺旺商城的青绿色 */
    --primary-hover: #20a085;
    --text-main: #333333;
    --text-sub: #999999;
    --bg-gray: #f5f5f5;
    --border-color: #e8e8e8;
}

/* 容器布局：两列或三列网格 */
.coupon-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
    padding: 20px;
    background-color: #fff; /* 对应右侧白色背景 */
}

/* 优惠券卡片主体 */
.coupon-card {
    display: flex;
    height: 120px;
    background: #fff;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.coupon-card:hover {
    box-shadow: 0 4px 16px rgba(39, 186, 155, 0.15);
    border-color: var(--primary-color);
}

/* 左侧：金额区域 */
.coupon-left {
    width: 120px;
    background: linear-gradient(135deg, var(--primary-color), #4cdbc0);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    /* 虚线分割线效果 */
    border-right: 2px dashed #fff; 
}

.coupon-left .price {
    font-size: 32px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 8px;
}

.coupon-left .price span {
    font-size: 16px;
    font-weight: normal;
    margin-right: 2px;
}

.coupon-left .condition {
    font-size: 12px;
    opacity: 0.9;
}

/* 右侧：信息区域 */
.coupon-right {
    flex: 1;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.coupon-right .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.coupon-right .title {
    font-size: 16px;
    color: var(--text-main);
    margin: 0 0 8px 0;
    font-weight: 600;
}

.coupon-right .time {
    font-size: 12px;
    color: var(--text-sub);
    margin-bottom: 4px;
}

.coupon-right .desc {
    font-size: 12px;
    color: var(--text-sub);
    background: #f7f7f7;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    width: fit-content;
}

/* 按钮样式 */
.btn-use {
    padding: 6px 16px;
    background-color: #fff;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
    margin-left: 10px;
}

.btn-use:hover {
    background-color: var(--primary-color);
    color: #fff;
}

/* 装饰用的上下半圆缺口 (模拟票据撕口) */
.circle-top, .circle-bottom {
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #fff; /* 这里必须是父容器的背景色，如果父容器是灰色则填灰色 */
    border-radius: 50%;
    left: 112px; /* 根据左侧宽度调整 (120px - 半径8px) */
    z-index: 10;
}

.circle-top {
    top: -8px;
}

.circle-bottom {
    bottom: -8px;
}

/* --- 失效/过期状态样式 --- */
.coupon-card.disabled {
    border-color: #e8e8e8;
    box-shadow: none;
    cursor: not-allowed;
}

.coupon-card.disabled .coupon-left {
    background: #ccc;
}

.coupon-card.disabled .title {
    color: #999;
}

.coupon-card.disabled .btn-use {
    border-color: #ccc;
    color: #ccc;
    background: transparent;
    cursor: not-allowed;
}

.coupon-card.disabled .btn-use:hover {
    background: transparent;
    color: #ccc;
}
</style>