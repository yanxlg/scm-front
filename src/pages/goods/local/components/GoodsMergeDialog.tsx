import React, { ChangeEvent } from 'react';
import { Modal, Input, Spin, Table, Button, message } from 'antd';
import { ColumnProps } from 'antd/es/table';

import {
    postGoodsMerge,
    putGoodsMergeMain,
    delGoodsMergeDelete,
    getGoodsList,
} from '@/services/goods';

const { TextArea } = Input;

declare interface IGoodsSnItem {
    commodity_id: string;
    product_id: string;
    goods_img: string;
    title: string;
}

declare interface IState {
    visible: boolean;
    loading: boolean;
    productSn: string;
    commodityIds: string;
    goodsSnList: IGoodsSnItem[];
}

class MergeDialog extends React.PureComponent<{}, IState> {
    private columns: ColumnProps<IGoodsSnItem>[] = [
        {
            key: 'commodity_id',
            title: 'Commodity ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 110,
        },
        {
            key: 'goods_img',
            title: '图片',
            dataIndex: 'goods_img',
            align: 'center',
            width: 110,
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
            // dataIndex: 'commodity_id',
            align: 'center',
            width: 110,
            render: (value: any, row: IGoodsSnItem) => {
                return (
                    <>
                        <Button ghost={true} size="small" type="primary">
                            设为主商品
                        </Button>
                        <Button ghost={true} size="small" type="primary">
                            删除关联
                        </Button>
                    </>
                );
            },
        },
    ];

    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            loading: true,
            productSn: '',
            commodityIds: '',
            goodsSnList: [],
        };
    }

    getGoodsList = (productSn: string) => {
        this.setState({
            productSn,
            visible: true,
            loading: true,
        });
        getGoodsList({
            product_sn: productSn,
        })
            .then(res => {
                // console.log('getGoodsList', res);
                const { list } = res.data;
                this.setState({
                    goodsSnList: list.map((item: any) => {
                        const { commodity_id, product_id, goods_img, title } = item;
                        return {
                            commodity_id,
                            product_id,
                            goods_img,
                            title,
                        };
                    }),
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    private handleCancel = () => {
        // this.setState({
        //     commodityIds: ''
        // })
    };

    private handleOk = () => {
        // 校验数字字符
        const { commodityIds } = this.state;
        if (/[^0-9\,]/.test(commodityIds)) {
            return message.error('commodity_id输入了非法字符，只支持检索数字！');
        }
    };

    private setGoodsMain = (productId: string) => {};

    private delGoodsRef = (productId: string) => {};

    private handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        // console.log('handleChange', e.target.value);
        this.setState({
            commodityIds: e.target.value.replace(/\s+/g, ''),
        });
    };

    render() {
        const { loading, visible, commodityIds, productSn, goodsSnList } = this.state;

        return (
            <Modal
                title={`商品组 Product SN: ${productSn}`}
                visible={visible}
                width={860}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                okButtonProps={{
                    disabled: !commodityIds,
                }}
            >
                <div className="text-center">
                    {loading ? (
                        <Spin />
                    ) : goodsSnList.length ? (
                        <Table
                            bordered={true}
                            rowKey="product_id"
                            columns={this.columns}
                            dataSource={goodsSnList}
                            scroll={{ y: 300 }}
                            pagination={false}
                        />
                    ) : null}
                    <TextArea
                        style={{ marginTop: 20 }}
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
