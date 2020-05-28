import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { defaultSelectOption } from '@/config/global';
import { getGoodsList } from '@/services/goods';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { ISellItem, IEdiyKey } from '@/interface/IPriceAdjustment';
import { EditEnum } from '@/enums/PriceAdjustmentEnum';
import FreightConfig from './FreightConfig/FreightConfig';
import DeliveryCountryModal from './DeliveryCountryModal/DeliveryCountryModal';

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
        optionList: [],
    },
    {
        type: 'select',
        label: '运费价卡',
        name: 'a2',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: [],
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
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        onReload,
        onSearch,
        onChange,
    } = useList<ISellItem>({
        formRef: searchRef,
        queryList: getGoodsList,
    });

    const showDeliveryCountryModal = useCallback(() => {
        setDeliveryCountryStatus(true);
    }, []);

    const hideDeliveryCountryModal = useCallback(() => {
        setDeliveryCountryStatus(false);
    }, []);

    const columns = useMemo<ColumnsType<ISellItem>>(() => {
        return [
            {
                fixed: 'left',
                title: '操作',
                dataIndex: '_operation',
                align: 'center',
                width: 120,
                render: (_: any, row: ISellItem) => {
                    return (
                        <Button type="link" className={styles.hover}>
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
                dataIndex: 'a2',
                align: 'center',
                width: 120,
            },
            {
                title: '重量区间(g)',
                dataIndex: 'a3',
                align: 'center',
                width: 120,
            },
            {
                title: '阈值范围',
                dataIndex: 'a4',
                align: 'center',
                width: 120,
            },
            {
                title: '运费价卡',
                dataIndex: 'a5',
                align: 'center',
                width: 120,
            },
            {
                title: '配送国家',
                dataIndex: 'a6',
                align: 'center',
                width: 120,
                render: () => {
                    return (
                        <a className={styles.hover} onClick={() => showDeliveryCountryModal()}>
                            123
                        </a>
                    );
                },
            },
            {
                title: '排序等级',
                dataIndex: 'a7',
                align: 'center',
                width: 120,
            },
            {
                title: '生效商品量',
                dataIndex: 'a8',
                align: 'center',
                width: 120,
            },
            {
                title: '启用状态',
                dataIndex: 'a9',
                align: 'center',
                width: 140,
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
                        onClick={() => setEditType(EditEnum.ADD)}
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
        <FreightConfig type={editType} />
    );
};

export default React.memo(PaneFreight);
