import React, { RefObject } from 'react';
import { Button, Pagination, notification, message } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import TableStockNotShip from './TableStockNotShip';
import { LoadingButton } from 'react-components';

import {
    getStockNotShipList,
    IFilterParams,
    delChannelOrders,
    postExportStockNotShip,
} from '@/services/order-manage';
import { defaultOptionItem, channelOptionList, pageSizeOptions } from '@/enums/OrderEnum';
import { getCurrentPage } from '@/utils/common';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: '中台订单子ID',
        className: 'order-input',
        placeholder: '请输入中台订单子ID',
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
        name: 'purchase_waybill_no',
        label: '采购运单号',
        className: 'order-input',
        placeholder: '请输入采购运单号',
        formatter: 'str_arr',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
    {
        type: 'dateRanger',
        name: ['storage_time_start', 'storage_time_end'],
        label: '入库时间',
        className: 'order-date-picker',
        formatter: ['start_date', 'end_date'],
    },
];

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
    orderList: IOrderItem[];
}

class PaneStockNotShip extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<JsonFormRef> = React.createRef();
    private currentSearchParams: IFilterParams | null = null;
    private initialValues = {
        channel_source: 100,
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            orderList: [],
        };
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IFilterParams = {
            page,
            page_count: pageCount,
        };
        if (this.formRef.current) {
            params = Object.assign(params, this.formRef.current.getFieldsValue());
        }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true,
        });
        getStockNotShipList(params)
            .then(res => {
                this.currentSearchParams = params;
                // console.log('getProductOrderList', res);
                const { all_count: total, list } = res.data;
                const { page, page_count } = params;
                if (list) {
                    this.setState({
                        total,
                        page: page as number,
                        pageCount: page_count as number,
                        orderList: this.getChildOrderData(list),
                    });
                }
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取子订单=>采购计划数据
    private getChildOrderData(list: any[]): IOrderItem[] {
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

    private onChangePage = (page: number) => {
        this.onSearch({
            page,
        });
    };

    private pageCountChange = (current: number, size: number) => {
        const { page, pageCount } = this.state;
        this.onSearch({
            page: getCurrentPage(size, (page - 1) * pageCount + 1),
            page_count: size,
        });
    };

    private handleClickSearch = () => {
        this.onSearch({
            page: 1,
        });
    };

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
                    return {
                        ...item,
                        _checked: !row._checked,
                    };
                }
                return item;
            }),
        });
    };

    // 获取勾选的orderGoodsId
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

    // 取消渠道订单
    private delChannelOrders = () => {
        const list = this.getOrderGoodsIdList();
        if (list.length) {
            return delChannelOrders({
                order_goods_ids: list,
            }).then(res => {
                this.onSearch();
                const { success, failed } = res.data;

                if (success!.length) {
                    this.batchOperateSuccess('取消渠道订单', success);
                }
                if (failed!.length) {
                    this.batchOperateFail('取消渠道订单', failed);
                }
            });
        } else {
            message.error('请选择需要取消的订单');
            return Promise.resolve();
        }
    };

    private postExportStockNotShip = () => {
        const params = this.currentSearchParams
            ? this.currentSearchParams
            : {
                  page: 1,
                  page_count: 50,
              };
        return postExportStockNotShip(params);
    };

    render() {
        const { loading, total, page, pageCount, orderList } = this.state;

        return (
            <>
                <div>
                    <JsonForm
                        fieldList={fieldList}
                        labelClassName="order-label"
                        ref={this.formRef}
                        initialValues={this.initialValues}
                    />
                    <div className="order-operation">
                        <Button
                            type="primary"
                            className="order-btn"
                            loading={loading}
                            onClick={this.handleClickSearch}
                        >
                            查询
                        </Button>
                        <LoadingButton
                            type="primary"
                            className="order-btn"
                            onClick={this.delChannelOrders}
                        >
                            取消渠道订单
                        </LoadingButton>
                        <LoadingButton
                            type="primary"
                            className="order-btn"
                            onClick={this.postExportStockNotShip}
                        >
                            导出数据
                        </LoadingButton>
                    </div>
                    <TableStockNotShip
                        loading={loading}
                        orderList={orderList}
                        onCheckAllChange={this.onCheckAllChange}
                        onSelectedRow={this.onSelectedRow}
                    />
                    <Pagination
                        className="order-pagination"
                        total={total}
                        current={page}
                        pageSize={pageCount}
                        showSizeChanger={true}
                        showQuickJumper={true}
                        pageSizeOptions={pageSizeOptions}
                        onChange={this.onChangePage}
                        onShowSizeChange={this.pageCountChange}
                        showTotal={total => `共${total}条`}
                    />
                </div>
            </>
        );
    }
}

export default PaneStockNotShip;
