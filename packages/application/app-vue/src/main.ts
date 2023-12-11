import './assets/main.css'
// import VuePlugin  from 'vue-plugin'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App);

app.use(createPinia());
app.use(router);
// app.use(VuePlugin);
app.mount('#app');
