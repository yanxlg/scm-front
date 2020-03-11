import React, { RefObject } from 'react';
import { Button, Card, Input, DatePicker, Select, Form } from 'antd';
import { FormInstance } from 'antd/es/form';
import { Bind } from 'lodash-decorators';
import { transEndDate, transStartDate } from '@/utils/date';
import '@/styles/product.less';
import '@/styles/card.less';
import { transNullValue } from '@/utils/transform';
import { queryChannelCategory } from '@/services/channel';
import { ProductStatusList } from '@/config/dictionaries/Product';
import { IChannelCategoryItem, IChannelProductListBody } from '@/interface/IChannel';
import { EmptyObject } from '@/config/global';

declare interface ISearchProps {
    onSearch: Function;
    toggleExcelDialog: Function;
    searchLoading: boolean;
    defaultInitialValues?: { [key: string]: any };
}

declare interface ISearchState {
    categoryLoading: boolean;
    searchOptions: IChannelCategoryItem[];
}

const Option = Select.Option;

export const salesVolumeList = [
    {
        id: 'all',
        name: '全部',
    },
    {
        id: 'day_10',
        name: '日销量大于10',
    },
    {
        id: 'day_50',
        name: '日销量大于50',
    },
    {
        id: 'day_100',
        name: '日销量大于100',
    },
    {
        id: 'week_100',
        name: '周销量大于100',
    },
    {
        id: 'week_200',
        name: '周销量大于200',
    },
    {
        id: 'week_500',
        name: '周销量大于500',
    },
    {
        id: 'month_100',
        name: '月销量大于100',
    },
    {
        id: 'month_500',
        name: '月销量大于500',
    },
    {
        id: 'month_1000',
        name: '月销量大于1000',
    },
];

export default class SearchCondition extends React.PureComponent<ISearchProps, ISearchState> {
    private formRef: RefObject<FormInstance> = React.createRef();
    constructor(props: ISearchProps) {
        super(props);
        this.state = {
            categoryLoading: true,
            searchOptions: [],
        };
    }

    componentDidMount(): void {
        this.queryCategory();
    }

    @Bind
    private queryCategory() {
        queryChannelCategory()
            .then(({ data = [] } = EmptyObject) => {
                this.setState({
                    categoryLoading: false,
                    searchOptions: data || [],
                });
            })
            .catch(() => {
                this.setState({
                    categoryLoading: false,
                });
            });
    }
    @Bind
    private onSearch() {
        this.props.onSearch();
    }

    @Bind
    private toggleExcelDialog() {
        this.props.toggleExcelDialog(true);
    }

    @Bind
    public getFieldsValue() {
        const {
            onshelf_time_start,
            onshelf_time_end,
            level_one_category,
            level_two_category,
            ...values
        } = this.formRef.current!.getFieldsValue();
        return {
            ...values,
            onshelf_time_start: transStartDate(onshelf_time_start),
            onshelf_time_end: transEndDate(onshelf_time_end),
            level_one_category: transNullValue(level_one_category),
            level_two_category: transNullValue(level_two_category),
        } as IChannelProductListBody;
    }

    @Bind
    private onFirstCategoryChange() {
        this.formRef.current!.resetFields(['level_two_category']);
    }

