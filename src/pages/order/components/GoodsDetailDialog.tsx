import React from 'react';
import { Modal, Spin } from 'antd';

import { IGoodsDetail } from './OrderTable_del';

declare interface IGoodsDetailDialogProps {
    visible: boolean;
    goodsDetail: IGoodsDetail | null;
    hideGoodsDetailDialog(): void;
}


class GoodsDetailDialog extends React.PureComponent<IGoodsDetailDialogProps> {

    // constructor(props: IGoodsDetailDialogProps) {
    //     super(props);
    // }

    private handleCancel = () => {
        this.props.hideGoodsDetailDialog();
    };

    render() {
        const { visible, goodsDetail } = this.props;
       
        return (
            <Modal
                title="商品详情"
                visible={visible}
                width={660}
                onCancel={this.handleCancel}
                footer={null}
            >
                {
                    goodsDetail ? (
                        <div className="order-goods-content">
                            <div>渠道商品ID: {goodsDetail.channel_goods_id}</div>
                            <div className="img-line">
                                <div>父SKU: {goodsDetail.psku}</div>
                                <div className="img-wrap"><span>商品主图:</span> <img src={goodsDetail.main_img}/></div>
                            </div>
                            <div className="img-line">
                                <div>子SKU: {goodsDetail.sku}</div>
                                <div className="img-wrap"><span>SKU对应图片:</span> <img src={goodsDetail.sku_img}/></div>
                            </div>
                            <div>商品名称: {goodsDetail.goods_name}</div>
                            <div>
                                商品规格: {
                                    Object.keys(goodsDetail.specs).map(key => (
                                        <span className="style" key={key}>{key}: {goodsDetail.specs[key as 'color']}</span>
                                    ))
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="order-goods-none">
                            <Spin/>加载中...
                        </div>
                    )
                }
            </Modal>
        );
    }
}

export default GoodsDetailDialog;
