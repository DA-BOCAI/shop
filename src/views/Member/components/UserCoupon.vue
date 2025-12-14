<script setup>
import { onMounted, ref, watch } from 'vue'
import { getMyCouponsAPI } from '@/apis/coupon'
import CouponCard from '@/components/Coupon/index.vue'

// 1. 定义状态栏数据 (对应后端接口的 status 参数)
const activeTab = ref('1') // 默认选中 '1'-未使用
const tabTypes = [
  { name: '1', label: '未使用' },
  { name: '2', label: '已使用' },
  { name: '3', label: '已过期' }
]

// 2. 优惠券列表数据
const couponList = ref([])
const loading = ref(false)

// 3. 获取数据的方法
const getCoupons = async () => {
  loading.value = true
  try {
    const res = await getMyCouponsAPI({ status: activeTab.value })
    couponList.value = res.result
  } finally {
    loading.value = false
  }
}

// 4. 监听 activeTab 变化（实现点击切换高亮后，列表自动刷新）
watch(activeTab, () => {
  getCoupons()
})

// 初始化获取数据
onMounted(() => getCoupons())
</script>

<template>
  <div class="coupon-content">
    <el-tabs v-model="activeTab" class="custom-tabs">
      <el-tab-pane 
        v-for="item in tabTypes" 
        :key="item.name" 
        :label="item.label" 
        :name="item.name"
      />
    </el-tabs>

    <div class="coupon-container" v-if="!loading && couponList && couponList.length > 0">
      <CouponCard 
        v-for="coupon in couponList" 
        :key="coupon.id" 
        :coupon="coupon"
        :activeTab="activeTab"
      />
    </div>

    <div class="empty-box" v-else-if="!loading">
      <el-empty description="暂无优惠券" />
    </div>

    <div class="loading-box" v-else>
      <el-skeleton :rows="2" animated />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 定义主题变量 */
:root {
  --primary-color: #27BA9B;
  --text-main: #333;
  --text-sub: #999;
}

.coupon-content {
  background: #fff;
  padding: 20px;
  min-height: 500px;
}

/* --- 状态栏高亮样式定制 (核心部分) --- */
.custom-tabs {
  margin-bottom: 20px;
  
  /* 选中时的文字颜色 */
  :deep(.el-tabs__item.is-active) {
    color: #27BA9B;
    font-weight: bold;
  }
  
  /* 鼠标悬停时的颜色 */
  :deep(.el-tabs__item:hover) {
    color: #27BA9B;
  }
  
  /* 底部选中条的颜色 */
  :deep(.el-tabs__active-bar) {
    background-color: #27BA9B;
    height: 3px; /*稍微加粗一点更明显*/
  }
}

/* 列表网格布局 */
.coupon-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}


/* 加载状态样式 */
.loading-box {
  padding: 20px 0;
}

.empty-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
</style>