export const multipleToArray = (value?: string) => {
    if (value === void 0 || /^\s+$/.test(value)) {
        return undefined;
    }
    return value
        .replace(/\r\n/g, ',')
        .replace(/\r/g, ',')
        .replace(/\n/g, ',')
        .replace(/,{2,}/g, ',')
        .replace(/\s+/g, ',')
        .split(',');
};
