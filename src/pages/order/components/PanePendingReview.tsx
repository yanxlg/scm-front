import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { JsonForm, LoadingButton, FitTable, useModal, useList } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { IWaitShipSearch, IWaitShipOrderItem } from '@/interface/IOrder';
import {
    delPurchaseOrders,
    delChannelOrders,
    postExportWaitShip,
    getReviewOrderList
} from '@/services/order-manage';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import {
    purchaseOrderOptionList,
    purchaseShippingOptionList,
    orderStatusOptionList,
} from '@/enums/OrderEnum';
import { TableProps } from 'antd/es/table';
import Export from '@/components/Export';

import formStyles from 'react-components/es/JsonForm/_form.less';

declare interface IProps {
    getAllTabCount(): void;
}

const formFields: FormField[] = [
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单生成时间',
        className: 'order-all-date-picker',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'input',
        name: 'order_goods_id',
        label: '子订单ID',
        className: 'order-input-review',
        placeholder: '请输入子订单ID',
        formatter: 'number_str_arr',
    },
    {
        type: 'input',
        name: 'channel_order_goods_sn',
        label: '销售订单ID',
        className: 'order-input-review',
        placeholder: '请输入销售订单ID',
        formatter: 'str_arr',
    },
];

const PanePendingReview: React.FC<IProps> = ({ getAllTabCount }) => {
    const searchRef = useRef<JsonFormRef>(null);

    const {
        dataSource,
        loading,
        queryRef,
        onSearch,
        total,
        pageSize,
        pageNumber,
        onChange,
        onReload,
        selectedRowKeys,
        setSelectedRowKeys
    } = useList({
        queryList: getReviewOrderList,
        formRef: [searchRef],
    });
    const { visible, setVisibleProps, onClose } = useModal<boolean>();

    let currentSearchParams: IWaitShipSearch | null = null;

    
    const handleOrderList = useCallback(list => {
        return list.map((current: any) => {
            const {
                platformOrderTime,
                purchasePlatformOrderId,
                purchaseAmount,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchasePlanId,
                orderGoodsId,
                productId,
                // purchasewaybillNo,
                orderGoods,
                orderInfo,
            } = current;
            const { orderGoodsStatus, createTime: orderCreateTime } = orderGoods;
            const { channelSource } = orderInfo;
            return {
                platformOrderTime,
                purchasePlatformOrderId,
                purchaseAmount,
                orderGoodsStatus,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchasePlanId,
                orderGoodsId,
                orderCreateTime,
                productId,
                // purchasewaybillNo,
                channelSource,
            } as IWaitShipOrderItem;
        });
    }, []);

    const batchOperateSuccess = useCallback((name: string = '', list: string[]) => {
        getAllTabCount();
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

    const _cancelPurchaseOrder = useCallback(() => {
        return delPurchaseOrders({
            order_goods_ids: selectedRowKeys as string[],
        }).then(res => {
            onSearch();
            const { success, failed } = res.data;
            if (success!.length) {
                batchOperateSuccess('取消采购单', success);
            }
            if (failed!.length) {
                batchOperateFail('取消采购单', failed);
            }
        });
    }, [selectedRowKeys]);

    const _delChannelOrders = useCallback(() => {
        return delChannelOrders({
            order_goods_ids: selectedRowKeys as string[],
        }).then(res => {
            onSearch();
            const { success, failed } = res.data;

            if (success!.length) {
                batchOperateSuccess('取消渠道订单', success);
            }
            if (failed!.length) {
                batchOperateFail('取消渠道订单', failed);
            }
        });
    }, [selectedRowKeys]);

    const _postExportWaitShip = useCallback((values: any) => {
        return postExportWaitShip({
            ...currentSearchParams,
            ...values,
        });
    }, []);

    const orderList = useMemo(() => {
        console.log('dataSource', dataSource);
        return [];
    }, [dataSource])

    const search = useMemo(() => {
        return (
            <JsonForm
                ref={searchRef}
                fieldList={formFields}
                labelClassName="order-label"
                // initialValues={defaultInitialValues}
            >
                <div>
                    <LoadingButton
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={onSearch}
                    >
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                </div>
            </JsonForm>
        );
    }, []);

    const columns = useMemo<TableProps<IWaitShipOrderItem>['columns']>(() => {
        return [
            {
                title: '操作',
                dataIndex: 'platformOrderTime',
                align: 'center',
                width: 120,
            },
            {
                title: '订单生成时间',
                dataIndex: 'purchasePlatformOrderId',
                align: 'center',
                width: 120,
                render: (value: string) => utcToLocal(value, ''),
            },
            {
                title: '子订单ID',
                dataIndex: 'purchaseAmount',
                align: 'center',
                width: 120,
            },
            {
                title: '爬虫Goods ID',
                dataIndex: 'channelSource',
                align: 'center',
                width: 120,
            },
            {
                title: 'SKU图片',
                dataIndex: 'productId',
                align: 'center',
                width: 120,
            },
            {
                title: '商品名称',
                dataIndex: 'orderGoodsStatus',
                align: 'center',
                width: 120,
            },
            {
                title: '商品规格',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
                width: 120,
            },
            {
                title: '销售商品数量',
                dataIndex: 'purchaseOrderShippingStatus',
                align: 'center',
                width: 120,
            },
            {
                title: '销售商品运费',
                dataIndex: 'purchasePlanId',
                align: 'center',
                width: 120,
            },
            {
                title: '销售商品总金额',
                dataIndex: 'orderGoodsId',
                align: 'center',
                width: 130,
            },
            {
                title: '销售店铺名称',
                dataIndex: 'orderCreateTime',
                align: 'center',
                width: 120,
                
            },
            {
                title: '销售订单ID',
                dataIndex: 'a1',
                align: 'center',
                width: 120,
            },
        ];
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const toolBarRender = useCallback(() => {
        const disabled = selectedRowKeys.length === 0 ? true : false;
        return [
            <LoadingButton
                key="_order"
                type="primary"
                disabled={disabled}
                className={formStyles.formBtn}
                onClick={_cancelPurchaseOrder}
            >
                审核通过
            </LoadingButton>,
            <LoadingButton
                key="channel_order"
                type="primary"
                className={formStyles.formBtn}
                onClick={() => _delChannelOrders()}
                disabled={selectedRowKeys.length === 0}
            >
                取消渠道订单
            </LoadingButton>,
            <Button
                key="export"
                className={formStyles.formBtn}
                onClick={() => setVisibleProps(true)}
            >
                导出
            </Button>,
        ];
    }, [selectedRowKeys, _cancelPurchaseOrder, _delChannelOrders, _postExportWaitShip]);

    useEffect(() => {
        onSearch();
    }, []);

    return useMemo(() => {
        return (
            <>
                {search}
                <FitTable
                    bordered={true}
                    rowKey="orderGoodsId"
                    className="order-table"
                    loading={loading}
                    columns={columns}
                    rowSelection={{
                        fixed: true,
                        columnWidth: 60,
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: React.Key[]) =>
                            setSelectedRowKeys(selectedRowKeys as string[]),
                    }}
                    dataSource={orderList}
                    scroll={{ x: 'max-content' }}
                    columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={toolBarRender}
                />
                <Export
                    columns={columns as any}
                    visible={visible}
                    onOKey={_postExportWaitShip}
                    onCancel={onClose}
                />
            </>
        );
    }, [loading, orderList, selectedRowKeys, visible]);
};

export default PanePendingReview;
