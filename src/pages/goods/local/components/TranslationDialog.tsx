import React from 'react';
import { Modal, Radio, Button } from 'antd';

declare interface TranslationDialogProps {
    visible: boolean;
    toggleTranslationDialog(status: boolean): void;
}

declare interface TranslationDialogState {
    settingVisible: boolean;
}

class TranslationDialog extends React.PureComponent<
    TranslationDialogProps,
    TranslationDialogState
> {
    constructor(props: TranslationDialogProps) {
        super(props);
        this.state = {
            settingVisible: false,
        };
    }

    private handleOk = () => {
        this.props.toggleTranslationDialog(false);
    };

    private handleCancel = () => {
        this.props.toggleTranslationDialog(false);
    };

    private changeTextType = () => {};

    private changeTargetLang = () => {};

    private toggleSetting = (status: boolean) => {
        this.setState({
            settingVisible: status,
        });
    };

    private handleSettingOk = () => {
        this.toggleSetting(false);
    };

    private handleSettingCancel = () => {
        this.toggleSetting(false);
    };

    private changeTranslationMethods = () => {};

    render() {
        const { visible } = this.props;
        const { settingVisible } = this.state;

        return (
            <>
                <Modal
                    title="批量翻译"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <div className="goods-local-translation">
                        <div className="item">
                            <p className="label">翻译文本:</p>
                            <Radio.Group
                                className="radio-group"
                                onChange={this.changeTextType}
                                value={1}
                            >
                                <Radio value={1}>标题</Radio>
                                <Radio value={2}>描述</Radio>
                                <Radio value={3}>规格文本</Radio>
                            </Radio.Group>
                        </div>
                        <div className="item">
                            <p className="label">目标语言:</p>
                            <Radio.Group
                                className="radio-group"
                                onChange={this.changeTargetLang}
                                value={0}
                            >
                                <Radio value={1}>标题</Radio>
                                <Radio value={2}>描述</Radio>
                                <Radio value={3}>规格文本</Radio>
                                <Radio value={1}>标题</Radio>
                                <Radio value={2}>描述</Radio>
                                <Radio value={3}>规格文本</Radio>
                                <Radio value={1}>标题</Radio>
                                <Radio value={2}>描述</Radio>
                                <Radio value={3}>规格文本</Radio>
                                <Radio value={1}>标题</Radio>
                                <Radio value={2}>描述</Radio>
                                <Radio value={3}>规格文本</Radio>
                                <Radio value={1}>标题</Radio>
                                <Radio value={2}>描述</Radio>
                                <Radio value={3}>规格文本</Radio>
                            </Radio.Group>
                        </div>
                        <Button
                            className="btn"
                            type="link"
                            onClick={() => this.toggleSetting(true)}
                        >
                            翻译设置
                        </Button>
                    </div>
                </Modal>
                <Modal
                    title="翻译设置"
                    width={800}
                    visible={settingVisible}
                    onOk={this.handleSettingOk}
                    onCancel={this.handleSettingCancel}
                >
                    <Radio.Group
                        className="goods-local-translation-setting"
                        onChange={this.changeTranslationMethods}
                        value={1}
                    >
                        <Radio className="radio-item" value={1}>
                            Google Translation (Public)
                        </Radio>
                        <Radio className="radio-item" value={2}>
                            Google Translation (Private)
                        </Radio>
                        <Radio className="radio-item" value={3}>
                            微软翻译 (Private)
                        </Radio>
                        <Radio className="radio-item" value={4}>
                            百度翻译 (Private)
                        </Radio>
                    </Radio.Group>
                </Modal>
            </>
        );
    }
}

export default TranslationDialog;
