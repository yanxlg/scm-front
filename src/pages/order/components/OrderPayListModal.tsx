import React, { ReactText, useCallback, useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import "@/styles/modal.less";
import "@/styles/order.less";
import "@/styles/index.less";
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

declare interface IOrderPayListModalProps {
    visible:boolean;
}

const OrderPayListModal:React.FC<IOrderPayListModalProps> = ({visible})=>{
    const [selectedRowKeys,setSelectedRowKeys] = useState<string[]>([]);
    const [qrVisible,setQrVisible] = useState(false);
    const [totalAmount,setTotalAmount] = useState();
    const [dataSet,setDataSet] = useState([{
        order_id:1,
        price:100,
        order_ids:"2131312",
        controller:"sd"
    },{
        order_id:3,
        price:10,
        order_ids:"2131312",
        controller:"sd"
    }]);

    const Pay = useCallback(()=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                setQrVisible(true);
                resolve();
            },3000)
        });
    },[]);

    const Close = useCallback(()=>{
        setQrVisible(false);
    },[]);

    const rowSelection = {
        fixed: true,
        columnWidth: '50px',
        onChange: (selectedRowKeys:ReactText[], selectedRows:IDataItem[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            if(selectedRowKeys.length>0){
                setTotalAmount(dataSet.reduce<number>((prev,curr)=>{
                    if(selectedRowKeys.indexOf(curr.order_id)>-1){
                        return prev + curr.price;
                    }
                    return prev;
                },0))
            }else{
                setTotalAmount(undefined);
            }
        }
    };

    return useMemo(()=>{
        return (
            <Modal title={
                <>
                    待支付列表
                    {
                        totalAmount !== undefined?<span className="order-pay-total">支付总金额：<span className="order-pay-total-amount">{totalAmount}</span></span>:null
                    }
                </>
            }
                   className="modal-border-none order-pay-modal modal-cancel-none"
                   visible={visible}
                   okText="确认支付"
                   cancelText={undefined}
                   onOk={Pay}
            >
                <Table pagination={false} rowKey="order_id" columns={column} rowSelection={rowSelection} dataSource={dataSet}/>
                <Modal title="扫码支付" className="order-pay-qr-modal modal-cancel-none" visible={qrVisible} onOk={Close} centered={true} onCancel={Close}>
                    <div>
                        <div className="order-pay-qr"/>
                        <div className="text-center">谁的钱</div>
                    </div>
                </Modal>
            </Modal>
        )
    },[totalAmount,dataSet,qrVisible,visible]);
};


export {OrderPayListModal};
