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
                pid: 'dashboard/overview',
            },
            {
                path: '/dashboard/order',
                name: '订单分析',
                pid: 'dashboard/order',
            },
        ],
        pid: 'dashboard',
    },
    {
        path: '/task',
        name: '任务中心',
        icon: <Icons type="scm-task" className="menu-icon" />,
        children: [
            {
                path: '/task/config',
                name: '任务配置',
                pid: 'task/config',
            },
            {
                path: '/task/list',
                name: '任务列表',
                extract: true,
                pid: 'task/list',
            },
            {
                path: '/task/list/:task_id',
                name: '任务详情',
                hideInMenu: true,
                extract: true,
            },
        ],
        pid: 'task',
    },
    {
        path: '/goods',
        name: '商品中心',
        icon: <Icons type="scm-goods" className="menu-icon" />,
        children: [
            {
                path: '/goods/local',
                name: '本地产品库',
                pid: 'goods/local',
            },
            {
                path: '/goods/local/:id',
                name: '商品版本',
                hideInMenu: true,
            },
            {
                path: '/goods/channel',
                name: '渠道产品库',
                pid: 'goods/channel',
            },
            {
                path: '/goods/channel/version',
                name: '商品版本更新',
                hideInMenu: true,
            },
            {
                path: '/goods/priceStrategy',
                name: '定价策略',
                pid: 'goods/price_strategy',
            },
        ],
        pid: 'goods',
    },
    {
        path: '/selection',
        name: '选品中心',
        icon: <Icons type="scm-selection" className="menu-icon" />,
        pid: 'selection',
    },
    {
        path: '/order',
        name: '订单管理',
        icon: <Icons type="scm-order" className="menu-icon" />,
        pid: 'order',
    },
    {
        path: '/stock',
        name: '出入库管理',
        icon: <Icons type="scm-io" className="menu-icon" />,
        pid: 'stock',
    },
    {
        path: '/purchase',
        name: '采购管理',
        icon: <Icons type="scm-purchase" className="menu-icon" />,
        children: [
            {
                path: '/purchase/list',
                name: '采购单列表',
                pid: 'purchase/list',
            },
            {
                path: '/purchase/return',
                name: '采购退货',
                pid: 'purchase/return',
            },
            {
                path: '/purchase/abnormal',
                name: '仓库异常处理',
                pid: 'purchase/abnormal',
            },
        ],
        pid: 'purchase',
    },
    {
        path: '/setting',
        name: '基本设置',
        icon: <Icons type="scm-setting" className="menu-icon" />,
        children: [
            {
                path: '/setting/store',
                name: '店铺设置',
                pid: 'setting/store',
            },
            {
                path: '/setting/account',
                name: '账户管理',
                pid: 'setting/account',
            },
            {
                path: '/setting/export',
                name: '导出管理',
                pid: 'setting/export',
            },
            {
                path: '/setting/goodsAttr',
                name: '商品属性',
                pid: 'setting/goods_attr',
            },
            {
                path: '/setting/shopBlacklist',
                name: '采购店铺黑名单',
                pid: 'setting/shop_black_list',
            },
            {
                path: '/setting/info',
                name: '重量报关信息映射',
                pid: 'setting/customs',
            },
            {
                path: '/setting/permission',
                name: '账号权限',
                pid: 'setting/permission',
            },
        ],
        pid: 'setting',
    },
];
