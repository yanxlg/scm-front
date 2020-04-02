import React, { RefObject } from 'react';
import { Button } from 'antd';
// import ProTable from '@/components/ProTable';
import { ProTable } from 'react-components';
import { PaginationConfig } from 'antd/es/pagination';
import { ProColumns } from 'react-components/es/ProTable';
import { Link } from 'umi';
import { AutoEnLargeImg } from 'react-components';
import ShelvesDialog from './ShelvesDialog';
import ImgEditDialog from './ImgEditDialog';
import SkuDialog from './SkuDialog';
import GoodsMergeDialog from './GoodsMergeDialog';
import PopConfirmSetAttr from './PopConfirmSetAttr';

import { IRowDataItem, IPageData } from '../index';
import { IPublishItem, ICatagoryItem } from '@/interface/ILocalGoods';
import { getCurrentPage } from '@/utils/common';
import { utcToLocal } from '@/utils/date';
import { publishStatusMap, publishStatusCode } from '@/enums/LocalGoodsEnum';

const pageSizeOptions = ['50', '100', '500', '1000'];

declare interface IProps {
    loading: boolean;
    currentPage: number;
    pageSize: number;
    total: number;
    selectedRowKeys: string[];
    goodsList: IRowDataItem[];
    allCatagoryList: ICatagoryItem[];
    onSearch(pageData?: IPageData, isRefresh?: boolean): void;
    changeSelectedRowKeys(keys: string[]): void;
}

declare interface IState {
    goodsEditDialogStatus: boolean;
    shelvesDialogStatus: boolean;
    skuDialogStatus: boolean;
    currentEditGoods: IRowDataItem | null;
    originEditGoods: IRowDataItem | null;
    publishStatusList: IPublishItem[];
}

