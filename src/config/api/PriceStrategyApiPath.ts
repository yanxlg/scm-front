export enum PriceStrategyApiPath {
    getTagsList = '/api/v1/tags/list',
    getShippingCardNameList = '/v1/price_strategy/shipping_card_name_list',
    getShippingCardCountry = '/v1/price_strategy/shipping_card_country',
    getShippingCardList = '/v1/price_strategy/list_shipping_card',
    saveShippingCard = '/api/v1/price_strategy/shipping_card_save',
    getShippingFeeRuleList = '/v1/price_strategy/list_shipping_fee_rule',
    saveShippingFeeRule = '/api/v1/price_strategy/shipping_fee_rule_save',
    startPriceStrategyUpdate = '/api/v1/price_strategy/rule_update',
    getCatagoryWeightList = '/v1/price_strategy/category_weight_list',
    saveCatagoryWeight = '/v1/price_strategy/category_weight_save',
    getCatagoryWeightLog = '/v1/price_strategy/category_weight_log',
}
