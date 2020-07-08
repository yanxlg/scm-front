export const multipleToArray = (value?: string) => {
    if (value === void 0 || /^\s+$/.test(value)) {
        return undefined;
    }
    const arr = value
        .replace(/\r\n/g, ',')
        .replace(/\r/g, ',')
        .replace(/\n/g, ',')
        .replace(/,{2,}/g, ',')
        .replace(/\s+/g, ',')
        .replace(/\;/g, ',')
        .split(',');
    if (arr.length === 0) {
        return undefined;
    }
    return arr;
};

export const firstNumber = (value?: number[]) => {
    return value ? value[0] : undefined;
};

export const arrayNumber = (value?: string[]) => {
    return value ? value.map(_ => Number(_)) : undefined;
};

export const plainToArr = (value: any) => {
    return value ? [value] : undefined;
};
