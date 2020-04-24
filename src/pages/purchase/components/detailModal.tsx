import React, { useMemo } from 'react';
import { Modal } from 'antd';
import { Icons } from '@/components/Icon';

import styles from '../_abnormal.less';

interface IProps {
    visible: boolean;
    onCancel(): void;
}

const DetailModal: React.FC<IProps> = ({
    visible,
    onCancel
}) => {

    return useMemo(() => {
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
                    <div className={styles.iconBox}>
                        <Icons type="scm-tuikuan" className={styles.icon1}/>
                        <div>退款中</div>
                    </div>
                    <div className={styles.iconBox}>
                        <Icons type="scm-tuihuo" className={styles.icon2}/>
                        <div>拒收中</div>
                    </div>
                    <div className={styles.iconBox}>
                        <Icons type="scm-fahuo" className={styles.icon3}/>
                        <div>补发中</div>
                    </div>
                    
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>拒收数量</div>
                    <p className={styles.text}>5</p>
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>收货人</div>
                    <p className={styles.text}>少羽凡</p>
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>手机号</div>
                    <p className={styles.text}>18516304072</p>
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>地址信息</div>
                    <p className={styles.text}>上海市/长宁区</p>
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>详细地址</div>
                    <p className={styles.text}>对司法考试大家发贺卡收到就回复了卡是几点话费啦都快放假啊坏掉了饭卡觉得很烦</p>
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>邮政编码</div>
                    <p className={styles.text}>123123</p>
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>补发运单号</div>
                    <p className={styles.text}>1231231232131231</p>
                </div>
                <div className={styles.descItem}>
                    <div className={styles.label}>备注</div>
                    <p className={styles.text}>吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦</p>
                </div>
            </Modal>
        )
    }, [visible]);
}

export default DetailModal;