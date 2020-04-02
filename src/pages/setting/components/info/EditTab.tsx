import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FormField } from 'react-components/es/JsonForm';
import { JsonForm, LoadingButton } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { getCatagoryList } from '@/services/goods';
import { queryCountryList, queryCustomList, updateCustom } from '@/services/setting';
import { EmptyObject } from '@/config/global';
import { Form, Spin } from 'antd';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import styles from '@/styles/_index.less';
import classNames from 'classnames';

const EditTab: React.FC = () => {
    const countryRef = useRef<Promise<IOptionItem[]>>();
    if (!countryRef.current) {
        countryRef.current = queryCountryList();
    }

    const categoryRef = useRef<Promise<IOptionItem[]>>();

    if (!categoryRef.current) {
        categoryRef.current = getCatagoryList()
            .then(({ convertList = [] }) => {
                return convertList;
            })
            .catch(() => {
                return [];
            });
    }

    const [form] = Form.useForm();

    const getCountryName = useCallback(async (country_code: string) => {
        if (country_code === 'all') return undefined;
        const options = await countryRef.current!;
        return options.find(({ value }) => {
            return value === country_code;
        })?.name;
    }, []);

    const getCategoryName = useCallback(
        async (one_cat_id?: string, two_cat_id?: string, three_cat_id?: string) => {
            const options = await categoryRef.current!;
            let one_cat_name = undefined;
            let two_cat_name = undefined;
            let three_cat_name = undefined;
            if (!one_cat_id) {
                return {
                    one_cat_name,
                    two_cat_name,
                    three_cat_name,
                };
            }
            options.find(({ value, name, children }) => {
                if (value === one_cat_id) {
                    one_cat_name = name;
                    if (two_cat_id) {
                        (children as IOptionItem[])?.find(
                            ({ value: value1, name: name1, children: children1 }) => {
                                if (value1 === two_cat_id) {
                                    two_cat_name = name1;
                                    if (three_cat_id) {
                                        (children1 as IOptionItem[])?.find(
                                            ({ value: value2, name: name2 }) => {
                                                if (value2 === three_cat_id) {
                                                    three_cat_name = name2;
                                                    return true;
                                                }
                                                return false;
                                            },
                                        );
                                    }
                                    return true;
                                }
                                return false;
                            },
                        );
                    }
                    return true;
                } else {
                    return false;
                }
            });
            return {
                one_cat_name,
                two_cat_name,
                three_cat_name,
            };
        },
        [],
    );

    const [loading, setLoading] = useState(false);

    const queryDetail = useCallback((country_code: string) => {
        setLoading(true);
        if (country_code === 'all') {
            form.resetFields();
            setLoading(false);
            return;
        }
        queryCustomList({
            pageSize: 10,
            pageNumber: 1,
            country_code: country_code,
        })
            .then(({ data: { list } }) => {
                const detail = list[0] || EmptyObject;
                const {
                    oneCatId,
                    twoCatId,
                    threeCatId,
                    customsCode,
                    isElectricity = false,
                    isMetal = false,
                    isFluid = false,
                    isBurn = false,
                    isPowder = false,
                    isPureElectric = false,
                    isPerfume = false,
                    isFood = false,
                    isPaste = false,
                    ...extra
                } = detail;
                form.setFieldsValue({
                    one_cat_id: oneCatId,
                    two_cat_id: twoCatId,
                    three_cat_id: threeCatId,
                    customs_code: customsCode,
                    is_electricity: isElectricity,
                    is_metal: isMetal,
                    is_fluid: isFluid,
                    is_burn: isBurn,
                    is_powder: isBurn,
                    is_pure_electric: isPureElectric,
                    is_perfume: isPerfume,
                    is_food: isFood,
                    is_paste: isPaste,
                    ...extra,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const formConfig = useMemo<FormField[]>(() => {
        return [
            {
                label: <span>国&emsp;&emsp;家</span>,
                type: 'select',
                name: 'country_code',
                syncDefaultOption: {
                    value: 'all',
                    name: '全部',
                },
                className: '',
                optionList: () => countryRef.current!,
                formItemClassName: formStyles.formItem,
                onChange: (name, form) => {
                    const country_code = form.getFieldValue('country_code');
                    queryDetail(country_code);
                },
            },
            {
                label: '一级品类',
                type: 'select',
                name: 'one_cat_id',
                className: '',
                formItemClassName: formStyles.formItem,
                rules: [
                    {
                        required: true,
                        message: '请选择一级品类',
                    },
                ],
                optionList: () => categoryRef.current!,
                onChange: (name, form) => {
                    form.resetFields(['two_cat_id', 'three_cat_id']);
                },
            },
            {
                label: '二级品类',
                type: 'select',
                name: 'two_cat_id',
                className: '',
                formItemClassName: formStyles.formItem,
                optionListDependence: {
                    name: 'one_cat_id',
                    key: 'children',
                },
                rules: [
                    {
                        required: true,
                        message: '请选择二级品类',
                    },
                ],
                optionList: () => categoryRef.current!,
                onChange: (name, form) => {
                    form.resetFields(['three_cat_id']);
                },
            },
            {
                label: '三级品类',
                type: 'select',
                name: 'three_cat_id',
                className: '',
                formItemClassName: formStyles.formItem,
                optionListDependence: {
                    name: ['one_cat_id', 'two_cat_id'],
                    key: 'children',
                },
                rules: [
                    {
                        required: true,
                        message: '请选择三级品类',
                    },
                ],
                optionList: () => categoryRef.current!,
            },

            {
                label: <span>重&emsp;&emsp;量</span>,
                type: 'input',
                name: 'weight',
                className: '',
                addonAfter: 'g',
                formItemClassName: formStyles.formItem,
            },
            {
                label: '海关代码',
                type: 'input',
                name: 'customs_code',
                className: '',
                formItemClassName: formStyles.formItem,
            },
            {
                label: '预计长度',
                type: 'input',
                name: 'length',
                className: '',
                formItemClassName: formStyles.formItem,
                addonAfter: 'cm',
                placeholder: '填写包裹预计长度',
            },
            {
                label: '预计宽度',
                type: 'number',
                name: 'width',
                className: '',
                formItemClassName: formStyles.formItem,
                addonAfter: 'cm',
                placeholder: '填写包裹预计宽度',
            },
            {
                label: '预计高度',
                type: 'number',
                name: 'height',
                className: '',
                formItemClassName: formStyles.formItem,
                addonAfter: 'cm',
                placeholder: '填写包裹预计高度',
            },
            {
                label: '是否含电',
                type: 'radioGroup',
                name: 'is_electricity',
                formItemClassName: formStyles.formItem,
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
            },
            {
                label: '是否金属',
                type: 'radioGroup',
                name: 'is_metal',
                formItemClassName: formStyles.formItem,
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
            },
            {
                label: '是否液体',
                type: 'radioGroup',
                name: 'is_liquid',
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
                formItemClassName: formStyles.formItem,
            },
            {
                label: '是否可燃',
                type: 'radioGroup',
                name: 'is_combustible',
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
                formItemClassName: formStyles.formItem,
            },
            {
                label: '是否粉末',
                type: 'radioGroup',
                name: 'is_powder',
                formItemClassName: formStyles.formItem,
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
            },
            {
                label: '是否纯电',
                type: 'radioGroup',
                name: 'is_battery',
                formItemClassName: formStyles.formItem,
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
            },
            {
                label: '是否香水',
                type: 'radioGroup',
                name: 'is_perfume',
                formItemClassName: formStyles.formItem,
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
            },
            {
                label: '是否食品',
                type: 'radioGroup',
                name: 'is_food',
                formItemClassName: formStyles.formItem,
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
            },
            {
                label: '是否膏状',
                type: 'radioGroup',
                name: 'is_paste',
                formItemClassName: formStyles.formItem,
                options: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
            },
        ];
    }, []);

    const onSave = useCallback(async () => {
        const values = await form.validateFields();
        // 获取country_name
        const { country_code, one_cat_id, two_cat_id, three_cat_id } = values;
        const country_name = await getCountryName(country_code);
        const { one_cat_name, two_cat_name, three_cat_name } = await getCategoryName(
            one_cat_id,
            two_cat_id,
            three_cat_id,
        );
        await updateCustom({
            ...values,
            country_name,
            one_cat_name,
            two_cat_name,
            three_cat_name,
        });
    }, []);

    return useMemo(() => {
        return (
            <Spin spinning={loading}>
                <JsonForm
                    form={form}
                    className={classNames(
                        formStyles.formRequiredAbsolute,
                        formStyles.formHelpAbsolute,
                    )}
                    fieldList={formConfig}
                    itemCol={{ xl: 8, lg: 12, xs: 24 }}
                    itemRow={{ gutter: 60 }}
                    labelCol={{ xl: 8 }}
                    enableCollapse={false}
                    initialValues={{
                        is_electricity: false,
                        is_metal: false,
                        is_liquid: false,
                        is_combustible: false,
                        is_powder: false,
                        is_battery: false,
                        is_perfume: false,
                        is_food: false,
                        is_paste: false,
                        country_code: 'all',
                    }}
                />
                <div className={classNames(styles.textCenter, formStyles.formItem)}>
                    <LoadingButton onClick={onSave} type="primary" size="large">
                        提交
                    </LoadingButton>
                </div>
            </Spin>
        );
    }, [loading]);
};

export default EditTab;
