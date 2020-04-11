import React, { RefObject } from 'react';
import { Button, DatePicker, Input, Form } from 'antd';
import '@/styles/config.less';
import { startDateToUnix, endDateToUnix } from 'react-components/es/utils/date';
import { FormInstance } from 'antd/es/form';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

export declare interface IApiParams {
    start_time?: number;
    end_time?: number;
    virtual_id?: string;
}

declare interface IVersionSearchProps {
    onSearch: (params: IApiParams) => Promise<any>;
    onExport: (params: IApiParams) => Promise<any>;
    onActive: (params: IApiParams) => Promise<any>;
}

declare interface IVersionSearchState {
    searchLoading: boolean;
    exportLoading: boolean;
    activeLoading: boolean;
}

class VersionSearch extends React.PureComponent<IVersionSearchProps, IVersionSearchState> {
    private formRef: RefObject<FormInstance> = React.createRef();
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

    private convertFromData() {
        const { start_time, end_time, ...extra } = this.formRef.current!.getFieldsValue();
        return {
            ...extra,
            start_time: startDateToUnix(start_time),
            end_time: endDateToUnix(end_time),
        };
    }

    render() {
        const { searchLoading, exportLoading, activeLoading } = this.state;
        return (
            <React.Fragment>
                <Form ref={this.formRef} layout="inline" autoComplete={'off'}>
                    <Form.Item label="时间" className={formStyles.formItem}>
                        <Form.Item
                            noStyle={true}
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.end_time !== currentValues.end_time
                            }
                        >
                            {({ getFieldValue }) => {
                                const end_time = getFieldValue('end_time');
                                return (
                                    <Form.Item name="start_time" noStyle={true}>
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
                                );
                            }}
                        </Form.Item>
                        <span className="config-colon">-</span>
                        <Form.Item
                            noStyle={true}
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.start_time !== currentValues.start_time
                            }
                        >
                            {({ getFieldValue }) => {
                                const start_time = getFieldValue('start_time');
                                return (
                                    <Form.Item name="end_time" noStyle={true}>
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
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item className={formStyles.formItem} name="virtual_id" label="虚拟ID">
                        <Input className="input-default" />
                    </Form.Item>
                    <Button
                        loading={searchLoading}
                        onClick={this.onSearch}
                        type="primary"
                        className={classNames(
                            formStyles.formBtn,
                            formStyles.verticalMiddle,
                            formStyles.formItem,
                        )}
                    >
                        查询
                    </Button>
                    <Button
                        loading={exportLoading}
                        onClick={this.onExport}
                        type="primary"
                        className={classNames(
                            formStyles.formBtn,
                            formStyles.verticalMiddle,
                            formStyles.formItem,
                        )}
                    >
                        导出Excel
                    </Button>
                    <Button
                        loading={activeLoading}
                        onClick={this.onActive}
                        type="primary"
                        className={classNames(
                            formStyles.formBtn,
                            formStyles.verticalMiddle,
                            formStyles.formItem,
                        )}
                    >
                        应用新版本
                    </Button>
                </Form>
            </React.Fragment>
        );
    }
}

export default VersionSearch;
