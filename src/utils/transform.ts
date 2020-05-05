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

export function transOptionList(statusMap: { [key: number]: string; [key: string]: string }, isNumberKey: boolean = false) {
    let statusList = [];
    for (let key in statusMap) {
        if (statusMap.hasOwnProperty(key)) {
            statusList.push({
                value: isNumberKey ? Number(key) : key,
                name: statusMap[key],
            });
        }
    }
    return statusList;
}

export function formatThousands(num: string | number, str = ',') {
    const reg = /\d{1,3}(?=(\d{3})+$)/g;
    const numStr = num + '';
    return numStr ? numStr.replace(reg, '$&,') : '';
}
