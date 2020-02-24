import React, { ChangeEvent } from 'react';
import { Modal, Input, Select, Upload, message, Popconfirm } from 'antd';
import { RcFile } from 'antd/lib/upload';
import {
    CloseOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons';

// import { UploadChangeParam } from 'antd/lib/upload';

import { postGoodsPicUpload } from '@/services/goods';
import { ICategoryItem, IRowDataItem } from '../index'; 
import { putGoodsEdit, IGoodsEditImgItem, IGoodsEditData  } from '@/services/goods';

const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

declare interface IPageData {
    page?: number;
    page_count?: number;
}

declare interface ImgEditDialogProps {
    visible: boolean;
    allCatagoryList: ICategoryItem[];
    currentEditGoods: IRowDataItem | null;
    originEditGoods: IRowDataItem | null;
    onSearch(params?: IPageData, isRefresh?: boolean): void;
    toggleEditGoodsDialog(status: boolean): void;
    getCurrentCatagory(firstId: string, secondId?: string): ICategoryItem[];
    changeGoodsText(type: string, text: string): void;
    changeGoodsCatagory(type: string, id: string): void;
    changeGoodsImg(imgList: string[]): void;
    resetGoodsData(): void;
}

declare interface IAddImgItem extends IGoodsEditImgItem {
    fileUrl: string;
}

declare interface ImgEditDialogState {
    loading: boolean;
    addImgList: IAddImgItem[];
}

class ImgEditDialog extends React.PureComponent<ImgEditDialogProps, ImgEditDialogState> {
    private startItem: any;

    constructor(props: ImgEditDialogProps) {
        super(props);
        this.state = {
            loading: false,
            addImgList: []
        };
    }

    private handleOk = () => {
        const { toggleEditGoodsDialog, onSearch } = this.props;
        if (this.isChangeData()) {
            const data = this.getGoodsEditData();
            if (data && !data.title) {
                return message.error('标题不能为空');
            }
            if (data && !data.description) {
                return message.error('描述不能为空');
            }
            putGoodsEdit(data as IGoodsEditData).then(res => {
                // console.log('putGoodsEdit', res);
                toggleEditGoodsDialog(false);
                // 刷新页面
                onSearch({}, true);
                this.setState({
                    addImgList: []
                })
            });
        } else {
            message.info('没有任何更改');
        }

    }

    private handleCancel = () => {
        const { toggleEditGoodsDialog } = this.props;
        if (this.isChangeData()) {
            confirm({
                // title: 'Do you Want to delete these items?',
                content: '商品内容有更新，确认修改吗？',
                onOk: this.handleOk,
                onCancel() {
                    toggleEditGoodsDialog(false);
                },
              })
        } else {
            toggleEditGoodsDialog(false);
        }
    }

    // 判断数据是否改变
    private isChangeData = () => {
        const { currentEditGoods, originEditGoods } = this.props;
        if (currentEditGoods && originEditGoods) {
            const {
                title,
                description,
                sku_image,
                first_catagory,
                second_catagory,
                third_catagory
            } = currentEditGoods;
            const {
                title: orginTitle,
                description: orginDescription,
                sku_image: orginSkuImage,
                first_catagory: originFirstCatagory,
                second_catagory: originSecondCatagory,
                third_catagory: originThirdCatagory
            } = originEditGoods;
            if (title !== orginTitle) {
                return true;
            } else if (description !== orginDescription) {
                return true;
            } else if (first_catagory.id != originFirstCatagory.id) {
                return true;
            } else if (second_catagory.id != originSecondCatagory.id) {
                return true;
            } else if (third_catagory.id != originThirdCatagory.id) {
                return true;
            } else if (sku_image.length !== orginSkuImage.length) {
                return true;
            } else {
                for (let i = 0; i < sku_image.length; i++) {
                    if (sku_image[i] !== orginSkuImage[i]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // 获取商品编辑数据
    private getGoodsEditData = () => {
        const { currentEditGoods, originEditGoods } = this.props;
        const { addImgList } = this.state;
        if (currentEditGoods && originEditGoods) {
            const {
                product_id,
                title,
                description,
                sku_image,
                first_catagory,
                second_catagory,
                third_catagory
            } = currentEditGoods;
            const {
                sku_image: orginSkuImage
            } = originEditGoods;
            return {
                product_id,
                title,
                description,
                cat_id: Number(third_catagory.id || second_catagory.id || first_catagory.id),
                imgs: sku_image.map((item, index) => {
                    if (orginSkuImage.indexOf(item) > -1) {
                        return {
                            type: 'old',
                            url: item,
                            position: index + 1
                        }
                    } else {
                        const i = addImgList.findIndex(addItem => addItem.fileUrl === item);
                        const {
                            url,
                            type,
                            alt,
                            width,
                            height
                        } = addImgList[i];
                        return {
                            type,
                            url,
                            position: index + 1,
                            alt,
                            width,
                            height
                        }
                    }
                })
            };
        }
    }

    private dragstart = (item: string) => {
        // console.log('dragstart', item);
        this.startItem = item;
    };

    private dragover = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    };

    private drop = (item: string) => {
        const { currentEditGoods, changeGoodsImg } = this.props;
        if (currentEditGoods) {
            const { sku_image } = currentEditGoods;
            const startIndex = sku_image.findIndex(currentItem => currentItem === this.startItem);
            const endIndex = sku_image.findIndex(str => str === item);
            const copyImgList = [...sku_image];
            // 元素互换位置
            if (startIndex !== endIndex) {
                copyImgList[startIndex] = item;
                copyImgList[endIndex] = this.startItem;
                changeGoodsImg(copyImgList);
            }
        }
    };

    private confirmDelete = (item: string) => {
        const { currentEditGoods, changeGoodsImg } = this.props;
        if (currentEditGoods) {
            const { sku_image } = currentEditGoods;
            const index = sku_image.findIndex(currentItem => currentItem === item);
            const copyImgList = [...sku_image];
            copyImgList.splice(index, 1);
            changeGoodsImg(copyImgList);
        }
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
        const { loading, addImgList } = this.state;
        const { currentEditGoods, changeGoodsImg } = this.props;
        if (!loading && currentEditGoods) {
            const { sku_image, product_id } = currentEditGoods;
            this.setState(
                {
                    loading: true,
                },
                () => {
                    const formData = new FormData();
                    const file = info.file;
                    formData.append('file', file);
                    // 获取图片的原始宽高
                    const _URL = window.URL || window.webkitURL;
                    const img = new Image();
                    const fileUrl = _URL.createObjectURL(file);
                    img.onload = () => {
                        postGoodsPicUpload(formData)
                            .then(res => {
                                message.success('图片上传成功');
                                this.setState({
                                    loading: false,
                                    addImgList: [
                                        ...addImgList,
                                        {
                                            fileUrl,
                                            url: res.data.url,
                                            type: 'new',
                                            alt: product_id,
                                            width: img.width,
                                            height: img.height
                                        }
                                    ]
                                });
                                changeGoodsImg([
                                    ...sku_image,
                                    fileUrl
                                ]);
                                // console.log('postGoodsPicUpload', res);
                            })
                            .catch(err => {
                                // console.log('postGoodsPicUpload', err);
                                message.error('图片上传失败！');
                                this.setState({
                                    loading: false,
                                });
                            });
                    };
                    img.src = fileUrl;
                },
            );
        }
        
    };

    render() {
        const { 
            visible,
            allCatagoryList,
            currentEditGoods,
            getCurrentCatagory,
            changeGoodsText,
            changeGoodsCatagory,
            resetGoodsData
        } = this.props;
        const { loading } = this.state;
        if (!currentEditGoods) {
            return null;
        }
        const {
            product_id,
            title,
            description,
            first_catagory,
            second_catagory,
            third_catagory,
            sku_image
        } = currentEditGoods;

        let secondCatagoryList: ICategoryItem[] = [];
        let thirdCatagoryList: ICategoryItem[] = [];
        if (first_catagory.id) {
            secondCatagoryList = getCurrentCatagory(first_catagory.id);
        }
        if (first_catagory.id && third_catagory.id) {
            thirdCatagoryList = getCurrentCatagory(first_catagory.id,second_catagory.id);
        }
        return (
            <Modal
                title="商品编辑"
                cancelText="重置"
                okText="保存"
                visible={visible}
                width={950}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                // footer={}
                cancelButtonProps={{
                    onClick: resetGoodsData
                }}
            >
                <div className="goods-local-edit-item">
                    <div className="label">Product ID</div>
                    <div>{product_id}</div>
                </div>
                <div className="goods-local-edit-item">
                    <div className="label">商品标题</div>
                    <TextArea
                        className="textarea"
                        autoSize={true}
                        value={title}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {changeGoodsText('title', e.target.value)}}
                    />
                </div>
                <div className="goods-local-edit-item">
                    <div className="label">商品描述</div>
                    <TextArea
                        className="textarea"
                        autoSize={true}
                        value={description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {changeGoodsText('description', e.target.value)}}
                    />
                </div>
                <div className="goods-local-edit-item">
                    <div className="label">一级类目</div>
                    <Select
                        className="select"
                        value={first_catagory.id}
                        onChange={(val: string) => changeGoodsCatagory('first_catagory', val)}
                    >
                        {allCatagoryList.map(item => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                    <div className="label">二级类目</div>
                    <Select
                        className="select"
                        value={second_catagory.id || ''}
                        onChange={(val: string) => changeGoodsCatagory('second_catagory', val)}
                    >
                        <Option value="">请选择</Option>
                        {secondCatagoryList.map(item => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                    <div className="label">三级类目</div>
                    <Select
                        className="select"
                        value={third_catagory.id || ''}
                        onChange={(val: string) => changeGoodsCatagory('third_catagory', val)}
                    >
                        <Option value="">请选择</Option>
                        {thirdCatagoryList.map(item => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="goods-local-edit-item">
                    <div className="label">图片编辑</div>
                </div>
                <div className="goods-local-edit-img">
                    <div className="first">
                        <p>主图</p>
                        <div className="img-box">
                            <img
                                src={sku_image[0]}
                                onDragStart={() => this.dragstart(sku_image[0])}
                                onDragOver={this.dragover}
                                onDrop={() => this.drop(sku_image[0])}
                            />
                        </div>
                    </div>
                    <div className="secondary">
                        <p>副图</p>
                        <div className="list">
                            {sku_image.slice(1).map(item => {
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
                                            <CloseOutlined className="close"/>
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
                                        { loading ? <LoadingOutlined className="add-icon"/> : <PlusOutlined className="add-icon"/> }
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
