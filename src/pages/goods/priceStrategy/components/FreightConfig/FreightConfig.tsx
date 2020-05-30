import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, InputNumber, Radio, Tooltip, Popconfirm } from 'antd';
import { IEdiyKey, ISaveShippingFeeRuleReq } from '@/interface/IPriceStrategy';
import { EditEnum, requiredRule, maxLengthRule } from '@/enums/PriceStrategyEnum';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';
import { ICheckedBtnItem } from '@/interface/IGlobal';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { saveShippingFeeRule, getAllGoodsTagList } from '@/services/price-strategy';

import styles from '../../_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { validateRange } from '@/utils/validate';

const { TextArea } = Input;
const { Option } = Select;

interface IProps {
    type: IEdiyKey;
    updateData: ISaveShippingFeeRuleReq | null;
    goBack(): void;
}

const FreightConfig: React.FC<IProps> = ({ type, updateData, goBack }) => {
    const [form] = Form.useForm();
    const [saveLoading, setSaveLoading] = useState(false);
    const [name, setName] = useState('');
    // const [goodsTagList, setGoodsTagList] = useState<ICheckedBtnItem[]>([]);
    const [allGoodsTagList, setAllGoodsTagList] = useState<string[]>([]);
    const [checkedGoodsTagList, setCheckedGoodsTagList] = useState<string[]>([]);

    const handleChangeName = useCallback(e => {
        // console.log(11111, e);
        setName(e.target.value);
    }, []);

    const toggleGoodsTag = useCallback(
        (name: string) => {
            const index = checkedGoodsTagList.findIndex(currentName => currentName === name);
            if (index > -1) {
                const list = [...checkedGoodsTagList];
                list.splice(index, 1);
                setCheckedGoodsTagList(list);
            } else {
                setCheckedGoodsTagList([...checkedGoodsTagList, name]);
            }
        },
        [checkedGoodsTagList],
    );

    const _saveShippingFeeRule = useCallback((data: ISaveShippingFeeRuleReq) => {
        setSaveLoading(true);
        saveShippingFeeRule(data)
            .then(res => {
                console.log('saveShippingFeeRule', res);
            })
            .finally(() => {
                setSaveLoading(false);
            });
    }, []);

    const handleSave = useCallback(async () => {
        const data = await form.validateFields();
        console.log(1111111, data);
        const {
            rule_name,
            min_weight,
            max_weight,
            order,
            lower_shipping_card,
            upper_shipping_card,
            comment,
        } = data;
    }, []);

    const goodsTagList = useMemo(() => {
        return allGoodsTagList.map(name => {
            return {
                name: name,
                checked: checkedGoodsTagList.indexOf(name) > -1,
            };
        });
    }, [allGoodsTagList, checkedGoodsTagList]);

    useEffect(() => {
        getAllGoodsTagList().then(list => {
            setAllGoodsTagList(list.map(({ name }: any) => name));
        });
    }, []);

    useEffect(() => {
        if (updateData) {
            form.setFieldsValue(updateData);
            setName(updateData.rule_name as string);
            setCheckedGoodsTagList(updateData.product_tags?.split(',') ?? []);
        }
    }, [updateData]);

    return (
        <div className={styles.formContainer}>
            <div className={styles.title}>{EditEnum.ADD === type ? '新增' : '更新'}运费规则</div>
            <Form form={form} initialValues={{ enable: '1' }}>
                <div className={styles.item}>
                    <Form.Item
                        label="运费规则名称"
                        name="rule_name"
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
                        {goodsTagList.map((item, index) => (
                            <CheckedBtn
                                item={item}
                                key={item.name}
                                onClick={() => toggleGoodsTag(item.name)}
                            />
                        ))}
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
                    <InputNumber precision={0} className={styles.inputNumber} />
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
                            <Option value="1">PDD</Option>
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
                            <Option value="1">xxx</Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item label="是否启用" name="enable" className={styles.customLabel} required>
                    <Radio.Group>
                        <Radio value="1">是</Radio>
                        <Radio value="2">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <div className={styles.item}>
                    <Form.Item
                        label="备注"
                        name="comment"
                        className={styles.customLabel}
                        rules={[requiredRule]}
                    >
                        <TextArea />
                    </Form.Item>
                </div>
            </Form>
            <div className={styles.btnContainer}>
                <Popconfirm
                    title="返回数据将清空，确认返回吗？"
                    onConfirm={goBack}
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
        </div>
    );
};

export default React.memo(FreightConfig);
