import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonForm, LoadingButton, RichInput, useModal } from 'react-components';
import { queryShopFilterList } from '@/services/global';
import Container from '@/components/Container';
import { queryPriceStrategy, updatePriceStrategy } from '@/services/setting';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { Button, Form, message, Select, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from '@/styles/_store.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import { IPriceStrategy } from '@/interface/ISetting';
import PriceStrategyModal from '../components/PriceStrategyModal';

const PriceStrategy = () => {
    const formRef = useRef<JsonFormRef>(null);
    const [hasData, setHasData] = useState(false);
    const [editFormInstance] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cacheData, setCacheData] = useState<IPriceStrategy | null>(null);

    const [edit, setEdit] = useState(false);

    const { visible, setVisibleProps, onClose } = useModal<string>();

    const showHistory = useCallback(() => {
        formRef.current!.validateFields().then(values => {
            setVisibleProps(values['merchant_id']);
        });
    }, []);

    const queryDetail = useCallback(() => {
        return formRef.current!.validateFields().then(values => {
            setLoading(true);
            return queryPriceStrategy(values['merchant_id'])
                .then(({ data }) => {
                    if (data) {
                        const { first_fix_price_value, second_fix_price_value, ...extra } = data;
                        const values = {
                            ...extra,
                            first_fix_price_value: Number(first_fix_price_value) / 6.9,
                            second_fix_price_value: Number(second_fix_price_value) / 6.9,
                        };
                        setHasData(true);
                        setCacheData(values);
                        // form reset
                        editFormInstance.setFieldsValue(values);
                    } else {
                        setCacheData(null);
                        setHasData(false);
                        editFormInstance.resetFields();
                    }
                })
                .catch(() => {
                    setCacheData(null);
                    setHasData(false);
                    editFormInstance.resetFields();
                })
                .finally(() => {
                    setLoading(false);
                });
        });
    }, []);

    const initPriceStrategy = useCallback(() => {
        formRef.current!.validateFields().then(() => {
            setHasData(true);
            setEdit(true);
        });
    }, []);

    const clearEdit = useCallback(() => {
        if (cacheData) {
            editFormInstance.setFieldsValue(cacheData);
            setEdit(false);
        } else {
            editFormInstance.resetFields();
            setEdit(false);
            setHasData(false);
        }
    }, [cacheData]);

    const startEdit = useCallback(() => {
        setEdit(true);
    }, []);

    const savePriceStrategy = useCallback(() => {
        const { merchant_id } = formRef.current!.getFieldsValue();
        return editFormInstance.validateFields().then((_values: any) => {
            const { first_fix_price_value, second_fix_price_value, ...extra } = _values;
            const values = {
                ...extra,
                first_fix_price_value: Number(first_fix_price_value) * 6.9,
                second_fix_price_value: Number(second_fix_price_value) * 6.9,
            };

            return updatePriceStrategy({
                merchant_id,
                ...values,
            }).then(() => {
                message.success('保存成功');
                setEdit(false);
                setCacheData(_values);
            });
        });
    }, []);

    const form = useMemo(() => {
        return (
            <JsonForm
                ref={formRef}
                className={formStyles.formHelpAbsolute}
                fieldList={[
                    {
                        type: 'select',
                        label: '销售渠道',
                        name: 'channel',
                        placeholder: '请选择渠道',
                        optionList: () => queryShopFilterList(),
                        onChange: (name, form) => {
                            form.resetFields(['merchant_id']);
                        },
                        rules: [
                            {
                                required: true,
                                message: '请选择渠道',
                            },
                        ],
                    },
                    {
                        type: 'select',
                        label: '销售店铺名称',
                        name: 'merchant_id',
                        placeholder: '请选择店铺',
                        optionListDependence: {
                            name: 'channel',
                            key: 'children',
                        },
                        optionList: () => queryShopFilterList(),
                        rules: [
                            {
                                required: true,
                                message: '请选择渠道',
                            },
                        ],
                        onChange: () => {
                            queryDetail();
                        },
                    },
                ]}
            >
                {cacheData ? (
                    <>
                        <LoadingButton
                            onClick={queryDetail}
                            className={classNames(styles.refresh, formStyles.formBtn)}
                        >
                            刷新
                        </LoadingButton>
                        <Button
                            type="link"
                            className={classNames(formStyles.formBtn, styles.right)}
                            onClick={showHistory}
                        >
                            查看历史记录
                        </Button>
                    </>
                ) : null}
            </JsonForm>
        );
    }, [cacheData, loading]);

    const naturalNumberValidate = useCallback((rule, value) => {
        if (isNaN(Number(value))) {
            return Promise.reject('输入的非数字');
        } else {
            return Promise.resolve();
        }
    }, []);

    const editForm = useMemo(() => {
        const disabled = !edit;
        return (
            <Spin spinning={loading}>
                {hasData ? (
                    <Form
                        form={editFormInstance}
                        layout="horizontal"
                        className={classNames(formStyles.formHelpAbsolute, styles.disable)}
                    >
                        <div className={classNames(styles.title, formStyles.formItem)}>
                            价格判断公式
                        </div>
                        <div>
                            <Form.Item
                                label="采购的爬虫价"
                                name="first_purchase_crawler_price_condition"
                                colon={false}
                                className={classNames(formStyles.formItem, formStyles.formHorizon)}
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择关系运算符',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="<="
                                    className={styles.select}
                                    disabled={disabled}
                                >
                                    <Select.Option value={1} children="<" />
                                    <Select.Option value={2} children="=" />
                                    <Select.Option value={3} children=">" />
                                    <Select.Option value={4} children="<=" />
                                    <Select.Option value={5} children=">=" />
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="销售的爬虫价"
                                name="first_sale_crawler_price_value"
                                colon={false}
                                className={classNames(
                                    formStyles.formItem,
                                    formStyles.formHorizon,
                                    styles.afterItem,
                                )}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入销售爬虫价',
                                    },
                                ]}
                            >
                                <RichInput
                                    richType="number"
                                    className={styles.select}
                                    addonAfter="%"
                                    disabled={disabled}
                                />
                            </Form.Item>
                            <Form.Item
                                className={classNames(formStyles.formItem, formStyles.formHorizon)}
                            >
                                +
                            </Form.Item>
                            <Form.Item
                                label="固定金额"
                                name="first_fix_price_value"
                                colon={false}
                                validateTrigger={'onBlur'}
                                className={classNames(formStyles.formItem, formStyles.formHorizon)}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入固定金额',
                                    },
                                    {
                                        validator: naturalNumberValidate,
                                    },
                                ]}
                            >
                                <RichInput
                                    richType="naturalNumber"
                                    className={styles.select}
                                    addonAfter="$"
                                    disabled={disabled}
                                />
                            </Form.Item>
                            <Form.Item
                                className={classNames(
                                    formStyles.formItem,
                                    formStyles.formHorizon,
                                    styles.priceAfter,
                                )}
                            >
                                * 6.9
                            </Form.Item>
                        </div>

                        <Form.Item
                            label=""
                            name="middle_condition"
                            colon={false}
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择关系运算符',
                                },
                            ]}
                        >
                            <Select placeholder="且" className={styles.select} disabled={disabled}>
                                <Select.Option value={1} children="且" />
                                <Select.Option value={2} children="或" />
                            </Select>
                        </Form.Item>
                        <div>
                            <Form.Item
                                label="采购的爬虫价"
                                name="second_purchase_crawler_price_condition"
                                colon={false}
                                className={classNames(formStyles.formItem, formStyles.formHorizon)}
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择关系运算符',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="<="
                                    className={styles.select}
                                    disabled={disabled}
                                >
                                    <Select.Option value={1} children="<" />
                                    <Select.Option value={2} children="=" />
                                    <Select.Option value={3} children=">" />
                                    <Select.Option value={4} children="<=" />
                                    <Select.Option value={5} children=">=" />
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="销售的爬虫价"
                                name="second_sale_crawler_price_value"
                                colon={false}
                                className={classNames(
                                    formStyles.formItem,
                                    formStyles.formHorizon,
                                    styles.afterItem,
                                )}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入销售爬虫价',
                                    },
                                ]}
                            >
                                <RichInput
                                    richType="number"
                                    className={styles.select}
                                    addonAfter="%"
                                    disabled={disabled}
                                />
                            </Form.Item>
                            <Form.Item
                                className={classNames(formStyles.formItem, formStyles.formHorizon)}
                            >
                                +
                            </Form.Item>
                            <Form.Item
                                label="固定金额"
                                name="second_fix_price_value"
                                colon={false}
                                className={classNames(formStyles.formItem, formStyles.formHorizon)}
                                validateTrigger={'onBlur'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入固定金额',
                                    },
                                    {
                                        validator: naturalNumberValidate,
                                    },
                                ]}
                            >
                                <RichInput
                                    richType="naturalNumber"
                                    className={styles.select}
                                    addonAfter="$"
                                    disabled={disabled}
                                />
                            </Form.Item>
                            <Form.Item
                                className={classNames(
                                    formStyles.formItem,
                                    formStyles.formHorizon,
                                    styles.priceAfter,
                                )}
                            >
                                * 6.9
                            </Form.Item>
                        </div>
                        {edit ? (
                            <div className={formStyles.formItem}>
                                <LoadingButton
                                    type="primary"
                                    className={formStyles.formBtn}
                                    onClick={savePriceStrategy}
                                >
                                    保存
                                </LoadingButton>
                                <Button className={formStyles.formBtn} onClick={clearEdit}>
                                    取消编辑
                                </Button>
                            </div>
                        ) : (
                            <div className={formStyles.formItem}>
                                <Button
                                    type="primary"
                                    className={formStyles.formBtn}
                                    onClick={startEdit}
                                >
                                    编辑
                                </Button>
                            </div>
                        )}
                    </Form>
                ) : (
                    <Button
                        type="primary"
                        ghost={true}
                        size="small"
                        onClick={initPriceStrategy}
                        icon={<PlusOutlined />}
                    >
                        添加价格判断公式
                    </Button>
                )}
            </Spin>
        );
    }, [hasData, loading, edit, cacheData]);

    return useMemo(() => {
        return (
            <Container>
                {form}
                {editForm}
                <PriceStrategyModal onClose={onClose} visible={visible} />
            </Container>
        );
    }, [hasData, loading, edit, cacheData, visible]);
};

export default PriceStrategy;
