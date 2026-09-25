import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Command as CommandPrimitive } from 'cmdk'
import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { SearchIcon, CheckIcon } from 'lucide-react'

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground',
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          'top-[20%] translate-y-0 overflow-hidden rounded-2xl! p-0 sm:max-w-2xl border border-white/15 bg-black/95 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-3xl',
          className
        )}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-1">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-14 items-center border-b border-white/10 px-4"
    >
      <SearchIcon className="mr-3 size-5 shrink-0 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'flex h-12 w-full rounded-md bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'max-h-96 scrollbar-thin scrollbar-thumb-white/20 scroll-py-1 overflow-x-hidden overflow-y-auto p-2 outline-none',
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn('py-8 text-center text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

const commandSeparatorVariants = cva('-mx-1 h-px bg-border', {
  variants: {
    variant: {
      default: '',
      cinema: 'my-1 border-white/10 bg-white/10'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

function CommandSeparator({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator> &
  VariantProps<typeof commandSeparatorVariants>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      data-variant={variant}
      className={cn(commandSeparatorVariants({ variant }), className)}
      {...props}
    />
  )
}

const commandItemVariants = cva(
  "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
  {
    variants: {
      variant: {
        default: '',
        cinema:
          'gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-white/10 hover:text-white data-selected:bg-white/15 data-selected:text-white data-selected:shadow-xs data-selected:ring-1 data-selected:ring-white/10 data-selected:*:[svg]:text-primary',
        category:
          'group flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-white/3 px-3 py-2 text-xs font-medium text-white/80 transition-all hover:border-primary/40 hover:bg-white/10 hover:text-white data-selected:border-primary/50 data-selected:bg-white/15 data-selected:text-white data-selected:shadow-xs data-selected:*:[svg]:text-primary'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function CommandItem({
  className,
  children,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> &
  VariantProps<typeof commandItemVariants>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      data-variant={variant}
      className={cn(commandItemVariants({ variant }), className)}
      {...props}
    >
      {children}
      <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground',
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  commandSeparatorVariants,
  commandItemVariants
}
