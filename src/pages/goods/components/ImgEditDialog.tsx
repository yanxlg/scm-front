import React from 'react';
import { Modal, Icon, Upload, message, Popconfirm } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { ISkuImgItem } from '../local';
import { UploadChangeParam } from 'antd/lib/upload'

import {
    putGoodsPicEdit,
    postGoodsPicUpload
} from '@/services/goods';

declare interface ImgEditDialogProps {
    visible: boolean;
    imgList: ISkuImgItem[];
    toggleImgEditDialog(status: boolean, imgList?: ISkuImgItem[]): void;
}

declare interface ImgEditDialogState {
    loading: boolean;
}

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

    private dragstart = (item: ISkuImgItem) => {
        // console.log('dragstart', item);
        this.startItem = item;
    }

    private dragover = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    }

    private drop = (item: ISkuImgItem) => {
        // console.log('drop', item);
        const { imgList } = this.props;
        const startIndex = imgList.findIndex(currentItem => currentItem.imgId === this.startItem.imgId);
        const endIndex = imgList.findIndex(str => str === item);
        const copyImgList = [...imgList]
        // 元素互换位置
        if (startIndex !== endIndex) {
            copyImgList[startIndex] = item;
            copyImgList[endIndex] = this.startItem;
            // this.forceUpdate();
            // this.props.toggleImgEditDialog(true, copyImgList);
            this.putGoodsPicEdit(copyImgList);
        }
    }

    private confirmDelete = (item: ISkuImgItem) => {
        // console.log('confirmDelete', item);
        const { imgList } = this.props;
        const index = imgList.findIndex(currentItem => currentItem.imgId === item.imgId);
        const copyImgList = [...imgList];
        copyImgList.splice(index, 1);
        this.putGoodsPicEdit(copyImgList);
    }

    // 删除或者调整图片位置
    private putGoodsPicEdit = (imgList: ISkuImgItem[]) => {
        putGoodsPicEdit({
            pic: imgList.map(item => item.imgId)
        }).then(res => {
            // console.log('putGoodsPicEdit', imgList)
            this.props.toggleImgEditDialog(true, imgList);
            message.success('图片编辑成功！');
        }).catch(err => {
            message.success('图片编辑失败！');
        })
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

    private uploadImg = (info: UploadChangeParam) => {
        const { loading } = this.state;
        if (!loading) {
            this.setState({
                loading: true
            }, () => {
                // console.log('uploadImg', info);
                const formData = new FormData();
                formData.append('file', info.file.originFileObj as Blob);
                postGoodsPicUpload(formData).then(res => {
                    // console.log('postGoodsPicUpload', res);
                    message.success('图片上传成功');
                    this.setState({
                        loading: false
                    })
                    this.props.toggleImgEditDialog(true, [
                        ...this.props.imgList,
                        res.data
                    ]);
                }).catch(err => {
                    // console.log('postGoodsPicUpload', err);
                })
            })
        }
        
    }

    render() {

        const { visible, imgList } = this.props;
        const { loading } = this.state;
        if (imgList.length === 0) {
            return null;
        }
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
                                src={imgList[0].imgUrl}
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
                                        <div key={item.imgId} className="img-box item">
                                            <img 
                                                src={item.imgUrl}
                                                onDragStart={() => this.dragstart(item)}
                                                onDragOver={this.dragover}
                                                onDrop={() => this.drop(item)}
                                            />
                                            <Popconfirm
                                                title="确定删除吗?"
                                                onConfirm={() => this.confirmDelete(item)}
                                                okText="是"
                                                cancelText="否"
                                            >
                                                <Icon className="close" type="close-circle" />
                                            </Popconfirm>
                                            
                                        </div>
                                    )
                                })
                            }
                            <Upload
                                className="item"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                onChange={this.uploadImg}
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
