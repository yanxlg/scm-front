import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';
import { ICheckedBtnItem } from '@/interface/IGlobal';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { validateRange } from '@/utils/validate';
import MultipleSelect from '@/components/MultipleSelect/MultipleSelect';
import useGoodsCatagory from '../../hooks/useGoodsCatagory';

import styles from './_UpdateRangeModal.less';

const { Option } = Select;

interface IProps {
    visible: boolean;
    sellChannelList: IOptionItem[];
    onCancel(): void;
}

const UpdateRange: React.FC<IProps> = ({ visible, sellChannelList, onCancel }) => {
    const [form] = Form.useForm();
    const [goodsTagList, setGoodsTagList] = useState<ICheckedBtnItem[]>([
        { name: '商品标签1', checked: false },
        { name: '商品标签2', checked: true },
    ]);
    const { catagoryList } = useGoodsCatagory();

    const handleOk = useCallback(() => {
        console.log('handleOk', form.getFieldsValue());
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
            onCancel={handleCancel}
            onOk={handleOk}
        >
            <Form form={form} className={styles.container}>
                <Form.Item label="一级品类" name="first_cat">
                    <MultipleSelect
                        name="first_cat"
                        className={styles.select}
                        form={form}
                        optionList={catagoryList}
                        onChange={() => {
                            form.resetFields(['second_cat']);
                            form.resetFields(['third_cat']);
                        }}
                    />
                </Form.Item>
                <Form.Item label="二级品类" name="second_cat">
                    <MultipleSelect
                        name="second_cat"
                        className={styles.select}
                        form={form}
                        optionList={catagoryList}
                        dependNameList={['first_cat']}
                        onChange={() => {
                            // console.log(11111);
                            form.resetFields(['third_cat']);
                        }}
                    />
                </Form.Item>
                <Form.Item label="三级品类" name="third_cat">
                    <MultipleSelect
                        name="third_cat"
                        className={styles.select}
                        form={form}
                        optionList={catagoryList}
                        dependNameList={['first_cat', 'second_cat']}
                    />
                </Form.Item>
                <Form.Item label="商品标签">
                    <div>
                        {goodsTagList.map(item => (
                            <CheckedBtn item={item} key={item.name} />
                        ))}
                    </div>
                </Form.Item>
                <Form.Item
                    label="爬虫价格区间"
                    name="_"
                    dependencies={['min-price', 'max-price']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                return validateRange(getFieldValue, 'min-price', 'max-price');
                            },
                        }),
                    ]}
                >
                    <div className={classnames(styles.flex, styles.noneMargin)}>
                        <Form.Item name="min-price" trigger="onBlur">
                            <InputNumber min={0} precision={2} />
                        </Form.Item>
                        <div className={styles.gutter}>-</div>
                        <Form.Item name="max-price" trigger="onBlur">
                            <InputNumber min={0} precision={2} />
                        </Form.Item>
                        <div className={styles.extra}>¥</div>
                    </div>
                </Form.Item>
                <Form.Item label="销售渠道" name="enable_platform">
                    <MultipleSelect
                        name="enable_platform"
                        className={styles.select}
                        form={form}
                        optionList={sellChannelList}
                        onChange={() => {
                            console.log(11111);
                            // form.resetFields(['enable_merchant']);
                        }}
                    />
                </Form.Item>
                <Form.Item label="销售店铺" name="enable_merchant">
                    <MultipleSelect
                        name="enable_merchant"
                        dependNameList={['enable_platform']}
                        className={styles.select}
                        form={form}
                        optionList={sellChannelList}
                    />
                </Form.Item>
                <Form.Item label="销售国家" name="shipping_fee_country">
                    <MultipleSelect
                        name="shipping_fee_country"
                        className={styles.select}
                        form={form}
                        optionList={[]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default React.memo(UpdateRange);
