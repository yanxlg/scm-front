import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FormField } from 'react-components/es/JsonForm';
import { JsonForm, LoadingButton } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { getCatagoryList } from '@/services/goods';
import { queryCountryList, queryCustomList, updateCustom } from '@/services/setting';
import { EmptyObject } from '@/config/global';
import { Form, message, Spin } from 'antd';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import styles from '@/styles/_index.less';
import classNames from 'classnames';

const EditTab: React.FC = () => {
    const countryRef = useRef<Promise<IOptionItem[]>>();
    if (!countryRef.current) {
        countryRef.current = queryCountryList();
    }

    const categoryRef = useRef<
        Promise<{
            oneLevelArray: IOptionItem[];
            middleLevelArray: IOptionItem[];
            lastLevelArray: IOptionItem[];
        }>
    >();

    if (!categoryRef.current) {
        categoryRef.current = getCatagoryList()
            .then(({ convertList = [] }) => {
                // 区分出一级、二级、三级
                let oneLevelArray: IOptionItem[] = [];
                let middleLevelArray: IOptionItem[] = [];
                let lastLevelArray: IOptionItem[] = [];
                convertList.map(({ name, value, children }) => {
                    oneLevelArray.push({ name, value });
                    if (children) {
                        (children as IOptionItem[]).map(
                            ({ name: name1, value: value1, children: children1 }) => {
                                middleLevelArray.push({ name: name1, value: value1 });
                                if (children1) {
                                    (children1 as IOptionItem[]).map(
                                        ({ name: name2, value: value2 }) => {
                                            lastLevelArray.push({
                                                name: name2,
                                                value: value2,
                                                middle_id: value1,
                                                first_id: value,
                                            });
                                        },
                                    );
                                }
                            },
                        );
                    }
                });
                return {
                    oneLevelArray,
                    middleLevelArray,
                    lastLevelArray,
                };
            })
            .catch(() => {
                return {
                    oneLevelArray: [],
                    middleLevelArray: [],
                    lastLevelArray: [],
                };
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
            const { oneLevelArray, middleLevelArray, lastLevelArray } = await categoryRef.current!;
            return {
                one_cat_name: one_cat_id
                    ? oneLevelArray.find(option => option.value === one_cat_id)?.name
                    : undefined,
                two_cat_name: two_cat_id
                    ? middleLevelArray.find(option => option.value === two_cat_id)?.name
                    : undefined,
                three_cat_name: three_cat_id
                    ? lastLevelArray.find(option => option.value === three_cat_id)?.name
                    : undefined,
            };
        },
        [],
    );

    const [loading, setLoading] = useState(false);

    const queryDetail = useCallback(
        (country_code: string, one_cat_id: string, two_cat_id: string, three_cat_id: string) => {
            setLoading(true);

            queryCustomList({
                pageSize: 1,
                pageNumber: 1,
                country_code: country_code,
                one_cat_id: one_cat_id,
                two_cat_id: two_cat_id,
                three_cat_id: three_cat_id,
            })
                .then(({ data: { list } }) => {
                    const detail = list[0] || EmptyObject;
                    const {
                        customsCode,
                        isElectricity = false,
                        isMetal = false,
                        isLiquid = false,
                        isCombustible = false,
                        isPowder = false,
                        isBattery = false,
                        isPerfume = false,
                        isFood = false,
                        isPaste = false,
                        weight = '',
                        length = '',
                        width = '',
                        height = '',
                        ...extra
                    } = detail;
                    form.setFieldsValue({
                        customs_code: customsCode,
                        is_electricity: isElectricity,
                        is_metal: isMetal,
                        is_liquid: isLiquid,
                        is_combustible: isCombustible,
                        is_powder: isPowder,
                        is_battery: isBattery,
                        is_perfume: isPerfume,
                        is_food: isFood,
                        is_paste: isPaste,
                        weight: weight,
                        length: length,
                        width: width,
                        height: height,
                        ...extra,
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [],
    );

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
                onChange: (name, form) => {
                    const country_code = form.getFieldValue('country_code');
                    const { one_cat_id, two_cat_id, three_cat_id } = form.getFieldsValue([
                        'one_cat_id',
                        'two_cat_id',
                        'three_cat_id',
                    ]);
                    if (country_code === 'all') {
                        form.resetFields();
                        return;
                    }
                    if (!three_cat_id) {
                        return;
                    }
                    queryDetail(country_code, one_cat_id, two_cat_id, three_cat_id);
                },
            },
            {
                label: '一级品类',
                type: 'select',
                name: 'one_cat_id',
                className: '',
                rules: [
                    {
                        required: true,
                        message: '请选择一级品类',
                    },
                ],
                disabled: true,
                optionList: () => categoryRef.current!.then(result => result.oneLevelArray),
            },
            {
                label: '二级品类',
                type: 'select',
                name: 'two_cat_id',
                className: '',
                disabled: true,
                rules: [
                    {
                        required: true,
                        message: '请选择二级品类',
                    },
                ],
                optionList: () => categoryRef.current!.then(result => result.middleLevelArray),
            },
            {
                label: '三级品类',
                type: 'select',
                name: 'three_cat_id',
                className: '',
                showSearch: true,
                optionFilterProp: 'children',
                rules: [
                    {
                        required: true,
                        message: '请选择三级品类',
                    },
                ],
                optionList: () => categoryRef.current!.then(result => result.lastLevelArray),
                onChange: (name, form) => {
                    const cat_id = form.getFieldValue('three_cat_id');
                    categoryRef.current!.then(({ lastLevelArray }) => {
                        const item = lastLevelArray.find(option => option.value === cat_id);
                        form.setFieldsValue({
                            two_cat_id: item?.middle_id,
                            one_cat_id: item?.first_id,
                        });

                        const country_code = form.getFieldValue('country_code');
                        if (!country_code || country_code === 'all') {
                            return;
                        }
                        queryDetail(country_code, item?.first_id, item?.middle_id, cat_id);
                    });
                },
            },

            {
                label: <span>重&emsp;&emsp;量</span>,
                type: 'input',
                name: 'weight',
                className: '',
                addonAfter: 'g',
            },
            {
                label: '海关代码',
                type: 'input',
                name: 'customs_code',
                className: '',
            },
            {
                label: '预计长度',
                type: 'input',
                name: 'length',
                className: '',
                addonAfter: 'cm',
                placeholder: '填写包裹预计长度',
            },
            {
                label: '预计宽度',
                type: 'number',
                name: 'width',
                className: '',
                addonAfter: 'cm',
                placeholder: '填写包裹预计宽度',
            },
            {
                label: '预计高度',
                type: 'number',
                name: 'height',
                className: '',
                addonAfter: 'cm',
                placeholder: '填写包裹预计高度',
            },
            {
                label: '是否含电',
                type: 'radioGroup',
                name: 'is_electricity',
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
            },
            {
                label: '是否粉末',
                type: 'radioGroup',
                name: 'is_powder',
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
        message.success('提交成功!');
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
