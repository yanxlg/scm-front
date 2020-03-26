/**
 * 任务中心api地址枚举
 */
export enum TaskApiPath {
    QueryTaskList = '/api/v1/task/list',
    AddPDDHotTask = '/api/v1/task/spider/pdd_hotsale',
    AddPDDURLTask = '/api/v1/task/spider/url',
    AddPUTask = '/api/v1/task/spider/goods_update',
    DeleteTask = '/api/v1/task/delete',
    ActiveTask = '/api/v1/task/plan',
    RetryTask = '/api/v1/task/retry',
    AbortTask = '/api/v1/task/termination',
    QueryTaskDetail = '/api/v1/task/detail',
    QueryPurchaseIds = '/api/v1/orders/purchase',
    QueryPDDCategory = '/api/v1/spider/pdd_category',
    QueryPDDSortList = '/api/v1/spider/pdd_sort_type',
    QueryTaskLog = '/api/v1/task/exec_log',
    QueryTaskProgressList = '/api/v1/task/progress',
    AddAPTask = '/api/v1/task/spider/auto_purchase',
    QuerySubTaskProgress = '/api/v1/task/progress_detail',
    QuerySubTaskIdList = '/api/v1/task/plan_info',
}
