import React, { useState, useCallback } from 'react';
import { ISkuInfo } from '@/interface/ILocalGoods';

export default function() {
    const [skuStatus, setSkuStatus] = useState(false);
    const [currentSkuInfo, setCurrentSkuInfo] = useState<ISkuInfo | null>(null);
    const [channelSource, setChannelSource] = useState('');

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
            source_channel,
        } = record;
        setSkuStatus(true);
        setChannelSource(source_channel);
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
        setChannelSource('');
        setCurrentSkuInfo(null);
    }, []);

    return {
        skuStatus,
        currentSkuInfo,
        channelSource,
        showSkuModal,
        hideSkuModal,
    };
}
