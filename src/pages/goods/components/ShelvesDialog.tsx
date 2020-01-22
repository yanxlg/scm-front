import React from 'react';
import { Modal, Table } from 'antd';

import { ColumnProps } from 'antd/es/table';

export declare interface IShelvesDataItem {
    [key: string]: any;
}

declare interface ShelvesDialogProps {
    visible: boolean;
    toggleShelvesDialog(status: boolean): void;
}

const list: IShelvesDataItem[] = [
    {
        a1: '序号',
        a2: '2020-01-18 06:06:06',
        a3: 'VOVA',
        a4: '224455',
        a5: '下架'
    },
    {
        a1: '序号',
        a2: '2020-01-18 06:06:06',
        a3: 'VOVA',
        a4: '224455',
        a5: '下架'
    },
    {
        a1: '序号',
        a2: '2020-01-18 06:06:06',
        a3: 'VOVA',
        a4: '224455',
        a5: '下架'
    },
    {
        a1: '序号',
        a2: '2020-01-18 06:06:06',
        a3: 'VOVA',
        a4: '224455',
        a5: '下架'
    },
    {
        a1: '序号',
        a2: '2020-01-18 06:06:06',
        a3: 'VOVA',
        a4: '224455',
        a5: '下架'
    },
]

class ShelvesDialog extends React.PureComponent<ShelvesDialogProps> {

    private columns: ColumnProps<IShelvesDataItem>[] = [
        {
            key: 'a1',
            title: '序号',
            dataIndex: 'a1',
            align: 'center'
        },
        {
            key: 'a2',
            title: '时间',
            dataIndex: 'a2',
            align: 'center'
        },
        {
            key: 'a3',
            title: '销售平台',
            dataIndex: 'a3',
            align: 'center'
        },
        {
            key: 'a4',
            title: '中台商品ID',
            dataIndex: 'a4',
            align: 'center'
        },
        {
            key: 'a5',
            title: '操作',
            dataIndex: 'a5',
            align: 'center'
        }
    ]

    private handleCancel = () => {
        this.props.toggleShelvesDialog(false);
    }

    render() {

        const { visible } = this.props;

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
                    
                    dataSource={list}
                    columns={this.columns}
                />
            </Modal>
        )
    }
}

export default ShelvesDialog;
