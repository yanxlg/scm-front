import { FormField } from 'react-components/es/JsonForm';

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
    // { name: '采购失败', value: 3 },
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
    { name: '已重新生成', value: 6 },
    { name: '最终取消', value: 7 },
];

export const purchasePayOptionList = [
    { name: '未支付', value: 1 },
    { name: '已支付', value: 2 },
    { name: '已退款', value: 3 },
    { name: '待退款', value: 4 },
    { name: '审核不通过', value: 5 },
    { name: '待审核', value: 6 },
];

export const purchaseShippingOptionList = [
    { name: '未配送', value: 1 },
    { name: '已发货', value: 2 },
    { name: '已妥投', value: 3 },
];

export const purchaseReserveOptionList = [
    { name: '未预定', value: 1 },
    { name: '预定失败', value: 2 },
    { name: '预定成功', value: 3 },
    { name: '预定已释放', value: 4 },
];

export const errorTypeOptionList = [
    { name: '仓库异常', value: 1 },
    { name: '尾程异常', value: 2 },
    { name: '采购异常', value: 3 },
    { name: '其他', value: 4 },
];

export const errorDetailOptionMap = {
    // 仓库异常
    11: '24小时未拍单',
    5: '72小时未入库',
    6: '48小时未出库',
    // 采购异常
    2: '拍单失败超24小时',
    3: '12小时未支付',
    4: '48小时未发货',
    12: '拍单失败',
    // 尾程异常
    8: '7天未揽收',
    9: '14天未揽收',
    10: '30天未妥投',
    // 其他异常
    7: '6天未标记发货',
};

export type ErrorDetailOptionCode = keyof typeof errorDetailOptionMap;

export const errorDetailOptionList = [
    // 仓库异常
    { name: '24小时未拍单', value: 11 },
    { name: '72小时未入库', value: 5 },
    { name: '48小时未出库', value: 6 },
    // 采购异常
    { name: '拍单失败超24小时', value: 2 },
    { name: '12小时未支付', value: 3 },
    { name: '48小时未发货', value: 4 },
    // 尾程异常
    { name: '7天未揽收', value: 8 },
    { name: '14天未揽收', value: 9 },
    { name: '30天未妥投', value: 10 },
    // 其他异常
    { name: '6天未标记发货', value: 7 },
];

export const purchasePlatformOptionList = [{ name: 'PDD', value: 1 }];

