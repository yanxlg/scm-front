import React from 'react';
import { Modal, Timeline, Row, Col } from 'antd';

declare interface IProps {
    visible: boolean;
    hideTrackDetail(): void;
}

declare interface IState {}

class TrackDialog extends React.PureComponent<IProps, IState> {
    render() {
        const { visible, hideTrackDetail } = this.props;
        return (
            <Modal
                title="物流轨迹"
                visible={visible}
                style={{ top: 50 }}
                width={680}
                footer={null}
                onCancel={hideTrackDetail}
            >
                <Row>
                    <Col span={12}>物流订单号: 1111111111</Col>
                    <Col span={12}>首程状态: 已妥投</Col>
                </Row>
                <Timeline style={{ marginTop: 30 }}>
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item color="gray">
                        Solve initial network problems 2015-09-01
                    </Timeline.Item>
                    <Timeline.Item color="gray">Technical testing 2015-09-01</Timeline.Item>
                    <Timeline.Item color="gray">
                        Network problems being solved 2015-09-01
                    </Timeline.Item>
                </Timeline>
                <Row>
                    <Col span={12}>物流订单号: 1111111111</Col>
                    <Col span={12}>尾程状态: 已妥投</Col>
                </Row>
                <Timeline style={{ marginTop: 30 }}>
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item color="gray">
                        Solve initial network problems 2015-09-01
                    </Timeline.Item>
                    <Timeline.Item color="gray">Technical testing 2015-09-01</Timeline.Item>
                    <Timeline.Item color="gray">
                        Network problems being solved 2015-09-01
                    </Timeline.Item>
                </Timeline>
            </Modal>
        );
    }
}

export default TrackDialog;
