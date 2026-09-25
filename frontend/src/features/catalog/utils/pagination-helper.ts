export function calculatePageNumbers(
  currentPage: number,
  totalPages: number,
  blockSize: number = 5
): (number | string)[] {
  if (totalPages <= 1) return []
  if (totalPages <= blockSize + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Calcula o bloco estável (ex: páginas 1-5, 6-10, 11-15...)
  const blockIndex = Math.floor((currentPage - 1) / blockSize)
  const start = blockIndex * blockSize + 1
  const end = Math.min(start + blockSize - 1, totalPages)

  const pages: (number | string)[] = []

  // Se o bloco não começa na página 1, mostra a página 1 e ellipsis
  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }

  // Páginas do bloco estável atual
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Se o bloco não termina na última página, mostra ellipsis e a última página
  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push('...')
    }
    pages.push(totalPages)
  }

  return pages
}
