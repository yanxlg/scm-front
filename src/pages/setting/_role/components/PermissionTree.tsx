import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd/es/form';
import { Checkbox, Form, Tree } from 'antd';
import styles from '@/pages/setting/_accont/_index.less';
import { IPermissionTree } from '@/interface/ISetting';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import classNames from 'classnames';
import formStyles from 'react-components/es/JsonForm/_form.less';
import { queryPermissionTree } from '@/services/setting';
import { DataNode } from 'rc-tree/lib/interface';
import { Store } from 'antd/es/form/interface';

const { TreeNode } = Tree;

declare interface PermissionTreeProps {
    form: FormInstance;
}

const checkedAll = (flatKeys: string[], checkedKeys: string[]) => {
    let checkedAll = true,
        i = 0;
    while (checkedAll && i < flatKeys.length) {
        const key = flatKeys[i];
        if (checkedKeys.indexOf(key) > -1) {
            i++;
        } else {
            checkedAll = false;
        }
    }
    return checkedAll;
};

const PermissionTree: React.FC<PermissionTreeProps> = ({ form }) => {
    const [pageChecked, setPageChecked] = useState<'checked' | 'indeterminate'>();
    const [allCheckedState, setAllCheckedState] = useState<'checked' | 'indeterminate'>();

    const flatKeysRef = useRef<string[]>([]);
    const keysArrayRef = useRef<Array<string[]>>([]);

    const parentMapRef = useRef<Map<string | number, (string | number)[]>>(new Map());

    const [pTreeArr, setPTreeArr] = useState<{
        page: IPermissionTree[];
        data: IPermissionTree[];
    }>({
        page: [],
        data: [],
    });
    const updatePageCheckedState = useCallback(() => {
        const formValue = form.getFieldsValue();
        const pageTree: Array<string[]> = formValue.page_tree;
        const selectedKeys = pageTree.flat().filter(Boolean);
        const checkAll = checkedAll(flatKeysRef.current, selectedKeys);
        if (selectedKeys.length === 0) {
            setPageChecked(undefined);
        } else if (checkAll) {
            setPageChecked('checked');
        } else {
            setPageChecked('indeterminate');
        }
        updateAllCheckedState();
    }, []);

    const updateAllCheckedState = useCallback(() => {
        const values = form.getFieldsValue();
        const dataKeys = values.data || [];
        const pKeys = values.page_tree || [];

        const selectedKeys = pKeys.flat().filter(Boolean);
        const checkAll = checkedAll(flatKeysRef.current, selectedKeys);

        const dataChecked = dataKeys.indexOf('data') > -1;
        if (dataChecked && checkAll) {
            setAllCheckedState('checked');
        } else if (dataKeys.length > 0 || selectedKeys.length > 0) {
            setAllCheckedState('indeterminate');
        } else {
            setAllCheckedState(undefined);
        }
    }, []);

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

    const clearPagePermission = useCallback((e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        if (checked) {
            setPageChecked('checked');
            form.setFieldsValue({
                page_tree: keysArrayRef.current,
            });
        } else {
            setPageChecked(undefined);
            form.setFieldsValue({
                page_tree: [],
            });
        }
        updateAllCheckedState();
    }, []);

    const queryTree = useCallback(() => {
        queryPermissionTree().then(({ pTree, flatKeys, keysArr, dataTree, parentMap }) => {
            flatKeysRef.current = flatKeys;
            keysArrayRef.current = keysArr;
            parentMapRef.current = parentMap;
            setPTreeArr({
                page: pTree,
                data: dataTree,
            });
        });
    }, []);

    useEffect(() => {
        queryTree();
    }, []);

    // 选中状态，子影响父，父影响子

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
                        const isDataAll = data.indexOf('all') > -1;
                        const checked = pageAllChecked && isDataAll;
                        const indeterminate = (data.length || treeArr.length) && !checked;
                        return (
                            <Checkbox
                                checked={checked}
                                indeterminate={indeterminate}
                                onChange={onCheckAll}
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
                        treeData={[
                            {
                                title: '数据权限',
                                key: 'all',
                                children: pTreeArr.data,
                            },
                        ]}
                        onCheck={updateAllCheckedState}
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
                                checkedKeys={{
                                    checked: checked ? ['_1'] : [],
                                    halfChecked: treeArr.length && !checked ? ['_1'] : [],
                                }}
                                onCheck={onPageCheckAll}
                            >
                                <TreeNode title="页面和操作" key="_1">
                                    <TreeNode
                                        checkable={false}
                                        selectable={false}
                                        className={styles.formTreeLayout}
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
                                        key="page_permission_content"
                                    />
                                </TreeNode>
                            </Tree>
                        );
                    }}
                </Form.Item>
            </>
        );
    }, [pTreeArr, pageChecked, allCheckedState]);
};

export default PermissionTree;
