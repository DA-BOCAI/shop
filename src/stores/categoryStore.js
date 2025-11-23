import { getCategoryAPI } from '@/apis/layout.js'

export const useCategoryStore = defineStore('category', () => {
const categoryList = ref([])
const getCategory = async ()=>{
  let res = await getCategoryAPI();
  categoryList.value = res.result;
}
onMounted(()=>{
  getCategory();
})

  return { categoryList }
})
