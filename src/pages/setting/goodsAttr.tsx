import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { Button, Input, Tabs, Pagination, Modal, message } from 'antd';
import Container from '@/components/Container';
// import EditTag from './components/EditTag';
import { getTagsList, putBatchUpdateTags, getBatchUpdateProgress } from '@/services/goods-attr';
import { ITagItem, IGetTagsListRequest } from '@/interface/IGoodsAttr';
import { PlusOutlined, ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { FitTable } from 'react-components';

import { ColumnsType } from 'antd/lib/table/interface';
import PublishIntercept from './components/PublishIntercept';

import styles from './_goodsAttr.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;
// const typeList = ['delete', 'add-delete'];

const GoodsAttr: React.FC = props => {
    const pageDataRef = useRef<any>({
        pageOneOriginData: [],
        cacheData: {},
    });
    const [pending, setPending] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [page, setPage] = useState(1);
    // const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [attrList, setAttrList] = useState<ITagItem[]>([]);

    const addAttr = () => {
        const newAttrList = [...attrList];
        newAttrList.push({
            name: '',
            keyWords: '',
            type: 'add',
        });
        setAttrList(newAttrList);
    };

    const editAttr = useCallback(
        (name, value, index) => {
            setAttrList(
                attrList.map((item, i) => {
                    // console.log(index, i);
                    if (i === index) {
                        const ret: ITagItem = {
                            ...item,
                            [name]: value,
                            type: item.type === 'add' ? 'add' : 'edit',
                        };
                        return ret;
                    }
                    return item;
                }),
            );
        },
        [attrList],
    );

    const deleteAttr = useCallback(
        index => {
            // const index =
            if (attrList[index].type === 'add') {
                const newAttrList = [...attrList];
                newAttrList.splice(index, 1);
                setAttrList(newAttrList);
            } else {
                setAttrList(
                    attrList.map((item, i) => {
                        if (index === i) {
                            return {
                                ...item,
                                type: 'delete',
                            };
                        }
                        return item;
                    }),
                );
            }
        },
        [attrList],
    );

    const validateList = useCallback((editList): boolean => {
        if (editList.length === 0) {
            message.error('没有任何更改！');
            return false;
        }
        // console.log('editList', editList);
        for (let i = 0, len = editList.length; i < len; i++) {
            const { name, keyWords, page, type } = editList[i];
            if (type !== 'delete' && (!name || !keyWords)) {
                message.error(`第${page}页面存在空值，请检查`);
                return false;
            }
        }
        return true;
    }, []);

    const showConfirm = useCallback(() => {
        const { cacheData } = pageDataRef.current;
        // const keys = ;
        // console.log('showConfirm', keys);
        // 获取所有编辑过的数据
        const editList: ITagItem[] = [];
        const keys = Object.keys(cacheData);
        if (keys.length > 0) {
            keys.forEach(key => {
                // let list: ITagItem[] = [];
                let currentPage = Number(key);
                const list: ITagItem[] = currentPage !== page ? cacheData[key] : attrList;
                list.forEach(item => {
                    if (item.type) {
                        editList.push({
                            ...item,
                            page: currentPage,
                        });
                    }
                });
            });
        } else {
            attrList.forEach(item => {
                if (item.type) {
                    editList.push({
                        ...item,
                        page,
                    });
                }
            });
        }
        if (validateList(editList)) {
            confirm({
                title: '保存即应用标签',
                icon: <ExclamationCircleOutlined />,
                content:
                    '系统会根据关键字自动匹配商品打标签，这个过程预计需要30分钟。任务执行中不可再次编辑，请确认是否立刻执行？',
                onOk() {
                    // console.log('OK');
                    _putBatchUpdateTags(editList);
                },
            });
        }
    }, [page, attrList]);

    const changePage = useCallback(
        (current: number) => {
            // console.log('changePage', page);
            const { cacheData } = pageDataRef.current;
            cacheData[page] = attrList;
            if (cacheData[current]) {
                setAttrList(cacheData[current]);
                setPage(current);
            } else {
                _getTagsList({ page: current });
            }
        },
        [attrList, page],
    );

    const handleReset = useCallback(() => {
        setPage(1);
        const { pageOneOriginData } = pageDataRef.current;
        pageDataRef.current.cacheData = {};
        // pageDataRef.current = {
        //     pageOneOriginData
        // }
        setAttrList(pageOneOriginData);
    }, []);

    const _getTagsList = useCallback(
        (params: IGetTagsListRequest = { page }) => {
            setLoading(true);
            getTagsList({
                ...params,
                page_count: 10,
                is_active: 'ENABLED',
            })
                .then(res => {
                    // console.log('getTagsList', res);
                    const paramsPage = params.page as number;
                    const { tags, all_count } = res.data;
                    setPage(paramsPage);
                    setTotal(all_count as number), setAttrList(tags || []);
                    if (paramsPage === 1) {
                        // const { pageOneOriginData } = pageDataRef.current;
                        pageDataRef.current.pageOneOriginData = tags || [];
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [page],
    );

    const _getBatchUpdateProgress = useCallback(() => {
        getBatchUpdateProgress().then(res => {
            // console.log('getBatchUpdateProgress', res);
            setPending(res.data === 'finish' ? false : true);
        });
    }, []);

    const _putBatchUpdateTags = useCallback(editList => {
        const list = editList.map((item: ITagItem) => {
            const { name, tagId, keyWords, type } = item;
            return {
                name,
                tagId,
                keyWords,
                type,
            };
        });
        setSaveLoading(true);
        putBatchUpdateTags({
            tag_list: list,
        })
            .then(res => {
                _getBatchUpdateProgress();
                _getTagsList({
                    page: 1,
                });
            })
            .finally(() => {
                setSaveLoading(false);
            });
    }, []);

    const columns = useMemo(() => {
        if (pending) {
            return [
                {
                    title: '商品标签名称',
                    dataIndex: 'name',
                    width: 100,
                    align: 'center',
                },
                {
                    title: '关键词',
                    dataIndex: 'keyWords',
                    width: 200,
                    align: 'center',
                },
            ] as ColumnsType<ITagItem>;
        } else {
            return [
                {
                    title: '商品标签名称',
                    dataIndex: 'name',
                    width: 100,
                    align: 'center',
                    render: (val: string, record: ITagItem, index: number) => {
                        return (
                            <Input
                                value={val}
                                onChange={e => editAttr('name', e.target.value, index)}
                            />
                        );
                    },
                },
                {
                    title: '关键词',
                    dataIndex: 'keyWords',
                    width: 200,
                    align: 'center',
                    render: (val: string, record: ITagItem, index: number) => {
                        return (
                            <TextArea
                                value={val}
                                onChange={e => editAttr('keyWords', e.target.value, index)}
                                autoSize
                            />
                        );
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 100,
                    align: 'center',
                    render: (_: any, record: ITagItem, index: number) => {
                        return (
                            <Button type="link" size="small" onClick={() => deleteAttr(index)}>
                                删除
                            </Button>
                        );
                    },
                },
            ] as ColumnsType<ITagItem>;
        }
        // attrList
    }, [pending, attrList]);

    useEffect(() => {
        _getBatchUpdateProgress();
        _getTagsList();
        const timer = setInterval(() => {
            _getBatchUpdateProgress();
        }, 20 * 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return useMemo(() => {
        // console.log('attrList', attrList);
        return (
            <Container>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="商品属性配置" key="1">
                        <div className={styles.tableContainer}>
                            {pending && (
                                <div className={styles.loadingContainer}>
                                    <LoadingOutlined />
                                    系统自动打标签中，请稍等...
                                </div>
                            )}
                            <FitTable
                                bordered
                                // rowKey="tagId"
                                loading={loading}
                                dataSource={attrList}
                                columns={columns}
                                scroll={{ y: 400 }}
                                // minHeight={100}
                                autoFitY={false}
                                pagination={false}
                                onRow={({ type }) => ({
                                    hidden: type === 'delete' ? true : false,
                                })}
                            />
                            <div className={styles.paginationContainer}>
                                {!pending && (
                                    <Button
                                        ghost
                                        type="primary"
                                        onClick={addAttr}
                                        className={styles.btnAdd}
                                    >
                                        <PlusOutlined />
                                        添加新标签
                                    </Button>
                                )}
                                <Pagination
                                    current={page}
                                    pageSize={10}
                                    total={total}
                                    className={styles.pagination}
                                    showTotal={total => `共 ${total} 条`}
                                    showQuickJumper={true}
                                    onChange={changePage}
                                />
                            </div>
                        </div>
                        {!pending && (
                            <div className={styles.opsContainer}>
                                <Button
                                    type="primary"
                                    className={styles.btnSave}
                                    onClick={showConfirm}
                                    loading={saveLoading}
                                >
                                    保存即应用
                                </Button>
                                <Button onClick={handleReset}>还原</Button>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab="上架拦截策略" key="2">
                        <PublishIntercept />
                    </TabPane>
                </Tabs>
            </Container>
        );
    }, [attrList, columns, page, total, loading, pending, saveLoading]);
};

export default GoodsAttr;
