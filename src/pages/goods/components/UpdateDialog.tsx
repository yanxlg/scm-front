import React from 'react';
import { Modal, Tabs, Radio, Input } from 'antd';

const { TabPane } = Tabs;

declare interface UpdateDialogProps {
    visible: boolean;
    toggleUpdateDialog(status: boolean): void;
}

class UpdateDialog extends React.PureComponent<UpdateDialogProps> {

    private handleOk = () => {
        this.props.toggleUpdateDialog(false);
    }

    private handleCancel = () => {
        this.props.toggleUpdateDialog(false);
    }

    private changeTab = (key: string) => {
        // console.log('changeTab: ', key);
    }

    private changeWeightMethod = () => {

    }

    render() {

        const { visible } = this.props;

        return (
            <Modal 
                title="批量修改"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <Tabs onChange={this.changeTab} type="card">
                    <TabPane tab="修改重量" key="1">
                        <div className="goods-local-update-pane">
                            <Radio.Group onChange={this.changeWeightMethod} value={1}>
                                <Radio className="item" value={1}>
                                    固定生成新重量: &nbsp;&nbsp;<Input className="input" /> kg
                                </Radio>
                                <Radio className="item" value={2}>
                                    随机生成新重量: &nbsp;&nbsp;<Input className="input" /> - <Input className="input" /> kg (范围内随机)
                                </Radio>
                                <Radio className="item" value={3}>
                                    在原来重量增加: &nbsp;&nbsp;<Input className="input" /> kg
                                </Radio>
                            </Radio.Group>
                        </div>
                        
                    </TabPane>
                    <TabPane tab="修改价格" key="2">
                        <div className="goods-local-update-pane">
                            <div className="item">
                                上调价格(不含运费)&nbsp;<Input className="input" />&nbsp;%&nbsp;&nbsp;+&nbsp;&nbsp;固定金额&nbsp;<Input className="input" />&nbsp;$
                            </div>
                            <div className="item">
                                保底加价&nbsp;<Input className="input" />&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;汇率(美元兑当地货币)&nbsp;<Input className="input" />&nbsp;$
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }
}

export default UpdateDialog
