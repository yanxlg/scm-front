import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { Button, Input, Spin, message, Tabs, Form, Popconfirm } from 'antd';
import Container from '@/components/Container';
// import EditTag from './components/EditTag';
import { getTagsList, addTag, enabledTag, deleteTag } from '@/services/goods-attr';
import { ITagItem } from '@/interface/IGoodsAttr';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FitTable } from 'react-components';
import { IAttrItem } from '@/interface/ISetting';
import EditableCell from './components/EditableCell';
import { ColumnsType } from 'antd/lib/table/interface';
import PublishIntercept from './components/PublishIntercept';

import styles from './_goodsAttr.less';

const { TabPane } = Tabs;

const _GoodsAttr: React.FC = props => {
    const addInputRef = useRef<Input>(null);
    const [loading, setLoading] = useState(false);
    const [tagList, setTagList] = useState<ITagItem[]>([]);

    const handleAdd = useCallback(() => {
        // console.log(addInputRef.current?.state.value);
        const value = addInputRef.current?.state.value?.replace(/\s+/g, '');
        if (value) {
            const index = tagList.findIndex(item => item.name === value);
            if (index === -1) {
                _addTag(value);
            } else {
                const currentTag = tagList[index];
                if (currentTag.isActive === 'ENABLED') {
                    message.info('当前标签已存在！');
                } else {
                    _enabledTag(value);
                }
            }
        }
    }, [tagList]);

    const _getTagsList = useCallback(() => {
        setLoading(true);
        getTagsList()
            .then(res => {
                // console.log('getTagsList', res);
                const { tags } = res.data;
                setTagList(tags);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const _addTag = useCallback((name: string) => {
        setLoading(true);
        addTag(name).then(res => {
            addInputRef.current?.setValue('');
            _getTagsList();
        });
    }, []);

    const _enabledTag = useCallback((name: string) => {
        setLoading(true);
        enabledTag(name).then(res => {
            addInputRef.current?.setValue('');
            _getTagsList();
        });
    }, []);

    const _deleteTag = useCallback(
        (name: string) => {
            const index = tagList.findIndex(item => item.name === name);
            const list = tagList.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        _loading: true,
                    };
                }
                return item;
            });
            setTagList(list);

            return deleteTag(name).then(() => {
                list.splice(index, 1);
                setTagList([...list]);
                message.success('删除成功！');
            });
        },
        [tagList],
    );

    // const reset = useCallback(() => {
    //     setTagList([...tagList]);
    // }, [tagList]);

    const addBox = useMemo(() => {
        return (
            <div className={[styles.addBox, styles.item].join(' ')}>
                <Input ref={addInputRef} className={styles.input} placeholder="请输入新标签" />
                <Button size="small" type="primary" className={styles.btnAdd} onClick={handleAdd}>
                    添加
                </Button>
            </div>
        );
    }, [handleAdd]);

    const enabledTagList = useMemo(() => {
        return tagList.filter(item => item.isActive === 'ENABLED');
    }, [tagList]);

    useEffect(() => {
        _getTagsList();
    }, []);

    return useMemo(() => {
        return (
            <Container>
                <Spin spinning={loading} tip="加载中...">
                    <h3>所有标签</h3>
                    <div className={styles.tagSection}>
                        {/* {enabledTagList.map(item => (
                            <EditTag 
                                className={styles.item} 
                                text={item.name}
                                key={item.name + Date.now()}
                                getTagsList={_getTagsList}
                                setLoading={setLoading}
                            />
                        ))} */}
                        {enabledTagList.map(item => (
                            <Button className={styles.item} key={item.name} loading={item._loading}>
                                {item.name}{' '}
                                <div className={styles.icon}>
                                    <DeleteOutlined onClick={() => _deleteTag(item.name)} />
                                </div>
                            </Button>
                        ))}
                        {addBox}
                    </div>
                    <div>
                        {/* <Button type="primary" className={styles.saveBtn}>
                            保存设置
                        </Button> */}
                        {/* <Button type="primary" onClick={reset}>还原</Button> */}
                    </div>
                </Spin>
            </Container>
        );
    }, [addBox, enabledTagList, loading]);
};

