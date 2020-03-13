import React from 'react';
import { Table, Pagination } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { queryRegionShippingFee } from '@/services/channel';
import { IRegionShippingFeeItem } from '@/interface/IChannel';


declare interface IProps {
    product_id: string;
}

declare interface IState {
    loading: boolean;
    total: number;
    page: number;
    fee_list: IRegionShippingFeeItem[];
}

class ShipFeeModal extends React.PureComponent<IProps, IState> {

    private columns: ColumnProps<IRegionShippingFeeItem>[] = [
        {
            title: '国家',
            dataIndex: 'country_name',
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
            total: 0,
            page: 1,
            loading: false,
            fee_list: []
        }
    }

    componentDidMount() {
        // this.queryDetail();
        this.queryRegionShippingFee(1);
    }

    queryRegionShippingFee(page: number) {
        const { product_id } = this.props;
        this.setState({
            loading: true
        });
        queryRegionShippingFee({
            product_id,
            page,
            page_count: 50
        }).then(res => {
            // console.log('queryRegionShippingFee', res);
            const { total, fee } = res.data;
            this.setState({
                total,
                page,
                fee_list: fee
            })
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    onChangePage = (page: number) => {
        // console.log('onChangePage', page);
        this.queryRegionShippingFee(page);
    }

    render() {

        const { loading, page, total, fee_list } = this.state;

        return (
            <div>
                <Table
                    bordered={true}
                    loading={loading}
                    rowKey="country_code"
                    columns={this.columns}
                    dataSource={fee_list}
                    pagination={false}
                    scroll={{y: 280}}
                />
                <Pagination
                    size="small"
                    total={total}
                    current={page}
                    pageSize={50}
                    onChange={this.onChangePage}
                    showTotal={total => `共${total}条`}
                    style={{marginTop: 12}}
                />
            </div>
            
        )
    }
}

export default ShipFeeModal;

