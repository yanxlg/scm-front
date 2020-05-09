import React, { useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { FitTable, useList } from 'react-components';
import { queryPriceStrategyHistory } from '@/services/setting';
import { TableProps } from 'antd/es/table';
import { IPriceStrategyItem } from '@/interface/ISetting';
import { utcToLocal } from 'react-components/es/utils/date';

declare interface PriceStrategyModalProps {
    visible: string | false;
    onClose: () => void;
}
const condition: { [key: number]: string } = {
    1: '<',
    2: '=',
    3: '>',
    4: '<=',
    5: '>=',
};

const widthCondition: { [key: number]: string } = {
    1: '且',
    2: '或',
};

const columns: TableProps<IPriceStrategyItem>['columns'] = [
    {
        title: '修改日期',
        dataIndex: 'updated_time',
        width: '200px',
        align: 'center',
        render: _ => utcToLocal(_),
    },
    {
        title: '内容',
        dataIndex: 'strategy_type',
        width: '150px',
        align: 'center',
        render: _ => {
            return _ === '1' ? '价格判断公式' : '--';
        },
    },
    {
        title: '修改前',
        dataIndex: 'before_strategy_content',
        width: '250px',
        align: 'center',
        render: (_, record) => {
            if (!record.before_strategy_content) {
                return '--';
            }
            const {
                first_purchase_crawler_price_condition,
                first_sale_crawler_price_value,
                first_fix_price_value,
                middle_condition,
                second_purchase_crawler_price_condition,
                second_sale_crawler_price_value,
                second_fix_price_value,
            } = record.before_strategy_content;
            return `采购的爬虫价${condition[first_purchase_crawler_price_condition]}销售的爬虫价*${first_sale_crawler_price_value}%+$${first_fix_price_value} ${widthCondition[middle_condition]}采购的爬虫价${condition[second_purchase_crawler_price_condition]}销售的爬虫价*${second_sale_crawler_price_value}%+$${second_fix_price_value}`;
        },
    },
    {
        title: '修改后',
        dataIndex: 'end_strategy_content',
        width: '250px',
        align: 'center',
        render: (_, record) => {
            if (!record.end_strategy_content) {
                return '--';
            }
            const {
                first_purchase_crawler_price_condition,
                first_sale_crawler_price_value,
                first_fix_price_value,
                middle_condition,
                second_purchase_crawler_price_condition,
                second_sale_crawler_price_value,
                second_fix_price_value,
            } = record.end_strategy_content;
            return `采购的爬虫价${condition[first_purchase_crawler_price_condition]}销售的爬虫价*${first_sale_crawler_price_value}%+$${first_fix_price_value} ${widthCondition[middle_condition]}采购的爬虫价${condition[second_purchase_crawler_price_condition]}销售的爬虫价*${second_sale_crawler_price_value}%+$${second_fix_price_value}`;
        },
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        width: '150px',
        align: 'center',
    },
];

const scroll: TableProps<IPriceStrategyItem>['scroll'] = {
    y: 400,
    x: true,
    scrollToFirstRowOnChange: true,
};

const PriceStrategyModal = ({ visible, onClose }: PriceStrategyModalProps) => {
    const {
        loading,
        total,
        pageNumber,
        pageSize,
        dataSource,
        onChange,
        onSearch,
        setDataSource,
        setTotal,
        setPageNumber,
        setPageSize,
    } = useList({
        queryList: queryPriceStrategyHistory,
        extraQuery: {
            merchant_id: visible,
        },
        autoQuery: false,
    });

    useEffect(() => {
        if (visible) {
            setDataSource([]);
            setTotal(0);
            setPageNumber(1);
            setPageSize(50);
            onSearch();
        }
    }, [visible]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
        } as any;
    }, [loading]);

    return useMemo(() => {
        return (
            <Modal
                visible={!!visible}
                width={900}
                footer={null}
                title="价格判断公式的历史记录"
                onCancel={onClose}
            >
                <FitTable<IPriceStrategyItem>
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    scroll={scroll}
                    onChange={onChange}
                />
            </Modal>
        );
    }, [visible, loading]);
};

export default PriceStrategyModal;
