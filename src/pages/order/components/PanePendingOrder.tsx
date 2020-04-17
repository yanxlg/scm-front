import React, { RefObject } from 'react';
import { Button, Pagination, notification, message } from 'antd';
import { LoadingButton } from 'react-components';

import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';

import TablePendingOrder from './TablePendingOrder';

import {
    getPendingOrderList,
    IPendingFilterParams,
    postOrdersPlace,
    delChannelOrders,
    postExportPendingOrder,
} from '@/services/order-manage';
import {
    defaultOptionItem,
    channelOptionList,
    orderStatusOptionList,
    pageSizeOptions,
} from '@/enums/OrderEnum';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: '中台订单ID',
        className: 'order-input',
        placeholder: '请输入中台订单ID',
        formatter: 'number_str_arr',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        placeholder: '请输入中台商品ID',
        formatter: 'str_arr',
    },
    {
        type: 'input',
        name: 'sku_id',
        label: '中台SKU ID',
        className: 'order-input',
        placeholder: '请输入中台SKU ID',
        formatter: 'str_arr',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
    // {
    //     type: 'select',
    //     name: 'order_goods_status',
    //     label: '中台订单状态',
    //     className: 'order-input',
    //     optionList: [defaultOptionItem, ...orderStatusOptionList],
    // },
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单时间',
        className: 'order-pending-date-picker',
        placeholder: '请选择订单时间',
        formatter: ['start_date', 'end_date'],
    },
];

export declare interface IStyleData {
    [key: string]: string;
}

export declare interface ICatagoryData {
    id: string;
    name: string;
}

export declare interface IOrderItem {
    [key: string]: any;
}

declare interface IProps {
    getAllTabCount(): void;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    // selectedRowKeys: string[];
    orderList: IOrderItem[];
    visible: boolean;
}

