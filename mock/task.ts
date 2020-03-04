import { Request, Response } from 'express';

import Mock, { Random } from 'mockjs';

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
    'GET /api/v1/task/exec_log': (req: Request, res: Response) => {
        const { page, page_number } = req.query;
        res.status(200).send({
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
};
