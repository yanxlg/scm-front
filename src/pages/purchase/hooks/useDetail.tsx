import React, { useState, useCallback } from 'react';
import { IPurchaseAbnormalItem } from '@/interface/IPurchase';

export default function useDetail(
    setCurrentRecord: React.Dispatch<React.SetStateAction<IPurchaseAbnormalItem | null>>,
) {
    const [detailStatus, setDetailStatus] = useState(false);

    const showDetail = (row: IPurchaseAbnormalItem) => {
        setDetailStatus(true);
        setCurrentRecord(row);
    };

    const hideDetail = useCallback(() => {
        setDetailStatus(false);
    }, []);

    return {
        detailStatus,
        showDetail,
        hideDetail,
    };
}
