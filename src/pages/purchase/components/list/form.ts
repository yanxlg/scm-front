import { FormField } from 'react-components/es/JsonForm';
import { PurchaseCreateTypeList, PurchaseStatusList } from '@/config/dictionaries/Purchase';
import styles from '../../_list.less';
const allFormFields: FormField[] = [
    {
        label: '采购单ID',
        type: 'textarea@2',
        name: 'purchase_order_goods_id',
        key: 'purchase_order_goods_id',
        formatter: 'multipleToArrayJoin',
    },
    {
        label: '采购平台',
        type: 'input@2',
        name: 'purchase_platform',
        key: 'purchase_platform',
    },
    {
        label: '采购店铺',
        type: 'input@2',
        name: 'purchase_merchant_name',
        key: 'purchase_merchant_name',
    },
    {
        label: '供应商订单号',
        type: 'textarea@2',
        name: 'purchase_order_goods_sn',
        key: 'purchase_order_goods_sn',
        formatter: 'multipleToArrayJoin',
    },
    {
        label: '商品名称',
        type: 'input@2',
        name: 'purchase_goods_name',
        key: 'purchase_goods_name',
    },
    {
        label: '采购单类型',
        type: 'select@2',
        name: 'origin',
        key: 'origin',
        formatter: 'number',
        initialValue: '',
        options: PurchaseCreateTypeList,
    },
    {
        label: '退款状态',
        type: 'select@2',
        name: 'purchase_refund_status',
        key: 'purchase_refund_status',
        initialValue: '',
        options: [
            {
                label: '待处理',
                value: 0,
            },
            {
                label: '退款申请中',
                value: 1,
            },
            {
                label: '退款申请成功',
                value: 2,
            },
            {
                label: '退款驳回',
                value: 3,
            },
            {
                label: '等待商家退款',
                value: 4,
            },
            {
                label: '退款成功',
                value: 5,
            },
        ],
    },
    {
        label: '运单号',
        type: 'textarea@2',
        name: 'purchase_waybill_no',
        key: 'purchase_waybill_no',
    },
    {
        label: '采购单生成时间',
        type: 'dateRanger@2',
        name: ['create_time_start', 'create_time_end'],
        key: 'create_time',
        formatter: ['start_date', 'end_date'],
        childrenProps: {
            className: styles.formItemPicker,
        },
    },
    {
        label: '采购单状态',
        type: 'select@2',
        name: 'purchase_order_status',
        key: 'purchase_order_status',
        initialValue: '',
        options: PurchaseStatusList,
    },
];

const fieldMap = new Map<string, FormField>();
allFormFields.forEach(item => {
    fieldMap.set(item.key!, item);
});

export const filterFieldsList = (config: string[]) => {
    return config.map(key => fieldMap.get(key)!);
};
