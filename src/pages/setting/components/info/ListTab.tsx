import React, { useCallback, useMemo, useRef } from 'react';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { JsonForm, LoadingButton } from 'react-components';
import formStyles from 'react-components/es/JsonForm/_form.less';
import queryString from 'query-string';
import { isEmptyObject } from '@/utils/utils';
import { defaultPageNumber, defaultPageSize } from '@/config/global';
import { useList } from '@/utils/hooks';
import { queryCustomList } from '@/services/setting';
import { ICustomItem, ICustomListQuery } from '@/interface/ISetting';
import ProTable from '@/components/ProTable';
import CopyLink from '@/components/copyLink';
import { ProColumns } from 'react-components/es/ProTable';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';
import { getCatagoryList } from '@/services/goods';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import settingStyles from '@/styles/_setting.less';

const ListTab: React.FC = () => {
    const searchRef = useRef<JsonFormRef>(null);
    const categoryRef = useRef<Promise<IOptionItem[]>>();

    if (!categoryRef.current) {
        categoryRef.current = getCatagoryList()
            .then(({ convertList = [] }) => {
                return convertList;
            })
            .catch(() => {
                return [];
            });
    }

    const formConfig: FormField[] = [
        {
            label: '一级品类',
            type: 'select',
            name: 'one_cat_id',
            formItemClassName: formStyles.formItem,
            optionList: () => categoryRef.current!,
            syncDefaultOption: {
                name: '全部',
                value: '',
            },
            onChange: (name, form) => {
                form.resetFields(['two_cat_id', 'three_cat_id']);
            },
        },
        {
            label: '二级品类',
            type: 'select',
            name: 'two_cat_id',
            formItemClassName: formStyles.formItem,
            optionListDependence: {
                name: 'one_cat_id',
                key: 'children',
            },
            syncDefaultOption: {
                name: '全部',
                value: '',
            },
            optionList: () => categoryRef.current!,
            onChange: (name, form) => {
                form.resetFields(['three_cat_id']);
            },
        },
        {
            label: '三级品类',
            type: 'select',
            name: 'three_cat_id',
            formItemClassName: formStyles.formItem,
            optionListDependence: {
                name: ['one_cat_id', 'two_cat_id'],
                key: 'children',
            },
            syncDefaultOption: {
                name: '全部',
                value: '',
            },
            optionList: () => categoryRef.current!,
        },
    ];

    const {
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onSearch,
        onReload,
        onChange,
    } = useList<ICustomItem, ICustomListQuery>({
        queryList: queryCustomList,
        formRef: searchRef,
    });

    const columns = useMemo(() => {
        return [
            {
                title: '中台一级品类',
                dataIndex: 'oneCatName',
                align: 'center',
                width: '150px',
            },
            {
                title: '中台二级品类',
                width: '150px',
                dataIndex: 'twoCatName',
                align: 'center',
            },
            {
                title: '中台三级品类',
                width: '150px',
                dataIndex: 'threeCatName',
                align: 'center',
            },
            {
                title: '重量（g）',
                dataIndex: 'weight',
                width: '178px',
                align: 'center',
            },
            {
                title: '国家',
                dataIndex: 'countryName',
                width: '130px',
                align: 'center',
            },
            {
                title: '海关代码',
                dataIndex: 'customsCode',
                width: '223px',
                align: 'center',
            },
            {
                title: '长度（cm）',
                dataIndex: 'length',
                width: '223px',
                align: 'center',
            },
            {
                title: '宽度（cm）',
                dataIndex: 'width',
                width: '223px',
                align: 'center',
            },
            {
                title: '高度（cm）',
                dataIndex: 'height',
                width: '182px',
                align: 'center',
            },
            {
                title: '是否含电',
                dataIndex: 'isElectricity',
                width: '223px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否金属',
                dataIndex: 'isMetal',
                width: '223px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否液体',
                dataIndex: 'isLiquid',
                width: '223px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否可燃',
                dataIndex: 'isCombustible',
                width: '200px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否粉末',
                dataIndex: 'isPowder',
                width: '200px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否纯电',
                dataIndex: 'isBattery',
                width: '200px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否香水',
                dataIndex: 'isPerfume',
                width: '200px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否食品',
                dataIndex: 'isFood',
                width: '200px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
            {
                title: '是否膏状',
                dataIndex: 'isPaste',
                width: '200px',
                align: 'center',
                render: (_: any) => {
                    return _ === true ? (
                        <CheckOutlined className={settingStyles.checkedIcon} />
                    ) : (
                        <CloseOutlined className={settingStyles.uncheckedIcon} />
                    );
                },
            },
        ] as ProColumns<ICustomItem>[];
    }, []);

    return useMemo(() => {
        return (
            <div>
                <JsonForm
                    fieldList={formConfig}
                    ref={searchRef}
                    initialValues={{
                        one_cat_id: '',
                        two_cat_id: '',
                        three_cat_id: '',
                    }}
                >
                    <LoadingButton
                        onClick={onSearch}
                        type="primary"
                        className={formStyles.formItem}
                    >
                        查询
                    </LoadingButton>
                </JsonForm>
                <ProTable<ICustomItem>
                    headerTitle="查询表格"
                    className={formStyles.formItem}
                    rowKey="countryCode"
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    bottom={60}
                    minHeight={500}
                    pagination={{
                        total: total,
                        current: pageNumber,
                        pageSize: pageSize,
                        showSizeChanger: true,
                    }}
                    tableAlertRender={false}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    onChange={onChange}
                    options={{
                        density: true,
                        fullScreen: true,
                        reload: onReload,
                        setting: true,
                    }}
                />
            </div>
        );
    }, [loading]);
};

export default ListTab;
