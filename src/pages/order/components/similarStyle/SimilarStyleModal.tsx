import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, message, Modal, Spin } from 'antd';

import { patSimilarGoods, querySimilarInfo } from '@/services/order-manage';
import { IPadSimilarBody, ISimilarInfoResponse } from '@/interface/IOrder';
import { EmptyObject } from '@/config/global';
import { LoadingOutlined, CloseCircleFilled } from '@ant-design/icons';
import similarStyles from './_similar.less';
import taskStyles from '@/styles/_task.less';
import SimilarGoods from './SimilarGoods';
import OrderGoods from './OrderGoods';
import GatherInfo from './GatherInfo';
import StyleForm, { getQueryVariable } from './StylesForm';
import { useDispatch, useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import SimilarTable from './SimilarTable';

declare interface SimilarStyleModalProps {
    visible:
        | false
        | {
              order_goods_id: string;
              purchase_plan_id: string;
              commodity_id: string;
          };
    onClose: () => void;
    onReload: () => void;
}

const SimilarStyleModal = ({ visible, onClose, onReload }: SimilarStyleModalProps) => {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<ISimilarInfoResponse>(EmptyObject);
    const [submitting, setSubmitting] = useState(false);
    const [commodityId, setCommodityId] = useState('');
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const purchaseErrorMap = useSelector((state: ConnectState) => state.options.platformErrorMap);

    useEffect(() => {
        dispatch({
            type: 'options/purchaseError',
        });
    }, []);

    useEffect(() => {
        // 获取当前状态
        if (visible) {
            setInfo(EmptyObject);
            form.resetFields();
            setLoading(true);
            setCommodityId(visible.commodity_id);
            querySimilarInfo(visible)
                .then(({ data }) => {
                    if (Number(data.status) === 4) {
                        // 成功，需要立即刷新原页面
                        message.success('代拍成功！');
                        onClose();
                        onReload();
                    }
                    setInfo(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [visible]);

    const onOKey = useCallback(() => {
        form.validateFields().then(values => {
            const { type, list, goods_link, goods_id, sku_id, ...extra } = values;
            setSubmitting(true);
            patSimilarGoods({
                ...extra,
                ...visible,
                ...(type === 1
                    ? {
                          goods_id: goods_id || getQueryVariable('goods_id', goods_link),
                          sku_id: sku_id || getQueryVariable('sku_id', goods_link),
                      }
                    : JSON.parse(list)),
                type,
            } as IPadSimilarBody)
                .then(() => {
                    message.success('代拍成功');
                    onClose();
                    onReload();
                })
                .finally(() => {
                    setSubmitting(false);
                });
        });
    }, [visible]);

    return useMemo(() => {
        const {
            status: taskStatus,
            purchaseInfo,
            originOrderInfo,
            historySimilarGoodsInfo = [],
        } = info;
        const status = taskStatus === void 0 ? undefined : Number(taskStatus);
        const title = status === 0 ? '相似款代拍' : '代拍详情';
        return (
            <Modal
                title={title}
                visible={!!visible}
                onCancel={onClose}
                okText="拍单"
                onOk={onOKey}
                destroyOnClose={true}
                confirmLoading={submitting}
                className={similarStyles.modal}
                footer={status === 1 || status === 5 || status === void 0 ? null : undefined}
            >
                <Spin spinning={loading}>
                    <div className={similarStyles.modalContent}>
                        {status === void 0 ? null : (
                            <>
                                {status === 0 ? (
                                    <div className={similarStyles.title}>
                                        <CloseCircleFilled className={taskStyles.errorIcon} />
                                        拍单失败-
                                        {purchaseErrorMap?.[purchaseInfo?.scmErrorCode]}
                                    </div>
                                ) : status === 1 || status === 5 ? (
                                    <div className={similarStyles.title}>
                                        <LoadingOutlined className={taskStyles.progressIcon} />
                                        正在爬取商品信息...
                                        {purchaseInfo.planId ? (
                                            <div className={similarStyles.desc}>
                                                任务ID: {purchaseInfo.planId}
                                            </div>
                                        ) : null}
                                    </div>
                                ) : status === 3 ? (
                                    <div className={similarStyles.title}>
                                        <CloseCircleFilled className={taskStyles.errorIcon} />
                                        爬取失败
                                        {purchaseInfo.planId ? (
                                            <div className={similarStyles.desc}>
                                                任务ID: {purchaseInfo.planId}
                                            </div>
                                        ) : null}
                                        {purchaseInfo.failReason ? (
                                            <div className={similarStyles.desc}>
                                                失败原因: {purchaseInfo.failReason}
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                                {status === 0 ? (
                                    <SimilarGoods {...purchaseInfo} />
                                ) : status === 1 || status === 5 || status === 3 ? (
                                    <GatherInfo {...purchaseInfo} />
                                ) : null}
                                {status === 1 || status === 5 ? null : (
                                    <>
                                        {status === 3 ? (
                                            <div className={similarStyles.title1}>
                                                重新代拍相似款
                                            </div>
                                        ) : null}
                                        <StyleForm form={form} list={historySimilarGoodsInfo} />
                                    </>
                                )}
                                <SimilarTable commodityId={commodityId} />
                                <OrderGoods {...originOrderInfo} />
                            </>
                        )}
                    </div>
                </Spin>
            </Modal>
        );
    }, [visible, loading, submitting, commodityId]);
};

export default SimilarStyleModal;
