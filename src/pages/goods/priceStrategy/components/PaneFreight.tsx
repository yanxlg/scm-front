import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { ColumnsType } from 'antd/lib/table';
import { IShippingFeeRuleRes, IEdiyKey } from '@/interface/IPriceStrategy';
import { EditEnum } from '@/enums/PriceStrategyEnum';
import FreightConfig from './FreightConfig/FreightConfig';
import DeliveryCountryModal from './DeliveryCountryModal/DeliveryCountryModal';
import { getShippingCardNameList, getShippingFeeRuleList } from '@/services/price-strategy';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import SaleAndShippingLogModal from './SaleAndShippingLogModal/SaleAndShippingLogModal';

interface IProps {
    type: string;
}

const PaneFreight: React.FC<IProps> = ({ type }) => {
    const searchRef = useRef<JsonFormRef>(null);
    const [deliveryCountryStatus, setDeliveryCountryStatus] = useState(false);
    const [logStatus, setLogStatus] = useState(false);
    const [editType, setEditType] = useState<IEdiyKey>(EditEnum.DEFAULT); // EditEnum.ADD
    // const [updateData, setUpdateData] = useState<ISaveShippingFeeRuleReq | null>(null);
    const [cartNameList, setCardNameList] = useState<IOptionItem[]>([]);
    const [currentId, setCurrentId] = useState('');
    const [countryList, setCountryList] = useState<string[]>([]);
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
        setCurrentId('');
        setCountryList([]);
    }, []);

    const showFreightConfig = useCallback((type: IEdiyKey, id?: string) => {
        setEditType(type);
        id && setCurrentId(id);
    }, []);

    const showDeliveryCountryModal = useCallback(list => {
        setDeliveryCountryStatus(true);
        setCountryList(list);
    }, []);

    const hideDeliveryCountryModal = useCallback(() => {
        setDeliveryCountryStatus(false);
        setCurrentId('');
    }, []);

    const showLogModal = useCallback(id => {
        setLogStatus(true);
        setCurrentId(id);
    }, []);

    const hideLogModal = useCallback(() => {
        setLogStatus(false);
        setCurrentId('');
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
                    const { id } = record;
                    return (
                        <Button
                            type="link"
                            className={styles.hover}
                            onClick={() => showFreightConfig(EditEnum.UPDATE, id)}
                        >
                            更新
                        </Button>
                    );
                },
            },
            {
                title: '规则名称',
                dataIndex: 'rule_name',
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
                render: (val: string, record: IShippingFeeRuleRes) => {
                    const { max_weight } = record;
                    if (val === '0' && max_weight === '0') {
                        return '-';
                    } else if (max_weight === '0') {
                        return `${val}g以上`;
                    }
                    return `${val} - ${max_weight}`;
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
                            <div>阈值以上</div>
                            <div>阈值以下</div>
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
                render: (val: number, record: IShippingFeeRuleRes) => {
                    const { support_country } = record;
                    return (
                        <a
                            className={styles.hover}
                            onClick={() => showDeliveryCountryModal(support_country)}
                        >
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
                render: (val: string) => (val === '0' ? '禁用' : '启用'),
            },
            {
                title: '更新记录',
                dataIndex: 'id',
                align: 'center',
                width: 120,
                render: (id: string) => {
                    return (
                        <Button
                            type="link"
                            className={styles.hover}
                            onClick={() => showLogModal(id)}
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

    const formFields = useMemo<FormField[]>(() => {
        return [
            // {
            //     type: 'select',
            //     label: '商品标签',
            //     name: 'a1',
            //     isShortcut: true,
            //     placeholder: '请选择',
            //     mode: 'multiple',
            //     className: styles.select,
            //     maxTagCount: 4,
            //     optionList: () => getAllGoodsTagList(),
            // },
            {
                type: 'select',
                label: '运费价卡',
                name: 'card_name',
                isShortcut: true,
                placeholder: '请选择',
                mode: 'multiple',
                className: styles.select,
                maxTagCount: 4,
                optionList: cartNameList,
            },
            // {
            //     type: 'inputRange',
            //     label: '重量区间(g)',
            //     precision: 2,
            //     name: ['min_weight', 'max_weight'],
            //     // className: styles.inputMin,
            // },
        ];
    }, [cartNameList]);

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
                        onClick={() => showFreightConfig(EditEnum.ADD)}
                    >
                        +新增运费规则
                    </Button>
                </div>
            </JsonForm>
        );
    }, [formFields]);

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
            />
        );
    }, [loading]);

    useEffect(() => {
        if (type === '2') {
            getShippingCardNameList().then(list => setCardNameList(list));
        }
    }, [type]);

    return useMemo(() => {
        return editType === EditEnum.DEFAULT ? (
            <>
                {searchNode}
                {table}
                <DeliveryCountryModal
                    visible={deliveryCountryStatus}
                    countryList={countryList}
                    onCancel={hideDeliveryCountryModal}
                />
                <SaleAndShippingLogModal
                    type="shipping_fee"
                    visible={logStatus}
                    id={currentId}
                    onCancel={hideLogModal}
                />
            </>
        ) : (
            <FreightConfig
                type={editType}
                id={currentId}
                cartNameList={cartNameList}
                goBack={goBack}
                onReload={onReload}
            />
        );
    }, [editType, searchNode, table, deliveryCountryStatus, logStatus, currentId, cartNameList]);
};

// export default React.memo(PaneFreight);
export default PaneFreight;
