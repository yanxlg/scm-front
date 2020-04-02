import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Popconfirm, Button, Spin, message } from 'antd';
import { getEnabledTagsList, setCommodityTag } from '@/services/goods-attr';
import { ITagItem } from '@/interface/IGoodsAttr';

import './PopConfirmSetAttr.less';

declare interface IProps {
    commodityId: string;
    productId: string;
    tags: string[];
    setProductTags(productId: string, tags: string[]): void;
}

const SetAttr: React.FC<IProps> = ({ tags, commodityId, productId, setProductTags }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    const [loading, setLoading] = useState(false);
    const [tagList, setTagList] = useState<ITagItem[]>([]);

    const changeSelectTag = useCallback(
        (name: string) => {
            // console.log('changeSelectTag', name, selectedTags);
            const i = selectedTags.indexOf(name);
            if (i === -1) {
                setSelectedTags([...selectedTags, name]);
            } else {
                setSelectedTags([...selectedTags.slice(0, i), ...selectedTags.slice(i + 1)]);
            }
        },
        [selectedTags],
    );

    const confirm = useCallback(() => {
        // console.log(1111, selectedTags);
        setCommodityTag({
            commodity_id: commodityId,
            tag_name: selectedTags,
        }).then(() => {
            setProductTags(productId, selectedTags);
            message.success('设置成功！');
        });
    }, [selectedTags, commodityId, productId, setProductTags]);

    const attrTag = useMemo(() => {
        return (
            <div className="select-attr">
                <Spin spinning={loading} tip="加载中..."></Spin>
                {tagList.map(({ name }) => {
                    const isActive = selectedTags.indexOf(name) > -1;
                    return (
                        <Button
                            size="small"
                            ghost={isActive ? true : false}
                            type={isActive ? 'primary' : 'default'}
                            className="btn"
                            key={name}
                            onClick={() => changeSelectTag(name)}
                        >
                            {name}
                            <div className="bg"></div>
                            <div className="tick"></div>
                        </Button>
                    );
                })}
            </div>
        );
    }, [tagList, loading, selectedTags]);

    useEffect(() => {
        setLoading(true);
        getEnabledTagsList()
            .then(res => {
                // console.log('getEnabledTagsList', res);
                const { tags } = res.data;
                setTagList(tags);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return useMemo(() => {
        return (
            <Popconfirm
                placement="bottom"
                okText="确定"
                cancelText="取消"
                icon={null}
                title={attrTag}
                onConfirm={confirm}
            >
                <Button type="link">编辑</Button>
            </Popconfirm>
        );
    }, [attrTag]);
};

export default SetAttr;
