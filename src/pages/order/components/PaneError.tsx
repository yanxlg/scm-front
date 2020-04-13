import React, { useCallback, useMemo, useRef } from 'react';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm, FitTable, LoadingButton } from 'react-components';
import { getErrorOrderList, postExportErrOrder } from '@/services/order-manage';
import {
    defaultOptionItem,
    channelOptionList,
    errorTypeOptionList,
    errorDetailOptionMap,
    ErrorDetailOptionCode,
} from '@/enums/OrderEnum';
import { useList, useModal } from 'react-components/es/hooks';
import { ColumnProps, TableProps } from 'antd/es/table';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { Store } from 'rc-field-form/lib/interface';
import { FormInstance } from 'antd/es/form';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import SimilarStyleModal from '@/pages/order/components/SimilarStyleModal';
import { Button } from 'antd';

export declare interface IErrorOrderItem {
    createTime: string; // 订单时间
    confirmTime: string; // 订单确认时间
    orderGoodsId: string; // 订单号
    channelOrderGoodsSn: string; // 渠道订单号
    storageTime: string; // 入库时间
    deliveryTime: string; // 出库时间
    deliveryCommandTime: string; // 发送指令时间
    lastWaybillNo: string; // 尾程运单号
    abnormalDetailType: number;
    abnormalType: number;

