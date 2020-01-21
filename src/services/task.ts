import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';
import { IFormData } from '@/pages/task/components/TaskSearch';

declare interface ITaskListSearch extends IFormData{
    page:number;
    page_number:number;
}

export async function getTaskList(params:ITaskListSearch) {
    return request.get(ApiPathEnum.QueryTaskList, {
        requestType: 'form',
        params: params,
    });
}
