import React, { FocusEvent, KeyboardEvent } from 'react';
import { Input } from 'antd';

declare interface IEditableCellProps {
    // type: 'title' | 'desc',
    text: string;
    // productId: string;
    editGoodsInfo(text: string, cb: () => void): void;
}

declare interface IEditableCellState {
    editing: boolean;
}

class EditableCell extends React.PureComponent<IEditableCellProps, IEditableCellState> {
    input: Input | null =  null

    constructor(props: IEditableCellProps) {
        super(props);
        this.state = {
            editing: false
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing && this.input) {
                this.input.focus();
                this.input.setValue(this.props.text)
                // console.log(this.input);
                // this.input.value = '22222';
            }
        });
    }

    // e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
    save = () => {
        
        if (this.input) {
            // console.log(this.input.state.value);
            const val = this.input.state.value
            this.props.editGoodsInfo(val, () => {
                (this.input as Input).setValue(val)
                this.toggleEdit();
            });
        }
    }

    render() {

        const { editing } = this.state;
        const { text } = this.props;

        return editing ? (
            <Input
                // value={text}
                ref={node => (this.input = node)} 
                onPressEnter={this.save} 
                onBlur={this.save}
            />
          ) : (
            <div
              className="goods-local-editable-cell"
              onClick={this.toggleEdit}
            >
                {text}
            </div>
          )
    }
}

export default EditableCell;
