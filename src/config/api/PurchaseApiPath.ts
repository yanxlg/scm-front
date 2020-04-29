export enum PurchaseApiPath {
    QueryList = '/api/v1/purchase/purchase_list',
    QueryReturnList = '/api/v1/purchase/purchase_return_list',
    QueryReturnStatic = '/api/v1/purchase/purchase_return_count',
    QueryAddressConfig = '/api/v1/purchase/region',
    AddReturn = '/api/v1/purchase/create_purchase_return',
    CancelReturn = '/api/v1/purchase/cancel_purchase_return',
    QueryPurchaseStatic = '/api/v1/purchase/purchase_count',
    Export = '/api/v1/download/create',
    QueryPurchasePlainList = '/api/v1/purchase/plan_list',
}
