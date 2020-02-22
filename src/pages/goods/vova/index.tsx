/**
 * Routes:
 *   - ./src/routes/PrivateRoute.tsx
 */

import React, { RefObject } from 'react';
import SearchCondition from './components/SearchCondition';
import DataStatusUpdate from './components/DataStatusUpdate';
import ExcelDialog from './components/ExcelDialog';
import {
    getVovaGoodsList,
    postVovaGoodsListExport, putVovaGoodsSales,
} from '@/services/VovaGoodsService';
import '@/styles/index.less';
import './index.less';
import { Modal, message, Button, Pagination } from 'antd';
import ProductEditModal from './components/ProductEditModal';
import {BindAll} from 'lodash-decorators';
import { FitTable } from '@/components/FitTable';
import { ColumnProps } from 'antd/es/table';

declare interface IVoVaListState {
    dataSet: Array<IRowDataItem>;
    dataLoading: boolean;
    searchLoading: boolean;
    excelDialogStatus: boolean;
    pageNumber: number;
    page: number;
    total: number;
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



@BindAll()
class Index extends React.PureComponent<{}, IVoVaListState> {
    private formRef:RefObject<SearchCondition> = React.createRef();
    constructor(props: {}) {
        super(props);
        this.state = {
            dataSet: [],
            dataLoading: false,
            searchLoading: false,
            total: 0,
            pageNumber: 50,
            page: 1,
            excelDialogStatus: false,
        };
    }

    componentDidMount() {
        this.onSearch();
    }

    private queryList(
        params: { page?: number; page_number?: number; searchLoading?: boolean } = {},
    ) {
        const {
            page = this.state.page,
            page_number = this.state.pageNumber,
            searchLoading = false,
        } = params;
        const values = this.formRef.current!.getFieldsValue();
        this.setState({
            dataLoading: true,
            searchLoading,
        });
        getVovaGoodsList({
            page: page,
            page_count: page_number,
            ...values,
        }).then(({data:{list=[],total=0}}) => {
            this.setState({
                page: page,
                pageNumber: page_number,
                dataSet: list,
                total,
            });
        }).finally(() => {
            this.setState({
                dataLoading: false,
                searchLoading:false
            });
        });
    }

    private onSearch(){
        this.queryList({
            searchLoading: true,
            page: 1,
        });
    };

    // 上架操作
    private onShelves(row: IRowDataItem){
        putVovaGoodsSales({
            type: 'onsale',
            info: {
                product_id: row.product_id,
                commodity_id: row.commodity_id,
                sale_domain: 'vova'
            }
        }).then(res => {
            message.success('上架成功');
        }).catch(()=>{
            message.success('上架失败');
        })
    }

    // 下架操作
    private offShelves(row: IRowDataItem){
        putVovaGoodsSales({
            type: 'offsale',
            info: {
                product_id: row.product_id,
                commodity_id: row.commodity_id,
                sale_domain: 'vova'
            }
        }).then(res => {
            message.success('下架成功');
        }).catch(()=>{
            message.error('下架失败');
        })
    }