const GoodsAttr: React.FC = props => {
    const [form] = Form.useForm();
    const [attrList, setAttrList] = useState<IAttrItem[]>([
        {
            key: '0',
            name: '测试1',
            description:
                '耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯',
        },
        {
            key: '1',
            name: '测试2',
            description:
                '耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯，耐克，阿迪达斯',
        },
    ]);
    const [editingKey, setEditingKey] = useState('');
    const [isAdd, setIsAdd] = useState(false);

    const isEditing = (record: IAttrItem) => record.key === editingKey;

    const edit = (record: IAttrItem) => {
        // console.log(11111);
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        if (isAdd) {
            deleteAttr();
            setIsAdd(false);
        }
        setEditingKey('');
    };

    const addAttr = () => {
        const key = attrList.length + '';
        const newAttrList = [...attrList];
        newAttrList.push({
            key,
            name: '',
            description: '',
        });
        setIsAdd(true);
        setEditingKey(key);
        setAttrList(newAttrList);
    };

    const deleteAttr = useCallback(
        (key = '') => {
            const newAttrList = [...attrList];
            if (key) {
                const index = newAttrList.findIndex(item => key === item.key);
                if (index > -1) {
                    newAttrList.splice(index, 1);
                    setAttrList(newAttrList);
                }
            } else {
                // 新增时的取消
                newAttrList.pop();
                setAttrList(newAttrList);
            }
        },
        [attrList],
    );

    const save = useCallback(
        async (key: string) => {
            try {
                const row = (await form.validateFields()) as IAttrItem;
                const newAttrList = [...attrList];
                const index = newAttrList.findIndex(item => key === item.key);
                if (index > -1) {
                    const item = newAttrList[index];
                    newAttrList.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    setAttrList(newAttrList);
                } else {
                    newAttrList.push(row);
                    setAttrList(newAttrList);
                }
                setEditingKey('');
            } catch (errInfo) {
                console.log('Validate Failed:', errInfo);
            }
        },
        [attrList],
    );

    const columns = useMemo(() => {
        return [
            {
                title: '商品标签名称',
                dataIndex: 'name',
                width: 140,
                align: 'center',
                editable: true,
            },
            {
                title: '关键词',
                dataIndex: 'description',
                width: 400,
                align: 'center',
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 260,
                align: 'center',
                render: (_: any, record: IAttrItem) => {
                    const editable = isEditing(record);
                    return (
                        <>
                            {editable ? (
                                <>
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={() => save(record.key)}
                                    >
                                        保存
                                    </Button>
                                    <Popconfirm title="确认取消吗?" onConfirm={cancel}>
                                        <Button type="link" size="small">
                                            取消
                                        </Button>
                                    </Popconfirm>
                                </>
                            ) : (
                                <Button
                                    type="link"
                                    size="small"
                                    disabled={editingKey !== ''}
                                    onClick={() => edit(record)}
                                >
                                    编辑
                                </Button>
                            )}
                            <Button
                                type="link"
                                size="small"
                                disabled={editingKey !== ''}
                                onClick={() => deleteAttr(record.key)}
                            >
                                删除
                            </Button>
                        </>
                    );
                    return;
                },
            },
        ];
    }, [editingKey]);

    const mergedColumns = useMemo(() => {
        return columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: IAttrItem) => ({
                    record,
                    inputType: col.dataIndex === 'name' ? 'text' : 'textarea',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }),
            };
        }) as ColumnsType<any>;
    }, [columns, editingKey]);
    // , attrList, editingKey

    return useMemo(() => {
        return (
            <Container>
                <Tabs defaultActiveKey="2" type="card">
                    <TabPane tab="商品属性配置" key="1">
                        <Form form={form} component={false}>
                            <FitTable
                                style={{ width: '80%' }}
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                bordered
                                dataSource={attrList}
                                columns={mergedColumns}
                                // rowClassName="editable-row"
                                pagination={false}
                            />
                        </Form>
                        <Button ghost type="primary" style={{ marginTop: 20 }} onClick={addAttr}>
                            <PlusOutlined />
                            添加新标签
                        </Button>
                    </TabPane>
                    <TabPane tab="上架拦截策略" key="2">
                        <PublishIntercept />
                    </TabPane>
                </Tabs>
            </Container>
        );
    }, [attrList, editingKey, mergedColumns]);
};

export default GoodsAttr;
