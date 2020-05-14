import React, { useMemo } from 'react';
import { JsonForm } from 'react-components';
import { FormField } from 'react-components/lib/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';

const VoVaGather = () => {
    const fieldList: FormField[] = [
        {
            type: 'input',
            label: '任务名称',
            name: 'task_name',
            rules: [
                {
                    required: true,
                    message: '请输入任务名称',
                },
            ],
        },
        {
            type: 'checkboxGroup',
            label: '爬取国家',
            name: 'task_name',
            options: [
                {
                    label: 'FR',
                    value: '',
                },
                {
                    label: 'DE',
                    value: '',
                },
                {
                    label: 'IT',
                    value: '',
                },
                {
                    label: 'GB',
                    value: '',
                },
                {
                    label: 'ES',
                    value: '',
                },
                {
                    label: 'US',
                    value: '',
                },
            ],
            rules: [
                {
                    required: true,
                    message: '请选择爬取国家',
                },
            ],
        },
        {
            type: 'select',
            label: '任务周期',
            name: 'task_range',
            optionList: [
                {
                    name: '单次任务',
                    value: '',
                },
            ],
            rules: [
                {
                    required: true,
                    message: '请选择任务周期',
                },
            ],
        },
        {
            type: 'datePicker',
            label: '任务开始时间',
            name: 'task_range',
            rules: [
                {
                    required: true,
                    message: '请选择任务开始时间',
                },
            ],
        },
    ];

    return useMemo(() => {
        return (
            <JsonForm
                layout="horizontal"
                className={formStyles.formHelpAbsolute}
                fieldList={fieldList}
            />
        );
    }, []);
};

export { VoVaGather };
