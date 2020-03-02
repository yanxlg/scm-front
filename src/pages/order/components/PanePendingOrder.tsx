import React, { RefObject } from 'react';
import { Button } from 'antd';
import { FormInstance } from 'antd/es/form';

import JsonForm, { IFieldItem } from '@/components/JsonForm';

import TablePendingOrder from './TablePendingOrder';

import { 
    getPendingOrderList,
    IFilterBaseParams,
    IFilterParams
} from '@/services/order-manage';

const baseFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        // formItemClassName: 'order-form-item',
        placeholder: '请选择订单时间',
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
        label: '中台sku id',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台sku id',
    },
    endFieldItem
];

export declare interface IStyleData {
    [key: string]: string;
}

export declare interface ICatagoryData {
    id: string;
    name: string;
}

export declare interface IPendingOrderItem {
    order_create_time: number;
    middleground_order_id: string;
    goods_img: string;
    style: IStyleData;
    goods_num: number;
    price: number;
    shipping_fee: number;
    sale_price: number;
    sale_order_status: number;
    purchase_order_status: number;
    commodity_id: string;
    second_catagory: ICatagoryData;
    sku_id: string;
    comment: string;
}

declare interface IState {
    page: number;
    pageNumber: number;
    total: number;
    loading: boolean;
    showStatus: boolean;
    selectedRowKeys: string[];
    orderList: IPendingOrderItem[];
}

class PanePendingOrder extends React.PureComponent<{}, IState> {

    private formRef: RefObject<FormInstance> = React.createRef();

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageNumber: 50,
            total: 0,
            loading: false,
            showStatus: false,
            orderList: [],
            selectedRowKeys: []
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
        getPendingOrderList(params).then(res => {
            // console.log('getProductOrderList', res);
            const { total, list } = res.data;
            this.setState({
                total,
                // page: params.page,
                // pageNumber: params.page_number,
                orderList: list
            })
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 获取查询数据
    getFieldsValue = () => {
        // console.log('111', this.formRef.current!.getFieldsValue());
    }

    changeShowStatus = () => {
        const { showStatus } = this.state;
        this.setState({
            showStatus: !showStatus
        });
    }

    changeSelectedKeys = (keys: string[]) => {
        this.setState({
            selectedRowKeys: keys
        });
    }

    render() {

        const {
            showStatus,
            loading,
            orderList,
            selectedRowKeys
        } = this.state;

        const initialValues = {
            channel: 100,
            sale_order_status: 100
        }

        const fieldList = showStatus ? allFieldList : defaultFieldList;

        return (
            <>
                <div>
                    <JsonForm
                        labelClassName="order-label"
                        fieldList={fieldList}
                        formRef={this.formRef}
                        initialValues={initialValues}
                    />
                    <div className="order-operation">
                        <Button type="primary" className="order-btn" onClick={() => this.getFieldsValue()}>查询</Button>
                        <Button type="primary" className="order-btn">一键拍单</Button>
                        <Button type="primary" className="order-btn">取消销售单</Button>
                        <Button type="primary" className="order-btn">导出数据</Button>
                        <Button 
                            type="default" 
                            className="order-btn"
                            onClick={this.changeShowStatus}
                        >{ showStatus ? '收起' : '展示'}搜索条件</Button>
                    </div>
                    <TablePendingOrder
                        loading={loading}
                        orderList={orderList}
                        selectedRowKeys={selectedRowKeys}
                        changeSelectedKeys={this.changeSelectedKeys}
                    />
                </div>
            </>
        );
    }
}

export default PanePendingOrder;
