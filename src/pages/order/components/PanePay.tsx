import React, { RefObject } from 'react';
import { Button, Pagination, message, notification } from 'antd';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import TablePay from './TablePay';
import LoadingButton from '@/components/LoadingButton';

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
        type: 'input',
        name: 'purchase_order_sn',
        label: '采购子订单ID',
        className: 'order-input',
        formItemClassName: 'form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'input',
        name: 'purchase_parent_order_sn',
        label: '采购父订单ID',
        className: 'order-input',
        formItemClassName: 'form-item',
        placeholder: '请输入采购父订单ID',
    },
    {
        type: 'select',
        name: 'purchase_platform',
        label: '采购渠道',
        className: 'order-input',
        formItemClassName: 'form-item',
        optionList: [defaultOptionItem, ...purchasePlatformOptionList],
    },
    {
        type: 'dateRanger',
        name: ['purchase_order_stime', 'purchase_order_etime'],
        label: '采购时间',
        className: 'order-date-picker',
        formItemClassName: 'form-item',
        formatter: ['start_date', 'end_date'],
    },
];

declare interface IProps {
    getAllTabCount(): void;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    orderList: IPayItem[];
}

class PanePay extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<SearchFormRef> = React.createRef();
    private currentSearchParams: IPayFilterParams | null = null;
    private initialValues = {
        purchase_platform: 100,
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

    // 取消采购订单
    private cancelPurchaseOrder = () => {
        const list = this.getOrderGoodsIdList();
        if (list.length) {
            return delPurchaseOrders({
                order_goods_ids: list,
            }).then(res => {
                this.onSearch();
                const { success, failed } = res.data;
                if (success!.length) {
                    this.batchOperateSuccess('取消采购单', success);
                }
                if (failed!.length) {
                    this.batchOperateFail('取消采购单', failed);
                }
            });
        } else {
            message.error('请选择需要取消的订单！');
            return Promise.resolve();
        }
    };

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

    postExportPay = () => {
        const params = this.currentSearchParams
            ? this.currentSearchParams
            : {
                  page: 1,
                  page_count: 50,
              };
        return postExportPay(params);
    };

    render() {
        const { loading, orderList, total, page, pageCount } = this.state;
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
                        <LoadingButton
                            type="primary"
                            className="order-btn"
                            onClick={this.cancelPurchaseOrder}
                        >
                            取消采购单
                        </LoadingButton>
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
                            onClick={this.postExportPay}
                        >
                            导出数据
                        </LoadingButton>
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
