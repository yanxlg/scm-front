import React from 'react';
import { ProTableProps } from 'react-components/es/ProTable';
import { ProTable as DefaultProTable } from 'react-components';

/**
 * @deprecated Please import from `react-components` directory
 */
const ProTable = <
    T,
    U extends {
        [key: string]: any;
    } = {}
>(
    props: ProTableProps<T, U>,
) => {
    return <DefaultProTable {...props} optimize={false} />;
};

export default ProTable;
