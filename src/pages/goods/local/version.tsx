import React from 'react';
import { DatePicker, Button, message, Pagination } from 'antd';
// import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { RangeValue } from 'rc-picker/lib/interface';
import moment from 'moment';

import VersionTable from './components/VersionTable';
import { getCurrentPage } from '@/utils/common';

import '../../../styles/goods-version.less';

import {
    getGoodsVersion,
    postGoodsVersionExport,
    postGoodsOnsale,
    postGoodsIgnoreVersion,
} from '@/services/goods';
import { utcToLocal, transStartDate, transEndDate } from '@/utils/date';

const { RangePicker } = DatePicker;

declare interface IVersionProps {
    location: any;
}

declare interface IPageData {
    page?: number;
    page_count?: number;
}

export declare interface IOnsaleItem {
    onsale_channel: string;
    onsale_time: number;
}

export declare interface ISkuStyle {
    [key: string]: string;
}

declare interface ISkuItem {
    sku_id: string;
    origin_sku_id: string;
    sku_style: ISkuStyle;
    sku_price: number;
    sku_weight: number;
    sku_inventory: number;
}

export declare interface ICatagoryData {
    id?: string;
    name?: string;
}

declare interface IGoodsVersionItemBase {
    product_id: string;
    commodity_id: string;
    onsale_info: IOnsaleItem[];
    sku_image: string[];
    title: string;
    description: string;
    goods_img: string;
    goods_status: string;
    sales_volume: number;
    comments: number;
    first_catagory: ICatagoryData;
    second_catagory: ICatagoryData;
    third_catagory: ICatagoryData;
    update_time: number;
    worm_goods_id: string;
    worm_goodsinfo_link: string;
    _update_time?: string;
}

declare interface IGoodsVersionItem extends IGoodsVersionItemBase {
    sku_info: ISkuItem[];
}

export declare interface IGoodsVersionRowItem extends IGoodsVersionItemBase, ISkuItem {}

declare interface IGoodsVersionBase {
    title: string;
    goods_url: string;
    main_image_url: string;
    goods_id: number;
    source_goods_id: number;
    flatform: string;
    collection_time: string;
    first_catagory: ICatagoryData;
    second_catagory: ICatagoryData;
    third_catagory: ICatagoryData;
}

declare interface IVersionState {
    loading: boolean;
    start_time: number;
    end_time: number;
    page: number;
    page_count: number;
    allCount: number;
    currentInfo: IGoodsVersionRowItem | null;
    versionGoodsList: IGoodsVersionRowItem[];
}

const pageSizeOptions = ['50', '100', '500', '1000'];

class Version extends React.PureComponent<IVersionProps, IVersionState> {
    id: string = '';

    constructor(props: IVersionProps) {
        super(props);
        this.state = {
            loading: false,
            end_time: 0,
            start_time: 0,
            page: 1,
            page_count: 50,
            allCount: 0,
            currentInfo: null,
            versionGoodsList: [],
        };
    }

    componentDidMount(): void {
        this.id = this.props.location.query.id;
        this.onSearch();
        this.searchReleasedGoods();
        // console.log();
    }

