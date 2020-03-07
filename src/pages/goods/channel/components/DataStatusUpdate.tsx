import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Spin } from 'antd';
import router from 'umi/router';
import '@/styles/form.less';
import { queryChannelChangedProperties } from '@/services/channel';

export declare interface PropertyItem {
    property: string;
    count: number;
}

const DataStatusUpdate: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);

    useEffect(() => {
        queryChannelChangedProperties()
            .then(({ data: { changed_property_list = [] } }) => {
                setList(changed_property_list);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const goTo = useCallback(() => {
        router.push(`${window.location.pathname}/version`);
    }, []);

    return useMemo(() => {
        return (
            <Card title="数据/状态更新" className="form-item">
                <Spin spinning={loading} tip="Loading...">
                    <div className="product-tags cursor-pointer" onClick={goTo}>
                        {list.map((item: PropertyItem, index) => {
                            return (
                                <div key={item.property + index} className="product-tag">
                                    {item.property}(
                                    <span className="product-tag-value">{item.count}</span>)
                                </div>
                            );
                        })}
                    </div>
                </Spin>
            </Card>
        );
    }, [list, loading]);
};

export default DataStatusUpdate;
