import React from 'react';
import { DatePicker, message } from 'antd';
import Container from '@/components/Container';
import { RangeValue } from 'rc-picker/lib/interface';
import VersionTable from './components/VersionTable';
import { getCurrentPage } from '@/utils/common';
import {
    getGoodsVersion,
    postGoodsVersionExport,
    postGoodsOnsale,
    postGoodsIgnoreVersion,
} from '@/services/goods';
import { utcToLocal } from 'react-components/es/utils/date';
import { startDateToUnix, endDateToUnix } from 'react-components/es/utils/date';
import { LoadingButton } from 'react-components';
import MerchantListModal from '../components/MerchantListModal';

import '../../../styles/goods-version.less';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

declare interface IVersionProps {
    location: any;
}

export declare interface IPageData {
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
    sku_id?: string;
    origin_sku_id?: string;
    sku_style?: ISkuStyle;
    sku_price?: number;
    sku_weight?: number;
    sku_inventory?: number;
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

declare interface IVersionState {
    loading: boolean;
    start_time: number;
    end_time: number;
    page: number;
    page_count: number;
    allCount: number;
    currentInfo: IGoodsVersionRowItem | null;
    versionGoodsList: IGoodsVersionRowItem[];
    merchantDialogStatus: boolean;
}

class Version extends React.PureComponent<IVersionProps, IVersionState> {
    id: string = '';
    productId: string = '';
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
            merchantDialogStatus: false,
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
            product_status: [80],
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
            if (sku_info.length) {
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
            } else {
                ret.push(rest);
            }
        });
        return ret;
    }

    private selectedDate = (dates: RangeValue<Dayjs>) => {
        // console.log('selectedDate', dates);
        this.setState(
            {
                start_time: dates && dates[0] ? (startDateToUnix(dates[0] as any) as number) : 0,
                end_time: dates && dates[1] ? (endDateToUnix(dates[1] as any) as number) : 0,
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
        return postGoodsVersionExport({
            page,
            page_count,
            start_time: start_time ? start_time : undefined,
            end_time: end_time ? end_time : undefined,
            commodity_id: this.id,
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
        this.setState({
            merchantDialogStatus: true,
        });
        this.productId = product_id;
    };

    // 忽略版本
    postGoodsIgnoreVersion = (product_id: string) => {
        postGoodsIgnoreVersion({
            product_id: product_id,
        }).then(res => {
            message.success(`${product_id}忽略成功`);
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

    private merchantOkey = (merchants_id: string[]) => {
        return postGoodsOnsale({
            scm_goods_id: [this.productId],
            merchants_id: merchants_id.join(','),
        }).then(res => {
            message.success(`${this.productId}应用成功`);
            this.onSearch();
            this.searchReleasedGoods();
        });
    };

    private merchantCancel = () => {
        this.setState({
            merchantDialogStatus: false,
        });
    };

    render() {
        const {
            loading,
            page,
            page_count,
            allCount,
            currentInfo,
            versionGoodsList,
            merchantDialogStatus,
        } = this.state;
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
            <Container>
                <div className="goods-version">
                    {currentDom}
                    <div className="goods-version-filter">
                        <div className="left-item">
                            <span className="">版本生成时间</span>
                            <RangePicker className="date" onChange={this.selectedDate} />
                            <LoadingButton onClick={this.downloadExcel}>导出至Excel</LoadingButton>
                        </div>
                    </div>
                    <VersionTable
                        loading={loading}
                        currentPage={page}
                        pageSize={page_count}
                        total={allCount}
                        versionGoodsList={versionGoodsList}
                        operationVersion={this.operationVersion}
                        onSearch={this.onSearch}
                    />
                    <MerchantListModal
                        visible={merchantDialogStatus}
                        onOKey={this.merchantOkey}
                        onCancel={this.merchantCancel}
                    />
                </div>
            </Container>
        );
    }
}

export default Version;
