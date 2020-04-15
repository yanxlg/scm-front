import React, { useMemo } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

const baseGroupList = [
    { key: 'createTime', name: '订单生成时间' },
    { key: 'orderGoodsStatus', name: '订单状态' },
    { key: 'orderGoodsShippingStatusShow', name: '配送状态' },
    { key: 'orderId', name: '父订单ID' },
    { key: 'orderGoodsId', name: '子订单ID' },
    { key: 'productId', name: 'Version ID' },
    { key: 'skuId', name: '中台SKU ID' },
    // { key: '', name: '采购渠道' },
    // { key: '', name: '采购渠道Goods ID' },
    // { key: '', name: '采购渠道SKU ID' },
    // { key: '', name: '商品名称' },
    { key: 'productImage', name: 'SKU图片' },
    { key: 'productStyle', name: '商品规格' },
    { key: 'goodsAmount', name: '销售商品单价' },
    { key: 'goodsNumber', name: '销售商品数量' },
    { key: 'freight', name: '销售商品运费' },
    { key: '_goodsTotalAmount', name: '销售商品总金额' },
    { key: 'currency', name: '销售金额货币' },
    { key: 'purchaseNumber', name: '采购商品数量' },
    { key: 'purchaseAmount', name: '采购商品单价' },
    { key: '_purchaseTotalAmount', name: '采购商品总金额' },
    // { key: '', name: '商品属性标签' },
    // { key: 'cancelType', name: '中台订单取消原因' }, // 带补充
    { key: '_logisticsTrack', name: '物流轨迹' },
];

const saleGroupList = [
    { key: 'channelSource', name: '销售渠道' },
    // { key: '', name: '销售店铺名称' },
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
    { key: 'purchasePlanId', name: '采购计划ID' },
    { key: 'reserveStatus', name: '仓库库存预定状态' },
    { key: 'purchasePlatform', name: '采购平台' },
    // { key: '', name: '采购店铺名称' },
    { key: 'purchaseOrderStatus', name: '采购订单状态' },
    { key: 'purchaseCreateTime', name: '采购订单生成时间' },
    { key: 'purchasePlatformParentOrderId', name: '采购父订单ID' },
    { key: 'purchasePlatformOrderId', name: '采购订单ID' },
    // { key: '', name: '采购渠道订单ID' },
    { key: 'purchaseOrderPayStatus', name: '采购支付状态' },
    { key: 'payTime', name: '采购支付时间' },
    { key: 'purchaseWaybillNo', name: '采购运单ID' },
    { key: 'purchaseCancelReason', name: '采购取消原因' },
    { key: 'purchaseTime', name: '采购签收时间' },
    { key: 'storageTime', name: '采购入库时间' },
];

interface IProps {
    value: Array<CheckboxValueType>;
    onChange: (checkedValue: Array<CheckboxValueType>) => void;
}

const AllColumnsSetting: React.FC<IProps> = ({ value, onChange }) => {
    console.log('AllColumnsSetting', value, onChange);
    return useMemo(() => {
        return (
            <>
                <div>
                    <Checkbox
                    // indeterminate={this.state.indeterminate}
                    // onChange={this.onCheckAllChange}
                    // checked={this.state.checkAll}
                    >
                        基本信息
                    </Checkbox>
                </div>
                {/* value={columnsShowList} */}
                <Checkbox.Group onChange={onChange}>
                    <Row gutter={[0, 5]}>
                        {baseGroupList.map(item => {
                            const { key, name } = item;
                            return (
                                <Col span={4} key={key}>
                                    <Checkbox value={key}>{name}</Checkbox>
                                </Col>
                            );
                        })}
                    </Row>
                </Checkbox.Group>
            </>
        );
    }, [value]);
};

export default AllColumnsSetting;
