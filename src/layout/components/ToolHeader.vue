<!-- <template>
  <div class="layout-tool-header h-[var(--top-tool-height)] relative flex items-center justify-between">
    <div class="h-full flex items-center">
      <Collapse class="custom-hover"></Collapse>
    </div>
    <div class="h-full flex items-center">
      <ScreenFull class="custom-hover"></ScreenFull>
      <LocaleDropdown class="custom-hover"></LocaleDropdown>
      <SizeDropdown class="custom-hover"></SizeDropdown>
      <UserInfo class="custom-hover"></UserInfo>
    </div>
  </div>
</template> -->

<script lang="tsx">
import { ScreenFull } from '@/components/ScreenFull';
import { Collapse } from '@/components/Collapse';
import { LocaleDropdown } from '@/components/LocaleDropdown';
import { SizeDropdown } from '@/components/SizeDropdown';
import { UserInfo } from '@/components/UserInfo';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const fullScreen = computed(() => appStore.getFullScreen);
const size = computed(() => appStore.getSize);
const layout = computed(() => appStore.getLayout);
const locale = computed(() => appStore.getLocale);

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    return () => (
      <>
        <div class="layout-tool-header h-[var(--top-tool-height)] relative flex items-center justify-between">
          {layout.value !== 'top' ? (
            <div class="h-full flex items-center">
              {layout.value !== 'cutMenu' ? <Collapse class="custom-hover"></Collapse> : undefined}
            </div>
          ) : undefined}
          <div class="h-full flex items-center">
            {fullScreen.value ? <ScreenFull class="custom-hover"></ScreenFull> : undefined}
            {locale.value ? <LocaleDropdown class="custom-hover"></LocaleDropdown> : undefined}
            {size.value ? <SizeDropdown class="custom-hover"></SizeDropdown> : undefined}
            <UserInfo class="custom-hover"></UserInfo>
          </div>
        </div>
      </>
    );
  }
});
</script>
