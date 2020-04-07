import React, { RefObject } from 'react';
import { Button, Pagination, message, notification } from 'antd';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm } from 'react-components';
import TableWaitShip from './TableWaitShip';
import { LoadingButton } from 'react-components';

import { getCurrentPage } from '@/utils/common';
import {
    getWaitShipList,
    IWaitShipFilterParams,
    delPurchaseOrders,
    delChannelOrders,
    postExportWaitShip,
} from '@/services/order-manage';
import {
    defaultOptionItem,
    orderStatusOptionList,
    purchaseOrderOptionList,
    pageSizeOptions,
} from '@/enums/OrderEnum';

const fieldList: FormField[] = [
    {
        type: 'input',
        name: 'order_goods_id',
        label: <span>中&nbsp;台&nbsp;订&nbsp;单&nbsp;ID</span>,
        className: 'order-input',
        placeholder: '请输入中台订单ID',
        // numberStrArr
        // formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'purchase_platform_order_id_list',
        label: '采购平台订单ID',
        className: 'order-input',
        placeholder: '请输入中台商品ID',
        formatter: 'strArr',
    },
    {
        type: 'select',
        name: 'order_goods_status',
        label: '中台订单状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...orderStatusOptionList],
    },
    {
        type: 'select',
        name: 'purchase_order_status',
        label: '采购订单状态',
        className: 'order-input',
        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
    },
    {
        type: 'dateRanger',
        name: ['platform_order_time_start', 'platform_order_time_end'],
        label: <span>采&nbsp;购&nbsp;时&nbsp;间</span>,
        className: 'order-date-picker',
        // placeholder: '请选择订单时间',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['order_create_time_start', 'order_create_time_end'],
        label: <span>订&nbsp;单&nbsp;时&nbsp;间</span>,
        className: 'order-date-picker',
        // placeholder: '请选择订单时间',
        formatter: ['start_date', 'end_date'],
    },
];
export declare interface IWaitShipItem {
    platformOrderTime: string;
    purchasePlatformOrderId: string;
    purchaseAmount: string;
    orderGoodsStatus: string;
    purchaseOrderStatus: string;
    purchaseOrderShippingStatus: string;
    purchasePlanId: string;
    orderGoodsId: string;
    orderCreateTime: string;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    orderList: IWaitShipItem[];
    selectedRowKeys: string[];
}

declare interface IProps {
    getAllTabCount(): void;
}

class PaneWaitShip extends React.PureComponent<IProps, IState> {
    private formRef: RefObject<JsonFormRef> = React.createRef();
    private initialValues = {
        order_goods_status: 100,
        purchase_order_status: 100,
    };
    private currentSearchParams: IWaitShipFilterParams | null = null;
    constructor(props: IProps) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 50,
            total: 0,
            loading: false,
            orderList: [],
            selectedRowKeys: [],
        };
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IWaitShipFilterParams) => {
        const { page, pageCount } = this.state;
        let params: IWaitShipFilterParams = {
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
        getWaitShipList(params)
            .then(res => {
                this.currentSearchParams = params;
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
    handleOrderList = (list: any[]): IWaitShipItem[] => {
        return list.map(current => {
            const {
                platformOrderTime,
                purchasePlatformOrderId,
                purchaseAmount,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchasePlanId,
                orderGoodsId,
                orderGoods,
            } = current;
            const { orderGoodsStatus, createTime: orderCreateTime } = orderGoods;
            return {
                platformOrderTime,
                purchasePlatformOrderId,
                purchaseAmount,
                orderGoodsStatus,
                purchaseOrderStatus,
                purchaseOrderShippingStatus,
                purchasePlanId,
                orderGoodsId,
                orderCreateTime,
            } as IWaitShipItem;
        });
    };

    // 获取查询数据
    getFieldsValue = () => {
        // console.log('111', );
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

    private changeSelectedRowKeys = (keys: string[]) => {
        // console.log('keys', keys);
        this.setState({
            selectedRowKeys: keys,
        });
    };

    private handleClickSearch = () => {
        const { order_goods_id } = this.formRef.current?.getFieldsValue() as any;
        if (order_goods_id && /[^0-9]/.test(order_goods_id)) {
            return message.error('中台订单ID只能输入数字字符');
        }
        this.onSearch({
            page: 1,
        });
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
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length) {
            return delPurchaseOrders({
                order_goods_ids: selectedRowKeys,
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

    private postExportWaitShip = () => {
        const params = this.currentSearchParams
            ? this.currentSearchParams
            : {
                  page: 1,
                  page_count: 50,
              };
        return postExportWaitShip(params);
    };

    render() {
        const { loading, orderList, total, page, pageCount, selectedRowKeys } = this.state;
        return (
            <div>
                <JsonForm
                    labelClassName="order-label"
                    fieldList={fieldList}
                    ref={this.formRef}
                    initialValues={this.initialValues}
                />
                <div className="order-operation">
                    <Button type="primary" className="order-btn" onClick={this.handleClickSearch}>
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
                        onClick={this.postExportWaitShip}
                    >
                        导出数据
                    </LoadingButton>
                </div>
                <TableWaitShip
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
        );
    }
}

export default PaneWaitShip;
