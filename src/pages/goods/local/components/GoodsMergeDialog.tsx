import React, { ChangeEvent } from 'react';
import { Modal, Input, Spin, Table, Button, message } from 'antd';
import { ColumnProps } from 'antd/es/table';

import {
    postGoodsMerge,
    putGoodsMergeMain,
    delGoodsMergeDelete,
    getGoodsMergeList,
} from '@/services/goods';

const { TextArea } = Input;

// 1: 合并后生成的product 2: 主关联商品 3: 关联商品
type IProductType = '1' | '2' | '3';

declare interface IGoodsSnItem {
    commodityId: string;
    productId: string;
    image: string;
    title: string;
    type: IProductType;
}

declare interface IState {
    visible: boolean;
    loading: boolean;
    productSn: string;
    commodityIds: string;
    mainCommodityId: string;
    goodsSnList: IGoodsSnItem[];
}

class MergeDialog extends React.PureComponent<{}, IState> {
    private columns: ColumnProps<IGoodsSnItem>[] = [
        {
            key: 'commodityId',
            title: 'Commodity ID',
            dataIndex: 'commodityId',
            align: 'center',
            width: 110,
            render: (value: string, row: IGoodsSnItem) => {
                const { type } = row;
                const desc = type === '2' ? '主关联商品' : type === '3' ? '关联商品' : '';
                return (
                    <>
                        {value}
                        {desc ? (<div>({desc})</div>) : null}
                    </>
                )
            }
        },
        {
            key: 'image',
            title: '图片',
            dataIndex: 'image',
            align: 'center',
            width: 60,
            render: (value: string) => {
                return <img style={{ width: '100%' }} src={value} />;
            },
        },
        {
            key: 'title',
            title: '标题',
            dataIndex: 'title',
            align: 'center',
            width: 200,
        },
        {
            key: 'x',
            title: '操作',
            align: 'center',
            width: 110,
            render: (value, row: IGoodsSnItem) => {
                const { type, commodityId } = row;
                return type === '3' ? (
                    <>
                        <div>
                            <Button type="link" onClick={() => this.setGoodsMain(commodityId)}>
                                设为主商品
                            </Button>
                        </div>
                        <div style={{marginTop: -10}}>
                            <Button type="link" onClick={() => this.delGoodsRef(commodityId)}>
                                删除关联
                            </Button>
                        </div>
                        
                    </>
                ) : null;
            },
        },
    ];

    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            productSn: '',
            mainCommodityId: '',
            commodityIds: '',
            goodsSnList: [],
        };
    }

    showModal = (commodityId: string, productSn: string) => {
        const _productSn = productSn !== '0' ? productSn : '';
        this.setState({
            visible: true,
            productSn: _productSn,
            mainCommodityId: commodityId,
        });
        _productSn && this.getGoodsList(_productSn)
    }

    getGoodsList = (productSn: string) => {
        this.setState({
            loading: true,
        });
        getGoodsMergeList(productSn)
            .then(res => {
                console.log('getGoodsMergeList', res);
                const { productGroup, mainProductGroup, subProductGroup } = res.data;
                // const { list } = res.data;
                this.setState({
                    mainCommodityId: mainProductGroup.commodityId,
                    goodsSnList: [
                        {
                            ...productGroup,
                            type: '1'
                        },
                        {
                            ...mainProductGroup,
                            type: '2'
                        },
                        ...subProductGroup.map((item: any) => ({
                            ...item,
                            type: '3'
                        }))
                    ],
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    private handleCancel = () => {
        this.setState({
            visible: false,
            loading: false,
            productSn: '',
            commodityIds: '',
            goodsSnList: []
        });
    };

    private handleOk = () => {
        // 校验数字字符
        const { commodityIds, mainCommodityId } = this.state;
        if (/[^0-9\,]/.test(commodityIds)) {
            return message.error('commodity_id输入了非法字符，只支持检索数字！');
        }
        this.setState({
            loading: true
        });
        postGoodsMerge({
            main_commodity_id: mainCommodityId,
            merge_commodity_ids: commodityIds.split(',')
        }).then(res => {
            this.handleCancel();
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    };

    private setGoodsMain = (mainCommodityId: string) => {
        const { goodsSnList, productSn } = this.state;
        this.setState({
            loading: true
        });
        putGoodsMergeMain({
            product_sn: productSn,
            main_commodity_id: mainCommodityId
        }).then(() => {
            this.setState({
                mainCommodityId: mainCommodityId,
                goodsSnList: goodsSnList.map(item => {
                    const { type, commodityId } = item;
                    if (type === '2') {
                        return {
                            ...item,
                            type: '3'
                        }
                    }
                    if (mainCommodityId === commodityId) {
                        return {
                            ...item,
                            type: '2'
                        }
                    }
                    return item;
                })
            })
        }).finally(() => {
            this.setState({
                loading: false
            });
        });
    };

    private delGoodsRef = (commodityId: string) => {
        const { productSn, goodsSnList } = this.state;
        this.setState({
            loading: true
        });
        delGoodsMergeDelete({
            product_sn: productSn,
            commodity_ids: [commodityId]
        }).then(() => {
            this.setState({
                goodsSnList: goodsSnList.filter(item => item.commodityId !== commodityId)
            })
        }).finally(() => {
            this.setState({
                loading: false
            });
        });
    };

    private handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        // console.log('handleChange', e.target.value);
        this.setState({
            commodityIds: e.target.value.replace(/\s+/g, ''),
        });
    };

    render() {
        const { loading, visible, commodityIds, productSn, goodsSnList } = this.state;
        const title = productSn ? `商品组 Product SN: ${productSn}` : '商品组';
        return (
            <Modal
                title={title}
                visible={visible}
                width={860}
                confirmLoading={loading}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                okButtonProps={{
                    disabled: !commodityIds || loading,
                }}
            >
                <div className="text-center">
                    {
                        productSn ? (
                            <Table
                                bordered
                                rowKey="commodityId"
                                loading={loading}
                                columns={this.columns}
                                dataSource={goodsSnList}
                                scroll={{ y: 400 }}
                                pagination={false}
                                style={{ marginBottom: 20 }}
                            />
                        ) : null
                    }
                    <TextArea
                        placeholder="输入commodity_id可关联更新商品，以'英文逗号'分割"
                        value={commodityIds}
                        onChange={this.handleChange}
                    />
                </div>
            </Modal>
        );
    }
}

export default MergeDialog;
