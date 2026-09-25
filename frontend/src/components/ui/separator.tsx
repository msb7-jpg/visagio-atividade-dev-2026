"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Separator as SeparatorPrimitive } from "radix-ui"

const separatorVariants = cva(
  "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
  {
    variants: {
      variant: {
        default: "",
        cinema: "border-white/10 bg-white/10"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "default",
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      data-variant={variant}
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
