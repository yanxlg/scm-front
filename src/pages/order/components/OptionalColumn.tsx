import React from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

declare interface IOptionalColumnProps {

}

declare interface IOptionalColumnState {
    indeterminate: boolean;
    checkAll: boolean;
}

const allColumnList = [
    {
        key: 'order_confirm_time',
        name: '订单确认时间'
    },
    {
        key: 'channel_order_id',
        name: '渠道订单ID'
    },
    {
        key: 'channel_goods_price',
        name: '价格'
    },
    {
        key: 'channel_shipping_fee',
        name: '运费'
    },
    {
        key: 'goods_number',
        name: '商品数量'
    },
    {
        key: 'cancel_order_time',
        name: '取消订单时间'
    },
    {
        key: 'goods_detail',
        name: '商品详情'
    },
    {
        key: 'middleground_order_status',
        name: '中台订单状态'
    },
    {
        key: 'goods_purchase_payment_status',
        name: '采购支付状态'
    },
    {
        key: 'goods_purchase_order_time',
        name: '采购生成时间'
    },
    {
        key: 'goods_purchase_shipping_no',
        name: '采购运单号'
    },
    {
        key: 'channel',
        name: '销售渠道'
    },
    {
        key: 'middleground_p_order_id',
        name: '中台父订单ID'
    },
    {
        key: 'currency_type',
        name: '货币类型'
    },
    {
        key: 'remain_delivery_time',
        name: '发货剩余时间'
    },
    {
        key: 'channel_store_name',
        name: '渠道店铺名'
    },
    // {
    //     key: 'purchase_delivery_status',
    //     name: '采购配送状态'
    // },
    {
        key: 'purchase_cancel_reason',
        name: '采购取消原因'
    },
    {
        key: 'goods_amount',
        name: '商品总金额'
    },
    {
        key: 'channel_order_status',
        name: '渠道订单状态'
    },
    {
        key: 'goods_purchase_order_status',
        name: '采购订单状态'
    },
    {
        key: 'goods_purchase_delivery_status',
        name: '采购配送状态'
    },
    {
        key: 'goods_purchase_order_no',
        name: '采购订单号'
    },
    {
        key: 'p_order_id',
        name: '父订单ID'
    },
    {
        key: 'child_order_id',
        name: '子订单ID'
    },
    {
        key: 'middleground_c_order_id',
        name: '中台子订单ID'
    }
];

class OptionalColumn extends React.PureComponent<IOptionalColumnProps, IOptionalColumnState> {

    constructor(props: IOptionalColumnProps) {
        super(props);
        this.state = {
            indeterminate: false,
            checkAll: false
        }
    }

    onCheckAll = (e: CheckboxChangeEvent) => {
        this.setState({
            // checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    onCheckSingle = (keyList: CheckboxValueType[]) => {
        // console.log('onCheckSingle', keyList);
    }

    render() {
        return (
            <div className="order-optional-column">
                <div className="all">
                    <strong>可选字段：</strong>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAll}
                        checked={this.state.checkAll}
                    >
                        全选
                    </Checkbox>
                </div>
                <Checkbox.Group style={{ width: '100%' }} onChange={this.onCheckSingle}>
                    {
                        allColumnList.map(item => (
                            <Checkbox className="checkbox-item" key={item.key} value={item.key}>{item.name}</Checkbox>
                        ))
                    }
                </Checkbox.Group>
            </div>
        )
    }
}

export default OptionalColumn;
