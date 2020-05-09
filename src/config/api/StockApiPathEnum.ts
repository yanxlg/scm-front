/**
 * 出入库管理api地址枚举
 */
enum StockApiPathEnum {
    QueryOutList = '/api/v2/inventory/outbound',
    QueryInList = '/api/v1/inventory/in',
    ExportInList = '/api/v1/inventory/in_export',
    ExportOutList = '/api/v1/inventory/out_export',
    QueryStockList = '/api/v1/inventory/list',
    ExportStockList = '/api/v1/inventory/stork_export',
    SyncStock = '/api/v1/inventory/sync',
    QueryLogistics = '/api/v1/inventory/logistics',
}

export { StockApiPathEnum };
