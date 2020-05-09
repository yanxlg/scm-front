import React, { ChangeEvent } from 'react';
import { Modal, Input, Select, Upload, message, Popconfirm, Row, Col, Button } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { CloseOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

// import { UploadChangeParam } from 'antd/lib/upload';

import { exportAllSkuImages, postGoodsPicUpload, uploadGoodsPic } from '@/services/goods';
import { putGoodsEdit, IGoodsEditImgItem, IGoodsEditData } from '@/services/goods';
import { ICatagoryItem, IGoodsEditItem } from '@/interface/ILocalGoods';
import formStyles from 'react-components/es/JsonForm/_form.less';

import './ImgEditDialog.less';
import { Icons } from '@/components/Icon';
import { history } from '@@/core/history';
import { LoadingButton } from 'react-components';
import classNames from 'classnames';

const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

declare interface IPageData {
    page?: number;
    page_count?: number;
}

declare interface ImgEditDialogProps {
    visible: boolean;
    allCatagoryList: ICatagoryItem[];
    currentEditGoods: IGoodsEditItem | null;
    originEditGoods: IGoodsEditItem | null;
    onSearch(params?: IPageData, isRefresh?: boolean): void;
    toggleEditGoodsDialog(status: boolean): void;
    getCurrentCatagory(firstId: string, secondId?: string): ICatagoryItem[];
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
    confirmLoading: boolean;
    addImgList: IAddImgItem[];
    uploading: boolean;
}

class ImgEditDialog extends React.PureComponent<ImgEditDialogProps, ImgEditDialogState> {
    private startItem: any;
    private zipId?: string;

    constructor(props: ImgEditDialogProps) {
        super(props);
        this.state = {
            loading: false,
            confirmLoading: false,
            addImgList: [],
            uploading: false,
        };
    }

    private handleOk = () => {
        const { toggleEditGoodsDialog, onSearch } = this.props;
        if (this.isChangeData() || this.zipId) {
            const data = this.getGoodsEditData();
            if (data && !data.title) {
                return message.error('标题不能为空');
            }
            if (data && !data.description) {
                return message.error('描述不能为空');
            }
            this.setState({
                confirmLoading: true,
            });
            putGoodsEdit({
                ...data,
                has_zip: this.zipId ? 1 : 2,
                zip_id: this.zipId,
            } as IGoodsEditData)
                .then(res => {
                    // console.log('putGoodsEdit', res);
                    toggleEditGoodsDialog(false);
                    // 刷新页面
                    onSearch({}, true);
                    this.setState({
                        addImgList: [],
                    });
                })
                .finally(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                });
        } else {
            message.info('没有任何更改');
        }
    };

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
            });
        } else {
            toggleEditGoodsDialog(false);
        }
    };

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
                third_catagory,
            } = currentEditGoods;
            const {
                title: orginTitle,
                description: orginDescription,
                sku_image: orginSkuImage,
                first_catagory: originFirstCatagory,
                second_catagory: originSecondCatagory,
                third_catagory: originThirdCatagory,
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
    };

    // 判断图片是否编辑
    private isChangeImg = () => {
        const { currentEditGoods, originEditGoods } = this.props;
        if (currentEditGoods && originEditGoods) {
            const { sku_image } = currentEditGoods;
            const { sku_image: orginSkuImage } = originEditGoods;
            if (sku_image.length !== orginSkuImage.length) {
                return true;
            } else {
                for (let i = 0; i < sku_image.length; i++) {
                    if (sku_image[i] !== orginSkuImage[i]) {
                        return true;
                    }
                }
            }
            return false;
        }
    };

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
                third_catagory,
            } = currentEditGoods;
            const { sku_image: orginSkuImage } = originEditGoods;
            return Object.assign(
                {
                    product_id,
                    title,
                    description,
                    cat_id: Number(third_catagory.id || second_catagory.id || first_catagory.id),
                },
                this.isChangeImg()
                    ? {
                          imgs: sku_image.map((item, index) => {
                              let ret: any = {};
                              if (orginSkuImage.indexOf(item) > -1) {
                                  ret = {
                                      type: 'old',
                                      url: item,
                                      position: index + 1,
                                  };
                              } else {
                                  const i = addImgList.findIndex(
                                      addItem => addItem.fileUrl === item,
                                  );
                                  const { url, type, alt, width, height } = addImgList[i];
                                  ret = {
                                      type,
                                      url,
                                      position: index + 1,
                                      alt,
                                      width,
                                      height,
                                  };
                              }
                              ret.is_default = index === 0 ? 1 : 0;
                              return ret;
                          }),
                      }
                    : {},
            );
        }
    };

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
    private beforeUpload = (file: RcFile) => {
        if (file) {
            this.setState({
                uploading: true,
            });
            const formData = new FormData();
            const { currentEditGoods } = this.props;
            const { product_id } = currentEditGoods!;
            formData.append('file', file);
            uploadGoodsPic(formData, product_id)
                .then(({ data }) => {
                    this.zipId = data;
                    message.success('上传成功，服务端处理中，请稍后刷新!');
                })
                .catch(e => {
                    message.error('上传失败，请重试!');
                })
                .finally(() => {
                    this.setState({
                        uploading: false,
                    });
                });
        }
        return false;
    };

    private exportAllImages = () => {
        const { currentEditGoods } = this.props;
        const { product_id } = currentEditGoods!;
        return exportAllSkuImages(product_id).then(() => {
            // jump
            history.push('/setting/export');
        });
    };

    componentDidUpdate(
        prevProps: Readonly<ImgEditDialogProps>,
        prevState: Readonly<ImgEditDialogState>,
        snapshot?: any,
    ): void {
        if (!this.props.visible) {
            this.zipId = undefined; // 清空
        }
    }

    render() {
        const {
            visible,
            allCatagoryList,
            currentEditGoods,
            getCurrentCatagory,
            changeGoodsText,
            changeGoodsCatagory,
            resetGoodsData,
        } = this.props;
        const { loading, confirmLoading, uploading } = this.state;
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
            goods_img,
            sku_image,
            // _sku_img_list
        } = currentEditGoods;

        let secondCatagoryList: ICatagoryItem[] = [];
        let thirdCatagoryList: ICatagoryItem[] = [];
        if (first_catagory.id) {
            secondCatagoryList = getCurrentCatagory(first_catagory.id);
        }
        if (first_catagory.id && second_catagory.id) {
            thirdCatagoryList = getCurrentCatagory(first_catagory.id, second_catagory.id);
        }

        return (
            <Modal
                title="商品编辑"
                cancelText="重置"
                okText="保存"
                visible={visible}
                width={950}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                cancelButtonProps={{
                    onClick: resetGoodsData,
                }}
                bodyStyle={{
                    maxHeight: 600,
                    overflow: 'auto',
                }}
            >
                <div className="goods-edit-item">
                    <div className="label">Product ID</div>
                    <div>{product_id}</div>
                </div>
                <div className="goods-edit-item goods-edit-item-top">
                    <div className="label">商品标题：</div>
                    <TextArea
                        className="textarea"
                        autoSize={true}
                        value={title}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            changeGoodsText('title', e.target.value);
                        }}
                    />
                </div>
                <div className="goods-edit-item goods-edit-item-top">
                    <div className="label">商品描述：</div>
                    <TextArea
                        className="textarea"
                        autoSize={true}
                        value={description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            changeGoodsText('description', e.target.value);
                        }}
                    />
                </div>
                <div className="goods-edit-item goods-edit-item-center">
                    <div className="label">一级类目：</div>
                    <Select
                        className="select"
                        value={first_catagory.id}
                        onChange={(val: string) => changeGoodsCatagory('first_catagory', val)}
                    >
                        {allCatagoryList.map(item => (
                            <Option key={item.id} value={item.id as string}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                    <div className="label">二级类目：</div>
                    <Select
                        className="select"
                        value={second_catagory.id || ''}
                        onChange={(val: string) => changeGoodsCatagory('second_catagory', val)}
                    >
                        <Option value="">请选择</Option>
                        {secondCatagoryList.map(item => (
                            <Option key={item.id} value={item.id as string}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                    <div className="label">三级类目：</div>
                    <Select
                        className="select"
                        value={third_catagory.id || ''}
                        onChange={(val: string) => changeGoodsCatagory('third_catagory', val)}
                    >
                        <Option value="">请选择</Option>
                        {thirdCatagoryList.map(item => (
                            <Option key={item.id} value={item.id as string}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className={'goods-edit-item goods-edit-item-top'}>
                    <div className="label">商品图片：</div>
                    <div className={formStyles.flex1}>
                        <div className="goods-edit-img">
                            <div className="secondary">
                                <div className="list">
                                    {sku_image.map((item, index) => {
                                        return (
                                            <div key={item} className="img-box item">
                                                <img
                                                    src={item}
                                                    onDragStart={() => this.dragstart(item)}
                                                    onDragOver={this.dragover}
                                                    onDrop={() => this.drop(item)}
                                                />
                                                {index === 0 ? (
                                                    <div className="goods-edit-img-label">主图</div>
                                                ) : null}
                                                {/* {
                                            goods_img !== item ? (
                                                <Popconfirm
                                                    title="确定删除吗?"
                                                    onConfirm={() => this.confirmDelete(item)}
                                                    okText="是"
                                                    cancelText="否"
                                                >
                                                    <CloseOutlined className="close"/>
                                                </Popconfirm>
                                            ) : null
                                        } */}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="goods-edit-img-btns">
                    <Upload
                        accept="*.zip,application/zip"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        className={classNames(formStyles.inlineBlock, 'goods-edit-img-btn')}
                    >
                        <Button loading={uploading} icon={<Icons type="scm-upload" />}>
                            批量上传
                        </Button>
                    </Upload>
                    <LoadingButton
                        icon={<Icons type="scm-download" />}
                        className="goods-edit-img-btn"
                        onClick={this.exportAllImages}
                    >
                        下载图片
                    </LoadingButton>
                </div>
                <div className="goods-edit-img-desc">*仅支持ZIP文件</div>
            </Modal>
        );
    }
}

export default ImgEditDialog;
