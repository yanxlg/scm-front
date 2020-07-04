import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Input, Table, Button, notification } from 'antd';
import { ColumnType } from 'antd/es/table';
import {
    postGoodsMerge,
    delGoodsMergeDelete,
    getGoodsMergeList,
    putGoodsMergeAdd,
} from '@/services/goods';

const { TextArea } = Input;

interface IImageItem {
    url: string;
    width: number;
    height: number;
}

interface IGoodsSnItem {
    commodityId: string;
    productId: string;
    productTitle: string;
    image: IImageItem;
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
    const isChangeRef = useRef(false);

    const [loading, setLoading] = useState(false);
    const [commodityIds, setCommodityIds] = useState('');
    const [goodsSnList, setGoodsSnList] = useState<IGoodsSnItem[]>([]);
    const [currentSn, setCurrentSn] = useState('');

    const handleCancel = useCallback(() => {
        isChangeRef.current && onReload();
        setLoading(false);
        setCommodityIds('');
        setCurrentSn('');
        setGoodsSnList([]);
        isChangeRef.current = false;
        onCancel();
    }, []);

    const _getGoodsMergeList = useCallback((currentSn: string) => {
        setLoading(true);
        getGoodsMergeList(currentSn)
            .then(res => {
                // console.log(getGoodsMergeList, res);
                // const { productGroup, mainProductGroup, subProductGroup } = res.data;
                const { relateCommodity } = res.data;

                setGoodsSnList(relateCommodity || []);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const _delGoodsMergeDelete = useCallback(
        (commodityId: string) => {
            setLoading(true);
            delGoodsMergeDelete({
                product_sn: currentSn,
                commodity_id: commodityId,
            })
                .then(() => {
                    isChangeRef.current = true;
                    const list = goodsSnList.filter(item => item.commodityId !== commodityId);
                    if (list.length === 1) {
                        handleCancel();
                    } else {
                        setGoodsSnList(list);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [currentSn, goodsSnList],
    );

    // 关联后新增
    const _putGoodsMergeAdd = useCallback(() => {
        putGoodsMergeAdd({
            product_sn: currentSn,
            commodity_ids: commodityIds.split(','),
        })
            .then(res => {
                notification.success({
                    message: '新增关联商品成功',
                    duration: 3,
                });
                isChangeRef.current = true;
                // handleCancel();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [commodityIds, currentSn]);

    // 首次关联
    const _postGoodsMerge = useCallback(() => {
        postGoodsMerge({
            merge_commodity_ids: [commodityId, ...commodityIds.split(',')],
        })
            .then(res => {
                isChangeRef.current = true;
                notification.success({
                    message: '关联商品成功',
                    duration: 3,
                });

                // handleCancel();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [commodityIds, commodityId]);

    const handleOk = useCallback(() => {
        setLoading(true);
        currentSn ? _putGoodsMergeAdd() : _postGoodsMerge();
    }, [currentSn, _putGoodsMergeAdd, _postGoodsMerge]);

    const columns = useMemo<ColumnType<IGoodsSnItem>[]>(() => {
        return [
            {
                title: 'Commodity ID',
                dataIndex: 'commodityId',
                align: 'center',
                width: 110,
            },
            {
                title: '图片',
                dataIndex: 'image',
                align: 'center',
                width: 60,
                render: (value: IImageItem) => {
                    return <img style={{ width: '100%' }} src={value.url} />;
                },
            },
            {
                title: '标题',
                dataIndex: 'productTitle',
                align: 'center',
                width: 200,
            },
            {
                key: 'x',
                title: '操作',
                align: 'center',
                width: 110,
                render: (_: any, row: IGoodsSnItem) => {
                    const { commodityId } = row;
                    return (
                        <div>
                            <Button type="link" onClick={() => _delGoodsMergeDelete(commodityId)}>
                                删除关联
                            </Button>
                        </div>
                    );
                },
            },
        ];
    }, [_delGoodsMergeDelete]);

    useEffect(() => {
        if (visible) {
            productSn && setCurrentSn(productSn);
        }
    }, [visible]);

    useEffect(() => {
        if (currentSn) {
            _getGoodsMergeList(currentSn);
        }
    }, [currentSn]);

    return useMemo(() => {
        const title = currentSn ? `商品组 Product SN: ${currentSn}` : '商品组';
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
                    {currentSn ? (
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
    }, [visible, loading, commodityIds, currentSn]);
};

export default GoodsMergeModal;
