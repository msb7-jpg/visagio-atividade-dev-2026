export function calculatePageNumbers(
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | string)[] {
  if (totalPages <= 1) return []

  const pages: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    const isEdge = i === 1 || i === totalPages
    const isNearby = i >= currentPage - delta && i <= currentPage + delta

    if (isEdge || isNearby) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }
  return pages
}
