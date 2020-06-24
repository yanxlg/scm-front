import React from 'react';

import styles from './_index.less';
import { Breadcrumb, Button, Dropdown, Menu } from 'antd';
import { genBreadcrumbProps } from '@ant-design/pro-layout/es/utils/getBreadcrumbProps';
import { BasicLayoutProps, getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import { getCookie } from '@/utils/common';
import { ChangePwdModal } from '../ChangePwd/ChangePwdModal';
import { useModal2 } from 'react-components';
import { Icons } from '@/components/Icon';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends BasicLayoutProps {
    theme?: SiderTheme;
    layout?: 'sidemenu' | 'topmenu';
    breadcrumb?: {
        [path: string]: MenuDataItem;
    };
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
    const { route = {}, menu, formatMessage, menuDataRender, itemRender } = props;
    const { routes = [] } = route;
    const { breadcrumbMap } = getMenuData(routes, menu, formatMessage, menuDataRender);
    const breadcrumbData = genBreadcrumbProps(
        Object.assign({}, props, {
            breadcrumbMap: breadcrumbMap,
        }),
    );

    const userName = getCookie('USERNAME') || '--';

    const [pwdModal, showPwdModal, closePwdModal] = useModal2<boolean>();
    return (
        <div>
            {breadcrumbData ? (
                <Breadcrumb
                    className={styles.breadcrumb}
                    routes={breadcrumbData}
                    itemRender={itemRender}
                />
            ) : null}
            <div className={styles.right}>
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item
                                key="1"
                                onClick={() => showPwdModal(true)}
                                icon={<Icons type="scm-pwd" />}
                                className={styles.menu}
                            >
                                修改密码
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <span className={styles.user}>{userName}</span>
                </Dropdown>
                ,
                <Button
                    type="link"
                    className="padding-none"
                    onClick={() => {
                        // alert('退出');
                    }}
                >
                    退出
                </Button>
            </div>
            <ChangePwdModal visible={pwdModal} onClose={closePwdModal} />
        </div>
    );
};

export default GlobalHeaderRight;
