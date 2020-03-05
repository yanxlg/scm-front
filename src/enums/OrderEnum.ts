import { IFieldItem } from '@/components/JsonForm';

declare interface optionItem {
    name: string;
    value: number;
}

export const pageSizeOptions = ['30', '50', '100', '500'];

export const defaultOptionItem: optionItem = { name: '全部', value: 100 }

export const channelOptionList = [
    { name: 'VOVA', value: 1 },
    { name: 'FD', value: 2 },
    { name: 'AZ', value: 3 }
]

export const orderStatusOptionList = [
    { name: '已确认', value: 1 },
    { name: '已取消', value: 2 }
]

export const purchaseOrderOptionList = [
    { name: '待拍单', value: 1 },
    { name: '已取消', value: 2 },
    { name: '拍单失败', value: 3 },
    { name: '拍单中', value: 4 },
    { name: '已拍单', value: 5 }
]

export const purchasePayOptionList = [
    { name: '未支付', value: 1 },
    { name: '已支付', value: 2 },
    { name: '已退款', value: 3 }
]

export const purchaseShippingOptionList = [
    { name: '未配送', value: 1 },
    { name: '已发货', value: 2 },
    { name: '已妥投', value: 3 }
]

export const errorTypeOptionList = [
    { name: '仓库异常', value: 1 },
    { name: '尾程异常', value: 2 },
    { name: '采购异常', value: 3 },
    { name: '其他', value: 4 }
]

export const errorDetailOptionList = [
    { name: '12小时未支付', value: 1 },
    { name: '24小时未拍单', value: 2 },
    { name: '48小时未发货', value: 3 },
    { name: '48小时未出库', value: 4 },
    { name: '72小时未入库', value: 5 },
    { name: '6天未标记发货', value: 6 },
    { name: '7天未上线', value: 7 },
    { name: '14天未上线', value: 8 },
    { name: '30天未妥投', value: 9 }
]


export const childDefaultFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'middleground_order_id',
        label: '中台订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'input',
        name: 'sale_order_id',
        label: '销售订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入销售订单ID',
    },
    {
        type: 'input',
        name: 'purchase_order_id',
        label: '采购订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购订单ID',
    },
    {
        type: 'select',
        name: 'channel',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...channelOptionList
        ],
    }
]

export const childAllFieldList: IFieldItem[] = [
    ...childDefaultFieldList,
    {
        type: 'dateRanger',
        name: ['purchase_start_time', 'purchase_end_time'],
        label: '采购时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'middleground_p_order_id',
        label: '中台父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台父订单ID',
    },
    {
        type: 'input',
        name: 'purchase_shipping_no',
        label: '采购运单号',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购运单号',
    },
    {
        type: 'input',
        name: 'last_waybill_no',
        label: '尾程运单号',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入尾程运单号',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台商品ID',
    },
    {
        type: 'input',
        name: 'sku_id',
        label: '中台SKU ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台SKU ID',
    },
    {
        type: 'select',
        name: 'sale_order_status',
        label: '渠道订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...orderStatusOptionList
        ],
    },
    {
        type: 'select',
        name: 'purchase_order_status',
        label: '采购订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...purchaseOrderOptionList
        ],
    },
    {
        type: 'select',
        name: 'purchase_pay_status',
        label: '采购支付状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...purchasePayOptionList
        ],
    },
    {
        type: 'select',
        name: 'purchase_shipping_status',
        label: '采购配送状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...purchaseShippingOptionList
        ],
    },
    {
        type: 'select',
        name: 'purchase_cancel_res',
        label: '采购取消原因',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem
        ],
    },
    // endFieldItem
];

