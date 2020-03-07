export enum ChannelApiPath {
    QueryGoodsList = '/api/v1/vova_goods/list',
    QueryCategory = '/api/v1/vova_goods/catagory/list',
    QueryChangedProperties = '/api/v1/vova_goods/changed_property',
    UpdateShelveState = '/api/v1/vova_goods/sales',
    ExportGoodsList = '/api/v1/vova_goods/exports',
    QueryGoodsVersion = '/api/v1/vova_goods/version_list',
    QueryGoodsDetail = '/api/v1/vova_goods/detail',
    EditGoodsDetail = '/api/v1/vova_goods/edits',
    CleanChangedProperties = '/api/v1/vova_goods/readed_property',
    ExportGoodsVersion = '/api/v1/vova_goods/version_exports',
    ActiveGoodsVersion = '/api/v1/vova_goods/apply_version',
}
