import React from 'react';
import { Modal, Table } from 'antd';

import { ColumnProps } from 'antd/es/table';

import { formatDate } from '@/utils/date';

export declare interface ISaleStatausItem {
    order?: number;
    onsale_channel: string;
    onsale_time: number;
    product_id?: string;
    status_label: string;
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
            align: 'center',
        },
        {
            key: 'onsale_time',
            title: '时间',
            dataIndex: 'onsale_time',
            align: 'center',
            render: (val: number) => formatDate(new Date(val * 1000), 'yyyy-MM-dd hh:mm:ss'),
        },
        {
            key: 'onsale_channel',
            title: '销售平台',
            dataIndex: 'onsale_channel',
            align: 'center',
        },
        {
            key: 'product_id',
            title: '中台商品ID',
            dataIndex: 'product_id',
            align: 'center',
        },
        {
            key: 'status_label',
            title: '操作',
            dataIndex: 'status_label',
            align: 'center',
        },
    ];

    private handleCancel = () => {
        this.props.toggleShelvesDialog(false);
    };

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
                    rowKey="order"
                    pagination={pagination}
                    dataSource={saleStatusList}
                    columns={this.columns}
                />
            </Modal>
        );
    }
}

export default ShelvesDialog;
