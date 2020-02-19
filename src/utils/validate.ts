import { urlRegExp } from '@/utils/regExp';

export const validateUrl = function(url:string) {
    return urlRegExp.test(url);
};

export const validateNull = function(value:any) {
    return value === null || value === void 0;
};
