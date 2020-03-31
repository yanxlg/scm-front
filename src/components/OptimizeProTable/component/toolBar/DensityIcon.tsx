import React, { useMemo } from 'react';
import { ColumnHeightOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Tooltip } from 'antd';
import { useIntl } from '../intlContext';

export type DensitySize = 'middle' | 'small' | 'large' | undefined;

declare interface DensityIconProps {
    tableSize: DensitySize;
    setTableSize: (tableSize: DensitySize) => void;
}

const DensityIcon: React.ForwardRefRenderFunction<Dropdown, DensityIconProps> = (
    { tableSize, setTableSize },
    ref,
) => {
    const intl = useIntl();
    return useMemo(() => {
        return (
            <Dropdown
                ref={ref}
                overlay={
                    <Menu
                        selectedKeys={[tableSize as string]}
                        onClick={({ key }) => {
                            setTableSize(key as DensitySize);
                        }}
                        style={{
                            width: 80,
                        }}
                    >
                        <Menu.Item key="large">
                            {intl.getMessage('tableToolBar.densityLarger', '默认')}
                        </Menu.Item>
                        <Menu.Item key="middle">
                            {intl.getMessage('tableToolBar.densityMiddle', '中等')}
                        </Menu.Item>
                        <Menu.Item key="small">
                            {intl.getMessage('tableToolBar.densitySmall', '紧凑')}
                        </Menu.Item>
                    </Menu>
                }
                trigger={['click']}
            >
                <Tooltip title={intl.getMessage('tableToolBar.density', '表格密度')}>
                    <ColumnHeightOutlined />
                </Tooltip>
            </Dropdown>
        );
    }, [tableSize, setTableSize]);
};

export default React.forwardRef(DensityIcon);
