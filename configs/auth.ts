import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { initializeApollo } from './apolloClient';
import { LOGIN } from '../graphql/mutation';
import { tokenKey } from '../utils/session';
import { cookies } from 'next/headers';

const secret = process.env.NEXTAUTH_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET;

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'my-project',
            credentials: {
                email: { label: 'email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                const payload = {
                    email: credentials?.email,
                    password: credentials?.password,
                    platform: 'web'
                };

                const res = await initializeApollo().mutate({
                    mutation: LOGIN,
                    variables: payload
                });

                const user = res.data.login;

                if (!user) {
                    throw new Error(user.message);
                } else {
                    cookies().set(tokenKey, user?.token, { path: '/', maxAge: 180 * 24 * 60 * 60 });
                    return user;
                }
            }
        })
        // ...add more providers here
    ],
    secret,
    pages: {
        signIn: '/auth/login'
    },
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (account && user) {
                return {
                    ...token,
                    ...user?.user,
                    accessToken: user?.token
                };
            }

            return token;
        },

        async session({ session, token }: any) {
            session.user.accessToken = token?.accessToken as string;
            session.user.image = token?.avatar;
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development'
};

const getCurrentUser = async () => {
    const session = await getServerSession(authOptions);
    return session?.user;
};

const getNextAuthServerSession = () => getServerSession(authOptions);

export { authOptions, getCurrentUser, getNextAuthServerSession };
