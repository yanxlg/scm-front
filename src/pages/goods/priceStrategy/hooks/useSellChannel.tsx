import React, { useState, useEffect } from 'react';
import { queryShopFilterList } from '@/services/global';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';

export default function useSellChannel() {
    const [sellChannelList, setSellChannelList] = useState<IOptionItem[]>([]);

    useEffect(() => {
        queryShopFilterList().then(res => {
            setSellChannelList(res);
        });
    }, []);

    return {
        sellChannelList,
    };
}
