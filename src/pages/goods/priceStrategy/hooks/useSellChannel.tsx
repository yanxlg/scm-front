import React from 'react';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';

export default function useSellChannel() {
    const sellChannelList = useSelector((state: ConnectState) => state?.permission?.filterList);

    return {
        sellChannelList,
    };
}
