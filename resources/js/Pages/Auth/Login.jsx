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
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <Head title="Log in" />
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
                {/* Left Section (Hero) */}
                <div className="flex flex-col items-start justify-center px-12 text-white">
                    <h1 className="text-6xl font-extrabold leading-tight">
                        Welcome to <span className="text-yellow-300">SIMAK</span>
                    </h1>
                    <p className="mt-6 text-2xl font-light">
                        Sistem Informasi Manajemen Aset Kantor <br></br>PT PLN INDONESIA POWER UBP SURALAYA.
                    </p>
                </div>

                {/* Right Section (Login Card) */}
                <div className="flex items-center justify-center bg-white p-8">
                    <div className="w-full max-w-lg space-y-8 bg-white p-12 rounded-xl shadow-2xl">
                        <div>
                            <h2 className="text-center text-4xl font-extrabold text-gray-900">
                                Welcome Back
                            </h2>
                            <p className="mt-4 text-center text-lg text-gray-600">
                                Or{' '}
                                <Link
                                    href={route('register')}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    create a new account
                                </Link>
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 text-base font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form className="mt-8 space-y-6" onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4 flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-lg text-gray-600">Remember me</span>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                                <PrimaryButton
                                    className="ml-4 w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-lg font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none"
                                    disabled={processing}
                                >
                                    Log in
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
