import React, { useCallback, useRef, useState } from 'react';
import { Modal, Checkbox, notification } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { postOrderOffsale, delChannelOrders } from '@/services/order-manage';

const { confirm } = Modal;

interface IProps {
    orderGoodsIds: string[];
    children: any;
    onReload(): Promise<void>;
    getAllTabCount(): void;
}

const CancelOrder: React.FC<IProps> = ({ children, orderGoodsIds, onReload, getAllTabCount }) => {
    // console.log('children', children);
    const checkRef = useRef(true);

    const batchOperateSuccess = useCallback((name: string = '', list: string[]) => {
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

    const batchOperateFail = useCallback(
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

    // 下架商品
    const _postOrderOffsale = useCallback((orderGoodsIds: string[]) => {
        return postOrderOffsale({
            order_goods_ids: orderGoodsIds,
        }).then(res => {
            // onReload();
            const { success } = res.data;
            if (success!.length) {
                batchOperateSuccess('下架商品', [
                    ...new Set(success.map((item: any) => item.product_id)),
                ] as string[]);
            }
            // if (failed!.length) {
            //     batchOperateFail('下架商品', [...new Set(failed.map((item: any) => item.product_id))] as string[]);
            // }
        });
    }, []);

    // 取消销售单
    const _delChannelOrders = useCallback((orderGoodsIds: string[]) => {
        return delChannelOrders({
            order_goods_ids: orderGoodsIds,
        }).then(res => {
            checkRef.current = true;
            onReload();
            getAllTabCount();
            const { success, failed } = res.data;
            if (success!.length) {
                batchOperateSuccess('取消订单', success);
            }
            if (failed!.length) {
                batchOperateFail('取消订单', failed);
            }
        });
    }, []);

    // 先下架再取消订单
    const offsaleAndChannelOrders = useCallback(async orderGoodsIds => {
        try {
            await _postOrderOffsale(orderGoodsIds);
            await _delChannelOrders(orderGoodsIds);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject();
        }
    }, []);

    const handleOk = useCallback(() => {
        console.log(111111, checkRef.current);
        // return Promise.reject();
        return checkRef.current
            ? offsaleAndChannelOrders(orderGoodsIds)
            : _delChannelOrders(orderGoodsIds);
    }, [orderGoodsIds]);

    const showConfirm = () => {
        confirm({
            title: '取消销售单',
            icon: <QuestionCircleOutlined />,
            content: (
                <div>
                    <p>是否确认取消销售单?</p>
                    <Checkbox
                        defaultChecked={true}
                        onChange={e => (checkRef.current = e.target.checked)}
                    >
                        <strong>同时下架商品</strong>
                    </Checkbox>
                </div>
            ),
            onOk: handleOk,
            onCancel: () => {
                checkRef.current = true;
            },
        });
    };

    return React.cloneElement(children as any, {
        onClick: () => showConfirm(),
    });
};

export default React.memo(CancelOrder);
