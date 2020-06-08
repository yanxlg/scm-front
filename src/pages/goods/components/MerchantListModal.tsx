import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Form, Modal, Divider, Spin } from 'antd';
import { IShopItem } from '@/interface/IGlobal';
import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '@/styles/_merchant.less';
import style from '@/styles/_index.less';
import { queryShopList } from '@/services/global';

declare interface MerchantListModalProps {
    visible: boolean;
    onOKey: (merchant_ids: string[]) => Promise<any>;
    onCancel: () => void;
    disabledChannelList?: string[]; // vova、florynight
    disabledShopList?: string[];
}

const MerchantListModal: React.FC<MerchantListModalProps> = ({
    visible,
    onCancel,
    onOKey,
    disabledChannelList = [],
    disabledShopList,
}) => {
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
            if (merchant_platform === 'vova_old') {
                return;
            }
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
                const disabled = disabledChannelList.indexOf(merchant_platform) > -1;
                platformArr.push(
                    <div key={merchant_platform}>
                        <Divider orientation="left">{merchant_platform}</Divider>
                        <div>
                            {_list.map(({ merchant_id, merchant_name }) => {
                                const _disabled =
                                    disabled ||
                                    (disabledShopList || []).indexOf(merchant_name) > -1;
                                return (
                                    <Checkbox
                                        key={merchant_id}
                                        value={merchant_id}
                                        className={formStyles.formCheckbox}
                                        disabled={_disabled}
                                    >
                                        {merchant_name}
                                    </Checkbox>
                                );
                            })}
                        </div>
                        {disabled && <p style={{ color: 'red' }}>不支持商品渠道来源条件</p>}
                    </div>,
                );
            }
        }
        return platformArr;
    }, [list, loading, disabledChannelList, disabledShopList]);

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
    }, [loading, confirmLoading, visible, disabledChannelList, disabledShopList]);
};

export default MerchantListModal;
