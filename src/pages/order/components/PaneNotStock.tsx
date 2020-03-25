import React, { RefObject } from 'react';
import { Button, message, Pagination, notification } from 'antd';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import TableNotStock from './TableNotStock';
import LoadingButton from '@/components/LoadingButton';

import { getPurchasedNotStockList, IFilterParams, delChannelOrders } from '@/services/order-manage';
import {
    defaultOptionItem,
    orderStatusOptionList,
    purchaseOrderOptionList,
    pageSizeOptions,
} from '@/enums/OrderEnum';
import { getCurrentPage } from '@/utils/common';

export declare interface IOrderItem {
    orderGoodsId: string;                // 中台订单ID
    orderCreateTime: string;             // 订单时间
    purchasePlanId: string;              // 计划子项ID
    productId: string;                   // 中台商品ID
    purchasePlatform: string;            // 采购平台
    purchaseNumber: number;              // 采购数量
    purchasePlatformOrderId: string;     // 采购订单号
    purchaseWaybillNo: string;           // 采购运单号
    platformOrderTime: string;           // 采购生成时间
    payTime: string;                     // 采购支付时间
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
    selectedRowKeys: string[];
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
            selectedRowKeys: []
        };
    }

    componentDidMount() {
        this.onSearch();
    }

    onSearch = (baseParams?: IFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IFilterParams = {
            page,
            page_count: pageCount,
        };
        if (this.formRef.current) {
            params = Object.assign(params, this.formRef.current.getFieldsValue());
        }
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
                purchasePlatformOrderId,
                purchaseWaybillNo,
                platformOrderTime,
                payTime,

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
                purchasePlatformOrderId,
                purchaseWaybillNo,
                platformOrderTime,
                payTime,

                confirmTime,
                channelOrderSn,

                orderGoodsStatus,
                orderCreateTime,
            } as IOrderItem;
        });;
    }

    private handleClickSearch = () => {
        const { order_goods_id } = this.formRef.current?.getFieldsValue() as any;
        if (order_goods_id && /[^0-9]/.test(order_goods_id)) {
            return message.error('中台订单ID只能输入数字字符');
        }
        this.onSearch();
    }

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

    private changeSelectedRowKeys = (keys: string[]) => {
        // console.log('keys', keys);
        this.setState({
            selectedRowKeys: keys
        })
    }

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

    private delChannelOrders = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length) {
            return delChannelOrders({
                order_goods_ids: selectedRowKeys,
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

    render() {
        const {
            loading,
            page,
            pageCount,
            total,
            orderList,
            selectedRowKeys
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
                        <Button 
                            type="primary" 
                            className="order-btn"
                            loading={loading}
                            onClick={this.handleClickSearch}
                        >
                            查询
                        </Button>
                        <LoadingButton
                            type="primary"
                            className="order-btn"
                            onClick={this.delChannelOrders}
                        >
                            取消渠道订单
                        </LoadingButton>
                        <Button type="primary" className="order-btn">
                            导出数据
                        </Button>
                    </div>
                    <TableNotStock 
                        loading={loading}
                        orderList={orderList}
                        selectedRowKeys={selectedRowKeys}
                        changeSelectedRowKeys={this.changeSelectedRowKeys}
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

export default PaneNotStock;
