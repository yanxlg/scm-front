import React, { useState, useCallback, useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    InputNumber,
    Radio,
    Tooltip,
    Popconfirm,
    Spin,
    message,
} from 'antd';
import { IEdiyKey, ISaveShippingFeeRuleReq } from '@/interface/IPriceStrategy';
import { EditEnum, requiredRule, maxLengthRule } from '@/enums/PriceStrategyEnum';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { saveShippingFeeRule, getShippingFeeRuleConfig } from '@/services/price-strategy';

import styles from '../../_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { validateRange } from '@/utils/validate';
import useGoodsTag from '../../hooks/useGoodsTag';
import { IOptionItem } from 'react-components/src/JsonForm/items/Select';
import { numberToStr } from '@/utils/common';

const { TextArea } = Input;
const { Option } = Select;

interface IProps {
    type: IEdiyKey;
    id?: string;
    cartNameList: IOptionItem[];
    // updateData: ISaveShippingFeeRuleReq | null;
    goBack(): void;
    onReload: () => Promise<void>;
}

const FreightConfig: React.FC<IProps> = ({ type, id, cartNameList, goBack, onReload }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const {
        goodsTagList,
        checkedGoodsTagList,
        toggleGoodsTag,
        setCheckedGoodsTagList,
    } = useGoodsTag();

    const handleCancel = useCallback(() => {
        setLoading(false);
        setCheckedGoodsTagList([]);
        form.resetFields();
        goBack();
    }, []);

    const _saveShippingFeeRule = useCallback((data: ISaveShippingFeeRuleReq) => {
        setSaveLoading(true);
        saveShippingFeeRule(data)
            .then(res => {
                // console.log('saveShippingFeeRule', res);
                handleCancel();
                onReload();
                message.success(`${data.action === 'new' ? '新增' : '更新'}成功。`);
            })
            .finally(() => {
                setSaveLoading(false);
            });
    }, []);

    const handleSave = useCallback(async () => {
        const data = await form.validateFields();
        const {
            rule_name,
            min_weight,
            max_weight,
            _,
            // order,
            // lower_shipping_card,
            // upper_shipping_card,
            // comment,
            ...reset
        } = data;
        const postData: any = {
            action: type === EditEnum.ADD ? 'new' : 'update',
            product_tags: checkedGoodsTagList.join(','),
            min_weight: numberToStr(min_weight),
            max_weight: numberToStr(max_weight),
            ...reset,
        };
        if (type === EditEnum.ADD) {
            postData.rule_name = rule_name;
        } else {
            postData.id = id;
        }
        _saveShippingFeeRule(postData);
    }, [type, checkedGoodsTagList, id]);

    useEffect(() => {
        if (EditEnum.UPDATE === type && id) {
            setLoading(true);
            getShippingFeeRuleConfig(id).then(res => {
                // console.log('getShippingFeeRuleConfig', res);
                const { shipping_fee_rule } = res.data;
                if (shipping_fee_rule.min_weight === '0') {
                    shipping_fee_rule.min_weight = '';
                }
                if (shipping_fee_rule.max_weight === '0') {
                    shipping_fee_rule.max_weight = '';
                }
                setLoading(false);
                form.setFieldsValue(shipping_fee_rule);
                setCheckedGoodsTagList(shipping_fee_rule.product_tags?.split(',') ?? []);
            });
        }
    }, [id, type]);

    return (
        <div className={styles.formContainer}>
            <div className={styles.title}>{EditEnum.ADD === type ? '新增' : '更新'}运费规则</div>
            <Spin spinning={loading}>
                <Form form={form} initialValues={{ is_enable: '1' }}>
                    <div className={styles.item}>
                        <Form.Item
                            label="运费规则名称"
                            name="rule_name"
                            className={styles.customLabel}
                            rules={[requiredRule, maxLengthRule]}
                        >
                            <Input
                                disabled={EditEnum.UPDATE === type}
                                maxLength={32}
                                placeholder="限制32个字符"
                            />
                        </Form.Item>
                    </div>
                    <Form.Item label="商品标签" className={styles.customLabel}>
                        <div>
                            {goodsTagList.length > 0
                                ? goodsTagList.map((item, index) => (
                                      <CheckedBtn
                                          item={item}
                                          key={item.name}
                                          onClick={() => toggleGoodsTag(item.name)}
                                      />
                                  ))
                                : '--'}
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="重量区间"
                        name="_"
                        dependencies={['min_weight', 'max_weight']}
                        className={styles.customLabel}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    return validateRange(getFieldValue, 'min_weight', 'max_weight');
                                },
                            }),
                        ]}
                    >
                        <div className={classnames(styles.flex, styles.noneMargin)}>
                            <Form.Item name="min_weight">
                                <InputNumber
                                    precision={4}
                                    min={0.0001}
                                    className={styles.inputNumber}
                                />
                            </Form.Item>
                            <div className={styles.gutter}>-</div>
                            <Form.Item name="max_weight">
                                <InputNumber
                                    precision={4}
                                    min={0.0001}
                                    className={styles.inputNumber}
                                />
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
                        name="order"
                        className={styles.customLabel}
                        rules={[requiredRule]}
                    >
                        <InputNumber precision={0} min={1} className={styles.inputNumber} />
                    </Form.Item>
                    <Form.Item label="售价阈值($)" className={styles.customLabel}>
                        10
                    </Form.Item>
                    <div className={styles.item}>
                        <Form.Item
                            label="$10以下运费价卡"
                            name="lower_shipping_card"
                            className={styles.customLabel}
                            rules={[requiredRule]}
                        >
                            <Select placeholder="请选择">
                                {cartNameList.map(({ name, value }) => (
                                    <Option value={value} key={name}>
                                        {name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.item}>
                        <Form.Item
                            label="$10以上运费价卡"
                            name="upper_shipping_card"
                            className={styles.customLabel}
                            rules={[requiredRule]}
                        >
                            <Select placeholder="请选择">
                                {cartNameList.map(({ name, value }) => (
                                    <Option value={value} key={name}>
                                        {name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="是否启用"
                        name="is_enable"
                        className={styles.customLabel}
                        required
                    >
                        <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <div className={styles.item}>
                        <Form.Item
                            label="备注"
                            name="comment"
                            className={styles.customLabel}
                            // rules={[requiredRule]}
                        >
                            <TextArea />
                        </Form.Item>
                    </div>
                </Form>
                <div className={styles.btnContainer}>
                    <Popconfirm
                        title="返回数据将清空，确认返回吗？"
                        onConfirm={handleCancel}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button
                            ghost
                            type="primary"
                            className={classnames(styles.cancel, formStyles.formBtn)}
                        >
                            返回
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="确认保存吗？"
                        onConfirm={handleSave}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="primary" loading={saveLoading} className={formStyles.formBtn}>
                            保存
                        </Button>
                    </Popconfirm>
                </div>
            </Spin>
        </div>
    );
};

export default React.memo(FreightConfig);
