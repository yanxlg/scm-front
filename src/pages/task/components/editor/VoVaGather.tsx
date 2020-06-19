import React, { useCallback, useMemo, useRef } from 'react';
import { JsonForm, LoadingButton } from 'react-components';
import { FormField } from 'react-components/lib/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { TaskExecuteType, TaskIntervalConfigType } from '@/enums/StatusEnum';
import TaskCycle from '@/pages/task/components/config/hot/TaskCycle';
import '@/styles/index.less';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { addVoVaTask } from '@/services/task';
import { EmptyObject } from '@/config/global';
import { showSuccessModal } from '@/pages/task/components/modal/GatherSuccessModal';
import { showFailureModal } from '@/pages/task/components/modal/GatherFailureModal';
import { dateToUnix } from 'react-components/es/utils/date';
import { queryShopList } from '@/services/global';

const fieldList: FormField[] = [
    {
        type: 'input',
        label: '任务名称',
        name: 'task_name',
        className: 'picker-default',
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
        name: 'country_code',
        options: [
            {
                label: 'FR',
                value: 'FR',
            },
            {
                label: 'DE',
                value: 'DE',
            },
            {
                label: 'IT',
                value: 'IT',
            },
            {
                label: 'GB',
                value: 'GB',
            },
            {
                label: 'ES',
                value: 'ES',
            },
            {
                label: 'US',
                value: 'US',
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
        type: 'component',
        Component: TaskCycle,
        names: [
            'task_type',
            'task_start_time',
            'task_start_time',
            'task_end_time',
            'taskIntervalType',
            'day',
            'second',
        ],
    },
];

const VoVaGather = () => {
    const formRef = useRef<JsonFormRef>(null);

    const convertFormData = useCallback(values => {
        const {
            task_start_time,
            day = 0,
            second,
            taskIntervalType,
            task_type,
            task_end_time,
            ...extra
        } = values;
        return {
            ...extra,
            task_type,
            is_immediately_execute: task_type === TaskExecuteType.once && !task_start_time,
            task_start_time: dateToUnix(task_start_time),
            ...(task_type === TaskExecuteType.once
                ? {}
                : {
                      task_interval_seconds:
                          taskIntervalType === TaskIntervalConfigType.second
                              ? second
                              : day * 60 * 60 * 24,
                  }),
            task_end_time:
                task_type === TaskExecuteType.interval ? dateToUnix(task_end_time) : undefined,
        };
    }, []);

    const onGather = useCallback(() => {
        return formRef.current!.validateFields().then(values => {
            const params = convertFormData(values);
            return addVoVaTask({
                ...params,
                is_upper_shelf: false,
            })
                .then(({ data = EmptyObject } = EmptyObject) => {
                    formRef.current!.resetFields();
                    showSuccessModal(data);
                })
                .catch(() => {
                    showFailureModal();
                });
        });
    }, []);

    const onGatherOn = useCallback(() => {
        return formRef.current!.validateFields().then(values => {
            const params = convertFormData(values);
            return queryShopList()
                .then(({ data = [] }) => {
                    const merchant = data.find(
                        ({ merchant_platform }) => merchant_platform === 'florynight',
                    );
                    if (merchant) {
                        return addVoVaTask({
                            ...params,
                            is_upper_shelf: true,
                            merchants_id: merchant.merchant_id,
                        })
                            .then(({ data = EmptyObject } = EmptyObject) => {
                                formRef.current!.resetFields();
                                showSuccessModal(data);
                            })
                            .catch(() => {
                                showFailureModal();
                            });
                    } else {
                        showFailureModal();
                    }
                })
                .catch(() => {
                    showFailureModal();
                });
        });
    }, []);

    return useMemo(() => {
        return (
            <>
                <JsonForm
                    ref={formRef}
                    initialValues={{
                        task_type: TaskExecuteType.once,
                        day: 1,
                        taskIntervalType: TaskIntervalConfigType.day,
                    }}
                    layout="horizontal"
                    className={formStyles.formHelpAbsolute}
                    fieldList={fieldList}
                />
                <div className={formStyles.formItem}>
                    <LoadingButton onClick={onGather} type="primary" className="btn-default">
                        开始采集
                    </LoadingButton>
                    <LoadingButton type="primary" className="btn-default" onClick={onGatherOn}>
                        一键采集上架
                    </LoadingButton>
                </div>
            </>
        );
    }, []);
};

export { VoVaGather };
