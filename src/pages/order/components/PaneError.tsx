import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm, FitTable, LoadingButton } from 'react-components';
import { getErrorOrderList, postExportErrOrder } from '@/services/order-manage';
import {
    errorTypeOptionList,
    errorDetailOptionMap,
    ErrorDetailOptionCode,
    failureReasonList,
    failureReasonMap,
    failureReasonCode,
    defaultOptionItem1,
} from '@/enums/OrderEnum';
import { useList, useModal } from 'react-components';
import { ColumnProps, TableProps } from 'antd/es/table';
import { utcToLocal } from 'react-components/es/utils/date';
import { getStatusDesc } from '@/utils/transform';
import { Store } from 'rc-field-form/lib/interface';
import { FormInstance } from 'antd/es/form';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import SimilarStyleModal from '@/pages/order/components/similarStyle/SimilarStyleModal';
import { Button } from 'antd';
import Export from '@/components/Export';
import { queryGoodsSourceList } from '@/services/global';
import { PermissionComponent } from 'rc-permission';
import { useDispatch } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { filterFieldsList } from '@/pages/order/components/utils';

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
    productShop: string;
    productPlatform: string;

    purchasePlanId?: string;
    platformSendOrderTime?: string; // 采购订单生成时间
    platformShippingTime?: string; // 采购订单发货时间
    platformOrderTime?: string; // 拍单时间
    payTime?: string; // 支付时间
    purchaseWaybillNo?: string; // 首程运单号
    purchaseFailCode?: failureReasonCode;
    similarGoodsStatus?: number;
    _rowspan?: number;
}

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const configFields = ['order_goods_id', 'channel_source', 'product_shop', 'product_platform'];

const preFieldsList = filterFieldsList(configFields);

const afterFieldList = filterFieldsList(['order_create_time', 'confirm_time']);