export const childDefaultFieldList: FormField[] = [
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单生成时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'input',
        name: 'order_goods_id',
        label: '子订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入子订单ID',
        formatter: 'numberStrArr',
    },
    {
        type: 'input',
        name: 'channel_order_goods_sn',
        label: '销售订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入销售订单ID',
        formatter: 'strArr',
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

export const childAllFieldList: FormField[] = [
    ...childDefaultFieldList,

    {
        type: 'input',
        name: 'order_id',
        label: '父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入父订单ID',
        formatter: 'numberStrArr',
    },
    {
        type: 'input',
        name: 'purchase_plan_id',
        label: '采购计划ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购计划ID',
        formatter: 'numberStrArr',
    },
    {
        type: 'input',
        name: 'purchase_waybill_no',
        label: '采购运单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购运单ID',
        formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'last_waybill_no',
        label: '销售尾程运单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入销售尾程运单ID',
        formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'product_id',
        label: 'Version ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入Version ID',
        formatter: 'strArr',
    },
    {
        type: 'input',
        name: 'sku_id',
        label: '中台SKU ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入中台SKU ID',
        formatter: 'strArr',
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
    {
        type: 'select',
        name: 'reserve_status',
        label: '仓库库存预定状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...purchaseReserveOptionList],
    },
    {
        type: 'select',
        name: 'purchase_order_status',
        label: '采购订单状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...purchaseOrderOptionList],
    },
    {
        type: 'select',
        name: 'purchase_order_pay_status',
        label: '采购支付状态',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [defaultOptionItem, ...purchasePayOptionList],
    },
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
        label: '配送状态',
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
        optionList: [defaultOptionItem, { name: '没有', value: 2 }],
    },
    {
        type: 'dateRanger',
        name: ['purchase_time_start', 'purchase_time_end'],
        label: '采购签收时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['delivery_time_start', 'delivery_time_end'],
        label: '销售订单出库时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    //上线时间 揽收时间
    {
        type: 'dateRanger',
        name: ['collect_time_start', 'collect_time_end'],
        label: '销售订单揽收时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['receive_time_start', 'receive_time_end'],
        label: '妥投时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['pay_time_start', 'pay_time_end'],
        label: '采购支付时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['storage_time_start', 'storage_time_end'],
        label: '采购入库时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['confirm_time_start', 'confirm_time_end'],
        label: '销售订单确认时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'dateRanger',
        name: ['cancel_time_start', 'cancel_time_end'],
        label: '销售订单取消时间',
        className: 'order-all-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    // endFieldItem
];

// bool non_purchase_plan = 30;//没有采购计划的 true 没有采购计划

// 未勾选仅展示父订单ID
export const defaultColChildList = [
    'createTime', // 订单生成时间
    'orderGoodsStatus', // 订单状态
    'orderGoodsShippingStatusShow', // 配送状态
    'orderGoodsId', // 子订单ID
    'productId', // Version ID
    'productImage', // SKU图片
    // 'a1',                             // 商品名称 - 待确认
    'productStyle', // 商品规格
    'goodsNumber', // 销售商品数量
    'freight', // 销售商品运费
    '_goodsTotalAmount', // 销售商品总金额
    'purchaseNumber', // 采购商品数量
    '_purchaseTotalAmount', // 采购商品总金额
    'channelSource', // 销售渠道
    // 'a2',                             // 销售渠道Goods ID
    'confirmTime', // 销售订单确认时间
    'channelOrderGoodsSn', // 渠道订单ID
    'lastWaybillNo', // 销售尾程运单ID
    'purchasePlanId', // 采购计划ID
    'reserveStatus', // 仓库库存预定状态
    'purchasePlatform', // 采购平台
    'purchaseOrderStatus', // 采购订单状态
    'purchaseOrderPayStatus', // 采购支付状态
];

export const childOptionalColList = [
    { key: 'orderId', name: '父订单ID' },
    { key: 'skuId', name: '中台SKU ID' },
    { key: 'goodsAmount', name: '销售商品单价' },
    { key: 'currency', name: '销售金额货币' },
    { key: 'purchaseAmount', name: '采购商品单价' },
    // { key: '', name: '商品属性标签' },               // 待补充
    // { key: 'productShop', name: '销售店铺名称' },    // 待补充
    // { key: '', name: '销售渠道二级分类' },           // 待补充
    { key: 'cancelTime', name: '销售订单取消时间' },
    { key: 'deliveryTime', name: '销售订单出库时间' },
    { key: 'collectTime', name: '销售订单揽收时间' },
    { key: 'receiveTime', name: '妥投时间' },
    // { key: 'productShop', name: '采购店铺名称' },     // 待补充
    { key: 'purchaseCreateTime', name: '采购订单生成时间' },
    { key: 'purchasePlatformParentOrderId', name: '采购父订单ID' },
    { key: 'purchasePlatformOrderId', name: '采购订单ID' },
    { key: 'payTime', name: '采购支付时间' },
    { key: 'purchaseWaybillNo', name: '采购运单ID' },
    { key: 'purchaseCancelReason', name: '采购取消原因' },
    { key: 'purchaseTime', name: '采购签收时间' },
    { key: 'storageTime', name: '采购入库时间' },
    { key: '_logisticsTrack', name: '物流轨迹' },
];

export const parentDefaultFieldList: FormField[] = [
    {
        type: 'dateRanger',
        name: ['order_time_start', 'order_time_end'],
        label: '订单生成时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
    },
    {
        type: 'input',
        name: 'order_id',
        label: '父订单ID',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入父订单ID',
        formatter: 'numberStrArr',
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

export const parentAllFieldList: FormField[] = [
    ...parentDefaultFieldList,
    {
        type: 'input',
        name: 'channel_order_goods_sn',
        label: '销售订单id',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入销售订单id',
        formatter: 'strArr',
    },
    {
        type: 'dateRanger',
        name: ['confirm_time_start', 'confirm_time_end'],
        label: '订单确认时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
        formatter: ['start_date', 'end_date'],
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
    'goodsAmount', // 商品价格
    'orderGoodsId', // 中台子订单ID
    'channelOrderGoodsSn', // 渠道订单ID
    'orderGoodsStatus', // 中台订单状态
    'orderGoodsShippingStatus', // 中台订单配送状态
];

export const parentOptionalColList = [
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
