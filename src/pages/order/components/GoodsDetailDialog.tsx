import React from 'react';
import { Modal, Spin } from 'antd';

import { IGoodsDetail } from './PaneAll';

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
                {goodsDetail ? (
                    <div className="order-goods-content">
                        <div className="img-line">
                            <div className="desc">渠道商品ID: {goodsDetail.product_id}</div>
                            <div className="img-wrap">
                                <span>商品主图:</span> <img src={goodsDetail.goods_img} />
                            </div>
                        </div>
                        {goodsDetail.sku_sn ? (
                            <div className="img-line">
                                <div className="desc">子SKU: {goodsDetail.commodity_sku_id}</div>
                                <div className="img-wrap">
                                    <span>SKU对应图片:</span> <img src={goodsDetail.sku_img} />
                                </div>
                            </div>
                        ) : null}
                        <div>
                            <div className="float-left">商品名称:</div>
                            <div className="overflow-hidden">{goodsDetail.title}</div>
                        </div>
                        {goodsDetail.sku_style ? (
                            <div>
                                <div className="float-left">商品规格:</div>
                                <div className="overflow-hidden">
                                    {goodsDetail.sku_style.map((item: any) => (
                                        <span className="style" key={item.option.text}>
                                            {item.option.text}: {item.value.text}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="order-goods-none">
                        <Spin />
                        加载中...
                    </div>
                )}
            </Modal>
        );
    }
}

export default GoodsDetailDialog;
