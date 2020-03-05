import React, { RefObject } from 'react';
import { Button, Checkbox, Pagination } from 'antd';
import { FormInstance } from 'antd/es/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import JsonForm, { IFieldItem } from '@/components/JsonForm';
import TableError from './TableError';

import { 
    getErrorOrderList,
    IFilterBaseParams,
    IFilterParams
} from '@/services/order-manage';
import {
    pageSizeOptions,
    defaultOptionItem, 
    channelOptionList,
    errorTypeOptionList,
    errorDetailOptionList
} from '@/enums/OrderEnum';

export declare interface IErrorOrderItem {
    order_create_time: number;
    order_confirm_time: number;
    middleground_order_id: string;
    channel_order_id: string;
    error_type: number;
    error_detail: number;
    first_waybill_no: string;
    last_waybill_no: string;
}

declare interface IState {
    page: number;
    pageCount: number;
    total: number;
    loading: boolean;
    orderList: IErrorOrderItem[]
}



const fieldList: IFieldItem[] = [
    {
        type: 'dateRanger',
        name: ['order_start_time', 'order_end_time'],
        label: '订单时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'dateRanger',
        name: ['order_confirm_start_time', 'order_confirm_end_time'],
        label: '订单确认时间',
        className: 'order-date-picker',
        formItemClassName: 'order-form-item',
    },
    {
        type: 'select',
        name: 'channel',
        label: '销售渠道',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...channelOptionList
        ],
    },
    {
        type: 'input',
        name: 'order_id',
        label: '订单号',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        placeholder: '请输入采购父订单ID',
    },    
    {
        type: 'select',
        name: 'error_type',
        label: '异常类型',
        className: 'order-input',
        formItemClassName: 'order-form-item',
        optionList: [
            defaultOptionItem,
            ...errorTypeOptionList
                
        ],
    },
   
];

class PanePaid extends React.PureComponent<{}, IState> {

    private formRef: RefObject<FormInstance> = React.createRef();

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 30,
            total: 0,
            loading: false,
            orderList: []
        }
    }

    componentDidMount() {
        // console.log('PaneAll');
        this.onSearch();
    }

    onSearch = (baseParams?: IFilterBaseParams) => {
        const { page, pageCount } = this.state;
        let params: IFilterParams = {
            page,
            page_count: pageCount
        }
        // if (this.orderFilterRef.current) {
        //     // console.log('onSearch', this.orderFilterRef.current.getValues());
        //     params = Object.assign(params, this.orderFilterRef.current.getValues());
        // }
        if (baseParams) {
            params = Object.assign(params, baseParams);
        }
        // console.log('getValues', this.orderFilterRef.current!.getValues());
        this.setState({
            loading: true
        })
        getErrorOrderList(params).then(res => {
            // console.log('getProductOrderList', res);
            const { total, list } = res.data;
            this.setState({
                total,
                // page: params.page,
                // pageCount: params.page_count,
                orderList: list
            })
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 获取查询数据
    getFieldsValue = () => {
        // console.log('111', this.formRef.current!.getFieldsValue());
    }

    // 选择异常详情
    onCheckErrDetail = (list: CheckboxValueType[]) => {

    }

    render() {

        const {
            loading,
            orderList,
            total,
            page,
            pageCount,

        } = this.state;

        const initialValues = {
            channel: 100,
            error_type: 100
        }
        return (
            <>
                <div>
                    <JsonForm
                        labelClassName="order-label"
                        fieldList={fieldList}
                        formRef={this.formRef}
                        initialValues={initialValues}
                    />
                    <div className="order-operation">
                        <Button type="primary" className="order-btn" onClick={() => this.getFieldsValue()}>查询</Button>
                        <Button className="order-btn">导出数据</Button>
                    </div>
                    <div className="order-err-detail">
                        <strong>异常详情</strong>
                        <div className="wrap">
                            <Checkbox.Group onChange={this.onCheckErrDetail}>
                                {
                                    errorDetailOptionList.map(item => (
                                        <Checkbox className="checkbox-item" key={item.value} value={item.value}>{item.name}</Checkbox>
                                    ))
                                }
                            </Checkbox.Group>
                        </div>
                        
                    </div>
                    <TableError
                        loading={loading}
                        orderList={orderList}
                    />
                    <Pagination
                        className="order-pagination"
                        // size="small"
                        total={total}
                        current={page}
                        pageSize={pageCount}
                        showSizeChanger={true}
                        showQuickJumper={true}
                        pageSizeOptions={pageSizeOptions}
                        // onChange={this.onChangePage}
                        // onShowSizeChange={this.pageCountChange}
                        showTotal={(total) => `共${total}条`}
                    />
                </div>
            </>
        );
    }
}

export default PanePaid;
