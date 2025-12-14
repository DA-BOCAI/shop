import http from "@/utils/http";
const allCoupons = [
        {
          id: 1,
          type: 1, // 1: 满减, 2: 折扣
          amount: 20,
          title: '全场通用现金券',
          condition: '无门槛',
          startTime: '2023-10-01',
          endTime: '2025-12-20',
          status: 1 // 1:未使用
        },
        {
          id: 2,
          type: 2,
          amount: 8.5, // 8.5折
          title: '数码产品专享券',
          condition: '最高抵扣200元',
          startTime: '2023-10-01',
          endTime: '2023-10-20',
          status: 2 // 2:已使用
        },
        {
          id: 3,
          type: 1,
          amount: 10,
          title: '新用户体验券',
          condition: '满50元可用',
          startTime: '2023-01-01',
          endTime: '2023-02-01',
          status: 3 // 3:已过期
        },
        {
          id: 4,
          type: 1,
          amount: 50,
          title: '年终大促券',
          condition: '满300元可用',
          startTime: '2023-12-01',
          endTime: '2025-12-31',
          status: 1 // 1:未使用
        }
      ];
/**
 * @description 获取我的优惠券列表
 * @param {Object} params - { status: 1 | 2 | 3 }  1:未使用, 2:已使用, 3:已过期
 */
export function getMyCouponsAPI(params) {
  // 如果你有真实后端接口，请使用下面这行：
  // return http.get('/member/coupon', { params });

  // --- 以下为模拟后端逻辑 (Mock)，用于演示 ---
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据传入的 status 过滤数据
      const filtered = allCoupons.filter(item => item.status === parseInt(params.status));
      
      resolve({
        code: '1',
        msg: '操作成功',
        result: filtered
      });
    }, 200); // 模拟网络延迟
  });
}
export function getAvailableCouponsAPI(orderPrice) {
  return new Promise((resolve) => {
    setTimeout(()=>{
      const availableCoupons = allCoupons.filter(item => item.status === 1);
      resolve({
        code: '1',
        msg: '操作成功',
        result: availableCoupons
      });
    },200);
  });
}