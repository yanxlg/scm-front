import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据

const Mock = require('mockjs');

const list = Mock.mock({
    'data|100-500': [
        {
            'id': '888888',
            'a1': '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg',
            'a2': '商品标题',
            'a3': '商品描述',
            'a4': '中台 sku id',
            'a5': '源sku id',
            'a6': '规格',
            'a7': '价格',
            'a8': '价格变化',
            'a9': '重量',
            'a10': '库存',
            'a11': '发货时间',
            'a12': '运费',
            'a13': '销量',
            'a14': '评价数量',
            'a15': '一级类目',
            'a16': '二级类目',
            'a17': '变更时间',
            'a18': '变更人',
            'a19': '商品版本号'
        },
    ],
});


export default {
    'GET /goodsVersion/list': (req: Request, res: Response) => {
        // console.log(req)
        const { page, size } = req.query;
        res.status(200).send({
                'code': 'success',
                'data': {
                    // list.data
                    'list': list.data.slice(
                        Number(size) * Number(page-1),
                        Number(size) * (Number(page)),
                    ),
                    // list.data
                    'total': list.data.length,
                    'page': 1,
                    'size': size,
                },
            },
        );
    },
};
