import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../configs/auth';
import AppConfig from '../../layout/AppConfig';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export default async function SimpleLayout({ children }: SimpleLayoutProps) {
    const currentUser = await getCurrentUser();

    if (currentUser) {
        return redirect('/');
    }

    return (
        <React.Fragment>
            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
