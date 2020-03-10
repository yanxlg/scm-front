import React from 'react';

import SearchForm, { IFieldItem } from '@/components/SearchForm';

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
                            value: '',
                        },
                    ],
                },
                {
                    type: 'checkbox',
                    name: 'is_parent',
                    labelText: '仅展示父订单ID',
                },
            ],
        };
    }

    render() {
        const { fieldList } = this.state;

        return (
            <>
                <div>
                    <SearchForm fieldList={fieldList} />
                    {/* <div className="order-operation-group">

                    </div> */}
                </div>
            </>
        );
    }
}

export default PaneAll;
