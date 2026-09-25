'use client'
import { cn } from '@/lib/utils'
import type React from 'react'
import { motion, useAnimate } from 'framer-motion'

export interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
  loading?: boolean
}

export const StatefulButton = ({
  className,
  children,
  loading = false,
  ...props
}: StatefulButtonProps) => {
  const [scope, animate] = useAnimate()

  const animateLoading = async () => {
    await animate(
      '.loader',
      {
        width: '18px',
        scale: 1,
        display: 'block'
      },
      {
        duration: 0.2
      }
    )
  }

  const animateSuccess = async () => {
    await animate(
      '.loader',
      {
        width: '0px',
        scale: 0,
        display: 'none'
      },
      {
        duration: 0.2
      }
    )
    await animate(
      '.check',
      {
        width: '18px',
        scale: 1,
        display: 'block'
      },
      {
        duration: 0.2
      }
    )

    await animate(
      '.check',
      {
        width: '0px',
        scale: 0,
        display: 'none'
      },
      {
        delay: 1.5,
        duration: 0.2
      }
    )
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled) return
    await animateLoading()
    try {
      await props.onClick?.(event)
      await animateSuccess()
    } catch {
      await animate(
        '.loader',
        {
          width: '0px',
          scale: 0,
          display: 'none'
        },
        {
          duration: 0.2
        }
      )
    }
  }

  const {
    onClick: _onClick,
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    onAnimationStart: _onAnimationStart,
    onAnimationEnd: _onAnimationEnd,
    ...buttonProps
  } = props

  return (
    <motion.button
      layout
      layoutId="stateful-button"
      ref={scope}
      className={cn(
        'flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-colors select-none hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...buttonProps}
      onClick={handleClick}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader loading={loading} />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  )
}

const Loader = ({ loading }: { loading?: boolean }) => {
  return (
    <motion.svg
      animate={{
        rotate: [0, 360]
      }}
      initial={{
        scale: loading ? 0.8 : 0,
        width: loading ? 18 : 0,
        display: loading ? 'block' : 'none'
      }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: 'linear'
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('loader text-primary-foreground', loading ? 'block' : 'hidden')}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  )
}

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: 'none'
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check hidden text-primary-foreground"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  )
}
