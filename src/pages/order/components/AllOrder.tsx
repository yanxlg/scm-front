import React, { ReactText, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonFormRef } from 'react-components/es/JsonForm';
import {
    childrenOrderCancelOptionList,
    FinalCancelMap,
    FinalCancelStatus,
    orderShippingOptionList,
    orderStatusOptionList,
    purchaseOrderOptionList,
    purchasePayOptionList,
    purchasePlanCancelOptionList,
    purchaseReserveOptionList,
} from '@/enums/OrderEnum';
import {
    exportPendingSignList,
    getOrderGoodsDetail,
    getPurchaseUidList,
    postExportAll,
    queryAllOrderList,
    queryPendingSignList,
    postOrdersPlace,
} from '@/services/order-manage';
import {
    AutoEnLargeImg,
    FitTable,
    JsonForm,
    LoadingButton,
    PopConfirmLoadingButton,
    useList,
    useModal2,
} from 'react-components';
import { Button, notification, Typography } from 'antd';
import formStyles from 'react-components/es/JsonForm/_form.less';
import Export from '@/components/Export';
import CancelOrder from '@/pages/order/components/CancelOrder';
import { utcToLocal } from 'react-components/es/utils/date';
import {
    CombineRowItem,
    IFlatOrderItem,
    IGoodsDetail,
    IOrderGood,
    IOrderItem,
    IPurchasePlan,
    PayOrderPurchase,
} from '@/interface/IOrder';
import { ColumnType } from 'antd/es/table';
import { getStatusDesc } from '@/utils/transform';
import { useCancelPurchase, useSplitSelectKeys } from '@/pages/order/components/hooks';
import { FormInstance } from 'antd/es/form';
import { combineRows, combineRowsT, filterFieldsList } from './utils';
import { EmptyObject } from 'react-components/es/utils';
import TrackDialog from '@/pages/order/components/TrackDialog';
import GoodsDetailDialog from '@/pages/order/components/GoodsDetailDialog';
import AllColumnsSetting from '@/pages/order/components/AllColumnsSetting';
import { PermissionComponent } from 'rc-permission';
import { useDispatch } from '@@/plugin-dva/exports';

const configFields = [
    'order_goods_status',
    'reserve_status',
    'purchase_order_status',
    'purchase_order_pay_status',
    'order_goods_shipping_status',
    'channel_source',
    'product_shop',
    'order_goods_cancel_type',
    'purchase_plan_cancel_type',
    'product_platform',
    'platform_uid',
    'purchase_fail_code',
    'order_goods_id',
    'purchase_plan_id',
    'channel_order_goods_sn',
    'commodity_id',
    'order_id',
    'purchase_waybill_no',
    'last_waybill_no',
    'product_id',
    'sku_id',
    'purchase_platform_order_id',
    'invented_sign_delivery_no',
    'order_create_time',
    'confirm_time',
    'cancel_time',
    'delivery_time',
    'collect_time',
    'receive_time',
    'purchase_order_time',
    'pay_time',
    // 'purchase_time',
    'storage_time',
];

const fieldsList = filterFieldsList(configFields);

const parentConfigField = [
    'channel_source',
    'product_shop',
    'order_id',
    'order_create_time',
    'confirm_time',
];

const parentFieldsList = filterFieldsList(parentConfigField);

declare interface AllOrderProps {
    updateCount: () => void;
}

