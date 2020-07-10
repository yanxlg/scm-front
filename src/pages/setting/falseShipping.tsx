import React, { useMemo, useRef, useCallback, useState, ReactText, useEffect } from 'react';
import { Button } from 'antd';
import Container from '@/components/Container';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { PlusCircleOutlined } from '@ant-design/icons';
import { getStoreBlacklist } from '@/services/setting';

import styles from './_shopBlacklist.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { ColumnsType } from 'antd/lib/table';
import { utcToLocal } from 'react-components/es/utils/date';
import { PermissionRouterWrap, PermissionComponent } from 'rc-permission';
import AddConfigModal from './components/falseShipping/AddConfigModal';

const formFields: FormField[] = [
    {
        type: 'select',
        name: 'a1',
        label: '虚假发货类型',
        optionList: [],
    },
    {
        type: 'select',
        name: 'a2',
        label: '采购物流商',
        optionList: [],
    },
    {
        type: 'input',
        name: 'a3',
        label: '采购单运单号结尾为',
        placeholder: '请输入',
    },
    {
        type: 'input',
        name: 'a4',
        label: '采购单运单号包含',
        placeholder: '请输入',
    },
    {
        type: 'input',
        name: 'a5',
        label: '采购单运单号开头为',
        placeholder: '请输入',
    },
    {
        type: 'input',
        name: 'a6',
        label: '采购单运单号等于',
        placeholder: '请输入',
    },
    {
        type: 'input',
        name: 'a7',
        label: '采购单运单号不等于',
        placeholder: '请输入',
    },
    {
        type: 'input',
        name: 'a8',
        label: '采购单运单号不包含',
        placeholder: '请输入',
    },
    {
        type: 'input',
        name: 'a9',
        label: '最后一条轨迹包含',
        placeholder: '请输入',
    },
    {
        type: 'input',
        name: 'a10',
        label: '物流轨迹包含',
        placeholder: '请输入',
    },
];

const FalseShipping: React.FC = props => {
    const form = useRef<JsonFormRef>(null);
    const [addStatus, setAddStatus] = useState(false);
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
        queryList: getStoreBlacklist,
    });

    const showAddConfig = useCallback(() => {
        setAddStatus(true);
    }, []);

    const hideAddConfig = useCallback(() => {
        setAddStatus(false);
    }, []);

    const searchNode = useMemo(() => {
        return (
            <JsonForm ref={form} fieldList={formFields} initialValues={{ purchase_channel: '1' }}>
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
    }, []);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '配置类型',
                align: 'center',
                width: 200,
                dataIndex: 'purchase_channel',
            },
            {
                title: '配置',
                align: 'center',
                width: 200,
                dataIndex: 'merchant_id',
            },
            {
                title: '操作人',
                align: 'center',
                width: 200,
                dataIndex: 'black_store_reason',
            },
            {
                title: '操作时间',
                align: 'center',
                width: 200,
                dataIndex: 'created_time',
                render: (val: string) => utcToLocal(val),
            },
            {
                title: '当前状态',
                align: 'center',
                width: 200,
                dataIndex: 'operator',
            },
        ];
    }, []);

    return (
        <Container>
            {searchNode}
            <div>
                {/* <PermissionComponent pid="setting/shop_black_list/add" control="tooltip"> */}
                <Button type="link" onClick={showAddConfig} disabled={addStatus}>
                    <PlusCircleOutlined />
                    添加虚假发货拦截配置
                </Button>
                {/* </PermissionComponent> */}
            </div>
            <FitTable
                bordered
                rowKey="merchant_id"
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
                // columnsSettingRender={false}
                pagination={pagination}
                onChange={onChange}
                // toolBarRender={toolBarRender}
            />
            <AddConfigModal visible={addStatus} onCancel={hideAddConfig} />
        </Container>
    );
};

export default React.memo(FalseShipping);
// export default PermissionRouterWrap(React.memo(ShopBlacklist), {
//     login: true,
//     pid: 'setting/shop_black_list',
// });
