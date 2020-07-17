import React, { useMemo } from 'react';
import { Modal, Table } from 'antd';
import { utcToLocal } from 'react-components/es/utils/date';
import useValue from 'react-components/es/hooks/useValue';

export declare interface UpdateLogProps {
    list:
        | Array<{
              operator: string;
              content: string;
              update_time: string;
          }>
        | false;
    onClose: () => void;
}

const UpdateLog: React.FC<UpdateLogProps> = ({ list, onClose }) => {
    const dataSource = useValue(list);
    return useMemo(() => {
        return (
            <Modal title="更新记录" footer={null} width={800} visible={!!list} onCancel={onClose}>
                <Table
                    bordered={true}
                    columns={[
                        {
                            title: '更新时间',
                            dataIndex: 'update_time',
                            width: 200,
                            align: 'center',
                            render: _ => utcToLocal(_),
                        },
                        {
                            title: '操作账户',
                            dataIndex: 'operator',
                            align: 'center',
                            width: 150,
                        },
                        {
                            title: '更新内容',
                            dataIndex: 'content',
                            align: 'center',
                            width: 350,
                        },
                    ]}
                    pagination={false}
                    dataSource={dataSource || []}
                    scroll={{
                        y: 400,
                    }}
                />
            </Modal>
        );
    }, [list]);
};

export default UpdateLog;
