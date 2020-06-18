import React, { useMemo, useState, useCallback } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

const baseGroupList = [
    { key: 'orderCreateTime', name: '订单生成时间' },
    { key: 'orderGoodsStatus', name: '订单状态' },
    { key: 'cancelType', name: '子订单取消类型' },
    { key: 'orderGoodsShippingStatusShow', name: '配送状态' },
    { key: 'orderId', name: '父订单ID' },
    { key: 'orderGoodsId', name: '子订单ID' },
    { key: 'commodityId', name: 'Commodity ID' },
    { key: 'productId', name: 'Product ID' },
    { key: 'skuId', name: '中台SKU ID' },
    { key: 'productName', name: '商品名称' },
    { key: 'productImage', name: 'SKU图片' },
    { key: 'productStyle', name: '商品规格' },
    { key: 'goodsAmount', name: '销售商品单价' },
    { key: 'goodsNumber', name: '销售商品数量' },
    { key: 'freight', name: '销售商品运费' },
    { key: '_goodsTotalAmount', name: '销售商品总金额' },
    { key: 'currency', name: '销售金额货币' },
    { key: 'purchaseAmount', name: '采购商品单价' },
    { key: 'purchaseNumber', name: '采购商品数量' },
    { key: '_purchaseTotalAmount', name: '采购商品总金额' },
    { key: 'saleMinusPurchaseNormalPrice', name: '销售-采购价差' },

    // { key: '', name: '商品属性标签' },
    // { key: 'cancelType', name: '中台订单取消原因' }, // 带补充
    { key: 'orderAddress', name: '用户地址信息' },
    { key: 'platformUid', name: '下单账号' },
    { key: '_logisticsTrack', name: '物流轨迹' },
    // { key: 'warehouseId', name: '仓库名称' },
    // { key: 'platformUid', name: '下单账号' },
];

const saleGroupList = [
    { key: 'channelSource', name: '销售渠道' },
    { key: 'productShop', name: '销售店铺名称' },
    { key: 'purchasePlatform', name: '商品渠道' },
    // { key: '', name: '二级分类' },
    // { key: '', name: '销售渠道Goods ID' },
    { key: 'confirmTime', name: '销售订单确认时间' },
    { key: 'channelOrderGoodsSn', name: '销售订单ID' },
    { key: 'cancelTime', name: '销售订单取消时间' },
    { key: 'deliveryTime', name: '销售订单出库时间' },
    { key: 'collectTime', name: '销售订单揽收时间' },
    { key: 'lastWaybillNo', name: '销售尾程运单ID' },
    { key: 'receiveTime', name: '妥投时间' },
];

const purchaseGroupList = [
    { key: 'purchaseCreateTime', name: '采购订单生成时间' },
    { key: 'purchasePlanId', name: '采购计划ID' },
    { key: 'reserveStatus', name: '仓库库存预定状态' },

    { key: 'purchaseOrderStatus', name: '采购计划状态' },
    { key: 'purchaseFailCode', name: '失败原因' },
    { key: 'purchasePlatform', name: '采购平台' },
    // { key: '', name: '采购店铺名称' },
    { key: 'purchasePlatformParentOrderId', name: '采购父订单ID' },
    { key: 'purchasePlatformOrderId', name: '供应商订单ID' },
    // { key: '', name: '采购渠道订单ID' },
    { key: 'payTime', name: '采购支付时间' },
    { key: 'purchaseOrderPayStatus', name: '采购支付状态' },
    { key: 'purchaseWaybillNo', name: '采购运单ID' },
    { key: 'purchaseCancelReason', name: '采购取消原因' },
    { key: 'purchaseTime', name: '采购签收时间' },
    { key: 'storageTime', name: '采购入库时间' },
    { key: 'purchaseCancelType', name: '采购单取消类型' },
];

const baseAllKeyList = baseGroupList.map(item => item.key);
const saleAllKeyList = saleGroupList.map(item => item.key);
const purchaseAllKeyList = purchaseGroupList.map(item => item.key);

interface IProps {
    value: Array<CheckboxValueType>;
    onChange: (checkedValue: Array<CheckboxValueType>) => void;
}

