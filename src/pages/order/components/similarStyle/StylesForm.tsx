import { FormInstance } from 'antd/es/form';
import { IHistorySimilar } from '@/interface/IOrder';
import React, { useMemo } from 'react';
import { Col, Form, Input, Radio, Row, Select } from 'antd';
import HistoryTable from './HistoryTable';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { Store } from 'rc-field-form/es/interface';
import classNames from 'classnames';
import similarStyles from './_similar.less';

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
                <Form.Item
                    name="type"
                    className={classNames(formStyles.formItem, similarStyles.typeError)}
                    validateTrigger={'onChange'}
                    rules={[
                        {
                            validator: () => {
                                const { type, list } = form.getFieldsValue(['type', 'list']);
                                if (type === 2 && !list) {
                                    return Promise.reject('请选择历史代拍商品');
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
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
                                        rules={[
                                            {
                                                validator: () => {
                                                    const { type, goods_id } = form.getFieldsValue([
                                                        'type',
                                                        'goods_id',
                                                    ]);
                                                    if (type === 1 && !goods_id) {
                                                        return Promise.reject('请输入Goods ID');
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="SKU ID"
                                        name="sku_id"
                                        className={formStyles.formItem}
                                        rules={[
                                            {
                                                validator: () => {
                                                    const { type, sku_id } = form.getFieldsValue([
                                                        'type',
                                                        'sku_id',
                                                    ]);
                                                    if (type === 1 && !sku_id) {
                                                        return Promise.reject('请输入SKU ID');
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
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

export default StyleForm;
