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

export function transOptionList(statusMap: { [key: number]: string; [key: string]: string }) {
    let statusList = [];
    for (let key in statusMap) {
        if (statusMap.hasOwnProperty(key)) {
            statusList.push({
                value: key,
                name: statusMap[key],
            });
        }
    }
    return statusList;
}
