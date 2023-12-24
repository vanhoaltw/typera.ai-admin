import Layout from '../../layout/layout';
import { getCurrentUser } from '../../configs/auth';
import { redirect } from 'next/navigation';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
    const user = await getCurrentUser();

    if (!user) {
        return redirect('/auth/login');
    }

    return <Layout>{children}</Layout>;
}
