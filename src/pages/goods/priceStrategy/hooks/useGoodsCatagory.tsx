import React, { useState, useEffect } from 'react';
import { IOptionItem } from 'react-components/lib/JsonForm/items/Select';
import { getCatagoryList } from '@/services/goods';

export default function useGoodsCatagory() {
    const [catagoryList, setCatagoryList] = useState<IOptionItem[]>([]);

    useEffect(() => {
        getCatagoryList().then(({ convertList }) => {
            // console.log('getCatagoryList', res);
            setCatagoryList(convertList);
        });
    }, []);

    return {
        catagoryList,
    };
}
