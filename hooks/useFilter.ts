import { isEmpty, omit, pick, pickBy, throttle } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useMemo } from 'react';

export const useFilter = (keys: string[]) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const querySearch = useMemo(() => Object.fromEntries(keys.map((k) => [k, searchParams.get(k)])), [searchParams, keys]);

    const handleSearch = (value: { [x: string]: string | number }) => {
        const _query = qs.stringifyUrl({
            url: pathname,
            query: pickBy({ ...querySearch, ...pick(value, keys) }, (v) => !isEmpty(v))
        });
        router.push(_query);
    };

    const handleReset = (param: any) => {
        const _query = qs.stringifyUrl({
            url: pathname,
            query: omit(querySearch, param)
        });
        router.push(_query);
    };

    const handleChangeDebounce = throttle(
        (values) => {
            handleSearch(values);
        },
        250,
        { leading: false, trailing: true }
    );

    return {
        onSearch: handleChangeDebounce,
        onReset: handleReset,
        query: querySearch
    };
};