const PaneErrTab = () => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);

    const { visible, setVisibleProps, onClose } = useModal<{
        order_goods_id: string;
        purchase_plan_id: string;
    }>();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'permission/queryMerchantList',
        });
    }, []);

    const { visible: exportModal, setVisibleProps: setExportModal } = useModal<boolean>();

    const fieldList: FormField[] = useMemo(() => {
        return [
            ...preFieldsList,
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
            ...afterFieldList,
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
                    children: utcToLocal(value, ''),
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
                    children: utcToLocal(value, ''),
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
            key: 'productShop',
            title: '销售店铺名称',
            dataIndex: 'productShop',
            align: 'center',
            width: 120,
            render: mergeCell,
        },
        {
            key: 'productPlatform',
            title: '采购渠道',
            dataIndex: 'productPlatform',
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
            width: 180,
            render: (value: ErrorDetailOptionCode, row: IErrorOrderItem) => {
                const reason =
                    failureReasonMap[(row.purchaseFailCode as unknown) as failureReasonCode];
                const reasonStr = reason ? `（${reason}）` : '';
                // 0代拍，1爬取中，2爬取成功，3爬取失败
                const status = Number(row.similarGoodsStatus);
                return {
                    children: (
                        <div>
                            {errorDetailOptionMap[value]}
                            <div>{reasonStr}</div>
                            {value === 12 ? (
                                <div>
                                    {status === 0 ? (
                                        <PermissionComponent
                                            pid="order/similar_pay"
                                            control="tooltip"
                                        >
                                            <Button
                                                type="link"
                                                onClick={() =>
                                                    setVisibleProps({
                                                        order_goods_id: row.orderGoodsId,
                                                        purchase_plan_id: row.purchasePlanId as string,
                                                    })
                                                }
                                            >
                                                相似款代拍
                                            </Button>
                                        </PermissionComponent>
                                    ) : status === 1 || status === 5 ? (
                                        <PermissionComponent
                                            pid="order/similar_pay"
                                            control="tooltip"
                                        >
                                            <Button
                                                type="link"
                                                onClick={() =>
                                                    setVisibleProps({
                                                        order_goods_id: row.orderGoodsId,
                                                        purchase_plan_id: row.purchasePlanId as string,
                                                    })
                                                }
                                            >
                                                代拍详情-爬取中
                                            </Button>
                                        </PermissionComponent>
                                    ) : status === 3 ? (
                                        <PermissionComponent
                                            pid="order/similar_pay"
                                            control="tooltip"
                                        >
                                            <Button
                                                type="link"
                                                danger={true}
                                                onClick={() =>
                                                    setVisibleProps({
                                                        order_goods_id: row.orderGoodsId,
                                                        purchase_plan_id: row.purchasePlanId as string,
                                                    })
                                                }
                                            >
                                                代拍详情-爬取失败
                                            </Button>
                                        </PermissionComponent>
                                    ) : null}
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
                    children: utcToLocal(value, ''),
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
                    children: utcToLocal(value, ''),
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
                    children: utcToLocal(value, ''),
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
            width: 180,
            render: (value: string) => {
                return utcToLocal(value, '');
            },
        },
        {
            key: 'platformSendOrderTime',
            title: '采购计划生成时间',
            dataIndex: 'platformSendOrderTime',
            align: 'center',
            width: 180,
            render: (value: string) => {
                return utcToLocal(value, '');
            },
        },
        {
            key: 'platformOrderTime',
            title: '拍单时间',
            dataIndex: 'platformOrderTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value, '');
            },
        },
        {
            key: 'payTime',
            title: '支付时间',
            dataIndex: 'payTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value, '');
            },
        },
        {
            key: 'signDeliveryTime',
            title: '标记发货时间',
            dataIndex: 'signDeliveryTime',
            align: 'center',
            width: 120,
            render: (value: string) => {
                return utcToLocal(value, '');
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
    } = useList({
        queryList: getErrorOrderList,
        formRef: [formRef, formRef1],
    });

    const onExport = useCallback((values: any) => {
        return postExportErrOrder({
            abnormal_type: 1,
            abnormal_detail_type: 2,
            ...queryRef.current,
            ...values,
        });
    }, []);

    const formComponent = useMemo(() => {
        return (
            <>
                <JsonForm
                    labelClassName="order-label"
                    fieldList={fieldList}
                    ref={formRef}
                    initialValues={{
                        product_shop: '',
                        channel_source: '',
                        product_platform: '',
                        abnormal_type: 1,
                    }}
                >
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button
                        disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={() => setExportModal(true)}
                    >
                        导出
                    </Button>
                </JsonForm>
                <JsonForm
                    ref={formRef1}
                    labelClassName="order-error-label"
                    layout="horizontal"
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
                        {
                            type: 'dynamic',
                            shouldUpdate: (prevValues: Store, nextValues: Store) => {
                                return (
                                    prevValues.abnormal_detail_type !==
                                    nextValues.abnormal_detail_type
                                );
                            },
                            dynamic: (form: FormInstance) => {
                                const abnormal_type = form.getFieldValue('abnormal_detail_type');
                                switch (abnormal_type) {
                                    case 12:
                                        return {
                                            type: 'checkboxGroup',
                                            name: 'purchase_fail_code',
                                            label: '失败原因',
                                            formatter: 'join',
                                            options: failureReasonList.map(({ id, name }) => {
                                                return {
                                                    label: name,
                                                    value: id,
                                                };
                                            }),
                                            onChange: () => {
                                                onSearch(); // 立即查询
                                            },
                                        };
                                    default:
                                        return {
                                            type: 'hide',
                                            name: 'none',
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
    }, [loading]);

    const dataSet = useMemo(() => {
        if (dataSource.length === 0) {
            return [];
        } else {
            const { abnormal_type: abnormalType } = formRef.current!.getFieldsValue();
            const { abnormal_detail_type: abnormalDetailType } = formRef1.current!.getFieldsValue();
            const orderList: IErrorOrderItem[] = [];
            dataSource.forEach((goodsItem: any) => {
                const { orderGoods, orderInfo } = goodsItem;
                let {
                    createTime,
                    orderGoodsId,
                    channelOrderGoodsSn,
                    storageTime,
                    deliveryTime,
                    deliveryCommandTime,
                    lastWaybillNo,
                    orderGoodsPurchasePlan,
                    productShop,
                    productPlatform,
                } = orderGoods;
                const { confirmTime } = orderInfo;
                if (orderGoodsPurchasePlan) {
                    // 拍单失败需要过滤purchaseOrderStatus === 7
                    if (Number(abnormalDetailType) === 12) {
                        orderGoodsPurchasePlan = orderGoodsPurchasePlan.filter(
                            (item: any) => item.purchaseOrderStatus === 7,
                        );
                    }
                    // 生成采购计划
                    orderGoodsPurchasePlan.forEach((purchaseItem: any, index: number) => {
                        const {
                            purchasePlanId,
                            platformShippingTime,
                            platformOrderTime,
                            payTime,
                            purchaseWaybillNo,
                            platformSendOrderTime,
                            purchaseFailCode,
                            similarGoodsStatus,
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
                            productShop,
                            productPlatform,

                            purchasePlanId,
                            platformSendOrderTime,
                            platformShippingTime, // 采购订单发货时间
                            platformOrderTime, // 拍单时间
                            payTime, // 支付时间
                            purchaseWaybillNo, // 首程运单号
                            purchaseFailCode,
                            similarGoodsStatus,
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
                        productShop,
                        productPlatform,
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
                bordered={true}
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
                onChange={onChange}
            />
        );
    }, [loading]);

    const exportModalComponent = useMemo(() => {
        return (
            <Export
                columns={columns}
                visible={exportModal}
                onOKey={onExport}
                onCancel={() => setExportModal(false)}
            />
        );
    }, [exportModal]);

    const similarModal = useMemo(() => {
        return <SimilarStyleModal visible={visible} onClose={onClose} onReload={onReload} />;
    }, [visible]);

    return useMemo(() => {
        return (
            <div>
                {formComponent}
                {table}
                {similarModal}
                {exportModalComponent}
            </div>
        );
    }, [loading, visible, exportModal]);
};

export default PaneErrTab;
