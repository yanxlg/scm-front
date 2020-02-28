import React from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

export declare interface IOptionalColItem {
    key: string;
    name: string;
}

declare interface IOptionalColumnProps {
    // 表格默认展示的列这里不展示
    optionalColList: IOptionalColItem[];
    selectedColKeyList: string[];
    changeSelectedColList(list: string[]): void;
}

declare interface IOptionalColumnState {
    indeterminate: boolean;
    checkAll: boolean;
}

class OptionalColumn extends React.PureComponent<IOptionalColumnProps, IOptionalColumnState> {

    constructor(props: IOptionalColumnProps) {
        super(props);
        this.state = {
            indeterminate: false,
            checkAll: false
        }
    }

    onCheckAll = (e: CheckboxChangeEvent) => {
        const { changeSelectedColList, optionalColList } = this.props;
        const checked = e.target.checked;
        this.setState({
            // checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: checked,
        });
        changeSelectedColList(checked ? optionalColList.map(item => item.key) : []);
    }

    onCheckSingle = (keyList: CheckboxValueType[]) => {
        // console.log('onCheckSingle', keyList);
        const { changeSelectedColList, optionalColList } = this.props;
        // const currentColumnList = allColumnList.filter(item => );
        changeSelectedColList(keyList as string[]);
        this.setState({
            indeterminate: keyList.length > 0,
            checkAll: keyList.length === optionalColList.length
        });
    }

    render() {

        const { optionalColList, selectedColKeyList } = this.props;

        return (
            <div className="order-optional-column">
                <div className="all">
                    <strong>可选字段：</strong>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAll}
                        checked={this.state.checkAll}
                    >
                        全选
                    </Checkbox>
                </div>
                <Checkbox.Group style={{ width: '100%' }} value={selectedColKeyList} onChange={this.onCheckSingle}>
                    {
                        optionalColList.map(item => (
                            <Checkbox className="checkbox-item" key={item.key} value={item.key}>{item.name}</Checkbox>
                        ))
                    }
                </Checkbox.Group>
            </div>
        )
    }
}

export default OptionalColumn;
