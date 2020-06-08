import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { queryShopList, queryShopFilterList, getPurchasePlatform } from '@/services/global';
import { getGoodsList } from '@/services/goods';
import { getAllGoodsTagList, getSalePriceList } from '@/services/price-strategy';
import { ColumnsType } from 'antd/lib/table';
import { ISellItem, IEdiyKey } from '@/interface/IPriceStrategy';
import { EditEnum } from '@/enums/PriceStrategyEnum';
import SellConfig from './SellConfig/SellConfig';
import UpdateRangeModal from './UpdateRangeModal/UpdateRangeModal';
import useUpdateRecord from '@/pages/goods/priceStrategy/hooks/useUpdateRecord';
import useSellChannel from '../hooks/useSellChannel';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';
import SaleAndShippingLogModal from './SaleAndShippingLogModal/SaleAndShippingLogModal';

const formFields: FormField[] = [
    {
        type: 'select',
        label: '采购渠道',
        name: 'enable_source',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: () => getPurchasePlatform(),
    },
    {
        type: 'select',
        label: '销售渠道',
        name: 'enable_platform',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: () => queryShopFilterList(),
        onChange: (name, form) => {
            form.resetFields(['enable_merchant']);
        },
        formatter: 'join',
    },
    {
        type: 'select',
        label: '销售店铺',
        name: 'enable_merchant',
        optionListDependence: { name: 'enable_platform', key: 'children' },
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: () => queryShopFilterList(),
        formatter: 'join',
    },
    {
        type: 'select',
        label: '商品标签',
        name: 'product_tags',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: () => getAllGoodsTagList(),
        formatter: 'join',
    },
    {
        type: 'inputRange',
        label: '爬虫价格区间',
        precision: 2,
        name: ['min_origin_price', 'max_origin_price'],
        endExtra: '￥',
        // className: styles.inputMin,
    },
];

const PaneSellPrice: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [logStatus, setLogStatus] = useState(false);
    const [editType, setEditType] = useState<IEdiyKey>(EditEnum.DEFAULT); // ADD
    const [updateRangeStatus, setUpdateRangeStatus] = useState(false);
    const [currentId, setCurrentId] = useState('');
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
        queryList: getSalePriceList,
    });
    const { sellChannelList } = useSellChannel();

    const goBack = useCallback(() => {
        setEditType(EditEnum.DEFAULT);
    }, []);

    const showLogModal = useCallback(id => {
        setLogStatus(true);
        setCurrentId(id);
    }, []);

    const hideLogModal = useCallback(() => {
        setLogStatus(false);
        setCurrentId('');
    }, []);

    const handleUpdate = useCallback(id => {
        setEditType(EditEnum.UPDATE);
        setCurrentId(id);
    }, []);

    const hideUpdateRangeModal = useCallback(() => {
        setUpdateRangeStatus(false);
    }, []);

    const toolBarRender = useCallback(() => {
        return [
            <Button
                ghost
                key="1"
                type="primary"
                className={formStyles.formBtn}
                onClick={() => setUpdateRangeStatus(true)}
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
                render: (_: any, record: ISellItem) => {
                    const { id } = record;
                    return (
                        <Button
                            type="link"
                            className={styles.hover}
                            onClick={() => handleUpdate(id)}
                        >
                            更新
                        </Button>
                    );
                },
            },
            {
                title: '售价规则',
                dataIndex: 'rule_name',
                align: 'center',
                width: 120,
            },
            {
                title: '采购渠道',
                dataIndex: 'enable_source',
                align: 'center',
                width: 120,
            },
            {
                title: '销售渠道',
                dataIndex: 'enable_platform',
                align: 'center',
                width: 120,
            },
            {
                title: '销售店铺',
                dataIndex: 'enable_merchant',
                align: 'center',
                width: 120,
            },
            {
                title: '商品标签',
                dataIndex: 'product_tags',
                align: 'center',
                width: 120,
                render: (val: string) => val || '--',
            },
            {
                title: '爬虫价区间',
                dataIndex: 'min_origin_price',
                align: 'center',
                width: 120,
                render: (val: string, record: ISellItem) => {
                    const { max_origin_price } = record;
                    if (Number(val) === 0 && Number(max_origin_price) === 0) {
                        return '--';
                    } else if (Number(max_origin_price) === 0) {
                        return `${val}以上`;
                    }
                    return `${val} - ${max_origin_price}`;
                },
            },
            {
                title: '运费规则',
                dataIndex: 'shipping_fee_rules',
                align: 'center',
                width: 160,
            },
            {
                title: '价格系数(X)',
                dataIndex: 'param_price_multiply',
                align: 'center',
                width: 120,
            },
            {
                title: '固定调整(Y)',
                dataIndex: 'param_price_add',
                align: 'center',
                width: 120,
            },
            {
                title: '运费放大系数(Z)',
                dataIndex: 'param_shipping_fee_multiply',
                align: 'center',
                width: 140,
            },
            {
                title: '排序等级',
                dataIndex: 'order',
                align: 'center',
                width: 120,
            },
            {
                title: '生效商品量',
                dataIndex: 'effect_count',
                align: 'center',
                width: 120,
            },
            {
                title: '启用状态',
                dataIndex: 'is_enable',
                align: 'center',
                width: 120,
                render: (val: string) => (val === '1' ? '启用' : '禁用'),
            },
            {
                title: '更新记录',
                dataIndex: 'id',
                align: 'center',
                width: 120,
                render: (val: string) => {
                    return (
                        <Button
                            type="link"
                            className={styles.hover}
                            onClick={() => showLogModal(val)}
                        >
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
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
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
                rowKey="id"
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
            <UpdateRangeModal
                visible={updateRangeStatus}
                sellChannelList={sellChannelList}
                onCancel={hideUpdateRangeModal}
            />
            <SaleAndShippingLogModal
                type="sale_price"
                visible={logStatus}
                id={currentId}
                onCancel={hideLogModal}
            />
        </>
    ) : (
        <SellConfig
            type={editType}
            id={currentId}
            sellChannelList={sellChannelList}
            goBack={goBack}
            onReload={onReload}
        />
    );
};

export default React.memo(PaneSellPrice);