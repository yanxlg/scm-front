import React, { RefObject } from 'react';
import { Button } from 'antd';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import OptionalColumn from './OptionalColumn';
import TableNotStock from './TableNotStock';

import { getPurchasedNotStockList, IFilterParams } from '@/services/order-manage';
import {
    defaultOptionItem,
    orderStatusOptionList,
    purchaseOrderOptionList,
    pageSizeOptions,
} from '@/enums/OrderEnum';

export declare interface IOrderItem {
    orderGoodsId: string;                // 中台订单ID
    orderCreateTime: string;             // 订单时间
    purchasePlanId: string;              // 计划子项ID
    productId: string;                   // 中台商品ID
    purchasePlatform: string;            // 采购平台
    purchaseNumber: number;              // 采购数量
    // 采购单号
    // 采购订单号
    // 采购运单号
    // 采购生成时间
    // 采购支付时间
    purchaseOrderStatus: number;         // 采购订单状态
    purchaseOrderShippingStatus: number; // 采购配送状态
    purchaseOrderPayStatus: number;      // 采购支付状态
    confirmTime: string;                 // 订单确认时间
    channelOrderSn: string;              // 渠道订单ID
}

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: <span>中&nbsp;台&nbsp;订&nbsp;单&nbsp;ID</span>,
        className: 'order-input',
        formItemClassName: 'form-item',
        placeholder: '请输入中台订单ID',
        // numberStrArr
        // formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'purchase_platform_order_id_list',
        label: '采购平台订单ID',
        className: 'order-input',
        formItemClassName: 'form-item',
        placeholder: '请输入中台商品ID',
        formatter: 'strArr',
    },
    {
        type: 'select',
        name: 'order_goods_status',
        label: '中台订单状态',
        className: 'order-input',
        formItemClassName: 'form-item',
        optionList: [defaultOptionItem, ...orderStatusOptionList],
    },
    {
        type: 'select',
        name: 'purchase_order_status',
        label: '采购订单状态',
        className: 'order-input',
        formItemClassName: 'form-item',
        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
    },
    {
        type: 'dateRanger',
        name: ['platform_order_time_start', 'platform_order_time_end'],
        label: <span>采&nbsp;购&nbsp;时&nbsp;间</span>,
        className: 'order-pending-date-picker',
        formItemClassName: 'form-item',
        placeholder: '请选择订单时间',
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
    orderList: IOrderItem[];
}

class PaneNotStock extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<SearchFormRef> = React.createRef();
    private initialValues = {
        order_goods_status: 100,
        purchase_order_status: 100
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
                const { all_count: total, list } = res.data;
                this.setState({
                    total,
                    page: params.page as number,
                    pageCount: params.page_count as number,
                    orderList: this.handleOrderList(list),
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 处理接口返回数据
    handleOrderList = (list: any[]): IOrderItem[] => {
        // 采购单号
        // 采购订单号
        // 采购运单号
        // 采购生成时间
        // 采购支付时间
        return list.map(current => {
            const {
                orderGoodsId,
                purchasePlanId,
                productId,
                purchasePlatform,
                purchaseNumber,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchaseOrderPayStatus,

                orderGoods,
                orderInfo
            } = current;
            const {
                confirmTime,
                channelOrderSn
            } = orderInfo;
            const {
                orderGoodsStatus,
                createTime: orderCreateTime
            } = orderGoods;
            
            return {
                orderGoodsId,
                purchasePlanId,
                productId,
                purchasePlatform,
                purchaseNumber,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchaseOrderPayStatus,

                confirmTime,
                channelOrderSn,

                orderGoodsStatus,
                orderCreateTime,
            } as IOrderItem;
        });;
    }

    render() {
        const {
            loading,
            orderList
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
                    </div>
                    <TableNotStock loading={loading} orderList={orderList} />
                </div>
            </>
        );
    }
}

export default PaneNotStock;
