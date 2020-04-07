import React, { useMemo, useState, useCallback } from 'react';
import { Button } from 'antd';
import CheckedBtn from '@/components/CheckedBtn';

import { IPublishInterceptItem } from '@/interface/ISetting';

const PublishIntercept: React.FC = props => {
    const [tagList, setTagList] = useState<IPublishInterceptItem[]>([
        { name: '品牌', checked: true },
        { name: '大件', checked: false },
        { name: '重件', checked: true },
        { name: '违禁品', checked: false },
    ]);

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

    return useMemo(() => {
        return (
            <>
                <p>请选择上架拦截的商品属性标签</p>
                {tagList.map((item, index) => (
                    <CheckedBtn
                        style={{ margin: '0 10px 10px 0' }}
                        key={item.name}
                        item={item}
                        onClick={() => btnSelected(index)}
                    />
                ))}
                <div style={{ marginTop: 10 }}>
                    <Button type="primary">更改设置</Button>
                </div>
            </>
        );
    }, [tagList]);
};

export default PublishIntercept;