const AllOrder = ({ updateCount }: AllOrderProps) => {
    const formRef = useRef<JsonFormRef>(null);
    const formRef1 = useRef<JsonFormRef>(null);
    const [update, setUpdate] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'permission/queryMerchantList',
        });
    }, []);

    const {
        loading,
        pageNumber,
        pageSize,
        total,
        dataSource,
        selectedRowKeys,
        setSelectedRowKeys,
        onReload,
        onSearch,
        onChange,
        setDataSource,
        setTotal,
        setPageNumber,
    } = useList<IOrderItem>({
        formRef: [formRef, formRef1],
        queryList: queryAllOrderList, // 获取订单列表
    });

    const [onlyParent, setOnlyParent] = useState(false);

    const selectedKeys = useSplitSelectKeys(selectedRowKeys);

    const startUpdate = useCallback(() => {
        setUpdate(update => update + 1);
    }, []);

    const [exportModal, showExportModal, closeExportModal] = useModal2<boolean>();
    const [trackModal, showTrackModal, closeTRackModal] = useModal2<IFlatOrderItem | undefined>();

    const [detailModal, showDetailModal, closeDetailModal] = useModal2<any>();

    const showOrderGoodsDetail = useCallback((productId: string, skuId: string) => {
        return getOrderGoodsDetail(productId).then(res => {
            const { sku_info, product_id, goods_img, title } = res.data;
            const i = sku_info.findIndex((item: any) => item.commodity_sku_id === skuId);
            const goodsDetail: IGoodsDetail = {
                product_id,
                goods_img,
                title,
            };
            if (i > -1) {
                const { sku_style, sku_sn, sku_img } = sku_info[i];
                Object.assign(goodsDetail, {
                    sku_sn,
                    sku_img,
                    sku_style,
                });
            }
            showDetailModal(goodsDetail);
        });
    }, []);

    const openOrderGoodsDetailUrl = useCallback((productId: string) => {
        return getOrderGoodsDetail(productId).then(res => {
            const { worm_goodsinfo_link } = res.data;
            window.open(worm_goodsinfo_link);
        });
    }, []);

    const [purchaseUidList, setPurchaseUidList] = useState([]);

    useEffect(() => {
        getPurchaseUidList().then(list => setPurchaseUidList(list));
    }, []);

    const columns = useMemo<ColumnType<IFlatOrderItem & CombineRowItem>[]>(() => {
        // 展示父订单时需要合并行
        return onlyParent
            ? [
                  {
                      key: 'orderCreateTime',
                      title: '订单生成时间',
                      dataIndex: 'orderCreateTime',
                      align: 'center',
                      width: 120,
                      render: (value: string, row) => {
                          return combineRows(row, utcToLocal(row.createTime, ''));
                      },
                  },
                  {
                      key: 'orderId',
                      title: '父订单ID',
                      dataIndex: 'orderId',
                      align: 'center',
                      width: 120,
                      render: combineRowsT,
                  },
                  {
                      key: 'productId',
                      title: 'Product ID',
                      dataIndex: 'productId',
                      align: 'center',
                      width: 200,
                      render: (value: string, record) => {
                          return (
                              <>
                                  {value}
                                  <div style={{ color: 'red' }}>
                                      {String(record?.isReplaceDelivery) === '1'
                                          ? '（替换成其他商品出库）'
                                          : ''}
                                  </div>
                              </>
                          );
                      },
                  },
                  {
                      key: 'goodsNumber',
                      title: '商品数量',
                      dataIndex: 'goodsNumber',
                      align: 'center',
                      width: 120,
                  },
                  {
                      key: 'goodsAmount',
                      title: '商品价格',
                      dataIndex: 'goodsAmount',
                      align: 'center',
                      width: 120,
                  },
                  {
                      key: 'orderGoodsId',
                      title: '中台子订单ID',
                      dataIndex: 'orderGoodsId',
                      align: 'center',
                      width: 120,
                  },
                  {
                      key: 'channelOrderGoodsSn',
                      title: '渠道订单ID',
                      dataIndex: 'channelOrderGoodsSn',
                      align: 'center',
                      width: 120,
                  },
                  {
                      key: 'orderGoodsStatus',
                      title: '中台订单状态',
                      dataIndex: 'orderGoodsStatus',
                      align: 'center',
                      width: 120,
                      render: (value: number) => {
                          return getStatusDesc(orderStatusOptionList, value);
                      },
                  },
                  {
                      key: 'orderGoodsShippingStatus',
                      title: '中台订单配送状态',
                      dataIndex: 'orderGoodsShippingStatus',
                      align: 'center',
                      width: 180,
                      render: (value: number) => {
                          return getStatusDesc(orderShippingOptionList, value);
                      },
                  },
                  {
                      key: 'goodsDetail',
                      title: '商品详情',
                      dataIndex: 'goodsDetail',
                      align: 'center',
                      width: 150,
                      defaultHide: true,
                      render: (value: any, row) => {
                          return (
                              <LoadingButton
                                  type="link"
                                  onClick={() => showOrderGoodsDetail(row.productId!, row.skuId!)}
                              >
                                  查看商品详情
                              </LoadingButton>
                          );
                      },
                  },
                  {
                      key: 'productShop',
                      title: '渠道店铺名',
                      dataIndex: 'productShop',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  {
                      key: 'confirmTime',
                      title: '订单确认时间',
                      dataIndex: 'confirmTime',
                      align: 'center',
                      width: 120,
                      render: (value: string, row) => {
                          return combineRows(row, utcToLocal(value, ''));
                      },
                      defaultHide: true,
                  },
                  {
                      key: 'channelSource',
                      title: '销售渠道',
                      dataIndex: 'channelSource',
                      align: 'center',
                      width: 120,
                      render: combineRowsT,
                      defaultHide: true,
                  },
                  {
                      key: 'currency',
                      title: '货币类型',
                      dataIndex: 'currency',
                      align: 'center',
                      width: 120,
                      render: combineRowsT,
                      defaultHide: true,
                  },
                  {
                      key: 'orderAmount',
                      title: '商品总金额',
                      dataIndex: 'orderAmount',
                      align: 'center',
                      width: 120,
                      render: combineRowsT,
                      defaultHide: true,
                  },
              ]
            : [
                  {
                      key: 'orderCreateTime',
                      title: '订单生成时间',
                      dataIndex: 'orderCreateTime',
                      align: 'center',
                      width: 150,
                      render: (value: string, item) => utcToLocal(item.createTime, ''),
                  },
                  {
                      key: 'orderGoodsStatus',
                      title: '订单状态',
                      dataIndex: 'orderGoodsStatus',
                      align: 'center',
                      width: 120,
                      render: (value: number) => getStatusDesc(orderStatusOptionList, value),
                  },
                  {
                      key: 'cancelType',
                      title: '子订单取消类型',
                      dataIndex: 'cancelType',
                      align: 'center',
                      width: 140,
                      defaultHide: true,
                      render: (value: number) =>
                          getStatusDesc(childrenOrderCancelOptionList, value),
                  },
                  {
                      key: 'orderGoodsShippingStatusShow',
                      title: '配送状态',
                      dataIndex: 'orderGoodsShippingStatusShow',
                      align: 'center',
                      width: 120,
                      render: (value: number) => getStatusDesc(orderShippingOptionList, value),
                  },
                  {
                      key: 'orderId',
                      title: '父订单ID',
                      dataIndex: 'orderId',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  {
                      key: 'orderGoodsId',
                      title: '子订单ID',
                      dataIndex: 'orderGoodsId',
                      align: 'center',
                      width: 150,
                  },
                  {
                      key: 'commodityId',
                      title: 'Commodity ID',
                      dataIndex: 'commodityId',
                      align: 'center',
                      width: 130,
                  },

                  {
                      key: 'productId',
                      title: 'Product ID',
                      dataIndex: 'productId',
                      align: 'center',
                      width: 200,
                      render: (value: string, record) => {
                          return (
                              <>
                                  {value}
                                  <div style={{ color: 'red' }}>
                                      {String(record?.isReplaceDelivery) === '1'
                                          ? '（替换成其他商品出库）'
                                          : ''}
                                  </div>
                              </>
                          );
                      },
                  },
                  {
                      key: 'skuId',
                      title: '中台SKU ID',
                      dataIndex: 'skuId',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  {
                      key: 'productName',
                      title: '商品名称',
                      dataIndex: 'productName',
                      align: 'center',
                      width: 150,
                      render: (value, item) => (
                          <div className="order-text-ellipsis">
                              <a onClick={() => openOrderGoodsDetailUrl(item.productId!)}>
                                  {value}
                              </a>
                          </div>
                      ),
                  },
                  {
                      key: 'productImage',
                      title: 'SKU图片',
                      dataIndex: 'productImage',
                      align: 'center',
                      width: 100,
                      render: (value: string) => {
                          return <AutoEnLargeImg src={value} className="order-img-lazy" />;
                      },
                  },
                  {
                      key: 'productStyle',
                      title: '商品规格',
                      dataIndex: 'productStyle',
                      align: 'center',
                      width: 150,
                      render: (value: string) => {
                          let child: any = null;
                          if (value) {
                              try {
                                  const styleInfo = JSON.parse(value);
                                  child = (
                                      <>
                                          {Object.keys(styleInfo).map(key => (
                                              <div key={key}>{`${key}: ${styleInfo[key]}`}</div>
                                          ))}
                                      </>
                                  );
                              } catch (err) {}
                          }
                          return child;
                      },
                  },
                  {
                      key: 'goodsAmount',
                      title: '销售商品单价($)',
                      dataIndex: 'goodsAmount',
                      align: 'center',
                      width: 180,
                      render: (_, item) => {
                          const { goodsNumber = 0, goodsAmount } = item;
                          const amount = Number(goodsAmount);
                          return goodsNumber ? (amount / goodsNumber).toFixed(2) : '';
                      },
                  },
                  {
                      key: 'goodsNumber',
                      title: '销售商品数量',
                      dataIndex: 'goodsNumber',
                      align: 'center',
                      width: 120,
                  },
                  {
                      key: 'freight',
                      title: '销售商品运费($)',
                      dataIndex: 'freight',
                      align: 'center',
                      width: 180,
                  },
                  {
                      key: '_goodsTotalAmount',
                      title: '销售商品总金额',
                      dataIndex: '_goodsTotalAmount',
                      align: 'center',
                      width: 140,
                      render: (_, row) => {
                          const { goodsAmount, freight } = row;
                          const total = (Number(goodsAmount) || 0) + (Number(freight) || 0);
                          return isNaN(total) ? '' : total.toFixed(2);
                      },
                  },
                  {
                      key: 'currency',
                      title: '销售金额货币',
                      dataIndex: 'currency',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  {
                      key: 'purchaseAmount',
                      title: '采购商品单价',
                      dataIndex: 'purchaseAmount',
                      align: 'center',
                      defaultHide: true,
                      width: 120,
                      render: (_, row) => {
                          const { purchaseNumber, purchaseAmount } = row;
                          const price = Number(purchaseAmount) / Number(purchaseNumber);
                          return isNaN(price) ? '' : price.toFixed(2);
                      },
                  },
                  {
                      key: 'purchaseNumber',
                      title: '采购商品数量',
                      dataIndex: 'purchaseNumber',
                      align: 'center',
                      width: 120,
                  },

                  {
                      key: '_purchaseTotalAmount',
                      title: '采购商品总金额',
                      dataIndex: '_purchaseTotalAmount',
                      align: 'center',
                      width: 140,
                      // defaultHide: true,
                      render: (_, row) => row.purchaseAmount,
                  },
                  {
                      key: 'saleMinusPurchaseNormalPrice',
                      title: '销售-采购价差',
                      dataIndex: 'saleMinusPurchaseNormalPrice',
                      align: 'center',
                      defaultHide: true,
                      width: 180,
                      render: (value, row) => {
                          const {
                              productPrice = 0,
                              purchaseNormalPrice = 0,
                              // purchaseNumber = 0,
                          } = row;
                          const purchasePrice = Number(purchaseNormalPrice);
                          if (purchasePrice === 0 || isNaN(purchasePrice)) {
                              return '';
                          }
                          const result =
                              (Number(productPrice) * 1000 - purchasePrice * 1000) / 1000;
                          return result < 0 ? (
                              <span style={{ color: 'red' }}>{result}</span>
                          ) : (
                              result
                          );
                      },
                  },
                  {
                      key: 'channelSource',
                      title: '销售渠道',
                      dataIndex: 'channelSource',
                      align: 'center',
                      defaultHide: true,
                      width: 120,
                  },
                  {
                      key: 'productShop',
                      title: '销售店铺',
                      dataIndex: 'productShop',
                      align: 'center',
                      width: 120,
                      // defaultHide: true,
                  },
                  {
                      key: 'confirmTime',
                      title: '销售订单确认时间',
                      dataIndex: 'confirmTime',
                      defaultHide: true,
                      align: 'center',
                      width: 146,
                      render: (value: string) => utcToLocal(value, ''),
                  },
                  {
                      key: 'channelOrderGoodsSn',
                      title: '销售订单ID',
                      dataIndex: 'channelOrderGoodsSn',
                      align: 'center',
                      width: 120,
                  },
                  {
                      key: 'cancelTime',
                      title: '销售订单取消时间',
                      dataIndex: 'cancelTime',
                      align: 'center',
                      defaultHide: true,
                      width: 146,
                      render: (value: string) => utcToLocal(value, ''),
                  },
                  {
                      key: 'deliveryTime',
                      title: '销售订单出库时间',
                      dataIndex: 'deliveryTime',
                      defaultHide: true,
                      align: 'center',
                      width: 146,
                      render: (value: string) => utcToLocal(value, ''),
                  },
                  {
                      key: 'collectTime',
                      title: '销售订单揽收时间',
                      dataIndex: 'collectTime',
                      align: 'center',
                      defaultHide: true,
                      width: 146,
                      render: (value: string) => utcToLocal(value, ''),
                  },
                  {
                      key: 'lastWaybillNo',
                      title: '销售尾程运单ID',
                      dataIndex: 'lastWaybillNo',
                      defaultHide: true,
                      align: 'center',
                      width: 136,
                  },
                  {
                      key: 'receiveTime',
                      title: '妥投时间',
                      dataIndex: 'receiveTime',
                      align: 'center',
                      defaultHide: true,
                      width: 120,
                      render: (value: string) => utcToLocal(value, ''),
                  },
                  {
                      key: 'inventedSignDeliveryNo',
                      title: '虚拟运单ID',
                      dataIndex: 'inventedSignDeliveryNo',
                      defaultHide: true,
                      align: 'center',
                      width: 136,
                  },
                  {
                      key: 'purchaseCreateTime',
                      title: '采购计划生成时间',
                      dataIndex: 'purchaseCreateTime',
                      align: 'center',
                      width: 146,
                      defaultHide: true,
                      render: (value: string) => utcToLocal(value, ''),
                  },
                  {
                      key: 'purchasePlanId',
                      title: '采购计划ID',
                      dataIndex: 'purchasePlanId',
                      align: 'center',
                      width: 120,
                      render: (value: string, record) => {
                          return (
                              <>
                                  {value}
                                  <div style={{ color: 'red' }}>
                                      {String(record?.isOfflinePurchase) === '1'
                                          ? '（线下采购，无需拍单）'
                                          : ''}
                                  </div>
                              </>
                          );
                      },
                  },
                  {
                      key: 'reserveStatus',
                      title: '仓库库存预定状态',
                      dataIndex: 'reserveStatus',
                      align: 'center',
                      width: 150,
                      render: (value: number) => getStatusDesc(purchaseReserveOptionList, value),
                  },
                  {
                      key: 'purchaseOrderStatus',
                      title: '采购计划状态',
                      dataIndex: 'purchaseOrderStatus',
                      align: 'center',
                      width: 150,
                      render: (value: number, row) => {
                          const { reserveStatus } = row;
                          if (reserveStatus === 3 && value === 1) {
                              return '无需拍单'; // feature_4170
                          }
                          return getStatusDesc(purchaseOrderOptionList, value);
                      },
                  },
                  {
                      key: 'purchaseFailCode',
                      title: '失败原因',
                      dataIndex: 'purchaseFailCode',
                      align: 'center',
                      width: 140,
                      defaultHide: true,
                      render: (value: string, row) => {
                          const { purchaseOrderStatus } = row;
                          return purchaseOrderStatus === 7
                              ? FinalCancelMap[value as FinalCancelStatus] || '未知原因'
                              : '';
                      },
                  },
                  {
                      key: 'purchasePlatform',
                      title: '采购平台',
                      dataIndex: 'purchasePlatform',
                      align: 'center',
                      defaultHide: true,
                      width: 120,
                  },
                  {
                      key: 'productPlatform',
                      title: '商品渠道',
                      dataIndex: 'productPlatform',
                      align: 'center',
                      defaultHide: true,
                      width: 120,
                  },
                  {
                      key: 'platformUid',
                      title: '下单账号',
                      dataIndex: 'platformUid',
                      align: 'center',
                      width: 130,
                      render: (value: string) => {
                          return getStatusDesc(purchaseUidList, value);
                      },
                      defaultHide: true,
                  },
                  {
                      key: 'purchasePlatformParentOrderId',
                      title: '采购父订单ID',
                      dataIndex: 'purchasePlatformParentOrderId',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  {
                      key: 'purchasePlatformOrderId',
                      title: '采购订单ID',
                      dataIndex: 'purchasePlatformOrderId',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  {
                      key: 'payTime',
                      title: '采购支付时间',
                      dataIndex: 'payTime',
                      align: 'center',
                      defaultHide: true,
                      width: 120,
                      render: (value: string, row) => utcToLocal(value, ''),
                  },
                  {
                      key: 'purchaseOrderPayStatus',
                      title: '采购支付状态',
                      dataIndex: 'purchaseOrderPayStatus',
                      align: 'center',
                      width: 120,
                      render: (value: number, row) => {
                          const { purchasePlatformOrderId } = row;
                          return purchasePlatformOrderId
                              ? getStatusDesc(purchasePayOptionList, value)
                              : '';
                      },
                  },
                  {
                      key: 'purchaseWaybillNo',
                      title: '采购运单ID',
                      dataIndex: 'purchaseWaybillNo',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  {
                      key: 'purchaseCancelReason',
                      title: '采购取消原因',
                      dataIndex: 'purchaseCancelReason',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                  },
                  /*    {
                      key: 'purchaseTime',
                      title: '采购签收时间',
                      dataIndex: 'purchaseTime',
                      align: 'center',
                      defaultHide: true,
                      width: 120,
                      render: (value: string) => utcToLocal(value, ''),
                  },*/
                  {
                      key: 'storageTime',
                      title: '采购入库时间',
                      dataIndex: 'storageTime',
                      align: 'center',
                      width: 120,
                      defaultHide: true,
                      render: (value: string) => utcToLocal(value, ''),
                  },
                  {
                      key: 'purchaseCancelType',
                      title: '采购单取消类型',
                      dataIndex: 'purchaseCancelType',
                      align: 'center',
                      width: 146,
                      defaultHide: true,
                      render: (value: number) => getStatusDesc(purchasePlanCancelOptionList, value),
                  },
                  {
                      key: 'orderAddress',
                      title: '用户地址信息',
                      dataIndex: 'orderAddress',
                      align: 'center',
                      width: 180,
                      defaultHide: true,
                      render: (value: any) => {
                          if (!value) {
                              return '';
                          }
                          const {
                              consignee = '',
                              address1 = '',
                              city = '',
                              province = '',
                              country = '',
                              zipCode = '',
                              tel = '',
                          } = value;
                          return (
                              <div style={{ textAlign: 'left', wordBreak: 'break-all' }}>
                                  <div>{consignee}</div>
                                  <div>
                                      {address1},{city},{province},{country}
                                  </div>
                                  <div>
                                      {zipCode},{tel}
                                  </div>
                              </div>
                          );
                      },
                  },
                  {
                      key: '_logisticsTrack',
                      title: '物流轨迹',
                      dataIndex: '_logisticsTrack',
                      align: 'center',
                      width: 120,
                      render: (value, row) => {
                          return (
                              <PermissionComponent pid={'order/track'} control={'tooltip'}>
                                  <a onClick={() => showTrackModal(row)}>物流轨迹</a>
                              </PermissionComponent>
                          );
                      },
                  },
              ];
    }, [onlyParent, purchaseUidList]);

    const fieldList = onlyParent ? parentFieldsList : fieldsList;

    // 仅真是父订单需要刷新数据
    useEffect(() => {
        if (formRef1.current) {
            onSearch();
        }
    }, [onlyParent]);

    const collapseItems = useMemo(() => {
        return onlyParent
            ? undefined
            : [
                  'order_goods_status',
                  'reserve_status',
                  'purchase_order_status',
                  'purchase_order_pay_status',
                  'order_goods_shipping_status',
                  'channel_source',
                  'product_shop',
              ];
    }, [onlyParent]);

    const formComponent = useMemo(() => {
        return (
            <JsonForm
                ref={formRef}
                fieldList={fieldList}
                labelClassName="order-label"
                collapseItems={collapseItems}
                defaultCollapse={false}
            >
                <div>
                    <LoadingButton type="primary" className={formStyles.formBtn} onClick={onSearch}>
                        查询
                    </LoadingButton>
                    <LoadingButton className={formStyles.formBtn} onClick={onReload}>
                        刷新
                    </LoadingButton>
                    <Button
                        disabled={total <= 0}
                        className={formStyles.formBtn}
                        onClick={() => showExportModal(true)}
                    >
                        导出
                    </Button>
                </div>
            </JsonForm>
        );
    }, [onlyParent, loading]);

    const formComponent1 = useMemo(() => {
        return (
            <JsonForm
                ref={formRef1}
                fieldList={
                    onlyParent
                        ? [
                              {
                                  type: 'checkboxGroup',
                                  name: 'only_p_order',
                                  options: [
                                      {
                                          label: '仅展示父订单ID',
                                          value: 1,
                                      },
                                  ],
                                  onChange: (name: string, form: FormInstance) => {
                                      const value = form.getFieldValue('only_p_order');
                                      const checked = value && value[0];
                                      if (checked) {
                                          form.resetFields(['regenerate', 'no_plan']);
                                      }
                                      setDataSource([]);
                                      setPageNumber(1);
                                      setTotal(0);
                                      setOnlyParent(checked);
                                  },
                                  formatter: 'firstNumber',
                              },
                          ]
                        : [
                              {
                                  type: 'checkboxGroup',
                                  name: 'only_p_order',
                                  options: [
                                      {
                                          label: '仅展示父订单ID',
                                          value: 1,
                                      },
                                  ],
                                  onChange: (name: string, form: FormInstance) => {
                                      const value = form.getFieldValue('only_p_order');
                                      const checked = value && value[0];
                                      if (checked) {
                                          form.resetFields(['regenerate', 'non_purchase_plan']);
                                      }
                                      setDataSource([]);
                                      setPageNumber(1);
                                      setTotal(0);
                                      setOnlyParent(checked);
                                  },
                                  formatter: 'firstNumber',
                              },
                              {
                                  type: 'checkboxGroup',
                                  name: 'regenerate',
                                  options: [
                                      {
                                          label: '展示已重新生成',
                                          value: true,
                                      },
                                  ],
                                  onChange: (name: string, form: FormInstance) => {
                                      startUpdate();
                                  },
                                  formatter: 'join',
                              },
                              {
                                  type: 'checkboxGroup',
                                  name: 'non_purchase_plan',
                                  options: [
                                      {
                                          label: '仅展示无采购计划',
                                          value: 2,
                                      },
                                  ],
                                  onChange: (name: string, form: FormInstance) => {
                                      onSearch();
                                  },
                                  formatter: 'firstNumber',
                              },
                          ]
                }
                labelClassName="order-label"
            />
        );
    }, [onlyParent]);

    const pagination = useMemo(() => {
        return {
            total: total,
            current: pageNumber,
            pageSize: pageSize,
            showSizeChanger: true,
            position: ['topRight', 'bottomRight'],
        } as any;
    }, [loading]);

    // filter  + flat list
    const flatList = useMemo(() => {
        // 父订单  orderGoods拆分
        if (onlyParent) {
            const flatOrderList: (IFlatOrderItem & CombineRowItem)[] = [];
            dataSource.forEach(item => {
                const { orderGoods = [], orderGods, ...parentRest } = item;
                if (orderGoods && Array.isArray(orderGoods)) {
                    orderGoods.forEach((goodsItem, index) => {
                        flatOrderList.push({
                            ...goodsItem,
                            ...parentRest,
                            ...orderGods,
                            __rowspan: index === 0 ? orderGoods.length : 0,
                        });
                    });
                } else {
                    flatOrderList.push({
                        ...parentRest,
                        ...orderGods,
                        __rowspan: 1,
                    });
                }
            });
            return flatOrderList;
        } else {
            const flatOrderList: (IFlatOrderItem & CombineRowItem)[] = [];
            const { regenerate } = formRef1.current
                ? formRef1.current.getFieldsValue()
                : { regenerate: false };
            dataSource.forEach(order => {
                const {
                    orderGoods,
                    unpaidPurchaseOrderGoodsResult,
                    orderInfo,
                    orderGods,
                    ...extra
                } = order;
                // purchasePlan 可能在orderGoods下，可能在unpaidPurchaseOrderGoodsResult中
                const { orderGoodsPurchasePlan = [], ...others } =
                    (orderGoods as IOrderGood) || EmptyObject;
                const planList: Array<PayOrderPurchase | IPurchasePlan> =
                    unpaidPurchaseOrderGoodsResult || orderGoodsPurchasePlan;
                const purchaseList = regenerate
                    ? planList
                    : planList.filter(plan => {
                          return plan.purchaseOrderStatus !== 6;
                      }); // 子订单级别
                if (purchaseList.length) {
                    purchaseList.forEach((plan, index) => {
                        const childOrderItem = {
                            ...extra,
                            ...orderInfo,
                            ...orderGods,
                            ...plan,
                            purchaseCreateTime: plan.createTime,
                            purchaseLastUpdateTime: plan.lastUpdateTime,
                            purchaseCancelType: plan.cancelType,
                            ...others, // 顺序决定覆盖优先级，此处要显示订单时间，不能被采购单覆盖
                            __rowspan: index === 0 ? purchaseList.length : 0,
                            __key: purchaseList.map(item => item.orderGoodsId).join(','),
                        };
                        flatOrderList.push(childOrderItem);
                    });
                } else {
                    flatOrderList.push({
                        ...extra,
                        ...orderInfo,
                        ...orderGods,
                        ...others,
                        __rowspan: 1,
                        __key: extra.orderGoodsId || others.orderGoodsId,
                    });
                }
            });
            return regenerate
                ? flatOrderList
                : flatOrderList.filter(item => {
                      return item.purchaseOrderStatus !== 6; // 采购单级别
                  });
        }
    }, [dataSource, update, onlyParent]);

    const { cancelList } = useCancelPurchase(selectedKeys, onReload, updateCount);

    const postOrdersPlaceCallback = useCallback((idList: string[]) => {
        return postOrdersPlace({
            order_goods_ids: idList,
        }).then(res => {
            // console.log('delChannelOrders', res);
            onReload();
            const { success, failed } = res.data;
            if (success!.length) {
                notification.success({
                    message: '拍单成功',
                    description: (
                        <div>
                            {success.map((item: string) => (
                                <div key={item}>{item}</div>
                            ))}
                        </div>
                    ),
                });
            }
            if (failed!.length) {
                notification.error({
                    message: '拍单失败',
                    description: (
                        <div>
                            {failed.map((item: any) => (
                                <div>
                                    {item.order_goods_id}: {item.result.slice(0, 50)}
                                </div>
                            ))}
                        </div>
                    ),
                });
            }
        });
    }, []);

    const toolBarRender = useCallback(() => {
        const disabled = selectedKeys.length === 0;
        return [
            <PermissionComponent key="buy" pid="order/post_order" control="tooltip">
                <LoadingButton
                    type="primary"
                    className={formStyles.formBtn}
                    disabled={disabled}
                    onClick={() => postOrdersPlaceCallback(selectedKeys)}
                >
                    一键拍单
                </LoadingButton>
            </PermissionComponent>,
            <PermissionComponent key="purchase_order" pid="order/cancel_purchase" control="tooltip">
                <LoadingButton
                    type="primary"
                    className={formStyles.formBtn}
                    disabled={disabled}
                    onClick={cancelList}
                >
                    取消采购订单
                </LoadingButton>
            </PermissionComponent>,
            <CancelOrder
                key="2"
                orderGoodsIds={selectedKeys}
                onReload={onReload}
                getAllTabCount={updateCount}
            >
                <PermissionComponent
                    key="purchase_order"
                    pid="order/cancel_order"
                    control="tooltip"
                >
                    <Button
                        key="channel_order"
                        type="primary"
                        className={formStyles.formBtn}
                        disabled={disabled}
                    >
                        取消销售订单
                    </Button>
                </PermissionComponent>
            </CancelOrder>,
        ];
    }, [selectedKeys]);

    const rowSelection = useMemo(() => {
        return {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedKeys: ReactText[]) => {
                setSelectedRowKeys(selectedKeys as string[]);
            },
            renderCell: (
                checked: boolean,
                record: IFlatOrderItem & CombineRowItem,
                index: number,
                originNode: React.ReactNode,
            ) => {
                return {
                    children: originNode,
                    props: {
                        rowSpan: record.__rowspan,
                    },
                };
            },
        };
    }, [selectedRowKeys]);

    const onExport = useCallback((data: any) => {
        return postExportAll({
            ...data,
            ...formRef.current!.getFieldsValue(),
            ...formRef1.current!.getFieldsValue(),
        }).request();
    }, []);

    return useMemo(() => {
        return (
            <div>
                {formComponent}
                {formComponent1}
                <FitTable
                    bordered={true}
                    rowKey={'__key'}
                    loading={loading}
                    columns={columns}
                    dataSource={flatList}
                    scroll={{ x: true, scrollToFirstRowOnChange: true }}
                    columnsSettingRender={onlyParent ? true : AllColumnsSetting}
                    pagination={pagination}
                    onChange={onChange}
                    toolBarRender={onlyParent ? undefined : toolBarRender}
                    rowSelection={onlyParent ? undefined : rowSelection}
                />
                <Export
                    columns={columns as any}
                    visible={exportModal}
                    onOKey={onExport}
                    onCancel={closeExportModal}
                />
                <TrackDialog
                    visible={!!trackModal}
                    orderGoodsId={trackModal ? trackModal.orderGoodsId || '' : ''}
                    lastWaybillNo={trackModal ? trackModal.lastWaybillNo || '' : ''}
                    hideTrackDetail={closeTRackModal}
                />
                <GoodsDetailDialog
                    visible={!!detailModal}
                    goodsDetail={detailModal}
                    hideGoodsDetailDialog={closeDetailModal}
                />
            </div>
        );
    }, [
        update,
        flatList,
        loading,
        selectedRowKeys,
        trackModal,
        onlyParent,
        detailModal,
        exportModal,
    ]);
};

export default AllOrder;
