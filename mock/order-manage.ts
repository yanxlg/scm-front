import { Request, Response } from 'express';

const list = [
    {
        orderGoods: {
            orderId: 111111,
            orderGoodsId: 222222,
            channelOrderGoodsSn: 'channel_order_goods_sn',
            productPlatform: 'product_platform',
            productShop: 'product_shop',
            productId: 1,
            skuId: 1,
            goodsAmount: 'goods_amount',
            goodsNumber: 1,
            referWaybillNo: 'refer_waybill_no',
            purchaseTime: '11',
            deliveryTime: '13', //出库时间
            collectTime: '14',  //揽收时间
            receiveTime: '15',  //收货时间
            orderGoodsStatus: 1, //订单状态 1：已确认 2：已取消
            orderGoodsShippingStatus: 1, //订单配送状态 1：未配送 2：头程已配送 3：已妥投未入库 4： 已入库 5：出库中 6：出库失败  7：取消出库 8：已出库 9：尾程已揽收 10：已妥投
            lastWaybillNo: '18', //尾程订单号
            storageTime: '19',
            createTime: '20',
            lastUpdateTime: '21',
            orderGoodsExtension: {},
            orderGoodsPurchasePlan: [
                {
                    purchasePlanId: 1,
                    orderGoodsId: 2,
                    purchasePlatformOrderId: '3',
                    purchasePlatformParentOrderId: '4',
                    purchasePlatform: '5',
                    purchaseNumber: 6,
                    payUrl: 'pay_url',
                    payTime: '8',
                    platformOrderTime: '9',
                    platformShippingTime: '10',
                    purchaseAmount: '11',
                    purchaseOrderStatus: 1,
                    purchaseCancelReason: '13',
                    purchaseOrderPayStatus: 1,
                    purchaseOrderShippingStatus: 1,
                    purchaseWaybillNo: '16',
                    taskId: 1,
                    createTime: '18',
                    lastUpdateTime: '19'
                },
                {
                    purchasePlanId: 1,
                    orderGoodsId: 2,
                    purchasePlatformOrderId: '3',
                    purchasePlatformParentOrderId: '4',
                    purchasePlatform: '5',
                    purchaseNumber: 6,
                    payUrl: 'pay_url',
                    payTime: '8',
                    platformOrderTime: '9',
                    platformShippingTime: '10',
                    purchaseAmount: '11',
                    purchaseOrderStatus: 12,
                    purchaseCancelReason: '13',
                    purchaseOrderPayStatus: 1,
                    purchaseOrderShippingStatus: 1,
                    purchaseWaybillNo: '16',
                    taskId: 1,
                    createTime: '18',
                    lastUpdateTime: '19'
                }
            ]
            
        },
        orderInfo: {
            orderId: 1,
            channelOrderSn: '1',
            orderTime: '1',
            orderAmount: '1',
            currency: '1',
            confirmTime: '1',
            orderStatus: 1,
            channelSource: '1',
            createTime: '1',
            lastUpdateTime: '1'
        }
    }
]

const _list = [
    {
        orderId: 1,
        channelOrderSn: 'channel_order_sn',
        orderTime: '3',
        orderAmount: '4',
        currency: '5',
        confirmTime: '6',
        orderStatus: 1,//订单状态 1：已确认 2：采购成功、3：采购失败
        channelSource: '8',
        createTime: '9',
        lastUpdateTime: '10',
        orderGoods: [
            {
                orderId: 1,
                orderGoodsId: 1,
                channelOrderGoodsSn: '3',
                productPlatform: '4',
                productShop: '5',
                productId: 6,
                skuId: 7,
                goodsAmount: '8',
                goodsNumber: 9,
                referWaybillNo: '10', //参考运单号
                purchaseTime: '11', //采购完成时间
                deliveryTime: '13', //出库时间
                collectTime: '14', //揽收时间
                receiveTime: '15', //收货时间
                orderGoodsStatus: 1, //订单状态 1：已确认 2：已取消
                orderGoodsShippingStatus: 1, //订单配送状态 1：未配送 2：头程已配送 3：已妥投未入库 4： 已入库 5：出库中 6：出库失败  7：取消出库 8：已出库 9：尾程已揽收 10：已妥投
                lastWaybillNo: '18', //尾程订单号
                storageTime: '19',
                createTime: '20',
                lastUpdateTime: '21',
            },
            {
                orderId: 1,
                orderGoodsId: 2,
                channelOrderGoodsSn: '3',
                productPlatform: '4',
                productShop: '5',
                productId: 6,
                skuId: 7,
                goodsAmount: '8',
                goodsNumber: 9,
                referWaybillNo: '10', //参考运单号
                purchaseTime: '11', //采购完成时间
                deliveryTime: '13', //出库时间
                collectTime: '14', //揽收时间
                receiveTime: '15', //收货时间
                orderGoodsStatus: 1, //订单状态 1：已确认 2：已取消
                orderGoodsShippingStatus: 1, //订单配送状态 1：未配送 2：头程已配送 3：已妥投未入库 4： 已入库 5：出库中 6：出库失败  7：取消出库 8：已出库 9：尾程已揽收 10：已妥投
                lastWaybillNo: '18', //尾程订单号
                storageTime: '19',
                createTime: '20',
                lastUpdateTime: '21',
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
        pay_url: '//image-tb.vova.com/image/262_262/crop/89/77/f84c8de4ad38f03a4a6a3079a2e48977.jpg',
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
        pay_url: '//image-tb.vova.com/image/262_262/crop/89/77/f84c8de4ad38f03a4a6a3079a2e48977.jpg',
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
    'POST /v1/orders/list/1': (req: Request, res: Response) => {
        const { only_p_order } = req.query;
        // console.log('params', req);
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list: only_p_order ? _list : list,
                    all_count: 200
                }
            })
        }, 500);
    },
    'GET /v1/orders/list/2': (req: Request, res: Response) => {
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
    'GET /v1/orders/list/3': (req: Request, res: Response) => {
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
    'GET /v1/orders/list/4': (req: Request, res: Response) => {
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
    'GET /v1/orders/list/5': (req: Request, res: Response) => {
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
    'GET /v1/orders/list/6': (req: Request, res: Response) => {
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
    'GET /v1/orders/list/7': (req: Request, res: Response) => {
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
