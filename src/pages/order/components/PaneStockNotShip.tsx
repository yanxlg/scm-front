import React, { RefObject } from 'react';
import { Button } from 'antd';
import { FormInstance } from 'antd/lib/form';

import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import OptionalColumn from './OptionalColumn';
import TableStockNotShip from './TableStockNotShip';

import { getPurchasedNotStockList, IFilterParams } from '@/services/order-manage';
import {
    defaultOptionItem,
    channelOptionList,
    pageSizeOptions,
} from '@/enums/OrderEnum';

export declare interface IOrderItem {
    order_create_time: number;
    middleground_order_id: string;
    commodity_id: string;
    purchase_shipping_no: string;
    purchase_order_status: number;
    purchase_shipping_status: number;
    warehousing_time: number;
    deliver_start_time: number;
}

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: '中台订单子ID',
        className: 'order-input',
        formItemClassName: 'form-item',
        placeholder: '请输入中台订单子ID',
        formatter: 'numberStrArr',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        formItemClassName: 'form-item',
        placeholder: '请输入中台商品ID',
        formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'purchase_waybill_no',
        label: '采购运单号',
        className: 'order-input',
        formItemClassName: 'form-item',
        placeholder: '请输入采购运单号',
        formatter: 'strArr',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'form-item',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
    {
        type: 'dateRanger',
        name: ['storage_time_start', 'storage_time_end'],
        label: '入库时间',
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
    showColStatus: boolean;
    orderList: IOrderItem[];
    selectedColKeyList: string[];
}

class PaneStockNotShip extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<SearchFormRef> = React.createRef();

    private initialValues = {
        channel: 100,
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            showColStatus: false,
            orderList: [],
            selectedColKeyList: [],
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
        getPurchasedNotStockList(params)
            .then(res => {
                // console.log('getProductOrderList', res);
                const { total, list } = res.data;
                this.setState({
                    total,
                    page: params.page as number,
                    pageCount: params.page_count as number,
                    orderList: list,
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    changeShowColStatus = () => {
        const { showColStatus } = this.state;
        this.setState({
            showColStatus: !showColStatus,
        });
    };

    changeSelectedColList = (list: string[]) => {
        this.setState({
            selectedColKeyList: list,
        });
    };

    render() {
        const {
            loading,
            showColStatus,
            orderList,
            selectedColKeyList,
        } = this.state;

        return (
            <>
                <div>
                    <SearchForm
                        fieldList={fieldList}
                        labelClassName="order-label"
                        ref={this.formRef}
                        initialValues={this.initialValues}
                    />
                    <div className="order-operation">
                        <Button type="primary" className="order-btn">
                            查询
                        </Button>
                        <Button type="primary" className="order-btn">
                            取消渠道订单
                        </Button>
                        <Button type="primary" className="order-btn">
                            导出数据
                        </Button>
                        <Button className="order-btn" onClick={this.changeShowColStatus}>
                            {showColStatus ? '收起' : '展示'}字段设置
                        </Button>
                    </div>
                    {/* <TableStockNotShip loading={loading} orderList={orderList} /> */}
                </div>
            </>
        );
    }
}

export default PaneStockNotShip;
