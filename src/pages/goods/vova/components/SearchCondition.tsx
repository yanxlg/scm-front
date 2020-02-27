import React, { RefObject } from 'react';
import { Button, Card, Input, DatePicker, Select, Form } from 'antd';
import { FormInstance } from 'antd/es/form';
import { Bind } from 'lodash-decorators';
import { getSearchConditionOptions, IFilterParams } from '@/services/VovaGoodsService';
import { transEndDate, transStartDate } from '@/utils/date';
import '@/styles/product.less';
import '@/styles/card.less';

declare interface ISearchProps {
    onSearch: Function;
    toggleExcelDialog: Function;
}

declare interface SelectOptionsItem {
    id: string;
    name: string;
    children?: SelectOptionsItem[];
}

declare interface ISearchState {
    categoryLoading: boolean;
    searchOptions: SelectOptionsItem[];
}

const Option = Select.Option;

const salesVolumeList = [
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

const goodsStatusList = [
    {
        id: 1,
        name: '全部',
    },
    {
        id: 2,
        name: '待上架',
    },
    {
        id: 3,
        name: '已上架',
    },
    {
        id: 4,
        name: '已下架',
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
        getSearchConditionOptions()
            .then(({ data = [] }) => {
                this.setState({
                    categoryLoading: false,
                    searchOptions: data,
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
            onshelf_time_satrt,
            onshelf_time_end,
            level_one_category,
            level_two_category,
            ...values
        } = this.formRef.current!.getFieldsValue();
        return {
            ...values,
            onshelf_time_satrt: transStartDate(onshelf_time_satrt),
            onshelf_time_end: transEndDate(onshelf_time_end),
            level_one_category: level_one_category || undefined,
            level_two_category: level_two_category || undefined,
        } as IFilterParams;
    }

    @Bind
    private onFirstCategoryChange() {
        this.formRef.current!.resetFields(['level_two_category']);
    }

    render() {
        const { searchOptions, categoryLoading } = this.state;
        return (
            <Card className="card-affix-top">
                <Form
                    ref={this.formRef}
                    className="form-help-absolute"
                    layout="inline"
                    autoComplete={'off'}
                    initialValues={{
                        level_one_category: '',
                        level_two_category: '',
                        sales_volume: salesVolumeList[0].id,
                        product_status: goodsStatusList[0].id,
                    }}
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
                                    <Form.Item name="onshelf_time_satrt" noStyle={true}>
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
                                prevValues.onshelf_time_satrt !== currentValues.onshelf_time_satrt
                            }
                        >
                            {({ getFieldValue }) => {
                                const onshelf_time_satrt = getFieldValue('onshelf_time_satrt');
                                return (
                                    <Form.Item name="onshelf_time_end" noStyle={true}>
                                        <DatePicker
                                            disabledDate={currentDate =>
                                                currentDate
                                                    ? onshelf_time_satrt
                                                        ? currentDate.isBefore(onshelf_time_satrt)
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
                                <Option value={item.id}>{item.name}</Option>
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
                                    return category.id === levelOne;
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
                                                <Option key={category.id} value={category.id}>
                                                    {category.name}
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
                            {goodsStatusList.map(item => (
                                <Option value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button
                        type="primary"
                        className="btn-group vertical-middle form-item"
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
                </Form>
            </Card>
        );
    }
}
