// 模拟优惠券数据
const coupons = ref([
  {
    id: 1,
    type: 'money',
    amount: 20,
    threshold: 100,
    title: '满减优惠',
    endTime: '2025-12-20',
    status: 'unused'
  },
  {
    id: 2,
    type: 'discount',
    discount: 9,
    threshold: 200,
    title: '折扣券',
    endTime: '2025-12-15',
    status: 'used'
  },
  {
    id: 3,
    type: 'money',
    amount: 10,
    threshold: 50,
    title: '限时优惠',
    endTime: '2025-10-05',
    status: 'expired'
  }
]);
export function getCoupons() {
  return coupons.value;
}