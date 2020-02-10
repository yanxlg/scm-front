import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据

const Mock = require('mockjs');

// const list = Mock.mock({
//     'data|100-500': [
//         {
//             'a1': '中台商品ID',
//             'a2': '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg',
//             'a3': '任务 id',
//             'a4': '爬虫商品ID',
//             'a5': '采集平台',
//             'a6': '标题',
//             'a7': '描述',
//             'a8': 'sku数量',
//             'a9': '中台sku id',
//             'a10': '规格',
//             'a11': '价格',
//             'a12': '重量',
//             'a13': '库存',
//             'a14': '发货时间',
//             'a15': '运费',
//             'a16': '销量',
//             'a17': '评价数量',
//             'a18': '一级类目',
//             'a19': '二级类目',
//             'a20': '品牌',
//             'a21': '店铺 id',
//             'a22': '店铺名称',
//             'a23': '采集时间',
//             'a24': '上架状态',
//             'a25': '链接'
//         },
//     ],
// });

const list = [
    {
        // scmGoodsSn: 'scmGoodsSn',
        // scmGoodsId: 111,
        commodityId: '111',
        productId: 111111,
        goodsImg: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg',
        wormTaskId: 111,
        wormGoodsId: 111,
        isOnSale: 0,
        translateInfo: [
            {
                language: 'language',
                updateTime: 111
            }
        ],
        onSaleInfo: [
            {
                onSaleChannel: 'onSaleChannel',
                onSaleTime: 111
            }
        ],
        title: 'title',
        description: 'description',
        skuNumber: 111,
        scmSkuInfo: [
            {
                scmSkuSn: '111',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            },
            {
                scmSkuSn: '222',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            },
            {
                scmSkuSn: '333',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            }
        ],
        salesVolume: 111,
        comments: 111,
        firstCatagory: 'firstCatagory',
        secondCatagory: 'secondCatagory',
        thirdCatagory: 'thirdCatagory',
        brand: 'brand',
        storeId: 'storeId',
        storeName: 'storeName',
        wormTime: 111,
        wormGoodsInfoLink: 'wormGoodsInfoLink',
        skuImage: [
            {
                imgId: '1',
                imgUrl: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg'
            },
            {
                imgId: '2',
                imgUrl: '//image-tb.vova.com/image/500_500/filler/6d/1a/2d391127928221c2a442c8b0e1f26d1a.jpg'
            },
            {
                imgId: '3',
                imgUrl: '//image-tb.vova.com/image/500_500/filler/97/b8/d41a4dab05900caf879244f041cc97b8.jpg'
            }
        ]
    },
    {
        // scmGoodsSn: 'scmGoodsSn',
        // scmGoodsId: 111,
        commodityId: '111',
        productId: 222222,
        goodsImg: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg',
        wormTaskId: 111,
        wormGoodsId: 111,
        isOnSale: 0,
        translateInfo: [
            {
                language: 'language',
                updateTime: 111
            }
        ],
        onSaleInfo: [
            {
                onSaleChannel: 'onSaleChannel',
                onSaleTime: 111
            }
        ],
        title: 'title',
        description: 'description',
        skuNumber: 111,
        scmSkuInfo: [
            {
                scmSkuSn: '444',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            },
            {
                scmSkuSn: '555',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            },
            {
                scmSkuSn: '666',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            }
        ],
        salesVolume: 111,
        comments: 111,
        firstCatagory: 'firstCatagory',
        secondCatagory: 'secondCatagory',
        thirdCatagory: 'thirdCatagory',
        brand: 'brand',
        storeId: 'storeId',
        storeName: 'storeName',
        wormTime: 111,
        wormGoodsInfoLink: 'wormGoodsInfoLink',
        skuImage: [
            {
                imgId: '1',
                imgUrl: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg'
            },
            {
                imgId: '2',
                imgUrl: '//image-tb.vova.com/image/500_500/filler/6d/1a/2d391127928221c2a442c8b0e1f26d1a.jpg'
            },
            {
                imgId: '3',
                imgUrl: '//image-tb.vova.com/image/500_500/filler/97/b8/d41a4dab05900caf879244f041cc97b8.jpg'
            }
        ]
    },
    {
        // scmGoodsSn: 'scmGoodsSn',
        // scmGoodsId: 111,
        commodityId: '111',
        productId: 333333,
        goodsImg: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg',
        wormTaskId: 111,
        wormGoodsId: 111,
        isOnSale: 0,
        translateInfo: [
            {
                language: 'language',
                updateTime: 111
            }
        ],
        onSaleInfo: [
            {
                onSaleChannel: 'onSaleChannel',
                onSaleTime: 111
            }
        ],
        title: 'title',
        description: 'description',
        skuNumber: 111,
        scmSkuInfo: [
            {
                scmSkuSn: '777',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            },
            {
                scmSkuSn: '888',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            },
            {
                scmSkuSn: '999',
                scmSkuStyle: {
                    size: 'size',
                    color: 'color'
                },
                scmSkuPrice: 111,
                scmSkuWeight: 111,
                scmSkuInventory: 111,
                scmSkuShoppingTime: 111,
                scmSkuShoppingFee: 111
            }
        ],
        salesVolume: 111,
        comments: 111,
        firstCatagory: 'firstCatagory',
        secondCatagory: 'secondCatagory',
        thirdCatagory: 'thirdCatagory',
        brand: 'brand',
        storeId: 'storeId',
        storeName: 'storeName',
        wormTime: 111,
        wormGoodsInfoLink: 'wormGoodsInfoLink',
        skuImage: [
            {
                imgId: '1',
                imgUrl: '//image-tb.airyclub.com/image/500_500/filler/29/6f/6a69f58c96aa7b793b62c6c5af8f296f.jpg'
            },
            {
                imgId: '2',
                imgUrl: '//image-tb.vova.com/image/500_500/filler/6d/1a/2d391127928221c2a442c8b0e1f26d1a.jpg'
            },
            {
                imgId: '3',
                imgUrl: '//image-tb.vova.com/image/500_500/filler/97/b8/d41a4dab05900caf879244f041cc97b8.jpg'
            }
        ]
    },
]


export default {
    'GET /v1/goods/list': (req: Request, res: Response) => {
        // console.log(req)
        const { page, page_count } = req.query;
        // console.log('1111', page, page_count)
        res.status(200).send({
                code: 'success',
                msg: '',
                data: {
                    allCount: 10,
                    // list.data
                    'list': list
                    // .slice(
                    //     Number(page_count) * Number(page-1),
                    //     Number(page_count) * (Number(page)),
                    // )
                },
            },
        );
    },
    'PUT /v1/goods/pic/edit': (req: Request, res: Response) => {
        const { pic } = req.query;
        // console.log('/v1/goods/pic/edit', pic);
        res.status(200).send({
            code: 'success',
            msg: ''
        })
    },
    'POST /v1/goods/pic/upload': (req: Request, res: Response) => {
        // const { pic } = req.query;
        // console.log('/v1/goods/pic/edit', req.files);
        res.status(200).send({
            code: 'success',
            msg: '',
            data: {
                imgId: '4',
                imgUrl: '//image-tb.vova.com/image/262_262/filler/00/43/43b20914df9aaf70d450472529aa0043.jpg'
            }
        })
    },
};
