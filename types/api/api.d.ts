
interface Pages {
  pageNum?: number
  pageSize?: number
}

interface BasePageListRes<T = any> {
  list: T[]
  nextPage: boolean
  pageNum: number
  pageSize: number
  totalNum: number
  totalPageNum: number
}
