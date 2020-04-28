import React, { useState } from 'react';

export default function() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);

    return {
        page,
        setPage,
        pageSize,
        setPageSize,
        total,
        setTotal,
    };
}
