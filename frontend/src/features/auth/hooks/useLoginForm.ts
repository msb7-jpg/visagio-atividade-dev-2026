import { useAuth } from '@/features/auth/hooks/useAuth'
import { loginSchema } from '@/features/auth/schemas/auth.schema'
import { extractFirstErrorMessage } from '@/features/auth/utils/form-error'
import { getLoginErrorMessage } from '@/features/auth/utils/login-error'
import { navigateApp } from '@/lib/navigation'
import { useForm, useSelector } from '@tanstack/react-form'
import { useState, type SubmitEvent } from 'react'

interface UseLoginFormOptions {
  fromLocation: string
}

export function useLoginForm({ fromLocation }: UseLoginFormOptions) {
  const { login, isLoading: isAuthLoading } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      senha: ''
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: async ({ value: credentials }) => {
      setServerError(null)

      await login(credentials, {
        onSuccess: () => navigateApp(fromLocation, { replace: true }),
        onError: (err) => setServerError(getLoginErrorMessage(err))
      })
    }
  })

  const formValues = useSelector(form.store, (s) => s.values)
  const formErrors = useSelector(form.store, (s) => s.errorMap)
  const isFormSubmitting = useSelector(form.store, (s) => s.isSubmitting)

  const emailError = extractFirstErrorMessage(formErrors.onSubmit?.email)
  const passwordError = extractFirstErrorMessage(formErrors.onSubmit?.senha)

  const handleFillDemoAdmin = () => {
    form.setFieldValue('email', 'admin@rocketfilms.com')
    form.setFieldValue('senha', 'admin123')
    setServerError(null)
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await form.handleSubmit()
  }

  return {
    email: formValues.email,
    setEmail: (val: string) => form.setFieldValue('email', val),
    emailError,
    password: formValues.senha,
    setPassword: (val: string) => form.setFieldValue('senha', val),
    passwordError,
    serverError,
    isLoading: isAuthLoading || isFormSubmitting,
    onSubmit: handleSubmit,
    onFillDemoAdmin: handleFillDemoAdmin
  }
}
