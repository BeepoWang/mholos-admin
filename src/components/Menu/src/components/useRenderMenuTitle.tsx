import { useI18n } from '@/hooks/useI18n';
import { ElIcon } from 'element-plus';
import { RouteMetaCustom } from 'types/router';
import { useIconRender } from '@/hooks/useIconRender';

const { iconRender } = useIconRender();

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMetaCustom) => {
    const { t } = useI18n();
    const { title = 'Please set title' } = meta;
    const icon = meta.icon && iconRender({ icon: meta.icon as string });

    return icon ? (
      <>
        <ElIcon>
          <icon></icon>
        </ElIcon>
        <span class="menu__title">{t(title as string)}</span>
      </>
    ) : (
      <span class="menu__title">{t(title as string)}</span>
    );
  };

  return {
    renderMenuTitle
  };
};
