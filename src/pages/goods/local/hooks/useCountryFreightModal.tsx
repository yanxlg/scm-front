import React, { useCallback, useState } from 'react';

export default function useCountryFreightModal() {
    const [countryFreightStatus, setCountryFreightStatus] = useState(false);
    const [countryFreightId, setCountryFreightId] = useState('');

    const showCountryFreight = useCallback(productId => {
        setCountryFreightStatus(true);
        setCountryFreightId(productId);
    }, []);

    const hideCountryFreight = useCallback(() => {
        setCountryFreightStatus(false);
        setCountryFreightId('');
    }, []);

    return {
        countryFreightStatus,
        countryFreightId,
        showCountryFreight,
        hideCountryFreight,
    };
}
