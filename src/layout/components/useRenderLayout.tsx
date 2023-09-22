import { Logo } from '@/components/Logo';
import { useAppStore } from '@/store/modules/app';
import { ElScrollbar } from 'element-plus';
import ToolHeader from './ToolHeader.vue';
import AppContent from './AppContent.vue';

const appStore = useAppStore();

const tagsView = computed(() => appStore.getTagsView);
const collapse = computed(() => appStore.getCollapse);
const fixedHeader = computed(() => appStore.getFixedHeader);
const mobile = computed(() => appStore.getMobile);
const logo = computed(() => appStore.getLogo);
const pageLoading = computed(() => appStore.getPageLoading);

export const useRenderLayout = () => {
  const renderClassic = () => {
    return (
      <>
        <div
          class={[
            'layout-sidebar absolute top-0 left-0 h-gull layout-border__right',
            { '!fixed z-300': mobile.value }
          ]}
        >
          {logo.value ? (
            <Logo
              class={[
                'bg-[var(--left-menu-bg-color)] relative',
                {
                  'pl-0': mobile.value && collapse.value,
                  'w-[var(--left-menu-min-width)]': collapse.value,
                  'w-[var(--left-menu-max-width)]': !collapse.value
                }
              ]}
            ></Logo>
          ) : undefined}
        </div>
        <div
          class={[
            'layout-content absolute top-0 h-100%',
            {
              'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]':
                collapse.value && !mobile.value && !mobile.value,
              'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]':
                !collapse.value && !mobile.value && !mobile.value,
              'fixed !w-full !left-0': mobile.value
            }
          ]}
          style="transition: all var(--transition-time-02)"
        >
          <ElScrollbar
            v-loading={pageLoading.value}
            class={[
              {
                '!h-[calc(100%-var(--top-tool-height)-var(--tags-view-height))] mt-[calc(var(--top-tool-height)+var(--tags-view-height))]':
                  fixedHeader.value
              }
            ]}
          >
            <div
              class={[
                {
                  'fixed top-0 left-0 z-10': fixedHeader.value,
                  'w-[calc(100%-var(--left-menu-min-width))] !left-[var(--left-menu-min-width)]':
                    collapse.value && fixedHeader.value && !mobile.value,
                  'w-[calc(100%-var(--left-menu-max-width))] !left-[var(--left-menu-max-width)]':
                    !collapse.value && fixedHeader.value && !mobile.value,
                  '!w-full !left-0': mobile.value
                }
              ]}
              style="transition: all var(--transition-time-02)"
            >
              <ToolHeader
                class={[
                  'bg-[var(--top-header-bg-color)]',
                  {
                    'layout-border__bottom': !tagsView.value
                  }
                ]}
              ></ToolHeader>
            </div>
            <AppContent></AppContent>
          </ElScrollbar>
        </div>
      </>
    );
  };

  return {
    renderClassic
  };
};
