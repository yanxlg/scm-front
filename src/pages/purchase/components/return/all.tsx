import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import {
    AutoEnLargeImg,
    FitTable,
    JsonForm,
    LoadingButton,
    useList,
    useModal,
} from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import { exportReturnList, queryAddressConfig, queryReturnList } from '@/services/purchase';
import { IAddressItem, IReturnItem } from '@/interface/IPurchase';
import CreateReturnOrderModal from '@/pages/purchase/components/return/createReturnOrderModal';
import { PlusOutlined } from '@ant-design/icons';
import { EmptyObject } from '@/config/global';
import styles from '@/pages/purchase/_return.less';
import { PurchaseReturnCode, PurchaseReturnMap } from '@/config/dictionaries/Purchase';
import Export from '@/components/Export';

export const fieldList: FormField[] = [
    {
        label: '出入库单号',
        type: 'input',
        name: 'refer_waybill_no',
    },
    {
        label: '商品名称',
        type: 'input',
        name: 'product_name',
    },
    {
        label: '采购单ID',
        type: 'input',
        name: 'purchase_order_goods_id',
    },
    {
        label: '供应商订单号',
        type: 'input',
        name: 'purchase_order_goods_sn',
    },
    {
        label: '运单号',
        type: 'input',
        name: 'waybill_no',
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

declare interface AllListProps {
    reloadStatics: () => void;
}

const AllList: React.FC<AllListProps> = () => {
    const formRef = useRef<JsonFormRef>(null);

    const [addressData, setAddressData] = useState<IAddressItem[]>([]);

    const [showExport, setShowExport] = useState(false);

    const showExportFn = useCallback(() => {
        setShowExport(true);
    }, []);

    const closeExportFn = useCallback(() => {
        setShowExport(false);
    }, []);

    const onExport = useCallback((data: any) => {
        return exportReturnList({
            ...data,
            query: {
                ...formRef.current!.getFieldsValue(),
            },
        }).request();
    }, []);

    const {
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onChange,
        onSearch,
        onReload,
    } = useList<IReturnItem>({
        queryList: queryReturnList,
        formRef: formRef,
    });

    const { visible, setVisibleProps, onClose } = useModal<boolean>();

    const searchForm = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef} enableCollapse={false}>
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        搜索
                    </LoadingButton>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button onClick={showExportFn} type="primary" className={formStyles.formBtn}>
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const columns = useMemo(() => {
        return [
            {
                title: '出入库单号',
                dataIndex: 'referWaybillNo',
                align: 'center',
                width: '150px',
            },
            {
                title: '出入库类型',
                width: '100px',
                align: 'center',
                dataIndex: 'outboundType',
                render: () => {
                    return '退货出库';
                },
            },
            {
                title: '退货状态',
                width: '200px',
                dataIndex: 'purchaseReturnStatus',
                align: 'center',
                render: (_: PurchaseReturnCode) => PurchaseReturnMap[_],
            },
            {
                title: '商品信息',
                dataIndex: 'product_info',
                width: '178px',
                align: 'center',
                render: (_, item: IReturnItem) => {
                    let {
                        productImageUrl,
                        purchasePlatformGoodsName,
                        productSkuStyle,
                        returnNumber = 0,
                    } = item;
                    let skus: any[] = [];
                    try {
                        const sku = JSON.parse(productSkuStyle);
                        for (let key in sku) {
                            skus.push(
                                <div key={key}>
                                    {key}:{sku[key]}
                                </div>,
                            );
                        }
                    } catch (e) {}
                    return (
                        <div>
                            <AutoEnLargeImg src={productImageUrl} className={styles.image} />
                            <div>{purchasePlatformGoodsName}</div>
                            <div>{skus}</div>
                            <div>数量：x{returnNumber}</div>
                        </div>
                    );
                },
            },
            {
                title: '退货数量',
                dataIndex: 'returnNumber',
                width: '130px',
                align: 'center',
                render: (_, item: IReturnItem) => {
                    const { returnNumber = 0, realReturnNumber = 0 } = item;
                    return `${realReturnNumber}/${returnNumber}`;
                },
            },
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderGoodsId',
                width: '223px',
                align: 'center',
            },
            {
                title: '供应商',
                dataIndex: 'productPddMerchantName',
                width: '223px',
                align: 'center',
            },
            {
                title: '供应商订单号',
                dataIndex: 'purchaseOrderGoodsSn',
                width: '182px',
                align: 'center',
            },
        ] as ColumnType<IReturnItem>[];
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const onModalShow = useCallback(() => {
        setVisibleProps(true);
    }, []);

    const toolBarRender = useCallback(() => {
        return [
            <Button key="extra-btn" type="primary" ghost={true} onClick={onModalShow}>
                <PlusOutlined />
                创建退货单
            </Button>,
        ];
    }, []);

    useEffect(() => {
        // 获取地址信息
        const api = queryAddressConfig();
        api.request().then(({ data = EmptyObject }) => {
            setAddressData(data.children);
        });
        return () => {
            api.cancel();
        };
    }, []);

    const table = useMemo(() => {
        return (
            <FitTable
                rowKey="purchaseOrderGoodsReturnId"
                scroll={scroll}
                bottom={60}
                minHeight={500}
                pagination={pagination}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                onChange={onChange}
                toolBarRender={toolBarRender}
            />
        );
    }, [loading]);

    return useMemo(() => {
        return (
            <>
                {searchForm}
                {table}
                <CreateReturnOrderModal
                    addressDataSet={addressData}
                    visible={visible}
                    onCancel={onClose}
                />
                <Export
                    columns={columns}
                    visible={showExport}
                    onOKey={onExport}
                    onCancel={closeExportFn}
                />
            </>
        );
    }, [loading, visible, addressData, showExport]);
};

export default AllList;
