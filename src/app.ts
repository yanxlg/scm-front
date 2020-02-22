import history from '@@/history';
import { Modal } from 'antd';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

let timer:number|undefined = undefined;

// router change
history.listen(() => {
    Modal.destroyAll();
    if(timer){
        clearTimeout(timer);
        timer = undefined;
        NProgress.remove();
    }
    NProgress.start();
    NProgress.inc();
    timer=window.setTimeout(()=>{
        NProgress.done();
        timer = undefined;
    },200+Math.floor(Math.random()*300));
});

export const dva = {
    config: {
        onError(err: ErrorEvent) {
            err.preventDefault();
        },
    },
};
