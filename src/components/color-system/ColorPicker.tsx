import { HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (!v.startsWith('#')) v = '#' + v;
    setInputValue(v);
    if (HEX_REGEX.test(v)) {
      onChange(v);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <HexColorPicker
        color={value}
        onChange={onChange}
        style={{ width: '100%', height: 160 }}
      />

      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded-[4px] border border-white/15 shrink-0"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          maxLength={7}
          className="flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[11px] font-mono text-text-primary placeholder:text-text-muted focus:border-border-active focus:outline-none"
          placeholder="#000000"
        />
      </div>

      <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-2">
        <svg className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2.5a1 1 0 110 2 1 1 0 010-2zM6.5 7h1.25v4.5h1.25V7H6.5z" />
        </svg>
        <span className="text-[10px] text-amber-300/80 leading-tight">
          Custom color requires proof approval before production
        </span>
      </div>
    </div>
  );
}
