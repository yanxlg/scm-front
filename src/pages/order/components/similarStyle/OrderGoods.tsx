import { ISimilarInfoResponse } from '@/interface/IOrder';
import React, { useMemo } from 'react';
import { parseJson } from '@/utils/utils';
import similarStyles from '@/pages/order/components/similarStyle/_similar.less';
import classNames from 'classnames';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { AutoEnLargeImg } from 'react-components';
import styles from '@/styles/_index.less';
import { Col, Row } from 'antd';

const OrderGoods = (props: ISimilarInfoResponse['originOrderInfo']) => {
    return useMemo(() => {
        const {
            skuImageUrl,
            productOptionValue,
            productId,
            skuId,
            productTitle,
            commodityId,
            skuPrice,
            goodsNumber,
        } = props;
        const productStyle = parseJson(productOptionValue);

        let styleArray: string[] = [];
        for (let key in productStyle) {
            styleArray.push(`${key}:${productStyle[key]}`);
        }
        const styleString = styleArray.join(' ');
        return (
            <div className={similarStyles.order}>
                <div className={similarStyles.header}>用户订单商品信息</div>
                <div className={classNames(formStyles.flex, formStyles.flexRow)}>
                    <div>
                        <AutoEnLargeImg src={skuImageUrl} className={similarStyles.image} />
                    </div>
                    <div
                        className={classNames(
                            formStyles.flex1,
                            formStyles.flexColumn,
                            similarStyles.content,
                        )}
                    >
                        <div
                            className={classNames(styles.textEllipse, similarStyles.name)}
                            title={productTitle}
                        >
                            {productTitle}
                        </div>
                        <Row gutter={[15, 0]}>
                            <Col span={8} className={styles.textEllipse} title={productId}>
                                <span className={similarStyles.key}>Commodity ID</span>：
                                {commodityId}
                            </Col>
                            <Col span={8} className={styles.textEllipse} title={skuId}>
                                <span className={similarStyles.key}>Commodity SKU ID</span>：{skuId}
                            </Col>
                            <Col
                                span={8}
                                className={classNames(styles.textEllipse, similarStyles.key)}
                                title={styleString}
                            >
                                {styleString}
                            </Col>
                        </Row>
                        <div>
                            <div
                                className={classNames(styles.inlineBlock, similarStyles.goodsInfo)}
                            >
                                采购单价(￥): {skuPrice}
                            </div>
                            <div
                                className={classNames(styles.inlineBlock, similarStyles.goodsInfo)}
                            >
                                采购数量: {goodsNumber}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, []);
};

export default OrderGoods;
