import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import { getCountryPrice } from '@/services/goods';
import { ColumnsType } from 'antd/lib/table';

interface IProps {
    visible: boolean;
    productId: string;
    onCancel(): void;
}

const columns: ColumnsType<IPriceItem> = [
    {
        title: '国家',
        dataIndex: 'country',
        align: 'center',
    },
    {
        title: '价格(￥)',
        dataIndex: 'price',
        align: 'center',
        render: ({ minPrice, maxPrice }) => `${minPrice} ~ ${maxPrice}`,
    },
];

interface IPriceInfo {
    minPrice: number;
    maxPrice: number;
}

interface IPriceItem {
    country: string;
    price: IPriceInfo;
}

const CountryFreightModal: React.FC<IProps> = ({ visible, onCancel, productId }) => {
    const [loading, setLoading] = useState(true);
    const [priceList, setPriceList] = useState<IPriceItem[]>([]);

    const _getCountryPrice = useCallback(productId => {
        setLoading(true);
        getCountryPrice(productId)
            .then(({ data }) => {
                // console.log('getCountryPrice', res);
                if (data) {
                    const list = Object.keys(data).map(key => ({
                        country: key,
                        price: data[key],
                    }));
                    setPriceList(list);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleCancel = useCallback(() => {
        setPriceList([]);
        onCancel();
    }, []);

    useEffect(() => {
        if (visible) {
            _getCountryPrice(productId);
        }
    }, [visible]);

    return (
        <Modal title="国家价格" visible={visible} width={600} onCancel={handleCancel} footer={null}>
            <Table
                bordered
                rowKey="country"
                loading={loading}
                columns={columns}
                dataSource={priceList}
                pagination={false}
                scroll={{ y: 400 }}
            />
        </Modal>
    );
};

export default React.memo(CountryFreightModal);
