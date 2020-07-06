import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Button, message } from 'antd';
import { JsonForm, LoadingButton, useList, FitTable } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import OrderReviewModal from './OrderReviewModal';

import styles from './_PaneOrderReview.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { getCategoryList } from '@/services/global';
import { getOrderConfigList, delOrderConfig } from '@/services/setting';
import { IOrderConfigItem } from '@/interface/ISetting';
import { getCategoryName } from '@/utils/utils';

const formFields: FormField[] = [
    {
        type: 'select',
        label: '一级类目',
        name: 'first_cat_id',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['second_cat_id']);
            form.resetFields(['third_cat_id']);
        },
    },
    {
        type: 'select',
        label: '二级类目',
        name: 'second_cat_id',
        optionListDependence: {
            name: 'first_cat_id',
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => getCategoryList(),
        onChange: (name, form) => {
            form.resetFields(['third_catagory']);
        },
    },
    {
        type: 'select',
        label: '三级类目',
        name: 'third_cat_id',
        optionListDependence: {
            name: ['first_cat_id', 'second_cat_id'],
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => getCategoryList(),
    },
];

const initialValues = {
    first_cat_id: '',
    second_cat_id: '',
    third_cat_id: '',
};

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
        queryList: getOrderConfigList,
    });

    const showOrderReviewModal = useCallback(() => {
        setConfigStatus(true);
    }, []);

    const hideOrderReviewModal = useCallback(() => {
        setConfigStatus(false);
    }, []);

    const _getCategoryList = useCallback(() => {
        return getCategoryList();
    }, []);

    const _delOrderConfig = useCallback(id => {
        delOrderConfig(id).then(res => {
            message.success('删除成功！');
            onReload();
        });
    }, []);

    const columns = useMemo<ColumnsType<IOrderConfigItem>>(() => {
        return [
            {
                title: '一级类目',
                dataIndex: 'first_cat_id',
                align: 'center',
                width: 140,
                render: (val: string) => getCategoryName(val, allCategoryList),
            },
            {
                title: '二级类目',
                dataIndex: 'second_cat_id',
                align: 'center',
                width: 140,
                render: (val: string) => getCategoryName(val, allCategoryList),
            },
            {
                title: '三级类目',
                dataIndex: 'third_cat_id',
                align: 'center',
                width: 140,
                render: (val: string) => getCategoryName(val, allCategoryList),
            },
            {
                title: '操作时间',
                dataIndex: 'last_update_time',
                align: 'center',
                width: 140,
            },
            {
                title: '操作人',
                dataIndex: 'operator',
                align: 'center',
                width: 140,
            },
            {
                title: '操作',
                dataIndex: 'id',
                align: 'center',
                width: 140,
                render: (id: string, record: IOrderConfigItem) => {
                    const { status } = record;
                    return String(status) === '0' ? (
                        <Button type="link" onClick={() => _delOrderConfig(id)}>
                            删除
                        </Button>
                    ) : (
                        <span>已失效</span>
                    );
                },
            },
        ];
    }, [allCategoryList]);

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
        _getCategoryList().then(list => setAllCategoryList(list));
    }, []);

    return useMemo(() => {
        return (
            <div className={styles.wrapper}>
                <JsonForm
                    // labelClassName={styles.formLabel}
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
                    </div>
                </JsonForm>
                <Button ghost={true} type="primary" onClick={showOrderReviewModal}>
                    <PlusOutlined />
                    新增品类
                </Button>
                <FitTable
                    bordered
                    rowKey="id"
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
                    getCategoryList={_getCategoryList}
                    onReload={onReload}
                />
            </div>
        );
    }, [loading, configStatus, allCategoryList, columns]);
};

export default PaneOrderReview;
