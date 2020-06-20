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
