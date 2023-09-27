<script lang="tsx">
import { useAppStore } from '@/store/modules/app';
import { ElMenu, ElScrollbar } from 'element-plus';
import { isUrl } from '@/utils/is';
import { useRenderMenuItem } from './components/useRenderMenuItem';
import { usePermissionStore } from '@/store/modules/permission';
import 'element-plus/theme-chalk/el-menu.css';

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const { push, currentRoute } = useRouter();

    const appStore = useAppStore();
    const layout = computed(() => appStore.getLayout);
    const collapse = computed(() => appStore.getCollapse);
    const uniqueOpened = computed(() => appStore.getUniqueOpened);

    const permissionStore = usePermissionStore();
    // const routers = computed(() =>
    //   unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    // )
    const menus = computed(() => permissionStore.getMenus);

    const menuMode = computed(() => {
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu'];
      if (vertical.includes(unref(layout))) {
        return 'vertical';
      } else {
        return 'horizontal';
      }
    });

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index);
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index);
      } else {
        push(index);
      }
    };

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu();
      } else {
        return <ElScrollbar>{renderMenu()}</ElScrollbar>;
      }
    };
    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute);
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string;
      }
      return path;
    });
    // backgroundColor="var(--left-menu-bg-color)"
    // textColor="var(--left-menu-text-color)"
    // activeTextColor="var(--left-menu-text-active-color)"

    const renderMenu = () => {
      return (
        <ElMenu
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(unref(menuMode));
              return renderMenuItem(unref(menus));
            }
          }}
        </ElMenu>
      );
    };
    return () => (
      <div
        id="menu"
        class={[
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    );
  }
});
</script>

<style lang="scss" scoped>
.menu {
  position: relative;
  transition: width var(--transition-time-02);

  ::v-deep(el-menu) {
    width: 100% !important;
    border-right: none;

    .is-active {
      & > .el-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }

    .el-sub-menu__title,
    .el-menu-item {
      &:hover {
        color: var(--left-menu-text-active-color) !important;
        background-color: var(--left-menu-bg-active-color) !important;
      }
    }

    .el-sub-menu.is-active,
    .el-menu-item.is-active {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-active-color) !important;

      &:hover {
        background-color: var(--left-menu-bg-active-color) !important;
      }
    }

    .el-menu-item.is-active {
      position: relative;
    }

    .el-menu {
      .el-sub-menu__title,
      el-menu-item:not(.is-active) {
        background-color: var(--left-menu-bg-light-color) !important;
      }
    }
  }

  // 折叠时的最小宽度
  ::v-deep(.el-menu-collapse) {
    width: var(--left-menu-min-width);

    & > .is-active,
    & > .is-active > .el-sub-menu_title {
      position: relative;
      background-color: var(--left-menu-bg-active-color) !important;
    }
  }

  ::v-deep(.horizontal-collapse-transition) {
    transition:
      0s width ease-in-out,
      0s padding-left ease-in-out,
      0s padding-right ease-in-out !important;

    .menu__title {
      display: none;
    }
  }

  &__horizontal {
    height: calc(var(--top-tool-height)) !important;
  }
}
</style>

<!-- <script lang="tsx">
import { ElMenu, ElScrollbar } from 'element-plus';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { transformRoutesToMenus } from '@/utils/treeHelper';
import "element-plus/theme-chalk/el-menu.css";

export default defineComponent({
  name: 'Menu',
  setup() {
    const appStore = useAppStore()
    const collapse = computed(() => appStore.getCollapse)
    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const permissionStore = usePermissionStore()
    const routers = computed(() => permissionStore.getRouters)
    const menus = transformRoutesToMenus(unref(routers))
    console.log(unref(menus))

    return () => (
      <div class={['h-[100%] overflow-hidden flex-col]',]}>
        <ElScrollbar>
          <ElMenu collapse={unref(collapse)} uniqueOpened={unref(uniqueOpened)}>
            {{
              default: () => {
                const { renderMenuItem } = useRenderMenuItem('vertical')
                return renderMenuItem(menus)
              }
            }}
          </ElMenu>
        </ElScrollbar>
      </div>

    )
  }
})
</script> -->
