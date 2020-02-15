/**
 * Routes:
 *   - ./src/routes/PrivateRoute.tsx
 */

import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form } from '@/components/Form';
import SearchCondition from '@/pages/goods/vova/components/SearchCondition';
import DataStatusUpdate from '@/pages/goods/vova/components/DataStatusUpdate';
import GoodsTable from '@/pages/goods/vova/components/GoodsTable';
import { PropertyItem } from '@/pages/goods/vova/components/DataStatusUpdate';
import { getVovaGoodsList, getChangedProperties } from '@/services/VovaGoodsService';
import '@/styles/index.less';
import './index.less';

declare interface IPros extends FormComponentProps<any> {

}

declare interface IState {
    goodsList: Array<IRowDataItem>;
    propertyList: PropertyItem[];
    dataLoading: Boolean;
    searchLoading: Boolean;
    allCount: number;
    page: number,
    pageCount: number;
}

declare interface IBaseData {
    page: number;
    pageCount: number;
    commodity_id: string;
    vova_virtual_id: string;
    product_id: string;
    shop_name: string;
    evaluate_volume: number;
    average_score: number;
    sales_volume: number;
    product_detail: string;
    product_status: number;
    shipping_refund_rate: number; // 物流原因退款率
    non_shipping_refund_rate: number; // 非物流原因退款率
    vova_product_link: string; // 商品跳转到vova前端的链接
    level_two_category: string;
    level_one_category: string;
    sku_pics: string;
}

export declare interface IRowDataItem extends IBaseData {
    _rowspan?: number;
}

class _Index extends Form.BaseForm<IPros, IState> {
    constructor(props: IPros) {
        super(props);
        this.state = {
            goodsList: [],
            propertyList: [],
            dataLoading: false,
            searchLoading: false,
            allCount: 0,
            page: 1,
            pageCount: 10,
        };
    }

    componentDidMount() {
        getChangedProperties().then(res => {
            if (res.code === 200) {
                this.setState({
                    propertyList: res.data.changed_property_list
                });
            }
        })
    }

    onSearch = (current: number, size: number):void => {
        const { dataLoading } = this.state;
        if (dataLoading) return;
        this.setState({
            page: current,
            pageCount: size,
            dataLoading: true,
            searchLoading: true
        });
        getVovaGoodsList({
            page: current || 1,
            page_count: size || 10,
            ...this.props.form.getFieldsValue() as any
        }).then(res => {
            if (res.code === 200) {
                const data = res.data
                this.setState({
                    goodsList: data.list,
                    allCount: data.all_count
                });
            }
        }).finally(() => {
            this.setState({
                dataLoading: false,
                searchLoading:false
            });
        })
    }

    // 查看详情弹窗
    toggleDetailDialog = (row: IRowDataItem) => {

    }

    setPage = (page: number) => {
        this.setState({
            page: page,
        })
    }

    setPageCount = (pageCount: number) => {
        this.setState({
            pageCount: pageCount,
        })
    }

    render() {
        const { form } = this.props;
        const { goodsList, propertyList, allCount } = this.state;
        return (
            <div className="container">
                <Form className="form-help-absolute" layout="inline" autoComplete={'off'}>
                    <SearchCondition form={form} onSearch={this.onSearch} />
                    <DataStatusUpdate propertyList={propertyList} />
                    <GoodsTable 
                        goodsList={goodsList}
                        allCount={allCount}
                        toggleDetailDialog={this.toggleDetailDialog}
                        onSearch={this.onSearch}
                    />
                </Form>
            </div>
        );
    }
}

const Index = Form.create()(_Index);

export default Index;
