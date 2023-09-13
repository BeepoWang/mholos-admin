import { ElLoading, ElScrollbar } from 'element-plus';
import type { App } from 'vue';

const plugins = [ElLoading];
const components = [ElScrollbar];

export const setupElementPlus = (app: App) => {
  plugins.forEach((plugin) => {
    app.use(plugin);
  });
  components.forEach((component) => {
    app.component(component.name, component);
  });
};
