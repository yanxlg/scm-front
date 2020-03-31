import React, { useCallback, useMemo, useRef } from 'react';
import SearchForm, { FormField, SearchFormRef } from '@/components/SearchForm';
import formStyles from '@/styles/_form.less';
import queryString from 'query-string';
import { isEmptyObject } from '@/utils/utils';
import { defaultPageNumber, defaultPageSize } from '@/config/global';
import { useList } from '@/utils/hooks';
import { queryCustomDeclarationList } from '@/services/setting';
import { ICustomDeclarationListItem, ICustomDeclarationListQuery } from '@/interface/ISetting';
import ProTable from '@/components/ProTable';
import CopyLink from '@/components/copyLink';
import { ProColumns } from '@/components/OptimizeProTable';

const formConfig: FormField[] = [
    {
        label: '一级品类',
        name: 'category_level_one',
        type: 'select',
        rules: [
            {
                required: true,
                message: '请选择一级品类',
            },
        ],
        formItemClassName: formStyles.formItem,
        className: formStyles.formItemDefault,
    },
    {
        label: '二级品类',
        name: 'category_level_two',
        type: 'select',
        rules: [
            {
                required: true,
                message: '请选择二级品类',
            },
        ],
        formItemClassName: formStyles.formItem,
        className: formStyles.formItemDefault,
    },
    {
        label: '三级品类',
        name: 'category_level_three',
        type: 'select',
        rules: [
            {
                required: true,
                message: '请选择三级品类',
            },
        ],
        formItemClassName: formStyles.formItem,
        className: formStyles.formItemDefault,
    },
];

const ListTab: React.FC = () => {
    const searchRef = useRef<SearchFormRef>(null);

    const {
        pageSize: page_size,
        pageNumber: page_number,
        ...defaultInitialValues
    } = useMemo(() => {
        // copy link 解析
        const { query, url } = queryString.parseUrl(window.location.href);
        if (!isEmptyObject(query)) {
            window.history.replaceState({}, '', url);
        }

        const {
            pageNumber = defaultPageNumber,
            pageSize = defaultPageSize,
            category_level_one = '',
            category_level_two = '',
            category_level_three = '',
        } = query;
        return {
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            category_level_one,
            category_level_two,
            category_level_three,
        };
    }, []);

    const {
        query,
        loading,
        pageNumber,
        pageSize,
        dataSource,
        total,
        onSearch,
        onReload,
        onChange,
    } = useList<ICustomDeclarationListItem, ICustomDeclarationListQuery>({
        queryList: queryCustomDeclarationList,
        formRef: searchRef,
        defaultState: {
            pageSize: page_size,
            pageNumber: page_number,
        },
    });

    const columns = useMemo(() => {
        return [
            {
                title: '中台一级品类',
                dataIndex: 'category_level_one',
                align: 'center',
                width: '150px',
            },
            {
                title: '中台二级品类',
                width: '100px',
                dataIndex: 'category_level_two',
                align: 'center',
            },
            {
                title: '中台三级品类',
                width: '200px',
                dataIndex: 'category_level_three',
                align: 'center',
            },
            {
                title: '重量',
                dataIndex: 'weight',
                width: '178px',
                align: 'center',
            },
            {
                title: '国家',
                dataIndex: 'country',
                width: '130px',
                align: 'center',
            },
            {
                title: '海关代码',
                dataIndex: 'customs_code',
                width: '223px',
                align: 'center',
            },
            {
                title: '长度',
                dataIndex: 'length',
                width: '223px',
                align: 'center',
            },
            {
                title: '宽度',
                dataIndex: 'width',
                width: '223px',
                align: 'center',
            },
            {
                title: '高度',
                dataIndex: 'height',
                width: '182px',
                align: 'center',
            },
            {
                title: '是否含电',
                dataIndex: 'is_electricity',
                width: '223px',
                align: 'center',
            },
            {
                title: '是否金属',
                dataIndex: 'is_metal',
                width: '223px',
                align: 'center',
            },
            {
                title: '是否液体',
                dataIndex: 'is_fluid',
                width: '223px',
                align: 'center',
            },
            {
                title: '是否可燃',
                dataIndex: 'is_burn',
                width: '200px',
                align: 'center',
            },
            {
                title: '是否粉末',
                dataIndex: 'is_powder',
                width: '200px',
                align: 'center',
            },
            {
                title: '是否纯电',
                dataIndex: 'is_pure_electric',
                width: '200px',
                align: 'center',
            },
            {
                title: '是否香水',
                dataIndex: 'is_perfume',
                width: '200px',
                align: 'center',
            },
            {
                title: '是否食品',
                dataIndex: 'is_food',
                width: '200px',
                align: 'center',
            },
            {
                title: '是否膏状',
                dataIndex: 'is_paste',
                width: '200px',
                align: 'center',
            },
        ] as ProColumns<ICustomDeclarationListItem>[];
    }, []);

    const getCopiedLinkQuery = useCallback(() => {
        return query;
    }, []);

    return useMemo(() => {
        return (
            <div>
                <SearchForm fieldList={formConfig} ref={searchRef} />
                <ProTable<ICustomDeclarationListItem>
                    search={false}
                    headerTitle="查询表格"
                    rowKey="task_id"
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    bottom={60}
                    minHeight={500}
                    pagination={{
                        total: total,
                        current: pageNumber,
                        pageSize: pageSize,
                        showSizeChanger: true,
                    }}
                    toolBarRender={false}
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
                <CopyLink getCopiedLinkQuery={getCopiedLinkQuery} />
            </div>
        );
    }, [loading]);
};

export default ListTab;
