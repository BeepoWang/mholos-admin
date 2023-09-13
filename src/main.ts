import '@/plugins/unocss';
import './styles/index.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import { setupElementPlus } from './plugins/elementPlus';

const app = createApp(App);

setupRouter(app);
setupStore(app);
setupElementPlus(app);

app.mount('#app');
