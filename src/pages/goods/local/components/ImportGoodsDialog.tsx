import React from 'react';
import { Modal, Upload, Icon, Progress } from 'antd';

const { Dragger } = Upload;

declare interface ImportGoodsDialogProps {
    visible: boolean;
    toggleImportGoodsDialog(status: boolean): void;
}

class ImportGoodsDialog extends React.PureComponent<ImportGoodsDialogProps> {
    private handleOk = () => {
        this.props.toggleImportGoodsDialog(false);
    };

    private handleCancel = () => {
        this.props.toggleImportGoodsDialog(false);
    };

    render() {
        const { visible } = this.props;

        return (
            <Modal
                title="导入商品"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <Dragger>
                    <div className="">
                        <Icon type="cloud-download" style={{ fontSize: 40, color: '#1890ff' }} />
                        <p>点击选择或拖拽上传</p>
                    </div>
                </Dragger>
                <Progress percent={50} status="active" />
            </Modal>
        );
    }
}

export default ImportGoodsDialog;
