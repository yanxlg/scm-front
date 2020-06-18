import React, { useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { TableProps } from 'antd/es/table';
import channelStyles from '@/styles/_channel.less';
import { useDataSet } from 'react-components';
import { ILogItem } from '@/interface/IChannel';
import { queryOnOffLog } from '@/services/channel';
import { FitTable } from 'react-components';
import { utcToLocal } from 'react-components/es/utils/date';

declare interface OnOffLogModalProps {
    visible:
        | {
              product_ids: string;
              merchant_id: string;
              commodity_ids: string;
          }
        | false;
    onClose: () => void;
}

const OnOffLogModal: React.FC<OnOffLogModalProps> = ({ visible, onClose }) => {
    const { dataSet, setDataSet, loading, setLoading } = useDataSet<ILogItem>();
    const columns = useMemo<TableProps<ILogItem>['columns']>(() => {
        return [
            {
                title: `序号（${dataSet.length}）`,
                dataIndex: 'index',
                width: '150px',
                align: 'center',
                render: (_, record, index: number) => {
                    return index + 1;
                },
            },
            {
                title: '时间',
                width: '180px',
                dataIndex: 'finish_time',
                align: 'center',
                render: _ => utcToLocal(_),
            },
            {
                title: '状态',
                width: '100px',
                dataIndex: 'status_label',
                align: 'center',
            },
            {
                title: '原因',
                width: '300px',
                dataIndex: 'reason',
                align: 'center',
            },
        ];
    }, [dataSet]);
    useEffect(() => {
        if (visible) {
            setDataSet([]);
            setLoading(true);
            queryOnOffLog(visible)
                .then(({ data }) => {
                    setDataSet(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [visible]);

    const scroll = useMemo(() => {
        return { y: 500, x: 'max-content' }; // x需要设置，否则Table会闪
    }, []);

    return useMemo(() => {
        return (
            <Modal
                visible={!!visible}
                title="上下架日志"
                onCancel={onClose}
                className={channelStyles.logModal}
            >
                <div className={channelStyles.logContent}>
                    <FitTable
                        tableLayout="fixed"
                        columns={columns}
                        scroll={scroll}
                        dataSource={dataSet}
                        loading={loading}
                        pagination={false}
                    />
                </div>
            </Modal>
        );
    }, [visible, loading]);
};

export default OnOffLogModal;
