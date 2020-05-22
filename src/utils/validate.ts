import { urlRegExp } from '@/utils/regExp';

export const isUrl = function(url: string) {
    return urlRegExp.test(url);
};

export const isNumber = function(val: any) {
    return typeof val === 'number' && !Number.isNaN(val);
};
