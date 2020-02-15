import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form } from '@/components/Form';
import SearchCondition from './components/SearchCondition';
import DataStatusUpdate from './components/DataStatusUpdate';
import GoodsTable from './components/GoodsTable';
import ExcelDialog from './components/ExcelDialog';
import { PropertyItem } from './components/DataStatusUpdate';
import { SelectOptionsItem } from './components/SearchCondition';
import {
    IFilterParams,
    getVovaGoodsList,
    getVovaChangedProperties,
    getSearchConditionOptions,
    postVovaGoodsListExport
} from '@/services/VovaGoodsService';
import '@/styles/index.less';
import './index.less';
import { Modal, message } from 'antd';
import ProductEditModal from './components/ProductEditModal';

declare interface IPros extends FormComponentProps<any> {

}

declare interface IState {
    goodsList: Array<IRowDataItem>;
    propertyList: PropertyItem[];
    searchOptions: SelectOptionsItem[];
    dataLoading: boolean;
    searchLoading: boolean;
    allCount: number;
    excelDialogStataus: boolean;
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
    goodsTableRef: GoodsTable | null = null;
    constructor(props: IPros) {
        super(props);
        this.state = {
            goodsList: [],
            propertyList: [],
            searchOptions: [],
            dataLoading: false,
            searchLoading: false,
            allCount: 0,
            excelDialogStataus: false,
        };
    }

    componentDidMount() {
        getSearchConditionOptions().then(res => {
            if (res.code === 200) {
                this.setState({
                    searchOptions: res.data
                });
            }
        });
        getVovaChangedProperties().then(res => {
            if (res.code === 200) {
                this.setState({
                    propertyList: res.data.changed_property_list
                });
            }
        });
        this.onSearch();
    }

    onSearch = (current?: number, size?: number) => {
        const { dataLoading } = this.state;
        const { form } = this.props;
        const formData = form.getFieldsValue()
        if (dataLoading) return;
        this.setState({
            dataLoading: true,
            searchLoading: true
        });
        let param: IFilterParams = {} as IFilterParams;
        if (this.goodsTableRef) {
            const { page, pageCount } = this.goodsTableRef.state;
            param = {
                page: current || page || 1,
                page_count: size || pageCount || 10,
            };
        }
        if (formData.time) {
            param = Object.assign(param, {
                onshelf_time_satrt: parseInt(formData.time[0]._d.getTime() / 1000),
                onshelf_time_end: parseInt(formData.time[1]._d.getTime() / 1000),
            });
        }
        param = Object.assign(param, {
            commodity_id: formData.commodity_id,
            vova_virtual_id: formData.vova_virtual_id,
            product_id: formData.product_id,
            level_one_category: formData.level_one_category,
            level_two_category: formData.level_two_category,
            sales_volume: formData.sales_volume,
            shop_name: formData.shop_name,
            product_status: formData.product_status,
        })
        getVovaGoodsList(param).then(res => {
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

    // 显示下载弹框
    toggleExcelDialog = (status: boolean) => {
        this.setState({
            excelDialogStataus: status,
        });
    };

    getExcelData = (count: number) => {
        const formData = this.props.form.getFieldsValue();
        let param: IFilterParams = {} as IFilterParams;
        if (this.goodsTableRef) {
            const { pageCount } = this.goodsTableRef.state;
            param = {
                page: count || 1,
                page_count: pageCount || 10,
            };
        }
        if (formData.time) {
            param = Object.assign(param, {
                onshelf_time_satrt: parseInt(formData.time[0]._d.getTime() / 1000),
                onshelf_time_end: parseInt(formData.time[1]._d.getTime() / 1000),
            });
        }
        param = Object.assign(param, {
            commodity_id: formData.commodity_id,
            vova_virtual_id: formData.vova_virtual_id,
            product_id: formData.product_id,
            level_one_category: formData.level_one_category,
            level_two_category: formData.level_two_category,
            sales_volume: formData.sales_volume,
            shop_name: formData.shop_name,
            product_status: formData.product_status,
        })
        postVovaGoodsListExport(param).catch(err => {
            message.error('导出表格失败！');
        }).finally(() => {
            this.toggleExcelDialog(false);
        });
    }

    // 查看详情弹窗
    toggleDetailDialog = (row: IRowDataItem) => {
        Modal.info({
            className: 'product-modal modal-empty',
            icon: null,
            title: '查看/编辑商品详情',
            cancelText: null,
            okText: null,
            content: <ProductEditModal product_id={row.product_id} channel="vova" />,
        });
    }

    render() {
        const { form } = this.props;
        const { goodsList, propertyList, allCount, searchOptions, excelDialogStataus } = this.state;
        return (
            <div className="container">
                <Form className="form-help-absolute" layout="inline" autoComplete={'off'}>
                    <SearchCondition 
                        form={form}
                        onSearch={this.onSearch}
                        toggleExcelDialog={this.toggleExcelDialog}
                        searchOptions={searchOptions} />
                    <DataStatusUpdate propertyList={propertyList} />
                    <GoodsTable
                        ref={node => (this.goodsTableRef = node)}
                        goodsList={goodsList}
                        allCount={allCount}
                        toggleDetailDialog={this.toggleDetailDialog}
                        onSearch={this.onSearch}
                    />
                    <ExcelDialog
                        visible={excelDialogStataus}
                        allCount={allCount}
                        getExcelData={this.getExcelData}
                        toggleExcelDialog={this.toggleExcelDialog}
                    />
                </Form>
            </div>
        );
    }
}

const Index = Form.create()(_Index);

export default Index;
