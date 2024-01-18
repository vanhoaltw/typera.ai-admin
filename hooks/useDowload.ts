import { API_URI } from '../configs/env';
import { getToken } from '../utils/session';
import { useState } from 'react';

export const useDowload = () => {
    const [loading, setLoading] = useState(false);

    const doRequest = async (researchId: number) => {
        setLoading(true);
        const token = getToken();
        if (token) {
            const anchor = document.createElement('a');
            anchor.setAttribute('href', API_URI + '/download/' + researchId);
            anchor.setAttribute('download', ' report.txt');
            anchor.click();
        }
        setLoading(false);
    };

    return { doRequest, loading };
};
