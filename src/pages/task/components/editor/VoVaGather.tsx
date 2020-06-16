import React, { useCallback, useMemo, useRef, useState } from 'react';
import { JsonForm, LoadingButton, useModal2 } from 'react-components';
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
import { Store } from 'rc-field-form/es/interface';
import { TaskChannelEnum } from '@/config/dictionaries/Task';
import MerchantListModal from '@/pages/goods/components/MerchantListModal';
import { Button } from 'antd';
import styles from '@/styles/_task.less';
import classNames from 'classnames';
import { queryGoodsSourceList } from '@/services/global';
import { EmptyArray } from 'react-components/es/utils';

const fdCountries = [
    {
        label: 'DE',
        value: 'DE',
    },
    {
        label: 'FR',
        value: 'FR',
    },
    {
        label: 'US',
        value: 'US',
    },
    {
        label: 'GB',
        value: 'GB',
    },
    {
        label: 'IT',
        value: 'IT',
    },
    {
        label: 'SE',
        value: 'SE',
    },
    {
        label: 'ES',
        value: 'ES',
    },
    {
        label: 'PL',
        value: 'PL',
    },
    {
        label: 'DK',
        value: 'DK',
    },
    {
        label: 'NO',
        value: 'NO',
    },
    {
        label: 'NA',
        value: 'NA',
    },
    {
        label: 'BE',
        value: 'BE',
    },
    {
        label: 'NL',
        value: 'NL',
    },
    {
        label: 'CH',
        value: 'CH',
    },
    {
        label: 'RO',
        value: 'RO',
    },
];

const VoVaCountries = [
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
];

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
        type: 'loading',
        loading: () => {
            return queryGoodsSourceList().then((list = EmptyArray) => {
                const options = list
                    .filter(({ value }) => {
                        return value !== TaskChannelEnum.PDD; // 排除PDD
                    })
                    .map(({ name, value }) => ({
                        label: name,
                        value: value,
                    }));
                return {
                    type: 'layout',
                    className: '',
                    fieldList: [
                        {
                            type: 'radioGroup',
                            label: '商品渠道',
                            name: 'channel',
                            options: options,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择采集渠道',
                                },
                            ],
                            onChange: (name, form) => {
                                const channel = form.getFieldValue('channel');
                                form.setFieldsValue({
                                    checkAll: ['all'],
                                    country_code: (channel === TaskChannelEnum.VOVA
                                        ? VoVaCountries
                                        : fdCountries
                                    ).map(item => item.value),
                                });
                            },
                        },
                        {
                            type: 'dynamic',
                            shouldUpdate: (prevValues: Store, nextValues: Store) => {
                                return prevValues.channel !== nextValues.channel;
                            },
                            dynamic: form => {
                                const channel = form.getFieldValue('channel');
                                return {
                                    type: 'layout',
                                    className: channel ? formStyles.formItem : '',
                                    fieldList: channel
                                        ? [
                                              {
                                                  type: 'checkboxGroup',
                                                  label: '爬取国家',
                                                  name: 'checkAll',
                                                  required: true,
                                                  initialValue: ['all'],
                                                  options: [
                                                      {
                                                          label: '全选',
                                                          value: 'all',
                                                      },
                                                  ],
                                                  formItemClassName: classNames(
                                                      formStyles.formItem,
                                                      styles.taskCheckAll,
                                                  ),
                                                  onChange: (name, form) => {
                                                      const checkedAll = form.getFieldValue(
                                                          'checkAll',
                                                      );
                                                      const channel = form.getFieldValue('channel');
                                                      if (
                                                          checkedAll &&
                                                          checkedAll.indexOf('all') > -1
                                                      ) {
                                                          form.setFieldsValue({
                                                              country_code:
                                                                  channel === TaskChannelEnum.VOVA
                                                                      ? VoVaCountries.map(
                                                                            item => item.value,
                                                                        )
                                                                      : fdCountries.map(
                                                                            item => item.value,
                                                                        ),
                                                          });
                                                      } else {
                                                          form.setFieldsValue({
                                                              country_code: [],
                                                          });
                                                      }
                                                  },
                                              },
                                              {
                                                  type: 'dynamic',
                                                  shouldUpdate: (
                                                      prevValues: Store,
                                                      nextValues: Store,
                                                  ) => {
                                                      return (
                                                          prevValues.channel !== nextValues.channel
                                                      );
                                                  },
                                                  dynamic: form => {
                                                      const channel = form.getFieldValue('channel');
                                                      const options =
                                                          channel === TaskChannelEnum.VOVA
                                                              ? VoVaCountries
                                                              : fdCountries;
                                                      return {
                                                          initialValue: options.map(
                                                              item => item.value,
                                                          ),
                                                          type: 'checkboxGroup',
                                                          label: '爬取国家',
                                                          name: 'country_code',
                                                          options: options,
                                                          formItemClassName: classNames(
                                                              'form-hide-label',
                                                              formStyles.formItem,
                                                              styles.taskCheckAll,
                                                          ),
                                                          rules: [
                                                              {
                                                                  required: true,
                                                                  message: '请选择爬取国家',
                                                              },
                                                          ],
                                                          onChange: (name, form) => {
                                                              const country_code = form.getFieldValue(
                                                                  'country_code',
                                                              );
                                                              if (
                                                                  country_code.length ===
                                                                  options.length
                                                              ) {
                                                                  form.setFieldsValue({
                                                                      checkAll: ['all'],
                                                                  });
                                                              } else {
                                                                  form.setFieldsValue({
                                                                      checkAll: [],
                                                                  });
                                                              }
                                                          },
                                                      };
                                                  },
                                              },
                                          ]
                                        : [],
                                };
                            },
                        },
                    ],
                };
            });
        },
        placeholder: {
            label: '采集渠道',
        },
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
        return formRef.current!.validateFields().then(({ checkAll, ...values }) => {
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

    const onGatherOnOKey = useCallback((merchant_ids: string[]) => {
        return formRef.current!.validateFields().then(({ checkAll, ...values }) => {
            const params = convertFormData(values);
            return addVoVaTask({
                ...params,
                is_upper_shelf: true,
                merchants_id: merchant_ids,
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

    const [merchantModal, showMerchantModal, closeMerchantModal] = useModal2<boolean>();

    const onGatherOn = useCallback(() => {
        formRef.current!.validateFields().then((values: any) => {
            showMerchantModal(true);
        });
    }, []);

    const modals = useMemo(() => {
        const { channel } = formRef.current?.getFieldsValue() || {};
        return (
            <MerchantListModal
                visible={merchantModal}
                onOKey={onGatherOnOKey}
                onCancel={closeMerchantModal}
                sourceChannel={channel}
            />
        );
    }, [merchantModal]);

    return useMemo(() => {
        return (
            <>
                <JsonForm
                    ref={formRef}
                    enableCollapse={false}
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
                    <Button type="primary" className="btn-default" onClick={onGatherOn}>
                        一键采集上架
                    </Button>
                </div>
                {modals}
            </>
        );
    }, [merchantModal]);
};

export { VoVaGather };
