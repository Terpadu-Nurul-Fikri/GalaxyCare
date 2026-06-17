import { Form, Head } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Password" />

            {status && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3.5 text-center text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                    {status}
                </div>
            )}

            <div className="space-y-7">
                <Form {...email.form()} className="flex flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
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
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="nim@student.nurulfikri.ac.id"
                                    className="h-12 rounded-lg border-[#c3c6d1] bg-[#f3f4f5] text-[#001e40] placeholder:text-[#737780] focus-visible:border-[#003366] focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <Button
                                className="h-12 w-full rounded-lg bg-[#003366] text-base font-bold text-white shadow-md shadow-blue-950/15 transition hover:bg-[#001e40]"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && <Spinner />}
                                Kirim Link Reset
                                <MailCheck className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </Form>

                <div className="rounded-lg bg-[#d9e3f7] p-3.5 text-center text-xs leading-5 font-medium text-[#003366] dark:bg-slate-800 dark:text-slate-200">
                    Masukkan email kampus yang terdaftar. Link reset akan
                    dikirim jika akun ditemukan.
                </div>

                <div className="space-x-1 text-center text-sm text-[#43474f] dark:text-slate-300">
                    <span>Ingat password?</span>
                    <TextLink
                        href={login()}
                        className="font-bold text-[#001e40] decoration-transparent hover:text-[#904d00] dark:text-white dark:hover:text-orange-300"
                    >
                        Masuk
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa Password',
    description: 'Masukkan email kampus untuk menerima link reset password.',
};
