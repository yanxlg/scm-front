import React from 'react';
import { Modal, Icon, Upload, message, Popconfirm } from 'antd';
import { RcFile } from 'antd/lib/upload';
// import { UploadChangeParam } from 'antd/lib/upload';

import { putGoodsPicEdit, postGoodsPicUpload } from '@/services/goods';
import { imgDomain } from '@/enums/ConfigEnum';

declare interface ImgEditDialogProps {
    visible: boolean;
    imgList: string[];
    product_id: string;
    toggleImgEditDialog(status: boolean, imgList?: string[], product_id?: string): void;
    updateGoodsListImg(imgList: string[], product_id: string): void;
}

declare interface ImgEditDialogState {
    loading: boolean;
}

class ImgEditDialog extends React.PureComponent<ImgEditDialogProps, ImgEditDialogState> {
    private startItem: any;

    constructor(props: ImgEditDialogProps) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    private handleOk = () => {
        this.props.toggleImgEditDialog(false);
    };

    private handleCancel = () => {
        this.props.toggleImgEditDialog(false);
    };

    private dragstart = (item: string) => {
        // console.log('dragstart', item);
        this.startItem = item;
    };

    private dragover = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    };

    private drop = (item: string) => {
        // console.log('drop', item);
        const { imgList } = this.props;
        const startIndex = imgList.findIndex(currentItem => currentItem === this.startItem);
        const endIndex = imgList.findIndex(str => str === item);
        const copyImgList = [...imgList];
        // 元素互换位置
        if (startIndex !== endIndex) {
            copyImgList[startIndex] = item;
            copyImgList[endIndex] = this.startItem;
            // this.forceUpdate();
            // this.props.toggleImgEditDialog(true, copyImgList);
            this.putGoodsPicEdit(copyImgList);
        }
    };

    private confirmDelete = (item: string) => {
        // console.log('confirmDelete', item);
        const { imgList } = this.props;
        const index = imgList.findIndex(currentItem => currentItem === item);
        const copyImgList = [...imgList];
        copyImgList.splice(index, 1);
        this.putGoodsPicEdit(copyImgList);
    };

    // 删除或者调整图片位置
    private putGoodsPicEdit = (imgList: string[]) => {
        const { product_id } = this.props;
        putGoodsPicEdit({
            product_id,
            pic_url: imgList.map(item => item)
        }).then(res => {
            // console.log('putGoodsPicEdit', imgList)
            this.props.toggleImgEditDialog(true, imgList, this.props.product_id);
            this.props.updateGoodsListImg(imgList, this.props.product_id);
            message.success('图片编辑成功！');
        }).catch(err => {
            message.success('图片编辑失败！');
        })
    };

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
        return false;
    };

    // UploadChangeParam
    private uploadImg = (info: any) => {
        const { loading } = this.state;
        const { imgList, product_id } = this.props;
        if (!loading) {
            this.setState(
                {
                    loading: true,
                },
                () => {
                    // console.log('uploadImg', info);
                    const formData = new FormData();
                    const file = info.file;
                    formData.append('file', file);
                    // 获取图片的原始宽高
                    const _URL = window.URL || window.webkitURL;
                    const img = new Image();
                    img.onload = () => {
                        // console.log(img.width, img.height, product_id);
                        formData.append('width', img.width + '');
                        formData.append('height', img.height + '');
                        formData.append('position', imgList.length + '');
                        formData.append('product_id', product_id);
                        formData.append('alt', product_id);
                        postGoodsPicUpload(formData)
                            .then(res => {
                                // console.log('postGoodsPicUpload', res);
                                message.success('图片上传成功');
                                this.setState({
                                    loading: false,
                                });
                                this.props.toggleImgEditDialog(
                                    true,
                                    [...imgList, imgDomain + res.data.url],
                                    product_id,
                                );
                                this.props.updateGoodsListImg(
                                    [...imgList, imgDomain + res.data.url],
                                    product_id,
                                );
                            })
                            .catch(err => {
                                // console.log('postGoodsPicUpload', err);
                                message.error('图片上传失败！');
                                this.setState({
                                    loading: false,
                                });
                            });
                    };
                    img.src = _URL.createObjectURL(file);
                },
            );
        }
    };

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
                                src={imgList[0]}
                                onDragOver={this.dragover}
                                onDrop={() => this.drop(imgList[0])}
                            />
                        </div>
                    </div>
                    <div className="secondary">
                        <p>副图</p>
                        <div className="list">
                            {imgList.slice(1).map(item => {
                                return (
                                    <div key={item} className="img-box item">
                                        <img
                                            src={item}
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
                                );
                            })}
                            <Upload
                                className="item"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                onChange={this.uploadImg}
                            >
                                <div className="add">
                                    <div className="inner">
                                        <Icon
                                            className="add-icon"
                                            type={loading ? 'loading' : 'plus'}
                                        />
                                    </div>
                                    <div className="desc">图片为低于100k的jpg格式</div>
                                </div>
                            </Upload>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ImgEditDialog;
