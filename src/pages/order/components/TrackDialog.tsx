import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Modal, Timeline, Row, Col, Spin, Card } from 'antd';
import { getOrderTrack } from '@/services/order-manage';
import { getStatusDesc } from '@/utils/transform';
import { purchaseShippingOptionList } from '@/enums/OrderEnum';

declare interface ITrackItem {
    time: string;
    info: string;
    status: string;
}

declare interface IBeginItem {
    purchase_status: number;
    purchase_waybill_no: string;
    list: ITrackItem[];
}

declare interface IBeginInfo {
    [key: string]: IBeginItem[];
}

declare interface IProps {
    visible: boolean;
    orderGoodsId: string;
    lastWaybillNo: string;
    hideTrackDetail(): void;
}

const TrackDialog: React.FC<IProps> = ({
    visible,
    orderGoodsId,
    lastWaybillNo,
    hideTrackDetail,
}) => {
    const [loading, setLoading] = useState(true);
    const [beginInfo, setbeginInfo] = useState<IBeginInfo>({});
    const [endList, setEndList] = useState<ITrackItem[]>([]);

    const _getOrderTrack = useCallback(() => {
        setLoading(true);
        getOrderTrack({
            order_goods_id: orderGoodsId,
            last_waybill_no: lastWaybillNo,
        })
            .then(res => {
                // console.log('getOrderTruck', res);
                const { begin_track, end_track } = res.data;
                setbeginInfo(begin_track);
                setEndList(end_track);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [orderGoodsId, lastWaybillNo]);

    useEffect(() => {
        if (visible) {
            _getOrderTrack();
        } else {
            setLoading(true);
        }
    }, [visible]);

    return useMemo(() => {
        return (
            <Modal
                title="物流轨迹"
                visible={visible}
                footer={null}
                onCancel={hideTrackDetail}
                width={720}
            >
                <div style={{ maxHeight: 600, overflow: 'auto' }}>
                    {loading ? (
                        <div className="text-center">
                            <Spin />
                        </div>
                    ) : (
                        <>
                            {Object.keys(beginInfo).length > 0 ? (
                                <Card title="首程物流轨迹">
                                    {Object.keys(beginInfo).map(key => {
                                        const platformTrackList = beginInfo[key];
                                        return platformTrackList.map(
                                            ({ purchase_status, purchase_waybill_no, list }) => (
                                                <div key={purchase_waybill_no}>
                                                    <Row>
                                                        <Col span={10}>
                                                            物流订单号: {purchase_waybill_no}
                                                        </Col>
                                                        <Col span={7}>采购平台: {key}</Col>
                                                        <Col span={7}>
                                                            首程状态:{' '}
                                                            {getStatusDesc(
                                                                purchaseShippingOptionList,
                                                                purchase_status,
                                                            )}
                                                        </Col>
                                                    </Row>
                                                    <Timeline style={{ marginTop: 16 }}>
                                                        {list.map(({ time, info }, index) => (
                                                            <Timeline.Item
                                                                key={index}
                                                                color={index === 0 ? 'red' : 'gray'}
                                                            >
                                                                <p>{time}</p>
                                                                {info}
                                                            </Timeline.Item>
                                                        ))}
                                                    </Timeline>
                                                </div>
                                            ),
                                        );
                                    })}
                                </Card>
                            ) : (
                                <p>暂无订单物流轨迹</p>
                            )}
                            {endList.length > 0 ? (
                                <Card title="尾程物流轨迹" style={{ marginTop: 30 }}>
                                    <Row>
                                        <Col span={10}>物流订单号: {lastWaybillNo}</Col>
                                        <Col span={14}>尾程状态: {endList[0].status}</Col>
                                    </Row>
                                    <Timeline style={{ marginTop: 16 }}>
                                        {endList.map(({ time, info }, index) => (
                                            <Timeline.Item
                                                key={index}
                                                color={index === 0 ? 'red' : 'gray'}
                                            >
                                                <p>{time}</p>
                                                {info}
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </Card>
                            ) : null}
                        </>
                    )}
                </div>
            </Modal>
        );
    }, [visible, loading]);
};

export default TrackDialog;
