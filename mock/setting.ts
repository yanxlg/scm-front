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
};
