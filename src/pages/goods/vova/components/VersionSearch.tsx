import React from 'react';
import { Form } from '@/components/Form';
import { Button, DatePicker, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import '@/styles/config.less';
import { Bind } from 'lodash-decorators';
import { Moment } from 'moment';

export declare interface IFormData {
    onshelf_time_satrt?: Moment;
    onshelf_time_end?: Moment;
    vova_virtual_id?: string;
}

declare interface IVersionSearchProps extends FormComponentProps<IFormData> {
    onSearch: (params: IFormData) => Promise<any>;
    onExport: (params: IFormData) => Promise<any>;
    onActive: (params: IFormData) => Promise<any>;
}

declare interface IVersionSearchState {
    searchLoading: boolean;
    exportLoading: boolean;
    activeLoading: boolean;
}

class _VersionSearch extends Form.BaseForm<IVersionSearchProps, IVersionSearchState> {
    constructor(props: IVersionSearchProps) {
        super(props);
        this.state = {
            searchLoading: false,
            exportLoading: false,
            activeLoading: false,
        };
    }

    @Bind
    private onSearch() {
        const { onSearch, form } = this.props;
        const values = form.getFieldsValue();
        this.setState({
            searchLoading: true,
        });
        onSearch(values).finally(() => {
            this.setState({
                searchLoading: false,
            });
        });
    }

    @Bind
    private onExport() {
        const { onExport, form } = this.props;
        const values = form.getFieldsValue();
        this.setState({
            exportLoading: true,
        });
        onExport(values).finally(() => {
            this.setState({
                exportLoading: false,
            });
        });
    }

    @Bind
    private onActive() {
        const { onActive, form } = this.props;
        const values = form.getFieldsValue();
        this.setState({
            activeLoading: true,
        });
        onActive(values).finally(() => {
            this.setState({
                activeLoading: false,
            });
        });
    }

    @Bind
    private range(start: number, end: number) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    render() {
        const { form } = this.props;
        const { searchLoading, exportLoading, activeLoading } = this.state;
        const { onshelf_time_satrt, onshelf_time_end } = form.getFieldsValue();
        return (
            <React.Fragment>
                <Form layout="inline" autoComplete={'off'}>
                    <div className="inline-block">
                        <Form.Item
                            className="margin-none"
                            form={form}
                            name="onshelf_time_satrt"
                            label="时间"
                        >
                            <DatePicker
                                disabledDate={currentDate =>
                                    currentDate
                                        ? onshelf_time_end
                                            ? currentDate.isAfter(onshelf_time_end)
                                            : false
                                        : false
                                }
                                className="picker-small"
                            />
                        </Form.Item>
                        <span className="ant-col ant-form-item-label config-colon">-</span>
                        <Form.Item form={form} name="onshelf_time_end">
                            <DatePicker
                                disabledDate={currentDate =>
                                    currentDate
                                        ? onshelf_time_satrt
                                            ? currentDate.isBefore(onshelf_time_satrt)
                                            : false
                                        : false
                                }
                                className="picker-small"
                            />
                        </Form.Item>
                    </div>
                    <Form.Item form={form} name="vova_virtual_id" label="虚拟ID">
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
