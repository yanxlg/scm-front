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
            a1: '@increment',
            a2: '@increment',
            a3: '@increment',
            a4: '@increment',
            a5: '@increment',
            a6: '@increment',
            a7: '@increment',
            image:
                'https://supply-img-t.vova.com.hk/spider/images/item/ac/76/b315213fd41ff2d8f659d93796e9ac76.jpg',
            time: function() {
                const time = Random.datetime('T');
                return Math.ceil(parseInt(time) / 1000);
            },
        },
    ],
});

export default {
    'POST /v1/pruchase/abnormal/all': async (req: Request, res: Response) => {
        await sleep(1);
        const { page, page_count } = req.body;
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
