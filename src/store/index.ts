import { App } from 'vue';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const store = createPinia();

store.use(
  createPersistedState({
    storage: sessionStorage
  })
);

export const setupStore = (app: App) => {
  app.use(store);
};

export { store };
