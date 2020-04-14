import React, { useMemo, useState } from 'react';
import { Radio, Table, Form } from 'antd';
import { TableProps } from 'antd/es/table';

declare interface IHistoryItem {
    id: string;
    product_id: string;
    commodity_id: string;
    img: string;
    desc: string;
    range: string;
}

const HistoryTable = () => {
    const [] = useState();

    const columns = useMemo<TableProps<IHistoryItem>['columns']>(() => {
        return [
            {
                title: '选择',
                dataIndex: 'id',
                width: '130px',
                align: 'center',
                render: (id: string) => {
                    return <Radio value={id} />;
                },
            },
            {
                title: 'Product ID',
                dataIndex: 'product_id',
                width: '130px',
                align: 'center',
            },
            {
                title: 'Commodity SKU ID',
                dataIndex: 'commodity_id',
                width: '130px',
                align: 'center',
            },
            {
                title: '图片',
                dataIndex: 'img',
                width: '130px',
                align: 'center',
            },
            {
                title: '规格',
                dataIndex: 'desc',
                width: '130px',
                align: 'center',
            },
            {
                title: '代拍成功率',
                dataIndex: 'range',
                width: '130px',
                align: 'center',
            },
        ];
    }, []);
    return useMemo(() => {
        return (
            <Form.Item noStyle={true} name="list">
                <Radio.Group>
                    <Table<IHistoryItem>
                        tableLayout="fixed"
                        columns={columns}
                        pagination={false}
                        dataSource={
                            [
                                {
                                    id: '1',
                                    product_id: '2121',
                                    commodity_id: 'dasdsa',
                                    desc: 'dsadasdas',
                                    range: '30%',
                                },
                                {
                                    id: '2',
                                    product_id: '2121',
                                    commodity_id: 'dasdsa',
                                    desc: 'dsadasdas',
                                    range: '30%',
                                },
                            ] as IHistoryItem[]
                        }
                    />
                </Radio.Group>
            </Form.Item>
        );
    }, []);
};

export default HistoryTable;
