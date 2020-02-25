import React from 'react';
import { Modal, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { IGoodsVersionRowItem } from '../version';

declare interface IDataSource {
    product_id: string;
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
            width: 160,
            title: '商品版本号',
            dataIndex: 'product_id',
            align: 'center',
        },
        {
            key: 'sku_image',
            width: 200,
            title: '主图',
            dataIndex: 'sku_image',
            align: 'center',
            className: 'top',
            render: (value: string[], row: IDataSource) => {
                // const classStr = this.isAddImg(value[0])
                //     ? 'main-item add'
                //     : 'main-item';
                return (
                    <div className="main-item">
                        <img className="main-img" src={value[0]} />
                    </div>
                );
            },
        },
        {
            key: 'a3',
            title: '副图',
            // dataIndex: 'a3',
            align: 'center',
            className: 'top',
            render: (value, row: IDataSource) => {
                return (
                    // <div>111</div>
                    <div className="list">
                        {row.sku_image.slice(1).map(item => {
                            // const classStr = this.isAddImg(item)
                            //     ? 'item add'
                            //     : 'item';
                            return (
                                <div className="item" key={item}>
                                    <img src={item} />
                                    {/* <div className="desc">sku id：{item}</div> */}
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
    ];

    // 判断当前图片是否为新增
    // isAddImg = (imgUrl: string): boolean => {
    //     const { activeRow } = this.props;
    //     if (activeRow && activeRow._prevVersion) {
    //         return activeRow._prevVersion.sku_image.indexOf(imgUrl) === -1;
    //     }
    //     return false;
    // };

    private handleCancel = () => {
        this.props.toggleVersionImgDialog(false);
    };

    render() {
        const { visible, activeRow } = this.props;

        if (activeRow) {
            const dataSource: IDataSource[] = [
                {
                    product_id: activeRow.product_id,
                    sku_image: activeRow.sku_image,
                },
            ];

            return (
                <Modal footer={null} width={900} visible={visible} onCancel={this.handleCancel}>
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
