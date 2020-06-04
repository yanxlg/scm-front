import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { FormField, JsonFormRef } from 'react-components/lib/JsonForm';
import { getCatagoryList } from '@/services/goods';
import { ColumnsType } from 'antd/lib/table';
import { ICatagoryWeightListRes } from '@/interface/IPriceStrategy';
import WeightModal from './WeightModal/WeightModal';
import { EmptyObject } from '@/config/global';
import { getCatagoryWeightList } from '@/services/price-strategy';
import useUpdateRecord from '../hooks/useUpdateRecord';
import UpdateRecordModal from './UpdateRecordModal/UpdateRecordModal';

import formStyles from 'react-components/es/JsonForm/_form.less';
import styles from '../_index.less';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import Export from '@/components/Export';
import { exportExcel } from '@/services/global';

const _getCatagoryList = () =>
    getCatagoryList()
        .then(({ convertList = [] } = EmptyObject) => {
            return convertList;
        })
        .catch(() => {
            return [];
        });

const formFields: FormField[] = [
    {
        type: 'select',
        label: '一级品类',
        name: 'first_category',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionList: _getCatagoryList,
        onChange: (name, form) => {
            form.resetFields(['second_category']);
            form.resetFields(['third_category']);
        },
        // formatter: 'join',
    },
    {
        type: 'select',
        label: '二级品类',
        name: 'second_category',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionListDependence: {
            name: 'first_category',
            key: 'children',
        },
        optionList: _getCatagoryList,
        onChange: (name, form) => {
            form.resetFields(['third_category']);
        },
        // formatter: 'join',
    },
    {
        type: 'select',
        label: '三级品类',
        name: 'third_category',
        isShortcut: true,
        placeholder: '请选择',
        mode: 'multiple',
        className: styles.select,
        maxTagCount: 4,
        optionListDependence: {
            name: ['first_category', 'second_category'],
            key: 'children',
        },
        optionList: _getCatagoryList,
        // formatter: 'join',
    },
];

const PaneWeight: React.FC = props => {
    const searchRef = useRef<JsonFormRef>(null);
    const queryParamsRef = useRef('');
    const [exportStatus, setExportStatus] = useState(false);
    const allCatagoryRef = useRef<IOptionItem[]>([]);
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
    } = useList<ICatagoryWeightListRes>({
        formRef: searchRef,
        queryList: getCatagoryWeightList,
        convertQuery: (query: any) => {
            const { page, page_count, first_category, second_category, third_category } = query;
            let params = {
                page,
                page_count,
                third_category: '',
            };
            if (first_category && first_category.length > 0 && allCatagoryRef.current.length > 0) {
                const allCatagoryList = allCatagoryRef.current;
                if (third_category && third_category.length > 0) {
                    params.third_category = third_category.join(',');
                } else if (second_category && second_category.length > 0) {
                    let list: IOptionItem[] = [];
                    allCatagoryList.forEach(({ value: firstVal, children: firstChildren }) => {
                        if (
                            first_category.indexOf(firstVal) > -1 &&
                            firstChildren &&
                            firstChildren.length > 0
                        ) {
                            firstChildren.forEach(
                                ({ value: secondVal, children: secondChildren }: IOptionItem) => {
                                    if (second_category.indexOf(secondVal) > -1) {
                                        list = [...list, ...(secondChildren || [])];
                                    }
                                },
                            );
                        }
                    });
                    params.third_category = list.map(({ value }) => value).join(',');
                } else {
                    let list: IOptionItem[] = [];
                    allCatagoryList.forEach(({ value: firstVal, children: firstChildren }) => {
                        if (
                            first_category.indexOf(firstVal) > -1 &&
                            firstChildren &&
                            firstChildren.length > 0
                        ) {
                            firstChildren.forEach(({ children: secondChildren }: IOptionItem) => {
                                list = [...list, ...(secondChildren || [])];
                            });
                        }
                    });
                    params.third_category = list.map(({ value }) => value).join(',');
                }
            }
            queryParamsRef.current = params.third_category;
            return params;
        },
    });
    const {
        updateRecordStatus,
        recordId,
        showUpdateRecordModal,
        hideUpdateRecordModal,
    } = useUpdateRecord();

    const hideWeightModal = useCallback((isRefresh?: boolean) => {
        setWeightStatus(false);
        isRefresh && onReload();
    }, []);

    const onExport = useCallback((values: any) => {
        return exportExcel({
            query: {
                third_category: queryParamsRef.current,
            },
            module: 10,
            type: 2,
            ...values,
        });
    }, []);

    const columns = useMemo<ColumnsType<ICatagoryWeightListRes>>(() => {
        return [
            {
                title: '一级品类',
                dataIndex: 'firstCategoryName',
                align: 'center',
                width: 120,
            },
            {
                title: '二级品类',
                dataIndex: 'secondCategoryName',
                align: 'center',
                width: 120,
            },
            {
                title: '三级品类',
                dataIndex: 'thirdCategoryName',
                align: 'center',
                width: 120,
            },
            {
                title: '预估重量 (g)',
                dataIndex: 'estimateWeight',
                align: 'center',
                width: 120,
            },
            {
                title: '平均重量 (g)',
                dataIndex: 'avgWeight',
                align: 'center',
                width: 120,
            },
            {
                title: '更新记录',
                dataIndex: '_',
                align: 'center',
                width: 120,
                render: (val: number, record: ICatagoryWeightListRes) => {
                    const { thirdCategoryId } = record;
                    return (
                        <a
                            className={styles.hover}
                            onClick={() => showUpdateRecordModal(thirdCategoryId + '')}
                        >
                            查看
                        </a>
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
                        onClick={() => setWeightStatus(true)}
                    >
                        批量导入
                    </Button>
                    <Button
                        ghost
                        type="primary"
                        className={formStyles.formBtn}
                        onClick={() => setExportStatus(true)}
                    >
                        全部导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, []);

    const table = useMemo(() => {
        return (
            <FitTable
                bordered
                // columnsSettingRender={true}
                rowKey="thirdCategoryId"
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                onChange={onChange}
                scroll={{ x: 'max-content' }}
            />
        );
    }, [loading]);

    const exportModalComponent = useMemo(() => {
        return (
            <Export
                columns={columns.filter((item: any) => item.dataIndex[0] !== '_')}
                visible={exportStatus}
                onOKey={onExport}
                onCancel={() => setExportStatus(false)}
            />
        );
    }, [exportStatus]);

    useEffect(() => {
        _getCatagoryList().then(list => (allCatagoryRef.current = list));
    }, []);

    return (
        <>
            {searchNode}
            {table}
            <WeightModal visible={weightStatus} onCancel={hideWeightModal} />
            <UpdateRecordModal
                visible={updateRecordStatus}
                id={recordId}
                onCancel={hideUpdateRecordModal}
            />
            {exportModalComponent}
        </>
    );
};

export default React.memo(PaneWeight);
