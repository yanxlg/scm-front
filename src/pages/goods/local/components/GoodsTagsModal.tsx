import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IGoodsAndSkuItem } from '@/interface/ILocalGoods';
import { message, Modal, Spin } from 'antd';
import { getEnabledTagsList } from '@/services/goods-attr';
import styles from '@/pages/goods/local/_index.less';
import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { updateTagList } from '@/services/goods';

declare interface GoodsTagsModalProps {
    visible: false | IGoodsAndSkuItem[];
    onClose: () => void;
    onReload: () => void;
}

const GoodsTagsModal = ({ visible, onClose, onReload }: GoodsTagsModalProps) => {
    // tags
    const [tags, setTags] = useState<string[]>([]);

    const addTags = useRef<Set<string>>(new Set());
    const deleteTags = useRef<Set<string>>(new Set());
    const prevTags = useRef<Set<string>>(new Set());

    const [allTags, setAllTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getEnabledTagsList()
            .then(({ data: { tags } }) => {
                setAllTags(tags.map((item: any) => item.name));
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useMemo(() => {
        addTags.current.clear();
        deleteTags.current.clear();
        if (visible) {
            // 筛选出所有公用的tags
            const item_0 = visible[0];
            let commonTags: string[] = [];
            item_0.tags.map(tag => {
                // 所有 item都有这个tag
                let has = true;
                let i = 1;
                while (has && i < visible.length) {
                    if (visible[i].tags.indexOf(tag) < 0) {
                        has = false;
                    } else {
                        i++;
                    }
                }
                if (has) {
                    commonTags.push(tag);
                }
            });
            prevTags.current = new Set<string>(commonTags);
            setTags(commonTags);
        }
    }, [visible]);

    const addTag = useCallback((tag: string) => {
        deleteTags.current.delete(tag);
        if (!prevTags.current.has(tag)) {
            addTags.current.add(tag);
        }
        setTags(tags => ([] as string[]).concat(tags).concat(tag));
    }, []);

    const deleteTag = useCallback((tag: string) => {
        addTags.current.delete(tag);
        if (prevTags.current.has(tag)) {
            deleteTags.current.add(tag);
        }
        setTags(tags => tags.filter(_ => _ !== tag));
    }, []);

    const onOKey = useCallback(() => {
        // memo
        if (addTags.current.size === 0 && deleteTags.current.size === 0) {
            onClose();
        } else {
            setSubmitting(true);
            updateTagList({
                add_tag_list: Array.from(addTags.current),
                del_tag_list: Array.from(deleteTags.current),
                commodity_id_list: (visible as IGoodsAndSkuItem[]).map(item => item.commodity_id),
            }).then(
                () => {
                    message.success('修改成功');
                    setSubmitting(false);
                    onClose();
                    onReload();
                },
                () => {
                    setSubmitting(false);
                },
            );
        }
    }, [tags]);

    return useMemo(() => {
        return (
            <Modal
                title="批量修改商品属性标签"
                onCancel={onClose}
                visible={!!visible}
                onOk={onOKey}
                confirmLoading={submitting}
                width={700}
            >
                <div className={styles.tagLabel1}>现共有标签</div>
                {tags.map(tag => {
                    return (
                        <div key={tag} className={styles.tag}>
                            {tag}
                            <CloseCircleFilled
                                className={styles.tagRemove}
                                onClick={() => deleteTag(tag)}
                            />
                        </div>
                    );
                })}
                <div className={styles.tagLabel2}>请选择需要添加的标签</div>
                <Spin spinning={loading}>
                    {allTags.map(tag => {
                        if (tags.indexOf(tag) > -1) {
                            return null;
                        }
                        return (
                            <div key={tag} className={styles.tagBtn}>
                                {tag}
                                <PlusOutlined
                                    className={styles.tagAdd}
                                    onClick={() => addTag(tag)}
                                />
                            </div>
                        );
                    })}
                </Spin>
            </Modal>
        );
    }, [tags, loading, visible, submitting]);
};

export default GoodsTagsModal;