class GoodsProTable extends React.PureComponent<IProps, IState> {
    private skuDialogRef: RefObject<SkuDialog> = React.createRef();
    private goodsMergeRef: RefObject<GoodsMergeDialog> = React.createRef();
    private columns = [
        {
            fixed: 'left',
            key: '_operation',
            title: '操作',
            align: 'center',
            width: 156,
            render: (value, row: IRowDataItem) => {
                return (
                    <>
                        <div>
                            <Button
                                type="link"
                                onClick={() => this.toggleEditGoodsDialog(true, row)}
                            >
                                编辑商品
                            </Button>
                        </div>
                        <div style={{ marginTop: -6 }}>
                            <Link to={`/goods/local/version?id=${row.commodity_id}`}>
                                <Button type="link">查看更多版本</Button>
                            </Link>
                        </div>
                    </>
                );
            },
        },
        {
            key: 'commodity_id',
            title: 'Commodity ID',
            dataIndex: 'commodity_id',
            align: 'center',
            width: 140,
        },
        {
            key: 'product_id',
            title: 'Product ID',
            dataIndex: 'product_id',
            align: 'center',
            width: 120,
            render: (value: string, row: IRowDataItem) => {
                return <div className={row.hasnew_version ? 'red' : ''}>{value}</div>;
            },
        },
        {
            key: 'product_sn',
            title: 'Product SN',
            dataIndex: 'product_sn',
            align: 'center',
            width: 140,
            render: (value: string, row: IRowDataItem) => {
                const _value = value !== '0' ? value : '';
                return (
                    <>
                        <div>{_value}</div>
                        <Button
                            // ghost={true}
                            // size="small"
                            type="link"
                            onClick={() => this.showMergeDialog(row)}
                        >
                            {_value ? '查看商品组' : '关联商品'}
                        </Button>
                    </>
                );
            },
        },
        {
            key: 'goods_status',
            title: '版本状态',
            dataIndex: 'goods_status',
            align: 'center',
            width: 110,
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
            title: '商品图片',
            dataIndex: 'goods_img',
            align: 'center',
            width: 120,
            render: (value: string, row: IRowDataItem) => {
                return <AutoEnLargeImg src={value} className="goods-local-img" />;
            },
        },
        {
            key: 'title',
            title: '商品名称',
            dataIndex: 'title',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                return <div className="text">{value}</div>;
            },
        },
        {
            key: 'xxx',
            title: '商品属性',
            dataIndex: 'xxx',
            align: 'center',
            width: 200,
            render: (value, row: IRowDataItem) => {
                return (
                    <div>
                        <div>
                            {['品牌', '大件'].map(item => (
                                <Button
                                    size="small"
                                    key={item}
                                    style={{ marginRight: 4, marginBottom: 4 }}
                                >
                                    {item}
                                </Button>
                            ))}
                        </div>
                        <PopConfirmSetAttr text="111" />
                    </div>
                );
            },
        },
        {
            key: 'first_catagory',
            title: '商品分类',
            dataIndex: 'first_catagory',
            align: 'center',
            width: 120,
            render: (value: ICatagoryItem, row: IRowDataItem) => {
                const { second_catagory, third_catagory } = row;
                return <div>{third_catagory.name || second_catagory.name || value.name || ''}</div>;
            },
        },
        {
            key: 'sku_number',
            title: 'sku数量',
            dataIndex: 'sku_number',
            align: 'center',
            width: 140,
            render: (value: number, row: IRowDataItem) => {
                return (
                    <>
                        <div>{value}</div>
                        <Button
                            type="link"
                            // className="goods-local-img-edit"
                            onClick={() => this.showSkuDialog(row)}
                        >
                            查看sku信息
                        </Button>
                    </>
                );
            },
        },
        {
            key: 'price_min',
            width: 140,
            title: '爬虫价格(￥)',
            dataIndex: 'price_min',
            align: 'center',
            render: (value: number, row: IRowDataItem) => {
                const { price_min, price_max, shipping_fee_min, shipping_fee_max } = row;
                return (
                    <div>
                        {price_min}~{price_max}
                        <div>
                            (含运费{shipping_fee_min}~{shipping_fee_max})
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'sales_volume',
            title: '销量',
            dataIndex: 'sales_volume',
            align: 'center',
            width: 100,
        },
        {
            key: 'comments',
            title: '评价数量',
            dataIndex: 'comments',
            align: 'center',
            width: 100,
        },
        {
            key: 'store_id',
            title: '店铺 id',
            dataIndex: 'store_id',
            align: 'center',
            width: 110,
        },
        {
            key: 'store_name',
            title: '店铺名称',
            dataIndex: 'store_name',
            align: 'center',
            width: 140,
        },
        {
            key: 'worm_task_id',
            title: '爬虫任务ID',
            dataIndex: 'worm_task_id',
            align: 'center',
            width: 120,
        },
        {
            key: 'worm_goods_id',
            title: '爬虫商品ID',
            dataIndex: 'worm_goods_id',
            align: 'center',
            width: 120,
        },
        // {
        //     key: 'a1',
        //     title: '采购渠道',
        //     dataIndex: 'a1',
        //     align: 'center',
        //     width: 120,
        // },
        {
            key: 'publish_status',
            title: '上架渠道',
            dataIndex: 'publish_status',
            align: 'center',
            width: 140,
            render: (value: IPublishItem[], row: IRowDataItem, index: number) => {
                const channelInfo: { [key: string]: IPublishItem } = {};
                value?.forEach(item => {
                    const { publishChannel } = item;
                    if (!channelInfo[publishChannel]) {
                        channelInfo[publishChannel] = item;
                    }
                });
                const keys = Object.keys(channelInfo);
                return keys.length > 0 ? (
                    <>
                        {keys.map(key => {
                            const { publishStatus } = channelInfo[key];
                            const _publishStatus = (publishStatus
                                ? publishStatus
                                : 0) as publishStatusCode;
                            return (
                                <div key={key}>
                                    {key}
                                    <div>({publishStatusMap[_publishStatus]})</div>
                                </div>
                            );
                        })}
                        <Button type="link" onClick={() => this.showGoodsPublist(value)}>
                            上架日志
                        </Button>
                    </>
                ) : null;
            },
        },
        {
            key: 'update_time',
            title: '更新时间',
            dataIndex: 'update_time',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return <div>{utcToLocal(value)}</div>;
            },
        },
        {
            key: 'create_time',
            title: '上传时间',
            dataIndex: 'create_time',
            align: 'center',
            width: 120,
            render: (value: number) => {
                return <div>{utcToLocal(value)}</div>;
            },
        },
        {
            key: 'worm_goodsinfo_link',
            title: '商详链接',
            dataIndex: 'worm_goodsinfo_link',
            align: 'center',
            width: 200,
            render: (value: string, row: IRowDataItem) => {
                return (
                    <a href={value} target="_blank">
                        {value}
                    </a>
                );
            },
        },
    ] as ProColumns<IRowDataItem>[];
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentEditGoods: null,
            goodsEditDialogStatus: false,
            shelvesDialogStatus: false,
            skuDialogStatus: false,
            originEditGoods: null,
            publishStatusList: [],
        };
    }

    private onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.props.changeSelectedRowKeys(selectedRowKeys as string[]);
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
        this.props.onSearch({}, true);
    };

    // 找到当前类目
    private getCurrentCatagory = (firstId: string, secondId?: string): ICatagoryItem[] => {
        const { allCatagoryList } = this.props;
        let ret: ICatagoryItem[] = [];
        const firstIndex = allCatagoryList.findIndex(item => item.id === firstId);
        ret = (allCatagoryList[firstIndex].children as ICatagoryItem[]) || [];
        if (secondId) {
            const secondIndex = ret.findIndex(item => item.id === secondId);
            ret = (ret[secondIndex].children as ICatagoryItem[]) || [];
            // ret = ret[secondIndex] ? (ret[secondIndex].children as ICategoryItem[]) : [];
        }
        // console.log('allCatagoryList', allCatagoryList);
        return ret;
    };

    // 编辑商品-弹框
    toggleEditGoodsDialog = (status: boolean, rowData?: IRowDataItem) => {
        // console.log('toggleEditGoodsDialog', rowData);
        this.setState({
            goodsEditDialogStatus: status,
            currentEditGoods: rowData ? { ...rowData } : null,
            originEditGoods: rowData ? { ...rowData } : null,
        });
    };

    // 编辑title和description
    changeGoodsText = (type: string, text: string) => {
        const { currentEditGoods } = this.state;
        // 'title' | 'description'
        this.setState({
            currentEditGoods: {
                ...(currentEditGoods as IRowDataItem),
                [type]: text,
            },
        });
    };

    // 编辑类目
    changeGoodsCatagory = (type: string, id: string) => {
        const { currentEditGoods } = this.state;
        if (type === 'first_catagory') {
            this.setState({
                currentEditGoods: {
                    ...(currentEditGoods as IRowDataItem),
                    first_catagory: {
                        id,
                    },
                    second_catagory: {},
                    third_catagory: {},
                },
            });
        } else if (type === 'second_catagory') {
            this.setState({
                currentEditGoods: {
                    ...(currentEditGoods as IRowDataItem),
                    second_catagory: { id },
                    third_catagory: {},
                },
            });
        } else {
            this.setState({
                currentEditGoods: {
                    ...(currentEditGoods as IRowDataItem),
                    third_catagory: { id },
                },
            });
        }
    };

    // 编辑图片
    changeGoodsImg = (imgList: string[]) => {
        const { currentEditGoods } = this.state;
        this.setState({
            currentEditGoods: {
                ...(currentEditGoods as IRowDataItem),
                sku_image: imgList,
            },
        });
    };

    // 重置编辑弹框
    resetGoodsData = () => {
        const { originEditGoods } = this.state;
        this.setState({
            currentEditGoods: { ...(originEditGoods as IRowDataItem) },
        });
    };

    private showSkuDialog = (rowData: IRowDataItem) => {
        this.setState(
            {
                skuDialogStatus: true,
                currentEditGoods: rowData,
            },
            () => {
                this.skuDialogRef.current!.getSkuList(rowData.product_id, { page: 1 });
            },
        );
    };

    private hideSkuDialog = () => {
        this.setState({
            skuDialogStatus: false,
            currentEditGoods: null,
        });
    };

    private showMergeDialog = (row: IRowDataItem) => {
        const { commodity_id, product_sn } = row;
        this.goodsMergeRef.current?.showModal(commodity_id, product_sn);
    };

    // 上架状态记录弹框
    toggleShelvesDialog = (status: boolean) => {
        this.setState({
            shelvesDialogStatus: status,
        });
    };

    // 查询商品上下架记录
    showGoodsPublist = (publist: IPublishItem[]) => {
        this.toggleShelvesDialog(true);
        this.setState({
            publishStatusList: publist.map(
                (item: IPublishItem, index: number): IPublishItem => {
                    return {
                        ...item,
                        serialNum: index + 1,
                    };
                },
            ),
        });
    };

    // 编辑图片弹框
    toggleImgEditDialog = (status: boolean, imgList?: string[], product_id?: string) => {
        this.setState({
            goodsEditDialogStatus: status,
        });
    };

    render() {
        const {
            selectedRowKeys,
            currentPage,
            pageSize,
            total,
            goodsList,
            loading,
            allCatagoryList,
        } = this.props;
        const {
            goodsEditDialogStatus,
            shelvesDialogStatus,
            skuDialogStatus,
            originEditGoods,
            currentEditGoods,
            publishStatusList,
        } = this.state;
        return (
            <>
                <ProTable<IRowDataItem>
                    // optimize={false}
                    headerTitle="本地产品库列表"
                    rowKey="product_id"
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    bottom={60}
                    minHeight={500}
                    rowSelection={{
                        fixed: true,
                        columnWidth: 60,
                        selectedRowKeys: selectedRowKeys,
                        onChange: this.onSelectChange,
                    }}
                    pagination={{
                        total: total,
                        current: currentPage,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: pageSizeOptions,
                    }}
                    // toolBarRender={false}
                    tableAlertRender={false}
                    columns={this.columns}
                    dataSource={goodsList}
                    loading={loading}
                    onChange={this.onChangeProTable}
                    options={{
                        density: true,
                        fullScreen: true,
                        reload: this.onReload,
                        setting: true,
                    }}
                />
                <ShelvesDialog
                    visible={shelvesDialogStatus}
                    publishStatusList={publishStatusList}
                    toggleShelvesDialog={this.toggleShelvesDialog}
                />
                <ImgEditDialog
                    visible={goodsEditDialogStatus}
                    originEditGoods={originEditGoods}
                    currentEditGoods={currentEditGoods}
                    allCatagoryList={allCatagoryList}
                    toggleEditGoodsDialog={this.toggleEditGoodsDialog}
                    getCurrentCatagory={this.getCurrentCatagory}
                    changeGoodsText={this.changeGoodsText}
                    changeGoodsCatagory={this.changeGoodsCatagory}
                    changeGoodsImg={this.changeGoodsImg}
                    resetGoodsData={this.resetGoodsData}
                    onSearch={this.props.onSearch}
                />
                <SkuDialog
                    visible={skuDialogStatus}
                    ref={this.skuDialogRef}
                    currentRowData={currentEditGoods}
                    hideSkuDialog={this.hideSkuDialog}
                />
                <GoodsMergeDialog onReload={this.onReload} ref={this.goodsMergeRef} />
            </>
        );
    }
}

export default GoodsProTable;
