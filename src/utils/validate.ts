import { urlRegExp } from '@/utils/regExp';

export const isUrl = function(url: string) {
    return urlRegExp.test(url);
};

export const isNumber = function(val: any) {
    return typeof val === 'number' && !Number.isNaN(val);
};

export function validateRange(
    getFieldValue: (name: string) => any,
    minName: string,
    maxName: string,
) {
    const min = getFieldValue(minName);
    const max = getFieldValue(maxName);
    // console.log('aaaaaa', min, max);
    const typeList = [null, undefined, ''];
    if (typeList.indexOf(min) === -1 && typeList.indexOf(max) === -1 && Number(min) > Number(max)) {
        return Promise.reject('请检查区间!');
    }
    return Promise.resolve();
}
