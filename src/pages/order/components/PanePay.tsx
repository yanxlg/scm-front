import React, { RefObject } from 'react';
import { Button, Pagination } from 'antd';
import { FormInstance } from 'antd/es/form';

import JsonForm, { IFieldItem } from '@/components/JsonForm';
import TablePay from './TablePay';

import { 
    getPayOrderList,
    IFilterParams
} from '@/services/order-manage';
import { 
    defaultOptionItem, 
    channelOptionList, 
    purchaseOrderOptionList,
    pageSizeOptions
} from '@/enums/OrderEnum';
import { transStartDate, transEndDate, utcToLocal } from '@/utils/date';

export declare interface IStyleData {
    [key: string]: string;
}

export declare interface ICatagoryData {
    id: string;
    name: string;
}

export declare interface IPayItem {
    [key: string]: any;
    // purchase_time: number;
    // middleground_order_id: string;
    // pay_url: string;
    // purchase_p_order_id: string;
    // purchase_order_id: string;
    // purchase_price: number;
    // sale_order_status: number;
    // purchase_order_status: number;
    // purchase_pay_status: number;
    // order_create_time: number;
    // comment: string;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    showStatus: boolean;
    orderList: IPayItem[]
}

const defaultFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['purchase_order_stime', 'purchase_order_etime'],
        label: '采购时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'select',
        name: 'purchase_platform',
        label: '采购渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            // ...channelOptionList
        ],
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

class PanePaid extends React.PureComponent<{}, IState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    private initialValues = {
        purchase_platform: 100
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 30,
            total: 0,
            loading: false,
            showStatus: false,
            orderList: []
        }
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IFilterParams = {
            page,
            page_count: pageCount
        }
        // if (this.orderFilterRef.current) {
        //     // console.log('onSearch', this.orderFilterRef.current.getValues());
        //     params = Object.assign(params, this.orderFilterRef.current.getValues());
        // }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true
        })
        getPayOrderList(params).then(res => {
            // console.log('getProductOrderList', res);
            const { all_count, list } = res.data;
            const mockList = [
                {
                    a1: '采购订单生成时间',
                    a2: '采购父订单号',
                    a3: '//image-tb.vova.com/image/262_262/crop/89/77/f84c8de4ad38f03a4a6a3079a2e48977.jpg',
                    a4: '采购支付状态',
                    a5: '采购价',
                    x: [
                        {
                            a6: '采购子订单号1',
                            a7: '采购订单状态',
                            a8: '计划子项ID',
                            a9: '中台子订单ID',
                            a10: '订单时间',
                        },
                        {
                            a6: '采购子订单号2',
                            a7: '采购订单状态',
                            a8: '计划子项ID',
                            a9: '中台子订单ID',
                            a10: '订单时间',
                        }
                    ],
                    a11: '备注'
                }
            ]
            this.setState({
                total: all_count,
                page: params.page as number,
                pageCount: params.page_count as number,
                orderList: this.getOrderData(mockList)
            })
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 获取待支付列表
    private getOrderData(list: any[]): IPayItem[] {
        const ret: IPayItem[] = [];
        list.forEach(item => {
            const {
                x,
                ...rest
            } = item;
            x.forEach((childItem: any, index: number) => {
                const payItem = {
                    ...rest,
                    ...childItem
                }
                if (index === 0) {
                    payItem._rowspan = x.length;
                    payItem._checked = false;
                }
                ret.push(payItem);
            })
        })
        return ret;
    }

    // 获取查询数据
    getFieldsValue = () => {
        // console.log('111', this.formRef.current!.getFieldsValue());
        const fields = this.formRef.current!.getFieldsValue();
        const {
            purchase_start_time,
            purchase_end_time,
            order_start_time,
            order_end_time,
            // middleground_order_id,
            // purchase_order_id,
            // purchase_p_order_id
        } = fields
        return Object.assign(fields, {
            purchase_start_time: purchase_start_time ? transStartDate(purchase_start_time) : purchase_start_time,
            purchase_end_time: purchase_end_time ? transEndDate(purchase_end_time) : purchase_end_time,
            order_start_time: order_start_time ? transStartDate(order_start_time) : order_start_time,
            order_end_time: order_end_time ? transEndDate(order_end_time) : order_end_time,
        });
    }

    changeShowStatus = () => {
        const { showStatus } = this.state;
        this.setState({
            showStatus: !showStatus
        });
    }

    // 全选
    onCheckAllChange = (status: boolean) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (item._rowspan) {
                    return {
                        ...item,
                        _checked: status
                    }
                }
                return item;
            })
        });
    }

    // 单选
    onSelectedRow = (row: IPayItem) => {
        const { orderList } = this.state;
        this.setState({
            orderList: orderList.map(item => {
                if (row._rowspan && row.a2 === item.a2) {
                    return {
                        ...item,
                        _checked: !row._checked
                    }
                }
                return item;
            })
        });
    }

    render() {

        const {
            showStatus,
            loading,
            orderList,
            total,
            page,
            pageCount
        } = this.state;

        // const fieldList = showStatus ? allFieldList : defaultFieldList;

        return (
            <>
                <div>
                    <JsonForm
                        labelClassName="order-label"
                        fieldList={defaultFieldList}
                        formRef={this.formRef}
                        initialValues={this.initialValues}
                    />
                    <div className="order-operation">
                        <Button type="primary" className="order-btn" onClick={() => this.getFieldsValue()}>查询</Button>
                        <Button type="primary" className="order-btn">取消采购单</Button>
                        <Button type="primary" className="order-btn">取消渠道订单</Button>
                        <Button type="primary" className="order-btn">导出数据</Button>
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
                        showTotal={(total) => `共${total}条`}
                    />
                </div>
            </>
        );
    }
}

export default PanePaid;
