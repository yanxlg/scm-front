import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Form, Input, message, Modal, Radio, Row, Select, Spin } from 'antd';
import { AutoEnLargeImg } from 'react-components';
import { FormInstance } from 'antd/es/form';

import { Store } from 'rc-field-form/es/interface';
import HistoryTable from '@/pages/order/components/similarStyle/HistoryTable';
import { patSimilarGoods, querySimilarInfo } from '@/services/order-manage';
import { IHistorySimilar, IPadSimilarBody, ISimilarInfoResponse } from '@/interface/IOrder';
import { EmptyObject } from '@/config/global';
import { LoadingOutlined, CloseCircleFilled } from '@ant-design/icons';
import classNames from 'classnames';
import { parseJson } from '@/utils/utils';

import similarStyles from './_similar.less';
import taskStyles from '@/styles/_task.less';
import styles from '@/styles/_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const SimilarGoods = (props: ISimilarInfoResponse['purchaseInfo']) => {
    const { productImageUrl, productName, productId, commoditySkuId, productSkuStyle } = props;
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
                        <Col span={8} className={styles.textEllipse} title={productId}>
                            Product ID:{productId}
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

const OrderGoods = (props: ISimilarInfoResponse['originOrderInfo']) => {
    return useMemo(() => {
        const { skuImageUrl, productOptionValue, productId, skuId, productTitle } = props;
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
                                <span className={similarStyles.key}>Product ID</span>：{productId}
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
                    </div>
                </div>
            </div>
        );
    }, []);
};

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

const StyleForm = ({ form, list }: { form: FormInstance; list: IHistorySimilar[] }) => {
    return useMemo(() => {
        return (
            <Form
                form={form}
                layout={'horizontal'}
                className={formStyles.formHelpAbsolute}
                initialValues={{
                    type: 1,
                    platform: 'pdd',
                }}
            >
                <Form.Item name="type" className={formStyles.formItem}>
                    <Radio.Group>
                        <Radio value={1}>输入代拍商品信息</Radio>
                        <Radio value={2}>选择历史代拍商品</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    noStyle={true}
                    shouldUpdate={(prevValues: Store, nextValues: Store) => {
                        return prevValues.type !== nextValues.type;
                    }}
                >
                    {({ getFieldValue }) => {
                        const type = getFieldValue('type');
                        return type === 1 ? (
                            <Row gutter={[20, 0]}>
                                <Col span={8}>
                                    <Form.Item
                                        label="商品渠道"
                                        name="platform"
                                        className={formStyles.formItem}
                                    >
                                        <Select>
                                            <Select.Option value="pdd">拼多多</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Goods ID"
                                        name="goods_id"
                                        className={formStyles.formItem}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="SKU ID"
                                        name="sku_id"
                                        className={formStyles.formItem}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) : (
                            <HistoryTable list={list} />
                        );
                    }}
                </Form.Item>
            </Form>
        );
    }, []);
};

declare interface SimilarStyleModalProps {
    visible:
        | false
        | {
              order_goods_id: string;
              purchase_plan_id: string;
          };
    onClose: () => void;
    onReload: () => void;
}

const SimilarStyleModal = ({ visible, onClose, onReload }: SimilarStyleModalProps) => {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<ISimilarInfoResponse>(EmptyObject);
    useEffect(() => {
        // 获取当前状态
        if (visible) {
            setInfo(EmptyObject);
            setLoading(true);
            querySimilarInfo(visible)
                .then(({ data }) => {
                    if (Number(data.status) === 4) {
                        // 成功，需要立即刷新原页面
                        message.success('代拍成功！');
                        onClose();
                        onReload();
                    }
                    setInfo(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [visible]);
    const [form] = Form.useForm();
    const onOKey = useCallback(() => {
        form.validateFields().then(values => {
            const { type, list, order_goods_id, origin_purchase_plan_id, ...extra } = values;
            patSimilarGoods({
                ...extra,
                ...visible,
                ...(type === 1
                    ? {
                          order_goods_id,
                          origin_purchase_plan_id,
                      }
                    : JSON.parse(list)),
                type,
            } as IPadSimilarBody).then(() => {});
        });
    }, [visible]);
    return useMemo(() => {
        const {
            status: taskStatus,
            purchaseInfo,
            originOrderInfo,
            historySimilarGoodsInfo = [],
        } = info;
        const status = taskStatus === void 0 ? undefined : Number(taskStatus);
        const title = status === 0 ? '相似款代拍' : '代拍详情';
        return (
            <Modal
                title={title}
                visible={!!visible}
                onCancel={onClose}
                width={900}
                okText="拍单"
                onOk={onOKey}
                destroyOnClose={true}
            >
                <Spin spinning={loading}>
                    {status === void 0 ? null : (
                        <>
                            {status === 0 ? (
                                <div className={similarStyles.title}>
                                    <CloseCircleFilled
                                        className={classNames('1111', taskStyles.errorIcon)}
                                    />
                                    拍单失败-失败原因
                                </div>
                            ) : status === 1 || status === 5 ? (
                                <div className={similarStyles.title}>
                                    <LoadingOutlined className={taskStyles.progressIcon} />
                                    正在爬取商品信息...
                                </div>
                            ) : status === 3 ? (
                                <div className={similarStyles.title}>
                                    <CloseCircleFilled className={taskStyles.errorIcon} />
                                    爬取失败
                                </div>
                            ) : null}
                            {status === 0 ? (
                                <SimilarGoods {...purchaseInfo} />
                            ) : status === 1 || status === 5 || status === 3 ? (
                                <GatherInfo {...purchaseInfo} />
                            ) : null}
                            {status === 1 || status === 5 ? null : (
                                <>
                                    {status === 3 ? (
                                        <div className={similarStyles.title1}>重新代拍相似款</div>
                                    ) : null}
                                    <StyleForm form={form} list={historySimilarGoodsInfo} />
                                </>
                            )}
                            <OrderGoods {...originOrderInfo} />
                        </>
                    )}
                </Spin>
            </Modal>
        );
    }, [visible, loading]);
};

export default SimilarStyleModal;
