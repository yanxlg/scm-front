import { Request, Response } from 'express';

const list = [
    {
        order_confirm_time: 1582703606,                          // 订单确认时间
        channel_order_id: "111",                                 // 渠道订单ID
        channel_goods_price: 1,                                  // 价格
        channel_shipping_fee: 2,                                 // 运费
        goods_number: 3,                                         // 商品数量
        cancel_order_time: 1582703606,                           // 取消订单时间
        middleground_order_status: 1,                            // 中台订单状态
        purchase_payment_status: 1,                              // 采购支付状态
        purchase_order_time: 1582703606,                         // 采购生成时间
        purchase_shipping_no: "purchase_shipping_no",            // 采购运单号
        channel: 1,                                              // 销售渠道
        middleground_p_order_id: "middleground_p_order_id",      // 中台父订单ID
        currency_type: "currency_type",                          // 货币类型
        remain_delivery_time: "remain_delivery_time",            // 发货剩余时间
        channel_store_name: "channel_store_name",                // 渠道店铺名
        purchase_delivery_status: 1,                             // 采购配送状态
        purchase_cancel_reason: 1,                               // 采购取消原因
        goods_amount: 8888,                                      // 商品总金额
        channel_order_status: 1,                                 // 渠道订单状态
        purchase_order_status: 1,                                // 采购订单状态
        purchase_order_no: "purchase_order_no",                  // 采购订单号
        p_order_id: "p_order_id",                                // 父订单ID
        child_order_id: "child_order_id",                        // 子订单ID
        middleground_c_order_id: "middleground_c_order_id",      // 中台子订单ID 
        goods_list: [
            {
                commodity_id: "111111",
                purchase_status:{
                    status: 1, 
                    comment: "无库存" 
                },
                purchase_payment_status: 1,                      // 采购支付状态
                purchase_delivery_status: 1,                     // 采购配送状态
                purchase_order_time: 1582703606,                 // 采购生成时间
                purchase_order_sn: "purchase_order_sn",          // 采购订单号
                purchase_waybill_sn: "purchase_waybill_sn",      // 采购运单号
            },
            {
                commodity_id: "222222",
                purchase_status:{
                    status: 1, 
                    comment: "无库存" 
                },
                purchase_payment_status: 1,                      // 采购支付状态
                purchase_delivery_status: 1,                     // 采购配送状态
                purchase_order_time: 1582703606,                 // 采购生成时间
                purchase_order_sn: "purchase_order_sn",          // 采购订单号
                purchase_waybill_sn: "purchase_waybill_sn",      // 采购运单号
            },
        ]
    },
    {
        order_confirm_time: 1582703606,                          // 订单确认时间
        channel_order_id: "222",                                 // 渠道订单ID
        channel_goods_price: 1,                                  // 价格
        channel_shipping_fee: 2,                                 // 运费
        goods_number: 3,                                         // 商品数量
        cancel_order_time: 1582703606,                           // 取消订单时间
        middleground_order_status: 1,                            // 中台订单状态
        purchase_payment_status: 1,                              // 采购支付状态
        purchase_order_time: 1582703606,                         // 采购生成时间
        purchase_shipping_no: "purchase_shipping_no",            // 采购运单号
        channel: 1,                                              // 销售渠道
        middleground_p_order_id: "middleground_p_order_id",      // 中台父订单ID
        currency_type: "currency_type",                          // 货币类型
        remain_delivery_time: "remain_delivery_time",            // 发货剩余时间
        channel_store_name: "channel_store_name",                // 渠道店铺名
        purchase_delivery_status: 1,                             // 采购配送状态
        purchase_cancel_reason: 1,                               // 采购取消原因
        goods_amount: 8888,                                      // 商品总金额
        channel_order_status: 1,                                 // 渠道订单状态
        purchase_order_status: 1,                                // 采购订单状态
        purchase_order_no: "purchase_order_no",                  // 采购订单号
        p_order_id: "p_order_id",                                // 父订单ID
        child_order_id: "child_order_id",                        // 子订单ID
        middleground_c_order_id: "middleground_c_order_id",      // 中台子订单ID 
        goods_list: [
            {
                commodity_id: "333333",
                purchase_status:{
                    status: 1, 
                    comment: "无库存" 
                },
                purchase_payment_status: 1,                      // 采购支付状态
                purchase_delivery_status: 1,                     // 采购配送状态
                purchase_order_time: 1582703606,                 // 采购生成时间
                purchase_order_sn: "purchase_order_sn",          // 采购订单号
                purchase_waybill_sn: "purchase_waybill_sn",      // 采购运单号
            },
            {
                commodity_id: "444444",
                purchase_status:{
                    status: 1, 
                    comment: "无库存" 
                },
                purchase_payment_status: 1,                      // 采购支付状态
                purchase_delivery_status: 1,                     // 采购配送状态
                purchase_order_time: 1582703606,                 // 采购生成时间
                purchase_order_sn: "purchase_order_sn",          // 采购订单号
                purchase_waybill_sn: "purchase_waybill_sn",      // 采购运单号
            },
            {
                commodity_id: "555555",
                purchase_status:{
                    status: 1, 
                    comment: "无库存" 
                },
                purchase_payment_status: 1,                      // 采购支付状态
                purchase_delivery_status: 1,                     // 采购配送状态
                purchase_order_time: 1582703606,                 // 采购生成时间
                purchase_order_sn: "purchase_order_sn",          // 采购订单号
                purchase_waybill_sn: "purchase_waybill_sn",      // 采购运单号
            },
        ]
    }
]

