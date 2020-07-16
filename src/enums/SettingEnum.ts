import { transOptionList } from '@/utils/transform';

export enum ExportFileStatus {
    Ready = '0',
    Going = '1',
    Success = '2',
    Failure = '3',
}

export const falseShippingTypeMap = {
    1: '采购物流商',
    2: '采购单运单号开头为',
    3: '采购单运单号结尾为',
    4: '采购单运单号包含',
    5: '采购单运单号不包含',
    6: '采购单运单号等于',
    7: '采购单运单号不等于',
    8: '物流轨迹包含',
    9: '最后一条轨迹包含',
    10: '最后一条轨迹不包含',
    11: '物流轨迹不包含',
};

export const falseShippingTypeList = transOptionList(falseShippingTypeMap, true);

export type IFalseShippingTypeCode = keyof typeof falseShippingTypeMap;
