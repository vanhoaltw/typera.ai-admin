import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { isEqual } from 'lodash';
import merge from 'lodash/merge';
import { setContext } from '@apollo/client/link/context';
import { getCurrentUser } from './auth';
import { useMemo } from 'react';

let apolloClient: any;
const ssrMode = typeof window === 'undefined';
const getToken = async () => getCurrentUser().then((res) => res?.accessToken);
const uri = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

const createApolloClient = () => {
    const httpLink = new HttpLink({ uri });

    const authLink = setContext(async (_, { headers }) => {
        const token = await getToken();
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        };
    });

    return new ApolloClient({
        ssrMode,
        link: from([authLink, httpLink]),
        connectToDevTools: process.env.NODE_ENV !== 'production',
        ssrForceFetchDelay: 100,
        cache: new InMemoryCache({
            typePolicies: {
                Query: {}
            }
        })
    });
};

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract();

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray: any, sourceArray: any) => [...sourceArray, ...destinationArray.filter((d: any) => sourceArray.every((s: any) => !isEqual(d, s)))]
        });

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data);
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState?: any) {
    const cache = useMemo(() => initializeApollo(initialState), [initialState]);
    return cache;
}
