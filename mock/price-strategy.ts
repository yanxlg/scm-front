import { Request, Response } from 'express';

import Mock, { Random } from 'mockjs';

const sleep = async (second: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, second * 500);
    });
};

const list = Mock.mock({
    'data|100-500': [
        {
            card_name: '@string',
            country_code: '@string',
            weight_config: [
                {
                    min_weight: '@float(0, 100)',
                    max_weight: '@float(0, 100)',
                    param_add: '@float(0, 100)',
                    param_devide: '@float(0, 100)',
                    param_multiply: '@float(0, 100)',
                },
                {
                    min_weight: '@float(0, 100)',
                    max_weight: '@float(0, 100)',
                    param_add: '@float(0, 100)',
                    param_devide: '@float(0, 100)',
                    param_multiply: '@float(0, 100)',
                },
            ],
        },
    ],
});

const list1 = Mock.mock({
    'data|100-500': [
        {
            id: '@increment',
            product_tags: 'test,玻璃',
            min_weight: '@float(0, 100)',
            max_weight: '@float(0, 100)',
            lower_shipping_card: '@string',
            upper_shipping_card: '@string',
            support_country_count: 123,
            order: 100,
            product_count: 888,
            is_enable: 1,
        },
    ],
});

export default {
    'GET /v1/price_strategy/list_shipping_fee_rule': async (req: Request, res: Response) => {
        await sleep(3);
        const { page, page_count } = req.query;
        // console.log(page, page_count);
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                list: list1.data.slice(
                    Number(page_count) * (Number(page) - 1),
                    Number(page_count) * Number(page),
                ),
                total: list1.data.length,
            },
        });
    },

    'GET /v1/price_strategy/list_shipping_card': async (req: Request, res: Response) => {
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

    'GET /v1/price_strategy/shipping_card_name_list': async (req: Request, res: Response) => {
        await sleep(3);
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                shipping_card_name_list: ['name1', 'name2', 'name3'],
            },
        });
    },

    'GET /v1/price_strategy/shipping_card_country': async (req: Request, res: Response) => {
        await sleep(3);
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                country_code: ['US', 'FR', 'EN'],
            },
        });
    },
};
