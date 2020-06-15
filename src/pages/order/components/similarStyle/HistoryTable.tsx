import React, { useMemo } from 'react';
import { Radio, Table, Form } from 'antd';
import { TableProps } from 'antd/es/table';
import { IHistorySimilar } from '@/interface/IOrder';
import similarStyles from '@/pages/order/components/similarStyle/_similar.less';
import { AutoEnLargeImg } from 'react-components';

const HistoryTable = ({ list }: { list: IHistorySimilar[] }) => {
    const columns = useMemo<TableProps<IHistorySimilar>['columns']>(() => {
        return [
            {
                title: '选择',
                dataIndex: 'productId',
                width: '130px',
                align: 'center',
                render: (id: string, item: IHistorySimilar, index: number) => {
                    return (
                        <Radio
                            value={JSON.stringify({
                                product_id: item.productId,
                                commodity_sku_id: item.commoditySkuId,
                                index: index,
                            })}
                        />
                    );
                },
            },
            {
                title: 'Product ID',
                dataIndex: 'productId',
                width: '130px',
                align: 'center',
            },
            {
                title: 'Commodity SKU ID',
                dataIndex: 'commoditySkuId',
                width: '130px',
                align: 'center',
            },
            {
                title: '图片',
                dataIndex: 'productImageUrl',
                width: '130px',
                align: 'center',
                render: _ => {
                    return <AutoEnLargeImg src={_} className={similarStyles.image} />;
                },
            },
            {
                title: '规格',
                dataIndex: 'productSkuStyle',
                width: '130px',
                align: 'center',
            },
            {
                title: '代拍成功率',
                dataIndex: 'substituteSuccessRate',
                width: '130px',
                align: 'center',
            },
        ];
    }, []);
    return useMemo(() => {
        return (
            <Form.Item
                noStyle={true}
                name="list"
                rules={[{ required: true, message: '请选择历史代拍商品' }]}
            >
                <Radio.Group>
                    <Table
                        tableLayout="fixed"
                        columns={columns}
                        pagination={false}
                        dataSource={list}
                    />
                </Radio.Group>
            </Form.Item>
        );
    }, []);
};

export default HistoryTable;
