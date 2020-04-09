import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';
import { RichInput } from 'react-components';
import { isNull } from 'react-components/es/JsonForm';
import { FormInstance } from 'antd/es/form';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

declare interface SalesRangeProps {
    form: FormInstance;
}
const SalesRange: React.FC<SalesRangeProps> = ({ form }) => {
    const checkMinSaleNum = useCallback((rule: any, value: any) => {
        const sales_volume_max = form.getFieldValue('sales_volume_max');
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
        const sales_volume_min = form.getFieldValue('sales_volume_min');
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
                    label="销量区间"
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
                        name="sales_volume_min"
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
                        name="sales_volume_max"
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
