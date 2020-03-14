import React, { RefObject } from 'react';
import { Button, Radio, Pagination } from 'antd';
// import { FormInstance } from 'antd/es/form';
import { RadioChangeEvent } from 'antd/lib/radio/interface';

import SearchForm, { IFieldItem } from '@/components/SearchForm';
import TableError from './TableError';

import { getErrorOrderList, postExportErrOrder, IErrFilterParams } from '@/services/order-manage';
import {
    pageSizeOptions,
    defaultOptionItem,
    channelOptionList,
    errorTypeOptionList,
    errorDetailOptionList,
} from '@/enums/OrderEnum';
import { getCurrentPage } from '@/utils/common';

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
    platformShippingTime?: string; // 采购订单发货时间
    platformOrderTime?: string; // 拍单时间
    payTime?: string; // 支付时间
    purchaseWaybillNo?: string; // 首程运单号
    _rowspan?: number;
}

const fieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['confirm_time_start', 'confirm_time_end'],
        label: '订单确认时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
    {
        type: 'input',
        name: 'order_goods_id',
        label: '订单号',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入订单号',
    },
    {
        type: 'select',
        name: 'abnormal_type',
        label: '异常类型',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: errorTypeOptionList,
    },
];

declare interface IState {
    loading: boolean;
    exportLoading: boolean;
    page: number;
    pageCount: number;
    total: number;
    abnormalDetailType: number;
    orderList: IErrorOrderItem[];
}

class PaneErr extends React.PureComponent<{}, IState> {
    private formRef: RefObject<SearchForm> = React.createRef();
    private currentSearchParams: IErrFilterParams | null = null;
    private initialValues = {
        channel_source: 100,
        abnormal_type: 1,
    };
    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            exportLoading: false,
            abnormalDetailType: 2,
            orderList: [],
        };
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IErrFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IErrFilterParams = {
            page,
            page_count: pageCount,
            ...this.getFieldsValue(),
        };
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        this.setState({
            loading: true,
        });
        getErrorOrderList(params)
            .then(res => {
                // console.log('getProductOrderList', res);
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
    private getOrderList(list: any[]): IErrorOrderItem[] {
        const { abnormalDetailType } = this.state;
        const { abnormal_type: abnormalType } = this.formRef.current!.getFieldsValue();
        const orderList: IErrorOrderItem[] = [];
        // abnormal_type
        list.forEach((goodsItem: any) => {
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
            // console.log(111, orderGoodsPurchasePlan, orderGoods);
            if (orderGoodsPurchasePlan) {
                // 生成采购计划
                orderGoodsPurchasePlan.forEach((purchaseItem: any, index: number) => {
                    const {
                        purchasePlanId,
                        platformShippingTime,
                        // platformOrderTime,
                        platformOrderTime,
                        payTime,
                        purchaseWaybillNo,
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
                        platformShippingTime, // 采购订单发货时间
                        platformOrderTime, // 拍单时间
                        payTime, // 支付时间
                        purchaseWaybillNo, // 首程运单号
                    };
                    if (index === 0) {
                        childOrderItem._rowspan = orderGoodsPurchasePlan.length;
                        // childOrderItem._checked = false;
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
        // console.log(1111, childOrderList);
        return orderList;
    }

    // 获取查询数据
    getFieldsValue = () => {
        const { abnormalDetailType } = this.state;
        return {
            abnormal_detail_type: abnormalDetailType,
            ...this.formRef.current!.getFieldsValue(),
        };
    };

    // 选择异常详情
    onCheckErrDetail = (e: RadioChangeEvent) => {
        // console.log(e.target.value);
        const val = e.target.value;
        this.setState({
            abnormalDetailType: val,
        });
        this.onSearch({
            abnormal_detail_type: val,
        });
    };

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

    // 导出excel
    private postExportErrOrder = () => {
        const params = this.currentSearchParams
            ? this.currentSearchParams
            : {
                  page: 1,
                  page_count: 50,
                  abnormal_type: 1,
                  abnormal_detail_type: 2,
              };
        this.setState({
            exportLoading: true,
        });
        postExportErrOrder(params).finally(() => {
            this.setState({
                exportLoading: false,
            });
        });
    };

    render() {
        const {
            loading,
            exportLoading,
            orderList,
            total,
            page,
            pageCount,
            abnormalDetailType,
        } = this.state;

        return (
            <>
                <div>
                    <SearchForm
                        labelClassName="order-label"
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
                        <Button
                            className="order-btn"
                            loading={exportLoading}
                            onClick={this.postExportErrOrder}
                        >
                            导出数据
                        </Button>
                    </div>
                    <div className="order-err-detail">
                        <strong>异常详情:</strong>
                        <div className="wrap">
                            <Radio.Group
                                className="radio-group"
                                value={abnormalDetailType}
                                onChange={this.onCheckErrDetail}
                            >
                                {errorDetailOptionList.map(item => (
                                    <Radio
                                        className="checkbox-item"
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.name}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </div>
                    </div>
                    <TableError loading={loading} orderList={orderList} />
                    <Pagination
                        className="order-pagination"
                        // size="small"
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

export default PaneErr;
