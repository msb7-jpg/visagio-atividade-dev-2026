'use client'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, useMemo } from 'react'

export interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string
  gradientBackgroundEnd?: string
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  fourthColor?: string
  fifthColor?: string
  pointerColor?: string
  size?: string
  blendingValue?: string
  children?: React.ReactNode
  className?: string
  interactive?: boolean
  containerClassName?: string
}

function useInteractivePointer(interactive: boolean) {
  const interactiveRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ curX: 0, curY: 0, tgX: 0, tgY: 0 })

  useEffect(() => {
    if (!interactive || !interactiveRef.current) return

    const { curX, curY, tgX, tgY } = coords
    const nextCurX = curX + (tgX - curX) / 20
    const nextCurY = curY + (tgY - curY) / 20

    interactiveRef.current.style.transform = `translate(${Math.round(nextCurX)}px, ${Math.round(nextCurY)}px)`
  }, [coords, interactive])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveRef.current) return
    const rect = interactiveRef.current.getBoundingClientRect()
    setCoords((prev) => ({
      ...prev,
      tgX: event.clientX - rect.left,
      tgY: event.clientY - rect.top
    }))
  }

  return { interactiveRef, handleMouseMove }
}

function useGradientCssVariables(props: BackgroundGradientAnimationProps) {
  const {
    gradientBackgroundStart = '#0c0d12',
    gradientBackgroundEnd = '#14161f',
    firstColor = '245, 158, 11',
    secondColor = '168, 85, 247',
    thirdColor = '56, 189, 248',
    fourthColor = '249, 115, 22',
    fifthColor = '147, 51, 234',
    pointerColor = '245, 158, 11',
    size = '65%',
    blendingValue = 'screen'
  } = props

  useEffect(() => {
    const s = document.body.style
    s.setProperty('--gradient-background-start', gradientBackgroundStart)
    s.setProperty('--gradient-background-end', gradientBackgroundEnd)
    s.setProperty('--first-color', firstColor)
    s.setProperty('--second-color', secondColor)
    s.setProperty('--third-color', thirdColor)
    s.setProperty('--fourth-color', fourthColor)
    s.setProperty('--fifth-color', fifthColor)
    s.setProperty('--pointer-color', pointerColor)
    s.setProperty('--size', size)
    s.setProperty('--blending-value', blendingValue)
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue
  ])
}

function GooeyFilterDefs() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="blurMe">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  )
}

export function BackgroundGradientAnimation(props: BackgroundGradientAnimationProps) {
  const { children, className, interactive = true, containerClassName } = props

  useGradientCssVariables(props)
  const { interactiveRef, handleMouseMove } = useInteractivePointer(interactive)

  const isSafari = useMemo(() => {
    return typeof navigator !== 'undefined'
      ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      : false
  }, [])

  return (
    <div
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]',
        containerClassName
      )}
    >
      <GooeyFilterDefs />
      <div className={cn('relative z-10 min-h-screen w-full', className)}>{children}</div>
      <div
        className={cn(
          'gradients-container pointer-events-none absolute inset-0 h-full w-full opacity-35 blur-2xl',
          isSafari ? 'blur-2xl' : '[filter:url(#blurMe)_blur(45px)]'
        )}
      >
        <div
          className={cn(
            'absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.7)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]',
            'top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]',
            '[transform-origin:center_center]',
            'animate-first'
          )}
        />
        <div
          className={cn(
            'absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.6)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]',
            'top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]',
            '[transform-origin:calc(50%-400px)]',
            'animate-second'
          )}
        />
        <div
          className={cn(
            'absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.5)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]',
            'top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]',
            '[transform-origin:calc(50%+400px)]',
            'animate-third'
          )}
        />
        <div
          className={cn(
            'absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.6)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]',
            'top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]',
            '[transform-origin:calc(50%-200px)]',
            'animate-fourth'
          )}
        />
        <div
          className={cn(
            'absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.5)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]',
            'top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]',
            '[transform-origin:calc(50%-800px)_calc(50%+800px)]',
            'animate-fifth'
          )}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              'absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.5)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]',
              '-top-1/2 -left-1/2 h-full w-full [mix-blend-mode:var(--blending-value)]'
            )}
          />
        )}
      </div>
    </div>
  )
}
