import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { Metadata } from 'next';
import Provider from './provider';
import { getNextAuthServerSession } from '../configs/auth';

interface RootLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'typera.ai',
    description: 'Get the depth of qualitative interviews at the speed and scale of a survey. Make better, faster decisions for your business with the power of AI-moderated research. ',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'typera.ai',
        description: 'Get the depth of qualitative interviews at the speed and scale of a survey. Make better, faster decisions for your business with the power of AI-moderated research. ',
        images: ['/layout/images/logo-white.svg'],
        ttl: 604800
    },
    icons: {
        icon: '/layout/images/favicon.png'
    }
};

export default async function RootLayout({ children }: RootLayoutProps) {
    const session = await getNextAuthServerSession();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <Provider session={session}>{children}</Provider>
            </body>
        </html>
    );
}
