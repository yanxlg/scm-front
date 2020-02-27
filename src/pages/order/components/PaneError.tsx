import React, { RefObject } from 'react';
import { Button, Checkbox } from 'antd';
import { FormInstance } from 'antd/es/form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import JsonForm, { IFieldItem } from '@/components/JsonForm';

import TableError from './TableError';

import { 
    getErrorOrderList,
    IFilterBaseParams,
    IFilterParams
} from '@/services/order-manage';

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
    pageNumber: number;
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
            {
                name: '全部',
                value: 100,
            },
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
            {
                name: '全部',
                value: 100,
            },
        ],
    },
   
];

const allErrDetailList = [
    {
        key: 1,
        name: '12小时未支付'
    },
    {
        key: 2,
        name: '24小时未拍单'
    },
    {
        key: 3,
        name: '48小时未发货'
    },
    {
        key: 4,
        name: '48小时未出库'
    },
    {
        key: 5,
        name: '72小时未入库'
    },
    {
        key: 6,
        name: '6天未标记发货'
    },
    {
        key: 7,
        name: '7天未上线'
    },
    {
        key: 8,
        name: '14天未上线'
    },
    {
        key: 9,
        name: '30天未妥投'
    }
];

class PanePaid extends React.PureComponent<{}, IState> {

    private formRef: RefObject<FormInstance> = React.createRef();

    constructor(props: {}) {
        super(props);
        this.state = {
            page: 1,
            pageNumber: 50,
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
        const { page, pageNumber } = this.state;
        let params: IFilterParams = {
            page,
            page_number: pageNumber
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
                // pageNumber: params.page_number,
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
            orderList
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
                                    allErrDetailList.map(item => (
                                        <Checkbox className="checkbox-item" key={item.key} value={item.key}>{item.name}</Checkbox>
                                    ))
                                }
                            </Checkbox.Group>
                        </div>
                        
                    </div>
                    <TableError
                        loading={loading}
                        orderList={orderList}
                    />
                </div>
            </>
        );
    }
}

export default PanePaid;
