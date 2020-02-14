// 重量和价格编辑移除
import React from 'react';
import { Modal, Tabs, Radio, Input, InputNumber } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio'

const { TabPane } = Tabs;

declare interface IUpdateDialogProps {
    visible: boolean;
    type: string;
    toggleUpdateDialog(status: boolean, type?: string): void;
}

declare interface IUpdateDialogState {
    weightType: number;
    fixedWeight: number | undefined;
    randomMinWeight: number | undefined;
    randomMaxWeight: number | undefined;
    increaseWeight: number | undefined;
}

class UpdateDialog extends React.PureComponent<IUpdateDialogProps, IUpdateDialogState> {

    constructor(props: IUpdateDialogProps) {
        super(props);
        this.state = {
            weightType: 1,
            fixedWeight: undefined,
            randomMinWeight: undefined,
            randomMaxWeight: undefined,
            increaseWeight: undefined,
        }
    }

    private handleOk = () => {
        this.props.toggleUpdateDialog(false);
    }

    private handleCancel = () => {
        this.props.toggleUpdateDialog(false);
    }

    private changeTab = (key: string) => {
        // console.log('changeTab: ', key);
        this.props.toggleUpdateDialog(true, key);
    }

    private changeWeightMethod = (e: RadioChangeEvent) => {
        // console.log(e.target.value);
        this.setState({
            weightType: e.target.value
        });
    }

    private setFixedWeight = (val: number | undefined) => {
        // console.log('setFixedWeight', val);
        this.setState({
            fixedWeight: val
        });
    }

    private setRandomMinWeight = (val: number | undefined) => {
        // console.log('setFixedWeight', val);
        this.setState({
            randomMinWeight: val
        });
    }

    private setRandomMaxWeight = (val: number | undefined) => {
        // console.log('setFixedWeight', val);
        this.setState({
            randomMaxWeight: val
        });
    }

    render() {

        const { visible, type } = this.props;
        const { 
            weightType,
            fixedWeight,
            randomMinWeight,
            randomMaxWeight,
            increaseWeight
        } = this.state;

        return (
            <Modal 
                title="批量修改"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <Tabs type="card" activeKey={type} onChange={this.changeTab} >
                    <TabPane tab="修改重量" key="weight">
                        <div className="goods-local-update-pane">
                            <Radio.Group onChange={this.changeWeightMethod} value={weightType}>
                                <Radio className="item" value={1}>
                                    固定生成新重量: &nbsp;&nbsp;
                                    <InputNumber 
                                        className="input"
                                        value={fixedWeight}
                                        onChange={this.setFixedWeight}
                                    /> kg
                                </Radio>
                                <Radio className="item" value={2}>
                                    随机生成新重量: &nbsp;&nbsp;
                                    <InputNumber 
                                        className="input"
                                        value={randomMinWeight}
                                        onChange={this.setRandomMinWeight}
                                    />

                                    &nbsp;-&nbsp;
                                    <Input 
                                        className="input" 
                                    /> kg (范围内随机)
                                </Radio>
                                <Radio className="item" value={3}>
                                    在原来重量增加: &nbsp;&nbsp;<InputNumber className="input" /> kg
                                </Radio>
                            </Radio.Group>
                        </div>
                        
                    </TabPane>
                    <TabPane tab="修改价格" key="price">
                        <div className="goods-local-update-pane">
                            <div className="item">
                                上调价格(不含运费)&nbsp;<Input className="input" />&nbsp;%&nbsp;&nbsp;+&nbsp;&nbsp;固定金额&nbsp;<Input className="input" />&nbsp;$
                            </div>
                            <div className="item">
                                保底加价&nbsp;<Input className="input" />&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;汇率(美元兑当地货币)&nbsp;<Input className="input" />&nbsp;
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }
}

export default UpdateDialog
