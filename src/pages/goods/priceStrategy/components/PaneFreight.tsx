import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { ColumnsType } from 'antd/lib/table';
import { IShippingFeeRuleRes, IEdiyKey, ISaveShippingFeeRuleReq } from '@/interface/IPriceStrategy';
import { EditEnum } from '@/enums/PriceStrategyEnum';
import FreightConfig from './FreightConfig/FreightConfig';
import DeliveryCountryModal from './DeliveryCountryModal/DeliveryCountryModal';
import {
    getAllGoodsTagList,
    getShippingCardNameList,
    getShippingFeeRuleList,
} from '@/services/price-strategy';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';

const formFields: FormField[] = [
    {
        type: 'select',
        label: '商品标签',
        name: 'a1',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: () => getAllGoodsTagList(),
    },
    {
        type: 'select',
        label: '运费价卡',
        name: 'card_name',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: () => getShippingCardNameList(),
    },
    {
        type: 'inputRange',
        label: '重量区间(g)',
        precision: 2,
        name: ['min_weight', 'max_weight'],
        // className: styles.inputMin,
    },
];

const PaneFreight: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [editType, setEditType] = useState<IEdiyKey>(EditEnum.DEFAULT); // EditEnum.ADD
    const [deliveryCountryStatus, setDeliveryCountryStatus] = useState(false);
    const [updateData, setUpdateData] = useState<ISaveShippingFeeRuleReq | null>(null);
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        onReload,
        onSearch,
        onChange,
    } = useList<IShippingFeeRuleRes>({
        formRef: searchRef,
        queryList: getShippingFeeRuleList,
    });

    const goBack = useCallback(() => {
        setEditType(EditEnum.DEFAULT);
        setUpdateData(null);
    }, []);

    const showFreightConfig = useCallback((type: IEdiyKey, record?: IShippingFeeRuleRes) => {
        setEditType(type);
        if (record) {
            const {
                id,
                product_tags,
                min_weight,
                max_weight,
                lower_shipping_card,
                upper_shipping_card,
                order,
                is_enable,
            } = record;
            setUpdateData({
                rule_id: id,
                product_tags,
                min_weight: String(min_weight),
                max_weight: String(max_weight),
                order,
                comment: 'comment',
                lower_shipping_card,
                upper_shipping_card,
                rule_name: 'rule_name',
                enable: String(is_enable),
            });
        }
    }, []);

    const showDeliveryCountryModal = useCallback(() => {
        setDeliveryCountryStatus(true);
    }, []);

    const hideDeliveryCountryModal = useCallback(() => {
        setDeliveryCountryStatus(false);
    }, []);

    const columns = useMemo<ColumnsType<IShippingFeeRuleRes>>(() => {
        return [
            {
                fixed: 'left',
                title: '操作',
                dataIndex: '_operation',
                align: 'center',
                width: 120,
                render: (_: any, record: IShippingFeeRuleRes) => {
                    return (
                        <Button
                            type="link"
                            className={styles.hover}
                            onClick={() => showFreightConfig(EditEnum.UPDATE, record)}
                        >
                            更新
                        </Button>
                    );
                },
            },
            {
                title: '规则名称',
                dataIndex: 'a1',
                align: 'center',
                width: 120,
            },
            {
                title: '商品标签',
                dataIndex: 'product_tags',
                align: 'center',
                width: 120,
            },
            {
                title: '重量区间(g)',
                dataIndex: 'min_weight',
                align: 'center',
                width: 120,
                render: (val: number, record: IShippingFeeRuleRes) => {
                    const { max_weight } = record;
                    return `${val.toFixed(4)} ~ ${max_weight.toFixed(4)}`;
                },
            },
            {
                title: '阈值范围',
                dataIndex: 'a4',
                align: 'center',
                width: 120,
                render: () => {
                    return (
                        <>
                            <div>$xxx以上</div>
                            <div>$xxx以下</div>
                        </>
                    );
                },
            },
            {
                title: '运费价卡',
                dataIndex: 'lower_shipping_card',
                align: 'center',
                width: 160,
                render: (val: string, record: IShippingFeeRuleRes) => {
                    const { upper_shipping_card } = record;
                    return (
                        <>
                            <div>{upper_shipping_card}</div>
                            <div>{val}</div>
                        </>
                    );
                },
            },
            {
                title: '配送国家',
                dataIndex: 'support_country_count',
                align: 'center',
                width: 120,
                render: (val: number) => {
                    return (
                        <a className={styles.hover} onClick={() => showDeliveryCountryModal()}>
                            {val}
                        </a>
                    );
                },
            },
            {
                title: '排序等级',
                dataIndex: 'order',
                align: 'center',
                width: 120,
            },
            {
                title: '生效商品量',
                dataIndex: 'product_count',
                align: 'center',
                width: 120,
            },
            {
                title: '启用状态',
                dataIndex: 'is_enable',
                align: 'center',
                width: 120,
                render: (val: number) => (val === 0 ? '禁用' : '启用'),
            },
            {
                title: '更新记录',
                dataIndex: 'a10',
                align: 'center',
                width: 120,
                render: () => {
                    return (
                        <Button type="link" className={styles.hover}>
                            查看
                        </Button>
                    );
                },
            },
        ];
    }, []);

    const pagination = useMemo<any>(() => {
        return {
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        };
    }, [loading]);

    const searchNode = useMemo(() => {
        return (
            <JsonForm
                ref={searchRef}
                fieldList={formFields}
                // labelClassName="product-form-label"
            >
                <div>
                    <LoadingButton
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => Promise.resolve()}
                    >
                        查询
                    </LoadingButton>
                    <Button
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => showFreightConfig(EditEnum.ADD)}
                    >
                        +新增运费规则
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const table = useMemo(() => {
        return (
            <FitTable
                bordered
                columnsSettingRender={true}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                onChange={onChange}
                scroll={{ x: 'max-content' }}
            />
        );
    }, [loading]);

    return editType === EditEnum.DEFAULT ? (
        <>
            {searchNode}
            {table}
            <DeliveryCountryModal
                visible={deliveryCountryStatus}
                onCancel={hideDeliveryCountryModal}
            />
        </>
    ) : (
        <FreightConfig type={editType} goBack={goBack} updateData={updateData} />
    );
};

export default React.memo(PaneFreight);
