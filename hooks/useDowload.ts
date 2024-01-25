import axios from 'axios';
import { API_URI } from '../configs/env';
import { getToken } from '../utils/session';
import { useState } from 'react';

export const useDowload = () => {
    const [loading, setLoading] = useState(false);

    const doRequest = async (researchId: number) => {
        setLoading(true);
        const token = getToken();
        if (token) {
            const data = await axios.get(API_URI + '/download/' + researchId, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data?.data) {
                const blob = new Blob([data.data], { type: 'octet/stream' });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.setAttribute('href', url);
                anchor.setAttribute('download', 'typera_report.txt');
                anchor.click();
            }
        }
        setLoading(false);
    };

    return { doRequest, loading };
};
