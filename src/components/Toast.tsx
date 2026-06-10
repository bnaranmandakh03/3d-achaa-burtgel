'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{ fontFamily: 'var(--font-montserrat, Montserrat), sans-serif' }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#14211F] text-white text-sm font-medium px-5 py-3 rounded-lg shadow-lg max-w-sm w-[90vw] text-center"
    >
      {message}
    </div>
  );
}
