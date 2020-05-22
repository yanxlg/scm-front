import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { getGoodsList } from '@/services/goods';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { ISellItem } from '@/interface/IPriceAdjustment';
import FreightModal from './FreightModal/FreightModal';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';

const formFields: FormField[] = [
    {
        type: 'select',
        label: '运费价卡',
        name: 'a1',
        // defaultValue: '',
        // syncDefaultOption: defaultSelectOption,
        placeholder: '请选择',
        mode: 'multiple',
        maxTagCount: 4,
        className: styles.multipleSelect,
        optionList: [],
    },
    {
        type: 'select',
        label: '国家',
        name: 'a2',
        // defaultValue: '',
        // syncDefaultOption: defaultSelectOption,
        placeholder: '请选择',
        mode: 'multiple',
        maxTagCount: 4,
        className: styles.multipleSelect,
        optionList: [],
    },
];

const PaneFreightCalc: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [freightStatus, setFreightStatus] = useState(false);
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

    const hideFreightModal = useCallback(() => {
        setFreightStatus(false);
    }, []);

    const columns = useMemo<ColumnsType<ISellItem>>(() => {
        return [
            {
                title: '运费价卡',
                dataIndex: 'a1',
                align: 'center',
                width: 120,
            },
            {
                title: '配送国家',
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
                title: '计算公式',
                dataIndex: 'a4',
                align: 'center',
                width: 120,
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
                    <LoadingButton
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => Promise.resolve()}
                    >
                        导出运费价卡
                    </LoadingButton>
                    <Button
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => setFreightStatus(true)}
                    >
                        +新增运费价卡
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

    return (
        <>
            {searchNode}
            {table}
            <FreightModal visible={freightStatus} onCancel={hideFreightModal} />
        </>
    );
};

export default React.memo(PaneFreightCalc);
