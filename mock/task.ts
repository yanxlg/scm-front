import { Request, Response } from 'express';

const Mock = require('mockjs');

const list = Mock.mock({
    'data|100-500': [
        {
            task_sn: '@increment(10000)',
            task_id: '@increment',
            task_name: '@title',
            "task_range|1": [
                1,
                2,
                undefined
            ],
            "task_type|1": [
                1,
                2,
                3
            ],
            start_time: '@date("yyyy-MM-dd HH:mm:ss")',
            "status|1": [
                1,
                2,
                3
            ],
            create_time: '@date("yyyy-MM-dd HH:mm:ss")',
        },
    ],
});

export default {
    'get /*/task/list': (req: Request, res: Response) => {
        const { page, page_number } = req.query;
        res.status(200).send({
                message: "",
                code: 200,
                data: {
                    task_info: list.data.slice(
                        Number(page_number) * (Number(page) - 1),
                        Number(page_number) * (Number(page)),
                    ),
                    total: list.data.length
                }
            }
        );
    },
    'post /*/task/spider/pdd_hotsale': (req: Request, res: Response) => {
        const code = Mock.mock({
            "data|1": [
                200,
                201,
            ]
        }).data;
        const taskId = Mock.mock({
            "data":"@integer(10)"
        }).data;
        res.status(200).send({
                code:code,
                 message:"1111",
                data:code===200?{
                    task_id:taskId
                }:null
            },
        );
    },
    'delete /*/task/delete': (req: Request, res: Response) => {
        const {task_ids} = req.body;
        const taskIdList = task_ids.split(",");
        list.data = list.data.filter((item:any)=>taskIdList.indexOf(String(item.task_id))<0);
        res.status(200).send({
                code:200,
                message:"1111",
            },
        );
    },
    'get /*/task/detail': (req: Request, res: Response) => {
        const task = Mock.mock({
            task_detail_info:{
                task_name:"@title",
                "range|1":[
                    0,
                    "@integer"
                ],
                category_level_one:"@integer(1,3)",
                category_level_two:"@integer(1,3)",
                sort_type:"@integer(1,3)",
                keywords:"@title",
                sales_volume_min:"@integer(1,50)",
                sales_volume_max:"@integer(1,50)",
                price_min:"@integer(1,50)",
                price_max:"@integer(1,50)",
                grab_page_count:"@integer(1,50)",
                grab_count_max:"@integer(1,50)",
                "task_type|1":[
                    1,
                    2
                ],
                task_start_time:parseInt(Mock.mock('@datetime(T)')),
                task_end_time:parseInt(Mock.mock('@datetime(T)')),
                task_interval_seconds:"@integer(10,1000000)",
                "status|1":[
                    0,1,2,3
                ],
                success:"@integer(1,100)",
                fail:"@integer(1,100)",
                urls:`${Mock.mock('@url')},${Mock.mock('@url')},${Mock.mock('@url')}`
            }
        });
        setTimeout(()=>{
            res.status(200).send({
                    code:200,
                    message:"1111",
                    data:task
                },
            );
        },3000);
    },
};
