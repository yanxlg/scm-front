export const dva = {
    config: {
        onError(err: ErrorEvent) {
            err.preventDefault();
            console.log('1111');
        },
    },
};
