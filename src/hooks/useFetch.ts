import { useEffect, useRef } from 'react';
import Request, { CancelToken, Canceler, RequestOptionsInit } from 'umi-request';
import request from '@/utils/request';

const CancelToken = Request.CancelToken;

class FetchFactory {
    private readonly token: CancelToken;
    public cancel: Canceler;
    constructor() {
        const { token, cancel } = CancelToken.source();
        this.token = token;
        this.cancel = cancel;
    }
    public post(url: string, options?: RequestOptionsInit) {
        return request.post(url, { ...options, cancelToken: this.token });
    }
    public get(url: string, options?: RequestOptionsInit) {
        return request.get(url, { ...options, cancelToken: this.token });
    }
    public put(url: string, options?: RequestOptionsInit) {
        return request.put(url, { ...options, cancelToken: this.token });
    }
}

function useFetch(clean = true) {
    const fetchRef = useRef(new FetchFactory());

    useEffect(() => {
        return () => {
            clean && fetchRef.current.cancel('by destroy');
        };
    }, []);

    return [fetchRef.current];
}

export default useFetch;
