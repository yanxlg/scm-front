import React, { useCallback, useMemo, useRef } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { FitTable, JsonForm, LoadingButton, useList } from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import { queryPurchaseList } from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';
import ConnectModal from './connectModal';
import PurchaseDetailModal from '@/pages/purchase/components/list/purchaseDetailModal';
import ReturnModal from './returnModal';

const fieldList: FormField[] = [
    {
        label: '采购单id',
        type: 'input',
        name: 'purchase_order_goods_id',
    },
    {
        label: '供应商',
        type: 'input',
        name: 'gongyingshag',
    },
    {
        label: '供应商订单号',
        type: 'input',
        name: 'order',
    },
    {
        label: '商品名称',
        type: 'input',
        name: 'purchase_goods_name',
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const AllList = () => {
    const formRef = useRef<JsonFormRef>(null);

    const {
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onChange,
        onSearch,
        onReload,
    } = useList<IPurchaseItem>({
        queryList: queryPurchaseList,
        formRef: formRef,
        extraQuery: {
            type: 0,
        },
    });

    const searchForm = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef} enableCollapse={false}>
                <div>
                    <LoadingButton onClick={onSearch} type="primary" className={formStyles.formBtn}>
                        搜索
                    </LoadingButton>
                    <LoadingButton onClick={onReload} type="primary" className={formStyles.formBtn}>
                        刷新
                    </LoadingButton>
                    <Button type="primary" className={formStyles.formBtn}>
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const columns = useMemo(() => {
        return [
            {
                title: '采购单ID',
                dataIndex: 'purchaseOrderGoodsId',
                align: 'center',
                width: '150px',
            },
            {
                title: '采购单状态',
                width: '100px',
                dataIndex: 'purchaseOrderStatus',
                align: 'center',
            },
            {
                title: '采购金额',
                width: '200px',
                dataIndex: 'purchaseTotalAmount',
                align: 'center',
            },
            {
                title: '商品信息',
                dataIndex: 'task_name',
                width: '178px',
                align: 'center',
            },
            {
                title: '供应商',
                dataIndex: 'purchasePlatform',
                width: '130px',
                align: 'center',
            },
            {
                title: '供应商订单号',
                dataIndex: ['storageExpressInfo', 'purchaseTrackingNumber'],
                width: '223px',
                align: 'center',
            },
            {
                title: '采购计划',
                width: '223px',
                align: 'center',
                render: () => <Button>查看详情</Button>,
            },
            {
                title: '运单号',
                dataIndex: ['storageExpressInfo', 'purchaseTrackingNumber'],
                width: '182px',
                align: 'center',
            },
            {
                title: '出入库单号',
                dataIndex: ['storageExpressInfo', 'referWaybillNo'],
                width: '223px',
                align: 'center',
            },
            {
                title: '出入库类型',
                dataIndex: ['storageExpressInfo', 'type'],
                width: '223px',
                align: 'center',
            },
        ] as ColumnType<IPurchaseItem>[];
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

    const table = useMemo(() => {
        return (
            <FitTable
                rowKey="task_id"
                scroll={scroll}
                bottom={60}
                minHeight={500}
                pagination={pagination}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                onChange={onChange}
            />
        );
    }, [loading]);

    return useMemo(() => {
        return (
            <>
                {searchForm}
                {table}
                {/*{<ConnectModal visible="1111" onCancel={() => {}} />}*/}
                {/*<ReturnModal visible="111" onCancel={() => {}} />*/}
                {/*<PurchaseDetailModal visible="1111" onCancel={() => {}} />*/}
            </>
        );
    }, [loading]);
};

export default AllList;
