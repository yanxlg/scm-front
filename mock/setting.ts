import { Request, Response } from 'express';

import Mock, { Random } from 'mockjs';

const sleep = async (second: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, second * 1000);
    });
};

const list = Mock.mock({
    'data|100-500': [
        {
            merchant_id: '@string',
            purchase_channel: '@string',
            operator: '@string',
            created_time: '2020-06-10 17:06:00',
            black_store_reason: '@string',
        },
    ],
});

export default {
    'GET /v1/spider/account/list': async (req: Request, res: Response) => {
        await sleep(3);
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                ...Mock.mock({
                    'list|100-500': [
                        {
                            account_id: '@increment',
                            phone: '@phone',
                            cookie: '@string',
                            'status|1': [1, 2],
                        },
                    ],
                }),
            },
        });
    },
    'POST /v1/orders/setting/purchase/offline/list': async (req: Request, res: Response) => {
        await sleep(3);
        res.status(200).send({
            code: 'success',
            message: 'By mock.js',
            data: {
                ...Mock.mock({
                    'list|0-10': [
                        {
                            id: '@increment',
                            commodity_id: '@string',
                            commodity_sku_id: '@string',
                        },
                    ],
                }),
            },
            total: 500,
        });
    },
    'GET /v1/orders/setting/purchase/offline/111': async (req: Request, res: Response) => {
        await sleep(3);
        res.status(200).send({
            code: 'success',
            message: 'By mock.js',
            data: {
                // ...Mock.mock({
                //     'list|0-10': [
                //         {
                //             id: '@increment',
                //             commodity_id: '@string',
                //             commodity_sku_id: '@string',
                //         },
                //     ],
                // }),
                commodity_id: '@string',
                commodity_sku_id: '@string',
                variant_image:
                    'https://supply-img.vova.com.hk/spider/images/item/5c/95/53b68d2c21283a7e1760c12e8de45c95.jpg',
                goods_name: '@string',
                sku_style: '@string',
                sku_inventory: '@string',
            },
            total: 500,
        });
    },
    'GET /v1/strategy/black_store_list': async (req: Request, res: Response) => {
        await sleep(3);
        const { page, page_count } = req.query;
        // console.log(page, page_count);
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                list: list.data.slice(
                    Number(page_count) * (Number(page) - 1),
                    Number(page_count) * Number(page),
                ),
                total: list.data.length,
            },
        });
    },
};
