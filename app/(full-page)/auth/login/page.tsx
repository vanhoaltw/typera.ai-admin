/* eslint-disable @next/next/no-img-element */
'use client';

import { useContext, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../../components/form/FormInput';
import FormPassword from '../../../../components/form/FormPassword';

const schema = z.object({
    email: z.string().email().min(1, { message: 'Required' }),
    password: z.string().min(1, { message: 'Required' })
});

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const toast = useRef<Toast>(null);
    const [submitting, setSubmitting] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { password: '', email: '' }
    });

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async (values: any) => {
        setSubmitting(true);
        const res = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: `${window.location.origin}`
        });
        if (res?.error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Login failed',
                detail: res.error,
                life: 3000
            });
        }

        setSubmitting(false);
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" width={200} className="mb-5 flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <p className="text-900 text-3xl font-bold mb-3">Sign in to continue</p>
                        </div>

                        <form onSubmit={handleSubmit(handleLogin)} className="w-full md:w-30rem">
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <FormInput control={control} name="email" placeholder="Email address" style={{ padding: '1rem' }} />

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <FormPassword name="password" control={control} placeholder="Password" inputClassName="w-full md:w-30rem p-3" />

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberMe" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                            </div>
                            <Button loading={submitting} type="submit" label="Sign In" className="w-full p-3 text-xl" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
