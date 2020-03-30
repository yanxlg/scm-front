import React, { useMemo, useRef } from 'react';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import formStyles from '@/styles/_form.less';

const formConfig: FormField[] = [
    {
        label: '一级品类',
        type: 'select',
        name: 'category_level_one',
        optionList: [{ name: '111', value: '2d' }],
        formItemClassName: formStyles.formItem,
        rules: [
            {
                required: true,
                message: '请选择一级品类',
            },
        ],
    },
    {
        label: '二级品类',
        type: 'select',
        name: 'category_level_two',
        optionList: [{ name: '111', value: '2d' }],
        formItemClassName: formStyles.formItem,
        rules: [
            {
                required: true,
                message: '请选择二级品类',
            },
        ],
    },
    {
        label: '三级品类',
        type: 'select',
        name: 'category_level_three',
        optionList: [{ name: '111', value: '2d' }],
        formItemClassName: formStyles.formItem,
        rules: [
            {
                required: true,
                message: '请选择三级品类',
            },
        ],
    },
    {
        label: <span>国&emsp;&emsp;家</span>,
        type: 'select',
        name: 'country',
        optionList: [{ name: '111', value: '2d' }],
        formItemClassName: formStyles.formItem,
    },
    {
        label: <span>重&emsp;&emsp;量</span>,
        type: 'input',
        name: 'weight',
        formItemClassName: formStyles.formItem,
    },
    {
        label: '海关代码',
        type: 'input',
        name: 'customs_code',
        formItemClassName: formStyles.formItem,
    },
    {
        label: '预计长度',
        type: 'input',
        name: 'length',
        formItemClassName: formStyles.formItem,
        addonAfter: 'cm',
        placeholder: '填写包裹预计长度',
    },
    {
        label: '预计宽度',
        type: 'number',
        name: 'width',
        formItemClassName: formStyles.formItem,
        addonAfter: 'cm',
        placeholder: '填写包裹预计宽度',
    },
    {
        label: '预计高度',
        type: 'number',
        name: 'height',
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
                value: 1,
            },
            {
                label: '否',
                value: 0,
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
                value: 1,
            },
            {
                label: '否',
                value: 0,
            },
        ],
    },
    {
        label: '是否液体',
        type: 'radioGroup',
        name: 'is_fluid',
        options: [
            {
                label: '是',
                value: 1,
            },
            {
                label: '否',
                value: 0,
            },
        ],
        formItemClassName: formStyles.formItem,
    },
    {
        label: '是否可燃',
        type: 'radioGroup',
        name: 'is_burn',
        options: [
            {
                label: '是',
                value: 1,
            },
            {
                label: '否',
                value: 0,
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
                value: 1,
            },
            {
                label: '否',
                value: 0,
            },
        ],
    },
    {
        label: '是否纯属',
        type: 'radioGroup',
        name: 'is_pure_electric',
        formItemClassName: formStyles.formItem,
        options: [
            {
                label: '是',
                value: 1,
            },
            {
                label: '否',
                value: 0,
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
                value: 1,
            },
            {
                label: '否',
                value: 0,
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
                value: 1,
            },
            {
                label: '否',
                value: 0,
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
                value: 1,
            },
            {
                label: '否',
                value: 0,
            },
        ],
    },
];

const EditTab: React.FC = () => {
    const formRef = useRef<SearchFormRef>(null);
    return useMemo(() => {
        return (
            <SearchForm
                ref={formRef}
                className={formStyles.formRequiredAbsolute}
                fieldList={formConfig}
                itemCol={{ xl: 8, lg: 12, xs: 24 }}
                itemRow={{ gutter: 60 }}
                labelCol={{ xl: 8 }}
                enableCollapse={false}
                initialValues={{
                    is_paste: 0,
                    is_food: 0,
                    is_perfume: 0,
                    is_pure_electric: 0,
                    is_powder: 0,
                    is_burn: 0,
                    is_fluid: 0,
                    is_metal: 0,
                    is_electricity: 0,
                }}
            />
        );
    }, []);
};

export default EditTab;
