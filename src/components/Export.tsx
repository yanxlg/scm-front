import React, { useCallback, useState, useMemo } from 'react';
import { ColumnType } from 'antd/es/table';
import { Checkbox, Form, Input, message, Modal, Row, Col } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import formStyles from 'react-components/es/JsonForm/_form.less';

declare interface ExportProps {
    columns: ColumnType<any>[];
    visible: boolean;
    onOKey: (form: { filename: string; fields: string[] }) => Promise<any>;
    onCancel: () => void;
}
const Export: React.FC<ExportProps> = ({ columns, visible, onCancel, onOKey }: ExportProps) => {
    const _columns = useMemo(() => {
        return columns.filter(item => {
            return (
                item.dataIndex &&
                item.dataIndex !== 'operation' &&
                !/_checked/.test(String(item.dataIndex))
            );
        });
    }, [columns]);

    const [form] = Form.useForm();
    const [checkedAll, setCheckedAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [loading, setLoading] = useState(false);

    const normalize = useCallback(
        (value, prevValue, prevValues) => {
            const length = value.length;
            if (length === 0) {
                setCheckedAll(false);
                setIndeterminate(false);
            }
            if (length === _columns.length) {
                setCheckedAll(true);
                setIndeterminate(false);
            }
            if (length < _columns.length) {
                setCheckedAll(false);
                setIndeterminate(true);
            }
            return value;
        },
        [columns],
    );

    const onChange = useCallback(
        (e: CheckboxChangeEvent) => {
            const checked = e.target.checked;
            if (checked) {
                form.setFieldsValue({
                    fields: _columns.map(item => item.dataIndex),
                });
                setCheckedAll(true);
                setIndeterminate(false);
            } else {
                form.setFieldsValue({
                    fields: [],
                });
                setCheckedAll(false);
                setIndeterminate(false);
            }
        },
        [columns],
    );

    const OKey = useCallback(() => {
        form.validateFields().then(values => {
            setLoading(true);
            onOKey(values as any)
                .then(
                    () => {
                        message.success('导出任务发送成功');
                        onCancel();
                    },
                    () => {
                        message.error('导出失败');
                    },
                )
                .finally(() => {
                    setLoading(false);
                });
        });
    }, []);

    return (
        <Modal
            visible={visible}
            title="导出设置"
            width={900}
            onCancel={onCancel}
            onOk={OKey}
            confirmLoading={loading}
        >
            <Form layout="horizontal" form={form} className={formStyles.formHelpAbsolute}>
                <Form.Item
                    className={formStyles.formItem}
                    label="文件名称"
                    name="filename"
                    rules={[{ required: true, message: '请输入文件名称' }]}
                >
                    <Input className={formStyles.formItemDefault} />
                </Form.Item>
                <Form.Item label="导出字段" className={formStyles.formItem}>
                    <Checkbox
                        indeterminate={indeterminate}
                        checked={checkedAll}
                        onChange={onChange}
                    >
                        全选
                    </Checkbox>
                </Form.Item>
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    <Form.Item
                        name="fields"
                        normalize={normalize}
                        label={''}
                        rules={[{ required: true, message: '请选择导出字段' }]}
                    >
                        <Checkbox.Group>
                            <Row gutter={[0, 10]}>
                                {_columns.map(item => {
                                    return (
                                        <Col key={item.dataIndex as string} span={4}>
                                            <Checkbox value={item.dataIndex}>{item.title}</Checkbox>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default Export;
