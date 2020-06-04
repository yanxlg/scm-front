import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllGoodsTagList } from '@/services/price-strategy';

export default function useGoodsTag() {
    const [allGoodsTagList, setAllGoodsTagList] = useState<string[]>([]);
    const [checkedGoodsTagList, setCheckedGoodsTagList] = useState<string[]>([]);

    const toggleGoodsTag = useCallback(
        (name: string) => {
            const index = checkedGoodsTagList.findIndex(currentName => currentName === name);
            if (index > -1) {
                const list = [...checkedGoodsTagList];
                list.splice(index, 1);
                setCheckedGoodsTagList(list);
            } else {
                setCheckedGoodsTagList([...checkedGoodsTagList, name]);
            }
        },
        [checkedGoodsTagList],
    );

    const goodsTagList = useMemo(() => {
        return allGoodsTagList.map(name => {
            return {
                name: name,
                checked: checkedGoodsTagList.indexOf(name) > -1,
            };
        });
    }, [allGoodsTagList, checkedGoodsTagList]);

    useEffect(() => {
        getAllGoodsTagList().then(list => {
            setAllGoodsTagList(list.map(({ name }: any) => name));
        });
    }, []);

    return {
        goodsTagList,
        checkedGoodsTagList,
        toggleGoodsTag,
        setCheckedGoodsTagList,
    };
}
