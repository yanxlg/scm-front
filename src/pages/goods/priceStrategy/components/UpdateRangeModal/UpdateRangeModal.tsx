import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';
import { ICheckedBtnItem } from '@/interface/IGlobal';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';

import styles from './_UpdateRangeModal.less';
import { getCatagoryList } from '@/services/goods';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { getCurrentOptionList } from '@/utils/utils';
import { isNumber } from '@/utils/validate';

const { Option } = Select;

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const UpdateRange: React.FC<IProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [goodsTagList, setGoodsTagList] = useState<ICheckedBtnItem[]>([
        { name: '商品标签1', checked: false },
        { name: '商品标签2', checked: true },
    ]);
    const [catagoryList, setCatagoryList] = useState<IOptionItem[]>([]);
    const [firstCatagoryId, setFirstCatagoryId] = useState('');
    const [secondCatagoryId, setSecondCatagoryId] = useState('');

    const handleChangeFirstCatagory = useCallback(value => {
        form.resetFields(['second_catagory', 'third_catagory']);
        setFirstCatagoryId(value);
        setSecondCatagoryId('');
    }, []);

    const handleChangeSecondCatagory = useCallback(value => {
        form.resetFields(['third_catagory']);
        setSecondCatagoryId(value);
    }, []);

    const handleOk = useCallback(() => {
        console.log('handleOk', form.getFieldsValue());
    }, []);

    const handleCancel = useCallback(() => {
        setFirstCatagoryId('');
        setSecondCatagoryId('');
        form.resetFields();
        onCancel();
    }, []);

    const secondCatagoryList = useMemo(() => {
        return getCurrentOptionList(catagoryList, [firstCatagoryId]);
    }, [firstCatagoryId, catagoryList]);

    const thirdCatagoryList = useMemo(() => {
        return getCurrentOptionList(catagoryList, [firstCatagoryId, secondCatagoryId]);
    }, [firstCatagoryId, secondCatagoryId, catagoryList]);

    useEffect(() => {
        getCatagoryList().then(({ convertList }) => {
            // console.log('getCatagoryList', res);
            setCatagoryList(convertList);
        });
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
                <Form.Item label="一级品类" name="first_catagory" initialValue="">
                    <Select className={styles.select} onChange={handleChangeFirstCatagory}>
                        <Option value="">全部</Option>
                        {catagoryList.map(({ name, value }) => (
                            <Option key={name} value={value}>
                                {name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="二级品类" name="second_catagory" initialValue="">
                    <Select className={styles.select} onChange={handleChangeSecondCatagory}>
                        <Option value="">全部</Option>
                        {secondCatagoryList.map(({ name, value }) => (
                            <Option key={name} value={value}>
                                {name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="三级品类" name="third_catagory" initialValue="">
                    <Select className={styles.select}>
                        <Option value="">全部</Option>
                        {thirdCatagoryList.map(({ name, value }) => (
                            <Option key={name} value={value}>
                                {name}
                            </Option>
                        ))}
                    </Select>
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
                                const min = getFieldValue('min-price');
                                const max = getFieldValue('max-price');
                                const typeList = [null, undefined, ''];
                                // console.log(1111111, min, max);
                                // min !== null && max !== null &&
                                if (
                                    typeList.indexOf(min) === -1 &&
                                    typeList.indexOf(max) === -1 &&
                                    min > max
                                ) {
                                    return Promise.reject('请检查价格区间!');
                                }
                                return Promise.resolve();
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
                <Form.Item label="销售渠道" name="a1" initialValue="">
                    <Select className={styles.select}>
                        <Option value="">全部</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="销售店铺" name="a2" initialValue="">
                    <Select className={styles.select}>
                        <Option value="">全部</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="销售国家" name="a3" initialValue="">
                    <Select className={styles.select}>
                        <Option value="">全部</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default React.memo(UpdateRange);
