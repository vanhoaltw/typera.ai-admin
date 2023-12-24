import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'my-project',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'jsmith@example.com'
                },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                const payload = {
                    email: credentials?.email,
                    password: credentials?.password
                };

                const res = await fetch('https://cloudcoders.azurewebsites.net/api/tokens', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const user = await res.json();
                if (!res.ok) {
                    throw new Error(user.message);
                }
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
                }

                // Return null if user data could not be retrieved
                return null;
            }
        })
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/auth/login'
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: user?.token
                    // refreshToken: user.refreshToken
                };
            }

            return token;
        },

        async session({ session, token }) {
            session.user.accessToken = token?.accessToken as string;

            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development'
};

const getCurrentUser = async () => {
    const session = await getServerSession(authOptions);
    return session?.user;
};

export { authOptions, getCurrentUser };
