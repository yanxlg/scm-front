import { transOptionList } from '@/utils/transform';

export const defaultOptionItem = { name: '全部', value: 100 };

//======================= 仓库异常处理 ======================//
export const waybillExceptionTypeMap = {
    101: '扫码失败',
    102: '拒收',
    103: '多发货',
    104: '货不对版',
    105: '货品不合规'
};

export const waybillExceptionTypeList = transOptionList(waybillExceptionTypeMap, true);