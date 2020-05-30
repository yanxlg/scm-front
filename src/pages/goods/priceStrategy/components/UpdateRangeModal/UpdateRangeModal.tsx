import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { validateRange } from '@/utils/validate';
import MultipleSelect from '@/components/MultipleSelect/MultipleSelect';
import useGoodsCatagory from '../../hooks/useGoodsCatagory';

import styles from './_UpdateRangeModal.less';
import { requiredRule } from '@/enums/PriceStrategyEnum';
import useGoodsTag from '../../hooks/useGoodsTag';
import { startPriceStrategyUpdate } from '@/services/price-strategy';
import { IStartStrategyUpdateReq } from '@/interface/IPriceStrategy';

const { Option } = Select;

interface IProps {
    visible: boolean;
    sellChannelList: IOptionItem[];
    onCancel(): void;
}

const UpdateRange: React.FC<IProps> = ({ visible, sellChannelList, onCancel }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { catagoryList } = useGoodsCatagory();
    const { goodsTagList, toggleGoodsTag } = useGoodsTag();

    const handleOk = useCallback(async () => {
        // console.log('handleOk', form.getFieldsValue());
        const data = await form.validateFields();
        startPriceStrategyUpdate(data as IStartStrategyUpdateReq)
            .then(res => {})
            .finally(() => {});
    }, []);

    const handleCancel = useCallback(() => {
        form.resetFields();
        onCancel();
    }, []);

    return (
        <Modal
            title="执行范围"
            width={800}
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            onOk={handleOk}
        >
            <Form form={form} className={styles.container}>
                <div className={styles.title}>商品售价更新范围</div>
                <MultipleSelect
                    label="一级品类"
                    name="first_cat"
                    className={styles.select}
                    form={form}
                    optionList={catagoryList}
                    rules={[requiredRule]}
                    onChange={() => {
                        form.resetFields(['second_cat']);
                        form.resetFields(['third_cat']);
                    }}
                />
                <MultipleSelect
                    label="二级品类"
                    name="second_cat"
                    className={styles.select}
                    form={form}
                    optionList={catagoryList}
                    dependencies={['first_cat']}
                    rules={[requiredRule]}
                    onChange={() => {
                        form.resetFields(['third_cat']);
                    }}
                />
                <MultipleSelect
                    label="三级品类"
                    name="third_cat"
                    className={styles.select}
                    form={form}
                    optionList={catagoryList}
                    rules={[requiredRule]}
                    dependencies={['first_cat', 'second_cat']}
                />
                <Form.Item label="商品标签">
                    <div>
                        {goodsTagList.map(item => (
                            <CheckedBtn
                                item={item}
                                key={item.name}
                                onClick={() => toggleGoodsTag(item.name)}
                            />
                        ))}
                    </div>
                </Form.Item>
                <Form.Item
                    label="爬虫价格区间"
                    name="_"
                    dependencies={['min_origin_price', 'max_origin_price']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                return validateRange(
                                    getFieldValue,
                                    'min_origin_price',
                                    'max_origin_price',
                                );
                            },
                        }),
                    ]}
                >
                    <div className={classnames(styles.flex, styles.noneMargin)}>
                        <Form.Item name="min_origin_price" trigger="onBlur">
                            <InputNumber min={0} precision={2} />
                        </Form.Item>
                        <div className={styles.gutter}>-</div>
                        <Form.Item name="max_origin_price" trigger="onBlur">
                            <InputNumber min={0} precision={2} />
                        </Form.Item>
                        <div className={styles.extra}>¥</div>
                    </div>
                </Form.Item>
                <div className={styles.flex}>
                    <MultipleSelect
                        label="销售渠道"
                        name="enable_platform"
                        className={styles.select}
                        form={form}
                        optionList={sellChannelList}
                        rules={[requiredRule]}
                        onChange={() => {
                            form.resetFields(['enable_merchant']);
                        }}
                    />
                    <MultipleSelect
                        label="销售店铺"
                        name="enable_merchant"
                        className={styles.select}
                        form={form}
                        optionList={sellChannelList}
                        dependencies={['enable_platform']}
                        rules={[requiredRule]}
                    />
                </div>
                <div className={classnames(styles.title, styles.second)}>商品运费更新范围</div>
                <MultipleSelect
                    label="销售国家"
                    name="shipping_fee_country"
                    className={styles.select}
                    form={form}
                    optionList={[]}
                    rules={[requiredRule]}
                />
            </Form>
        </Modal>
    );
};

export default React.memo(UpdateRange);
