export enum TaskRange {
    fullStack,
    store,
}

export enum TaskType {
    once = 1,
    interval,
}

export enum TaskIntervalType {
    day,
    second,
}

export enum TaskStatus {
    UnExecuted,
    Executing,
    Executed,
    Failed,
    Canceled,
}

export enum TimerUpdateTaskRange {
    AllOnShelves = 2,
    HasSales,
}

export const imgDomain: string = '//vovaimguploadtest-img-t.vova.com.hk/';
