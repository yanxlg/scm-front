import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Spin } from 'antd';
import router from 'umi/router';
import { getVovaChangedProperties } from '@/services/VovaGoodsService';

export declare interface PropertyItem {
    property: string;
    count: number;
}

const DataStatusUpdate:React.FC = ()=>{
    const [loading,setLoading] = useState(true);
    const [list,setList] = useState([]);

    useEffect(()=>{
        getVovaChangedProperties()
            .then(({data:{changed_property_list=[]}}) => {
                setList(changed_property_list);
                setLoading(false);
            }).catch(()=>{
                setLoading(false);
            });
    },[]);

    const goTo = useCallback(()=>{
        router.push(`${window.location.pathname}/version`);
    },[]);

    return useMemo(()=>{
        return (
            <Card
                id="vova-goods-card"
                title="数据/状态更新"
                onClick={goTo}
            >
                <Spin spinning={loading} tip="Loading...">
                <ul className="dataUpdateTags">
                    {list.map((item: PropertyItem, index) => {
                        return (
                            <li key={item.property + index}>
                                {item.property}(<span>{item.count}</span>)
                            </li>
                        );
                    })}
                </ul>
                </Spin>
            </Card>
        )
    },[list,loading]);
};

export default DataStatusUpdate;
