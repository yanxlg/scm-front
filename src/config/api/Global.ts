export enum GlobalApiPath {
    QueryShopList = '/api/v1/vova_goods/store_list',
    // downloadExcel = '/api/v1/download/create',
    downloadTemplateFile = '/api/v1/common/file_download',
    getPurchasePlatform = '/api/v1/common/purchase_platform',
    ExportExcel = '/api/v1/download/create',
    QuerySelectList = '/api/v1/select/:id',
    QueryWarehourse = '/api/v1/common/warehourse_addr/:warehourse_id',
    QueryGoodBySkuId = '/api/v1/goods/purchase_sku_info',
    QueryOnsaleInterceptStore = '/api/v1/strategy/onsale_intercept_store',
    querySimpleRoleList = '/api/v1/roles/all_name',
    login = '/api/v1/users/login',
    logout = '/api/v1/users/logout',
}
