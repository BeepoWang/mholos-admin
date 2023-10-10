
type LocaleType = 'zh-CN' | 'en'
type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>
type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu'
type menuType = "F" | "M" | "C"

type ComponentRef<T> = InstanceType<T>

interface Fn<T = any> {
  (...arg: T[]): T
}