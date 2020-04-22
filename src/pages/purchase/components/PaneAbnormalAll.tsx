import React, { useMemo, useEffect } from 'react';
import { useList, FitTable } from 'react-components';
import { getAbnormalAllList } from '@/services/purchase';

const PaneAbnormalAll: React.FC = props => {
    const { dataSource } = useList({
        queryList: getAbnormalAllList,
    });

    // useEffect(() => {
    //     console.log();
    // }, [dataSource]);

    return useMemo(() => {
        console.log('dataSource', dataSource);
        return <>1111111</>;
    }, [dataSource]);
};

export default PaneAbnormalAll;
