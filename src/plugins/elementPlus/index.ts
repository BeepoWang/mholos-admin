import { ElLoading, ElScrollbar } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import type { App } from 'vue';

const plugins = [ElLoading];
const components = [ElScrollbar, User, Lock];

export const setupElementPlus = (app: App) => {
  plugins.forEach((plugin) => {
    app.use(plugin);
  });
  components.forEach((component) => {
    app.component(component.name, component);
  });
};
