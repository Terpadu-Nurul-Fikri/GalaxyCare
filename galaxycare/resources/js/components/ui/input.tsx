import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-gray-200 bg-white text-gray-900 file:text-gray-700 placeholder:text-gray-400 selection:bg-blue-600 selection:text-white flex h-10 w-full min-w-0 rounded-xl border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 md:text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500",
        "focus-visible:border-blue-400 focus-visible:ring-blue-100 focus-visible:ring-[3px] dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-900/40",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
