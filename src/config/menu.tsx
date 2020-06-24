import React from 'react';
import { DashboardOutlined } from '@ant-design/icons';
import { Icons } from '@/components/Icon';
import '@/styles/menu.less';

export default [
    {
        path: '/',
        hideInMenu: true,
        name: '首页',
        icon: <DashboardOutlined className="menu-icon" />,
    },
    {
        path: '/dashboard',
        name: 'DashBoard',
        icon: <DashboardOutlined className="menu-icon" />,
        children: [
            {
                path: '/dashboard/overview',
                name: '数据概览',
            },
            {
                path: '/dashboard/order',
                name: '订单分析',
            },
        ],
    },
    {
        path: '/task',
        name: '任务中心',
        icon: <Icons type="scm-task" className="menu-icon" />,
        children: [
            {
                path: '/task/config',
                name: '任务配置',
            },
            {
                path: '/task/list',
                name: '任务列表',
                extract: true,
            },
            {
                path: '/task/list/:task_id',
                name: '任务详情',
                hideInMenu: true,
                extract: true,
            },
            {
                path: '/task/drafts',
                name: '草稿箱',
                hideInMenu: true,
            },
        ],
    },
    {
        path: '/goods',
        name: '商品中心',
        icon: <Icons type="scm-goods" className="menu-icon" />,
        children: [
            {
                path: '/goods/local',
                name: '本地产品库',
            },
            {
                path: '/goods/local/:id',
                name: '商品版本',
                hideInMenu: true,
            },
            {
                path: '/goods/channel',
                name: '渠道产品库',
            },
            {
                path: '/goods/channel/version',
                name: '商品版本更新',
                hideInMenu: true,
            },
            {
                path: '/goods/priceStrategy',
                name: '定价策略',
            },
        ],
    },
    {
        path: '/order',
        name: '订单管理',
        icon: <Icons type="scm-order" className="menu-icon" />,
    },
    {
        path: '/stock',
        name: '出入库管理',
        icon: <Icons type="scm-io" className="menu-icon" />,
    },
    {
        path: '/purchase',
        name: '采购管理',
        icon: <Icons type="scm-purchase" className="menu-icon" />,
        children: [
            {
                path: '/purchase/list',
                name: '采购单列表',
            },
            {
                path: '/purchase/return',
                name: '采购退货',
            },
            {
                path: '/purchase/abnormal',
                name: '仓库异常处理',
            },
        ],
    },
    {
        path: '/setting',
        name: '基本设置',
        icon: <Icons type="scm-setting" className="menu-icon" />,
        children: [
            {
                path: '/setting/store',
                name: '店铺设置',
            },
            {
                path: '/setting/account',
                name: '账户管理',
            },
            {
                path: '/setting/export',
                name: '导出管理',
            },
            {
                path: '/setting/goodsAttr',
                name: '商品属性',
            },
            {
                path: '/setting/price',
                name: '价格上浮设置',
            },
            {
                path: '/setting/shopBlacklist',
                name: '采购店铺黑名单',
            },
            {
                path: '/setting/address',
                name: '中转仓地址设置',
            },
            {
                path: '/setting/info',
                name: '重量报关信息映射',
            },
            {
                path: '/setting/permission',
                name: '账号权限',
            },
        ],
    },
];
