/**
 * 出入库管理api地址枚举
 */
enum StockApiPathEnum {
    QueryOutList = '/api/v1/inventory/out',
    QueryInList = '/api/v1/inventory/in',
    ExportInList = '/api/v1/inventory/in_export',
    ExportOutList = '/api/v1/inventory/out_export',
    QueryStockList = '/api/v1/inventory/list',
    ExportStockList = '/api/v1/inventory/stork_export',
    SyncStock = '/api/v1/inventory/sync',
}

export { StockApiPathEnum };
