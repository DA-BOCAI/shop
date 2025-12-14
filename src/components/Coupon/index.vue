<script setup>
defineProps({
  coupon: {
    type: Object,
    default: () => { }
  },
  activeTab: {
    type: String,
    default: '1'
  }
})
</script>

<template>
  <div class="coupon-card" :class="{ disabled: activeTab !== '1' }">
    <div class="coupon-left">
      <div class="price" v-if="coupon.type === 1">
        <span>¥</span>{{ coupon.amount }}
      </div>
      <div class="price" v-else>
        {{ coupon.amount }}<span>折</span>
      </div>
      <div class="condition">{{ coupon.condition }}</div>
    </div>

    <div class="coupon-right">
      <div class="info">
        <h3 class="title">{{ coupon.title }}</h3>
        <p class="time">{{ coupon.startTime }} - {{ coupon.endTime }}</p>
        <p class="desc">{{ coupon.type === 1 ? '满减优惠' : '折扣优惠' }}</p>
      </div>
      
      <button class="btn-use" v-if="activeTab === '1'">立即使用</button>
      <button class="btn-use" v-else-if="activeTab === '2'">已使用</button>
      <button class="btn-use" v-else>已过期</button>
    </div>

    <div class="circle-top"></div>
    <div class="circle-bottom"></div>
  </div>
</template>

<style scoped lang="scss">

/* 卡片基础样式 */
.coupon-card {
  display: flex;
  height: 120px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  flex: 1;
  min-width: 350px;
  &:hover {
    box-shadow: 0 4px 16px rgba(39, 186, 155, 0.15);
    border-color: #27BA9B;
  }
}

/* 左侧样式 */
.coupon-left {
  width: 120px;
  background: linear-gradient(135deg, #27BA9B, #4cdbc0);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 2px dashed #fff;

  .price {
    font-size: 30px;
    font-weight: bold;
    span { font-size: 14px; margin: 0 2px; font-weight: normal;}
  }
  .condition { font-size: 12px; opacity: 0.9; }
}

/* 右侧样式 */
.coupon-right {
  flex: 1;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title { font-size: 16px; color: #333; margin-bottom: 5px; font-weight: 600;}
  .time { font-size: 12px; color: #999; margin-bottom: 5px; }
  .desc { 
    font-size: 12px; color: #999; 
    background: #f7f7f7; padding: 2px 6px; 
    border-radius: 4px; display: inline-block;
  }
}

/* 按钮样式 */
.btn-use {
  padding: 5px 15px;
  background: #fff;
  color: #27BA9B;
  border: 1px solid #27BA9B;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background: #27BA9B;
    color: #fff;
  }
}

/* 装饰圆点 */
.circle-top, .circle-bottom {
  position: absolute; width: 16px; height: 16px;
  background: #fff; border-radius: 50%; left: 112px; z-index: 10;
}
.circle-top { top: -8px; }
.circle-bottom { bottom: -8px; }

/* --- 已过期/已使用 变灰样式 --- */
.coupon-card.disabled {
  border-color: #e8e8e8;
  &:hover { box-shadow: none; border-color: #e8e8e8; }
  
  .coupon-left { background: #ccc; }
  .title { color: #999; }
  .btn-use {
    border-color: #ccc; color: #ccc; background: transparent; cursor: not-allowed;
    &:hover { background: transparent; color: #ccc; }
  }
}
</style>