import { ISimilarInfoResponse } from '@/interface/IOrder';
import { parseJson } from '@/utils/utils';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { AutoEnLargeImg } from 'react-components';
import similarStyles from '@/pages/order/components/similarStyle/_similar.less';
import styles from '@/styles/_index.less';
import { Col, Row } from 'antd';

const SimilarGoods = (props: ISimilarInfoResponse['purchaseInfo']) => {
    const { productImageUrl, productName, orderGoods, commoditySkuId, productSkuStyle } = props;
    const productStyle = parseJson(productSkuStyle);

    let styleArray: string[] = [];
    for (let key in productStyle) {
        styleArray.push(`${key}:${productStyle[key]}`);
    }

    const styleString = styleArray.join(' ');
    return useMemo(() => {
        return (
            <div className={classNames(formStyles.flex, formStyles.flexRow)}>
                <div>
                    <AutoEnLargeImg src={productImageUrl} className={similarStyles.image} />
                </div>
                <div
                    className={classNames(
                        formStyles.flex1,
                        formStyles.flexColumn,
                        similarStyles.content,
                        styles.clip,
                    )}
                >
                    <div className={styles.textEllipse} title={productName}>
                        {productName}
                    </div>
                    <Row gutter={[15, 0]}>
                        <Col
                            span={8}
                            className={styles.textEllipse}
                            title={orderGoods?.commodityId}
                        >
                            Commodity ID:{orderGoods?.commodityId}
                        </Col>
                        <Col span={8} className={styles.textEllipse} title={commoditySkuId}>
                            Commodity SKU ID:{commoditySkuId}
                        </Col>
                        <Col span={8} className={styles.textEllipse} title={styleString}>
                            {styleString}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }, []);
};

export default SimilarGoods;
