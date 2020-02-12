import history from '@@/history';
import { Modal } from 'antd';

// router change
history.listen(() => {
    Modal.destroyAll();
});

export const dva = {
    config: {
        onError(err: ErrorEvent) {
            err.preventDefault();
        },
    },
};
