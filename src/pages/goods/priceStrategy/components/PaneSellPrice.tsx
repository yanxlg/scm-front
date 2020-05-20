import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { queryShopList, queryShopFilterList } from '@/services/global';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { defaultSelectOption } from '@/config/global';
import { getGoodsList } from '@/services/goods';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { ISellItem, IEdiyKey } from '@/interface/IPriceAdjustment';
import { EditEnum } from '@/enums/PriceAdjustmentEnum';
import SellConfig from './SellConfig/SellConfig';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';

const formFields: FormField[] = [
    {
        type: 'select',
        label: '采购渠道',
        name: 'a1',
        defaultValue: '',
        syncDefaultOption: defaultSelectOption,
        optionList: [],
    },
    {
        type: 'select',
        label: '销售渠道',
        name: 'a2',
        defaultValue: '',
        syncDefaultOption: defaultSelectOption,
        optionList: () => queryShopFilterList(),
        onChange: (name, form) => {
            form.resetFields(['a3']);
        },
    },
    {
        type: 'select',
        label: '销售店铺',
        name: 'a3',
        defaultValue: '',
        optionListDependence: { name: 'a2', key: 'children' },
        syncDefaultOption: defaultSelectOption,
        optionList: () => queryShopFilterList(),
    },
    {
        type: 'select',
        label: '商品标签',
        name: 'a3',
        defaultValue: '',
        syncDefaultOption: defaultSelectOption,
        optionList: [],
    },
    {
        type: 'inputRange',
        label: '爬虫价格区间',
        precision: 2,
        name: ['min_price', 'max_price'],
        // className: styles.inputMin,
    },
];

const PaneSellPrice: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [editType, setEditType] = useState<IEdiyKey>(EditEnum.DEFAULT);
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

    const toolBarRender = useCallback(() => {
        return [
            <Button
                ghost
                key="1"
                type="primary"
                className={formStyles.formBtn}
                // onClick={handleClickAllOnsale}
            >
                更新商品售价
            </Button>,
        ];
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
                title: '售价规则',
                dataIndex: 'a1',
                align: 'center',
                width: 120,
            },
            {
                title: '采购渠道',
                dataIndex: 'a2',
                align: 'center',
                width: 120,
            },
            {
                title: '销售渠道',
                dataIndex: 'a3',
                align: 'center',
                width: 120,
            },
            {
                title: '销售店铺',
                dataIndex: 'a4',
                align: 'center',
                width: 120,
            },
            {
                title: '商品标签',
                dataIndex: 'a5',
                align: 'center',
                width: 120,
            },
            {
                title: '爬虫价区间',
                dataIndex: 'a6',
                align: 'center',
                width: 120,
            },
            {
                title: '价格系数(X)',
                dataIndex: 'a7',
                align: 'center',
                width: 120,
            },
            {
                title: '固定调整(Y)',
                dataIndex: 'a8',
                align: 'center',
                width: 120,
            },
            {
                title: '运费放大系数(Z)',
                dataIndex: 'a9',
                align: 'center',
                width: 140,
            },
            {
                title: '排序等级',
                dataIndex: 'a10',
                align: 'center',
                width: 120,
            },
            {
                title: '运费规则',
                dataIndex: 'a11',
                align: 'center',
                width: 120,
            },
            {
                title: '生效商品量',
                dataIndex: 'a12',
                align: 'center',
                width: 120,
            },
            {
                title: '启用状态',
                dataIndex: 'a13',
                align: 'center',
                width: 120,
            },
            {
                title: '更新记录',
                dataIndex: 'a14',
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

    const pagination = useMemo<TablePaginationConfig>(() => {
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
                        +新增商品售价配置
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
                toolBarRender={toolBarRender}
            />
        );
    }, [loading]);

    return editType === EditEnum.DEFAULT ? (
        <>
            {searchNode}
            {table}
        </>
    ) : (
        <SellConfig type={editType} />
    );
};

export default React.memo(PaneSellPrice);
