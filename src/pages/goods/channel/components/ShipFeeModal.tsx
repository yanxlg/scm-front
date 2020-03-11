import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

declare interface countryFeeItem {
    country: string;
    fee: number;
    weight: number;
}

declare interface IProps {
    product_id: string;
}

declare interface IState {
    loading: boolean;
    fee_list: countryFeeItem[];
}

class ShipFeeModal extends React.PureComponent<IProps, IState> {

    private columns: ColumnProps<countryFeeItem>[] = [
        {
            title: '国家',
            dataIndex: 'country',
            align: 'center',
            width: 120,
        },
        {
            title: '国家运费',
            dataIndex: 'fee',
            align: 'center',
            width: 120,
        },
        {
            title: '重量',
            dataIndex: 'weight',
            align: 'center',
            width: 120,
        },
    ]

    constructor(props: IProps) {
        super(props);
        this.state = {
            loading: false,
            fee_list: []
        }
    }

    render() {

        const { loading, fee_list } = this.state;

        return (
            <Table
                bordered={true}
                loading={loading}
                columns={this.columns}
                dataSource={fee_list}
                pagination={false}
                scroll={{y: 500}}
            />
        )
    }
}

export default ShipFeeModal;

