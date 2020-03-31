import React from 'react';
import { Modal, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { utcToLocal } from '@/utils/date';
import { IPublishItem } from '@/interface/ILocalGoods';
import { publishStatusMap, publishStatusCode } from '@/enums/LocalGoodsEnum';

declare interface ShelvesDialogProps {
    visible: boolean;
    publishStatusList: IPublishItem[];
    toggleShelvesDialog(status: boolean): void;
}

class ShelvesDialog extends React.PureComponent<ShelvesDialogProps> {
    private columns: ColumnProps<IPublishItem>[] = [
        {
            key: 'serialNum',
            title: '序号',
            dataIndex: 'serialNum',
            align: 'center',
        },
        {
            key: 'lastUpdateTime',
            title: '时间',
            dataIndex: 'lastUpdateTime',
            align: 'center',
            render: (val: string) => utcToLocal(val),
        },
        {
            key: 'publishChannel',
            title: '销售平台',
            dataIndex: 'publishChannel',
            align: 'center',
        },
        {
            key: 'publishStore',
            title: '店铺名称',
            dataIndex: 'publishStore',
            align: 'center',
        },
        {
            key: 'publishStatus',
            title: '上架状态',
            dataIndex: 'publishStatus',
            align: 'center',
            render: (val: publishStatusCode) => publishStatusMap[val ? val : 0],
        },
        {
            key: 'productId',
            title: '中台商品ID',
            dataIndex: 'productId',
            align: 'center',
        },
    ];

    private handleCancel = () => {
        this.props.toggleShelvesDialog(false);
    };

    render() {
        const { visible, publishStatusList } = this.props;
        const pagination = publishStatusList.length > 5 ? {} : false;
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
                    rowKey="serialNum"
                    dataSource={publishStatusList}
                    columns={this.columns}
                />
            </Modal>
        );
    }
}

export default ShelvesDialog;
