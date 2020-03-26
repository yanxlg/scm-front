const logger = require('dva-logger');

export const dva = {
    config: {
        onError(err: ErrorEvent) {
            err.preventDefault();
        },
    },
    plugins: [logger()],
};
