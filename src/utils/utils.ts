// wrap ()=>Promise to control it as single instance
import { EmptyObject } from '@/config/global';
import { IResponse } from '@/interface/IGlobal';
import { parse, stringify } from 'querystring';
import { IOptionItem } from 'react-components/es/JsonForm/items/Select';

function singlePromiseWrap<T, P = any>(promise: (params?: P) => Promise<T>) {
    let syncPromise: Promise<T>;
    return (params?: P) => {
        if (syncPromise) {
            return syncPromise;
        } else {
            syncPromise = promise(params);
        }
        return syncPromise;
    };
}

export const transPaginationRequest = ({
    pageNumber,
    pageSize,
    ...extra
}: {
    pageNumber: number;
    pageSize: number;
    [key: string]: any;
}) => {
    return {
        page: pageNumber,
        page_count: pageSize,
        page_number: pageSize,
        per_page: pageSize,
        ...extra,
    };
};

export const transPaginationResponse = <T = any>({
    data,
    ...others
}: IResponse<{
    total?: number;
    all_count?: number;
    list?: T[];
    task_info?: T[];
    [key: string]: any;
}> = EmptyObject) => {
    const { total = 0, all_count = 0, list, task_info, fee, ...extra } = data || {};
    return {
        data: {
            total: total || all_count,
            list: list || task_info || fee || [],
            ...extra,
        },
        ...others,
    };
};

export { singlePromiseWrap };

export const isEmptyObject = (target: object) => {
    return JSON.stringify(target) === '{}';
};

export const isZero = (num: number | string) => {
    return num === 0 || num === '0';
};

const filterList = ['', undefined, null];
export const formatRequestData = (data: any): any => {
    if (typeof data !== 'object') {
        return data;
    }
    if (Array.isArray(data)) {
        // return data.map(item => formatRequestData(data))
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] === 'object') {
                formatRequestData(data[i]);
            }
        }
    } else {
        for (let key in data) {
            let val = data[key];
            if (filterList.indexOf(val) > -1) {
                delete data[key];
            } else if (typeof val === 'object') {
                formatRequestData(val);
            }
        }
    }
    return data;
};

export const parseJson = (value: any) => {
    if (typeof value === 'object') {
        return value;
    }
    let result = {};
    try {
        let _result = JSON.parse(value);
        while (typeof _result === 'string' && _result) {
            _result = JSON.parse(_result);
        }
        result = typeof _result === 'object' ? _result : {};
    } catch (e) {}
    return result;
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getCurrentOptionList = (
    allList: IOptionItem[],
    valueList: Array<string | number>,
): IOptionItem[] => {
    let list = [...allList];
    for (let i = 0, len = valueList.length; i < len; i++) {
        const currentValue = valueList[i];
        if (currentValue) {
            const index = list.findIndex(({ value }) => value === currentValue);
            if (index > -1) {
                const children = list[index].children;
                list = children ? [...children] : [];
                if (i === len - 1) {
                    return list;
                }
            }
        }
    }
    return [];
};

/**
 * 判断选择的类目是否有未选择的类目 true: 有未选择 false: 没有未选择
 */
export const hasNotSelectedCategory = (
    allCategoryList: IOptionItem[],
    firstId = '',
    secondId = '',
    thirdId = '',
) => {
    if (!firstId) {
        return true;
    } else if (thirdId) {
        return false;
    } else if (secondId) {
        const firstIndex = allCategoryList.findIndex(({ value }) => value === firstId);
        const secondList = allCategoryList[firstIndex].children as IOptionItem[];
        const secondIndex = secondList.findIndex(({ value }) => value === secondId);
        const thirdList = secondList[secondIndex].children as IOptionItem[];
        if (thirdList && thirdList.length > 0) {
            return true;
        }
    } else if (firstId) {
        const firstIndex = allCategoryList.findIndex(({ value }) => value === firstId);
        const secondList = allCategoryList[firstIndex].children as IOptionItem[];
        if (secondList && secondList.length > 0) {
            return true;
        }
    }

    return false;
};

/**
 * 通过ID获取类目名称
 */
export const getCategoryName = (id: string, allCategoryList: IOptionItem[]) => {
    for (let i = 0, firstLen = allCategoryList.length; i < firstLen; i++) {
        const firstItem = allCategoryList[i];
        if (firstItem.value === id) {
            return firstItem.name;
        }
        const secondList = (firstItem.children || []) as IOptionItem[];
        for (let j = 0, secondLen = secondList.length; j < secondLen; j++) {
            const secondItem = secondList[j];
            if (secondItem.value === id) {
                return secondItem.name;
            }
            const thirdList = (secondItem.children || []) as IOptionItem[];
            for (let k = 0, thirdLen = thirdList.length; k < thirdLen; k++) {
                const thirdItem = thirdList[k];
                if (thirdItem.value === id) {
                    return thirdItem.name;
                }
            }
        }
    }
    return '';
};

/**
 * 获取选择的最低类目
 */
export const getCategoryLowestLevel = (
    allCategoryList: IOptionItem[],
    firstId = '',
    secondId = '',
    thirdId = '',
) => {
    if (!firstId) {
        return [];
    } else if (thirdId) {
        return [thirdId];
    } else if (secondId) {
        const firstIndex = allCategoryList.findIndex(({ value }) => value === firstId);
        const secondList = allCategoryList[firstIndex].children as IOptionItem[];
        const secondIndex = secondList.findIndex(({ value }) => value === secondId);
        const thirdList = secondList[secondIndex].children as IOptionItem[];
        if (thirdList && thirdList.length > 0) {
            return thirdList.map(({ value }) => value);
        }
        return [secondId];
    } else if (firstId) {
        const firstIndex = allCategoryList.findIndex(({ value }) => value === firstId);
        const secondList = allCategoryList[firstIndex].children as IOptionItem[];
        if (secondList && secondList.length > 0) {
            const retList: (string | number)[] = [];
            secondList.forEach(({ value: secondValue, children: thirdList }) => {
                if (thirdList && thirdList.length > 0) {
                    thirdList.forEach(({ value }: IOptionItem) => {
                        retList.push(value);
                    });
                } else {
                    retList.push(secondValue);
                }
            });
            return retList;
        }
        return [firstId];
    }
    return [];
};
