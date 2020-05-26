import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { message, Spin } from 'antd';
import CheckedBtn from '@/components/CheckedBtn';
import { getInterceptTagList, getTagsList, setInterceptTagList } from '@/services/goods-attr';
import { IPublishInterceptItem, ITagItem } from '@/interface/IGoodsAttr';
import { LoadingButton } from 'react-components';

const PublishIntercept: React.FC = props => {
    const [loading, setLoading] = useState(true);
    const [tagList, setTagList] = useState<IPublishInterceptItem[]>([]);

    const _getInterceptTagList = useCallback(async () => {
        try {
            setLoading(true);
            const [tagsResp, interceptTagResp] = await Promise.all([
                getTagsList({ page: 1, page_count: 10000, is_active: 'ENABLED' }),
                getInterceptTagList(),
            ]);
            setLoading(false);
            const { tags } = tagsResp.data;
            // setTagList(tags || []);
            const interceptTags = interceptTagResp.data;
            if (tags) {
                setTagList(
                    tags.map((item: ITagItem) => {
                        const checked = interceptTags.indexOf(item.name) > -1 ? true : false;
                        return {
                            name: item.name,
                            checked,
                        };
                    }),
                ); //dasdasdsa
            }
        } catch (error) {
            setLoading(false);
        }
    }, []);

    const btnSelected = useCallback(
        (index: number) => {
            setTagList(
                tagList.map((item, i) => {
                    if (i === index) {
                        const { checked } = item;
                        return {
                            ...item,
                            checked: !checked,
                        };
                    }
                    return item;
                }),
            );
        },
        [tagList],
    );

    const _setInterceptTagList = useCallback(() => {
        // console.log('tagList', tagList);
        return setInterceptTagList({
            keywords: tagList
                .filter(item => item.checked)
                .map(item => item.name)
                .join(','),
        }).then(res => {
            message.success('保存成功！');
            _getInterceptTagList();
        });
    }, [tagList]);

    useEffect(() => {
        _getInterceptTagList();
    }, []);

    return useMemo(() => {
        return (
            <>
                <p>请选择上架拦截的商品属性标签</p>
                <Spin spinning={loading}>
                    {tagList.map((item, index) => (
                        <CheckedBtn
                            style={{ margin: '0 10px 10px 0' }}
                            key={item.name}
                            item={item}
                            onClick={() => btnSelected(index)}
                        />
                    ))}
                </Spin>
                <div style={{ marginTop: 10 }}>
                    <LoadingButton type="primary" onClick={_setInterceptTagList}>
                        更改设置
                    </LoadingButton>
                </div>
            </>
        );
    }, [tagList, loading]);
};

export default PublishIntercept;
