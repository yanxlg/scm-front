import React from 'react';
import { DashboardOutlined } from '@ant-design/icons/lib';
import { Icons } from '@/components/Icon';
import '@/styles/menu.less';

export default [
    {
        path: '/',
        name: '首页',
        icon: <DashboardOutlined className="menu-icon" />,
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
                path: '/goods/local/version',
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
        path: '/setting',
        name: '基本设置',
        icon: <Icons type="scm-setting" className="menu-icon" />,
        children: [
            {
                path: '/setting/goodsAttr',
                name: '商品属性',
            },
            {
                path: '/setting/store',
                name: '店铺关联',
            },
            {
                path: '/setting/price',
                name: '价格上浮设置',
            },
            {
                path: '/setting/address',
                name: '中转仓地址设置',
            },
            {
                path: '/setting/info',
                name: '重要报关信息映射',
            },
        ],
    },
];
