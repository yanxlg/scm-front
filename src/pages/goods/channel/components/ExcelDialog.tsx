import React from 'react';
import { Modal, Radio } from 'antd';

import { RadioChangeEvent } from 'antd/lib/radio';

declare interface IExcelDialogProps {
    visible: boolean;
    total: number;
    // saleStatusList: ISaleStatausItem[];
    getExcelData(pageNumber: number, pageSize: number): Promise<unknown>;
    toggleExcelDialog(status: boolean): void;
}

declare interface IExcelDialogState {
    val: number;
    confirmLoading: boolean;
}

class ExcelDialog extends React.PureComponent<IExcelDialogProps, IExcelDialogState> {
    private excelPageSize: number = 10000;
    constructor(props: IExcelDialogProps) {
        super(props);
        this.state = {
            val: 0,
            confirmLoading: false,
        };
    }

    private handleCancel = () => {
        this.props.toggleExcelDialog(false);
    };

    private handleOk = () => {
        const { val } = this.state;
        this.setState({
            confirmLoading: true,
        });
        return this.props.getExcelData(val, this.excelPageSize).finally(() => {
            this.setState({
                confirmLoading: false,
            });
        });
    };

    private onChange = (e: RadioChangeEvent) => {
        this.setState({
            val: e.target.value,
        });
    };

    render() {
        const { visible, total } = this.props;
        const { val, confirmLoading } = this.state;

        if (total < 1) {
            return null;
        }
        const list: number[] = [];
        for (let i = 0; i < Math.ceil(total / this.excelPageSize); i++) {
            list.push(i);
        }

        return (
            <Modal
                title="导出EXCEL"
                visible={visible}
                width={660}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
            >
                <div>
                    <Radio.Group onChange={this.onChange} value={val}>
                        {list.map(index => {
                            let desc = '';
                            if (index === 0) {
                                desc = '导出前1万条';
                            } else if (index === list.length - 1) {
                                desc = `导出${index * this.excelPageSize}条-${total}条`;
                            } else {
                                desc = `导出${index}万条-${index + 1}条`;
                            }
                            return (
                                <Radio
                                    className="goods-local-excel-radio"
                                    key={index}
                                    value={index}
                                >
                                    {desc}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </div>
            </Modal>
        );
    }
}

export default ExcelDialog;
