import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IGoodsAndSkuItem } from '@/interface/ILocalGoods';
import { Modal } from 'antd';
import { getEnabledTagsList } from '@/services/goods-attr';
import styles from '@/pages/goods/local/_index.less';
import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';

declare interface GoodsTagsModalProps {
    visible: false | IGoodsAndSkuItem[];
    onClose: () => void;
}

const GoodsTagsModal = ({ visible, onClose }: GoodsTagsModalProps) => {
    // tags
    const [tags, setTags] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
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
            setTags(commonTags);
        }
    }, [visible]);

    const addTag = useCallback((tag: string) => {
        setTags(tags => ([] as string[]).concat(tags).concat(tag));
    }, []);

    const deleteTag = useCallback((tag: string) => {
        setTags(tags => tags.filter(_ => _ !== tag));
    }, []);

    return useMemo(() => {
        return (
            <Modal title="批量修改商品属性标签" onCancel={onClose} visible={!!visible}>
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
                {allTags.map(tag => {
                    if (tags.indexOf(tag) > -1) {
                        return null;
                    }
                    return (
                        <div key={tag} className={styles.tagBtn}>
                            {tag}
                            <PlusOutlined className={styles.tagAdd} onClick={() => addTag(tag)} />
                        </div>
                    );
                })}
            </Modal>
        );
    }, [tags, loading, visible]);
};

export default GoodsTagsModal;
