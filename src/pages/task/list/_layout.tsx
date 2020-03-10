import React from 'react';
import { LivePages } from '@/components/LivePages';
import Index from './index';
import TaskDetailPage from './$id';

// 实现LivePage
export default function(props: any) {
    return (
        <LivePages
            routers={[
                {
                    path: '/list',
                    extract: true,
                    component: Index,
                },
                {
                    path: '/list/:id',
                    extract: true,
                    component: TaskDetailPage,
                },
            ]}
            {...props}
        />
    );
}
