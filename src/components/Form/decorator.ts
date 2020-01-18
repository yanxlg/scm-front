import { Form } from 'antd';
import { FormComponentProps, FormCreateOption } from 'antd/lib/form';

function form<TOwnProps extends FormComponentProps<any>>(options?: FormCreateOption<TOwnProps>) {
    return function wrapWithConnect(target: any) {
        return Form.create(options)(target) as any;
    };
}

export { form };
