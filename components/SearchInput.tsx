import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  containerClassName?: string;
}

export function SearchInput({ 
  className = "", 
  containerClassName = "",
  ...props 
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        <Search
          className="h-4.5 w-4.5 text-[var(--hub-text-muted)] opacity-60"
        />
      </div>

      <input
        {...props}
        className={`
          w-full
          pl-12
          pr-4
          h-11
          rounded-xl
          border
          border-[var(--hub-border)]
          bg-[var(--hub-surface)]
          text-[var(--hub-text)]
          placeholder:text-[var(--hub-text-subtle)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--hub-primary)]/20
          focus:border-[var(--hub-primary)]/50
          transition-all
          duration-300
          text-sm
          shadow-sm
          ${className}
        `}
      />
    </div>
  );
}
