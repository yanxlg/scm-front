import React, { useState, useCallback } from 'react';
import { IGoodsEditItem, IGoodsAndSkuItem } from '@/interface/ILocalGoods';

export default function () {
    const [editGoodsStatus, setEditGoodsStatus] = useState(false);
    const [editGoodsInfo, setEditGoodsInfo] = useState<IGoodsEditItem | null>(null);

    const showEditGoods = useCallback((record: IGoodsAndSkuItem) => {
        // console.log('showEditGoods', record);
        const {
            product_id,
            title,
            description,
            first_catagory,
            second_catagory,
            third_catagory,
            goods_img,
            sku_image,
        } = record;
        setEditGoodsStatus(true);
        const list = [...sku_image];
        const index = list.findIndex(img => img === goods_img);
        if (index > -1) {
            list.splice(index, 1);
            list.unshift(goods_img);
        }
        setEditGoodsInfo({
            product_id,
            title,
            description,
            first_catagory,
            second_catagory,
            third_catagory,
            goods_img,
            sku_image: list,
        });
    }, []);

    const hideEditGoods = useCallback(() => {
        setEditGoodsStatus(false);
    }, []);

    return {
        editGoodsStatus,
        editGoodsInfo,
        showEditGoods,
        hideEditGoods
    }
}