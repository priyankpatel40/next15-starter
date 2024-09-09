'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

interface EnterCodeProps {
  callback: (code: string) => void;
  reset: boolean;
  isLoading: boolean;
}

export const EnterCode: React.FC<EnterCodeProps> = ({ callback, reset, isLoading }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetCode = useCallback(() => {
    setCode(Array(6).fill(''));
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.join('').length === 6) {
      callback(code.join(''));
      resetCode();
    }
  }, [code, callback, resetCode]);

  useEffect(() => {
    resetCode();
  }, [reset, resetCode]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if ((e.key === 'Backspace' || e.key === 'Delete') && !code[index]) {
      e.preventDefault();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedCode = e.clipboardData.getData('text').slice(0, 6).toUpperCase();
    setCode(pastedCode.split('').concat(Array(6 - pastedCode.length).fill('')));
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 relative">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          className="
            w-10 h-12 sm:w-12 sm:h-14
            text-xl sm:text-2xl
            bg-gray-100 dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            border border-gray-300 dark:border-gray-700
            rounded-md
            flex items-center justify-center
            text-center
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            transition-colors duration-200
          "
          type="text"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={isLoading}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};
