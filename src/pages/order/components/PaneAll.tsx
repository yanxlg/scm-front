import React from 'react';
import { Button } from 'antd';

import JsonForm, { IFieldItem } from '@/components/JsonForm';
import OptionalColumn from './OptionalColumn';
import OrderTableAll from './OrderTableAll'

import { IOrderItem } from '../index';
import { 
    getProductOrderList,
    IFilterBaseParams,
    IFilterParams
} from '@/services/order-manage';

declare interface IPaneAllState {
    page: number;
    pageNumber: number;
    total: number;
    loading: boolean;
    fieldList: IFieldItem[];
    orderList: IOrderItem[]
}

class PaneAll extends React.PureComponent<{}, IPaneAllState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageNumber: 50,
            total: 0,
            loading: false,
            orderList: [],
            fieldList: [
                {
                    type: 'datePicker',
                    name: 'order_time',
                    label: '订单时间',
                    placeholder: '请选择订单时间',
                },
                {
                    type: 'input',
                    name: 'middleground_order_id',
                    label: '中台订单ID',
                    placeholder: '请输入中台订单ID',
                },
                {
                    type: 'input',
                    name: 'x1_id',
                    label: '销售订单ID',
                    placeholder: '请输入销售订单ID',
                },
                {
                    type: 'input',
                    name: 'x2_id',
                    label: '采购订单ID',
                    placeholder: '请输入采购订单ID',
                },
                {
                    type: 'select',
                    name: 'x3_status',
                    label: '销售订单状态',
                    optionList: [
                        {
                            name: '全部',
                            value: '',
                        },
                    ],
                },
                // {
                //     type: 'checkbox',
                //     name: 'is_parent',
                //     labelText: '仅展示父订单ID',
                // }
            ]
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

    render() {

        const { 
            fieldList,
            loading,
            orderList
        } = this.state;

        return (
            <>
                <div>
                    <JsonForm
                        fieldList={fieldList}
                        labelClassName="order-label"
                    />
                    <div className="order-operation">
                        <Button type="primary" className="order-btn">查询</Button>
                        <Button type="primary" className="order-btn">一键拍单</Button>
                        <Button type="primary" className="order-btn">取消采购单</Button>
                        <Button type="primary" className="order-btn">取消渠道订单</Button>
                        <Button type="primary" className="order-btn">导出数据</Button>
                        <Button type="default" className="order-btn">展示搜索条件</Button>
                        <Button type="default" className="order-btn">展示字段设置</Button>
                    </div>
                    <OptionalColumn />
                    <OrderTableAll
                        loading={loading}
                        orderList={orderList}
                    />
                </div>
            </>
        );
    }
}

export default PaneAll;
