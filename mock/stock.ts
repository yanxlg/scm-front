import { Request, Response } from 'express';

import Mock, { Random } from 'mockjs';

const list = Mock.mock({
    'data|100-500': [
        {
            warehousing_time: function() {
                const time = Random.datetime('T');
                return Math.ceil(parseInt(time) / 1000);
            },
            warehousing_order_sn: '@increment',
            purchase_order_sn: '@increment',
            first_waybill_no: '@increment',
            plan_warehousing_qy: '@increment',
            actual_warehousing_qy: '@increment',
            product_id: '@increment',
            outgoing_time: function() {
                const time = Random.datetime('T');
                return Math.ceil(parseInt(time) / 1000);
            },
            outgoing_no: '@increment',
            plan_outgoing_qy: '@increment',
            actual_outgoing_qy: '@increment',
            last_waybill_no: '@increment',
        },
    ],
});

export default {
    'POST /v1/inventory/io/list': (req: Request, res: Response) => {
        const { page, page_count } = req.body;
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                list: list.data.slice(
                    Number(page_count) * Number(page - 1),
                    Number(page_count) * Number(page),
                ),
                total: list.data.length,
                page: 1,
                size: 100,
            },
        });
    },
};
