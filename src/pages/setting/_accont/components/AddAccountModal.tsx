import React from 'react';
import { Modal } from 'antd';
import { JsonForm } from 'react-components';
import styles from '../_index.less';
import classNames from 'classnames';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { CaretRightOutlined } from '@ant-design/icons';

const pTree = [
    {
        title: 'Dashboard',
        key: '0',
        children: [
            {
                title: '数据概览',
                key: '0-1',
            },
            {
                title: '订单分析',
                key: '0-2',
            },
        ],
    },
    {
        title: '任务中心',
        key: '1',
        children: [
            {
                title: '任务配置',
                key: '1-1',
            },
            {
                title: '任务列表',
                key: '1-2',
                children: [
                    {
                        title: '删除任务',
                        key: '1-2-1',
                    },
                    {
                        title: '终止任务',
                        key: '1-2-2',
                    },
                    {
                        title: '立即执行',
                        key: '1-2-3',
                    },
                    {
                        title: '重试任务',
                        key: '1-2-4',
                    },
                ],
            },
        ],
    },
    {
        title: '商品中心',
        key: '2',
        children: [
            {
                title: '本地产品库',
                key: '2-1',
                children: [
                    {
                        title: '上架商品',
                        key: '2-1-1',
                    },
                    {
                        title: '编辑商品',
                        key: '2-1-2',
                    },
                    {
                        title: '修改属性',
                        key: '2-1-3',
                    },
                    {
                        title: '删除商品',
                        key: '2-1-4',
                    },
                ],
            },
            {
                title: '渠道产品库',
                key: '2-2',
                children: [
                    {
                        title: '上架商品',
                        key: '2-2-1',
                    },
                    {
                        title: '下架商品',
                        key: '2-2-2',
                    },
                    {
                        title: '销售价格调整',
                        key: '2-2-3',
                    },
                ],
            },
            {
                title: '定价策略',
                key: '2-3',
                children: [
                    {
                        title: '新增商品售价配置',
                        key: '2-3-1',
                    },
                    {
                        title: '更新商品售价',
                        key: '2-3-2',
                    },
                    {
                        title: '新增运费规则',
                        key: '2-3-3',
                    },
                    {
                        title: '更新运费规则',
                        key: '2-3-4',
                    },
                    {
                        title: '新增运费价卡',
                        key: '2-3-5',
                    },
                    {
                        title: '更新运费价卡',
                        key: '2-3-6',
                    },
                    {
                        title: '预估重量批量导入',
                        key: '2-3-7',
                    },
                ],
            },
        ],
    },
    {
        title: '订单管理',
        key: '3',
        children: [
            {
                title: '审核通过',
                key: '3-1',
            },
            {
                title: '拍单/重拍',
                key: '3-2',
            },
            {
                title: '取消采购单',
                key: '3-3',
            },
            {
                title: '取消订单',
                key: '3-4',
            },
            {
                title: '下架商品',
                key: '3-5',
            },
        ],
    },
    {
        title: '出入库管理',
        key: '4',
        children: [
            {
                title: '出入库管理',
                key: '4-1',
            },
        ],
    },
    {
        title: '采购管理',
        key: '5',
        children: [
            {
                title: '采购单列表',
                key: '5-1',
                children: [
                    {
                        title: '关联运单号',
                        key: '5-1-1',
                    },
                    {
                        title: '申请退款',
                        key: '5-1-2',
                    },
                ],
            },
            {
                title: '采购退货',
                key: '5-2',
                children: [
                    {
                        title: '创建退货单',
                        key: '5-2-1',
                    },
                ],
            },
            {
                title: '仓库异常处理',
                key: '5-3',
                children: [
                    {
                        title: '废弃',
                        key: '5-3-1',
                    },
                    {
                        title: '异常处理',
                        key: '5-3-2',
                    },
                ],
            },
        ],
    },
    {
        title: '基本设置',
        key: '6',
        children: [
            {
                title: '店铺设置',
                key: '6-1',
                children: [
                    {
                        title: '添加价格判断公式',
                        key: '6-1-1',
                    },
                    {
                        title: '添加线下采购配置',
                        key: '6-1-2',
                    },
                    {
                        title: '线下采购配置 - 修改',
                        key: '6-1-3',
                    },
                    {
                        title: '线下采购配置 - 删除',
                        key: '6-1-4',
                    },
                    {
                        title: '添加替换出库配置',
                        key: '6-1-5',
                    },
                    {
                        title: '替换出库配置 - 修改',
                        key: '6-1-6',
                    },
                    {
                        title: '替换出库配置 - 删除',
                        key: '6-1-7',
                    },
                ],
            },
            {
                title: '账户管理',
                key: '6-2',
                children: [
                    {
                        title: '修改',
                        key: '6-2-1',
                    },
                ],
            },
            {
                title: '导出管理',
                key: '6-3',
            },
            {
                title: '商品属性',
                key: '6-4',
                children: [
                    {
                        title: '添加新标签',
                        key: '6-4-1',
                    },
                    {
                        title: '更改设置',
                        key: '6-4-2',
                    },
                ],
            },
            {
                title: '中转仓地址设置',
                key: '6-5',
            },
            {
                title: '重要报关信息映射',
                key: '6-6',
                children: [
                    {
                        title: '提交',
                        key: '6-6-1',
                    },
                ],
            },
            {
                title: '账号权限',
                key: '6-7',
                children: [
                    {
                        title: '添加账号',
                        key: '6-7-1',
                    },
                    {
                        title: '修改账号',
                        key: '6-7-2',
                    },
                    {
                        title: '禁用账号',
                        key: '6-7-3',
                    },
                    {
                        title: '添加角色',
                        key: '6-7-4',
                    },
                    {
                        title: '修改角色',
                        key: '6-7-5',
                    },
                    {
                        title: '禁用角色',
                        key: '6-7-6',
                    },
                ],
            },
        ],
    },
];

