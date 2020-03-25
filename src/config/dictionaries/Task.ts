import { transStatusList } from '@/utils/transform';

export const TaskChannelMap = {
    1: '拼多多',
    2: '1688',
};

export const TaskChannelEnum = {
    PDD: '1',
    1688: '2',
};

export type TaskChannelCode = keyof typeof TaskChannelMap;
export const TaskChannelList = transStatusList(TaskChannelMap);
