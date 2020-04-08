import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDataSet } from 'react-components/es/hooks';
import { ICookieItem } from '@/interface/ISetting';
import { Form, Button, Table, Input } from 'antd';
import { FitTable, LoadingButton, ProTable } from 'react-components';
import { queryCookies, saveCookie } from '@/services/setting';
import settingStyles from '@/styles/_setting.less';
import { ColumnType } from 'antd/es/table/interface';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { EmptyObject } from '@/config/global';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: ICookieItem;
    index: number;
    children: React.ReactNode;
}

declare interface EditingColumnType<T> extends ColumnType<T> {
    editable?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `请输入Cookie`,
                        },
                    ]}
                >
                    <Input.TextArea className={settingStyles.cookieColumnContent} />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const CookieSetting: React.FC = () => {
    const { dataSet, loading, setLoading, setDataSet } = useDataSet<ICookieItem>();

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
    const isEditing = useCallback((record: ICookieItem) => record.account_id === editingKey, [
        editingKey,
    ]);

    const refresh = useCallback(() => {
        setLoading(true);
        setEditingKey(undefined);
        return queryCookies()
            .then(({ data: { list = [] } = EmptyObject }) => {
                setDataSet(list);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        refresh();
    }, []);

    const columns = useMemo<EditingColumnType<ICookieItem>[]>(() => {
        return [
            {
                title: '采购账户',
                dataIndex: 'phone',
                align: 'center',
                width: '150px',
            },
            {
                title: 'cookie',
                dataIndex: 'cookie',
                align: 'center',
                width: '400px',
                className: settingStyles.cookieColumn,
                editable: true,
                render: (_: string) => {
                    return <div className={settingStyles.cookieColumnContent}>{_}</div>;
                },
            },
            {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                width: '100px',
                render: (status: any) => {
                    return status === '1' ? '有效' : status === '2' ? '过期' : '默认';
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: '150px',
                render: (_: any, record: ICookieItem) => {
                    const editable = isEditing(record);
                    return editable ? (
                        <>
                            <LoadingButton type="link" onClick={() => save(record.account_id)}>
                                保存
                            </LoadingButton>
                            <Button
                                type="link"
                                danger={true}
                                onClick={() => setEditingKey(undefined)}
                            >
                                取消
                            </Button>
                        </>
                    ) : (
                        <Button type="link" onClick={() => edit(record)}>
                            修改
                        </Button>
                    );
                },
            },
        ];
    }, [editingKey]);

    const mergedColumns = useMemo<EditingColumnType<ICookieItem>[]>(() => {
        return columns!.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: ICookieItem) => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }),
            };
        }) as EditingColumnType<ICookieItem>[];
    }, [columns, editingKey]);

    const edit = (record: ICookieItem) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.account_id);
    };

    const save = async (key: string) => {
        try {
            const values = await form.validateFields();
            await saveCookie({
                account_id: key,
                cookie: values.cookie,
            });
            setEditingKey(undefined);
            refresh();
        } catch (errInfo) {}
    };

    const scroll = useMemo(() => {
        return {
            y: 600,
            x: 'max-content',
        };
    }, []);

    const components = useMemo(() => {
        return {
            body: {
                cell: EditableCell,
            },
        };
    }, []);

    const options = useMemo(() => {
        return {
            density: true,
            fullScreen: true,
            reload: refresh,
            setting: false,
        };
    }, []);

    return useMemo(() => {
        return (
            <Form form={form} className={formStyles.formHelpAbsolute}>
                <ProTable
                    headerTitle="cookie 列表"
                    loading={loading}
                    tableLayout="fixed"
                    rowKey="account_id"
                    components={components}
                    options={options}
                    bordered={true}
                    dataSource={dataSet}
                    columns={mergedColumns}
                    pagination={false}
                    scroll={scroll}
                />
            </Form>
        );
    }, [loading, editingKey]);
};

export default CookieSetting;
