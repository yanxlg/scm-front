import React from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';

declare interface IOptionalColumnProps {

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

    onCheckAllChange = (e: CheckboxChangeEvent) => {
        this.setState({
            // checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    render() {
        return (
            <div className="order-optional-column">
                <div className="all">
                    <strong>可选字段：</strong>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        全选
                    </Checkbox>
                </div>
            </div>
        )
    }
}

export default OptionalColumn;
