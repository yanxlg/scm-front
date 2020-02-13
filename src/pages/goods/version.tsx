import React from 'react';
import { DatePicker, Button } from 'antd';
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import moment from 'moment';

import VersionTable from './components/VersionTable';

import '../../styles/goods-version.less';

import {
    getGoodsVersion
} from '@/services/goods';
import { formatDate } from '@/utils/date'

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
}

declare interface IGoodsVersionItem extends IGoodsVersionItemBase {
    sku: ISkuItem[]
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

    id: number = 0

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
                category_tree_level: ''
            },
            versionGoodsList: []
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
            loading: true
        })
        return getGoodsVersion({
            start_time,
            end_time,
            commodity_id: this.id
        }).then((res) => {
            const { 
                goods_version_list,
                ...rest
            } = res.data;
            
            this.setState({
                versionGoodsList: this.addRowSpanData(goods_version_list),
                currentInfo: rest
            });
        }).finally(() => {
            this.setState({
                loading: false
            });
        });
    }

    // 处理表格数据，用于合并单元格
    private addRowSpanData(list: IGoodsVersionItem[]): IGoodsVersionRowItem[] {
        let ret: IGoodsVersionRowItem[] = [];
        const len = list.length;
        list.forEach((item, index) => {
            const { sku, ...rest } = item;
            sku.forEach((skuItem, skuIndex) => {
                const retItem: IGoodsVersionRowItem = {
                    ...rest,
                    ...skuItem
                }
                if (index !== len - 1) {
                    const prev = list[index + 1];
                    const { sku: prevSku, ...prevRest } = prev;
                    retItem._prevVersion = {
                        ...prevRest,
                        ...prevSku[skuIndex]
                    }
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
        this.setState({
            start_time: dates[0] ? dates[0].format('YYYY-MM-DD') : '',
            end_time: dates[1] ? dates[1].format('YYYY-MM-DD') : ''
        }, () => {
            this.onSearch();
        })
    }

    // 生成表格
    downloadExcel = () => {
        const { versionGoodsList } = this.state;
        // console.log('downloadExcel', goodsList);
        const titleList = [
            'Product ID',
            '上架渠道',
            '商品图片',
            '商品标题',
            '商品描述',
            '中台sku ID',
            '源sku ID',
            '规格',
            '价格',
            '重量',
            '库存',
            '运费',
            '销量',
            '评价数量',
            '一级类目',
            '二级类目',
            '三级类目',
            '变更时间',
            '变更人'
        ];
        let str = titleList.join(',') + '\n';
        // console.log(versionGoodsList);
        versionGoodsList.forEach(item => {
            const {
                product_id,
                up_shelf_channel,
                goods_imgs,
                goods_title,
                goods_description,
                middle_sku_id,
                source_sku_id,
                specs,
                price,
                weight,
                stock,
                shipping_fee,
                sales_volume,
                evaluation_quantity,
                category_one_level,
                category_two_level,
                category_three_level,
                change_time,
                change_operator,
                _rowspan
            } = item;
            // // 规格
            str += (_rowspan ? product_id : '') + ',';
            str += (_rowspan ? up_shelf_channel : '') + ',';
            str += (_rowspan ? goods_imgs.main_image_url : '') + ',';
            str += (_rowspan ? goods_title : '') + ',';
            str += (_rowspan ? goods_description : '') + ',';
            str += middle_sku_id + ',';
            str += source_sku_id + ',';
            str += specs + ',';
            str += price + ',';
            str += weight + ',';
            str += stock + ',';
            str += shipping_fee + ',';
            str += sales_volume + ',';
            str += evaluation_quantity + ',';
            str += category_one_level + ',';
            str += category_two_level + ',';
            str += category_three_level + ',';
            str += (_rowspan ? change_time : '') + ',';
            str += (_rowspan ? change_operator : '') + '\n';
        })
        let blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        //解决中文乱码问题
        blob =  new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
        const object_url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = object_url;
        link.download =  "商品.xls";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {

        const {
            loading,
            start_time,
            end_time,
            currentInfo,
            versionGoodsList
        } = this.state;

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
            category_tree_level
        } = currentInfo;

        return (
            <div className="goods-version">
                <div className="goods-version-current">
                    <img src={main_image_url} />
                    <div className="info">
                        <p>
                            商品标题：{goods_title}<a>【查看源商品】</a>
                        </p>
                        <p>
                            <span>中台商品ID：{goods_id}</span>
                            <span>源商品ID：{source_goods_id}</span>
                            <span>源平台：{flatform}</span>
                            <span>采集时间：{collection_time}</span>
                        </p>
                        <p>
                            <span>类目：{category_one_level}/{category_two_level}/{category_tree_level}</span>
                        </p>
                    </div>
                </div>
                <div className="goods-version-filter">
                    <div className="left-item">
                        <span className="">商品调价跟踪</span>
                        <RangePicker 
                            className="date"
                            defaultValue={start_time ? [moment(start_time), moment(end_time)] : [null, null]}
                            onChange={this.selectedDate}
                        />
                        <Button onClick={this.downloadExcel}>导出至Excel</Button>
                    </div>
                    {/* <Pagination size="small" total={50} showSizeChanger={true} showQuickJumper={true} /> */}
                </div>
                <VersionTable
                    loading={loading} 
                    versionGoodsList={versionGoodsList}
                />
            </div>
        )
    }
}

export default Version;
