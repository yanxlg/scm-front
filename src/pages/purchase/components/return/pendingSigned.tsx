import React, { useCallback, useMemo, useRef } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import { FitTable, JsonForm, useList } from 'react-components';
import { FormField } from 'react-components/src/JsonForm/index';
import { Button } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ITaskListItem } from '@/interface/ITask';
import { ColumnType, TableProps } from 'antd/es/table';
import { queryPurchaseList } from '@/services/purchase';
import { IPurchaseItem } from '@/interface/IPurchase';

const fieldList: FormField[] = [
    {
        label: '出入库单号',
        type: 'input',
        name: 'id',
    },
    {
        label: '商品名称',
        type: 'input',
        name: 'gongyingshag',
    },
    {
        label: '采购单ID',
        type: 'input',
        name: 'order',
    },
    {
        label: '供应商订单号',
        type: 'input',
        name: 'name',
    },
    {
        label: '运单号',
        type: 'input',
        name: 'name',
    },
];

const fieldList1: FormField[] = [
    {
        label: '72小时无状态更新',
        type: 'checkbox',
        name: 'id',
        formItemClassName: '',
    },
];

const scroll: TableProps<ITaskListItem>['scroll'] = { x: true, scrollToFirstRowOnChange: true };

const PendingSigned = () => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);

    const searchForm = useMemo(() => {
        return (
            <JsonForm fieldList={fieldList} ref={formRef} enableCollapse={false}>
                <div>
                    <Button type="primary" className={formStyles.formBtn}>
                        搜索
                    </Button>
                    <Button type="primary" className={formStyles.formBtn}>
                        刷新
                    </Button>
                    <Button type="primary" className={formStyles.formBtn}>
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const { loading, pageNumber, pageSize, dataSource, total, onChange } = useList<IPurchaseItem>({
        queryList: queryPurchaseList,
        formRef: [formRef, formRef1],
    });

    const columns = useMemo(() => {
        return [
            {
                title: '出入库单号',
                dataIndex: 'operation',
                align: 'center',
                fixed: 'left',
                width: '150px',
            },
            {
                title: '出入库类型',
                width: '100px',
                fixed: 'left',
                dataIndex: 'task_id',
                align: 'center',
            },
            {
                title: '退货状态',
                width: '200px',
                fixed: 'left',
                dataIndex: 'task_sn',
                align: 'center',
            },
            {
                title: '商品信息',
                dataIndex: 'task_name',
                width: '178px',
                align: 'center',
            },
            {
                title: '退货数量',
                dataIndex: 'status',
                width: '130px',
                align: 'center',
            },
            {
                title: '采购单ID',
                dataIndex: 'channel',
                width: '223px',
                align: 'center',
            },
            {
                title: '供应商',
                dataIndex: 'task_type',
                width: '223px',
                align: 'center',
            },
            {
                title: '供应商订单号',
                dataIndex: 'task_range',
                width: '182px',
                align: 'center',
            },
            {
                title: '运单号',
                dataIndex: 'execute_count',
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

    const toolBarRender = useCallback(() => {
        return [
            <JsonForm
                containerClassName=""
                key="extra-form"
                fieldList={fieldList1}
                ref={formRef1}
                enableCollapse={false}
            />,
        ];
    }, []);

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
                toolBarRender={toolBarRender}
            />
        );
    }, []);

    return useMemo(() => {
        return (
            <>
                {searchForm}
                {table}
            </>
        );
    }, []);
};

export default PendingSigned;
