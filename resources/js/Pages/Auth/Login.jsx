import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute -left-10 top-0 h-96 w-96 rounded-full bg-blue-400 filter blur-3xl"></div>
                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-300 filter blur-3xl"></div>
            </div>

            <Head title="Log in" />
            <Head>
                <link rel="icon" type="image/jpeg" href="/images/Indonesia_Power_Logo.png" />
            </Head>
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 relative z-10">
                {/* Left Section (Hero) */}
                <div className="hidden md:flex flex-col items-start justify-center px-12 text-white">
                    <div className="mb-8">
                        {/* You can add your logo here */}
                        <img 
                            src="/images/Indonesia_Power_Logo.jpg" 
                            alt="PLN Logo" 
                            className="h-16 w-auto"
                        />
                    </div>
                    <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
                        Welcome to <br/>
                        <span className="text-yellow-300 mt-2 block">SIMA</span>
                    </h1>
                    <p className="mt-6 text-2xl font-light leading-relaxed opacity-90">
                        Sistem Informasi Manajemen Aset 
                        <span className="block mt-2 text-yellow-200">
                            PT PLN INDONESIA POWER UBP SURALAYA
                        </span>
                    </p>
                </div>

                {/* Right Section (Login Card) */}
                <div className="flex items-center justify-center p-8">
                    <div className="w-full max-w-lg space-y-8 bg-white/95 backdrop-blur-lg p-12 rounded-2xl shadow-2xl">
                        <div className="text-center">
                            {/* Mobile Logo - Only shows on mobile */}
                            <div className="md:hidden mb-6">
                                <img 
                                    src="/path/to/your/logo.png" 
                                    alt="PLN Logo" 
                                    className="h-12 w-auto mx-auto"
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Login to Your Account
                            </h2>
                            <p className="mt-3 text-gray-600">
                                Please sign in to continue
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-4 bg-green-50 rounded-lg">
                                <p className="text-base font-medium text-green-600">
                                    {status}
                                </p>
                            </div>
                        )}

                        <form className="mt-8 space-y-6" onSubmit={submit}>
                            <div className="space-y-5">
                                <div>
                                    <InputLabel 
                                        htmlFor="email" 
                                        value="Email" 
                                        className="text-gray-700 text-base"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel 
                                        htmlFor="password" 
                                        value="Password" 
                                        className="text-gray-700 text-base"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </div>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <PrimaryButton
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            {new Date().getFullYear()} © PT PLN INDONESIA POWER UBP SURALAYA
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}