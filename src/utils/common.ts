export const numberFormatter = (value?: string | number) =>
    typeof value === 'number' ? String(value) : value ? (/^\d+/.exec(value) || [''])[0] : '';

/**
 * 将换行替换成逗号
 * @param text
 */
export const stringifyText = (text:string)=>{
    // 不同系统换行符不一样
    return text.replace(/\r\n/g, ',').replace(/\r/g, ',').replace(/\n/g, ',').replace(/,{2,}/g, ',')
};

/**
 * 将逗号转换成换行符
 * @param text
 */
export const parseText=(text:string="")=>{
    return text.replace(/,/g, '\r\n');
};