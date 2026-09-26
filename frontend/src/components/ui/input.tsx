import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const inputVariants = cva(
  'h-9.5 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1.5 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        default: '',
        glass:
          'border-white/15 bg-black/50 text-foreground placeholder:text-muted-foreground/60 hover:border-white/30 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40',
        hero:
          'rounded-xl border-white/20 bg-black/60 text-base placeholder:text-muted-foreground/60 focus-visible:border-primary'
      },
      size: {
        default: '',
        lg: 'h-14 py-4 pr-24 pl-12',
        navbar: 'h-9 pr-20 pl-9',
        action: 'pr-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

function Input({
  className,
  type,
  variant = 'default',
  size = 'default',
  ...props
}: Omit<React.ComponentProps<'input'>, 'size'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-variant={variant}
      data-size={size}
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
