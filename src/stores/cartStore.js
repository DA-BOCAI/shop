import {defineStore} from "pinia";
import { computed } from "vue";
import {useUserStore} from "@/stores/userStore";
import {findNewCartListAPI, insertCartAPI} from "@/apis/cart";
import {delCartAPI} from "@/apis/cart";

export const useCartStore = defineStore(
    'cart',
    ()=>{
        const cartList = ref([]);
        const userStore = useUserStore();
        const isLogin = computed(()=>userStore.userInfo.token);

        // 获取登录后最新购物车列表action
        const updateLoginCartList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
        const addCart = async(goods) => {
            if(isLogin.value){
            //登录之后加入购物车逻辑
            await insertCartAPI(goods)
            updateLoginCartList()
        }else {
            //判断商品是否在购物车
            const findItem = cartList.value.find(item=>goods.skuId === item.skuId);
            if(findItem){
                findItem.count += goods.count;
            }else {
                cartList.value.push(goods)
            }
        }
        }
        const delCart = async (skuId) =>{
            if(isLogin.value){
            //登录之后加入购物车逻辑
            console.log([skuId])
            await delCartAPI([skuId])
            updateLoginCartList()
        }else {
            const index = cartList.value.findIndex(item=>item.skuId === skuId)
            cartList.value.splice(index,1)
        }
        }
        const allCount = computed(()=>cartList.value.reduce((a,b)=>a+b.count,0))
        const allPrice = computed(()=>cartList.value.reduce((a,b)=>a+b.count*b.price,0))

        const isAll = computed(() => cartList.value.every((item) => item.selected))

        const selectedCount = computed(()=>cartList.value.filter(item=>item.selected)
        .reduce((a,b)=>a+b.count,0))

        const selectedPrice = computed(()=>cartList.value.filter(item=>item.selected)
        .reduce((a,b)=>a+b.count*b.price,0))

        // 清除购物车
        const clearCart = () => {
            cartList.value = []
        }

        return{
            cartList,
            isAll,
            allCount,
            allPrice,
            selectedCount,
            selectedPrice,
            addCart,
            delCart,
            updateLoginCartList,
            clearCart
        }
    },
    {
      persist:true
    }
)