import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Radio, Tooltip, Popconfirm, Spin, message } from 'antd';
import { IEdiyKey, ISaveSalePriceRuleReq } from '@/interface/IPriceStrategy';
import { EditEnum, requiredRule, maxLengthRule } from '@/enums/PriceStrategyEnum';
import CheckedBtn from '@/components/CheckedBtn';
import classnames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGoodsTag from '../../hooks/useGoodsTag';
import MultipleSelect from '@/components/MultipleSelect/MultipleSelect';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { validateRange } from '@/utils/validate';
import { saveSalePriceRule, getSalePriceRuleConfig } from '@/services/price-strategy';
import { numberToStr } from '@/utils/common';
import { getPurchasePlatform } from '@/services/global';

import styles from '../../_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const { TextArea } = Input;

interface IProps {
    type: IEdiyKey;
    id: string;
    sellChannelList: IOptionItem[];
    goBack(): void;
    onReload(): Promise<void>;
}

const SellConfig: React.FC<IProps> = ({ type, id, sellChannelList, goBack, onReload }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [purchasePlatformList, setPurchasePlatformList] = useState<IOptionItem[]>([]);
    const {
        goodsTagList,
        checkedGoodsTagList,
        toggleGoodsTag,
        setCheckedGoodsTagList,
    } = useGoodsTag();

    const onCancel = useCallback(() => {
        goBack();
        setLoading(false);
    }, []);

    const handleSave = useCallback(async () => {
        const data = await form.validateFields();
        // console.log('handleSave', data);
        // product_tags
        const {
            rule_name,
            enable_source,
            enable_platform,
            enable_merchant,
            min_origin_price,
            max_origin_price,
            order,
            param_price_multiply,
            param_price_add,
            param_shipping_fee_multiply,
            is_enable,
            comment,
        } = data;
        const postData: ISaveSalePriceRuleReq = {
            // action: EditEnum.ADD === type ? 'new' : 'update',
            is_enable,
            comment,
            enable_source: enable_source?.join(','),
            enable_platform: enable_platform?.join(','),
            enable_merchant: enable_merchant?.join(','),
            product_tags: checkedGoodsTagList?.join(','),
            min_origin_price: numberToStr(min_origin_price),
            max_origin_price: numberToStr(max_origin_price),
            order: numberToStr(order),
            param_price_multiply: numberToStr(param_price_multiply),
            param_price_add: numberToStr(param_price_add),
            param_shipping_fee_multiply: numberToStr(param_shipping_fee_multiply),
        };
        if (EditEnum.ADD === type) {
            postData.action = 'new';
            postData.rule_name = rule_name;
        } else {
            postData.action = 'update';
            postData.rule_id = id;
        }
        setLoading(true);
        saveSalePriceRule(postData)
            .then(res => {
                // console.log('saveSalePriceRule', res);
                goBack();
                onReload();
                message.success(`${EditEnum.ADD === type ? '新增' : '更新'}成功。`);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [type, checkedGoodsTagList, id]);

    useEffect(() => {
        getPurchasePlatform().then(list => {
            // console.log(1111, list);
            setPurchasePlatformList(list);
        });
    }, []);

    useEffect(() => {
        if (type === EditEnum.UPDATE && id) {
            setLoading(true);
            getSalePriceRuleConfig(id).then(res => {
                // console.log('getSalePriceRuleConfig', res);
                const { sale_price_rule } = res.data;
                const {
                    enable_source,
                    enable_platform,
                    enable_merchant,
                    product_tags,
                    ...reset
                } = sale_price_rule;
                if (reset.min_origin_price === '0') {
                    reset.min_origin_price = '';
                }
                if (reset.max_origin_price === '0') {
                    reset.max_origin_price = '';
                }
                setLoading(false);
                form.setFieldsValue({
                    ...reset,
                    enable_source: enable_source?.split(',') ?? [],
                    enable_platform: enable_platform?.split(',') ?? [],
                    enable_merchant: enable_merchant?.split(',') ?? [],
                });
                setCheckedGoodsTagList(sale_price_rule.product_tags?.split(',') ?? []);
            });
        }
    }, [id, type]);

    return (
        <div className={styles.formContainer}>
            <Spin spinning={loading}>
                <div className={styles.title}>
                    {EditEnum.ADD === type ? '新增' : '更新'}商品售价配置
                </div>
                <Form form={form} initialValues={{ is_enable: '1' }}>
                    <div className={classnames(styles.item, styles.customLabel)}>
                        <Form.Item
                            label="售价规则"
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
                    <div className={classnames(styles.item, styles.customLabel)}>
                        <MultipleSelect
                            label="采购渠道"
                            name="enable_source"
                            // className={styles.select}
                            form={form}
                            optionList={purchasePlatformList}
                            rules={[requiredRule]}
                        />
                    </div>
                    <div className={classnames(styles.item, styles.customLabel)}>
                        <MultipleSelect
                            label="销售渠道"
                            name="enable_platform"
                            // className={styles.select}
                            form={form}
                            optionList={sellChannelList}
                            rules={[requiredRule]}
                            onChange={() => {
                                form.resetFields(['enable_merchant']);
                            }}
                        />
                    </div>
                    <div className={classnames(styles.item, styles.customLabel)}>
                        <MultipleSelect
                            label="销售店铺"
                            name="enable_merchant"
                            // className={styles.select}
                            form={form}
                            optionList={sellChannelList}
                            dependencies={['enable_platform']}
                            rules={[requiredRule]}
                        />
                    </div>
                    <Form.Item label="商品标签" className={styles.customLabel}>
                        <div>
                            {goodsTagList.length > 0
                                ? goodsTagList.map(item => (
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
                        label="爬虫价格区间"
                        name="_"
                        className={styles.customLabel}
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
                            <Form.Item name="min_origin_price">
                                <InputNumber precision={2} />
                            </Form.Item>
                            <div className={styles.gutter}>-</div>
                            <Form.Item name="max_origin_price">
                                <InputNumber precision={2} />
                            </Form.Item>
                            <div className={styles.extra}>¥</div>
                        </div>
                    </Form.Item>
                    <Form.Item
                        label={
                            <>
                                排序等级
                                <Tooltip placement="bottomLeft" title="排序等级越高，优先级越高">
                                    <QuestionCircleOutlined style={{ marginLeft: 6 }} />
                                </Tooltip>
                            </>
                        }
                        name="order"
                        className={styles.customLabel}
                        rules={[requiredRule]}
                    >
                        <InputNumber precision={0} min={1} />
                    </Form.Item>
                    <div className={styles.flex}>
                        <Form.Item
                            label="价格系数(X)"
                            name="param_price_multiply"
                            className={classnames(styles.itemMargin, styles.customLabel)}
                            rules={[requiredRule]}
                        >
                            <InputNumber precision={2} min={0.01} />
                        </Form.Item>
                        <Form.Item
                            label="固定调整(Y)"
                            name="param_price_add"
                            className={styles.itemMargin}
                            rules={[requiredRule]}
                        >
                            <InputNumber precision={2} />
                        </Form.Item>
                        <Form.Item
                            label="运费放大系数(Z)"
                            name="param_shipping_fee_multiply"
                            rules={[requiredRule]}
                        >
                            <InputNumber precision={2} min={0.01} />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="是否启用"
                        name="is_enable"
                        // initialValue="1"
                        className={styles.customLabel}
                        required
                    >
                        <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <div className={styles.item} style={{ width: 450 }}>
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
                        onConfirm={onCancel}
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
                        <Button type="primary" loading={loading} className={formStyles.formBtn}>
                            保存
                        </Button>
                    </Popconfirm>
                </div>
            </Spin>
        </div>
    );
};

export default React.memo(SellConfig);
