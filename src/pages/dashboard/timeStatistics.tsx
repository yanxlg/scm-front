import React, { useMemo, useRef, useCallback } from 'react';
import { JsonForm, LoadingButton } from 'react-components';
import { JsonFormRef, FormField } from 'react-components/es/JsonForm';
import OutStock, { IOutStockRef } from './components/TimeStatistics/OutStock';
import InStock from './components/TimeStatistics/InStock';
import Cancel, { ICancelRef } from './components/TimeStatistics/Cancel';
import styles from './_timeStatistics.less';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { getPlatformAndStore } from '@/services/dashboard';

const formFields: FormField[] = [
    {
        type: 'select',
        name: 'channel_source',
        label: '销售平台',
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => getPlatformAndStore(),
        onChange: (_, form) => {
            form.resetFields(['channel_merchant_name']);
        },
    },
    {
        type: 'select',
        name: 'channel_merchant_name',
        label: '店铺名',
        optionListDependence: {
            name: 'channel_source',
            key: 'children',
        },
        syncDefaultOption: {
            value: '',
            name: '全部',
        },
        optionList: () => getPlatformAndStore(),
    },
];

const TimeStatistics: React.FC = () => {
    const searchRef = useRef<JsonFormRef>(null);
    const outStockRef = useRef<IOutStockRef>(null);
    const cancelRef = useRef<ICancelRef>(null);

    const onSearch = useCallback(() => {
        return Promise.all([
            (outStockRef.current as IOutStockRef).onSearch(),
            (cancelRef.current as ICancelRef).onSearch(),
        ]);
    }, []);

    return useMemo(() => {
        return (
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <JsonForm
                        ref={searchRef}
                        fieldList={formFields}
                        initialValues={{
                            channel_source: '',
                            channel_merchant_name: '',
                        }}
                    >
                        <div>
                            <LoadingButton
                                type="primary"
                                className={formStyles.formBtn}
                                onClick={() => onSearch()}
                            >
                                查询
                            </LoadingButton>
                        </div>
                    </JsonForm>
                </div>
                <div className={styles.dataSection}>
                    <OutStock ref={outStockRef} searchRef={searchRef} />
                </div>
                <div className={styles.dataSection}>
                    <InStock />
                </div>
                <div className={styles.dataSection}>
                    <Cancel ref={cancelRef} searchRef={searchRef} />
                </div>
            </div>
        );
    }, []);
};

export default TimeStatistics;
