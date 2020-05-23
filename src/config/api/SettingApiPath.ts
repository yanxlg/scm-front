/**
 * 设置页面Api字典
 */
export enum SettingApiPath {
    QueryCustomDeclarationList = '/api/v1/customs/list',
    QueryCountryList = '/api/v1/customs/country',
    UpdateCustom = '/api/v1/customs/put',
    QueryCookie = '/api/v1/spider/account/list',
    UpdateCookie = '/api/v1/spider/account/update',
    ExportList = '/api/v1/download/list',
    RetryExport = '/api/v1/download/repeat',
    DeleteExport = '/api/v1/download/delete',
    UpdateExport = '/api/v1/download/detail',
    QueryPriceStrategy = '/api/v1/price_strategy/detail',
    UpdatePriceStrategy = '/api/v1/price_strategy/store',
    QueryPriceStrategyHistory = '/api/v1/price_strategy/history',
    // 线下采购配置
    QueryOfflinePurchaseList = '/v1/orders/setting/purchase/offline/list',
    QueryOfflinePurchaseInfo = '/v1/orders/setting/purchase/offline/:id',
    AddOfflinePurchase = '/api/v1/orders/setting/purchase/offline',
    UpdateOfflinePurchase = '/api/v1/orders/setting/purchase/offline/:id',
    DelOfflinePurchase = '/api/v1/orders/setting/purchase/offline/:id',
}
