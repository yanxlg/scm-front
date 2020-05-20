import React, { useState, useCallback } from 'react';
import { Form, Input, Row, Col, Select, Button, InputNumber, Radio } from 'antd';
import { IEdiyKey } from '@/interface/IPriceAdjustment';
import { EditEnum } from '@/enums/PriceAdjustmentEnum';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';
import { ICheckedBtnItem } from '@/interface/IGlobal';

import styles from '../../_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const { TextArea } = Input;
const { Option } = Select;

interface IProps {
    type: IEdiyKey;
}

const SellConfig: React.FC<IProps> = ({ type }) => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const [goodsTagList, setGoodsTagList] = useState<ICheckedBtnItem[]>([
        { name: '商品标签1', checked: false },
        { name: '商品标签1', checked: true },
    ]);

    const handleChangeName = useCallback(e => {
        console.log(11111, e);
        setName(e.target.value);
    }, []);

    return (
        <div className={styles.formContainer}>
            <div className={styles.title}>
                {EditEnum.ADD === type ? '新增' : '更新'}商品售价配置
            </div>
            <Form form={form}>
                <div className={styles.item}>
                    <Form.Item label="售价规则" name="a1" className={styles.customLabel}>
                        <Input
                            onChange={handleChangeName}
                            maxLength={32}
                            suffix={`${name.length}/32`}
                        />
                    </Form.Item>
                </div>
                <div className={styles.item}>
                    <Form.Item label="采购渠道" name="a2" className={styles.customLabel}>
                        <Select placeholder="请选择">
                            <Option value="1">PDD</Option>
                        </Select>
                    </Form.Item>
                </div>
                <div className={styles.item}>
                    <Form.Item label="销售渠道" name="a3" className={styles.customLabel}>
                        <Select placeholder="请选择">
                            <Option value="1">xxx</Option>
                        </Select>
                    </Form.Item>
                </div>
                <div className={styles.item}>
                    <Form.Item label="销售店铺" name="a4" className={styles.customLabel}>
                        <Select placeholder="请选择">
                            <Option value="1">xxx</Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item label="商品标签" className={styles.customLabel}>
                    <div>
                        {goodsTagList.map(item => (
                            <CheckedBtn item={item} key={item.name} />
                        ))}
                    </div>
                </Form.Item>
                <Form.Item label="爬虫价格区间" name="a5" className={styles.customLabel}>
                    <div className={classnames(styles.flex, styles.noneMargin)}>
                        <Form.Item name="min-price">
                            <InputNumber />
                        </Form.Item>
                        <div className={styles.gutter}>-</div>
                        <Form.Item name="max-price">
                            <InputNumber />
                        </Form.Item>
                        <div className={styles.extra}>¥</div>
                    </div>
                </Form.Item>
                <Form.Item label="排序等级" name="a6" className={styles.customLabel}>
                    <InputNumber precision={0} />
                </Form.Item>
                <div className={styles.flex}>
                    <Form.Item
                        label="价格系数(X)"
                        name="X"
                        className={classnames(styles.itemMargin, styles.customLabel)}
                    >
                        <InputNumber precision={0} />
                    </Form.Item>
                    <Form.Item label="固定调整(Y)" name="Y" className={styles.itemMargin}>
                        <InputNumber precision={0} />
                    </Form.Item>
                    <Form.Item label="运费放大系数(Z)" name="Z">
                        <InputNumber precision={0} />
                    </Form.Item>
                </div>
                <Form.Item
                    label="排序等级"
                    name="enable"
                    initialValue="1"
                    className={styles.customLabel}
                >
                    <Radio.Group>
                        <Radio value="1">是</Radio>
                        <Radio value="2">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <div className={styles.item}>
                    <Form.Item label="备注" name="remark" className={styles.customLabel}>
                        <TextArea />
                    </Form.Item>
                </div>
            </Form>
            <div className={styles.btnContainer}>
                <Button
                    ghost
                    type="primary"
                    className={classnames(styles.cancel, formStyles.formBtn)}
                >
                    返回
                </Button>
                <Button type="primary" className={formStyles.formBtn}>
                    保存
                </Button>
            </div>
        </div>
    );
};

export default React.memo(SellConfig);
