import { transOptionList } from '@/utils/transform';

export const defaultOption = { name: '全部', value: '' };

// 销售状态
export const inventoryStatusMap = {
    1: '不可销售',
    2: '可销售',
};

export const inventoryStatusList = transOptionList(inventoryStatusMap);

// 版本状态
export const productStatusMap = {
    0: 'INITIALIZING',
    1: 'INITIALIZED',
    2: 'UPDATING',
    3: 'UPDATED',
    4: 'RELEASING',
    5: 'RELEASED',
    6: 'PUBLISHED',
    7: 'FROZEN',
    8: 'RETIRED',
    9: 'REMOVED',
};

export const productStatusList = transOptionList(productStatusMap);

// 版本更新
export const versionStatusMap = {
    1: '有新版本更新',
    2: '无新版本更新',
};

export const versionStatusList = transOptionList(versionStatusMap);

// 上架状态
export const publishStatusMap = {
    0: '上架中',
    1: '已上架',
    2: '已下架',
    3: '上架失败',
};

export type publishStatusCode = keyof typeof publishStatusMap;

// 商品渠道来源 Commodity channel source
export const goodsSourceMap = {
    1: 'PDD',
    2: 'VOVA',
};

export const goodsSourceList = transOptionList(goodsSourceMap);
