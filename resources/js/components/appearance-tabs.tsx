import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sparkles, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useAnimations } from '@/hooks/use-animations';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { enabled: animationsEnabled, toggle: toggleAnimations } =
        useAnimations();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Terang' },
        { value: 'dark', icon: Moon, label: 'Gelap' },
        { value: 'system', icon: Monitor, label: 'Sistem' },
    ];

    return (
        <div className={cn('flex flex-col gap-4', className)} {...props}>
            <div className="inline-flex w-fit gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                {tabs.map(({ value, icon: Icon, label }) => (
                    <button
                        key={value}
                        onClick={() => updateAppearance(value)}
                        className={cn(
                            'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                            appearance === value
                                ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                        )}
                    >
                        <Icon className="-ml-1 h-4 w-4" />
                        <span className="ml-1.5 text-sm">{label}</span>
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={toggleAnimations}
                className={cn(
                    'flex w-full max-w-xl items-center justify-between gap-4 rounded-lg border p-4 text-left transition-colors',
                    animationsEnabled
                        ? 'border-blue-200 bg-blue-50 text-blue-950 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950/60'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
                )}
            >
                <span className="flex min-w-0 items-start gap-3">
                    <span
                        className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-lg',
                            animationsEnabled
                                ? 'bg-white text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300',
                        )}
                    >
                        <Sparkles className="size-4" />
                    </span>
                    <span>
                        <span className="block text-sm font-extrabold">
                            Animasi interface
                        </span>
                        <span className="mt-1 block text-sm leading-6 opacity-75">
                            {animationsEnabled
                                ? 'Animasi aktif untuk transisi, menu, dan efek visual.'
                                : 'Animasi dimatikan untuk tampilan yang lebih tenang.'}
                        </span>
                    </span>
                </span>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {animationsEnabled ? 'Aktif' : 'Mati'}
                </span>
            </button>
        </div>
    );
}
