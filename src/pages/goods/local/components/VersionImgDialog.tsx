import React from 'react';
import { Modal, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { IGoodsVersionRowItem } from '../_version';

declare interface IDataSource {
    product_id: string;
    main_image: string;
    sku_image: string[];
}

declare interface VersionImgProps {
    visible: boolean;
    activeRow: IGoodsVersionRowItem | null;
    toggleVersionImgDialog(status: boolean): void;
}

class VersionImg extends React.PureComponent<VersionImgProps> {
    private columns: ColumnProps<IDataSource>[] = [
        {
            key: 'product_id',
            className: 'top',
            width: 160,
            title: '商品版本号',
            dataIndex: 'product_id',
            align: 'center',
        },
        {
            key: 'main_image',
            className: 'top',
            width: 200,
            title: '主图',
            dataIndex: 'main_image',
            align: 'center',
            render: (value: string, row: IDataSource) => {
                return (
                    <div className="main-item">
                        <img className="main-img" src={value} />
                    </div>
                );
            },
        },
        {
            key: 'sku_image',
            title: '副图',
            dataIndex: 'sku_image',
            align: 'center',
            className: 'top',
            render: (value: string[]) => {
                return (
                    <div className="list">
                        {value.map(item => {
                            return (
                                <div className="item" key={item}>
                                    <img src={item} />
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
    ];

    private handleCancel = () => {
        this.props.toggleVersionImgDialog(false);
    };

    render() {
        const { visible, activeRow } = this.props;

        if (activeRow) {
            const dataSource: IDataSource[] = [
                {
                    product_id: activeRow.product_id,
                    main_image: activeRow.goods_img,
                    sku_image: activeRow.sku_image,
                },
            ];

            return (
                <Modal
                    footer={null}
                    width={920}
                    visible={visible}
                    onCancel={this.handleCancel}
                    bodyStyle={{
                        maxHeight: 640,
                        overflow: 'auto',
                    }}
                >
                    <Table
                        bordered={true}
                        rowKey="product_id"
                        className="goods-version-dialog"
                        pagination={false}
                        columns={this.columns}
                        dataSource={dataSource}
                    />
                </Modal>
            );
        } else {
            return null;
        }
    }
}

export default VersionImg;
