import { IFieldItem } from '@/components/SearchForm';

declare interface optionItem {
    name: string;
    value: number;
}

export const pageSizeOptions = ['50', '100', '500', '1000'];

export const defaultOptionItem: optionItem = { name: '全部', value: 100 };

export const channelOptionList = [
    { name: 'VOVA', value: 1 },
    { name: 'FD', value: 2 },
    { name: 'AZ', value: 3 },
];

export const orderStatusOptionList = [
    { name: '已确认', value: 1 },
    { name: '已取消', value: 2 },
];

export const orderShippingOptionList = [
    { name: '未配送', value: 1 },
    { name: '头程已配送', value: 2 },
    { name: '已妥投未入库', value: 3 },
    { name: '已入库', value: 4 },
    { name: '出库中', value: 5 },
    { name: '出库失败', value: 6 },
    { name: '取消出库', value: 7 },
    { name: '已出库', value: 8 },
    { name: '尾程已揽收', value: 9 },
    { name: '已妥投', value: 10 },
];

export const hasOptionList = [
    { name: '有', value: 1 },
    { name: '没有', value: 2 },
];

export const purchaseOrderOptionList = [
    { name: '待拍单', value: 1 },
    { name: '已取消', value: 2 },
    { name: '拍单失败', value: 3 },
    { name: '拍单中', value: 4 },
    { name: '已拍单', value: 5 },
];

export const purchasePayOptionList = [
    { name: '未支付', value: 1 },
    { name: '已支付', value: 2 },
    { name: '已退款', value: 3 },
];

export const purchaseShippingOptionList = [
    { name: '未配送', value: 1 },
    { name: '已发货', value: 2 },
    { name: '已妥投', value: 3 },
];

export const errorTypeOptionList = [
    { name: '仓库异常', value: 1 },
    { name: '尾程异常', value: 2 },
    { name: '采购异常', value: 3 },
    { name: '其他', value: 4 },
];

export const errorDetailOptionList = [
    { name: '12小时未支付', value: 1 },
    { name: '24小时未拍单', value: 2 },
    { name: '48小时未发货', value: 3 },
    { name: '48小时未出库', value: 4 },
    { name: '72小时未入库', value: 5 },
    { name: '6天未标记发货', value: 6 },
    { name: '7天未上线', value: 7 },
    { name: '14天未上线', value: 8 },
    { name: '30天未妥投', value: 9 },
];

export const childDefaultFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'order_goods_id',
        label: '中台订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台订单ID',
    },
    {
        type: 'input',
        name: 'channel_order_goods_sn',
        label: '销售订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入销售订单ID',
    },
    // {
    //     type: 'input',
    //     name: 'purchase_order_id',
    //     label: '采购订单ID',
    //     className: 'order-input',
    //     formItemClassName: 'order-form-item',
    //     placeholder: '请输入采购订单ID',
    // },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
];

