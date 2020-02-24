import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import "@/styles/modal.less";
import "@/styles/order.less";
import { ColumnProps } from 'antd/es/table';

declare interface IDataItem {
    price:string;
    create_time:number;
    order_ids:string;
    controller:string;
    order_id:string;
}

const column:ColumnProps<IDataItem>[] = [
    {
        title: '支付金额',
        width: '80px',
        dataIndex: 'price',
        fixed: 'left',
        align: 'center',
    },
    {
        title: '拍单时间',
        width: '100px',
        dataIndex: 'create_time',
        align: 'center',
    },{
        title: '中台订单ID',
        width: '100px',
        dataIndex: 'order_ids',
        align: 'center',
    },{
        title: "拍单操作人",
        width: '100px',
        dataIndex: 'controller',
        align: 'center',
    }
];

const OrderPayListModal:React.FC = ()=>{
    const [selectedRowKeys,setSelectedRowKeys] = useState<string[]>([]);
    const [totalAmount,setTotalAmount] = useState();

    const Pay = useCallback(()=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve();
            },3000)
        });
    },[]);

    const rowSelection = {
        fixed: true,
        columnWidth: '50px',
        onChange: (selectedRowKeys:string[], selectedRows:IDataItem[]) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    return useMemo(()=>{
        return (
            <Modal title={<>待支付列表<span>支付总金额：89889</span></>} className="modal-border-none order-pay-modal" visible={true} okText="确认支付" cancelText={undefined} onOk={Pay}>
                <Table pagination={false} rowKey="order_id" columns={column} rowSelection={rowSelection} dataSource={[{
                    order_id:1,
                    price:100,
                    order_ids:"2131312",
                    controller:"sd"
                },{
                    order_id:3,
                    price:100,
                    order_ids:"2131312",
                    controller:"sd"
                }]}/>
            </Modal>
        )
    },[]);
};


export {OrderPayListModal};
