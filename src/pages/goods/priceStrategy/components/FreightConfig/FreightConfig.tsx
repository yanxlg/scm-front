import React, { useState, useCallback } from 'react';
import { Form, Input, Row, Col, Select, Button, InputNumber, Radio, Tooltip } from 'antd';
import { IEdiyKey } from '@/interface/IPriceAdjustment';
import { EditEnum, requiredRule, maxLengthRule } from '@/enums/PriceAdjustmentEnum';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';
import { ICheckedBtnItem } from '@/interface/IGlobal';

import styles from '../../_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface IProps {
    type: IEdiyKey;
}

const FreightConfig: React.FC<IProps> = ({ type }) => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const [goodsTagList, setGoodsTagList] = useState<ICheckedBtnItem[]>([
        { name: '商品标签1', checked: false },
        { name: '商品标签1', checked: true },
    ]);

    const handleChangeName = useCallback(e => {
        // console.log(11111, e);
        setName(e.target.value);
    }, []);

    const handleSave = useCallback(async () => {
        const data = await form.validateFields();
        console.log(1111111, data);
    }, []);

    return (
        <div className={styles.formContainer}>
            <div className={styles.title}>{EditEnum.ADD === type ? '新增' : '更新'}运费规则</div>
            <Form form={form}>
                <div className={styles.item}>
                    <Form.Item
                        label="运费规则名称"
                        name="a1"
                        className={styles.customLabel}
                        rules={[requiredRule, maxLengthRule]}
                    >
                        <Input
                            onChange={handleChangeName}
                            maxLength={32}
                            suffix={`${name.length}/32`}
                        />
                    </Form.Item>
                </div>
                <Form.Item label="商品标签" className={styles.customLabel}>
                    <div>
                        {goodsTagList.map(item => (
                            <CheckedBtn item={item} key={item.name} />
                        ))}
                    </div>
                </Form.Item>
                <Form.Item label="重量区间" name="a5" className={styles.customLabel}>
                    <div className={classnames(styles.flex, styles.noneMargin)}>
                        <Form.Item name="min-price">
                            <InputNumber />
                        </Form.Item>
                        <div className={styles.gutter}>-</div>
                        <Form.Item name="max-price">
                            <InputNumber />
                        </Form.Item>
                        <div className={styles.extra}>g</div>
                    </div>
                </Form.Item>
                <Form.Item
                    label={
                        <>
                            排序等级
                            <Tooltip placement="bottomLeft" title="排序等级越高，优先级越高">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </>
                    }
                    name="a6"
                    className={styles.customLabel}
                    rules={[requiredRule]}
                >
                    <InputNumber precision={0} />
                </Form.Item>
                <Form.Item label="售价阈值($)" className={styles.customLabel}>
                    10
                </Form.Item>
                <div className={styles.item}>
                    <Form.Item
                        label="$10以下运费价卡"
                        name="a2"
                        className={styles.customLabel}
                        rules={[requiredRule]}
                    >
                        <Select placeholder="请选择">
                            <Option value="1">PDD</Option>
                        </Select>
                    </Form.Item>
                </div>
                <div className={styles.item}>
                    <Form.Item
                        label="$10以上运费价卡"
                        name="a3"
                        className={styles.customLabel}
                        rules={[requiredRule]}
                    >
                        <Select placeholder="请选择">
                            <Option value="1">xxx</Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item
                    label="是否启用"
                    name="enable"
                    initialValue="1"
                    className={styles.customLabel}
                    required
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
                <Button type="primary" className={formStyles.formBtn} onClick={() => handleSave()}>
                    保存
                </Button>
            </div>
        </div>
    );
};

export default React.memo(FreightConfig);
