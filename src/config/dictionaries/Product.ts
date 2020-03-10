//======================= 商品状态 ======================//
import { transStatusList } from '@/utils/transform';

export const ProductStatusMap = {
    0: '全部',
    1: '待上架',
    2: '已上架',
    3: '已下架',
};

export type ProductStatusCode = keyof typeof ProductStatusMap;

export const ProductStatusList = transStatusList(ProductStatusMap);
