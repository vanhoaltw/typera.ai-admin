'use client'

import { ReactNode } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';

const Provider = ({ children }: { children: ReactNode }) => {
    return (
        <PrimeReactProvider>
            <LayoutProvider>{children}</LayoutProvider>
        </PrimeReactProvider>
    );
};

export default Provider;
