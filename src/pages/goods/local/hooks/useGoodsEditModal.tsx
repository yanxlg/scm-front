import React, { useState, useCallback } from 'react';
// import { IGoodsEditItem, IGoodsAndSkuItem } from '@/interface/ILocalGoods';

export default function() {
    const [editGoodsStatus, setEditGoodsStatus] = useState(false);
    const [productId, setProductId] = useState('');

    const showEditGoods = useCallback(productId => {
        // console.log('showEditGoods', record);
        setEditGoodsStatus(true);
        setProductId(productId);
    }, []);

    const hideEditGoods = useCallback(() => {
        setEditGoodsStatus(false);
    }, []);

    return {
        editGoodsStatus,
        showEditGoods,
        hideEditGoods,
        productId,
        setProductId,
    };
}
