export const numberFormatter = (value?: string | number) =>
    typeof value === 'number'
        ? String(value)
        : value
        ? (/^\d+(\.\d+)?/.exec(value) || [''])[0]
        : '';

export const intFormatter = (value?: string | number) =>
    typeof value === 'number' ? String(value) : value ? (/^\d+/.exec(value) || [''])[0] : '';

/**
 * 将换行替换成逗号
 * @param text
 */
export const stringifyText = (text: string) => {
    // 不同系统换行符不一样
    return text
        .replace(/\r\n/g, ',')
        .replace(/\r/g, ',')
        .replace(/\n/g, ',')
        .replace(/,{2,}/g, ',')
        .replace(/\s/g, '');
};

/**
 * 将逗号转换成换行符
 * @param text
 */
export const parseText = (text: string = '') => {
    return text.replace(/,/g, '\r\n');
};

/**
 * 字符串转成number或者undefined
 * @param string
 */
export const strToNumber = (str: string): number | undefined => {
    return str ? Number(str) : undefined;
};

export const getCookie = (name: string) => {
    const cookieStr = document.cookie;
    const cookieArr = cookieStr.split('; ');
    for (let i = 0; i < cookieArr.length; i++) {
        const arr = cookieArr[i].split('=');
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return '';
};
