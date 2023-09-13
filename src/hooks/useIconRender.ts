import { Icon } from '@iconify/vue';
import { h } from 'vue';

export const useIconRender = () => {
  interface IconConfig {
    icon: string;
    localIcon?: string;
    color?: string;
    fontSize?: number;
  }

  interface IconStyle {
    color?: string;
    fontSize?: string;
  }

  /**
   * 图标渲染
   * @param config
   * @property icon - 图标名称(iconify图标的名称), 例如：mdi-account 或者 mdi:account
   * @property localIcon - 本地svg图标文件名(assets/svg-icon文件夹下)
   * @property color - 图标颜色
   * @property fontSize - 图标大小
   */
  const iconRender = (config: IconConfig) => {
    const style: IconStyle = {};
    config.color && (style.color = config.color);
    config.fontSize && (style.fontSize = `${config.fontSize}px`);
    return () =>
      h(Icon, {
        icon: config.icon
      });
  };

  return {
    iconRender
  };
};
