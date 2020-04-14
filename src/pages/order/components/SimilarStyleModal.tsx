import React, { useCallback, useMemo } from 'react';
import { Col, Form, Input, Modal, Radio, Row, Select } from 'antd';
import { AutoEnLargeImg } from 'react-components';
import { FormInstance } from 'antd/es/form';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { Store } from 'rc-field-form/es/interface';
import HistoryTable from '@/pages/order/components/similarStyle/HistoryTable';
import { patSimilarGoods } from '@/services/order-manage';
import { IPadSimilarBody } from '@/interface/IOrder';

const SimilarGoods = () => {
    return useMemo(() => {
        return (
            <Row>
                <Col>
                    <AutoEnLargeImg src="" />
                </Col>
                <Col flex={1}>
                    <div>商品标题，商品标题</div>
                    <Row>
                        <Col span={8}>Product ID:dsadasdsa</Col>
                        <Col span={8}>Commodity SKU ID：dsadasdsadas</Col>
                        <Col span={8}>Size：M Color：blue</Col>
                    </Row>
                    <div>代拍成功率：90%</div>
                </Col>
            </Row>
        );
    }, []);
};

const StyleForm = ({ form }: { form: FormInstance }) => {
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
                            <HistoryTable />
                        );
                    }}
                </Form.Item>
            </Form>
        );
    }, []);
};

const OrderGoods = () => {
    return useMemo(() => {
        return (
            <Row>
                <Col>
                    <AutoEnLargeImg src="" />
                </Col>
                <Col flex={1}>
                    <div>商品标题，商品标题</div>
                    <Row>
                        <Col span={8}>Product ID:dsadasdsa</Col>
                        <Col span={8}>Commodity SKU ID：dsadasdsadas</Col>
                        <Col span={8}>Size：M Color：blue</Col>
                    </Row>
                </Col>
            </Row>
        );
    }, []);
};

declare interface SimilarStyleModalProps {
    visible: false | string;
    onClose: () => void;
}

const SimilarStyleModal = ({ visible, onClose }: SimilarStyleModalProps) => {
    const [form] = Form.useForm();
    const onOKey = useCallback(() => {
        const values = form.getFieldsValue();
        patSimilarGoods(values as IPadSimilarBody).then(() => {});
    }, []);
    return useMemo(() => {
        return (
            <Modal
                title="相似款代拍"
                visible={!!visible}
                onCancel={onClose}
                width={900}
                okText="拍单"
                onOk={onOKey}
            >
                <SimilarGoods />
                <StyleForm form={form} />
                <OrderGoods />
            </Modal>
        );
    }, [visible]);
};

export default SimilarStyleModal;
