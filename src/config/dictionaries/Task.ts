import { transStatusList } from '@/utils/transform';

export const TaskChannelMap = {
    '1': '拼多多',
    '2': '1688',
    '3': 'VOVA',
};

export const TaskChannelEnum = {
    PDD: '1',
    1688: '2',
    VOVA: '3',
};

export type TaskChannelCode = keyof typeof TaskChannelMap;
export const TaskChannelList = transStatusList(TaskChannelMap);

export const isOnceTask = function(execute_count: string | number) {
    return Number(execute_count) === 1;
};
