import React, { useCallback, useMemo, useRef } from 'react';
import Container from '@/components/Container';
import { Typography, Button, Popconfirm, message } from 'antd';
import { JsonForm } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
import styles from '../index.module.less';
import { updateErrorCode } from '@/services/setting';
import { GlobalApiPath } from '@/config/api/Global';
import request from '@/utils/request';
const { Title } = Typography;

const fieldList: FormField[] = [
    {
        type: 'select@2',
        label: '采购渠道',
        name: 'purchase_channel',
        options: {
            url: GlobalApiPath.QuerySelectList.replace(':id', '1'),
            request: request,
            parser: 'object',
        },
        itemProps: {
            mode: 'tags',
        },
    },
    {
        type: 'input',
        name: 'channel_code',
        label: '渠道错误码',
    },
    {
        type: 'textarea',
        name: 'channel_text',
        label: '渠道错误文案',
    },
    {
        type: 'select',
        name: 'order_code',
        label: '订单错误码',
        initialValue: 1,
        optionList: [
            {
                name: '新生成',
                value: 1,
            },
        ],
    },
    {
        type: 'layout',
        className: classNames(formStyles.formHorizon),
        fieldList: [
            {
                type: 'select',
                name: 'middle_code_type',
                initialValue: 2,
                label: '中台错误码',
                optionList: [
                    {
                        name: '已有值',
                        value: 2,
                    },
                    {
                        name: '新生成',
                        value: 1,
                    },
                ],
                onChange: (name, form) => {
                    form.resetFields(['platformCode']);
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
                        ? {
                              type: 'input',
                              name: 'middle_code',
                              colon: false,
                              labelClassName: '',
                          }
                        : {
                              type: 'select',
                              name: 'middle_code',
                              optionList: [],
                              colon: false,
                              labelClassName: '',
                          };
                },
            },
        ],
    },
    {
        type: 'textarea',
        name: 'middle_text',
        label: '中台错误文案',
    },
    {
        type: 'textarea',
        name: 'remark',
        label: '备注',
    },
];

export declare interface EditPageProps {
    type: 'edit' | 'add';
    data?: any;
    onClose: () => void;
}

const EditPage: React.FC<EditPageProps> = ({ type, data, onClose }) => {
    const formRef = useRef<JsonFormRef>(null);

    const onOKey = useCallback(() => {
        formRef.current!.validateFields().then(values => {
            updateErrorCode({ ...values, save_type: 1 }).then(() => {
                message.success('添加成功！');
            });
        });
    }, []);

    return useMemo(() => {
        return (
            <Container absolute={true}>
                <Title level={4}>{type === 'edit' ? '编辑采购错误码' : '新增采购错误码'}</Title>
                <JsonForm
                    ref={formRef}
                    fieldList={fieldList}
                    layout="horizontal"
                    initialValues={data}
                    labelClassName={styles.formLabel}
                >
                    <Button type="primary" className={formStyles.formBtn} onClick={onOKey}>
                        保存
                    </Button>
                    <Popconfirm title="返回将不保存此次编辑信息，确定返回吗？" onConfirm={onClose}>
                        <Button className={formStyles.formBtn}>返回</Button>
                    </Popconfirm>
                </JsonForm>
            </Container>
        );
    }, []);
};

export default EditPage;
