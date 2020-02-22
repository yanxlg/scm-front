import React from 'react';
import { DashboardOutlined } from '@ant-design/icons/lib';
import Icon from '@/components/Icons/Icon';
export default [
    {
        "path": "/",
        "name": "首页",
        "icon": <DashboardOutlined />
    },
    {
        "path": "/task",
        "name": "任务中心",
        "icon": <Icon type="task" className="menu-icon"/>,
        "children": [
            {
                "path": "/task/config",
                "name": "任务配置"
            },
            {
                "path": "/task/list",
                "name": "任务列表"
            },
            {
                "path": "/task/drafts",
                "name": "草稿箱",
                "hideInMenu": true
            }
        ]
    },
    {
        "path": "/goods",
        "name": "商品中心",
        "icon": <Icon type="goods" className="menu-icon"/>,
        "children": [
            {
                "path": "/goods/local",
                "name": "本地产品库"
            },
            {
                "path": "/goods/local/version",
                "name": "商品版本",
                "hideInMenu": true
            },
            {
                "path": "/goods/vova",
                "name": "VoVa产品库"
            },
            {
                "path": "/goods/vova/version",
                "name": "商品版本更新",
                "hideInMenu": true
            }
        ]
    },
    {
        "path": "/order",
        "name": "订单管理",
        "icon": <Icon type="order" className="menu-icon"/>
    },
    {
        "path": "/setting",
        "name": "基本设置",
        "icon": <Icon type="setting" className="menu-icon"/>,
        "children": [
            {
                "path": "/setting/store",
                "name": "店铺关联"
            },
            {
                "path": "/setting/price",
                "name": "价格上浮设置"
            },
            {
                "path": "/setting/address",
                "name": "中转仓地址设置"
            }
        ]
    }
]