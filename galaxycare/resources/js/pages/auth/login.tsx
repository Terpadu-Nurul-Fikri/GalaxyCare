import { Form, Head } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Masuk" />
            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-7"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5 sm:gap-6">
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="email"
                                    className="font-semibold text-[#43474f] dark:text-slate-200"
                                >
                                    Email Kampus
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nim@student.nurulfikri.ac.id"
                                    className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2.5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="font-semibold text-[#43474f] dark:text-slate-200"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm font-bold text-[#904d00] decoration-transparent hover:text-[#fd8b00] dark:text-orange-300 dark:hover:text-orange-200"
                                            tabIndex={5}
                                        >
                                            Lupa password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center gap-3 py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-medium text-[#43474f] dark:text-slate-300"
                                >
                                    Ingat saya
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-lg bg-[#003366] text-base font-bold text-white shadow-md shadow-blue-950/15 transition hover:bg-[#001e40]"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Masuk
                                <LogIn className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="rounded-lg bg-[#d9e3f7] p-3.5 text-center text-xs leading-5 font-medium text-[#003366] dark:bg-slate-800 dark:text-slate-200">
                            Gunakan email{' '}
                            <strong>@student.nurulfikri.ac.id</strong>
                        </p>
                        {canRegister && (
                            <p className="text-center text-sm text-[#43474f] dark:text-slate-300">
                                Belum punya akun?{' '}
                                <TextLink
                                    href={register()}
                                    className="font-bold text-[#001e40] decoration-transparent hover:text-[#904d00] dark:text-white dark:hover:text-orange-300"
                                    tabIndex={5}
                                >
                                    Daftar
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang',
    description: 'Silakan masuk menggunakan akun identitas resmi Anda.',
};
