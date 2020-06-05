import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { AutoEnLargeImg, JsonForm, LoadingButton } from 'react-components';
import classNames from 'classnames';
import styles from '@/pages/purchase/_return.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { FormField, JsonFormRef } from 'react-components/es/JsonForm';
import { IPurchaseItem } from '@/interface/IPurchase';
import { queryPurchaseList } from '@/services/purchase';
import { EmptyObject } from '@/config/global';
import { message } from 'antd';

const fieldList: FormField[] = [
    {
        label: 'SKU ID',
        type: 'number',
        name: 'commodity_sku_id',
        rules: [{ required: true, message: '请填写商品SKU ID' }],
        /*      formItemClassName: classNames(
            formStyles.formRequiredHide,
            formStyles.formRequiredAbsolute,
            formStyles.formItem,
        ),*/
    },
];

declare interface SearchGoodProps {
    formRef?: RefObject<JsonFormRef>;
    containerClassName?: string;
}

const SearchGood = ({ formRef, containerClassName }: SearchGoodProps) => {
    const _ref = useRef<JsonFormRef>(null);
    const formRef1 = formRef || _ref;
    const [goods, setGoods] = useState<IPurchaseItem>();
    const onSearch = useCallback(() => {
        return formRef1.current!.validateFields().then(values => {
            const { purchase_order_goods_id } = values;
            return queryPurchaseList({
                type: 0,
                purchase_order_goods_id: purchase_order_goods_id,
            })
                .request()
                .then(({ data: { list = [] } = EmptyObject }) => {
                    const item = list[0];
                    if (item) {
                        setGoods({
                            ...item,
                        });
                    } else {
                        message.error('查询不到相关采购单');
                    }
                });
        });
    }, []);

    const skuComponent = useMemo(() => {
        if (goods) {
            let skus: any[] = [];
            const { productSkuStyle } = goods;
            try {
                const sku = JSON.parse(productSkuStyle);
                for (let key in sku) {
                    skus.push(
                        <div key={key} className={styles.modalSku}>
                            {key}:{sku[key]}
                        </div>,
                    );
                }
            } catch (e) {}
            return skus;
        } else {
            return null;
        }
    }, [goods]);

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
                {goods ? (
                    <div className={classNames(formStyles.flex, formStyles.flexRow)}>
                        <div>
                            <AutoEnLargeImg
                                src={goods?.productImageUrl}
                                className={styles.modalImage}
                            />
                        </div>
                        <div>
                            <div className={styles.modalTitle} title={goods?.purchaseGoodsName}>
                                {goods?.purchaseGoodsName}
                            </div>
                            <div className={styles.modalSkus}>
                                <div className={styles.modalSku}>
                                    入库数量:{goods?.realInStorageNumber ?? 0}/
                                    {goods?.purchaseGoodsNumber ?? 0}
                                </div>
                                {skuComponent}
                            </div>
                        </div>
                    </div>
                ) : null}
            </React.Fragment>
        );
    }, []);
};

export default SearchGood;
