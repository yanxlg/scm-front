import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { ColumnsType } from 'antd/lib/table';
import { IShippingCardListRes } from '@/interface/IPriceStrategy';
import FreightModal from './FreightModal/FreightModal';
import {
    getShippingCardList,
    getShippingCardNameList,
    getShippingCardCountry,
} from '@/services/price-strategy';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';
import Export from '@/components/Export';
import { exportExcel } from '@/services/global';
import { PermissionComponent } from 'rc-permission';
import { FormInstance } from 'antd/es/form';

const PaneFreightCalc: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [freightStatus, setFreightStatus] = useState(false);
    const [exportStatus, setExportStatus] = useState(false);
    const [freightType, setFreightType] = useState<'add' | 'update'>('add');
    const [nameList, setNameList] = useState<IOptionItem[]>([]);
    const [countryCodeList, setCountryCodeList] = useState<IOptionItem[]>([]);
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        onReload,
        onSearch,
        onChange,
    } = useList<IShippingCardListRes>({
        formRef: searchRef,
        queryList: getShippingCardList,
    });

    const showFreightModal = useCallback(type => {
        setFreightType(type);
        setFreightStatus(true);
    }, []);

    const hideFreightModal = useCallback((isRefresh?: boolean) => {
        setFreightStatus(false);
        if (isRefresh) {
            _getShippingCardNameList();
            onReload();
        }
    }, []);

    const _getShippingCardNameList = useCallback(() => {
        getShippingCardNameList().then(list => {
            // console.log(1111, list);
            setNameList(list);
        });
    }, []);

    const _getShippingCardCountry = useCallback(names => {
        getShippingCardCountry(names).then(list => {
            setCountryCodeList(list);
        });
    }, []);

    const toolBarRender = useCallback(() => {
        return [
            <PermissionComponent
                key="1"
                pid="goods/price_strategy/shipping_card/update"
                control="tooltip"
            >
                <Button
                    type="primary"
                    className={formStyles.formBtn}
                    onClick={() => showFreightModal('add')}
                >
                    + 新增运费价卡
                </Button>
            </PermissionComponent>,
            <PermissionComponent
                key="2"
                pid="goods/price_strategy/shipping_card/update"
                control="tooltip"
            >
                <Button
                    ghost={true}
                    type="primary"
                    className={formStyles.formBtn}
                    onClick={() => showFreightModal('update')}
                >
                    更新运费价卡
                </Button>
            </PermissionComponent>,
        ];
    }, []);

    const onExport = useCallback((values: any) => {
        return exportExcel({
            query: {
                ...searchRef.current?.getFieldsValue(),
            },
            module: 10,
            type: 1,
            ...values,
        });
    }, []);

    const columns = useMemo<ColumnsType<IShippingCardListRes>>(() => {
        return [
            {
                title: '运费价卡',
                dataIndex: 'card_name',
                align: 'center',
                width: 120,
            },
            {
                title: '配送国家',
                dataIndex: 'country_code',
                align: 'center',
                width: 120,
            },
            {
                title: '重量区间(g)',
                dataIndex: 'weight_range',
                align: 'center',
                width: 120,
                render: (_: any, record: IShippingCardListRes) => {
                    const { WeightConfig } = record;
                    return (
                        <div className={styles.calcContainer}>
                            {WeightConfig?.map((item, index) => {
                                const { min_weight, max_weight } = item;
                                return (
                                    <div className={styles.calc}>
                                        {index === WeightConfig.length - 1 && max_weight === 0
                                            ? `${min_weight}g以上`
                                            : `[${min_weight}, ${max_weight})`}
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
            {
                title: '计算公式',
                dataIndex: '_',
                align: 'center',
                width: 120,
                render: (_: any, record: IShippingCardListRes) => {
                    const { WeightConfig } = record;
                    return (
                        <div className={styles.calcContainer}>
                            {WeightConfig?.map(({ param_add, param_devide, param_multiply }) => {
                                return (
                                    <div className={styles.calc}>
                                        {Number(param_add).toFixed(4)} + (m/
                                        {Number(param_devide).toFixed(4)}) *
                                        {Number(param_multiply).toFixed(4)}
                                    </div>
                                );
                            })}
                        </div>
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

    const formFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'treeSelect',
                label: '运费价卡',
                name: 'card_name',
                placeholder: '请选择',
                mode: 'multiple',
                className: styles.select,
                optionList: nameList,
                formatter: 'join',
                onChange: (name: string, form: FormInstance) => {
                    // console.log(11111, );
                    const val = form.getFieldValue(name)?.join(',') ?? '';
                    val ? _getShippingCardCountry(val) : setCountryCodeList([]);
                    form.resetFields(['country_code']);
                },
            },
            {
                type: 'treeSelect',
                label: '国家',
                name: 'country_code',
                placeholder: '请选择',
                className: styles.select,
                optionList: countryCodeList,
                formatter: 'join',
            },
        ];
    }, [nameList, countryCodeList]);

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
                        ghost={true}
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => setExportStatus(true)}
                    >
                        导出运费价卡
                    </Button>
                </div>
            </JsonForm>
        );
    }, [formFields]);

    const table = useMemo(() => {
        return (
            <FitTable
                bordered={true}
                // columnsSettingRender={true}
                rowKey={({ card_name, country_code }) => card_name + country_code}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                toolBarRender={toolBarRender}
                onChange={onChange}
                scroll={{ x: 'max-content' }}
            />
        );
    }, [loading]);

    const exportModalComponent = useMemo(() => {
        return (
            <Export
                columns={[
                    ...columns.filter((item: any) => item.dataIndex[0] !== '_'),
                    {
                        title: '参数1',
                        dataIndex: 'param_add',
                    },
                    {
                        title: '参数2',
                        dataIndex: 'param_devide',
                    },
                    {
                        title: '参数三',
                        dataIndex: 'param_multiply',
                    },
                ]}
                visible={exportStatus}
                onOKey={onExport}
                onCancel={() => setExportStatus(false)}
            />
        );
    }, [exportStatus]);

    useEffect(() => {
        _getShippingCardNameList();
    }, []);

    return (
        <>
            {searchNode}
            {table}
            <FreightModal
                visible={freightStatus}
                freightType={freightType}
                onCancel={hideFreightModal}
                nameList={nameList}
            />
            {exportModalComponent}
        </>
    );
};

export default React.memo(PaneFreightCalc);