export const childOptionalColList = [
    {
        key: 'channel_shipping_fee',
        name: '运费'
    },
    // {
    //     key: 'order_confirm_time',
    //     name: '订单确认时间'
    // },
    // {
    //     key: 'channel_order_id',
    //     name: '渠道订单ID'
    // },
    // {
    //     key: 'channel_goods_price',
    //     name: '价格'
    // },
    // {
    //     key: 'channel_shipping_fee',
    //     name: '运费'
    // },
    // {
    //     key: 'goods_number',
    //     name: '商品数量'
    // },
    // {
    //     key: 'cancel_order_time',
    //     name: '取消订单时间'
    // },
    // {
    //     key: 'goods_detail',
    //     name: '商品详情'
    // },
    // {
    //     key: 'middleground_order_status',
    //     name: '中台订单状态'
    // },
    // {
    //     key: 'goods_purchase_payment_status',
    //     name: '采购支付状态'
    // },
    // {
    //     key: 'goods_purchase_order_time',
    //     name: '采购生成时间'
    // },
    // {
    //     // key: 'goods_purchase_shipping_no',
    //     key: 'goods_purchase_waybill_sn',
    //     name: '采购运单号'
    // },
    // {
    //     key: 'channel',
    //     name: '销售渠道'
    // },
    // {
    //     key: 'middleground_p_order_id',
    //     name: '中台父订单ID'
    // },
    // {
    //     key: 'currency_type',
    //     name: '货币类型'
    // },
    // {
    //     key: 'remain_delivery_time',
    //     name: '发货剩余时间'
    // },
    // {
    //     key: 'channel_store_name',
    //     name: '渠道店铺名'
    // },
    // {
    //     key: 'purchase_delivery_status',
    //     name: '采购配送状态'
    // },
    // {
    //     key: 'purchase_cancel_reason',
    //     name: '采购取消原因'
    // },
    // {
    //     key: 'goods_amount',
    //     name: '商品总金额'
    // },
    // {
    //     key: 'channel_order_status',
    //     name: '渠道订单状态'
    // },
    // {
    //     key: 'goods_purchase_status',
    //     name: '采购订单状态'
    // },
    // {
    //     key: 'goods_purchase_delivery_status',
    //     name: '采购配送状态'
    // },
    // {
    //     key: 'goods_purchase_order_sn',
    //     name: '采购订单号'
    // },
    // {
    //     key: 'p_order_id',
    //     name: '父订单ID'
    // },
    // {
    //     key: 'child_order_id',
    //     name: '子订单ID'
    // },
    // {
    //     key: 'middleground_c_order_id',
    //     name: '中台子订单ID'
    // }
];

export const parentDefaultFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'middleground_order_id',
        label: '中台订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'select',
        name: 'channel',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...channelOptionList
        ],
    }
]

export const parentAllFieldList: IFieldItem[] = [
    ...parentDefaultFieldList,
    {
        type: 'select',
        name: 'xxx_1',
        label: '中台订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem
        ],
    },
    {
        type: 'input',
        name: 'middleground_p_order_id',
        label: '中台父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台父订单ID',
    },
    {
        type: 'input',
        name: 'last_waybill_no',
        label: '尾程运单号',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入尾程运单号',
    },
    {
        type: 'input',
        name: 'product_id',
        label: '中台商品ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台商品ID',
    },
    {
        type: 'input',
        name: 'sku_id',
        label: '中台SKU ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台SKU ID',
    },
]

// 未勾选仅展示父订单ID
export const defaultColChildList = [
    'goodsCreateTime',                      // 订单时间
    'orderGoodsId',                         // 中台订单子ID
    'goods_detail',                         // 商品详情
    'product_sn',                           // Product_sn
    'channel_order_status',                 // 渠道订单状态
    'channel_delivery_status',              // 渠道发货状态
    'orderGoodsStatus',                     // 中台订单状态
    'productId',                            // 中台商品ID
    'purchaseOrderStatus',                  // 采购订单状态
    'purchaseOrderPayStatus',               // 采购支付状态
    'purchaseOrderShippingStatus',          // 采购配送状态
    'purchaseCreateTime',                   // 采购生成时间
    'goods_purchase_order_sn',              // 采购订单号
    'goods_purchase_waybill_sn'             // 采购运单号
]
// 勾选仅展示
export const defaultParentColList = [
    'createTime',                  // 订单时间
    'orderId',                     // 中台订单父订单ID
    'a1',                      // 运费
    'channel_order_status',        // 渠道订单状态
    'channel_delivery_status',     // 渠道发货状态
    'productId',                   // 中台商品ID
    'goodsNumber',                 // 商品数量
    'orderGoodsId',                // 中台子订单ID
    'orderGoodsStatus',            // 中台订单状态
    'orderGoodsShippingStatus'     // 中台订单配送状态
]

/*** 采购未发货 ***/
export const defaultStockColList = [
    'order_create_time',
    'middleground_order_id',
    'commodity_id',
    'purchase_shipping_no',
    'purchase_order_status',
    'purchase_shipping_status',
    'purchase_pay_time',
    'purchase_num'
]

export const notStockOptionalColList = [
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
export const defaultStockNotShipColList = [
    'order_create_time',
    'middleground_order_id',
    'commodity_id',
    'purchase_shipping_no',
    'purchase_order_status',
    'purchase_shipping_status',
    'warehousing_time',
    'xxx_time'
]

export const stockNotShipOptionalColList = [
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


