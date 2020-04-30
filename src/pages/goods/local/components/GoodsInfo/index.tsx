import React, { useMemo } from 'react';
import { IGoodsVersionInfo } from '@/interface/ILocalGoods';

import styles from './_GoodsInfo.less';

declare interface IProps {
    releasedGoods: IGoodsVersionInfo | undefined;
}

const GoodsInfo: React.FC<IProps> = ({ releasedGoods }) => {
    return useMemo(() => {
        if (releasedGoods) {
            const {
                title,
                product_id,
                goods_img,
                first_catagory,
                second_catagory,
                third_catagory,
                worm_goodsinfo_link,
                worm_goods_id,
                _update_time,
            } = releasedGoods;
            return (
                <div className={styles.infoWrapper}>
                    <img className={styles.mainImg} src={goods_img} />
                    <div className={styles.goodsInfo}>
                        <p>
                            <span className={styles.item}>中台商品ID：{product_id}</span>
                            <span className={styles.item}>源商品ID：{worm_goods_id}</span>
                            <span>采集时间：{_update_time}</span>
                        </p>
                        <p>
                            商品标题：{title}
                            <a href={worm_goodsinfo_link} target="_blank">
                                【查看源商品】
                            </a>
                        </p>
                        <p>
                            <span className={styles.item}>
                                一级分类：{first_catagory.name || ''}
                            </span>
                            <span className={styles.item}>
                                二级分类：{second_catagory.name || ''}
                            </span>
                            <span>三级分类：{third_catagory.name || ''}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    }, [releasedGoods]);
};

export default GoodsInfo;