    purchasePlanId?: string;
    platformSendOrderTime?: string; // 采购订单生成时间
    platformShippingTime?: string; // 采购订单发货时间
    platformOrderTime?: string; // 拍单时间
    payTime?: string; // 支付时间
    purchaseWaybillNo?: string; // 首程运单号
    _rowspan?: number;
}

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const PaneErrTab = () => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);

    const { visible, setVisibleProps, onClose } = useModal<string>();

    const fieldList: FormField[] = useMemo(() => {
        return [
            {
                type: 'number',
                name: 'order_goods_id',
                label: '订单号',
                className: 'order-input',
                placeholder: '请输入订单号',
                formatter: 'number',
            },
            {
                type: 'select',
                name: 'channel_source',
                label: '销售渠道',
                className: 'order-input',
                optionList: [defaultOptionItem, ...channelOptionList],
            },
            {
                type: 'select',
                name: 'abnormal_type',
                label: '异常类型',
                className: 'order-input',
                optionList: errorTypeOptionList,
                onChange: (name, form) => {
                    const value = form.getFieldValue(name);
                    formRef1.current!.setFieldsValue({
                        abnormal_type: value,
                        abnormal_detail_type:
                            value === 4 ? 7 : value === 2 ? 8 : value === 3 ? 3 : 11,
                    });
                    onSearch(); // 立即查询
                },
            },
            {
                type: 'dateRanger',
                name: ['order_time_start', 'order_time_end'],
                label: '订单时间',
                className: 'order-error-date-picker',
                formatter: ['start_date', 'end_date'],
            },
            {
                type: 'dateRanger',
                name: ['confirm_time_start', 'confirm_time_end'],
                label: '订单确认时间',
                className: 'order-error-date-picker',
                formatter: ['start_date', 'end_date'],
            },
        ];
    }, []);

    const mergeCell = useCallback((value: string | number, row: IErrorOrderItem) => {
        return {
            children: value,
            props: {
                rowSpan: row._rowspan || 0,
            },
        };
    }, []);

    const columns: ColumnProps<IErrorOrderItem>[] = [
        {
            key: 'createTime',
            title: '订单时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'confirmTime',
            title: '订单确认时间',
            dataIndex: 'confirmTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'orderGoodsId',
            title: '订单号',
            dataIndex: 'orderGoodsId',
            align: 'center',
            width: 120,
            render: mergeCell,
        },
        {
            key: 'channelOrderGoodsSn',
            title: '渠道订单号',
            dataIndex: 'channelOrderGoodsSn',
            align: 'center',
            width: 120,
            render: mergeCell,
        },
        {
            key: 'abnormalType',
            title: '异常类型',
            dataIndex: 'abnormalType',
            align: 'center',
            width: 120,
            render: (value: number, row: IErrorOrderItem) => {
                return {
                    children: getStatusDesc(errorTypeOptionList, value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'abnormalDetailType',
            title: '异常详情',
            dataIndex: 'abnormalDetailType',
            align: 'center',
            width: 120,
            render: (value: ErrorDetailOptionCode, row: IErrorOrderItem) => {
                return {
                    children: (
                        <div>
                            {errorDetailOptionMap[value]}
                            {value === 12 ? (
                                <div>
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            setVisibleProps(row.purchasePlanId as string)
                                        }
                                    >
                                        相似款代拍
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    ),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'storageTime',
            title: '入库时间',
            dataIndex: 'storageTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'deliveryTime',
            title: '出库时间',
            dataIndex: 'deliveryTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'deliveryCommandTime',
            title: '发送指令时间',
            dataIndex: 'deliveryCommandTime',
            align: 'center',
            width: 120,
            render: (value: string, row: IErrorOrderItem) => {
                return {
                    children: utcToLocal(value),
                    props: {
                        rowSpan: row._rowspan || 0,
                    },
                };
            },
        },
        {
            key: 'platformShippingTime',
            title: '采购订单发货时间',
            dataIndex: 'platformShippingTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'platformSendOrderTime',
            title: '采购订单生成时间',
            dataIndex: 'platformSendOrderTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'platformOrderTime',
            title: '拍单时间',
            dataIndex: 'platformOrderTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'payTime',
            title: '支付时间',
            dataIndex: 'payTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'signDeliveryTime',
            title: '标记发货时间',
            dataIndex: 'signDeliveryTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value);
            },
        },
        {
            key: 'purchaseWaybillNo',
            title: '首程运单号',
            dataIndex: 'purchaseWaybillNo',
            align: 'center',
            width: 120,
        },
        {
            key: 'lastWaybillNo',
            title: '尾程运单号',
            dataIndex: 'lastWaybillNo',
            align: 'center',
            width: 120,
        },
    ];

    const { dataSource, loading, queryRef, onSearch, total, pageSize, pageNumber } = useList({
        queryList: getErrorOrderList,
        formRef: [formRef, formRef1],
    });

    const onExport = useCallback(() => {
        const params = Object.assign(
            {
                page: 1,
                page_count: 50,
                abnormal_type: 1,
                abnormal_detail_type: 2,
            },
            queryRef.current,
        );
        return postExportErrOrder(params);
    }, []);

    const formComponent = useMemo(() => {
        return (
            <>
                <JsonForm
                    labelClassName="order-error-label"
                    fieldList={fieldList}
                    ref={formRef}
                    initialValues={{
                        channel_source: 100,
                        abnormal_type: 1,
                    }}
                >
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onExport}>
                        导出数据
                    </LoadingButton>
                </JsonForm>
                <JsonForm
                    ref={formRef1}
                    labelClassName="order-error-label"
                    enableCollapse={false}
                    fieldList={[
                        {
                            type: 'hide',
                            name: 'abnormal_type',
                        },
                        {
                            type: 'dynamic',
                            shouldUpdate: (prevValues: Store, nextValues: Store) => {
                                return prevValues.abnormal_type !== nextValues.abnormal_type;
                            },
                            dynamic: (form: FormInstance) => {
                                const abnormal_type = form.getFieldValue('abnormal_type');
                                switch (abnormal_type) {
                                    case 1:
                                    default:
                                        return {
                                            type: 'radioGroup',
                                            name: 'abnormal_detail_type',
                                            label: '异常详情',
                                            options: [
                                                {
                                                    label: errorDetailOptionMap[11],
                                                    value: 11,
                                                },
                                                {
                                                    label: errorDetailOptionMap[5],
                                                    value: 5,
                                                },
                                                {
                                                    label: errorDetailOptionMap[6],
                                                    value: 6,
                                                },
                                            ],
                                            onChange: () => {
                                                onSearch(); // 立即查询
                                            },
                                        };
                                    case 2:
                                        return {
                                            type: 'radioGroup',
                                            name: 'abnormal_detail_type',
                                            label: '异常详情',
                                            options: [
                                                {
                                                    label: errorDetailOptionMap[8],
                                                    value: 8,
                                                },
                                                {
                                                    label: errorDetailOptionMap[9],
                                                    value: 9,
                                                },
                                                {
                                                    label: errorDetailOptionMap[10],
                                                    value: 10,
                                                },
                                            ],
                                            onChange: () => {
                                                onSearch(); // 立即查询
                                            },
                                        };
                                    case 3:
                                        return {
                                            type: 'radioGroup',
                                            name: 'abnormal_detail_type',
                                            label: '异常详情',
                                            options: [
                                                {
                                                    label: errorDetailOptionMap[3],
                                                    value: 3,
                                                },
                                                {
                                                    label: errorDetailOptionMap[4],
                                                    value: 4,
                                                },
                                                {
                                                    label: errorDetailOptionMap[12],
                                                    value: 12,
                                                },
                                            ],
                                            onChange: () => {
                                                onSearch(); // 立即查询
                                            },
                                        };

                                    case 4:
                                        return {
                                            type: 'radioGroup',
                                            name: 'abnormal_detail_type',
                                            label: '异常详情',
                                            options: [
                                                {
                                                    label: errorDetailOptionMap[7],
                                                    value: 7,
                                                },
                                            ],
                                            onChange: () => {
                                                onSearch(); // 立即查询
                                            },
                                        };
                                }
                            },
                        },
                    ]}
                    initialValues={{
                        abnormal_detail_type: 11,
                        abnormal_type: 1,
                    }}
                />
            </>
        );
    }, []);

    const dataSet = useMemo(() => {
        if (dataSource.length === 0) {
            return [];
        } else {
            const { abnormal_type: abnormalType } = formRef.current!.getFieldsValue();
            const { abnormal_detail_type: abnormalDetailType } = formRef1.current!.getFieldsValue();
            const orderList: IErrorOrderItem[] = [];
            dataSource.forEach((goodsItem: any) => {
                const { orderGoods, orderInfo } = goodsItem;
                const {
                    createTime,
                    orderGoodsId,
                    channelOrderGoodsSn,
                    storageTime,
                    deliveryTime,
                    deliveryCommandTime,
                    lastWaybillNo,
                    orderGoodsPurchasePlan,
                } = orderGoods;
                const { confirmTime } = orderInfo;
                if (orderGoodsPurchasePlan) {
                    // 生成采购计划
                    orderGoodsPurchasePlan.forEach((purchaseItem: any, index: number) => {
                        const {
                            purchasePlanId,
                            platformShippingTime,
                            platformOrderTime,
                            payTime,
                            purchaseWaybillNo,
                            platformSendOrderTime,
                        } = purchaseItem;
                        const childOrderItem: IErrorOrderItem = {
                            createTime, // 订单时间
                            confirmTime, // 订单确认时间
                            orderGoodsId, // 订单号
                            channelOrderGoodsSn, // 渠道订单号
                            storageTime, // 入库时间
                            deliveryTime, // 出库时间
                            deliveryCommandTime, // 发送指令时间
                            lastWaybillNo, // 尾程运单号
                            abnormalDetailType,
                            abnormalType,

                            purchasePlanId,
                            platformSendOrderTime,
                            platformShippingTime, // 采购订单发货时间
                            platformOrderTime, // 拍单时间
                            payTime, // 支付时间
                            purchaseWaybillNo, // 首程运单号
                        };
                        if (index === 0) {
                            childOrderItem._rowspan = orderGoodsPurchasePlan.length;
                        }
                        orderList.push(childOrderItem);
                    });
                } else {
                    // 没有生成采购计划
                    orderList.push({
                        createTime, // 订单时间
                        confirmTime, // 订单确认时间
                        orderGoodsId, // 订单号
                        channelOrderGoodsSn, // 渠道订单号
                        storageTime, // 入库时间
                        deliveryTime, // 出库时间
                        deliveryCommandTime, // 发送指令时间
                        lastWaybillNo, // 尾程运单号
                        abnormalDetailType,
                        abnormalType,
                        _rowspan: 1,
                    });
                }
            });
            return orderList;
        }
    }, [dataSource]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const table = useMemo(() => {
        return (
            <FitTable
                rowKey={record => {
                    return record.purchasePlanId || record.orderGoodsId;
                }}
                columnsSettingRender={true}
                columns={columns}
                dataSource={dataSet}
                minHeight={500}
                bottom={150}
                loading={loading}
                scroll={scroll}
                pagination={pagination}
            />
        );
    }, [loading]);

    const similarModal = useMemo(() => {
        return <SimilarStyleModal visible={visible} onClose={onClose} />;
    }, [visible]);

    return useMemo(() => {
        return (
            <div>
                {formComponent}
                {table}
                {similarModal}
            </div>
        );
    }, [loading, visible]);
};

export default PaneErrTab;
