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
    'GET /v1/strategy/waybill_exception': async (req: Request, res: Response) => {
        await sleep(1);
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                exception_strategy: [
                    {
                        exception_operation_id: 1,
                        exception_operation_name: '废弃',
                        show_exception_type: ['101', '102', '103', '104', '105'],
                    },
                    {
                        exception_operation_id: 2,
                        exception_operation_name: '关联采购单',
                        show_exception_type: ['101', '103'],
                    },
                    {
                        exception_operation_id: 3,
                        exception_operation_name: '异常处理',
                        show_exception_type: ['102', '104', '105'],
                        exception_operation_detail: [
                            {
                                second_exception_operation_id: 1,
                                second_exception_operation_name: '退款',
                                second_show_exception_type: ['102', '104', '105'],
                            },
                            {
                                second_exception_operation_id: 2,
                                second_exception_operation_name: '补发货',
                                second_show_exception_type: ['104', '105'],
                            },
                            {
                                second_exception_operation_id: 3,
                                second_exception_operation_name: '退货',
                                second_show_exception_type: ['104', '105'],
                            },
                        ],
                    },
                ],
                exception_code: [
                    { code: '101', name: '扫码失败' },
                    { code: '102', name: '拒收' },
                    { code: '103', name: '多发货' },
                    { code: '104', name: '货不对版' },
                    { code: '105', name: '货品不合规' },
                ],
            },
        });
    },
};
