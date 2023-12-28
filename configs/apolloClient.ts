import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import { isEqual } from 'lodash';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import { deleteToken, getToken } from '../utils/session';
import { signOut } from 'next-auth/react';
import { API_GRAPHQL_URI } from './env';

let apolloClient: any;

const ssrMode = typeof window === 'undefined';
const logoutIfLogged = () => {
    signOut();
    deleteToken();
};

const createApolloClient = () => {
    const httpLink = new HttpLink({ uri: API_GRAPHQL_URI });

    const authLink = setContext((_, { headers }) => {
        const token = getToken();
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        };
    });

    const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                switch (err.extensions.code) {
                    case 'UNAUTHENTICATED':
                        if (getToken()) {
                            logoutIfLogged();
                            return;
                        } else {
                            return forward(operation);
                        }
                }
            }
        }
        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
        }
    });

    return new ApolloClient({
        ssrMode,
        link: ApolloLink.from([authLink, errorLink, httpLink]),
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
