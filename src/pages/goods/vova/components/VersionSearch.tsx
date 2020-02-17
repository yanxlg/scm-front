import React from 'react';
import { Form } from '@/components/Form';
import { Button, DatePicker, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import '@/styles/config.less';
import { BindAll } from 'lodash-decorators';
import { transEndDate, transStartDate } from '@/utils/date';


export declare interface IApiParams{
    start_time?: number;
    end_time?: number;
    virtual_id?: string;
}

declare interface IVersionSearchProps extends FormComponentProps<IApiParams> {
    onSearch: (params: IApiParams) => Promise<any>;
    onExport: (params: IApiParams) => Promise<any>;
    onActive: (params: IApiParams) => Promise<any>;
}

declare interface IVersionSearchState {
    searchLoading: boolean;
    exportLoading: boolean;
    activeLoading: boolean;
}


@BindAll()
class _VersionSearch extends Form.BaseForm<IVersionSearchProps, IVersionSearchState> {
    constructor(props: IVersionSearchProps) {
        super(props);
        this.state = {
            searchLoading: false,
            exportLoading: false,
            activeLoading: false,
        };
    }

    private onSearch() {
        const { onSearch } = this.props;
        const values = this.convertFromData();
        this.setState({
            searchLoading: true,
        });
        onSearch(values).finally(() => {
            this.setState({
                searchLoading: false,
            });
        });
    }

    private onExport() {
        const { onExport } = this.props;
        const values = this.convertFromData();
        this.setState({
            exportLoading: true,
        });
        onExport(values).finally(() => {
            this.setState({
                exportLoading: false,
            });
        });
    }

    private onActive() {
        const { onActive } = this.props;
        const values = this.convertFromData();
        this.setState({
            activeLoading: true,
        });
        onActive(values).finally(() => {
            this.setState({
                activeLoading: false,
            });
        });
    }

    private convertFromData(){
        const {form} = this.props;
        const {start_time,end_time,...extra} = form.getFieldsValue();
        return {
            ...extra,
            start_time:transStartDate(start_time),
            end_time:transEndDate(end_time)
        }
    }

    render() {
        const { form } = this.props;
        const { searchLoading, exportLoading, activeLoading } = this.state;
        const { start_time, end_time } = form.getFieldsValue();
        return (
            <React.Fragment>
                <Form layout="inline" autoComplete={'off'}>
                    <div className="inline-block">
                        <Form.Item
                            className="margin-none"
                            form={form}
                            name="start_time"
                            label="时间"
                        >
                            <DatePicker
                                disabledDate={currentDate =>
                                    currentDate
                                        ? end_time
                                            ? currentDate.isAfter(end_time)
                                            : false
                                        : false
                                }
                                className="picker-small"
                            />
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="end_time">
                            <DatePicker
                                disabledDate={currentDate =>
                                    currentDate
                                        ? start_time
                                            ? currentDate.isBefore(start_time)
                                            : false
                                        : false
                                }
                                className="picker-small"
                            />
                        </Form.Item>
                    </div>
                    <Form.Item form={form} name="virtual_id" label="虚拟ID">
                        <Input className="input-default" />
                    </Form.Item>
                    <Button
                        loading={searchLoading}
                        onClick={this.onSearch}
                        type="primary"
                        className="btn-group"
                    >
                        查询
                    </Button>
                    <Button
                        loading={exportLoading}
                        onClick={this.onExport}
                        type="primary"
                        className="btn-group"
                    >
                        导出Excel
                    </Button>
                    <Button
                        loading={activeLoading}
                        onClick={this.onActive}
                        type="primary"
                        className="btn-group"
                    >
                        应用新版本
                    </Button>
                </Form>
            </React.Fragment>
        );
    }
}

const VersionSearch = Form.create<IVersionSearchProps>()(_VersionSearch);

export default VersionSearch;
