import { Request, Response } from 'express';
import Mock, { Random } from 'mockjs';

const sleep = async (second: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, second * 1000);
    });
};

export default {
    'get /api/v1/vova_goods/version_list': (req: Request, res: Response) => {
        res.status(200).send({
            message: '',
            code: 200,
            data: {
                attribute_update: {
                    price: 10,
                    shipping_fee: 20,
                    sku_volume: 10,
                    goods_title: 10,
                    product_description: 1,
                    category: 10,
                    specs: 30,
                    lower_shelf: 10,
                    upper_shelf: 30,
                    sku_pics: 10,
                },
                goods_list: [
                    {
                        vova_virtual_id: 1,
                        product_id: 2,
                        commodity_id: 2,
                        price: 3,
                        shipping_fee: 4,
                        specs: {},
                        product_main_pic: '',
                        lower_shelf: 0,
                        upper_shelf: 0,
                        goods_title: 'dasdsa',
                        product_description: 'dsads',
                        sku_pics_volume: 4,
                        operationer: '111',
                        operation_time: 3,
                        is_version_applied: 1,
                    },
                    {
                        vova_virtual_id: 1,
                        product_id: 2,
                        commodity_id: 2,
                        price: 4,
                        shipping_fee: 4,
                        specs: {},
                        product_main_pic: '',
                        lower_shelf: 0,
                        upper_shelf: 0,
                        goods_title: 'dasdsa',
                        product_description: 'dsads',
                        sku_pics_volume: 4,
                        operationer: '111',
                        operation_time: 3,
                        is_version_applied: 1,
                    },
                    {
                        vova_virtual_id: 1,
                        product_id: 2,
                        commodity_id: 2,
                        price: 5,
                        shipping_fee: 4,
                        specs: {},
                        product_main_pic: '',
                        lower_shelf: 0,
                        upper_shelf: 0,
                        goods_title: 'dasdsa',
                        product_description: 'dsads',
                        sku_pics_volume: 4,
                        operationer: '111',
                        operation_time: 3,
                        is_version_applied: 1,
                    },
                    {
                        vova_virtual_id: 5,
                        product_id: 6,
                        commodity_id: 7,
                        price: 3,
                        shipping_fee: 4,
                        specs: {},
                        product_main_pic: '',
                        lower_shelf: 0,
                        upper_shelf: 0,
                        goods_title: 'dasdsa',
                        product_description: 'dsads',
                        sku_pics_volume: 4,
                        operationer: '111',
                        operation_time: 3,
                        is_version_applied: 1,
                    },
                    {
                        vova_virtual_id: 10,
                        product_id: 23,
                        commodity_id: 34,
                        price: 3,
                        shipping_fee: 4,
                        specs: {},
                        product_main_pic: '',
                        lower_shelf: 0,
                        upper_shelf: 0,
                        goods_title: 'dasdsa',
                        product_description: 'dsads',
                        sku_pics_volume: 4,
                        operationer: '111',
                        operation_time: 3,
                        is_version_applied: 1,
                    },
                ],
            },
        });
    },
    'get /v1/vova_goods/sales_log': async (req: Request, res: Response) => {
        await sleep(3);
        res.status(200).send({
            message: '',
            code: 200,
            ...Mock.mock({
                'data|5-10': [
                    {
                        reason: '@string',
                        finish_time: '@date',
                        status_label: '@increment',
                        commodity_id: '@increment',
                        product_id: '@increment',
                        sale_domain: '@string',
                        id: '@increment',
                    },
                ],
            }),
        });
    },
};
