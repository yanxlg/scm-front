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
    'GET /api/v1/account/cookie': async (req: Request, res: Response) => {
        await sleep(3);
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            ...Mock.mock({
                'data|100-500': [
                    {
                        account_id: '@increment',
                        phone: '@phone',
                        cookie: '@string',
                        'status|1': [1, 2],
                    },
                ],
            }),
        });
    },
};
