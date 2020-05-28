import request from '@/utils/request';
import { getEnabledTagsList } from './goods-attr';

// 获取所有的商品标签
export function getAllGoodsTagList() {
    return getEnabledTagsList().then(({ data }) => {
        // console.log('getEnabledTagsList', res);
        return (
            data?.tags.map((item: any) => ({
                name: item.name,
                value: item.name,
            })) ?? []
        );
    });
}
