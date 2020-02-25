import React from 'react';
import { Button } from 'antd';

import JsonForm, { IFieldItem } from '@/components/JsonForm';
import OptionalColumn from './OptionalColumn';

declare interface IPaneAllState {
    fieldList: IFieldItem[];
}

class PaneAll extends React.PureComponent<{}, IPaneAllState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            fieldList: [
                {
                    type: 'datePicker',
                    name: 'order_time',
                    labelText: '订单时间',
                    placeholder: '请选择订单时间',
                },
                {
                    type: 'input',
                    name: 'middleground_order_id',
                    labelText: '中台订单ID',
                    placeholder: '请输入中台订单ID',
                },
                {
                    type: 'input',
                    name: 'x1_id',
                    labelText: '销售订单ID',
                    placeholder: '请输入销售订单ID',
                },
                {
                    type: 'input',
                    name: 'x2_id',
                    labelText: '采购订单ID',
                    placeholder: '请输入采购订单ID',
                },
                {
                    type: 'select',
                    name: 'x3_status',
                    labelText: '销售订单状态',
                    optionList: [
                        {
                            name: '全部',
                            value: ""
                        }
                    ]
                },
                // {
                //     type: 'checkbox',
                //     name: 'is_parent',
                //     labelText: '仅展示父订单ID',
                // }
            ]
        }
    }

    render() {

        const { fieldList } = this.state;

        return (
            <>
                <div>
                    <JsonForm
                        fieldList={fieldList}
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
                </div>
            </>
        )
    }
}

export default PaneAll;
