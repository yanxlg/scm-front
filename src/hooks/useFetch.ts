import { useEffect, useRef } from 'react';
import Request, { CancelToken, Canceler, RequestOptionsInit } from 'umi-request';
import request from '@/utils/request';

const CancelFactory = Request.CancelToken;

export class FetchFactory {
    private readonly token: CancelToken;
    public cancel: Canceler;
    constructor() {
        const { token, cancel } = CancelFactory.source();
        this.token = token;
        this.cancel = cancel;
    }
    public post<T>(url: string, options?: RequestOptionsInit) {
        return request.post<T>(url, { ...options, cancelToken: this.token });
    }
    public get<T>(url: string, options?: RequestOptionsInit) {
        return request.get<T>(url, { ...options, cancelToken: this.token });
    }
    public put<T>(url: string, options?: RequestOptionsInit) {
        return request.put<T>(url, { ...options, cancelToken: this.token });
    }
}

function useFetch(clean = true, deps: any[] = []) {
    const fetchRef = useRef(new FetchFactory());

    useEffect(() => {
        return () => {
            clean && fetchRef.current.cancel('by destroy');
        };
    }, deps);

    return [fetchRef.current];
}

export default useFetch;