const pendingList = [
    {
        order_create_time: 1582703606,
        middleground_order_id: '111111',
        goods_img: '//image-tb.vova.com/image/262_262/crop/89/77/f84c8de4ad38f03a4a6a3079a2e48977.jpg',
        style: {
            color: 'Red',
            size: 'M'
        },
        goods_num: 1,
        price: 10,
        shipping_fee: 100,
        sale_price: 1000,
        sale_order_status: 1,
        purchase_order_status: 1,
        commodity_id: '111111',
        second_catagory: {
            id: '1',
            name: '类目'
        },
        sku_id: '111111',
        comment: 'xxxx'
    },
    {
        order_create_time: 1582703606,
        middleground_order_id: '222222',
        goods_img: '//image-tb.vova.com/image/262_262/crop/89/77/f84c8de4ad38f03a4a6a3079a2e48977.jpg',
        style: {
            color: 'Red',
            size: 'M'
        },
        goods_num: 1,
        price: 10,
        shipping_fee: 100,
        sale_price: 1000,
        sale_order_status: 1,
        purchase_order_status: 1,
        commodity_id: '222222',
        second_catagory: {
            id: '1',
            name: '类目'
        },
        sku_id: '222222',
        comment: '你好，你好。'
    }
]

const payList = [
    {
        purchase_time: 1582703606,
        middleground_order_id: '111',
        pay_url: 'pay_url',
        purchase_p_order_id: 'purchase_p_order_id',
        purchase_order_id: 'purchase_order_id',
        purchase_price: 100,
        sale_order_status: 1,
        purchase_order_status: 1,
        purchase_pay_status: 1,
        order_create_time: 1582703606,
        comment: '待支付'
    },
    {
        purchase_time: 1582703606,
        middleground_order_id: '222',
        pay_url: 'pay_url',
        purchase_p_order_id: 'purchase_p_order_id',
        purchase_order_id: 'purchase_order_id',
        purchase_price: 100,
        sale_order_status: 1,
        purchase_order_status: 1,
        purchase_pay_status: 1,
        order_create_time: 1582703606,
        comment: '待支付222'
    }
]

