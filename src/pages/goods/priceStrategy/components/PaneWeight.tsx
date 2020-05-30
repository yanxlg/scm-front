import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { getGoodsList, getCatagoryList } from '@/services/goods';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { ISellItem } from '@/interface/IPriceStrategy';
import WeightModal from './WeightModal/WeightModal';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';
import { EmptyObject, defaultSelectOption } from '@/config/global';

const formFields: FormField[] = [
    {
        type: 'select',
        label: '一级类目',
        name: 'first_catagory',
        // className: styles.input,
        defaultValue: '',
        syncDefaultOption: defaultSelectOption,
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
        // className: styles.input,
        defaultValue: '',
        optionListDependence: {
            name: 'first_catagory',
            key: 'children',
        },
        syncDefaultOption: defaultSelectOption,
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
        // className: styles.input,
        defaultValue: '',
        optionListDependence: {
            name: ['first_catagory', 'second_catagory'],
            key: 'children',
        },
        syncDefaultOption: defaultSelectOption,
        optionList: () =>
            getCatagoryList()
                .then(({ convertList = [] } = EmptyObject) => {
                    return convertList;
                })
                .catch(() => {
                    return [];
                }),
    },
];

const PaneWeight: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const [weightStatus, setWeightStatus] = useState(false);
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

    const hideWeightModal = useCallback(() => {
        setWeightStatus(false);
    }, []);

    const columns = useMemo<ColumnsType<ISellItem>>(() => {
        return [
            {
                title: '一级品类',
                dataIndex: 'a1',
                align: 'center',
                width: 120,
            },
            {
                title: '二级品类',
                dataIndex: 'a2',
                align: 'center',
                width: 120,
            },
            {
                title: '三级品类',
                dataIndex: 'a3',
                align: 'center',
                width: 120,
            },
            {
                title: '预估重量 (g)',
                dataIndex: 'a4',
                align: 'center',
                width: 120,
            },
            {
                title: '平均重量 (g)',
                dataIndex: 'a5',
                align: 'center',
                width: 120,
            },
            {
                title: '更新记录',
                dataIndex: 'a6',
                align: 'center',
                width: 120,
                render: () => {
                    return <a className={styles.hover}>查看</a>;
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
                        onClick={() => setWeightStatus(true)}
                    >
                        批量导入
                    </Button>
                    <LoadingButton
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => Promise.resolve()}
                    >
                        全部导出
                    </LoadingButton>
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
            <WeightModal visible={weightStatus} onCancel={hideWeightModal} />
        </>
    );
};

export default React.memo(PaneWeight);
