import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据

const Mock = require('mockjs');

const data = Mock.mock({
    'list|100-500': [
        {
            commodity_id: '@increment',
            vova_virtual_id: '@increment',
            product_id: '@increment',
            shop_name: '@title',
            evaluate_volume: 20,
            average_score: 4.5,
            sales_volume: 3000,
            product_detail: '',
            'product_status|1': `['已上架','待架','已下架']`,
            shipping_refund_rate: '@float(0, 100)%',
            non_shipping_refund_rate: '@float(0, 100)%',
            vova_product_link: '',
            level_two_category: '@string(7, 20)',
            level_one_category: '@string(7, 20)',
            sku_pics: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg'
        }
    ],
    'changed_property_list|1': [
        {
            'property|+1': ['上架', '下架', '价格'],
            'count|1-1000': 1,
        }
    ]
})

export default {
    'GET /v1/vova_goods/list': (req: Request, res: Response) => {
        res.status(200).send({
                code: 0,
                msg: '',
                data: {
                    allCount: 10,
                    list: data.list
                },
            },
        );
    },
    'GET /v1/vova_goods/changed_property': (req: Request, res: Response) => {
        res.status(200).send({
                code: 0,
                msg: '',
                data: {
                    changed_property_list: data.changed_property_list
                },
            },
        );
    },
};
