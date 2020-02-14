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
import { getVovaGoodsList } from '@/services/VovaGoodsService';
import '@/styles/index.less';
import './index.less';

declare interface IPros extends FormComponentProps<any> {

}

declare interface IState {
    goodsList: Array<IRowDataItem>;
    dataLoading: Boolean;
    searchLoading: Boolean;
    allCount: number;
}

declare interface IBaseData {
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
            dataLoading: false,
            searchLoading: false,
        }
    }

    onSearch = ():void => {
        const { dataLoading } = this.state;
        if (dataLoading) return;
        this.setState({
            dataLoading: true,
            searchLoading: true
        });
        getVovaGoodsList(this.props.form as any).then(res => {
            if (res.code === 0) {
                const data = res.data
                this.setState({
                    goodsList: data.list,
                    allCount: data.all_count
                })
            }
        }).finally(() => {
            this.setState({
                dataLoading: false,
                searchLoading:false
            });
        })
    }

    // 查看详情弹窗
    toggleDetailDialog = (commodityId: string) => {

    }

    render() {
        const { form } = this.props;
        const { goodsList, allCount } = this.state;
        return (
            <div className="container">
                <Form className="form-help-absolute" layout="inline" autoComplete={'off'}>
                    <SearchCondition form={form} onSearch={this.onSearch} />
                    <DataStatusUpdate />
                    <GoodsTable 
                        goodsList={goodsList}
                        allCount={allCount}
                        toggleDetailDialog={this.toggleDetailDialog}
                    />
                </Form>
            </div>
        );
    }
}

const Index = Form.create()(_Index);

export default Index;
