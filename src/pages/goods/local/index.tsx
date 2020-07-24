import React, { useState, useMemo, useRef } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import Container from '@/components/Container';
import { defaultOption, inventoryStatusList, versionStatusList } from '@/enums/LocalGoodsEnum';
import { EmptyObject } from '@/config/global';
import { getGoodsList, getCatagoryList, getGoodsStatusList } from '@/services/goods';
import { IGoodsList, IGoodsAndSkuItem } from '@/interface/ILocalGoods';
import GoodsTable from './components/GoodsTable/GoodsTable';

import styles from './_index.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryGoodsSourceList } from '@/services/global';
import { PermissionRouterWrap } from 'rc-permission';
import { getPlatformAndStore } from '@/services/dashboard';

const initialValues = {
    inventory_status: '',
    version_status: '',
    first_catagory: '',
    second_catagory: '',
    third_catagory: '',
    publish_channel: '',
    source_channel: '',
};

const LocalPage: React.FC = props => {
    const formRef = useRef<JsonFormRef>(null);
    const [exportStatus, setExportStatus] = useState(false);
    const [sourceChannel, setSourceChannel] = useState('');
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        selectedRowKeys,
        queryRef,
        setSelectedRowKeys,
        onReload,
        onSearch,
        onChange,
    } = useList({
        formRef: formRef,
        queryList: getGoodsList,
        convertQuery: (params: any) => {
            // console.log(11111111, params);
            const { inventory_status, ...rest } = params;
            let status = '';
            let reason = '';
            if (inventory_status) {
                status = inventory_status[0];
                reason = inventory_status[1] || '';
            }
            return {
                ...rest,
                inventory_status: status,
                not_sale_reason: reason,
            };
        },
    });

    const goodsList = useMemo<IGoodsAndSkuItem[]>(() => {
        return (dataSource as IGoodsList[])?.map(item => {
            const { sku_info } = item;
            if (sku_info.length > 0) {
                return {
                    ...item,
                    ...sku_info[0],
                };
            }
            return item;
        });
    }, [dataSource]);

    const formFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'input',
                label: '爬虫任务 ID',
                name: 'task_number',
                placeholder: '多个逗号隔开',
                className: styles.input,
                formatter: 'number_str_arr',
            },
            {
                type: 'input',
                label: '店铺 ID',
                name: 'store_id',
                placeholder: '多个逗号隔开',
                className: styles.input,
                formatter: 'str_arr',
            },
            {
                type: 'input',
                label: '店铺名称',
                name: 'merchant_name',
                className: styles.input,
                placeholder: '请输入店铺名称',
            },
            {
                type: 'input',
                label: 'Commodity ID',
                name: 'commodity_id',
                placeholder: '多个逗号隔开',
                className: styles.input,
                formatter: 'str_arr',
            },
            {
                type: 'input',
                label: '商品名称',
                name: 'title',
                placeholder: '请输入商品名称',
                className: styles.input,
                // formatter: 'str_arr',
            },
            {
                type: 'select',
                label: '上架渠道',
                name: 'publish_channel',
                className: styles.input,
                // formatter: 'number',
                syncDefaultOption: defaultOption,
                optionList: () => getPlatformAndStore(),
            },
            {
                type: 'select',
                label: '商品渠道',
                name: 'source_channel',
                className: styles.input,
                syncDefaultOption: defaultOption,
                optionList: () => queryGoodsSourceList(),
                onChange: (name, form) => {
                    // console.log(form.getFieldValue(name));
                    setSourceChannel(form.getFieldValue(name));
                },
            },
            {
                label: '销售状态',
                type: 'cascader',
                name: 'inventory_status',
                className: styles.input,
                options: [
                    {
                        label: '不可销售',
                        value: 1,
                        children: [
                            {
                                label: '全部',
                                value: '',
                            },
                            {
                                label: '商品售罄',
                                value: 11,
                            },
                            {
                                label: '海淘',
                                value: 12,
                            },
                            {
                                label: '预售',
                                value: 13,
                            },
                            {
                                label: '不可合并',
                                value: 14,
                            },
                            {
                                label: '黑名单店铺',
                                value: 15,
                            },
                        ],
                    },
                    {
                        label: '可销售',
                        value: 2,
                    },
                ],
            },
            {
                type: 'select',
                label: '请选择版本状态',
                name: 'product_status',
                className: styles.input,
                formatter: 'join',
                placeholder: '请选择版本状态',
                mode: 'multiple',
                maxTagCount: 2,
                optionList: () => getGoodsStatusList(),
            },
            {
                type: 'select',
                label: '版本更新',
                name: 'version_status',
                className: styles.input,
                formatter: 'number',
                optionList: [defaultOption, ...versionStatusList],
            },
            {
                type: 'select',
                label: '一级类目',
                name: 'first_catagory',
                className: styles.input,
                formatter: 'number',
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () =>
                    getCatagoryList()
                        .then(({ convertList = [] } = EmptyObject) => {
                            return convertList;
                        })
                        .catch(() => {
                            return [];
                        }),
                onChange: (name, form) => {
                    form.resetFields(['second_catagory']);
                    form.resetFields(['third_catagory']);
                },
            },
            {
                type: 'select',
                label: '二级类目',
                name: 'second_catagory',
                className: styles.input,
                formatter: 'number',
                optionListDependence: {
                    name: 'first_catagory',
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () =>
                    getCatagoryList()
                        .then(({ convertList = [] } = EmptyObject) => {
                            return convertList;
                        })
                        .catch(() => {
                            return [];
                        }),
                onChange: (name, form) => {
                    form.resetFields(['third_catagory']);
                },
            },
            {
                type: 'select',
                label: '三级类目',
                name: 'third_catagory',
                className: styles.input,
                formatter: 'number',
                optionListDependence: {
                    name: ['first_catagory', 'second_catagory'],
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () =>
                    getCatagoryList()
                        .then(({ convertList = [] } = EmptyObject) => {
                            return convertList;
                        })
                        .catch(() => {
                            return [];
                        }),
            },
            {
                type: 'inputRange',
                label: 'sku数量',
                name: ['min_sku', 'max_sku'],
                className: styles.inputMin,
            },
            {
                type: 'inputRange',
                label: '价格范围（￥）',
                name: ['min_price', 'max_price'],
                className: styles.inputMin,
                precision: 2,
            },
            {
                type: 'inputRange',
                label: '销量',
                name: ['min_sale', 'max_sale'],
                className: styles.inputMin,
            },
            {
                type: 'positiveInteger',
                label: '评论数量>=',
                name: 'min_comment',
                // placeholder: '多个逗号隔开',
                className: styles.inputMin,
                formatter: 'number',
            },
        ];
    }, []);

    return useMemo(() => {
        return (
            <Container>
                <div className={styles.form}>
                    <JsonForm
                        labelClassName={styles.formLabel}
                        initialValues={initialValues}
                        ref={formRef}
                        fieldList={formFields}
                    >
                        <div>
                            <LoadingButton
                                type="primary"
                                className={formStyles.formBtn}
                                onClick={onSearch}
                            >
                                查询
                            </LoadingButton>
                            <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                                刷新
                            </LoadingButton>
                            <Button
                                disabled={total <= 0}
                                className={formStyles.formBtn}
                                onClick={() => setExportStatus(true)}
                            >
                                导出
                            </Button>
                        </div>
                    </JsonForm>
                </div>
                <GoodsTable
                    loading={loading}
                    exportStatus={exportStatus}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    total={total}
                    sourceChannel={sourceChannel}
                    selectedRowKeys={selectedRowKeys}
                    goodsList={goodsList}
                    queryRef={queryRef}
                    formRef={formRef}
                    onChange={onChange}
                    setSelectedRowKeys={setSelectedRowKeys}
                    setExportStatus={setExportStatus}
                    onReload={onReload}
                />
            </Container>
        );
    }, [loading, selectedRowKeys, exportStatus, sourceChannel]);
};

export default PermissionRouterWrap(LocalPage, {
    login: true,
    pid: 'goods/local',
});
