
interface AssetItem {
  id: string;
  name: string;
  img: string;
  imgUrl: string;
  imgUrls: string[];
  price: number;
  content: string;
  status: number;
}

interface AssetDetail {
  projectId?: string
  id: string;
  code: string;
  name: string;
  content: string;
  category: string;
  price: number;
  img: string;
  imgUrl: string;
  masterImg: string;
  masterImgUrl: string;
  assetsImg: string;
  assetsImgUrl: string;
  backImg: string;
  backImgUrl: string;
  equipmentImg: string;
  equipmentImgUrl: string;
  carImg: string;
  carImgUrl: string;
  fileId: string;
  fileUrl?: any;
  h5FileId: string;
  h5FileUrl?: any;
  sort: number;
  status: number;
  defaultFlag?: number
}

interface ProjectItem {
  code: string;
  id: string;
  name: string;
}

interface CategoryItem {
  id: string;
  name: string;
}

interface UploadRes {
  id: string;
  name: string;
  fileType: string;
  size: string;
  url: string;
}