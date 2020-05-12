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

export const ProductStatusResponseMap = {
    0: '上传失败',
    1: '待上架',
    2: '已上架',
    3: '已下架',
    5: '上传中',
};
// 返回哪些状态可以执行上架操作
export const checkUpperShelf = function(status: number) {
    return status === 1 || status === 3; // 可上架
};
//返回哪些状态可执行下架操作
export const checkLowerShelf = function(status: number) {
    return status === 2; // 已上架
};
