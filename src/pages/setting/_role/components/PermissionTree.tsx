import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd/es/form';
import { Checkbox, Form, Tree } from 'antd';
import styles from '@/pages/setting/_accont/_index.less';
import { IPermissionItem, IPermissionTree } from '@/interface/ISetting';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import classNames from 'classnames';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryPermissionTree, queryRolePermission } from '@/services/setting';
import { DataNode } from 'rc-tree/lib/interface';
import { Store } from 'antd/es/form/interface';

const { TreeNode } = Tree;

declare interface PermissionTreeProps {
    form: FormInstance;
    roleIds?: (number | string)[];
    disabled?: boolean;
    setLoading?: (loading: boolean) => void;
}

const PermissionTree: React.FC<PermissionTreeProps> = ({ form, roleIds, disabled, setLoading }) => {
    const flatKeysRef = useRef<string[]>([]);
    const keysArrayRef = useRef<Array<string[]>>([]);
    const pTreeRef = useRef<IPermissionTree[]>([]);
    const dataTreeRef = useRef<IPermissionTree[]>([]);

    const queryPermissionTreePromise = useRef<Promise<any>>();

    const parentMapRef = useRef<Map<string | number, (string | number)[]>>(new Map());

    const [pTreeArr, setPTreeArr] = useState<{
        page: IPermissionTree[];
        data: IPermissionTree[];
    }>({
        page: [],
        data: [],
    });

    const onCheckAll = useCallback(
        (e: CheckboxChangeEvent) => {
            const checked = e.target.checked;
            if (checked) {
                form.setFieldsValue({
                    data: ['all'].concat(pTreeArr.data.map(item => item.key)),
                    page_tree: keysArrayRef.current,
                });
            } else {
                form.setFieldsValue({
                    data: [],
                    page_tree: [],
                });
            }
        },
        [pTreeArr],
    );

    const queryTree = useCallback(() => {
        queryPermissionTreePromise.current = queryPermissionTree();
        return queryPermissionTreePromise.current.then(
            ({ pTree, flatKeys, keysArr, dataTree, parentMap }) => {
                flatKeysRef.current = flatKeys; // 所有的id
                keysArrayRef.current = keysArr; // 所有分组id
                parentMapRef.current = parentMap; // 所有的父节点
                pTreeRef.current = pTree;
                dataTreeRef.current = dataTree;
                setPTreeArr({
                    page: pTree,
                    data: dataTree,
                });
            },
        );
    }, []);

    useEffect(() => {
        if (roleIds && queryPermissionTreePromise.current) {
            if (roleIds.length) {
                queryPermissionTreePromise.current.then(() => {
                    setLoading && setLoading(true);
                    queryRolePermission(roleIds).then(({ data }) => {
                        const keyMap = new Map<string | number, true>();
                        data.map((item: IPermissionItem['data']) => {
                            keyMap.set(item.id, true);
                        });
                        form.setFieldsValue({
                            page_tree: keysArrayRef.current.map(keys => {
                                return keys.filter(key => keyMap.get(key));
                            }),
                            data: dataTreeRef.current
                                .filter(item => {
                                    return keyMap.get(item.key);
                                })
                                .map(item => {
                                    return item.key;
                                }),
                        });
                        setLoading && setLoading(false);
                    });
                });
            } else {
                queryPermissionTreePromise.current.then(() => {
                    form.setFieldsValue({
                        page_tree: [],
                        data: [],
                    });
                });
            }
        }
    }, [roleIds]);

    useEffect(() => {
        if (roleIds && roleIds.length) {
            setLoading && setLoading(true);
            Promise.all([queryTree(), queryRolePermission(roleIds)]).then(([_, { data }]) => {
                const keyMap = new Map<string | number, true>();
                data.map((item: IPermissionItem['data']) => {
                    keyMap.set(item.id, true);
                });
                form.setFieldsValue({
                    page_tree: keysArrayRef.current.map(keys => {
                        return keys.filter(key => keyMap.get(key));
                    }),
                    data: dataTreeRef.current
                        .filter(item => {
                            return keyMap.get(item.key);
                        })
                        .map(item => {
                            return item.key;
                        }),
                });
                setLoading && setLoading(false);
            });
        } else {
            queryTree();
        }
    }, []);

    const childIterator = useCallback((node: DataNode, callback: (node: DataNode) => void) => {
        node.children?.forEach(node => {
            callback(node);
            childIterator(node, callback);
        });
    }, []);

    const getChildrenKeys = useCallback((node: DataNode) => {
        let keys: string[] = [];
        childIterator(node, ({ key }) => {
            keys.push(key as string);
        });
        return keys;
    }, []);

    const onTreeCheck = useCallback(
        (
            index: number,
            rootKey: string | number,
            checkedKeys:
                | (string | number)[]
                | { checked: (string | number)[]; halfChecked: (string | number)[] },
            info: {
                checked: boolean;
                checkedNodes: Array<DataNode>;
                event: 'check';
                node: DataNode;
            },
        ) => {
            const { checked, node } = info;
            const { key } = node;
            const delKeys = [key].concat(getChildrenKeys(node));
            const keyArray = form.getFieldValue('page_tree') || [];
            const defaultKeys = keyArray[index];
            const keys = Array.isArray(defaultKeys) ? defaultKeys : defaultKeys.checked || [];
            if (checked) {
                // 所有子项全部选中
                const parentKeys = parentMapRef.current.get(key) || [];
                const keySet = new Set(
                    ([] as string[])
                        .concat(keys)
                        .concat(delKeys as string[])
                        .concat(parentKeys as string[]),
                );
                keyArray[index] = Array.from(keySet);
                form.setFieldsValue({
                    page_tree: Array.from(keyArray),
                });
            } else {
                let nextKeys = keys.filter((key: string) => {
                    return delKeys.indexOf(key) < 0;
                });
                if (nextKeys.length === 1 && nextKeys[0] === rootKey) {
                    // 仅剩一级选中，则需要取消
                    nextKeys = [];
                }
                keyArray[index] = nextKeys;
                form.setFieldsValue({
                    page_tree: Array.from(keyArray),
                });
            }
        },
        [],
    );

    const onPageCheckAll = useCallback(
        (
            checkedKeys:
                | (string | number)[]
                | { checked: (string | number)[]; halfChecked: (string | number)[] },
            info: {
                checked: boolean;
                checkedNodes: Array<DataNode>;
                event: 'check';
                node: DataNode;
            },
        ) => {
            const { checked } = info;
            if (checked) {
                form.setFieldsValue({
                    page_tree: keysArrayRef.current,
                });
            } else {
                form.setFieldsValue({
                    page_tree: [],
                });
            }
        },
        [],
    );

    return useMemo(() => {
        return (
            <>
                <Form.Item
                    className={formStyles.formItem}
                    label={<span className={styles.formModalTitle}>权限设置</span>}
                    shouldUpdate={(prevValues: Store, nextValues: Store) => {
                        return (
                            prevValues['page_tree'] !== nextValues['page_tree'] ||
                            prevValues['data'] !== nextValues['data']
                        );
                    }}
                >
                    {({ getFieldValue }) => {
                        const page_tree = getFieldValue('page_tree') || [];
                        const treeArr = page_tree.flat().filter(Boolean);
                        const pageAllChecked =
                            treeArr.length && treeArr.length === flatKeysRef.current.length;

                        const data = getFieldValue('data') || [];
                        const isDataAll = data.length && data.length >= dataTreeRef.current.length; //
                        const checked = pageAllChecked && isDataAll;
                        const indeterminate = (data.length || treeArr.length) && !checked;
                        return (
                            <Checkbox
                                checked={checked}
                                indeterminate={indeterminate}
                                onChange={onCheckAll}
                                disabled={disabled}
                            >
                                全选
                            </Checkbox>
                        );
                    }}
                </Form.Item>
                <Form.Item
                    className={classNames(formStyles.formItem, styles.formTree)}
                    valuePropName={'checkedKeys'}
                    trigger={'onCheck'}
                    name="data"
                >
                    <Tree
                        className={styles.formTreeHorizon}
                        checkable={true}
                        selectable={false}
                        autoExpandParent={true}
                        defaultExpandAll={true}
                        virtual={false}
                        disabled={disabled}
                        treeData={[
                            {
                                title: '数据权限',
                                key: 'all',
                                children: pTreeArr.data,
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    className={classNames(formStyles.formItem)}
                    shouldUpdate={(prevValues: Store, nextValues: Store) => {
                        return prevValues['page_tree'] !== nextValues['page_tree'];
                    }}
                >
                    {({ getFieldValue }) => {
                        const page_tree = getFieldValue('page_tree') || [];
                        const treeArr = page_tree.flat().filter(Boolean);
                        const checked =
                            treeArr.length && treeArr.length === flatKeysRef.current.length;
                        return (
                            <Tree
                                checkStrictly={true}
                                checkable={true}
                                selectable={false}
                                autoExpandParent={true}
                                defaultExpandAll={true}
                                virtual={false}
                                disabled={disabled}
                                checkedKeys={{
                                    checked: checked ? ['_1'] : [],
                                    halfChecked: treeArr.length && !checked ? ['_1'] : [],
                                }}
                                onCheck={onPageCheckAll}
                            >
                                <TreeNode title="页面和操作" key="_1" disabled={disabled}>
                                    <TreeNode
                                        checkable={false}
                                        selectable={false}
                                        className={styles.formTreeLayout}
                                        disabled={disabled}
                                        title={
                                            <div className={styles.formTreeContainer}>
                                                {pTreeArr.page.map((item, index) => {
                                                    return (
                                                        <Form.Item
                                                            key={item.key}
                                                            name={['page_tree', index]}
                                                            className={classNames(
                                                                formStyles.formItem,
                                                                styles.formTree,
                                                                formStyles.formHorizon,
                                                                styles.formTreeChild,
                                                            )}
                                                            valuePropName={'checkedKeys'}
                                                            trigger={'onCheck'}
                                                        >
                                                            <Tree
                                                                checkable={true}
                                                                selectable={false}
                                                                autoExpandParent={true}
                                                                defaultExpandAll={true}
                                                                treeData={[item]}
                                                                disabled={disabled}
                                                                onCheck={onTreeCheck.bind(
                                                                    undefined,
                                                                    index,
                                                                    item.key,
                                                                )}
                                                                checkStrictly={true}
                                                            />
                                                        </Form.Item>
                                                    );
                                                })}
                                            </div>
                                        }
                                        key="_2"
                                    />
                                </TreeNode>
                            </Tree>
                        );
                    }}
                </Form.Item>
            </>
        );
    }, [pTreeArr]);
};

export default PermissionTree;
