'use client'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const Tooltip = ({
  content,
  children,
  containerClassName
}: {
  content: string | React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [height, setHeight] = useState(0)
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [isVisible, content])

  const calculatePosition = (viewportX: number, viewportY: number) => {
    if (typeof window === 'undefined') {
      return { x: viewportX + 12, y: viewportY + 12 }
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Approximate width if not yet rendered or measured
    const tooltipWidth = contentRef.current?.offsetWidth || 260
    const tooltipHeight = contentRef.current?.offsetHeight || height || 60

    let finalX = viewportX + 12
    let finalY = viewportY + 12

    // Check if tooltip goes beyond right edge of viewport
    if (finalX + tooltipWidth > viewportWidth - 12) {
      finalX = viewportX - tooltipWidth - 12
    }

    // Check if tooltip goes beyond left edge of viewport
    if (finalX < 12) {
      finalX = 12
    }

    // Check if tooltip goes beyond bottom edge of viewport
    if (finalY + tooltipHeight > viewportHeight - 12) {
      finalY = viewportY - tooltipHeight - 12
    }

    // Check if tooltip goes beyond top edge of viewport
    if (finalY < 12) {
      finalY = 12
    }

    return { x: finalX, y: finalY }
  }

  const updateMousePosition = (clientX: number, clientY: number) => {
    setMouse({ x: clientX, y: clientY })
    const newPosition = calculatePosition(clientX, clientY)
    setPosition(newPosition)
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsVisible(true)
    updateMousePosition(e.clientX, e.clientY)
  }

  const handleMouseLeave = () => {
    setMouse({ x: 0, y: 0 })
    setPosition({ x: 0, y: 0 })
    setIsVisible(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVisible) return
    updateMousePosition(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    updateMousePosition(touch.clientX, touch.clientY)
    setIsVisible(true)
  }

  const handleTouchEnd = () => {
    // Delay hiding to allow for tap interaction
    setTimeout(() => {
      setIsVisible(false)
      setMouse({ x: 0, y: 0 })
      setPosition({ x: 0, y: 0 })
    }, 2000)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Toggle visibility on click for mobile devices
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches) {
      e.preventDefault()
      if (isVisible) {
        setIsVisible(false)
        setMouse({ x: 0, y: 0 })
        setPosition({ x: 0, y: 0 })
      } else {
        updateMousePosition(e.clientX, e.clientY)
        setIsVisible(true)
      }
    }
  }

  // Update position when tooltip becomes visible or content changes
  useEffect(() => {
    if (isVisible) {
      const newPosition = calculatePosition(mouse.x, mouse.y)
      setPosition(newPosition)
    }
  }, [isVisible, height, mouse.x, mouse.y])

  const renderTooltipContent = () => {
    if (typeof document === 'undefined') return null

    return createPortal(
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={String(isVisible)}
            initial={{ height: 0, opacity: 1 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
            className="pointer-events-none fixed z-[100] w-64 max-w-[260px] overflow-hidden rounded-md border border-white/10 bg-popover shadow-lg ring-1 ring-white/10"
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`
            }}
          >
            <div
              ref={contentRef}
              className="p-2 text-sm text-popover-foreground md:p-4"
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {children}
      {renderTooltipContent()}
    </div>
  )
}
