import { ISimilarInfoResponse } from '@/interface/IOrder';
import React, { useMemo } from 'react';
import { Col, Row } from 'antd';
import similarStyles from '@/pages/order/components/similarStyle/_similar.less';

const GatherInfo = (props: ISimilarInfoResponse['purchaseInfo']) => {
    return useMemo(() => {
        const { platform, goodsId, skuId } = props;
        return (
            <Row gutter={[15, 0]} className={similarStyles.gather}>
                <Col span={8}>商品渠道：拼多多</Col>
                <Col span={8}>Goods ID：{goodsId}</Col>
                <Col span={8}>SKU ID：{skuId}</Col>
            </Row>
        );
    }, []);
};

export default GatherInfo;