    render() {
        const { searchOptions, categoryLoading } = this.state;
        const { searchLoading, defaultInitialValues } = this.props;
        const initialValues = Object.assign(
            {},
            {
                level_one_category: '',
                level_two_category: '',
                sales_volume: salesVolumeList[0].id,
                product_status: ProductStatusList[0].id,
            },
            defaultInitialValues,
        );
        return (
            <Form
                ref={this.formRef}
                className="form-help-absolute"
                layout="inline"
                autoComplete={'off'}
                initialValues={initialValues}
            >
                <Form.Item
                    label={<span className="product-form-label">时&emsp;&emsp;&emsp;间</span>}
                    className="form-item"
                >
                    <Form.Item
                        noStyle={true}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.onshelf_time_end !== currentValues.onshelf_time_end
                        }
                    >
                        {({ getFieldValue }) => {
                            const onshelf_time_end = getFieldValue('onshelf_time_end');
                            return (
                                <Form.Item name="onshelf_time_start" noStyle={true}>
                                    <DatePicker
                                        disabledDate={currentDate =>
                                            currentDate
                                                ? onshelf_time_end
                                                    ? currentDate.isAfter(onshelf_time_end)
                                                    : false
                                                : false
                                        }
                                        className="product-picker"
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <span className="config-colon">-</span>
                    <Form.Item
                        noStyle={true}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.onshelf_time_start !== currentValues.onshelf_time_start
                        }
                    >
                        {({ getFieldValue }) => {
                            const onshelf_time_start = getFieldValue('onshelf_time_start');
                            return (
                                <Form.Item name="onshelf_time_end" noStyle={true}>
                                    <DatePicker
                                        disabledDate={currentDate =>
                                            currentDate
                                                ? onshelf_time_start
                                                    ? currentDate.isBefore(onshelf_time_start)
                                                    : false
                                                : false
                                        }
                                        className="product-picker"
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    className="form-item"
                    validateTrigger={'onBlur'}
                    name="commodity_id"
                    label={<span className="product-form-label">Commodity ID</span>}
                >
                    <Input className="input-default input-handler" placeholder="多个逗号隔开" />
                </Form.Item>

                <Form.Item
                    className="form-item"
                    validateTrigger={'onBlur'}
                    name="vova_virtual_id"
                    label={<span className="product-form-label">虚拟&emsp;ID</span>}
                >
                    <Input className="input-default input-handler" placeholder="多个逗号隔开" />
                </Form.Item>

                <Form.Item
                    className="form-item"
                    validateTrigger={'onBlur'}
                    name="product_id"
                    label={<span className="product-form-label">Product ID</span>}
                >
                    <Input className="input-default input-handler" placeholder="多个逗号隔开" />
                </Form.Item>

                <Form.Item
                    className="form-item"
                    validateTrigger={'onBlur'}
                    name="sales_volume"
                    label={<span className="product-form-label">销&emsp;&emsp;&emsp;量</span>}
                >
                    <Select className="select-default">
                        {salesVolumeList.map(item => (
                            <Option value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    className="form-item"
                    validateTrigger={'onBlur'}
                    name="shop_name"
                    label={<span className="product-form-label">店&ensp;铺&ensp;名</span>}
                >
                    <Input className="input-default input-handler" placeholder="多个逗号隔开" />
                </Form.Item>

                <Form.Item
                    className="form-item"
                    validateTrigger={'onBlur'}
                    name="level_one_category"
                    label={<span className="product-form-label">一级类目</span>}
                >
                    <Select
                        loading={categoryLoading}
                        className="select-default"
                        onChange={this.onFirstCategoryChange}
                    >
                        <Option value="">全部</Option>
                        {searchOptions.map(item => (
                            <Option key={item.platform_cate_id} value={item.platform_cate_id}>
                                {item.platform_cate_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    noStyle={true}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.level_one_category !== currentValues.level_one_category
                    }
                >
                    {({ getFieldValue }) => {
                        const levelOne = getFieldValue('level_one_category');
                        const childCategory =
                            searchOptions.find(category => {
                                return category.platform_cate_id === levelOne;
                            })?.children || [];
                        return (
                            <Form.Item
                                validateTrigger={'onBlur'}
                                name="level_two_category"
                                label={<span className="product-form-label">二级类目</span>}
                                className="form-item"
                            >
                                <Select loading={categoryLoading} className="select-default">
                                    <Option value="">全部</Option>
                                    {childCategory.map(category => {
                                        return (
                                            <Option
                                                key={category.platform_cate_id}
                                                value={category.platform_cate_id}
                                            >
                                                {category.platform_cate_name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        );
                    }}
                </Form.Item>
                <Form.Item
                    validateTrigger={'onBlur'}
                    className="form-item"
                    name="product_status"
                    label={<span className="product-form-label">商品状态</span>}
                >
                    <Select className="select-default">
                        {ProductStatusList.map(item => (
                            <Option value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <div>
                    <Button
                        type="primary"
                        className="btn-group vertical-middle form-item"
                        loading={searchLoading}
                        onClick={this.onSearch}
                    >
                        查询
                    </Button>
                    <Button
                        type="primary"
                        className="btn-group vertical-middle form-item"
                        onClick={this.toggleExcelDialog}
                    >
                        导出
                    </Button>
                </div>
            </Form>
        );
    }
}
