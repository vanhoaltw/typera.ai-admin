import { useCallback, useState } from 'react';
import { getToken } from '../utils/session';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URI } from '../configs/env';

const uploadService = (file: File) => {
    const form = new FormData();
    form.append('upload', file);
    const token = getToken();
    if (!token) return;
    return axios.request({
        method: 'post',
        url: API_URI + '/upload',
        data: form,
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'x-apollo-operation-name' }
    });
};

export const useUpload = () => {
    const [state, setState] = useState({
        loading: false,
        image: '',
        imageUrls: [],
        error: null
    });

    const beforeUpload = (file: File) => {
        return true;
    };

    const onChange = useCallback((file: File) => {
        if (!file) return;
        setState((pre) => ({ ...pre, loading: true }));
        return new Promise((resolve) => {
            if (beforeUpload(file)) {
                uploadService(file)
                    ?.then((response: any) => {
                        const imageUrl = response?.data?.url;
                        setState((pre) => ({ ...pre, image: imageUrl, loading: false }));
                        resolve?.(imageUrl);
                    })
                    .catch((err) => {
                        toast.error(err?.message);
                        setState((pre) => ({ ...pre, loading: false }));
                    });
            } else {
                setState((pre) => ({ ...pre, loading: false }));
                resolve({ success: false });
            }
        });
    }, []);

    return { loading: state.loading, value: state.image, onChange };
};
