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
        key: '1',
        name: '订单确认时间'
    },
    {
        key: '2',
        name: '渠道订单ID'
    },
    {
        key: '3',
        name: '价格'
    },
    {
        key: '4',
        name: '运费'
    },
    {
        key: '5',
        name: '商品数量'
    },
    {
        key: '6',
        name: '取消订单时间'
    },
    {
        key: '7',
        name: '商品详情'
    },
    {
        key: '8',
        name: '中台订单状态'
    },
    {
        key: '9',
        name: '采购支付状态'
    },
    {
        key: '10',
        name: '采购生成时间'
    },
    {
        key: '11',
        name: '采购运单号'
    },
    {
        key: '12',
        name: '销售渠道'
    },
    {
        key: '13',
        name: '中台父订单ID'
    },
    {
        key: '14',
        name: '货币类型'
    },
    {
        key: '15',
        name: '发货剩余时间'
    },
    {
        key: '16',
        name: '渠道店铺名'
    },
    {
        key: '17',
        name: '采购配送状态'
    },
    {
        key: '18',
        name: '采购取消原因'
    },
    {
        key: '19',
        name: '商品总金额'
    },
    {
        key: '20',
        name: '渠道订单状态'
    },
    {
        key: '21',
        name: '采购订单状态'
    },
    {
        key: '22',
        name: '采购配送状态'
    },
    {
        key: '23',
        name: '采购订单号'
    },
    {
        key: '24',
        name: '父订单ID'
    },
    {
        key: '25',
        name: '子订单ID'
    },
    {
        key: '26',
        name: '中台子订单ID'
    },
    {
        key: '27',
        name: '一级类目'
    },
    {
        key: '28',
        name: '二级类目'
    },
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
