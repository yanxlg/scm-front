import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { Button, Input, Spin, message, Tabs, Popconfirm, Pagination, Modal } from 'antd';
import Container from '@/components/Container';
// import EditTag from './components/EditTag';
import { getTagsList, addTag, enabledTag, deleteTag } from '@/services/goods-attr';
import { ITagItem } from '@/interface/IGoodsAttr';
import { DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { FitTable } from 'react-components';
import { IAttrItem } from '@/interface/ISetting';
import EditableCell from './components/EditableCell';
import { ColumnsType } from 'antd/lib/table/interface';
import PublishIntercept from './components/PublishIntercept';

import styles from './_goodsAttr.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;

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
    const pageDataRef = useRef<any>({
        pageOneOriginData: [
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
        ]
    });
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setPageTotal] = useState(20);
    const [editAttrList, setEditAttrList] = useState<IAttrItem[]>([]);
      
    const addAttr = () => {
        const key = attrList.length + '';
        const newAttrList = [...attrList];
        newAttrList.push({
            key,
            name: '',
            description: '',
        });
        setAttrList(newAttrList);
    };

    const editAttr = useCallback(
        (type, value, index) => {
            setAttrList(attrList.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        [type]: value
                    }
                }
                return item;
            }));
        },
        [attrList]
    );

    const deleteAttr = useCallback(
        (key = '') => {
            const newAttrList = [...attrList];
            const index = newAttrList.findIndex(item => key === item.key);
            if (index > -1) {
                newAttrList.splice(index, 1);
                setAttrList(newAttrList);
            }
        },
        [attrList],
    );

    const showConfirm = useCallback(
        () => {
            confirm({
                title: '保存即应用标签',
                icon: <ExclamationCircleOutlined />,
                content: '系统会根据关键字自动匹配商品打标签，这个过程预计需要30分钟。任务执行中不可再次编辑，请确认是否立刻执行？',
                onOk() {
                    console.log('OK');
                },
                // onCancel() {
                //     console.log('Cancel');
                // },
            });
        },
        []
    );

    const changePage = useCallback(
        (current: number) => {
            // console.log('changePage', page);
            const cacheData = pageDataRef.current;
            cacheData[page] = attrList;
            if (cacheData[current]) {
                setAttrList(cacheData[current]);
            }
            // console.log('changePage', pageDataRef.current);
            setPage(current);
            
        },
        [attrList, page]
    );

    const handleReset = useCallback(
        () => {
            setPage(1);
            const { pageOneOriginData } = pageDataRef.current;
            pageDataRef.current = {
                pageOneOriginData
            }
            setAttrList(pageOneOriginData);
        },
        []
    );

    const columns = useMemo(() => {
        return [
            {
                title: '商品标签名称',
                dataIndex: 'name',
                width: 100,
                align: 'center',
                render: (val: string, record: IAttrItem, index: number) => {
                    return <Input value={val} onChange={e => editAttr('name', e.target.value, index)} />
                }
            },
            {
                title: '关键词',
                dataIndex: 'description',
                width: 200,
                align: 'center',
                render: (val: string, record: IAttrItem, index: number) => {
                    return <TextArea value={val} onChange={e => editAttr('description', e.target.value, index)} autoSize />
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 100,
                align: 'center',
                render: (_: any, record: IAttrItem) => {
                    return (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => deleteAttr(record.key)}
                        >
                            删除
                        </Button>
                    );
                },
            },
        ] as ColumnsType<any>;
    }, [attrList]);

    return useMemo(() => {
        return (
            <Container>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="商品属性配置" key="1">
                        <div className={styles.tableContainer}>
                            <FitTable
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                bordered
                                dataSource={attrList}
                                columns={columns}
                                // rowClassName="editable-row"
                                pagination={false}
                            />
                            <div className={styles.paginationContainer}>
                                <Button ghost type="primary" onClick={addAttr} className={styles.btnAdd}>
                                    <PlusOutlined />
                                    添加新标签
                                </Button>
                                <Pagination
                                    current={page}
                                    pageSize={pageSize}
                                    total={total}
                                    className={styles.pagination}
                                    showTotal={total => `共 ${total} 条`}
                                    showQuickJumper={true}
                                    onChange={changePage}
                                />
                            </div>
                            
                        </div>
                        <div className={styles.opsContainer}>
                            <Button type="primary" className={styles.btnSave} onClick={showConfirm}>保存即应用</Button>
                            <Button onClick={handleReset}>还原</Button>
                        </div>
                    </TabPane>
                    <TabPane tab="上架拦截策略" key="2">
                        <PublishIntercept />
                    </TabPane>
                </Tabs>
            </Container>
        );
    }, [attrList, columns, page]);
};

export default GoodsAttr;
