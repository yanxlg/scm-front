import React from 'react';
import BasicLayout from './BasicLayout';

export default function(props:any) {
    if (props.location.pathname === '/login') {
        return props.children;
    }
    return (
        <BasicLayout {...props}/>
    )
}
