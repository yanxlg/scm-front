import React from 'react';
import VersionSearch, { IFormData } from '@/pages/goods/vova/components/VersionSearch';
import { Button, Card, Checkbox, Divider, Table } from 'antd';
import '@/styles/product.less';
import { ColumnProps } from 'antd/lib/table/interface';
import { Bind } from 'lodash-decorators';
import { queryGoodsVersion } from '@/services/products';

declare interface ITableItem {
    vova_virtual_id: number;
    product_id: number;
    commodity_id: number;
    price: number;
    shipping_fee: number;
    specs: object;
    product_main_pic: string;
    lower_shelf: 0 | 1;
    upper_shelf: 0 | 1;
    goods_title: string;
    product_description: string;
    sku_pics_volume: number;
    operationer: string;
    apply_time: number;
    push_time: number;
    operation_time: number;
    is_version_applied: 0 | 1;

    rowSpan?: number;
}

declare interface IVersionState {
    selectedRowKeys: Set<number>;
    dataLoading: boolean;
    dataSet: ITableItem[];
    attributes?: {
        price: number;
        shipping_fee: number;
        sku_volume: number;
        goods_title: number;
        product_description: number;
        category: number;
        specs: number;
        lower_shelf: number;
        upper_shelf: number;
        sku_pics: number;
    }
}

class Version extends React.PureComponent<{}, IVersionState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selectedRowKeys: new Set(),
            dataLoading: false,
            dataSet: [],
        };
    }

    componentDidMount(): void {
        this.queryData();
    }

    render() {
        const { selectedRowKeys, dataLoading, attributes, dataSet: data } = this.state;

        const { dataSet, keys } = this.combineDataSet(data);
        const selectedSize = selectedRowKeys.size;
        const indeterminate = selectedSize > 0;
        const checkedAll = selectedSize === keys.length;
        const columns: ColumnProps<ITableItem>[] = [
            {
                title: <Checkbox indeterminate={checkedAll ? false : indeterminate} checked={checkedAll}
                                 onChange={(e) => this.onCheckAllBoxStateChange(e.target.checked, keys)}/>,
                width: '50px',
                fixed: 'left',
                render: (text, record, index) => {
                    const { selectedRowKeys } = this.state;
                    return {
                        children: <Checkbox checked={selectedRowKeys.has(record.product_id)}
                                            onChange={(e) => this.onCheckboxStateChange(e.target.checked, record.product_id)}/>,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '虚拟ID',
                dataIndex: 'vova_virtual_id',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: 'Product_ID',
                dataIndex: 'product_id',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: 'Commodity_id',
                dataIndex: 'commodity_id',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '价格',
                dataIndex: 'price',
            },
            {
                title: '运费',
                dataIndex: 'shipping_fee',
            },
            {
                title: '规格',
                dataIndex: 'specs',
            },
            {
                title: '商品主图',
                dataIndex: 'product_main_pic',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '下架',
                dataIndex: 'lower_shelf',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '上架',
                dataIndex: 'upper_shelf',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '商品标题&描述',
                dataIndex: 'goods_title',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: 'sku图片数',
                dataIndex: 'sku_pics_volume',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '操作人',
                dataIndex: 'operationer',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '应用时间',
                dataIndex: 'apply_time',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '推送时间',
                dataIndex: 'push_time',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
            {
                title: '操作',
                dataIndex: 'action',
                render: (text, record, index) => {
                    return {
                        children: text,
                        props: {
                            rowSpan: record.rowSpan || 0,
                        },
                    };
                },
            },
        ];
        return (
            <div className="container">
                <Card>
                    <VersionSearch onActive={() => Promise.resolve()} onExport={() => Promise.resolve()}
                                   onSearch={this.queryData}/>
                </Card>

                <Card className="product-card card-divider">
                    <Divider orientation="left">数据/状态更新：</Divider>
                    <div className="product-text">
                        价格（{attributes?.price ?? 0}）
                    </div>
                    <div className="product-text">
                        运费（{attributes?.shipping_fee ?? 0}）
                    </div>
                    <div className="product-text">
                        SKU数量（{attributes?.sku_volume ?? 0}）
                    </div>
                    <div className="product-text">
                        商品标题（{attributes?.goods_title ?? 0}）
                    </div>
                    <div className="product-text">
                        商品描述（{attributes?.product_description ?? 0}）
                    </div>
                    <div className="product-text">
                        类目（{attributes?.category ?? 0}）
                    </div>
                    <div className="product-text">
                        规格（{attributes?.specs ?? 0}）
                    </div>
                    <div className="product-text">
                        下架（{attributes?.lower_shelf ?? 0}）
                    </div>
                    <div className="product-text">
                        上架（{attributes?.upper_shelf ?? 0}）
                    </div>
                    <div className="product-text">
                        SKU对应图片（{attributes?.sku_pics ?? 0}）
                    </div>
                    <Button type="primary">所有更新信息已查看</Button>
                </Card>

                <Table
                    loading={dataLoading}
                    rowKey="product_id"
                    className="product-card"
                    columns={columns}
                    dataSource={dataSet}
                    bordered={true}
                    scroll={{ x: 1600 }}
                    pagination={false}
                    onRow={record => {
                        return {
                            onClick: () => {
                                this.toggleCheckboxState(record.product_id);
                            }, // 点击行
                        };
                    }}
                />
            </div>
        );
    }

    @Bind
    private queryData(params?: IFormData) {
        this.setState({
            dataLoading: true,
        });
        return queryGoodsVersion(params).then(({ data: { attribute_update = {}, goods_list = [] } }) => {
            this.setState({
                dataSet: goods_list,
                attributes: attribute_update,
            });
        }).finally(() => {
            this.setState({
                dataLoading: false,
            });
        });
    }

    @Bind
    private combineDataSet(dataSet: ITableItem[]) {
        // 组装DataSet，根据product_id进行组合
        let i = 0, length = dataSet.length;
        let keys = [];
        for (; i < length;) {
            const item = dataSet[i];
            keys.push(item.product_id);
            let rows = [item];
            let end = false;
            let j = i + 1;
            while (!end && j < length) {
                const nextItem = dataSet[j];
                if (nextItem.product_id === item.product_id) {
                    rows.push(nextItem);
                    j++;
                } else {
                    end = true;
                }
            }
            const rowLength = rows.length;
            item.rowSpan = rowLength;
            i += rowLength;
        }
        return {
            dataSet: dataSet,
            keys: keys,
        };
    }

    @Bind
    private toggleCheckboxState(product_id: number) {
        this.setState((state) => {
            const checked = !state.selectedRowKeys.has(product_id);
            checked ? state.selectedRowKeys.add(product_id) : state.selectedRowKeys.delete(product_id);
            return {
                ...state,
                selectedRowKeys: new Set<number>(state.selectedRowKeys),
            };
        });
    }

    @Bind
    private onCheckboxStateChange(checked: boolean, product_id: number) {
        this.setState((state) => {
            checked ? state.selectedRowKeys.add(product_id) : state.selectedRowKeys.delete(product_id);
            return {
                ...state,
                selectedRowKeys: new Set<number>(state.selectedRowKeys),
            };
        });
    }

    @Bind
    private onCheckAllBoxStateChange(checked: boolean, allKeys: number[]) {
        this.setState((state) => {
            return {
                ...state,
                selectedRowKeys: new Set<number>(checked ? allKeys : []),
            };
        });
    }
}

export default Version;