const waitShipList = [
    {
        purchase_time: 1582703606,
        middleground_order_id: '111',
        purchase_p_order_id: 'purchase_p_order_id',
        purchase_order_id: 'purchase_order_id',
        purchase_price: 100,
        sale_order_status: 1,
        purchase_order_status: 1,
        purchase_pay_status: 1,
        order_create_time: 1582703606,
        comment: '待支付'
    },
    {
        purchase_time: 1582703606,
        middleground_order_id: '222',
        purchase_p_order_id: 'purchase_p_order_id',
        purchase_order_id: 'purchase_order_id',
        purchase_price: 100,
        sale_order_status: 1,
        purchase_order_status: 1,
        purchase_pay_status: 1,
        order_create_time: 1582703606,
        comment: '待支付222'
    }
]

const notStockList = [
    {
        order_create_time: 1582703606,
        middleground_order_id: "111", 
        commodity_id: "111",
        purchase_shipping_no: "111",
        purchase_order_status: 1,
        purchase_shipping_status: 1,
        purchase_pay_time: 1582703606,
        purchase_num: 1
    },
    {
        order_create_time: 1582703606,
        middleground_order_id: "222", 
        commodity_id: "222",
        purchase_shipping_no: "222",
        purchase_order_status: 1,
        purchase_shipping_status: 1,
        purchase_pay_time: 1582703606,
        purchase_num: 2
    }
]

const stockNotShipList = [
    {
        order_create_time: 1582703606,
        middleground_order_id: "111",
        commodity_id: "111",
        purchase_shipping_no: "111",
        purchase_order_status: 1,
        purchase_shipping_status: 1,
        warehousing_time: 1582703606,
        deliver_start_time: 1
    },
    {
        order_create_time: 1582703606,
        middleground_order_id: "222",
        commodity_id: "222",
        purchase_shipping_no: "222",
        purchase_order_status: 1,
        purchase_shipping_status: 1,
        warehousing_time: 1582703606,
        deliver_start_time: 2
    }
]

const errorOrderList = [
    {
        order_create_time: 1582703606,
        order_confirm_time: 1582703606,
        middleground_order_id: '111',
        channel_order_id: '222',
        error_type: 1,
        error_detail: 1,
        first_waybill_no: '333',
        last_waybill_no: '444'
    },
    {
        order_create_time: 1582703606,
        order_confirm_time: 1582703606,
        middleground_order_id: '555',
        channel_order_id: '666',
        error_type: 1,
        error_detail: 1,
        first_waybill_no: '777',
        last_waybill_no: '888'
    }
]

export default {
    'GET /v1/order/list/1': (req: Request, res: Response) => {
        const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list,
                    total: 200
                }
            })
        }, 500);
    },
    'GET /v1/order/list/2': (req: Request, res: Response) => {
        // const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list: pendingList,
                    total: 200
                }
            })
        }, 500);
    },
    'GET /v1/order/list/3': (req: Request, res: Response) => {
        // const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list: payList,
                    total: 200
                }
            })
        }, 500);
    },
    'GET /v1/order/list/4': (req: Request, res: Response) => {
        // const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list: waitShipList,
                    total: 200
                }
            })
        }, 500);
    },
    'GET /v1/order/list/5': (req: Request, res: Response) => {
        // const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list: notStockList,
                    total: 200
                }
            })
        }, 500);
    },
    'GET /v1/order/list/6': (req: Request, res: Response) => {
        // const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list: stockNotShipList,
                    total: 200
                }
            })
        }, 500);
    },
    'GET /v1/order/list/7': (req: Request, res: Response) => {
        // const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list: errorOrderList,
                    total: 200
                }
            })
        }, 500);
    },
    'GET /v1/order/goods_detail': (req: Request, res: Response) => {
        // const { page, page_number } = req.params;
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    channel_goods_id: 'channel_goods_id',
                    psku: 'psku',
                    main_img: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg',
                    sku: 'sku',
                    sku_img: '//image-tb.vova.com/image/500_500/filler/6d/1a/2d391127928221c2a442c8b0e1f26d1a.jpg',
                    goods_name: 'goods_name',
                    specs: {
                        size: 'size',
                        color: 'color'
                    }
                }
            })
        }, 500);
    }
};
