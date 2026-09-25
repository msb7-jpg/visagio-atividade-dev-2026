import React from 'react'
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton'

interface SkeletonListProps {
  isGrid: boolean
}

const SKELETON_KEYS = [
  'sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6',
  'sk-7', 'sk-8', 'sk-9', 'sk-10', 'sk-11', 'sk-12'
]

export const SkeletonList: React.FC<SkeletonListProps> = ({ isGrid }) => (
  <div
    className={
      isGrid
        ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
        : 'flex flex-col gap-3'
    }
  >
    {SKELETON_KEYS.map((key) => (
      <LoadingSkeleton
        key={key}
        className={isGrid ? 'aspect-[2/3] w-full rounded-xl' : 'h-20 w-full rounded-xl'}
      />
    ))}
  </div>
)
