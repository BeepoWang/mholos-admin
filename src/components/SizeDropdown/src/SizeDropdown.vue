<template>
  <el-dropdown @command="setCurrentSize" trigger="click">
    <icon-mdi-format-size class="text-18px cursor-pointer" trigger="click" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="size in sizeMap" :key="size" :command="size">
          {{ t(`size.${size}`) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app';
import { useI18n } from '@/hooks/useI18n';
import { ComponentSize } from 'element-plus';

const { t } = useI18n();
const appStore = useAppStore();
const sizeMap = computed(() => appStore.sizeMap);

const setCurrentSize = (size: ComponentSize) => {
  console.log(size);
  appStore.setCurrentSize(size);
};
</script>

<style lang="scss" scoped>
.size-dropdown {
  height: auto;
}
</style>
