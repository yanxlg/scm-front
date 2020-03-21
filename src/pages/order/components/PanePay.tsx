import React, { RefObject } from 'react';
import { Button, Pagination, message, notification } from 'antd';

import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import TablePay from './TablePay';

import {
    getPayOrderList,
    delChannelOrders,
    delPurchaseOrders,
    postExportPay,
    IPayFilterParams,
} from '@/services/order-manage';
import { defaultOptionItem, purchasePlatformOptionList, pageSizeOptions } from '@/enums/OrderEnum';
import { getCurrentPage } from '@/utils/common';

export declare interface IStyleData {
    [key: string]: string;
}

export declare interface ICatagoryData {
    id: string;
    name: string;
}

export declare interface IPayItem {
    purchase_pay_url: string;
    purchase_total_amount: string;
    purchase_parent_order_sn: string;
    purchase_order_time: string;
    parent_purchase_pay_status_desc: string;
    purchase_plan_id: string;
    purchase_order_sn: string;
    purchase_order_status: string;
    purchase_order_status_desc: string;
    purchase_pay_status: string;
    purchase_pay_status_desc: string;
    order_goods_id: string;
    _rowspan?: number;
    _checked?: boolean;
}

const defaultFieldList: FormField[] = [
    {
        type: 'dateRanger',
        name: ['purchase_order_stime', 'purchase_order_etime'],
        label: '采购时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'select',
        name: 'purchase_platform',
        label: '采购渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...purchasePlatformOptionList],
    },
    {
        type: 'input',
        name: 'purchase_order_sn',
        label: '采购子订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'input',
        name: 'purchase_parent_order_sn',
        label: '采购父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购父订单ID',
    },
];

// const allFieldList: IFieldItem[] = [];

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    exportLoading: boolean;
    showStatus: boolean;
    orderList: IPayItem[];
}

class PanePay extends React.PureComponent<{}, IState> {
    private formRef: RefObject<SearchFormRef> = React.createRef();
    private currentSearchParams: IPayFilterParams | null = null;
    private initialValues = {
        purchase_platform: 100,
    };

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            exportLoading: false,
            showStatus: false,
            orderList: [],
        };
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IPayFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IPayFilterParams = {
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
        getPayOrderList(params)
            .then(res => {
                this.currentSearchParams = params;
                // console.log('getProductOrderList', res);
                const { all_count = 0, list = [] } = res.data || {}; // default value
                // console.log('getPayOrderList', list);
                this.setState({
                    total: all_count,
                    page: params.page as number,
                    pageCount: params.page_count as number,
                    orderList: this.getOrderData(list),
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取待支付列表
    private getOrderData(list: any[]): IPayItem[] {
        const ret: IPayItem[] = [];
        list.forEach(item => {
            const {
                child_order,
                purchase_pay_status_desc: parent_purchase_pay_status_desc,
                ...parentRest
            } = item;
            child_order.forEach((childItem: any, index: number) => {
                const payItem = {
                    ...parentRest,
                    ...childItem,
                    parent_purchase_pay_status_desc,
                };
                if (index === 0) {
                    payItem._rowspan = child_order.length;
                    payItem._checked = false;
                }
                ret.push(payItem);
            });
        });
        return ret;
    }

    // 获取查询数据
    getFieldsValue = () => {
        return this.formRef.current!.getFieldsValue();
    };

    changeShowStatus = () => {
        const { showStatus } = this.state;
        this.setState({
            showStatus: !showStatus,
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
    onSelectedRow = (row: IPayItem) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (
                    item._rowspan &&
                    row.purchase_parent_order_sn === item.purchase_parent_order_sn
                ) {
                    return {
                        ...item,
                        _checked: !row._checked,
                    };
                }
                return item;
            }),
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

    private getOrderGoodsIdList = () => {
        const { orderList } = this.state;
        const parentOrdersSnList = orderList
            .filter(item => item._checked)
            .map(item => item.purchase_parent_order_sn);
        const list = orderList
            .filter(
                item =>
                    parentOrdersSnList.indexOf(item.purchase_parent_order_sn) > -1 &&
                    item.order_goods_id,
            )
            .map(item => item.order_goods_id);
        return [...new Set(list)];
    };

    // 取消采购订单
    private cancelPurchaseOrder = () => {
        const list = this.getOrderGoodsIdList();
        if (list.length) {
            delPurchaseOrders({
                order_goods_ids: list,
            }).then(res => {
                const { success, failed } = res.data;
                this.onSearch();
                if (success!.length) {
                    notification.success({
                        message: '取消采购单成功',
                        description: success.join('、'),
                    });
                } else if (failed!.length) {
                    notification.error({
                        message: '取消采购单失败',
                        description: (
                            <div>
                                {failed.map((item: any) => (
                                    <div>
                                        {item.order_goods_id}: {item.result}
                                    </div>
                                ))}
                            </div>
                        ),
                    });
                }
            });
        } else {
            message.error('请选择需要取消的订单！');
        }
    };

    private delChannelOrders = () => {
        const list = this.getOrderGoodsIdList();
        if (list.length) {
            delChannelOrders({
                order_goods_ids: list,
            }).then(res => {
                const { success, failed } = res.data;
                this.onSearch();
                if (success!.length) {
                    notification.success({
                        message: '取消渠道订单成功',
                        description: success.join('、'),
                    });
                } else if (failed!.length) {
                    notification.error({
                        message: '取消渠道订单失败',
                        description: (
                            <div>
                                {failed.map((item: any) => (
                                    <div key={item.order_goods_id}>
                                        {item.order_goods_id}: {item.result}
                                    </div>
                                ))}
                            </div>
                        ),
                    });
                }
            });
        } else {
            message.error('请选择需要取消的订单');
        }
    };

    postExportPay = () => {
        const params = this.currentSearchParams
            ? this.currentSearchParams
            : {
                  page: 1,
                  page_count: 50,
              };
        this.setState({
            exportLoading: true,
        });
        postExportPay(params).finally(() => {
            this.setState({
                exportLoading: false,
            });
        });
    };

    render() {
        const {
            showStatus,
            loading,
            exportLoading,
            orderList,
            total,
            page,
            pageCount,
        } = this.state;

        // const fieldList = showStatus ? allFieldList : defaultFieldList;

        return (
            <>
                <div>
                    <SearchForm
                        labelClassName="order-label"
                        fieldList={defaultFieldList}
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
                            type="primary"
                            className="order-btn"
                            onClick={this.cancelPurchaseOrder}
                        >
                            取消采购单
                        </Button>
                        <Button
                            type="primary"
                            className="order-btn"
                            onClick={this.delChannelOrders}
                        >
                            取消渠道订单
                        </Button>
                        <Button
                            type="primary"
                            className="order-btn"
                            loading={exportLoading}
                            onClick={this.postExportPay}
                        >
                            导出数据
                        </Button>
                        {/* <Button
                            type="default"
                            className="order-btn"
                            onClick={this.changeShowStatus}
                        >{ showStatus ? '收起' : '展示'}搜索条件</Button> */}
                    </div>
                    <TablePay
                        loading={loading}
                        orderList={orderList}
                        onCheckAllChange={this.onCheckAllChange}
                        onSelectedRow={this.onSelectedRow}
                        onSearch={this.onSearch}
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

export default PanePay;
