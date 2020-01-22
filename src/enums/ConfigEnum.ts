export enum TaskRange {
    fullStack,
    store,
}

export enum TaskType {
    once=1,
    interval
}

export enum TaskIntervalType{
    day,
    second
}


export enum TaskStatus{
    All,
    UnExecuted,
    Executing,
    Executed,
    Failed
}
