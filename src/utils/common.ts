/**
 * 将换行替换成逗号
 * @param text
 */
import { FormInstance } from 'antd/es/form';

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

export function cloneSet<T>(set: Set<T>) {
    return new Set(Array.from(set));
}

export function isNumber(value?: string | number) {
    return /^\d+$/.test(String(value));
}

export function scrollToFirstError(
    form: FormInstance,
    errorFields: {
        name: (string | number)[];
        errors: string[];
    }[],
) {
    form.scrollToField(errorFields[0].name, {
        scrollMode: 'if-needed',
        behavior: actions => {
            if (!actions || actions.length === 0) {
                return;
            }
            const [{ top }] = actions;
            const to = Math.max(top - 80, 0);
            window.scrollTo({
                top: to,
                behavior: 'smooth',
            });
        },
    });
}
