import React, { useState, useEffect, useCallback } from 'react';
import { IGoodsEditItem, ICatagoryItem } from '@/interface/ILocalGoods';
import { getCatagoryList } from '@/services/goods';

export default function() {
    const [goodsEditStatus, setGoodsEditStatus] = useState(false);
    const [currentEditGoods, setCurrentEditGoods] = useState<IGoodsEditItem | null>(null);
    const [originEditGoods, setOriginEditGoods] = useState<IGoodsEditItem | null>(null);
    const [allCatagoryList, setAllCatagoryList] = useState<ICatagoryItem[]>([]);

    const getCurrentCatagory = useCallback(
        (firstId: string, secondId?: string) => {
            let ret: ICatagoryItem[] = [];
            const firstIndex = allCatagoryList.findIndex(item => item.id === firstId);
            ret = (allCatagoryList[firstIndex].children as ICatagoryItem[]) || [];
            if (secondId) {
                const secondIndex = ret.findIndex(item => item.id === secondId);
                ret = (ret[secondIndex].children as ICatagoryItem[]) || [];
            }
            return ret;
        },
        [allCatagoryList],
    );

    const toggleEditGoodsDialog = useCallback(
        (status: boolean, rowData?: any) => {
            let currentEditGoods: IGoodsEditItem | null = null
            if (rowData) {
                const { product_id, title, description, first_catagory, second_catagory, third_catagory, goods_img, sku_image } = rowData;
                currentEditGoods = {
                    product_id, 
                    title, 
                    description, 
                    first_catagory, 
                    second_catagory, 
                    third_catagory, 
                    goods_img, 
                    sku_image
                }
            };
            setGoodsEditStatus(status);
            setCurrentEditGoods(currentEditGoods ? { ...currentEditGoods } : null);
            setOriginEditGoods(currentEditGoods ? { ...currentEditGoods } : null);
        },
        []
    );

    // 编辑title和description
    const changeGoodsText = useCallback(
        (type: string, text: string) => {
            setCurrentEditGoods({
                ...(currentEditGoods as IGoodsEditItem),
                [type]: text,
            })
        },
        [currentEditGoods]
    );

    // 编辑类目
    const changeGoodsCatagory = useCallback(
        (type: string, id: string) => {
            if (type === 'first_catagory') {
                setCurrentEditGoods({
                    ...(currentEditGoods as IGoodsEditItem),
                    first_catagory: {
                        id,
                    },
                    second_catagory: {},
                    third_catagory: {},
                });
                
            } else if (type === 'second_catagory') {
                setCurrentEditGoods({
                    ...(currentEditGoods as IGoodsEditItem),
                    second_catagory: { id },
                    third_catagory: {},
                });
            } else {
                setCurrentEditGoods({
                    ...(currentEditGoods as IGoodsEditItem),
                    third_catagory: { id },
                });
            }
        },
        [currentEditGoods]
    );

    // 编辑图片
    const changeGoodsImg = useCallback(
        (imgList: string[]) => {
            setCurrentEditGoods({
                ...(currentEditGoods as IGoodsEditItem),
                sku_image: imgList,
            });
        },
        [currentEditGoods],
    );

    // 重置编辑弹框
    const resetGoodsData = useCallback(
        () => {
            setCurrentEditGoods({
                ...(originEditGoods as IGoodsEditItem)
            })
        },
        [originEditGoods],
    )

    useEffect(
        () => {
            getCatagoryList().then(res => {
                // console.log('getCatagoryList', res);
                setAllCatagoryList(res.list);
            });
        },
        []
    );

    return {
        goodsEditStatus,
        setGoodsEditStatus,
        currentEditGoods,
        setCurrentEditGoods,
        originEditGoods,
        setOriginEditGoods,
        allCatagoryList,
        setAllCatagoryList,
        getCurrentCatagory,
        toggleEditGoodsDialog,
        changeGoodsText,
        changeGoodsCatagory,
        changeGoodsImg,
        resetGoodsData
    }
}