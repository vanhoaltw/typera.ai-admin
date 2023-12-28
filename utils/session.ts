import { deleteCookie, getCookie, setCookie } from 'cookies-next';

export const tokenKey = `typera_token`;

export const setToken = async (token: string) => {
    setCookie(tokenKey, token, { path: '/', maxAge: 60 * 6 * 24 });
};

export const getToken = () => {
    try {
        return getCookie(tokenKey);
    } catch (error) {
        return null;
    }
};

export const deleteToken = () => {
    deleteCookie(tokenKey);
};
