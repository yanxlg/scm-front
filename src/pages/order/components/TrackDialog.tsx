import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Modal, Timeline, Row, Col, Spin, Card } from 'antd';
import { getOrderTrack } from '@/services/order-manage';

declare interface ITrackItem {
    time: string;
    info: string;
    status: string;
}

declare interface IBegin {
    [key: string]: ITrackItem[];
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
    const [beginInfo, setbeginInfo] = useState<IBegin>({});
    const [endList, setEndList] = useState<ITrackItem[]>([]);

    const _getOrderTrack = useCallback(() => {
        setLoading(true);
        getOrderTrack({
            order_goods_id: '1000012825745432664' || orderGoodsId,
            last_waybill_no: 'UC810741953YP' || lastWaybillNo,
        })
            .then(res => {
                console.log('getOrderTruck', res);
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
                style={{ top: 50 }}
                width={680}
                footer={null}
                onCancel={hideTrackDetail}
            >
                {loading ? (
                    <div className="text-center">
                        <Spin />
                    </div>
                ) : (
                    <>
                        {Object.keys(beginInfo)?.length > 0 ? (
                            <Card title="首程物流轨迹">
                                {Object.keys(beginInfo).map(key => {
                                    const platformTrackList = beginInfo[key];
                                    return (
                                        <div key={key}>
                                            <Row>
                                                <Col span={8}>物流订单号: 1111111111</Col>
                                                <Col span={8}>采购平台: {key}</Col>
                                                <Col span={8}>
                                                    首程状态: {platformTrackList[0]?.status || ''}
                                                </Col>
                                            </Row>
                                            <Timeline style={{ marginTop: 30 }}>
                                                {platformTrackList.map(({ time, info }, index) => (
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
                                    );
                                })}
                            </Card>
                        ) : null}

                        <Card title="尾程物流轨迹">
                            <Row>
                                <Col span={8}>物流订单号: {lastWaybillNo}</Col>
                                <Col span={8}>尾程状态: 已妥投</Col>
                            </Row>
                            <Timeline style={{ marginTop: 30 }}>
                                <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                                <Timeline.Item color="gray">
                                    Solve initial network problems 2015-09-01
                                </Timeline.Item>
                                <Timeline.Item color="gray">
                                    Technical testing 2015-09-01
                                </Timeline.Item>
                                <Timeline.Item color="gray">
                                    Network problems being solved 2015-09-01
                                </Timeline.Item>
                            </Timeline>
                        </Card>
                    </>
                )}
            </Modal>
        );
    }, [visible, loading]);
};

export default TrackDialog;