export const childAllFieldList: IFieldItem[] = [
    ...childDefaultFieldList,

    {
        type: 'input',
        name: 'order_id',
        label: '中台父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台父订单ID',
    },
    // {
    //     type: 'input',
    //     name: 'purchase_shipping_no',
    //     label: '采购运单号',
    //     className: 'order-input',
    //     formItemClassName: 'order-form-item',
    //     placeholder: '请输入采购运单号',
    // },
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
    // {
    //     type: 'select',
    //     name: 'sale_order_status',
    //     label: '渠道订单状态',
    //     className: 'order-input',
    //     formItemClassName: 'order-form-item',
    //     optionList: [
    //         defaultOptionItem,
    //         ...orderStatusOptionList
    //     ],
    // },
    // {
    //     type: 'select',
    //     name: 'purchase_order_status',
    //     label: '采购订单状态',
    //     className: 'order-input',
    //     formItemClassName: 'order-form-item',
    //     optionList: [
    //         defaultOptionItem,
    //         ...purchaseOrderOptionList
    //     ],
    // },
    // {
    //     type: 'select',
    //     name: 'purchase_pay_status',
    //     label: '采购支付状态',
    //     className: 'order-input',
    //     formItemClassName: 'order-form-item',
    //     optionList: [
    //         defaultOptionItem,
    //         ...purchasePayOptionList
    //     ],
    // },
    // {
    //     type: 'select',
    //     name: 'purchase_shipping_status',
    //     label: '采购配送状态',
    //     className: 'order-input',
    //     formItemClassName: 'order-form-item',
    //     optionList: [
    //         defaultOptionItem,
    //         ...purchaseShippingOptionList
    //     ],
    // },
    // {
    //     type: 'select',
    //     name: 'purchase_cancel_res',
    //     label: '采购取消原因',
    //     className: 'order-input',
    //     formItemClassName: 'order-form-item',
    //     optionList: [
    //         defaultOptionItem
    //     ],
    // },
    {
        type: 'select',
        name: 'order_goods_status',
        label: '订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...orderStatusOptionList],
    },
    {
        type: 'select',
        name: 'order_goods_shipping_status',
        label: '订单配送状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...orderShippingOptionList],
    },
    {
        type: 'select',
        name: 'non_purchase_plan',
        label: '采购计划',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...hasOptionList],
    },
    {
        type: 'dateRanger',
        name: ['purchase_time_start', 'purchase_time_end'],
        label: '采购时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'dateRanger',
        name: ['delivery_time_start', 'delivery_time_end'],
        label: '出库时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    //上线时间 揽收时间
    {
        type: 'dateRanger',
        name: ['collect_time_start', 'collect_time_start'],
        label: '揽收时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'dateRanger',
        name: ['receive_time_start', 'receive_time_end'],
        label: '收货时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'dateRanger',
        name: ['pay_time_start', 'pay_time_end'],
        label: '支付时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'dateRanger',
        name: ['storage_time_start', 'storage_time_end'],
        label: '入库时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'dateRanger',
        name: ['confirm_time_start', 'confirm_time_end'],
        label: '订单确认时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'dateRanger',
        name: ['cancel_time_start', 'cancel_time_end'],
        label: 'og订单取消时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    // endFieldItem
];

// bool non_purchase_plan = 30;//没有采购计划的 true 没有采购计划

// 未勾选仅展示父订单ID
export const defaultColChildList = [
    'createTime', // 订单时间
    'orderGoodsId', // 中台订单子ID
    'goodsDetail', // 商品详情
    'channelOrderGoodsSn', // Product_sn
    // 'channel_order_status',         // 渠道订单状态
    // 'channel_delivery_status',      // 渠道发货状态
    'orderGoodsStatus', // 中台订单状态
    'productId', // 中台商品ID
    'purchasePlanId', // 计划子项ID
    'purchaseOrderStatus', // 采购订单状态
    'purchaseOrderPayStatus', // 采购支付状态
    'purchaseOrderShippingStatus', // 采购配送状态
    'purchaseCreateTime', // 采购生成时间
    'purchasePlatformOrderId', // 采购订单号
    'purchaseWaybillNo', // 采购运单号
];

export const childOptionalColList = [
    { key: 'purchaseCancelReason', name: '采购取消原因' }, // 2
    // orderInfo
    { key: 'confirmTime', name: '订单确认时间' }, // 1
    { key: 'channelOrderSn', name: '渠道订单ID' }, // 1
    { key: 'goodsAmount', name: '价格' }, // 1
    // { key: 'a4', name: '运费' },
    { key: 'goodsNumber', name: '商品数量' }, // 1
    { key: '_goodsTotalAmount', name: '商品总金额' }, // 1
    // { key: 'a6', name: '取消订单时间' },
    { key: 'productPlatform', name: '销售渠道' }, // 1
    { key: 'orderId', name: '中台父订单ID' }, // 1
    // orderInfo
    { key: 'currency', name: '货币类型' }, // 1
    // { key: 'a10', name: '发货剩余时间' },
    { key: 'productShop', name: '渠道店铺名' }, // 1
    // { key: 'a14', name: '渠道订单状态' },
    // { key: 'a15', name: '父订单ID' },
    // { key: 'a16', name: '子订单ID' },
    // { key: 'orderGoodsId', name: '中台子订单ID' }, // 1
    // { key: 'a18', name: '一级类目' },
    // { key: 'a19', name: '二级类目' },
    // { key: 'a20', name: '三级类目' },
];

export const parentDefaultFieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'input',
        name: 'order_id',
        label: '中台父订单id',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台父订单id',
    },
    {
        type: 'select',
        name: 'channel_source',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...channelOptionList],
    },
];

