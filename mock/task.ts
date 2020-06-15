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
            task_send_time: function() {
                const time = Random.datetime('T');
                return Math.ceil(parseInt(time) / 1000);
            },
            sub_task_id: '@increment',
            status: '@increment',
            node: '@increment',
            action: '@increment',
            content: '@increment',
        },
    ],
});
export default {
    'GET /v1/task/exec_log': async (req: Request, res: Response) => {
        await sleep(10);
        const { page, page_number } = req.query;
        res.status(401).send({
            code: 200,
            message: 'By mock.js',
            data: {
                list: list.data.slice(
                    Number(page_number) * (Number(page) - 1),
                    Number(page_number) * Number(page),
                ),
                total: list.data.length,
            },
        });
    },
    /*    'GET /api/v1/vova_goods/store_list': async (req: Request, res: Response) => {
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: [
                { merchant_id: '1', merchant_name: 'SuperAC', merchant_platform: 'vova' },
                { merchant_id: '2', merchant_name: 'florynight', merchant_platform: 'florynight' },
                { merchant_id: '3', merchant_name: 'Airyclub', merchant_platform: 'vova_old' },
                { merchant_id: '5', merchant_name: 'VogueFD', merchant_platform: 'vova' },
            ],
        });
    },*/
};
