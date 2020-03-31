import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';
import IntegerInput from '@/components/Input/IntegerInput';
import { FormInstance } from 'antd/es/form';
import { isNull } from '@/components/SearchForm/utils';
import formStyles from '@/components/SearchForm/_form.less';
import classNames from 'classnames';

declare interface PriceRangeProps {
    form: FormInstance;
}

const PriceRange: React.FC<PriceRangeProps> = ({ form }) => {
    const checkMinPrice = useCallback((rule: any, value: any) => {
        const price_max = form.getFieldValue('price_max');
        if (!isNull(price_max) && !isNull(value) && Number(value) > Number(price_max)) {
            return Promise.reject('最小价格不能大于最大价格');
        }
        return Promise.resolve();
    }, []);

    const checkMaxPrice = useCallback((rule: any, value: any) => {
        const price_min = form.getFieldValue('price_min');
        if (!isNull(price_min) && !isNull(value) && Number(value) < Number(price_min)) {
            return Promise.reject('最大价格不能小于最小价格');
        }
        return Promise.resolve();
    }, []);

    return useMemo(() => {
        return (
            <div className="flex-inline flex-align form-item form-item-horizon">
                <Form.Item
                    label="价格区间(￥)"
                    required={true}
                    className={classNames(
                        formStyles.formInline,
                        'flex-inline',
                        formStyles.formRequiredHide,
                    )}
                >
                    <Form.Item
                        className={classNames(
                            formStyles.formInline,
                            'inline-block vertical-middle',
                        )}
                        validateTrigger={'onBlur'}
                        name="price_min"
                        rules={[
                            {
                                validator: checkMinPrice,
                            },
                        ]}
                    >
                        <IntegerInput min={0} className="input-small input-handler" />
                    </Form.Item>
                    <span className="config-colon vertical-middle">-</span>
                    <Form.Item
                        className={classNames(
                            formStyles.formInline,
                            'inline-block vertical-middle',
                        )}
                        validateTrigger={'onBlur'}
                        name="price_max"
                        rules={[
                            {
                                validator: checkMaxPrice,
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

export default PriceRange;