export const parentAllFieldList: IFieldItem[] = [
    ...parentDefaultFieldList,
    {
        type: 'input',
        name: 'channel_order_goods_sn',
        label: '销售订单id',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入销售订单id',
    },
    {
        type: 'dateRanger',
        name: ['confirm_time_start', 'confirm_time_end'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
];

// 勾选仅展示
export const defaultParentColList = [
    'createTime', // 订单时间
    'orderId', // 中台订单父订单ID
    // 'a1',                          // 运费
    // 'channel_order_status',        // 渠道订单状态
    // 'channel_delivery_status',     // 渠道发货状态
    'productId', // 中台商品ID
    'goodsNumber', // 商品数量
    'orderGoodsId', // 中台子订单ID
    'orderGoodsStatus', // 中台订单状态
    'orderGoodsShippingStatus', // 中台订单配送状态
];

export const parentOptionalColList = [
    { key: 'orderGoodsId', name: '中台子订单ID' }, // 2
    { key: 'goodsAmount', name: '价格' }, // 2
    { key: 'goodsDetail', name: '商品详情' }, // 2
    { key: 'productShop', name: '渠道店铺名' }, // 2
    { key: 'confirmTime', name: '订单确认时间' }, // 1
    { key: 'channelSource', name: '销售渠道' }, // 1
    { key: 'currency', name: '货币类型' }, // 1
    { key: 'orderAmount', name: '商品总金额' }, // 1
    // { key: 'a2', name: '渠道订单ID' },
    // { key: 'a4', name: '取消订单时间' },
    // { key: 'a8', name: '发货剩余时间' },
    // { key: 'a10', name: '一级类目' },
    // { key: 'a11', name: '二级类目' },
    // { key: 'a12', name: '三级类目' },
    // { key: 'a14', name: '父订单ID' },
    // { key: 'a15', name: '子订单ID' },
];

/*** 采购未发货 ***/
export const defaultStockColList = [
    'order_create_time',
    'middleground_order_id',
    'commodity_id',
    'purchase_shipping_no',
    'purchase_order_status',
    'purchase_shipping_status',
    'purchase_pay_time',
    'purchase_num',
];

export const notStockOptionalColList = [
    {
        key: 'a1',
        name: '订单确认时间',
    },
    {
        key: 'a2',
        name: '渠道订单ID',
    },
    {
        key: 'a3',
        name: '采购支付状态',
    },
    {
        key: 'a4',
        name: '采购生成时间',
    },
    {
        key: 'a5',
        name: '采购订单号',
    },
];

/*** 仓库未发货 ***/
export const defaultStockNotShipColList = [
    'order_create_time',
    'middleground_order_id',
    'commodity_id',
    'purchase_shipping_no',
    'purchase_order_status',
    'purchase_shipping_status',
    'warehousing_time',
    'xxx_time',
];

export const stockNotShipOptionalColList = [
    {
        key: 'a1',
        name: '订单确认时间',
    },
    {
        key: 'a2',
        name: '渠道订单ID',
    },
    {
        key: 'a3',
        name: '价格',
    },
    {
        key: 'a4',
        name: '运费',
    },
    {
        key: 'a5',
        name: '商品数量',
    },
    {
        key: 'a6',
        name: '取消订单时间',
    },
    {
        key: 'a7',
        name: '商品总金额',
    },
    {
        key: 'a8',
        name: '发货剩余时间',
    },
];
