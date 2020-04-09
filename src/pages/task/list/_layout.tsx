import React, { useMemo } from 'react';
import { LivePages } from 'react-components';
import Index from './index';
import TaskDetailPage from './[task_id]';

// 实现LivePage
export default function(props: any) {
    const pathname = props.location.pathname;
    return useMemo(() => {
        return (
            <LivePages
                routers={[
                    {
                        path: '/task/list',
                        extract: true,
                        component: Index,
                        live: true,
                    },
                    {
                        path: '/task/list/:task_id',
                        extract: true,
                        component: TaskDetailPage,
                    },
                ]}
                {...props}
            />
        );
    }, [pathname]);
}
