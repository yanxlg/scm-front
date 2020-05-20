import { EditEnum } from '@/enums/PriceAdjustmentEnum';

export type IEdiyKey = EditEnum.DEFAULT | EditEnum.ADD | EditEnum.UPDATE;

export interface ISellItem {
    [key: string]: any;
}
