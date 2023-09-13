import { App } from 'vue';
import piniaPersist from 'pinia-plugin-persistedstate';

const store = createPinia();

store.use(piniaPersist);

export const setupStore = (app: App) => {
  app.use(store);
};

export { store };
