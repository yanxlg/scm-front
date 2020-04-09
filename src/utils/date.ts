import moment, { Moment } from 'moment';
import { isNumber } from '@/utils/common';

export function formatDate(date: Date, fmt: string): string {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k as 'M+'] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str: string) {
    return ('00' + str).substr(str.length);
}

export function convertStartDate(unix: number) {
    return !unix ? undefined : moment.unix(unix);
}

export function convertEndDate(unix: number) {
    return !unix ? undefined : moment.unix(unix).add(-1, 'd');
}

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export function utcToLocal(dateString?: string | number, placeholder: string = '--') {
    const dateValue = isNumber(dateString) ? (dateString as number) * 1000 : dateString;
    return dateValue
        ? moment
              .utc(dateValue)
              .local()
              .format(dateFormat)
        : placeholder;
}

export function dateToUnix(date?: Moment | number) {
    return typeof date === 'number' ? date : (date?.unix() as number);
}
