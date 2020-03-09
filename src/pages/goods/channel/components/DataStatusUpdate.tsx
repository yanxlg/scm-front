import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Spin } from 'antd';
import router from 'umi/router';
import '@/styles/form.less';
import { queryChannelChangedProperties } from '@/services/channel';
import { IChannelChangedProperty } from '@/interface/IChannel';
import { EmptyObject } from '@/config/global';

const DataStatusUpdate: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<IChannelChangedProperty[]>([]);

    useEffect(() => {
        queryChannelChangedProperties()
            .then(({ data: { changed_property_list = [] } = EmptyObject } = EmptyObject) => {
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
                        {list.map((item, index) => {
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
