<script setup lang="ts">
import { ref, onMounted } from "vue";
import { applyPolyfills as chartConfigApplyPolyfills, defineCustomElements as chartConfigDefineCustomElements } from 'chart-config/loader';
import { applyPolyfills as chartAttrApplyPolyfills, defineCustomElements as chartAttrDefineCustomElements } from 'chart-attribute/loader';
import { applyPolyfills as dsApplyPolyfills, defineCustomElements as dsDefineCustomElements } from 'data-source-edit/loader';
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { useChartConfigStore} from '@/stores/chartConfigStore';
import { useRoute } from "vue-router";
chartConfigApplyPolyfills().then(() => {
  chartConfigDefineCustomElements();
});
chartAttrApplyPolyfills().then(() => {
  chartAttrDefineCustomElements();
});
dsApplyPolyfills().then(() => {
  dsDefineCustomElements();
});
const route = useRoute();
const chartattribute = ref<any>(null);
const chartConfigStore = useChartConfigStore();
const id:any = route.query.id;
const cf =  chartConfigStore.getChartConfig(id);
const config = ref<string>(JSON.stringify(cf));
const onConfigChange = (e:any) => {
  config.value = JSON.stringify(e.detail);
  chartConfigStore.setChartConfig(id,e.detail);
}

onMounted(()=> {
  chartattribute.value?.addEventListener('configChange',onConfigChange)
})
</script>

<template>
  <splitpanes class="default-theme ws-them"  style="height: calc(100% - 25px)">
    <pane size="70">
      <splitpanes class="default-theme ws-them" horizontal style="height: 100%">
      <pane size="60">
        <chart-config :config="config"/>
      </pane>
      <pane size="40">
        <data-source-edit />
      </pane>
    </splitpanes>
    </pane>
    <pane size="30">
      <chart-attribute ref="chartattribute" :config="config" @configChange="onConfigChange" />
    </pane>
  </splitpanes>
</template>
<style scoped>
chart-config{
  width: 100%;
  height: 100%;
}
</style>
