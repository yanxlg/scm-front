import { Request, Response } from 'express';


const Mock = require('mockjs');

const list = Mock.mock({
    'data|100-500': [
        {
            task_id: '@increment',
            task_name: '@title',
            "task_range|1": [
                "1",
                "2",
            ],
            "task_type|1": [
                "1",
                "2",
                "3"
            ],
            start_time: '@date("yyyy-MM-dd HH:mm:ss")',
            "status|1": [
                "1",
                "2",
                "3"
            ],
            create_time: '@date("yyyy-MM-dd HH:mm:ss")',
        },
    ],
});

export default {
    'get /v1/task/list': (req: Request, res: Response) => {
        const { page, page_number } = req.query;
        res.status(200).send({
                'code': 200,
                'data': {
                    message:"",
                    code:"200",
                    data:{
                        task_info:list.data.slice(
                            Number(page_number) * (Number(page)-1),
                            Number(page_number) * (Number(page)),
                        ),
                        total:list.data.length
                    }
                },
            },
        );
    },
};
