import React, { useCallback } from 'react';
import { message, notification } from 'antd';
import { FormInstance } from 'antd/es/form';
import { reviewExceptionOrder } from '@/services/purchase';
import { IReviewExceptionOrderResItem } from '@/interface/IPurchase';

export default function useReview(
    form: FormInstance,
    onRefresh: () => Promise<void>,
    selectedRowKeys?: string[],
) {
    const reviewPass = useCallback(record => {
        const exceptionTypeMap = form.getFieldsValue();
        const { waybillExceptionSn } = record;
        // console.log('reviewPass', exceptionTypeMap[waybillExceptionSn], record);
        reviewExceptionOrder([
            {
                waybill_exception_sn: waybillExceptionSn,
                review_result: 1,
                waybill_exception_type: exceptionTypeMap[waybillExceptionSn] || '101',
            },
        ]).then(res => {
            message.success('审核通过成功！');
            onRefresh();
        });
    }, []);

    const reviewReject = useCallback(record => {
        // console.log('reviewReject', form.getFieldsValue(), record);
        const exceptionTypeMap = form.getFieldsValue();
        const { waybillExceptionSn } = record;
        // console.log('reviewPass', exceptionTypeMap[waybillExceptionSn], record);
        reviewExceptionOrder([
            {
                waybill_exception_sn: waybillExceptionSn,
                review_result: 2,
                waybill_exception_type: exceptionTypeMap[waybillExceptionSn] || '101',
            },
        ]).then(res => {
            message.success('审核驳回成功！');
            onRefresh();
        });
    }, []);

    const showNotification = useCallback((desc: string, data: IReviewExceptionOrderResItem[]) => {
        const successList: IReviewExceptionOrderResItem[] = [];
        const errList: IReviewExceptionOrderResItem[] = [];
        data?.forEach(item => {
            const { code } = item;
            if (code === 200) {
                successList.push(item);
            } else {
                errList.push(item);
            }
        });
        if (successList.length > 0) {
            notification.success({
                message: `${desc}成功`,
                description: (
                    <div>
                        {successList.map(({ waybillExceptionSn }) => (
                            <div key={waybillExceptionSn}>{waybillExceptionSn}</div>
                        ))}
                    </div>
                ),
            });
        }
        if (errList.length > 0) {
            notification.success({
                message: `${desc}失败`,
                description: (
                    <div>
                        {successList.map(({ waybillExceptionSn }) => (
                            <div key={waybillExceptionSn}>{waybillExceptionSn}</div>
                        ))}
                    </div>
                ),
            });
        }
    }, []);

    const batchReviewPass = useCallback(() => {
        const exceptionTypeMap = form.getFieldsValue();
        // console.log('batchReviewPass', exceptionTypeMap, selectedRowKeys);
        return reviewExceptionOrder(
            (selectedRowKeys as string[]).map(waybillExceptionSn => ({
                waybill_exception_sn: waybillExceptionSn,
                review_result: 1,
                waybill_exception_type: exceptionTypeMap[waybillExceptionSn] || '101',
            })),
        ).then(({ data }) => {
            showNotification('审核通过', data);
            onRefresh();
        });
        // return
    }, [selectedRowKeys]);

    const batchReviewReject = useCallback(() => {
        const exceptionTypeMap = form.getFieldsValue();
        // console.log('batchReviewPass', exceptionTypeMap, selectedRowKeys);
        return reviewExceptionOrder(
            (selectedRowKeys as string[]).map(waybillExceptionSn => ({
                waybill_exception_sn: waybillExceptionSn,
                review_result: 2,
                waybill_exception_type: exceptionTypeMap[waybillExceptionSn] || '101',
            })),
        ).then(({ data }) => {
            showNotification('审核驳回', data);
            onRefresh();
        });
    }, [selectedRowKeys]);

    return {
        reviewPass,
        reviewReject,
        batchReviewPass,
        batchReviewReject,
    };
}
