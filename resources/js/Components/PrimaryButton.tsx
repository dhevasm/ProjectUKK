import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent  bg-[var(--app-color)] text-white hover:bg-[var(--app-hover-color)] px-4 py-2 text-xs font-semibold uppercase tracking-widest  transition duration-150 ease-in-out  focus:bg-[var(--app-color)] focus:outline-none focus:ring-2 focus:ring-[var(--app-color)] focus:ring-offset-2 active:bg-[var(--app-hover-color)] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
