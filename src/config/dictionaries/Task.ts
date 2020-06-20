// 对应前台展示
export const TaskChannelMap = {
    '1': '拼多多',
    '2': 'VOVA',
    '3': 'FD',
    '4': 'AD',
};

// 写死逻辑要用
export const TaskChannelEnum = {
    PDD: '1',
    VOVA: '2',
    FD: '3',
    AD: '4',
};

export type TaskChannelCode = keyof typeof TaskChannelMap;

export const isOnceTask = function(execute_count: string | number) {
    return Number(execute_count) === 1;
};
