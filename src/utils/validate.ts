import { urlRegExp } from '@/utils/regExp';

export const isUrl = function(url: string) {
    return urlRegExp.test(url);
};
