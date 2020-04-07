import React, { useMemo } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import classnames from 'classnames';
import { IPublishInterceptItem } from '@/interface/ISetting';

import styles from './_index.less';

declare interface IProps extends ButtonProps {
    item: IPublishInterceptItem;
}

const Index: React.FC<IProps> = ({ item, className = '', ...restProps }) => {
    return useMemo(() => {
        const { name, checked } = item;
        return (
            <Button
                className={classnames(className, styles.btn, checked ? styles.btnActive : '')}
                ghost={checked ? true : false}
                type={checked ? 'primary' : 'default'}
                {...restProps}
            >
                {name}
                <div className={styles.bg}></div>
                <div className={styles.tick}></div>
            </Button>
        );
    }, [item, restProps]);
};

export default Index;
