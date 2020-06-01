import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Pagination } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { getCatagoryWeightLog } from '@/services/price-strategy';
import { ICatagoryWeightLogReq, IUpdateRecoreItem } from '@/interface/IPriceStrategy';

interface IProps {
    visible: boolean;
    id: string;
    type: 'shipping_fee' | 'sale_price' | 'weight';
    onCancel(): void;
}

const columns: ColumnsType<any> = [
    {
        title: '操作内容',
        dataIndex: 'operate_info',
        align: 'center',
        width: 120,
    },
    {
        title: '操作账号',
        dataIndex: 'operator',
        align: 'center',
        width: 120,
    },
    {
        title: '生效时间',
        dataIndex: 'operate_time',
        align: 'center',
        width: 120,
    },
];

const UpdateRecordModal: React.FC<IProps> = ({ visible, id, type, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    // const [pageCount, setPageCount] = useState(50);
    const [total, setTotal] = useState(0);
    const [dataSource, setDataSource] = useState<IUpdateRecoreItem[]>([]);
    const pageCount = 50;

    const _getCatagoryWeightLog = useCallback((params: ICatagoryWeightLogReq) => {
        setLoading(true);
        getCatagoryWeightLog(params)
            .then(res => {
                // console.log('getCatagoryWeightLog', res);
                const { page } = params;
                const { list, total } = res;
                setPage(page);
                setTotal(total);
                setDataSource(list);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleCancel = useCallback(() => {
        setPage(1);
        // setPageCount(50);
        onCancel();
    }, []);

    const handlePageChange = useCallback(
        page => {
            // console.log('handlePageChange', args);
            _getCatagoryWeightLog({
                page,
                page_count: pageCount,
                third_category_id: id,
            });
        },
        [id],
    );

    useEffect(() => {
        if (id) {
            if (type === 'weight') {
                _getCatagoryWeightLog({
                    page: 1,
                    page_count: pageCount,
                    third_category_id: id,
                });
            }
        }
    }, [id, type]);

    return (
        <Modal title="更新记录" width={720} visible={visible} footer={null} onCancel={handleCancel}>
            <Table
                bordered
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                scroll={{ y: 440 }}
                pagination={false}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                    size="small"
                    total={total}
                    current={page}
                    pageSize={pageCount}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                />
            </div>
        </Modal>
    );
};

export default React.memo(UpdateRecordModal);
