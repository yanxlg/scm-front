import React from 'react';
import { Modal, Radio } from 'antd';

import { RadioChangeEvent } from 'antd/lib/radio';

declare interface IExcelDialogProps {
    visible: boolean;
    allCount: number;
    // saleStatusList: ISaleStatausItem[];
    toggleExcelDialog(status: boolean): void;
}

declare interface IExcelDialogState {
    val: number;
}


class ExcelDialog extends React.PureComponent<IExcelDialogProps, IExcelDialogState> {

    constructor(props: IExcelDialogProps) {
        super(props);
        this.state = {
            val: 0
        }
    }

    private handleCancel = () => {
        this.props.toggleExcelDialog(false);
    }

    private onChange = (e: RadioChangeEvent) => {
        // console.log(e.target.value);
        this.setState({
            val: e.target.value
        });
    }

    render() {

        const { visible, allCount } = this.props;
        const { val } = this.state;

        if (allCount < 1) {
            return null;
        }
        const list: number[] = [];
        for (let i = 0; i < Math.ceil(allCount / 10000); i++) {
            list.push(i)
        } 
       
        return (
            <Modal
                title="导出EXCEL"
                visible={visible}
                width={660}
                onCancel={this.handleCancel}
            >
                <div>
                    <Radio.Group onChange={this.onChange} value={val}>
                        {
                            list.map(index => {
                                let desc = '';
                                if (index === 0) {
                                    desc = '导出前1万条';
                                } else if (index === list.length - 1) {
                                    desc = `导出${index * 10000}条-${allCount}条`;
                                } else {
                                    desc = `导出${index}万条-${index+1}条`;
                                }
                                return <Radio className="goods-local-excel-radio" key={index} value={index}>{desc}</Radio>
                            })
                        }
                    </Radio.Group>
                </div>
            </Modal>
        )
    }
}

export default ExcelDialog;
