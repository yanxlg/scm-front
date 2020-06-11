import React, { useState, useCallback } from 'react';

export default function useUpdateRecord() {
    const [updateRecordStatus, setUpdateRecordStatus] = useState(false);
    const [recordId, setRecordId] = useState('');

    const showUpdateRecordModal = useCallback(id => {
        setRecordId(id);
        setUpdateRecordStatus(true);
    }, []);

    const hideUpdateRecordModal = useCallback(() => {
        setRecordId('');
        setUpdateRecordStatus(false);
    }, []);

    return {
        updateRecordStatus,
        recordId,
        showUpdateRecordModal,
        hideUpdateRecordModal,
        setRecordId,
    };
}
