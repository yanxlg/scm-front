import React, { RefObject } from 'react';
import { Button } from 'antd';
import { FormInstance } from 'antd/lib/form';

import JsonForm, { IFieldItem } from '@/components/JsonForm';
import OptionalColumn from './OptionalColumn';
import TableAll from './TableAll';

// import { IOrderItem } from '../index';
import { 
    getProductOrderList,
    IFilterBaseParams,
    IFilterParams
} from '@/services/order-manage';

declare interface IGoodsItem {

}

declare interface IBaseOrderItem {
    order_confirm_time: number;           // 订单确认时间
    channel_order_id: string;             // 渠道订单ID
    channel_goods_price: number;          // 价格
    channel_shipping_fee: number;         // 运费
    goods_number: number;                 // 商品数量
    cancel_order_time: number;            // 取消订单时间
    middleground_order_status: number;    // 中台订单状态
    purchase_payment_status: number;      // 采购支付状态
    purchase_order_time: number;          // 采购生成时间
    purchase_shipping_no: string;         // 采购运单号
    channel: number;                      // 销售渠道
    middleground_p_order_id: string;      // 中台父订单ID
    currency_type: string;                // 货币类型
    remain_delivery_time: string;         // 发货剩余时间
    channel_store_name: string;           // 渠道店铺名
    purchase_delivery_status: number;     // 采购配送状态
    purchase_cancel_reason: number;       // 采购取消原因
    goods_amount: number;                 // 商品总金额
    channel_order_status: number;         // 渠道订单状态
    purchase_order_status: number;        // 采购订单状态
    purchase_order_no: string;            // 采购订单号
    p_order_id: string;                   // 父订单ID
    child_order_id: string;               // 子订单ID
    middleground_c_order_id: string;      // 中台子订单ID 
}

export declare interface IOrderItem extends IBaseOrderItem, IGoodsItem {

}

declare interface IPaneAllState {
    page: number;
    pageNumber: number;
    total: number;
    loading: boolean;
    showStatus: boolean;
    orderList: IOrderItem[]
}

const baseFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'middleground_order_id',
        label: '中台订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'input',
        name: 'sale_order_id',
        label: '销售订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入销售订单ID',
    },
    {
        type: 'input',
        name: 'purchase_order_id',
        label: '采购订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购订单ID',
    },
    {
        type: 'select',
        name: 'channel',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            {
                name: '全部',
                value: 100,
            },
        ],
    }
]

const endFieldItem: IFieldItem = {
    type: 'checkbox',
    name: 'only_p_order',
    label: '仅展示父订单ID',
}

const defaultFieldList: IFieldItem[] = [
    ...baseFieldList,
    endFieldItem
];

const allFieldList: IFieldItem[] = [
    ...baseFieldList,
    {
        type: 'dateRanger',
        name: ['purchase_start_time', 'purchase_end_time'],
        label: '采购时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'middleground_p_order_id',
        label: '中台父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台父订单ID',
    },
    {
        type: 'input',
        name: 'purchase_shipping_no',
        label: '采购运单号',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购运单号',
    },
    {
        type: 'input',
        name: 'last_waybill_no',
        label: '尾程运单号',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入尾程运单号',
    },
    {
        type: 'input',
        name: 'commodity_id',
        label: '中台商品ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台商品ID',
    },
    {
        type: 'input',
        name: 'sku_id',
        label: '中台SKU ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台SKU ID',
    },
    {
        type: 'select',
        name: 'sale_order_status',
        label: '销售订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            {
                name: '全部',
                value: 100,
            },
        ],
    },
    {
        type: 'select',
        name: 'purchase_order_status',
        label: '采购订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            {
                name: '全部',
                value: 100,
            },
        ],
    },
    {
        type: 'select',
        name: 'purchase_pay_status',
        label: '采购支付状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            {
                name: '全部',
                value: 100,
            },
        ],
    },
    {
        type: 'select',
        name: 'purchase_shipping_status',
        label: '采购配送状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            {
                name: '全部',
                value: 100,
            },
        ],
    },
    {
        type: 'select',
        name: 'purchase_cancel_res',
        label: '采购取消原因',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            {
                name: '全部',
                value: 100,
            },
        ],
    },
    endFieldItem
];

class PaneAll extends React.PureComponent<{}, IPaneAllState> {

    private formRef: RefObject<FormInstance> = React.createRef();

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageNumber: 50,
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

    onSearch = (baseParams?: IFilterBaseParams) => {
        const { page, pageNumber } = this.state;
        let params: IFilterParams = {
            page,
            page_number: pageNumber
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
        getProductOrderList(params).then(res => {
            // console.log('getProductOrderList', res);
            const { total, list } = res.data;
            this.setState({
                total,
                page: params.page,
                pageNumber: params.page_number,
                orderList: list
            })
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    changeShowStatus = () => {
        const { showStatus } = this.state;
        this.setState({
            showStatus: !showStatus
        });
    }

    render() {

        const { 
            showStatus,
            loading,
            orderList
        } = this.state;

        const fieldList = showStatus ? allFieldList : defaultFieldList;

        const initialValues = {
            channel: 100,
            sale_order_status: 100,
            purchase_order_status: 100,
            purchase_pay_status: 100,
            purchase_shipping_status: 100,
            purchase_cancel_res: 100
        }

        return (
            <>
                <div>
                    <JsonForm
                        fieldList={fieldList}
                        labelClassName="order-label"
                        formRef={this.formRef}
                        initialValues={initialValues}
                    />
                    <div className="order-operation">
                        <Button type="primary" className="order-btn">查询</Button>
                        <Button type="primary" className="order-btn">一键拍单</Button>
                        <Button type="primary" className="order-btn">取消采购单</Button>
                        <Button type="primary" className="order-btn">取消渠道订单</Button>
                        <Button type="primary" className="order-btn">导出数据</Button>
                        <Button 
                            type="default" 
                            className="order-btn"
                            onClick={this.changeShowStatus}
                        >{ showStatus ? '收起' : '展示'}搜索条件</Button>
                        <Button type="default" className="order-btn">展示字段设置</Button>
                    </div>
                    <OptionalColumn />
                    <TableAll
                        loading={loading}
                        orderList={orderList}
                    />
                </div>
            </>
        );
    }
}

export default PaneAll;
