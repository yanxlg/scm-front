import React, { useState, useEffect, useCallback } from 'react';
import { getGoodsVersion } from '@/services/goods';
import { IGoodsVersionInfo } from '@/interface/ILocalGoods';
import { utcToLocal } from '@/utils/date';

export default function useReleasedGoods(commodityId: string) {

    const [releasedGoods, setReleasedGoods] = useState<IGoodsVersionInfo>();

    const getReleasedGoodsInfo = useCallback(
        () => {
            getGoodsVersion({
                page: 1,
                page_count: 50,
                commodity_id: commodityId,
                product_status: [80],
            }).then(res => {
                // console.log('getReleasedGoodsInfo', res);
                const { list } = res.data;
                if (list?.length > 0) {
                    const {
                        title,
                        product_id,
                        goods_img,
                        first_catagory,
                        second_catagory,
                        third_catagory,
                        worm_goodsinfo_link,
                        worm_goods_id,
                        update_time
                    } = list[0];
                    setReleasedGoods({
                        title,
                        product_id,
                        goods_img,
                        first_catagory,
                        second_catagory,
                        third_catagory,
                        worm_goodsinfo_link,
                        worm_goods_id,
                        _update_time: utcToLocal(update_time)
                    })
                }
            });
        },
        [commodityId]
    )

    useEffect(
        () => {
            getReleasedGoodsInfo();
        },
        []
    )

    return {
        releasedGoods,
        getReleasedGoodsInfo
    }
}