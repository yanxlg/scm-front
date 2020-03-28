import ProTable, { ProColumns, ProTableProps, ColumnsState } from './Table';
import IndexColumn from './component/indexColumn';
import TableDropdown from './component/dropdown';
import TableStatus from './component/status';
import {
    IntlProvider,
    IntlConsumer,
    createIntl,
    IntlType,
    zhCNIntl,
    enUSIntl,
    viVNIntl,
    itITIntl,
    jaJPIntl,
    esESIntl,
    ruRUIntl,
} from './component/intlContext';

export {
    ProColumns,
    ProTableProps,
    IndexColumn,
    TableDropdown,
    TableStatus,
    IntlProvider,
    IntlConsumer,
    IntlType,
    zhCNIntl,
    createIntl,
    enUSIntl,
    viVNIntl,
    itITIntl,
    jaJPIntl,
    esESIntl,
    ruRUIntl,
    ColumnsState,
};

export default ProTable;
