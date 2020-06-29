import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { getGoodsList, getCatagoryList } from '@/services/goods';
import { EmptyObject } from '@/config/global';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import OrderReviewModal from './OrderReviewModal';

import styles from './_PaneOrderReview.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const PaneOrderReview: React.FC = () => {
    const formRef = useRef<JsonFormRef>(null);
    const [configStatus, setConfigStatus] = useState(false);
    const [allCategoryList, setAllCategoryList] = useState<IOptionItem[]>([]);
    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        onReload,
        onSearch,
        onChange,
    } = useList<any>({
        formRef: formRef,
        queryList: getGoodsList,
    });

    const showOrderReviewModal = useCallback(() => {
        setConfigStatus(true);
    }, []);

    const hideOrderReviewModal = useCallback(() => {
        setConfigStatus(false);
    }, []);

    const _getCatagoryList = useCallback(() => {
        return getCatagoryList()
            .then(({ convertList = [] } = EmptyObject) => {
                return convertList;
            })
            .catch(() => {
                return [];
            });
    }, []);

    const formFields = useMemo<FormField[]>(() => {
        return [
            {
                type: 'select',
                label: '一级类目',
                name: 'first_catagory',
                // className: styles.input,
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () => _getCatagoryList(),
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
                optionListDependence: {
                    name: 'first_catagory',
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () => _getCatagoryList(),
                onChange: (name, form) => {
                    form.resetFields(['third_catagory']);
                },
            },
            {
                type: 'select',
                label: '三级类目',
                name: 'third_catagory',
                // className: styles.input,
                optionListDependence: {
                    name: ['first_catagory', 'second_catagory'],
                    key: 'children',
                },
                syncDefaultOption: {
                    value: '',
                    name: '全部',
                },
                optionList: () => _getCatagoryList(),
            },
        ];
    }, []);

    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '一级类目',
                dataIndex: 'a1',
                align: 'center',
                // width: 140,
            },
            {
                title: '二级类目',
                dataIndex: 'a2',
                align: 'center',
                // width: 140,
            },
            {
                title: '三级类目',
                dataIndex: 'a3',
                align: 'center',
                // width: 140,
            },
            {
                title: '操作时间',
                dataIndex: 'a4',
                align: 'center',
                // width: 140,
            },
            {
                title: '操作人',
                dataIndex: 'a5',
                align: 'center',
                // width: 140,
            },
            {
                title: '操作',
                dataIndex: 'a6',
                align: 'center',
                // width: 140,
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
        } as any;
    }, [loading]);

    useEffect(() => {
        _getCatagoryList().then(list => setAllCategoryList(list));
    }, []);

    return useMemo(() => {
        return (
            <div className={styles.wrapper}>
                <JsonForm
                    // labelClassName={styles.formLabel}
                    // initialValues={initialValues}
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
                    </div>
                </JsonForm>
                <Button ghost={true} type="primary" onClick={showOrderReviewModal}>
                    <PlusOutlined />
                    新增品类
                </Button>
                <FitTable
                    bordered
                    rowKey="product_id"
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                    // columnsSettingRender={true}
                    pagination={pagination}
                    onChange={onChange}
                />
                <OrderReviewModal
                    visible={configStatus}
                    allCategoryList={allCategoryList}
                    hideModal={hideOrderReviewModal}
                    getCatagoryList={_getCatagoryList}
                />
            </div>
        );
    }, [loading, configStatus, allCategoryList]);
};

export default PaneOrderReview;
