import { useInView } from '@/hooks/use-in-view';

type Props = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
};

export function AnimateIn({ children, className = '', delay = 0 }: Props) {
    const { ref, inView } = useInView(0.1);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${className} ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
