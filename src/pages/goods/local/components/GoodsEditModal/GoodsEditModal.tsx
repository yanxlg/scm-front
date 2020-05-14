import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Modal, Form, Input, Row, Col, Select, Upload, Button } from 'antd';
import { getCatagoryList } from '@/services/goods';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { EmptyObject } from '@/config/global';
import { IGoodsEditItem } from '@/interface/ILocalGoods';
import { Icons } from '@/components/Icon';
import { LoadingButton } from 'react-components';

import styles from './_GoodsEditModal.less';

const { TextArea } = Input;
const { Option } = Select;

enum ICatagoryType {
    First = 0,
    Second,
    Third,
}

interface IProps {
    visible: boolean;
    currentGoodsInfo: IGoodsEditItem | null;
    onCancel(): void;
}

const GoodsEditModal: React.FC<IProps> = ({ visible, currentGoodsInfo, onCancel }) => {
    const [form] = Form.useForm();
    const [allCatagoryList, setAllCatagoryList] = useState<IOptionItem[]>([]);
    const [imgList, setImgList] = useState<string[]>([]);
    const [catagoryIds, setCatagoryIds] = useState(['', '', '']);
    // 记录拖拽开始
    const dragStartRef = useRef({ index: 0, item: '' });

    const handleOk = useCallback(() => {
        console.log(form.getFieldsValue());
    }, []);

    const handleCancel = useCallback(() => {
        onCancel();
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
        if (currentGoodsInfo) {
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
        }
    }, [currentGoodsInfo]);

    return useMemo(() => {
        if (!currentGoodsInfo) {
            return null;
        }
        const { product_id } = currentGoodsInfo;

        return (
            <Modal
                title="商品编辑"
                cancelText="重置"
                okText="保存"
                visible={visible}
                width={950}
                // confirmLoading={confirmLoading}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
                // cancelButtonProps={{
                //     onClick: resetGoodsData,
                // }}
                bodyStyle={{
                    maxHeight: 600,
                    overflow: 'auto',
                }}
            >
                <Form form={form} className={styles.modalContent}>
                    <div className={styles.item}>
                        <div className={styles.label}>Product ID</div>
                        <div>{product_id}</div>
                    </div>
                    <Form.Item label="商品标题" name="title">
                        <TextArea autoSize className={styles.textarea} />
                    </Form.Item>
                    <Form.Item label="商品描述" name="description">
                        <TextArea autoSize className={styles.textarea} />
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
                            // beforeUpload={this.beforeUpload}
                            className={styles.upload}
                        >
                            {/* loading={uploading} */}
                            <Button icon={<Icons type="scm-upload" />}>批量上传</Button>
                        </Upload>
                        <LoadingButton
                            icon={<Icons type="scm-download" />}
                            // onClick={this.exportAllImages}
                        >
                            下载图片
                        </LoadingButton>
                        <div className={styles.uploadDesc}>*仅支持ZIP文件</div>
                    </div>
                </Form>
            </Modal>
        );
    }, [visible, allCatagoryList, imgList, secondCatagoryList, thirdCatagoryList]);
};

export default GoodsEditModal;