    private columns: ColumnProps<IRowDataItem>[] = [
        {
            key: 'storeName',
            title: '店铺名称',
            dataIndex: 'shop_name',
            align: 'center',
            width: 130,
        },
        {
            key: 'virtualGoodsId',
            title: '虚拟ID',
            dataIndex: 'vova_virtual_id',
            align: 'center',
            width: 100,
        },
        {
            key: 'goodsImg',
            title: '商品图片',
            dataIndex: 'sku_pics',
            align: 'center',
            width: 100,
            render: (value: string, row: IRowDataItem, index: number) => (
                <img className="goods-vova-img" src={row.sku_pics} />
            )
        },
        {
            key: 'commodityId',
            title: 'Commodity_ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 130,
        },
        {
            key: 'productId',
            title: 'Product_ID',
            dataIndex: 'product_id',
            align: 'center',
            width: 130,
        },
        {
            key: 'salesVolume',
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            width: 100,
        },
        {
            key: 'productDetail',
            title: '商品详情',
            dataIndex: 'product_detail',
            align: 'center',
            width: 150,
            render: (value: string, row: IRowDataItem, index: number) => {
                return <Button onClick={() => { this.toggleDetailDialog(row) }}>查看详情</Button>
            }
        },
        {
            key: 'evaluateVolume',
            title: '评价数量',
            dataIndex: 'evaluate_volume',
            align: 'center',
            width: 100,
        },
        {
            key: 'averageScore',
            title: '平均评分',
            dataIndex: 'average_score',
            align: 'center',
            width: 100,
        },
        {
            key: 'levelOneCategory',
            title: '一级类目',
            dataIndex: 'level_one_category',
            align: 'center',
            width: 100,
        },
        {
            key: 'levelTwoCategory',
            title: '二级类目',
            dataIndex: 'level_two_category',
            align: 'center',
            width: 100,
        },
        {
            key: 'productStatus',
            title: '商品状态',
            dataIndex: 'product_status',
            align: 'center',
            width: 100,
            render: status => {
                return status === 1?"已上架":status===2?"待上架":status===3?"已下架":"";
            }
        },
        {
            key: 'vovaProductLink',
            title: '链接',
            dataIndex: 'vova_product_link',
            align: 'center',
            width: 100,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'product_status',
            align: 'center',
            width: 100,
            render: row => {
                return {
                    children: (
                        <>
                            <Button className="shelves-btn" onClick={() => { this.onShelves(row) }} disabled={row !== 3}>上架</Button>
                            <Button className="unshelves-btn" onClick={() => { this.offShelves(row) }} disabled={row !== 1}>下架</Button>
                        </>
                    )
                };
            }
        }
    ];

    private showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }
    private onPageChange(page: number, pageSize?: number) {
        this.queryList({
            page: page,
        });
    }
    private onShowSizeChange(page: number, size: number) {
        this.queryList({
            page: page,
            page_number: size,
        });
    }

    // 显示下载弹框
    toggleExcelDialog = (status: boolean) => {
        this.setState({
            excelDialogStatus: status,
        });
    };

    private getExcelData(pageNumber: number,pageSize:number){
        const values = this.formRef.current!.getFieldsValue();
        postVovaGoodsListExport({
            page: pageNumber,
            page_count: pageSize,
            ...values,
        }).catch(err => {
            message.error('导出表格失败！');
        }).finally(() => {
            this.toggleExcelDialog(false);
        });
    }

    // 查看详情弹窗
    private toggleDetailDialog(row: IRowDataItem){
        Modal.info({
            className: 'product-modal modal-empty',
            icon: null,
            title: '查看/编辑商品详情',
            cancelText: null,
            okText: null,
            content: <ProductEditModal product_id={row.product_id} channel="vova" />,
            maskClosable:true
        });
    }

    render() {
        const { dataSet, total, excelDialogStatus, dataLoading,page,pageNumber } = this.state;
        return (
            <div className="container">
                <SearchCondition
                    ref={this.formRef}
                    onSearch={this.onSearch}
                    toggleExcelDialog={this.toggleExcelDialog}
                />
                <DataStatusUpdate/>
                <div className="float-clear">
                    <Pagination
                        className="float-right"
                        pageSize={pageNumber}
                        current={page}
                        total={total}
                        pageSizeOptions={['50','100','500','1000']}
                        onChange={this.onPageChange}
                        onShowSizeChange={this.onShowSizeChange}
                        showSizeChanger={true}
                        showQuickJumper={{
                            goButton: <Button className="btn-go">Go</Button>,
                        }}
                        showLessItems={true}
                        showTotal={this.showTotal}
                    />
                </div>
                <FitTable
                    className="form-item goods-vova-table"
                    rowKey="scmSkuSn"
                    bordered={true}
                    columns={this.columns}
                    dataSource={dataSet}
                    pagination={false}
                    loading={dataLoading}
                    scroll={{
                        x: 1500,
                        scrollToFirstRowOnChange: true,
                    }}
                    bottom={100}
                />
                <ExcelDialog
                    visible={excelDialogStatus}
                    total={total}
                    getExcelData={this.getExcelData}
                    toggleExcelDialog={this.toggleExcelDialog}
                />
            </div>
        );
    }
}


export default Index;
