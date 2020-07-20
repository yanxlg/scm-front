import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';
import { RichInput } from 'react-components';
import { isNull } from 'react-components/es/utils/formatter';
import { FormInstance } from 'antd/es/form';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

declare interface SalesRangeProps {
    form: FormInstance;
    label?: string;
    name?: [string, string];
}
const SalesRange: React.FC<SalesRangeProps> = ({
    form,
    label = '销量区间',
    name: [name1, name2] = ['sales_volume_min', 'sales_volume_max'],
}) => {
    const checkMinSaleNum = useCallback((rule: any, value: any) => {
        const sales_volume_max = form.getFieldValue(name2);
        if (
            !isNull(sales_volume_max) &&
            !isNull(value) &&
            Number(value) > Number(sales_volume_max)
        ) {
            return Promise.reject('最小销量不能大于最大销量');
        }
        return Promise.resolve();
    }, []);

    const checkMaxSaleNum = useCallback((rule: any, value: any) => {
        const sales_volume_min = form.getFieldValue(name1);
        if (
            !isNull(sales_volume_min) &&
            !isNull(value) &&
            Number(value) < Number(sales_volume_min)
        ) {
            return Promise.reject('最大销量不能小于最小销量');
        }
        return Promise.resolve();
    }, []);

    return useMemo(() => {
        return (
            <div
                className={classNames(
                    formStyles.flexInline,
                    formStyles.flexAlign,
                    formStyles.formItem,
                )}
            >
                <Form.Item
                    label={label}
                    required={true}
                    className={classNames(
                        formStyles.flexInline,
                        formStyles.formRequiredHide,
                        formStyles.formHorizon,
                        formStyles.formItemClean,
                    )}
                >
                    <Form.Item
                        className={classNames(
                            formStyles.formItemClean,
                            formStyles.inlineBlock,
                            formStyles.verticalMiddle,
                        )}
                        validateTrigger={'onBlur'}
                        name={name1}
                        rules={[
                            {
                                validator: checkMinSaleNum,
                            },
                        ]}
                    >
                        <RichInput richType="integer" className="input-small" />
                    </Form.Item>
                    <span className={classNames('config-colon', formStyles.verticalMiddle)}>-</span>
                    <Form.Item
                        className={classNames(
                            formStyles.formItemClean,
                            formStyles.inlineBlock,
                            formStyles.verticalMiddle,
                        )}
                        validateTrigger={'onBlur'}
                        name={name2}
                        rules={[
                            {
                                validator: checkMaxSaleNum,
                            },
                        ]}
                    >
                        <RichInput richType="integer" className="input-small" />
                    </Form.Item>
                </Form.Item>
            </div>
        );
    }, []);
};

export default SalesRange;
