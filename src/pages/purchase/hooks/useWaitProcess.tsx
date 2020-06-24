import React, { useContext, useRef, useState, useCallback } from 'react';
import { Modal, Input, message } from 'antd';
import { AbnormalContext } from '../abnormal';
import { IPurchaseAbnormalItem, IExceptionStrategyItem } from '@/interface/IPurchase';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { setDiscardAbnormalOrder } from '@/services/purchase';
import TextArea from 'antd/lib/input/TextArea';
import { OperateType } from '@/enums/PurchaseEnum';

export default function useWaitProcess(
    setCurrentRecord: React.Dispatch<React.SetStateAction<IPurchaseAbnormalItem | null>>,
    onRefresh: () => void,
) {
    const textareaRef = useRef<TextArea>(null);
    const abnormalContext = useContext(AbnormalContext);
    const [relatedPurchaseStatus, setRelatedPurchaseStatus] = useState(false);
    const [abnormalStatus, setAbnormalStatus] = useState(false);
    // const [currentRecord, setCurrentRecord] = useState<IPurchaseAbnormalItem | null>(null);

    const showRelatedPurchase = (record: IPurchaseAbnormalItem) => {
        setRelatedPurchaseStatus(true);
        setCurrentRecord(record);
    };

    const hideRelatedPurchase = useCallback(() => {
        setRelatedPurchaseStatus(false);
    }, []);

    const showAbnormal = (record: IPurchaseAbnormalItem) => {
        setAbnormalStatus(true);
        setCurrentRecord(record);
    };

    const hideAbnormal = useCallback(() => {
        setAbnormalStatus(false);
    }, []);

    const handleOperate = useCallback(
        (item: IExceptionStrategyItem, record: IPurchaseAbnormalItem) => {
            const { exception_operation_id } = item;
            switch (exception_operation_id) {
                case OperateType.discard:
                    showDiscardModal(record);
                    break;
                case OperateType.related:
                    showRelatedPurchase(record);
                    break;
                case OperateType.exceptionHandle:
                    showAbnormal(record);
                    break;
                default:
            }
        },
        [],
    );

    const showDiscardModal = useCallback((record: IPurchaseAbnormalItem) => {
        const { waybillExceptionSn } = record;
        Modal.confirm({
            title: '废弃异常单',
            icon: <QuestionCircleOutlined />,
            content: (
                <>
                    <p>是否确认废弃异常单，通知仓库不做处理？</p>
                    <Input.TextArea ref={textareaRef} placeholder="备注" />
                </>
            ),
            onOk: () => {
                const remarks = textareaRef.current?.state.value;
                if (!remarks) {
                    message.error('请填写备注！！！');
                    return Promise.reject();
                }
                return setDiscardAbnormalOrder({
                    waybill_exception_sn: waybillExceptionSn,
                    handle_type: ['5'],
                    remarks,
                }).then(() => {
                    onRefresh();
                });
            },
        });
    }, []);

    return {
        relatedPurchaseStatus,
        abnormalStatus,
        abnormalContext,
        showRelatedPurchase,
        hideRelatedPurchase,
        showAbnormal,
        hideAbnormal,
        showDiscardModal,
        handleOperate,
    };
}
