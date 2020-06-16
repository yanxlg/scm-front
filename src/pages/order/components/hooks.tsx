import React, { useCallback } from 'react';
import { delPurchaseOrders } from '@/services/order-manage';
import { notification } from 'antd';

export const useBatch = (updateCount: () => void) => {
    const batchSuccess = useCallback((name: string = '', list: string[]) => {
        updateCount();
        notification.success({
            message: `${name}成功`,
            description: (
                <div>
                    {list.map((item: string) => (
                        <div key={item}>{item}</div>
                    ))}
                </div>
            ),
        });
    }, []);

    const batchFail = useCallback(
        (name: string = '', list: { order_goods_id: string; result: string }[]) => {
            notification.error({
                message: `${name}失败`,
                description: (
                    <div>
                        {list.map((item: any) => (
                            <div>
                                {item.order_goods_id}: {item.result.slice(0, 50)}
                            </div>
                        ))}
                    </div>
                ),
            });
        },
        [],
    );
    return {
        batchSuccess,
        batchFail,
    };
};

export const useCancelPurchase = (
    selectedRowKeys: string[],
    onSearch: () => void,
    updateCount: () => void,
) => {
    const { batchSuccess, batchFail } = useBatch(updateCount);
    const cancelSingle = useCallback((orderGoodsIds: string[]) => {
        return delPurchaseOrders({
            order_goods_ids: orderGoodsIds,
        }).then(res => {
            onSearch();
            const { success, failed } = res.data;
            if (success!.length) {
                batchSuccess('取消采购单', success);
            }
            if (failed!.length) {
                batchFail('取消采购单', failed);
            }
        });
    }, []);

    const cancelList = useCallback(() => {
        return cancelSingle(selectedRowKeys);
    }, [selectedRowKeys]);

    return {
        cancelSingle,
        cancelList,
    };
};
