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
};
