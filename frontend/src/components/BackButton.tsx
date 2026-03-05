'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <button
      onClick={handleBack}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        bg-dark-800 hover:bg-dark-700 border border-dark-700
        text-dark-300 hover:text-white
        transition-all duration-200
        ${className}
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="font-medium">Voltar</span>
    </button>
  );
}
