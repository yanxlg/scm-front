// wrap ()=>Promise to control it as single instance
function singlePromiseWrap<T, P>(promise: (params: P) => Promise<T>) {
    let syncPromise: Promise<T>;
    return (params: P) => {
        if (syncPromise) {
            return syncPromise;
        } else {
            syncPromise = promise(params);
        }
        return syncPromise;
    };
}

export { singlePromiseWrap };
