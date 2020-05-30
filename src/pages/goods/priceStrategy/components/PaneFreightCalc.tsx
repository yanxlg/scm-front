import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { IShippingCardListRes } from '@/interface/IPriceStrategy';
import FreightModal from './FreightModal/FreightModal';
import {
    getShippingCardList,
    getShippingCardNameList,
    getShippingCardCountry,
} from '@/services/price-strategy';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';

const PaneFreightCalc: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [freightStatus, setFreightStatus] = useState(false);
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

    const hideFreightModal = useCallback(() => {
        setFreightStatus(false);
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
            <Button
                key="1"
                type="primary"
                className={formStyles.formBtn}
                onClick={() => showFreightModal('add')}
            >
                + 新增运费价卡
            </Button>,
            <Button
                ghost
                key="2"
                type="primary"
                className={formStyles.formBtn}
                onClick={() => showFreightModal('update')}
            >
                更新运费价卡
            </Button>,
        ];
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
                dataIndex: 'weight',
                align: 'center',
                width: 120,
                render: (_: any, record: IShippingCardListRes) => {
                    const { weight_config } = record;
                    return (
                        <div className={styles.calcContainer}>
                            {weight_config.map((item, index) => {
                                const { min_weight, max_weight } = item;
                                return (
                                    <div className={styles.calc}>
                                        [{min_weight.toFixed(4)}, {max_weight.toFixed(4)})
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
            {
                title: '计算公式',
                dataIndex: 'calc',
                align: 'center',
                width: 120,
                render: (_: any, record: IShippingCardListRes) => {
                    const { weight_config } = record;
                    return (
                        <div className={styles.calcContainer}>
                            {weight_config.map(({ param_add, param_devide, param_multiply }) => {
                                return (
                                    <div className={styles.calc}>
                                        {param_add.toFixed(4)} + (m/{param_devide.toFixed(4)}) *
                                        {param_multiply.toFixed(4)}
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
                type: 'select',
                label: '运费价卡',
                name: 'card_name',
                placeholder: '请选择',
                mode: 'multiple',
                isShortcut: true,
                maxTagCount: 4,
                className: styles.select,
                optionList: nameList,
                formatter: 'join',
                onChange: (name, form) => {
                    // console.log(11111, );
                    const val = form.getFieldValue(name)?.join(',') ?? '';
                    val ? _getShippingCardCountry(val) : setCountryCodeList([]);
                    form.resetFields(['country_code']);
                },
            },
            {
                type: 'select',
                label: '国家',
                name: 'country_code',
                placeholder: '请选择',
                mode: 'multiple',
                isShortcut: true,
                maxTagCount: 4,
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
                </div>
            </JsonForm>
        );
    }, [formFields]);

    const table = useMemo(() => {
        return (
            <FitTable
                bordered
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
        </>
    );
};

export default React.memo(PaneFreightCalc);
