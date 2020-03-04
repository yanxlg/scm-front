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

const list1 = Mock.mock({
    'data|100-500': [
        {
            product_id: '@increment',
            sku_info: '@text',
            sku_id: '@increment',
            sku_img: '@image',
            goods_img: '@image',
            size: '@title',
            color: '@title',
            shipping_inventory_qy: '@increment',
            lock_inventory_qy: '@increment',
            sales_inventory_qy: '@increment',
            inventory_qy: '@increment',
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
                all_count: list.data.length,
                page: 1,
                size: 100,
            },
        });
    },
    'POST /v1/inventory/list': (req: Request, res: Response) => {
        const { page, page_count } = req.body;
        res.status(200).send({
            code: 200,
            message: 'By mock.js',
            data: {
                list: list1.data.slice(
                    Number(page_count) * Number(page - 1),
                    Number(page_count) * Number(page),
                ),
                all_count: list1.data.length,
                page: 1,
                size: 100,
            },
        });
    },
};
