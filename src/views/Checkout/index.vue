<script setup>
import { createOrderAPI, getCheckInfoAPI } from '@/apis/checkout'
import { onMounted, ref, computed } from 'vue' // 引入 computed
import router from "@/router"
import { getAvailableCouponsAPI } from '@/apis/coupon'
import CouponCard from '@/components/Coupon/index.vue' 
import { ElMessage } from 'element-plus'

const checkInfo = ref({})  // 订单对象
const curAddress = ref({})  // 地址对象
const availableCoupons = ref([]) // 可用优惠卷列表
const curCoupon = ref({}) // 当前选中的优惠券 (新增)

const getCheckInfo = async () => {
  const res = await getCheckInfoAPI()
  checkInfo.value = res.result
  const item = checkInfo.value.userAddresses.find(item => item.isDefault === 0)
  curAddress.value = item
}

// 获取可用优惠卷
const getAvailableCoupons = async () => {
  // 传入当前的商品总价给后端做筛选（模拟）
  const res = await getAvailableCouponsAPI(checkInfo.value.summary?.totalPrice)
  availableCoupons.value = res.result
}

onMounted(() => {
  getCheckInfo()
  getAvailableCoupons()
})

const showDialog = ref(false)
const activeAddress = ref({})
const switchAddress = (item) => {
  activeAddress.value = item
}
const confirm = () => {
  curAddress.value = activeAddress.value
  showDialog.value = false
}

// --- 核心逻辑：切换优惠券 ---
const toggleCoupon = (item) => {
  if (curCoupon.value.id === item.id) {
    // 如果点击的是当前已选中的，则取消选中
    curCoupon.value = {}
  } else {
    // 否则选中当前点击的
    curCoupon.value = item
  }
}

// --- 核心逻辑：计算最终价格 ---
const totalPayPrice = computed(() => {
  if (!checkInfo.value.summary) return 0
  // 基础应付 = 商品总价 + 运费
  let price = checkInfo.value.summary.totalPrice + checkInfo.value.summary.postFee
  
  // 减去优惠金额
  if (curCoupon.value.id) {
    if (curCoupon.value.type === 1) {
      // 满减：直接减去金额
      price -= curCoupon.value.amount
    } else if (curCoupon.value.type === 2) {
      // 折扣：打折 (注意 amount 为 8.5 这种形式，需要除以 10)
      price = price * (curCoupon.value.amount / 10)
    }
  }
  
  // 确保价格不小于 0
  return price > 0 ? price.toFixed(2) : 0
})

// 创建订单
const createOrder = async () => {
  // 构造请求参数
  const requestData = {
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: '',
    goods: checkInfo.value.goods.map(item => {
      return {
        skuId: item.skuId,
        count: item.count
      }
    }),
    addressId: curAddress.value.id,
    // --- 新增：携带优惠券ID ---
    couponId: curCoupon.value.id || null 
  }

  const res = await createOrderAPI(requestData)
  const orderId = res.result.id
  router.push({
    path: '/pay',
    query: {
      id: orderId
    }
  })
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showDialog = true">切换地址</el-button>
              <el-button size="large" @click="">添加地址</el-button>
            </div>
          </div>
        </div>
        
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.count }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="box-title">可选优惠卷</h3>
        <div class="box-body">
          <div class="coupon-container">
            <div 
              class="coupon-item-wrapper"
              :class="{ active: curCoupon.id === coupon.id }"
              v-for="coupon in availableCoupons" 
              :key="coupon.id"
              @click="toggleCoupon(coupon)"
            >
              <CouponCard 
                :coupon="coupon"
                activeTab="1"
              />
              <i class="iconfont icon-checked" v-if="curCoupon.id === coupon.id"></i>
            </div>
          </div>
        </div>

        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>

        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>

        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl v-if="curCoupon.id">
              <dt>优惠减免：</dt>
              <dd class="price red">
                -¥{{ curCoupon.type === 1 
                  ? curCoupon.amount 
                  : (checkInfo.summary.totalPrice * (1 - curCoupon.amount/10)).toFixed(2) 
                }}
              </dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥{{ totalPayPrice }}</dd>
            </dl>
          </div>
        </div>

        <div class="submit">
          <el-button type="primary" size="large" @click="createOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  
  <el-dialog title="切换收货地址" width="30%" center v-model="showDialog">
    <div class="addressWrapper">
      <div class="text item" v-for="item in checkInfo.userAddresses" :key="item.id"
      :class="{active:activeAddress.id === item.id}"
      @click="switchAddress(item)">
        <ul>
        <li><span>收<i />货<i />人：</span>{{ item.receiver }} </li>
        <li><span>联系方式：</span>{{ item.contact }}</li>
        <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.coupon-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.coupon-item-wrapper {
  position: relative;
  cursor: pointer;
  border: 2px solid transparent; // 默认透明边框
  border-radius: 8px;
  transition: all 0.3s;

  // 选中时的样式
  &.active {
    border-color: $xtxColor; // 使用主题色
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    
    // 右上角对号图标样式
    .icon-checked {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 24px;
      color: $xtxColor;
      background: #fff;
      border-radius: 50%;
      z-index: 10;
    }
  }
}

// 辅助样式：红色价格
.red {
  color: $priceColor;
}

// .addressWrapper {
//   max-height: 500px;
//   overflow-y: auto;
// }

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: lighten($xtxColor, 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>