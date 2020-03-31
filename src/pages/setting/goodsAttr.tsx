import React, { useMemo, useCallback, useState } from 'react';
import { Button, Input } from 'antd';
import Container from '@/components/Container';
import EditTag from './components/EditTag';

import styles from './_goodsAttr.less';

// const EditTag: React.FC = props => {

// }

const GoodsAttr: React.FC = props => {
    const [tagList, setTagList] = useState(['品牌', '违禁品']);

    const handleAdd = useCallback(() => {
        console.log('add');
    }, []);
    const reset = useCallback(() => {
        setTagList(['品牌', '违禁品']);
    }, []);

    const addBox = useMemo(() => {
        return (
            <div className={[styles.addBox, styles.item].join(' ')}>
                <Input className={styles.input} placeholder="请输入新标签" />
                <Button size="small" type="primary" className={styles.btnAdd} onClick={handleAdd}>
                    添加
                </Button>
            </div>
        );
    }, []);

    return useMemo(() => {
        return (
            <Container>
                <h3>所有标签</h3>
                <div className={styles.tagSection}>
                    {tagList.map(item => (
                        <EditTag className={styles.item} text={item} key={item + Date.now()} />
                    ))}
                    {addBox}
                </div>
                <div>
                    <Button type="primary" className={styles.saveBtn}>
                        保存设置
                    </Button>
                    <Button onClick={reset}>还原</Button>
                </div>
            </Container>
        );
    }, [addBox, tagList]);
};

export default GoodsAttr;