declare interface AddAccountModalProps {
    visible: boolean;
}
const AddAccountModal: React.FC<AddAccountModalProps> = ({ visible }) => {
    return (
        <Modal title="添加账号" width={800} visible={visible}>
            <JsonForm
                layout="horizontal"
                labelClassName={styles.formModalLabel}
                fieldList={[
                    {
                        type: 'layout',
                        header: <span className={styles.formModalTitle}>基本信息</span>,
                        fieldList: [
                            {
                                type: 'input',
                                label: '用户名',
                                name: 'accountName',
                            },
                            {
                                type: 'input',
                                label: '姓名',
                                name: 'userName',
                            },
                            {
                                type: 'input',
                                label: '密码',
                                name: 'password',
                            },
                            {
                                type: 'radioGroup',
                                name: 'state',
                                label: '状态',
                                options: [
                                    {
                                        label: '启用',
                                        value: 1,
                                    },
                                    {
                                        label: '禁用',
                                        value: 0,
                                    },
                                ],
                            },
                            {
                                type: 'checkboxGroup',
                                name: 'roles',
                                label: '角色',
                                options: [
                                    {
                                        label: '管理员',
                                        value: 0,
                                    },
                                    {
                                        label: '服务端开发',
                                        value: 1,
                                    },
                                    {
                                        label: '前端开发',
                                        value: 2,
                                    },
                                    {
                                        label: '测试',
                                        value: 3,
                                    },
                                    {
                                        label: '产品',
                                        value: 4,
                                    },
                                    {
                                        label: 'FD运营',
                                        value: 5,
                                    },
                                    {
                                        label: '客服',
                                        value: 6,
                                    },
                                    {
                                        label: '设计',
                                        value: 7,
                                    },
                                    {
                                        label: 'FD产品',
                                        value: 8,
                                    },
                                ],
                                className: classNames(styles.formModalRole),
                                formItemClassName: classNames(
                                    formStyles.formItem,
                                    styles.formModalRoleItem,
                                ),
                            },
                        ],
                    },
                    {
                        type: 'tree',
                        name: 'tree',
                        label: undefined,
                        checkable: true,
                        selectable: false,
                        className: styles.formTreeHorizon,
                        autoExpandParent: true,
                        defaultExpandAll: true,
                        virtual: false,
                        formItemClassName: classNames(formStyles.formItem, styles.formTree),
                        treeData: [
                            {
                                title: '数据权限',
                                key: '0-0',
                                children: [
                                    {
                                        title: 'Airyclub',
                                        key: '0-0-0',
                                    },
                                    {
                                        title: 'SuperAC',
                                        key: '0-0-1',
                                    },
                                    {
                                        title: 'Florynigt',
                                        key: '0-0-2',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'collapse',
                        bordered: false,
                        controlByIcon: true,
                        expandIcon: ({ isActive, ...props }) => (
                            <CaretRightOutlined
                                rotate={isActive ? 90 : 0}
                                className={styles.formCollapseIcon}
                            />
                        ),
                        fieldList: [
                            {
                                type: 'layout',
                                className: styles.formTreeContainer,
                                fieldList: [
                                    {
                                        type: 'tree',
                                        name: 'tree1',
                                        label: undefined,
                                        checkable: true,
                                        selectable: false,
                                        autoExpandParent: true,
                                        defaultExpandAll: true,
                                        formItemClassName: classNames(
                                            formStyles.formItem,
                                            styles.formTree,
                                            formStyles.formHorizon,
                                            styles.formTreeChild,
                                            styles.formTreeChildFirst,
                                        ),
                                        treeData: [pTree[0]],
                                    },
                                    {
                                        type: 'tree',
                                        name: 'tree2',
                                        label: undefined,
                                        checkable: true,
                                        selectable: false,
                                        autoExpandParent: true,
                                        defaultExpandAll: true,
                                        formItemClassName: classNames(
                                            formStyles.formItem,
                                            styles.formTree,
                                            formStyles.formHorizon,
                                            styles.formTreeChild,
                                        ),
                                        treeData: [pTree[1]],
                                    },
                                    {
                                        type: 'tree',
                                        name: 'tree3',
                                        label: undefined,
                                        checkable: true,
                                        selectable: false,
                                        autoExpandParent: true,
                                        defaultExpandAll: true,
                                        formItemClassName: classNames(
                                            formStyles.formItem,
                                            styles.formTree,
                                            formStyles.formHorizon,
                                            styles.formTreeChild,
                                        ),
                                        treeData: [pTree[2]],
                                    },
                                    {
                                        type: 'tree',
                                        name: 'tree4',
                                        label: undefined,
                                        checkable: true,
                                        selectable: false,
                                        autoExpandParent: true,
                                        defaultExpandAll: true,
                                        formItemClassName: classNames(
                                            formStyles.formItem,
                                            styles.formTree,
                                            formStyles.formHorizon,
                                            styles.formTreeChild,
                                        ),
                                        treeData: [pTree[3]],
                                    },
                                    {
                                        type: 'tree',
                                        name: 'tree5',
                                        label: undefined,
                                        checkable: true,
                                        selectable: false,
                                        autoExpandParent: true,
                                        defaultExpandAll: true,
                                        formItemClassName: classNames(
                                            formStyles.formItem,
                                            styles.formTree,
                                            formStyles.formHorizon,
                                            styles.formTreeChild,
                                        ),
                                        treeData: [pTree[4]],
                                    },
                                    {
                                        type: 'tree',
                                        name: 'tree6',
                                        label: undefined,
                                        checkable: true,
                                        selectable: false,
                                        autoExpandParent: true,
                                        defaultExpandAll: true,
                                        formItemClassName: classNames(
                                            formStyles.formItem,
                                            styles.formTree,
                                            formStyles.formHorizon,
                                            styles.formTreeChild,
                                        ),
                                        treeData: [pTree[5]],
                                    },
                                    {
                                        type: 'tree',
                                        name: 'tree7',
                                        label: undefined,
                                        checkable: true,
                                        selectable: false,
                                        autoExpandParent: true,
                                        defaultExpandAll: true,
                                        formItemClassName: classNames(
                                            formStyles.formItem,
                                            styles.formTree,
                                            formStyles.formHorizon,
                                            styles.formTreeChild,
                                        ),
                                        treeData: [pTree[6]],
                                    },
                                ],
                            },
                        ],
                        className: classNames(formStyles.formCollapse, styles.formCollapse),
                        panel: {
                            key: '1',
                            header: {
                                type: 'checkbox',
                                name: '1222',
                                label: '页面和操作',
                                formItemClassName: formStyles.formItemClean,
                            },
                        },
                    },
                ]}
            />
        </Modal>
    );
};

export { AddAccountModal };
