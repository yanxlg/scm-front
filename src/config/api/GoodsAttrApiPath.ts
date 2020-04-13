export enum GoodsAttrApiPath {
    getTagsList = '/api/v1/tags/list',
    addTag = '/api/v1/tags/create',
    enabledTag = '/api/v1/tags/rescover/:name',
    deleteTag = '/api/v1/tags/delete/:name',
    setCommodityTag = '/api/v1/tags/label/commodity',
    setCommoditySkuTag = '/api/v1/tags/label/commodity_sku',
    putBatchUpdateTags = '/api/v1/tags/batch_update',
    getBatchUpdateProgress = '/api/v1/tags/batch_update',
    getInterceptTagList = '/api/v1/onsale_intercept_keywords/list',
    setInterceptTagList = '/api/v1/onsale_intercept_keywords/save'
}
