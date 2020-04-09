import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';
import { IntegerInput } from 'react-components';
import { isNull } from 'react-components/es/JsonForm';
import { FormInstance } from 'antd/es/form';

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
            <div className="flex-inline flex-align form-item">
                <Form.Item
                    label="销量区间"
                    required={true}
                    className="form-item-inline flex-inline form-required-hide form-item-horizon"
                >
                    <Form.Item
                        className="form-item-inline inline-block vertical-middle"
                        validateTrigger={'onBlur'}
                        name="sales_volume_min"
                        rules={[
                            {
                                validator: checkMinSaleNum,
                            },
                        ]}
                    >
                        <IntegerInput min={0} className="input-small input-handler" />
                    </Form.Item>
                    <span className="config-colon vertical-middle">-</span>
                    <Form.Item
                        className="form-item-inline inline-block vertical-middle"
                        validateTrigger={'onBlur'}
                        name="sales_volume_max"
                        rules={[
                            {
                                validator: checkMaxSaleNum,
                            },
                        ]}
                    >
                        <IntegerInput min={0} className="input-small input-handler" />
                    </Form.Item>
                </Form.Item>
            </div>
        );
    }, []);
};

export default SalesRange;
