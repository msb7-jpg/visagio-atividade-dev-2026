export function shouldShowStatus(
  isLoading: boolean,
  isError: boolean,
  moviesCount: number
): boolean {
  if (isError) return true
  if (isLoading && moviesCount === 0) return true
  if (!isLoading && moviesCount === 0) return true
  return false
}
