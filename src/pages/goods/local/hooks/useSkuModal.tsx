import React, { useState, useCallback } from 'react';
import { ISkuInfo } from '@/interface/ILocalGoods';

export default function() {
    const [skuStatus, setSkuStatus] = useState(false);
    const [currentSkuInfo, setCurrentSkuInfo] = useState<ISkuInfo | null>(null);

    const showSkuModal = useCallback(record => {
        const {
            tags,
            product_id,
            goods_img,
            title,
            worm_goodsinfo_link,
            worm_goods_id,
            first_catagory,
            second_catagory,
            third_catagory,
            commodity_id,
        } = record;
        setSkuStatus(true);
        setCurrentSkuInfo({
            tags,
            product_id,
            goods_img,
            title,
            worm_goodsinfo_link,
            worm_goods_id,
            first_catagory,
            second_catagory,
            third_catagory,
            commodity_id,
        });
    }, []);

    const hideSkuModal = useCallback(() => {
        setSkuStatus(false);
        setCurrentSkuInfo(null);
    }, []);

    return {
        skuStatus,
        currentSkuInfo,
        showSkuModal,
        hideSkuModal,
    };
}
