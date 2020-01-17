import React from 'react';

import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps{
    theme?: SiderTheme;
    layout?: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
    const { theme, layout } = props;
    let className = styles.right;
    if (theme === 'dark' && layout === 'topmenu') {
        className = `${styles.right}  ${styles.dark}`;
    }
    return (
        <div className={className}>
            用户名，退出
        </div>
    );
};

export default GlobalHeaderRight
