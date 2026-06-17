import { Form, Head } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Reset Password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
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
                                autoComplete="email"
                                value={email}
                                className="h-12 rounded-lg border-[#c3c6d1] bg-[#eef1f5] text-[#001e40] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2.5">
                            <Label
                                htmlFor="password"
                                className="font-semibold text-[#43474f] dark:text-slate-200"
                            >
                                Password Baru
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                autoFocus
                                placeholder="Minimal 8 karakter"
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
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                placeholder="Ulangi password baru"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 h-12 w-full rounded-lg bg-[#003366] text-base font-bold text-white shadow-md shadow-blue-950/15 transition hover:bg-[#001e40]"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Simpan Password Baru
                            <KeyRound className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset Password',
    description: 'Buat password baru untuk mengakses akun SIPASKA.',
};
