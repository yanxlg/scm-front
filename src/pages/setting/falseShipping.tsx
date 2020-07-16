import React, { useMemo, useRef, useCallback, useState, ReactText, useEffect } from 'react';
import { Button, message } from 'antd';
import Container from '@/components/Container';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
    queryVirtualDeliverySignList,
    queryVirtualDeliveryCondition,
    queryPurchaseWaybillMerchant,
    deleteVirtualDeliverySign,
} from '@/services/setting';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ColumnsType } from 'antd/lib/table';
import { utcToLocal } from 'react-components/es/utils/date';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import AddConfigModal from './components/falseShipping/AddConfigModal';

import styles from './_falseShipping.less';
import { falseShippingTypeMap, IFalseShippingTypeCode } from '@/enums/SettingEnum';
import {
    IAddVirtualAbnormalItem,
    IVirtualDeliverySignItem,
    IVirtualAbnormalItem,
} from '@/interface/ISetting';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

interface IConditionMap {
    [key: string]: IOptionItem[];
}

const FalseShipping: React.FC = props => {
    const form = useRef<JsonFormRef>(null);
    const [addStatus, setAddStatus] = useState(false);
    const [allShippingList, setAllShippingList] = useState<IOptionItem[]>([]);
    const [conditionMap, setConditionMap] = useState<IConditionMap>({});
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        onReload,
        onSearch,
        onChange,
    } = useList({
        formRef: form,
        queryList: queryVirtualDeliverySignList,
        convertQuery: (params: any) => {
            // console.log('params', params);
            const { page, page_count, ...restParams } = params;
            const keys = Object.keys(restParams);
            const searchParams: IVirtualAbnormalItem[] = [];
            keys.forEach(key => {
                const val = restParams[key];
                if (val && val.length > 0) {
                    searchParams.push({
                        abnormal_type: key,
                        abnormal_config_detail: val,
                    });
                }
            });
            return {
                page,
                page_count,
                search_params: searchParams,
            };
        },
    });

    const _deleteVirtualDeliverySign = useCallback(id => {
        deleteVirtualDeliverySign(id).then(res => {
            message.success('删除成功');
            onReload();
        });
    }, []);

    const _queryVirtualDeliveryCondition = useCallback(() => {
        queryVirtualDeliveryCondition().then(({ data }) => {
            const conditionObj: IConditionMap = {};
            data.forEach(({ abnormal_type, abnormal_config_detail = [] }) => {
                conditionObj[abnormal_type] = abnormal_config_detail.map(name => ({
                    name,
                    value: name,
                }));
            });
            setConditionMap(conditionObj);
        });
    }, []);

    const _queryPurchaseWaybillMerchant = useCallback(() => {
        queryPurchaseWaybillMerchant().then(({ data }) => {
            // console.log('queryPurchaseWaybillMerchant', data);
            setAllShippingList(
                data.map(({ purchaseShippingName }: any) => ({
                    name: purchaseShippingName,
                    value: purchaseShippingName,
                })),
            );
        });
    }, []);

    useEffect(() => {
        _queryVirtualDeliveryCondition();
        _queryPurchaseWaybillMerchant();
    }, []);

    const showAddConfig = useCallback(() => {
        setAddStatus(true);
    }, []);

    const hideAddConfig = useCallback(() => {
        setAddStatus(false);
    }, []);

    const formFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'treeSelect',
                name: '1',
                label: '采购物流商',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[1],
            },
            {
                type: 'treeSelect',
                name: '3',
                label: '采购单运单号结尾为',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[3],
            },
            {
                type: 'treeSelect',
                name: '4',
                label: '采购单运单号包含',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[4],
            },
            {
                type: 'treeSelect',
                name: '2',
                label: '采购单运单号开头为',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[2],
            },
            {
                type: 'treeSelect',
                name: '6',
                label: '采购单运单号等于',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[6],
            },
            {
                type: 'treeSelect',
                name: '7',
                label: '采购单运单号不等于',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[7],
            },
            {
                type: 'treeSelect',
                name: '5',
                label: '采购单运单号不包含',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[5],
            },
            {
                type: 'treeSelect',
                name: '9',
                label: '最后一条轨迹包含',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[9],
            },
            {
                type: 'treeSelect',
                name: '8',
                label: '物流轨迹包含',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[8],
            },
            {
                type: 'treeSelect',
                name: '10',
                label: '最后一条轨迹不包含',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[10],
            },
            {
                type: 'treeSelect',
                name: '11',
                label: '物流轨迹不包含',
                className: styles.input,
                placeholder: '请选择',
                optionList: conditionMap[11],
            },
        ];
    }, [conditionMap]);

    const searchNode = useMemo(() => {
        return (
            <JsonForm
                labelClassName={styles.label}
                ref={form}
                fieldList={formFields}
                initialValues={{ purchase_channel: '1' }}
            >
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={onReload}
                    >
                        刷新
                    </LoadingButton>
                </div>
            </JsonForm>
        );
    }, [formFields]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const columns = useMemo<ColumnsType<IVirtualDeliverySignItem>>(() => {
        return [
            {
                title: '配置',
                align: 'center',
                width: 200,
                dataIndex: 'content',
                render: (value: string) => {
                    try {
                        const list = JSON.parse(value);
                        // console.log(list);
                        return (
                            <>
                                {list.map(
                                    (
                                        {
                                            abnormal_type,
                                            abnormal_config_detail,
                                        }: IAddVirtualAbnormalItem,
                                        index: number,
                                    ) => {
                                        return (
                                            <div>{`${index + 1}. ${
                                                falseShippingTypeMap[abnormal_type]
                                            }: ${abnormal_config_detail}`}</div>
                                        );
                                    },
                                )}
                            </>
                        );
                    } catch (err) {
                        return '';
                    }
                },
            },
            {
                title: '操作人',
                align: 'center',
                width: 200,
                dataIndex: 'operator',
            },
            {
                title: '操作时间',
                align: 'center',
                width: 200,
                dataIndex: 'update_time',
                render: (val: string) => utcToLocal(val),
            },
            {
                title: '当前状态',
                align: 'center',
                width: 200,
                dataIndex: 'status',
                render: (value: string, record) => {
                    const { abnormal_key } = record;
                    return value === '1' ? (
                        <PermissionComponent
                            pid="/v1/purchase/virtual_delivery_sign/delete"
                            control="tooltip"
                        >
                            <Button
                                type="link"
                                onClick={() => _deleteVirtualDeliverySign(abnormal_key)}
                            >
                                删除
                            </Button>
                        </PermissionComponent>
                    ) : (
                        <Button type="link" disabled>
                            已失效
                        </Button>
                    );
                },
            },
        ];
    }, []);

    return (
        <Container className={styles.wrapper}>
            {searchNode}
            <div>
                <PermissionComponent
                    pid="/v1/purchase/virtual_delivery_sign/save"
                    control="tooltip"
                >
                    <Button type="link" onClick={showAddConfig} disabled={addStatus}>
                        <PlusCircleOutlined />
                        添加虚假发货拦截配置
                    </Button>
                </PermissionComponent>
            </div>
            <FitTable
                bordered
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
                // columnsSettingRender={false}
                pagination={pagination}
                onChange={onChange}
                // toolBarRender={toolBarRender}
            />
            <AddConfigModal
                visible={addStatus}
                onCancel={hideAddConfig}
                onReload={onReload}
                allShippingList={allShippingList}
            />
        </Container>
    );
};

export default PermissionRouterWrap(React.memo(FalseShipping), {
    login: true,
    pid: '/v1/purchase/virtual_delivery_sign/list',
});
