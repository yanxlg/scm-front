import React from 'react';
import { Modal, Table } from 'antd';

import { ColumnProps } from 'antd/es/table';

export declare interface ISaleStatausItem {
    order?: number;
    channel: string;
    onsale_time: number;
    product_id: string;
    onsaleStatus: string;
}

declare interface ShelvesDialogProps {
    visible: boolean;
    saleStatusList: ISaleStatausItem[];
    toggleShelvesDialog(status: boolean): void;
}


class ShelvesDialog extends React.PureComponent<ShelvesDialogProps> {

    private columns: ColumnProps<ISaleStatausItem>[] = [
        {
            key: 'order',
            title: '序号',
            dataIndex: 'order',
            align: 'center'
        },
        {
            key: 'onsale_time',
            title: '时间',
            dataIndex: 'onsale_time',
            align: 'center'
        },
        {
            key: 'channel',
            title: '销售平台',
            dataIndex: 'channel',
            align: 'center'
        },
        {
            key: 'product_id',
            title: '中台商品ID',
            dataIndex: 'product_id',
            align: 'center'
        },
        {
            key: 'onsaleStatus',
            title: '操作',
            dataIndex: 'onsaleStatus',
            align: 'center'
        }
    ]

    private handleCancel = () => {
        this.props.toggleShelvesDialog(false);
    }

    render() {

        const { visible, saleStatusList } = this.props;
        const pagination = saleStatusList.length > 5 ? {} : false;
        return (
            <Modal
                title="上架状态记录"
                visible={visible}
                footer={null}
                width={800}
                onCancel={this.handleCancel}
            >
                <Table
                    bordered={true}
                    pagination={pagination}
                    dataSource={saleStatusList}
                    columns={this.columns}
                />
            </Modal>
        )
    }
}

export default ShelvesDialog;
