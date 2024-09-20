'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
    if (reset) {
      resetCode();
    }
  }, [reset, resetCode]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.toUpperCase();
    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault(); // Prevent the default backspace behavior

      // If the current input is not empty, clear it
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        // If the current input is empty, move to the previous input and clear it
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedCode = e.clipboardData.getData('text').slice(0, 6).toUpperCase();
    setCode(pastedCode.split('').concat(Array(6 - pastedCode.length).fill('')));
  };

  const handleSubmit = () => {
    if (code.join('').length === 6) {
      callback(code.join(''));
    }
  };

  return (
    <div className="flex w-full flex-wrap gap-2 sm:gap-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className="
        flex
        h-12
        min-w-0 flex-1
        items-center justify-center
        rounded-md border
        border-gray-300 bg-gray-100
        text-center text-xl text-gray-900
        transition-colors
        duration-200 focus:outline-none focus:ring-2
        focus:ring-blue-500
        dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-400
        sm:h-14 sm:text-2xl
      "
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={isLoading}
          autoFocus={index === 0}
        />
      ))}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || code.join('').length < 6}
        isLoading={isLoading}
        className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
      >
        Submit Code
      </Button>
    </div>
  );
};
