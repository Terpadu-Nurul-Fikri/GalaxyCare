import { Form, Head } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-7"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5 sm:gap-6">
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="name"
                                    className="font-semibold text-[#43474f] dark:text-slate-200"
                                >
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap"
                                    className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                />
                                <InputError message={errors.name} />
                            </div>
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
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="nim@student.nurulfikri.ac.id"
                                    className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                />
                                <p className="text-xs leading-5 font-medium text-[#737780] dark:text-slate-400">
                                    Hanya email{' '}
                                    <strong>@student.nurulfikri.ac.id</strong>
                                </p>
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="password"
                                    className="font-semibold text-[#43474f] dark:text-slate-200"
                                >
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="font-semibold text-[#43474f] dark:text-slate-200"
                                >
                                    Konfirmasi Password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi password"
                                    className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-lg bg-[#003366] text-base font-bold text-white shadow-md shadow-blue-950/15 transition hover:bg-[#001e40]"
                                tabIndex={5}
                            >
                                {processing && <Spinner />}
                                Daftar
                                <UserPlus className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-center text-sm text-[#43474f] dark:text-slate-300">
                            Sudah punya akun?{' '}
                            <TextLink
                                href={login()}
                                className="font-bold text-[#001e40] decoration-transparent hover:text-[#904d00] dark:text-white dark:hover:text-orange-300"
                                tabIndex={6}
                            >
                                Masuk
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Daftar Akun SIPASKA',
    description: 'Gunakan email kampus resmi untuk membuat akun.',
};
