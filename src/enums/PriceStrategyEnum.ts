export enum EditEnum {
    DEFAULT = 1,
    ADD,
    UPDATE,
}

export const requiredRule = { required: true, message: '不能为空！' };
export const maxLengthRule = { max: 32, message: '最长输入32个字符！' };
