
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'grid-layout-wc/grid-layout-wc.js';
import {useGridLayoutWcStore} from '@/stores/gridLayoutWcStore';
import { useRouter } from "vue-router";
import { applyPolyfills as chartConfigApplyPolyfills, defineCustomElements as chartConfigDefineCustomElements } from 'chart-config/loader';
import { applyPolyfills as chartAttrApplyPolyfills, defineCustomElements as chartAttrDefineCustomElements } from 'chart-attribute/loader';
import { applyPolyfills as dsApplyPolyfills, defineCustomElements as dsDefineCustomElements } from 'data-source-edit/loader';

chartConfigApplyPolyfills().then(() => {
  chartConfigDefineCustomElements();
});
chartAttrApplyPolyfills().then(() => {
  chartAttrDefineCustomElements();
});
dsApplyPolyfills().then(() => {
  dsDefineCustomElements();
});

const router = useRouter();
const config = ref<string>(JSON.stringify({
  PanelOptions:{
    title:"title",
    description:"description",
    transparentBackground:true
  }
}))

const gridLayoutStore = useGridLayoutWcStore();

// const configDataList = ref<any>([]);
const gridLayoutEl = ref<any>(null);
const onClose = () => {

}
const onSave = () => {

}
const onOpenConfigSet = (e:any) => {
  console.log(e)
}
onMounted(() => {
  gridLayoutStore.setGridlayoutElement(gridLayoutEl.value);
  gridLayoutEl.value?.addEventListener('openConfigSet',(e:any)=> {
    console.log(e);
    router.push({ name: `panel-edit` });
    
  })
})

</script>

<template>
  <main>
    <grid-layout-wc
      ref="gridLayoutEl"
      :layoutData="gridLayoutStore.layoutDataList"
      :edit="gridLayoutStore.isEdit"
      :hideToolbar="true"
      @close="onClose"
      @save="onSave"
      @openConfigSet="onOpenConfigSet">
      <template v-for="item in gridLayoutStore.layoutDataList" :key="item.id">
        <!--eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <div class="vue-wc" :slot="item.slot">
          <chart-config :config="config"/>
        </div>
      </template>
    </grid-layout-wc>
  </main>
</template>
<style scoped>
main{
  height:calc(100% - 45px); 
}
.vue-wc{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.vue-wc button{
  padding: 10px;
}
</style>