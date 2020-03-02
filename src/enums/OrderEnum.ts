const allColumnList = [
    {
        key: 'order_confirm_time',
        name: '订单确认时间'
    },
    {
        key: 'channel_order_id',
        name: '渠道订单ID'
    },
    {
        key: 'channel_goods_price',
        name: '价格'
    },
    {
        key: 'channel_shipping_fee',
        name: '运费'
    },
    {
        key: 'goods_number',
        name: '商品数量'
    },
    {
        key: 'cancel_order_time',
        name: '取消订单时间'
    },
    {
        key: 'goods_detail',
        name: '商品详情'
    },
    {
        key: 'middleground_order_status',
        name: '中台订单状态'
    },
    {
        key: 'goods_purchase_payment_status',
        name: '采购支付状态'
    },
    {
        key: 'goods_purchase_order_time',
        name: '采购生成时间'
    },
    {
        // key: 'goods_purchase_shipping_no',
        key: 'goods_purchase_waybill_sn',
        name: '采购运单号'
    },
    {
        key: 'channel',
        name: '销售渠道'
    },
    {
        key: 'middleground_p_order_id',
        name: '中台父订单ID'
    },
    {
        key: 'currency_type',
        name: '货币类型'
    },
    {
        key: 'remain_delivery_time',
        name: '发货剩余时间'
    },
    {
        key: 'channel_store_name',
        name: '渠道店铺名'
    },
    // {
    //     key: 'purchase_delivery_status',
    //     name: '采购配送状态'
    // },
    {
        key: 'purchase_cancel_reason',
        name: '采购取消原因'
    },
    {
        key: 'goods_amount',
        name: '商品总金额'
    },
    {
        key: 'channel_order_status',
        name: '渠道订单状态'
    },
    {
        // key: 'goods_purchase_order_status',
        key: 'goods_purchase_status',
        name: '采购订单状态'
    },
    {
        key: 'goods_purchase_delivery_status',
        name: '采购配送状态'
    },
    {
        key: 'goods_purchase_order_sn',
        name: '采购订单号'
    },
    {
        key: 'p_order_id',
        name: '父订单ID'
    },
    {
        key: 'child_order_id',
        name: '子订单ID'
    },
    {
        key: 'middleground_c_order_id',
        name: '中台子订单ID'
    }
];

// 未勾选仅展示父订单ID
const defaultColList = [
    'order_confirm_time',                   // 订单时间
    'middleground_c_order_id',              // 中台订单子ID
    'goods_detail',                         // 商品详情
    'product_id',                           // Product_id
    'channel_order_status',                 // 渠道订单状态
    'channel_delivery_status',              // 渠道发货状态
    'middleground_order_status',            // 中台订单状态
    'goods_commodity_id',                   // 中台商品ID
    'goods_purchase_status',                // 采购订单状态
    'goods_purchase_payment_status',        // 采购支付状态
    'goods_purchase_delivery_status',       // 采购配送状态
    'goods_purchase_order_time',            // 采购生成时间
    'goods_purchase_order_sn',              // 采购订单号
    'goods_purchase_waybill_sn'             // 采购运单号
]
// 勾选仅展示
const defaultParentColList = [
    'order_confirm_time',                   // 订单时间
    'middleground_p_order_id',              // 中台订单父订单ID
    'middleground_order_status',            // 中台订单状态
    'goods_detatil',                        // 商品详情
    'channel_order_status',                 // 渠道订单状态
    'channel_delivery_status',              // 渠道发货状态
    'goods_commodity_id',                   // 中台商品ID
    // 'goods_commodity_id',                   // 中台子订单ID
    'goods_purchase_status',                // 采购订单状态
    'goods_purchase_payment_status',        // 采购支付状态
    'goods_purchase_delivery_status',       // 采购配送状态
    'goods_purchase_order_time',            // 采购生成时间
    'goods_purchase_order_sn',              // 采购订单号
    'goods_purchase_waybill_sn'             // 采购运单号
]

/*** 采购未发货 ***/
const defaultStockColList = [
    'order_create_time',
    'middleground_order_id',
    'commodity_id',
    'purchase_shipping_no',
    'purchase_order_status',
    'purchase_shipping_status',
    'purchase_pay_time',
    'purchase_num'
]

const notStockOptionalColList = [
    {
        key: 'a1',
        name: '订单确认时间'
    },
    {
        key: 'a2',
        name: '渠道订单ID'
    },
    {
        key: 'a3',
        name: '采购支付状态'
    },
    {
        key: 'a4',
        name: '采购生成时间'
    },
    {
        key: 'a5',
        name: '采购订单号'
    },
]

/*** 仓库未发货 ***/
const defaultStockNotShipColList = [
    'order_create_time',
    'middleground_order_id',
    'commodity_id',
    'purchase_shipping_no',
    'purchase_order_status',
    'purchase_shipping_status',
    'warehousing_time',
    'xxx_time'
]

const stockNotShipOptionalColList = [
    {
        key: 'a1',
        name: '订单确认时间'
    },
    {
        key: 'a2',
        name: '渠道订单ID'
    },
    {
        key: 'a3',
        name: '价格'
    },
    {
        key: 'a4',
        name: '运费'
    },
    {
        key: 'a5',
        name: '商品数量'
    },
    {
        key: 'a6',
        name: '取消订单时间'
    },
    {
        key: 'a7',
        name: '商品总金额'
    },
    {
        key: 'a8',
        name: '发货剩余时间'
    },
]

export { 
    allColumnList,
    defaultColList,
    defaultParentColList,
    defaultStockColList,
    notStockOptionalColList,
    defaultStockNotShipColList,
    stockNotShipOptionalColList
};
