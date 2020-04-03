import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { Button, Input, Spin, message } from 'antd';
import Container from '@/components/Container';
// import EditTag from './components/EditTag';
import { getTagsList, addTag, enabledTag, deleteTag } from '@/services/goods-attr';
import { ITagItem } from '@/interface/IGoodsAttr';
import { DeleteOutlined } from '@ant-design/icons';

import styles from './_goodsAttr.less';

const GoodsAttr: React.FC = props => {
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

export default GoodsAttr;
