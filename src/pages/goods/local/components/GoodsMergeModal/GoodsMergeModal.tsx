import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Input, Table, Button, notification } from 'antd';
import { ColumnType } from 'antd/es/table';
import {
    postGoodsMerge,
    putGoodsMergeMain,
    delGoodsMergeDelete,
    getGoodsMergeList,
    putGoodsMergeAdd,
} from '@/services/goods';

const { TextArea } = Input;
// 1: 合并后生成的product 2: 主关联商品 3: 关联商品
type IProductType = '1' | '2' | '3';
interface IGoodsSnItem {
    commodityId: string;
    productId: string;
    image: string;
    title: string;
    type: IProductType;
}

interface IProps {
    visible: boolean;
    commodityId: string;
    productSn: string;
    onReload(): Promise<void>;
    onCancel(): void;
}

const GoodsMergeModal: React.FC<IProps> = ({
    visible,
    productSn,
    commodityId,
    onReload,
    onCancel,
}) => {
    const commodityIdRef = useRef('');
    const isChangeRef = useRef(false);

    // console.log(1111111, commodityIdRef, commodityId);
    const [loading, setLoading] = useState(false);
    const [commodityIds, setCommodityIds] = useState('');
    const [goodsSnList, setGoodsSnList] = useState<IGoodsSnItem[]>([]);

    const _getGoodsMergeList = useCallback((productSn: string) => {
        setLoading(true);
        getGoodsMergeList(productSn)
            .then(res => {
                const { productGroup, mainProductGroup, subProductGroup } = res.data;
                commodityIdRef.current = mainProductGroup.commodityId;
                setGoodsSnList([
                    {
                        ...productGroup,
                        type: '1',
                    },
                    {
                        ...mainProductGroup,
                        type: '2',
                    },
                    ...subProductGroup.map((item: any) => ({
                        ...item,
                        type: '3',
                    })),
                ]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const _putGoodsMergeMain = useCallback(
        (mainCommodityId: string) => {
            setLoading(true);
            putGoodsMergeMain({
                product_sn: productSn,
                main_commodity_id: mainCommodityId,
            })
                .then(() => {
                    isChangeRef.current = true;
                    _getGoodsMergeList(productSn);
                })
                .catch(() => {
                    setLoading(false);
                });
        },
        [goodsSnList, productSn],
    );

    const _delGoodsMergeDelete = useCallback(
        (commodityId: string) => {
            setLoading(true);
            delGoodsMergeDelete({
                product_sn: productSn,
                commodity_ids: [commodityId],
            })
                .then(() => {
                    isChangeRef.current = true;
                    setGoodsSnList(goodsSnList.filter(item => item.commodityId !== commodityId));
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [productSn, goodsSnList],
    );

    // 关联后新增
    const _putGoodsMergeAdd = useCallback(() => {
        putGoodsMergeAdd({
            product_sn: productSn,
            commodity_ids: commodityIds.split(','),
        })
            .then(res => {
                notification.success({
                    message: '新增关联商品成功',
                    duration: 3,
                });
                isChangeRef.current = true;
                handleCancel();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [commodityIds, productSn]);

    // 首次关联
    const _postGoodsMerge = useCallback(() => {
        postGoodsMerge({
            main_commodity_id: commodityIdRef.current,
            merge_commodity_ids: commodityIds.split(','),
        })
            .then(res => {
                const { commodityId, productSn } = res.data;
                notification.success({
                    message: '关联商品成功',
                    duration: 8,
                    description: (
                        <>
                            <p>Commodity ID: {commodityId.parts[0]}</p>
                            <p>Product SN: {productSn.parts[0]}</p>
                        </>
                    ),
                });
                isChangeRef.current = true;
                handleCancel();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [commodityIds]);

    const handleCancel = useCallback(() => {
        isChangeRef.current && onReload();
        setLoading(false);
        setCommodityIds('');
        setGoodsSnList([]);
        isChangeRef.current = false;
        commodityIdRef.current = '';
        onCancel();
    }, []);

    const handleOk = useCallback(() => {
        // console.log(handleOk, commodityIdRef);
        setLoading(true);
        productSn ? _putGoodsMergeAdd() : _postGoodsMerge();
    }, [productSn, _putGoodsMergeAdd, _postGoodsMerge]);

    const columns = useMemo<ColumnType<IGoodsSnItem>[]>(() => {
        return [
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
                            {desc ? <div>({desc})</div> : null}
                        </>
                    );
                },
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
                render: (_: any, row: IGoodsSnItem) => {
                    const { type, commodityId } = row;
                    return type === '3' ? (
                        <>
                            <div>
                                <Button type="link" onClick={() => _putGoodsMergeMain(commodityId)}>
                                    设为主商品
                                </Button>
                            </div>
                            <div style={{ marginTop: -4 }}>
                                <Button
                                    type="link"
                                    onClick={() => _delGoodsMergeDelete(commodityId)}
                                >
                                    删除关联
                                </Button>
                            </div>
                        </>
                    ) : null;
                },
            },
        ];
    }, [_putGoodsMergeMain, _delGoodsMergeDelete]);

    useEffect(() => {
        if (visible) {
            productSn && _getGoodsMergeList(productSn);
        }
    }, [visible]);

    useEffect(() => {
        commodityId && (commodityIdRef.current = commodityId);
    }, [commodityId]);

    return useMemo(() => {
        const title = productSn ? `商品组 Product SN: ${productSn}` : '商品组';
        return (
            <Modal
                title={title}
                visible={visible}
                width={860}
                confirmLoading={loading}
                onCancel={handleCancel}
                onOk={handleOk}
                okButtonProps={{
                    disabled: !commodityIds || loading,
                }}
            >
                <div className="text-center">
                    {productSn ? (
                        <Table
                            bordered
                            rowKey="commodityId"
                            loading={loading}
                            columns={columns}
                            dataSource={goodsSnList}
                            scroll={{ y: 400 }}
                            pagination={false}
                            style={{ marginBottom: 20 }}
                        />
                    ) : null}
                    <TextArea
                        placeholder="输入commodity_id可关联更新商品，以'英文逗号'分割"
                        value={commodityIds}
                        onChange={e => setCommodityIds(e.target.value.replace(/\s+/g, ''))}
                    />
                </div>
            </Modal>
        );
    }, [visible, loading, commodityIds]);
};

export default GoodsMergeModal;
