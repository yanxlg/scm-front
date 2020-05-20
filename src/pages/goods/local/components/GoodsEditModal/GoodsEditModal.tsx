import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Modal, Form, Input, Row, Col, Select, Upload, Button, message, Spin } from 'antd';
import {
    getCatagoryList,
    exportAllSkuImages,
    uploadGoodsPic,
    putGoodsEdit,
    IGoodsEditData,
    getGoodsDetail,
} from '@/services/goods';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { EmptyObject } from '@/config/global';
import { IGoodsEditItem } from '@/interface/ILocalGoods';
import { Icons } from '@/components/Icon';
import { LoadingButton } from 'react-components';
import { history } from 'umi';
import { RcFile } from 'antd/es/upload/interface';

import styles from './_GoodsEditModal.less';

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

enum ICatagoryType {
    First = 0,
    Second,
    Third,
}

interface IProps {
    visible: boolean;
    productId: string;
    // currentGoodsInfo: IGoodsEditItem | null;
    onCancel(): void;
    onReload(): Promise<void>;
}

const GoodsEditModal: React.FC<IProps> = ({ visible, productId, onCancel, onReload }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [allCatagoryList, setAllCatagoryList] = useState<IOptionItem[]>([]);
    const [imgList, setImgList] = useState<string[]>([]);
    const [catagoryIds, setCatagoryIds] = useState(['', '', '']);
    const [currentGoodsInfo, setCurrentGoodsInfo] = useState<IGoodsEditItem | null>(null);
    const zipIdRef = useRef<number | null>(null);
    // 记录拖拽开始
    const dragStartRef = useRef({ index: 0, item: '' });

    // 获取详情数据
    const _getGoodsDetail = useCallback(productId => {
        setLoading(true);
        getGoodsDetail(productId)
            .then(res => {
                const {
                    product_id,
                    title,
                    description,
                    first_catagory,
                    second_catagory,
                    third_catagory,
                    goods_img,
                    sku_image,
                } = res?.data;
                //
                const list = [...sku_image];
                const index = list.findIndex(img => img === goods_img);
                if (index > -1) {
                    list.splice(index, 1);
                    list.unshift(goods_img);
                }
                const info = {
                    product_id,
                    title,
                    description,
                    first_catagory,
                    second_catagory,
                    third_catagory,
                    goods_img,
                    sku_image: list,
                };
                setCurrentGoodsInfo(info);
                resetGoodsData(info);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // 判断图片是否调整顺序
    const hasChangeImg = useCallback(() => {
        const { sku_image: oldImgList } = currentGoodsInfo!;
        for (let i = 0; i < imgList.length; i++) {
            if (imgList[i] !== oldImgList[i]) {
                return true;
            }
        }
        return false;
    }, [imgList, currentGoodsInfo]);

    // 判断商品数据是否改变
    const hasChangeGoodsInfo = useCallback(
        (formData, currentGoodsInfo) => {
            const {
                title,
                description,
                first_catagory,
                second_catagory,
                third_catagory,
            } = formData;
            const {
                title: oldTitle,
                description: oldDescription,
                first_catagory: oldFirstCatagory,
                second_catagory: oldSecondCatagory,
                third_catagory: oldThirdCatagory,
            } = currentGoodsInfo;
            if (title !== oldTitle) {
                return true;
            } else if (description !== oldDescription) {
                return true;
            } else if (first_catagory != oldFirstCatagory?.id) {
                return true;
            } else if (second_catagory != oldSecondCatagory?.id) {
                return true;
            } else if (third_catagory != oldThirdCatagory?.id) {
                return true;
            } else if (hasChangeImg()) {
                return true;
            } else if (zipIdRef.current) {
                return true;
            }
            return false;
        },
        [hasChangeImg],
    );

    // 获取商品编辑数据
    const getGoodsEditData = useCallback(
        (formData, currentGoodsInfo) => {
            const {
                title,
                description,
                first_catagory,
                second_catagory,
                third_catagory,
            } = formData;
            const { product_id } = currentGoodsInfo;
            return Object.assign(
                {
                    product_id,
                    title,
                    description,
                    cat_id: Number(third_catagory || second_catagory || first_catagory),
                    has_zip: zipIdRef.current ? 1 : 2,
                    zip_id: zipIdRef.current,
                },
                hasChangeImg()
                    ? {
                          imgs: imgList.map((item, index) => {
                              let ret: any = {
                                  type: 'old',
                                  url: item,
                                  position: index + 1,
                              };
                              ret.is_default = index === 0 ? 1 : 0;
                              return ret;
                          }),
                      }
                    : {},
            );
        },
        [imgList],
    );

    const hideModal = useCallback(() => {
        setUploading(false);
        setConfirmLoading(false);
        setImgList([]);
        setCatagoryIds(['', '', '']);
        zipIdRef.current = null;
        dragStartRef.current = { index: 0, item: '' };
        onCancel();
    }, []);

    const handleOk = useCallback(() => {
        // console.log(form.getFieldsValue(), currentGoodsInfo);
        const formData = form.getFieldsValue();
        const { title, description } = formData;
        if (!title) {
            return message.error('标题不能为空');
        }
        if (!description) {
            return message.error('描述不能为空');
        }
        if (hasChangeGoodsInfo(formData, currentGoodsInfo)) {
            // getGoodsEditData
            const data = getGoodsEditData(formData, currentGoodsInfo);
            setConfirmLoading(true);
            putGoodsEdit(data as IGoodsEditData)
                .then(res => {
                    // 关闭弹框
                    hideModal();
                    onReload();
                })
                .finally(() => {
                    setConfirmLoading(false);
                });
        }
    }, [currentGoodsInfo, hasChangeGoodsInfo, getGoodsEditData]);

    const handleCancel = useCallback(() => {
        // onCancel();
        if (hasChangeGoodsInfo(form.getFieldsValue(), currentGoodsInfo)) {
            confirm({
                content: '商品内容有更新，确认修改吗？',
                onOk: handleOk,
                onCancel() {
                    hideModal();
                },
            });
        } else {
            hideModal();
        }
    }, [currentGoodsInfo, handleOk]);

    const resetGoodsData = useCallback(currentGoodsInfo => {
        const {
            title,
            description,
            first_catagory,
            second_catagory,
            third_catagory,
            sku_image,
        } = currentGoodsInfo;
        const firstId = first_catagory?.id || '';
        const secondId = second_catagory?.id || '';
        const thirdId = third_catagory?.id || '';
        form.setFieldsValue({
            title,
            description,
            first_catagory: firstId,
            second_catagory: secondId,
            third_catagory: thirdId,
        });
        setImgList([...sku_image]);
        setCatagoryIds([firstId, secondId, thirdId]);
        zipIdRef.current = null;
    }, []);

    const handleChangeCatagory = useCallback((type: number, value: string) => {
        if (type === ICatagoryType.First) {
            form.setFieldsValue({
                second_catagory: '',
                third_catagory: '',
            });
        } else if (type === ICatagoryType.Second) {
            form.setFieldsValue({
                third_catagory: '',
            });
        }
        setCatagoryIds(ids => {
            const list = [...ids];
            list[type] = value;
            return list;
        });
    }, []);

    const handleDragstart = useCallback((index, item) => {
        // console.log('dragstart', index);
        dragStartRef.current = {
            index,
            item,
        };
    }, []);

    const handleDragover = useCallback(e => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback(
        (index, item) => {
            const list = [...imgList];
            const { index: startIndex, item: startItem } = dragStartRef.current;
            // 元素互换位置
            if (startIndex !== index) {
                list[startIndex] = item;
                list[index] = startItem;
                setImgList(list);
            }
        },
        [imgList],
    );

    const beforeUpload = useCallback(
        (file: RcFile) => {
            if (file) {
                const overSize = file.size / 1024 / 1024 >= 20; // 限制20M
                if (overSize) {
                    message.error('不支持上传20M以上的文件！');
                    return false;
                }
                setUploading(true);
                const formData = new FormData();
                const { product_id } = currentGoodsInfo!;
                formData.append('file', file);
                uploadGoodsPic(formData, product_id)
                    .then(({ data }) => {
                        zipIdRef.current = data;
                        message.success('上传成功，服务端处理中，请稍后刷新!');
                    })
                    .catch(e => {
                        message.error('上传失败，请重试!');
                    })
                    .finally(() => {
                        setUploading(false);
                    });
            }
            return false;
        },
        [currentGoodsInfo],
    );

    const exportAllImages = useCallback(() => {
        const { product_id } = currentGoodsInfo!;
        return exportAllSkuImages(product_id).then(() => {
            // jump
            history.push('/setting/export');
        });
    }, [currentGoodsInfo]);

    const secondCatagoryList = useMemo<IOptionItem[]>(() => {
        const firstId = catagoryIds[0];
        if (!firstId) {
            return [];
        }
        const firstIndex = allCatagoryList.findIndex(item => item.value === firstId);
        // console.log(111111, firstIndex, allCatagoryList, catagoryIds);
        return allCatagoryList[firstIndex]?.children || [];
        // ret = ( as ICatagoryItem[]) || [];
    }, [allCatagoryList, catagoryIds]);

    const thirdCatagoryList = useMemo<IOptionItem[]>(() => {
        const secondId = catagoryIds[1];
        if (!secondId) {
            return [];
        }
        const secondIndex = secondCatagoryList.findIndex(
            (item: IOptionItem) => item.value === secondId,
        );
        return secondCatagoryList[secondIndex]?.children || [];
    }, [secondCatagoryList, catagoryIds]);

    useEffect(() => {
        getCatagoryList().then(({ convertList = [] } = EmptyObject) => {
            setAllCatagoryList(convertList);
        });
    }, []);

    useEffect(() => {
        if (visible) {
            _getGoodsDetail(productId);
        }
    }, [visible, productId]);

    return useMemo(() => {
        return (
            <Modal
                title="商品编辑"
                cancelText="重置"
                okText="保存"
                visible={visible}
                width={950}
                confirmLoading={confirmLoading}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
                cancelButtonProps={{
                    disabled: currentGoodsInfo ? false : true,
                    onClick: () => resetGoodsData(currentGoodsInfo),
                }}
                bodyStyle={{
                    maxHeight: 600,
                    overflow: 'auto',
                }}
            >
                <Spin spinning={loading}>
                    <Form form={form} className={styles.modalContent}>
                        <div className={styles.item}>
                            <div className={styles.label}>Product ID</div>
                            <div>{currentGoodsInfo?.product_id}</div>
                        </div>
                        <Form.Item
                            label="商品标题"
                            name="title"
                            rules={[{ required: true, message: '不能为空!' }]}
                        >
                            <TextArea autoSize />
                        </Form.Item>
                        <Form.Item
                            label="商品描述"
                            name="description"
                            rules={[{ required: true, message: '不能为空!' }]}
                        >
                            <TextArea autoSize />
                        </Form.Item>
                        <Row gutter={32}>
                            <Col span={8}>
                                <Form.Item label="一级类目" name="first_catagory">
                                    <Select
                                        onChange={(val: string) =>
                                            handleChangeCatagory(ICatagoryType.First, val)
                                        }
                                    >
                                        {allCatagoryList.map(item => (
                                            <Option key={item.value} value={item.value}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="二级类目" name="second_catagory">
                                    <Select
                                        onChange={(val: string) =>
                                            handleChangeCatagory(ICatagoryType.Second, val)
                                        }
                                    >
                                        <Option value="">请选择</Option>
                                        {secondCatagoryList.map(item => (
                                            <Option key={item.value} value={item.value}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="三级类目" name="third_catagory">
                                    <Select
                                        onChange={(val: string) =>
                                            handleChangeCatagory(ICatagoryType.Third, val)
                                        }
                                    >
                                        <Option value="">请选择</Option>
                                        {thirdCatagoryList.map(item => (
                                            <Option key={item.value} value={item.value}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className={styles.flex}>
                            <div className={styles.label}>商品图片</div>
                            <div className={styles.list}>
                                {imgList.map((item, index) => {
                                    return (
                                        <div key={item} className={styles.imgItem}>
                                            <img
                                                src={item}
                                                className={styles.img}
                                                onDragStart={() => handleDragstart(index, item)}
                                                onDragOver={handleDragover}
                                                onDrop={() => handleDrop(index, item)}
                                            />
                                            {index === 0 ? (
                                                <div className={styles.imgLabel}>主图</div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className={styles.btns}>
                            <Upload
                                accept="*.zip,application/zip"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                className={styles.upload}
                            >
                                <Button loading={uploading} icon={<Icons type="scm-upload" />}>
                                    批量上传
                                </Button>
                            </Upload>
                            <LoadingButton
                                icon={<Icons type="scm-download" />}
                                onClick={exportAllImages}
                            >
                                下载图片
                            </LoadingButton>
                            <div className={styles.uploadDesc}>*仅支持ZIP文件</div>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        );
    }, [
        visible,
        loading,
        currentGoodsInfo,
        allCatagoryList,
        imgList,
        secondCatagoryList,
        thirdCatagoryList,
        uploading,
        confirmLoading,
    ]);
};

export default GoodsEditModal;
