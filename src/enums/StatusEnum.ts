export const goodsStatusMap: { [key: number]: string } = {
    0: '全部',
    1: '待上架',
    2: '已上架',
    3: '已下架',
};

// 返回哪些状态可以执行上架操作
export const checkUpperShelf = function(status: number) {
    return status === 1; // 待上架
};

//返回哪些状态可执行下架操作
export const checkLowerShelf = function(status: number) {
    return status === 2; // 已上架
};
