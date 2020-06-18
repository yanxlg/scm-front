import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据

const Mock = require('mockjs');

const list = Mock.mock({
    'data|100-500': [
        {
            confirm_time: '1970-01-01 00:00:01',
            order_goods_sn: '@increment',
            vova_goods_id: '@increment',
            image_url: '@image',
            pdd_sku: 'SKU_ID',
            goods_number: '@increment',
            sales_total_amount: '0.00',
            sales_currency: '0.00',
            purchase_total_amount: '0.00',
            purchase_currency: '0.00',
            sales_order_status: '1',
            sales_pay_status: '0',
            purchase_order_status: '4',
            purchase_pay_status: '0',
            purchase_pay_time: '0000-00-00 00:00:00',
            pdd_order_sn: '采购订单号',
            pdd_order_time: '0000-00-00 00:00:00',
            purchase_tracking_number: 'abcdefg',
            style_values: '@cparagraph',
            purchase_order_desc: '@cparagraph',
            purchase_shipping_status: 1,
        },
    ],
});

export default {
    'POST /order/filter': (req: Request, res: Response) => {
        const { page, size } = req.body;
        res.status(200).send({
            code: 'success',
            data: {
                list: list.data.slice(Number(size) * Number(page - 1), Number(size) * Number(page)),
                total: list.data.length,
                page: 1,
                size: 100,
            },
        });
    },
    'POST /api/v1/orders/list/10': async (req: Request, res: Response) => {
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                all_count: 10,
                list: [
                    {
                        orderGoods: {
                            orderId: '21492926893862969',
                            orderGoodsId: '21492926893862975',
                            channelOrderGoodsSn: '20131028',
                            productPlatform: 'pdd',
                            productShop: 'florynight',
                            productId: '79096134903005184',
                            skuId: 'f7c2f96750cdca1aeedcb316d1968737',
                            goodsAmount: '63.99',
                            goodsNumber: 1,
                            referWaybillNo: '2131231231231',
                            orderGoodsStatus: 1,
                            orderGoodsShippingStatus: 2,
                            createTime: '2020-04-30 06:44:03',
                            lastUpdateTime: '2020-05-11 03:57:24',
                            freight: '0.00',
                            productName: 'name',
                            productImage:
                                'http://d2bq6dn4rcskkx.cloudfront.net/image/150_150/filler/91/68/faea655574125e089fa661aac4ab9168.jpg',
                            productStyle: '{"color":"blue","size":"39"}',
                            orderAddressUpdatedStatus: 1,
                            orderGoodsShippingStatusShow: 2,
                            commodityId: 'e958d4152f1f644ff092df465104b30c',
                            channelMerchantId: '1',
                            orderGoodsPurchasePlan: [
                                {
                                    purchasePlanId: '21492926893863173',
                                    orderGoodsId: '21492926893862975',
                                    purchasePlatform: 'pdd',
                                    purchaseNumber: 1,
                                    purchaseAmount: '0.00',
                                    purchaseOrderStatus: 6,
                                    purchaseOrderPayStatus: 1,
                                    purchaseOrderShippingStatus: 1,
                                    taskId: '50834365140979690',
                                    createTime: '2020-04-30 06:50:14',
                                    lastUpdateTime: '2020-05-11 02:29:26',
                                    reserveStatus: 2,
                                    purchaseFailCode: '410031',
                                    purchaseFailReason: 'sku已售罄',
                                    productPrice: '145.00',
                                    commoditySkuId: 'f7c2f96750cdca1aeedcb316d1968737',
                                },
                                {
                                    purchasePlanId: '21492926894084169',
                                    orderGoodsId: '21492926893862975',
                                    purchasePlatformOrderId: '200511-598051390671135',
                                    purchasePlatformParentOrderId: 'PO-200511-168554661071135',
                                    purchasePlatform: 'pdd',
                                    purchaseNumber: 1,
                                    payUrl:
                                        'https://mapi.alipay.com/gateway.do?service=alipay.wap.create.direct.pay.by.user&partner=2088911201740274&seller_id=pddzhifubao%40yiran.com&payment_type=1&notify_url=http%3A%2F%2Fpayv3.yangkeduo.com%2Fnotify%2F9&out_trade_no=XP0020051110200986313274000374&subject=%E8%AE%A2%E5%8D%95%E7%BC%96%E5%8F%B7PO-200511-168554661071135&total_fee=14.9&return_url=https%3A%2F%2Fmobile.yangkeduo.com%2Ftransac_wappay_callback.html%3Forder_sn%3DPO-200511-168554661071135&sign=FGkgSeFBjRd8tpUpKtys8cuQBFbb5v%2FOd6Zg48QM%2BBCUH3YCTig2pqSd2yZJKUVliuH34DTK3o6POwW6emJUG4V9sEhkqxNsW5h9oy%2BX45%2FjE%2BWCaQv8NREbgnRz44x0fNZuJpHUOYqSvASPqtCKNcnZzwg9jsMaO0AqlTZtumk%3D&sign_type=RSA&goods_type=1&_input_charset=utf-8',
                                    payTime: '2020-05-11 03:21:07',
                                    platformOrderTime: '2020-05-11 03:21:07',
                                    platformShippingTime: '2020-05-11 03:21:07',
                                    purchaseAmount: '14.90',
                                    purchaseOrderStatus: 5,
                                    purchaseOrderPayStatus: 2,
                                    purchaseOrderShippingStatus: 2,
                                    purchaseWaybillNo: 'mock:1589167267719',
                                    taskId: '50853304395922985',
                                    createTime: '2020-05-11 02:29:26',
                                    lastUpdateTime: '2020-06-04 08:22:40',
                                    reserveStatus: 2,
                                    waybillTrail: 'mock data',
                                    inInventoryTime: '2020-05-12 08:30:05',
                                    purchaseFailCode: '0',
                                    purchaseFailReason: '待支付',
                                    productPrice: '15.90',
                                    commoditySkuId: '50cc77a1130978ed6abd10ca234540f911',
                                },
                            ],
                        },
                        orderInfo: {
                            orderId: '21492926893862969',
                            channelOrderSn: '064222040067',
                            orderTime: '2020-04-30 06:44:03',
                            orderAmount: '267.94',
                            currency: 'USD',
                            confirmTime: '2020-04-29 23:43:07',
                            orderStatus: 1,
                            channelSource: 'florynight',
                            createTime: '2020-04-30 06:44:03',
                            lastUpdateTime: '2020-05-15 09:40:23',
                            freight: '62.98',
                            channelMerchantId: '2',
                            channelMerchantName: 'florynight',
                            orderAddress: {
                                orderId: '21492926893862969',
                                consignee: '222lbing li',
                                country: 'FR',
                                city: 'Al Fahiya',
                                address1: ' zxzx sad asd asd ad a',
                                zipCode: '666666',
                                tel: '6666666',
                                createTime: '2020-04-30 06:44:03',
                                lastUpdateTime: '2020-04-30 06:44:03',
                            },
                        },
                        orderGods: { isOfflinePurchase: 0, isReplaceDelivery: 0 },
                    },
                ],
            },
        });
    },
};