class PanePendingOrder extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<JsonFormRef> = React.createRef();
    private currentSearchParams: IPendingFilterParams | null = null;
    private initialValues = {
        channel_source: 100,
        // order_goods_status: 100,
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            orderList: [],
            visible: false,
            // selectedRowKeys: []
        };
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IPendingFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IPendingFilterParams = {
            page,
            page_count: pageCount,
        };
        if (this.formRef.current) {
            params = Object.assign(params, this.formRef.current?.getFieldsValue());
        }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true,
        });
        getPendingOrderList(params)
            .then(res => {
                // console.log('getProductOrderList', res);
                // const { total, list } = res.data;
                this.currentSearchParams = params;
                const { all_count, list } = res.data;
                this.setState({
                    total: all_count,
                    page: params.page as number,
                    pageCount: params.page_count as number,
                    orderList: this.getOrderList(list),
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取子订单=>采购计划数据
    private getOrderList(list: any[]): IOrderItem[] {
        // console.log(1111, list);
        const childOrderList: IOrderItem[] = [];
        list.forEach((goodsItem: any) => {
            const { orderGoods, orderInfo } = goodsItem;
            const { orderGoodsPurchasePlan, ...orderRest } = orderGoods;
            const { currency, confirmTime, channelOrderSn, channelSource } = orderInfo;
            // console.log(111, orderGoodsPurchasePlan, orderGoods);
            if (orderGoodsPurchasePlan) {
                // 生成采购计划
                orderGoodsPurchasePlan.forEach((purchaseItem: any, index: number) => {
                    const {
                        createTime: purchaseCreateTime,
                        lastUpdateTime: purchaseLastUpdateTime,
                        ...purchaseRest
                    } = purchaseItem;
                    const childOrderItem: any = {
                        ...orderRest,
                        ...purchaseRest,
                        purchaseCreateTime,
                        purchaseLastUpdateTime,
                        currency,
                        confirmTime,
                        channelOrderSn,
                        channelSource,
                    };
                    if (index === 0) {
                        childOrderItem._rowspan = orderGoodsPurchasePlan.length;
                        childOrderItem._checked = false;
                    }
                    childOrderList.push(childOrderItem);
                });
            } else {
                // 没有生成采购计划
                childOrderList.push({
                    currency,
                    confirmTime,
                    channelOrderSn,
                    channelSource,
                    ...orderRest,
                    _rowspan: 1,
                    _checked: false,
                });
            }
        });
        // console.log(1111, childOrderList);
        return childOrderList;
    }

    // 全选
    onCheckAllChange = (status: boolean) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (item._rowspan) {
                    return {
                        ...item,
                        _checked: status,
                    };
                }
                return item;
            }),
        });
    };

    // 单选
    onSelectedRow = (row: IOrderItem) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (item._rowspan && row.orderGoodsId === item.orderGoodsId) {
                    // console.log(1111111);
                    return {
                        ...item,
                        _checked: !row._checked,
                    };
                }
                return item;
            }),
        });
    };

    private getOrderGoodsIdList = (): string[] => {
        const { orderList } = this.state;
        return orderList.filter(item => item._checked).map(item => item.orderGoodsId);
    };

    // 批量操作成功
    private batchOperateSuccess = (name: string = '', list: string[]) => {
        this.props.getAllTabCount();
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
    };

    // 批量操作失败
    private batchOperateFail = (
        name: string = '',
        list: { order_goods_id: string; result: string }[],
    ) => {
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
    };

    // 一键拍单
    private postOrdersPlace = () => {
        const orderGoodsIdList = this.getOrderGoodsIdList();
        if (orderGoodsIdList.length) {
            // console.log('orderGoodsIdList', orderGoodsIdList);
            return postOrdersPlace({
                order_goods_ids: orderGoodsIdList,
            }).then(res => {
                this.onSearch();
                const { success, failed } = res.data;
                if (success?.length) {
                    this.batchOperateSuccess('拍单', success);
                }
                if (failed?.length) {
                    this.batchOperateFail('拍单', failed);
                }
            });
        } else {
            message.error('请选择需要拍单的订单！');
            return Promise.resolve();
        }
    };

    // 取消渠道订单
    private delChannelOrders = () => {
        const list = this.getOrderGoodsIdList();
        if (list.length) {
            return delChannelOrders({
                order_goods_ids: list,
            }).then(res => {
                const { success, failed } = res.data;
                this.onSearch();
                if (success!.length) {
                    this.batchOperateSuccess('取消渠道订单', success);
                } else if (failed!.length) {
                    this.batchOperateFail('取消渠道订单', failed);
                }
            });
        } else {
            message.error('请选择需要取消的订单');
            return Promise.resolve();
        }
    };

    postExportPendingOrder = (values: any) => {
        return postExportPendingOrder({
            ...this.currentSearchParams,
            ...values,
        });
    };
    private onCancel = () => {
        this.setState({
            visible: false,
        });
    };
    private showExport = () => {
        this.setState({
            visible: true,
        });
    };
    render() {
        const { loading, orderList, total, page, pageCount, visible } = this.state;

        return (
            <>
                <div>
                    <JsonForm
                        labelClassName="order-pending-label"
                        fieldList={fieldList}
                        ref={this.formRef}
                        initialValues={this.initialValues}
                    />
                    <div className="order-operation">
                        <Button
                            type="primary"
                            className="order-btn"
                            loading={loading}
                            onClick={() => this.onSearch()}
                        >
                            查询
                        </Button>
                        <LoadingButton
                            type="primary"
                            className="order-btn"
                            onClick={() => this.postOrdersPlace()}
                        >
                            一键拍单
                        </LoadingButton>
                        <LoadingButton
                            type="primary"
                            className="order-btn"
                            onClick={() => this.delChannelOrders()}
                        >
                            取消渠道订单
                        </LoadingButton>
                        <Button type="primary" className="order-btn" onClick={this.showExport}>
                            导出数据
                        </Button>
                    </div>
                    <TablePendingOrder
                        loading={loading}
                        orderList={orderList}
                        onCheckAllChange={this.onCheckAllChange}
                        onSelectedRow={this.onSelectedRow}
                        visible={visible}
                        onCancel={this.onCancel}
                        onOKey={this.postExportPendingOrder}
                    />
                    <Pagination
                        className="order-pagination"
                        // size="small"
                        total={total}
                        current={page}
                        pageSize={pageCount}
                        showSizeChanger={true}
                        showQuickJumper={true}
                        pageSizeOptions={pageSizeOptions}
                        // onChange={this.onChangePage}
                        // onShowSizeChange={this.pageCountChange}
                        showTotal={total => `共${total}条`}
                    />
                </div>
            </>
        );
    }
}

export default PanePendingOrder;
