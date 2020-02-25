import React from 'react';
import { Form, Input, Checkbox, Select, DatePicker } from 'antd';

const { Option } = Select;

declare interface IOptionItem {
    name: string;
    value: string;
}

export declare interface IFieldItem {
    type: 'input' | 'select' | 'checkbox' | 'datePicker';
    name: string;
    labelText: string;
    placeholder?: string;
    optionList?: IOptionItem[];
}

declare interface IJsonFormProps {
    fieldList: IFieldItem[];
}

function Label(props: {text: string}) {
    return <span className="order-label">{props.text}</span>
}

export default class JsonForm extends React.PureComponent<IJsonFormProps> {

    addFormItem = (field: IFieldItem) => {
        switch (field.type) {
            case 'input':
                return this.addInput(field);
            case 'select':
                return this.addSelect(field);
            case 'checkbox':
                return this.addCheckbox(field);
            case 'datePicker': 
                return this.addDatePicker(field);
            default:
                return null;
       }  
    }

    addInput = (field: IFieldItem) => {
        const {
            name,
            placeholder,
            labelText,
        } = field;
        return (
            <Form.Item
                name={name}
                label={<Label text={labelText}/>}
            >
                <Input placeholder={placeholder}/>
            </Form.Item>
        )
    }

    addSelect = (field: IFieldItem) => {
        const {
            name,
            optionList,
            labelText,
        } = field;
        return (
            <Form.Item
                name={name}
                label={<Label text={labelText} />}
            >
                <Select>
                    {
                        optionList!.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                    }
                </Select>
            </Form.Item>
        )
    }

    addDatePicker = (field: IFieldItem) => {
        const {
            name,
            placeholder,
            labelText,
        } = field;
        return (
            <Form.Item
                name={name}
                label={<Label text={labelText}/>}
            >
                <DatePicker
                    className="order-input" 
                    placeholder={placeholder}
                />
            </Form.Item>
        )
    }

    addCheckbox = (field: IFieldItem) => {
        const {
            name,
            labelText,
        } = field;
        return (
            <Form.Item
                name={name}
            >
                <Checkbox>{labelText}</Checkbox>
            </Form.Item>
        )
    }

    render() {

        const { fieldList } = this.props;

        return (
            <Form
                layout="inline"
            >
                {/* {fieldList => (
                    <Form.Item {...field}>
                        <Input />
                    </Form.Item>
                )} */}
                {
                    fieldList.map(field => this.addFormItem(field))
                }
            </Form>
        )
    }
}

