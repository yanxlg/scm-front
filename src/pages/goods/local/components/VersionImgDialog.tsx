import React from 'react';
import { Modal, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { IGoodsVersionRowItem, IGoodsImgs } from '../version';

declare interface IDataSource {
    product_id: number;
    goods_imgs: IGoodsImgs;
    // prev_goods_imgs: IGoodsImgs;
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
            key: 'goods_imgs',
            width: 200,
            title: '主图',
            dataIndex: 'goods_imgs',
            align: 'center',
            className: 'top',
            render: (value: IGoodsImgs, row: IDataSource) => {
                const classStr = this.isAddImg(value.main_image_url) ? 'main-item add' : 'main-item';
                return (
                    <div className={classStr}>
                        <img className="main-img" src={value.main_image_url}/>
                    </div>
                    
                )
            }
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
                        {
                            row.goods_imgs.sub_image.map(item => {
                                const classStr = this.isAddImg(item.sub_image_url) ? 'item add' : 'item';
                                return (
                                    <div className={classStr} key={item.sku_id}>
                                        <img src={item.sub_image_url}/>
                                        <div className="desc">sku id：{item.sku_id}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        }
    ]

    // 判断当前图片是否为新增
    isAddImg = (imgUrl: string): boolean => {
        const { activeRow } = this.props;
        if (activeRow && activeRow._prevVersion) {
            const prevGoodsImgs = activeRow._prevVersion.goods_imgs;
            const list = [prevGoodsImgs.main_image_url];
            prevGoodsImgs.sub_image.forEach(item => list.push(item.sub_image_url));
            return list.indexOf(imgUrl) === -1;
        }
        return false;
    }

    private handleCancel = () => {
        this.props.toggleVersionImgDialog(false);
    }

    render() {
    
        const { visible, activeRow } = this.props;

        if (activeRow) {
            const dataSource: IDataSource[] = [
                {
                    product_id: activeRow.product_id,
                    goods_imgs: activeRow.goods_imgs,
                }
            ]
    
            return (
                <Modal
                    footer={null}
                    width={900}
                    visible={visible}
                    onCancel={this.handleCancel}
                >
                    <Table
                        bordered={true}
                        rowKey='product_id'
                        className="goods-version-dialog"
                        pagination={false}
                        columns={this.columns}
                        dataSource={dataSource}
    
                    />
                </Modal>
            )
        } else {
            return null
        }

        
    }
}

export default VersionImg;