    private onSearch = (pageData?: IPageData) => {
        const { start_time, end_time, page, page_count } = this.state;
        this.setState({
            loading: true,
        });
        const data = Object.assign(
            {
                page,
                page_count,
                start_time: start_time ? start_time : undefined,
                end_time: end_time ? end_time : undefined,
                commodity_id: this.id,
            },
            pageData ? pageData : {},
        );
        return getGoodsVersion(data)
            .then(res => {
                // const { goods_version_list, ...rest } = res.data;
                const { list, all_count } = res.data;
                const goodsList = this.addRowSpanData(list);
                // const index = goodsList.findIndex(goodsList => goodsList.goods_status === 'RELEASED');
                this.setState({
                    allCount: all_count,
                    page: data.page,
                    page_count: data.page_count,
                    versionGoodsList: goodsList,
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 获取RELEASED状态商品
    private searchReleasedGoods = () => {
        getGoodsVersion({
            page: 1,
            page_count: 50,
            commodity_id: this.id,
            product_status: [5],
        }).then(res => {
            const { list } = res.data;
            const goodsList = this.addRowSpanData(list);
            // console.log('goodsList', goodsList);
            this.setState({
                currentInfo: goodsList[0] || null,
            });
        });
    };

    // 处理表格数据，用于合并单元格
    private addRowSpanData(list: IGoodsVersionItem[]): IGoodsVersionRowItem[] {
        let ret: IGoodsVersionRowItem[] = [];
        const len = list.length;
        list.forEach(item => {
            item.commodity_id = this.id;
            const { sku_info, ...rest } = item;
            // 目前只有一条默认的sku
            sku_info.forEach(skuItem => {
                const retItem: IGoodsVersionRowItem = {
                    ...Object.assign(rest, {
                        _update_time: utcToLocal(rest.update_time),
                    }),
                    ...Object.assign(skuItem, {
                        sku_price: Number(skuItem.sku_price),
                        sku_inventory: Number(skuItem.sku_inventory),
                    }),
                };
                ret.push(retItem);
            });
        });
        // console.log('addRowSpanData', ret);
        return ret;
    }

    // moment.Moment[] DateType
    private selectedDate = (dates: RangeValue<moment.Moment>) => {
        // console.log('selectedDate', dates);
        this.setState(
            {
                start_time: dates && dates[0] ? (transStartDate(dates[0]) as number) : 0,
                end_time: dates && dates[1] ? (transEndDate(dates[1]) as number) : 0,
            },
            () => {
                this.onSearch({
                    page: 1,
                });
            },
        );
    };

    // 生成表格
    downloadExcel = () => {
        const { start_time, end_time, page, page_count } = this.state;
        postGoodsVersionExport({
            page,
            page_count,
            start_time: start_time ? start_time : undefined,
            end_time: end_time ? end_time : undefined,
            commodity_id: this.id,
        }).catch(err => {
            message.error('下载表格失败');
        });
    };

    // 操作版本
    operationVersion = (product_id: string, type: string) => {
        type === 'apply'
            ? this.postGoodsOnsale(product_id)
            : this.postGoodsIgnoreVersion(product_id);
    };

    // 应用版本
    postGoodsOnsale = (product_id: string) => {
        postGoodsOnsale({
            scm_goods_id: [product_id],
        }).then(res => {
            message.success(`${product_id}应用成功`);
            this.onSearch();
            this.searchReleasedGoods();
        });
    };

    // 忽略版本
    postGoodsIgnoreVersion = (product_id: string) => {
        postGoodsIgnoreVersion({
            product_id: product_id,
        })
            .then(res => {
                message.success(`${product_id}忽略成功`);
                this.onSearch();
            })
            .catch(err => {
                message.success(`${product_id}忽略失败`);
                this.onSearch();
            });
    };

    onChangePage = (page: number) => {
        this.onSearch({
            page,
        });
    };

    pageCountChange = (current: number, size: number) => {
        const { page, page_count } = this.state;
        this.onSearch({
            page: getCurrentPage(size, (page - 1) * page_count + 1),
            page_count: size,
        });
    };

    render() {
        const { loading, page, page_count, allCount, currentInfo, versionGoodsList } = this.state;
        let currentDom = null;
        if (currentInfo) {
            const {
                title,
                product_id,
                goods_img,
                first_catagory,
                second_catagory,
                third_catagory,
                _update_time,
                worm_goodsinfo_link,
                worm_goods_id,
            } = currentInfo;
            currentDom = (
                <div className="goods-version-current">
                    <img src={goods_img} />
                    <div className="info">
                        <p>
                            商品标题：{title}
                            <a href={worm_goodsinfo_link} target="_blank">
                                【查看源商品】
                            </a>
                        </p>
                        <p>
                            <span>中台商品ID：{product_id}</span>
                            <span>源商品ID：{worm_goods_id}</span>
                            {/* <span>源平台：{flatform}</span> */}
                            <span>采集时间：{_update_time}</span>
                        </p>
                        <p>
                            <span>
                                类目：
                                {[first_catagory.name, second_catagory.name, third_catagory.name]
                                    .filter(item => item)
                                    .join('/')}
                            </span>
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="goods-version">
                {currentDom}
                <div className="goods-version-filter">
                    <div className="left-item">
                        <span className="">商品调价跟踪</span>
                        <RangePicker className="date" onChange={this.selectedDate} />
                        <Button onClick={this.downloadExcel}>导出至Excel</Button>
                    </div>
                    <Pagination
                        size="small"
                        total={allCount}
                        current={page}
                        pageSize={page_count}
                        showSizeChanger={true}
                        showQuickJumper={true}
                        pageSizeOptions={pageSizeOptions}
                        onChange={this.onChangePage}
                        onShowSizeChange={this.pageCountChange}
                        showTotal={total => `共${total}条`}
                    />
                </div>
                <VersionTable
                    loading={loading}
                    versionGoodsList={versionGoodsList}
                    operationVersion={this.operationVersion}
                />
            </div>
        );
    }
}

export default Version;
