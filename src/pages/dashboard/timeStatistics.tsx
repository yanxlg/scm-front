import React, { useMemo, useRef, useCallback } from 'react';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import { queryShopFilterList } from '@/services/global';
import OutStock, { IOutStockRef } from './components/TimeStatistics/OutStock';

import styles from './_timeStatistics.less';
import formStyles from 'react-components/es/JsonForm/_form.less';

const formFields: FormField[] = [
    {
        type: 'select',
        name: 'a1',
        label: '销售平台',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => queryShopFilterList(),
        onChange: (_, form) => {
            form.resetFields(['a2']);
        },
    },
    {
        type: 'select',
        name: 'a2',
        label: '店铺名',
        optionListDependence: {
            name: 'platform',
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => queryShopFilterList(),
    },
];

const TimeStatistics: React.FC = () => {
    const searchRef = useRef<JsonFormRef>(null);
    const outStockRef = useRef<IOutStockRef>(null);

    const onSearch = useCallback(() => {
        console.log(1111111, outStockRef.current?.onSearch());
        return Promise.resolve();
    }, []);

    return useMemo(() => {
        return (
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <JsonForm
                        ref={searchRef}
                        fieldList={formFields}
                        initialValues={{
                            a1: '',
                            a2: '',
                        }}
                    >
                        <div>
                            <LoadingButton
                                type="primary"
                                className={formStyles.formBtn}
                                onClick={onSearch}
                            >
                                查询
                            </LoadingButton>
                        </div>
                    </JsonForm>
                </div>
                <div className={styles.dataSection}>
                    <OutStock ref={outStockRef} />
                </div>
            </div>
        );
    }, []);
};

export default TimeStatistics;
