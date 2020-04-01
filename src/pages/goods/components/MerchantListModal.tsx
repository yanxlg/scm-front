import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Form, Modal, Divider, Spin } from 'antd';
import { IShopItem } from '@/interface/IChannel';
import { queryShopList } from '@/services/channel';
import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/styles/_merchant.less';
import style from '@/styles/_index.less';

declare interface MerchantListModalProps {
    visible: boolean;
    onOKey: (merchant_ids: string[]) => Promise<any>;
    onCancel: () => void;
}

const MerchantListModal: React.FC<MerchantListModalProps> = ({ visible, onCancel, onOKey }) => {
    const [list, setList] = useState<IShopItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            setLoading(true);
            queryShopList()
                .then(({ data = [] }) => {
                    setList(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [visible]);

    const dataSource = useMemo(() => {
        let dataSet: { [key: string]: IShopItem[] } = {};
        list.forEach(({ merchant_id, merchant_name, merchant_platform }) => {
            const _list = dataSet[merchant_platform] || [];
            _list.push({ merchant_platform, merchant_name, merchant_id });
            dataSet[merchant_platform] = _list;
        });
        return dataSet;
    }, [list]);

    const child = useMemo(() => {
        let platformArr = [];
        for (let merchant_platform in dataSource) {
            if (dataSource.hasOwnProperty(merchant_platform)) {
                const _list = dataSource[merchant_platform];
                platformArr.push(
                    <div key={merchant_platform}>
                        <Divider orientation="left">{merchant_platform}</Divider>
                        <div>
                            {_list.map(({ merchant_id, merchant_name }) => {
                                return (
                                    <Checkbox
                                        key={merchant_id}
                                        value={merchant_id}
                                        className={formStyles.formCheckbox}
                                    >
                                        {merchant_name}
                                    </Checkbox>
                                );
                            })}
                        </div>
                    </div>,
                );
            }
        }
        return platformArr;
    }, [list]);

    const onOKeyFunc = useCallback(() => {
        form.validateFields().then(({ merchant_ids }) => {
            setConfirmLoading(true);
            onOKey(merchant_ids)
                .then(() => {
                    onCancel();
                })
                .finally(() => {
                    setConfirmLoading(false);
                });
        });
    }, [onOKey]);

    return useMemo(() => {
        return (
            <Modal
                visible={visible}
                title="请选择上架店铺"
                className={styles.merchantModal}
                onOk={onOKeyFunc}
                onCancel={onCancel}
                confirmLoading={confirmLoading}
            >
                <Spin spinning={loading} tip="加载中...">
                    <div className={styles.merchantModalContent}>
                        <Form form={form}>
                            <Form.Item
                                name={'merchant_ids'}
                                rules={[{ required: true, message: '请选择上架店铺' }]}
                            >
                                <Checkbox.Group className={style.block}>{child}</Checkbox.Group>
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }, [loading, confirmLoading, visible]);
};

export default MerchantListModal;
