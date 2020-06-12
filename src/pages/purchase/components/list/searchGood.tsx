import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { AutoEnLargeImg, JsonForm, LoadingButton } from 'react-components';
import classNames from 'classnames';
import styles from './_searchGood.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { EmptyObject } from '@/config/global';
import { Col, Row } from 'antd';
import { queryGoodBySkuId } from '@/services/global';
import { IGood } from '@/interface/ILocalGoods';

declare interface SearchGoodProps {
    formRef?: RefObject<JsonFormRef>;
    containerClassName?: string;
    onDataChange?: (good: IGood | undefined) => void;
}

const SearchGood = ({ formRef, containerClassName, onDataChange }: SearchGoodProps) => {
    const _ref = useRef<JsonFormRef>(null);
    const formRef1 = formRef || _ref;
    const [good, setGood] = useState<IGood | undefined>();

    const fieldList: FormField[] = useMemo(() => {
        return [
            {
                label: 'SKU ID',
                type: 'input',
                name: 'commodity_sku_id',
                rules: [
                    { required: true, message: '请填写商品SKU ID' },
                    {
                        validator(rule, value) {
                            if (good) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject('请先校验SKU ID并获取商品信息');
                            }
                        },
                        validateTrigger: 'onSubmit',
                    },
                ],
                onChange: (name, form) => {
                    setGood(undefined);
                    onDataChange?.(undefined);
                },
                /*      formItemClassName: classNames(
                    formStyles.formRequiredHide,
                    formStyles.formRequiredAbsolute,
                    formStyles.formItem,
                ),*/
            },
        ];
    }, [good]);

    const onSearch = useCallback(() => {
        const { commodity_sku_id } = formRef1.current!.getFieldsValue(); // 不校验good
        if (!commodity_sku_id) {
            return formRef1.current!.validateFields();
        } else {
            return queryGoodBySkuId(commodity_sku_id).then(({ data = EmptyObject }) => {
                setGood({
                    ...data,
                });
                onDataChange?.(data);
            });
        }
    }, []);

    const skuComponent = useMemo(() => {
        if (good) {
            const { productOptionValue } = good;
            return productOptionValue.map(option => {
                return (
                    <div key={option.option?.text} className={styles.sku}>
                        {option.option?.text}:{option.value?.text}
                    </div>
                );
            });
        } else {
            return null;
        }
    }, [good]);

    return useMemo(() => {
        return (
            <React.Fragment>
                <JsonForm
                    containerClassName={containerClassName}
                    ref={formRef1}
                    fieldList={fieldList}
                    enableCollapse={false}
                    className={formStyles.formHelpAbsolute}
                >
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                </JsonForm>
                {good ? (
                    <div className={classNames(formStyles.flex, formStyles.flexRow, styles.good)}>
                        <div>
                            <AutoEnLargeImg src={good?.skuImage?.url} className={styles.image} />
                        </div>
                        <div>
                            <div className={styles.title} title={good?.productTitle}>
                                {good?.productTitle}
                            </div>
                            <div className={styles.skus}>{skuComponent}</div>
                            <Row gutter={[15, 0]}>
                                <Col span={16} title={good?.commodityId}>
                                    <span className={styles.skuKey}>Commodity ID</span>：
                                    {good?.commodityId}
                                </Col>
                                <Col span={8} title={good?.sku}>
                                    <span className={styles.skuKey}>SKU ID</span>：{good?.sku}
                                </Col>
                            </Row>
                        </div>
                    </div>
                ) : null}
            </React.Fragment>
        );
    }, [good]);
};

export default SearchGood;
