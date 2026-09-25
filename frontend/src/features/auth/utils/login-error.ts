export function getLoginErrorMessage(err: unknown): string {
  const customDetail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
  if (customDetail) {
    return customDetail
  }
  return 'Não foi possível realizar o login. Verifique se o servidor backend está em execução.'
}
