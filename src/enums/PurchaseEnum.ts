import { transOptionList } from '@/utils/transform';

export const defaultOptionItem = { name: '全部', value: '' };

//======================= 仓库异常处理 ======================//
export const waybillExceptionTypeMap = {
    101: '扫码失败',
    102: '拒收',
    103: '多发货',
    104: '货不对版',
    105: '货品不合规',
};

export const waybillExceptionTypeList = transOptionList(waybillExceptionTypeMap);

export const waybillExceptionStatusMap = {
    1: '待处理',
    2: '处理中',
    3: '已完结',
};

export enum OperateType {
    discard = 1, //废弃
    related = 2, // 关联采购单
    exceptionHandle = 3, // 异常处理
}

export enum AbnormalType {
    waitProcess = 1, // 待处理
    processing = 2, // 处理中
    end = 3, // 已完结
    pendingReview = 4, // 待审核
    reviewRejected = 5, // 审核驳回
}

export const waybillExceptionHandleMap = {
    1: '关联采购单',
    2: '退款',
    3: '退货',
    4: '补发',
    5: '废弃',
    6: '审核驳回',
};
export type IExceptionHandle = keyof typeof waybillExceptionHandleMap;

export const refundStatus = {
    1: '退款申请',
    2: '商家驳回',
    3: '退款成功',
};
export const refundStatusList = transOptionList(refundStatus, true);

export type IRefundStatusCode = keyof typeof refundStatus;

export const returnStatus = {
    11: '待退货',
    12: '确认退货地址',
    13: '已退货',
};

export const returnStatusList = transOptionList(returnStatus, true);

export type IReturnStatusCode = keyof typeof returnStatus;

export const reissueStatus = {
    21: '待入库',
    22: '已入库',
};

export const reissueStatusList = transOptionList(reissueStatus, true);

export type IReissueStatusCode = keyof typeof reissueStatus;
