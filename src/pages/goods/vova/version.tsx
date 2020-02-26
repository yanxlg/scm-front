import React from 'react';
import VersionSearch, { IApiParams } from '@/pages/goods/vova/components/VersionSearch';
import { Button, Card, Checkbox, Divider, message, Spin, Table } from 'antd';
import '@/styles/product.less';
import { ColumnType } from 'antd/lib/table/interface';
import { BindAll } from 'lodash-decorators';
import {
    activeVovaGoodsVersion,
    clearGoodsVersionRecord,
    exportVovaGoodsVersion,
    queryGoodsVersion,
} from '@/services/vova';

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
    clearLoading: boolean;
    dataSet: ITableItem[];
    keys: number[];
    attributes?: Array<{
        property: string;
        count: number;
    }>;
}

@BindAll()
class Version extends React.PureComponent<{}, IVersionState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selectedRowKeys: new Set(),
            dataLoading: false,
            dataSet: [],
            keys: [],
            clearLoading: false,
        };
    }

    componentDidMount(): void {
        this.queryData();
    }

    private queryData(params?: IApiParams) {
        this.setState({
            dataLoading: true,
        });
        return queryGoodsVersion(params)
            .then(({ data: { changed_property_list = [], goods_list = [] } }) => {
                const { dataSet, keys } = this.combineDataSet(goods_list);
                this.setState({
                    dataSet,
                    keys,
                    attributes: changed_property_list,
                });
            })
            .finally(() => {
                this.setState({
                    dataLoading: false,
                });
            });
    }

    private exportGoodsVersion(params?: IApiParams) {
        return exportVovaGoodsVersion(params);
    }

    private activeGoodsVersion() {
        const { selectedRowKeys, dataSet } = this.state;
        let params: Array<{
            virtual_id: number;
            product_id: number;
        }> = [];
        selectedRowKeys.forEach(product_id => {
            params.push({
                product_id: product_id,
                virtual_id: dataSet.find(item => item.product_id === product_id)!.vova_virtual_id,
            });
        });
        return activeVovaGoodsVersion(params).then(() => {
            message.success('应用新版本成功!');
        });
    }

    private combineDataSet(dataSet: ITableItem[]) {
        // 组装DataSet，根据product_id进行组合
        let i = 0,
            length = dataSet.length;
        let keys = [];
        for (; i < length; ) {
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

    private toggleCheckboxState(product_id: number) {
        this.setState(state => {
            const checked = !state.selectedRowKeys.has(product_id);
            checked
                ? state.selectedRowKeys.add(product_id)
                : state.selectedRowKeys.delete(product_id);
            return {
                ...state,
                selectedRowKeys: new Set<number>(state.selectedRowKeys),
            };
        });
    }

    private onCheckboxStateChange(checked: boolean, product_id: number) {
        this.setState(state => {
            checked
                ? state.selectedRowKeys.add(product_id)
                : state.selectedRowKeys.delete(product_id);
            return {
                ...state,
                selectedRowKeys: new Set<number>(state.selectedRowKeys),
            };
        });
    }

    private onCheckAllBoxStateChange(checked: boolean, allKeys: number[]) {
        this.setState(state => {
            return {
                ...state,
                selectedRowKeys: new Set<number>(checked ? allKeys : []),
            };
        });
    }

    private clearRecord() {
        this.setState({ clearLoading: true });
        clearGoodsVersionRecord()
            .then(() => {
                this.setState({
                    clearLoading: false,
                    attributes: undefined,
                });
            })
            .catch(() => {
                this.setState({
                    clearLoading: false,
                });
            });
    }
    private columns: ColumnType<ITableItem>[] = [
        {
            title: () => {
                const { selectedRowKeys, keys } = this.state;
                const selectedSize = selectedRowKeys.size;
                const indeterminate = selectedSize > 0;
                const checkedAll = selectedSize === keys.length && selectedSize > 0;
                return (
                    <Checkbox
                        indeterminate={checkedAll ? false : indeterminate}
                        checked={checkedAll}
                        onChange={e => this.onCheckAllBoxStateChange(e.target.checked, keys)}
                    />
                );
            },
            width: '50px',
            fixed: 'left',
            render: (text, record, index) => {
                const { selectedRowKeys } = this.state;
                return {
                    children: (
                        <Checkbox
                            checked={selectedRowKeys.has(record.product_id)}
                            onChange={e =>
                                this.onCheckboxStateChange(e.target.checked, record.product_id)
                            }
                        />
                    ),
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
            dataIndex: 'is_version_applied',
            render: (text, record, index) => {
                return {
                    children: text === 1 ? '已使用' : '',
                    props: {
                        rowSpan: record.rowSpan || 0,
                    },
                };
            },
        },
    ];
    render() {
        const { dataLoading, attributes, dataSet, clearLoading } = this.state;
        return (
            <div className="container">
                <Card>
                    <VersionSearch
                        onActive={this.activeGoodsVersion}
                        onExport={this.exportGoodsVersion}
                        onSearch={this.queryData}
                    />
                </Card>
                <Card className="product-card" title="数据/状态更新">
                    <Spin spinning={dataLoading} tip="Loading...">
                        {attributes?.map(({ count, property }) => {
                            return (
                                <div className="product-text" key={property}>
                                    {property}（{count}）
                                </div>
                            );
                        })}
                        <Button loading={clearLoading} type="primary" onClick={this.clearRecord}>
                            所有更新信息已查看
                        </Button>
                    </Spin>
                </Card>
                <Table
                    loading={dataLoading}
                    rowKey="product_id"
                    className="product-card"
                    columns={this.columns}
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
}

export default Version;
