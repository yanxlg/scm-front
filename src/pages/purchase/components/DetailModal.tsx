import React, { useMemo } from 'react';
import { Modal } from 'antd';
import { Icons } from '@/components/Icon';
import { IPurchaseAbnormalItem } from '@/interface/IPurchase';

import styles from '../_abnormal.less';

interface IProps {
    visible: boolean;
    currentRecord: IPurchaseAbnormalItem | null;
    onCancel(): void;
}

const DetailModal: React.FC<IProps> = ({ visible, onCancel, currentRecord }) => {
    if (!visible) {
        return null;
    }
    
    const { remark } = currentRecord as IPurchaseAbnormalItem;
    let info: any = {}
    try {
        info = JSON.parse(remark);
    } catch (err) {}
    console.log(111111, info);
    return useMemo(() => {
        const {
            abnormal_operate_type,
            reject_count,
            receive_name,
            receive_tel,
            receive_address,
            receive_address_detail,
            zip_code,
            waybill_no,
            // in_storage_count,
            remarks
        } = info;
        const operateList = (abnormal_operate_type || '').split(',');
        const isRefund = operateList.indexOf('退款') > -1;
        const isReject = operateList.indexOf('拒收') > -1;
        const isReplenishment = operateList.indexOf('补货') > -1;
        return (
            <Modal
                title="查看详情"
                width={720}
                visible={visible}
                onCancel={onCancel}
                footer={null}
                className={styles.detailModal}
            >
                <div className={styles.iconSection}>
                    {
                        isRefund && (
                            <div className={styles.iconBox}>
                                <Icons type="scm-tuikuan" className={styles.icon1} />
                                <div>退款</div>
                            </div>
                        )
                    }
                    {
                        isReject && (
                            <div className={styles.iconBox}>
                                <Icons type="scm-tuihuo" className={styles.icon2} />
                                <div>拒收</div>
                            </div>
                        )
                    }
                    {
                        isReplenishment && (
                            <div className={styles.iconBox}>
                            <Icons type="scm-fahuo" className={styles.icon3} />
                            <div>补发</div>
                        </div>
                        )
                    }
                </div>
                {
                    isReject && (
                        <>
                            <div className={styles.descItem}>
                                <div className={styles.label}>拒收数量</div>
                                <p className={styles.text}>{reject_count}</p>
                            </div>
                            <div className={styles.descItem}>
                                <div className={styles.label}>收货人</div>
                                <p className={styles.text}>{receive_name}</p>
                            </div>
                            <div className={styles.descItem}>
                                <div className={styles.label}>手机号</div>
                                <p className={styles.text}>{receive_tel}</p>
                            </div>
                            <div className={styles.descItem}>
                                <div className={styles.label}>地址信息</div>
                                <p className={styles.text}>{receive_address}</p>
                            </div>
                            <div className={styles.descItem}>
                                <div className={styles.label}>详细地址</div>
                                <p className={styles.text}>
                                    {receive_address_detail}
                                </p>
                            </div>
                            <div className={styles.descItem}>
                                <div className={styles.label}>邮政编码</div>
                                <p className={styles.text}>{zip_code}</p>
                            </div>
                        </>
                    )
                }
                {
                    isReplenishment && (
                        <>
                            <div className={styles.descItem}>
                                <div className={styles.label}>补发运单号</div>
                                <p className={styles.text}>{waybill_no}</p>
                            </div>
                        </>
                    )
                }
                <div className={styles.descItem}>
                    <div className={styles.label}>备注</div>
                    <p className={styles.text}>
                        {remarks}
                    </p>
                </div>
            </Modal>
        );
    }, [visible]);
};

export default DetailModal;
