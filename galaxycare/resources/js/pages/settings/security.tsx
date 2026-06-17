import { Form, Head } from '@inertiajs/react';
import {
    CheckCircle2,
    KeyRound,
    ShieldCheck,
    ShieldOff,
    Smartphone,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Keamanan Akun" />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-bold text-teal-700 uppercase dark:text-teal-300">
                                Keamanan Akun
                            </p>
                            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">
                                Password dan 2FA
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Kelola akses akun SIPASKA langsung dari
                                dashboard. Pilih apakah ingin mengganti
                                password atau mengaktifkan autentikasi dua
                                faktor.
                            </p>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                            <CheckCircle2 className="size-4" />
                            Pengaturan aktif
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#003366] dark:bg-blue-950/50 dark:text-blue-200">
                                <KeyRound className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
                                    Ganti Password
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    Gunakan password yang panjang dan tidak
                                    dipakai di layanan lain.
                                </p>
                            </div>
                        </div>

                        <Form
                            {...SecurityController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="mt-6 grid gap-5"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2.5">
                                        <Label
                                            htmlFor="current_password"
                                            className="font-semibold text-slate-700 dark:text-slate-200"
                                        >
                                            Password Saat Ini
                                        </Label>

                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className="h-12 rounded-lg border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                            autoComplete="current-password"
                                            placeholder="Masukkan password saat ini"
                                        />

                                        <InputError
                                            message={errors.current_password}
                                        />
                                    </div>

                                    <div className="grid gap-2.5">
                                        <Label
                                            htmlFor="password"
                                            className="font-semibold text-slate-700 dark:text-slate-200"
                                        >
                                            Password Baru
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className="h-12 rounded-lg border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                            autoComplete="new-password"
                                            placeholder="Minimal 8 karakter"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2.5">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="font-semibold text-slate-700 dark:text-slate-200"
                                        >
                                            Konfirmasi Password Baru
                                        </Label>

                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="h-12 rounded-lg border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus-visible:ring-[#003366]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                            autoComplete="new-password"
                                            placeholder="Ulangi password baru"
                                        />

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            disabled={processing}
                                            data-test="update-password-button"
                                            className="h-11 rounded-lg bg-[#003366] px-5 font-bold text-white hover:bg-[#001e40]"
                                        >
                                            Simpan Password
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </section>

                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-200">
                                <Smartphone className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
                                    Autentikasi 2FA
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    Tambahkan kode dari aplikasi authenticator
                                    saat login.
                                </p>
                            </div>
                        </div>

                        {!canManageTwoFactor ? (
                            <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-5 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                Fitur 2FA belum aktif di konfigurasi aplikasi.
                            </div>
                        ) : twoFactorEnabled ? (
                            <div className="mt-6 flex flex-col gap-5">
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-200">
                                        <ShieldCheck className="size-4" />
                                        2FA aktif
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-emerald-700/80 dark:text-emerald-100/80">
                                        Akun akan meminta kode tambahan saat
                                        login.
                                    </p>
                                </div>

                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                            className="w-full rounded-lg"
                                        >
                                            <ShieldOff className="size-4" />
                                            Nonaktifkan 2FA
                                        </Button>
                                    )}
                                </Form>

                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </div>
                        ) : (
                            <div className="mt-6 flex flex-col gap-5">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                        Aktifkan 2FA jika ingin keamanan login
                                        lebih kuat. Setup dapat dilanjutkan
                                        langsung di modal tanpa keluar dari
                                        dashboard.
                                    </p>
                                </div>

                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        className="w-full rounded-lg bg-[#003366] font-bold text-white hover:bg-[#001e40]"
                                    >
                                        <ShieldCheck className="size-4" />
                                        Lanjutkan Setup
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full rounded-lg bg-[#003366] font-bold text-white hover:bg-[#001e40]"
                                            >
                                                <ShieldCheck className="size-4" />
                                                Aktifkan 2FA
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        )}

                        {canManageTwoFactor && (
                            <TwoFactorSetupModal
                                isOpen={showSetupModal}
                                onClose={() => setShowSetupModal(false)}
                                requiresConfirmation={requiresConfirmation}
                                twoFactorEnabled={twoFactorEnabled}
                                qrCodeSvg={qrCodeSvg}
                                manualSetupKey={manualSetupKey}
                                clearSetupData={clearSetupData}
                                fetchSetupData={fetchSetupData}
                                errors={errors}
                            />
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Keamanan',
            href: edit(),
        },
    ],
};
