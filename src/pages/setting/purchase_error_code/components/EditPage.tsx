import React, { useCallback, useMemo, useRef } from 'react';
import Container from '@/components/Container';
import { Typography, Button, Popconfirm, message } from 'antd';
import { JsonForm, LoadingButton } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import styles from '../index.module.less';
import { updateErrorCode } from '@/services/setting';
import { ConnectState } from '@/models/connect';
import { IErrorConfigItem } from '@/interface/ISetting';
import { useSelector } from '@@/plugin-dva/exports';
const { Title } = Typography;

export declare interface EditPageProps {
    type: 'edit' | 'add';
    data?: IErrorConfigItem;
    onClose: () => void;
    onReload: () => any;
}

const EditPage: React.FC<EditPageProps> = ({ type, data, onClose, onReload }) => {
    const formRef = useRef<JsonFormRef>(null);

    const onOKey = useCallback(() => {
        return formRef.current!.validateFields().then(values => {
            const { middle_code_type, middle_code, middle_text, remark } = values;
            return updateErrorCode({
                middle_code_type,
                middle_code,
                middle_text,
                remark,
                id: data!.id,
                save_type: 2,
            }).then(() => {
                message.success('更新成功！');
                onClose();
                onReload();
            });
        });
    }, []);

    const platformErrorMap = useSelector((state: ConnectState) => state.options.platformErrorMap);

    const fieldList: FormField[] = useMemo(() => {
        return [
            {
                type: 'select@2',
                label: '采购渠道',
                name: 'purchase_channel',
                defaultCheckedType: 'checkedAll',
                options: {
                    selector: (state: ConnectState) => {
                        return state.options.purchaseChannel;
                    },
                },
                childrenProps: {
                    mode: 'tags',
                    disabled: true,
                },
            },
            {
                type: 'input@2',
                name: 'channel_code',
                label: '渠道错误码',
                childrenProps: {
                    disabled: true,
                },
            },
            {
                type: 'textarea@2',
                name: 'channel_text',
                label: '渠道错误文案',
                childrenProps: {
                    disabled: true,
                },
            },
            {
                type: 'select@2',
                name: 'order_code',
                label: '订单错误码',
                initialValue: 1,
                defaultOption: false,
                options: [
                    {
                        label: '新生成',
                        value: 1,
                    },
                ],
                childrenProps: {
                    disabled: true,
                },
            },
            {
                type: 'layout',
                fieldList: [
                    {
                        type: 'select@2',
                        name: 'middle_code_type',
                        initialValue: 2,
                        label: '中台错误码',
                        className: classNames(formStyles.formHorizon, formStyles.formItem),
                        defaultOption: false,
                        options: [
                            {
                                label: '已有值',
                                value: 2,
                            },
                            {
                                label: '新生成',
                                value: 1,
                            },
                        ],
                        onChange: (name, form) => {
                            form.setFieldsValue({
                                middle_code: undefined,
                                middle_text: undefined,
                            });
                        },
                    },
                    {
                        type: 'dynamic',
                        shouldUpdate: (before, next) => {
                            return before.middle_code_type !== next.middle_code_type;
                        },
                        dynamic: form => {
                            const platformCodeType = form.getFieldValue('middle_code_type');
                            return platformCodeType === 1
                                ? undefined
                                : {
                                      type: 'select@2',
                                      name: 'middle_code',
                                      options: {
                                          selector: (state: ConnectState) => {
                                              return state.options.platformErrorCode;
                                          },
                                      },
                                      colon: false,
                                      labelClassName: '',
                                      className: classNames(
                                          formStyles.formHorizon,
                                          formStyles.formItem,
                                      ),
                                      defaultOption: false,
                                      rules: [
                                          {
                                              required: true,
                                              message: '请选择中台错误码',
                                          },
                                      ],
                                      onChange: (name, form) => {
                                          const code = form.getFieldValue('middle_code');
                                          form.setFieldsValue({
                                              middle_text: platformErrorMap?.[code],
                                          });
                                      },
                                  };
                        },
                    },
                ],
            },
            {
                type: 'dynamic',
                shouldUpdate: (before, next) => {
                    return before.middle_code_type !== next.middle_code_type;
                },
                dynamic: form => {
                    const platformCodeType = form.getFieldValue('middle_code_type');
                    return platformCodeType === 1
                        ? {
                              type: 'textarea@2',
                              name: 'middle_text',
                              label: '中台错误文案',
                              rules: [
                                  {
                                      required: true,
                                      message: '请输入中台错误文案',
                                  },
                              ],
                          }
                        : {
                              type: 'textarea@2',
                              name: 'middle_text',
                              label: '中台错误文案',
                              childrenProps: {
                                  disabled: true,
                              },
                          };
                },
            },
            {
                type: 'textarea@2',
                name: 'remark',
                label: '备注',
            },
        ];
    }, [platformErrorMap]);

    return useMemo(() => {
        return (
            <Container absolute={true}>
                <Title level={4}>{type === 'edit' ? '更新采购错误码' : '新增采购错误码'}</Title>
                <JsonForm
                    ref={formRef}
                    fieldList={fieldList}
                    layout="horizontal"
                    initialValues={data}
                    labelClassName={styles.formEditLabel}
                    containerClassName={formStyles.formHelpAbsolute}
                >
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onOKey}>
                        保存
                    </LoadingButton>
                    <Popconfirm title="返回将不保存此次编辑信息，确定返回吗？" onConfirm={onClose}>
                        <Button className={formStyles.formBtn}>返回</Button>
                    </Popconfirm>
                </JsonForm>
            </Container>
        );
    }, [platformErrorMap]);
};

export default EditPage;
