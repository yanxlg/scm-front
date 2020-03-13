import React, { useMemo } from 'react';
import { PageLoading } from '@ant-design/pro-layout';

export default () => {
    return useMemo(() => <PageLoading />, []);
};
