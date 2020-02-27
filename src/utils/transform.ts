import { isNull } from '@/utils/validate';

export function transSelectValue(value: string | number | undefined | null) {
    return value === '' || isNull(value) ? undefined : value;
}

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
