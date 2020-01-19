import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据

const Mock = require('mockjs');

const list = Mock.mock({
    'data|100-500': [
        {
            'a1': 'ID',
            'a2': '商品图片',
            'a3': '12345678',
            'a4': '任务 id',
            'a5': '标题',
            'a6': '描述',
            'a7': 'sku数量',
            'a8': '子sku id',
            'a9': '规格',
            'a10': '价格',
            'a11': '重量',
            'a12': '库存',
            'a13': '销量',
            'a14': '评价数量',
            'a15': '一级类目',
            'a16': '二级类目',
            'a17': '店铺 id',
            'a18': '店铺名称',
            'a19': '采集时间',
            'a20': '上架状态',
            'a21': '链接'
        },
    ],
});


export default {
    'GET /goods/list': (req: Request, res: Response) => {
        // console.log(req)
        const { page, size } = req.query;
        res.status(200).send({
                'code': 'success',
                'data': {
                    'list': list.data.slice(
                        Number(size) * Number(page-1),
                        Number(size) * (Number(page)),
                    ),
                    'total': list.data.length,
                    'page': 1,
                    'size': size,
                },
            },
        );
    },
};
