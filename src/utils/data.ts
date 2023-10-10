export function getListNameById(id: any, list: any[]) {
  const currentItem = list.find((item: { value: any }) => item.value === id);
  return currentItem ? currentItem.label : '';
}

export const updateTypeOptions = [
  {
    label: '强制更新',
    value: 1
  },
  {
    label: '提示更新',
    value: 2
  },
  {
    label: '静默更新',
    value: 3
  }
];

export const statusOptions = [
  {
    label: '启用',
    value: 0
  },
  {
    label: '禁用',
    value: 1
  }
];

export const defaultRolOptions = [
  {
    label: '默认',
    value: 1
  },
  {
    label: '非默认',
    value: 0
  }
];
