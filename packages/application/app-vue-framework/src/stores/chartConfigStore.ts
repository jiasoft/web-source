import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useChartConfigStore = defineStore('chartConfigStore', () => {
    const ch = localStorage.getItem('chartConfigStore');
    const config = JSON.parse(ch || '{}')
    const ChartConfigTable = ref<{[id:string]:any}>(config);
    const getChartConfigList = () => {
        return ChartConfigTable.value;
    }
    const getChartConfig = (id:string) => {
        if(!ChartConfigTable.value[id]){
            ChartConfigTable.value[id] = {
                id,
                PanelOptions:{
                    title:"title",
                    description:"description",
                    transparentBackground:true
                },
                ChartOptions:{}
            }
        }
        
        return ChartConfigTable.value[id];
    }
    const setChartConfig =  (id:string,config:any) => {
        ChartConfigTable.value[id] = config;
        localStorage.setItem('chartConfigStore',JSON.stringify(ChartConfigTable.value));
    }
    const removeChartConfig = (id:string) => {
        delete ChartConfigTable.value[id];
        localStorage.setItem('chartConfigStore',JSON.stringify(ChartConfigTable.value));
    }
    const saveChartConfig = () => {
        localStorage.setItem('chartConfigStore',JSON.stringify(ChartConfigTable.value));
    }
    const resetChartConfig = () => {
        const ch = localStorage.getItem('chartConfigStore');
        const config = JSON.parse(ch || '{}')
        ChartConfigTable.value  = config;
    }
    return { getChartConfigList, getChartConfig, setChartConfig, removeChartConfig,saveChartConfig,resetChartConfig}
})
