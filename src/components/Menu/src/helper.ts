type OnlyOneChildType = AppRouteRecordRaw & { noShowingChildren?: boolean };

export const hasOneChildShow = (children: AppRouteRecordRaw[] = [], parent: AppRouteRecordRaw) => {
  const onlyOneChild = ref<OnlyOneChildType>();

  const showChildren = children.filter((i) => {
    const meta = i.meta ?? {};
    if (meta.hidden) {
      return false;
    } else {
      onlyOneChild.value = i;
      return true;
    }
  });
  if (showChildren.length === 1) {
    return {
      oneShowChild: true,
      onlyOneChild: unref(onlyOneChild)
    };
  }
  if (!showChildren.length) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return {
      oneShowChild: true,
      onlyOneChild: unref(onlyOneChild)
    };
  }

  return {
    oneShowChild: false,
    onlyOneChild: unref(onlyOneChild)
  };
};
