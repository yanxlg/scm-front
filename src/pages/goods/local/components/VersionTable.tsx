import React, { RefObject } from 'react';
import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IGoodsVersionRowItem, IOnsaleItem, ICatagoryData, IPageData } from '../version';
import ProTable from '@/components/ProTable';
import { PaginationConfig } from 'antd/es/pagination';
import VersionImgDialog from './VersionImgDialog';
import SkuDialog from './SkuDialog';
import { getCurrentPage } from '@/utils/common';

const pageSizeOptions = ['50', '100', '500', '1000'];
declare interface IVersionTableProps {
    loading: boolean;
    currentPage: number;
    pageSize: number;
    total: number;
    versionGoodsList: IGoodsVersionRowItem[];
    operationVersion(product_id: string, type: string): void;
    onSearch(pageParams?: IPageData): void;
}

declare interface VersionTableState {
    skuDialogStatus: boolean;
    versionImgDialogStatus: boolean;
    activeRow: IGoodsVersionRowItem | null;
}

class VersionTable extends React.PureComponent<IVersionTableProps, VersionTableState> {
    private skuDialogRef: RefObject<SkuDialog> = React.createRef();

    private columns: ColumnProps<IGoodsVersionRowItem>[] = [
        {
            fixed: 'left',
            key: 'goods_status',
            width: 160,
            title: '操作',
            dataIndex: 'goods_status',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                const { operationVersion } = this.props;
                let children = null;
                // UPDATED RELEASED INITIALIZED updated
                if (value !== 'RELEASED') {
                    children = (
                        <Button
                            className="btn"
                            type="primary"
                            size="small"
                            onClick={() => operationVersion(row.product_id, 'apply')}
                        >
                            上架此版本
                        </Button>
                    );
                } else {
                    children = (
                        <Button ghost={true} className="btn" type="primary" size="small">
                            当前版本
                        </Button>
                    );
                }
                return children;
            },
        },
        {
            fixed: 'left',
            key: 'product_id',
            width: 140,
            title: 'Product ID',
            dataIndex: 'product_id',
            align: 'center',
        },
        {
            key: 'goods_status',
            title: '版本状态',
            dataIndex: 'goods_status',
            align: 'center',
            width: 110,
        },
        {
            key: 'onsale_info',
            width: 100,
            title: '上架渠道',
            dataIndex: 'onsale_info',
            align: 'center',
            render: (value: IOnsaleItem[], row: IGoodsVersionRowItem) => {
                return [...new Set(value.map(item => item.onsale_channel))].map(channel => (
                    <div key={channel}>{channel}</div>
                ));
            },
        },
        {
            key: 'inventory_status',
            title: '销售状态',
            dataIndex: 'inventory_status',
            align: 'center',
            width: 100,
            render: (value: number) => {
                return value === 1 ? '可销售' : '不可销售';
            },
        },
        {
            key: 'goods_img',
            width: 120,
            title: '商品图片',
            dataIndex: 'goods_img',
            align: 'center',
            render: (value: string, row: IGoodsVersionRowItem) => {
                return (
                    <div>
                        <img src={value} />
                        <Button
                            type="link"
                            // className={isChange ? 'red' : ''}
                            block={true}
                            onClick={() => this.showImgs(row)}
                        >
                            查看详情
                        </Button>
                    </div>
                );
            },
        },
        {
            key: 'title',
            width: 200,
            title: '商品标题',
            dataIndex: 'title',
            align: 'center',
        },
        {
            key: 'description',
            width: 200,
            title: '商品描述',
            dataIndex: 'description',
            align: 'center',
        },
        {
            key: 'sku_number',
            title: 'sku数量',
            dataIndex: 'sku_number',
            align: 'center',
            width: 120,
            render: (value: number, row: IGoodsVersionRowItem) => {
                return (
                    <>
                        <div>{value}</div>
                        <Button
                            ghost={true}
                            size="small"
                            type="primary"
                            className="goods-local-img-edit"
                            onClick={() => this.showSkuDialog(row)}
                        >
                            查看sku信息
                        </Button>
                    </>
                );
            },
        },
        {
            key: 'sku_price',
            width: 140,
            title: '爬虫价格',
            dataIndex: 'sku_price',
            align: 'center',
            render: (value: number) => {
                return value ? `￥${value}` : '-';
            },
        },
        {
            key: 'sales_volume',
            width: 120,
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
        },
        {
            key: 'comments',
            width: 160,
            title: '评价数量',
            dataIndex: 'comments',
            align: 'center',
        },
        {
            key: 'first_catagory',
            width: 120,
            title: '一级类目',
            dataIndex: 'first_catagory',
            align: 'center',
            render: (value: ICatagoryData, row: IGoodsVersionRowItem) => {
                return value.name;
            },
        },
        {
            key: 'second_catagory',
            width: 120,
            title: '二级类目',
            dataIndex: 'second_catagory',
            align: 'center',
            render: (value: ICatagoryData, row: IGoodsVersionRowItem) => {
                return value.name;
            },
        },
        {
            key: 'third_catagory',
            width: 120,
            title: '三级类目',
            dataIndex: 'third_catagory',
            align: 'center',
            render: (value: ICatagoryData, row: IGoodsVersionRowItem) => {
                return value.name;
            },
        },
        {
            key: '_update_time',
            width: 180,
            title: '变更时间',
            dataIndex: '_update_time',
            align: 'center',
        },
    ];

    constructor(props: IVersionTableProps) {
        super(props);
        this.state = {
            skuDialogStatus: false,
            versionImgDialogStatus: false,
            activeRow: null,
        };
    }

    // 展示图片弹框
    showImgs = (rowData: IGoodsVersionRowItem) => {
        // console.log('showImgs', rowData);
        this.setState(
            {
                activeRow: rowData,
            },
            () => {
                this.toggleVersionImgDialog(true);
            },
        );
    };

    private toggleVersionImgDialog = (status: boolean) => {
        this.setState({
            versionImgDialogStatus: status,
        });
    };

    private showSkuDialog = (rowData: IGoodsVersionRowItem) => {
        this.setState(
            {
                activeRow: rowData,
                skuDialogStatus: true,
            },
            () => {
                this.skuDialogRef.current!.getSkuList(rowData.product_id, { page: 1 });
            },
        );
    };

    private hideSkuDialog = () => {
        this.setState({
            skuDialogStatus: false,
        });
    };

    private onChangeProTable = ({ current, pageSize }: PaginationConfig) => {
        const { currentPage, pageSize: _pageSize } = this.props;
        this.props.onSearch({
            page:
                currentPage !== current
                    ? current
                    : getCurrentPage(pageSize as number, (currentPage - 1) * _pageSize + 1),
            page_count: pageSize,
        });
    };

    private onReload = () => {
        this.props.onSearch();
    };

    render() {
        const { versionGoodsList, loading, total, currentPage, pageSize } = this.props;
        const { versionImgDialogStatus, activeRow, skuDialogStatus } = this.state;

        return (
            <>
                <ProTable<IGoodsVersionRowItem>
                    headerTitle="本地产品库版本列表"
                    className="goods-version-table"
                    rowKey="sku_id"
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    bottom={60}
                    minHeight={500}
                    pagination={{
                        total: total,
                        current: currentPage,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: pageSizeOptions,
                    }}
                    tableAlertRender={false}
                    columns={this.columns}
                    dataSource={versionGoodsList}
                    loading={loading}
                    onChange={this.onChangeProTable}
                    options={{
                        density: true,
                        fullScreen: true,
                        reload: this.onReload,
                        setting: true,
                    }}
                />
                <VersionImgDialog
                    visible={versionImgDialogStatus}
                    activeRow={activeRow}
                    toggleVersionImgDialog={this.toggleVersionImgDialog}
                />
                <SkuDialog
                    visible={skuDialogStatus}
                    ref={this.skuDialogRef}
                    currentRowData={activeRow}
                    hideSkuDialog={this.hideSkuDialog}
                />
            </>
        );
    }
}

export default VersionTable;
