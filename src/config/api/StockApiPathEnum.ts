/**
 * 出入库管理api地址枚举
 */
enum StockApiPathEnum {
    QueryOutList = '/api/v1/inventory/out',
    QueryInList = '/api/v1/inventory/in',
    ExportIOList = '/api/v1/inventory/io/export',
    QueryStockList = '/api/v1/inventory/list',
    ExportStockList = '/api/v1/inventory/export',
    SyncStock = '/api/v1/inventory/sync',
}

export { StockApiPathEnum };