const AllColumnsSetting: React.FC<IProps> = ({ value, onChange }) => {
    // console.log('AllColumnsSetting', value);
    const [baseList, setBaseList] = useState(
        value.filter(key => baseAllKeyList.indexOf(key as string) > -1),
    );
    const [saleList, setSaleList] = useState(
        value.filter(key => saleAllKeyList.indexOf(key as string) > -1),
    );
    const [purchaseList, setPurchaseList] = useState(
        value.filter(key => purchaseAllKeyList.indexOf(key as string) > -1),
    );
    // const [baseCheckedAll, setBaseCheckedAll] = useState(false);

    const changeBaseList = useCallback(
        val => {
            // console.log('changeBaseList', val);
            setBaseList(val);
            onChange([...val, ...saleList, ...purchaseList]);
        },
        [saleList, purchaseList],
    );

    const handleClickBaseAll = useCallback(
        e => {
            const { checked } = e.target;
            setBaseList(checked ? [...baseAllKeyList] : []);
            onChange([...(checked ? baseAllKeyList : []), ...saleList, ...purchaseList]);
        },
        [saleList, purchaseList],
    );

    const changeSaleList = useCallback(
        val => {
            // console.log('changeBaseList', val);
            setSaleList(val);
            onChange([...baseList, ...val, ...purchaseList]);
        },
        [baseList, purchaseList],
    );

    const handleClickSaleAll = useCallback(
        e => {
            const { checked } = e.target;
            setSaleList(checked ? [...saleAllKeyList] : []);
            onChange([...baseList, ...(checked ? saleAllKeyList : []), ...purchaseList]);
        },
        [baseList, purchaseList],
    );

    const changePurchaseList = useCallback(
        val => {
            // console.log('changeBaseList', val);
            setPurchaseList(val);
            onChange([...baseList, ...saleList, ...val]);
        },
        [baseList, saleList],
    );

    const handleClickPurchaseAll = useCallback(
        e => {
            const { checked } = e.target;
            setPurchaseList(checked ? [...purchaseAllKeyList] : []);
            onChange([...baseList, ...saleList, ...(checked ? purchaseAllKeyList : [])]);
        },
        [baseList, saleList],
    );

    return useMemo(() => {
        return (
            <>
                <div style={{ marginBottom: 15 }}>
                    <Checkbox
                        onChange={handleClickBaseAll}
                        checked={baseList.length === baseAllKeyList.length}
                        indeterminate={!!baseList.length && baseList.length < baseAllKeyList.length}
                    >
                        <strong>基本信息</strong>
                    </Checkbox>
                </div>
                <Checkbox.Group value={baseList} onChange={changeBaseList}>
                    <Row gutter={[0, 5]}>
                        {baseGroupList.map(item => {
                            const { key, name } = item;
                            return (
                                <Col span={6} key={key}>
                                    <Checkbox value={key}>{name}</Checkbox>
                                </Col>
                            );
                        })}
                    </Row>
                </Checkbox.Group>

                <div style={{ margin: '25px 0 15px' }}>
                    <Checkbox
                        onChange={handleClickSaleAll}
                        checked={saleList.length === saleAllKeyList.length}
                        indeterminate={!!saleList.length && saleList.length < saleAllKeyList.length}
                    >
                        <strong>销售渠道信息</strong>
                    </Checkbox>
                </div>
                <Checkbox.Group value={saleList} onChange={changeSaleList}>
                    <Row gutter={[0, 5]}>
                        {saleGroupList.map(item => {
                            const { key, name } = item;
                            return (
                                <Col span={6} key={key}>
                                    <Checkbox value={key}>{name}</Checkbox>
                                </Col>
                            );
                        })}
                    </Row>
                </Checkbox.Group>

                <div style={{ margin: '25px 0 15px' }}>
                    <Checkbox
                        onChange={handleClickPurchaseAll}
                        checked={purchaseList.length === purchaseAllKeyList.length}
                        indeterminate={
                            !!purchaseList.length && purchaseList.length < purchaseAllKeyList.length
                        }
                    >
                        <strong>采购渠道信息</strong>
                    </Checkbox>
                </div>
                <Checkbox.Group value={purchaseList} onChange={changePurchaseList}>
                    <Row gutter={[0, 5]}>
                        {purchaseGroupList.map(item => {
                            const { key, name } = item;
                            return (
                                <Col span={6} key={key}>
                                    <Checkbox value={key}>{name}</Checkbox>
                                </Col>
                            );
                        })}
                    </Row>
                </Checkbox.Group>
            </>
        );
    }, [value, baseList, saleList, purchaseList]);
};

export default AllColumnsSetting;
