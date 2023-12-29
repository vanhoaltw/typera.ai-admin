'use client';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../configs/apolloClient';
import { Session } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import { ConfirmPopup } from 'primereact/confirmpopup';

const Provider = ({ children, session }: { children: ReactNode; session: Session | null }) => {
    const apolloClient = useApollo();

    return (
        <NextAuthProvider session={session}>
            <ApolloProvider client={apolloClient}>
                <PrimeReactProvider>
                    <Toaster />
                    <ConfirmPopup />
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </ApolloProvider>
        </NextAuthProvider>
    );
};

export default Provider;
