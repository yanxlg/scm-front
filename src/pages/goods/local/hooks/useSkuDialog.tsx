import React, { useState, useRef, useCallback, useEffect } from 'react';
import SkuDialog from '../components/SkuDialog';
import { IGoodsAndSkuItem, IGoodsVersionAndSkuItem } from '@/interface/ILocalGoods';

export default function() {
    const [skuStatus, setSkuStatus] = useState(false);
    const [currentSkuGoods, setCurrentSkuGoods] = useState<IGoodsAndSkuItem | IGoodsVersionAndSkuItem | null>(null);
    const skuDialogRef = useRef<SkuDialog>(null);

    const showSkuDialog = useCallback(
        (rowData) => {
            setSkuStatus(true);
            setCurrentSkuGoods(rowData);
        },
        []
    );

    const hideSkuDialog = useCallback(
        () => {
            setSkuStatus(false);
        },
        []
    );

    useEffect(
        () => {
            if (skuStatus) {
                skuDialogRef.current!.getSkuList(currentSkuGoods!.product_id, { page: 1 });
            }
        },
        [skuStatus]
    );

    return {
        skuStatus,
        currentSkuGoods,
        skuDialogRef,
        showSkuDialog,
        hideSkuDialog
    }
}