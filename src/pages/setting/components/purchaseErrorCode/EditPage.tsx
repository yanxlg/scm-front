import React, { useEffect, useMemo } from 'react';
import Container from '@/components/Container';
import { Typography, Button, Popconfirm } from 'antd';
import { JsonForm } from 'react-components';
import { FormField } from 'react-components/es/JsonForm';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';
const { Title } = Typography;

const fieldList: FormField[] = [
    {
        type: 'select',
        name: 'channel',
        label: '采购渠道',
        optionList: [],
    },
    {
        type: 'input',
        name: 'channelCode',
        label: '渠道错误码',
    },
    {
        type: 'textarea',
        name: 'channelLabel',
        label: '渠道错误文案',
    },
    {
        type: 'input',
        name: 'orderCode',
        label: '订单错误码',
    },
    {
        type: 'layout',
        className: classNames(formStyles.formHorizon),
        fieldList: [
            {
                type: 'select',
                name: 'platformCodeType',
                initialValue: 0,
                label: '中台错误码',
                optionList: [
                    {
                        name: '已有值',
                        value: 0,
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
                    return before.platformCodeType !== next.platformCodeType;
                },
                dynamic: form => {
                    const platformCodeType = form.getFieldValue('platformCodeType');
                    return platformCodeType === 1
                        ? {
                              type: 'input',
                              name: 'platformCode',
                              colon: false,
                          }
                        : {
                              type: 'select',
                              name: 'platformCode',
                              optionList: [],
                              colon: false,
                          };
                },
            },
        ],
    },
    {
        type: 'textarea',
        name: 'platformLabel',
        label: '中台错误文案',
    },
    {
        type: 'textarea',
        name: 'mark',
        label: '备注',
    },
];

export declare interface EditPageProps {
    type: 'edit' | 'add';
    data?: any;
    onClose: () => void;
}

const EditPage: React.FC<EditPageProps> = ({ type, data, onClose }) => {
    return useMemo(() => {
        return (
            <Container absolute={true}>
                <Title level={4}>{type === 'edit' ? '编辑采购错误码' : '新增采购错误码'}</Title>
                <JsonForm fieldList={fieldList} layout="horizontal" initialValues={data}>
                    <Button type="primary" className={formStyles.formBtn}>
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
