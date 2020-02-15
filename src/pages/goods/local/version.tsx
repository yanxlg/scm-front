import React from 'react';
import { DatePicker, Button, message } from 'antd';
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import moment from 'moment';

import VersionTable from './components/VersionTable';

import '../../../styles/goods-version.less';

import {
    getGoodsVersion,
    postGoodsVersionExport,
    postGoodsApplyVersion,
    postGoodsIgnoreVersion,
} from '@/services/goods';
import { formatDate } from '@/utils/date';

const { RangePicker } = DatePicker;

declare interface IVersionProps {
    location: any;
}

declare interface ISubImageItem {
    sub_image_url: string;
    sku_id: string;
}

export declare interface IGoodsImgs {
    version: number;
    main_image_url: string;
    sub_image: ISubImageItem[];
}

export declare interface IOperations {
    can_apply: boolean;
    can_ignore: boolean;
    is_current_version: boolean;
}

declare interface ISkuItem {
    middle_sku_id: number;
    source_sku_id: number;
    specs: string;
    price: number;
    weight: number;
    stock: number;
    shipping_fee: number;
    sales_volume: number;
    evaluation_quantity: number;
    category_one_level: string;
    category_two_level: string;
    category_three_level: string;
    change_time: string;
    change_operator: string;
}

declare interface IGoodsVersionItemBase {
    product_id: number;
    up_shelf_channel: string;
    goods_imgs: IGoodsImgs;
    goods_title: string;
    goods_description: string;
    operations: IOperations;
}

declare interface IGoodsVersionItem extends IGoodsVersionItemBase {
    sku: ISkuItem[];
}

export declare interface IGoodsVersionRowItem extends IGoodsVersionItemBase, ISkuItem {
    _prevVersion?: IGoodsVersionRowItem;
    _rowspan?: number;
}

declare interface IGoodsVersionBase {
    goods_title: string;
    goods_url: string;
    main_image_url: string;
    goods_id: number;
    source_goods_id: number;
    flatform: string;
    collection_time: string;
    category_one_level: string;
    category_two_level: string;
    category_tree_level: string;
}

declare interface IVersionState {
    start_time: string;
    end_time: string;
    loading: boolean;
    currentInfo: IGoodsVersionBase;
    versionGoodsList: IGoodsVersionRowItem[];
}

class Version extends React.PureComponent<IVersionProps, IVersionState> {
    id: number = 0;

    constructor(props: IVersionProps) {
        super(props);
        let nowTime = new Date();
        this.state = {
            loading: false,
            end_time: formatDate(nowTime, 'yyyy-MM-dd'),
            start_time: formatDate(new Date(nowTime.setDate(nowTime.getDate() - 3)), 'yyyy-MM-dd'),
            currentInfo: {
                goods_title: '',
                goods_url: '',
                main_image_url: '',
                goods_id: 0,
                source_goods_id: 0,
                flatform: '',
                collection_time: '',
                category_one_level: '',
                category_two_level: '',
                category_tree_level: '',
            },
            versionGoodsList: [],
        };
    }

    componentDidMount(): void {
        this.id = Number(this.props.location.query.id);
        this.onSearch();
        // console.log();
    }

    private onSearch = () => {
        const { start_time, end_time } = this.state;
        this.setState({
            loading: true,
        });
        return getGoodsVersion({
            start_time,
            end_time,
            commodity_id: this.id,
        })
            .then(res => {
                const { goods_version_list, ...rest } = res.data;

                this.setState({
                    versionGoodsList: this.addRowSpanData(goods_version_list),
                    currentInfo: rest,
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    // 处理表格数据，用于合并单元格
    private addRowSpanData(list: IGoodsVersionItem[]): IGoodsVersionRowItem[] {
        let ret: IGoodsVersionRowItem[] = [];
        const len = list.length;
        list.forEach((item, index) => {
            const { sku, ...rest } = item;
            sku.forEach((skuItem, skuIndex) => {
                const retItem: IGoodsVersionRowItem = {
                    ...rest,
                    ...skuItem,
                };
                if (index !== len - 1) {
                    const prev = list[index + 1];
                    const { sku: prevSku, ...prevRest } = prev;
                    retItem._prevVersion = {
                        ...prevRest,
                        ...prevSku[skuIndex],
                    };
                    // list[index + 1].sku[skuIndex];
                }
                if (skuIndex === 0) {
                    retItem._rowspan = sku.length;
                }
                ret.push(retItem);
            });
        });
        // console.log('addRowSpanData', ret);
        return ret;
    }

    // moment.Moment[]
    private selectedDate = (dates: RangePickerValue) => {
        // console.log(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
        if (dates[0] && dates[1]) {
            this.setState(
                {
                    start_time: dates[0] ? dates[0].format('YYYY-MM-DD') : '',
                    end_time: dates[1] ? dates[1].format('YYYY-MM-DD') : '',
                },
                () => {
                    this.onSearch();
                },
            );
        }
    };

    // 生成表格
    downloadExcel = () => {
        postGoodsVersionExport({
            commodity_id: this.id,
        }).catch(err => {
            message.error('下载表格失败');
        });
    };

    // 操作版本
    operationVersion = (product_id: number, type: string) => {
        type === 'apply'
            ? this.postGoodsApplyVersion(product_id)
            : this.postGoodsIgnoreVersion(product_id);
    };

    // 应用版本
    postGoodsApplyVersion = (product_id: number) => {
        postGoodsApplyVersion({
            product_id: product_id + '',
        })
            .then(res => {
                message.success(`${product_id}应用成功`);
                this.onSearch();
            })
            .catch(err => {
                message.error(`${product_id}应用失败`);
            });
    };

    // 忽略版本
    postGoodsIgnoreVersion = (product_id: number) => {
        postGoodsApplyVersion({
            product_id: product_id + '',
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

    render() {
        const { loading, start_time, end_time, currentInfo, versionGoodsList } = this.state;

        const {
            goods_title,
            goods_url,
            main_image_url,
            goods_id,
            source_goods_id,
            flatform,
            collection_time,
            category_one_level,
            category_two_level,
            category_tree_level,
        } = currentInfo;

        return (
            <div className="goods-version">
                <div className="goods-version-current">
                    <img src={main_image_url} />
                    <div className="info">
                        <p>
                            商品标题：{goods_title}
                            <a href={goods_url} target="_blank">
                                【查看源商品】
                            </a>
                        </p>
                        <p>
                            <span>中台商品ID：{goods_id}</span>
                            <span>源商品ID：{source_goods_id}</span>
                            <span>源平台：{flatform}</span>
                            <span>采集时间：{collection_time}</span>
                        </p>
                        <p>
                            <span>
                                类目：{category_one_level}/{category_two_level}/
                                {category_tree_level}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="goods-version-filter">
                    <div className="left-item">
                        <span className="">商品调价跟踪</span>
                        <RangePicker
                            className="date"
                            defaultValue={
                                start_time ? [moment(start_time), moment(end_time)] : [null, null]
                            }
                            onChange={this.selectedDate}
                        />
                        <Button onClick={this.downloadExcel}>导出至Excel</Button>
                    </div>
                    {/* <Pagination size="small" total={50} showSizeChanger={true} showQuickJumper={true} /> */}
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
