import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGridLayoutWcStore = defineStore('gridLayoutWcStore', () => {

  const list = JSON.parse(localStorage.getItem('grid-layout-store-data-list') ||'[]');
  const isEdit = ref<boolean>(false);
  const gridLayoutElement = ref<any>(null);
  const layoutDataList = ref<any>(list)
  const setGridlayoutElement = (ele:any) => {
    gridLayoutElement.value = ele;
  }
  const addPanel = () => {
    return  gridLayoutElement.value?.addGridItem();
  }
  const saveLayoutDataList = () => {
    layoutDataList.value = gridLayoutElement.value.layoutData
    localStorage.setItem('grid-layout-store-data-list', JSON.stringify(layoutDataList.value));
  }
  const resetLayoutDataList = () => {
    const list = JSON.parse(localStorage.getItem('grid-layout-store-data-list') ||'[]');
    layoutDataList.value  = list;
  }
  return { layoutDataList, isEdit,addPanel,setGridlayoutElement, saveLayoutDataList,resetLayoutDataList}
})
