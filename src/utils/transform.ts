import { isNull } from '@/utils/validate';

export function transStatusList(statusMap: { [key: number]: string; [key: string]: string }) {
    let statusList = [];
    for (let key in statusMap) {
        if (statusMap.hasOwnProperty(key)) {
            statusList.push({
                id: key,
                name: statusMap[key],
            });
        }
    }
    return statusList;
}

export function transNullValue(value?: any) {
    return value === '' || isNull(value) ? undefined : value;
}

export function transNumber(value?: any) {
    const _value =
        typeof value === 'string'
            ? value === ''
                ? undefined
                : Number(value)
            : typeof value === 'number'
            ? value
            : undefined;
    return _value && isNaN(_value) ? undefined : _value;
}

export function transStrArr(value: string | undefined): string[] | undefined {
    // console.log('transStrArr', value);
    if (typeof value === 'string') {
        return value
            .replace(/(^\s*)|(\s*$)/g, '')
            .split(',')
            .filter(str => str);
    }
    return value as undefined;
}

// 没考虑Bigint转化问题
export function transNumberArr(value: string | undefined): number[] | undefined {
    // console.log('transStrArr', value);
    if (typeof value === 'string') {
        return value
            .replace(/(^\s*)|(\s*$)/g, '')
            .split(',')
            .filter(str => str && !/[^0-9\,]/g.test(str))
            .map(str => Number(str));
    }
    return value as undefined;
}

export function transNumberStrArr(value: string | undefined): string[] | undefined {
    // console.log('transNumberStrArr', value, typeof value);
    if (typeof value === 'string') {
        return value
            .replace(/(^\s*)|(\s*$)/g, '')
            .split(',')
            .filter(str => str && !/[^0-9\,]/g.test(str));
    }
    return value as undefined;
}

export function getStatusDesc(
    list: any[],
    val: any,
    valKey: string = 'value',
    nameKey: string = 'name',
) {
    const index = list.findIndex(item => item[valKey] === val);
    if (index > -1) {
        return list[index][nameKey];
    }
    return '';
}
