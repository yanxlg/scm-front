import React, { useMemo, useCallback, useState } from 'react';
import { Popconfirm, Button, message, Form, Radio } from 'antd';

import styles from './_PopSetProgress.less';

declare interface IProps {
    onReload(): Promise<void>;
}

const PopSetProgress: React.FC<IProps> = ({ onReload }) => {
    const [form] = Form.useForm();
    const onConfirm = useCallback(() => {
        // onReload();
        // message.success('设置成功！');
    }, []);

    const onCancel = useCallback(() => {
        form.resetFields();
    }, []);

    const progressNode = useMemo(() => {
        return (
            <Form form={form} className={styles.form}>
                <Form.Item label="退款进度" name="a1">
                    <Radio.Group>
                        <Radio value="1">退款申请</Radio>
                        <Radio value="2">商家驳回</Radio>
                        <Radio value="3">退款成功</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="退货进度" name="a2">
                    <Radio.Group>
                        <Radio value="1">待退款</Radio>
                        <Radio value="2">已退货</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="补发进度" name="a3">
                    <Radio.Group>
                        <Radio value="1">待入库</Radio>
                        <Radio value="2">已入库</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        );
    }, []);

    return useMemo(() => {
        return (
            <Popconfirm
                placement="bottom"
                okText="确定"
                cancelText="取消"
                icon={null}
                title={progressNode}
                onConfirm={onConfirm}
                onCancel={onCancel}
            >
                <Button type="link">修改</Button>
            </Popconfirm>
        );
    }, [progressNode]);
};

export default PopSetProgress;
