import React from 'react';
import { Modal, Icon, Upload, message } from 'antd';
import { RcFile } from 'antd/lib/upload';

declare interface ImgEditDialogProps {
    visible: boolean;
    toggleImgEditDialog(status: boolean): void;
}

declare interface ImgEditDialogState {
    loading: boolean;
}

const imgList = [
    '//image-tb.airyclub.com/image/500_500/filler/26/61/6b075aafdcbf2c47ccc97ea3d5892661.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/14/f8/16505aa7826f9765879f5d79b85814f8.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/32/d6/6da124d68e4360b2b07b94e89bb932d6.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/49/11/008d41366a61579120128f3dd2d14911.jpg',
    '//image-tb.airyclub.com/image/500_500/filler/cb/df/fb4fcb6545dfe9b4dcb01b6ef740cbdf.jpg'
]

class ImgEditDialog extends React.PureComponent<ImgEditDialogProps, ImgEditDialogState> {

    private startItem: any

    constructor(props: ImgEditDialogProps) {
        super(props);
        this.state = {
            loading: false
        }
    }

    private handleOk = () => {
        this.props.toggleImgEditDialog(false);
    }

    private handleCancel = () => {
        this.props.toggleImgEditDialog(false);
    }

    private dragstart = (item: any) => {
        // console.log('dragstart', item);
        this.startItem = item;
    }

    private dragover = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    }

    private drop = (item: any) => {
        // console.log('drop', item);
        const startIndex = imgList.findIndex(str => str === this.startItem);
        const endIndex = imgList.findIndex(str => str === item);
        // 元素互换位置
        if (startIndex !== endIndex) {
            imgList[startIndex] = item;
            imgList[endIndex] = this.startItem;
            this.forceUpdate();
        }
    }
    // RcFile
    private beforeUpload = (file: RcFile, FileList: RcFile[]) => {
        // console.log('beforeUpload', file);
        if (file.type !== 'image/jpeg') {
            message.error('导入失败！图片格式错误');
            return false;
        }
        const isLt = file.size / 1024 / 1024 <= 0.1;
        if (!isLt) {
            message.error('导入失败！图片大于100k');
            return false;
        }
        return true;
    }

    render() {

        const { visible } = this.props;
        const { loading } = this.state;

        return (
            <Modal
                visible={visible}
                width={950}
                footer={null}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className="goods-local-edit-img">
                    <div className="first">
                        <p>主图</p>
                        <div className="img-box">
                            <img 
                                src={imgList[0]}
                                onDragOver={this.dragover}
                                onDrop={() => this.drop(imgList[0])}
                            />
                        </div>
                    </div>
                    <div className="secondary">
                        <p>副图</p>
                        <div className="list">
                            {
                                imgList.slice(1).map(item => {
                                    return (
                                        <div key={item} className="img-box item">
                                            <img 
                                                src={item}
                                                onDragStart={() => this.dragstart(item)}
                                                onDragOver={this.dragover}
                                                onDrop={() => this.drop(item)}
                                            />
                                            <Icon className="close" type="close-circle" />
                                        </div>
                                    )
                                })
                            }
                            <Upload
                                className="item"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                            >
                                <div className="add">
                                    <div className="inner">
                                        <Icon className="add-icon" type={loading ? 'loading' : 'plus'} />
                                    </div>
                                    <div className="desc">图片为低于100k的jpg格式</div>
                                </div>
                            </Upload>
                            
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default ImgEditDialog;
