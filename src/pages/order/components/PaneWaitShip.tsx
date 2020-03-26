import React, { RefObject } from 'react';
import { Button } from 'antd';
import { FormInstance } from 'antd/es/form';

import SearchForm, { IFieldItem } from '@/components/SearchForm';

import TableWaitShip from './TableWaitShip';

import { getWaitShipList, IFilterParams } from '@/services/order-manage';

export declare interface IWaitShipItem {
    purchase_time: number;
    middleground_order_id: string;
    purchase_p_order_id: string;
    purchase_order_id: string;
    purchase_price: number;
    sale_order_status: number;
    purchase_order_status: number;
    purchase_pay_status: number;
    order_create_time: number;
    comment: string;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    showStatus: boolean;
    orderList: IWaitShipItem[];
}

const defaultFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['purchase_start_time', 'purchase_end_time'],
        label: '采购时间',
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
    },
];

const allFieldList: IFieldItem[] = [
    ...defaultFieldList,
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'purchase_p_order_id',
        label: '采购父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购父订单ID',
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
        name: 'channel_order_status',
        label: '渠道订单状态',
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
];

class PanePaid extends React.PureComponent<{}, IState> {
    private formRef: RefObject<FormInstance> = React.createRef();

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            showStatus: false,
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
        // if (this.orderFilterRef.current) {
        //     // console.log('onSearch', this.orderFilterRef.current.getValues());
        //     params = Object.assign(params, this.orderFilterRef.current.getValues());
        // }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true,
        });
        getWaitShipList(params)
            .then(res => {
                // console.log('getProductOrderList', res);
                const { total, list } = res.data;
                this.setState({
                    total,
                    // page: params.page,
                    // pageCount: params.page_count,
                    orderList: list,
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取查询数据
    getFieldsValue = () => {
        // console.log('111', this.formRef.current!.getFieldsValue());
    };

    changeShowStatus = () => {
        const { showStatus } = this.state;
        this.setState({
            showStatus: !showStatus,
        });
    };

    render() {
        const { showStatus, loading, orderList } = this.state;

        const initialValues = {
            channel: 100,
            channel_order_status: 100,
            purchase_order_status: 100,
        };

        const fieldList = showStatus ? allFieldList : defaultFieldList;

        return (
            <>
                <div>
                    <SearchForm
                        labelClassName="order-label"
                        fieldList={fieldList}
                        formRef={this.formRef}
                        initialValues={initialValues}
                    />
                    <div className="order-operation">
                        <Button
                            type="primary"
                            className="order-btn"
                            onClick={() => this.getFieldsValue()}
                        >
                            查询
                        </Button>
                        <Button type="primary" className="order-btn">
                            取消采购单
                        </Button>
                        <Button type="primary" className="order-btn">
                            取消渠道订单
                        </Button>
                        <Button type="primary" className="order-btn">
                            导出数据
                        </Button>
                        <Button
                            type="default"
                            className="order-btn"
                            onClick={this.changeShowStatus}
                        >
                            {showStatus ? '收起' : '展示'}搜索条件
                        </Button>
                    </div>
                    <TableWaitShip loading={loading} orderList={orderList} />
                </div>
            </>
        );
    }
}

export default PanePaid;
