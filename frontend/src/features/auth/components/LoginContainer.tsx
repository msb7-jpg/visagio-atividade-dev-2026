import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { loginSchema } from '@/features/auth/schemas/auth.schema'
import { getLoginErrorMessage } from '@/features/auth/utils/login-error'
import { useState, type SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginCardView } from './LoginCardView'
import { SyncVisualShowcase } from './subcomponents/SyncVisualShowcase'

export function LoginContainer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleFillDemoAdmin = () => {
    setEmail('admin@rocketfilms.com')
    setPassword('admin123')
    setEmailError(undefined)
    setPasswordError(undefined)
    setServerError(null)
  }

  const resetErrors = () => {
    setEmailError(undefined)
    setPasswordError(undefined)
    setServerError(null)
  }

  const validateForm = () => {
    resetErrors()
    const validation = loginSchema.safeParse({ email, senha: password })
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      setEmailError(fieldErrors.email?.[0])
      setPasswordError(fieldErrors.senha?.[0])
      return null
    }
    return validation.data
  }

  const executeLogin = async (data: { email: string; senha: string }) => {
    setIsSubmitting(true)
    try {
      await login(data)
      setIsSubmitting(false)
      navigate(fromLocation, { replace: true })
    } catch (err: unknown) {
      setIsSubmitting(false)
      setServerError(getLoginErrorMessage(err))
    }
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const validData = validateForm()
    if (!validData) return
    await executeLogin(validData)
  }

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="#0c0d12"
      gradientBackgroundEnd="#151722"
      firstColor="245, 158, 11"
      secondColor="168, 85, 247"
      thirdColor="59, 130, 246"
      fourthColor="234, 88, 12"
      fifthColor="126, 34, 206"
      size="70%"
      blendingValue="screen"
    >
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex w-full flex-1 items-center justify-center">
            <LoginCardView
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              password={password}
              setPassword={setPassword}
              passwordError={passwordError}
              serverError={serverError}
              isLoading={isSubmitting}
              onSubmit={handleSubmit}
              onFillDemoAdmin={handleFillDemoAdmin}
            />
          </div>

          <div className="hidden w-full flex-1 items-center justify-center md:flex">
            <SyncVisualShowcase />
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  )
}
