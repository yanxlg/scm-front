import { Request, Response } from 'express';

const list = [{
    "order_goods": [{
        "order_goods_extension": [{
            "metadata_id": "76721584925065218",
            "order_goods_id": "76721584925065217",
            "metadata_name": "",
            "metadata_value": "mock metadata value 1",
            "create_time": "2020-03-02 16:29:58",
            "last_update_time": "2020-03-02 16:29:58"
        }, {
            "metadata_id": "76721584925065219",
            "order_goods_id": "76721584925065217",
            "metadata_name": "",
            "metadata_value": "mock metadata value 1",
            "create_time": "2020-03-02 16:29:58",
            "last_update_time": "2020-03-02 16:29:58"
        }],
        "order_goods_purchase_plan": [{
            "purchase_plan_id": "76721584925065220",
            "order_goods_id": "76721584925065217",
            "purchase_platform_order_id": "",
            "purchase_platform_parent_order_id": "",
            "purchase_platform": "mock1 platform",
            "purchase_number": 2,
            "pay_url": "",
            "pay_time": "",
            "platform_order_time": "",
            "platform_shipping_time": "",
            "purchase_amount": "0.00",
            "purchase_order_status": 1,
            "purchase_cancel_reason": "",
            "purchase_order_pay_status": 1,
            "purchase_order_shipping_status": 1,
            "purchase_waybill_no": "",
            "last_waybill_no": "",
            "task_id": "0",
            "storage_time": "",
            "create_time": "2020-03-02 16:29:58",
            "last_update_time": "2020-03-02 16:29:58"
        }],
        "order_id": "76721584925065216",
        "order_goods_id": "76721584925065217",
        "channel_order_goods_sn": "52cb878c-4c88-4cb6-b346-a055fce90ffb",
        "product_platform": "mock1 platform",
        "product_shop": "mock1 shop",
        "product_id": "1583166596356", 
        "sku_id": "1583166596356",
        "goods_amount": "11.10",
        "goods_number": 2,
        "purchase_comment": "",
        "purchase_time": "",
        "send_delivery_time": "",
        "delivery_time": "",
        "collect_time": "",
        "receive_time": "",
        "order_goods_status": 1,
        "order_goods_shipping_status": 1,
        "create_time": "2020-03-02 16:29:58",
        "last_update_time": "2020-03-02 16:29:58"
    }, {
        "order_goods_extension": [{
            "metadata_id": "76721584925065222",
            "order_goods_id": "76721584925065221",
            "metadata_name": "",
            "metadata_value": "mock metadata value 1",
            "create_time": "2020-03-02 16:29:58",
            "last_update_time": "2020-03-02 16:29:58"
        }, {
            "metadata_id": "76721584925065223",
            "order_goods_id": "76721584925065221",
            "metadata_name": "",
            "metadata_value": "mock metadata value 1",
            "create_time": "2020-03-02 16:29:58",
            "last_update_time": "2020-03-02 16:29:58"
        }],
        "order_goods_purchase_plan": [{
            "purchase_plan_id": "76721584925065224",
            "order_goods_id": "76721584925065221",
            "purchase_platform_order_id": "",
            "purchase_platform_parent_order_id": "",
            "purchase_platform": "mock2 platform",
            "purchase_number": 3,
            "pay_url": "",
            "pay_time": "",
            "platform_order_time": "",
            "platform_shipping_time": "",
            "purchase_amount": "0.00",
            "purchase_order_status": 1,
            "purchase_cancel_reason": "",
            "purchase_order_pay_status": 1,
            "purchase_order_shipping_status": 1,
            "purchase_waybill_no": "",
            "last_waybill_no": "",
            "task_id": "0",
            "storage_time": "",
            "create_time": "2020-03-02 16:29:58",
            "last_update_time": "2020-03-02 16:29:58"
        }],
        "order_id": "76721584925065216",
        "order_goods_id": "76721584925065221",
        "channel_order_goods_sn": "5bb0abd1-020a-4042-bf8e-13a60542ca0c",
        "product_platform": "mock2 platform",
        "product_shop": "mock2 shop",
        "product_id": "1583166596357",
        "sku_id": "1583166596357",
        "goods_amount": "22.20",
        "goods_number": 3,
        "purchase_comment": "",
        "purchase_time": "",
        "send_delivery_time": "",
        "delivery_time": "",
        "collect_time": "",
        "receive_time": "",
        "order_goods_status": 1,
        "order_goods_shipping_status": 1,
        "create_time": "2020-03-02 16:29:58",
        "last_update_time": "2020-03-02 16:29:58"
    }],
    "order_id": "76721584925065216",
    "channel_order_sn": "e0479c2f-7e7b-4445-be5b-152b8cf719f5",
    "order_time": "2020-03-02 16:29:58",
    "order_amount": "56.20",
    "currency": "RMB",
    "confirm_time": "2020-03-02 16:29:56",
    "order_status": 1,
    "address": "mock address",
    "channel_source": "mock source",
    "create_time": "2020-03-02 16:29:58",
    "last_update_time": "2020-03-02 16:29:58"
}]

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
        // const { page } = req.params;
        // console.log('params', req.params);
        setTimeout(() => {
            res.status(200).send({
                code: 200,
                data: {
                    list,
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
