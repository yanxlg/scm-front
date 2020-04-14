import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';
import { RichInput } from 'react-components';
import { FormInstance } from 'antd/es/form';
import { isNull } from 'react-components/es/utils/formatter';
import formStyles from 'react-components/es/JsonForm/_form.less';
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
            <div
                className={classNames(
                    formStyles.flexInline,
                    formStyles.flexAlign,
                    formStyles.formItem,
                )}
            >
                <Form.Item
                    label="价格区间(￥)"
                    required={true}
                    className={classNames(
                        formStyles.formInline,
                        formStyles.flexInline,
                        formStyles.formRequiredHide,
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
                        name="price_min"
                        rules={[
                            {
                                validator: checkMinPrice,
                            },
                        ]}
                    >
                        <RichInput richType="number" className="input-small" />
                    </Form.Item>
                    <span className={classNames('config-colon', formStyles.verticalMiddle)}>-</span>
                    <Form.Item
                        className={classNames(
                            formStyles.formItemClean,
                            formStyles.inlineBlock,
                            formStyles.verticalMiddle,
                        )}
                        validateTrigger={'onBlur'}
                        name="price_max"
                        rules={[
                            {
                                validator: checkMaxPrice,
                            },
                        ]}
                    >
                        <RichInput richType="number" className="input-small" />
                    </Form.Item>
                </Form.Item>
            </div>
        );
    }, []);
};

export default PriceRange;
