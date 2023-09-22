<script lang="tsx">
import { useAppStore } from '@/store/modules/app';
import { useRenderLayout } from './components/useRenderLayout';

const appStore = useAppStore();
const layout = computed(() => appStore.getLayout);
const mobile = computed(() => appStore.getMobile);
const collapse = computed(() => appStore.getCollapse);

const renderLayout = () => {
  switch (unref(layout)) {
    case 'classic': {
      const { renderClassic } = useRenderLayout();
      return renderClassic();
    }
    default:
      break;
  }
};

const handleClickOutside = () => {
  appStore.setCollapse(true);
};

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => (
      <section class={[`layout-${layout.value}`, 'w-100%', 'h-100%', 'relative']}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}
        {renderLayout()}
      </section>
    );
  }
});
</script>

<style lang="scss" scoped>
::v-deep(.el-scrollbar__view) {
  height: 100% !important;
}
</style>
