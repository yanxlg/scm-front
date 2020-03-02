import { urlRegExp } from '@/utils/regExp';

export const isUrl = function(url: string) {
    return urlRegExp.test(url);
};

export const isNull = function(value: any) {
    return value === null || value === void 0;
};
