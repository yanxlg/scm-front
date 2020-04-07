import React, {
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import { Form, Input, Select, TreeSelect } from 'antd';
import { HotTaskFilterType, HotTaskRange } from '@/enums/StatusEnum';
import { FormInstance } from 'antd/es/form';
import { IPDDCategoryResponse } from '@/interface/ITask';
import { queryCategory } from '@/services/task';
import { TreeNodeNormal } from 'antd/es/tree/Tree';
import formStyles from 'react-components/es/JsonForm/_form.less';
import classNames from 'classnames';

declare interface ReptileConditionProps {
    form: FormInstance;
}

export interface ReptileConditionRef {
    reset: () => void;
}

const ReptileCondition: ForwardRefRenderFunction<ReptileConditionRef, ReptileConditionProps> = (
    { form },
    ref,
) => {
    const [pddCategory, setPddCategory] = useState<IPDDCategoryResponse>([]);
    const [loading, setLoading] = useState(true);
    const [firstTreeData, setFirstTreeData] = useState<Array<TreeNodeNormal>>([]);
    const [middleTreeData, setMiddleTreeData] = useState<Array<TreeNodeNormal>>([]);
    const [lastTreeData, setLastTreeData] = useState<Array<TreeNodeNormal>>([]);

    useEffect(() => {
        queryCategory()
            .then(({ data }) => {
                if (data && data.length > 0) {
                    onReset(data);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const onReset = useCallback(
        (data?: IPDDCategoryResponse) => {
            if (data) {
                setPddCategory(data);
            }
            const list = data || pddCategory;
            const firstTreeData = getTreeNodeList(list);
            const firstInitId = firstTreeData[0]?.key ?? '';
            const middleTreeData = getTreeNodeList(list, [firstInitId]);
            const middleInitId = middleTreeData[0]?.key ?? '';
            const lastTreeData = getTreeNodeList(list, [firstInitId], [middleInitId]);
            const lastInitId = lastTreeData[0]?.key ?? '';
            setFirstTreeData(firstTreeData);
            setMiddleTreeData(middleTreeData);
            setLastTreeData(lastTreeData);
            form.setFieldsValue({
                category_level_one: firstInitId ? [firstInitId] : [],
                category_level_two: middleInitId ? [middleInitId] : [],
                category_level_three: lastInitId ? [lastInitId] : [],
            });
        },
        [pddCategory],
    );

    useImperativeHandle(
        ref,
        () => {
            return {
                reset: onReset,
            };
        },
        [pddCategory],
    );

    const filterChange = useCallback(
        (value: HotTaskFilterType) => {
            if (value === HotTaskFilterType.ByKeywords) {
                form.resetFields([
                    'category_level_one',
                    'category_level_two',
                    'category_level_three',
                    'keywords',
                ]);
            } else {
                onReset();
            }
        },
        [pddCategory],
    );

    const getCategoryIdList = useCallback((categoryIds?: string[]) => {
        return categoryIds && categoryIds.length === 1 ? categoryIds[0].split(',') : categoryIds;
    }, []);

    const getTreeNodeList = useCallback(
        (
            pddCategory: IPDDCategoryResponse,
            firstFilterIds?: string[],
            secondFilterIds?: string[],
        ) => {
            // 不能调用setFieldsValue方法重置，会重复render
            if (pddCategory.length === 0) {
                return [];
            }
            let idArr: string[] = [];
            let childrenArr: any[] = [];
            let ids = '';
            const firstFilterIdArray = getCategoryIdList(firstFilterIds);
            const secondFilterIdArray = getCategoryIdList(secondFilterIds);
            if (!firstFilterIdArray) {
                pddCategory.forEach(category => {
                    idArr.push(category.platform_cate_id);
                    childrenArr.push({
                        title: category.platform_cate_name,
                        value: category.platform_cate_id,
                        key: category.platform_cate_id,
                    });
                });
                ids = idArr.join(',');
                const hasChildren = ids.length > 0;
                return hasChildren
                    ? [
                          {
                              title: '全选',
                              value: ids,
                              key: ids,
                              children: childrenArr,
                          },
                      ]
                    : [];
            }
            if (!secondFilterIdArray) {
                pddCategory
                    .filter(category => {
                        return firstFilterIdArray.indexOf(category.platform_cate_id) > -1;
                    })
                    .forEach(({ children = [] }) => {
                        children.forEach(category => {
                            idArr.push(category.platform_cate_id);
                            childrenArr.push({
                                title: category.platform_cate_name,
                                value: category.platform_cate_id,
                                key: category.platform_cate_id,
                            });
                        });
                    });
                ids = idArr.join(',');
                const hasChildren = ids.length > 0;
                return hasChildren
                    ? [
                          {
                              title: '全选',
                              value: ids,
                              key: ids,
                              children: childrenArr,
                          },
                      ]
                    : [];
            }
            pddCategory
                .filter(category => {
                    return firstFilterIdArray.indexOf(category.platform_cate_id) > -1;
                })
                .forEach(({ children = [] }) => {
                    children
                        .filter(category => {
                            return secondFilterIdArray.indexOf(category.platform_cate_id) > -1;
                        })
                        .forEach(({ children = [] }) => {
                            children.forEach(category => {
                                idArr.push(category.platform_cate_id);
                                childrenArr.push({
                                    title: category.platform_cate_name,
                                    value: category.platform_cate_id,
                                    key: category.platform_cate_id,
                                });
                            });
                        });
                });
            ids = idArr.join(',');
            const hasChildren = ids.length > 0;
            return hasChildren
                ? [
                      {
                          title: '全选',
                          value: ids,
                          key: ids,
                          children: childrenArr,
                      },
                  ]
                : [];
        },
        [],
    );

    const onFirstCategoryChange = useCallback(
        (value: string[]) => {
            // 重新计算level_2,level_3 数据
            const levelOne = value || [];
            const middleTreeData = getTreeNodeList(pddCategory, levelOne);
            const middleInitId = middleTreeData[0]?.key || '';
            const lastTreeData = getTreeNodeList(pddCategory, levelOne, [middleInitId]);
            const lastInitId = lastTreeData[0]?.key || '';
            setMiddleTreeData(middleTreeData);
            setLastTreeData(lastTreeData);
            form.setFieldsValue({
                category_level_two: middleInitId ? [middleInitId] : [],
                category_level_three: lastInitId ? [lastInitId] : [],
            });
        },
        [pddCategory],
    );

    const onMiddleCategoryChange = useCallback(
        (value: string[]) => {
            // 重新计算level_2,level_3 数据
            const middleLevel = value || [];
            const firstInitId = form.getFieldValue('category_level_one') || [];
            const lastTreeData = getTreeNodeList(pddCategory, firstInitId, middleLevel);
            const lastInitId = lastTreeData[0]?.key || '';
            setLastTreeData(lastTreeData);
            form.setFieldsValue({
                category_level_three: lastInitId ? [lastInitId] : [],
            });
        },
        [pddCategory],
    );

    const checkSecondCategory = useCallback(() => {
        const {
            category_level_one = [] as string | string[],
            category_level_two = [],
            filterType,
        } = form.getFieldsValue(['category_level_one', 'category_level_two', 'filterType']);
        if (filterType === HotTaskFilterType.ByKeywords) {
            return Promise.resolve();
        }
        const firstIds =
            typeof category_level_one === 'string'
                ? category_level_one.split(',')
                : category_level_one.length === 1
                ? category_level_one[0].split(',')
                : category_level_one;
        let validate = false;
        let firstCategoryList: any[] = [];
        pddCategory.forEach(first => {
            if (firstIds.indexOf(first.platform_cate_id) > -1) {
                firstCategoryList.push(first);
            }
        });
        const mergeList = ([] as any[]).concat(firstCategoryList);
        const length = mergeList.length;
        let i = 0;
        while (!validate && i < length) {
            const cur = mergeList[i];
            const children = cur.children;
            if (!children || children!.length === 0) {
                validate = true;
            }
            i++;
        }

        if (validate || (category_level_two && category_level_two.length > 0)) {
            return Promise.resolve();
        }

        return Promise.reject('必须选择二级分类');
    }, [pddCategory]);

    const checkLastCategory = useCallback(() => {
        const {
            category_level_one = [] as string | string[],
            category_level_two = [] as string | string[],
            category_level_three = [],
            filterType,
        } = form.getFieldsValue([
            'category_level_one',
            'category_level_two',
            'category_level_three',
            'filterType',
        ]);
        if (filterType === HotTaskFilterType.ByKeywords) {
            return Promise.resolve();
        }
        const firstIds =
            typeof category_level_one === 'string'
                ? category_level_one.split(',')
                : category_level_one.length === 1
                ? category_level_one[0].split(',')
                : category_level_one;
        const secondIds =
            typeof category_level_two === 'string'
                ? category_level_two.split(',')
                : category_level_two.length === 1
                ? category_level_two[0].split(',')
                : category_level_two;
        let validate = false;
        let firstCategoryList: any[] = [];
        let secondCategory: any[] = [];
        pddCategory.forEach(first => {
            if (firstIds.indexOf(first.platform_cate_id) > -1) {
                firstCategoryList.push(first);
            }
            first.children?.forEach(second => {
                if (secondIds.indexOf(second.platform_cate_id) > -1) {
                    secondCategory.push(second);
                }
            });
        });

        const mergeList = ([] as any[]).concat(firstCategoryList).concat(secondCategory);

        const length = mergeList.length;

        let i = 0;
        while (!validate && i < length) {
            const cur = mergeList[i];
            const children = cur.children;
            if (!children || children!.length === 0) {
                validate = true;
            }
            i++;
        }

        if (
            validate ||
            (category_level_three && category_level_three.length > 0) ||
            !category_level_two ||
            category_level_two.length === 0
        ) {
            return Promise.resolve();
        }
        return Promise.reject('必须选择三级分类');
    }, [pddCategory]);

    const selectItem = useMemo(() => {
        return (
            <Form.Item
                noStyle={true}
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.range !== currentValues.range
                }
            >
                {({ getFieldValue }) => {
                    const range = getFieldValue('range');
                    return (
                        <Form.Item
                            label="爬虫条件"
                            name="filterType"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择爬虫条件',
                                },
                            ]}
                        >
                            <Select onChange={filterChange} className="picker-default">
                                <Select.Option
                                    value={HotTaskFilterType.ByCategory}
                                    disabled={range === HotTaskRange.store}
                                >
                                    指定分类
                                </Select.Option>
                                <Select.Option value={HotTaskFilterType.ByKeywords}>
                                    指定关键词
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    );
                }}
            </Form.Item>
        );
    }, [pddCategory]);

    const keywordItem = useMemo(() => {
        return (
            <Form.Item
                className={classNames(formStyles.formItem, formStyles.formRequiredHide)}
                validateTrigger={'onBlur'}
                name="keywords"
                label="关&ensp;键&ensp;词"
                required={true}
            >
                <Input
                    className="input-large"
                    spellCheck={'false'}
                    placeholder="iPhone XR，国行，白"
                />
            </Form.Item>
        );
    }, []);

    const firstCategoryItem = useMemo(() => {
        return (
            <Form.Item
                validateTrigger={'onBlur'}
                name="category_level_one"
                label="一级类目"
                className={classNames(
                    formStyles.formItem,
                    formStyles.formHorizon,
                    'config-hot-category',
                )}
                validateFirst={true}
                rules={[
                    {
                        required: true,
                        message: '必须选择一级分类',
                    },
                ]}
            >
                <TreeSelect
                    maxTagCount={loading ? 0 : 10}
                    maxTagPlaceholder={loading ? () => <span>全选</span> : undefined}
                    choiceTransitionName={''}
                    treeNodeFilterProp="title"
                    onChange={onFirstCategoryChange}
                    loading={loading}
                    showArrow={true}
                    className="picker-default"
                    showCheckedStrategy={'SHOW_PARENT'}
                    showSearch={true}
                    treeDefaultExpandAll={true}
                    treeCheckable={true}
                    treeData={firstTreeData}
                    // maxTagCount={10}
                />
            </Form.Item>
        );
    }, [loading, firstTreeData]);

    const middleCategoryItem = useMemo(() => {
        return (
            <Form.Item
                validateTrigger={'onBlur'}
                name="category_level_two"
                label="二级类目"
                className={classNames(
                    formStyles.formItem,
                    formStyles.formHorizon,
                    formStyles.formRequiredHide,
                    'config-hot-category',
                )}
                required={true}
                rules={[
                    {
                        validator: checkSecondCategory,
                    },
                ]}
            >
                <TreeSelect
                    choiceTransitionName={''}
                    treeNodeFilterProp="title"
                    loading={loading}
                    className="picker-default"
                    onChange={onMiddleCategoryChange}
                    showArrow={true}
                    showCheckedStrategy={'SHOW_PARENT'}
                    showSearch={true}
                    treeDefaultExpandAll={true}
                    treeCheckable={true}
                    treeData={middleTreeData}
                    maxTagCount={loading ? 0 : 10}
                    maxTagPlaceholder={loading ? () => <span>全选</span> : undefined}
                />
            </Form.Item>
        );
    }, [loading, middleTreeData]);

    const lastCategoryItem = useMemo(() => {
        return (
            <Form.Item
                validateTrigger={'onBlur'}
                name="category_level_three"
                label="三级类目"
                required={true}
                className={classNames(
                    formStyles.formItem,
                    formStyles.formHorizon,
                    formStyles.formRequiredHide,
                )}
                rules={[
                    {
                        validator: checkLastCategory,
                    },
                ]}
            >
                <TreeSelect
                    choiceTransitionName={''}
                    treeNodeFilterProp="title"
                    loading={loading}
                    className="picker-default"
                    showArrow={true}
                    showCheckedStrategy={'SHOW_PARENT'}
                    showSearch={true}
                    treeDefaultExpandAll={true}
                    treeCheckable={true}
                    treeData={lastTreeData}
                    maxTagCount={loading ? 0 : 10}
                    maxTagPlaceholder={loading ? () => <span>全选</span> : undefined}
                />
            </Form.Item>
        );
    }, [loading, lastTreeData]);

    return useMemo(() => {
        return (
            <>
                {selectItem}
                <Form.Item
                    noStyle={true}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.filterType !== currentValues.filterType
                    }
                >
                    {({ getFieldValue }) => {
                        const filterType = getFieldValue('filterType');
                        return (
                            <Form.Item noStyle={true}>
                                {filterType === HotTaskFilterType.ByKeywords ? (
                                    keywordItem
                                ) : (
                                    <React.Fragment>
                                        {firstCategoryItem}
                                        {middleCategoryItem}
                                        {lastCategoryItem}
                                    </React.Fragment>
                                )}
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            </>
        );
    }, [loading, firstTreeData, middleTreeData, lastTreeData]);
};

export default forwardRef(ReptileCondition);
