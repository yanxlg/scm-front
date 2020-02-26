import { Request, Response } from 'express';

const list = [
    {
        order_confirm_time: 'order_confirm_time',
        middleground_order_id: '111',
        channel_order_id: 'channel_order_id',
        commodity_id: 'commodity_id',
        goods_detatil: 'goods_detatil',
        channel_goods_price: 'channel_goods_price',
        channel_shipping_fee: 'channel_shipping_fee',
        goods_number: 'goods_number',
        order_price: 'order_price',
        currency_type: 'currency_type',
        address: 'address',
        remain_delivery_time: 'remain_delivery_time',
        cancel_order_time: 'cancel_order_time',
        channel_store_name: 'channel_store_name',
        channel_order_status: 'channel_order_status',
        channel_shipments_status: 'channel_shipments_status',
        middleground_order_status: 'middleground_order_status',
        purchase_order_status: 'purchase_order_status',
        purchase_payment_status: 'purchase_payment_status',
        purchase_delivery_status: 'purchase_delivery_status',
        cancel_order: 'cancel_order',
        purchase_place_order_time: 'purchase_place_order_time',
        purchase_order_number: 'purchase_order_number',
        purchase_porder_number: 'purchase_porder_number',
        purchase_waybill_number: 'purchase_waybill_number'
    },
    {
        order_confirm_time: 'order_confirm_time',
        middleground_order_id: '222',
        channel_order_id: 'channel_order_id',
        commodity_id: 'commodity_id',
        goods_detatil: 'goods_detatil',
        channel_goods_price: 'channel_goods_price',
        channel_shipping_fee: 'channel_shipping_fee',
        goods_number: 'goods_number',
        order_price: 'order_price',
        currency_type: 'currency_type',
        address: 'address',
        remain_delivery_time: 'remain_delivery_time',
        cancel_order_time: 'cancel_order_time',
        channel_store_name: 'channel_store_name',
        channel_order_status: 'channel_order_status',
        channel_shipments_status: 'channel_shipments_status',
        middleground_order_status: 'middleground_order_status',
        purchase_order_status: 'purchase_order_status',
        purchase_payment_status: 'purchase_payment_status',
        purchase_delivery_status: 'purchase_delivery_status',
        cancel_order: 'cancel_order',
        purchase_place_order_time: 'purchase_place_order_time',
        purchase_order_number: 'purchase_order_number',
        purchase_porder_number: 'purchase_porder_number',
        purchase_waybill_number: 'purchase_waybill_number'
    },
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

const waitShip = [
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

export default {
    'GET /v1/order/list': (req: Request, res: Response) => {
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
                    list: waitShip,
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
