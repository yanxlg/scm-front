// wrap ()=>Promise to control it as single instance
import { EmptyObject } from '@/config/global';
import { IResponse } from '@/interface/IGlobal';

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

export const transPaginationResponse = <T>({
    data,
    ...others
}: IResponse<{
    total?: number;
    list?: T[];
    task_info?: T[];
    [key: string]: any;
}> = EmptyObject) => {
    const { total = 0, list, task_info, fee, ...extra } = data || {};
    return {
        data: {
            total,
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
