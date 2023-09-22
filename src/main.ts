import '@/plugins/unocss';
import './styles/index.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import { setupElementPlus } from './plugins/elementPlus';
import { setupI18n } from './plugins/vueI18n';

const setupAll = async () => {
  const app = createApp(App);

  await setupI18n(app);
  setupStore(app);
  setupElementPlus(app);
  setupRouter(app);

  app.mount('#app');
};

setupAll();
